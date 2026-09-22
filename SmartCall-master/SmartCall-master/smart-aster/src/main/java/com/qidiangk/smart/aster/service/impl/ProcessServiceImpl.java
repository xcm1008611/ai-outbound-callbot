package com.qidiangk.smart.aster.service.impl;

import cn.hutool.core.util.PhoneUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.http.HttpUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.alibaba.fastjson.JSON;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.qidiangk.smart.aster.constants.CallMessageTypeEnum;
import com.qidiangk.smart.aster.constants.CallRouteProcessEnum;
import com.qidiangk.smart.aster.constants.StatusEnum;
import com.qidiangk.smart.aster.dbs.dao.PhonePlaceDao;
import com.qidiangk.smart.aster.dbs.dao.asterisk.EndpointsDao;
import com.qidiangk.smart.aster.dbs.dao.asterisk.QueueMembersDao;
import com.qidiangk.smart.aster.dbs.dao.cdr.CallInfoDao;
import com.qidiangk.smart.aster.dbs.dao.cdr.CallInfoDetailDao;
import com.qidiangk.smart.aster.dbs.dao.cdr.CallTransferInfoDao;
import com.qidiangk.smart.aster.dbs.dao.ivr.CallRouteDao;
import com.qidiangk.smart.aster.dbs.entity.PhonePlaceDO;
import com.qidiangk.smart.aster.dbs.entity.asterisk.EndpointsDO;
import com.qidiangk.smart.aster.dbs.entity.asterisk.QueueMembersDO;
import com.qidiangk.smart.aster.dbs.entity.cdr.CallInfoDO;
import com.qidiangk.smart.aster.dbs.entity.cdr.CallInfoDetailDO;
import com.qidiangk.smart.aster.dbs.entity.cdr.CallTransferInfoDO;
import com.qidiangk.smart.aster.dbs.entity.ivr.CallRouteDO;
import com.qidiangk.smart.aster.pojo.UserIntent;
import com.qidiangk.smart.aster.pojo.dto.ActionDTO;
import com.qidiangk.smart.aster.service.IProcessService;
import com.qidiangk.smart.resource.api.feign.FileClient;
import com.qidiangk.smart.system.api.cache.param.ParamCache;
import com.qidiangk.smart.system.api.dto.CityDTO;
import com.qidiangk.smart.system.api.feign.SystemClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import top.jpower.core.dbs.support.Wrappers;
import top.jpower.core.util.rsp.R;
import top.jpower.core.util.utils.Fc;
import top.jpower.core.util.utils.JsonUtil;
import top.jpower.core.util.utils.StringUtil;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * @author mr.g
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ProcessServiceImpl implements IProcessService {

    private final CallInfoDao callInfoDao;
    private final CallTransferInfoDao callTransferInfoDao;
    private final CallInfoDetailDao callInfoDetailDao;
    private final FileClient fileClient;
    private final CallRouteDao callRouteDao;
    private final ObjectMapper objectMapper;
    private final SystemClient systemClient;
    private final PhonePlaceDao phonePlaceDao;
    private final EndpointsDao endpointsDao;
    private final QueueMembersDao queueMembersDao;

    /**
     * 实时对话通知
     */
    private final static String ACTION_NOTICE_URL_KEY = "call.notice.action";

    @Async
    @Override
    public void realtimeMessage(String uniqueId, String content, String filePath, CallMessageTypeEnum typeEnum) {
        CallInfoDO callInfoDO = callInfoDao.getByLinkedId(uniqueId);
        // 正常走到都能查到
        if (callInfoDO != null) {
            CallInfoDetailDO callInfoDetailDO = new CallInfoDetailDO();
            callInfoDetailDO.setCallId(callInfoDO.getId());

            if (typeEnum == CallMessageTypeEnum.TRANSFER) {
                CallTransferInfoDO callTransferInfoDO = callTransferInfoDao.getNewByCallId(callInfoDO.getId());
                if (callTransferInfoDO != null) {
                    callInfoDetailDO.setTransferId(callTransferInfoDO.getId());
                }
            }
            callInfoDetailDO.setType(typeEnum.toValue());

            if (Fc.isNotBlank(filePath)) {
                File file = new File(filePath);
                if (file.exists()) {
                    R<Long> fileR = fileClient.uploadFile(file);
                    if (fileR.isStatus()) {
                        callInfoDetailDO.setFileId(fileR.getData());
                    } else {
                        log.error("上传文件失败：{}", JSON.toJSONString(fileR));
                    }
                }
            }
            callInfoDetailDO.setMessage(content);
            callInfoDetailDao.save(callInfoDetailDO);
        }
    }

    @Override
    public boolean existsFlowById(Long routId, CallRouteProcessEnum processEnum) {
        return callRouteDao.exists(Wrappers.getQueryWrapper()
                .eq(CallRouteDO::getId, routId)
                .eq(CallRouteDO::getProcess, processEnum.getValue())
                .eq(CallRouteDO::getStatus, StatusEnum.DISABLE.getStatus())
                .isNotNull(CallRouteDO::getFlow)
                .isNotNull(CallRouteDO::getType));
    }

    /**
     * 获取完整的路由流程
     *
     * @param id 路由ID
     * @return 完整流程
     */
    @Override
    public List<? extends UserIntent.Node> findCompleteFlow(Long id) {
        Optional<Object> optionalFlow = callRouteDao.getObjOpt(Wrappers.getQueryWrapper()
                .select(CallRouteDO::getFlow)
                .eq(CallRouteDO::getId, id));
        return optionalFlow.map(flow -> {
            return parseArray(flow.toString());
        }).orElse(null);
    }

    private List<? extends UserIntent.Node> parseArray(String text) {
        if (StrUtil.isEmpty(text)) {
            return new ArrayList<>();
        }
        try {
            return objectMapper.readValue(text, objectMapper.getTypeFactory().constructCollectionType(List.class, UserIntent.Node.class));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean isPhoneZero(String phone, EndpointsDO endpointsDO){
        if (Fc.isNull(endpointsDO) || !endpointsDO.getAddZero()) {
            return false;
        }

        String name = "";
        if (Fc.isNotEmpty(endpointsDO.getOwnership())) {
            if (endpointsDO.getOwnership().size() > 1) {
                String lastName = endpointsDO.getOwnership().get(1);
                if (StringUtil.equalsAnyIgnoreCase(lastName, "市辖区", "县")) {
                    name = endpointsDO.getOwnership().get(0);
                } else {
                    name = lastName;
                }
            } else {
                name = endpointsDO.getOwnership().get(0);
            }
        }

        if (Fc.isNotBlank(name)) {
            if (PhoneUtil.isTel(endpointsDO.getCallerid())) {
                String code = StrUtil.subPre(endpointsDO.getCallerid(), 4);
                R<CityDTO> city = systemClient.getCityByCode(code);
                if (city.isStatus() && Fc.notNull(city.getData())) {
                    name = city.getData().getName();
                }
            } else {
                PhonePlaceDO phonePlaceDo = phonePlaceDao.getOneByField(PhonePlaceDO::getPhone, StrUtil.subPre(endpointsDO.getCallerid(), 7)+"0000");
                if (Fc.notNull(phonePlaceDo)) {
                    name = phonePlaceDo.getCity();
                }
            }
        }

        PhonePlaceDO phonePlaceDo = phonePlaceDao.getOneByField(PhonePlaceDO::getPhone, StrUtil.subPre(phone, 7)+"0000");
        return Fc.notNull(phonePlaceDo) && Fc.notEqualsValue(phonePlaceDo.getCity(), name);
    }

    /**
     * @param actionDTO 对话内容
     */
    @Override
    @Async
    @Retryable(
            retryFor = {RuntimeException.class},
            maxAttempts = 10,
            backoff = @Backoff(delay = 1000*60, multiplier = 3, maxDelay = 1000*60*60*24)
    )
    public void sendAction(ActionDTO actionDTO) {
        String url = ParamCache.getString(ACTION_NOTICE_URL_KEY);
        if (Fc.isBlank(url)) {
            return;
        }

        String body = HttpUtil.post(url, JsonUtil.toJson(actionDTO));
        JSONObject json = JSONUtil.parseObj(body);
        if (json.getInt("code") != 200) {
            throw new RuntimeException("请求失败===>>>" + body);
        }
    }

    @Override
    public String getLimit1Line() {
        return endpointsDao.getLimit1Line();
    }

    /**
     * 是否暂停
     * @param queueName
     * @param memberName
     * @return true:暂停 false:不暂停, 没查到就是暂停（代表是别的租户的数据）
     */
    @Override
    public boolean isPaused(String queueName, String memberName) {
        QueueMembersDO queueMembersDO = queueMembersDao.getOne(Wrappers.getQueryWrapper()
                .select(QueueMembersDO::getPaused)
                .eq(QueueMembersDO::getInterfaceName, memberName)
                .eq(QueueMembersDO::getQueueName, queueName));
        return queueMembersDO != null ? queueMembersDO.getPaused() : true;
    }
}
