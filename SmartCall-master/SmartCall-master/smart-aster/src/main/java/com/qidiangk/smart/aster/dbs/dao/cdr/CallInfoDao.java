package com.qidiangk.smart.aster.dbs.dao.cdr;


import org.springframework.stereotype.Repository;
import top.jpower.core.dbs.dbs.dao.JpowerServiceImpl;
import com.qidiangk.smart.aster.dbs.dao.cdr.mapper.CallInfoMapper;
import com.qidiangk.smart.aster.dbs.entity.cdr.CallInfoDO;
import top.jpower.core.dbs.support.Wrappers;

@Repository
public class CallInfoDao extends JpowerServiceImpl<CallInfoMapper, CallInfoDO> {

    /**
     * 根据linkedId查询通话记录
     * @return 通话记录
     */
    public CallInfoDO getByLinkedId(String uniqueId) {
        return super.getOne(Wrappers.getQueryWrapper().eq(CallInfoDO::getLinkedId, uniqueId));
    }
}
