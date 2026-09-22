package com.qidiangk.smart.aster.dbs.dao.cdr;

import org.springframework.stereotype.Repository;
import top.jpower.core.dbs.dbs.dao.JpowerServiceImpl;
import com.qidiangk.smart.aster.dbs.dao.cdr.mapper.CallTransferInfoMapper;
import com.qidiangk.smart.aster.dbs.entity.cdr.CallTransferInfoDO;
import top.jpower.core.dbs.support.Wrappers;

/**
 * @author mr.g
 */
@Repository
public class CallTransferInfoDao extends JpowerServiceImpl<CallTransferInfoMapper, CallTransferInfoDO> {

    /**
     * 根据callId获取最新的一条转接记录
     *
     * @param callId callId
     * @return CallTransferInfoDO
     */
    public CallTransferInfoDO getNewByCallId(Long callId) {
        return super.getOne(Wrappers.getQueryWrapper()
                .eq(CallTransferInfoDO::getCallInfoId, callId)
                .orderBy(CallTransferInfoDO::getCreateTime).desc().limit(1));
    }

}
