// View: Compliance (合规台账) - 授权证据·黑名单·退订·频控·违规审计

// ── State ──────────────────────────────────────────────────
let complianceActiveTab = 'auth'; // auth | blacklist | unsubscribe | freq | violation
let authFilterStatus = 'ALL';
let authFilterChannel = 'ALL';
let authSearch = '';
let blacklistSearch = '';
let blacklistFilterType = 'ALL';
let blacklistFilterSource = 'ALL';
let unsubSearch = '';
let unsubFilterChannel = 'ALL';
let violationSearch = '';
let violationFilterSeverity = 'ALL';
let violationFilterReview = 'ALL';
let violationFilterRule = 'ALL';

function setComplianceSearch(tab, val) {
  if (tab === 'auth') authSearch = val;
  if (tab === 'blacklist') blacklistSearch = val;
  if (tab === 'unsub') unsubSearch = val;
  if (tab === 'violation') violationSearch = val;
  App.refreshCurrentView();
}

function setComplianceFilter(tab, kind, val) {
  if (tab === 'blacklist') {
    if (kind === 'type') blacklistFilterType = val;
    if (kind === 'source') blacklistFilterSource = val;
  }
  if (tab === 'unsub' && kind === 'channel') unsubFilterChannel = val;
  if (tab === 'violation') {
    if (kind === 'severity') violationFilterSeverity = val;
    if (kind === 'review') violationFilterReview = val;
    if (kind === 'rule') violationFilterRule = val;
  }
  App.refreshCurrentView();
}

// ── Mock Data ──────────────────────────────────────────────

// 授权证据: 120 entries (show 12 for demo table), 20 pending, 85 approved, 15 rejected
const AUTH_DATA = [
  { id:'AU20260820-001', leadName:'张明华', gender:'男', age:32, phone:'138****3344', channel:'抖音信息流', authType:'表单勾选授权', authTime:'2026-08-20 10:23', status:'pending', reviewer:'—' },
  { id:'AU20260820-002', leadName:'李婷婷', gender:'女', age:28, phone:'139****5566', channel:'小红书', authType:'短信验证码授权', authTime:'2026-08-20 10:45', status:'pending', reviewer:'—' },
  { id:'AU20260820-003', leadName:'王建国', gender:'男', age:35, phone:'137****7788', channel:'转介绍', authType:'电话口头授权(录音)', authTime:'2026-08-20 11:02', status:'approved', reviewer:'林总监' },
  { id:'AU20260820-004', leadName:'陈雨萱', gender:'女', age:27, phone:'136****9900', channel:'朋友圈', authType:'表单勾选授权', authTime:'2026-08-20 11:15', status:'approved', reviewer:'周主管' },
  { id:'AU20260820-005', leadName:'赵雅婷', gender:'女', age:29, phone:'135****1122', channel:'知乎', authType:'表单勾选授权', authTime:'2026-08-20 11:28', status:'rejected', reviewer:'林总监' },
  { id:'AU20260820-006', leadName:'刘思远', gender:'男', age:31, phone:'133****2233', channel:'抖音信息流', authType:'短信验证码授权', authTime:'2026-08-20 11:40', status:'approved', reviewer:'周主管' },
  { id:'AU20260820-007', leadName:'孙佳颖', gender:'女', age:26, phone:'131****4455', channel:'小红书', authType:'表单勾选授权', authTime:'2026-08-20 12:05', status:'pending', reviewer:'—' },
  { id:'AU20260820-008', leadName:'周逸飞', gender:'男', age:29, phone:'186****1129', channel:'知乎', authType:'电话口头授权(录音)', authTime:'2026-08-20 13:12', status:'approved', reviewer:'林总监' },
  { id:'AU20260820-009', leadName:'吴承翰', gender:'男', age:38, phone:'136****5512', channel:'商会转介绍', authType:'书面签署授权', authTime:'2026-08-20 13:30', status:'approved', reviewer:'林总监' },
  { id:'AU20260820-010', leadName:'黄志豪', gender:'男', age:35, phone:'133****9901', channel:'线下地推', authType:'表单勾选授权', authTime:'2026-08-20 14:00', status:'rejected', reviewer:'周主管' },
  { id:'AU20260820-011', leadName:'何雨桐', gender:'女', age:29, phone:'177****6623', channel:'小红书', authType:'短信验证码授权', authTime:'2026-08-20 14:22', status:'approved', reviewer:'林总监' },
  { id:'AU20260820-012', leadName:'赵子涵', gender:'女', age:24, phone:'188****3321', channel:'Bilibili', authType:'表单勾选授权', authTime:'2026-08-20 14:45', status:'pending', reviewer:'—' },
];

const AUTH_SUMMARY = { total:120, pending:20, approved:85, rejected:15 };

// 黑名单: 48 entries (types: 明确拒接/投诉/空号停机/已脱单)
const BLACKLIST_DATA = [
  { id:'BL202608-001', leadName:'刘建平', gender:'男', age:42, phone:'135****0019', type:'投诉', reason:'辱骂AI坐席，言语骚扰', addTime:'2026-08-19 09:15', source:'AI自动标记' },
  { id:'BL202608-002', leadName:'马德强', gender:'男', age:47, phone:'138****2211', type:'明确拒接', reason:'客户明确表示不需要婚恋服务，多次拒接', addTime:'2026-08-18 16:40', source:'人工标记' },
  { id:'BL202608-003', leadName:'钱小萍', gender:'女', age:33, phone:'139****3344', type:'已脱单', reason:'客户反馈已找到对象，要求停止联系', addTime:'2026-08-18 10:22', source:'通话中登记' },
  { id:'BL202608-004', leadName:'孙大伟', gender:'男', age:0, phone:'137****5566', type:'空号停机', reason:'号码为空号/已停机', addTime:'2026-08-17 15:30', source:'系统自动检测' },
  { id:'BL202608-005', leadName:'李秀兰', gender:'女', age:55, phone:'136****7788', type:'投诉', reason:'投诉电话骚扰，要求立即删除信息', addTime:'2026-08-17 09:10', source:'客服投诉' },
  { id:'BL202608-006', leadName:'张国富', gender:'男', age:0, phone:'135****8899', type:'空号停机', reason:'号码已停机超过30天', addTime:'2026-08-16 14:20', source:'系统自动检测' },
  { id:'BL202608-007', leadName:'陈美玲', gender:'女', age:31, phone:'133****9900', type:'已脱单', reason:'客户反馈已订婚，请勿再联系', addTime:'2026-08-16 11:05', source:'短信退订' },
  { id:'BL202608-008', leadName:'王志强', gender:'男', age:39, phone:'131****0011', type:'明确拒接', reason:'连续3次拒接并明确表达不感兴趣', addTime:'2026-08-15 16:48', source:'AI自动标记' },
  { id:'BL202608-009', leadName:'赵桂芳', gender:'女', age:48, phone:'130****1122', type:'投诉', reason:'向12321投诉营销电话', addTime:'2026-08-15 09:30', source:'外部反馈' },
  { id:'BL202608-010', leadName:'周建军', gender:'男', age:0, phone:'189****2233', type:'空号停机', reason:'号码为空号', addTime:'2026-08-14 14:15', source:'系统自动检测' },
];

const BLACKLIST_SUMMARY = { total:48, refuse:16, complaint:8, invalid:14, matched:10 };

// 退订台账: 12 entries with channel (通话中/短信/客服) and quote snippets
const UNSUB_DATA = [
  { id:'UN202608-001', leadName:'徐志强', gender:'男', age:29, phone:'185****1010', channel:'通话中', quote:'我不需要，请你们以后别打来了', status:'已处理', regTime:'2026-08-20 11:50', operator:'AI自动' },
  { id:'UN202608-002', leadName:'林美华', gender:'女', age:34, phone:'186****3344', channel:'短信', quote:'TD', status:'已处理', regTime:'2026-08-19 16:20', operator:'系统自动' },
  { id:'UN202608-003', leadName:'杨建国', gender:'男', age:45, phone:'187****5566', channel:'客服', quote:'帮我把号码删掉，我已经结婚了', status:'已处理', regTime:'2026-08-19 10:15', operator:'客服-小王' },
  { id:'UN202608-004', leadName:'黄丽娟', gender:'女', age:28, phone:'188****7788', channel:'通话中', quote:'不用了谢谢，我已经有对象了', status:'已处理', regTime:'2026-08-18 14:32', operator:'AI自动' },
  { id:'UN202608-005', leadName:'张明远', gender:'男', age:36, phone:'183****9900', channel:'短信', quote:'退订', status:'已处理', regTime:'2026-08-18 09:45', operator:'系统自动' },
  { id:'UN202608-006', leadName:'吴秀珍', gender:'女', age:52, phone:'182****1122', channel:'客服', quote:'我儿子已经结婚了，别再打了', status:'处理中', regTime:'2026-08-17 15:28', operator:'客服-小李' },
  { id:'UN202608-007', leadName:'郑海涛', gender:'男', age:33, phone:'181****3344', channel:'通话中', quote:'我对这个没兴趣，别联系了', status:'已处理', regTime:'2026-08-17 11:05', operator:'AI自动' },
  { id:'UN202608-008', leadName:'陈小燕', gender:'女', age:27, phone:'180****5566', channel:'短信', quote:'T', status:'已处理', regTime:'2026-08-16 17:40', operator:'系统自动' },
];

const UNSUB_SUMMARY = { total:12, call:5, sms:4, cs:3, processed:11, pending:1 };

// 频控规则: 5 rules
const FREQ_RULES = [
  { id:'FR001', name:'7天1次限制', desc:'同一号码7天内最多外呼1次，防止过度打扰', params:{ period:'7天', maxCalls:'1次' }, enabled:true, icon:'phone-off' },
  { id:'FR002', name:'午休禁呼', desc:'每日午休时段12:00-14:00禁止外呼', params:{ timeRange:'12:00-14:00', action:'禁止外呼' }, enabled:true, icon:'sun' },
  { id:'FR003', name:'晚间禁呼', desc:'每日晚间20:30后至次日09:00前禁止外呼', params:{ timeRange:'20:30-09:00(+1)', action:'禁止外呼' }, enabled:true, icon:'moon' },
  { id:'FR004', name:'节假日限制', desc:'法定节假日及周末限制外呼（客户主动预约除外）', params:{ scope:'法定节假日/周末', action:'限制外呼(预约客户除外)' }, enabled:false, icon:'calendar-x' },
  { id:'FR005', name:'单号日上限', desc:'单个号码每日最多呼叫1次，避免当日重复拨打', params:{ dailyMax:'1次/号', cooldown:'24小时' }, enabled:true, icon:'gauge' },
];

const FREQ_SUMMARY = { total:5, enabled:4, disabled:1, blocked:127 };

// 违规记录: 8 entries with severity (high/medium/low) and review status
const VIOLATION_DATA = [
  { id:'VIO202608-001', callId:'CL20260819-034', rule:'晚间禁呼', severity:'high', time:'2026-08-19 20:45:22', review:'已确认违规', note:'20:45对139****5566发起外呼，超出20:30截止时间' },
  { id:'VIO202608-002', callId:'CL20260819-028', rule:'单号日上限', severity:'medium', time:'2026-08-19 15:30:11', review:'已确认违规', note:'137****7788当日第2次呼叫' },
  { id:'VIO202608-003', callId:'CL20260819-022', rule:'7天1次限制', severity:'high', time:'2026-08-19 11:15:40', review:'待复核', note:'135****0019距上次外呼仅3天' },
  { id:'VIO202608-004', callId:'CL20260818-051', rule:'黑名单拦截失效', severity:'high', time:'2026-08-18 16:22:08', review:'已确认违规', note:'对黑名单号码135****0019发起呼叫' },
  { id:'VIO202608-005', callId:'CL20260818-044', rule:'话术合规风险', severity:'medium', time:'2026-08-18 14:50:33', review:'已申诉通过', note:'AI提及"100%匹配"等绝对化用语' },
  { id:'VIO202608-006', callId:'CL20260818-037', rule:'午休禁呼', severity:'low', time:'2026-08-18 12:05:17', review:'系统误报', note:'12:05发起呼叫，客户为主动预约客户' },
  { id:'VIO202608-007', callId:'CL20260817-063', rule:'退订后外呼', severity:'high', time:'2026-08-17 10:30:45', review:'已确认违规', note:'对退订号码185****1010再次呼叫' },
  { id:'VIO202608-008', callId:'CL20260817-029', rule:'频控超限', severity:'low', time:'2026-08-17 09:12:08', review:'已处理', note:'并发数瞬时超限1路，系统自动降速' },
];

const VIOLATION_SUMMARY = { total:8, high:4, medium:2, low:2, reviewed:6, pending:2 };

// ── Status Helpers ─────────────────────────────────────────

function authStatusBadge(status) {
  const map = {
    approved: { label:'已审核', bg:'var(--emerald-50)', text:'var(--emerald-700)', dot:'var(--emerald-500)' },
    pending:  { label:'待审核', bg:'var(--amber-50)',   text:'var(--amber-700)',   dot:'var(--amber-500)' },
    rejected: { label:'已驳回', bg:'var(--rose-50)',    text:'var(--rose-700)',    dot:'var(--rose-500)' },
  };
  const s = map[status] || map.pending;
  return `<span style="display:inline-flex;align-items:center;gap:3px;padding:1px 6px;border-radius:var(--radius-sm);font-size:10.5px;font-weight:500;background:${s.bg};color:${s.text};white-space:nowrap;"><span style="width:5px;height:5px;border-radius:50%;background:${s.dot};flex-shrink:0;"></span>${s.label}</span>`;
}

function blacklistTypeBadge(type) {
  const map = {
    '明确拒接': { bg:'var(--amber-50)', text:'var(--amber-700)' },
    '投诉':     { bg:'var(--rose-50)',  text:'var(--rose-700)' },
    '空号停机': { bg:'var(--ink-100)',  text:'var(--text-muted)' },
    '已脱单':   { bg:'var(--brand-50)', text:'var(--brand-700)' },
  };
  const s = map[type] || map['明确拒接'];
  return `<span style="display:inline-flex;align-items:center;padding:1px 6px;border-radius:var(--radius-sm);font-size:10.5px;font-weight:500;background:${s.bg};color:${s.text};white-space:nowrap;">${type}</span>`;
}

function freqStatusBadge(enabled) {
  if (enabled) {
    return `<span style="display:inline-flex;align-items:center;gap:3px;padding:1px 6px;border-radius:var(--radius-sm);font-size:10.5px;font-weight:500;background:var(--emerald-50);color:var(--emerald-700);white-space:nowrap;"><span style="width:5px;height:5px;border-radius:50%;background:var(--emerald-500);flex-shrink:0;"></span>启用</span>`;
  }
  return `<span style="display:inline-flex;align-items:center;gap:3px;padding:1px 6px;border-radius:var(--radius-sm);font-size:10.5px;font-weight:500;background:var(--ink-100);color:var(--text-muted);white-space:nowrap;"><span style="width:5px;height:5px;border-radius:50%;background:var(--ink-400);flex-shrink:0;"></span>停用</span>`;
}

function severityBadge(sev) {
  const map = {
    high:   { label:'高风险', bg:'var(--rose-50)',    text:'var(--rose-700)',    dot:'var(--rose-500)' },
    medium: { label:'中风险', bg:'var(--amber-50)',   text:'var(--amber-700)',   dot:'var(--amber-500)' },
    low:    { label:'低风险', bg:'var(--blue-50)',    text:'var(--blue-700)',    dot:'var(--blue-500)' },
  };
  const s = map[sev] || map.low;
  return `<span style="display:inline-flex;align-items:center;gap:3px;padding:1px 6px;border-radius:var(--radius-sm);font-size:10.5px;font-weight:600;background:${s.bg};color:${s.text};white-space:nowrap;"><span style="width:5px;height:5px;border-radius:50%;background:${s.dot};flex-shrink:0;"></span>${s.label}</span>`;
}

function reviewBadge(review) {
  const map = {
    '已确认违规': { bg:'var(--rose-50)',    text:'var(--rose-700)' },
    '待复核':     { bg:'var(--amber-50)',   text:'var(--amber-700)' },
    '已申诉通过': { bg:'var(--emerald-50)', text:'var(--emerald-700)' },
    '系统误报':   { bg:'var(--ink-100)',    text:'var(--text-muted)' },
    '已处理':     { bg:'var(--blue-50)',    text:'var(--blue-700)' },
  };
  const s = map[review] || map['待复核'];
  return `<span style="display:inline-flex;align-items:center;padding:1px 6px;border-radius:var(--radius-sm);font-size:10.5px;font-weight:500;background:${s.bg};color:${s.text};white-space:nowrap;">${review}</span>`;
}

// ── View Object ────────────────────────────────────────────
const ComplianceView = {
  get activeTab() { return complianceActiveTab; },

  render() {
    return renderComplianceView();
  },

  switchTab(tab) {
    complianceActiveTab = tab;
    App.refreshCurrentView();
  }
};

// ── Main Render ────────────────────────────────────────────
function renderComplianceView() {
  const tabs = [
    { key:'auth',        label:'授权证据', icon:'file-check', badge:AUTH_SUMMARY.total, badgeColor:'neutral' },
    { key:'blacklist',   label:'黑名单',   icon:'ban',        badge:BLACKLIST_SUMMARY.total, badgeColor:'danger' },
    { key:'unsubscribe', label:'退订台账', icon:'user-x',     badge:UNSUB_SUMMARY.total, badgeColor:'warning' },
    { key:'freq',        label:'频控规则', icon:'timer-off',  badge:FREQ_RULES.filter(r=>r.enabled).length+'/'+FREQ_RULES.length, badgeColor:'success' },
    { key:'violation',   label:'违规记录', icon:'alert-triangle', badge:VIOLATION_SUMMARY.total, badgeColor:'danger' },
  ];

  return `
    <div class="view-fade-enter">

      <!-- Page Header -->
      <div class="page-header">
        <div class="page-title-group">
          <div class="page-title">
            <i data-lucide="shield"></i>
            合规台账
          </div>
          <div class="page-subtitle">授权审核·黑名单·退订·频控·违规审计</div>
        </div>
        <div class="page-actions" style="display:flex;align-items:center;gap:6px;">
          <span class="badge badge-neutral" style="font-size:10px;line-height:16px;background:var(--ink-50);color:var(--text-muted);border:1px solid var(--border-subtle);">
            <i data-lucide="flask-conical" style="width:9px;height:9px;margin-right:2px;"></i>原型台账·模拟数据
          </span>
          <button class="btn btn-outline btn-sm" onclick="exportComplianceData()">
            <i data-lucide="download"></i>导出台账
          </button>
          <button class="btn btn-primary btn-sm" onclick="addComplianceRule()">
            <i data-lucide="plus"></i>新增规则
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div style="display:flex;gap:0;border-bottom:1px solid var(--border-color);margin-bottom:var(--content-gap);">
        ${tabs.map(t => {
          const badgeClass = t.badgeColor === 'danger' ? 'badge-danger' : t.badgeColor === 'warning' ? 'badge-warning' : t.badgeColor === 'success' ? 'badge-success' : 'badge-neutral';
          return `
            <button onclick="switchComplianceTab('${t.key}')" class="tab-btn ${complianceActiveTab===t.key?'active':''}">
              <i data-lucide="${t.icon}" style="width:12px;height:12px;"></i>${t.label}
              <span class="badge ${badgeClass}" style="font-size:9.5px;line-height:15px;margin-left:4px;">${t.badge}</span>
            </button>
          `;
        }).join('')}
      </div>

      <!-- Tab Content -->
      ${renderComplianceTabContent()}

    </div>
  `;
}

function renderComplianceTabContent() {
  switch(complianceActiveTab) {
    case 'auth':        return renderAuthTab();
    case 'blacklist':   return renderBlacklistTab();
    case 'unsubscribe': return renderUnsubscribeTab();
    case 'freq':        return renderFreqTab();
    case 'violation':   return renderViolationTab();
    default:            return renderAuthTab();
  }
}

// ── Tab: 授权证据 ─────────────────────────────────────────
function renderAuthTab() {
  const s = AUTH_SUMMARY;
  let filtered = AUTH_DATA;
  if (authFilterStatus !== 'ALL') {
    filtered = filtered.filter(r => r.status === authFilterStatus);
  }
  if (authFilterChannel !== 'ALL') {
    filtered = filtered.filter(r => r.channel === authFilterChannel);
  }
  if (authSearch) {
    const q = authSearch.toLowerCase();
    filtered = filtered.filter(r =>
      r.leadName.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.phone.includes(q));
  }

  return `
    <!-- KPI Row -->
    <div class="metrics-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:var(--content-gap);">
      <div class="metric-card" style="padding:10px 12px;min-height:56px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
          <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">授权总量</span>
          <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--ink-50);flex-shrink:0;">
            <i data-lucide="file-check" style="width:11px;height:11px;color:var(--ink-500);"></i>
          </div>
        </div>
        <div style="font-size:18px;font-weight:700;color:var(--text-main);font-variant-numeric:tabular-nums;line-height:1.2;">${s.total}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">条</span></div>
      </div>
      <div class="metric-card" style="padding:10px 12px;min-height:56px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
          <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">待审核</span>
          <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--amber-50);flex-shrink:0;">
            <i data-lucide="clock" style="width:11px;height:11px;color:var(--amber-600);"></i>
          </div>
        </div>
        <div style="font-size:18px;font-weight:700;color:var(--amber-600);font-variant-numeric:tabular-nums;line-height:1.2;">${s.pending}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">条</span></div>
      </div>
      <div class="metric-card" style="padding:10px 12px;min-height:56px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
          <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">已通过</span>
          <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--emerald-50);flex-shrink:0;">
            <i data-lucide="check-circle" style="width:11px;height:11px;color:var(--emerald-600);"></i>
          </div>
        </div>
        <div style="font-size:18px;font-weight:700;color:var(--emerald-600);font-variant-numeric:tabular-nums;line-height:1.2;">${s.approved}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">条</span></div>
      </div>
      <div class="metric-card" style="padding:10px 12px;min-height:56px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
          <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">已驳回</span>
          <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--rose-50);flex-shrink:0;">
            <i data-lucide="x-circle" style="width:11px;height:11px;color:var(--rose-600);"></i>
          </div>
        </div>
        <div style="font-size:18px;font-weight:700;color:var(--rose-600);font-variant-numeric:tabular-nums;line-height:1.2;">${s.rejected}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">条</span></div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="filter-bar">
      <div style="position:relative;flex:1;min-width:180px;max-width:220px;">
        <i data-lucide="search" style="position:absolute;left:8px;top:50%;transform:translateY(-50%);width:12px;height:12px;color:var(--text-muted);"></i>
        <input type="text" class="form-input" style="width:100%;height:30px;line-height:30px;padding:0 10px 0 26px;font-size:12px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;"
          placeholder="搜索姓名/授权ID" value="${authSearch}" oninput="setComplianceSearch('auth', this.value)">
      </div>
      <select class="form-select" style="height:30px;padding:0 24px 0 8px;font-size:12px;min-width:100px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;" onchange="setAuthFilterStatus(this.value)">
        <option value="ALL" ${authFilterStatus==='ALL'?'selected':''}>全部状态</option>
        <option value="approved" ${authFilterStatus==='approved'?'selected':''}>已审核</option>
        <option value="pending" ${authFilterStatus==='pending'?'selected':''}>待审核</option>
        <option value="rejected" ${authFilterStatus==='rejected'?'selected':''}>已驳回</option>
      </select>
      <select class="form-select" style="height:30px;padding:0 24px 0 8px;font-size:12px;min-width:110px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;" onchange="setAuthFilterChannel(this.value)">
        <option value="ALL">全部渠道</option>
        <option value="抖音信息流" ${authFilterChannel==='抖音信息流'?'selected':''}>抖音信息流</option>
        <option value="小红书" ${authFilterChannel==='小红书'?'selected':''}>小红书</option>
        <option value="朋友圈" ${authFilterChannel==='朋友圈'?'selected':''}>朋友圈</option>
        <option value="知乎" ${authFilterChannel==='知乎'?'selected':''}>知乎</option>
        <option value="转介绍" ${authFilterChannel==='转介绍'?'selected':''}>转介绍</option>
        <option value="线下地推" ${authFilterChannel==='线下地推'?'selected':''}>线下地推</option>
      </select>
      <select class="form-select" style="height:30px;padding:0 24px 0 8px;font-size:12px;min-width:120px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;">
        <option>全部授权类型</option>
        <option>表单勾选授权</option>
        <option>短信验证码授权</option>
        <option>电话口头授权(录音)</option>
        <option>书面签署授权</option>
      </select>
      <div class="filter-divider"></div>
      <div class="filter-actions">
        <span class="filter-count">${filtered.length}条</span>
        <button class="btn btn-ghost btn-sm" style="height:28px;font-size:11px;" onclick="resetAuthFilters()">
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
              <th style="width:130px;">潜客</th>
              <th style="width:110px;">脱敏号码</th>
              <th style="width:90px;">来源渠道</th>
              <th style="width:130px;">授权类型</th>
              <th style="width:140px;">授权时间</th>
              <th style="width:72px;">证明状态</th>
              <th style="width:70px;">审核人</th>
              <th style="width:80px;text-align:right;">操作</th>
            </tr>
          </thead>
          <tbody class="stagger-container">
            ${filtered.map(row => `
              <tr>
                <td><input type="checkbox" style="width:13px;height:13px;cursor:pointer;accent-color:var(--brand-500);"></td>
                <td>
                  <div style="display:flex;align-items:center;gap:5px;">
                    <div class="lead-avatar-bubble ${row.gender==='女'?'female':''}" style="width:22px;height:22px;font-size:10px;flex-shrink:0;">${row.leadName[0]}</div>
                    <div style="min-width:0;">
                      <div style="font-size:11.5px;font-weight:500;color:var(--text-main);white-space:nowrap;">${row.leadName}</div>
                      <div style="font-size:10px;color:var(--text-muted);white-space:nowrap;">${row.gender}·${row.age}岁</div>
                    </div>
                  </div>
                </td>
                <td><span style="font-size:11.5px;color:var(--text-secondary);font-variant-numeric:tabular-nums;letter-spacing:0.3px;font-family:var(--font-mono);">${row.phone}</span></td>
                <td><div style="font-size:11.5px;color:var(--text-secondary);max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${row.channel}</div></td>
                <td><div style="font-size:11px;color:var(--text-secondary);">${row.authType}</div></td>
                <td><span style="font-size:11.5px;color:var(--text-secondary);font-variant-numeric:tabular-nums;">${row.authTime}</span></td>
                <td>${authStatusBadge(row.status)}</td>
                <td><div style="font-size:11.5px;color:var(--text-muted);">${row.reviewer}</div></td>
                <td style="text-align:right;">
                  <div style="display:flex;gap:2px;justify-content:flex-end;">
                    <button class="btn btn-ghost btn-sm" style="width:26px;height:26px;padding:0;" onclick="viewAuthEvidence('${row.id}')" title="查看证据">
                      <i data-lucide="file-text" style="width:11px;height:11px;"></i>
                    </button>
                    ${row.status === 'pending' ? `
                      <button class="btn btn-ghost btn-sm" style="width:26px;height:26px;padding:0;color:var(--emerald-600);" onclick="approveAuthRecord('${row.id}')" title="通过">
                        <i data-lucide="check" style="width:11px;height:11px;"></i>
                      </button>
                      <button class="btn btn-ghost btn-sm" style="width:26px;height:26px;padding:0;color:var(--rose-600);" onclick="rejectAuthRecord('${row.id}')" title="驳回">
                        <i data-lucide="x" style="width:11px;height:11px;"></i>
                      </button>
                    ` : `
                      <button class="btn btn-ghost btn-sm" style="width:26px;height:26px;padding:0;" onclick="App.showToast('查看详情 · ${row.id}','info')" title="详情">
                        <i data-lucide="eye" style="width:11px;height:11px;"></i>
                      </button>
                    `}
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    ${renderPagination(s.total, 1)}
  `;
}

// ── Tab: 黑名单 ──────────────────────────────────────────
function renderBlacklistTab() {
  // 实时口径: 总数与分类随运行中操作 (退订/加入黑名单) 动态变化
  BLACKLIST_SUMMARY.total = BLACKLIST_DATA.length;
  BLACKLIST_SUMMARY.refuse = BLACKLIST_DATA.filter(b => b.type === '明确拒接').length;
  BLACKLIST_SUMMARY.complaint = BLACKLIST_DATA.filter(b => b.type === '投诉').length;
  BLACKLIST_SUMMARY.invalid = BLACKLIST_DATA.filter(b => b.type === '空号停机').length;
  const s = BLACKLIST_SUMMARY;
  const filteredBlacklist = BLACKLIST_DATA.filter(r => {
    const q = blacklistSearch.toLowerCase();
    const matchSearch = !q || r.leadName.toLowerCase().includes(q) || r.phone.includes(q);
    const matchType = blacklistFilterType === 'ALL' || r.type === blacklistFilterType;
    const matchSource = blacklistFilterSource === 'ALL' || r.source === blacklistFilterSource;
    return matchSearch && matchType && matchSource;
  });
  return `
    <!-- KPI Row -->
    <div class="metrics-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:var(--content-gap);">
      <div class="metric-card" style="padding:10px 12px;min-height:56px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
          <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">黑名单总数</span>
          <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--rose-50);flex-shrink:0;">
            <i data-lucide="ban" style="width:11px;height:11px;color:var(--rose-600);"></i>
          </div>
        </div>
        <div style="font-size:18px;font-weight:700;color:var(--text-main);font-variant-numeric:tabular-nums;line-height:1.2;">${s.total}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">条</span></div>
      </div>
      <div class="metric-card" style="padding:10px 12px;min-height:56px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
          <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">明确拒接</span>
          <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--amber-50);flex-shrink:0;">
            <i data-lucide="phone-off" style="width:11px;height:11px;color:var(--amber-600);"></i>
          </div>
        </div>
        <div style="font-size:18px;font-weight:700;color:var(--amber-600);font-variant-numeric:tabular-nums;line-height:1.2;">${s.refuse}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">条</span></div>
      </div>
      <div class="metric-card" style="padding:10px 12px;min-height:56px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
          <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">投诉标记</span>
          <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--rose-50);flex-shrink:0;">
            <i data-lucide="alert-octagon" style="width:11px;height:11px;color:var(--rose-600);"></i>
          </div>
        </div>
        <div style="font-size:18px;font-weight:700;color:var(--rose-600);font-variant-numeric:tabular-nums;line-height:1.2;">${s.complaint}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">条</span></div>
      </div>
      <div class="metric-card" style="padding:10px 12px;min-height:56px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
          <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">空号/已脱单</span>
          <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--ink-50);flex-shrink:0;">
            <i data-lucide="user-check" style="width:11px;height:11px;color:var(--ink-500);"></i>
          </div>
        </div>
        <div style="font-size:18px;font-weight:700;color:var(--text-secondary);font-variant-numeric:tabular-nums;line-height:1.2;">${s.invalid + s.matched}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">条</span></div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="filter-bar">
      <div style="position:relative;flex:1;min-width:180px;max-width:220px;">
        <i data-lucide="search" style="position:absolute;left:8px;top:50%;transform:translateY(-50%);width:12px;height:12px;color:var(--text-muted);"></i>
        <input type="text" class="form-input" style="width:100%;height:30px;line-height:30px;padding:0 10px 0 26px;font-size:12px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;"
          placeholder="搜索姓名/号码" value="${blacklistSearch}" oninput="setComplianceSearch('blacklist', this.value)">
      </div>
      <select class="form-select" style="height:30px;padding:0 24px 0 8px;font-size:12px;min-width:110px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;" onchange="setComplianceFilter('blacklist','type',this.value)">
        <option value="ALL" ${blacklistFilterType==='ALL'?'selected':''}>全部类型</option>
        <option value="明确拒接" ${blacklistFilterType==='明确拒接'?'selected':''}>明确拒接</option>
        <option value="投诉" ${blacklistFilterType==='投诉'?'selected':''}>投诉</option>
        <option value="空号停机" ${blacklistFilterType==='空号停机'?'selected':''}>空号停机</option>
        <option value="已脱单" ${blacklistFilterType==='已脱单'?'selected':''}>已脱单</option>
      </select>
      <select class="form-select" style="height:30px;padding:0 24px 0 8px;font-size:12px;min-width:110px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;" onchange="setComplianceFilter('blacklist','source',this.value)">
        <option value="ALL" ${blacklistFilterSource==='ALL'?'selected':''}>全部来源</option>
        <option value="AI自动标记" ${blacklistFilterSource==='AI自动标记'?'selected':''}>AI自动标记</option>
        <option value="人工标记" ${blacklistFilterSource==='人工标记'?'selected':''}>人工标记</option>
        <option value="系统自动检测" ${blacklistFilterSource==='系统自动检测'?'selected':''}>系统自动检测</option>
        <option value="客服投诉" ${blacklistFilterSource==='客服投诉'?'selected':''}>客服投诉</option>
        <option value="通话中登记" ${blacklistFilterSource==='通话中登记'?'selected':''}>通话中登记</option>
        <option value="短信退订" ${blacklistFilterSource==='短信退订'?'selected':''}>短信退订</option>
      </select>
      <div class="filter-divider"></div>
      <div class="filter-actions">
        <span class="filter-count">${filteredBlacklist.length}条</span>
        <button class="btn btn-ghost btn-sm" style="height:28px;font-size:11px;" onclick="blacklistSearch='';blacklistFilterType='ALL';blacklistFilterSource='ALL';App.refreshCurrentView();">
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
              <th style="width:100px;">潜客</th>
              <th style="width:110px;">脱敏号码</th>
              <th style="width:80px;">类型</th>
              <th>加入原因</th>
              <th style="width:140px;">生效时间</th>
              <th style="width:100px;">来源</th>
              <th style="width:90px;text-align:right;">操作</th>
            </tr>
          </thead>
          <tbody class="stagger-container">
            ${filteredBlacklist.map(row => `
              <tr>
                <td><input type="checkbox" style="width:13px;height:13px;cursor:pointer;accent-color:var(--brand-500);"></td>
                <td>
                  <div style="display:flex;align-items:center;gap:5px;">
                    ${row.age > 0 ? `
                      <div class="lead-avatar-bubble ${row.gender==='女'?'female':''}" style="width:22px;height:22px;font-size:10px;flex-shrink:0;">${row.leadName[0]}</div>
                      <div style="min-width:0;">
                        <div style="font-size:11.5px;font-weight:500;color:var(--text-main);white-space:nowrap;">${row.leadName}</div>
                        <div style="font-size:10px;color:var(--text-muted);white-space:nowrap;">${row.gender}·${row.age}岁</div>
                      </div>
                    ` : `
                      <div class="lead-avatar-bubble" style="width:22px;height:22px;font-size:10px;flex-shrink:0;background:var(--ink-200);color:var(--text-muted);">?</div>
                      <div style="min-width:0;">
                        <div style="font-size:11.5px;font-weight:500;color:var(--text-muted);white-space:nowrap;">${row.leadName}</div>
                        <div style="font-size:10px;color:var(--text-muted);white-space:nowrap;">无效号码</div>
                      </div>
                    `}
                  </div>
                </td>
                <td><span style="font-size:11.5px;color:var(--text-secondary);font-variant-numeric:tabular-nums;letter-spacing:0.3px;font-family:var(--font-mono);">${row.phone}</span></td>
                <td>${blacklistTypeBadge(row.type)}</td>
                <td><div style="font-size:11.5px;color:var(--text-secondary);max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${row.reason}</div></td>
                <td><span style="font-size:11.5px;color:var(--text-secondary);font-variant-numeric:tabular-nums;">${row.addTime}</span></td>
                <td><div style="font-size:11px;color:var(--text-muted);">${row.source}</div></td>
                <td style="text-align:right;">
                  <div style="display:flex;gap:2px;justify-content:flex-end;">
                    <button class="btn btn-ghost btn-sm" style="width:26px;height:26px;padding:0;" onclick="App.showToast('查看详情 · ${row.id}','info')" title="详情">
                      <i data-lucide="eye" style="width:11px;height:11px;"></i>
                    </button>
                    <button class="btn btn-ghost btn-sm" style="height:26px;padding:0 8px;font-size:10.5px;color:var(--amber-700);border-color:var(--amber-200);" onclick="removeFromBlacklist('${row.id}','${row.leadName}')" title="移出黑名单">
                      <i data-lucide="user-minus" style="width:10px;height:10px;margin-right:2px;"></i>移出
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    ${renderPagination(s.total, 1)}
  `;
}

// ── Tab: 退订台账 ─────────────────────────────────────────
function renderUnsubscribeTab() {
  // 实时口径: 退订总数随运行中操作 (通话中标记退订) 动态变化
  UNSUB_SUMMARY.total = UNSUB_DATA.length;
  const s = UNSUB_SUMMARY;
  const filteredUnsub = UNSUB_DATA.filter(r => {
    const q = unsubSearch.toLowerCase();
    const matchSearch = !q || r.leadName.toLowerCase().includes(q) || r.phone.includes(q);
    const matchChannel = unsubFilterChannel === 'ALL' || r.channel === unsubFilterChannel;
    return matchSearch && matchChannel;
  });
  return `
    <!-- KPI Row -->
    <div class="metrics-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:var(--content-gap);">
      <div class="metric-card" style="padding:10px 12px;min-height:56px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
          <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">退订总数</span>
          <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--rose-50);flex-shrink:0;">
            <i data-lucide="user-x" style="width:11px;height:11px;color:var(--rose-600);"></i>
          </div>
        </div>
        <div style="font-size:18px;font-weight:700;color:var(--text-main);font-variant-numeric:tabular-nums;line-height:1.2;">${s.total}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">条</span></div>
      </div>
      <div class="metric-card" style="padding:10px 12px;min-height:56px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
          <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">通话中退订</span>
          <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--brand-50);flex-shrink:0;">
            <i data-lucide="phone-call" style="width:11px;height:11px;color:var(--brand-600);"></i>
          </div>
        </div>
        <div style="font-size:18px;font-weight:700;color:var(--brand-600);font-variant-numeric:tabular-nums;line-height:1.2;">${s.call}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">条</span></div>
      </div>
      <div class="metric-card" style="padding:10px 12px;min-height:56px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
          <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">短信退订</span>
          <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--violet-50);flex-shrink:0;">
            <i data-lucide="message-square" style="width:11px;height:11px;color:var(--violet-600);"></i>
          </div>
        </div>
        <div style="font-size:18px;font-weight:700;color:var(--violet-600);font-variant-numeric:tabular-nums;line-height:1.2;">${s.sms}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">条</span></div>
      </div>
      <div class="metric-card" style="padding:10px 12px;min-height:56px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
          <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">客服登记</span>
          <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--emerald-50);flex-shrink:0;">
            <i data-lucide="headphones" style="width:11px;height:11px;color:var(--emerald-600);"></i>
          </div>
        </div>
        <div style="font-size:18px;font-weight:700;color:var(--emerald-600);font-variant-numeric:tabular-nums;line-height:1.2;">${s.cs}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">条</span></div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="filter-bar">
      <div style="position:relative;flex:1;min-width:180px;max-width:220px;">
        <i data-lucide="search" style="position:absolute;left:8px;top:50%;transform:translateY(-50%);width:12px;height:12px;color:var(--text-muted);"></i>
        <input type="text" class="form-input" style="width:100%;height:30px;line-height:30px;padding:0 10px 0 26px;font-size:12px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;"
          placeholder="搜索姓名/号码" value="${unsubSearch}" oninput="setComplianceSearch('unsub', this.value)">
      </div>
      <select class="form-select" style="height:30px;padding:0 24px 0 8px;font-size:12px;min-width:100px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;" onchange="setComplianceFilter('unsub','channel',this.value)">
        <option value="ALL" ${unsubFilterChannel==='ALL'?'selected':''}>全部渠道</option>
        <option value="通话中" ${unsubFilterChannel==='通话中'?'selected':''}>通话中</option>
        <option value="短信" ${unsubFilterChannel==='短信'?'selected':''}>短信</option>
        <option value="客服" ${unsubFilterChannel==='客服'?'selected':''}>客服</option>
      </select>
      <div class="filter-divider"></div>
      <div class="filter-actions">
        <span class="filter-count">${filteredUnsub.length}条</span>
        <button class="btn btn-ghost btn-sm" style="height:28px;font-size:11px;" onclick="unsubSearch='';unsubFilterChannel='ALL';App.refreshCurrentView();">
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
              <th style="width:100px;">潜客</th>
              <th style="width:110px;">脱敏号码</th>
              <th style="width:80px;">退订渠道</th>
              <th>原话片段</th>
              <th style="width:72px;">处理状态</th>
              <th style="width:140px;">登记时间</th>
              <th style="width:60px;text-align:right;">操作</th>
            </tr>
          </thead>
          <tbody class="stagger-container">
            ${filteredUnsub.map(row => `
              <tr>
                <td><input type="checkbox" style="width:13px;height:13px;cursor:pointer;accent-color:var(--brand-500);"></td>
                <td>
                  <div style="display:flex;align-items:center;gap:5px;">
                    <div class="lead-avatar-bubble ${row.gender==='女'?'female':''}" style="width:22px;height:22px;font-size:10px;flex-shrink:0;">${row.leadName[0]}</div>
                    <div style="min-width:0;">
                      <div style="font-size:11.5px;font-weight:500;color:var(--text-main);white-space:nowrap;">${row.leadName}</div>
                      <div style="font-size:10px;color:var(--text-muted);white-space:nowrap;">${row.gender}·${row.age}岁</div>
                    </div>
                  </div>
                </td>
                <td><span style="font-size:11.5px;color:var(--text-secondary);font-variant-numeric:tabular-nums;letter-spacing:0.3px;font-family:var(--font-mono);">${row.phone}</span></td>
                <td>
                  <span class="badge ${row.channel==='通话中'?'badge-basic':row.channel==='短信'?'badge-neutral':'badge-success'}" style="font-size:10px;line-height:15px;">${row.channel}</span>
                </td>
                <td>
                  <div style="display:flex;align-items:center;gap:6px;">
                    <i data-lucide="quote" style="width:12px;height:12px;color:var(--ink-300);flex-shrink:0;"></i>
                    <span style="font-size:11px;color:var(--text-secondary);font-style:italic;max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">"${row.quote}"</span>
                  </div>
                </td>
                <td>
                  ${row.status === '已处理'
                    ? `<span style="display:inline-flex;align-items:center;gap:3px;padding:1px 6px;border-radius:var(--radius-sm);font-size:10.5px;font-weight:500;background:var(--emerald-50);color:var(--emerald-700);white-space:nowrap;"><span style="width:5px;height:5px;border-radius:50%;background:var(--emerald-500);flex-shrink:0;"></span>已处理</span>`
                    : `<span style="display:inline-flex;align-items:center;gap:3px;padding:1px 6px;border-radius:var(--radius-sm);font-size:10.5px;font-weight:500;background:var(--amber-50);color:var(--amber-700);white-space:nowrap;"><span style="width:5px;height:5px;border-radius:50%;background:var(--amber-500);flex-shrink:0;"></span>处理中</span>`
                  }
                </td>
                <td><span style="font-size:11.5px;color:var(--text-secondary);font-variant-numeric:tabular-nums;">${row.regTime}</span></td>
                <td style="text-align:right;">
                  <div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px;">
                    <span class="badge badge-danger" style="font-size:9px;line-height:14px;">禁止加入任务</span>
                    <button class="btn btn-ghost btn-sm" style="width:26px;height:22px;padding:0;" onclick="App.showToast('查看详情 · ${row.id}','info')" title="详情">
                      <i data-lucide="eye" style="width:10px;height:10px;"></i>
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    ${renderPagination(s.total, 1)}
  `;
}

// ── Tab: 频控规则 ─────────────────────────────────────────
function renderFreqTab() {
  const s = FREQ_SUMMARY;
  const enabledCount = FREQ_RULES.filter(r => r.enabled).length;

  return `
    <!-- KPI Row -->
    <div class="metrics-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:var(--content-gap);">
      <div class="metric-card" style="padding:10px 12px;min-height:56px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
          <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">规则总数</span>
          <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--ink-50);flex-shrink:0;">
            <i data-lucide="settings-2" style="width:11px;height:11px;color:var(--ink-500);"></i>
          </div>
        </div>
        <div style="font-size:18px;font-weight:700;color:var(--text-main);font-variant-numeric:tabular-nums;line-height:1.2;">${s.total}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">条</span></div>
      </div>
      <div class="metric-card" style="padding:10px 12px;min-height:56px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
          <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">已启用</span>
          <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--emerald-50);flex-shrink:0;">
            <i data-lucide="check-circle" style="width:11px;height:11px;color:var(--emerald-600);"></i>
          </div>
        </div>
        <div style="font-size:18px;font-weight:700;color:var(--emerald-600);font-variant-numeric:tabular-nums;line-height:1.2;">${enabledCount}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">条</span></div>
      </div>
      <div class="metric-card" style="padding:10px 12px;min-height:56px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
          <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">已停用</span>
          <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--ink-100);flex-shrink:0;">
            <i data-lucide="pause-circle" style="width:11px;height:11px;color:var(--ink-500);"></i>
          </div>
        </div>
        <div style="font-size:18px;font-weight:700;color:var(--text-secondary);font-variant-numeric:tabular-nums;line-height:1.2;">${s.disabled}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">条</span></div>
      </div>
      <div class="metric-card" style="padding:10px 12px;min-height:56px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
          <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">今日拦截</span>
          <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--rose-50);flex-shrink:0;">
            <i data-lucide="shield-alert" style="width:11px;height:11px;color:var(--rose-600);"></i>
          </div>
        </div>
        <div style="font-size:18px;font-weight:700;color:var(--rose-600);font-variant-numeric:tabular-nums;line-height:1.2;">${s.blocked}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">次</span></div>
      </div>
    </div>

    <!-- Rule Cards List -->
    <div style="display:flex;flex-direction:column;gap:8px;">
      ${FREQ_RULES.map((rule, idx) => `
        <div class="card" style="padding:14px 16px;display:flex;align-items:center;gap:14px;">
          <div style="width:36px;height:36px;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;flex-shrink:0;
            ${rule.enabled ? 'background:var(--brand-50);color:var(--brand-600);' : 'background:var(--ink-100);color:var(--text-muted);'}">
            <i data-lucide="${rule.icon}" style="width:16px;height:16px;"></i>
          </div>
          <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px;">
              <span style="font-size:12.5px;font-weight:600;color:var(--text-main);">${rule.name}</span>
              ${freqStatusBadge(rule.enabled)}
              <span style="font-size:10px;color:var(--text-muted);font-family:var(--font-mono);">${rule.id}</span>
            </div>
            <div style="font-size:11px;color:var(--text-secondary);margin-bottom:6px;line-height:1.5;">${rule.desc}</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              ${Object.entries(rule.params).map(([k,v]) => `
                <span style="display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:var(--radius-sm);background:var(--ink-50);font-size:10.5px;color:var(--text-secondary);">
                  <span style="color:var(--text-muted);">${k}:</span><span style="font-weight:600;color:var(--text-main);font-variant-numeric:tabular-nums;">${v}</span>
                </span>
              `).join('')}
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
            <button class="btn btn-ghost btn-sm" style="height:28px;padding:0 10px;font-size:11px;" onclick="App.showToast('编辑规则 · ${rule.name}','info')">
              <i data-lucide="edit-2" style="width:11px;height:11px;"></i>编辑
            </button>
            <!-- Toggle Switch -->
            <label style="position:relative;display:inline-block;width:38px;height:20px;cursor:pointer;" onclick="toggleFreqRule('${rule.id}','${rule.name}');event.preventDefault();">
              <span style="position:absolute;inset:0;border-radius:10px;transition:0.2s;${rule.enabled ? 'background:var(--emerald-500);' : 'background:var(--ink-300);'}">
                <span style="position:absolute;top:2px;left:${rule.enabled ? '20px' : '2px'};width:16px;height:16px;border-radius:50%;background:#fff;transition:0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.15);"></span>
              </span>
            </label>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Pagination info -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-top:12px;padding:0 2px;">
      <div style="font-size:11px;color:var(--text-muted);font-variant-numeric:tabular-nums;">共 ${s.total} 条规则</div>
      <div style="display:flex;gap:3px;">
        <button class="btn btn-primary btn-sm" style="min-width:28px;padding:0 8px;">1</button>
      </div>
    </div>
  `;
}

// ── Tab: 违规记录 ─────────────────────────────────────────
function renderViolationTab() {
  const s = VIOLATION_SUMMARY;
  const filteredViolations = VIOLATION_DATA.filter(r => {
    const q = violationSearch.toLowerCase();
    const matchSearch = !q || r.id.toLowerCase().includes(q) || r.callId.toLowerCase().includes(q);
    const matchSeverity = violationFilterSeverity === 'ALL' || r.severity === violationFilterSeverity;
    const matchReview = violationFilterReview === 'ALL' || r.review === violationFilterReview;
    const matchRule = violationFilterRule === 'ALL' || r.rule === violationFilterRule;
    return matchSearch && matchSeverity && matchReview && matchRule;
  });
  return `
    <!-- KPI Row -->
    <div class="metrics-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:var(--content-gap);">
      <div class="metric-card" style="padding:10px 12px;min-height:56px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
          <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">违规总数</span>
          <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--rose-50);flex-shrink:0;">
            <i data-lucide="alert-triangle" style="width:11px;height:11px;color:var(--rose-600);"></i>
          </div>
        </div>
        <div style="font-size:18px;font-weight:700;color:var(--text-main);font-variant-numeric:tabular-nums;line-height:1.2;">${s.total}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">条</span></div>
      </div>
      <div class="metric-card" style="padding:10px 12px;min-height:56px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
          <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">高风险</span>
          <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--rose-50);flex-shrink:0;">
            <i data-lucide="alert-octagon" style="width:11px;height:11px;color:var(--rose-600);"></i>
          </div>
        </div>
        <div style="font-size:18px;font-weight:700;color:var(--rose-600);font-variant-numeric:tabular-nums;line-height:1.2;">${s.high}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">条</span></div>
      </div>
      <div class="metric-card" style="padding:10px 12px;min-height:56px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
          <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">中风险</span>
          <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--amber-50);flex-shrink:0;">
            <i data-lucide="alert-circle" style="width:11px;height:11px;color:var(--amber-600);"></i>
          </div>
        </div>
        <div style="font-size:18px;font-weight:700;color:var(--amber-600);font-variant-numeric:tabular-nums;line-height:1.2;">${s.medium}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">条</span></div>
      </div>
      <div class="metric-card" style="padding:10px 12px;min-height:56px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
          <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">待复核</span>
          <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--blue-50);flex-shrink:0;">
            <i data-lucide="search" style="width:11px;height:11px;color:var(--blue-500);"></i>
          </div>
        </div>
        <div style="font-size:18px;font-weight:700;color:var(--blue-700);font-variant-numeric:tabular-nums;line-height:1.2;">${s.pending}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">条</span></div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="filter-bar">
      <div style="position:relative;flex:1;min-width:180px;max-width:220px;">
        <i data-lucide="search" style="position:absolute;left:8px;top:50%;transform:translateY(-50%);width:12px;height:12px;color:var(--text-muted);"></i>
        <input type="text" class="form-input" style="width:100%;height:30px;line-height:30px;padding:0 10px 0 26px;font-size:12px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;"
          placeholder="搜索记录ID/通话ID" value="${violationSearch}" oninput="setComplianceSearch('violation', this.value)">
      </div>
      <select class="form-select" style="height:30px;padding:0 24px 0 8px;font-size:12px;min-width:100px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;" onchange="setComplianceFilter('violation','severity',this.value)">
        <option value="ALL" ${violationFilterSeverity==='ALL'?'selected':''}>全部风险</option>
        <option value="high" ${violationFilterSeverity==='high'?'selected':''}>高风险</option>
        <option value="medium" ${violationFilterSeverity==='medium'?'selected':''}>中风险</option>
        <option value="low" ${violationFilterSeverity==='low'?'selected':''}>低风险</option>
      </select>
      <select class="form-select" style="height:30px;padding:0 24px 0 8px;font-size:12px;min-width:100px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;" onchange="setComplianceFilter('violation','review',this.value)">
        <option value="ALL" ${violationFilterReview==='ALL'?'selected':''}>全部复核</option>
        <option value="已确认违规" ${violationFilterReview==='已确认违规'?'selected':''}>已确认违规</option>
        <option value="待复核" ${violationFilterReview==='待复核'?'selected':''}>待复核</option>
        <option value="已申诉通过" ${violationFilterReview==='已申诉通过'?'selected':''}>已申诉通过</option>
        <option value="系统误报" ${violationFilterReview==='系统误报'?'selected':''}>系统误报</option>
        <option value="已处理" ${violationFilterReview==='已处理'?'selected':''}>已处理</option>
      </select>
      <select class="form-select" style="height:30px;padding:0 24px 0 8px;font-size:12px;min-width:110px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;" onchange="setComplianceFilter('violation','rule',this.value)">
        <option value="ALL" ${violationFilterRule==='ALL'?'selected':''}>全部规则</option>
        ${[...new Set(VIOLATION_DATA.map(r => r.rule))].map(rl => `<option value="${rl}" ${violationFilterRule===rl?'selected':''}>${rl}</option>`).join('')}
      </select>
      <div class="filter-divider"></div>
      <div class="filter-actions">
        <span class="filter-count">${filteredViolations.length}条</span>
        <button class="btn btn-ghost btn-sm" style="height:28px;font-size:11px;" onclick="violationSearch='';violationFilterSeverity='ALL';violationFilterReview='ALL';violationFilterRule='ALL';App.refreshCurrentView();">
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
              <th style="width:130px;">记录ID</th>
              <th style="width:140px;">关联通话ID</th>
              <th style="width:110px;">违规规则</th>
              <th style="width:72px;">风险级别</th>
              <th style="width:140px;">发生时间</th>
              <th style="width:90px;">复核结果</th>
              <th style="width:60px;text-align:right;">操作</th>
            </tr>
          </thead>
          <tbody class="stagger-container">
            ${filteredViolations.map(row => `
              <tr onclick="jumpToCallDetail('${row.callId}')" style="cursor:pointer;">
                <td>
                  <span style="font-size:11.5px;font-weight:500;color:var(--brand-600);font-variant-numeric:tabular-nums;font-family:var(--font-mono);">${row.id}</span>
                </td>
                <td>
                  <span style="font-size:11px;color:var(--text-secondary);font-variant-numeric:tabular-nums;font-family:var(--font-mono);">${row.callId}</span>
                </td>
                <td>
                  <div style="font-size:11.5px;color:var(--text-main);max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${row.rule}">${row.rule}</div>
                </td>
                <td>${severityBadge(row.severity)}</td>
                <td><span style="font-size:11.5px;color:var(--text-secondary);font-variant-numeric:tabular-nums;">${row.time}</span></td>
                <td>${reviewBadge(row.review)}</td>
                <td style="text-align:right;" onclick="event.stopPropagation();">
                  <div style="display:flex;gap:2px;justify-content:flex-end;">
                    <button class="btn btn-ghost btn-sm" style="width:26px;height:26px;padding:0;" onclick="jumpToCallDetail('${row.callId}')" title="查看通话">
                      <i data-lucide="phone" style="width:11px;height:11px;"></i>
                    </button>
                    <button class="btn btn-ghost btn-sm" style="width:26px;height:26px;padding:0;" onclick="App.showToast('违规复核 · ${row.id}','info')" title="复核">
                      <i data-lucide="shield" style="width:11px;height:11px;"></i>
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    ${renderPagination(s.total, 1)}
  `;
}

// ── Shared Pagination (单页展示, 数据量小无需翻页) ──
function renderPagination(total, current) {
  return `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;padding:0 2px;">
      <div style="font-size:11px;color:var(--text-muted);font-variant-numeric:tabular-nums;">共 ${total} 条</div>
      ${total > 0 ? `
      <div style="display:flex;gap:3px;">
        <button class="btn btn-outline btn-sm" style="min-width:28px;padding:0 6px;" disabled><i data-lucide="chevron-left" style="width:11px;height:11px;"></i></button>
        <button class="btn btn-primary btn-sm" style="min-width:28px;padding:0 8px;">${current}</button>
        <button class="btn btn-outline btn-sm" style="min-width:28px;padding:0 6px;" disabled><i data-lucide="chevron-right" style="width:11px;height:11px;"></i></button>
      </div>` : ''}
    </div>
  `;
}

// ── Actions ────────────────────────────────────────────────

function switchComplianceTab(tab) {
  ComplianceView.switchTab(tab);
}

function setAuthFilterStatus(val) {
  authFilterStatus = val;
  App.refreshCurrentView();
}

function setAuthFilterChannel(val) {
  authFilterChannel = val;
  App.refreshCurrentView();
}

function resetAuthFilters() {
  authFilterStatus = 'ALL';
  authFilterChannel = 'ALL';
  App.showToast('筛选条件已重置', 'info');
  App.refreshCurrentView();
}

function viewAuthEvidence(id) {
  App.showToast('查看授权凭证抽屉 · ' + id, 'info');
}

// ── 授权审核真实联动 (写入合规台账 + 名单池 + 审计流) ──
function approveAuthRecord(id) {
  const row = AUTH_DATA.find(r => r.id === id);
  if (!row || row.status !== 'pending') return;
  row.status = 'approved';
  row.reviewer = '林总监';
  AUTH_SUMMARY.pending = Math.max(0, AUTH_SUMMARY.pending - 1);
  AUTH_SUMMARY.approved += 1;
  AppState.updateImportPool({ pending: -1, approved: 1 });
  AppState.recordAudit('合规准入', '授权审核通过', id, '成功', `${row.leadName} 授权证据核验通过，进入可外呼池`);
  // 同步潜客实体: 待审核 → 可外呼
  const lead = AppState.resolveLead(row);
  if (lead && lead.status === 'pending') lead.status = 'approved';
  App.showToast(`已通过 ${row.leadName} 的授权审核，可外呼数 +1`, 'success');
  App.refreshCurrentView();
}

function rejectAuthRecord(id) {
  const row = AUTH_DATA.find(r => r.id === id);
  if (!row || row.status !== 'pending') return;
  row.status = 'rejected';
  row.reviewer = '林总监';
  AUTH_SUMMARY.pending = Math.max(0, AUTH_SUMMARY.pending - 1);
  AUTH_SUMMARY.rejected += 1;
  AppState.updateImportPool({ pending: -1, approved: -1 });
  AppState.recordAudit('合规准入', '授权审核驳回', id, '成功', `${row.leadName} 授权证据不完整，已移出可外呼池`);
  const lead = AppState.resolveLead(row);
  if (lead) lead.status = 'refused';
  App.showToast(`已驳回 ${row.leadName}，该线索移出可外呼池`, 'warning');
  App.refreshCurrentView();
}

function removeFromBlacklist(id, name) {
  App.showModal({
    title: '移出黑名单',
    content: `
      <div style="font-size:12px;color:var(--text-secondary);line-height:1.6;">
        <div style="margin-bottom:10px;">确定要将 <strong style="color:var(--text-main);">${name}</strong> 移出黑名单吗？</div>
        <div style="padding:8px 10px;background:var(--amber-50);border-radius:var(--radius-sm);border-left:3px solid var(--amber-500);font-size:11px;color:var(--amber-700);">
          <i data-lucide="alert-triangle" style="width:12px;height:12px;vertical-align:-2px;margin-right:4px;"></i>
          移出后该号码将重新进入可外呼池，请确认操作合规。
        </div>
      </div>
    `,
    confirmText: '确认移出',
    onConfirm: () => {
      const idx = BLACKLIST_DATA.findIndex(b => b.id === id);
      if (idx >= 0) {
        BLACKLIST_DATA.splice(idx, 1);
        AppState.updateImportPool({ approved: 1 });
        AppState.recordAudit('合规台账', '移出黑名单', name, '成功', '号码已恢复可外呼资格');
      }
      App.showToast(name + ' 已移出黑名单，可外呼数 +1', 'success');
      App.refreshCurrentView();
    }
  });
}

function toggleFreqRule(id, name) {
  App.showToast('规则「' + name + '」状态已切换（演示）', 'success');
}

function jumpToCallDetail(callId) {
  App.showToast('跳转到通话详情 ' + callId, 'info');
  setTimeout(() => {
    App.navigate('calls');
  }, 300);
}

function exportComplianceData() {
  App.showToast('合规台账导出中...', 'success');
}

function addComplianceRule() {
  App.showToast('新增规则面板演示中', 'info');
}

// ── Window Exports ─────────────────────────────────────────
window.ComplianceView = ComplianceView;
window.switchComplianceTab = switchComplianceTab;
window.setAuthFilterStatus = setAuthFilterStatus;
window.setAuthFilterChannel = setAuthFilterChannel;
window.resetAuthFilters = resetAuthFilters;
window.viewAuthEvidence = viewAuthEvidence;
window.approveAuthRecord = approveAuthRecord;
window.rejectAuthRecord = rejectAuthRecord;
window.removeFromBlacklist = removeFromBlacklist;
window.toggleFreqRule = toggleFreqRule;
window.jumpToCallDetail = jumpToCallDetail;
window.exportComplianceData = exportComplianceData;
window.addComplianceRule = addComplianceRule;

// ── 共享数据注册: 挂载到 AppState 状态总线 (跨页联动数据源唯一) ──
(function registerComplianceShared() {
  if (!window.AppState || !AppState.shared) return;
  AppState.shared.authRecords = AUTH_DATA;
  AppState.shared.blacklist = BLACKLIST_DATA;
  AppState.shared.unsubscribes = UNSUB_DATA;
  AppState.shared.violations = VIOLATION_DATA;
  // 黑名单/退订台账联动 importPool 初始口径 (标准100样本)
  const pool = AppState.shared.importPool;
  pool.blacklist = 3; pool.unsub = 2; pool.available = pool.approved;
})();
