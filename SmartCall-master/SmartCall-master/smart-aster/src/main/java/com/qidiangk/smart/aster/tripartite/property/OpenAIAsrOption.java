package com.qidiangk.smart.aster.tripartite.property;

import lombok.Data;

import java.io.Serializable;

/**
 * OpenAI ASR 页面动态配置类
 * <br/>
 * 在 IVR 流程的开始节点中配置此项，可覆盖配置文件（ivr.OpenAI）中的默认值。
 * <br/>
 * 所有字段均为可选，为 null 时不覆盖配置文件的对应值。
 *
 * @author mr.g
 */
@Data
public class OpenAIAsrOption implements Serializable {

    /**
     * WhisperLive WebSocket 服务地址（覆盖配置文件中的 server-url）
     * <br/>
     * 示例：ws://127.0.0.1:9090
     */
    private String serverUrl;

    /**
     * 识别语言
     * <br/>
     * 可选值：zh、en、ja 等
     */
    private String language;

    /**
     * 任务类型
     * <br/>
     * 可选值：transcribe（识别）、translate（翻译）
     */
    private String task;

    /**
     * 是否使用 VAD（语音活动检测）
     */
    private Boolean useVad;

    /**
     * VAD onset 阈值，取值范围 [0, 1]
     */
    private Float vadOnset;
}
