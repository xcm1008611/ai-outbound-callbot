package com.qidiangk.smart.aster.pojo.vo.line;

import com.mybatisflex.annotation.Column;
import com.mybatisflex.core.handler.JacksonTypeHandler;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

/**
 * @author mr.g
 */
@Data
public class LineBaseVO {

    /**
     * 线路号码
     */
    @NotBlank(message = "号码不能为空")
    @Schema(description = "号码")
    private String callerid;

    /**
     * 连接IP
     */
    @Schema(description = "连接IP")
    @NotBlank(message = "IP不可为空")
    private String ip;

    /**
     * 连接端口
     */
    @Schema(description = "连接端口")
    @NotBlank(message = "端口不可为空")
    private String port;

    /**
     * 连接数量
     */
    @Schema(description = "连接数量")
    @NotNull(message = "数量不可为空")
    private Integer maxContacts;

    /**
     * 主叫号码
     */
    @Schema(description = "主叫号码")
    private String fromUser;

    /**
     * 主叫域
     */
    @Schema(description = "主叫域")
    private String fromDomain;

    /**
     * 线路归属地
     */
    @Schema(description = "线路归属地")
    @Column(typeHandler = JacksonTypeHandler.class)
    private List<String> ownership;

    /**
     * 呼入请求是否要求认证
     */
    @Schema(description = "呼入请求是否要求认证")
    private Boolean isAuth;

    /**
     * 认证账号
     */
    @Schema(description = "认证账号")
    private String authUsername;

    /**
     * 认证密码
     */
    @Schema(description = "认证密码")
    private String authPassword;

    /**
     * 外地号码前是否加0
     */
    @Schema(description = "外地号码前是否加0")
    private Boolean isAddZero;

    /**
     * 被叫号码前缀
     */
    @Schema(description = "被叫号码前缀")
    private String prefix;


    /**
     * 是否主动注册
     */
    @Schema(description = "是否主动注册")
    private Boolean isRegister;

    /**
     * 账号
     */
    @Schema(description = "账号")
    private String username;

    /**
     * 密码
     */
    @Schema(description = "密码")
    private String password;
    /**
     * 是否解析域名
     */
    @Schema(description = "是否解析域名")
    private Boolean srvLookups;
    @Schema(description = "路由ID")
    private Long routeId;

    @Schema(description = "变量")
    private String vars;

}
