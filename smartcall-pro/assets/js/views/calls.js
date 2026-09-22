// View: Calls (通话记录中心) v1 - 全量通话台账 · 录音转写 · AI结果 · 流程轨迹 · 质检复核

// ── Mock Data ──────────────────────────────────────────────
const CALLS_DATA = [
  { id:'CL20260820-001', task:'杭州985硕博高知专场-批次3', leadName:'王建国', gender:'男', age:35, phone:'138****5678', startTime:'2026-08-20 14:32:18', status:'valid', duration:'03:42', intent:'A', intentScore:88, qaScore:94, transferred:true, recording:'available', city:'杭州', occupation:'字节跳动算法工程师' },
  { id:'CL20260820-002', task:'深圳金融海归精英专场', leadName:'李思琪', gender:'女', age:29, phone:'139****2341', startTime:'2026-08-20 14:28:05', status:'valid', duration:'04:15', intent:'S', intentScore:96, qaScore:97, transferred:true, recording:'available', city:'深圳', occupation:'中金公司投行VP' },
  { id:'CL20260820-003', task:'父母帮找安心专场-江浙沪', leadName:'张建军', gender:'男', age:58, phone:'137****8902', startTime:'2026-08-20 14:15:42', status:'valid', duration:'05:28', intent:'B', intentScore:76, qaScore:91, transferred:false, recording:'available', city:'杭州', occupation:'退休教师(代子咨询)' },
  { id:'CL20260820-004', task:'杭州985硕博高知专场-批次3', leadName:'陈雨萱', gender:'女', age:27, phone:'136****4456', startTime:'2026-08-20 14:10:33', status:'no_answer', duration:'—', intent:'D', intentScore:0, qaScore:null, transferred:false, recording:'none', city:'杭州', occupation:'阿里P7产品经理' },
  { id:'CL20260820-005', task:'北上广深名校教师专场', leadName:'赵子轩', gender:'男', age:32, phone:'135****1122', startTime:'2026-08-20 13:58:21', status:'valid', duration:'02:56', intent:'B', intentScore:82, qaScore:89, transferred:false, recording:'available', city:'北京', occupation:'清华附中物理教师' },
  { id:'CL20260820-006', task:'新一线城市医生专场', leadName:'孙雅涵', gender:'女', age:30, phone:'133****7788', startTime:'2026-08-20 13:45:09', status:'busy', duration:'—', intent:'D', intentScore:0, qaScore:null, transferred:false, recording:'none', city:'成都', occupation:'华西医院主治医师' },
  { id:'CL20260820-007', task:'杭州985硕博高知专场-批次3', leadName:'周明远', gender:'男', age:34, phone:'131****3344', startTime:'2026-08-20 13:32:47', status:'rejected', duration:'00:08', intent:'D', intentScore:20, qaScore:null, transferred:false, recording:'available', city:'杭州', occupation:'网易游戏主程' },
  { id:'CL20260820-008', task:'深圳金融海归精英专场', leadName:'吴佳怡', gender:'女', age:28, phone:'130****5566', startTime:'2026-08-20 13:20:15', status:'valid', duration:'06:12', intent:'S', intentScore:97, qaScore:98, transferred:true, recording:'available', city:'深圳', occupation:'腾讯战略投资经理' },
  { id:'CL20260820-009', task:'体制内公务员专场-华东', leadName:'郑浩然', gender:'男', age:31, phone:'189****9900', startTime:'2026-08-20 13:08:33', status:'transferred', duration:'07:45', intent:'A', intentScore:91, qaScore:93, transferred:true, recording:'available', city:'南京', occupation:'省财政厅副主任科员' },
  { id:'CL20260820-010', task:'父母帮找安心专场-江浙沪', leadName:'刘美兰', gender:'女', age:55, phone:'188****2233', startTime:'2026-08-20 12:55:44', status:'valid', duration:'04:33', intent:'B', intentScore:73, qaScore:86, transferred:false, recording:'available', city:'苏州', occupation:'国企退休(代女咨询)' },
  { id:'CL20260820-011', task:'新一线城市医生专场', leadName:'黄文杰', gender:'男', age:33, phone:'187****6677', startTime:'2026-08-20 12:42:18', status:'failed', duration:'—', intent:'D', intentScore:0, qaScore:null, transferred:false, recording:'none', city:'武汉', occupation:'协和医院外科医生' },
  { id:'CL20260820-012', task:'杭州985硕博高知专场-批次3', leadName:'林晓薇', gender:'女', age:26, phone:'186****8899', startTime:'2026-08-20 12:30:02', status:'valid', duration:'03:18', intent:'A', intentScore:86, qaScore:88, transferred:false, recording:'processing', city:'杭州', occupation:'浙大辅导员(博士在读)' },
  { id:'CL20260820-013', task:'北上广深名校教师专场', leadName:'徐志强', gender:'男', age:29, phone:'185****1010', startTime:'2026-08-20 11:48:29', status:'unsubscribed', duration:'01:22', intent:'D', intentScore:10, qaScore:null, transferred:false, recording:'expired', city:'上海', occupation:'上海中学数学教师' },
  { id:'CL20260820-014', task:'深圳金融海归精英专场', leadName:'马思远', gender:'男', age:30, phone:'183****2020', startTime:'2026-08-20 11:35:11', status:'valid', duration:'05:47', intent:'B', intentScore:79, qaScore:85, qaReview:true, transferred:false, recording:'available', city:'深圳', occupation:'招商证券研究员' },
  { id:'CL20260820-015', task:'体制内公务员专场-华东', leadName:'高雪琴', gender:'女', age:28, phone:'182****3030', startTime:'2026-08-20 11:22:56', status:'valid', duration:'03:55', intent:'C', intentScore:62, qaScore:87, transferred:false, recording:'available', city:'合肥', occupation:'市中级人民法院法官助理' },
  { id:'CL20260820-016', task:'杭州互联网大厂专场', leadName:'罗宇航', gender:'男', age:31, phone:'181****4040', startTime:'2026-08-20 10:48:33', status:'valid', duration:'02:34', intent:'C', intentScore:58, qaScore:82, transferred:false, recording:'no_permission', city:'杭州', occupation:'蚂蚁金服技术专家' },
  { id:'CL20260820-017', task:'父母帮找安心专场-江浙沪', leadName:'谢德明', gender:'男', age:60, phone:'180****5050', startTime:'2026-08-20 10:35:12', status:'valid', duration:'08:22', intent:'A', intentScore:90, qaScore:95, transferred:true, recording:'available', city:'宁波', occupation:'民营企业家(代子咨询)' },
  { id:'CL20260820-018', task:'新一线城市医生专场', leadName:'韩雨桐', gender:'女', age:29, phone:'178****6060', startTime:'2026-08-20 10:18:45', status:'transferred', duration:'04:08', intent:'A', intentScore:89, qaScore:91, qaReview:true, transferred:true, recording:'available', city:'长沙', occupation:'湘雅医院儿科医生' },
  { id:'CL20260820-019', task:'杭州985硕博高知专场-批次3', leadName:'曹伟杰', gender:'男', age:33, phone:'177****7070', startTime:'2026-08-20 09:55:20', status:'valid', duration:'03:01', intent:'B', intentScore:77, qaScore:90, transferred:false, recording:'available', city:'杭州', occupation:'海康威视算法架构师' },
  { id:'CL20260820-020', task:'体制内公务员专场-华东', leadName:'潘文静', gender:'女', age:27, phone:'176****8080', startTime:'2026-08-20 09:42:08', status:'no_answer', duration:'—', intent:'D', intentScore:0, qaScore:null, transferred:false, recording:'none', city:'杭州', occupation:'省人社厅科员' }
];

// ── Status Maps ────────────────────────────────────────────
const STATUS_MAP = {
  valid:       { label:'有效通话', color:'emerald' },
  no_answer:   { label:'未接通',   color:'muted' },
  busy:        { label:'忙线',     color:'muted' },
  rejected:    { label:'拒接',     color:'amber' },
  failed:      { label:'失败',     color:'rose' },
  transferred: { label:'已转人工', color:'violet' },
  unsubscribed:{ label:'退订',     color:'rose' }
};

function getStatusStyle(color) {
  const map = {
    emerald: { bg:'var(--emerald-50)', text:'var(--emerald-700)', dot:'var(--emerald-500)' },
    brand:   { bg:'var(--brand-50)',   text:'var(--brand-700)',   dot:'var(--brand-500)' },
    violet:  { bg:'var(--violet-50)',  text:'var(--violet-700)',  dot:'var(--violet-500)' },
    amber:   { bg:'var(--amber-50)',   text:'var(--amber-700)',   dot:'var(--amber-500)' },
    rose:    { bg:'var(--rose-50)',    text:'var(--rose-700)',    dot:'var(--rose-500)' },
    muted:   { bg:'var(--ink-100)',    text:'var(--text-muted)',  dot:'var(--ink-400)' }
  };
  return map[color] || map.muted;
}

function getIntentStyle(grade) {
  const map = {
    S: { bg:'var(--rose-50)',    text:'var(--rose-700)',    bar:'var(--rose-500)' },
    A: { bg:'var(--brand-50)',   text:'var(--brand-700)',   bar:'var(--brand-500)' },
    B: { bg:'var(--emerald-50)', text:'var(--emerald-700)', bar:'var(--emerald-500)' },
    C: { bg:'var(--amber-50)',   text:'var(--amber-700)',   bar:'var(--amber-500)' },
    D: { bg:'var(--ink-100)',    text:'var(--text-muted)',  bar:'var(--ink-400)' }
  };
  return map[grade] || map.D;
}

function getQAScoreColor(score) {
  if (score >= 95) return 'var(--emerald-600)';
  if (score >= 85) return 'var(--brand-600)';
  if (score >= 70) return 'var(--amber-600)';
  return 'var(--rose-600)';
}

// ── View Object ────────────────────────────────────────────
const CallsView = {
  currentPage: 1,
  pageSize: 20,

  render() {
    return renderCallsView();
  }
};

// ── 筛选状态 (全部真实联动) ──
let callFilterTask = 'ALL';
let callFilterStatus = 'ALL';
let callFilterIntent = 'ALL';
let callFilterQA = 'ALL';
let callFilterTransfer = 'ALL';
let callFilterRecording = 'ALL';

function applyCallFilters(data) {
  let rows = data;
  if (callFilterTask !== 'ALL') rows = rows.filter(c => c.task === callFilterTask);
  if (callFilterStatus !== 'ALL') rows = rows.filter(c => c.status === callFilterStatus);
  if (callFilterIntent !== 'ALL') rows = rows.filter(c => (c.intent || 'D') === callFilterIntent);
  if (callFilterTransfer !== 'ALL') rows = rows.filter(c => (c.transferred ? 'yes' : 'no') === callFilterTransfer);
  if (callFilterRecording !== 'ALL') rows = rows.filter(c => (c.recording || 'none') === callFilterRecording);
  if (callFilterQA !== 'ALL') {
    rows = rows.filter(c => {
      if (callFilterQA === 'recheck') return !!c.qaReview;
      if (c.qaScore == null) return false;
      if (callFilterQA === 'safe') return c.qaScore >= 85 && !c.qaReview;
      if (callFilterQA === 'low') return c.qaScore >= 70 && c.qaScore < 85;
      return c.qaScore < 70;
    });
  }
  return rows;
}

function setCallFilter(kind, val) {
  const map = {
    task: () => callFilterTask = val, status: () => callFilterStatus = val,
    intent: () => callFilterIntent = val, qa: () => callFilterQA = val,
    transfer: () => callFilterTransfer = val, recording: () => callFilterRecording = val
  };
  if (map[kind]) map[kind]();
  App.refreshCurrentView();
}

function renderCallsView() {
  const data = applyCallFilters(CALLS_DATA);
  const total = data.length;
  const validCount = data.filter(c => c.status === 'valid').length;
  const validDurations = data.filter(c => c.duration !== '—').map(c => {
    const parts = c.duration.split(':');
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  });
  const avgDuration = validDurations.length > 0
    ? Math.round(validDurations.reduce((a,b) => a+b, 0) / validDurations.length)
    : 0;
  const avgMin = Math.floor(avgDuration / 60);
  const avgSec = avgDuration % 60;
  const scoredIntents = data.filter(c => c.intentScore > 0);
  const avgIntent = scoredIntents.length > 0
    ? Math.round(scoredIntents.reduce((a,b) => a+b.intentScore, 0) / scoredIntents.length)
    : 0;
  const connectRate = total > 0 ? Math.round(validCount / total * 100) : 0;

  return `
    <div class="view-fade-enter">

      <!-- Page Header -->
      <div class="page-header">
        <div class="page-title-group">
          <div class="page-title">
            <i data-lucide="phone-call"></i>
            通话记录中心
            <span class="badge badge-neutral" style="font-size:10px;line-height:16px;margin-left:6px;">模拟数据</span>
          </div>
          <div class="page-subtitle">全量通话台账 · 录音转写 · AI结果 · 流程轨迹 · 质检复核</div>
        </div>
        <div class="page-actions">
          <button class="btn btn-outline btn-sm" onclick="exportCallsData()">
            <i data-lucide="download"></i>
            导出
          </button>
          <button class="btn btn-primary btn-sm" onclick="App.showToast('高级筛选面板演示中','info')">
            <i data-lucide="sliders-horizontal"></i>
            高级筛选
          </button>
        </div>
      </div>

      <!-- KPI Row -->
      <div class="metrics-grid" style="grid-template-columns:repeat(4,1fr);">
        <div class="metric-card">
          <div class="metric-top-row">
            <span class="metric-label">今日总通话</span>
            <div class="metric-icon-box accent-blue"><i data-lucide="phone-call"></i></div>
          </div>
          <div class="metric-value-row">
            <span class="metric-number">${total}</span>
            <span class="metric-unit">通</span>
          </div>
          <div style="font-size:10.5px;color:var(--text-muted);margin-top:2px;font-variant-numeric:tabular-nums;">有效 ${validCount} · 未通 ${total - validCount}</div>
        </div>
        <div class="metric-card">
          <div class="metric-top-row">
            <span class="metric-label">有效接通率</span>
            <div class="metric-icon-box accent-emerald"><i data-lucide="phone-incoming"></i></div>
          </div>
          <div class="metric-value-row">
            <span class="metric-number" style="color:var(--emerald-600);">${connectRate}</span>
            <span class="metric-unit">%</span>
          </div>
          <div style="font-size:10.5px;color:var(--emerald-600);margin-top:2px;">↑ 较昨日 +3.2%</div>
        </div>
        <div class="metric-card">
          <div class="metric-top-row">
            <span class="metric-label">平均时长</span>
            <div class="metric-icon-box accent-violet"><i data-lucide="timer"></i></div>
          </div>
          <div class="metric-value-row">
            <span class="metric-number" style="color:var(--violet-600);font-variant-numeric:tabular-nums;">${String(avgMin).padStart(2,'0')}:${String(avgSec).padStart(2,'0')}</span>
          </div>
          <div style="font-size:10.5px;color:var(--text-muted);margin-top:2px;">有效通话均值</div>
        </div>
        <div class="metric-card">
          <div class="metric-top-row">
            <span class="metric-label">平均意向分</span>
            <div class="metric-icon-box accent-rose"><i data-lucide="star"></i></div>
          </div>
          <div class="metric-value-row">
            <span class="metric-number" style="color:var(--rose-600);">${avgIntent}</span>
            <span class="metric-unit">分</span>
          </div>
          <div style="font-size:10.5px;color:var(--text-muted);margin-top:2px;">S/A级占比 ${Math.round(scoredIntents.filter(c=>c.intentGrade==='S'||c.intent==='A'||c.intentScore>=85).length / Math.max(scoredIntents.length,1) * 100)}%</div>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="filter-bar">
        <div style="position:relative;min-width:200px;max-width:240px;">
          <i data-lucide="calendar" style="position:absolute;left:8px;top:50%;transform:translateY(-50%);width:12px;height:12px;color:var(--text-muted);"></i>
          <input type="text" class="form-input" readonly
            style="width:100%;height:30px;line-height:30px;padding:0 10px 0 26px;font-size:12px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;cursor:pointer;"
            value="2026-08-19 ~ 2026-08-20"
            onclick="App.showToast('日期选择器演示','info')">
        </div>

        <select class="form-select" style="height:30px;padding:0 24px 0 8px;font-size:12px;min-width:140px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;" onchange="setCallFilter('task', this.value)">
          <option value="ALL" ${callFilterTask==='ALL'?'selected':''}>全部外呼任务</option>
          ${[...new Set(CALLS_DATA.map(c => c.task))].map(t => `<option value="${t}" ${callFilterTask===t?'selected':''}>${t}</option>`).join('')}
        </select>

        <select class="form-select" style="height:30px;padding:0 24px 0 8px;font-size:12px;min-width:100px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;" onchange="setCallFilter('status', this.value)">
          <option value="ALL" ${callFilterStatus==='ALL'?'selected':''}>全部状态</option>
          <option value="valid" ${callFilterStatus==='valid'?'selected':''}>有效通话</option>
          <option value="no_answer" ${callFilterStatus==='no_answer'?'selected':''}>未接通</option>
          <option value="busy" ${callFilterStatus==='busy'?'selected':''}>忙线</option>
          <option value="rejected" ${callFilterStatus==='rejected'?'selected':''}>拒接</option>
          <option value="failed" ${callFilterStatus==='failed'?'selected':''}>失败</option>
          <option value="transferred" ${callFilterStatus==='transferred'?'selected':''}>已转人工</option>
          <option value="unsubscribed" ${callFilterStatus==='unsubscribed'?'selected':''}>退订</option>
        </select>

        <select class="form-select" style="height:30px;padding:0 24px 0 8px;font-size:12px;min-width:90px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;" onchange="setCallFilter('intent', this.value)">
          <option value="ALL" ${callFilterIntent==='ALL'?'selected':''}>全部意向</option>
          <option value="S" ${callFilterIntent==='S'?'selected':''}>S级</option>
          <option value="A" ${callFilterIntent==='A'?'selected':''}>A级</option>
          <option value="B" ${callFilterIntent==='B'?'selected':''}>B级</option>
          <option value="C" ${callFilterIntent==='C'?'selected':''}>C级</option>
          <option value="D" ${callFilterIntent==='D'?'selected':''}>D级</option>
        </select>

        <select class="form-select" style="height:30px;padding:0 24px 0 8px;font-size:12px;min-width:100px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;" onchange="setCallFilter('qa', this.value)">
          <option value="ALL" ${callFilterQA==='ALL'?'selected':''}>全部质检</option>
          <option value="safe" ${callFilterQA==='safe'?'selected':''}>无风险</option>
          <option value="low" ${callFilterQA==='low'?'selected':''}>低风险</option>
          <option value="high" ${callFilterQA==='high'?'selected':''}>高风险</option>
          <option value="recheck" ${callFilterQA==='recheck'?'selected':''}>待复核</option>
        </select>

        <select class="form-select" style="height:30px;padding:0 24px 0 8px;font-size:12px;min-width:90px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;" onchange="setCallFilter('transfer', this.value)">
          <option value="ALL" ${callFilterTransfer==='ALL'?'selected':''}>转人工:全部</option>
          <option value="yes" ${callFilterTransfer==='yes'?'selected':''}>是</option>
          <option value="no" ${callFilterTransfer==='no'?'selected':''}>否</option>
        </select>

        <select class="form-select" style="height:30px;padding:0 24px 0 8px;font-size:12px;min-width:100px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;" onchange="setCallFilter('recording', this.value)">
          <option value="ALL" ${callFilterRecording==='ALL'?'selected':''}>录音:全部</option>
          <option value="available" ${callFilterRecording==='available'?'selected':''}>可用</option>
          <option value="processing" ${callFilterRecording==='processing'?'selected':''}>处理中</option>
          <option value="no_permission" ${callFilterRecording==='no_permission'?'selected':''}>无权限</option>
          <option value="expired" ${callFilterRecording==='expired'?'selected':''}>已过期</option>
        </select>

        <div class="filter-divider"></div>

        <div class="filter-actions">
          <span class="filter-count">${total}条</span>
          <button class="btn btn-ghost btn-sm" style="height:28px;font-size:11px;" onclick="resetCallsFilters()">
            <i data-lucide="rotate-ccw" style="width:11px;height:11px;"></i>
            重置
          </button>
        </div>
      </div>

      <!-- Calls Table -->
      <div class="card" style="padding:0;overflow:hidden;">
        <div style="overflow-x:auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width:32px;"><input type="checkbox" style="width:13px;height:13px;cursor:pointer;accent-color:var(--brand-500);" onchange="toggleAllCallRows(this)"></th>
                <th style="width:130px;">通话ID</th>
                <th>任务</th>
                <th style="width:80px;">潜客</th>
                <th style="width:100px;">脱敏号码</th>
                <th style="width:140px;">开始时间</th>
                <th style="width:80px;">状态</th>
                <th style="width:58px;text-align:right;">时长</th>
                <th style="width:68px;">意向</th>
                <th style="width:80px;text-align:right;">质检分</th>
                <th style="width:56px;text-align:center;">转人工</th>
                <th style="width:56px;text-align:center;">录音</th>
                <th style="width:70px;text-align:right;">操作</th>
              </tr>
            </thead>
            <tbody class="stagger-container">
              ${data.map(call => renderCallRow(call)).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;padding:0 2px;">
        <div style="font-size:11px;color:var(--text-muted);font-variant-numeric:tabular-nums;">
          显示 1-${total} 条，共 ${total} 条
        </div>
        ${total > 0 ? `
        <div style="display:flex;gap:3px;">
          <button class="btn btn-outline btn-sm" style="min-width:28px;padding:0 6px;" disabled><i data-lucide="chevron-left" style="width:11px;height:11px;"></i></button>
          <button class="btn btn-primary btn-sm" style="min-width:28px;padding:0 8px;">1</button>
          <button class="btn btn-outline btn-sm" style="min-width:28px;padding:0 6px;" disabled><i data-lucide="chevron-right" style="width:11px;height:11px;"></i></button>
        </div>` : ''}
      </div>
    </div>
  `;
}

function renderCallRow(call) {
  const st = STATUS_MAP[call.status] || STATUS_MAP.valid;
  const stStyle = getStatusStyle(st.color);
  const intStyle = getIntentStyle(call.intent);
  const qaColor = call.qaScore ? getQAScoreColor(call.qaScore) : 'var(--text-muted)';

  return `
    <tr onclick="openCallDetail('${call.id}')" style="cursor:pointer;">
      <td onclick="event.stopPropagation();"><input type="checkbox" class="call-row-check" style="width:13px;height:13px;cursor:pointer;accent-color:var(--brand-500);"></td>
      <td>
        <span style="font-size:11.5px;font-weight:500;color:var(--brand-600);font-variant-numeric:tabular-nums;font-family:var(--font-mono);">${call.id}</span>
      </td>
      <td>
        <div style="font-size:11.5px;color:var(--text-main);max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${call.task}</div>
      </td>
      <td>
        <div style="display:flex;align-items:center;gap:5px;">
          <div class="lead-avatar-bubble ${call.gender==='女'?'female':''}" style="width:22px;height:22px;font-size:10px;flex-shrink:0;">${call.leadName[0]}</div>
          <div style="min-width:0;">
            <div style="font-size:11.5px;font-weight:500;color:var(--text-main);white-space:nowrap;">${call.leadName}</div>
            <div style="font-size:10px;color:var(--text-muted);white-space:nowrap;">${call.gender}·${call.age}岁</div>
          </div>
        </div>
      </td>
      <td>
        <span style="font-size:11.5px;color:var(--text-secondary);font-variant-numeric:tabular-nums;letter-spacing:0.3px;">${call.phone}</span>
      </td>
      <td>
        <span style="font-size:11.5px;color:var(--text-secondary);font-variant-numeric:tabular-nums;">${call.startTime}</span>
      </td>
      <td>
        <span style="display:inline-flex;align-items:center;gap:3px;padding:1px 6px;border-radius:var(--radius-sm);font-size:10.5px;font-weight:500;background:${stStyle.bg};color:${stStyle.text};white-space:nowrap;">
          <span style="width:5px;height:5px;border-radius:50%;background:${stStyle.dot};flex-shrink:0;"></span>
          ${st.label}
        </span>
      </td>
      <td style="text-align:right;">
        <span style="font-size:11.5px;color:var(--text-secondary);font-variant-numeric:tabular-nums;">${call.duration}</span>
      </td>
      <td>
        ${call.intentScore > 0 ? `
          <span style="display:inline-flex;align-items:center;gap:3px;padding:1px 6px;border-radius:var(--radius-sm);font-size:10.5px;font-weight:600;background:${intStyle.bg};color:${intStyle.text};white-space:nowrap;">
            ${call.intent}·${call.intentScore}
          </span>
        ` : `<span style="font-size:11px;color:var(--text-muted);">—</span>`}
      </td>
      <td style="text-align:right;">
        ${call.qaReview ? `
          <span style="display:inline-flex;align-items:center;gap:3px;padding:1px 6px;border-radius:var(--radius-sm);font-size:10px;font-weight:500;background:var(--amber-50);color:var(--amber-700);white-space:nowrap;">
            <i data-lucide="alert-circle" style="width:10px;height:10px;"></i>待复核
          </span>
        ` : call.qaScore ? `
          <span style="font-size:12px;font-weight:600;color:${qaColor};font-variant-numeric:tabular-nums;">${call.qaScore}</span>
        ` : `<span style="font-size:11px;color:var(--text-muted);">—</span>`}
      </td>
      <td style="text-align:center;">
        ${call.transferred
          ? `<i data-lucide="check" style="width:14px;height:14px;color:var(--emerald-500);"></i>`
          : `<span style="color:var(--text-muted);font-size:12px;">—</span>`}
      </td>
      <td style="text-align:center;" onclick="event.stopPropagation();">
        ${call.recording === 'available' ? `
          <button class="btn btn-ghost btn-sm" style="width:26px;height:26px;padding:0;color:var(--brand-600);" onclick="playMockRecording(event,'${call.id}')" title="播放录音">
            <i data-lucide="play" style="width:11px;height:11px;"></i>
          </button>
        ` : call.recording === 'processing' ? `
          <span style="display:inline-flex;align-items:center;gap:3px;font-size:10px;color:var(--amber-600);">
            <i data-lucide="loader-2" class="spin-icon" style="width:12px;height:12px;"></i>处理中
          </span>
        ` : call.recording === 'no_permission' ? `
          <span style="font-size:10px;color:var(--text-muted);" title="无权限">
            <i data-lucide="lock" style="width:12px;height:12px;"></i>
          </span>
        ` : call.recording === 'expired' ? `
          <span style="font-size:10px;color:var(--text-muted);" title="已过期">
            <i data-lucide="archive" style="width:12px;height:12px;"></i>
          </span>
        ` : `<span style="color:var(--text-muted);font-size:12px;">—</span>`}
      </td>
      <td style="text-align:right;" onclick="event.stopPropagation();">
        <div style="display:flex;gap:2px;justify-content:flex-end;">
          <button class="btn btn-ghost btn-sm" style="width:26px;height:26px;padding:0;" onclick="openCallDetail('${call.id}')" title="查看详情">
            <i data-lucide="eye" style="width:11px;height:11px;"></i>
          </button>
          <button class="btn btn-ghost btn-sm" style="width:26px;height:26px;padding:0;" onclick="App.showToast('进入质检复核 · ${call.id}','info')" title="质检">
            <i data-lucide="shield" style="width:11px;height:11px;"></i>
          </button>
        </div>
      </td>
    </tr>
  `;
}

// ── Filter & Export Actions ───────────────────────────────
function resetCallsFilters() {
  callFilterTask = 'ALL'; callFilterStatus = 'ALL'; callFilterIntent = 'ALL';
  callFilterQA = 'ALL'; callFilterTransfer = 'ALL'; callFilterRecording = 'ALL';
  App.showToast('筛选条件已重置', 'info');
  App.refreshCurrentView();
}

function exportCallsData() {
  App.showToast('通话记录导出中...', 'success');
}

function toggleAllCallRows(master) {
  document.querySelectorAll('.call-row-check').forEach(cb => { cb.checked = master.checked; });
}

function playMockRecording(e, callId) {
  e.stopPropagation();
  App.showToast('模拟录音播放功能演示', 'info');
}

// ── Call Detail Drawer ────────────────────────────────────
let _callDrawerActiveTab = 'overview';
let _currentCallId = null;

function openCallDetail(callId) {
  _currentCallId = callId;
  _callDrawerActiveTab = 'overview';
  renderCallDrawer();
}

function closeCallDetail() {
  const container = document.getElementById('call-detail-drawer-container');
  if (container) {
    container.classList.remove('open');
    setTimeout(() => { container.innerHTML = ''; }, 300);
  }
  _currentCallId = null;
}

function switchCallTab(tabName) {
  _callDrawerActiveTab = tabName;
  renderCallDrawer();
}

function renderCallDrawer() {
  const call = CALLS_DATA.find(c => c.id === _currentCallId);
  if (!call) return;

  let container = document.getElementById('call-detail-drawer-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'call-detail-drawer-container';
    container.className = 'drawer-backdrop';
    document.body.appendChild(container);
    container.addEventListener('click', (e) => { if (e.target === container) closeCallDetail(); });
  }

  const tabs = [
    ['overview','user','概览'],
    ['transcript','message-square-text','对话转写'],
    ['ai_result','sparkles','AI结果'],
    ['flow','git-branch','流程轨迹'],
    ['transfer','headphones','转人工'],
    ['qa','shield-check','质检复核'],
    ['timeline','history','时间线']
  ];

  container.innerHTML = `
    <div class="drawer-panel drawer-wide" onclick="event.stopPropagation()">
      <!-- Header -->
      <div style="padding:12px 20px;border-bottom:1px solid var(--border-color);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-shrink:0;">
        <div style="display:flex;align-items:center;gap:8px;min-width:0;flex:1;">
          <button class="btn btn-ghost btn-sm" style="width:28px;height:28px;padding:0;flex-shrink:0;" onclick="closeCallDetail()">
            <i data-lucide="arrow-left" style="width:14px;height:14px;"></i>
          </button>
          <div style="min-width:0;">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
              <span style="font-size:14px;font-weight:700;color:var(--text-main);font-variant-numeric:tabular-nums;font-family:var(--font-mono);">${call.id}</span>
              <span class="badge badge-neutral" style="font-size:9.5px;line-height:15px;">模拟数据</span>
            </div>
            <div style="font-size:10.5px;color:var(--text-muted);margin-top:1px;">${call.leadName} · ${call.phone} · ${call.startTime}</div>
          </div>
        </div>
        <div style="display:flex;gap:4px;flex-shrink:0;">
          <button class="btn btn-outline btn-sm" style="height:28px;font-size:11px;" onclick="actionWecom('${call.id}')">
            <i data-lucide="user-plus" style="width:11px;height:11px;"></i>加微
          </button>
          <button class="btn btn-outline btn-sm" style="height:28px;font-size:11px;" onclick="actionTransfer('${call.id}')">
            <i data-lucide="heart-handshake" style="width:11px;height:11px;"></i>转红娘
          </button>
          <button class="btn btn-ghost btn-sm" style="width:28px;height:28px;padding:0;" onclick="actionOptOut('${call.id}')" title="标记退订">
            <i data-lucide="bell-off" style="width:13px;height:13px;color:var(--rose-500);"></i>
          </button>
          <button class="btn btn-ghost btn-sm" style="width:28px;height:28px;padding:0;" onclick="closeCallDetail()">
            <i data-lucide="x" style="width:14px;height:14px;"></i>
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div style="display:flex;gap:0;padding:0 12px;border-bottom:1px solid var(--border-color);background:var(--bg-card);flex-shrink:0;overflow-x:auto;">
        ${tabs.map(([id,icon,label]) => `
          <button onclick="switchCallTab('${id}')" style="padding:9px 12px;font-size:11px;font-weight:${_callDrawerActiveTab===id?'600':'400'};color:${_callDrawerActiveTab===id?'var(--brand-600)':'var(--text-muted)'};border:none;background:transparent;border-bottom:2px solid ${_callDrawerActiveTab===id?'var(--brand-500)':'transparent'};cursor:pointer;display:inline-flex;align-items:center;gap:4px;transition:all 0.15s;white-space:nowrap;flex-shrink:0;">
            <i data-lucide="${icon}" style="width:11px;height:11px;"></i>${label}
          </button>
        `).join('')}
      </div>

      <!-- Tab Body -->
      <div style="padding:14px 20px;overflow-y:auto;flex:1;">
        ${renderCallTabContent(call, _callDrawerActiveTab)}
      </div>
    </div>
  `;

  setTimeout(() => {
    container.classList.add('open');
    if (window.lucide) lucide.createIcons();
  }, 10);
}

function renderCallTabContent(call, tab) {
  switch(tab) {
    case 'overview':    return renderCallOverviewTab(call);
    case 'transcript':  return renderCallTranscriptTab(call);
    case 'ai_result':   return renderCallAIResultTab(call);
    case 'flow':        return renderCallFlowTab(call);
    case 'transfer':    return renderCallTransferTab(call);
    case 'qa':          return renderCallQATab(call);
    case 'timeline':    return renderCallTimelineTab(call);
    default:            return renderCallOverviewTab(call);
  }
}

// ── Tab: 概览 ──────────────────────────────────────────────
function renderCallOverviewTab(call) {
  const st = STATUS_MAP[call.status];
  const stStyle = getStatusStyle(st.color);
  return `
    <div style="display:flex;flex-direction:column;gap:12px;">
      <!-- Customer Info -->
      <div class="card" style="padding:12px 14px;">
        <div style="font-size:11px;font-weight:700;color:var(--text-main);margin-bottom:10px;display:flex;align-items:center;gap:5px;">
          <i data-lucide="user" style="width:12px;height:12px;color:var(--brand-500);"></i>客户信息
        </div>
        <div style="display:flex;gap:12px;align-items:flex-start;">
          <div class="lead-avatar-bubble ${call.gender==='女'?'female':''}" style="width:44px;height:44px;font-size:16px;flex-shrink:0;">${call.leadName[0]}</div>
          <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:6px;">
              <span style="font-size:13px;font-weight:700;color:var(--text-main);">${call.leadName}</span>
              <span style="font-size:10.5px;color:var(--text-muted);">${call.gender} · ${call.age}岁</span>
              <span style="display:inline-flex;align-items:center;gap:3px;padding:1px 6px;border-radius:var(--radius-sm);font-size:10px;font-weight:500;background:${stStyle.bg};color:${stStyle.text};">
                <span style="width:4px;height:4px;border-radius:50%;background:${stStyle.dot};"></span>${st.label}
              </span>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 12px;font-size:11.5px;">
              <div style="display:flex;gap:6px;"><span style="color:var(--text-muted);width:50px;flex-shrink:0;">手机号</span><span style="color:var(--text-main);font-variant-numeric:tabular-nums;">${call.phone}</span></div>
              <div style="display:flex;gap:6px;"><span style="color:var(--text-muted);width:50px;flex-shrink:0;">所在城市</span><span style="color:var(--text-main);">${call.city}</span></div>
              <div style="display:flex;gap:6px;grid-column:1/-1;"><span style="color:var(--text-muted);width:50px;flex-shrink:0;">职业</span><span style="color:var(--text-main);">${call.occupation}</span></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Call Info -->
      <div class="card" style="padding:12px 14px;">
        <div style="font-size:11px;font-weight:700;color:var(--text-main);margin-bottom:10px;display:flex;align-items:center;gap:5px;">
          <i data-lucide="phone" style="width:12px;height:12px;color:var(--violet-500);"></i>通话信息
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0;font-size:11.5px;">
          ${[
            ['所属任务', call.task],
            ['AI机器人', '知性红娘-婉清 v3.2'],
            ['线路', fuzzLine(call.id)],
            ['开始时间', call.startTime],
            ['结束时间', fuzzEndTime(call.startTime, call.duration)],
            ['通话时长', call.duration],
            ['挂断方', call.status==='valid'?'客户主动':call.status==='rejected'?'客户拒接':call.status==='failed'?'系统异常':call.status==='transferred'?'转人工坐席':'—'],
            ['预估费用', call.duration!=='—'?`¥${(parseInt(call.duration.split(':')[0])*0.12+0.1).toFixed(2)}`:'¥0.00']
          ].map(([k,v]) => `
            <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border-subtle);gap:8px;">
              <span style="color:var(--text-muted);flex-shrink:0;">${k}</span>
              <span style="color:var(--text-main);font-weight:500;text-align:right;font-variant-numeric:tabular-nums;">${v}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card" style="padding:12px 14px;">
        <div style="font-size:11px;font-weight:700;color:var(--text-main);margin-bottom:8px;display:flex;align-items:center;gap:5px;">
          <i data-lucide="zap" style="width:12px;height:12px;color:var(--amber-500);"></i>快捷操作
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          <button class="btn btn-primary btn-sm" style="height:30px;font-size:11px;" onclick="actionWecom('${call.id}')">
            <i data-lucide="user-plus" style="width:11px;height:11px;"></i>加企微
          </button>
          <button class="btn btn-outline btn-sm" style="height:30px;font-size:11px;" onclick="actionTransfer('${call.id}')">
            <i data-lucide="heart-handshake" style="width:11px;height:11px;"></i>转红娘跟进
          </button>
          <button class="btn btn-outline btn-sm" style="height:30px;font-size:11px;" onclick="switchCallTab('qa')">
            <i data-lucide="shield-check" style="width:11px;height:11px;"></i>质检复核
          </button>
          <button class="btn btn-outline btn-sm" style="height:30px;font-size:11px;" onclick="actionOptOut('${call.id}')">
            <i data-lucide="ban" style="width:11px;height:11px;"></i>标记退订
          </button>
          <button class="btn btn-outline btn-sm" style="height:30px;font-size:11px;" onclick="App.showToast('正在下载录音文件...','info')">
            <i data-lucide="download" style="width:11px;height:11px;"></i>下载录音
          </button>
        </div>
      </div>
    </div>
  `;
}

// ── Tab: 对话转写 ──────────────────────────────────────────
function renderCallTranscriptTab(call) {
  if (call.duration === '—') {
    return `
      <div style="padding:40px;text-align:center;color:var(--text-muted);">
        <i data-lucide="phone-off" style="width:32px;height:32px;margin:0 auto 8px;opacity:0.3;"></i>
        <div style="font-size:12px;">该通话未接通，无对话转写内容</div>
      </div>
    `;
  }
  const messages = getMockTranscript(call);
  return `
    <div style="display:flex;flex-direction:column;gap:10px;">
      <!-- Mock Recording Bar -->
      <div onclick="App.showToast('模拟录音播放功能演示','info')" style="cursor:pointer;display:flex;align-items:center;gap:10px;padding:10px 12px;background:linear-gradient(135deg,var(--brand-50),var(--violet-50));border:1px solid var(--brand-100);border-radius:var(--radius-md);">
        <button class="btn btn-primary btn-sm" style="width:30px;height:30px;padding:0;border-radius:50%;flex-shrink:0;" onclick="event.stopPropagation();App.showToast('模拟录音播放功能演示','info')">
          <i data-lucide="play" style="width:12px;height:12px;"></i>
        </button>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
            <span style="font-size:11px;font-weight:600;color:var(--brand-700);">模拟录音 · 点击播放</span>
            <span style="font-size:9.5px;color:var(--text-muted);">ASR 识别率 98.2%</span>
          </div>
          <div style="height:3px;background:var(--brand-100);border-radius:2px;overflow:hidden;">
            <div style="width:32%;height:100%;background:var(--brand-500);border-radius:2px;"></div>
          </div>
        </div>
        <span style="font-size:10.5px;color:var(--text-muted);font-variant-numeric:tabular-nums;flex-shrink:0;">01:12 / ${call.duration}</span>
      </div>

      <!-- Transcript -->
      <div style="display:flex;flex-direction:column;gap:5px;">
        ${messages.map(m => {
          const isAI = m.role === 'ai';
          return `
            <div style="display:flex;gap:7px;align-items:flex-start;${isAI?'':'flex-direction:row-reverse;'}">
              <div style="width:24px;height:24px;border-radius:50%;background:${isAI?'linear-gradient(135deg,var(--brand-500),var(--violet-500))':'var(--ink-200)'};color:${isAI?'#fff':'var(--text-main)'};display:flex;align-items:center;justify-content:center;font-size:9px;flex-shrink:0;font-weight:600;">${isAI?'AI':call.leadName[0]}</div>
              <div style="max-width:75%;${isAI?'':'align-items:flex-end;'}">
                <div style="display:flex;align-items:center;gap:4px;margin-bottom:3px;${isAI?'':'justify-content:flex-end;'}">
                  <span style="font-size:10px;font-weight:600;color:${isAI?'var(--brand-600)':'var(--emerald-600)'};">${isAI?'AI红娘':call.leadName}</span>
                  ${m.tag ? `<span style="font-size:9px;padding:0 4px;line-height:14px;border-radius:3px;background:${isAI?'var(--brand-100)':'var(--emerald-100)'};color:${isAI?'var(--brand-700)':'var(--emerald-700)'};">${m.tag}</span>`:''}
                  ${m.emotion ? `<span style="font-size:9px;color:var(--text-muted);">· ${m.emotion}</span>`:''}
                </div>
                <div style="padding:7px 10px;border-radius:var(--radius-md);background:${isAI?'var(--brand-50)':'var(--ink-50)'};font-size:11.5px;color:var(--text-main);line-height:1.6;${isAI?'':'background:var(--emerald-50);'}">
                  ${highlightKeywords(m.text)}
                </div>
                <div style="font-size:9.5px;color:var(--text-muted);margin-top:2px;font-variant-numeric:tabular-nums;${isAI?'':'text-align:right;'}">${m.time}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function highlightKeywords(text) {
  const keywords = ['加微信','企微','资料','红娘','高学历','有房','照片','见面','周末','考虑一下','不需要','没时间'];
  let result = text;
  keywords.forEach(kw => {
    result = result.replace(new RegExp(kw, 'g'), `<span style="background:var(--amber-100);color:var(--amber-700);padding:0 2px;border-radius:2px;font-weight:500;">${kw}</span>`);
  });
  return result;
}

function getMockTranscript(call) {
  // Deterministic by call id
  const baseMsgs = [
    { role:'ai', time:'00:02', text:'您好！我是知缘婚恋的资深红娘助理。看到您之前登记的信息，今天特意给您同步一个好消息~', tag:'标准开场', emotion:'热情' },
    { role:'user', time:'00:09', text:'哦，你们是相亲平台吧？我平时工作挺忙的，周末经常加班，可能没时间。', tag:'异议表达', emotion:'犹豫' },
    { role:'ai', time:'00:17', text:'特别理解您！很多优秀的朋友都是因为工作忙才剩下的，所以我们专门做1对1精准前置匹配，不用您盲目社交。我们库里正好有一位和您条件非常匹配的对象。', tag:'化解+抛诱饵', emotion:'真诚' },
    { role:'user', time:'00:35', text:'是吗？什么条件啊？多大了，做什么工作的？', tag:'意向升温', emotion:'兴趣' },
    { role:'ai', time:'00:42', text:'姑娘是96年的，名校硕士毕业，性格特别温和，和您是同乡。我让专属红娘老师通过企微把脱敏资料和照片发您过目，您看可以吗？', tag:'企微铺垫', emotion:'期待' },
    { role:'user', time:'00:58', text:'行吧，那你让她加我微信吧，微信号就是这个手机号。', tag:'明确同意', emotion:'认可' },
    { role:'ai', time:'01:05', text:'好的！微信申请马上发出，稍后红娘老师会和您详细沟通，祝您生活愉快，再见！', tag:'礼貌收尾', emotion:'满意' }
  ];
  return baseMsgs;
}

// ── Tab: AI结果 ────────────────────────────────────────────
function renderCallAIResultTab(call) {
  const score = call.intentScore || 0;
  const sentimentScore = score > 80 ? 78 : score > 60 ? 62 : score > 30 ? 45 : 25;
  const sentimentLabel = sentimentScore >= 70 ? '积极' : sentimentScore >= 50 ? '中性偏正' : sentimentScore >= 30 ? '中性' : '消极';
  const sentimentColor = sentimentScore >= 70 ? 'var(--emerald-500)' : sentimentScore >= 50 ? 'var(--brand-500)' : sentimentScore >= 30 ? 'var(--amber-500)' : 'var(--rose-500)';
  const deg = Math.round(sentimentScore / 100 * 360);

  return `
    <div style="display:flex;flex-direction:column;gap:12px;">
      <!-- Summary -->
      <div style="background:linear-gradient(135deg,var(--brand-50),var(--violet-50));border:1px solid var(--brand-100);border-radius:var(--radius-md);padding:10px 12px;">
        <div style="display:flex;align-items:center;gap:4px;font-size:10.5px;font-weight:600;color:var(--brand-600);margin-bottom:4px;">
          <i data-lucide="sparkles" style="width:12px;height:12px;"></i>AI通话摘要
        </div>
        <div style="font-size:11.5px;color:var(--text-secondary);line-height:1.6;">
          ${score >= 85
            ? '客户为高知IT从业者，对平台推荐的高学历匹配对象表现出强烈兴趣，主动询问对方条件，明确同意添加企业微信进一步了解。沟通氛围良好，意向度极高，建议红娘24小时内跟进并推送匹配资料。'
            : score >= 70
            ? '客户有一定择偶需求，对推荐对象表示可以了解，但态度较为谨慎，同意添加微信后再看资料。建议红娘持续跟进，发送优质对象资料提升转化率。'
            : score >= 50
            ? '客户态度中性，以工作忙为理由略有推脱，但未明确拒绝。建议短期内不重复外呼，一周后再次触达，搭配不同话术策略。'
            : '客户明确表示暂无需求或拒绝沟通，建议标记退订或进入30天冷置期。'}
        </div>
      </div>

      <!-- Score Row -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <!-- Intent Score -->
        <div class="card" style="padding:12px 14px;text-align:center;">
          <div style="font-size:10.5px;color:var(--text-muted);margin-bottom:6px;">意向评分</div>
          <div style="font-size:36px;font-weight:800;background:linear-gradient(135deg,var(--brand-500),var(--violet-500));-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-variant-numeric:tabular-nums;line-height:1;">${call.intent||'—'} · ${score||'—'}</div>
          <div style="font-size:10px;color:var(--text-muted);margin-top:4px;">${score>=95?'极高意向·立即跟进':score>=85?'高意向·24h内跟进':score>=70?'中意向·持续培育':score>=50?'低意向·观察':'无意向·冷置'}</div>
        </div>
        <!-- Sentiment Gauge -->
        <div class="card" style="padding:12px 14px;display:flex;align-items:center;gap:10px;">
          <div style="width:64px;height:64px;border-radius:50%;background:conic-gradient(${sentimentColor} 0deg ${deg}deg, var(--ink-100) ${deg}deg 360deg);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <div style="width:48px;height:48px;border-radius:50%;background:var(--bg-card);display:flex;align-items:center;justify-content:center;flex-direction:column;">
              <span style="font-size:15px;font-weight:700;color:${sentimentColor};line-height:1;">${sentimentScore}</span>
              <span style="font-size:7.5px;color:var(--text-muted);">${sentimentLabel}</span>
            </div>
          </div>
          <div style="flex:1;font-size:11px;color:var(--text-secondary);line-height:1.5;">
            <div style="color:${sentimentColor};font-weight:500;margin-bottom:2px;">${sentimentLabel}</div>
            ${score>=80?'客户情绪积极，对话参与度高，多次主动提问':'客户情绪平稳，回答简短礼貌，未表现出排斥'}
          </div>
        </div>
      </div>

      <!-- Structured Fields -->
      <div class="card" style="padding:12px 14px;">
        <div style="font-size:11px;font-weight:700;color:var(--text-main);margin-bottom:8px;display:flex;align-items:center;gap:5px;">
          <i data-lucide="file-text" style="width:12px;height:12px;color:var(--emerald-500);"></i>结构化字段提取
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0;font-size:11.5px;">
          ${[
            ['年龄', `${call.age}岁`],
            ['所在城市', call.city],
            ['学历', fuzzEdu(call.id)],
            ['年收入', fuzzIncome(call.id)],
            ['房车情况', '有房有车' ],
            ['择偶年龄', fuzzMateAge(call.gender, call.age)],
            ['择偶学历', '本科及以上'],
            ['择偶职业', '体制内/教师/医生优先']
          ].map(([k,v]) => `
            <div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--border-subtle);gap:8px;">
              <span style="color:var(--text-muted);flex-shrink:0;">${k}</span>
              <span style="color:var(--text-main);font-weight:500;text-align:right;">${v}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Hit Rules -->
      <div class="card" style="padding:12px 14px;">
        <div style="font-size:11px;font-weight:700;color:var(--text-main);margin-bottom:8px;display:flex;align-items:center;gap:5px;">
          <i data-lucide="target" style="width:12px;height:12px;color:var(--rose-500);"></i>命中规则
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;font-size:11px;">
          ${(score>=85?[
            {c:'emerald',t:'高意向客户自动流转规则',d:'意向分≥85 自动推送红娘池'},
            {c:'emerald',t:'企微添加成功触发规则',d:'客户口头同意 → 自动发送好友申请'},
            {c:'brand',t:'S级客户24h响应SLA',d:'触发红娘1v1优先分配'}
          ]:score>=70?[
            {c:'brand',t:'中意向客户培育规则',d:'进入7天自动培育序列'},
            {c:'emerald',t:'企微添加成功触发规则',d:'客户同意添加微信'}
          ]:score>=50?[
            {c:'amber',t:'低意向冷置规则',d:'7天内不重复触达'},
            {c:'violet',t:'异议话术触发',d:'以工作忙为由推脱'}
          ]:[
            {c:'rose',t:'退订/拒接标记规则',d:'标记无意向，进入冷置'},
            {c:'amber',t:'频控保护规则',d:'30天内不再次外呼'}
          ]).map(r => `
            <div style="display:flex;align-items:center;gap:6px;padding:5px 8px;background:var(--ink-50);border-radius:var(--radius-sm);border-left:3px solid var(--${r.c}-500);">
              <i data-lucide="check-circle-2" style="width:11px;height:11px;color:var(--${r.c}-600);flex-shrink:0;"></i>
              <span style="flex:1;color:var(--text-main);font-weight:500;">${r.t}</span>
              <span style="font-size:10px;color:var(--text-muted);">${r.d}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Next Step Suggestion -->
      <div class="card" style="padding:12px 14px;background:var(--amber-50);border:1px solid var(--amber-100);">
        <div style="font-size:11px;font-weight:700;color:var(--amber-700);margin-bottom:6px;display:flex;align-items:center;gap:5px;">
          <i data-lucide="lightbulb" style="width:12px;height:12px;"></i>建议下一步
        </div>
        <div style="font-size:11.5px;color:var(--amber-800);line-height:1.6;">
          ${score>=85
            ? '1. 立即分配至金牌红娘跟进，确保2小时内通过企微首次联系；<br>2. 准备3-5份高质量匹配对象资料供客户选择；<br>3. 预约本周内线下面谈或视频连线。'
            : score>=70
            ? '1. 红娘48小时内企微跟进，发送匹配对象资料；<br>2. 持续培育7天，根据互动情况决定是否升级S级；<br>3. 注意避免过度推销引起反感。'
            : '1. 进入自动化培育序列，定期推送优质内容；<br>2. 2-4周后再次外呼，使用不同话术策略；<br>3. 若再次拒绝则标记冷置。'}
        </div>
      </div>
    </div>
  `;
}

// ── Tab: 流程轨迹 ─────────────────────────────────────────
function renderCallFlowTab(call) {
  const nodes = [
    { icon:'play', label:'开场问候', time:'00:00', dur:'2s', status:'done', color:'emerald' },
    { icon:'volume-2', label:'身份播报', time:'00:02', dur:'5s', status:'done', color:'emerald' },
    { icon:'messages-square', label:'需求问答', time:'00:09', dur:'26s', status:'done', color:'emerald' },
    { icon:'git-branch', label:'条件分支:异议处理', time:'00:17', dur:'18s', status:'done', color:'brand' },
    { icon:'target', label:'意图识别:高意向', time:'00:35', dur:'3s', status:'done', color:'violet' },
    { icon:'key-round', label:'字段提取:年龄/学历/择偶', time:'00:42', dur:'16s', status:'done', color:'emerald' },
    { icon:'book-open', label:'知识库检索:匹配推荐', time:'00:48', dur:'10s', status:'done', color:'brand' },
    { icon:'user-plus', label:'企微引导', time:'00:58', dur:'7s', status:'done', color:'emerald' },
    { icon:'phone-call', label: call.transferred?'转人工坐席':'正常收尾', time:call.duration==='—'?'—':call.duration, dur:'—', status:call.status==='failed'?'error':'done', color:call.status==='failed'?'rose':call.transferred?'violet':'emerald' },
    { icon:'phone-off', label:'挂机结束', time:call.duration==='—'?'00:08':call.duration, dur:'—', status:'done', color:'muted' }
  ];
  if (call.duration === '—') {
    return `
      <div style="padding:40px;text-align:center;color:var(--text-muted);">
        <i data-lucide="phone-off" style="width:32px;height:32px;margin:0 auto 8px;opacity:0.3;"></i>
        <div style="font-size:12px;">通话未接通，流程轨迹不可用</div>
      </div>
    `;
  }
  return `
    <div style="padding:4px 0;">
      <div style="position:relative;padding-left:24px;">
        <div style="position:absolute;left:9px;top:8px;bottom:8px;width:2px;background:var(--border-color);"></div>
        ${nodes.map((n, i) => {
          const c = getStatusStyle(n.color);
          const isLast = i === nodes.length - 1;
          return `
            <div style="position:relative;padding-bottom:${isLast?'0':'14px'};">
              <div style="position:absolute;left:-24px;top:2px;width:20px;height:20px;border-radius:50%;background:${c.bg};border:2px solid ${c.dot};display:flex;align-items:center;justify-content:center;z-index:1;">
                <i data-lucide="${n.icon}" style="width:9px;height:9px;color:${c.text};"></i>
              </div>
              <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                <span style="font-size:11.5px;font-weight:600;color:var(--text-main);">${n.label}</span>
                <span style="font-size:10px;color:var(--text-muted);font-variant-numeric:tabular-nums;">${n.time}</span>
                ${n.dur!=='—'?`<span style="font-size:9.5px;padding:0 4px;line-height:14px;border-radius:3px;background:var(--ink-100);color:var(--text-muted);font-variant-numeric:tabular-nums;">耗时 ${n.dur}</span>`:''}
                ${n.status==='error'?`<span style="font-size:9.5px;padding:0 4px;line-height:14px;border-radius:3px;background:var(--rose-50);color:var(--rose-700);">异常</span>`:''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// ── Tab: 转人工 ────────────────────────────────────────────
function renderCallTransferTab(call) {
  if (!call.transferred) {
    return `
      <div style="padding:40px;text-align:center;color:var(--text-muted);">
        <i data-lucide="headphones" style="width:32px;height:32px;margin:0 auto 8px;opacity:0.3;"></i>
        <div style="font-size:12px;">该通话未触发转人工流程</div>
        <div style="font-size:10.5px;color:var(--text-muted);margin-top:4px;">AI独立完成全程对话</div>
      </div>
    `;
  }
  return `
    <div style="display:flex;flex-direction:column;gap:12px;">
      <div class="card" style="padding:12px 14px;">
        <div style="font-size:11px;font-weight:700;color:var(--text-main);margin-bottom:10px;display:flex;align-items:center;gap:5px;">
          <i data-lucide="arrow-right-left" style="width:12px;height:12px;color:var(--violet-500);"></i>转接详情
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0;font-size:11.5px;">
          ${[
            ['转接时间', call.startTime.replace(/:\d{2}$/, ':42')],
            ['排队队列', '高意向VIP队列'],
            ['排队等待', '12秒'],
            ['接听坐席', fuzzAgentName(call.id)],
            ['坐席工号', 'A' + (1000 + hashStr(call.id) % 200)],
            ['通话时长', '2分35秒'],
            ['摘要传递', '<span style="color:var(--emerald-600);font-weight:600;">✓ 已传递</span>'],
            ['接待结果', '<span style="color:var(--emerald-600);font-weight:600;">已接待</span>']
          ].map(([k,v]) => `
            <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border-subtle);gap:8px;">
              <span style="color:var(--text-muted);flex-shrink:0;">${k}</span>
              <span style="color:var(--text-main);font-weight:500;text-align:right;">${v}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Transfer Reason -->
      <div class="card" style="padding:12px 14px;">
        <div style="font-size:11px;font-weight:700;color:var(--text-main);margin-bottom:8px;display:flex;align-items:center;gap:5px;">
          <i data-lucide="alert-circle" style="width:12px;height:12px;color:var(--amber-500);"></i>转接原因
        </div>
        <div style="padding:8px 10px;background:var(--amber-50);border-radius:var(--radius-sm);font-size:11.5px;color:var(--amber-800);line-height:1.6;">
          <strong>AI触发转人工条件：</strong>客户主动询问"你们线下门店在哪里？能不能当面聊聊？"，识别为高意向线下约见意图，自动转接至VIP红娘坐席进行深度沟通和门店邀约。
        </div>
      </div>

      <!-- Agent Notes -->
      <div class="card" style="padding:12px 14px;">
        <div style="font-size:11px;font-weight:700;color:var(--text-main);margin-bottom:8px;display:flex;align-items:center;gap:5px;">
          <i data-lucide="file-edit" style="width:12px;height:12px;color:var(--brand-500);"></i>坐席跟进记录
        </div>
        <div style="padding:8px 10px;background:var(--ink-50);border-radius:var(--radius-sm);font-size:11.5px;color:var(--text-secondary);line-height:1.6;">
          客户态度非常好，明确表示周末可以到店了解。已预约本周六（8月23日）下午2点到杭州旗舰总店面谈，已发送地址和接待红娘联系方式至客户企微。客户情况：${call.occupation}，收入稳定，择偶要求明确，属于优质S级客户。
        </div>
        <div style="display:flex;align-items:center;gap:6px;margin-top:8px;font-size:10px;color:var(--text-muted);">
          <div class="lead-avatar-bubble" style="width:18px;height:18px;font-size:8px;">${fuzzAgentName(call.id)[0]}</div>
          <span>${fuzzAgentName(call.id)}</span>
          <span>·</span>
          <span style="font-variant-numeric:tabular-nums;">${call.startTime.split(' ')[0]} 14:45</span>
        </div>
      </div>
    </div>
  `;
}

// ── Tab: 质检复核 ─────────────────────────────────────────
function renderCallQATab(call) {
  const score = call.qaScore || (call.intentScore ? Math.round(call.intentScore * 0.95 + 5) : null);
  if (!score) {
    return `
      <div style="padding:40px;text-align:center;color:var(--text-muted);">
        <i data-lucide="shield-off" style="width:32px;height:32px;margin:0 auto 8px;opacity:0.3;"></i>
        <div style="font-size:12px;">通话未接通，无质检数据</div>
      </div>
    `;
  }
  const isReview = call.qaReview;
  const dims = [
    { label:'合规性',    v: Math.min(100, score + (hashStr(call.id+'c')%10)-3), c:'var(--emerald-500)' },
    { label:'自然度',    v: Math.min(100, score + (hashStr(call.id+'n')%8)-4), c:'var(--brand-500)' },
    { label:'打断处理',  v: Math.min(100, score + (hashStr(call.id+'i')%12)-6), c:'var(--violet-500)' },
    { label:'异议处理',  v: Math.min(100, score + (hashStr(call.id+'o')%10)-5), c:'var(--amber-500)' },
    { label:'转化引导',  v: Math.min(100, score + (hashStr(call.id+'cl')%8)-2), c:'var(--rose-500)' }
  ];
  const riskTags = isReview
    ? [{t:'打断客户1次',c:'amber'},{t:'企微引导略快',c:'amber'}]
    : score >= 90 ? [{t:'无违规',c:'emerald'},{t:'话术完整',c:'emerald'},{t:'痛点锁定准确',c:'brand'}]
    : [{t:'轻微抢话',c:'amber'}];

  return `
    <div style="display:flex;flex-direction:column;gap:12px;">
      <!-- Score Header -->
      <div class="card" style="padding:12px 14px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <div>
            <div style="font-size:11px;font-weight:700;color:var(--text-main);margin-bottom:2px;">质检综合评分</div>
            <div style="font-size:10px;color:var(--text-muted);">AI自动评分 ${isReview?'· 待人工复核':''}</div>
          </div>
          <div style="text-align:center;">
            <div style="font-size:32px;font-weight:800;background:linear-gradient(135deg,${score>=90?'var(--emerald-500),var(--brand-500)':'var(--amber-500),var(--rose-500)'});-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-variant-numeric:tabular-nums;line-height:1;">${score}</div>
            <div style="font-size:10px;color:var(--text-muted);">/ 100 · ${score>=95?'优秀':score>=85?'良好':score>=70?'合格':'需改进'}</div>
          </div>
        </div>
        ${isReview?`
          <div style="padding:6px 8px;background:var(--amber-50);border:1px solid var(--amber-100);border-radius:var(--radius-sm);font-size:10.5px;color:var(--amber-700);display:flex;align-items:center;gap:4px;margin-bottom:8px;">
            <i data-lucide="alert-triangle" style="width:12px;height:12px;"></i>
            该通话被标记为待人工复核，请仔细检查对话内容并提交复核结果。
          </div>
        `:''}
        <!-- Dimension Bars -->
        <div style="display:flex;flex-direction:column;gap:7px;">
          ${dims.map(d => `
            <div>
              <div style="display:flex;justify-content:space-between;font-size:10.5px;margin-bottom:2px;">
                <span style="color:var(--text-secondary);">${d.label}</span>
                <span style="font-weight:600;color:var(--text-main);font-variant-numeric:tabular-nums;">${d.v}分</span>
              </div>
              <div style="height:4px;background:var(--ink-100);border-radius:2px;overflow:hidden;">
                <div style="width:${d.v}%;height:100%;background:${d.c};border-radius:2px;"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Risk Tags -->
      <div class="card" style="padding:12px 14px;">
        <div style="font-size:11px;font-weight:700;color:var(--text-main);margin-bottom:8px;display:flex;align-items:center;gap:5px;">
          <i data-lucide="flag" style="width:12px;height:12px;color:var(--rose-500);"></i>风险标签
        </div>
        <div style="display:flex;gap:4px;flex-wrap:wrap;">
          ${riskTags.map(r => {
            const s = getStatusStyle(r.c);
            return `<span style="display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:var(--radius-sm);font-size:10.5px;font-weight:500;background:${s.bg};color:${s.text};">${r.t}</span>`;
          }).join('')}
        </div>
      </div>

      <!-- Reviewer Info -->
      <div class="card" style="padding:12px 14px;">
        <div style="font-size:11px;font-weight:700;color:var(--text-main);margin-bottom:8px;display:flex;align-items:center;gap:5px;">
          <i data-lucide="user-check" style="width:12px;height:12px;color:var(--violet-500);"></i>复核信息
        </div>
        <div style="font-size:11.5px;color:var(--text-secondary);line-height:1.6;">
          ${isReview
            ? '<span style="color:var(--amber-600);font-weight:500;">待复核</span> · 尚未分配复核员'
            : `复核员：张质控 · 复核时间：${call.startTime.split(' ')[0]} 15:12 · 复核结果：<span style="color:var(--emerald-600);font-weight:600;">通过</span>`}
        </div>
      </div>

      <!-- Correction Form -->
      <div class="card" style="padding:12px 14px;">
        <div style="font-size:11px;font-weight:700;color:var(--text-main);margin-bottom:8px;display:flex;align-items:center;gap:5px;">
          <i data-lucide="edit-3" style="width:12px;height:12px;color:var(--brand-500);"></i>人工复核
        </div>
        <textarea placeholder="输入复核意见或修正说明..." style="width:100%;height:60px;padding:8px 10px;font-size:11.5px;border:1px solid var(--border-color);border-radius:var(--radius-md);resize:vertical;outline:none;font-family:inherit;color:var(--text-main);background:var(--ink-50);" onfocus="this.style.borderColor='var(--brand-500)';this.style.background='var(--bg-card)';" onblur="this.style.borderColor='var(--border-color)';this.style.background='var(--ink-50)';"></textarea>
        <div style="display:flex;gap:6px;margin-top:8px;justify-content:flex-end;">
          <button class="btn btn-outline btn-sm" style="height:28px;font-size:11px;color:var(--rose-600);border-color:var(--rose-200);" onclick="App.showToast('已标记不通过','warning')">
            <i data-lucide="x-circle" style="width:11px;height:11px;"></i>不通过
          </button>
          <button class="btn btn-primary btn-sm" style="height:28px;font-size:11px;" onclick="App.showToast('复核通过，结果已提交','success')">
            <i data-lucide="check-circle" style="width:11px;height:11px;"></i>通过
          </button>
        </div>
      </div>
    </div>
  `;
}

// ── Tab: 时间线 ───────────────────────────────────────────
function renderCallTimelineTab(call) {
  const events = buildTimeline(call);
  return `
    <div style="padding:4px 0;">
      <div style="position:relative;padding-left:20px;">
        <div style="position:absolute;left:5px;top:4px;bottom:4px;width:2px;background:var(--border-color);"></div>
        ${events.map((e, i) => {
          const isLast = i === events.length - 1;
          return `
            <div style="position:relative;padding-bottom:${isLast?'0':'14px'};">
              <div style="position:absolute;left:-19px;top:3px;width:12px;height:12px;border-radius:50%;background:${e.color};border:2px solid var(--bg-card);box-shadow:0 0 0 2px ${e.color}30;z-index:1;"></div>
              <div style="font-size:11.5px;font-weight:600;color:var(--text-main);margin-bottom:2px;">${e.title}</div>
              <div style="font-size:10.5px;color:var(--text-muted);font-variant-numeric:tabular-nums;margin-bottom:2px;">${e.time}</div>
              ${e.desc?`<div style="font-size:10.5px;color:var(--text-secondary);line-height:1.5;">${e.desc}</div>`:''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function buildTimeline(call) {
  const base = [
    { color:'var(--ink-400)', title:'名单导入与清洗', time:fuzzPastDate(call.startTime, 3), desc:'来源: ' + call.task.split('-')[0] },
    { color:'var(--brand-500)', title:'首次AI外呼', time:fuzzPastDate(call.startTime, 2), desc:'通话1分32秒 · 意向C级(55分) · 客户表示需要考虑' }
  ];
  if (call.status === 'valid' || call.status === 'transferred') {
    base.push({ color:'var(--emerald-500)', title:'接通通话 · ' + (call.intent==='S'?'S级极高':call.intent==='A'?'A级高意向':call.intent==='B'?'B级中意向':call.intent==='C'?'C级低意向':'D级'), time:call.startTime, desc:'通话' + call.duration + ' · 质检' + (call.qaScore||'--') + '分' });
  }
  if (call.intentScore >= 85) {
    base.push({ color:'var(--rose-500)', title:'高意向标记(S/A级)', time:call.startTime.replace(/:\d{2}$/, ':45'), desc:'AI自动识别高意向信号，触发SLA优先跟进' });
    base.push({ color:'var(--brand-500)', title:'企微好友申请已发送', time:call.startTime.replace(/:\d{2}$/, ':50'), desc:'通过AI外呼机器人自动发送，等待客户通过' });
  }
  if (call.transferred) {
    base.push({ color:'var(--violet-500)', title:'转人工坐席接待', time:call.startTime.replace(/:\d{2}$/, ':42'), desc:'坐席 ' + fuzzAgentName(call.id) + ' 接待，预约到店' });
    base.push({ color:'var(--emerald-500)', title:'红娘领取跟进', time:fuzzFutureDate(call.startTime, 0), desc:'金牌红娘' + fuzzMatchmakerName(call.id) + '已领取，2小时内首次联系' });
    base.push({ color:'var(--amber-500)', title:'预约到店面谈', time:fuzzFutureDate(call.startTime, 3), desc:'预约本周六下午2点到' + call.city + '旗舰总店面谈' });
  } else if (call.intentScore >= 70) {
    base.push({ color:'var(--violet-500)', title:'进入红娘待办池', time:call.startTime.replace(/:\d{2}$/, ':55'), desc:'自动分配至红娘跟进队列，48h内响应' });
  }
  if (call.status === 'rejected' || call.status === 'unsubscribed') {
    base.push({ color:'var(--rose-500)', title:call.status==='unsubscribed'?'客户退订':'客户拒接', time:call.startTime, desc:'标记退订/冷置，30天内不重复外呼' });
  }
  if (call.status === 'no_answer' || call.status === 'busy' || call.status === 'failed') {
    base.push({ color:'var(--ink-400)', title:'未接通 · 进入重试队列', time:call.startTime, desc:'将在2小时后自动重试，最多3次' });
  }
  return base;
}

// ── Deterministic Fuzz Helpers ────────────────────────────
function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
function fuzzLine(id) { const lines = ['0571-8800-中继线1','0755-2200-中继线2','010-6600-中继线3','025-5500-中继线4','028-8700-中继线5']; return lines[hashStr(id)%lines.length]; }
function fuzzEndTime(start, dur) {
  if (dur === '—') return '—';
  const [m,s] = dur.split(':').map(Number);
  const d = new Date(start.replace(/-/g,'/'));
  d.setMinutes(d.getMinutes()+m); d.setSeconds(d.getSeconds()+s);
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')+':'+String(d.getSeconds()).padStart(2,'0');
}
function fuzzEdu(id) { const edus=['硕士','985本科','211硕士','博士','海归硕士','本科']; return edus[hashStr(id)%edus.length]; }
function fuzzIncome(id) { const inc=['30-50万','50-80万','80-120万','20-30万','100万+','40-60万']; return inc[hashStr(id)%inc.length]; }
function fuzzMateAge(g, age) { return g==='男'?`${age-8}-${age-3}岁`:`${age+2}-${age+7}岁`; }
function fuzzAgentName(id) { const names=['李雅琴','王美丽','张晓燕','陈静怡','刘梦琪']; return names[hashStr(id)%names.length]; }
function fuzzMatchmakerName(id) { const names=['赵红娘','孙老师','周老师','吴老师','郑老师']; return names[hashStr(id)%names.length]; }
function fuzzPastDate(startStr, daysAgo) {
  const d = new Date(startStr.replace(/-/g,'/')); d.setDate(d.getDate()-daysAgo);
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
}
function fuzzFutureDate(startStr, daysAhead) {
  const d = new Date(startStr.replace(/-/g,'/')); d.setDate(d.getDate()+daysAhead);
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
}

// ── 真实状态联动 (前端复刻时对应 POST /api/calls/:id/actions) ──
function resolveCallLead(callId) {
  const call = CALLS_DATA.find(c => c.id === callId);
  if (!call) return null;
  return { call, lead: AppState.resolveLead({ name: call.leadName, age: call.age, phone: call.phone }) };
}

function actionWecom(callId) {
  const { call, lead } = resolveCallLead(callId) || {};
  if (!lead) { App.showToast('该通话未关联潜客档案（演示数据）', 'info'); return; }
  AppState.markWecomAdded(lead);
  call.status = 'valid';
  App.showToast(`${lead.name} 企微添加成功，红娘工作台「已加微待破冰」已更新`, 'success');
  App.refreshCurrentView();
}

function actionTransfer(callId) {
  const { call, lead } = resolveCallLead(callId) || {};
  if (!lead) { App.showToast('该通话未关联潜客档案（演示数据）', 'info'); return; }
  AppState.transferToMatchmaker(lead, `通话 ${call.id} AI 判定高意向(${call.intentScore || 0}分)，转人工承接`);
  call.transferred = true;
  call.status = 'transferred';
  App.showToast(`${lead.name} 已转入红娘待办池，工作台看板已更新`, 'success');
  App.refreshCurrentView();
}

function actionOptOut(callId) {
  const { call, lead } = resolveCallLead(callId) || {};
  if (!lead) { App.showToast('该通话未关联潜客档案（演示数据）', 'info'); return; }
  App.showModal({
    title: '确认标记退订',
    content: `
      <div style="font-size:12px;color:var(--text-secondary);line-height:1.7;">
        <p style="margin:0 0 8px;">确定将 <strong style="color:var(--text-main);">${lead.name} (${lead.phone})</strong> 标记为退订吗？</p>
        <div style="padding:8px 10px;background:var(--rose-50);border-left:3px solid var(--rose-500);border-radius:var(--radius-sm);font-size:11px;color:var(--rose-700);">
          <i data-lucide="ban" style="width:12px;height:12px;vertical-align:-2px;margin-right:4px;"></i>
          退订后该号码将冻结，不可再加入任何外呼任务，并在合规台账与黑名单同步留痕。
        </div>
      </div>
    `,
    confirmText: '确认退订并冻结',
    onConfirm: () => {
      AppState.optOutLead(lead, '通话中');
      call.status = 'unsubscribed';
      App.showToast(`${lead.name} 已登记退订，号码已冻结并同步合规台账`, 'warning');
      App.refreshCurrentView();
    }
  });
}

// ── Global Exposure ───────────────────────────────────────
window.CallsView = CallsView;
window.openCallDetail = openCallDetail;
window.closeCallDetail = closeCallDetail;
window.switchCallTab = switchCallTab;
window.resetCallsFilters = resetCallsFilters;
window.exportCallsData = exportCallsData;
window.toggleAllCallRows = toggleAllCallRows;
window.playMockRecording = playMockRecording;
window.actionWecom = actionWecom;
window.actionTransfer = actionTransfer;
window.actionOptOut = actionOptOut;
window.setCallFilter = setCallFilter;
