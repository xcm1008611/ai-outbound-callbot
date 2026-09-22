// View: Integrations (系统集成与连接状态) - 外部服务·API核验·失败重试·回调配置

// ── State ──────────────────────────────────────────────────
let _currentIntegrationId = null;

// ── Mock Data ──────────────────────────────────────────────

const INTEGRATIONS_DATA = [
  {
    id:'int-001', name:'SmartCall呼叫引擎', desc:'外呼核心调度', category:'呼叫引擎',
    env:'prod', status:'connected', latency:45, lastCheck:'2026-08-20 14:50',
    lastError:'—', owner:'王工', icon:'phone-call',
    config:{ apiUrl:'https://engine.smartcall.ai/v2', apiKey:'sk-****f8a2', secret:'••••••••', token:'tk-****c3d1' },
    callback:'https://****.smartcall-pro.com/webhook/call',
    direction:'bidirectional',
    stats:{ calls1h:342, calls24h:8651, calls7d:58420, successRate:99.7 },
    errors:[],
    checks:[],
    retries:[]
  },
  {
    id:'int-002', name:'Asterisk软交换', desc:'SIP线路网关', category:'呼叫引擎',
    env:'prod', status:'connected', latency:12, lastCheck:'2026-08-20 14:50',
    lastError:'—', owner:'王工', icon:'radio-tower',
    config:{ apiUrl:'https://sip.asterisk.local:8088/ari', apiKey:'ari-****7b9e', secret:'••••••••', token:'—' },
    callback:'https://****.smartcall-pro.com/webhook/sip',
    direction:'bidirectional',
    stats:{ calls1h:318, calls24h:8320, calls7d:56100, successRate:99.9 },
    errors:[],
    checks:[],
    retries:[]
  },
  {
    id:'int-003', name:'MaxKB知识库', desc:'RAG知识问答', category:'AI能力',
    env:'prod', status:'connected', latency:120, lastCheck:'2026-08-20 14:48',
    lastError:'—', owner:'李工', icon:'brain',
    config:{ apiUrl:'https://maxkb.example.com/api', apiKey:'mk-****2d4c', secret:'••••••••', token:'—' },
    callback:'—',
    direction:'outbound',
    stats:{ calls1h:287, calls24h:7120, calls7d:48200, successRate:98.2 },
    errors:[],
    checks:[],
    retries:[]
  },
  {
    id:'int-004', name:'阿里云ASR', desc:'语音识别', category:'AI能力',
    env:'prod', status:'connected', latency:85, lastCheck:'2026-08-20 14:49',
    lastError:'—', owner:'李工', icon:'mic',
    config:{ apiUrl:'https://nls-gateway-cn-shanghai.aliyuncs.com', apiKey:'ak-****5e6f', secret:'••••••••', token:'—' },
    callback:'https://****.smartcall-pro.com/webhook/asr',
    direction:'bidirectional',
    stats:{ calls1h:295, calls24h:7400, calls7d:49800, successRate:99.1 },
    errors:[],
    checks:[],
    retries:[]
  },
  {
    id:'int-005', name:'火山引擎TTS', desc:'语音合成', category:'AI能力',
    env:'prod', status:'error', latency:null, lastCheck:'2026-08-20 14:45',
    lastError:'鉴权失败(3次)', owner:'李工', icon:'volume-2',
    config:{ apiUrl:'https://openspeech.bytedance.com/api/v1/tts', apiKey:'ak-****9a3b', secret:'••••••••', token:'—' },
    callback:'—',
    direction:'outbound',
    stats:{ calls1h:0, calls24h:120, calls7d:3200, successRate:62.0 },
    errors:[
      { time:'2026-08-20 14:45:02', code:'401', msg:'鉴权失败：AccessKey 无效或已过期', retries:3 },
      { time:'2026-08-20 14:30:11', code:'401', msg:'鉴权失败：AccessKey 无效或已过期', retries:2 },
      { time:'2026-08-20 14:15:08', code:'401', msg:'鉴权失败：AccessKey 无效或已过期', retries:1 },
    ],
    checks:[],
    retries:[
      { time:'2026-08-20 14:45', result:'失败', reason:'鉴权失败' },
      { time:'2026-08-20 14:30', result:'失败', reason:'鉴权失败' },
      { time:'2026-08-20 14:15', result:'失败', reason:'鉴权失败' },
    ]
  },
  {
    id:'int-006', name:'知缘CRM', desc:'客户主数据同步', category:'业务系统',
    env:'prod', status:'pending', latency:null, lastCheck:'2026-08-19 18:20',
    lastError:'—', owner:'张经理', icon:'building-2',
    config:{ apiUrl:'https://crm.zhiyuan.com/openapi', apiKey:'zm-****c1f8', secret:'••••••••', token:'oauth-****e7a2' },
    callback:'https://****.smartcall-pro.com/webhook/crm',
    direction:'bidirectional',
    stats:{ calls1h:0, calls24h:0, calls7d:0, successRate:0 },
    errors:[],
    checks:[
      { text:'API Key 连通性核验', done:false },
      { text:'字段映射配置', done:true },
      { text:'回调地址白名单确认', done:false },
      { text:'双向数据同步策略确认', done:false },
    ],
    retries:[]
  },
  {
    id:'int-007', name:'企业微信SCRM', desc:'加微与消息推送', category:'业务系统',
    env:'test', status:'mock', latency:null, lastCheck:'2026-08-20 10:00',
    lastError:'—', owner:'运营组', icon:'message-circle',
    config:{ apiUrl:'https://****.qyapi.weixin.qq.com/cgi-bin', apiKey:'corpid-****d4e9', secret:'••••••••', token:'mock-token-****' },
    callback:'https://****.smartcall-pro.com/webhook/wecom',
    direction:'outbound',
    stats:{ calls1h:12, calls24h:156, calls7d:890, successRate:100 },
    errors:[],
    checks:[],
    retries:[]
  },
  {
    id:'int-008', name:'阿里云短信', desc:'邀约通知短信', category:'基础设施',
    env:'none', status:'unconfigured', latency:null, lastCheck:'—',
    lastError:'—', owner:'—', icon:'mail',
    config:{ apiUrl:'未配置', apiKey:'未配置', secret:'未配置', token:'未配置' },
    callback:'未配置',
    direction:'outbound',
    stats:{ calls1h:0, calls24h:0, calls7d:0, successRate:0 },
    errors:[],
    checks:[
      { text:'开通阿里云短信服务', done:false },
      { text:'配置 AccessKey/Secret', done:false },
      { text:'创建短信签名与模板', done:false },
      { text:'配置回调通知地址', done:false },
    ],
    retries:[]
  },
  {
    id:'int-009', name:'腾讯云COS', desc:'录音文件存储', category:'基础设施',
    env:'prod', status:'connected', latency:35, lastCheck:'2026-08-20 14:50',
    lastError:'—', owner:'王工', icon:'hard-drive',
    config:{ apiUrl:'https://cos.ap-shanghai.myqcloud.com', apiKey:'sid-****3b7d', secret:'••••••••', token:'—' },
    callback:'—',
    direction:'outbound',
    stats:{ calls1h:89, calls24h:2240, calls7d:15100, successRate:99.8 },
    errors:[],
    checks:[],
    retries:[]
  },
];

const CATEGORY_ICONS = {
  '呼叫引擎': 'phone-call',
  'AI能力': 'sparkles',
  '业务系统': 'building-2',
  '基础设施': 'server',
};

const CATEGORY_ORDER = ['呼叫引擎', 'AI能力', '业务系统', '基础设施'];

// ── Status Helpers ─────────────────────────────────────────

function connStatusBadge(status) {
  const map = {
    connected:    { label:'已连接', bg:'var(--emerald-50)',  text:'var(--emerald-700)',  dot:'var(--emerald-500)' },
    error:        { label:'异常',   bg:'var(--rose-50)',     text:'var(--rose-700)',     dot:'var(--rose-500)' },
    pending:      { label:'待核验', bg:'var(--amber-50)',    text:'var(--amber-700)',    dot:'var(--amber-500)' },
    mock:         { label:'模拟',   bg:'var(--blue-50)',     text:'var(--blue-700)',     dot:'var(--blue-500)' },
    unconfigured: { label:'未配置', bg:'var(--ink-100)',     text:'var(--text-muted)',   dot:'var(--ink-400)' },
    disabled:     { label:'已停用', bg:'var(--ink-100)',     text:'var(--text-muted)',   dot:'var(--ink-400)' },
  };
  const s = map[status] || map.unconfigured;
  return `<span style="display:inline-flex;align-items:center;gap:4px;padding:2px 7px;border-radius:var(--radius-sm);font-size:10.5px;font-weight:500;background:${s.bg};color:${s.text};white-space:nowrap;"><span style="width:6px;height:6px;border-radius:50%;background:${s.dot};flex-shrink:0;"></span>${s.label}</span>`;
}

function envBadge(env) {
  const map = {
    prod: { label:'生产环境', bg:'var(--emerald-50)', text:'var(--emerald-700)', dot:'var(--emerald-500)' },
    test: { label:'测试环境', bg:'var(--amber-50)',   text:'var(--amber-700)',   dot:'var(--amber-500)' },
    none: { label:'未配置',   bg:'var(--ink-100)',    text:'var(--text-muted)',  dot:'var(--ink-400)' },
  };
  const s = map[env] || map.none;
  return `<span style="display:inline-flex;align-items:center;gap:3px;padding:1px 6px;border-radius:var(--radius-sm);font-size:10.5px;font-weight:500;background:${s.bg};color:${s.text};white-space:nowrap;"><span style="width:5px;height:5px;border-radius:50%;background:${s.dot};flex-shrink:0;"></span>${s.label}</span>`;
}

function directionBadge(dir) {
  const map = {
    inbound:      { label:'入站', icon:'arrow-down-to-line' },
    outbound:     { label:'出站', icon:'arrow-up-from-line' },
    bidirectional:{ label:'双向', icon:'arrow-left-right' },
  };
  const s = map[dir] || map.outbound;
  return `<span style="display:inline-flex;align-items:center;gap:3px;padding:1px 6px;border-radius:var(--radius-sm);font-size:10.5px;font-weight:500;background:var(--ink-50);color:var(--text-secondary);white-space:nowrap;"><i data-lucide="${s.icon}" style="width:10px;height:10px;"></i>${s.label}</span>`;
}

// ── KPI Computation ────────────────────────────────────────
function computeKPI() {
  const total = INTEGRATIONS_DATA.length;
  const connected = INTEGRATIONS_DATA.filter(i => i.status === 'connected').length;
  const error = INTEGRATIONS_DATA.filter(i => i.status === 'error').length;
  const pending = INTEGRATIONS_DATA.filter(i => i.status === 'pending' || i.status === 'unconfigured').length;
  // Mock today's total calls - sum of calls24h for connected services
  const calls = INTEGRATIONS_DATA
    .filter(i => i.status === 'connected' || i.status === 'mock')
    .reduce((sum, i) => sum + (i.stats ? i.stats.calls24h : 0), 0);
  return { total, connected, error, pending, calls };
}

// ── View Object ────────────────────────────────────────────
window.IntegrationsView = {
  render() {
    return renderIntegrationsView();
  },

  openDetail(id) {
    _currentIntegrationId = id;
    renderIntegrationDrawer();
  },

  testConn(id) {
    const item = INTEGRATIONS_DATA.find(i => i.id === id);
    if (!item) return;
    if (item.status === 'unconfigured') {
      App.showToast('请先完成配置', 'warning');
      return;
    }
    if (item.id === 'int-005') {
      App.showToast('连接异常：鉴权失败，请检查API Key', 'warning');
      return;
    }
    const lat = item.latency || Math.floor(Math.random() * 100 + 20);
    App.showToast('连接测试通过，延迟 ' + lat + 'ms', 'success');
  }
};

// ── Main Render ────────────────────────────────────────────
function renderIntegrationsView() {
  const kpi = computeKPI();

  // Group integrations by category
  const groups = {};
  CATEGORY_ORDER.forEach(cat => { groups[cat] = []; });
  INTEGRATIONS_DATA.forEach(item => {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  });

  return `
    <div class="view-fade-enter">

      <!-- Page Header -->
      <div class="page-header">
        <div class="page-title-group">
          <div class="page-title">
            <i data-lucide="puzzle"></i>
            系统集成与连接状态
          </div>
          <div class="page-subtitle">外部服务·API核验·失败重试·回调配置</div>
        </div>
        <div class="page-actions" style="display:flex;align-items:center;gap:6px;">
          <span class="badge badge-neutral" style="font-size:10px;line-height:16px;background:var(--amber-50);color:var(--amber-700);border:1px solid var(--amber-200);">
            <i data-lucide="flask-conical" style="width:9px;height:9px;margin-right:2px;"></i>演示连接·非生产环境
          </span>
          <button class="btn btn-primary btn-sm" onclick="addIntegration()">
            <i data-lucide="plus"></i>添加集成
          </button>
        </div>
      </div>

      <!-- KPI Row -->
      <div class="metrics-grid" style="grid-template-columns:repeat(5,1fr);margin-bottom:var(--content-gap);">
        <div class="metric-card" style="padding:10px 12px;min-height:56px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
            <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">总集成数</span>
            <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--ink-50);flex-shrink:0;">
              <i data-lucide="puzzle" style="width:11px;height:11px;color:var(--ink-500);"></i>
            </div>
          </div>
          <div style="font-size:18px;font-weight:700;color:var(--text-main);font-variant-numeric:tabular-nums;line-height:1.2;">${kpi.total}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">个</span></div>
        </div>
        <div class="metric-card" style="padding:10px 12px;min-height:56px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
            <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">已连接</span>
            <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--emerald-50);flex-shrink:0;">
              <i data-lucide="check-circle" style="width:11px;height:11px;color:var(--emerald-600);"></i>
            </div>
          </div>
          <div style="font-size:18px;font-weight:700;color:var(--emerald-600);font-variant-numeric:tabular-nums;line-height:1.2;">${kpi.connected}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">个</span></div>
        </div>
        <div class="metric-card" style="padding:10px 12px;min-height:56px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
            <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">异常</span>
            <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--rose-50);flex-shrink:0;">
              <i data-lucide="alert-circle" style="width:11px;height:11px;color:var(--rose-600);"></i>
            </div>
          </div>
          <div style="font-size:18px;font-weight:700;color:var(--rose-600);font-variant-numeric:tabular-nums;line-height:1.2;">${kpi.error}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">个</span></div>
        </div>
        <div class="metric-card" style="padding:10px 12px;min-height:56px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
            <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">待核验/未配置</span>
            <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--amber-50);flex-shrink:0;">
              <i data-lucide="clock" style="width:11px;height:11px;color:var(--amber-600);"></i>
            </div>
          </div>
          <div style="font-size:18px;font-weight:700;color:var(--amber-600);font-variant-numeric:tabular-nums;line-height:1.2;">${kpi.pending}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">个</span></div>
        </div>
        <div class="metric-card" style="padding:10px 12px;min-height:56px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
            <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">今日总调用量</span>
            <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--brand-50);flex-shrink:0;">
              <i data-lucide="zap" style="width:11px;height:11px;color:var(--brand-600);"></i>
            </div>
          </div>
          <div style="font-size:18px;font-weight:700;color:var(--brand-600);font-variant-numeric:tabular-nums;line-height:1.2;">${(kpi.calls || 0).toLocaleString()}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">次</span></div>
        </div>
      </div>

      <!-- Grouped Tables by Category -->
      ${CATEGORY_ORDER.map(cat => {
        const items = groups[cat] || [];
        if (items.length === 0) return '';
        return `
          <div style="margin-bottom:10px;">
            <div style="display:flex;align-items:center;gap:6px;padding:6px 2px;margin-bottom:4px;">
              <i data-lucide="${CATEGORY_ICONS[cat] || 'box'}" style="width:12px;height:12px;color:var(--text-muted);"></i>
              <span style="font-size:11px;font-weight:600;color:var(--text-secondary);letter-spacing:0.3px;text-transform:uppercase;">${cat}</span>
              <span style="font-size:10px;color:var(--text-muted);font-variant-numeric:tabular-nums;">${items.length}个</span>
              <div style="flex:1;height:1px;background:var(--border-subtle);margin-left:4px;"></div>
            </div>
            <div class="card" style="padding:0;overflow:hidden;">
              <div style="overflow-x:auto;">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th style="width:160px;">集成名称</th>
                      <th style="width:120px;">用途描述</th>
                      <th style="width:80px;">环境</th>
                      <th style="width:88px;">连接状态</th>
                      <th style="width:140px;">最近核验</th>
                      <th style="width:70px;">延迟</th>
                      <th>最近错误</th>
                      <th style="width:70px;">负责人</th>
                      <th style="width:160px;text-align:right;">操作</th>
                    </tr>
                  </thead>
                  <tbody class="stagger-container">
                    ${items.map(row => renderIntegrationRow(row)).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        `;
      }).join('')}

      ${renderPagination(INTEGRATIONS_DATA.length, 1)}

    </div>
  `;
}

function renderIntegrationRow(row) {
  const canOperate = row.status !== 'unconfigured';
  const isError = row.status === 'error';
  const categoryIcon = CATEGORY_ICONS[row.category] || 'box';

  return `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:7px;">
          <div style="width:24px;height:24px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--ink-50);flex-shrink:0;">
            <i data-lucide="${row.icon}" style="width:12px;height:12px;color:var(--text-secondary);"></i>
          </div>
          <div style="min-width:0;">
            <div style="font-size:11.5px;font-weight:600;color:var(--text-main);white-space:nowrap;">${row.name}</div>
            <div style="font-size:9.5px;color:var(--text-muted);display:flex;align-items:center;gap:3px;">
              <i data-lucide="${categoryIcon}" style="width:9px;height:9px;"></i>${row.category}
            </div>
          </div>
        </div>
      </td>
      <td><div style="font-size:11px;color:var(--text-secondary);max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${row.desc}</div></td>
      <td>${envBadge(row.env)}</td>
      <td>${connStatusBadge(row.status)}</td>
      <td><span style="font-size:11px;color:var(--text-secondary);font-variant-numeric:tabular-nums;">${row.lastCheck}</span></td>
      <td>
        ${row.latency != null ? `<span style="font-size:11.5px;font-weight:500;color:var(--text-main);font-variant-numeric:tabular-nums;">${row.latency}<span style="font-size:9px;font-weight:400;color:var(--text-muted);margin-left:1px;">ms</span></span>` : `<span style="font-size:11px;color:var(--text-muted);">—</span>`}
      </td>
      <td>
        ${isError ? `<span style="font-size:11px;color:var(--rose-600);font-weight:500;display:inline-flex;align-items:center;gap:3px;"><i data-lucide="alert-circle" style="width:11px;height:11px;"></i>${row.lastError}</span>` : `<span style="font-size:11px;color:var(--text-muted);">—</span>`}
      </td>
      <td><div style="font-size:11.5px;color:var(--text-secondary);white-space:nowrap;">${row.owner}</div></td>
      <td style="text-align:right;">
        <div style="display:flex;gap:2px;justify-content:flex-end;flex-wrap:wrap;">
          <button class="btn btn-ghost btn-sm" style="height:24px;padding:0 7px;font-size:10.5px;${!canOperate?'opacity:0.5;cursor:not-allowed;':''}"
            ${!canOperate?'disabled':''} onclick="${canOperate?`IntegrationsView.testConn('${row.id}')`:`App.showToast('请先完成配置','warning')`}">
            <i data-lucide="zap" style="width:10px;height:10px;margin-right:2px;"></i>测试
          </button>
          <button class="btn btn-ghost btn-sm" style="height:24px;padding:0 7px;font-size:10.5px;" onclick="IntegrationsView.openDetail('${row.id}')">
            <i data-lucide="eye" style="width:10px;height:10px;margin-right:2px;"></i>详情
          </button>
          <button class="btn btn-ghost btn-sm" style="width:24px;height:24px;padding:0;" onclick="${canOperate?`App.showToast('查看日志 · ${row.name}','info')`:`App.showToast('请先完成配置','warning')`}" title="日志" ${!canOperate?'disabled style="opacity:0.5;"':''}>
            <i data-lucide="file-text" style="width:11px;height:11px;"></i>
          </button>
          <button class="btn btn-ghost btn-sm" style="width:24px;height:24px;padding:0;${!canOperate?'opacity:0.5;cursor:not-allowed;':''}"
            ${!canOperate?'disabled':''} onclick="${canOperate?`toggleIntegration('${row.id}','${row.name}')`:`App.showToast('请先完成配置','warning')`}" title="启停">
            <i data-lucide="power" style="width:11px;height:11px;"></i>
          </button>
        </div>
      </td>
    </tr>
  `;
}

// ── Drawer: Integration Detail ─────────────────────────────
function renderIntegrationDrawer() {
  const item = INTEGRATIONS_DATA.find(i => i.id === _currentIntegrationId);
  if (!item) return;

  let container = document.getElementById('integration-detail-drawer-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'integration-detail-drawer-container';
    container.className = 'drawer-backdrop';
    document.body.appendChild(container);
    container.addEventListener('click', (e) => { if (e.target === container) closeIntegrationDrawer(); });
  }

  // Trigger reflow for animation
  requestAnimationFrame(() => {
    container.classList.add('open');
  });

  const maskedKey = item.config.apiKey !== '未配置' ? maskKey(item.config.apiKey) : '未配置';
  const maskedSecret = item.config.secret !== '未配置' ? '••••••••••••' : '未配置';
  const maskedToken = item.config.token !== '未配置' && item.config.token !== '—' ? maskKey(item.config.token) : item.config.token;
  const st = item.stats || { calls1h: 0, calls24h: 0, calls7d: 0, successRate: 0 };
  const errs = item.errors || [];

  container.innerHTML = `
    <div class="drawer-panel" onclick="event.stopPropagation()" style="width:520px;display:flex;flex-direction:column;">
      <!-- Header -->
      <div style="padding:14px 18px;border-bottom:1px solid var(--border-color);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-shrink:0;background:var(--bg-card);">
        <div style="display:flex;align-items:center;gap:9px;min-width:0;flex:1;">
          <div style="width:32px;height:32px;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;background:var(--ink-50);flex-shrink:0;">
            <i data-lucide="${item.icon}" style="width:15px;height:15px;color:var(--brand-600);"></i>
          </div>
          <div style="min-width:0;">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
              <span style="font-size:14px;font-weight:700;color:var(--text-main);white-space:nowrap;">${item.name}</span>
              ${connStatusBadge(item.status)}
            </div>
            <div style="font-size:10.5px;color:var(--text-muted);margin-top:2px;display:flex;align-items:center;gap:6px;">
              <span style="display:inline-flex;align-items:center;gap:2px;"><i data-lucide="${CATEGORY_ICONS[item.category]||'box'}" style="width:9px;height:9px;"></i>${item.category}</span>
              <span>·</span>
              ${envBadge(item.env)}
              <span>·</span>
              <span style="display:inline-flex;align-items:center;gap:2px;"><i data-lucide="user" style="width:9px;height:9px;"></i>${item.owner}</span>
            </div>
          </div>
        </div>
        <div style="display:flex;gap:4px;flex-shrink:0;">
          <button class="btn btn-outline btn-sm" style="height:28px;font-size:11px;${item.status==='unconfigured'?'opacity:0.5;':''}"
            ${item.status==='unconfigured'?'disabled':''} onclick="${item.status!=='unconfigured'?`IntegrationsView.testConn('${item.id}')`:`App.showToast('请先完成配置','warning')`}">
            <i data-lucide="zap" style="width:11px;height:11px;"></i>测试连接
          </button>
          <button class="btn btn-ghost btn-sm" style="width:28px;height:28px;padding:0;" onclick="closeIntegrationDrawer()">
            <i data-lucide="x" style="width:14px;height:14px;"></i>
          </button>
        </div>
      </div>

      <!-- Scrollable Content -->
      <div style="flex:1;overflow-y:auto;padding:16px 18px;">

        <!-- Connection Config Section -->
        <div style="margin-bottom:18px;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">
            <i data-lucide="link" style="width:12px;height:12px;color:var(--text-muted);"></i>
            <span style="font-size:11px;font-weight:600;color:var(--text-secondary);letter-spacing:0.3px;">连接配置</span>
          </div>
          <div style="background:var(--ink-50);border-radius:var(--radius-md);padding:10px 12px;border:1px solid var(--border-subtle);">
            <div style="display:grid;grid-template-columns:80px 1fr;gap:6px 10px;font-size:11px;">
              <span style="color:var(--text-muted);">API 地址</span>
              <span style="font-family:var(--font-mono);font-size:10.5px;color:var(--text-secondary);word-break:break-all;display:flex;align-items:center;gap:4px;">
                ${maskUrl(item.config.apiUrl)}
                <button class="btn btn-ghost btn-sm" style="width:20px;height:20px;padding:0;margin-left:auto;flex-shrink:0;" onclick="App.showToast('已复制API地址（演示）','info')" title="复制">
                  <i data-lucide="copy" style="width:10px;height:10px;"></i>
                </button>
              </span>
              <span style="color:var(--text-muted);">API Key</span>
              <span style="font-family:var(--font-mono);font-size:10.5px;color:var(--text-secondary);display:flex;align-items:center;gap:4px;">
                ${maskedKey}
                <button class="btn btn-ghost btn-sm" style="width:20px;height:20px;padding:0;margin-left:4px;flex-shrink:0;" onclick="App.showToast('Key 已显示（演示）','info')" title="显示">
                  <i data-lucide="eye" style="width:10px;height:10px;"></i>
                </button>
              </span>
              <span style="color:var(--text-muted);">Secret</span>
              <span style="font-family:var(--font-mono);font-size:10.5px;color:var(--text-secondary);display:flex;align-items:center;gap:4px;">
                ${maskedSecret}
              </span>
              <span style="color:var(--text-muted);">Token</span>
              <span style="font-family:var(--font-mono);font-size:10.5px;color:var(--text-secondary);display:flex;align-items:center;gap:4px;">
                ${maskedToken}
              </span>
            </div>
          </div>
        </div>

        <!-- Callback & Direction -->
        <div style="margin-bottom:18px;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">
            <i data-lucide="webhook" style="width:12px;height:12px;color:var(--text-muted);"></i>
            <span style="font-size:11px;font-weight:600;color:var(--text-secondary);letter-spacing:0.3px;">回调与同步</span>
          </div>
          <div style="background:var(--ink-50);border-radius:var(--radius-md);padding:10px 12px;border:1px solid var(--border-subtle);">
            <div style="display:grid;grid-template-columns:80px 1fr;gap:6px 10px;font-size:11px;align-items:center;">
              <span style="color:var(--text-muted);">回调地址</span>
              <span style="font-family:var(--font-mono);font-size:10.5px;color:var(--text-secondary);word-break:break-all;">${item.callback !== '未配置' && item.callback !== '—' ? maskUrl(item.callback) : item.callback}</span>
              <span style="color:var(--text-muted);">数据方向</span>
              <span>${directionBadge(item.direction)}</span>
            </div>
          </div>
        </div>

        <!-- Call Stats -->
        <div style="margin-bottom:18px;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">
            <i data-lucide="bar-chart-3" style="width:12px;height:12px;color:var(--text-muted);"></i>
            <span style="font-size:11px;font-weight:600;color:var(--text-secondary);letter-spacing:0.3px;">最近调用统计</span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
            <div style="background:var(--ink-50);border-radius:var(--radius-md);padding:10px;text-align:center;border:1px solid var(--border-subtle);">
              <div style="font-size:10px;color:var(--text-muted);margin-bottom:3px;">近1小时</div>
              <div style="font-size:16px;font-weight:700;color:var(--text-main);font-variant-numeric:tabular-nums;">${(st.calls1h).toLocaleString()}</div>
              <div style="font-size:9.5px;color:var(--text-muted);margin-top:1px;">次调用</div>
            </div>
            <div style="background:var(--ink-50);border-radius:var(--radius-md);padding:10px;text-align:center;border:1px solid var(--border-subtle);">
              <div style="font-size:10px;color:var(--text-muted);margin-bottom:3px;">近24小时</div>
              <div style="font-size:16px;font-weight:700;color:var(--text-main);font-variant-numeric:tabular-nums;">${(st.calls24h).toLocaleString()}</div>
              <div style="font-size:9.5px;color:var(--text-muted);margin-top:1px;">次调用</div>
            </div>
            <div style="background:var(--ink-50);border-radius:var(--radius-md);padding:10px;text-align:center;border:1px solid var(--border-subtle);">
              <div style="font-size:10px;color:var(--text-muted);margin-bottom:3px;">近7天</div>
              <div style="font-size:16px;font-weight:700;color:var(--text-main);font-variant-numeric:tabular-nums;">${(st.calls7d).toLocaleString()}</div>
              <div style="font-size:9.5px;color:var(--text-muted);margin-top:1px;">次调用</div>
            </div>
            <div style="background:var(--ink-50);border-radius:var(--radius-md);padding:10px;text-align:center;border:1px solid var(--border-subtle);">
              <div style="font-size:10px;color:var(--text-muted);margin-bottom:3px;">成功率</div>
              <div style="font-size:16px;font-weight:700;color:${st.successRate>=99?'var(--emerald-600)':st.successRate>=90?'var(--amber-600)':'var(--rose-600)'};font-variant-numeric:tabular-nums;">${st.successRate}%</div>
              <div style="font-size:9.5px;color:var(--text-muted);margin-top:1px;">${item.status==='unconfigured'?'无数据':item.status==='error'?'异常':'正常'}</div>
            </div>
          </div>
        </div>

        ${item.status === 'error' && errs.length > 0 ? `
          <!-- Recent Error Logs -->
          <div style="margin-bottom:18px;">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">
              <i data-lucide="alert-circle" style="width:12px;height:12px;color:var(--rose-500);"></i>
              <span style="font-size:11px;font-weight:600;color:var(--rose-700);letter-spacing:0.3px;">最近失败日志</span>
            </div>
            <div style="border:1px solid var(--rose-200);border-radius:var(--radius-md);overflow:hidden;">
              <table style="width:100%;border-collapse:collapse;font-size:10.5px;">
                <thead>
                  <tr style="background:var(--rose-50);">
                    <th style="padding:6px 8px;text-align:left;font-weight:600;color:var(--rose-700);font-size:10px;border-bottom:1px solid var(--rose-100);">时间</th>
                    <th style="padding:6px 8px;text-align:left;font-weight:600;color:var(--rose-700);font-size:10px;border-bottom:1px solid var(--rose-100);width:50px;">错误码</th>
                    <th style="padding:6px 8px;text-align:left;font-weight:600;color:var(--rose-700);font-size:10px;border-bottom:1px solid var(--rose-100);">错误信息</th>
                    <th style="padding:6px 8px;text-align:center;font-weight:600;color:var(--rose-700);font-size:10px;border-bottom:1px solid var(--rose-100);width:50px;">重试</th>
                  </tr>
                </thead>
                <tbody>
                  ${errs.map(e => `
                    <tr style="border-bottom:1px solid var(--rose-50);">
                      <td style="padding:6px 8px;color:var(--text-secondary);font-variant-numeric:tabular-nums;white-space:nowrap;">${e.time}</td>
                      <td style="padding:6px 8px;"><span style="font-family:var(--font-mono);font-size:10px;padding:1px 5px;background:var(--rose-100);color:var(--rose-700);border-radius:3px;">${e.code}</span></td>
                      <td style="padding:6px 8px;color:var(--text-secondary);">${e.msg}</td>
                      <td style="padding:6px 8px;text-align:center;color:var(--text-muted);font-variant-numeric:tabular-nums;">${e.retries}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        ` : ''}

        ${item.checks && item.checks.length > 0 ? `
          <!-- Verification Checklist -->
          <div style="margin-bottom:18px;">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">
              <i data-lucide="clipboard-check" style="width:12px;height:12px;color:var(--amber-500);"></i>
              <span style="font-size:11px;font-weight:600;color:var(--text-secondary);letter-spacing:0.3px;">待完成核验项</span>
              <span style="font-size:9.5px;color:var(--amber-600);background:var(--amber-50);padding:1px 5px;border-radius:3px;">${item.checks.filter(c=>!c.done).length}/${item.checks.length} 待完成</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:4px;">
              ${item.checks.map(c => `
                <div style="display:flex;align-items:center;gap:8px;padding:7px 10px;background:${c.done?'var(--emerald-50)':'var(--amber-50)'};border-radius:var(--radius-sm);font-size:11px;">
                  <i data-lucide="${c.done?'check-circle-2':'circle'}" style="width:14px;height:14px;color:${c.done?'var(--emerald-500)':'var(--amber-500)'};flex-shrink:0;"></i>
                  <span style="color:${c.done?'var(--emerald-700)':'var(--text-secondary)'};${c.done?'text-decoration:line-through;':''}">${c.text}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${item.retries && item.retries.length > 0 ? `
          <!-- Retry Records -->
          <div style="margin-bottom:18px;">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">
              <i data-lucide="rotate-ccw" style="width:12px;height:12px;color:var(--rose-500);"></i>
              <span style="font-size:11px;font-weight:600;color:var(--text-secondary);letter-spacing:0.3px;">自动重试记录</span>
            </div>
            <div style="border:1px solid var(--border-subtle);border-radius:var(--radius-md);overflow:hidden;">
              <table style="width:100%;border-collapse:collapse;font-size:10.5px;">
                <thead>
                  <tr style="background:var(--ink-50);">
                    <th style="padding:6px 8px;text-align:left;font-weight:600;color:var(--text-muted);font-size:10px;border-bottom:1px solid var(--border-subtle);">重试时间</th>
                    <th style="padding:6px 8px;text-align:left;font-weight:600;color:var(--text-muted);font-size:10px;border-bottom:1px solid var(--border-subtle);width:60px;">结果</th>
                    <th style="padding:6px 8px;text-align:left;font-weight:600;color:var(--text-muted);font-size:10px;border-bottom:1px solid var(--border-subtle);">失败原因</th>
                  </tr>
                </thead>
                <tbody>
                  ${item.retries.map(r => `
                    <tr style="border-bottom:1px solid var(--border-subtle);">
                      <td style="padding:6px 8px;color:var(--text-secondary);font-variant-numeric:tabular-nums;white-space:nowrap;">${r.time}</td>
                      <td style="padding:6px 8px;"><span style="font-size:9.5px;padding:1px 5px;background:var(--rose-50);color:var(--rose-700);border-radius:3px;">${r.result}</span></td>
                      <td style="padding:6px 8px;color:var(--rose-600);">${r.reason}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        ` : ''}

        ${item.latency != null ? `
          <!-- Latency Gauge -->
          <div style="margin-bottom:8px;">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">
              <i data-lucide="gauge" style="width:12px;height:12px;color:var(--text-muted);"></i>
              <span style="font-size:11px;font-weight:600;color:var(--text-secondary);letter-spacing:0.3px;">当前延迟</span>
            </div>
            <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--ink-50);border-radius:var(--radius-md);border:1px solid var(--border-subtle);">
              <div style="font-size:24px;font-weight:700;color:${item.latency<50?'var(--emerald-600)':item.latency<100?'var(--brand-600)':'var(--amber-600)'};font-variant-numeric:tabular-nums;line-height:1;">${item.latency}<span style="font-size:12px;font-weight:400;color:var(--text-muted);margin-left:2px;">ms</span></div>
              <div style="flex:1;height:6px;background:var(--ink-200);border-radius:3px;overflow:hidden;">
                <div style="width:${Math.min(item.latency/2,100)}%;height:100%;background:${item.latency<50?'var(--emerald-500)':item.latency<100?'var(--brand-500)':'var(--amber-500)'};border-radius:3px;transition:width 0.5s;"></div>
              </div>
              <span style="font-size:10px;color:var(--text-muted);">阈值 200ms</span>
            </div>
          </div>
        ` : ''}

      </div>

      <!-- Footer Actions -->
      <div style="padding:10px 18px;border-top:1px solid var(--border-color);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;background:var(--bg-card);">
        <div style="font-size:10.5px;color:var(--text-muted);">
          <i data-lucide="clock" style="width:10px;height:10px;vertical-align:-1px;margin-right:3px;"></i>最近核验：${item.lastCheck}
        </div>
        <div style="display:flex;gap:6px;">
          <button class="btn btn-outline btn-sm" style="height:28px;font-size:11px;" onclick="App.showToast('编辑配置面板演示中','info')">
            <i data-lucide="settings" style="width:11px;height:11px;"></i>编辑配置
          </button>
          <button class="btn btn-primary btn-sm" style="height:28px;font-size:11px;" onclick="${item.status!=='unconfigured'?`IntegrationsView.testConn('${item.id}')`:`App.showToast('请先完成配置','warning')`}" ${item.status==='unconfigured'?'disabled':''}>
            <i data-lucide="zap" style="width:11px;height:11px;"></i>重新测试
          </button>
        </div>
      </div>
    </div>
  `;
}

function closeIntegrationDrawer() {
  const container = document.getElementById('integration-detail-drawer-container');
  if (container) {
    container.classList.remove('open');
    setTimeout(() => { container.innerHTML = ''; }, 300);
  }
  _currentIntegrationId = null;
}

// ── Helpers ────────────────────────────────────────────────

function maskKey(key) {
  if (!key || key.length < 8) return key;
  const prefix = key.substring(0, key.indexOf('-') + 1);
  const last4 = key.substring(key.length - 4);
  return prefix + '****' + last4;
}

function maskUrl(url) {
  if (!url || url === '未配置') return url;
  return url.replace(/https?:\/\/([^/]+)/, (match, domain) => {
    const parts = domain.split('.');
    if (parts.length >= 2) {
      const masked = parts.map((p, i) => i === 0 ? '****' : p).join('.');
      return 'https://' + masked;
    }
    return match;
  });
}

function renderPagination(total, current) {
  return `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;padding:0 2px;">
      <div style="font-size:11px;color:var(--text-muted);font-variant-numeric:tabular-nums;">共 ${total} 个集成</div>
      <div style="display:flex;gap:3px;">
        <button class="btn btn-outline btn-sm" style="min-width:28px;padding:0 6px;" disabled><i data-lucide="chevron-left" style="width:11px;height:11px;"></i></button>
        <button class="btn btn-primary btn-sm" style="min-width:28px;padding:0 8px;">${current}</button>
      </div>
    </div>
  `;
}

// ── Actions ────────────────────────────────────────────────

function addIntegration() {
  App.showToast('添加集成向导演示中', 'info');
}

function toggleIntegration(id, name) {
  App.showToast('「' + name + '」启停切换（演示）', 'success');
}
