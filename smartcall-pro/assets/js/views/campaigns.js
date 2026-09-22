// View: Campaigns (外呼任务调度) v3 - 集成实时沙盒 Drawer

const CampaignsView = {
  render() { return renderCampaignsView(); }
};

// ── Sandbox state (drawer-level) ──
let _sandboxCampaignId = null;
let _sandboxOpen = false;
let _sandboxTimer = null;      // 对话流推进定时器
let _sandboxMsgIndex = 0;      // 已展示消息下标
let _sandboxElapsed = 0;       // 通话已进行秒数
let _sandboxLiveData = null;   // 当前沙盒实时数据快照

// ── 任务筛选状态 (真实联动) ──
let campaignSearch = '';
let campaignFilterStatus = 'ALL';
let campaignFilterType = 'ALL';

function setCampaignFilter(kind, val) {
  if (kind === 'search') campaignSearch = val;
  if (kind === 'status') campaignFilterStatus = val;
  if (kind === 'type') campaignFilterType = val;
  App.refreshCurrentView();
}

function resetCampaignFilters() {
  campaignSearch = ''; campaignFilterStatus = 'ALL'; campaignFilterType = 'ALL';
  App.showToast('筛选条件已重置', 'info');
  App.refreshCurrentView();
}

function filteredCampaigns() {
  return AppState.campaigns.filter(c => {
    const q = campaignSearch.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q);
    const matchStatus = campaignFilterStatus === 'ALL' ||
      (campaignFilterStatus === 'running' && c.status === 'running') ||
      (campaignFilterStatus === 'paused' && c.status === 'paused') ||
      (campaignFilterStatus === 'completed' && (c.status === 'completed' || c.status === 'draft'));
    const matchType = campaignFilterType === 'ALL' || c.type === campaignFilterType;
    return matchSearch && matchStatus && matchType;
  });
}

function renderCampaignsView() {
  const runningCount = AppState.campaigns.filter(c => c.status === 'running').length;
  const campaigns = filteredCampaigns();

  return `
    <div class="view-fade-enter">

      <!-- Page Header -->
      <div class="page-header">
        <div class="page-title-group">
          <div class="page-title">
            <i data-lucide="phone-outgoing"></i>
            外呼任务调度
          </div>
          <div class="page-subtitle">编排人群包 · AI人设 · 防骚扰时段 · 并发流速控制 · 实时通话监控</div>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary btn-sm" onclick="openCreateCampaignModal()">
            <i data-lucide="plus"></i>
            创建任务
          </button>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-top-row">
            <span class="metric-label">运行中</span>
            <div class="metric-icon-box accent-blue"><i data-lucide="radio"></i></div>
          </div>
          <div class="metric-value-row">
            <span class="metric-number" style="color:var(--brand-600);">${runningCount}</span>
            <span class="metric-unit">个</span>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-top-row">
            <span class="metric-label">并发线路</span>
            <div class="metric-icon-box accent-violet"><i data-lucide="phone-call"></i></div>
          </div>
          <div class="metric-value-row">
            <span class="metric-number">125</span>
            <span class="metric-unit">/200路</span>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-top-row">
            <span class="metric-label">加权接通率</span>
            <div class="metric-icon-box accent-emerald"><i data-lucide="phone-check"></i></div>
          </div>
          <div class="metric-value-row">
            <span class="metric-number" style="color:var(--emerald-600);">76.8</span>
            <span class="metric-unit">%</span>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-top-row">
            <span class="metric-label">熔断触发</span>
            <div class="metric-icon-box accent-emerald"><i data-lucide="shield-check"></i></div>
          </div>
          <div class="metric-value-row">
            <span class="metric-number" style="color:var(--emerald-600);">0</span>
            <span class="metric-unit">次</span>
          </div>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="filter-bar">
        <div style="position:relative;flex:1;min-width:160px;max-width:220px;">
          <i data-lucide="search" style="position:absolute;left:8px;top:50%;transform:translateY(-50%);width:12px;height:12px;color:var(--text-muted);"></i>
          <input type="text" class="form-input" style="width:100%;height:30px;padding:0 10px 0 26px;font-size:12px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;" placeholder="搜索任务名称..." value="${campaignSearch}" oninput="setCampaignFilter('search', this.value)">
        </div>
        <select class="form-select" style="height:30px;padding:0 24px 0 8px;font-size:12px;min-width:90px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;" onchange="setCampaignFilter('status', this.value)">
          <option value="ALL" ${campaignFilterStatus==='ALL'?'selected':''}>全部状态</option>
          <option value="running" ${campaignFilterStatus==='running'?'selected':''}>运行中</option>
          <option value="paused" ${campaignFilterStatus==='paused'?'selected':''}>已暂停</option>
          <option value="completed" ${campaignFilterStatus==='completed'?'selected':''}>已归档</option>
        </select>
        <select class="form-select" style="height:30px;padding:0 24px 0 8px;font-size:12px;min-width:90px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;" onchange="setCampaignFilter('type', this.value)">
          <option value="ALL" ${campaignFilterType==='ALL'?'selected':''}>全部类型</option>
          ${[...new Set(AppState.campaigns.map(c => c.type))].map(t => `<option value="${t}" ${campaignFilterType===t?'selected':''}>${t}</option>`).join('')}
        </select>
        <div class="filter-divider"></div>
        <div class="filter-actions">
          <span class="filter-count">${campaigns.length}个任务</span>
          <button class="btn btn-ghost btn-sm" style="height:28px;font-size:11px;" onclick="resetCampaignFilters()">
            <i data-lucide="rotate-ccw" style="width:11px;height:11px;"></i>重置
          </button>
        </div>
      </div>

      <!-- Campaign Cards -->
      <div style="display:flex;flex-direction:column;gap:var(--content-gap);">
        ${campaigns.map(c => `
          <div class="card" style="padding:12px 16px;">
            <!-- Layer 1: Title + Meta + Actions -->
            <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px;">
              <div style="min-width:0;flex:1;">
                <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                  <span style="font-size:13px;font-weight:700;color:var(--text-main);">${c.name}</span>
                  <span class="badge badge-warning" style="font-size:10px;line-height:16px;">${c.type}</span>
                  <span class="status-pill status-${c.status==='running'?'calling':c.status==='paused'?'pending':'connected'}">
                    <span class="status-pill-dot"></span>
                    ${c.status==='running'?'呼叫中':c.status==='paused'?'已暂停':'已归档'}
                  </span>
                </div>
                <div style="display:flex;gap:12px;margin-top:3px;flex-wrap:wrap;">
                  <span style="font-size:11px;color:var(--text-muted);display:inline-flex;align-items:center;gap:3px;">
                    <i data-lucide="bot" style="width:11px;height:11px;"></i>${c.aiPersona}
                  </span>
                  <span style="font-size:11px;color:var(--text-muted);display:inline-flex;align-items:center;gap:3px;">
                    <i data-lucide="mic" style="width:11px;height:11px;"></i>${c.voiceType}
                  </span>
                  <span style="font-size:11px;color:var(--text-muted);display:inline-flex;align-items:center;gap:3px;">
                    <i data-lucide="clock" style="width:11px;height:11px;"></i>${c.dailySchedule}
                  </span>
                </div>
              </div>
              <div style="display:flex;gap:4px;flex-shrink:0;margin-left:8px;align-items:center;">
                ${c.status === 'running' ? `
                  <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();openLiveSandbox('${c.id}')" style="color:var(--brand-600);border-color:var(--brand-200);background:var(--brand-50);">
                    <i data-lucide="radio" style="width:11px;height:11px;"></i>旁听
                  </button>
                  <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();openCampaignMonitor('${c.id}')">
                    <i data-lucide="bar-chart-3" style="width:11px;height:11px;"></i>监控
                  </button>
                  <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();toggleCampaignStatus('${c.id}','paused')">
                    <i data-lucide="pause" style="width:11px;height:11px;"></i>
                  </button>
                ` : `
                  <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();toggleCampaignStatus('${c.id}','running')">
                    <i data-lucide="play" style="width:11px;height:11px;"></i>启动
                  </button>
                `}
                <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();openCampaignSettings('${c.id}')" title="设置">
                  <i data-lucide="settings-2" style="width:12px;height:12px;"></i>
                </button>
              </div>
            </div>

            <!-- Layer 2: Progress bar -->
            <div style="background:var(--ink-50);border-radius:var(--radius-md);padding:8px 12px;">
              <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:5px;gap:12px;flex-wrap:wrap;">
                <span style="font-variant-numeric:tabular-nums;">进度 <strong style="color:var(--text-main);">${c.calledCount.toLocaleString()}</strong>/<strong>${c.totalLeads.toLocaleString()}</strong> (${c.progress}%)</span>
                <span style="font-variant-numeric:tabular-nums;color:var(--emerald-600);">接通 ${c.connectRate}</span>
                <span style="font-variant-numeric:tabular-nums;color:var(--rose-600);">高意向 ${c.highIntentCount}户</span>
                <span style="font-variant-numeric:tabular-nums;color:var(--emerald-600);">加微 ${c.wecomAddedCount}人</span>
              </div>
              <div class="progress-bar-container" style="height:5px;">
                <div class="progress-bar" style="width:${c.progress}%;background:linear-gradient(90deg,var(--brand-500),var(--violet-500));"></div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

    </div>
  `;
}

// ── Live Sandbox Drawer ──

function openLiveSandbox(campaignId) {
  _sandboxCampaignId = campaignId;
  _sandboxOpen = true;
  renderLiveSandbox();
}

function closeLiveSandbox() {
  _sandboxOpen = false;
  _sandboxCampaignId = null;
  stopSandboxTimer();
  const container = document.getElementById('live-sandbox-container');
  if (container) container.classList.remove('open');
}

function stopSandboxTimer() {
  if (_sandboxTimer) { clearInterval(_sandboxTimer); _sandboxTimer = null; }
}

function switchSandboxCampaign(campaignId) {
  _sandboxCampaignId = campaignId;
  stopSandboxTimer();
  renderLiveSandbox();
}

function formatSandboxTimer(totalSec) {
  return String(Math.floor(totalSec / 60)).padStart(2, '0') + ':' + String(totalSec % 60).padStart(2, '0');
}

function sandboxTypingHtml() {
  return `
    <div id="sandbox-typing" style="display:flex;align-items:center;gap:5px;padding:6px 10px;">
      <div class="typing-dots" style="transform:scale(0.8);"><span></span><span></span><span></span></div>
      <span style="font-size:10px;color:var(--text-muted);">AI思考中...</span>
    </div>
  `;
}

function toggleCampSwitcher() {
  const menu = document.getElementById('camp-switcher-menu');
  if (menu) menu.classList.toggle('open');
}

function renderLiveSandbox() {
  let container = document.getElementById('live-sandbox-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'live-sandbox-container';
    container.className = 'drawer-backdrop';
    container.onclick = (e) => { if (e.target === container) closeLiveSandbox(); };
    document.body.appendChild(container);
  }

  const campaign = AppState.campaigns.find(c => c.id === _sandboxCampaignId);
  if (!campaign) { closeLiveSandbox(); return; }

  const runningCamps = AppState.campaigns.filter(c => c.status === 'running');

  // Simulated per-campaign live data (deterministic by id)
  const liveData = getSandboxLiveData(campaign.id);
  _sandboxLiveData = liveData;
  _sandboxMsgIndex = 1;        // 初始展示前 2 条, 剩余由定时器推进
  _sandboxElapsed = 0;
  stopSandboxTimer();

  container.innerHTML = `
    <div class="drawer-panel drawer-wide" onclick="event.stopPropagation()" style="display:flex;flex-direction:column;">
      <!-- Drawer Header -->
      <div style="padding:12px 16px;border-bottom:1px solid var(--border-color);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;background:var(--bg-card);">
        <div style="display:flex;align-items:center;gap:8px;min-width:0;">
          <i data-lucide="radio" style="width:15px;height:15px;color:var(--brand-600);"></i>
          <span style="font-size:13px;font-weight:700;color:var(--text-main);white-space:nowrap;">AI 实时通话沙盒</span>
          <span class="live-dot" style="margin-left:2px;"></span>
          <div style="position:relative;margin-left:6px;">
            <button class="camp-switcher" onclick="toggleCampSwitcher()">
              <span style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500;color:var(--text-main);">${campaign.name.length > 18 ? campaign.name.slice(0,18)+'…' : campaign.name}</span>
              <i data-lucide="chevron-down" style="width:10px;height:10px;color:var(--text-muted);"></i>
            </button>
            <div id="camp-switcher-menu" class="camp-switcher-menu">
              ${runningCamps.map(rc => `
                <div class="camp-switcher-item" onclick="switchSandboxCampaign('${rc.id}')">
                  <span class="status-pill status-calling" style="flex-shrink:0;"><span class="status-pill-dot"></span></span>
                  <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:${rc.id===campaign.id?'var(--brand-600)':'var(--text-main)'};font-weight:${rc.id===campaign.id?'600':'400'};">${rc.name}</span>
                  <span style="font-size:10px;color:var(--text-muted);font-variant-numeric:tabular-nums;">${rc.progress}%</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        <div style="display:flex;gap:4px;align-items:center;">
          <button class="btn btn-ghost btn-sm" style="height:26px;padding:0 8px;font-size:10.5px;" onclick="App.showToast('已切换到静音监听模式','info')">
            <i data-lucide="volume-2" style="width:11px;height:11px;"></i>监听
          </button>
          <button class="btn btn-danger btn-sm" style="height:26px;padding:0 10px;font-size:10.5px;" onclick="App.showToast('已触发紧急切断 · 转人工坐席','warning');closeLiveSandbox();">
            <i data-lucide="phone-off" style="width:11px;height:11px;"></i>切断转人工
          </button>
          <button class="btn btn-ghost btn-sm" style="width:26px;height:26px;padding:0;" onclick="closeLiveSandbox()">
            <i data-lucide="x" style="width:14px;height:14px;"></i>
          </button>
        </div>
      </div>

      <!-- Call Info Bar -->
      <div style="padding:10px 16px;flex-shrink:0;">
        <div class="sandbox-callbar">
          <div style="display:flex;align-items:center;gap:7px;">
            <div class="lead-avatar-bubble" style="width:28px;height:28px;font-size:11px;">${liveData.lead.surname}</div>
            <div>
              <div style="font-size:11.5px;font-weight:600;color:var(--text-main);">${liveData.lead.name} <span style="font-size:10px;font-weight:400;color:var(--text-muted);">${liveData.lead.gender}·${liveData.lead.age}岁</span></div>
              <div style="font-size:10px;color:var(--text-muted);font-variant-numeric:tabular-nums;">${liveData.lead.phone} · ${liveData.lead.title}</div>
            </div>
          </div>
          <div style="width:1px;height:20px;background:var(--border-color);"></div>
          <div style="display:flex;gap:10px;font-size:10.5px;">
            <div><span style="color:var(--text-muted);">AI</span> <span style="font-weight:500;color:var(--text-main);margin-left:2px;">${campaign.aiPersona.split(' ')[0]}</span></div>
            <div><span style="color:var(--text-muted);">时长</span> <span style="font-weight:600;color:var(--brand-600);margin-left:2px;font-variant-numeric:tabular-nums;" id="sandbox-timer">${liveData.timer}</span></div>
          </div>
          <div style="flex:1;"></div>
          <div style="display:flex;align-items:center;gap:6px;min-width:200px;">
            <span style="font-size:10px;color:var(--text-muted);white-space:nowrap;">话术阶段</span>
            <div style="flex:1;height:3px;background:var(--ink-100);border-radius:2px;overflow:hidden;">
              <div class="sandbox-stage-bar" style="width:${liveData.stageProgress}%;height:100%;background:linear-gradient(90deg,var(--brand-500),var(--violet-500));border-radius:2px;"></div>
            </div>
            <span class="sandbox-stage-label" style="font-size:10px;font-weight:600;color:var(--brand-600);white-space:nowrap;">${liveData.currentStage}</span>
          </div>
        </div>
      </div>

      <!-- Three-column Sandbox Grid -->
      <div style="flex:1;min-height:0;padding:0 16px 12px;display:flex;flex-direction:column;">
        <div class="sandbox-grid">
          <!-- LEFT: Intent + Sentiment + Suggestions -->
          <div class="sandbox-panel">
            <div class="sandbox-mini-card">
              <div class="sandbox-mini-title"><i data-lucide="tags" style="width:11px;height:11px;color:var(--brand-500);"></i>实时意图标签</div>
              <div style="display:flex;flex-wrap:wrap;gap:3px;">
                ${liveData.intents.map(t => `
                  <span class="badge badge-primary" style="font-size:9.5px;line-height:15px;">${t}</span>
                `).join('')}
              </div>
            </div>

            <div class="sandbox-mini-card">
              <div class="sandbox-mini-title"><i data-lucide="activity" style="width:11px;height:11px;color:var(--emerald-500);"></i>情绪指数</div>
              <div style="display:flex;align-items:center;gap:8px;">
                <div style="width:52px;height:52px;border-radius:50%;background:conic-gradient(var(--emerald-500) 0deg ${liveData.sentiment*3.6}deg, var(--ink-100) ${liveData.sentiment*3.6}deg 360deg);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <div style="width:40px;height:40px;border-radius:50%;background:var(--bg-card);display:flex;align-items:center;justify-content:center;flex-direction:column;">
                    <span style="font-size:13px;font-weight:700;color:var(--emerald-600);line-height:1;">${liveData.sentiment}</span>
                    <span style="font-size:7px;color:var(--text-muted);">积极</span>
                  </div>
                </div>
                <div style="flex:1;font-size:10px;color:var(--text-secondary);line-height:1.5;">
                  <div style="color:var(--emerald-600);font-weight:500;margin-bottom:1px;">✓ ${liveData.sentimentAdvice.title}</div>
                  ${liveData.sentimentAdvice.desc}
                </div>
              </div>
            </div>

            <div class="sandbox-mini-card">
              <div class="sandbox-mini-title"><i data-lucide="lightbulb" style="width:11px;height:11px;color:var(--amber-500);"></i>AI话术建议</div>
              <div style="display:flex;flex-direction:column;gap:3px;">
                ${liveData.suggestions.map(a => `
                  <button class="btn btn-ghost btn-sm" style="justify-content:flex-start;padding:5px 6px;font-size:10px;height:auto;line-height:1.4;text-align:left;background:${a.hot?'var(--brand-50)':'transparent'};border-color:${a.hot?'var(--brand-100)':'transparent'};">
                    <i data-lucide="${a.icon}" style="width:10px;height:10px;margin-right:4px;color:${a.hot?'var(--brand-500)':'var(--text-muted)'};"></i>
                    <span style="flex:1;">${a.text}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- CENTER: Live Transcript -->
          <div class="sandbox-transcript">
            <div class="sandbox-transcript-header">
              <div class="sandbox-mini-title" style="margin:0;"><i data-lucide="message-square-text" style="width:11px;height:11px;color:var(--brand-500);"></i>实时对话流 (ASR+LLM)</div>
              <div style="display:flex;gap:3px;">
                <span style="font-size:9px;padding:1px 5px;background:var(--emerald-50);color:var(--emerald-700);border-radius:3px;font-weight:500;">双工监听</span>
              </div>
            </div>
            <div class="sandbox-transcript-body" id="sandbox-transcript">
              ${liveData.messages.slice(0, _sandboxMsgIndex + 1).map(m => renderSandboxMessage(m)).join('')}
              ${sandboxTypingHtml()}
            </div>
          </div>

          <!-- RIGHT: Metrics + Keywords + Score -->
          <div class="sandbox-panel">
            <div class="sandbox-mini-card">
              <div class="sandbox-mini-title"><i data-lucide="gauge" style="width:11px;height:11px;color:var(--violet-500);"></i>本轮指标</div>
              <div class="sandbox-kv">
                ${liveData.metrics.map(k => `
                  <div class="sandbox-kv-item">
                    <div class="sandbox-kv-val" ${k.id ? `id="${k.id}"` : ''} style="color:${k.color};">${k.val}</div>
                    <div class="sandbox-kv-lbl">${k.label}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="sandbox-mini-card">
              <div class="sandbox-mini-title"><i data-lucide="key" style="width:11px;height:11px;color:var(--amber-500);"></i>提取关键词</div>
              <div style="display:flex;flex-direction:column;gap:2px;font-size:10px;">
                ${liveData.keywords.map(r => `
                  <div style="display:flex;justify-content:space-between;gap:4px;padding:2px 0;border-bottom:1px solid var(--border-subtle);">
                    <span style="color:var(--text-muted);">${r.k}</span>
                    <span style="color:var(--text-main);font-weight:500;">${r.v}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="sandbox-mini-card">
              <div class="sandbox-mini-title"><i data-lucide="star" style="width:11px;height:11px;color:var(--rose-500);"></i>意向评分</div>
              <div style="text-align:center;padding:4px 0 2px;">
                <div style="font-size:24px;font-weight:800;background:linear-gradient(135deg,var(--brand-500),var(--violet-500));-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-variant-numeric:tabular-nums;line-height:1;">${liveData.scoreGrade} · ${liveData.score}</div>
                <div style="font-size:9px;color:var(--text-muted);margin-top:3px;line-height:1.4;">${liveData.scoreNote}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  container.classList.add('open');
  if (window.lucide) lucide.createIcons();

  // 启动对话流推进引擎: 每 3.2s 追加一条 AI/客户消息
  _sandboxTimer = setInterval(advanceSandbox, 3200);

  // Scroll transcript to bottom
  setTimeout(() => {
    const body = document.getElementById('sandbox-transcript');
    if (body) body.scrollTop = body.scrollHeight;
    // Close switcher when clicking outside
    document.addEventListener('click', closeCampSwitcherOnOutside, { once: true });
  }, 50);
}

// ── 对话流推进引擎 (实时追加消息 + 更新指标) ──
function advanceSandbox() {
  const data = _sandboxLiveData;
  const body = document.getElementById('sandbox-transcript');
  if (!data || !body) { stopSandboxTimer(); return; }

  _sandboxElapsed += 3;
  const total = data.messages.length;
  const idx = _sandboxMsgIndex + 1;

  // 移除上一轮 "AI思考中" 占位
  const typing = document.getElementById('sandbox-typing');
  if (typing) typing.remove();

  if (idx < total) {
    // 追加下一条消息
    const wrapper = document.createElement('div');
    wrapper.innerHTML = renderSandboxMessage(data.messages[idx]);
    body.appendChild(wrapper.firstElementChild);
    _sandboxMsgIndex = idx;

    // 还有剩余消息 → 重新挂载打字占位
    if (_sandboxMsgIndex + 1 < total) {
      body.insertAdjacentHTML('beforeend', sandboxTypingHtml());
    }
  } else {
    // 对话播完 → 结束分流块 + 状态回写联动
    finishSandboxCall();
    return;
  }

  // 更新计时器
  const timerEl = document.getElementById('sandbox-timer');
  if (timerEl) timerEl.textContent = formatSandboxTimer(_sandboxElapsed);

  // 更新对话轮次
  const roundsEl = document.getElementById('sandbox-rounds');
  if (roundsEl) roundsEl.textContent = String(_sandboxMsgIndex + 1);

  // 更新话术阶段进度
  const stageBar = document.querySelector('.sandbox-callbar .sandbox-stage-bar');
  const stageLabel = document.querySelector('.sandbox-callbar .sandbox-stage-label');
  const stages = data.stages || [];
  if (stageBar && stages.length) {
    const prog = Math.min(100, data.stageProgress + _sandboxMsgIndex * 8);
    stageBar.style.width = prog + '%';
    if (stageLabel) {
      const seg = Math.min(stages.length - 1, Math.floor(prog / 100 * stages.length));
      stageLabel.textContent = stages[seg];
    }
  }

  body.scrollTop = body.scrollHeight;
}

// ── 通话结束: 展示分流结果 + 画像/意向真实回写 (对应"通话中识别并保存信息") ──
function finishSandboxCall() {
  const data = _sandboxLiveData;
  const body = document.getElementById('sandbox-transcript');
  if (!data || !body) return;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div style="display:flex;align-items:center;gap:9px;padding:10px 12px;margin-top:8px;background:linear-gradient(135deg,rgba(16,185,129,0.08),rgba(14,165,233,0.08));border:1px solid rgba(16,185,129,0.25);border-radius:var(--radius-md);">
      <div style="width:28px;height:28px;border-radius:50%;background:var(--emerald-500);color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 8px rgba(16,185,129,0.3);">
        <i data-lucide="check-circle-2" style="width:14px;height:14px;"></i>
      </div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:11.5px;font-weight:700;color:var(--text-main);">通话完成 · AI 判定 ${data.scoreGrade}级高意向（${data.score}分）</div>
        <div style="font-size:10.5px;color:var(--text-secondary);margin-top:2px;line-height:1.5;">
          已自动提取画像并回写：意向分级、择偶偏好、企微添加任务 → 红娘工作台「待认领」看板已生成待办
        </div>
      </div>
    </div>
  `;
  body.appendChild(wrapper.firstElementChild);
  if (window.lucide) lucide.createIcons();

  // 画像/意向真实回写 (对应产品逻辑: 通话中 ASR 提取 → 结构化保存)
  const lead = AppState.resolveLead({ name: data.lead.name, age: data.lead.age, phone: data.lead.phone });
  if (lead) {
    AppState.applyIntentGrade(lead, data.score);
    AppState.transferToMatchmaker(lead, `AI实时沙盒通话完成：判定${data.scoreGrade}级（${data.score}分），企微已推送`);
  } else {
    AppState.recordAudit('智能外呼', '沙盒通话完成', data.lead.name, '成功', `AI 判定 ${data.scoreGrade}级（${data.score}分），潜客未在演示池中，仅记录审计`);
  }

  stopSandboxTimer();
  body.scrollTop = body.scrollHeight;
}

function closeCampSwitcherOnOutside(e) {
  const menu = document.getElementById('camp-switcher-menu');
  const switcher = e.target.closest('.camp-switcher');
  if (menu && !switcher) menu.classList.remove('open');
}

function renderSandboxMessage(m) {
  if (m.role === 'ai') {
    return `
      <div style="display:flex;gap:5px;align-items:flex-start;">
        <div style="width:18px;height:18px;border-radius:50%;background:linear-gradient(135deg,var(--brand-500),var(--violet-500));color:#fff;display:flex;align-items:center;justify-content:center;font-size:8px;flex-shrink:0;">AI</div>
        <div class="msg-bubble ai" style="max-width:78%;padding:6px 10px;">
          <div style="font-size:11px;line-height:1.55;">${m.text}</div>
          <div style="font-size:9px;color:var(--text-muted);margin-top:2px;font-variant-numeric:tabular-nums;">${m.time} · ${m.emotion}</div>
        </div>
      </div>
    `;
  } else {
    return `
      <div style="display:flex;gap:5px;align-items:flex-start;justify-content:flex-end;flex-direction:row-reverse;">
        <div style="width:18px;height:18px;border-radius:50%;background:var(--ink-200);color:var(--text-main);display:flex;align-items:center;justify-content:center;font-size:8px;flex-shrink:0;">${m.avatar || '客'}</div>
        <div class="msg-bubble human" style="max-width:78%;padding:6px 10px;">
          <div style="font-size:11px;line-height:1.55;">${m.text}</div>
          <div style="font-size:9px;color:var(--text-muted);margin-top:2px;text-align:right;font-variant-numeric:tabular-nums;">${m.time} · ${m.emotion}</div>
        </div>
      </div>
    `;
  }
}

// ── Deterministic live data per campaign (hash-based) ──
function getSandboxLiveData(campId) {
  const seed = campId.split('').reduce((s,c) => s + c.charCodeAt(0), 0);
  const pick = (arr) => arr[seed % arr.length];
  const num = (min, max) => min + (seed % (max - min + 1));

  const leadProfiles = [
    { name:'王建国', surname:'王', gender:'男', age:35, phone:'138****5678', title:'字节跳动·算法工程师' },
    { name:'李思远', surname:'李', gender:'男', age:32, phone:'139****2341', title:'阿里巴巴·P7技术专家' },
    { name:'张雨桐', surname:'张', gender:'女', age:29, phone:'137****8902', title:'网易·资深UI设计师' },
    { name:'陈明轩', surname:'陈', gender:'男', age:34, phone:'136****4521', title:'海康威视·产品经理' },
    { name:'赵雅婷', surname:'赵', gender:'女', age:28, phone:'135****7834', title:'浙江大学·辅导员' }
  ];

  const stages = ['开场破冰','需求挖掘','加微铺垫','邀约确认','异议处理'];
  const stageIdx = seed % stages.length;

  const messageSets = [
    [
      {role:'ai',time:'00:01',text:'您好王先生！我是知缘婚恋的资深红娘助理。看您之前登记过在杭州从事IT研发，今天特意同步个好消息~',emotion:'热情'},
      {role:'user',time:'00:08',text:'哦，你们是相亲平台吧？我平时工作挺忙的，周末经常加班没时间。',emotion:'中性',avatar:'王'},
      {role:'ai',time:'00:15',text:'特别理解您！程序员研发确实忙，所以我们专门做1对1精准前置匹配。我们库里正好有一位同在滨江网易的UI设计师姑娘，浙大毕业，也喜欢摄影。',emotion:'真诚'},
      {role:'user',time:'00:32',text:'听起来还挺巧的，她多大啊？有什么爱好？',emotion:'兴趣',avatar:'王'},
      {role:'ai',time:'00:38',text:'姑娘是96年的，性格特别温和爱笑。我让专属红娘老师通过企微把脱敏资料发您过目，您看可以吗？',emotion:'期待'},
      {role:'user',time:'00:52',text:'可以，微信号就是我手机号，让她加我吧。',emotion:'积极',avatar:'王'},
      {role:'ai',time:'01:02',text:'太棒了！微信申请马上发出，备注写"知缘校友"。另外周六下午西溪湿地有一场名校青年冷餐会，我看您很匹配，需要帮您留个名额吗？',emotion:'热情'},
      {role:'user',time:'01:20',text:'周六我看看吧，如果没别的事就去。',emotion:'接受',avatar:'王'},
      {role:'ai',time:'01:28',text:'好的王先生！那我先把您的意向登记给红娘老师，祝您今天工作顺心，再见！',emotion:'礼貌收尾'}
    ],
    [
      {role:'ai',time:'00:02',text:'李哥您好！我是知缘婚恋的红娘助理小悦~ 之前看到您登记的信息，我们近期有一位特别匹配的姑娘想给您介绍。',emotion:'热情'},
      {role:'user',time:'00:12',text:'我之前注册过但没怎么用，你们收费贵不贵啊？',emotion:'谨慎',avatar:'李'},
      {role:'ai',time:'00:19',text:'理解您的顾虑！我们基础匹配是完全免费的，只有您觉得双方条件合适、想安排线下见面时才会涉及红娘深度服务。先加个微信我把资料发您看看？',emotion:'诚恳'},
      {role:'user',time:'00:41',text:'那行吧，你先加我，我资料看看再说。',emotion:'接受',avatar:'李'},
      {role:'ai',time:'00:50',text:'好的！加您后我会发3位匹配嘉宾的脱敏资料卡。顺便问下，您对女生的学历或职业有什么硬性要求吗？我帮您把把关。',emotion:'贴心'},
      {role:'user',time:'01:05',text:'最好是老师或者体制内的，稳定一点，学历本科以上就行。',emotion:'明确',avatar:'李'},
      {role:'ai',time:'01:12',text:'明白了，教师和公务员方向我们库里有不少优质资源！这就帮您标注优先级，稍后红娘老师会给您发第一批匹配资料。',emotion:'确认'},
      {role:'user',time:'01:25',text:'行，那就先这样，资料发我看看。',emotion:'平静',avatar:'李'},
      {role:'ai',time:'01:32',text:'好的李哥，资料马上到，有任何问题随时微信联系我，祝您顺利！',emotion:'礼貌收尾'}
    ],
    [
      {role:'ai',time:'00:01',text:'张小姐您好，我是知缘婚恋的红娘顾问婉清。看到您的资料，我们有几位非常优秀的男士想给您推荐~',emotion:'温和'},
      {role:'user',time:'00:10',text:'我最近刚分手，还没完全准备好，你们怎么拿到我电话的？',emotion:'戒备',avatar:'张'},
      {role:'ai',time:'00:17',text:'非常抱歉打扰您。您的号码是之前您朋友帮您登记在我们优质单身资源库中的。如果现在不方便，我可以先记录您的偏好，等您准备好再联系。',emotion:'体贴'},
      {role:'user',time:'00:35',text:'那…你说说都是什么条件的？我先听听。',emotion:'松动',avatar:'张'},
      {role:'ai',time:'00:44',text:'好的~ 我们这边有几位年龄28-32岁、985硕士、杭州有房、性格稳重的男士，比如一位浙大计算机硕士在阿里做技术专家，平时喜欢徒步和摄影。',emotion:'耐心'},
      {role:'user',time:'01:02',text:'听起来条件确实不错，但我现在这个状态，怕见面了尴尬。',emotion:'犹豫',avatar:'张'},
      {role:'ai',time:'01:10',text:'完全理解！我们不急着安排见面，可以先加微信，让红娘老师陪您慢慢聊，您有感觉了再决定是否见面，一切以您的节奏为准。',emotion:'共情'},
      {role:'user',time:'01:28',text:'好吧，那你加我微信，我先看看再说。',emotion:'接受',avatar:'张'},
      {role:'ai',time:'01:36',text:'好的张小姐，微信申请马上发出，红娘老师会温柔地陪您慢慢来，再见！',emotion:'礼貌收尾'}
    ]
  ];

  const suggestionSets = [
    [{icon:'thumbs-up',text:'肯定对方学历背景，拉近距离',hot:true},{icon:'calendar',text:'试探周末时间，铺垫线下见',hot:false},{icon:'user-plus',text:'顺势提出加微信，发资料',hot:true}],
    [{icon:'shield-check',text:'强调基础服务免费，消除顾虑',hot:true},{icon:'file-text',text:'先发资料降低决策门槛',hot:true},{icon:'clock',text:'约定具体回访时间',hot:false}],
    [{icon:'heart',text:'共情失恋经历，建立信任',hot:true},{icon:'ear',text:'多倾听少推销，降低防备',hot:true},{icon:'user-plus',text:'待时机成熟再加微',hot:false}]
  ];

  const keywordSets = [
    [{k:'学历要求',v:'985/211本科+'},{k:'年龄范围',v:'28-33岁'},{k:'地域偏好',v:'杭州主城区'},{k:'职业偏好',v:'体制内/教师'}],
    [{k:'费用敏感',v:'高'},{k:'决策周期',v:'需要考虑'},{k:'沟通偏好',v:'微信先聊'},{k:'时间安排',v:'周末有空'}],
    [{k:'情感状态',v:'刚分手'},{k:'戒备等级',v:'高'},{k:'核心需求',v:'安全感'},{k:'沟通节奏',v:'慢热型'}]
  ];

  const idx = seed % messageSets.length;
  const sentiment = 55 + (seed % 30);
  const score = 75 + (seed % 25);
  const grade = score >= 90 ? 'S' : score >= 80 ? 'A' : 'B';

  return {
    lead: leadProfiles[seed % leadProfiles.length],
    timer: `${String(num(1,9)).padStart(2,'0')}:${String(num(0,59)).padStart(2,'0')}`,
    stages,
    stageProgress: 25 + (stageIdx * 15) + (seed % 12),
    currentStage: stages[stageIdx],
    intents: pick([
      ['高学历要求','周末可约见','情绪积极','名校情结'],
      ['费用敏感','需要考虑','微信沟通','不排斥'],
      ['刚分手','戒备心强','需要安全感','慢热型'],
      ['有房有车','介意年龄差','不排斥闪婚','情绪稳定']
    ]),
    sentiment,
    sentimentAdvice: sentiment >= 70
      ? { title:'兴趣高涨', desc:'建议继续推进约见意向，适时提出线下邀约' }
      : { title:'情绪平稳', desc:'建议继续挖掘需求，避免过早进入推销环节' },
    suggestions: suggestionSets[idx],
    messages: messageSets[idx],
    metrics: [
      {val:String(8+seed%8), label:'对话轮次', color:'var(--text-main)', id:'sandbox-rounds'},
      {val:`${78+seed%18}%`, label:'应答自然度', color:'var(--emerald-600)'},
      {val:`${(3+seed%5)/10}s`, label:'ASR延迟', color:'var(--brand-600)'},
      {val:`${(18+seed%12)/10}s`, label:'LLM响应', color:'var(--violet-600)'}
    ],
    keywords: keywordSets[idx],
    score,
    scoreGrade: grade,
    scoreNote: grade === 'S' ? '高意向，通话结束后自动推送至红娘待办' : grade === 'A' ? '中高意向，建议红娘24h内跟进' : '继续培育，标记为潜力线索'
  };
}

// ── Actions ──

function toggleCampaignStatus(id, newStatus) {
  const c = AppState.campaigns.find(x => x.id === id);
  if (c) {
    AppState.updateCampaignStatus(id, newStatus);
    App.showToast(`任务【${c.name.slice(0,16)}…】已${newStatus==='running'?'启动':'暂停'}`, 'success');
    App.refreshCurrentView();
  }
}

function openCreateCampaignModal() {
  const pool = (AppState.shared && AppState.shared.importPool) || { total:100, pending:20, approved:80, blacklist:3, unsub:2, dup:5, formatErr:2 };
  const availLeads = pool.approved || 0;
  App.showModal({
    title: '创建外呼任务 · 启动前检查',
    size: 'lg',
    content: `
      <div style="padding:4px 0;display:flex;flex-direction:column;gap:12px;">
        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label">任务名称</label>
          <input type="text" id="new_campaign_name" class="form-input" placeholder="例如：杭州地区30+高净值男性唤醒" style="height:32px;width:100%;" value="杭州地区30+高净值男性唤醒_0820">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label">AI人设/流程 <span style="color:var(--rose-500);">*</span></label>
            <select class="form-select" style="height:32px;width:100%;">
              <option selected>婚恋首次筛选-v3.2（已发布）</option>
              <option>二次回访跟进-v2.1</option>
              <option>产品介绍与邀约-v1.5</option>
            </select>
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label">TTS音色</label>
            <select class="form-select" style="height:32px;width:100%;">
              <option selected>知心大姐姐·芳姐（王牌）</option>
              <option>活力闺蜜·萌萌</option>
              <option>端庄知性·林老师</option>
            </select>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label">外呼线路 <span style="color:var(--rose-500);">*</span></label>
            <select class="form-select" style="height:32px;width:100%;">
              <option selected>杭州电信主线路-01（并发45/60·健康）</option>
              <option>杭州联通备用-02（并发22/30·健康）</option>
              <option style="color:var(--amber-600);">宁波电信-04（并发58/60·拥塞）</option>
              <option disabled style="color:var(--text-muted);">固话网关-05（离线·不可用）</option>
              <option disabled style="color:var(--text-muted);">容灾线路-06（未验证）</option>
            </select>
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label">绑定知识库</label>
            <select class="form-select" style="height:32px;width:100%;">
              <option selected>婚恋嘉宾资料库（已连接·1420篇）</option>
              <option>会员产品话术库</option>
              <option>常见异议应答库</option>
              <option>不绑定知识库</option>
            </select>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label">名单分组</label>
            <select class="form-select" style="height:32px;width:100%;">
              <option selected>杭州30+男性（导入08-20）</option>
              <option>上周留资未接通</option>
              <option>二次唤醒池</option>
            </select>
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label">转人工队列</label>
            <select class="form-select" style="height:32px;width:100%;">
              <option selected>高意向-金牌红娘（等待2人）</option>
              <option>中意向-普通承接（等待5人）</option>
            </select>
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label">并发上限</label>
            <input type="number" class="form-input" value="20" style="height:32px;width:100%;">
          </div>
        </div>

        <!-- 名单预估摘要 -->
        <div style="padding:10px 12px;background:var(--ink-50);border-radius:var(--radius-md);border:1px solid var(--border-subtle);">
          <div style="font-size:11px;font-weight:600;color:var(--text-main);margin-bottom:6px;display:flex;align-items:center;gap:5px;">
            <i data-lucide="calculator" style="width:12px;height:12px;color:var(--brand-500);"></i>有效名单预估（频控与合规过滤后）
          </div>
          <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;font-size:10.5px;">
            <div style="text-align:center;padding:6px 4px;background:#fff;border-radius:var(--radius-sm);">
              <div style="color:var(--text-muted);margin-bottom:2px;">原始名单</div>
              <div style="font-size:14px;font-weight:700;color:var(--text-main);font-variant-numeric:tabular-nums;">${pool.total}</div>
            </div>
            <div style="text-align:center;padding:6px 4px;background:#fff;border-radius:var(--radius-sm);">
              <div style="color:var(--text-muted);margin-bottom:2px;">频控拦截</div>
              <div style="font-size:14px;font-weight:700;color:var(--amber-600);font-variant-numeric:tabular-nums;">-${(pool.dup||0)+(pool.formatErr||0)}</div>
            </div>
            <div style="text-align:center;padding:6px 4px;background:#fff;border-radius:var(--radius-sm);">
              <div style="color:var(--text-muted);margin-bottom:2px;">黑名单/退订</div>
              <div style="font-size:14px;font-weight:700;color:var(--rose-600);font-variant-numeric:tabular-nums;">-${(pool.blacklist||0)+(pool.unsub||0)}</div>
            </div>
            <div style="text-align:center;padding:6px 4px;background:#fff;border-radius:var(--radius-sm);">
              <div style="color:var(--text-muted);margin-bottom:2px;">待授权</div>
              <div style="font-size:14px;font-weight:700;color:var(--amber-600);font-variant-numeric:tabular-nums;">-${pool.pending}</div>
            </div>
            <div style="text-align:center;padding:6px 4px;background:var(--emerald-50);border-radius:var(--radius-sm);border:1px solid var(--emerald-200);">
              <div style="color:var(--emerald-700);margin-bottom:2px;">可外呼</div>
              <div style="font-size:14px;font-weight:700;color:var(--emerald-600);font-variant-numeric:tabular-nums;">${availLeads}</div>
            </div>
          </div>
        </div>

        <!-- 启动前检查清单 -->
        <div style="padding:10px 12px;background:var(--brand-50);border:1px solid var(--brand-200);border-radius:var(--radius-md);">
          <div style="font-size:11px;font-weight:600;color:var(--brand-700);margin-bottom:6px;display:flex;align-items:center;gap:5px;">
            <i data-lucide="check-circle" style="width:12px;height:12px;"></i>启动前检查清单
          </div>
          <div style="display:flex;flex-direction:column;gap:4px;font-size:10.5px;">
            <label style="display:flex;align-items:center;gap:6px;color:var(--text-secondary);"><input type="checkbox" checked style="accent-color:var(--brand-500);width:12px;height:12px;"> AI流程版本已发布（v3.2）</label>
            <label style="display:flex;align-items:center;gap:6px;color:var(--text-secondary);"><input type="checkbox" checked style="accent-color:var(--brand-500);width:12px;height:12px;"> 外呼线路健康，并发充足</label>
            <label style="display:flex;align-items:center;gap:6px;color:var(--text-secondary);"><input type="checkbox" checked style="accent-color:var(--brand-500);width:12px;height:12px;"> 知识库已连接（1420篇，延迟120ms）</label>
            <label style="display:flex;align-items:center;gap:6px;color:var(--text-secondary);"><input type="checkbox" checked style="accent-color:var(--brand-500);width:12px;height:12px;"> 频控规则已启用（7天1次，避开午休/晚间）</label>
            <label style="display:flex;align-items:center;gap:6px;color:var(--text-secondary);"><input type="checkbox" checked style="accent-color:var(--brand-500);width:12px;height:12px;"> 转人工队列可用（2位空闲坐席）</label>
            <label style="display:flex;align-items:center;gap:6px;color:var(--rose-600);"><input type="checkbox" style="accent-color:var(--rose-500);width:12px;height:12px;"> 火山TTS异常待处理 <span style="font-size:9.5px;color:var(--rose-500);">（将自动切换到备用TTS）</span></label>
          </div>
        </div>
      </div>
    `,
    confirmText: '创建并启动',
    onConfirm: () => {
      const nameInput = document.getElementById('new_campaign_name');
      const name = nameInput && nameInput.value.trim() ? nameInput.value.trim() : '杭州地区30+高净值男性唤醒_0820';
      const c = AppState.createCampaign({ name, totalLeads: availLeads, status: 'running', concurrency: 20 });
      App.showToast(`任务「${c.name}」创建成功并已启动（${availLeads}条有效名单）`, 'success');
      App.refreshCurrentView();
    }
  });
}

function openCampaignSettings(id) { App.showToast('打开任务配置', 'info'); }

window.CampaignsView = CampaignsView;
window.openLiveSandbox = openLiveSandbox;
window.closeLiveSandbox = closeLiveSandbox;
window.switchSandboxCampaign = switchSandboxCampaign;
window.toggleCampSwitcher = toggleCampSwitcher;
window.setCampaignFilter = setCampaignFilter;
window.resetCampaignFilters = resetCampaignFilters;
