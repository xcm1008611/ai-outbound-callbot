package com.qidiangk.smart.aster.tripartite.whisper;

import cn.hutool.core.bean.copier.CopyOptions;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.text.UnicodeUtil;
import cn.hutool.core.thread.ThreadUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.StrUtil;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.qidiangk.smart.aster.tripartite.property.OpenAIAsrOption;
import com.qidiangk.smart.aster.tripartite.property.OpenAiProperty;
import lombok.extern.slf4j.Slf4j;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;
import top.jpower.core.asterisk.audio.AsrClient;
import top.jpower.core.asterisk.audio.AsrResult;
import top.jpower.core.asterisk.utils.ByteToAudioByte;
import top.jpower.core.util.utils.BeanUtil;
import top.jpower.core.util.utils.Fc;
import top.jpower.core.util.utils.SpringUtil;
import top.jpower.core.util.utils.StringUtil;

import java.io.IOException;
import java.io.PipedInputStream;
import java.net.URI;
import java.util.Arrays;
import java.util.TreeMap;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Consumer;
import java.util.function.Function;

/**
 * Whisper 实时 ASR 识别客户端
 * <br/>
 * 基于 WhisperLive 自部署服务，通过 WebSocket 实现实时流式语音识别。
 * 实现方式与 AliAsrClient / DashScopeFunAsrClient 保持一致：流式音频输入、异步结果回调、
 * Session 隔离、Semaphore 串行锁。
 * <br/>
 * 音频格式要求：PCM 16bit 单声道，采样率通过配置指定（默认 8000Hz）。
 * <br/>
 * <a href="https://github.com/collabora/WhisperLive">WhisperLive 项目</a>
 *
 * @author mr.g
 */
@Slf4j
public class OpenAIAsrClient implements AsrClient {

    // ─────────────────────────── 状态枚举 ───────────────────────────

    private enum Status {
        /** 未开始 */
        NOT_RUN,
        /** 已建立连接，等待语音输入 */
        STARTING,
        /** 正在识别（已检测到语音） */
        RUN,
        /** 识别完成 */
        COMPLETE,
        /** 发生错误 */
        ERROR
    }

    // ─────────────────────────── 实例字段 ───────────────────────────

    /** 合并后的配置（配置文件 + 页面覆盖） */
    private final OpenAiProperty property;

    /** 串行处理锁：同一实例同时只允许一个识别请求 */
    private final Semaphore semaphore = new Semaphore(1, true);

    /** 当前正在处理的识别会话，用于 {@link #close()} 时强制中断 */
    private volatile Session currentSession;

    /** WebSocket 客户端实例 */
    private volatile WhisperWebSocket wsClient;

    /** 用户主动关闭标志 */
    private volatile boolean userClosed = false;

    // ─────────────────────────── 单次识别会话上下文 ───────────────────────────

    /**
     * 一次识别请求对应的独立状态容器。
     * 所有与本次识别相关的可变状态都封装在 Session 中，
     * process() 结束后随 Session 一起丢弃，避免跨请求污染。
     */
    private static final class Session {
        /** 等待识别完成 / 出错的锁 */
        final CountDownLatch completionLatch = new CountDownLatch(1);
        /** 当前识别状态 */
        final AtomicReference<Status> statusReference = new AtomicReference<>(Status.NOT_RUN);
        /** 上一次有效数据时间戳 */
        final AtomicReference<Long> lastTimeReference = new AtomicReference<>(System.currentTimeMillis());
        /** 识别结果缓冲区（按时间戳排序） */
        final TreeMap<Double, String> resultMap = new TreeMap<>();
        /** 错误信息 */
        final AtomicReference<String> errorMessageRef = new AtomicReference<>();
    }

    // ─────────────────────────── 构造器 ───────────────────────────

    /**
     * 合并配置：将 Spring Bean（配置文件值）与页面传入的 asrOption（动态覆盖值）合并。
     * asrOption 中非 null 的字段会覆盖配置文件的对应字段。
     */
    private static OpenAiProperty merged(OpenAIAsrOption asrOption) {
        if (asrOption == null) {
            return SpringUtil.getBean(OpenAiProperty.class);
        }

        // 复制 Bean 到新对象，避免污染全局配置
        OpenAiProperty target = BeanUtil.copyProperties(
                SpringUtil.getBean(OpenAiProperty.class), OpenAiProperty.class);
        // 深拷贝嵌套 asrOption，切断与全局 Bean 的引用
        target.setAsrOption(BeanUtil.copyProperties(
                SpringUtil.getBean(OpenAiProperty.class).getAsrOption(), OpenAiProperty.AsrOption.class));

        // 顶层字段覆盖（serverUrl），忽略 null 及空字符串
        BeanUtil.copyProperties(asrOption, target, CopyOptions.create()
                .ignoreNullValue()
                .setPropertiesFilter((field, value) -> !(value instanceof String) || StringUtil.isNotBlank((String) value)));
        // 嵌套 asrOption 字段覆盖（language、task 等），忽略 null 及空字符串
        BeanUtil.copyProperties(asrOption, target.getAsrOption(), CopyOptions.create()
                .ignoreNullValue()
                .setPropertiesFilter((field, value) -> !(value instanceof String) || StringUtil.isNotBlank((String) value)));
        return target;
    }

    /**
     * 无参构造：使用配置文件默认值
     */
    public OpenAIAsrClient() {
        this(null);
    }

    /**
     * 带页面动态配置的构造器（asrOption 中非 null 的值会覆盖配置文件）
     */
    public OpenAIAsrClient(OpenAIAsrOption asrOption) {
        this.property = merged(asrOption);
    }

    // ─────────────────────────── 核心方法 ───────────────────────────

    /**
     * 处理一次语音识别请求。
     * <br/>
     * 从 pipedInput 持续读取 PCM 音频数据并通过 WebSocket 发送给 WhisperLive 服务；
     * 服务回调识别结果，完成断句后写入本次 Session 的结果缓冲区。
     * <br/>
     * 每次调用都会创建新的 {@link Session}，出错或完成后仅清理本次 Session，
     * 不会影响同一实例上的下一次识别。
     *
     * @param pipedInput 音频输入流（持续写入的 PCM 数据）
     * @return AsrResult（包含 CompletableFuture&lt;String&gt; 用于异步获取识别文本）
     */
    @Override
    public AsrResult process(PipedInputStream pipedInput) throws InterruptedException {
        semaphore.acquire();

        currentSession = new Session();
        currentSession.statusReference.set(Status.STARTING);
        userClosed = false;

        Thread main = Thread.currentThread();

        // 这三个引用由 AgiSupport 在返回 AsrResult 后赋值，用于控制识别行为
        AtomicBoolean started = new AtomicBoolean(false);
        AtomicReference<Consumer<Long>> noDataReference = new AtomicReference<>(null);
        AtomicReference<Function<String, Boolean>> dataReference = new AtomicReference<>(null);

        CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
            try {
                // ① 建立 WebSocket 连接
                wsClient = new WhisperWebSocket(property);
                wsClient.connectBlocking(10, TimeUnit.SECONDS);

                if (!wsClient.isOpen()) {
                    throw new RuntimeException("[Whisper-ASR] WebSocket 连接失败，请检查服务地址: " + property.getServerUrl());
                }

                // ② 等待服务端就绪（SERVER_READY）
                long waitStart = System.currentTimeMillis();
                while (!wsClient.serverReady && !main.isInterrupted() && !userClosed) {
                    if (DateUtil.spendMs(waitStart) > 15000) {
                        throw new RuntimeException("[Whisper-ASR] 等待服务端就绪超时");
                    }
                    ThreadUtil.safeSleep(100);
                }

                if (userClosed || main.isInterrupted()) {
                    return "";
                }

                currentSession.statusReference.set(Status.RUN);
                started.set(true);
                log.info("[Whisper-ASR] 服务端就绪，开始发送音频流");

                // ③ 异步发送音频帧
                CompletableFuture<Void> futureSend = CompletableFuture.runAsync(() -> {
                    log.info("[Whisper-ASR] 音频流读取开始");
                    try {
                        byte[] buffer = new byte[3200];
                        int len;
                        int sampleRate = property.getAsrOption().getSampleRate();
                        while ((len = pipedInput.read(buffer)) >= 0 && !main.isInterrupted() && !userClosed) {
                            if (len > 0 && wsClient.isOpen()) {
                                // 转换为 WhisperLive 期望的音频格式并发送
                                byte[] packet = ByteToAudioByte.bytesToBytes(Arrays.copyOf(buffer, len), len);
                                wsClient.send(packet);

                                // 按音频时长等待，避免发送过快（模拟实时流）
                                double deltaSleep = ((double) len / (sampleRate * 2)) * 1000;
                                ThreadUtil.sleep((long) deltaSleep);
                            }
                        }
                    } catch (Exception e) {
                        log.error("[Whisper-ASR] 录音流读取异常: {}", e.getMessage());
                    }
                    log.info("[Whisper-ASR] 音频流读取完毕，发送线程结束");
                });

                // ④ 主监控循环：等待识别结果或发送完成
                String str = "";
                while (Fc.isBlank(str) && !futureSend.isDone()) {

                    if (currentSession.statusReference.get() == Status.RUN) {
                        started.set(true);
                    }

                    if (!currentSession.resultMap.isEmpty()) {
                        // 拼接当前积累的结果
                        String currentText = String.join("", currentSession.resultMap.values());

                        if (dataReference.get() != null) {
                            // ── 持续返回模式 ──
                            dataReference.get().apply(currentText);
                            currentSession.resultMap.clear();
                        } else {
                            // ── 首次识别到结果即停止 ──
                            futureSend.cancel(true);
                            str = currentText;
                            currentSession.resultMap.clear();
                        }
                    } else {
                        if (Fc.notNull(noDataReference.get())) {
                            noDataReference.get().accept(DateUtil.spendMs(currentSession.lastTimeReference.get()));
                        }
                    }

                    if (currentSession.statusReference.get() == Status.ERROR) {
                        throw new RuntimeException("[Whisper-ASR] 识别出错: " + currentSession.errorMessageRef.get());
                    }

                    if (Fc.isBlank(str)) {
                        ThreadUtil.safeSleep(50);
                    }
                }

                // ⑤ 音频流已全部发送完毕，但仍未获得识别结果
                if (Fc.isBlank(str) && futureSend.isDone()) {
                    // 等待服务端最终响应（最多 5 秒）
                    currentSession.completionLatch.await(5, TimeUnit.SECONDS);

                    if (!currentSession.resultMap.isEmpty()) {
                        str = String.join("", currentSession.resultMap.values());
                        currentSession.resultMap.clear();
                    }

                    if (currentSession.statusReference.get() == Status.ERROR) {
                        throw new RuntimeException("[Whisper-ASR] 识别出错: " + currentSession.errorMessageRef.get());
                    }
                }

                log.info("[Whisper-ASR] 本次识别完成，结果长度={}", str.length());
                return str;

            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                log.warn("[Whisper-ASR] 识别线程被中断");
                return "";
            } catch (Exception e) {
                log.error("[Whisper-ASR] ASR处理失败: {}", e.getMessage(), e);
                throw new RuntimeException(e);
            } finally {
                try {
                    pipedInput.close();
                } catch (IOException ignored) { }
                // 关闭 WebSocket 连接
                closeWebSocket();
                semaphore.release();
            }
        });

        return new AsrResult(future, started, dataReference, noDataReference);
    }

    /**
     * 关闭客户端，中断正在进行的识别并释放资源。
     * <br/>
     * 通常在通话结束（AgHangup）时由框架调用。
     */
    @Override
    public void close() {
        userClosed = true;
        closeWebSocket();
        log.info("[Whisper-ASR] 客户端连接关闭");
    }

    // ─────────────────────────── 内部工具 ───────────────────────────

    private void closeWebSocket() {
        try {
            if (wsClient != null && wsClient.isOpen()) {
                wsClient.closeBlocking();
            }
        } catch (Exception ignored) { }
        wsClient = null;
    }

    // ─────────────────────────── WebSocket 客户端 ───────────────────────────

    /**
     * 内部 WebSocket 客户端，负责与 WhisperLive 服务通信。
     * <br/>
     * 持有外部 Session 的引用，将服务端回调的消息写入对应 Session 的状态。
     */
    private class WhisperWebSocket extends WebSocketClient {

        volatile boolean serverReady = false;
        private final OpenAiProperty prop;

        public WhisperWebSocket(OpenAiProperty property) throws Exception {
            super(new URI(property.getServerUrl()));
            this.prop = property;
        }

        @Override
        public void onOpen(ServerHandshake handshakeData) {
            log.info("[Whisper-ASR] WebSocket 连接已建立");

            // 发送初始化配置
            JSONObject config = new JSONObject();
            config.put("uid", IdUtil.nanoId());
            config.put("language", prop.getAsrOption().getLanguage());
            config.put("task", prop.getAsrOption().getTask());
            config.put("use_vad", prop.getAsrOption().getUseVad());
            if (Boolean.TRUE.equals(prop.getAsrOption().getUseVad())) {
                JSONObject vadParams = new JSONObject();
                vadParams.put("onset", prop.getAsrOption().getVadOnset());
                config.put("vad_parameters", vadParams);
            }
            super.send(config.toJSONString());
            log.debug("[Whisper-ASR] 已发送初始化配置: {}", config.toJSONString());
        }

        @Override
        public void onMessage(String message) {
            if (currentSession == null) {
                return;
            }

            JSONObject json = JSONObject.parseObject(message);

            // 服务端就绪信号
            if (json.containsKey("message") && StrUtil.equals(json.getString("message"), "SERVER_READY")) {
                serverReady = true;
                return;
            }

            // 识别结果段
            if (json.containsKey("segments")) {
                JSONArray segments = json.getJSONArray("segments");
                if (segments == null || segments.isEmpty()) {
                    return;
                }

                for (int i = 0; i < segments.size(); i++) {
                    JSONObject segment = segments.getJSONObject(i);
                    if (segment != null && Boolean.TRUE.equals(segment.getBoolean("completed"))) {
                        double timePoint = segment.getDoubleValue("start") + segment.getDoubleValue("end");
                        String text = UnicodeUtil.toString(segment.getString("text"));
                        if (Fc.isNotBlank(text)) {
                            log.info("[Whisper-ASR] 识别到用户话语: {}", text);
                            currentSession.statusReference.set(Status.RUN);
                            currentSession.lastTimeReference.set(System.currentTimeMillis());
                            synchronized (currentSession.resultMap) {
                                currentSession.resultMap.put(timePoint, text);
                            }
                        }
                    }
                }
                return;
            }

            log.debug("[Whisper-ASR] 收到服务端消息: {}", message);
        }

        @Override
        public void onClose(int code, String reason, boolean remote) {
            log.info("[Whisper-ASR] WebSocket 连接关闭, code={}, reason={}, remote={}", code, reason, remote);
            serverReady = false;
            if (currentSession != null) {
                currentSession.statusReference.set(Status.COMPLETE);
                currentSession.completionLatch.countDown();
            }
        }

        @Override
        public void onError(Exception ex) {
            log.error("[Whisper-ASR] WebSocket 连接异常: {}", ex.getMessage(), ex);
            if (currentSession != null) {
                currentSession.statusReference.set(Status.ERROR);
                currentSession.errorMessageRef.set(ex.getMessage());
                currentSession.completionLatch.countDown();
            }
        }
    }
}
