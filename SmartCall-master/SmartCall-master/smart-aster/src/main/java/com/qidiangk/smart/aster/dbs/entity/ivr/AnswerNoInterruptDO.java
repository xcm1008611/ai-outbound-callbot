package com.qidiangk.smart.aster.dbs.entity.ivr;

import com.mybatisflex.annotation.Column;
import com.mybatisflex.annotation.Id;
import com.mybatisflex.annotation.KeyType;
import com.mybatisflex.annotation.Table;
import com.mybatisflex.core.handler.JacksonTypeHandler;
import com.mybatisflex.core.keygen.KeyGenerators;
import com.qidiangk.smart.common.validated.group.Validation;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import top.jpower.core.dbs.tenant.entity.TenantEntity;

import java.util.List;

@Data
@Table(value = "ivr_answer_no_interrupt")
@EqualsAndHashCode(callSuper = true)
public class AnswerNoInterruptDO extends TenantEntity {

    /**
     * 呼叫路由ID
     */
    @Id(keyType = KeyType.Generator, value = KeyGenerators.flexId)
    @NotNull(groups = Validation.Update.class, message = "呼叫路由ID 不能为空")
    @Schema(description = "呼叫路由ID")
    private Long id;

    /**
     * 名称
     */
    @Schema(description = "名称")
    @NotBlank(groups = {Validation.Update.class,Validation.Create.class}, message = "名称 不能为空")
    private String name;

    /**
     * 是否启用
     */
    @Schema(description = "是否启用")
    private Boolean enabled;

    /**
     * 词组
     */
    @Schema(description = "词组")
    @NotEmpty(groups = {Validation.Update.class,Validation.Create.class}, message = "词组 不能为空")
    @Column(typeHandler = JacksonTypeHandler.class)
    private List<String> word;
    /**
     * 路由名称
     */
    @Schema(description = "是否精确匹配")
    @NotNull(groups = {Validation.Update.class,Validation.Create.class}, message = "是否精确匹配 不能为空")
    private Boolean precise;

}
