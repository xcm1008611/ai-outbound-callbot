package com.qidiangk.smart.aster.pojo.bo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 不打断词组 搜索业务对象
 *
 * @author mr.g
 */
@Data
public class NoInterruptBO {

    @Schema(description = "词组")
    private String word;

    @Schema(description = "是否精确匹配")
    private Boolean precise;
}
