package com.qidiangk.smart.aster.dbs.entity.cdr;

import com.mybatisflex.annotation.Id;
import com.mybatisflex.annotation.KeyType;
import com.mybatisflex.annotation.Table;
import com.mybatisflex.core.keygen.KeyGenerators;
import com.qidiangk.smart.aster.constants.CallHangStateEnum;
import com.qidiangk.smart.aster.constants.CallOutTypeEnum;
import com.qidiangk.smart.aster.constants.CallStateEnum;
import com.qidiangk.smart.aster.constants.CallTypeEnum;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;
import top.jpower.core.dbs.dictbind.annotation.Dict;
import top.jpower.core.dbs.tenant.entity.TenantEntity;

import java.util.Date;

/**
 * @author mr.g
 */
@Data
@Table(value = "call_info_detail")
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
public class CallInfoDetailDO extends TenantEntity {

    @Id(keyType = KeyType.Generator, value = KeyGenerators.flexId)
    @Schema(description = "消息ID")
    private Long id;

    @Schema(description = "通话记录ID")
    private Long callId;

    @Schema(description = "转接ID")
    private Long transferId;

    @Schema(description = "消息类型")
    @Dict(name = "CALL_MESSAGE_TYPE")
    private Integer type;

    @Schema(description = "录音文件ID")
    private Long fileId;

    @Schema(description = "消息内容")
    private String message;
}
