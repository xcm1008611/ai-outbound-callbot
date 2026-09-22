package com.qidiangk.smart.aster.handler.nodes.granter;

import cn.hutool.core.util.PhoneUtil;
import cn.hutool.json.JSONUtil;
import com.qidiangk.smart.aster.handler.nodes.NodeContext;
import com.qidiangk.smart.aster.handler.nodes.NodeGranter;
import com.qidiangk.smart.aster.handler.nodes.NodeResult;
import com.qidiangk.smart.aster.pojo.UserIntent;
import com.qidiangk.smart.resource.api.dto.SmsRequestSingleDTO;
import com.qidiangk.smart.resource.api.feign.SmsClient;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Component;
import top.jpower.core.util.rsp.R;
import top.jpower.core.util.support.JpowerSpelExpressionParser;
import top.jpower.core.util.utils.Fc;

import java.util.HashMap;
import java.util.concurrent.CompletableFuture;

/**
 * 短信
 */
@Slf4j
@Component(SmsGranter.GRANT_TYPE)
@RequiredArgsConstructor
public class SmsGranter implements NodeGranter<UserIntent.Node.SmsNode> {

    public static final String GRANT_TYPE = "sms";
    private final SpelExpressionParser parser = new JpowerSpelExpressionParser();
    private final ThreadPoolTaskExecutor taskExecutor;
    private final SmsClient smsClient;

    @SneakyThrows
    @Override
    public @NotNull NodeResult grant(NodeContext nodeContext, Object lastResult, UserIntent.Node.SmsNode node) {
        CompletableFuture<Boolean> future = CompletableFuture.supplyAsync(()-> {

            SmsRequestSingleDTO singleDTO = new SmsRequestSingleDTO();
            singleDTO.setCode(node.getSmsCode());
            singleDTO.setPhone(parser.parseExpression(node.getPhone()).getValue(nodeContext.getContext(), String.class));

            if (!PhoneUtil.isMobile(singleDTO.getPhone())) {
                log.warn("手机号码格式不正确,无法发送短信：{}", singleDTO.getPhone());
                // 不是真实的手机号码，直接返回失败
                return false;
            }

            if (Fc.isNotEmpty(node.getParams())) {
                singleDTO.setMap(new HashMap<>(node.getParams().size()));
                node.getParams().forEach((key, value) -> singleDTO.getMap().put(key, parser.parseExpression(value).getValue(nodeContext.getContext(), String.class)));
            }

            R<Boolean> r = smsClient.sendSingle(singleDTO);

            boolean is = r.isStatus() && r.getData();
            if (!is) {
                log.warn("短信发送失败：{}", JSONUtil.toJsonPrettyStr(r));
            }

            return is;

        }, taskExecutor);

        return NodeResult.builder()
                .nextId(node.getNextNode())
                .result(future)
                .build();
    }
}
