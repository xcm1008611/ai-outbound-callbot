// View: Dashboard (运营驾驶舱) v2 - 紧凑高密度 · 真SVG图表

const DashboardView = {
  render() {
    return renderDashboard();
  }
};

// ── Data ──
const m = AppState.metrics;

const funnelData = [
  { label: '名单准入', value: 28450, color: '#0ea5e9' },
  { label: 'AI初筛接通', value: 21120, color: '#06b6d4' },
  { label: '深度交互', value: 12680, color: '#14b8a6' },
  { label: '高意向(S/A)', value: 6492,  color: '#8b5cf6' },
  { label: '企微加粉', value: 4120,  color: '#22c55e' }
];

const intentDonut = [
  { name: 'S级·极高意向', val: 24.2, color: '#ec4899', desc: '急迫脱单、主动提供微信' },
  { name: 'A级·较高意向', val: 32.6, color: '#0ea5e9', desc: '单身有需求、同意加微' },
  { name: 'B级·观望中',   val: 21.4, color: '#f59e0b', desc: '暂不着急、先加公众号' },
  { name: 'C/D级·无意向', val: 21.8, color: '#94a3b8', desc: '已脱单/空号/明确拒绝' }
];

const channelROI = [
  { name: '抖音信息流',       connect: 78.4, add: 81.2, roi: 15.2, cost: 15.2, color: '#ec4899' },
  { name: '腾讯朋友圈',       connect: 72.1, add: 76.5, roi: 14.5, cost: 19.8, color: '#8b5cf6' },
  { name: '小红书品牌',       connect: 74.3, add: 79.1, roi: 18.6, cost: 12.4, color: '#f43f5e' },
  { name: '线下相亲登记',     connect: 85.0, add: 88.0, roi: 11.8, cost: 24.5, color: '#f59e0b' },
  { name: '老会员转介绍',     connect: 92.5, add: 94.0, roi: 28.4, cost: 6.5,  color: '#22c55e' }
];

const timeSlots = [
  { label: '10:00-11:30', rate: 82, tag: '接通', tagColor: '#22c55e', barColor: '#22c55e' },
  { label: '11:30-14:00', rate: 28, tag: '午休避让', tagColor: '#94a3b8', barColor: '#cbd5e1' },
  { label: '14:30-17:30', rate: 76, tag: '接通', tagColor: '#0ea5e9', barColor: '#3b82f6' },
  { label: '18:30-20:30', rate: 89, tag: '黄金', tagColor: '#f59e0b', barColor: '#f59e0b' }
];

const trendData = [320, 410, 380, 520, 490, 610, 720];
const trendLabels = ['周一','周二','周三','周四','周五','周六','周日'];

const channels = [
  { name: '抖音', calls: 8200, rate: 78, color: 'var(--rose-500)' },
  { name: '小红书', calls: 6100, rate: 74, color: 'var(--violet-500)' },
  { name: '朋友圈', calls: 5400, rate: 72, color: 'var(--brand-500)' },
  { name: '知乎', calls: 3800, rate: 69, color: 'var(--blue-500)' },
  { name: '转介绍', calls: 2900, rate: 93, color: 'var(--emerald-500)' },
  { name: '线下', calls: 2050, rate: 85, color: 'var(--amber-500)' }
];

const pendingLeads = AppState.leads.filter(l => l.status === 'pending').length;
const callingLeads = AppState.leads.filter(l => l.status === 'calling').length;
const claimedLeads = AppState.leads.filter(l => l.status === 'claimed' || l.status === 'wecom_added').length;
const runningTasks = AppState.campaigns.filter(c => c.status === 'running').length;

// ── SVG Helpers ──
function buildFunnelSVG(data) {
  const W = 420, H = 200;
  const topW = W - 20, botW = W * 0.35;
  const stepH = H / data.length;
  let paths = '';
  data.forEach((d, i) => {
    const t = i / data.length;
    const tNext = (i + 1) / data.length;
    const w1 = topW - (topW - botW) * t;
    const w2 = topW - (topW - botW) * tNext;
    const x1 = (W - w1) / 2, x2 = (W - w2) / 2;
    const y1 = i * stepH, y2 = (i + 1) * stepH;
    const pts = `${x1},${y1} ${x1 + w1},${y1} ${x2 + w2},${y2} ${x2},${y2}`;
    paths += `<polygon points="${pts}" fill="${d.color}" opacity="${0.75 + i * 0.05}"/>`;
    paths += `<text x="${W/2}" y="${y1 + stepH/2 + 4}" text-anchor="middle" fill="#fff" font-size="11" font-weight="600" font-family="inherit">${d.label} · ${d.value.toLocaleString()}</text>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" preserveAspectRatio="xMidYMid meet">${paths}</svg>`;
}

function buildDonutSVG(data, size) {
  const cx = size/2, cy = size/2, r = size/2 - 10, sw = 14;
  const total = data.reduce((s, d) => s + d.val, 0);
  let offset = 0;
  const C = 2 * Math.PI * r;
  let segs = '';
  data.forEach(d => {
    const len = (d.val / total) * C;
    segs += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${d.color}" stroke-width="${sw}" stroke-dasharray="${len} ${C - len}" stroke-dashoffset="${-offset}" stroke-linecap="butt"/>`;
    offset += len;
  });
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">${segs}</svg>`;
}

function buildTrendSVG() {
  const W = 280, H = 100;
  const max = Math.max(...trendData);
  const pts = trendData.map((v, i) => {
    const x = 15 + (i * (W - 30) / (trendData.length - 1));
    const y = H - 15 - (v / max * (H - 30));
    return { x, y };
  });
  const pathD = pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
  const areaD = pathD + ` L ${pts[pts.length-1].x} ${H-5} L ${pts[0].x} ${H-5} Z`;
  return `
    <svg viewBox="0 0 ${W} ${H}" width="100%" preserveAspectRatio="none">
      <defs><linearGradient id="tGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.18"/>
        <stop offset="100%" stop-color="#0ea5e9" stop-opacity="0"/>
      </linearGradient></defs>
      <path d="${areaD}" fill="url(#tGrad)"/>
      <path d="${pathD}" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      ${pts.map(p => `<circle cx="${p.x}" cy="${p.y}" r="3" fill="#fff" stroke="#0ea5e9" stroke-width="2"/>`).join('')}
      ${pts.map((p, i) => `<text x="${p.x}" y="${H-2}" text-anchor="middle" font-size="9" fill="#94a3b8" font-family="inherit">${trendLabels[i]}</text>`).join('')}
    </svg>`;
}

// ── Render ──
function renderDashboard() {
  const donutSize = 120;
  const maxCalls = Math.max(...channels.map(c => c.calls));

  return `
  <div class="view-fade-enter">

    <!-- Page Header -->
    <div class="page-header">
      <div class="page-title-group">
        <div class="page-title">
          <i data-lucide="layout-dashboard"></i>
          运营驾驶舱
        </div>
        <div class="page-subtitle">知缘AI红娘外呼 · 实时数据总览 · ${new Date().toLocaleDateString('zh-CN')}</div>
      </div>
      <div class="page-actions">
        <button class="btn btn-outline btn-sm" onclick="App.navigate('reports')">
          <i data-lucide="bar-chart-3"></i>
          ROI分析
        </button>
        <button class="btn btn-primary btn-sm" onclick="App.showToast('大盘数据已同步', 'info')">
          <i data-lucide="refresh-cw"></i>
          刷新数据
        </button>
      </div>
    </div>

    <!-- 系统异常与待办提醒 -->
    <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:var(--content-gap);">
      <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--rose-50);border:1px solid var(--rose-200);border-radius:var(--radius-md);font-size:11.5px;">
        <i data-lucide="alert-triangle" style="width:14px;height:14px;color:var(--rose-600);flex-shrink:0;"></i>
        <span style="color:var(--rose-700);font-weight:600;">1个连接异常</span>
        <span style="color:var(--rose-600);">火山引擎TTS鉴权失败，连续3次调用未成功</span>
        <button class="btn btn-ghost btn-sm" style="margin-left:auto;height:22px;padding:0 8px;font-size:10.5px;color:var(--rose-700);" onclick="App.navigate('integrations')">前往查看 →</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
        <div style="display:flex;align-items:center;gap:8px;padding:7px 12px;background:var(--amber-50);border:1px solid var(--amber-200);border-radius:var(--radius-md);font-size:11px;">
          <i data-lucide="clock" style="width:13px;height:13px;color:var(--amber-600);flex-shrink:0;"></i>
          <span style="color:var(--amber-700);"><b>20条</b>授权待审核</span>
          <button class="btn btn-ghost btn-sm" style="margin-left:auto;height:20px;padding:0 6px;font-size:10px;color:var(--amber-700);" onclick="App.navigate('compliance')">处理</button>
        </div>
        <div style="display:flex;align-items:center;gap:8px;padding:7px 12px;background:var(--brand-50);border:1px solid var(--brand-200);border-radius:var(--radius-md);font-size:11px;">
          <i data-lucide="users" style="width:13px;height:13px;color:var(--brand-600);flex-shrink:0;"></i>
          <span style="color:var(--brand-700);"><b>8位</b>客户正在排队转人工（最长等待3:15）</span>
          <button class="btn btn-ghost btn-sm" style="margin-left:auto;height:20px;padding:0 6px;font-size:10px;color:var(--brand-700);" onclick="App.navigate('agents')">查看队列</button>
        </div>
        <div style="display:flex;align-items:center;gap:8px;padding:7px 12px;background:var(--emerald-50);border:1px solid var(--emerald-200);border-radius:var(--radius-md);font-size:11px;">
          <i data-lucide="phone-call" style="width:13px;height:13px;color:var(--emerald-600);flex-shrink:0;"></i>
          <span style="color:var(--emerald-700);">3个外呼任务运行中，并发 <b>133/220</b></span>
          <button class="btn btn-ghost btn-sm" style="margin-left:auto;height:20px;padding:0 6px;font-size:10px;color:var(--emerald-700);" onclick="App.navigate('campaigns')">监控</button>
        </div>
      </div>
    </div>

    <!-- KPI Cards (高度58px 4个一行) -->
    <div class="metrics-grid">
      <div class="metric-card" style="cursor:pointer;" onclick="App.navigate('calls')" title="点击下钻到通话记录">
        <div class="metric-top-row">
          <span class="metric-label">今日外呼量</span>
          <div class="metric-icon-box accent-blue"><i data-lucide="phone-call"></i></div>
        </div>
        <div class="metric-value-row">
          <span class="metric-number">28,450</span>
          <span class="metric-unit">通</span>
          <span class="trend-up" style="margin-left:6px;">↑5.6%</span>
        </div>
      </div>
      <div class="metric-card" style="cursor:pointer;" onclick="App.navigate('reports')" title="点击查看ROI分析">
        <div class="metric-top-row">
          <span class="metric-label">接通率</span>
          <div class="metric-icon-box accent-emerald"><i data-lucide="phone-check"></i></div>
        </div>
        <div class="metric-value-row">
          <span class="metric-number">74.2</span>
          <span class="metric-unit">%</span>
          <span class="trend-up" style="margin-left:6px;">↑3.2%</span>
        </div>
      </div>
      <div class="metric-card" style="cursor:pointer;" onclick="App.navigate('matchmaker')" title="点击查看红娘工作台">
        <div class="metric-top-row">
          <span class="metric-label">S/A高意向</span>
          <div class="metric-icon-box accent-violet"><i data-lucide="gem"></i></div>
        </div>
        <div class="metric-value-row">
          <span class="metric-number" style="color:var(--violet-600);">6,492</span>
          <span class="metric-unit">人</span>
          <span class="trend-up" style="margin-left:6px;">↑12.1%</span>
        </div>
      </div>
      <div class="metric-card" style="cursor:pointer;" onclick="App.navigate('matchmaker')" title="点击查看加粉情况">
        <div class="metric-top-row">
          <span class="metric-label">企微加粉率</span>
          <div class="metric-icon-box accent-rose"><i data-lucide="message-circle-heart"></i></div>
        </div>
        <div class="metric-value-row">
          <span class="metric-number" style="color:var(--emerald-600);">78.5</span>
          <span class="metric-unit">%</span>
          <span class="trend-up" style="margin-left:6px;">↑2.8%</span>
        </div>
      </div>
    </div>

    <!-- Business Quick Nav Tabs -->
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:var(--content-gap);flex-wrap:wrap;">
      <div class="tab-group">
        <button class="tab-btn active" onclick="App.navigate('leads')">
          <i data-lucide="list-phone"></i>
          待外呼线索 <span class="badge badge-neutral" style="margin-left:4px;">${pendingLeads + callingLeads}</span>
        </button>
        <button class="tab-btn" onclick="App.navigate('campaigns')">
          <i data-lucide="phone-outgoing"></i>
          外呼任务 <span class="badge badge-neutral" style="margin-left:4px;">${runningTasks}</span>
        </button>
      </div>
      <div style="flex:1;"></div>
      <button class="btn btn-outline btn-sm" onclick="App.navigate('leads')">
        <i data-lucide="users"></i>
        高意向客户库 <span class="badge badge-success" style="margin-left:4px;">${claimedLeads}</span>
      </button>
      <button class="btn btn-outline btn-sm" onclick="App.navigate('simulator')">
        <i data-lucide="bot"></i>
        AI沙盒
      </button>
    </div>

    <!-- Row 1: Funnel + Donut + Trend -->
    <div style="display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:var(--content-gap);margin-bottom:var(--content-gap);">

      <!-- Funnel Card -->
      <div class="card" style="padding:14px;">
        <div class="card-header" style="margin-bottom:8px;padding-bottom:8px;">
          <div class="card-title-group">
            <i data-lucide="filter"></i>
            <div>
              <div class="card-title">全链路转化漏斗</div>
              <div class="card-subtitle">名单→接通→交互→意向→加粉</div>
            </div>
          </div>
          <span class="status-pill status-running"><span class="status-pill-dot"></span>实时</span>
        </div>
        ${buildFunnelSVG(funnelData)}
        <div class="stats-mini" style="margin-top:8px;padding-top:8px;">
          <div class="stats-mini-item">
            <div class="stats-mini-label">平均通话</div>
            <div class="stats-mini-value" style="font-size:13px;">2分18秒</div>
          </div>
          <div class="stats-mini-item">
            <div class="stats-mini-label">高意向占比</div>
            <div class="stats-mini-value" style="font-size:13px;color:var(--violet-600);">22.8%</div>
          </div>
          <div class="stats-mini-item">
            <div class="stats-mini-label">单客成本</div>
            <div class="stats-mini-value" style="font-size:13px;color:var(--emerald-600);">¥18.6</div>
          </div>
        </div>
      </div>

      <!-- Donut: Intent Distribution -->
      <div class="card" style="padding:14px;">
        <div class="card-header" style="margin-bottom:8px;padding-bottom:8px;">
          <div class="card-title-group">
            <i data-lucide="pie-chart"></i>
            <div>
              <div class="card-title">意向等级分布</div>
              <div class="card-subtitle">AI多级分类算法</div>
            </div>
          </div>
        </div>
        <div class="donut-chart-wrap" style="gap:12px;">
          <div class="donut-chart" style="width:${donutSize}px;height:${donutSize}px;">
            ${buildDonutSVG(intentDonut, donutSize)}
            <div class="donut-center">
              <div class="donut-center-value">${AppState.leads.length}</div>
              <div class="donut-center-label">总潜客</div>
            </div>
          </div>
          <div class="donut-legend">
            ${intentDonut.map(d => `
              <div class="donut-legend-item">
                <span class="donut-legend-dot" style="background:${d.color};"></span>
                <span style="font-size:11px;color:var(--text-secondary);font-weight:500;">${d.name.split('·')[0]}</span>
                <span class="donut-legend-val" style="color:${d.color};">${d.val}%</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- 7-Day Trend -->
      <div class="card" style="padding:14px;">
        <div class="card-header" style="margin-bottom:8px;padding-bottom:8px;">
          <div class="card-title-group">
            <i data-lucide="trending-up"></i>
            <div>
              <div class="card-title">近7日外呼趋势</div>
              <div class="card-subtitle">持续上升</div>
            </div>
          </div>
          <span class="trend-up" style="font-size:11px;">+38.2%</span>
        </div>
        ${buildTrendSVG()}
        <div style="display:flex;justify-content:space-between;margin-top:6px;font-size:11px;color:var(--text-muted);">
          <span>最低: 320通</span>
          <span style="color:var(--emerald-600);font-weight:600;">最高: 720通</span>
        </div>
      </div>
    </div>

    <!-- Row 2: Channel Bar + Channel ROI -->
    <div style="display:grid;grid-template-columns:1fr 1.2fr;gap:var(--content-gap);margin-bottom:var(--content-gap);">

      <!-- Channel Bar Chart -->
      <div class="card" style="padding:14px;">
        <div class="card-header" style="margin-bottom:8px;padding-bottom:8px;">
          <div class="card-title-group">
            <i data-lucide="bar-chart-2"></i>
            <div>
              <div class="card-title">各渠道外呼量</div>
              <div class="card-subtitle">柱顶数字=接通率</div>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="bar-chart" style="height:120px;gap:6px;">
            ${channels.map((c, i) => {
              const h = (c.calls / maxCalls) * 100;
              return `
                <div class="bar-chart-item" style="--bar-delay:${i*60}ms;max-width:40px;">
                  <div style="font-size:10px;font-weight:600;color:var(--emerald-600);font-variant-numeric:tabular-nums;">${c.rate}%</div>
                  <div class="bar-chart-bar" style="height:${h}%;background:${c.color};max-width:32px;border-radius:3px 3px 0 0;animation-delay:${i*60+200}ms;"></div>
                  <div class="bar-chart-label">${c.name}</div>
                </div>`;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- Channel ROI Table (水平条形) -->
      <div class="card" style="padding:14px;">
        <div class="card-header" style="margin-bottom:8px;padding-bottom:8px;">
          <div class="card-title-group">
            <i data-lucide="badge-dollar-sign"></i>
            <div>
              <div class="card-title">渠道ROI对比</div>
              <div class="card-subtitle">接通率·加微率·投产比</div>
            </div>
          </div>
        </div>
        <div style="font-size:11px;color:var(--text-muted);display:flex;justify-content:space-between;margin-bottom:6px;padding:0 0 4px;border-bottom:1px solid var(--border-subtle);">
          <span style="width:80px;">渠道</span>
          <span style="width:48px;text-align:right;">接通</span>
          <span style="width:48px;text-align:right;">加微</span>
          <span style="width:80px;text-align:right;">ROI/单客成本</span>
        </div>
        ${channelROI.map(c => {
          const roiClass = c.roi >= 20 ? 'var(--emerald-600)' : c.roi >= 14 ? 'var(--brand-600)' : 'var(--amber-600)';
          const roiBg = c.roi >= 20 ? 'var(--emerald-50)' : c.roi >= 14 ? 'var(--brand-50)' : 'var(--amber-50)';
          return `
          <div style="display:flex;align-items:center;gap:6px;padding:5px 0;border-bottom:1px solid var(--border-subtle);">
            <span style="width:80px;font-size:11.5px;font-weight:500;color:var(--text-main);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${c.name}</span>
            <div style="width:48px;text-align:right;font-size:11px;font-variant-numeric:tabular-nums;color:var(--text-secondary);">${c.connect}%</div>
            <div style="width:48px;text-align:right;font-size:11px;font-variant-numeric:tabular-nums;color:var(--emerald-600);font-weight:600;">${c.add}%</div>
            <div style="width:80px;display:flex;align-items:center;gap:4px;justify-content:flex-end;">
              <span style="font-size:10px;padding:1px 5px;border-radius:4px;font-weight:600;color:${roiClass};background:${roiBg};white-space:nowrap;">1:${c.roi}</span>
              <span style="font-size:10px;color:var(--text-muted);font-variant-numeric:tabular-nums;">¥${c.cost}</span>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>

    <!-- Row 3: Time Slots + Running Tasks -->
    <div style="display:grid;grid-template-columns:1fr 1.2fr;gap:var(--content-gap);">

      <!-- Golden Time Slots (水平bar) -->
      <div class="card" style="padding:14px;">
        <div class="card-header" style="margin-bottom:8px;padding-bottom:8px;">
          <div class="card-title-group">
            <i data-lucide="clock"></i>
            <div>
              <div class="card-title">黄金外呼时段</div>
              <div class="card-subtitle">智能避开午休高频骚扰</div>
            </div>
          </div>
        </div>
        ${timeSlots.map(s => `
          <div class="hbar-row" style="margin-bottom:7px;">
            <span class="hbar-label" style="width:78px;font-size:11px;">${s.label}</span>
            <div class="hbar-track">
              <div class="hbar-fill" style="width:${s.rate}%;background:${s.barColor};"></div>
            </div>
            <div style="width:68px;display:flex;align-items:center;gap:4px;justify-content:flex-end;flex-shrink:0;">
              <span style="font-size:11px;font-weight:600;font-variant-numeric:tabular-nums;color:${s.tagColor};">${s.rate}%</span>
              <span style="font-size:10px;padding:0 4px;border-radius:3px;background:${s.tagColor}15;color:${s.tagColor};font-weight:500;line-height:16px;">${s.tag}</span>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Running Tasks Mini List -->
      <div class="card" style="padding:14px;">
        <div class="card-header" style="margin-bottom:8px;padding-bottom:8px;">
          <div class="card-title-group">
            <i data-lucide="radio"></i>
            <div>
              <div class="card-title">正在外呼任务</div>
              <div class="card-subtitle">${runningTasks}个任务运行中</div>
            </div>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="App.navigate('campaigns')" style="font-size:11px;">全部 <i data-lucide="chevron-right" style="width:11px;height:11px;"></i></button>
        </div>
        ${AppState.campaigns.filter(c => c.status === 'running').slice(0, 3).map(c => `
          <div style="padding:8px 0;border-bottom:1px solid var(--border-subtle);">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
              <div style="display:flex;align-items:center;gap:6px;min-width:0;">
                <span style="font-size:12px;font-weight:600;color:var(--text-main);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px;">${c.name}</span>
                <span class="badge badge-primary" style="font-size:9px;line-height:14px;">${c.type}</span>
              </div>
              <span style="font-size:11px;font-weight:600;color:var(--violet-600);font-variant-numeric:tabular-nums;">${c.progress}%</span>
            </div>
            <div class="progress-bar-container" style="height:4px;">
              <div class="progress-bar" style="width:${c.progress}%;background:linear-gradient(90deg,var(--brand-500),var(--violet-500));"></div>
            </div>
            <div style="display:flex;gap:12px;margin-top:4px;font-size:10.5px;color:var(--text-muted);">
              <span>接通 <strong style="color:var(--emerald-600);font-weight:600;">${c.connectRate}</strong></span>
              <span>高意向 <strong style="color:var(--rose-600);font-weight:600;">${c.highIntentCount}户</strong></span>
              <span>加微 <strong style="color:var(--emerald-600);font-weight:600;">${c.wecomAddedCount}人</strong></span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

  </div>`;
}

window.DashboardView = DashboardView;
