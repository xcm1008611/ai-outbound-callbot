package com.qidiangk.smart.aster.constants;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonValue;
import com.qidiangk.smart.aster.handler.nodes.granter.*;
import com.qidiangk.smart.common.enums.ArrayValuable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import top.jpower.core.util.utils.Fc;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
@AllArgsConstructor
public enum CallMessageTypeEnum implements ArrayValuable<CallMessageTypeEnum> {
    USER(0, "用户消息"),
    KF(1, "客服消息"),
    TRANSFER(2, "转接客服");

    private final Integer code;
    @Getter
    private final String name;

    public static CallMessageTypeEnum of(Boolean isBot) {
        return isBot ? KF : USER;
    }

    // 使用标准方法名
    @JsonValue
    public Integer toValue() {
        return code;
    }

    // 添加大小写不敏感处理
    @JsonCreator
    public static CallMessageTypeEnum forCode(Integer code) {
        if (code == null) return null;
        for (CallMessageTypeEnum type : CallMessageTypeEnum.values()) {
            if (Fc.equalsValue(type.code, code)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown enum value: " + code);
    }

    @Override
    public CallMessageTypeEnum[] array() {
        return values();
    }

}