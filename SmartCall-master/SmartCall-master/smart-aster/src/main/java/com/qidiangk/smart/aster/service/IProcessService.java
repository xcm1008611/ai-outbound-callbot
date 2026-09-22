package com.qidiangk.smart.aster.service;

import com.qidiangk.smart.aster.constants.CallMessageTypeEnum;
import com.qidiangk.smart.aster.constants.CallRouteProcessEnum;
import com.qidiangk.smart.aster.dbs.entity.asterisk.EndpointsDO;
import com.qidiangk.smart.aster.pojo.UserIntent;
import com.qidiangk.smart.aster.pojo.dto.ActionDTO;

import java.util.List;

/**
 * 流程上使用的服务
 *
 * @author mr.g
 */
public interface IProcessService {

    /**
     * 保存实时消息
     *
     * @param uniqueId 唯一标识
     * @param content  内容
     * @param filePath 文件路径
     * @param typeEnum 消息类型
     */
    void realtimeMessage(String uniqueId, String content, String filePath, CallMessageTypeEnum typeEnum);

    boolean existsFlowById(Long routId, CallRouteProcessEnum processEnum);

    List<? extends UserIntent.Node> findCompleteFlow(Long id);

    boolean isPhoneZero(String phone, EndpointsDO endpointsDO);

    /**
     * 实时数据
     * @param actionDTO 对话内容
     */
    void sendAction(ActionDTO actionDTO);

    String getLimit1Line();

    /**
     * 判断队列成员是否暂停
     *
     * @param queueName 队列名称
     * @param memberName 成员名称
     * @return 是否暂停
     */
    boolean isPaused(String queueName, String memberName);
}
