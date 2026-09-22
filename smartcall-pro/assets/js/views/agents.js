// View: Agents (坐席与转人工队列) - 坐席状态·技能组·排队监控·转接记录

// ── State ──────────────────────────────────────────────────
let transferPage = 1;
const TRANSFER_PAGE_SIZE = 8;

// ── Mock Data ──────────────────────────────────────────────

const AGENTS = [
  { id:'A001', name:'张老师', title:'金牌红娘', skillGroup:'体制内高知', status:'idle',    todayCount:14, avgDuration:'3:20', currentCall:null, gender:'female' },
  { id:'A002', name:'李老师', title:'资深匹配师', skillGroup:'年轻互联网', status:'oncall',  todayCount:11, avgDuration:'4:05', currentCall:{ leadName:'陈雨萱', duration:'02:18' }, gender:'female' },
  { id:'A003', name:'陈老师', title:'高端定制', skillGroup:'海归高净值', status:'idle',    todayCount:8,  avgDuration:'5:30', currentCall:null, gender:'male' },
  { id:'A004', name:'王老师', title:'资深红娘', skillGroup:'本地普通', status:'idle',    todayCount:18, avgDuration:'2:50', currentCall:null, gender:'female' },
  { id:'A005', name:'刘老师', title:'实习红娘', skillGroup:'新客承接', status:'wrapup',  todayCount:7,  avgDuration:'3:10', currentCall:{ leadName:'陈雨萱', wrapTime:'00:42' }, gender:'female' },
  { id:'A006', name:'赵老师', title:'资深红娘', skillGroup:'父母客群', status:'oncall',  todayCount:13, avgDuration:'3:45', currentCall:{ leadName:'李建国(父)', duration:'05:32' }, gender:'female' },
  { id:'A007', name:'周老师', title:'金牌红娘', skillGroup:'高净值男客', status:'idle',    todayCount:6,  avgDuration:'6:20', currentCall:null, gender:'male' },
  { id:'A008', name:'孙老师', title:'初级红娘', skillGroup:'新客池', status:'offline', todayCount:0,  avgDuration:'-',    currentCall:null, gender:'female' },
];

const QUEUES = [
  { id:'Q1', name:'高意向-金牌红娘队列', skillGroup:'金牌红娘/高端定制', waiting:2, longestWait:'1:30', serviceLevel:92, availableSeats:2, color:'emerald' },
  { id:'Q2', name:'中意向-普通承接队列', skillGroup:'资深红娘/新客承接', waiting:5, longestWait:'3:15', serviceLevel:78, availableSeats:1, color:'amber' },
  { id:'Q3', name:'父母客群-专线队列', skillGroup:'父母客群专线', waiting:1, longestWait:'0:45', serviceLevel:96, availableSeats:1, color:'emerald' },
];

const TRANSFER_RECORDS = [
  { id:'TR001', leadName:'张明华', summary:'32岁程序员,本科,想找90后温柔女生', intent:'high',   startTime:'14:23:15', waitTime:'0:28', agent:'张老师', result:'accepted' },
  { id:'TR002', leadName:'李婷婷', summary:'28岁设计师,硕士,希望对方175+有房', intent:'high',   startTime:'14:25:40', waitTime:'0:15', agent:'张老师', result:'accepted' },
  { id:'TR003', leadName:'王建国', summary:'35岁公务员,离异无孩,寻踏实过日子的', intent:'medium', startTime:'14:28:02', waitTime:'1:30', agent:'周老师', result:'queued' },
  { id:'TR004', leadName:'赵雅婷', summary:'29岁医生,博士,要求学历匹配身高160+', intent:'high',   startTime:'14:30:18', waitTime:'0:45', agent:'陈老师', result:'accepted' },
  { id:'TR005', leadName:'刘思远', summary:'31岁金融男,年薪50w+,偏爱教师职业', intent:'medium', startTime:'14:32:55', waitTime:'2:10', agent:'—',      result:'queued' },
  { id:'TR006', leadName:'孙佳颖', summary:'26岁HR,性格活泼,找阳光开朗型男生', intent:'low',    startTime:'14:35:20', waitTime:'3:15', agent:'—',      result:'abandoned' },
  { id:'TR007', leadName:'吴承翰', summary:'38岁企业主,海归,寻气质佳高学历女', intent:'high',   startTime:'14:38:10', waitTime:'0:52', agent:'周老师', result:'accepted' },
  { id:'TR008', leadName:'何雨桐', summary:'29岁律师,独立女性,希望三观契合', intent:'medium', startTime:'14:40:33', waitTime:'1:08', agent:'王老师', result:'timeout' },
];

// ── Status Helpers ─────────────────────────────────────────

function agentStatusMeta(status) {
  const map = {
    idle:    { label:'空闲',     dot:'var(--emerald-500)', bg:'var(--emerald-50)',  text:'var(--emerald-700)',  ring:'var(--emerald-200)' },
    oncall:  { label:'通话中',   dot:'var(--violet-500)',  bg:'var(--violet-50)',   text:'var(--violet-700)',   ring:'var(--violet-200)' },
    wrapup:  { label:'话后整理', dot:'var(--amber-500)',   bg:'var(--amber-50)',    text:'var(--amber-700)',    ring:'var(--amber-200)' },
    offline: { label:'离线',     dot:'var(--ink-400)',     bg:'var(--ink-100)',     text:'var(--text-muted)',   ring:'var(--ink-200)' },
  };
  return map[status] || map.offline;
}

function intentBadge(intent) {
  const map = {
    high:   { label:'高', bg:'var(--emerald-50)', text:'var(--emerald-700)' },
    medium: { label:'中', bg:'var(--amber-50)',   text:'var(--amber-700)' },
    low:    { label:'低', bg:'var(--ink-100)',    text:'var(--text-muted)' },
  };
  const s = map[intent] || map.low;
  return `<span style="display:inline-flex;align-items:center;justify-content:center;padding:1px 7px;border-radius:var(--radius-sm);font-size:10.5px;font-weight:600;background:${s.bg};color:${s.text};white-space:nowrap;min-width:24px;">${s.label}</span>`;
}

function transferResultBadge(result) {
  const map = {
    accepted:  { label:'已接听', bg:'var(--emerald-50)', text:'var(--emerald-700)', dot:'var(--emerald-500)' },
    queued:    { label:'排队中', bg:'var(--amber-50)',   text:'var(--amber-700)',   dot:'var(--amber-500)' },
    abandoned: { label:'已放弃', bg:'var(--rose-50)',    text:'var(--rose-700)',    dot:'var(--rose-500)' },
    timeout:   { label:'超时未接', bg:'var(--ink-100)',  text:'var(--text-muted)',  dot:'var(--ink-400)' },
  };
  const s = map[result] || map.queued;
  return `<span style="display:inline-flex;align-items:center;gap:3px;padding:1px 7px;border-radius:var(--radius-sm);font-size:10.5px;font-weight:500;background:${s.bg};color:${s.text};white-space:nowrap;"><span style="width:5px;height:5px;border-radius:50%;background:${s.dot};flex-shrink:0;"></span>${s.label}</span>`;
}

function serviceLevelColor(level) {
  if (level >= 90) return { bar:'var(--emerald-500)', bg:'var(--emerald-50)', text:'var(--emerald-700)' };
  if (level >= 70) return { bar:'var(--amber-500)',   bg:'var(--amber-50)',   text:'var(--amber-700)' };
  return { bar:'var(--rose-500)', bg:'var(--rose-50)', text:'var(--rose-700)' };
}

// ── View Object ────────────────────────────────────────────
const AgentsView = {
  render() {
    return renderAgentsView();
  },

  acceptTransfer(agentId) {
    const agent = AGENTS.find(a => a.id === agentId);
    if (!agent) return;
    if (agent.status !== 'idle') {
      App.showToast(agent.name + ' 当前不可接听', 'warning');
      return;
    }
    // Find queue with longest wait
    let pickedQueue = null;
    let pickedWaitSec = -1;
    for (const q of QUEUES) {
      if (q.waiting > 0 && q.availableSeats > 0) {
        const parts = q.longestWait.split(':').map(Number);
        const sec = parts[0]*60 + parts[1];
        if (sec > pickedWaitSec) {
          pickedWaitSec = sec;
          pickedQueue = q;
        }
      }
    }
    if (pickedQueue) {
      pickedQueue.waiting = Math.max(0, pickedQueue.waiting - 1);
      agent.status = 'oncall';
      agent.todayCount += 1;
      agent.currentCall = { leadName:'排队客户', duration:'00:00' };
      App.showToast('模拟接听成功，已分配排队最久的客户', 'success');
    } else {
      App.showToast('当前无排队客户', 'info');
    }
    App.refreshCurrentView();
  }
};

// ── Main Render ────────────────────────────────────────────
function renderAgentsView() {
  const onlineCount = AGENTS.filter(a => a.status !== 'offline').length;
  const idleCount = AGENTS.filter(a => a.status === 'idle').length;
  const oncallCount = AGENTS.filter(a => a.status === 'oncall').length;
  const totalWaiting = QUEUES.reduce((s,q) => s+q.waiting, 0);
  const longestWait = QUEUES.reduce((max,q) => {
    const parts = q.longestWait.split(':').map(Number);
    const sec = parts[0]*60+parts[1];
    const maxParts = max.split(':').map(Number);
    const maxSec = maxParts[0]*60+maxParts[1];
    return sec > maxSec ? q.longestWait : max;
  }, '0:00');
  const abandonRate = '6.2%';

  return `
    <div class="view-fade-enter">

      <!-- Page Header -->
      <div class="page-header">
        <div class="page-title-group">
          <div class="page-title">
            <i data-lucide="headphones"></i>
            坐席与转人工队列
          </div>
          <div class="page-subtitle">坐席状态·技能组·排队监控·转接记录</div>
        </div>
        <div class="page-actions" style="display:flex;align-items:center;gap:6px;">
          <span class="badge badge-neutral" style="font-size:10px;line-height:16px;background:var(--amber-50);color:var(--amber-700);border:1px solid var(--amber-200);">
            <i data-lucide="flask-conical" style="width:9px;height:9px;margin-right:2px;"></i>演示数据·待真实SIP接入
          </span>
          <button class="btn btn-outline btn-sm" onclick="App.showToast('坐席状态刷新','info')">
            <i data-lucide="refresh-cw"></i>刷新
          </button>
        </div>
      </div>

      <!-- KPI Row (6 stats) -->
      <div class="metrics-grid" style="grid-template-columns:repeat(6,1fr);margin-bottom:var(--content-gap);">
        <div class="metric-card" style="padding:10px 12px;min-height:56px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
            <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">在线坐席</span>
            <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--brand-50);flex-shrink:0;">
              <i data-lucide="users" style="width:11px;height:11px;color:var(--brand-600);"></i>
            </div>
          </div>
          <div style="font-size:18px;font-weight:700;color:var(--text-main);font-variant-numeric:tabular-nums;line-height:1.2;">${onlineCount}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:2px;">/${AGENTS.length}</span></div>
        </div>
        <div class="metric-card" style="padding:10px 12px;min-height:56px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
            <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">空闲</span>
            <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--emerald-50);flex-shrink:0;">
              <i data-lucide="user-check" style="width:11px;height:11px;color:var(--emerald-600);"></i>
            </div>
          </div>
          <div style="font-size:18px;font-weight:700;color:var(--emerald-600);font-variant-numeric:tabular-nums;line-height:1.2;">${idleCount}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">人</span></div>
        </div>
        <div class="metric-card" style="padding:10px 12px;min-height:56px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
            <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">通话中</span>
            <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--violet-50);flex-shrink:0;">
              <i data-lucide="phone-call" style="width:11px;height:11px;color:var(--violet-600);"></i>
            </div>
          </div>
          <div style="font-size:18px;font-weight:700;color:var(--violet-600);font-variant-numeric:tabular-nums;line-height:1.2;">${oncallCount}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">人</span></div>
        </div>
        <div class="metric-card" style="padding:10px 12px;min-height:56px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
            <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">排队客户</span>
            <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--amber-50);flex-shrink:0;">
              <i data-lucide="list-ordered" style="width:11px;height:11px;color:var(--amber-600);"></i>
            </div>
          </div>
          <div style="font-size:18px;font-weight:700;color:var(--amber-600);font-variant-numeric:tabular-nums;line-height:1.2;">${totalWaiting}<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">人</span></div>
        </div>
        <div class="metric-card" style="padding:10px 12px;min-height:56px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
            <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">最长等待</span>
            <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--rose-50);flex-shrink:0;">
              <i data-lucide="clock" style="width:11px;height:11px;color:var(--rose-600);"></i>
            </div>
          </div>
          <div style="font-size:18px;font-weight:700;color:var(--text-main);font-variant-numeric:tabular-nums;line-height:1.2;">${longestWait}</div>
        </div>
        <div class="metric-card" style="padding:10px 12px;min-height:56px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
            <span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">今日放弃率</span>
            <div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:var(--ink-50);flex-shrink:0;">
              <i data-lucide="phone-missed" style="width:11px;height:11px;color:var(--ink-500);"></i>
            </div>
          </div>
          <div style="font-size:18px;font-weight:700;color:var(--text-main);font-variant-numeric:tabular-nums;line-height:1.2;">${abandonRate}</div>
        </div>
      </div>

      <!-- Two Column: Agents + Queues -->
      <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:16px;margin-bottom:var(--content-gap);">
        ${renderAgentsList()}
        ${renderQueuesPanel()}
      </div>

      <!-- Transfer Records (full width) -->
      ${renderTransferRecords()}

    </div>
  `;
}

// ── Agents List ────────────────────────────────────────────
let agentStatusFilter = 'ALL'; // ALL | idle | oncall

function setAgentFilter(val) {
  agentStatusFilter = val;
  App.refreshCurrentView();
}

function renderAgentsList() {
  const agents = agentStatusFilter === 'ALL' ? AGENTS : AGENTS.filter(a => a.status === agentStatusFilter);
  return `
    <div class="card" style="padding:0;overflow:hidden;">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-bottom:1px solid var(--border-subtle);">
        <div style="display:flex;align-items:center;gap:6px;">
          <i data-lucide="headset" style="width:13px;height:13px;color:var(--text-muted);"></i>
          <span style="font-size:12px;font-weight:600;color:var(--text-main);">坐席列表</span>
          <span style="font-size:10.5px;color:var(--text-muted);font-variant-numeric:tabular-nums;">${agents.length}人</span>
        </div>
        <div style="display:flex;gap:2px;">
          <button class="btn btn-ghost btn-sm" style="height:24px;padding:0 6px;font-size:10.5px;${agentStatusFilter==='ALL'?'background:var(--brand-50);color:var(--brand-700);':''}" onclick="setAgentFilter('ALL')">全部</button>
          <button class="btn btn-ghost btn-sm" style="height:24px;padding:0 6px;font-size:10.5px;color:var(--emerald-600);${agentStatusFilter==='idle'?'background:var(--emerald-50);':''}" onclick="setAgentFilter('idle')">空闲</button>
          <button class="btn btn-ghost btn-sm" style="height:24px;padding:0 6px;font-size:10.5px;color:var(--violet-600);${agentStatusFilter==='oncall'?'background:var(--violet-50);':''}" onclick="setAgentFilter('oncall')">通话中</button>
        </div>
      </div>
      <div>
        ${agents.map(a => {
          const st = agentStatusMeta(a.status);
          const avatarBg = a.gender === 'female' ? 'linear-gradient(135deg,var(--violet-100),var(--pink-100))' : 'linear-gradient(135deg,var(--brand-100),var(--blue-100))';
          const avatarText = a.gender === 'female' ? 'var(--violet-600)' : 'var(--brand-600)';
          const isOffline = a.status === 'offline';
          return `
            <div style="display:flex;align-items:center;gap:10px;padding:9px 14px;border-bottom:1px solid var(--border-subtle);transition:background .15s;${isOffline?'opacity:.55;':''}" onmouseover="this.style.background='var(--ink-50)'" onmouseout="this.style.background=''">
              <!-- Avatar + Status Dot -->
              <div style="position:relative;flex-shrink:0;">
                <div style="width:34px;height:34px;border-radius:50%;background:${avatarBg};display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:${avatarText};">${a.name[0]}</div>
                <span style="position:absolute;right:-1px;bottom:-1px;width:10px;height:10px;border-radius:50%;background:${st.dot};border:2px solid var(--surface, #fff);box-sizing:content-box;"></span>
              </div>

              <!-- Name + Title + Skill Group -->
              <div style="min-width:0;flex:1;">
                <div style="display:flex;align-items:center;gap:5px;margin-bottom:1px;">
                  <span style="font-size:12px;font-weight:600;color:var(--text-main);white-space:nowrap;">${a.name}</span>
                  <span style="font-size:10px;color:var(--text-muted);white-space:nowrap;">${a.title}</span>
                </div>
                <div style="display:flex;align-items:center;gap:4px;">
                  <span style="display:inline-flex;align-items:center;padding:0 5px;border-radius:3px;font-size:9.5px;font-weight:500;background:${st.bg};color:${st.text};white-space:nowrap;line-height:15px;">${st.label}</span>
                  <span style="font-size:10px;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100px;">${a.skillGroup}</span>
                  ${a.currentCall ? `
                    <span style="font-size:10px;color:${st.text};white-space:nowrap;display:inline-flex;align-items:center;gap:2px;">
                      <i data-lucide="phone-call" style="width:9px;height:9px;"></i>
                      ${a.currentCall.leadName}
                      ${a.currentCall.duration ? `·${a.currentCall.duration}` : ''}
                      ${a.currentCall.wrapTime ? `·整理${a.currentCall.wrapTime}` : ''}
                    </span>
                  ` : ''}
                </div>
              </div>

              <!-- Stats -->
              <div style="text-align:right;flex-shrink:0;display:flex;flex-direction:column;gap:1px;align-items:flex-end;">
                <div style="font-size:10px;color:var(--text-muted);font-variant-numeric:tabular-nums;">今日 <span style="font-weight:600;color:var(--text-main);">${a.todayCount}</span>单</div>
                <div style="font-size:10px;color:var(--text-muted);font-variant-numeric:tabular-nums;">均 <span style="font-weight:500;color:var(--text-secondary);">${a.avgDuration}</span></div>
              </div>

              <!-- Action -->
              <div style="flex-shrink:0;">
                ${a.status === 'idle' ? `
                  <button class="btn btn-primary btn-sm" style="height:26px;padding:0 10px;font-size:10.5px;white-space:nowrap;" onclick="AgentsView.acceptTransfer('${a.id}')">
                    <i data-lucide="phone-incoming" style="width:10px;height:10px;margin-right:2px;"></i>模拟接听
                  </button>
                ` : a.status === 'oncall' ? `
                  <button class="btn btn-outline btn-sm" style="height:26px;padding:0 8px;font-size:10.5px;color:var(--violet-600);border-color:var(--violet-200);white-space:nowrap;" onclick="App.showToast('监听功能演示','info')">
                    <i data-lucide="ear" style="width:10px;height:10px;margin-right:2px;"></i>监听
                  </button>
                ` : a.status === 'wrapup' ? `
                  <button class="btn btn-outline btn-sm" style="height:26px;padding:0 8px;font-size:10.5px;color:var(--amber-700);border-color:var(--amber-200);white-space:nowrap;" onclick="App.showToast('话后整理中，不可操作','info')">
                    <i data-lucide="file-edit" style="width:10px;height:10px;margin-right:2px;"></i>整理中
                  </button>
                ` : `
                  <button class="btn btn-ghost btn-sm" style="height:26px;padding:0 8px;font-size:10.5px;color:var(--text-muted);white-space:nowrap;" onclick="toggleAgentStatus('${a.id}')">
                    <i data-lucide="power" style="width:10px;height:10px;margin-right:2px;"></i>上线
                  </button>
                `}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// ── Queue Panel ────────────────────────────────────────────
function renderQueuesPanel() {
  return `
    <div class="card" style="padding:0;overflow:hidden;">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-bottom:1px solid var(--border-subtle);">
        <div style="display:flex;align-items:center;gap:6px;">
          <i data-lucide="list-ordered" style="width:13px;height:13px;color:var(--text-muted);"></i>
          <span style="font-size:12px;font-weight:600;color:var(--text-main);">队列实时状态</span>
          <span style="font-size:10.5px;color:var(--text-muted);font-variant-numeric:tabular-nums;">${QUEUES.length}个队列</span>
        </div>
        <div style="display:flex;align-items:center;gap:3px;">
          <span style="width:6px;height:6px;border-radius:50%;background:var(--emerald-500);animation:pulse-dot 1.5s infinite;"></span>
          <span style="font-size:10px;color:var(--text-muted);">实时</span>
        </div>
      </div>
      <div style="padding:10px;display:flex;flex-direction:column;gap:10px;">
        ${QUEUES.map(q => {
          const sl = serviceLevelColor(q.serviceLevel);
          const waitColor = q.waiting >= 5 ? 'var(--rose-600)' : q.waiting >= 2 ? 'var(--amber-600)' : 'var(--emerald-600)';
          return `
            <div style="padding:10px 12px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--surface, #fff);">
              <!-- Queue Name + Skill Group -->
              <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px;">
                <div style="min-width:0;">
                  <div style="font-size:12px;font-weight:600;color:var(--text-main);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${q.name}</div>
                  <div style="font-size:10px;color:var(--text-muted);margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${q.skillGroup}</div>
                </div>
              </div>

              <!-- Stats Row -->
              <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:8px;">
                <div style="text-align:center;padding:4px 0;background:var(--ink-50);border-radius:var(--radius-sm);">
                  <div style="font-size:9.5px;color:var(--text-muted);margin-bottom:1px;">等待</div>
                  <div style="font-size:16px;font-weight:700;color:${waitColor};font-variant-numeric:tabular-nums;line-height:1.2;">${q.waiting}</div>
                </div>
                <div style="text-align:center;padding:4px 0;background:var(--ink-50);border-radius:var(--radius-sm);">
                  <div style="font-size:9.5px;color:var(--text-muted);margin-bottom:1px;">最长等待</div>
                  <div style="font-size:14px;font-weight:600;color:var(--text-main);font-variant-numeric:tabular-nums;line-height:1.2;">${q.longestWait}</div>
                </div>
                <div style="text-align:center;padding:4px 0;background:var(--ink-50);border-radius:var(--radius-sm);">
                  <div style="font-size:9.5px;color:var(--text-muted);margin-bottom:1px;">可用坐席</div>
                  <div style="font-size:16px;font-weight:700;color:var(--brand-600);font-variant-numeric:tabular-nums;line-height:1.2;">${q.availableSeats}</div>
                </div>
              </div>

              <!-- Service Level Bar -->
              <div>
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:3px;">
                  <span style="font-size:9.5px;color:var(--text-muted);">服务水平</span>
                  <span style="font-size:10.5px;font-weight:600;color:${sl.text};font-variant-numeric:tabular-nums;">${q.serviceLevel}%</span>
                </div>
                <div style="height:5px;background:var(--ink-100);border-radius:3px;overflow:hidden;">
                  <div style="height:100%;width:${q.serviceLevel}%;background:${sl.bar};border-radius:3px;transition:width .4s;"></div>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// ── Transfer Records Table ─────────────────────────────────
function renderTransferRecords() {
  const total = TRANSFER_RECORDS.length;
  const pageData = TRANSFER_RECORDS;
  return `
    <div class="card" style="padding:0;overflow:hidden;">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-bottom:1px solid var(--border-subtle);">
        <div style="display:flex;align-items:center;gap:6px;">
          <i data-lucide="arrow-right-left" style="width:13px;height:13px;color:var(--text-muted);"></i>
          <span style="font-size:12px;font-weight:600;color:var(--text-main);">实时转接记录</span>
          <span style="font-size:10.5px;color:var(--text-muted);font-variant-numeric:tabular-nums;">今日 ${total} 条</span>
        </div>
        <div style="display:flex;gap:4px;align-items:center;">
          <select class="form-select" style="height:26px;padding:0 20px 0 6px;font-size:10.5px;min-width:80px;border-radius:var(--radius-sm);background:var(--ink-50);border:1px solid transparent;">
            <option>全部结果</option>
            <option>已接听</option>
            <option>排队中</option>
            <option>已放弃</option>
            <option>超时未接</option>
          </select>
        </div>
      </div>
      <div style="overflow-x:auto;">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width:80px;">潜客姓名</th>
              <th>AI摘要</th>
              <th style="width:56px;">意向等级</th>
              <th style="width:80px;">发起时间</th>
              <th style="width:70px;">等待时长</th>
              <th style="width:70px;">接收坐席</th>
              <th style="width:80px;">转接结果</th>
              <th style="width:110px;text-align:right;">操作</th>
            </tr>
          </thead>
          <tbody class="stagger-container">
            ${pageData.map(r => `
              <tr>
                <td>
                  <div style="display:flex;align-items:center;gap:5px;">
                    <div class="lead-avatar-bubble" style="width:22px;height:22px;font-size:10px;flex-shrink:0;">${r.leadName[0]}</div>
                    <span style="font-size:11.5px;font-weight:500;color:var(--text-main);white-space:nowrap;">${r.leadName}</span>
                  </div>
                </td>
                <td>
                  <div style="font-size:11.5px;color:var(--text-secondary);max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${r.summary}">${r.summary}</div>
                </td>
                <td>${intentBadge(r.intent)}</td>
                <td><span style="font-size:11.5px;color:var(--text-secondary);font-variant-numeric:tabular-nums;">${r.startTime}</span></td>
                <td><span style="font-size:11.5px;color:var(--text-secondary);font-variant-numeric:tabular-nums;">${r.waitTime}</span></td>
                <td>
                  ${r.agent === '—'
                    ? '<span style="font-size:11.5px;color:var(--text-muted);">—</span>'
                    : '<span style="font-size:11.5px;font-weight:500;color:var(--text-main);">' + r.agent + '</span>'
                  }
                </td>
                <td>${transferResultBadge(r.result)}</td>
                <td style="text-align:right;">
                  <div style="display:flex;gap:2px;justify-content:flex-end;">
                    <button class="btn btn-ghost btn-sm" style="height:24px;padding:0 7px;font-size:10.5px;" onclick="App.showToast('查看AI摘要 · ${r.leadName}','info')">
                      <i data-lucide="file-text" style="width:10px;height:10px;margin-right:2px;"></i>摘要
                    </button>
                    <button class="btn btn-ghost btn-sm" style="height:24px;padding:0 7px;font-size:10.5px;color:var(--violet-600);" onclick="App.showToast('通话监听演示 · ${r.leadName}','info')">
                      <i data-lucide="ear" style="width:10px;height:10px;margin-right:2px;"></i>监听
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ${renderAgentsPagination(total, transferPage)}
    </div>
  `;
}

// ── Pagination ─────────────────────────────────────────────
function renderAgentsPagination(total, current) {
  const totalPages = Math.max(1, Math.ceil(total / TRANSFER_PAGE_SIZE));
  return `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 14px;border-top:1px solid var(--border-subtle);">
      <div style="font-size:11px;color:var(--text-muted);font-variant-numeric:tabular-nums;">共 ${total} 条</div>
      <div style="display:flex;gap:3px;">
        <button class="btn btn-outline btn-sm" style="min-width:28px;padding:0 6px;" ${current<=1?'disabled':''} onclick="goTransferPage(${current-1})"><i data-lucide="chevron-left" style="width:11px;height:11px;"></i></button>
        ${Array.from({length: totalPages}, (_, i) => i+1).map(p => `
          <button class="btn ${p===current?'btn-primary':'btn-outline'} btn-sm" style="min-width:28px;padding:0 8px;" onclick="goTransferPage(${p})">${p}</button>
        `).join('')}
        <button class="btn btn-outline btn-sm" style="min-width:28px;padding:0 6px;" ${current>=totalPages?'disabled':''} onclick="goTransferPage(${current+1})"><i data-lucide="chevron-right" style="width:11px;height:11px;"></i></button>
      </div>
    </div>
  `;
}

// ── Actions ────────────────────────────────────────────────

function goTransferPage(p) {
  transferPage = p;
  App.refreshCurrentView();
}

function toggleAgentStatus(agentId) {
  const agent = AGENTS.find(a => a.id === agentId);
  if (!agent) return;
  if (agent.status === 'offline') {
    agent.status = 'idle';
    App.showToast(agent.name + ' 已上线', 'success');
  } else {
    agent.status = 'offline';
    App.showToast(agent.name + ' 已离线', 'info');
  }
  App.refreshCurrentView();
}

// ── Window Exports ─────────────────────────────────────────
window.AgentsView = AgentsView;
window.goTransferPage = goTransferPage;
window.toggleAgentStatus = toggleAgentStatus;
window.setAgentFilter = setAgentFilter;
