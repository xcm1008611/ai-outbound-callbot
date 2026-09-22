// View: Campaign Monitor (实时外呼任务监控) - 高密度运营监控大屏

const CampaignMonitorView = {
  render() {
    return renderCampaignMonitorView();
  }
};

// ── Refresh State ──
let _autoRefreshPaused = false;

// ── Deterministic Mock Data per Campaign ──
function getMonitorData(campaignId) {
  const seed = campaignId.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  const isFirst = campaignId === 'CAMP-202608-01';

  if (isFirst) {
    return {
      totalLeads: 1200,
      waiting: 354,
      dialing: 30,
      connected: 685,
      effective: 412,
      highIntent: 228,
      transferred: 186,
      failed: 131,
      unsubscribed: 2,
      concurrency: { current: 30, max: 50 },
      lineHealth: { green: 4, amber: 0, total: 4 },
      avgRingWait: '2.3s',
      asrLatency: '168ms',
      ttsLatency: '145ms',
      estMinutes: 3842,
      estCost: 576,
      startTime: '09:32:15',
      duration: '2h 14m',
      activeCalls: [
        { phone: '138****5678', lead: '王建国', status: 'ringing', statusText: '振铃中', elapsed: '00:08', node: '开场白', intentChange: '—', queue: '默认线路' },
        { phone: '139****2341', lead: '李思远', status: 'ringing', statusText: '振铃中', elapsed: '00:03', node: '呼叫建立', intentChange: '—', queue: '默认线路' },
        { phone: '137****8902', lead: '张雨桐', status: 'ai_talking', statusText: 'AI应答中', elapsed: '01:24', node: '需求挖掘', intentChange: 'B→A', queue: 'AI-01' },
        { phone: '136****4521', lead: '陈明轩', status: 'ai_talking', statusText: 'AI应答中', elapsed: '02:47', node: '加微铺垫', intentChange: 'A→S', queue: 'AI-02' },
        { phone: '135****7834', lead: '赵雅婷', status: 'ai_talking', statusText: 'AI应答中', elapsed: '00:52', node: '开场破冰', intentChange: '—', queue: 'AI-03' },
        { phone: '186****1129', lead: '周逸飞', status: 'ai_talking', statusText: 'AI应答中', elapsed: '03:15', node: '异议处理', intentChange: 'B→A', queue: 'AI-01' },
        { phone: '150****6789', lead: '宋佳颖', status: 'ai_talking', statusText: 'AI应答中', elapsed: '01:08', node: '意向确认', intentChange: 'C→B', queue: 'AI-02' },
        { phone: '133****9901', lead: '黄志豪', status: 'transfer_queue', statusText: '转人工排队', elapsed: '00:12', node: '等待坐席', intentChange: 'S', queue: '红娘-林晓梅' },
        { phone: '188****3321', lead: '赵子涵', status: 'transferred', statusText: '已转人工', elapsed: '04:32', node: '红娘深度沟通', intentChange: 'A', queue: '红娘-苏雨薇' },
        { phone: '136****5512', lead: '吴承翰', status: 'transferred', statusText: '已转人工', elapsed: '02:58', node: '服务介绍', intentChange: 'S', queue: '红娘-林晓梅' }
      ],
      exceptions: [
        { type: 'asr_timeout', label: 'ASR识别超时', count: 1, severity: 'warn' },
        { type: 'transfer_queue', label: '转人工排队', count: 3, severity: 'warn' },
        { type: 'wait_redial', label: '等待重拨', count: 2, severity: 'info' }
      ],
      events: [
        { time: '11:46:32', icon: 'phone-incoming', text: '136****5512 接通，AI开始对话', tag: 'info' },
        { time: '11:46:18', icon: 'arrow-right-left', text: '188****3321 转人工成功，分配至苏雨薇', tag: 'success' },
        { time: '11:45:55', icon: 'alert-circle', text: 'ASR识别超时(>3s)，已自动重试', tag: 'warn' },
        { time: '11:45:41', icon: 'user-plus', text: '133****9901 判定S级高意向，触发转人工', tag: 'success' },
        { time: '11:45:20', icon: 'phone-missed', text: '158****3421 空号，标记为无效号码', tag: 'error' },
        { time: '11:44:58', icon: 'phone-outgoing', text: '新批次30个号码已下发至拨号器', tag: 'info' },
        { time: '11:44:33', icon: 'clock', text: '转人工队列等待数超过阈值(≥3)', tag: 'warn' },
        { time: '11:44:10', icon: 'thumbs-up', text: '186****1129 意向升级 B→A', tag: 'success' },
        { time: '11:43:45', icon: 'refresh-cw', text: '177****6623 忙线，已加入重拨队列', tag: 'info' },
        { time: '11:43:22', icon: 'ban', text: '135****0019 用户要求退订，已加入黑名单', tag: 'error' },
        { time: '11:42:58', icon: 'phone-off', text: '159****8871 通话结束，时长3分15秒，A级意向', tag: 'info' },
        { time: '11:42:30', icon: 'zap', text: '并发数调整为30路(原25路)', tag: 'info' }
      ]
    };
  }

  // Generic fallback deterministic data
  const totalLeads = 800 + (seed % 2000);
  const progress = 30 + (seed % 60);
  const called = Math.round(totalLeads * progress / 100);
  const connected = Math.round(called * (0.6 + (seed % 20) / 100));
  const effective = Math.round(connected * (0.5 + (seed % 20) / 100));
  const highIntent = Math.round(effective * (0.4 + (seed % 20) / 100));
  const transferred = Math.round(highIntent * 0.8);
  const failed = Math.round(called * 0.12);
  const unsubscribed = seed % 8;
  const waiting = totalLeads - called;
  const dialing = 15 + (seed % 30);
  const concurMax = 30 + (seed % 30);
  const concurCur = Math.round(concurMax * 0.6);

  return {
    totalLeads, waiting, dialing, connected, effective, highIntent, transferred, failed, unsubscribed,
    concurrency: { current: concurCur, max: concurMax },
    lineHealth: { green: 3 + (seed % 2), amber: seed % 2, total: 4 },
    avgRingWait: `${(1.5 + (seed % 20) / 10).toFixed(1)}s`,
    asrLatency: `${140 + (seed % 80)}ms`,
    ttsLatency: `${120 + (seed % 60)}ms`,
    estMinutes: Math.round(connected * 2.8),
    estCost: Math.round(connected * 0.45),
    startTime: '09:00:00',
    duration: `${1 + (seed % 5)}h ${seed % 60}m`,
    activeCalls: generateActiveCalls(seed),
    exceptions: [
      { type: 'asr_timeout', label: 'ASR识别超时', count: seed % 3, severity: 'warn' },
      { type: 'transfer_queue', label: '转人工排队', count: 1 + (seed % 4), severity: 'warn' },
      { type: 'wait_redial', label: '等待重拨', count: 1 + (seed % 5), severity: 'info' }
    ],
    events: generateEvents(seed)
  };
}

function generateActiveCalls(seed) {
  const surnames = ['王','李','张','陈','赵','刘','黄','周','吴','徐'];
  const names = ['建国','思远','雨桐','明轩','雅婷','逸飞','佳颖','志豪','承翰','子涵'];
  const statuses = ['ringing','ringing','ai_talking','ai_talking','ai_talking','ai_talking','ai_talking','transfer_queue','transferred','transferred'];
  const nodes = {
    ringing: ['呼叫建立','开场白'],
    ai_talking: ['开场破冰','需求挖掘','加微铺垫','异议处理','意向确认'],
    transfer_queue: ['等待坐席'],
    transferred: ['红娘深度沟通','服务介绍','邀约确认']
  };
  const intents = { ringing: '—', ai_talking: ['—','B→A','A→S','C→B','B→A'], transfer_queue: ['S','A'], transferred: ['S','A'] };
  const queues = { ringing: '默认线路', ai_talking: ['AI-01','AI-02','AI-03'], transfer_queue: '红娘排队中', transferred: ['红娘-林晓梅','红娘-苏雨薇','红娘-周敏'] };

  const statusText = { ringing:'振铃中', ai_talking:'AI应答中', transfer_queue:'转人工排队', transferred:'已转人工' };
  const pick = (arr, i) => arr[(seed + i) % arr.length];

  return Array.from({length: 10}, (_, i) => {
    const s = statuses[i];
    return {
      phone: `13${5 + (seed+i)%5}****${String(1000 + ((seed+i*7)%9000)).slice(-4)}`,
      lead: surnames[(seed+i)%10] + names[(seed+i*3)%10],
      status: s,
      statusText: statusText[s],
      elapsed: `${String(Math.floor((seed*3+i*37)%8)).padStart(2,'0')}:${String(((seed*7+i*13)%60)).padStart(2,'0')}`,
      node: Array.isArray(nodes[s]) ? pick(nodes[s], i) : nodes[s],
      intentChange: Array.isArray(intents[s]) ? pick(intents[s], i) : intents[s],
      queue: Array.isArray(queues[s]) ? pick(queues[s], i) : queues[s]
    };
  });
}

function generateEvents(seed) {
  const templates = [
    { icon: 'phone-incoming', text: '{phone} 接通，AI开始对话', tag: 'info' },
    { icon: 'arrow-right-left', text: '{phone} 转人工成功', tag: 'success' },
    { icon: 'alert-circle', text: 'ASR识别超时，已自动重试', tag: 'warn' },
    { icon: 'user-plus', text: '{phone} 判定S级高意向，触发转人工', tag: 'success' },
    { icon: 'phone-missed', text: '{phone} 空号/关机，标记无效', tag: 'error' },
    { icon: 'phone-outgoing', text: '新批次号码已下发至拨号器', tag: 'info' },
    { icon: 'clock', text: '转人工队列等待数超过阈值', tag: 'warn' },
    { icon: 'thumbs-up', text: '{phone} 意向升级 B→A', tag: 'success' },
    { icon: 'refresh-cw', text: '{phone} 忙线，已加入重拨队列', tag: 'info' },
    { icon: 'ban', text: '{phone} 用户退订，加入黑名单', tag: 'error' },
    { icon: 'phone-off', text: '{phone} 通话结束', tag: 'info' },
    { icon: 'zap', text: '并发数动态调整', tag: 'info' }
  ];
  const now = new Date();
  return Array.from({length: 12}, (_, i) => {
    const t = new Date(now.getTime() - (11 - i) * 22000 - (seed % 30) * 1000);
    const hh = String(t.getHours()).padStart(2,'0');
    const mm = String(t.getMinutes()).padStart(2,'0');
    const ss = String(t.getSeconds()).padStart(2,'0');
    const tmpl = templates[(seed + i) % templates.length];
    const phone = `13${5 + (seed+i)%5}****${String(1000 + ((seed+i*11)%9000)).slice(-4)}`;
    return {
      time: `${hh}:${mm}:${ss}`,
      icon: tmpl.icon,
      text: tmpl.text.replace('{phone}', phone),
      tag: tmpl.tag
    };
  });
}

// ── Render ──
function renderCampaignMonitorView() {
  // Resolve campaign
  let campaignId = window._monitorCampaignId;
  let campaign;
  if (campaignId) {
    campaign = AppState.campaigns.find(c => c.id === campaignId);
  }
  if (!campaign) {
    campaign = AppState.campaigns.find(c => c.status === 'running') || AppState.campaigns[0];
    campaignId = campaign.id;
  }

  const data = getMonitorData(campaignId);
  const concurPct = Math.round((data.concurrency.current / data.concurrency.max) * 100);

  // Funnel stages
  const funnelStages = [
    { key: 'waiting', label: '待拨', value: data.waiting, color: 'gray' },
    { key: 'dialing', label: '呼叫中', value: data.dialing, color: 'brand' },
    { key: 'connected', label: '已接通', value: data.connected, color: 'brand' },
    { key: 'effective', label: '有效对话', value: data.effective, color: 'emerald' },
    { key: 'highIntent', label: '高意向', value: data.highIntent, color: 'emerald' },
    { key: 'transferred', label: '红娘接收', value: data.transferred, color: 'emerald' }
  ];
  const funnelMax = Math.max(...funnelStages.map(s => s.value), 1);

  // KPI metrics
  const kpis = [
    { label: '总名单', value: data.totalLeads, icon: 'users', color: 'default' },
    { label: '待拨', value: data.waiting, icon: 'clock', color: 'muted' },
    { label: '拨打中', value: data.dialing, icon: 'phone-call', color: 'brand' },
    { label: '已接通', value: data.connected, icon: 'phone-incoming', color: 'brand' },
    { label: '有效对话', value: data.effective, icon: 'message-square', color: 'emerald' },
    { label: '高意向', value: data.highIntent, icon: 'gem', color: 'violet' },
    { label: '转人工', value: data.transferred, icon: 'headphones', color: 'emerald' },
    { label: '失败', value: data.failed, icon: 'phone-missed', color: 'rose' },
    { label: '退订', value: data.unsubscribed, icon: 'user-x', color: 'rose' }
  ];

  // Status pill renderer for active calls
  function statusPillClass(status) {
    switch(status) {
      case 'ringing': return 'background:var(--amber-50);color:var(--amber-700);';
      case 'ai_talking': return 'background:var(--brand-50);color:var(--brand-700);';
      case 'transfer_queue': return 'background:var(--amber-50);color:var(--amber-700);';
      case 'transferred': return 'background:var(--emerald-50);color:var(--emerald-700);';
      default: return 'background:var(--ink-100);color:var(--ink-600);';
    }
  }
  function statusDotClass(status) {
    switch(status) {
      case 'ringing': return 'background:var(--amber-500);';
      case 'ai_talking': return 'background:var(--brand-500);animation:pulse-dot 1.5s infinite;';
      case 'transfer_queue': return 'background:var(--amber-500);animation:pulse-dot 1.5s infinite;';
      case 'transferred': return 'background:var(--emerald-500);';
      default: return 'background:var(--ink-400);';
    }
  }

  // Exception severity
  function exSeverityStyle(sev) {
    switch(sev) {
      case 'error': return 'background:var(--rose-50);color:var(--rose-700);border-left:3px solid var(--rose-500);';
      case 'warn': return 'background:var(--amber-50);color:var(--amber-700);border-left:3px solid var(--amber-500);';
      default: return 'background:var(--brand-50);color:var(--brand-700);border-left:3px solid var(--brand-500);';
    }
  }
  function exBadgeStyle(sev) {
    switch(sev) {
      case 'error': return 'background:var(--rose-500);color:#fff;';
      case 'warn': return 'background:var(--amber-500);color:#fff;';
      default: return 'background:var(--brand-500);color:#fff;';
    }
  }

  // Event tag style
  function eventTagStyle(tag) {
    switch(tag) {
      case 'success': return 'background:var(--emerald-50);color:var(--emerald-700);';
      case 'warn': return 'background:var(--amber-50);color:var(--amber-700);';
      case 'error': return 'background:var(--rose-50);color:var(--rose-700);';
      default: return 'background:var(--ink-100);color:var(--ink-600);';
    }
  }
  function eventIconColor(tag) {
    switch(tag) {
      case 'success': return 'var(--emerald-500)';
      case 'warn': return 'var(--amber-500)';
      case 'error': return 'var(--rose-500)';
      default: return 'var(--brand-500)';
    }
  }

  const statusLabel = campaign.status === 'running' ? '运行中' : campaign.status === 'paused' ? '已暂停' : campaign.status === 'completed' ? '已完成' : '草稿';
  const statusPillName = campaign.status === 'running' ? 'running' : campaign.status === 'paused' ? 'pending' : 'connected';

  return `
  <div class="view-fade-enter">

    <!-- Page Header -->
    <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:var(--content-gap);">
      <div style="display:flex;align-items:center;gap:10px;min-width:0;">
        <button class="btn btn-ghost btn-sm" onclick="App.navigate('campaigns')" style="padding:0 6px;height:28px;">
          <i data-lucide="arrow-left" style="width:14px;height:14px;"></i>
        </button>
        <div style="min-width:0;">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <span style="font-size:15px;font-weight:700;color:var(--text-main);letter-spacing:-0.2px;">实时外呼任务监控</span>
            <span class="badge" style="background:var(--amber-50);color:var(--amber-700);font-size:10px;line-height:16px;font-weight:600;">
              <i data-lucide="flask-conical" style="width:10px;height:10px;margin-right:2px;"></i>模拟运行
            </span>
            <span class="badge badge-neutral" style="font-size:10px;line-height:16px;">模拟数据</span>
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
            <span style="font-weight:600;color:var(--text-main);max-width:340px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${campaign.name}</span>
            <span style="font-family:var(--font-mono);font-size:10.5px;color:var(--text-muted);">${campaign.id}</span>
            <span class="status-pill status-${statusPillName}" style="font-size:10px;line-height:16px;padding:1px 7px;">
              <span class="status-pill-dot"></span>${statusLabel}
            </span>
            <span style="font-variant-numeric:tabular-nums;">启动 ${data.startTime} · 运行 ${data.duration}</span>
          </div>
        </div>
      </div>
      <div style="display:flex;gap:5px;flex-shrink:0;align-items:center;">
        <button class="btn btn-outline btn-sm" onclick="toggleMonitorRefresh()" id="monitor-refresh-btn" style="font-size:11px;height:28px;padding:0 10px;">
          <i data-lucide="${_autoRefreshPaused ? 'play' : 'pause'}" style="width:11px;height:11px;"></i>
          ${_autoRefreshPaused ? '恢复刷新' : '暂停刷新'}
        </button>
        <button class="btn btn-outline btn-sm" onclick="pauseCampaignFromMonitor()" style="font-size:11px;height:28px;padding:0 10px;color:var(--amber-700);border-color:var(--amber-200);">
          <i data-lucide="pause" style="width:11px;height:11px;"></i>
          暂停任务
        </button>
        <button class="btn btn-sm" onclick="stopCampaignFromMonitor()" style="font-size:11px;height:28px;padding:0 10px;background:var(--rose-500);color:#fff;">
          <i data-lucide="square" style="width:11px;height:11px;"></i>
          终止任务
        </button>
      </div>
    </div>

    <!-- KPI Row - 9 compact metric cards -->
    <div class="metrics-grid" style="grid-template-columns:repeat(9,1fr);margin-bottom:var(--content-gap);">
      ${kpis.map(k => {
        let accent = '';
        let numColor = 'var(--text-main)';
        let iconBg = 'var(--ink-50)';
        let iconColor = 'var(--ink-500)';
        if (k.color === 'brand') { iconBg='var(--brand-50)'; iconColor='var(--brand-600)'; numColor='var(--brand-600)'; }
        if (k.color === 'emerald') { iconBg='var(--emerald-50)'; iconColor='var(--emerald-600)'; numColor='var(--emerald-600)'; }
        if (k.color === 'violet') { iconBg='var(--violet-50)'; iconColor='var(--violet-600)'; numColor='var(--violet-600)'; }
        if (k.color === 'rose') { iconBg='var(--rose-50)'; iconColor='var(--rose-600)'; numColor='var(--rose-600)'; }
        if (k.color === 'muted') { iconBg='var(--ink-100)'; iconColor='var(--ink-500)'; numColor='var(--text-secondary)'; }
        return `
          <div class="metric-card" style="padding:8px 10px;min-height:52px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
              <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">${k.label}</span>
              <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:${iconBg};flex-shrink:0;">
                <i data-lucide="${k.icon}" style="width:11px;height:11px;color:${iconColor};"></i>
              </div>
            </div>
            <div style="font-size:18px;font-weight:700;color:${numColor};font-variant-numeric:tabular-nums;line-height:1.2;letter-spacing:-0.3px;">${k.value.toLocaleString()}</div>
          </div>
        `;
      }).join('')}
    </div>

    <!-- Real-time Funnel (horizontal stage bar) -->
    <div class="card" style="padding:12px 14px;margin-bottom:var(--content-gap);border-radius:var(--radius-md);">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
        <div style="display:flex;align-items:center;gap:6px;">
          <i data-lucide="filter" style="width:13px;height:13px;color:var(--brand-500);"></i>
          <span style="font-size:12px;font-weight:600;color:var(--text-main);">实时转化漏斗</span>
          <span class="live-dot" style="margin-left:2px;"></span>
        </div>
        <div style="display:flex;gap:10px;font-size:10.5px;color:var(--text-muted);">
          <span style="display:flex;align-items:center;gap:3px;"><span style="width:8px;height:8px;border-radius:2px;background:var(--emerald-500);display:inline-block;"></span>已转化</span>
          <span style="display:flex;align-items:center;gap:3px;"><span style="width:8px;height:8px;border-radius:2px;background:var(--brand-500);display:inline-block;"></span>进行中</span>
          <span style="display:flex;align-items:center;gap:3px;"><span style="width:8px;height:8px;border-radius:2px;background:var(--ink-300);display:inline-block;"></span>等待</span>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:0;">
        ${funnelStages.map((s, i) => {
          const wPct = (s.value / funnelMax) * 100;
          let barBg, textColor, labelColor;
          if (s.color === 'emerald') {
            barBg = 'linear-gradient(90deg,var(--emerald-500),var(--emerald-600))';
            textColor = '#fff';
            labelColor = 'var(--emerald-700)';
          } else if (s.color === 'brand') {
            barBg = 'linear-gradient(90deg,var(--brand-500),var(--brand-600))';
            textColor = '#fff';
            labelColor = 'var(--brand-700)';
          } else {
            barBg = 'var(--ink-200)';
            textColor = 'var(--ink-500)';
            labelColor = 'var(--text-muted)';
          }
          const pct = ((s.value / data.totalLeads) * 100).toFixed(1);
          const isLast = i === funnelStages.length - 1;
          return `
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;min-width:0;">
              <div style="font-size:10.5px;font-weight:600;color:${labelColor};font-variant-numeric:tabular-nums;">${s.value.toLocaleString()} <span style="font-weight:400;font-size:9.5px;color:var(--text-muted);">${pct}%</span></div>
              <div style="width:100%;height:24px;background:var(--ink-100);border-radius:var(--radius-sm);position:relative;overflow:hidden;">
                <div style="width:${Math.max(wPct,8)}%;height:100%;background:${barBg};border-radius:var(--radius-sm);display:flex;align-items:center;padding:0 6px;transition:width 0.6s ease;">
                  ${wPct > 20 ? `<span style="font-size:10px;font-weight:600;color:${textColor};font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${s.value.toLocaleString()}</span>` : ''}
                </div>
              </div>
              <div style="font-size:10.5px;color:var(--text-secondary);font-weight:500;display:flex;align-items:center;gap:2px;">
                ${s.label}
              </div>
            </div>
            ${!isLast ? `<div style="color:var(--ink-300);padding:0 2px;flex-shrink:0;margin-bottom:18px;"><i data-lucide="chevron-right" style="width:12px;height:12px;"></i></div>` : ''}
          `;
        }).join('')}
      </div>
    </div>

    <!-- 2-column grid: LEFT (wider) + RIGHT (narrower) -->
    <div style="display:grid;grid-template-columns:1fr 320px;gap:var(--content-gap);margin-bottom:var(--content-gap);">

      <!-- LEFT COLUMN -->
      <div style="display:flex;flex-direction:column;gap:var(--content-gap);min-width:0;">

        <!-- Runtime Status Card -->
        <div class="card" style="padding:12px 14px;border-radius:var(--radius-md);">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
            <div style="display:flex;align-items:center;gap:6px;">
              <i data-lucide="activity" style="width:13px;height:13px;color:var(--brand-500);"></i>
              <span style="font-size:12px;font-weight:600;color:var(--text-main);">运行时状态</span>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px;">
            <!-- Concurrency -->
            <div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
                <span style="font-size:10.5px;color:var(--text-muted);">并发线路</span>
                <span style="font-size:11px;font-weight:700;color:var(--brand-600);font-variant-numeric:tabular-nums;">${data.concurrency.current}/${data.concurrency.max}</span>
              </div>
              <div style="height:5px;background:var(--ink-100);border-radius:3px;overflow:hidden;">
                <div style="width:${concurPct}%;height:100%;background:linear-gradient(90deg,var(--brand-500),var(--violet-500));border-radius:3px;"></div>
              </div>
            </div>
            <!-- Line Health -->
            <div>
              <div style="font-size:10.5px;color:var(--text-muted);margin-bottom:4px;">线路健康</div>
              <div style="display:flex;align-items:center;gap:3px;">
                ${Array.from({length: data.lineHealth.total}, (_, i) => {
                  const isGreen = i < data.lineHealth.green;
                  return `<span style="width:10px;height:10px;border-radius:50%;background:${isGreen?'var(--emerald-500)':'var(--amber-500)'};display:inline-block;"></span>`;
                }).join('')}
                <span style="font-size:10px;color:var(--emerald-600);font-weight:600;margin-left:4px;font-variant-numeric:tabular-nums;">${data.lineHealth.green}/${data.lineHealth.total}</span>
              </div>
            </div>
            <!-- Avg Ring Wait -->
            <div>
              <div style="font-size:10.5px;color:var(--text-muted);margin-bottom:4px;">平均振铃等待</div>
              <div style="font-size:13px;font-weight:700;color:var(--text-main);font-variant-numeric:tabular-nums;">${data.avgRingWait}</div>
            </div>
            <!-- ASR Status -->
            <div>
              <div style="font-size:10.5px;color:var(--text-muted);margin-bottom:4px;">ASR延迟</div>
              <div style="display:flex;align-items:center;gap:4px;">
                <span style="width:6px;height:6px;border-radius:50%;background:var(--emerald-500);display:inline-block;"></span>
                <span style="font-size:13px;font-weight:700;color:var(--emerald-600);font-variant-numeric:tabular-nums;">${data.asrLatency}</span>
              </div>
            </div>
            <!-- TTS Status -->
            <div>
              <div style="font-size:10.5px;color:var(--text-muted);margin-bottom:4px;">TTS延迟</div>
              <div style="display:flex;align-items:center;gap:4px;">
                <span style="width:6px;height:6px;border-radius:50%;background:var(--emerald-500);display:inline-block;"></span>
                <span style="font-size:13px;font-weight:700;color:var(--emerald-600);font-variant-numeric:tabular-nums;">${data.ttsLatency}</span>
              </div>
            </div>
            <!-- Est Minutes -->
            <div>
              <div style="font-size:10.5px;color:var(--text-muted);margin-bottom:4px;">累计通话分钟</div>
              <div style="font-size:13px;font-weight:700;color:var(--text-main);font-variant-numeric:tabular-nums;">${data.estMinutes.toLocaleString()}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">分</span></div>
            </div>
            <!-- Est Cost -->
            <div>
              <div style="font-size:10.5px;color:var(--text-muted);margin-bottom:4px;">预估费用</div>
              <div style="font-size:13px;font-weight:700;color:var(--violet-600);font-variant-numeric:tabular-nums;">¥${data.estCost.toLocaleString()}</div>
            </div>
            <!-- Throughput rate -->
            <div>
              <div style="font-size:10.5px;color:var(--text-muted);margin-bottom:4px;">处理速率</div>
              <div style="font-size:13px;font-weight:700;color:var(--text-main);font-variant-numeric:tabular-nums;">4.2<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">通/分</span></div>
            </div>
          </div>
        </div>

        <!-- Active Calls Table -->
        <div class="card" style="padding:0;border-radius:var(--radius-md);overflow:hidden;flex:1;">
          <div style="padding:10px 14px;border-bottom:1px solid var(--border-subtle);display:flex;align-items:center;justify-content:space-between;background:var(--bg-card);">
            <div style="display:flex;align-items:center;gap:6px;">
              <i data-lucide="list-phone" style="width:13px;height:13px;color:var(--brand-500);"></i>
              <span style="font-size:12px;font-weight:600;color:var(--text-main);">实时通话列表</span>
              <span class="badge" style="background:var(--brand-50);color:var(--brand-700);font-size:10px;line-height:15px;">${data.activeCalls.length}路</span>
            </div>
            <span style="font-size:10px;color:var(--text-muted);display:flex;align-items:center;gap:4px;">
              <span class="live-dot"></span>实时更新
            </span>
          </div>
          <div style="overflow-x:auto;">
            <table style="width:100%;font-size:11.5px;">
              <thead>
                <tr style="background:var(--ink-50);">
                  <th style="padding:6px 10px;text-align:left;font-weight:600;font-size:10.5px;color:var(--ink-500);border-bottom:1px solid var(--ink-200);white-space:nowrap;">脱敏号码</th>
                  <th style="padding:6px 10px;text-align:left;font-weight:600;font-size:10.5px;color:var(--ink-500);border-bottom:1px solid var(--ink-200);white-space:nowrap;">潜客</th>
                  <th style="padding:6px 10px;text-align:left;font-weight:600;font-size:10.5px;color:var(--ink-500);border-bottom:1px solid var(--ink-200);white-space:nowrap;">当前状态</th>
                  <th style="padding:6px 10px;text-align:left;font-weight:600;font-size:10.5px;color:var(--ink-500);border-bottom:1px solid var(--ink-200);white-space:nowrap;">已用时</th>
                  <th style="padding:6px 10px;text-align:left;font-weight:600;font-size:10.5px;color:var(--ink-500);border-bottom:1px solid var(--ink-200);white-space:nowrap;">当前节点</th>
                  <th style="padding:6px 10px;text-align:left;font-weight:600;font-size:10.5px;color:var(--ink-500);border-bottom:1px solid var(--ink-200);white-space:nowrap;">意向变化</th>
                  <th style="padding:6px 10px;text-align:left;font-weight:600;font-size:10.5px;color:var(--ink-500);border-bottom:1px solid var(--ink-200);white-space:nowrap;">队列</th>
                  <th style="padding:6px 10px;text-align:center;font-weight:600;font-size:10.5px;color:var(--ink-500);border-bottom:1px solid var(--ink-200);white-space:nowrap;">操作</th>
                </tr>
              </thead>
              <tbody>
                ${data.activeCalls.map((c, i) => `
                  <tr style="border-bottom:1px solid var(--border-subtle);transition:background 0.15s;" onmouseover="this.style.background='var(--ink-50)'" onmouseout="this.style.background=''">
                    <td style="padding:6px 10px;font-family:var(--font-mono);font-size:11px;color:var(--text-secondary);font-variant-numeric:tabular-nums;white-space:nowrap;">${c.phone}</td>
                    <td style="padding:6px 10px;font-weight:500;color:var(--text-main);font-size:11.5px;white-space:nowrap;">${c.lead}</td>
                    <td style="padding:6px 10px;">
                      <span class="status-pill" style="${statusPillClass(c.status)}font-size:10px;line-height:16px;padding:1px 7px;">
                        <span class="status-pill-dot" style="${statusDotClass(c.status)}width:5px;height:5px;border-radius:50%;"></span>
                        ${c.statusText}
                      </span>
                    </td>
                    <td style="padding:6px 10px;font-family:var(--font-mono);font-size:11px;font-weight:600;color:var(--text-main);font-variant-numeric:tabular-nums;white-space:nowrap;">${c.elapsed}</td>
                    <td style="padding:6px 10px;font-size:11px;color:var(--text-secondary);white-space:nowrap;">${c.node}</td>
                    <td style="padding:6px 10px;font-size:11px;font-weight:600;white-space:nowrap;">
                      ${c.intentChange === '—' ? `<span style="color:var(--text-muted);">—</span>` :
                        c.intentChange.includes('S') ? `<span style="color:var(--rose-600);">${c.intentChange}</span>` :
                        `<span style="color:var(--emerald-600);">${c.intentChange}</span>`}
                    </td>
                    <td style="padding:6px 10px;font-size:10.5px;color:var(--text-muted);white-space:nowrap;">${c.queue}</td>
                    <td style="padding:6px 10px;text-align:center;">
                      <button class="btn btn-ghost btn-sm" onclick="App.showToast('旁听功能演示中','info')" style="height:22px;padding:0 8px;font-size:10px;color:var(--brand-600);border:1px solid var(--brand-200);border-radius:var(--radius-sm);background:var(--brand-50);">
                        <i data-lucide="ear" style="width:10px;height:10px;margin-right:2px;"></i>旁听
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN -->
      <div style="display:flex;flex-direction:column;gap:var(--content-gap);min-width:0;">

        <!-- Exception Panel -->
        <div class="card" style="padding:12px 14px;border-radius:var(--radius-md);">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
            <div style="display:flex;align-items:center;gap:6px;">
              <i data-lucide="alert-triangle" style="width:13px;height:13px;color:var(--amber-500);"></i>
              <span style="font-size:12px;font-weight:600;color:var(--text-main);">异常监控</span>
            </div>
            <span style="font-size:10px;color:var(--text-muted);">${data.exceptions.reduce((s,e)=>s+e.count,0)}个活跃</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px;">
            ${data.exceptions.map(ex => `
              <div style="display:flex;align-items:center;justify-content:space-between;padding:7px 10px;border-radius:var(--radius-sm);${exSeverityStyle(ex.severity)}">
                <div style="display:flex;align-items:center;gap:6px;min-width:0;">
                  <i data-lucide="${ex.severity==='error'?'x-circle':ex.severity==='warn'?'alert-circle':'info'}" style="width:12px;height:12px;flex-shrink:0;"></i>
                  <span style="font-size:11px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${ex.label}</span>
                </div>
                <span style="font-size:10px;font-weight:700;padding:1px 7px;border-radius:10px;${exBadgeStyle(ex.severity)}font-variant-numeric:tabular-nums;flex-shrink:0;margin-left:6px;">${ex.count}</span>
              </div>
            `).join('')}
            <!-- Additional: line congestion (0 in this case but show as OK) -->
            <div style="display:flex;align-items:center;justify-content:space-between;padding:7px 10px;border-radius:var(--radius-sm);background:var(--emerald-50);color:var(--emerald-700);border-left:3px solid var(--emerald-500);">
              <div style="display:flex;align-items:center;gap:6px;">
                <i data-lucide="check-circle" style="width:12px;height:12px;flex-shrink:0;"></i>
                <span style="font-size:11px;font-weight:500;">线路拥塞</span>
              </div>
              <span style="font-size:10px;font-weight:700;padding:1px 7px;border-radius:10px;background:var(--emerald-500);color:#fff;font-variant-numeric:tabular-nums;flex-shrink:0;margin-left:6px;">0</span>
            </div>
          </div>
        </div>

        <!-- Event Log -->
        <div class="card" style="padding:0;border-radius:var(--radius-md);overflow:hidden;flex:1;display:flex;flex-direction:column;min-height:0;">
          <div style="padding:10px 14px;border-bottom:1px solid var(--border-subtle);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;background:var(--bg-card);">
            <div style="display:flex;align-items:center;gap:6px;">
              <i data-lucide="scroll-text" style="width:13px;height:13px;color:var(--brand-500);"></i>
              <span style="font-size:12px;font-weight:600;color:var(--text-main);">事件日志</span>
            </div>
            <span style="font-size:10px;color:var(--text-muted);font-variant-numeric:tabular-nums;">近5分钟</span>
          </div>
          <div style="flex:1;overflow-y:auto;padding:4px 0;min-height:280px;max-height:340px;">
            ${data.events.map(ev => `
              <div style="display:flex;align-items:flex-start;gap:7px;padding:5px 12px;border-bottom:1px solid var(--border-subtle);">
                <span style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);font-variant-numeric:tabular-nums;padding-top:2px;flex-shrink:0;width:48px;">${ev.time}</span>
                <i data-lucide="${ev.icon}" style="width:12px;height:12px;color:${eventIconColor(ev.tag)};flex-shrink:0;margin-top:2px;"></i>
                <span style="font-size:11px;color:var(--text-secondary);flex:1;line-height:1.5;min-width:0;">${ev.text}</span>
                <span style="font-size:9.5px;padding:1px 5px;border-radius:3px;font-weight:500;flex-shrink:0;line-height:15px;${eventTagStyle(ev.tag)}">${ev.tag==='info'?'信息':ev.tag==='success'?'成功':ev.tag==='warn'?'告警':'错误'}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom: filter tabs + refresh indicator -->
    <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:var(--radius-md);">
      <div style="display:flex;align-items:center;gap:2px;">
        <button class="tab-btn active" onclick="monitorFilterEvents(this,'all')" style="height:26px;padding:0 10px;font-size:11px;">
          <i data-lucide="list" style="width:11px;height:11px;"></i>全部
        </button>
        <button class="tab-btn" onclick="monitorFilterEvents(this,'warn')" style="height:26px;padding:0 10px;font-size:11px;">
          <i data-lucide="alert-triangle" style="width:11px;height:11px;"></i>异常
        </button>
        <button class="tab-btn" onclick="monitorFilterEvents(this,'transfer')" style="height:26px;padding:0 10px;font-size:11px;">
          <i data-lucide="arrow-right-left" style="width:11px;height:11px;"></i>转人工
        </button>
        <button class="tab-btn" onclick="monitorFilterEvents(this,'success')" style="height:26px;padding:0 10px;font-size:11px;">
          <i data-lucide="check-circle" style="width:11px;height:11px;"></i>完成
        </button>
        <button class="tab-btn" onclick="monitorFilterEvents(this,'error')" style="height:26px;padding:0 10px;font-size:11px;">
          <i data-lucide="x-circle" style="width:11px;height:11px;"></i>失败
        </button>
      </div>
      <div style="display:flex;align-items:center;gap:8px;font-size:10.5px;color:var(--text-muted);">
        <span style="display:flex;align-items:center;gap:4px;">
          <span class="${_autoRefreshPaused?'':'live-dot'}" style="${_autoRefreshPaused?'background:var(--ink-400);':''}"></span>
          ${_autoRefreshPaused ? '已暂停' : '自动刷新中'}
        </span>
        <span style="color:var(--border-color);">|</span>
        <span style="font-variant-numeric:tabular-nums;" id="monitor-refresh-time">2秒前刷新</span>
        <button class="btn btn-ghost btn-sm" onclick="App.refreshCurrentView()" style="height:24px;padding:0 6px;font-size:10px;color:var(--brand-600);">
          <i data-lucide="refresh-cw" style="width:10px;height:10px;"></i>
        </button>
      </div>
    </div>

  </div>`;
}

// ── Event filter tabs (demo - visual only) ──
function monitorFilterEvents(btn, type) {
  const group = btn.parentElement;
  group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  App.showToast(`已切换到：${btn.textContent.trim().replace(/<[^>]*>/g,'')}视图`, 'info');
}

// ── Global Functions ──

function openCampaignMonitor(campaignId) {
  window._monitorCampaignId = campaignId;
  App.navigate('campaign-monitor');
}

function toggleMonitorRefresh() {
  _autoRefreshPaused = !_autoRefreshPaused;
  App.showToast(_autoRefreshPaused ? '自动刷新已暂停' : '自动刷新已恢复', _autoRefreshPaused ? 'warning' : 'success');
  App.refreshCurrentView();
}

function pauseCampaignFromMonitor() {
  App.showModal({
    title: '暂停外呼任务',
    content: `
      <div style="font-size:12px;color:var(--text-secondary);line-height:1.6;">
        <div style="margin-bottom:10px;">确定要暂停当前外呼任务吗？</div>
        <div style="padding:8px 10px;background:var(--amber-50);border-radius:var(--radius-sm);border-left:3px solid var(--amber-500);font-size:11px;color:var(--amber-700);">
          <i data-lucide="alert-triangle" style="width:12px;height:12px;vertical-align:-2px;margin-right:4px;"></i>
          暂停后正在进行中的通话将继续至结束，不会立即挂断；待拨号码将暂停下发。
        </div>
      </div>
    `,
    confirmText: '确认暂停',
    onConfirm: () => {
      const cid = window._monitorCampaignId || (AppState.campaigns.find(c => c.status === 'running') || {}).id;
      if (cid) AppState.updateCampaignStatus(cid, 'paused');
      App.showToast('任务已暂停，当前通话将自然结束', 'warning');
      App.refreshCurrentView();
    }
  });
}

function stopCampaignFromMonitor() {
  App.showModal({
    title: '终止外呼任务',
    content: `
      <div style="font-size:12px;color:var(--text-secondary);line-height:1.6;">
        <div style="margin-bottom:10px;">确定要<strong style="color:var(--rose-600);">强制终止</strong>当前外呼任务吗？</div>
        <div style="padding:8px 10px;background:var(--rose-50);border-radius:var(--radius-sm);border-left:3px solid var(--rose-500);font-size:11px;color:var(--rose-700);margin-bottom:8px;">
          <i data-lucide="alert-octagon" style="width:12px;height:12px;vertical-align:-2px;margin-right:4px;"></i>
          终止后所有正在进行中的AI通话将立即挂断，转人工通话将保留。待拨号码将全部停止，操作不可撤销。
        </div>
        <label style="display:flex;align-items:center;gap:6px;font-size:11px;color:var(--text-main);cursor:pointer;">
          <input type="checkbox" id="stop-campaign-confirm" style="width:14px;height:14px;">
          我已知晓风险，确认终止
        </label>
      </div>
    `,
    confirmText: '确认终止',
    onConfirm: () => {
      const cid = window._monitorCampaignId || (AppState.campaigns.find(c => c.status === 'running') || {}).id;
      if (cid) AppState.updateCampaignStatus(cid, 'completed');
      App.showToast('任务已终止，所有AI线路已释放', 'error');
      App.refreshCurrentView();
    }
  });
}

window.CampaignMonitorView = CampaignMonitorView;
window.openCampaignMonitor = openCampaignMonitor;
window.toggleMonitorRefresh = toggleMonitorRefresh;
window.pauseCampaignFromMonitor = pauseCampaignFromMonitor;
window.stopCampaignFromMonitor = stopCampaignFromMonitor;
window.monitorFilterEvents = monitorFilterEvents;
