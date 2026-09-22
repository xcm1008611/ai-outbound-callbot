package com.qidiangk.smart.aster.dbs.dao.cdr;


import com.qidiangk.smart.aster.dbs.dao.cdr.mapper.CallInfoDetailMapper;
import com.qidiangk.smart.aster.dbs.dao.cdr.mapper.CallInfoMapper;
import com.qidiangk.smart.aster.dbs.entity.cdr.CallInfoDO;
import com.qidiangk.smart.aster.dbs.entity.cdr.CallInfoDetailDO;
import org.springframework.stereotype.Repository;
import top.jpower.core.dbs.dbs.dao.JpowerServiceImpl;
import top.jpower.core.dbs.support.Wrappers;

import java.sql.Wrapper;
import java.util.List;

@Repository
public class CallInfoDetailDao extends JpowerServiceImpl<CallInfoDetailMapper, CallInfoDetailDO> {

    /**
     * 根据通话记录ID查询
     */
    public List<CallInfoDetailDO> listByCallInfoId(Long id) {
        return super.list(Wrappers.getQueryWrapper().eq(CallInfoDetailDO::getCallId, id).orderBy(CallInfoDetailDO::getCreateTime).asc());
    }
}
