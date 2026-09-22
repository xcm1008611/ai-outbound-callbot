package com.qidiangk.smart.aster.tripartite.property;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.io.Serializable;

/**
 * OpenAI 实时语音识别配置类
 * <br/>
 * 配置前缀：ivr.OpenAI
 * <br/>
 * 用于连接 OpenAILive 自部署服务，通过 WebSocket 实现实时流式语音识别。
 * <br/>
 * 页面流程中配置的 asrOption 会动态覆盖此处配置，参见 {@link OpenAIAsrOption}
 *
 * @author mr.g
 */
@Data
@Component
@ConfigurationProperties(prefix = "ivr.openai")
public class OpenAiProperty implements Serializable {

    /**
     * WhisperLive WebSocket 服务地址
     * <br/>
     * 示例：ws://127.0.0.1:9090
     */
    private String serverUrl;

    /**
     * ASR 配置
     */
    private AsrOption asrOption = new AsrOption();

    @Data
    public static class AsrOption implements Serializable {

        /**
         * 音频采样率（Hz）
         * <br/>
         * 可选值：8000（电话场景）、16000
         * <br/>
         * 电话 VoIP 场景建议使用 8000
         */
        private Integer sampleRate = 8000;

        /**
         * 识别语言
         * <br/>
         * 默认值：zh（中文）
         */
        private String language = "zh";

        /**
         * 任务类型
         * <br/>
         * 可选值：transcribe（识别）、translate（翻译）
         * <br/>
         * 默认值：transcribe
         */
        private String task = "transcribe";

        /**
         * 是否使用 VAD（语音活动检测）
         * <br/>
         * 默认 false，由上层 IVR 控制断句逻辑
         */
        private Boolean useVad = false;

        /**
         * VAD onset 阈值
         * <br/>
         * 仅在 useVad=true 时生效，取值范围 [0, 1]，默认 0.5
         */
        private Float vadOnset = 0.5f;
    }
}
