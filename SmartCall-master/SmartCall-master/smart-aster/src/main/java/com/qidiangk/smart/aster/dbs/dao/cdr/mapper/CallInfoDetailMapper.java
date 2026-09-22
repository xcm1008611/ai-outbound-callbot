package com.qidiangk.smart.aster.dbs.dao.cdr.mapper;


import com.mybatisflex.core.query.QueryWrapper;
import com.qidiangk.smart.aster.dbs.entity.cdr.CallInfoDO;
import com.qidiangk.smart.aster.dbs.entity.cdr.CallInfoDetailDO;
import org.apache.ibatis.annotations.Mapper;
import top.jpower.core.dbs.config.annotation.NoSqlLog;
import top.jpower.core.dbs.dbs.dao.mapper.base.JpowerBaseMapper;

@Mapper
public interface CallInfoDetailMapper extends JpowerBaseMapper<CallInfoDetailDO> {
}
