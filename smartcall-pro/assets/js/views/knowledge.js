// View: Knowledge (知识库与智能体绑定) - MaxKB应用·连接核验·测试问答·版本发布

// ── Mock Data ──────────────────────────────────────────────
const KB_APPS = [
  {
    id: 'KB-APP-001',
    name: '婚恋嘉宾资料库',
    type: '嘉宾库',
    status: 'connected',
    bindings: ['婚恋首次筛选v3', '二次回访跟进'],
    lastCheck: '2026-08-20 14:30',
    docCount: 12860,
    version: 'v2.4.1',
    endpoint: 'https://maxkb.example.com/api/application/dialogue',
    apiKey: 'sk-****a7f3',
    model: 'qwen2.5-72b-instruct',
    temperature: 0.3,
    topK: 5,
    scoreThreshold: 0.75,
    maxTokens: 2048,
    flows: ['婚恋首次筛选流程', '二次回访跟进流程'],
    dailyCalls: 3420,
  },
  {
    id: 'KB-APP-002',
    name: '会员产品话术库',
    type: '话术库',
    status: 'connected',
    bindings: ['产品介绍与邀约'],
    lastCheck: '2026-08-20 13:45',
    docCount: 328,
    version: 'v1.8.0',
    endpoint: 'https://maxkb.example.com/api/application/dialogue',
    apiKey: 'sk-****b2e9',
    model: 'qwen2.5-72b-instruct',
    temperature: 0.2,
    topK: 3,
    scoreThreshold: 0.80,
    maxTokens: 1024,
    flows: ['产品介绍邀约流程'],
    dailyCalls: 1860,
  },
  {
    id: 'KB-APP-003',
    name: '常见异议应答库',
    type: 'FAQ',
    status: 'connected',
    bindings: ['首次接触异议处理'],
    lastCheck: '2026-08-20 12:10',
    docCount: 512,
    version: 'v3.1.2',
    endpoint: 'https://maxkb.example.com/api/application/dialogue',
    apiKey: 'sk-****c4d1',
    model: 'qwen2.5-72b-instruct',
    temperature: 0.1,
    topK: 4,
    scoreThreshold: 0.85,
    maxTokens: 512,
    flows: ['异议处理流程'],
    dailyCalls: 2150,
  },
  {
    id: 'KB-APP-004',
    name: '行业知识库-测试环境',
    type: '通用',
    status: 'pending',
    bindings: [],
    lastCheck: '2026-08-19 18:22',
    docCount: 86,
    version: 'v0.9.0-beta',
    endpoint: 'https://maxkb-test.example.com/api/application/dialogue',
    apiKey: 'sk-****test',
    model: 'qwen2.5-7b-instruct',
    temperature: 0.5,
    topK: 5,
    scoreThreshold: 0.60,
    maxTokens: 1024,
    flows: [],
    dailyCalls: 0,
  },
  {
    id: 'KB-APP-005',
    name: '旧版嘉宾库-v1',
    type: '嘉宾库',
    status: 'error',
    bindings: [],
    lastCheck: '2026-08-20 09:15',
    docCount: 8200,
    version: 'v1.0.0',
    endpoint: 'https://maxkb-legacy.example.com/api/application/dialogue',
    apiKey: 'sk-****legc',
    model: 'qwen-7b-chat',
    temperature: 0.3,
    topK: 5,
    scoreThreshold: 0.70,
    maxTokens: 2048,
    flows: [],
    dailyCalls: 0,
  },
];

const KB_ERROR_LOGS = {
  'KB-APP-001': [],
  'KB-APP-002': [],
  'KB-APP-003': [
    { time: '2026-08-20 10:32:11', type: '检索超时', status: '已自动重试' },
  ],
  'KB-APP-004': [
    { time: '2026-08-19 18:22:05', type: 'API地址不可达', status: '待排查' },
    { time: '2026-08-19 17:50:32', type: 'SSL证书验证失败', status: '待排查' },
  ],
  'KB-APP-005': [
    { time: '2026-08-20 09:15:44', type: '认证失败(401)', status: '未修复' },
    { time: '2026-08-20 09:12:18', type: '认证失败(401)', status: '未修复' },
    { time: '2026-08-20 08:58:03', type: '连接超时', status: '未修复' },
    { time: '2026-08-19 22:30:55', type: 'API版本不兼容', status: '未修复' },
    { time: '2026-08-19 20:15:22', type: '认证失败(401)', status: '未修复' },
  ],
};

const KB_VERSION_HISTORY = {
  'KB-APP-001': [
    { ver: 'v2.4.1', publisher: '林总监', time: '2026-08-18 16:20', note: '新增2026年Q3嘉宾数据1200条，优化检索权重', canRollback: true },
    { ver: 'v2.4.0', publisher: '周主管', time: '2026-08-10 11:00', note: '升级嵌入模型至bge-large-zh-v1.5', canRollback: true },
    { ver: 'v2.3.2', publisher: '林总监', time: '2026-07-28 09:30', note: '修复重复文档索引问题', canRollback: false },
  ],
  'KB-APP-002': [
    { ver: 'v1.8.0', publisher: '周主管', time: '2026-08-15 14:00', note: '新增VIP会员权益话术，调整邀约语气', canRollback: true },
    { ver: 'v1.7.0', publisher: '林总监', time: '2026-08-01 10:15', note: '补充暑期活动套餐话术', canRollback: true },
  ],
  'KB-APP-003': [
    { ver: 'v3.1.2', publisher: '林总监', time: '2026-08-17 15:40', note: '新增"我考虑一下"等12条高频异议应答', canRollback: true },
    { ver: 'v3.1.1', publisher: '周主管', time: '2026-08-05 09:20', note: '优化"费用太贵"应答逻辑', canRollback: true },
    { ver: 'v3.1.0', publisher: '林总监', time: '2026-07-20 16:00', note: '新增多轮异议处理能力', canRollback: false },
  ],
  'KB-APP-004': [
    { ver: 'v0.9.0-beta', publisher: '研发-小王', time: '2026-08-19 17:00', note: '测试环境初始化，导入行业白皮书数据', canRollback: false },
  ],
  'KB-APP-005': [
    { ver: 'v1.0.0', publisher: '系统', time: '2026-03-01 00:00', note: '初始版本(已停用，请迁移至新版嘉宾库)', canRollback: false },
  ],
};

// ── State ──────────────────────────────────────────────────
let _kbDrawerAppId = null;
let _kbTestQuestion = '';
let _kbTestAnswer = null;

// ── Status Helpers ─────────────────────────────────────────

function kbStatusBadge(status) {
  const map = {
    connected: { label: '已连接', bg: 'var(--emerald-50)', text: 'var(--emerald-700)', dot: 'var(--emerald-500)' },
    pending:   { label: '待核验', bg: 'var(--amber-50)',   text: 'var(--amber-700)',   dot: 'var(--amber-500)' },
    error:     { label: '异常',   bg: 'var(--rose-50)',    text: 'var(--rose-700)',    dot: 'var(--rose-500)' },
    unbound:   { label: '未配置', bg: 'var(--ink-100)',    text: 'var(--text-muted)',  dot: 'var(--ink-400)' },
  };
  const s = map[status] || map.unbound;
  return `<span style="display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:var(--radius-sm);font-size:11px;font-weight:500;background:${s.bg};color:${s.text};white-space:nowrap;"><span style="width:6px;height:6px;border-radius:50%;background:${s.dot};flex-shrink:0;"></span>${s.label}</span>`;
}

function kbTypeBadge(type) {
  const map = {
    '嘉宾库': { bg: 'var(--brand-50)', text: 'var(--brand-700)' },
    '话术库': { bg: 'var(--violet-50)', text: 'var(--violet-700)' },
    'FAQ':    { bg: 'var(--blue-50)', text: 'var(--blue-700)' },
    '通用':   { bg: 'var(--ink-100)', text: 'var(--text-muted)' },
  };
  const s = map[type] || map['通用'];
  return `<span style="display:inline-flex;align-items:center;padding:1px 6px;border-radius:var(--radius-sm);font-size:10.5px;font-weight:500;background:${s.bg};color:${s.text};white-space:nowrap;">${type}</span>`;
}

// ── View Object ────────────────────────────────────────────
window.KnowledgeView = {
  render() {
    return renderKnowledgeView();
  },

  openDetail(appId) {
    openKbDetail(appId);
  },

  testConnection(appId) {
    testKbConnection(appId);
  },

  bindBot(appId) {
    bindKbBot(appId);
  },
};

window.setKbFilter = setKbFilter;
window.resetKbFilters = resetKbFilters;

// ── Main Render ────────────────────────────────────────────

// 知识库筛选状态 (真实联动)
let kbSearch = '';
let kbFilterStatus = 'ALL';
let kbFilterType = 'ALL';

function setKbFilter(kind, val) {
  if (kind === 'search') kbSearch = val;
  if (kind === 'status') kbFilterStatus = val;
  if (kind === 'type') kbFilterType = val;
  App.refreshCurrentView();
}

function resetKbFilters() {
  kbSearch = ''; kbFilterStatus = 'ALL'; kbFilterType = 'ALL';
  App.showToast('筛选条件已重置', 'info');
  App.refreshCurrentView();
}

function renderKnowledgeView() {
  const apps = KB_APPS.filter(a => {
    const q = kbSearch.toLowerCase();
    const matchSearch = !q || a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q);
    const matchStatus = kbFilterStatus === 'ALL' || a.status === kbFilterStatus;
    const matchType = kbFilterType === 'ALL' || a.type === kbFilterType;
    return matchSearch && matchStatus && matchType;
  });
  const connectedCount = apps.filter(a => a.status === 'connected').length;
  const boundBots = apps.reduce((sum, a) => sum + a.bindings.length, 0);
  const todayCalls = apps.reduce((sum, a) => sum + a.dailyCalls, 0);
  const errorCount = apps.filter(a => a.status === 'error').length;

  return `
    <div class="view-fade-enter">

      <!-- Page Header -->
      <div class="page-header">
        <div class="page-title-group">
          <div class="page-title">
            <i data-lucide="book-open"></i>
            知识库与智能体绑定
          </div>
          <div class="page-subtitle">MaxKB应用 · 连接核验 · 测试问答 · 版本发布</div>
        </div>
        <div class="page-actions" style="display:flex;align-items:center;gap:6px;">
          <span class="badge badge-neutral" style="font-size:10px;line-height:16px;background:var(--amber-50);color:var(--amber-700);border:1px solid var(--amber-200);">
            <i data-lucide="flask-conical" style="width:9px;height:9px;margin-right:2px;"></i>模拟配置·待POC核验
          </span>
          <button class="btn btn-primary btn-sm" onclick="App.showToast('新增绑定功能演示中','info')">
            <i data-lucide="plus"></i>新增绑定
          </button>
        </div>
      </div>

      <!-- KPI Row -->
      <div class="metrics-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:var(--content-gap);">
        <div class="metric-card" style="padding:10px 12px;min-height:56px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
            <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">已连接应用</span>
            <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--emerald-50);flex-shrink:0;">
              <i data-lucide="link" style="width:11px;height:11px;color:var(--emerald-600);"></i>
            </div>
          </div>
          <div style="font-size:18px;font-weight:700;color:var(--emerald-600);font-variant-numeric:tabular-nums;line-height:1.2;">${connectedCount}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">/${apps.length}</span></div>
        </div>
        <div class="metric-card" style="padding:10px 12px;min-height:56px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
            <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">已绑定机器人</span>
            <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--brand-50);flex-shrink:0;">
              <i data-lucide="bot" style="width:11px;height:11px;color:var(--brand-600);"></i>
            </div>
          </div>
          <div style="font-size:18px;font-weight:700;color:var(--brand-600);font-variant-numeric:tabular-nums;line-height:1.2;">${boundBots}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">个</span></div>
        </div>
        <div class="metric-card" style="padding:10px 12px;min-height:56px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
            <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">今日调用量</span>
            <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--violet-50);flex-shrink:0;">
              <i data-lucide="activity" style="width:11px;height:11px;color:var(--violet-600);"></i>
            </div>
          </div>
          <div style="font-size:18px;font-weight:700;color:var(--text-main);font-variant-numeric:tabular-nums;line-height:1.2;">${todayCalls.toLocaleString()}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">次</span></div>
        </div>
        <div class="metric-card" style="padding:10px 12px;min-height:56px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
            <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">异常应用</span>
            <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--rose-50);flex-shrink:0;">
              <i data-lucide="alert-circle" style="width:11px;height:11px;color:var(--rose-600);"></i>
            </div>
          </div>
          <div style="font-size:18px;font-weight:700;color:${errorCount > 0 ? 'var(--rose-600)' : 'var(--text-secondary)'};font-variant-numeric:tabular-nums;line-height:1.2;">${errorCount}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">个</span></div>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="filter-bar">
        <div style="position:relative;flex:1;min-width:180px;max-width:240px;">
          <i data-lucide="search" style="position:absolute;left:8px;top:50%;transform:translateY(-50%);width:12px;height:12px;color:var(--text-muted);"></i>
          <input type="text" class="form-input" style="width:100%;height:30px;line-height:30px;padding:0 10px 0 26px;font-size:12px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;"
            placeholder="搜索应用名称/ID" value="${kbSearch}" oninput="setKbFilter('search', this.value)">
        </div>
        <select class="form-select" style="height:30px;padding:0 24px 0 8px;font-size:12px;min-width:100px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;" onchange="setKbFilter('status', this.value)">
          <option value="ALL" ${kbFilterStatus==='ALL'?'selected':''}>全部状态</option>
          <option value="connected" ${kbFilterStatus==='connected'?'selected':''}>已连接</option>
          <option value="pending" ${kbFilterStatus==='pending'?'selected':''}>待核验</option>
          <option value="error" ${kbFilterStatus==='error'?'selected':''}>异常</option>
        </select>
        <select class="form-select" style="height:30px;padding:0 24px 0 8px;font-size:12px;min-width:100px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;" onchange="setKbFilter('type', this.value)">
          <option value="ALL" ${kbFilterType==='ALL'?'selected':''}>全部类型</option>
          ${[...new Set(KB_APPS.map(a => a.type))].map(t => `<option value="${t}" ${kbFilterType===t?'selected':''}>${t}</option>`).join('')}
        </select>
        <div class="filter-divider"></div>
        <div class="filter-actions">
          <span class="filter-count">${apps.length}个应用</span>
          <button class="btn btn-ghost btn-sm" style="height:28px;font-size:11px;" onclick="resetKbFilters()">
            <i data-lucide="rotate-ccw" style="width:11px;height:11px;"></i>重置
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="card" style="padding:0;overflow:hidden;border-radius:8px;">
        <div style="overflow-x:auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width:200px;">应用名称/ID</th>
                <th style="width:72px;">应用类型</th>
                <th style="width:82px;">连接状态</th>
                <th>绑定机器人</th>
                <th style="width:130px;">最近核验时间</th>
                <th style="width:90px;text-align:right;">文档数</th>
                <th style="width:72px;">版本号</th>
                <th style="width:160px;text-align:right;">操作</th>
              </tr>
            </thead>
            <tbody class="stagger-container">
              ${apps.map(app => `
                <tr>
                  <td>
                    <div style="display:flex;align-items:center;gap:8px;">
                      <div style="width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:${
                        app.type === '嘉宾库' ? 'var(--brand-50)' :
                        app.type === '话术库' ? 'var(--violet-50)' :
                        app.type === 'FAQ' ? 'var(--blue-50)' : 'var(--ink-100)'
                      };">
                        <i data-lucide="${
                          app.type === '嘉宾库' ? 'users' :
                          app.type === '话术库' ? 'message-square' :
                          app.type === 'FAQ' ? 'help-circle' : 'folder'
                        }" style="width:13px;height:13px;color:${
                          app.type === '嘉宾库' ? 'var(--brand-600)' :
                          app.type === '话术库' ? 'var(--violet-600)' :
                          app.type === 'FAQ' ? 'var(--blue-600)' : 'var(--text-muted)'
                        };"></i>
                      </div>
                      <div style="min-width:0;">
                        <div style="font-size:12px;font-weight:500;color:var(--text-main);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${app.name}</div>
                        <div style="font-size:10px;color:var(--text-muted);font-variant-numeric:tabular-nums;font-family:var(--font-mono);white-space:nowrap;">${app.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>${kbTypeBadge(app.type)}</td>
                  <td>${kbStatusBadge(app.status)}</td>
                  <td>
                    ${app.bindings.length > 0 ?
                      `<div style="display:flex;flex-wrap:wrap;gap:3px;">
                        ${app.bindings.map(b => `<span style="display:inline-flex;align-items:center;padding:1px 7px;border-radius:4px;font-size:10.5px;font-weight:500;background:var(--ink-50);color:var(--text-secondary);border:1px solid var(--border-subtle);white-space:nowrap;">${b}</span>`).join('')}
                      </div>` :
                      `<span style="font-size:11px;color:var(--text-muted);">未绑定</span>`
                    }
                  </td>
                  <td><span style="font-size:11.5px;color:var(--text-secondary);font-variant-numeric:tabular-nums;">${app.lastCheck}</span></td>
                  <td style="text-align:right;"><span style="font-size:11.5px;color:var(--text-secondary);font-variant-numeric:tabular-nums;">${app.docCount.toLocaleString()}</span></td>
                  <td><span style="font-size:11px;font-weight:500;color:var(--text-main);font-variant-numeric:tabular-nums;font-family:var(--font-mono);">${app.version}</span></td>
                  <td style="text-align:right;">
                    <div style="display:flex;gap:2px;justify-content:flex-end;">
                      <button class="btn btn-ghost btn-sm" style="height:26px;padding:0 8px;font-size:11px;color:${app.status === 'error' ? 'var(--rose-600)' : 'var(--brand-600)'};" onclick="KnowledgeView.testConnection('${app.id}')">
                        <i data-lucide="zap" style="width:11px;height:11px;margin-right:2px;"></i>测试连接
                      </button>
                      <button class="btn btn-ghost btn-sm" style="width:26px;height:26px;padding:0;" onclick="KnowledgeView.openDetail('${app.id}')" title="详情">
                        <i data-lucide="eye" style="width:11px;height:11px;"></i>
                      </button>
                      <button class="btn btn-ghost btn-sm" style="width:26px;height:26px;padding:0;" onclick="showKbMoreMenu('${app.id}')" title="更多">
                        <i data-lucide="more-vertical" style="width:11px;height:11px;"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;padding:0 2px;">
        <div style="font-size:11px;color:var(--text-muted);font-variant-numeric:tabular-nums;">共 ${apps.length} 个应用</div>
        <div style="display:flex;gap:3px;">
          <button class="btn btn-outline btn-sm" style="min-width:28px;padding:0 6px;" disabled><i data-lucide="chevron-left" style="width:11px;height:11px;"></i></button>
          <button class="btn btn-primary btn-sm" style="min-width:28px;padding:0 8px;">1</button>
          <button class="btn btn-outline btn-sm" style="min-width:28px;padding:0 6px;" disabled><i data-lucide="chevron-right" style="width:11px;height:11px;"></i></button>
        </div>
      </div>

    </div>
  `;
}

// ── Detail Drawer ──────────────────────────────────────────
function openKbDetail(appId) {
  _kbDrawerAppId = appId;
  _kbTestQuestion = '';
  _kbTestAnswer = null;
  renderKbDrawer();
}

function closeKbDetail() {
  const container = document.getElementById('kb-detail-drawer-container');
  if (container) {
    container.classList.remove('open');
    setTimeout(() => { container.innerHTML = ''; }, 300);
  }
  _kbDrawerAppId = null;
  _kbTestQuestion = '';
  _kbTestAnswer = null;
}

function renderKbDrawer() {
  const app = KB_APPS.find(a => a.id === _kbDrawerAppId);
  if (!app) return;

  let container = document.getElementById('kb-detail-drawer-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'kb-detail-drawer-container';
    container.className = 'drawer-backdrop';
    document.body.appendChild(container);
    container.addEventListener('click', (e) => { if (e.target === container) closeKbDetail(); });
  }

  const errorLogs = KB_ERROR_LOGS[app.id] || [];
  const versions = KB_VERSION_HISTORY[app.id] || [];

  container.innerHTML = `
    <div onclick="event.stopPropagation()" style="position:fixed;right:0;top:var(--header-height);bottom:0;width:520px;background:var(--bg-card);border-left:1px solid var(--border-color);z-index:50;overflow-y:auto;padding:20px;box-shadow:var(--shadow-lg);display:flex;flex-direction:column;transform:translateX(100%);transition:transform 0.3s cubic-bezier(0.16,1,0.3,1);">
      <!-- Drawer Header -->
      <div style="padding-bottom:14px;border-bottom:1px solid var(--border-color);display:flex;align-items:flex-start;justify-content:space-between;gap:10px;flex-shrink:0;">
        <div style="display:flex;align-items:flex-start;gap:10px;min-width:0;flex:1;">
          <div style="width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:${
            app.type === '嘉宾库' ? 'var(--brand-50)' :
            app.type === '话术库' ? 'var(--violet-50)' :
            app.type === 'FAQ' ? 'var(--blue-50)' : 'var(--ink-100)'
          };">
            <i data-lucide="${
              app.type === '嘉宾库' ? 'users' :
              app.type === '话术库' ? 'message-square' :
              app.type === 'FAQ' ? 'help-circle' : 'folder'
            }" style="width:16px;height:16px;color:${
              app.type === '嘉宾库' ? 'var(--brand-600)' :
              app.type === '话术库' ? 'var(--violet-600)' :
              app.type === 'FAQ' ? 'var(--blue-600)' : 'var(--text-muted)'
            };"></i>
          </div>
          <div style="min-width:0;flex:1;">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:3px;">
              <span style="font-size:14px;font-weight:700;color:var(--text-main);">${app.name}</span>
              ${kbStatusBadge(app.status)}
            </div>
            <div style="display:flex;align-items:center;gap:6px;font-size:10.5px;color:var(--text-muted);flex-wrap:wrap;font-variant-numeric:tabular-nums;">
              <span style="font-family:var(--font-mono);">${app.id}</span>
              <span style="color:var(--border-color);">·</span>
              ${kbTypeBadge(app.type)}
              <span style="color:var(--border-color);">·</span>
              <span>${app.version}</span>
            </div>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm" style="width:28px;height:28px;padding:0;flex-shrink:0;" onclick="closeKbDetail()">
          <i data-lucide="x" style="width:14px;height:14px;"></i>
        </button>
      </div>

      <!-- Drawer Body -->
      <div style="flex:1;overflow-y:auto;padding-top:16px;display:flex;flex-direction:column;gap:14px;">

        <!-- 连接配置 -->
        <div class="card" style="padding:12px 14px;">
          <div style="font-size:11px;font-weight:700;color:var(--text-main);margin-bottom:10px;display:flex;align-items:center;gap:5px;">
            <i data-lucide="settings" style="width:12px;height:12px;color:var(--brand-500);"></i>连接配置
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px 12px;font-size:11.5px;">
            <div style="display:flex;gap:6px;"><span style="color:var(--text-muted);width:68px;flex-shrink:0;">API Endpoint</span><span style="color:var(--text-main);font-family:var(--font-mono);font-size:10.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;" title="${app.endpoint}">${app.endpoint}</span></div>
            <div style="display:flex;gap:6px;"><span style="color:var(--text-muted);width:68px;flex-shrink:0;">API Key</span><span style="color:var(--text-main);font-family:var(--font-mono);font-size:11px;">${app.apiKey}</span></div>
            <div style="display:flex;gap:6px;"><span style="color:var(--text-muted);width:68px;flex-shrink:0;">模型名称</span><span style="color:var(--text-main);">${app.model}</span></div>
            <div style="display:flex;gap:6px;"><span style="color:var(--text-muted);width:68px;flex-shrink:0;">Temperature</span><span style="color:var(--text-main);font-variant-numeric:tabular-nums;">${app.temperature}</span></div>
          </div>
        </div>

        <!-- 关联流程 -->
        <div class="card" style="padding:12px 14px;">
          <div style="font-size:11px;font-weight:700;color:var(--text-main);margin-bottom:10px;display:flex;align-items:center;gap:5px;">
            <i data-lucide="git-branch" style="width:12px;height:12px;color:var(--violet-500);"></i>关联流程
            <span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:2px;">(${app.flows.length}个)</span>
          </div>
          ${app.flows.length > 0 ?
            `<div style="display:flex;flex-wrap:wrap;gap:4px;">
              ${app.flows.map(f => `<span style="display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:4px;font-size:10.5px;font-weight:500;background:var(--violet-50);color:var(--violet-700);white-space:nowrap;"><i data-lucide="workflow" style="width:9px;height:9px;"></i>${f}</span>`).join('')}
            </div>` :
            `<div style="font-size:11px;color:var(--text-muted);">暂无关联流程</div>`
          }
        </div>

        <!-- 检索参数 -->
        <div class="card" style="padding:12px 14px;">
          <div style="font-size:11px;font-weight:700;color:var(--text-main);margin-bottom:10px;display:flex;align-items:center;gap:5px;">
            <i data-lucide="sliders-horizontal" style="width:12px;height:12px;color:var(--blue-500);"></i>检索参数
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">
            <div style="background:var(--ink-50);border-radius:6px;padding:8px 10px;text-align:center;">
              <div style="font-size:10px;color:var(--text-muted);margin-bottom:2px;">Top-K</div>
              <div style="font-size:16px;font-weight:700;color:var(--text-main);font-variant-numeric:tabular-nums;">${app.topK}</div>
            </div>
            <div style="background:var(--ink-50);border-radius:6px;padding:8px 10px;text-align:center;">
              <div style="font-size:10px;color:var(--text-muted);margin-bottom:2px;">相似度阈值</div>
              <div style="font-size:16px;font-weight:700;color:var(--text-main);font-variant-numeric:tabular-nums;">${app.scoreThreshold}</div>
            </div>
            <div style="background:var(--ink-50);border-radius:6px;padding:8px 10px;text-align:center;">
              <div style="font-size:10px;color:var(--text-muted);margin-bottom:2px;">最大Token</div>
              <div style="font-size:16px;font-weight:700;color:var(--text-main);font-variant-numeric:tabular-nums;">${app.maxTokens}</div>
            </div>
          </div>
        </div>

        <!-- 测试问答 -->
        <div class="card" style="padding:12px 14px;">
          <div style="font-size:11px;font-weight:700;color:var(--text-main);margin-bottom:10px;display:flex;align-items:center;gap:5px;">
            <i data-lucide="message-circle-question" style="width:12px;height:12px;color:var(--emerald-500);"></i>测试问答
          </div>
          <div style="display:flex;gap:6px;margin-bottom:${_kbTestAnswer ? '10px' : '0'};">
            <input type="text" id="kb-test-input" value="${_kbTestQuestion}" placeholder="输入测试问题，如：你们的服务怎么收费？"
              style="flex:1;height:30px;line-height:30px;padding:0 10px;font-size:12px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid var(--border-subtle);outline:none;"
              onkeydown="if(event.key==='Enter'){submitKbTest();}">
            <button class="btn btn-primary btn-sm" style="height:30px;font-size:11px;white-space:nowrap;" onclick="submitKbTest()">
              <i data-lucide="send" style="width:11px;height:11px;margin-right:2px;"></i>发送
            </button>
          </div>
          ${_kbTestAnswer ? `
            <div style="background:var(--emerald-50);border:1px solid var(--emerald-100);border-radius:6px;padding:10px 12px;">
              <div style="display:flex;align-items:center;gap:4px;font-size:10px;font-weight:600;color:var(--emerald-700);margin-bottom:4px;">
                <i data-lucide="bot" style="width:10px;height:10px;"></i>知识库回答
                <span style="font-weight:400;color:var(--emerald-600);margin-left:4px;font-variant-numeric:tabular-nums;">(耗时 ${_kbTestAnswer.latency}ms · 置信度 ${_kbTestAnswer.confidence})</span>
              </div>
              <div style="font-size:11.5px;color:var(--text-secondary);line-height:1.6;">${_kbTestAnswer.text}</div>
              ${_kbTestAnswer.sources ? `
                <div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:3px;">
                  ${_kbTestAnswer.sources.map(s => `<span style="font-size:9.5px;padding:1px 5px;border-radius:3px;background:var(--emerald-100);color:var(--emerald-700);font-variant-numeric:tabular-nums;">${s}</span>`).join('')}
                </div>
              ` : ''}
            </div>
          ` : ''}
        </div>

        <!-- 最近错误日志 -->
        ${errorLogs.length > 0 ? `
        <div class="card" style="padding:12px 14px;">
          <div style="font-size:11px;font-weight:700;color:var(--text-main);margin-bottom:10px;display:flex;align-items:center;gap:5px;">
            <i data-lucide="alert-triangle" style="width:12px;height:12px;color:var(--rose-500);"></i>最近调用错误日志
            <span style="font-size:10px;font-weight:400;color:var(--rose-600);margin-left:2px;">(${errorLogs.length}条)</span>
          </div>
          <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;font-size:11px;">
              <thead>
                <tr style="border-bottom:1px solid var(--border-subtle);">
                  <th style="text-align:left;padding:4px 6px;font-weight:600;color:var(--text-muted);font-size:10px;">时间</th>
                  <th style="text-align:left;padding:4px 6px;font-weight:600;color:var(--text-muted);font-size:10px;">错误类型</th>
                  <th style="text-align:left;padding:4px 6px;font-weight:600;color:var(--text-muted);font-size:10px;">状态</th>
                </tr>
              </thead>
              <tbody>
                ${errorLogs.map(log => `
                  <tr style="border-bottom:1px solid var(--border-subtle);">
                    <td style="padding:5px 6px;color:var(--text-secondary);font-variant-numeric:tabular-nums;white-space:nowrap;">${log.time}</td>
                    <td style="padding:5px 6px;color:var(--rose-600);font-weight:500;">${log.type}</td>
                    <td style="padding:5px 6px;">
                      <span style="font-size:10px;padding:1px 5px;border-radius:3px;background:${log.status === '已自动重试' ? 'var(--emerald-50)' : 'var(--rose-50)'};color:${log.status === '已自动重试' ? 'var(--emerald-700)' : 'var(--rose-700)'};">${log.status}</span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
        ` : `
        <div class="card" style="padding:12px 14px;">
          <div style="font-size:11px;font-weight:700;color:var(--text-main);margin-bottom:8px;display:flex;align-items:center;gap:5px;">
            <i data-lucide="check-circle" style="width:12px;height:12px;color:var(--emerald-500);"></i>调用状态
          </div>
          <div style="font-size:11px;color:var(--emerald-600);display:flex;align-items:center;gap:4px;">
            <i data-lucide="check-circle" style="width:12px;height:12px;"></i>近24小时无异常错误
          </div>
        </div>
        `}

        <!-- 版本发布记录 -->
        <div class="card" style="padding:12px 14px;">
          <div style="font-size:11px;font-weight:700;color:var(--text-main);margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;">
            <div style="display:flex;align-items:center;gap:5px;">
              <i data-lucide="git-merge" style="width:12px;height:12px;color:var(--violet-500);"></i>版本发布记录
            </div>
            <button class="btn btn-outline btn-sm" style="height:24px;padding:0 8px;font-size:10px;" onclick="App.showToast('发布新版本演示中','info')">
              <i data-lucide="upload" style="width:10px;height:10px;margin-right:2px;"></i>发布新版本
            </button>
          </div>
          <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;font-size:11px;">
              <thead>
                <tr style="border-bottom:1px solid var(--border-subtle);">
                  <th style="text-align:left;padding:4px 6px;font-weight:600;color:var(--text-muted);font-size:10px;">版本</th>
                  <th style="text-align:left;padding:4px 6px;font-weight:600;color:var(--text-muted);font-size:10px;">发布人</th>
                  <th style="text-align:left;padding:4px 6px;font-weight:600;color:var(--text-muted);font-size:10px;">时间</th>
                  <th style="text-align:left;padding:4px 6px;font-weight:600;color:var(--text-muted);font-size:10px;">说明</th>
                  <th style="text-align:right;padding:4px 6px;font-weight:600;color:var(--text-muted);font-size:10px;">操作</th>
                </tr>
              </thead>
              <tbody>
                ${versions.map((v, idx) => `
                  <tr style="border-bottom:1px solid var(--border-subtle);">
                    <td style="padding:5px 6px;">
                      <span style="font-weight:600;color:${idx === 0 ? 'var(--brand-600)' : 'var(--text-main)'};font-family:var(--font-mono);font-size:11px;">${v.ver}</span>
                      ${idx === 0 ? '<span style="font-size:9px;padding:0px 4px;border-radius:3px;background:var(--brand-50);color:var(--brand-600);margin-left:3px;font-weight:500;">当前</span>' : ''}
                    </td>
                    <td style="padding:5px 6px;color:var(--text-secondary);white-space:nowrap;">${v.publisher}</td>
                    <td style="padding:5px 6px;color:var(--text-muted);font-variant-numeric:tabular-nums;white-space:nowrap;font-size:10.5px;">${v.time}</td>
                    <td style="padding:5px 6px;color:var(--text-secondary);max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${v.note}">${v.note}</td>
                    <td style="padding:5px 6px;text-align:right;">
                      ${v.canRollback ?
                        `<button class="btn btn-ghost btn-sm" style="height:22px;padding:0 6px;font-size:10px;color:var(--amber-600);" onclick="App.showToast('已回滚至 ${v.ver}','warning')">回滚</button>` :
                        `<span style="font-size:10px;color:var(--text-muted);">—</span>`
                      }
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  `;

  setTimeout(() => {
    container.classList.add('open');
    // Animate the drawer panel in
    const panel = container.querySelector('div[style*="position:fixed"][style*="width:520px"]');
    if (panel) {
      requestAnimationFrame(() => {
        panel.style.transform = 'translateX(0)';
      });
    }
    if (window.lucide) lucide.createIcons();
  }, 10);
}

// ── Actions ────────────────────────────────────────────────

function testKbConnection(appId) {
  const app = KB_APPS.find(a => a.id === appId);
  if (!app) return;

  if (app.status === 'error') {
    // Simulate failure for error app
    App.showToast(`连接失败：${app.name} - API认证失败(401)，请检查API Key配置`, 'error');
  } else if (app.status === 'pending') {
    App.showToast(`连接测试中... ${app.name} 端点响应超时，请检查网络配置`, 'warning');
  } else {
    const latency = 80 + Math.floor(Math.random() * 100);
    App.showToast(`连接成功：${app.name}，延迟 ${latency}ms`, 'success');
  }
}

function bindKbBot(appId) {
  const app = KB_APPS.find(a => a.id === appId);
  if (!app) return;
  App.showToast(`打开绑定机器人面板 - ${app.name}`, 'info');
}

function showKbMoreMenu(appId) {
  const app = KB_APPS.find(a => a.id === appId);
  if (!app) return;
  App.showToast(`更多操作菜单 - ${app.name}`, 'info');
}

function submitKbTest() {
  const input = document.getElementById('kb-test-input');
  if (!input) return;
  const question = input.value.trim();
  if (!question) {
    App.showToast('请输入测试问题', 'warning');
    return;
  }
  _kbTestQuestion = question;
  const app = KB_APPS.find(a => a.id === _kbDrawerAppId);
  if (!app) return;

  // Mock response based on app type
  const latency = 200 + Math.floor(Math.random() * 400);
  const confidence = (0.82 + Math.random() * 0.15).toFixed(2);

  let answerText = '';
  let sources = [];

  if (app.status === 'error') {
    answerText = '当前应用连接异常，无法获取回答。请检查API配置和网络连通性后重试。';
    sources = [];
  } else if (app.type === '嘉宾库') {
    answerText = '根据嘉宾资料库检索，当前系统中匹配度较高的嘉宾共有12位。主要分布在杭州(5位)、上海(4位)、深圳(3位)，年龄区间27-33岁，职业以互联网/金融/高校教师为主。如需进一步筛选，请告知具体条件。';
    sources = ['嘉宾数据v2.4#chunk-0342', '嘉宾数据v2.4#chunk-0518', '标签索引#match-0091'];
  } else if (app.type === '话术库') {
    answerText = '您好！我们是专业的高端婚恋服务平台，目前提供1对1专属红娘服务，包括精准匹配、形象顾问、约会安排等全流程服务。现在预约可以免费获得一次专业情感测评和3位匹配嘉宾推荐哦~';
    sources = ['VIP会员话术#p-023', '邀约模板#v1.8#s-012'];
  } else if (app.type === 'FAQ') {
    answerText = '关于费用问题：我们的服务费用根据会员等级有所不同，普通会员年费6800元，VIP会员19800元，包含不同次数的匹配推荐和红娘服务。具体费用可以安排专属顾问为您详细介绍，首次咨询免费哦~';
    sources = ['FAQ-费用说明#q-007', 'FAQ-会员权益#q-012'];
  } else {
    answerText = '测试环境回答演示。当前为测试环境配置，回答内容为模拟数据，仅用于验证连通性和基本检索功能。';
    sources = [];
  }

  _kbTestAnswer = { text: answerText, latency, confidence, sources };
  renderKbDrawer();
}
