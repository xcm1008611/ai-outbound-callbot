package com.qidiangk.smart.aster.dbs.dao.ivr;

import com.qidiangk.smart.aster.dbs.dao.ivr.mapper.AnswerNoInterruptMapper;
import com.qidiangk.smart.aster.dbs.entity.ivr.AnswerNoInterruptDO;
import com.qidiangk.smart.aster.pojo.SelectVO;
import com.qidiangk.smart.common.enums.YN01Enum;
import org.springframework.stereotype.Repository;
import top.jpower.core.dbs.dbs.dao.JpowerServiceImpl;
import top.jpower.core.dbs.support.Wrappers;

import java.util.List;

/**
 * 不打断词组
 *
 * @author mr.g
 */
@Repository
public class AnswerNoInterruptDao extends JpowerServiceImpl<AnswerNoInterruptMapper, AnswerNoInterruptDO> {

    /**
     * 下拉列表
     */
    public List<SelectVO> select() {
        return super.listAs(Wrappers.getQueryWrapper()
                .select(AnswerNoInterruptDO::getId, AnswerNoInterruptDO::getName)
                .eq(AnswerNoInterruptDO::getEnabled, YN01Enum.Y.getValue()), SelectVO.class);
    }

    public List<AnswerNoInterruptDO> details(List<Long> ids) {
        return super.list(Wrappers.getQueryWrapper()
                .select(AnswerNoInterruptDO::getId, AnswerNoInterruptDO::getWord, AnswerNoInterruptDO::getPrecise)
                .in(AnswerNoInterruptDO::getId, ids));
    }
}
