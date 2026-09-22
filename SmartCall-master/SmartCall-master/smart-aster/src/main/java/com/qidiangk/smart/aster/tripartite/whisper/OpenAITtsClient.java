package com.qidiangk.smart.aster.tripartite.whisper;

import lombok.extern.slf4j.Slf4j;
import top.jpower.core.asterisk.audio.TtsClient;
import top.jpower.core.asterisk.audio.TtsResult;

import java.io.OutputStream;

/**
 * OpenAI TTS 客户端（暂未实现）
 * <br/>
 * OpenAI 目前仅提供 ASR（语音识别）能力，TTS（语音合成）暂不支持。
 * 此桩类的存在是为了满足 {@link com.qidiangk.smart.aster.tripartite.VoiceModelEnum}
 * 的枚举定义要求（每个语音模型需同时指定 ASR 和 TTS 客户端类）。
 * <br/>
 * 若在 IVR 流程中选择 OpenAI 作为 TTS 模型，调用时会抛出 {@link UnsupportedOperationException}。
 * 请搭配其他 TTS 模型使用（如 DashScope、阿里云、电信等）。
 *
 * @author mr.g
 */
@Slf4j
public class OpenAITtsClient implements TtsClient {

    public OpenAITtsClient() {
        log.warn("[Whisper-TTS] Whisper 暂不支持 TTS 语音合成，请选择其他 TTS 模型");
    }

    @Override
    public TtsResult process(String say, OutputStream audioOutput) {
        throw new UnsupportedOperationException("Whisper 暂不支持 TTS 语音合成，请选择其他 TTS 模型（如 DashScope、阿里云、电信等）");
    }

    @Override
    public int getSampleRate() {
        return 8000;
    }

    @Override
    public void close() {
        // no-op
    }
}
