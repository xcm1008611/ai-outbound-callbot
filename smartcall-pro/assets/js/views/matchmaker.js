// View: Matchmaker (红娘跟进工作台) v2 - 看板+列表双模式 · SLA倒计时 · 认领转派 · 跟进回写

const MatchmakerView = {
  activeTab: 'kanban', // kanban | list
  currentFilter: 'all', // all | high_intent | need_wecom | urgent | overdue
  searchQuery: '',

  // Matchmaker list for reassignment
  matchmakers: [
    { id: 'M01', name: '林晓梅', title: '资深红娘组长', currentLoad: 12, maxLoad: 20, tag: '高知硕博专场' },
    { id: 'M02', name: '苏雨薇', title: '高端定制红娘', currentLoad: 16, maxLoad: 20, tag: '财富精英' },
    { id: 'M03', name: '周敏', title: '白领专属红娘', currentLoad: 8, maxLoad: 20, tag: '大厂IT/教师' },
    { id: 'M04', name: '王丽娟', title: '资深婚恋顾问', currentLoad: 14, maxLoad: 20, tag: '传统相亲' }
  ],

  render() {
    const leads = AppState.leads || [];

    let filteredLeads = leads.filter(l => {
      if (this.currentFilter === 'high_intent') return l.tier === 'S' || l.tier === 'A';
      if (this.currentFilter === 'need_wecom') return l.status === 'connected' || l.status === 'claimed';
      if (this.currentFilter === 'urgent') return l.tier === 'S' && l.status !== 'wecom_added';
      if (this.currentFilter === 'overdue') return l.slaRemainingSec !== undefined && l.slaRemainingSec <= 0;
      return true;
    });

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filteredLeads = filteredLeads.filter(l =>
        l.name.toLowerCase().includes(q) || l.phone.includes(q) || (l.occupation && l.occupation.toLowerCase().includes(q))
      );
    }

    const stages = [
      { id: 'pending_claim', title: '待认领/待分配', color: 'var(--amber-500)', icon: 'user-plus' },
      { id: 'need_wecom', title: '高意向待加微', color: 'var(--rose-500)', icon: 'flame' },
      { id: 'wecom_added', title: '已加微待破冰', color: 'var(--brand-500)', icon: 'message-circle' },
      { id: 'inviting', title: '邀约到店中', color: 'var(--violet-500)', icon: 'calendar' },
      { id: 'signed', title: '已到店/签约', color: 'var(--emerald-500)', icon: 'check-circle-2' }
    ];

    // SLA & KPI stats
    const highIntentCount = leads.filter(l => l.tier === 'S' || l.tier === 'A').length;
    const pendingClaimCount = leads.filter(l => l.status === 'pending' || l.status === 'connected').length;
    const wecomAddedCount = leads.filter(l => l.status === 'wecom_added').length;

    return `
      <div class="view-fade-enter">
        <!-- Page Header -->
        <div class="page-header">
          <div class="page-title-group">
            <div class="page-title">
              <i data-lucide="heart-handshake"></i>
              红娘跟进工作台
              <span class="badge badge-success" style="margin-left:8px;font-size:10px;">SLA 黄金响应监控</span>
            </div>
            <div class="page-subtitle">AI初筛高意向分流 · 智能名片诱饵 · 企微一键破冰 · 结果回写同步</div>
          </div>
          <div class="page-actions">
            <div class="tab-group">
              <button class="tab-btn ${this.activeTab === 'kanban' ? 'active' : ''}" onclick="MatchmakerView.switchTab('kanban')">
                <i data-lucide="columns"></i>看板
              </button>
              <button class="tab-btn ${this.activeTab === 'list' ? 'active' : ''}" onclick="MatchmakerView.switchTab('list')">
                <i data-lucide="list"></i>列表
              </button>
            </div>
            <button class="btn btn-outline btn-sm" onclick="MatchmakerView.showBatchAssignModal()">
              <i data-lucide="users"></i>批量转派
            </button>
            <button class="btn btn-primary btn-sm" onclick="MatchmakerView.showBatchWeComModal()">
              <i data-lucide="user-plus"></i>一键批量加微 (${filteredLeads.filter(l => (l.tier==='S'||l.tier==='A') && l.status !== 'wecom_added').length})
            </button>
          </div>
        </div>

        <!-- SLA Warning Banner if Overdue -->
        <div style="background:linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.05));border:1px solid rgba(245,158,11,0.25);border-radius:var(--radius-md);padding:8px 14px;margin-bottom:var(--content-gap);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <i data-lucide="timer" style="width:16px;height:16px;color:var(--amber-600);flex-shrink:0;"></i>
            <span style="font-size:11.5px;color:var(--text-main);">
              <strong>SLA黄金3分钟机制：</strong> AI判定为 S/A 级意向后，要求 <strong>3分钟内</strong> 微信建联，<strong>15分钟内</strong> 破冰互动。当前响应达标率 <strong style="color:var(--emerald-600);">94.2%</strong>
            </span>
          </div>
          <span style="font-size:11px;color:var(--text-muted);">
            当前待认领线索: <strong style="color:var(--rose-600);">${pendingClaimCount}</strong> 条 · 超时预警: <strong>0</strong> 条
          </span>
        </div>

        <!-- Compact KPIs -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-top-row">
              <span class="metric-label">今日高意向转入(S/A)</span>
              <div class="metric-icon-box accent-rose"><i data-lucide="flame"></i></div>
            </div>
            <div class="metric-value-row">
              <span class="metric-number" style="color:var(--rose-600);">${highIntentCount}</span><span class="metric-unit">人</span>
              <span class="metric-trend up"><i data-lucide="trending-up" style="width:10px;height:10px;"></i>+33%</span>
            </div>
            <div style="font-size:10.5px;color:var(--text-muted);margin-top:2px;">AI电话判定意向分 ≥ 85</div>
          </div>
          <div class="metric-card">
            <div class="metric-top-row">
              <span class="metric-label">平均加微建联时长</span>
              <div class="metric-icon-box accent-blue"><i data-lucide="clock"></i></div>
            </div>
            <div class="metric-value-row">
              <span class="metric-number">2.8</span><span class="metric-unit">分钟</span>
            </div>
            <div style="font-size:10.5px;color:var(--emerald-600);margin-top:2px;">黄金3分钟达标</div>
          </div>
          <div class="metric-card">
            <div class="metric-top-row">
              <span class="metric-label">已加微破冰客户</span>
              <div class="metric-icon-box accent-emerald"><i data-lucide="message-square-check"></i></div>
            </div>
            <div class="metric-value-row">
              <span class="metric-number" style="color:var(--emerald-600);">${wecomAddedCount}</span><span class="metric-unit">人</span>
            </div>
            <div style="font-size:10.5px;color:var(--emerald-600);margin-top:2px;">企微通过率 78.5%</div>
          </div>
          <div class="metric-card">
            <div class="metric-top-row">
              <span class="metric-label">本周到店签约率</span>
              <div class="metric-icon-box accent-violet"><i data-lucide="store"></i></div>
            </div>
            <div class="metric-value-row">
              <span class="metric-number" style="color:var(--violet-600);">36.8%</span>
            </div>
            <div style="font-size:10.5px;color:var(--text-muted);margin-top:2px;">行业均值 18.5%</div>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="filter-bar">
          <div style="display:flex;gap:4px;flex-wrap:wrap;">
            <button class="btn ${this.currentFilter==='all'?'btn-primary':'btn-outline'} btn-sm" style="height:28px;font-size:11px;padding:0 10px;" onclick="MatchmakerView.setFilter('all')">全部 (${leads.length})</button>
            <button class="btn ${this.currentFilter==='high_intent'?'btn-primary':'btn-outline'} btn-sm" style="height:28px;font-size:11px;padding:0 10px;" onclick="MatchmakerView.setFilter('high_intent')">
              <i data-lucide="flame" style="width:11px;height:11px;color:var(--rose-500);margin-right:2px;"></i>高意向 (${highIntentCount})
            </button>
            <button class="btn ${this.currentFilter==='need_wecom'?'btn-primary':'btn-outline'} btn-sm" style="height:28px;font-size:11px;padding:0 10px;" onclick="MatchmakerView.setFilter('need_wecom')">
              <i data-lucide="user-plus" style="width:11px;height:11px;margin-right:2px;"></i>待加微
            </button>
            <button class="btn ${this.currentFilter==='urgent'?'btn-primary':'btn-outline'} btn-sm" style="height:28px;font-size:11px;padding:0 10px;" onclick="MatchmakerView.setFilter('urgent')">
              <i data-lucide="zap" style="width:11px;height:11px;color:var(--amber-500);margin-right:2px;"></i>S级紧急
            </button>
          </div>
          <div style="position:relative;max-width:220px;flex:1;">
            <i data-lucide="search" style="position:absolute;left:8px;top:50%;transform:translateY(-50%);width:12px;height:12px;color:var(--text-muted);"></i>
            <input type="text" class="form-input" style="width:100%;height:30px;padding:0 10px 0 26px;font-size:12px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;"
              placeholder="搜索客户名/电话/职业"
              value="${this.searchQuery}"
              oninput="MatchmakerView.onSearch(this.value)">
          </div>
          <div class="filter-divider"></div>
          <span class="filter-count">当前筛选: ${filteredLeads.length}条</span>
        </div>

        <!-- Content Area -->
        ${this.activeTab === 'kanban' ? this.renderKanban(filteredLeads, stages) : this.renderList(filteredLeads)}
      </div>
    `;
  },

  renderKanban(leads, stages) {
    const stageLeads = (stageId) => {
      if (stageId === 'pending_claim') return leads.filter(l => l.status === 'pending' || (l.status === 'connected' && !l.assignedMatchmaker.includes('(')));
      if (stageId === 'need_wecom') return leads.filter(l => (l.tier === 'S' || l.tier === 'A') && (l.status === 'connected' || l.status === 'claimed'));
      if (stageId === 'wecom_added') return leads.filter(l => l.status === 'wecom_added');
      if (stageId === 'inviting') return leads.filter(l => l.status === 'inviting' || l.id === 'L10006');
      if (stageId === 'signed') return leads.filter(l => l.status === 'signed' || l.id === 'L10008');
      return [];
    };

    return `
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:var(--content-gap);align-items:start;overflow-x:auto;padding-bottom:10px;">
        ${stages.map(stage => {
          const items = stageLeads(stage.id);
          return `
            <div style="display:flex;flex-direction:column;gap:6px;min-width:220px;">
              <!-- Column Header -->
              <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 8px;background:var(--ink-50);border-radius:var(--radius-md);border:1px solid var(--border-subtle);">
                <div style="display:flex;align-items:center;gap:6px;">
                  <div style="width:7px;height:7px;border-radius:50%;background:${stage.color};"></div>
                  <span style="font-size:11.5px;font-weight:700;color:var(--text-main);">${stage.title}</span>
                </div>
                <span style="font-size:10.5px;font-weight:700;color:var(--text-muted);background:var(--card-bg);padding:1px 6px;border-radius:10px;border:1px solid var(--border-subtle);font-variant-numeric:tabular-nums;">${items.length}</span>
              </div>
              <!-- Cards List -->
              <div style="display:flex;flex-direction:column;gap:6px;max-height:calc(100vh - 330px);overflow-y:auto;padding-right:2px;">
                ${items.length === 0 ? `
                  <div style="padding:24px 8px;text-align:center;border:1px dashed var(--border-color);border-radius:var(--radius-md);background:var(--card-bg);">
                    <div style="font-size:11px;color:var(--text-muted);">暂无跟进线索</div>
                  </div>
                ` : items.map(lead => this.renderLeadCard(lead, stage.id)).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  renderLeadCard(lead, stageId) {
    const isHigh = lead.tier === 'S' || lead.tier === 'A';
    // Mock SLA countdown (1~3 mins remaining for unadded, or green if done)
    const slaText = lead.status === 'wecom_added' ? '已在SLA内建联' : (lead.tier === 'S' ? 'SLA剩 1分28秒' : 'SLA剩 4分10秒');
    const slaColor = lead.status === 'wecom_added' ? 'var(--emerald-600)' : (lead.tier === 'S' ? 'var(--rose-600)' : 'var(--amber-600)');

    return `
      <div class="kanban-card" onclick="AppState.openLeadDrawer('${lead.id}')" style="cursor:pointer;position:relative;">
        <!-- Top Row: Avatar + Name + Tier -->
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:6px;">
          <div style="display:flex;align-items:center;gap:6px;min-width:0;">
            <div class="lead-avatar-bubble ${lead.gender==='女'?'female':''}" style="width:26px;height:26px;font-size:11px;">${lead.name[0]}</div>
            <div style="min-width:0;">
              <div style="font-size:12px;font-weight:700;color:var(--text-main);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${lead.name}</div>
              <div style="font-size:10px;color:var(--text-muted);">${lead.gender} · ${lead.age}岁 · ${lead.city.split('·')[0]}</div>
            </div>
          </div>
          <span class="tier-pill tier-${lead.tier.toLowerCase()}" style="font-size:9.5px;padding:0 5px;line-height:16px;">${lead.tier}级·${lead.intentScore||88}分</span>
        </div>

        <!-- Career & Income -->
        <div style="font-size:10.5px;color:var(--text-secondary);margin-bottom:6px;line-height:1.4;display:flex;gap:4px;flex-wrap:wrap;">
          <span style="display:inline-flex;align-items:center;gap:2px;"><i data-lucide="briefcase" style="width:10px;height:10px;"></i>${lead.occupation.length > 8 ? lead.occupation.slice(0,8)+'…' : lead.occupation}</span>
          <span style="color:var(--text-muted);">|</span>
          <span>${lead.annualIncome || '年薪面议'}</span>
        </div>

        <!-- AI Bait & Match Recommendation -->
        <div style="background:linear-gradient(135deg,var(--brand-50),var(--violet-50));border:1px solid var(--brand-100);border-radius:var(--radius-sm);padding:5px 8px;margin-bottom:6px;">
          <div style="font-size:9.5px;color:var(--brand-600);font-weight:600;display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
            <span style="display:inline-flex;align-items:center;gap:3px;"><i data-lucide="sparkles" style="width:9px;height:9px;"></i>AI推荐嘉宾卡</span>
            <span style="color:var(--emerald-600);">匹配96%</span>
          </div>
          <div style="font-size:10.5px;color:var(--text-secondary);line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
            ${lead.gender === '女' ? '张宇轩(31岁·阿里P7·全款房)' : '陈若云(28岁·网易PM·浙大硕)'}
          </div>
        </div>

        <!-- SLA Tag & Assignee -->
        <div style="display:flex;align-items:center;justify-content:space-between;font-size:10px;margin-bottom:6px;">
          <span style="color:${slaColor};font-weight:600;display:inline-flex;align-items:center;gap:2px;">
            <i data-lucide="timer" style="width:9px;height:9px;"></i>${slaText}
          </span>
          <span style="color:var(--text-muted);max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
            ${lead.assignedMatchmaker ? lead.assignedMatchmaker.split(' ')[0] : '待认领'}
          </span>
        </div>

        <!-- Actions Row -->
        <div style="display:flex;align-items:center;justify-content:space-between;padding-top:6px;border-top:1px solid var(--border-subtle);" onclick="event.stopPropagation();">
          <span style="font-size:10px;color:var(--text-muted);font-variant-numeric:tabular-nums;">${lead.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</span>
          <div style="display:flex;gap:3px;">
            <button class="btn btn-ghost btn-sm" style="height:22px;padding:0 5px;font-size:10px;" title="认领/转派" onclick="MatchmakerView.openReassignModal('${lead.id}')">
              <i data-lucide="user-check" style="width:10px;height:10px;"></i>转派
            </button>
            ${lead.status !== 'wecom_added' ? `
              <button class="btn btn-primary btn-sm" style="height:22px;padding:0 7px;font-size:10px;" onclick="MatchmakerView.quickAddWeCom('${lead.id}')">
                <i data-lucide="user-plus" style="width:10px;height:10px;"></i>加微
              </button>
            ` : `
              <button class="btn btn-outline btn-sm" style="height:22px;padding:0 7px;font-size:10px;" onclick="MatchmakerView.openFollowUpModal('${lead.id}')">
                <i data-lucide="edit-3" style="width:10px;height:10px;"></i>回写
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  },

  renderList(leads) {
    return `
      <div class="card" style="padding:0;overflow:hidden;">
        <div style="overflow-x:auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width:32px;"><input type="checkbox" style="width:13px;height:13px;accent-color:var(--brand-500);"></th>
                <th>客户基本信息</th>
                <th style="width:80px;">意向等级</th>
                <th>择偶核心诉求</th>
                <th style="width:100px;">SLA建联状态</th>
                <th style="width:110px;">负责红娘</th>
                <th style="width:100px;">当前阶段</th>
                <th style="width:150px;text-align:right;">操作</th>
              </tr>
            </thead>
            <tbody>
              ${leads.map(lead => {
                const slaText = lead.status === 'wecom_added' ? '已建联' : (lead.tier === 'S' ? '倒计时 1:28' : '倒计时 4:10');
                const slaColor = lead.status === 'wecom_added' ? 'var(--emerald-600)' : (lead.tier === 'S' ? 'var(--rose-600)' : 'var(--amber-600)');

                return `
                  <tr onclick="AppState.openLeadDrawer('${lead.id}')">
                    <td onclick="event.stopPropagation();"><input type="checkbox" style="width:13px;height:13px;accent-color:var(--brand-500);"></td>
                    <td>
                      <div class="lead-cell">
                        <div class="lead-avatar-bubble ${lead.gender==='女'?'female':''}">${lead.name[0]}</div>
                        <div class="lead-meta">
                          <div class="lead-name-row">
                            <span class="lead-name">${lead.name}</span>
                            <span class="lead-gender-age">${lead.gender}·${lead.age}岁·${lead.education.split('·')[0]}</span>
                          </div>
                          <div style="font-size:10.5px;color:var(--text-muted);">${lead.phone} · ${lead.city}</div>
                        </div>
                      </div>
                    </td>
                    <td><span class="tier-pill tier-${lead.tier.toLowerCase()}">${lead.tier}级 (${lead.intentScore||88}分)</span></td>
                    <td><div style="font-size:11.5px;color:var(--text-secondary);max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${lead.mateRequirement.coreReq}</div></td>
                    <td>
                      <span style="font-size:11px;font-weight:600;color:${slaColor};display:inline-flex;align-items:center;gap:3px;">
                        <i data-lucide="timer" style="width:11px;height:11px;"></i>${slaText}
                      </span>
                    </td>
                    <td style="font-size:11.5px;color:var(--text-main);">
                      ${lead.assignedMatchmaker || '待分配'}
                    </td>
                    <td>
                      <span class="status-pill status-${lead.status}"><span class="status-pill-dot"></span>${leadStatusText(lead.status)}</span>
                    </td>
                    <td style="text-align:right;" onclick="event.stopPropagation();">
                      <div style="display:flex;gap:3px;justify-content:flex-end;">
                        <button class="btn btn-ghost btn-sm" style="height:24px;padding:0 6px;font-size:11px;" onclick="MatchmakerView.openReassignModal('${lead.id}')">转派</button>
                        <button class="btn btn-outline btn-sm" style="height:24px;padding:0 6px;font-size:11px;" onclick="MatchmakerView.openFollowUpModal('${lead.id}')">跟进</button>
                        <button class="btn btn-primary btn-sm" style="height:24px;padding:0 8px;font-size:11px;" onclick="MatchmakerView.quickAddWeCom('${lead.id}')">加微</button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  switchTab(tab) { this.activeTab = tab; App.refreshCurrentView(); },
  setFilter(f) { this.currentFilter = f; App.refreshCurrentView(); },
  onSearch(v) { this.searchQuery = v; App.refreshCurrentView(); },

  // Claim or Reassign Modal
  openReassignModal(leadId) {
    const lead = AppState.leads.find(l => l.id === leadId);
    if (!lead) return;

    App.showModal({
      title: `分配/转派红娘 - ${lead.name}`,
      content: `
        <div style="padding:4px 0;display:flex;flex-direction:column;gap:10px;">
          <div style="background:var(--ink-50);border-radius:var(--radius-md);padding:10px 12px;">
            <div style="font-size:12px;font-weight:700;color:var(--text-main);">${lead.name} (${lead.gender}·${lead.age}岁·${lead.occupation})</div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">当前负责: ${lead.assignedMatchmaker || '未分配'} · 意向评级: ${lead.tier}级</div>
          </div>

          <div class="form-group">
            <label class="form-label" style="font-size:11px;">选择承接红娘坐席 (查看实时负载)</label>
            <div style="display:flex;flex-direction:column;gap:6px;margin-top:4px;">
              ${this.matchmakers.map((m, idx) => `
                <label style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border-radius:var(--radius-md);border:1px solid var(--border-color);background:var(--card-bg);cursor:pointer;">
                  <div style="display:flex;align-items:center;gap:8px;">
                    <input type="radio" name="matchmaker_radio" value="${m.name}" ${idx===0?'checked':''} style="accent-color:var(--brand-500);">
                    <div>
                      <div style="font-size:11.5px;font-weight:600;color:var(--text-main);">${m.name} <span style="font-size:10px;color:var(--text-muted);font-weight:normal;">(${m.title})</span></div>
                      <div style="font-size:10px;color:var(--brand-600);">${m.tag}</div>
                    </div>
                  </div>
                  <div style="text-align:right;">
                    <div style="font-size:11px;font-weight:700;color:${m.currentLoad>=18?'var(--rose-600)':'var(--text-main)'};font-variant-numeric:tabular-nums;">负载 ${m.currentLoad}/${m.maxLoad}</div>
                    <div style="font-size:9.5px;color:var(--text-muted);">${m.currentLoad>=18?'接近满载':'空闲推荐'}</div>
                  </div>
                </label>
              `).join('')}
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" style="font-size:11px;">转派原因说明</label>
            <select class="form-select" style="width:100%;height:32px;font-size:11.5px;">
              <option>画像精准匹配（该红娘专攻本类职业）</option>
              <option>原红娘负载过高，均衡线索分配</option>
              <option>SLA即将超时，紧急调配空闲坐席</option>
              <option>客户地域偏好调整</option>
            </select>
          </div>
        </div>
      `,
      confirmText: '确认分配并通知',
      onConfirm: () => {
        // 读取用户实际选中的红娘，而非写死第一位
        const radios = document.querySelectorAll('input[name="matchmaker_radio"]');
        let selected = null;
        radios.forEach(r => { if (r.checked) selected = r.value; });
        const target = this.matchmakers.find(m => m.name === selected) || this.matchmakers[0];
        const prevName = lead.assignedMatchmaker ? lead.assignedMatchmaker.split(' ')[0] : '未分配';
        lead.assignedMatchmaker = `${target.name} (${target.title})`;
        lead.status = 'claimed';
        AppState.recordAudit('转人工', '转派红娘', `${lead.name} (${lead.id})`, '成功', `由 ${prevName} 转派给 ${target.name}（负载 ${target.currentLoad}/${target.maxLoad}）`);
        App.showToast(`线索 [${lead.name}] 已从 ${prevName} 转派给 ${target.name}（负载 ${target.currentLoad}/${target.maxLoad}）`, 'success');
        App.refreshCurrentView();
      }
    });
  },

  // Follow-up Notes & Result Writeback Modal
  openFollowUpModal(leadId) {
    const lead = AppState.leads.find(l => l.id === leadId);
    if (!lead) return;

    App.showModal({
      title: `红娘跟进记录与结果回写 - ${lead.name}`,
      content: `
        <div style="padding:4px 0;display:flex;flex-direction:column;gap:10px;">
          <div style="background:var(--brand-50);border:1px solid var(--brand-100);border-radius:var(--radius-md);padding:10px 12px;">
            <div style="font-size:11.5px;color:var(--brand-700);font-weight:600;margin-bottom:2px;">
              <i data-lucide="sparkles" style="width:12px;height:12px;display:inline;margin-right:3px;"></i>
              AI 推荐下次破冰切入点
            </div>
            <div style="font-size:11px;color:var(--text-secondary);line-height:1.4;">
              客户对同名校/大厂背景兴趣浓厚，建议出具脱敏嘉宾卡片（张宇轩/陈若云），重点突出周末自驾与摄影共同爱好。
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" style="font-size:11px;">本次跟进状态回写</label>
            <select id="followup_status_select" class="form-select" style="width:100%;height:32px;font-size:12px;">
              <option value="wecom_added" selected>已添加企微 · 发送资料破冰中</option>
              <option value="inviting">深度沟通良好 · 正在邀约线下到店</option>
              <option value="signed">已到店面谈 · 成功签约VIP服务包</option>
              <option value="callback_needed">客户忙碌 · 约定稍后回访</option>
              <option value="invalid">跟进无效/客户明确拒绝</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" style="font-size:11px;">预约下次跟进 / 回访时间</label>
            <input type="datetime-local" class="form-input" style="width:100%;height:32px;font-size:11.5px;" value="2026-08-22T14:30">
          </div>

          <div class="form-group">
            <label class="form-label" style="font-size:11px;">红娘专业跟进小记 (自动同步客户时间轴与报表)</label>
            <textarea class="form-input" rows="3" style="width:100%;font-size:12px;padding:8px 10px;resize:none;" placeholder="记录客户具体偏好、异议化解情况或到店意向...">${lead.matchmakerNotes || '已加企微并发送3位嘉宾脱敏手册，客户反馈满意，约本周六下午线下试面。'}</textarea>
          </div>
        </div>
      `,
      confirmText: '保存并同步回写',
      onConfirm: () => {
        const select = document.getElementById('followup_status_select');
        if (select) {
          lead.status = select.value;
        }
        App.showToast('跟进记录已成功回写至客户档案与转化报表', 'success');
        App.refreshCurrentView();
      }
    });
  },

  quickAddWeCom(leadId) {
    const lead = AppState.leads.find(l => l.id === leadId);
    if (!lead) return;
    App.showModal({
      title: `发起企微好友申请 - ${lead.name}`,
      content: `
        <div style="padding:4px 0;">
          <div style="background:var(--ink-50);border-radius:var(--radius-md);padding:10px 12px;margin-bottom:10px;">
            <div style="font-size:11px;color:var(--text-muted);margin-bottom:3px;">目标客户</div>
            <div style="font-size:12px;font-weight:700;color:var(--text-main);">${lead.name} (${lead.phone})</div>
            <div style="font-size:10.5px;color:var(--brand-600);margin-top:3px;">AI通话中已获同意："稍后让红娘老师加微信把优质资料发您"</div>
          </div>
          <div class="form-group" style="margin-bottom:10px;">
            <label class="form-label" style="font-size:11px;">打招呼申请语 (根据意向画像生成)</label>
            <textarea class="form-input" rows="3" style="width:100%;font-size:12px;padding:8px 10px;resize:none;">您好${lead.name}，我是知缘婚恋的专属红娘晓梅~ 刚才AI助手提到的${lead.city.split('·')[0]}名校优质嘉宾资料我已经整理好了，通过一下发您掌掌眼哈~</textarea>
          </div>
          <div class="form-group">
            <label class="form-label" style="font-size:11px;">执行红娘账号</label>
            <select class="form-select" style="width:100%;height:32px;font-size:12px;">
              <option>林晓梅 (资深红娘组长 · 负载12/20)</option>
              <option>苏雨薇 (高端定制红娘 · 负载16/20)</option>
              <option>周敏 (白领专属红娘 · 负载8/20)</option>
            </select>
          </div>
        </div>
      `,
      confirmText: '立即发送申请',
      onConfirm: () => {
        lead.status = 'wecom_added';
        App.showToast(`企微好友申请已发送至 ${lead.name}`, 'success');
        App.refreshCurrentView();
      }
    });
  },

  openChatScriptModal(leadId) {
    const lead = AppState.leads.find(l => l.id === leadId);
    App.showModal({
      title: `智能破冰话术库 · ${lead ? lead.name : ''}`,
      content: `
        <div style="padding:4px 0;display:flex;flex-direction:column;gap:8px;">
          <div style="background:linear-gradient(135deg,var(--brand-50),var(--violet-50));border:1px solid var(--brand-100);border-radius:var(--radius-md);padding:10px 12px;">
            <div style="font-size:10.5px;color:var(--brand-600);font-weight:600;margin-bottom:3px;"><i data-lucide="sparkles" style="width:10px;height:10px;"></i> AI破冰策略</div>
            <div style="font-size:11.5px;color:var(--text-secondary);line-height:1.5;">客户偏严谨独立，关注学历与家庭。建议发脱敏资料卡，抛出共同话题（徒步/自驾），避免直接推销。</div>
          </div>
          ${[
            {title:'资料包直击型 (推荐)',text:'您好呀！我是刚才电话里的红娘晓梅。这是精选的93年同济硕士、国企工程师李先生资料，平时爱摄影自驾，先过目看看合不合眼缘~'},
            {title:'线下私享会邀约型',text:'周六下午我们在国金中心有一场【名校高管·青年才俊】精致茶歇，仅12个名额，特意给您留了一位，来喝杯咖啡认识新朋友？'}
          ].map((s,i) => `
            <div style="border:1px solid var(--border-color);border-radius:var(--radius-md);padding:8px 10px;">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
                <span style="font-size:10.5px;font-weight:600;color:var(--text-main);">话术${i+1}：${s.title}</span>
                <button class="btn btn-ghost btn-sm" style="height:22px;padding:0 6px;font-size:10px;" onclick="App.showToast('已复制到剪贴板','success')">复制</button>
              </div>
              <div style="font-size:11.5px;color:var(--text-secondary);line-height:1.5;background:var(--ink-50);padding:6px 8px;border-radius:var(--radius-sm);">${s.text}</div>
            </div>
          `).join('')}
        </div>
      `,
      confirmText: '确定'
    });
  },

  showBatchAssignModal() {
    App.showModal({
      title: '批量分配 / 转派红娘',
      content: `
        <div style="padding:4px 0;display:flex;flex-direction:column;gap:10px;">
          <div style="font-size:11.5px;color:var(--text-secondary);">
            将当前选中的高意向线索智能均衡分配给在岗红娘：
          </div>
          <div class="form-group">
            <label class="form-label" style="font-size:11px;">分配策略</label>
            <select class="form-select" style="width:100%;height:32px;font-size:12px;">
              <option>智能负载均衡 (优先空闲坐席)</option>
              <option>专业画像匹配 (按名校/大厂/编制标签分配)</option>
              <option>平均轮询分配 (Round-Robin)</option>
            </select>
          </div>
          <div style="background:var(--ink-50);border-radius:var(--radius-md);padding:8px 10px;font-size:11px;color:var(--text-muted);">
            预计分配：林晓梅 2条 · 周敏 3条 · 苏雨薇 1条
          </div>
        </div>
      `,
      confirmText: '确认分配',
      onConfirm: () => {
        App.showToast('已完成批量智能分配', 'success');
        App.refreshCurrentView();
      }
    });
  },

  showBatchWeComModal() {
    App.showModal({
      title: '批量自动发起企微好友申请',
      content: `
        <div style="padding:4px 0;">
          <div style="background:var(--amber-50);border:1px solid var(--amber-200);border-radius:var(--radius-md);padding:10px 12px;margin-bottom:10px;">
            <div style="font-size:11.5px;color:var(--amber-700);line-height:1.5;">系统检测到 <strong>8位</strong> S/A级高意向待加微客户，建议立即由智能企微路由批量分发。</div>
          </div>
          <div style="font-size:11px;color:var(--text-secondary);line-height:1.8;">
            · 自动根据画像匹配对应红娘坐席企业微信<br>
            · 自动附带AI个性化话术与高匹配嘉宾资料卡<br>
            · 严格遵循企微防封加人安全间隔（15-30秒/单）
          </div>
        </div>
      `,
      confirmText: '确认立即分发',
      onConfirm: () => {
        AppState.leads.forEach(l => {
          if (l.tier === 'S' || l.tier === 'A') l.status = 'wecom_added';
        });
        App.showToast('已批量触发企微加粉任务，请关注红娘微信通知', 'success');
        App.refreshCurrentView();
      }
    });
  }
};

window.MatchmakerView = MatchmakerView;
