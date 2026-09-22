// View: Audit (操作审计日志) - 关键操作留痕·操作可追溯·风险可审计

// ── State ──────────────────────────────────────────────────
let auditFilterTime = '7d';
let auditFilterModule = 'ALL';
let auditFilterResult = 'ALL';
let auditSearchUser = '';
let auditCurrentPage = 1;
let _currentAuditId = null;

// ── Mock Data ──────────────────────────────────────────────
const USERS = {
  wang:  { name: '王主管', role: '管理员',   roleKey: 'admin' },
  li:    { name: '李工',   role: '技术运营', roleKey: 'techops' },
  zhang: { name: '张运营', role: '运营',     roleKey: 'ops' },
  chen:  { name: '陈质检', role: '质检',     roleKey: 'qa' },
  zhou:  { name: '周红娘', role: '红娘',     roleKey: 'matchmaker' },
};

const AUDIT_DATA = [
  { id:'LOG20260820-001', user:'wang',  time:'08-20 08:50:12', module:'系统登录', moduleKey:'system',     action:'登录',   target:'Web管理后台',           ip:'192.168.1.***', result:'success', duration:342,
    ua:'Chrome/126.0 · Windows 10', params:{ loginType:'账号密码', rememberMe:true }, before:null, after:{ status:'在线' }, refId:null },
  { id:'LOG20260820-002', user:'zhang', time:'08-20 09:15:33', module:'名单管理', moduleKey:'leads',      action:'导入',   target:'8月高意向客户名单.xlsx (3,248条)', ip:'192.168.1.***', result:'success', duration:4820,
    ua:'Chrome/126.0 · Windows 10', params:{ fileName:'8月高意向客户名单.xlsx', rowCount:3248, dedupHits:127 }, before:{ poolSize:48210 }, after:{ poolSize:51331 }, refId:null },
  { id:'LOG20260820-003', user:'li',    time:'08-20 09:42:08', module:'系统集成', moduleKey:'integrations', action:'测试', target:'SmartCall SIP集群连接', ip:'192.168.1.***', result:'success', duration:1256,
    ua:'Chrome/126.0 · macOS 14', params:{ endpoint:'sip.smartcall.ai:5060', transport:'UDP', timeout:3000 }, before:{ status:'未测试' }, after:{ status:'连通正常', latency:'28ms' }, refId:null },
  { id:'LOG20260820-004', user:'chen',  time:'08-20 10:20:45', module:'智能质检', moduleKey:'qa',         action:'复核',   target:'质检批次QA-0820 (32条)', ip:'192.168.1.***', result:'partial', duration:124500,
    ua:'Chrome/126.0 · Windows 10', params:{ batchId:'QA-0820', totalItems:32, autoFlagged:8 }, before:{ pendingReview:8 }, after:{ confirmed:5, overturned:2, escalated:1 }, refId:'QA-0820' },
  { id:'LOG20260820-005', user:'wang',  time:'08-20 11:05:22', module:'外呼任务', moduleKey:'campaigns',  action:'启停',   target:'8月VIP客户回访活动',     ip:'192.168.1.***', result:'success', duration:890,
    ua:'Chrome/126.0 · Windows 10', params:{ campaignId:'CMP-20260820-VIP', action:'start', concurrency:20 }, before:{ status:'待启动' }, after:{ status:'运行中', activeCalls:0 }, refId:'CMP-20260820-VIP' },
  { id:'LOG20260820-006', user:'zhang', time:'08-20 13:30:18', module:'合规台账', moduleKey:'compliance', action:'审核',   target:'授权批次AU20260820 (12条)', ip:'192.168.1.***', result:'success', duration:6720,
    ua:'Chrome/126.0 · Windows 10', params:{ batchId:'AU20260820', approved:8, rejected:2, pending:2 }, before:{ pending:12 }, after:{ approved:8, rejected:2, pending:2 }, refId:'AU20260820' },
  { id:'LOG20260820-007', user:'li',    time:'08-20 14:12:55', module:'规则配置', moduleKey:'rules',      action:'修改',   target:'单号日上限规则 FR-005',  ip:'192.168.1.***', result:'success', duration:1560,
    ua:'Chrome/126.0 · macOS 14', params:{ ruleId:'FR-005', field:'dailyMax', oldValue:'1次/号', newValue:'2次/号' }, before:{ dailyMax:'1次/号' }, after:{ dailyMax:'2次/号', cooldown:'24小时' }, refId:'FR-005' },
  { id:'LOG20260820-008', user:'zhou',  time:'08-20 15:00:00', module:'系统登录', moduleKey:'system',     action:'登录',   target:'红娘工作台',             ip:'192.168.1.***', result:'success', duration:298,
    ua:'Safari/17.6 · iPadOS 17', params:{ loginType:'SSO-企微', device:'iPad' }, before:null, after:{ status:'在线' }, refId:null },
  { id:'LOG20260820-009', user:'wang',  time:'08-20 15:45:30', module:'流程编排', moduleKey:'flows',      action:'发布',   target:'初访破冰流程 v3.2',      ip:'192.168.1.***', result:'success', duration:8340,
    ua:'Chrome/126.0 · Windows 10', params:{ flowId:'FLW-001', version:'v3.2', note:'优化开场白，增加年龄分层', rollbackVersion:'v3.1' }, before:{ activeVersion:'v3.1' }, after:{ activeVersion:'v3.2' }, refId:'FLW-001-v3.2' },
  { id:'LOG20260820-010', user:'li',    time:'08-20 16:20:10', module:'线路管理', moduleKey:'lines',      action:'启停',   target:'SIP-003 电信杭州专线',   ip:'192.168.1.***', result:'fail',    duration:15230,
    ua:'Chrome/126.0 · macOS 14', params:{ lineId:'SIP-003', action:'disable', reason:'例行维护' }, before:{ status:'正常' }, after:{ status:'停用失败', error:'SIP注册超时' }, refId:'SIP-003',
    error:'SIP注册服务器 503 超时，3次重试均失败，线路仍有12路活跃通话，无法强制停用' },
  { id:'LOG20260820-011', user:'zhang', time:'08-20 17:05:42', module:'数据报表', moduleKey:'reports',    action:'导出',   target:'本周外呼通话明细 (1,856条)', ip:'192.168.1.***', result:'success', duration:12600,
    ua:'Chrome/126.0 · Windows 10', params:{ type:'call_detail', dateRange:'2026-08-14~2026-08-20', format:'xlsx', includeRecording:false }, before:null, after:{ fileSize:'3.2MB' }, refId:null },
  { id:'LOG20260819-001', user:'li',    time:'08-19 08:55:20', module:'系统登录', moduleKey:'system',     action:'登录',   target:'Web管理后台',           ip:'192.168.1.***', result:'success', duration:312,
    ua:'Chrome/126.0 · macOS 14', params:{ loginType:'账号密码' }, before:null, after:{ status:'在线' }, refId:null },
  { id:'LOG20260819-002', user:'zhang', time:'08-19 09:30:15', module:'外呼任务', moduleKey:'campaigns',  action:'启停',   target:'七夕活动预热外呼',       ip:'192.168.1.***', result:'success', duration:1120,
    ua:'Chrome/126.0 · Windows 10', params:{ campaignId:'CMP-20260819-QX', action:'start', concurrency:30 }, before:{ status:'待启动' }, after:{ status:'运行中' }, refId:'CMP-20260819-QX' },
  { id:'LOG20260819-003', user:'wang',  time:'08-19 10:45:33', module:'合规台账', moduleKey:'compliance', action:'加入',   target:'黑名单:刘建平(投诉)',    ip:'192.168.1.***', result:'success', duration:450,
    ua:'Chrome/126.0 · Windows 10', params:{ phone:'135****0019', type:'投诉', reason:'辱骂AI坐席', source:'客服投诉' }, before:{ status:'正常名单' }, after:{ status:'黑名单', listType:'投诉' }, refId:'BL202608-001' },
  { id:'LOG20260819-004', user:'chen',  time:'08-19 11:20:08', module:'智能质检', moduleKey:'qa',         action:'复核',   target:'质检批次QA-0819 (28条)', ip:'192.168.1.***', result:'success', duration:98400,
    ua:'Chrome/126.0 · Windows 10', params:{ batchId:'QA-0819', totalItems:28, autoFlagged:6 }, before:{ pendingReview:6 }, after:{ confirmed:4, overturned:2 }, refId:'QA-0819' },
  { id:'LOG20260819-005', user:'li',    time:'08-19 14:05:42', module:'知识库',   moduleKey:'knowledge',  action:'绑定',   target:'MaxKB: 高端婚恋话术库 v2', ip:'192.168.1.***', result:'success', duration:2340,
    ua:'Chrome/126.0 · macOS 14', params:{ appId:'KB-002', appName:'高端婚恋话术库', version:'v2', bindingFlow:'FLW-001' }, before:{ binding:null }, after:{ binding:'KB-002@v2', hitRate:'94.2%' }, refId:'KB-002' },
  { id:'LOG20260819-006', user:'zhang', time:'08-19 15:30:55', module:'名单管理', moduleKey:'leads',      action:'导入',   target:'抖音线索-819.csv',      ip:'192.168.1.***', result:'fail',    duration:3200,
    ua:'Chrome/126.0 · Windows 10', params:{ fileName:'抖音线索-819.csv', expectedRows:1820 }, before:{ poolSize:51331 }, after:null, refId:null,
    error:'CSV文件第42行、第156行、第892行手机号格式校验失败，且缺少"来源渠道"必填字段列，导入已中止' },
  { id:'LOG20260819-007', user:'wang',  time:'08-19 16:50:22', module:'评分规则', moduleKey:'scoring',    action:'发布',   target:'意向评分维度 v2.1',      ip:'192.168.1.***', result:'success', duration:5680,
    ua:'Chrome/126.0 · Windows 10', params:{ version:'v2.1', dimensions:['通话时长','互动轮次','主动提问','邀约意向'], threshold:{ A:85, B:70, C:50 } }, before:{ activeVersion:'v2.0' }, after:{ activeVersion:'v2.1' }, refId:'SCR-v2.1' },
  { id:'LOG20260818-001', user:'li',    time:'08-18 09:10:30', module:'坐席管理', moduleKey:'agents',     action:'启用',   target:'坐席: 赵敏(AG-012)',     ip:'192.168.1.***', result:'success', duration:680,
    ua:'Chrome/126.0 · macOS 14', params:{ agentId:'AG-012', agentName:'赵敏', skillGroup:'高端组', maxLoad:5 }, before:{ status:'请假停用' }, after:{ status:'在线', load:0 }, refId:'AG-012' },
  { id:'LOG20260818-002', user:'zhang', time:'08-18 10:25:18', module:'通话记录', moduleKey:'calls',      action:'导出',   target:'红娘跟进录音列表 (420条)', ip:'192.168.1.***', result:'success', duration:18900,
    ua:'Chrome/126.0 · Windows 10', params:{ type:'recording_list', dateRange:'2026-08-11~2026-08-17', agent:'周红娘', format:'zip' }, before:null, after:{ fileSize:'1.2GB', fileCount:420 }, refId:null },
  { id:'LOG20260818-003', user:'li',    time:'08-18 14:15:45', module:'规则配置', moduleKey:'rules',      action:'修改',   target:'AI开场白Prompt',         ip:'192.168.1.***', result:'success', duration:1890,
    ua:'Chrome/126.0 · macOS 14', params:{ promptId:'PRM-001', field:'greeting', changeLen:'+28字', note:'增加地域亲切感表达' }, before:{ promptVersion:'v5' }, after:{ promptVersion:'v6' }, refId:'PRM-001-v6' },
  { id:'LOG20260818-004', user:'wang',  time:'08-18 17:30:00', module:'线路管理', moduleKey:'lines',      action:'启停',   target:'SIP-002 联通宁波备用线', ip:'192.168.1.***', result:'success', duration:1230,
    ua:'Chrome/126.0 · Windows 10', params:{ lineId:'SIP-002', action:'disable', reason:'负载调整' }, before:{ status:'正常', activeCalls:0 }, after:{ status:'已停用' }, refId:'SIP-002' },
  { id:'LOG20260818-005', user:'zhou',  time:'08-18 18:05:12', module:'系统登录', moduleKey:'system',     action:'登出',   target:'红娘工作台',             ip:'192.168.1.***', result:'success', duration:120,
    ua:'Safari/17.6 · iPadOS 17', params:{ sessionDuration:'3h05m', handled:18 }, before:{ status:'在线' }, after:{ status:'离线' }, refId:null },
  { id:'LOG20260817-001', user:'zhang', time:'08-17 09:00:22', module:'合规台账', moduleKey:'compliance', action:'移出',   target:'黑名单:孙大伟(空号恢复)', ip:'192.168.1.***', result:'success', duration:380,
    ua:'Chrome/126.0 · Windows 10', params:{ phone:'137****5566', reason:'号码复机，客户主动联系', approver:'王主管' }, before:{ status:'黑名单', listType:'空号停机' }, after:{ status:'正常名单' }, refId:null },
  { id:'LOG20260817-002', user:'li',    time:'08-17 13:45:10', module:'知识库',   moduleKey:'knowledge',  action:'解绑',   target:'MaxKB: 通用闲聊库 v1',  ip:'192.168.1.***', result:'success', duration:1560,
    ua:'Chrome/126.0 · macOS 14', params:{ appId:'KB-001', reason:'已合并至高端婚恋话术库v2' }, before:{ binding:'KB-001@v1' }, after:{ binding:null }, refId:'KB-001' },
  { id:'LOG20260814-001', user:'wang',  time:'08-14 10:30:55', module:'坐席管理', moduleKey:'agents',     action:'停用',   target:'坐席批量停用 (5人)',     ip:'192.168.1.***', result:'partial', duration:3450,
    ua:'Chrome/126.0 · Windows 10', params:{ agentIds:['AG-008','AG-015','AG-019','AG-022','AG-027'], reason:'排班调整' }, before:{ allActive:5 }, after:{ deactivated:3, stillOnCall:2 }, refId:null,
    error:'AG-015(孙静)、AG-022(李强)仍在通话中，已标记为"待停用"，通话结束后自动下线' },
];

// ── 运行时审计流合并: 全站关键操作 (审核/退订/转派/启停等) 实时汇入本页 ──
(function mergeRuntimeAudits() {
  if (!window.AppState || !AppState.shared || !AppState.shared.auditLogs) return;
  const keyMap = { '合规准入':'compliance', '退订管理':'compliance', '外呼任务':'campaigns', '企微加粉':'calls', '转人工':'calls', '意向评分':'scoring', '智能质检':'qa', '名单管理':'leads' };
  AppState.shared.auditLogs.forEach(r => {
    if (AUDIT_DATA.some(d => d.id === r.id)) return;
    AUDIT_DATA.unshift({
      id: r.id,
      user: 'wang',
      time: (r.time || '').replace(/^(\d{4})-(\d{2}-\d{2})/, '$2'),
      module: r.module,
      moduleKey: keyMap[r.module] || 'system',
      action: r.action,
      target: (r.object || '') + (r.detail ? ' · ' + r.detail : ''),
      ip: r.ip,
      result: r.result === '失败' ? 'fail' : 'success',
      duration: 0,
      ua: '当前会话 · 演示操作',
      params: {},
      before: null,
      after: {},
      refId: null
    });
  });
})();

// KPI summary
function computeKPI() {
  const today = AUDIT_DATA.filter(d => d.time.startsWith('08-20'));
  const thisWeek = AUDIT_DATA;
  const failed = AUDIT_DATA.filter(d => d.result === 'fail');
  const modules = new Set(AUDIT_DATA.map(d => d.moduleKey));
  return { today: today.length, week: thisWeek.length, failed: failed.length, modules: modules.size };
}

// ── Badge Helpers ──────────────────────────────────────────

function roleChip(roleKey) {
  const map = {
    admin:     { bg:'var(--violet-50)',   text:'var(--violet-700)',   dot:'var(--violet-500)' },
    techops:   { bg:'var(--blue-50)',     text:'var(--blue-700)',     dot:'var(--blue-500)' },
    ops:       { bg:'var(--brand-50)',    text:'var(--brand-700)',    dot:'var(--brand-500)' },
    qa:        { bg:'var(--amber-50)',    text:'var(--amber-700)',    dot:'var(--amber-500)' },
    matchmaker:{ bg:'var(--rose-50)',     text:'var(--rose-700)',     dot:'var(--rose-500)' },
  };
  return map[roleKey] || map.ops;
}

function resultBadge(result) {
  const map = {
    success: { label:'成功',   bg:'var(--emerald-50)', text:'var(--emerald-700)', dot:'var(--emerald-500)' },
    fail:    { label:'失败',   bg:'var(--rose-50)',    text:'var(--rose-700)',    dot:'var(--rose-500)' },
    partial: { label:'部分成功', bg:'var(--amber-50)', text:'var(--amber-700)',   dot:'var(--amber-500)' },
  };
  const s = map[result] || map.success;
  return '<span style="display:inline-flex;align-items:center;gap:3px;padding:1px 6px;border-radius:var(--radius-sm);font-size:10.5px;font-weight:500;background:'+s.bg+';color:'+s.text+';white-space:nowrap;"><span style="width:5px;height:5px;border-radius:50%;background:'+s.dot+';flex-shrink:0;"></span>'+s.label+'</span>';
}

function moduleBadge(mod) {
  const map = {
    '系统登录': { bg:'var(--ink-50)',     text:'var(--text-secondary)' },
    '流程编排': { bg:'var(--violet-50)',  text:'var(--violet-700)' },
    '线路管理': { bg:'var(--blue-50)',    text:'var(--blue-700)' },
    '坐席管理': { bg:'var(--cyan-50)',    text:'var(--cyan-700)' },
    '系统集成': { bg:'var(--indigo-50)',  text:'var(--indigo-700)' },
    '名单管理': { bg:'var(--brand-50)',   text:'var(--brand-700)' },
    '合规台账': { bg:'var(--rose-50)',    text:'var(--rose-700)' },
    '外呼任务': { bg:'var(--emerald-50)', text:'var(--emerald-700)' },
    '规则配置': { bg:'var(--amber-50)',   text:'var(--amber-700)' },
    '评分规则': { bg:'var(--teal-50)',    text:'var(--teal-700)' },
    '知识库':   { bg:'var(--purple-50)',  text:'var(--purple-700)' },
    '数据报表': { bg:'var(--slate-50)',   text:'var(--slate-700)' },
    '通话记录': { bg:'var(--sky-50)',     text:'var(--sky-700)' },
    '智能质检': { bg:'var(--orange-50)',  text:'var(--orange-700)' },
  };
  const s = map[mod] || map['系统登录'];
  return '<span style="display:inline-flex;align-items:center;padding:1px 6px;border-radius:var(--radius-sm);font-size:10.5px;font-weight:500;background:'+s.bg+';color:'+s.text+';white-space:nowrap;">'+mod+'</span>';
}

function actionIcon(action) {
  const map = {
    '登录':'log-in','登出':'log-out','发布':'rocket','启停':'power','测试':'radio-tower',
    '导入':'upload','审核':'file-check','加入':'user-plus','移出':'user-minus',
    '修改':'pencil','导出':'download','绑定':'link','解绑':'unlink','复核':'clipboard-check',
    '启用':'user-check','停用':'user-x',
  };
  return map[action] || 'circle';
}

// ── Filter Logic ───────────────────────────────────────────

function getFilteredData() {
  let data = AUDIT_DATA.slice();
  if (auditFilterTime === 'today') {
    data = data.filter(d => d.time.startsWith('08-20'));
  }
  if (auditFilterModule !== 'ALL') {
    data = data.filter(d => d.moduleKey === auditFilterModule);
  }
  if (auditFilterResult !== 'ALL') {
    data = data.filter(d => d.result === auditFilterResult);
  }
  if (auditSearchUser) {
    const q = auditSearchUser.toLowerCase();
    data = data.filter(d => {
      const u = USERS[d.user];
      return u.name.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
    });
  }
  data.sort((a, b) => b.id.localeCompare(a.id));
  return data;
}

// ── View Object ────────────────────────────────────────────
const AuditView = {
  render() {
    return renderAuditView();
  },
  openDetail(id) {
    _currentAuditId = id;
    renderAuditDrawer();
  }
};

window.AuditView = AuditView;

// ── Main Render ────────────────────────────────────────────
function renderAuditView() {
  const kpi = computeKPI();
  const filtered = getFilteredData();
  const pageSize = 25;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice(0, pageSize);

  let html = '<div class="view-fade-enter">';

  // Page Header
  html += '<div class="page-header">';
  html += '<div class="page-title-group">';
  html += '<div class="page-title"><i data-lucide="history"></i>操作审计日志</div>';
  html += '<div class="page-subtitle">关键操作留痕 · 操作可追溯 · 风险可审计</div>';
  html += '</div>';
  html += '<div class="page-actions" style="display:flex;align-items:center;gap:6px;">';
  html += '<span class="badge badge-neutral" style="font-size:10px;line-height:16px;background:var(--ink-50);color:var(--text-muted);border:1px solid var(--border-subtle);"><i data-lucide="flask-conical" style="width:9px;height:9px;margin-right:2px;"></i>演示日志·模拟数据</span>';
  html += '<button class="btn btn-outline btn-sm" onclick="exportAuditLog()"><i data-lucide="download"></i>导出日志</button>';
  html += '</div></div>';

  // KPI Row
  html += '<div class="metrics-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:var(--content-gap);">';
  const kpis = [
    { label:'今日操作次数', val:kpi.today, unit:'次', icon:'activity', bg:'var(--brand-50)', ic:'var(--brand-600)', tc:'var(--text-main)' },
    { label:'本周操作', val:kpi.week, unit:'次', icon:'calendar-days', bg:'var(--blue-50)', ic:'var(--blue-600)', tc:'var(--blue-600)' },
    { label:'失败操作', val:kpi.failed, unit:'次', icon:'x-circle', bg:'var(--rose-50)', ic:'var(--rose-600)', tc:'var(--rose-600)' },
    { label:'涉及模块数', val:kpi.modules, unit:'个', icon:'layers', bg:'var(--violet-50)', ic:'var(--violet-600)', tc:'var(--violet-600)' },
  ];
  kpis.forEach(k => {
    html += '<div class="metric-card" style="padding:10px 12px;min-height:56px;">';
    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">';
    html += '<span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">'+k.label+'</span>';
    html += '<div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:'+k.bg+';flex-shrink:0;"><i data-lucide="'+k.icon+'" style="width:11px;height:11px;color:'+k.ic+';"></i></div>';
    html += '</div>';
    html += '<div style="font-size:18px;font-weight:700;color:'+k.tc+';font-variant-numeric:tabular-nums;line-height:1.2;">'+k.val+'<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">'+k.unit+'</span></div>';
    html += '</div>';
  });
  html += '</div>';

  // Filter Bar
  html += '<div class="filter-bar">';
  // Time segmented
  html += '<div style="display:flex;align-items:center;gap:4px;background:var(--ink-50);border-radius:var(--radius-md);padding:2px;border:1px solid transparent;">';
  const times = [{k:'today',l:'今天'},{k:'7d',l:'近7天'},{k:'30d',l:'近30天'},{k:'custom',l:'自定义'}];
  times.forEach(s => {
    const active = auditFilterTime===s.k;
    html += '<button onclick="setAuditFilterTime(\''+s.k+'\')" style="padding:3px 10px;font-size:11px;font-weight:500;border-radius:var(--radius-sm);border:none;cursor:pointer;background:'+(active?'var(--bg-card)':'transparent')+';color:'+(active?'var(--text-main)':'var(--text-muted)')+';box-shadow:'+(active?'0 1px 2px rgba(0,0,0,0.06)':'none')+';white-space:nowrap;">'+s.l+'</button>';
  });
  html += '</div>';
  // Module select
  html += '<select class="form-select" style="height:30px;padding:0 24px 0 8px;font-size:12px;min-width:120px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;" onchange="setAuditFilterModule(this.value)">';
  const mods = [['ALL','全部模块'],['campaigns','外呼任务'],['leads','名单'],['compliance','合规'],['flows','机器人'],['knowledge','知识库'],['lines','线路'],['agents','坐席'],['integrations','集成'],['scoring','评分'],['rules','规则配置'],['qa','质检'],['system','系统登录'],['reports','数据报表'],['calls','通话记录']];
  mods.forEach(([v,l]) => {
    html += '<option value="'+v+'" '+(auditFilterModule===v?'selected':'')+'>'+l+'</option>';
  });
  html += '</select>';
  // User search
  html += '<div style="position:relative;min-width:140px;max-width:180px;flex:1;">';
  html += '<i data-lucide="user" style="position:absolute;left:8px;top:50%;transform:translateY(-50%);width:12px;height:12px;color:var(--text-muted);"></i>';
  html += '<input type="text" class="form-input" style="width:100%;height:30px;line-height:30px;padding:0 10px 0 26px;font-size:12px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;" placeholder="操作人" value="'+auditSearchUser+'" oninput="setAuditSearch(this.value)">';
  html += '</div>';
  // Result select
  html += '<select class="form-select" style="height:30px;padding:0 24px 0 8px;font-size:12px;min-width:100px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;" onchange="setAuditFilterResult(this.value)">';
  const results = [['ALL','全部结果'],['success','成功'],['fail','失败'],['partial','部分成功']];
  results.forEach(([v,l]) => {
    html += '<option value="'+v+'" '+(auditFilterResult===v?'selected':'')+'>'+l+'</option>';
  });
  html += '</select>';
  html += '<div class="filter-divider"></div>';
  html += '<div class="filter-actions">';
  html += '<span class="filter-count">'+filtered.length+'条</span>';
  html += '<button class="btn btn-ghost btn-sm" style="height:28px;font-size:11px;" onclick="resetAuditFilters()"><i data-lucide="rotate-ccw" style="width:11px;height:11px;"></i>重置筛选</button>';
  html += '<button class="btn btn-primary btn-sm" style="height:28px;font-size:11px;" onclick="App.showToast(\'查询条件已应用\',\'info\')"><i data-lucide="search" style="width:11px;height:11px;"></i>查询</button>';
  html += '</div></div>';

  // Table
  html += '<div class="card" style="padding:0;overflow:hidden;">';
  html += '<div style="overflow-x:auto;">';
  html += '<table class="data-table">';
  html += '<thead><tr>';
  html += '<th style="width:120px;">时间</th>';
  html += '<th style="width:120px;">操作人</th>';
  html += '<th style="width:80px;">模块</th>';
  html += '<th style="width:60px;">动作</th>';
  html += '<th>操作对象</th>';
  html += '<th style="width:120px;">IP地址</th>';
  html += '<th style="width:76px;">结果</th>';
  html += '<th style="width:60px;text-align:right;">操作</th>';
  html += '</tr></thead>';
  html += '<tbody class="stagger-container">';
  pageData.forEach(row => {
    const u = USERS[row.user];
    const rc = roleChip(u.roleKey);
    const failBg = row.result === 'fail' ? 'background:var(--rose-50, rgba(244,63,94,0.03));' : '';
    html += '<tr style="'+failBg+'">';
    html += '<td><span style="font-size:11px;color:var(--text-secondary);font-variant-numeric:tabular-nums;font-family:var(--font-mono);letter-spacing:0.2px;white-space:nowrap;">'+row.time+'</span></td>';
    html += '<td><div style="display:flex;align-items:center;gap:5px;min-width:0;">';
    html += '<div style="width:22px;height:22px;border-radius:50%;background:'+rc.bg+';color:'+rc.text+';display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;flex-shrink:0;">'+u.name[0]+'</div>';
    html += '<div style="min-width:0;">';
    html += '<div style="font-size:11.5px;font-weight:500;color:var(--text-main);white-space:nowrap;">'+u.name+'</div>';
    html += '<span style="display:inline-flex;align-items:center;gap:2px;padding:0 4px;border-radius:3px;font-size:9px;font-weight:500;background:'+rc.bg+';color:'+rc.text+';white-space:nowrap;line-height:14px;">'+u.role+'</span>';
    html += '</div></div></td>';
    html += '<td>'+moduleBadge(row.module)+'</td>';
    html += '<td><span style="display:inline-flex;align-items:center;gap:3px;font-size:11px;font-weight:500;color:var(--text-secondary);white-space:nowrap;"><i data-lucide="'+actionIcon(row.action)+'" style="width:10px;height:10px;color:var(--text-muted);"></i>'+row.action+'</span></td>';
    html += '<td><div style="font-size:11.5px;color:var(--text-main);max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="'+row.target+'">'+row.target+'</div>';
    html += '<div style="font-size:9.5px;color:var(--text-muted);font-variant-numeric:tabular-nums;font-family:var(--font-mono);margin-top:1px;">'+row.id+'</div></td>';
    html += '<td><span style="font-size:11px;color:var(--text-secondary);font-variant-numeric:tabular-nums;font-family:var(--font-mono);">'+row.ip+'</span></td>';
    html += '<td>'+resultBadge(row.result)+'</td>';
    html += '<td style="text-align:right;"><button class="btn btn-ghost btn-sm" style="height:24px;padding:0 8px;font-size:10.5px;" onclick="AuditView.openDetail(\''+row.id+'\')"><i data-lucide="file-text" style="width:10px;height:10px;margin-right:2px;"></i>详情</button></td>';
    html += '</tr>';
  });
  html += '</tbody></table></div></div>';

  // Pagination
  html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;padding:0 2px;">';
  html += '<div style="font-size:11px;color:var(--text-muted);font-variant-numeric:tabular-nums;">共 '+filtered.length+' 条记录</div>';
  html += '<div style="display:flex;gap:3px;">';
  html += '<button class="btn btn-outline btn-sm" style="min-width:28px;padding:0 6px;" '+(auditCurrentPage===1?'disabled':'')+' onclick="gotoAuditPage('+(auditCurrentPage-1)+')"><i data-lucide="chevron-left" style="width:11px;height:11px;"></i></button>';
  html += '<button class="btn '+(auditCurrentPage===1?'btn-primary':'btn-outline')+' btn-sm" style="min-width:28px;padding:0 8px;" onclick="gotoAuditPage(1)">1</button>';
  if (totalPages >= 2) {
    html += '<button class="btn '+(auditCurrentPage===2?'btn-primary':'btn-outline')+' btn-sm" style="min-width:28px;padding:0 8px;" onclick="gotoAuditPage(2)">2</button>';
  }
  if (totalPages >= 3) {
    html += '<button class="btn btn-outline btn-sm" style="min-width:28px;padding:0 6px;" onclick="gotoAuditPage('+(auditCurrentPage+1)+')"><i data-lucide="chevron-right" style="width:11px;height:11px;"></i></button>';
  }
  html += '</div></div>';

  html += '</div>';
  return html;
}

// ── Drawer ─────────────────────────────────────────────────
function closeAuditDetail() {
  const container = document.getElementById('audit-detail-drawer-container');
  if (container) {
    container.classList.remove('open');
    setTimeout(() => { container.innerHTML = ''; }, 300);
  }
  _currentAuditId = null;
}

function renderAuditDrawer() {
  const row = AUDIT_DATA.find(d => d.id === _currentAuditId);
  if (!row) return;
  const u = USERS[row.user];
  const rc = roleChip(u.roleKey);

  let container = document.getElementById('audit-detail-drawer-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'audit-detail-drawer-container';
    container.className = 'drawer-backdrop';
    document.body.appendChild(container);
    container.addEventListener('click', (e) => { if (e.target === container) closeAuditDetail(); });
  }

  // Params
  const paramsEntries = row.params ? Object.entries(row.params) : [];
  let paramsHtml = '';
  if (paramsEntries.length > 0) {
    paramsHtml = '<div style="background:var(--ink-50);border-radius:var(--radius-md);padding:10px 12px;border:1px solid var(--border-subtle);font-family:var(--font-mono);font-size:10.5px;line-height:1.7;">';
    paramsEntries.forEach(([k, v]) => {
      let sv = typeof v === 'boolean' ? (v?'true':'false') : (typeof v === 'object' ? JSON.stringify(v) : String(v));
      paramsHtml += '<div style="display:flex;gap:8px;"><span style="color:var(--violet-600);font-weight:600;white-space:nowrap;">'+k+':</span><span style="color:var(--text-secondary);word-break:break-all;">'+sv+'</span></div>';
    });
    paramsHtml += '</div>';
  } else {
    paramsHtml = '<div style="font-size:11px;color:var(--text-muted);padding:8px 12px;background:var(--ink-50);border-radius:var(--radius-md);border:1px solid var(--border-subtle);">无请求参数</div>';
  }

  // Diff
  let diffHtml = '';
  if (row.before && row.after) {
    const allKeys = new Set([...Object.keys(row.before), ...Object.keys(row.after)]);
    diffHtml = '<div style="border:1px solid var(--border-subtle);border-radius:var(--radius-md);overflow:hidden;">';
    diffHtml += '<table style="width:100%;border-collapse:collapse;font-size:10.5px;">';
    diffHtml += '<thead><tr style="background:var(--ink-50);">';
    diffHtml += '<th style="padding:6px 10px;text-align:left;font-weight:600;color:var(--text-muted);border-bottom:1px solid var(--border-subtle);width:80px;">字段</th>';
    diffHtml += '<th style="padding:6px 10px;text-align:left;font-weight:600;color:var(--text-muted);border-bottom:1px solid var(--border-subtle);">变更前</th>';
    diffHtml += '<th style="padding:6px 10px;text-align:center;font-weight:600;color:var(--text-muted);border-bottom:1px solid var(--border-subtle);width:30px;"></th>';
    diffHtml += '<th style="padding:6px 10px;text-align:left;font-weight:600;color:var(--text-muted);border-bottom:1px solid var(--border-subtle);">变更后</th>';
    diffHtml += '</tr></thead><tbody>';
    [...allKeys].forEach(k => {
      const bv = row.before[k] !== undefined ? String(row.before[k]) : '—';
      const av = row.after[k] !== undefined ? String(row.after[k]) : '—';
      const changed = bv !== av;
      diffHtml += '<tr>';
      diffHtml += '<td style="padding:5px 10px;color:var(--text-muted);border-bottom:1px solid var(--border-subtle);font-family:var(--font-mono);font-size:10px;">'+k+'</td>';
      diffHtml += '<td style="padding:5px 10px;color:'+(changed?'var(--rose-600)':'var(--text-secondary)')+';border-bottom:1px solid var(--border-subtle);font-family:var(--font-mono);">'+bv+'</td>';
      diffHtml += '<td style="padding:5px 6px;text-align:center;color:var(--text-muted);border-bottom:1px solid var(--border-subtle);">'+(changed?'<i data-lucide="arrow-right" style="width:10px;height:10px;"></i>':'')+'</td>';
      diffHtml += '<td style="padding:5px 10px;color:'+(changed?'var(--emerald-600)':'var(--text-secondary)')+';border-bottom:1px solid var(--border-subtle);font-family:var(--font-mono);">'+av+'</td>';
      diffHtml += '</tr>';
    });
    diffHtml += '</tbody></table></div>';
  } else if (row.after && !row.before) {
    const entries = Object.entries(row.after);
    diffHtml = '<div style="background:var(--emerald-50, rgba(16,185,129,0.05));border:1px solid var(--emerald-200, rgba(16,185,129,0.2));border-radius:var(--radius-md);padding:10px 12px;font-size:10.5px;">';
    diffHtml += '<div style="font-size:9.5px;color:var(--emerald-700);font-weight:600;margin-bottom:4px;"><i data-lucide="plus-circle" style="width:9px;height:9px;vertical-align:-1px;"></i> 新增记录</div>';
    entries.forEach(([k,v]) => {
      diffHtml += '<div style="font-family:var(--font-mono);color:var(--text-secondary);line-height:1.6;"><span style="color:var(--emerald-700);font-weight:600;">'+k+':</span> '+String(v)+'</div>';
    });
    diffHtml += '</div>';
  } else {
    diffHtml = '<div style="font-size:11px;color:var(--text-muted);padding:8px 12px;background:var(--ink-50);border-radius:var(--radius-md);border:1px solid var(--border-subtle);">无变更记录</div>';
  }

  // Error
  let errorHtml = '';
  if (row.error) {
    errorHtml = '<div style="margin-bottom:16px;">';
    errorHtml += '<div style="display:flex;align-items:center;gap:5px;margin-bottom:8px;"><i data-lucide="alert-triangle" style="width:11px;height:11px;color:var(--rose-600);"></i><span style="font-size:11px;font-weight:600;color:var(--rose-700);">错误详情</span></div>';
    errorHtml += '<div style="background:var(--rose-50);border:1px solid var(--rose-200);border-radius:var(--radius-md);padding:10px 12px;font-size:11px;color:var(--rose-700);line-height:1.6;">'+row.error+'</div>';
    errorHtml += '</div>';
  }

  // Ref
  let refHtml = '';
  if (row.refId) {
    refHtml = '<div style="margin-bottom:16px;">';
    refHtml += '<div style="display:flex;align-items:center;gap:5px;margin-bottom:8px;"><i data-lucide="link" style="width:11px;height:11px;color:var(--text-muted);"></i><span style="font-size:11px;font-weight:600;color:var(--text-main);">关联ID</span></div>';
    refHtml += '<div style="display:flex;flex-wrap:wrap;gap:4px;">';
    refHtml += '<span onclick="App.showToast(\'跳转至关联对象：'+row.refId+'\',\'info\')" style="display:inline-flex;align-items:center;gap:3px;padding:3px 8px;border-radius:var(--radius-sm);font-size:10.5px;font-family:var(--font-mono);background:var(--brand-50);color:var(--brand-700);cursor:pointer;border:1px solid var(--brand-200);" onmouseover="this.style.background=\'var(--brand-100)\'" onmouseout="this.style.background=\'var(--brand-50)\'"><i data-lucide="external-link" style="width:9px;height:9px;"></i>'+row.refId+'</span>';
    refHtml += '</div></div>';
  }

  const resultColor = row.result === 'success' ? 'var(--emerald-600)' : row.result === 'fail' ? 'var(--rose-600)' : 'var(--amber-600)';
  const resultLabel = row.result === 'success' ? '操作成功' : row.result === 'fail' ? '操作失败' : '部分成功';

  let dh = '';
  dh += '<div class="drawer-panel" onclick="event.stopPropagation()" style="width:480px;display:flex;flex-direction:column;">';

  // Header
  dh += '<div style="padding:14px 20px;border-bottom:1px solid var(--border-color);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-shrink:0;">';
  dh += '<div style="display:flex;align-items:center;gap:8px;min-width:0;flex:1;">';
  dh += '<button class="btn btn-ghost btn-sm" style="width:28px;height:28px;padding:0;flex-shrink:0;" onclick="closeAuditDetail()"><i data-lucide="arrow-left" style="width:14px;height:14px;"></i></button>';
  dh += '<div style="min-width:0;">';
  dh += '<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;"><span style="font-size:14px;font-weight:700;color:var(--text-main);white-space:nowrap;">审计日志详情</span>'+resultBadge(row.result)+'</div>';
  dh += '<div style="font-size:10.5px;color:var(--text-muted);margin-top:2px;font-variant-numeric:tabular-nums;font-family:var(--font-mono);">'+row.id+'</div>';
  dh += '</div></div>';
  dh += '<div style="display:flex;gap:4px;flex-shrink:0;"><button class="btn btn-ghost btn-sm" style="width:28px;height:28px;padding:0;" onclick="closeAuditDetail()"><i data-lucide="x" style="width:14px;height:14px;"></i></button></div>';
  dh += '</div>';

  // Body
  dh += '<div style="padding:16px 20px;overflow-y:auto;flex:1;">';

  // Basic info
  dh += '<div style="margin-bottom:16px;">';
  dh += '<div style="display:flex;align-items:center;gap:5px;margin-bottom:8px;"><i data-lucide="info" style="width:11px;height:11px;color:var(--text-muted);"></i><span style="font-size:11px;font-weight:600;color:var(--text-main);">基本信息</span></div>';
  dh += '<div style="background:var(--ink-50);border-radius:var(--radius-md);padding:10px 12px;border:1px solid var(--border-subtle);">';
  dh += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px 16px;">';
  dh += '<div><div style="font-size:9.5px;color:var(--text-muted);margin-bottom:1px;">审计ID</div><div style="font-size:11px;color:var(--text-secondary);font-variant-numeric:tabular-nums;font-family:var(--font-mono);">'+row.id+'</div></div>';
  dh += '<div><div style="font-size:9.5px;color:var(--text-muted);margin-bottom:1px;">操作时间</div><div style="font-size:11px;color:var(--text-secondary);font-variant-numeric:tabular-nums;font-family:var(--font-mono);">2026-'+row.time+'</div></div>';
  dh += '<div><div style="font-size:9.5px;color:var(--text-muted);margin-bottom:1px;">操作人</div><div style="font-size:11px;color:var(--text-main);display:flex;align-items:center;gap:4px;"><span style="display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:50%;background:'+rc.bg+';color:'+rc.text+';font-size:8px;font-weight:600;">'+u.name[0]+'</span>'+u.name+' <span style="font-size:9px;padding:0 3px;border-radius:3px;background:'+rc.bg+';color:'+rc.text+';line-height:14px;">'+u.role+'</span></div></div>';
  dh += '<div><div style="font-size:9.5px;color:var(--text-muted);margin-bottom:1px;">IP地址</div><div style="font-size:11px;color:var(--text-secondary);font-variant-numeric:tabular-nums;font-family:var(--font-mono);">'+row.ip+'</div></div>';
  dh += '<div style="grid-column:1/-1;"><div style="font-size:9.5px;color:var(--text-muted);margin-bottom:1px;">User Agent</div><div style="font-size:10.5px;color:var(--text-secondary);font-family:var(--font-mono);word-break:break-all;">'+row.ua+'</div></div>';
  dh += '</div></div></div>';

  // Summary
  dh += '<div style="margin-bottom:16px;">';
  dh += '<div style="display:flex;align-items:center;gap:5px;margin-bottom:8px;"><i data-lucide="'+actionIcon(row.action)+'" style="width:11px;height:11px;color:var(--text-muted);"></i><span style="font-size:11px;font-weight:600;color:var(--text-main);">操作概要</span></div>';
  dh += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
  dh += '<div style="background:var(--ink-50);border-radius:var(--radius-md);padding:8px 10px;border:1px solid var(--border-subtle);"><div style="font-size:9.5px;color:var(--text-muted);margin-bottom:2px;">操作模块</div><div style="font-size:11px;color:var(--text-main);">'+moduleBadge(row.module)+'</div></div>';
  dh += '<div style="background:var(--ink-50);border-radius:var(--radius-md);padding:8px 10px;border:1px solid var(--border-subtle);"><div style="font-size:9.5px;color:var(--text-muted);margin-bottom:2px;">动作类型</div><div style="font-size:11px;color:var(--text-main);font-weight:500;">'+row.action+'</div></div>';
  dh += '<div style="grid-column:1/-1;background:var(--ink-50);border-radius:var(--radius-md);padding:8px 10px;border:1px solid var(--border-subtle);"><div style="font-size:9.5px;color:var(--text-muted);margin-bottom:2px;">操作对象</div><div style="font-size:11px;color:var(--text-main);word-break:break-all;">'+row.target+'</div></div>';
  dh += '</div></div>';

  dh += errorHtml;

  // Params
  dh += '<div style="margin-bottom:16px;">';
  dh += '<div style="display:flex;align-items:center;gap:5px;margin-bottom:8px;"><i data-lucide="terminal" style="width:11px;height:11px;color:var(--text-muted);"></i><span style="font-size:11px;font-weight:600;color:var(--text-main);">请求参数</span></div>';
  dh += paramsHtml;
  dh += '</div>';

  // Diff
  dh += '<div style="margin-bottom:16px;">';
  dh += '<div style="display:flex;align-items:center;gap:5px;margin-bottom:8px;"><i data-lucide="git-compare-arrows" style="width:11px;height:11px;color:var(--text-muted);"></i><span style="font-size:11px;font-weight:600;color:var(--text-main);">变更前后对比</span></div>';
  dh += diffHtml;
  dh += '</div>';

  dh += refHtml;

  // Result & duration
  dh += '<div style="margin-bottom:16px;">';
  dh += '<div style="display:flex;align-items:center;gap:5px;margin-bottom:8px;"><i data-lucide="gauge" style="width:11px;height:11px;color:var(--text-muted);"></i><span style="font-size:11px;font-weight:600;color:var(--text-main);">执行结果</span></div>';
  dh += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">';
  const resultBg = row.result==='success'?'var(--emerald-50)':row.result==='fail'?'var(--rose-50)':'var(--amber-50)';
  const resultBd = row.result==='success'?'var(--emerald-200)':row.result==='fail'?'var(--rose-200)':'var(--amber-200)';
  dh += '<div style="background:'+resultBg+';border-radius:var(--radius-md);padding:10px;text-align:center;border:1px solid '+resultBd+';"><div style="font-size:9.5px;color:'+resultColor+';margin-bottom:2px;font-weight:500;">操作结果</div><div style="font-size:16px;font-weight:700;color:'+resultColor+';font-variant-numeric:tabular-nums;">'+resultLabel+'</div></div>';
  dh += '<div style="background:var(--ink-50);border-radius:var(--radius-md);padding:10px;text-align:center;border:1px solid var(--border-subtle);"><div style="font-size:9.5px;color:var(--text-muted);margin-bottom:2px;">耗时</div><div style="font-size:16px;font-weight:700;color:var(--text-main);font-variant-numeric:tabular-nums;">'+row.duration+'<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">ms</span></div></div>';
  dh += '</div></div>';

  dh += '</div></div>';

  container.innerHTML = dh;
  container.classList.add('open');
  if (window.lucide) lucide.createIcons();
}

// ── Actions ────────────────────────────────────────────────

function gotoAuditPage(page) {
  auditCurrentPage = page;
  App.refreshCurrentView();
}

function setAuditFilterTime(val) {
  auditFilterTime = val;
  if (val === 'custom') {
    App.showToast('自定义时间范围演示，请选择日期','info');
    return;
  }
  App.refreshCurrentView();
}

function setAuditFilterModule(val) {
  auditFilterModule = val;
  App.refreshCurrentView();
}

function setAuditFilterResult(val) {
  auditFilterResult = val;
  App.refreshCurrentView();
}

function setAuditSearch(val) {
  auditSearchUser = val;
}

function resetAuditFilters() {
  auditFilterTime = '7d';
  auditFilterModule = 'ALL';
  auditFilterResult = 'ALL';
  auditSearchUser = '';
  auditCurrentPage = 1;
  App.showToast('筛选条件已重置', 'info');
  App.refreshCurrentView();
}

function exportAuditLog() {
  App.showToast('审计日志导出中，完成后将自动下载 (演示)', 'info');
}
