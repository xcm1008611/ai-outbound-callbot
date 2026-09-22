// View: Simulator (AI通话实时沙盒) v2 - 紧凑三栏
const SimulatorView = { render() { return renderSimulatorView(); } };

function renderSimulatorView() {
  const conv = AppState.liveConversation || {
    stageProgress: 65,
    currentStage: '加微铺垫',
    messages: [
      {role:'ai', time:'00:01', text:'您好王先生！我是知缘婚恋的资深红娘助理林林。看您之前登记过在杭州从事IT研发，今天特意同步个好消息~', emotion:'热情'},
      {role:'user', time:'00:08', text:'哦，你们是相亲平台吧？我平时工作挺忙的，周末经常加班没时间。', emotion:'中性'},
      {role:'ai', time:'00:15', text:'特别理解您！程序员研发确实忙，所以我们专门做1对1精准前置匹配，不用盲目社交。我们库里正好有一位同在滨江网易的UI设计师姑娘，浙大毕业，也喜欢摄影。', emotion:'真诚'},
      {role:'user', time:'00:32', text:'听起来还挺巧的，她多大啊？有什么爱好？', emotion:'兴趣'},
      {role:'ai', time:'00:38', text:'姑娘是96年的，性格特别温和爱笑。我让专属红娘老师通过企微把脱敏资料发您过目，您看可以吗？', emotion:'期待'}
    ]
  };
  const percent = conv.stageProgress || 65;

  return `
    <div class="view-fade-enter">

      <!-- Page Header -->
      <div class="page-header">
        <div class="page-title-group">
          <div class="page-title">
            <i data-lucide="radio"></i>
            AI 通话模拟实验室
            <span style="margin-left:8px;font-size:9.5px;padding:2px 7px;border-radius:var(--radius-sm);background:var(--amber-50);color:var(--amber-700);border:1px solid var(--amber-200);font-weight:600;">模拟演示</span>
            <span class="live-dot" style="margin-left:6px;"></span>
          </div>
          <div class="page-subtitle">双工实时 ASR · LLM 意图识别 · 话术决策流可观测 <span style="color:var(--rose-600);">· 非真实通话录音</span></div>
        </div>
        <div class="page-actions">
          <button class="btn btn-outline btn-sm"><i data-lucide="history"></i>历史录音</button>
          <button class="btn btn-danger btn-sm" onclick="App.showToast('已触发紧急切断 · 转人工坐席','warning')"><i data-lucide="phone-off"></i>切断转人工</button>
        </div>
      </div>

      <!-- Call Info Bar (紧凑横向条) -->
      <div class="card" style="padding:10px 14px;margin-bottom:var(--content-gap);">
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
          <div style="display:flex;align-items:center;gap:8px;">
            <div class="lead-avatar-bubble" style="width:32px;height:32px;font-size:12px;">王</div>
            <div>
              <div style="font-size:12px;font-weight:600;color:var(--text-main);">王建国 <span style="font-size:10px;font-weight:400;color:var(--text-muted);">男·35岁</span></div>
              <div style="font-size:10.5px;color:var(--text-muted);font-variant-numeric:tabular-nums;">138****5678 · 字节跳动算法工程师</div>
            </div>
          </div>
          <div style="width:1px;height:24px;background:var(--border-color);"></div>
          <div style="display:flex;gap:12px;font-size:11px;">
            <div><span style="color:var(--text-muted);">AI人设</span> <span style="font-weight:500;color:var(--text-main);margin-left:2px;">知性红娘-婉清</span></div>
            <div><span style="color:var(--text-muted);">音色</span> <span style="font-weight:500;color:var(--text-main);margin-left:2px;">温柔知性女声</span></div>
            <div><span style="color:var(--text-muted);">已通话</span> <span style="font-weight:600;color:var(--brand-600);margin-left:2px;font-variant-numeric:tabular-nums;" id="call-timer">03:42</span></div>
          </div>
          <div style="flex:1;"></div>
          <!-- Stage Progress -->
          <div style="display:flex;align-items:center;gap:8px;min-width:280px;">
            <span style="font-size:11px;color:var(--text-muted);white-space:nowrap;">话术阶段</span>
            <div style="flex:1;height:4px;background:var(--ink-100);border-radius:2px;overflow:hidden;">
              <div style="width:${percent}%;height:100%;background:linear-gradient(90deg,var(--brand-500),var(--violet-500));border-radius:2px;transition:width 0.8s;"></div>
            </div>
            <span style="font-size:10.5px;font-weight:600;color:var(--brand-600);white-space:nowrap;">${conv.currentStage}</span>
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:240px 1fr 260px;gap:var(--content-gap);min-height:calc(100vh - 250px);">

        <!-- LEFT: Intent & Sentiment Panel -->
        <div style="display:flex;flex-direction:column;gap:var(--content-gap);">
          <!-- Intent Tags -->
          <div class="card" style="padding:12px;">
            <div class="card-title" style="font-size:11px;margin-bottom:8px;"><i data-lucide="tags" style="width:12px;height:12px;color:var(--brand-500);"></i>实时意图标签</div>
            <div style="display:flex;flex-wrap:wrap;gap:4px;">
              ${['高学历要求','有房有车优先','介意年龄差(±3)','周末可约见','不排斥闪婚','情绪积极','名校情结'].map(t => `
                <span class="badge badge-primary" style="font-size:10px;line-height:16px;">${t}</span>
              `).join('')}
              <span class="badge badge-neutral" style="font-size:10px;line-height:16px;opacity:0.5;">+3</span>
            </div>
          </div>

          <!-- Sentiment Gauge -->
          <div class="card" style="padding:12px;">
            <div class="card-title" style="font-size:11px;margin-bottom:10px;"><i data-lucide="activity" style="width:12px;height:12px;color:var(--emerald-500);"></i>情绪指数</div>
            <div style="display:flex;align-items:center;gap:10px;">
              <div style="width:64px;height:64px;border-radius:50%;background:conic-gradient(var(--emerald-500) 0deg 252deg, var(--ink-100) 252deg 360deg);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <div style="width:48px;height:48px;border-radius:50%;background:var(--bg-card);display:flex;align-items:center;justify-content:center;flex-direction:column;">
                  <span style="font-size:16px;font-weight:700;color:var(--emerald-600);line-height:1;">72</span>
                  <span style="font-size:8px;color:var(--text-muted);">积极</span>
                </div>
              </div>
              <div style="flex:1;font-size:11px;color:var(--text-secondary);line-height:1.6;">
                <div style="color:var(--emerald-600);font-weight:500;margin-bottom:2px;">✓ 兴趣高涨</div>
                建议AI继续推进约见意向，适时提出线下邀约
              </div>
            </div>
          </div>

          <!-- Suggested Actions -->
          <div class="card" style="padding:12px;">
            <div class="card-title" style="font-size:11px;margin-bottom:8px;"><i data-lucide="lightbulb" style="width:12px;height:12px;color:var(--amber-500);"></i>AI话术建议</div>
            <div style="display:flex;flex-direction:column;gap:5px;">
              ${[
                {icon:'thumbs-up',text:'肯定对方学历背景，拉近距离',hot:true},
                {icon:'calendar',text:'试探周末时间，铺垫线下见',hot:false},
                {icon:'user-plus',text:'顺势提出加微信，发资料',hot:true}
              ].map((a,i) => `
                <button class="btn btn-ghost btn-sm" style="justify-content:flex-start;padding:6px 8px;font-size:11px;height:auto;line-height:1.4;text-align:left;background:${a.hot?'var(--brand-50)':'transparent'};border-color:${a.hot?'var(--brand-100)':'transparent'};">
                  <i data-lucide="${a.icon}" style="width:11px;height:11px;margin-right:5px;color:${a.hot?'var(--brand-500)':'var(--text-muted)'};"></i>
                  <span style="flex:1;">${a.text}</span>
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- CENTER: Live Transcript -->
        <div class="card" style="display:flex;flex-direction:column;padding:0;overflow:hidden;">
          <div style="padding:10px 14px;border-bottom:1px solid var(--border-color);display:flex;align-items:center;justify-content:space-between;">
            <div class="card-title" style="font-size:11px;margin:0;"><i data-lucide="message-square-text" style="width:12px;height:12px;color:var(--brand-500);"></i>实时对话流 (ASR + LLM)</div>
            <div style="display:flex;gap:4px;">
              <button class="btn btn-ghost btn-sm" style="height:24px;padding:0 6px;font-size:10px;"><i data-lucide="volume-2" style="width:11px;height:11px;"></i>监听</button>
              <button class="btn btn-ghost btn-sm" style="height:24px;padding:0 6px;font-size:10px;"><i data-lucide="mic-off" style="width:11px;height:11px;"></i>静默</button>
            </div>
          </div>
          <div id="transcript-container" style="flex:1;overflow-y:auto;padding:10px 14px;display:flex;flex-direction:column;gap:8px;background:var(--ink-50);">
            ${conv.messages.map(m => renderSimMessage(m)).join('')}
            <!-- AI speaking indicator -->
            <div class="msg-bubble ai" style="align-self:flex-start;display:flex;align-items:center;gap:6px;padding:8px 12px;">
              <div class="typing-dots">
                <span></span><span></span><span></span>
              </div>
              <span style="font-size:11px;color:var(--text-muted);">AI思考中...</span>
            </div>
          </div>
        </div>

        <!-- RIGHT: Real-time Metrics -->
        <div style="display:flex;flex-direction:column;gap:var(--content-gap);">
          <!-- Turn Metrics -->
          <div class="card" style="padding:12px;">
            <div class="card-title" style="font-size:11px;margin-bottom:8px;"><i data-lucide="gauge" style="width:12px;height:12px;color:var(--violet-500);"></i>本轮指标</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              ${[
                {val:'12',label:'对话轮次',color:'var(--text-main)'},
                {val:'87%',label:'应答自然度',color:'var(--emerald-600)'},
                {val:'0.4s',label:'ASR延迟',color:'var(--brand-600)'},
                {val:'2.1s',label:'LLM响应',color:'var(--violet-600)'}
              ].map(k => `
                <div style="padding:6px 8px;background:var(--ink-50);border-radius:var(--radius-md);">
                  <div style="font-size:15px;font-weight:700;color:${k.color};font-variant-numeric:tabular-nums;line-height:1.2;">${k.val}</div>
                  <div style="font-size:10px;color:var(--text-muted);margin-top:1px;">${k.label}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Keywords Extracted -->
          <div class="card" style="padding:12px;">
            <div class="card-title" style="font-size:11px;margin-bottom:8px;"><i data-lucide="key" style="width:12px;height:12px;color:var(--amber-500);"></i>提取关键词</div>
            <div style="display:flex;flex-direction:column;gap:3px;font-size:11px;">
              ${[
                {k:'学历要求',v:'985/211本科+'},
                {k:'年龄范围',v:'28-33岁'},
                {k:'地域偏好',v:'杭州主城区'},
                {k:'职业偏好',v:'体制内/教师'},
                {k:'身高要求',v:'160cm以上'}
              ].map(r => `
                <div style="display:flex;justify-content:space-between;gap:6px;padding:3px 0;border-bottom:1px solid var(--border-subtle);">
                  <span style="color:var(--text-muted);">${r.k}</span>
                  <span style="color:var(--text-main);font-weight:500;">${r.v}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Lead Score -->
          <div class="card" style="padding:12px;">
            <div class="card-title" style="font-size:11px;margin-bottom:8px;"><i data-lucide="star" style="width:12px;height:12px;color:var(--rose-500);"></i>意向评分预测</div>
            <div style="text-align:center;padding:6px 0;">
              <div style="font-size:32px;font-weight:800;background:linear-gradient(135deg,var(--brand-500),var(--violet-500));-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-variant-numeric:tabular-nums;line-height:1;">S · 92</div>
              <div style="font-size:10.5px;color:var(--text-muted);margin-top:4px;">高意向，通话结束后自动推送至红娘待办</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderSimMessage(m) {
  if (m.role === 'ai') {
    return `
      <div style="display:flex;gap:6px;align-items:flex-start;">
        <div style="width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,var(--brand-500),var(--violet-500));color:#fff;display:flex;align-items:center;justify-content:center;font-size:9px;flex-shrink:0;">AI</div>
        <div class="msg-bubble ai" style="max-width:75%;">
          <div style="font-size:12px;line-height:1.6;">${m.text}</div>
          <div style="font-size:9.5px;color:var(--text-muted);margin-top:3px;font-variant-numeric:tabular-nums;">${m.time} · ${m.emotion}</div>
        </div>
      </div>
    `;
  } else {
    return `
      <div style="display:flex;gap:6px;align-items:flex-start;justify-content:flex-end;flex-direction:row-reverse;">
        <div style="width:22px;height:22px;border-radius:50%;background:var(--ink-200);color:var(--text-main);display:flex;align-items:center;justify-content:center;font-size:9px;flex-shrink:0;">王</div>
        <div class="msg-bubble human" style="max-width:75%;">
          <div style="font-size:12px;line-height:1.6;">${m.text}</div>
          <div style="font-size:9.5px;color:var(--text-muted);margin-top:3px;text-align:right;font-variant-numeric:tabular-nums;">${m.time} · ${m.emotion}</div>
        </div>
      </div>
    `;
  }
}

window.SimulatorView = SimulatorView;
