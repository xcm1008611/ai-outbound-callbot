package com.qidiangk.smart.resource.pojo;

import com.mybatisflex.annotation.Column;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import top.jpower.core.dbs.support.type.StringListTypeHandler;

import java.io.Serializable;
import java.util.List;

/**
 * 短信发送入参
 *
 * @author mr.g
 */
@Data
public class SmsSelectVO implements Serializable {

	@Schema(description = "短信模板名称", requiredMode = Schema.RequiredMode.REQUIRED)
	private String name;

	@Schema(description = "短信模板编码", requiredMode = Schema.RequiredMode.REQUIRED)
	private String code;

	@Schema(description = "模板参数")
    @Column(typeHandler = StringListTypeHandler.class)
	private List<String> parameters;

}
