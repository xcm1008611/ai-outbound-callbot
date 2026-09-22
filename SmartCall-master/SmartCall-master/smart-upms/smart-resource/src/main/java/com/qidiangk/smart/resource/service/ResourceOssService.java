package com.qidiangk.smart.resource.service;

import com.qidiangk.smart.resource.dbs.entity.ResourceOss;
import com.qidiangk.smart.system.api.dto.SelectDTO;
import top.jpower.core.dbs.service.BaseService;

import java.util.List;

/**
 * 对象存储服务接口
 * <p>
 * 提供对象存储相关的服务方法
 * </p>
 *
 * @author mr.g
 */
public interface ResourceOssService extends BaseService<ResourceOss> {

    /**
     * 获取编码名称列表
     *
     * @author mr.g
     * @return List<SelectVO> 编码名称列表
     */
    List<SelectDTO> listCodeName();

    /**
     * 设置默认
     *
     * @author mr.g
     * @param id 编码
     * @return Boolean 是否成功
     */
    Boolean setDefault(Long id);
}
