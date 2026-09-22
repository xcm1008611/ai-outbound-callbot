// View: Lines (线路与号码池) - SIP网关·主叫号码·并发管理·路由策略

// ── State ──────────────────────────────────────────────────
let _currentLineId = null;

// ── Mock Data ──────────────────────────────────────────────

const LINES_DATA = [
  {
    id: 'SIP-001',
    name: '杭州电信主线路-01',
    vendor: '中国电信',
    protocol: 'SIP',
    carrier: '电信',
    registerStatus: 'registered',
    healthStatus: 'normal',
    currentConcurrency: 45,
    maxConcurrency: 60,
    routeStrategy: '轮询',
    lastHealthCheck: '2026-08-20 14:58:02',
    enabled: true,
    sipServer: 'sip.hz.telecom.cn:5060',
    sipAccount: '86057188****01',
    sipPassword: '••••••••',
    sipTimeout: '30s',
    numberPool: [
      { number: '0571-88****12', location: '浙江杭州', todayCalls: 328, status: 'active' },
      { number: '0571-88****34', location: '浙江杭州', todayCalls: 256, status: 'active' },
      { number: '0571-88****56', location: '浙江杭州', todayCalls: 189, status: 'active' },
    ],
    poolExtra: 8,
    routeRules: '主线路，承载杭州地区所有外呼任务，按轮询策略分配号码，优先级最高。当并发超过55路时自动溢出到备用联通线路。',
    healthConfig: { interval: '30秒', timeout: '5秒', failThreshold: '3次' },
    activeTasks: ['杭州高意向客户回访', '萧山会员活动通知', '滨江新客首轮触达'],
    faultLogs: [
      { time: '2026-08-19 09:12:33', type: '瞬时延迟升高', recoverTime: '2026-08-19 09:13:05', duration: '32秒' },
      { time: '2026-08-17 14:22:18', type: '注册超时', recoverTime: '2026-08-17 14:23:01', duration: '43秒' },
    ],
  },
  {
    id: 'SIP-002',
    name: '杭州联通备用-02',
    vendor: '中国联通',
    protocol: 'SIP',
    carrier: '联通',
    registerStatus: 'registered',
    healthStatus: 'normal',
    currentConcurrency: 22,
    maxConcurrency: 30,
    routeStrategy: '主备',
    lastHealthCheck: '2026-08-20 14:58:05',
    enabled: true,
    sipServer: 'sip.hz.unicom.cn:5060',
    sipAccount: '86057186****02',
    sipPassword: '••••••••',
    sipTimeout: '30s',
    numberPool: [
      { number: '0571-86****78', location: '浙江杭州', todayCalls: 156, status: 'active' },
      { number: '0571-86****90', location: '浙江杭州', todayCalls: 134, status: 'active' },
    ],
    poolExtra: 3,
    routeRules: '备用线路，当主线路并发使用率超过90%或故障时自动接管。承载杭州地区溢出流量及联通号段优先路由。',
    healthConfig: { interval: '30秒', timeout: '5秒', failThreshold: '3次' },
    activeTasks: ['杭州高意向客户回访(溢出)'],
    faultLogs: [
      { time: '2026-08-18 22:03:41', type: '号码池不足告警', recoverTime: '2026-08-18 22:05:12', duration: '1分31秒' },
    ],
  },
  {
    id: 'SIP-003',
    name: '杭州移动线路-03',
    vendor: '中国移动',
    protocol: 'SIP',
    carrier: '移动',
    registerStatus: 'registered',
    healthStatus: 'degraded',
    currentConcurrency: 8,
    maxConcurrency: 30,
    routeStrategy: '按地区',
    lastHealthCheck: '2026-08-20 14:57:58',
    enabled: true,
    sipServer: 'sip.hz.mobile.cn:5060',
    sipAccount: '86057187****03',
    sipPassword: '••••••••',
    sipTimeout: '30s',
    numberPool: [
      { number: '0571-87****11', location: '浙江杭州', todayCalls: 67, status: 'active' },
      { number: '0571-87****22', location: '浙江杭州', todayCalls: 45, status: 'degraded' },
    ],
    poolExtra: 4,
    routeRules: '移动号段专属路由，承载移动号码外呼任务。当前因运营商侧QoS下降处于降级状态，系统自动降低该线路的分配权重至30%。',
    healthConfig: { interval: '30秒', timeout: '5秒', failThreshold: '3次' },
    activeTasks: ['余杭移动号段回访'],
    faultLogs: [
      { time: '2026-08-20 13:45:22', type: 'ASR异常下降(降级)', recoverTime: '—', duration: '持续中' },
      { time: '2026-08-20 13:50:18', type: '接通率低于阈值(62%)', recoverTime: '—', duration: '持续中' },
      { time: '2026-08-15 10:11:05', type: '注册超时', recoverTime: '2026-08-15 10:12:30', duration: '1分25秒' },
    ],
  },
  {
    id: 'SIP-004',
    name: '宁波电信-04',
    vendor: '中国电信',
    protocol: 'SIP',
    carrier: '电信',
    registerStatus: 'registered',
    healthStatus: 'congested',
    currentConcurrency: 58,
    maxConcurrency: 60,
    routeStrategy: '按地区',
    lastHealthCheck: '2026-08-20 14:58:01',
    enabled: true,
    sipServer: 'sip.nb.telecom.cn:5060',
    sipAccount: '86057488****04',
    sipPassword: '••••••••',
    sipTimeout: '30s',
    numberPool: [
      { number: '0574-88****01', location: '浙江宁波', todayCalls: 412, status: 'congested' },
      { number: '0574-88****02', location: '浙江宁波', todayCalls: 389, status: 'congested' },
      { number: '0574-88****03', location: '浙江宁波', todayCalls: 356, status: 'active' },
    ],
    poolExtra: 5,
    routeRules: '宁波地区专属线路，承载宁波、舟山地区外呼任务。当前并发使用率97%，处于拥塞状态，新任务将排队等待或自动转移。',
    healthConfig: { interval: '30秒', timeout: '5秒', failThreshold: '3次' },
    activeTasks: ['宁波老客户续费提醒', '舟山企业客户回访', '宁波新客首轮触达', '宁波会员活动邀约'],
    faultLogs: [
      { time: '2026-08-20 14:30:00', type: '并发拥塞(97%)', recoverTime: '—', duration: '持续中' },
      { time: '2026-08-20 14:35:12', type: '排队等待超过阈值', recoverTime: '—', duration: '持续中' },
    ],
  },
  {
    id: 'SIP-005',
    name: '固话网关测试-05',
    vendor: '小号平台',
    protocol: 'SIP',
    carrier: '小号',
    registerStatus: 'unregistered',
    healthStatus: 'offline',
    currentConcurrency: 0,
    maxConcurrency: 10,
    routeStrategy: '按任务',
    lastHealthCheck: '2026-08-20 14:55:33',
    enabled: false,
    sipServer: '192.168.**.**:5060',
    sipAccount: 'gateway****05',
    sipPassword: '••••••••',
    sipTimeout: '30s',
    numberPool: [
      { number: '0571-55****88', location: '浙江杭州', todayCalls: 0, status: 'offline' },
    ],
    poolExtra: 0,
    routeRules: '固话小号测试网关，仅用于内部测试及小号透传实验。当前网关离线，不参与生产任务路由。',
    healthConfig: { interval: '60秒', timeout: '10秒', failThreshold: '5次' },
    activeTasks: [],
    faultLogs: [
      { time: '2026-08-20 14:55:33', type: '网关注册失败(无响应)', recoverTime: '—', duration: '持续中' },
      { time: '2026-08-19 18:22:10', type: '心跳超时', recoverTime: '—', duration: '持续中' },
    ],
  },
  {
    id: 'SIP-006',
    name: '备用容灾线路-06',
    vendor: '多运营商聚合',
    protocol: 'SIP',
    carrier: '多运营商',
    registerStatus: 'pending',
    healthStatus: 'unverified',
    currentConcurrency: 0,
    maxConcurrency: 30,
    routeStrategy: '主备',
    lastHealthCheck: '—',
    enabled: false,
    sipServer: 'dr-***.sip.aggregate.cn:5060',
    sipAccount: 'dr-account****06',
    sipPassword: '••••••••',
    sipTimeout: '30s',
    numberPool: [
      { number: '0571-88****DR', location: '浙江杭州(容灾)', todayCalls: 0, status: 'pending' },
      { number: '0574-88****DR', location: '浙江宁波(容灾)', todayCalls: 0, status: 'pending' },
    ],
    poolExtra: 6,
    routeRules: '跨运营商容灾备用线路，当所有主用线路均不可用时自动激活。需POC环境核验通过后方可投入生产使用。',
    healthConfig: { interval: '60秒', timeout: '10秒', failThreshold: '5次' },
    activeTasks: [],
    faultLogs: [],
  },
];

const LINES_SUMMARY = {
  total: 6,
  healthy: 2,
  currentConcurrency: 133,
  maxConcurrency: 220,
  numberPoolCount: 42,
  todayFailRate: '2.3%',
  alerts: 3,
};

// ── Status Helpers ─────────────────────────────────────────

function registerStatusBadge(status) {
  const map = {
    registered:   { label:'已注册', bg:'var(--emerald-50)', text:'var(--emerald-700)', dot:'var(--emerald-500)' },
    unregistered: { label:'未注册', bg:'var(--rose-50)',    text:'var(--rose-700)',    dot:'var(--rose-500)' },
    pending:      { label:'待验证', bg:'var(--amber-50)',   text:'var(--amber-700)',   dot:'var(--amber-500)' },
  };
  const s = map[status] || map.pending;
  return `<span style="display:inline-flex;align-items:center;gap:3px;padding:1px 6px;border-radius:var(--radius-sm);font-size:10.5px;font-weight:500;background:${s.bg};color:${s.text};white-space:nowrap;"><span style="width:5px;height:5px;border-radius:50%;background:${s.dot};flex-shrink:0;"></span>${s.label}</span>`;
}

function healthStatusBadge(status) {
  const map = {
    normal:     { label:'正常',   bg:'var(--emerald-50)', text:'var(--emerald-700)', dot:'var(--emerald-500)', pulse:false },
    degraded:   { label:'降级',   bg:'var(--amber-50)',   text:'var(--amber-700)',   dot:'var(--amber-500)',   pulse:false },
    congested:  { label:'拥塞',   bg:'var(--amber-50)',   text:'var(--amber-700)',   dot:'var(--amber-500)',   pulse:true },
    offline:    { label:'离线',   bg:'var(--rose-50)',    text:'var(--rose-700)',    dot:'var(--rose-500)',    pulse:false },
    unverified: { label:'未验证', bg:'var(--ink-100)',    text:'var(--text-muted)',  dot:'var(--ink-400)',     pulse:false },
  };
  const s = map[status] || map.normal;
  const pulseStyle = s.pulse ? 'animation:pulse-dot 1.5s ease-in-out infinite;' : '';
  return `<span style="display:inline-flex;align-items:center;gap:3px;padding:1px 6px;border-radius:var(--radius-sm);font-size:10.5px;font-weight:500;background:${s.bg};color:${s.text};white-space:nowrap;"><span style="width:5px;height:5px;border-radius:50%;background:${s.dot};flex-shrink:0;${pulseStyle}"></span>${s.label}</span>`;
}

function progressBarColor(status) {
  const map = {
    normal: 'var(--emerald-500)',
    degraded: 'var(--amber-500)',
    congested: 'var(--amber-500)',
    offline: 'var(--ink-300)',
    unverified: 'var(--ink-300)',
  };
  return map[status] || 'var(--emerald-500)';
}

function carrierBadge(carrier) {
  const map = {
    '电信':     { bg:'var(--blue-50)',    text:'var(--blue-700)' },
    '联通':     { bg:'var(--rose-50)',    text:'var(--rose-700)' },
    '移动':     { bg:'var(--emerald-50)', text:'var(--emerald-700)' },
    '小号':     { bg:'var(--ink-100)',    text:'var(--text-muted)' },
    '多运营商': { bg:'var(--violet-50)',  text:'var(--violet-700)' },
  };
  const s = map[carrier] || { bg:'var(--ink-100)', text:'var(--text-muted)' };
  return `<span style="display:inline-flex;align-items:center;padding:1px 6px;border-radius:var(--radius-sm);font-size:10.5px;font-weight:500;background:${s.bg};color:${s.text};white-space:nowrap;">${carrier}</span>`;
}

function numberStatusBadge(status) {
  const map = {
    active:    { label:'可用', bg:'var(--emerald-50)', text:'var(--emerald-700)', dot:'var(--emerald-500)' },
    degraded:  { label:'降级', bg:'var(--amber-50)',   text:'var(--amber-700)',   dot:'var(--amber-500)' },
    congested: { label:'拥塞', bg:'var(--amber-50)',   text:'var(--amber-700)',   dot:'var(--amber-500)' },
    offline:   { label:'离线', bg:'var(--rose-50)',    text:'var(--rose-700)',    dot:'var(--rose-500)' },
    pending:   { label:'待验', bg:'var(--ink-100)',    text:'var(--text-muted)',  dot:'var(--ink-400)' },
  };
  const s = map[status] || map.active;
  return `<span style="display:inline-flex;align-items:center;gap:3px;padding:1px 5px;border-radius:var(--radius-sm);font-size:9.5px;font-weight:500;background:${s.bg};color:${s.text};white-space:nowrap;"><span style="width:4px;height:4px;border-radius:50%;background:${s.dot};flex-shrink:0;"></span>${s.label}</span>`;
}

// ── View Object ────────────────────────────────────────────
window.LinesView = {
  render() {
    return renderLinesView();
  },

  openLineDetail(lineId) {
    openLineDetail(lineId);
  },

  toggleLine(lineId) {
    toggleLine(lineId);
  },
};

// ── Main Render ────────────────────────────────────────────

// 线路筛选状态 (真实联动)
let lineSearch = '';
let lineFilterCarrier = 'ALL';
let lineFilterHealth = 'ALL';
let lineFilterStrategy = 'ALL';

function setLineFilter(kind, val) {
  if (kind === 'search') lineSearch = val;
  if (kind === 'carrier') lineFilterCarrier = val;
  if (kind === 'health') lineFilterHealth = val;
  if (kind === 'strategy') lineFilterStrategy = val;
  App.refreshCurrentView();
}

function resetLineFilters() {
  lineSearch = ''; lineFilterCarrier = 'ALL'; lineFilterHealth = 'ALL'; lineFilterStrategy = 'ALL';
  App.showToast('筛选条件已重置', 'info');
  App.refreshCurrentView();
}

function renderLinesView() {
  const s = LINES_SUMMARY;
  const lines = LINES_DATA.filter(l => {
    const q = lineSearch.toLowerCase();
    const matchSearch = !q || l.name.toLowerCase().includes(q) || l.id.toLowerCase().includes(q);
    const matchCarrier = lineFilterCarrier === 'ALL' || l.carrier === lineFilterCarrier;
    const matchHealth = lineFilterHealth === 'ALL' || l.healthStatus === lineFilterHealth;
    const matchStrategy = lineFilterStrategy === 'ALL' || l.routeStrategy === lineFilterStrategy;
    return matchSearch && matchCarrier && matchHealth && matchStrategy;
  });
  return `
    <div class="view-fade-enter">

      <!-- Page Header -->
      <div class="page-header">
        <div class="page-title-group">
          <div class="page-title">
            <i data-lucide="server"></i>
            线路与号码池
          </div>
          <div class="page-subtitle">SIP网关·主叫号码·并发管理·路由策略</div>
        </div>
        <div class="page-actions" style="display:flex;align-items:center;gap:6px;">
          <span class="badge badge-neutral" style="font-size:10px;line-height:16px;background:var(--amber-50);color:var(--amber-700);border:1px solid var(--amber-200);">
            <i data-lucide="flask-conical" style="width:9px;height:9px;margin-right:2px;"></i>模拟线路·待POC核验
          </span>
          <button class="btn btn-primary btn-sm" onclick="App.showToast('新增线路面板演示中','info')">
            <i data-lucide="plus"></i>新增线路
          </button>
        </div>
      </div>

      <!-- KPI Row -->
      <div class="metrics-grid" style="grid-template-columns:repeat(6,1fr);margin-bottom:var(--content-gap);">
        <div class="metric-card" style="padding:10px 12px;min-height:56px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
            <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">线路总数</span>
            <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--ink-50);flex-shrink:0;">
              <i data-lucide="server" style="width:11px;height:11px;color:var(--ink-500);"></i>
            </div>
          </div>
          <div style="font-size:18px;font-weight:700;color:var(--text-main);font-variant-numeric:tabular-nums;line-height:1.2;">${s.total}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">条</span></div>
        </div>
        <div class="metric-card" style="padding:10px 12px;min-height:56px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
            <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">健康线路</span>
            <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--emerald-50);flex-shrink:0;">
              <i data-lucide="check-circle" style="width:11px;height:11px;color:var(--emerald-600);"></i>
            </div>
          </div>
          <div style="font-size:18px;font-weight:700;color:var(--emerald-600);font-variant-numeric:tabular-nums;line-height:1.2;">${s.healthy}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">条</span></div>
        </div>
        <div class="metric-card" style="padding:10px 12px;min-height:56px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
            <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">当前并发/上限</span>
            <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--blue-50);flex-shrink:0;">
              <i data-lucide="activity" style="width:11px;height:11px;color:var(--blue-600);"></i>
            </div>
          </div>
          <div style="font-size:18px;font-weight:700;color:var(--text-main);font-variant-numeric:tabular-nums;line-height:1.2;">${s.currentConcurrency}<span style="font-size:11px;font-weight:400;color:var(--text-muted);margin-left:1px;">/ ${s.maxConcurrency}</span></div>
        </div>
        <div class="metric-card" style="padding:10px 12px;min-height:56px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
            <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">号码池数量</span>
            <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--violet-50);flex-shrink:0;">
              <i data-lucide="phone" style="width:11px;height:11px;color:var(--violet-600);"></i>
            </div>
          </div>
          <div style="font-size:18px;font-weight:700;color:var(--text-main);font-variant-numeric:tabular-nums;line-height:1.2;">${s.numberPoolCount}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">个</span></div>
        </div>
        <div class="metric-card" style="padding:10px 12px;min-height:56px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
            <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">今日失败率</span>
            <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--amber-50);flex-shrink:0;">
              <i data-lucide="trending-down" style="width:11px;height:11px;color:var(--amber-600);"></i>
            </div>
          </div>
          <div style="font-size:18px;font-weight:700;color:var(--amber-600);font-variant-numeric:tabular-nums;line-height:1.2;">${s.todayFailRate}</div>
        </div>
        <div class="metric-card" style="padding:10px 12px;min-height:56px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
            <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">告警数</span>
            <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--rose-50);flex-shrink:0;">
              <i data-lucide="alert-triangle" style="width:11px;height:11px;color:var(--rose-600);"></i>
            </div>
          </div>
          <div style="font-size:18px;font-weight:700;color:var(--rose-600);font-variant-numeric:tabular-nums;line-height:1.2;">${s.alerts}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">条</span></div>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="filter-bar">
        <div style="position:relative;flex:1;min-width:180px;max-width:240px;">
          <i data-lucide="search" style="position:absolute;left:8px;top:50%;transform:translateY(-50%);width:12px;height:12px;color:var(--text-muted);"></i>
          <input type="text" class="form-input" style="width:100%;height:30px;line-height:30px;padding:0 10px 0 26px;font-size:12px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;"
            placeholder="搜索线路名称/ID" value="${lineSearch}" oninput="setLineFilter('search', this.value)">
        </div>
        <select class="form-select" style="height:30px;padding:0 24px 0 8px;font-size:12px;min-width:100px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;" onchange="setLineFilter('carrier', this.value)">
          <option value="ALL" ${lineFilterCarrier==='ALL'?'selected':''}>全部运营商</option>
          <option value="电信" ${lineFilterCarrier==='电信'?'selected':''}>电信</option>
          <option value="联通" ${lineFilterCarrier==='联通'?'selected':''}>联通</option>
          <option value="移动" ${lineFilterCarrier==='移动'?'selected':''}>移动</option>
          <option value="多运营商" ${lineFilterCarrier==='多运营商'?'selected':''}>多运营商</option>
        </select>
        <select class="form-select" style="height:30px;padding:0 24px 0 8px;font-size:12px;min-width:100px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;" onchange="setLineFilter('health', this.value)">
          <option value="ALL" ${lineFilterHealth==='ALL'?'selected':''}>全部状态</option>
          <option value="normal" ${lineFilterHealth==='normal'?'selected':''}>正常</option>
          <option value="degraded" ${lineFilterHealth==='degraded'?'selected':''}>降级</option>
          <option value="congested" ${lineFilterHealth==='congested'?'selected':''}>拥塞</option>
          <option value="offline" ${lineFilterHealth==='offline'?'selected':''}>离线</option>
          <option value="unverified" ${lineFilterHealth==='unverified'?'selected':''}>未验证</option>
        </select>
        <select class="form-select" style="height:30px;padding:0 24px 0 8px;font-size:12px;min-width:100px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;" onchange="setLineFilter('strategy', this.value)">
          <option value="ALL" ${lineFilterStrategy==='ALL'?'selected':''}>全部策略</option>
          <option value="轮询" ${lineFilterStrategy==='轮询'?'selected':''}>轮询</option>
          <option value="主备" ${lineFilterStrategy==='主备'?'selected':''}>主备</option>
          <option value="按地区" ${lineFilterStrategy==='按地区'?'selected':''}>按地区</option>
          <option value="按任务" ${lineFilterStrategy==='按任务'?'selected':''}>按任务</option>
        </select>
        <div class="filter-divider"></div>
        <div class="filter-actions">
          <span class="filter-count">${lines.length}条</span>
          <button class="btn btn-ghost btn-sm" style="height:28px;font-size:11px;" onclick="resetLineFilters()">
            <i data-lucide="rotate-ccw" style="width:11px;height:11px;"></i>重置
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="card" style="padding:0;overflow:hidden;">
        <div style="overflow-x:auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width:32px;"><input type="checkbox" style="width:13px;height:13px;cursor:pointer;accent-color:var(--brand-500);"></th>
                <th style="width:160px;">线路名称/ID</th>
                <th style="width:100px;">供应商/协议</th>
                <th style="width:170px;">主叫号码池</th>
                <th style="width:72px;">注册状态</th>
                <th style="width:68px;">健康状态</th>
                <th style="width:130px;">当前/最大并发</th>
                <th style="width:80px;">路由策略</th>
                <th style="width:130px;">最近健康检测</th>
                <th style="width:160px;text-align:right;">操作</th>
              </tr>
            </thead>
            <tbody class="stagger-container">
              ${lines.map(line => {
                const concurrencyPct = line.maxConcurrency > 0 ? Math.round((line.currentConcurrency / line.maxConcurrency) * 100) : 0;
                const barColor = progressBarColor(line.healthStatus);
                return `
                <tr>
                  <td><input type="checkbox" style="width:13px;height:13px;cursor:pointer;accent-color:var(--brand-500);"></td>
                  <td>
                    <div style="display:flex;align-items:center;gap:6px;">
                      <div style="width:24px;height:24px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:${line.healthStatus==='offline'||line.healthStatus==='unverified'?'var(--ink-100)':line.healthStatus==='congested'||line.healthStatus==='degraded'?'var(--amber-50)':'var(--brand-50)'};flex-shrink:0;">
                        <i data-lucide="radio" style="width:11px;height:11px;color:${line.healthStatus==='offline'||line.healthStatus==='unverified'?'var(--ink-400)':line.healthStatus==='congested'||line.healthStatus==='degraded'?'var(--amber-600)':'var(--brand-600)'};"></i>
                      </div>
                      <div style="min-width:0;">
                        <div style="font-size:11.5px;font-weight:600;color:var(--text-main);white-space:nowrap;">${line.name}</div>
                        <div style="font-size:10px;color:var(--text-muted);font-variant-numeric:tabular-nums;font-family:var(--font-mono);white-space:nowrap;">${line.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style="font-size:11px;color:var(--text-secondary);white-space:nowrap;">${line.vendor}</div>
                    <div style="display:flex;align-items:center;gap:3px;margin-top:1px;">
                      <span style="font-size:9.5px;color:var(--text-muted);font-variant-numeric:tabular-nums;">${line.protocol}</span>
                      ${carrierBadge(line.carrier)}
                    </div>
                  </td>
                  <td>
                    <div style="display:flex;flex-direction:column;gap:2px;">
                      ${line.numberPool.slice(0,2).map(n => `
                        <span style="font-size:10.5px;color:var(--text-secondary);font-variant-numeric:tabular-nums;font-family:var(--font-mono);letter-spacing:0.2px;white-space:nowrap;">${n.number}</span>
                      `).join('')}
                      ${line.poolExtra > 0 ? `<span style="display:inline-flex;align-items:center;gap:2px;font-size:9.5px;color:var(--text-muted);background:var(--ink-50);border-radius:var(--radius-sm);padding:0 4px;line-height:15px;width:fit-content;"><i data-lucide="layers" style="width:8px;height:8px;"></i>+${line.poolExtra}个</span>` : ''}
                    </div>
                  </td>
                  <td>${registerStatusBadge(line.registerStatus)}</td>
                  <td>${healthStatusBadge(line.healthStatus)}</td>
                  <td>
                    <div style="display:flex;align-items:center;gap:6px;">
                      <span style="font-size:11px;font-weight:600;color:var(--text-main);font-variant-numeric:tabular-nums;white-space:nowrap;min-width:52px;">${line.currentConcurrency}<span style="font-weight:400;color:var(--text-muted);font-size:10px;">/${line.maxConcurrency}</span></span>
                      <div style="flex:1;min-width:30px;">
                        <div style="width:100%;height:3px;background:var(--ink-100);border-radius:2px;overflow:hidden;">
                          <div style="width:${concurrencyPct}%;height:100%;background:${barColor};border-radius:2px;transition:width 0.3s;"></div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style="display:inline-flex;align-items:center;padding:1px 6px;border-radius:var(--radius-sm);font-size:10.5px;font-weight:500;background:var(--ink-50);color:var(--text-secondary);white-space:nowrap;">${line.routeStrategy}</span>
                  </td>
                  <td>
                    <span style="font-size:10.5px;color:var(--text-muted);font-variant-numeric:tabular-nums;white-space:nowrap;">${line.lastHealthCheck}</span>
                  </td>
                  <td style="text-align:right;">
                    <div style="display:flex;gap:2px;justify-content:flex-end;">
                      <button class="btn btn-ghost btn-sm" style="height:24px;padding:0 6px;font-size:10px;color:var(--blue-600);" onclick="testLineConnection('${line.id}')" title="测试连接">
                        <i data-lucide="zap" style="width:10px;height:10px;margin-right:2px;"></i>测试
                      </button>
                      ${line.enabled ? `
                        <button class="btn btn-ghost btn-sm" style="height:24px;padding:0 6px;font-size:10px;color:var(--rose-600);" onclick="LinesView.toggleLine('${line.id}')" title="停用">
                          <i data-lucide="pause-circle" style="width:10px;height:10px;margin-right:2px;"></i>停用
                        </button>
                      ` : `
                        <button class="btn btn-ghost btn-sm" style="height:24px;padding:0 6px;font-size:10px;color:var(--emerald-600);" onclick="LinesView.toggleLine('${line.id}')" title="启用">
                          <i data-lucide="play-circle" style="width:10px;height:10px;margin-right:2px;"></i>启用
                        </button>
                      `}
                      <button class="btn btn-ghost btn-sm" style="width:24px;height:24px;padding:0;" onclick="LinesView.openLineDetail('${line.id}')" title="详情">
                        <i data-lucide="eye" style="width:11px;height:11px;"></i>
                      </button>
                      <button class="btn btn-ghost btn-sm" style="width:24px;height:24px;padding:0;" onclick="App.showToast('查看日志 · ${line.id}','info')" title="日志">
                        <i data-lucide="file-text" style="width:11px;height:11px;"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      ${renderLinesPagination(LINES_DATA.length)}
    </div>
  `;
}

// ── Pagination ────────────────────────────────────────────
function renderLinesPagination(total) {
  return `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;padding:0 2px;">
      <div style="font-size:11px;color:var(--text-muted);font-variant-numeric:tabular-nums;">共 ${total} 条线路</div>
      <div style="display:flex;gap:3px;">
        <button class="btn btn-outline btn-sm" style="min-width:28px;padding:0 6px;" disabled><i data-lucide="chevron-left" style="width:11px;height:11px;"></i></button>
        <button class="btn btn-primary btn-sm" style="min-width:28px;padding:0 8px;">1</button>
        <button class="btn btn-outline btn-sm" style="min-width:28px;padding:0 6px;" disabled><i data-lucide="chevron-right" style="width:11px;height:11px;"></i></button>
      </div>
    </div>
  `;
}

// ── Line Detail Drawer ────────────────────────────────────
function openLineDetail(lineId) {
  _currentLineId = lineId;
  renderLineDrawer();
}

function closeLineDetail() {
  const container = document.getElementById('line-detail-drawer-container');
  if (container) {
    container.classList.remove('open');
    setTimeout(() => { container.innerHTML = ''; }, 300);
  }
  _currentLineId = null;
}

function renderLineDrawer() {
  const line = LINES_DATA.find(l => l.id === _currentLineId);
  if (!line) return;

  let container = document.getElementById('line-detail-drawer-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'line-detail-drawer-container';
    container.className = 'drawer-backdrop';
    document.body.appendChild(container);
    container.addEventListener('click', (e) => { if (e.target === container) closeLineDetail(); });
  }

  const concurrencyPct = line.maxConcurrency > 0 ? Math.round((line.currentConcurrency / line.maxConcurrency) * 100) : 0;
  const barColor = progressBarColor(line.healthStatus);

  container.innerHTML = `
    <div class="drawer-panel" onclick="event.stopPropagation()" style="width:520px;display:flex;flex-direction:column;">
      <!-- Header -->
      <div style="padding:14px 20px;border-bottom:1px solid var(--border-color);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-shrink:0;">
        <div style="display:flex;align-items:center;gap:8px;min-width:0;flex:1;">
          <button class="btn btn-ghost btn-sm" style="width:28px;height:28px;padding:0;flex-shrink:0;" onclick="closeLineDetail()">
            <i data-lucide="arrow-left" style="width:14px;height:14px;"></i>
          </button>
          <div style="min-width:0;">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
              <span style="font-size:14px;font-weight:700;color:var(--text-main);white-space:nowrap;">${line.name}</span>
              ${healthStatusBadge(line.healthStatus)}
            </div>
            <div style="font-size:10.5px;color:var(--text-muted);margin-top:2px;font-variant-numeric:tabular-nums;font-family:var(--font-mono);">${line.id} · ${line.vendor} · ${line.protocol}</div>
          </div>
        </div>
        <div style="display:flex;gap:4px;flex-shrink:0;">
          <button class="btn btn-ghost btn-sm" style="width:28px;height:28px;padding:0;" onclick="closeLineDetail()">
            <i data-lucide="x" style="width:14px;height:14px;"></i>
          </button>
        </div>
      </div>

      <!-- Body -->
      <div style="padding:16px 20px;overflow-y:auto;flex:1;">

        <!-- 基本配置 -->
        <div style="margin-bottom:18px;">
          <div style="display:flex;align-items:center;gap:5px;margin-bottom:8px;">
            <i data-lucide="settings-2" style="width:11px;height:11px;color:var(--text-muted);"></i>
            <span style="font-size:11px;font-weight:600;color:var(--text-main);">基本配置</span>
            <span style="font-size:9px;color:var(--text-muted);margin-left:4px;"><i data-lucide="eye-off" style="width:8px;height:8px;vertical-align:-1px;"></i> 凭证已脱敏</span>
          </div>
          <div style="background:var(--ink-50);border-radius:var(--radius-md);padding:10px 12px;border:1px solid var(--border-subtle);">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px 16px;">
              <div>
                <div style="font-size:9.5px;color:var(--text-muted);margin-bottom:1px;">SIP服务器地址</div>
                <div style="font-size:11px;color:var(--text-secondary);font-variant-numeric:tabular-nums;font-family:var(--font-mono);">${line.sipServer}</div>
              </div>
              <div>
                <div style="font-size:9.5px;color:var(--text-muted);margin-bottom:1px;">端口/传输</div>
                <div style="font-size:11px;color:var(--text-secondary);font-variant-numeric:tabular-nums;">5060 / UDP</div>
              </div>
              <div>
                <div style="font-size:9.5px;color:var(--text-muted);margin-bottom:1px;">SIP账号</div>
                <div style="font-size:11px;color:var(--text-secondary);font-variant-numeric:tabular-nums;font-family:var(--font-mono);">${line.sipAccount}</div>
              </div>
              <div>
                <div style="font-size:9.5px;color:var(--text-muted);margin-bottom:1px;">SIP密码</div>
                <div style="font-size:11px;color:var(--text-secondary);font-family:var(--font-mono);">${line.sipPassword}</div>
              </div>
              <div>
                <div style="font-size:9.5px;color:var(--text-muted);margin-bottom:1px;">注册超时</div>
                <div style="font-size:11px;color:var(--text-secondary);font-variant-numeric:tabular-nums;">${line.sipTimeout}</div>
              </div>
              <div>
                <div style="font-size:9.5px;color:var(--text-muted);margin-bottom:1px;">注册状态</div>
                <div style="font-size:11px;">${registerStatusBadge(line.registerStatus)}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 并发概览 -->
        <div style="margin-bottom:18px;">
          <div style="display:flex;align-items:center;gap:5px;margin-bottom:8px;">
            <i data-lucide="activity" style="width:11px;height:11px;color:var(--text-muted);"></i>
            <span style="font-size:11px;font-weight:600;color:var(--text-main);">并发使用</span>
          </div>
          <div style="background:var(--bg-card);border-radius:var(--radius-md);padding:10px 12px;border:1px solid var(--border-subtle);">
            <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:6px;">
              <span style="font-size:20px;font-weight:700;color:var(--text-main);font-variant-numeric:tabular-nums;">${line.currentConcurrency}<span style="font-size:12px;font-weight:400;color:var(--text-muted);"> / ${line.maxConcurrency} 路</span></span>
              <span style="font-size:11px;color:${barColor};font-weight:600;font-variant-numeric:tabular-nums;">${concurrencyPct}%</span>
            </div>
            <div style="width:100%;height:4px;background:var(--ink-100);border-radius:2px;overflow:hidden;">
              <div style="width:${concurrencyPct}%;height:100%;background:${barColor};border-radius:2px;"></div>
            </div>
          </div>
        </div>

        <!-- 号码池列表 -->
        <div style="margin-bottom:18px;">
          <div style="display:flex;align-items:center;gap:5px;margin-bottom:8px;">
            <i data-lucide="phone" style="width:11px;height:11px;color:var(--text-muted);"></i>
            <span style="font-size:11px;font-weight:600;color:var(--text-main);">主叫号码池</span>
            <span style="font-size:9.5px;color:var(--text-muted);margin-left:4px;font-variant-numeric:tabular-nums;">共 ${line.numberPool.length + line.poolExtra} 个号码</span>
          </div>
          <div style="border:1px solid var(--border-subtle);border-radius:var(--radius-md);overflow:hidden;">
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr style="background:var(--ink-50);">
                  <th style="padding:6px 10px;text-align:left;font-size:9.5px;font-weight:600;color:var(--text-muted);border-bottom:1px solid var(--border-subtle);">号码</th>
                  <th style="padding:6px 10px;text-align:left;font-size:9.5px;font-weight:600;color:var(--text-muted);border-bottom:1px solid var(--border-subtle);">归属地</th>
                  <th style="padding:6px 10px;text-align:right;font-size:9.5px;font-weight:600;color:var(--text-muted);border-bottom:1px solid var(--border-subtle);">今日外呼</th>
                  <th style="padding:6px 10px;text-align:center;font-size:9.5px;font-weight:600;color:var(--text-muted);border-bottom:1px solid var(--border-subtle);">状态</th>
                </tr>
              </thead>
              <tbody>
                ${line.numberPool.map(n => `
                  <tr>
                    <td style="padding:6px 10px;font-size:10.5px;color:var(--text-secondary);font-variant-numeric:tabular-nums;font-family:var(--font-mono);border-bottom:1px solid var(--border-subtle);">${n.number}</td>
                    <td style="padding:6px 10px;font-size:10.5px;color:var(--text-muted);border-bottom:1px solid var(--border-subtle);">${n.location}</td>
                    <td style="padding:6px 10px;font-size:10.5px;color:var(--text-secondary);text-align:right;font-variant-numeric:tabular-nums;border-bottom:1px solid var(--border-subtle);">${n.todayCalls}</td>
                    <td style="padding:6px 10px;text-align:center;border-bottom:1px solid var(--border-subtle);">${numberStatusBadge(n.status)}</td>
                  </tr>
                `).join('')}
                ${line.poolExtra > 0 ? `
                  <tr>
                    <td colspan="4" style="padding:6px 10px;font-size:10px;color:var(--text-muted);text-align:center;background:var(--ink-50);">
                      <i data-lucide="more-horizontal" style="width:10px;height:10px;vertical-align:-1px;"></i> 另有 ${line.poolExtra} 个号码未展示
                    </td>
                  </tr>
                ` : ''}
              </tbody>
            </table>
          </div>
        </div>

        <!-- 路由规则 -->
        <div style="margin-bottom:18px;">
          <div style="display:flex;align-items:center;gap:5px;margin-bottom:8px;">
            <i data-lucide="git-branch" style="width:11px;height:11px;color:var(--text-muted);"></i>
            <span style="font-size:11px;font-weight:600;color:var(--text-main);">路由规则</span>
            <span class="badge badge-neutral" style="font-size:9px;line-height:14px;margin-left:4px;">${line.routeStrategy}</span>
          </div>
          <div style="background:var(--ink-50);border-radius:var(--radius-md);padding:10px 12px;border:1px solid var(--border-subtle);font-size:11px;color:var(--text-secondary);line-height:1.6;">
            ${line.routeRules}
          </div>
        </div>

        <!-- 健康检查配置 -->
        <div style="margin-bottom:18px;">
          <div style="display:flex;align-items:center;gap:5px;margin-bottom:8px;">
            <i data-lucide="heart-pulse" style="width:11px;height:11px;color:var(--text-muted);"></i>
            <span style="font-size:11px;font-weight:600;color:var(--text-main);">健康检查配置</span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
            <div style="background:var(--ink-50);border-radius:var(--radius-md);padding:8px 10px;border:1px solid var(--border-subtle);text-align:center;">
              <div style="font-size:9.5px;color:var(--text-muted);margin-bottom:2px;">检测间隔</div>
              <div style="font-size:13px;font-weight:600;color:var(--text-main);font-variant-numeric:tabular-nums;">${line.healthConfig.interval}</div>
            </div>
            <div style="background:var(--ink-50);border-radius:var(--radius-md);padding:8px 10px;border:1px solid var(--border-subtle);text-align:center;">
              <div style="font-size:9.5px;color:var(--text-muted);margin-bottom:2px;">超时阈值</div>
              <div style="font-size:13px;font-weight:600;color:var(--text-main);font-variant-numeric:tabular-nums;">${line.healthConfig.timeout}</div>
            </div>
            <div style="background:var(--ink-50);border-radius:var(--radius-md);padding:8px 10px;border:1px solid var(--border-subtle);text-align:center;">
              <div style="font-size:9.5px;color:var(--text-muted);margin-bottom:2px;">失败阈值</div>
              <div style="font-size:13px;font-weight:600;color:var(--text-main);font-variant-numeric:tabular-nums;">${line.healthConfig.failThreshold}</div>
            </div>
          </div>
          <div style="margin-top:6px;font-size:10px;color:var(--text-muted);">
            <i data-lucide="clock" style="width:9px;height:9px;vertical-align:-1px;"></i> 最近检测：${line.lastHealthCheck}
          </div>
        </div>

        <!-- 正在使用该线路的任务 -->
        <div style="margin-bottom:18px;">
          <div style="display:flex;align-items:center;gap:5px;margin-bottom:8px;">
            <i data-lucide="layers" style="width:11px;height:11px;color:var(--text-muted);"></i>
            <span style="font-size:11px;font-weight:600;color:var(--text-main);">正在使用该线路的任务</span>
            <span style="font-size:9.5px;color:var(--text-muted);margin-left:4px;font-variant-numeric:tabular-nums;">${line.activeTasks.length} 个</span>
          </div>
          ${line.activeTasks.length > 0 ? `
            <div style="display:flex;flex-wrap:wrap;gap:4px;">
              ${line.activeTasks.map(t => `
                <span style="display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:var(--radius-sm);font-size:10px;font-weight:500;background:var(--brand-50);color:var(--brand-700);white-space:nowrap;">
                  <i data-lucide="radio" style="width:8px;height:8px;"></i>${t}
                </span>
              `).join('')}
            </div>
          ` : `
            <div style="font-size:10.5px;color:var(--text-muted);padding:8px 12px;background:var(--ink-50);border-radius:var(--radius-md);text-align:center;border:1px solid var(--border-subtle);">
              当前无任务使用该线路
            </div>
          `}
        </div>

        <!-- 最近故障日志 -->
        <div style="margin-bottom:4px;">
          <div style="display:flex;align-items:center;gap:5px;margin-bottom:8px;">
            <i data-lucide="alert-triangle" style="width:11px;height:11px;color:var(--text-muted);"></i>
            <span style="font-size:11px;font-weight:600;color:var(--text-main);">最近故障日志</span>
            <span style="font-size:9.5px;color:var(--text-muted);margin-left:4px;font-variant-numeric:tabular-nums;">${line.faultLogs.length} 条</span>
          </div>
          ${line.faultLogs.length > 0 ? `
            <div style="border:1px solid var(--border-subtle);border-radius:var(--radius-md);overflow:hidden;">
              <table style="width:100%;border-collapse:collapse;">
                <thead>
                  <tr style="background:var(--ink-50);">
                    <th style="padding:6px 8px;text-align:left;font-size:9.5px;font-weight:600;color:var(--text-muted);border-bottom:1px solid var(--border-subtle);">时间</th>
                    <th style="padding:6px 8px;text-align:left;font-size:9.5px;font-weight:600;color:var(--text-muted);border-bottom:1px solid var(--border-subtle);">故障类型</th>
                    <th style="padding:6px 8px;text-align:left;font-size:9.5px;font-weight:600;color:var(--text-muted);border-bottom:1px solid var(--border-subtle);">恢复时间</th>
                    <th style="padding:6px 8px;text-align:right;font-size:9.5px;font-weight:600;color:var(--text-muted);border-bottom:1px solid var(--border-subtle);">持续时长</th>
                  </tr>
                </thead>
                <tbody>
                  ${line.faultLogs.map(f => `
                    <tr>
                      <td style="padding:6px 8px;font-size:10px;color:var(--text-muted);font-variant-numeric:tabular-nums;border-bottom:1px solid var(--border-subtle);white-space:nowrap;">${f.time}</td>
                      <td style="padding:6px 8px;font-size:10.5px;color:var(--rose-600);border-bottom:1px solid var(--border-subtle);white-space:nowrap;">${f.type}</td>
                      <td style="padding:6px 8px;font-size:10px;color:${f.recoverTime==='—'?'var(--amber-600)':'var(--text-secondary)'};font-variant-numeric:tabular-nums;border-bottom:1px solid var(--border-subtle);white-space:nowrap;">${f.recoverTime}</td>
                      <td style="padding:6px 8px;font-size:10px;color:var(--text-muted);text-align:right;font-variant-numeric:tabular-nums;border-bottom:1px solid var(--border-subtle);white-space:nowrap;">${f.duration}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : `
            <div style="font-size:10.5px;color:var(--text-muted);padding:8px 12px;background:var(--emerald-50);border-radius:var(--radius-md);text-align:center;border:1px solid var(--emerald-100);">
              <i data-lucide="check-circle" style="width:10px;height:10px;vertical-align:-1px;color:var(--emerald-600);"></i> 暂无故障记录
            </div>
          `}
        </div>

      </div>

      <!-- Footer Actions -->
      <div style="padding:10px 20px;border-top:1px solid var(--border-color);display:flex;justify-content:flex-end;gap:6px;flex-shrink:0;background:var(--bg-card);">
        <button class="btn btn-outline btn-sm" onclick="testLineConnection('${line.id}')">
          <i data-lucide="zap" style="width:11px;height:11px;"></i>测试连接
        </button>
        ${line.enabled ? `
          <button class="btn btn-outline btn-sm" style="color:var(--rose-600);border-color:var(--rose-200);" onclick="LinesView.toggleLine('${line.id}');closeLineDetail();">
            <i data-lucide="pause-circle" style="width:11px;height:11px;"></i>停用线路
          </button>
        ` : `
          <button class="btn btn-outline btn-sm" style="color:var(--emerald-600);border-color:var(--emerald-200);" onclick="LinesView.toggleLine('${line.id}');closeLineDetail();">
            <i data-lucide="play-circle" style="width:11px;height:11px;"></i>启用线路
          </button>
        `}
        <button class="btn btn-primary btn-sm" onclick="App.showToast('编辑线路配置面板演示中','info')">
          <i data-lucide="edit-3" style="width:11px;height:11px;"></i>编辑配置
        </button>
      </div>
    </div>
  `;

  setTimeout(() => {
    container.classList.add('open');
    if (window.lucide) lucide.createIcons();
  }, 10);
}

// ── Actions ────────────────────────────────────────────────

function testLineConnection(lineId) {
  const line = LINES_DATA.find(l => l.id === lineId);
  if (!line) return;
  if (line.healthStatus === 'offline' || line.healthStatus === 'unverified') {
    App.showToast(`测试连接失败：${line.name} 当前${line.healthStatus==='offline'?'离线':'未验证'}，无法建立连接`, 'warning');
  } else if (line.healthStatus === 'congested') {
    App.showToast(`测试连接成功：${line.name} 响应延迟 285ms（拥塞中，建议降低并发）`, 'warning');
  } else if (line.healthStatus === 'degraded') {
    App.showToast(`测试连接成功：${line.name} 响应延迟 156ms（降级状态，ASR偏低）`, 'warning');
  } else {
    App.showToast(`测试连接成功：${line.name} 响应延迟 42ms，注册正常`, 'success');
  }
}

function toggleLine(lineId) {
  const line = LINES_DATA.find(l => l.id === lineId);
  if (!line) return;

  if (line.enabled) {
    // Stopping - show confirmation
    const confirmed = confirm('确定要停用该线路吗？停用后相关任务将自动转移。');
    if (!confirmed) return;
    line.enabled = false;
    line.healthStatus = line.healthStatus === 'unverified' ? 'unverified' : 'offline';
    line.registerStatus = 'unregistered';
    line.currentConcurrency = 0;
    App.showToast(`已停用 ${line.name}，相关任务已自动转移`, 'success');
  } else {
    // Starting
    if (line.healthStatus === 'unverified') {
      App.showToast(`${line.name} 尚未通过POC核验，启用前请先完成验证`, 'warning');
      return;
    }
    line.enabled = true;
    line.healthStatus = 'normal';
    line.registerStatus = 'registered';
    App.showToast(`已启用 ${line.name}，线路注册中...`, 'success');
  }

  App.refreshCurrentView();
}

window.setLineFilter = setLineFilter;
window.resetLineFilters = resetLineFilters;
