// View: Leads (潜客中心) v3 - 标签页：潜客列表 + 导入合规中心

let leadSearchTerm = '';
let leadFilterTier = 'ALL';
let leadFilterStatus = 'ALL';
let leadFilterCompleteness = 'ALL'; // ALL | incomplete | partial | complete
let leadFilterChannel = 'ALL'; // ALL | 抖音 | 小红书 | 朋友圈 | 知乎 | 转介绍 | 其他
let leadsActiveTab = 'list'; // list | import
let importStep = 5; // 1=上传 2=映射 3=校验 4=审核 5=完成; start at completion for demo
let importFilterError = 'ALL';

const LeadsView = {
  render() {
    return leadsActiveTab === 'import' ? renderImportCenter() : renderLeadsView();
  }
};

function leadStatusText(s) {
  const map = {
    'wecom_added': '已加企微', 'claimed': '已认领', 'connected': '已接通',
    'calling': '通话中', 'pending': '待外呼', 'refused': '已拒接'
  };
  return map[s] || s;
}

// ── TAB 1: 潜客列表 ──

function renderLeadsView() {
  const filtered = AppState.leads.filter(lead => {
    const matchSearch = !leadSearchTerm ||
      lead.name.includes(leadSearchTerm) || lead.phone.includes(leadSearchTerm) ||
      (lead.occupation || '').includes(leadSearchTerm) || (lead.city || '').includes(leadSearchTerm);
    const matchTier = leadFilterTier === 'ALL' || lead.tier === leadFilterTier;
    const matchStatus = leadFilterStatus === 'ALL' || lead.status === leadFilterStatus;
    // 渠道筛选: 按来源渠道关键字匹配
    const matchChannel = leadFilterChannel === 'ALL' || (lead.sourceChannel || '').includes(leadFilterChannel);
    // 信息完整度筛选: 按画像完整度加权评分
    const comp = AppState.leadCompleteness(lead);
    const matchComp = leadFilterCompleteness === 'ALL' ||
      (leadFilterCompleteness === 'incomplete' && comp < 60) ||
      (leadFilterCompleteness === 'partial' && comp >= 60 && comp < 85) ||
      (leadFilterCompleteness === 'complete' && comp >= 85);
    return matchSearch && matchTier && matchStatus && matchChannel && matchComp;
  });

  const stats = {
    total: AppState.leads.length,
    sTier: AppState.leads.filter(l => l.tier === 'S').length,
    wecom: AppState.leads.filter(l => l.status === 'wecom_added').length,
    pending: AppState.leads.filter(l => l.status === 'pending' || l.status === 'calling').length,
    incomplete: AppState.leads.filter(l => AppState.leadCompleteness(l) < 60).length
  };

  return `
    <div class="view-fade-enter">

      <!-- Page Header -->
      <div class="page-header">
        <div class="page-title-group">
          <div class="page-title">
            <i data-lucide="users"></i>
            名单准入与池子
          </div>
          <div class="page-subtitle">AI多轮对话提取的360°结构化潜客档案 · 导入审核 · 合规过滤</div>
        </div>
        <div class="page-actions">
          <button class="btn btn-outline btn-sm" onclick="exportLeadsCsv()">
            <i data-lucide="download"></i>导出
          </button>
          <button class="btn btn-primary btn-sm" onclick="switchLeadsTab('import')">
            <i data-lucide="upload"></i>批量导入
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div style="display:flex;gap:0;border-bottom:1px solid var(--border-color);margin-bottom:var(--content-gap);">
        <button onclick="switchLeadsTab('list')" class="tab-btn ${leadsActiveTab==='list'?'active':''}">
          <i data-lucide="list" style="width:12px;height:12px;"></i>潜客列表
          <span class="badge badge-neutral" style="font-size:9.5px;line-height:15px;margin-left:4px;">${stats.total}</span>
        </button>
        <button onclick="switchLeadsTab('import')" class="tab-btn ${leadsActiveTab==='import'?'active':''}">
          <i data-lucide="upload-cloud" style="width:12px;height:12px;"></i>导入与合规
          <span class="badge badge-warning" style="font-size:9.5px;line-height:15px;margin-left:4px;">待审核20</span>
        </button>
      </div>

      <!-- Compact KPI Row -->
      <div class="metrics-grid" style="grid-template-columns:repeat(5,1fr);">
        <div class="metric-card">
          <div class="metric-top-row">
            <span class="metric-label">总潜客数</span>
            <div class="metric-icon-box accent-blue"><i data-lucide="users"></i></div>
          </div>
          <div class="metric-value-row"><span class="metric-number">${stats.total}</span></div>
        </div>
        <div class="metric-card">
          <div class="metric-top-row">
            <span class="metric-label">S级高意向</span>
            <div class="metric-icon-box accent-rose"><i data-lucide="gem"></i></div>
          </div>
          <div class="metric-value-row"><span class="metric-number" style="color:var(--rose-600);">${stats.sTier}</span></div>
        </div>
        <div class="metric-card">
          <div class="metric-top-row">
            <span class="metric-label">已加企微</span>
            <div class="metric-icon-box accent-emerald"><i data-lucide="message-circle"></i></div>
          </div>
          <div class="metric-value-row"><span class="metric-number" style="color:var(--emerald-600);">${stats.wecom}</span></div>
        </div>
        <div class="metric-card">
          <div class="metric-top-row">
            <span class="metric-label">待外呼/通话中</span>
            <div class="metric-icon-box accent-violet"><i data-lucide="phone-call"></i></div>
          </div>
          <div class="metric-value-row"><span class="metric-number" style="color:var(--brand-600);">${stats.pending}</span></div>
        </div>
        <div class="metric-card" style="cursor:pointer;" onclick="leadFilterCompleteness='incomplete';refreshLeadsTable();" title="点击筛选信息不全的潜客">
          <div class="metric-top-row">
            <span class="metric-label">待补全画像</span>
            <div class="metric-icon-box accent-amber"><i data-lucide="user-round-pen"></i></div>
          </div>
          <div class="metric-value-row"><span class="metric-number" style="color:var(--amber-600);">${stats.incomplete}</span></div>
        </div>
      </div>

      ${renderLeadsFilterBar(filtered.length)}

      <!-- Leads Table -->
      <div class="card" style="padding:0;overflow:hidden;">
        <div style="overflow-x:auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width:32px;"><input type="checkbox" style="width:13px;height:13px;cursor:pointer;accent-color:var(--brand-500);"></th>
                <th>客户</th>
                <th style="width:90px;">意向</th>
                <th>职业/收入</th>
                <th style="width:80px;">区域</th>
                <th>择偶偏好</th>
                <th style="width:70px;">红娘</th>
                <th style="width:90px;">状态</th>
                <th style="width:60px;text-align:right;">通话</th>
                <th style="width:64px;text-align:right;">操作</th>
              </tr>
            </thead>
            <tbody class="stagger-container">
              ${filtered.map(lead => {
                const comp = AppState.leadCompleteness(lead);
                const compBadge = comp < 60
                  ? `<span style="display:inline-flex;align-items:center;gap:3px;padding:1px 6px;border-radius:10px;font-size:9px;font-weight:600;background:var(--amber-50);color:var(--amber-700);border:1px solid var(--amber-200);white-space:nowrap;"><i data-lucide="alert-triangle" style="width:9px;height:9px;"></i>补全 ${comp}%</span>`
                  : comp < 85
                  ? `<span style="display:inline-flex;align-items:center;gap:3px;padding:1px 6px;border-radius:10px;font-size:9px;font-weight:600;background:var(--brand-50);color:var(--brand-700);border:1px solid var(--brand-200);white-space:nowrap;">完善 ${comp}%</span>`
                  : `<span style="display:inline-flex;align-items:center;gap:3px;padding:1px 6px;border-radius:10px;font-size:9px;font-weight:600;background:var(--emerald-50);color:var(--emerald-700);border:1px solid var(--emerald-200);white-space:nowrap;"><i data-lucide="check" style="width:9px;height:9px;"></i>完整 ${comp}%</span>`;
                return `
                <tr onclick="AppState.openLeadDrawer('${lead.id}')" style="${comp < 60 ? 'background:linear-gradient(90deg,rgba(245,158,11,0.04),transparent 40%);' : ''}">
                  <td onclick="event.stopPropagation();"><input type="checkbox" style="width:13px;height:13px;cursor:pointer;accent-color:var(--brand-500);"></td>
                  <td>
                    <div class="lead-cell">
                      <div class="lead-avatar-bubble ${lead.gender==='女'?'female':''}">${lead.name[0]}</div>
                      <div class="lead-meta">
                        <div class="lead-name-row">
                          <span class="lead-name">${lead.name}</span>
                          <span class="lead-gender-age">${lead.gender}·${lead.age > 0 ? lead.age + '岁' : '年龄未知'}</span>
                        </div>
                        <div style="display:flex;align-items:center;gap:4px;margin-top:2px;">${compBadge}</div>
                      </div>
                    </div>
                  </td>
                  <td><span class="tier-pill tier-${lead.tier.toLowerCase()}">${lead.tier}级·${lead.intentScore}</span></td>
                  <td>
                    <div style="font-size:12px;font-weight:500;color:var(--text-main);max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${lead.occupation || '<span style="color:var(--amber-600);font-weight:400;">待补全</span>'}</div>
                    <div style="font-size:10.5px;color:var(--text-muted);font-variant-numeric:tabular-nums;">${lead.annualIncome || '—'}</div>
                  </td>
                  <td><div style="font-size:12px;color:var(--text-secondary);">${lead.city}</div></td>
                  <td>
                    <div style="font-size:11.5px;color:var(--text-secondary);max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${lead.mateRequirement.coreReq}</div>
                    <div style="font-size:10.5px;color:var(--brand-600);">${lead.mateRequirement.ageRange}·${lead.mateRequirement.education}</div>
                  </td>
                  <td><div style="font-size:12px;color:var(--text-secondary);">${lead.assignedMatchmaker.split(' ')[0]}</div></td>
                  <td>
                    <span class="status-pill status-${lead.status}">
                      <span class="status-pill-dot"></span>${leadStatusText(lead.status)}
                    </span>
                  </td>
                  <td style="text-align:right;font-variant-numeric:tabular-nums;font-size:11.5px;color:var(--text-secondary);">${lead.callDuration}</td>
                  <td style="text-align:right;" onclick="event.stopPropagation();">
                    <div style="display:flex;gap:2px;justify-content:flex-end;">
                      ${comp < 60 ? `<button class="btn btn-ghost btn-sm" style="height:26px;padding:0 7px;font-size:10px;color:var(--amber-700);background:var(--amber-50);border:1px solid var(--amber-200);" onclick="openLeadEditModal('${lead.id}')" title="手动补全画像"><i data-lucide="user-round-pen" style="width:11px;height:11px;"></i>补全</button>` : ''}
                      <button class="btn btn-ghost btn-sm" style="width:28px;height:28px;padding:0;" onclick="AppState.openLeadDrawer('${lead.id}')" title="查看"><i data-lucide="eye" style="width:12px;height:12px;"></i></button>
                      <button class="btn btn-ghost btn-sm" style="width:28px;height:28px;padding:0;" onclick="App.showToast('已拨打 ${lead.phone}','info')" title="拨打"><i data-lucide="phone" style="width:12px;height:12px;"></i></button>
                    </div>
                  </td>
                </tr>
              `}).join('')}
            </tbody>
          </table>
        </div>
        ${filtered.length===0?`
          <div style="padding:32px;text-align:center;color:var(--text-muted);font-size:12px;">
            <i data-lucide="search-x" style="width:28px;height:28px;margin:0 auto 6px;opacity:0.3;"></i>
            <div>暂无符合条件的潜客</div>
          </div>
        `:''}
      </div>

      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;padding:0 2px;">
        <div style="font-size:11px;color:var(--text-muted);font-variant-numeric:tabular-nums;">显示 1-${filtered.length} 条，共 ${stats.total} 条</div>
        ${filtered.length > 0 ? `
        <div style="display:flex;gap:3px;">
          <button class="btn btn-outline btn-sm" style="min-width:28px;padding:0 6px;" disabled><i data-lucide="chevron-left" style="width:11px;height:11px;"></i></button>
          <button class="btn btn-primary btn-sm" style="min-width:28px;padding:0 8px;">1</button>
          <button class="btn btn-outline btn-sm" style="min-width:28px;padding:0 6px;" disabled><i data-lucide="chevron-right" style="width:11px;height:11px;"></i></button>
        </div>` : ''}
      </div>
    </div>
  `;
}

function renderLeadsFilterBar(count) {
  return `
    <div class="filter-bar">
      <div style="position:relative;flex:1;min-width:180px;max-width:240px;">
        <i data-lucide="search" style="position:absolute;left:8px;top:50%;transform:translateY(-50%);width:12px;height:12px;color:var(--text-muted);"></i>
        <input type="text" class="form-input" style="width:100%;height:30px;line-height:30px;padding:0 10px 0 26px;font-size:12px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;"
          placeholder="搜索姓名/电话/职业/区域" value="${leadSearchTerm}"
          oninput="leadSearchTerm=this.value;refreshLeadsTable();">
      </div>
      <select class="form-select" style="height:30px;padding:0 24px 0 8px;font-size:12px;min-width:110px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;" onchange="leadFilterTier=this.value;refreshLeadsTable();">
        <option value="ALL" ${leadFilterTier==='ALL'?'selected':''}>全部意向</option>
        <option value="S" ${leadFilterTier==='S'?'selected':''}>S级·极高</option>
        <option value="A" ${leadFilterTier==='A'?'selected':''}>A级·高</option>
        <option value="B" ${leadFilterTier==='B'?'selected':''}>B级·中</option>
        <option value="C" ${leadFilterTier==='C'?'selected':''}>C级·低</option>
        <option value="D" ${leadFilterTier==='D'?'selected':''}>D级·无效</option>
      </select>
      <select class="form-select" style="height:30px;padding:0 24px 0 8px;font-size:12px;min-width:110px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;" onchange="leadFilterStatus=this.value;refreshLeadsTable();">
        <option value="ALL">全部状态</option>
        <option value="pending" ${leadFilterStatus==='pending'?'selected':''}>待外呼</option>
        <option value="calling" ${leadFilterStatus==='calling'?'selected':''}>通话中</option>
        <option value="connected" ${leadFilterStatus==='connected'?'selected':''}>已接通</option>
        <option value="claimed" ${leadFilterStatus==='claimed'?'selected':''}>已认领</option>
        <option value="wecom_added" ${leadFilterStatus==='wecom_added'?'selected':''}>已加企微</option>
        <option value="refused" ${leadFilterStatus==='refused'?'selected':''}>已拒接</option>
      </select>
      <select class="form-select" style="height:30px;padding:0 24px 0 8px;font-size:12px;min-width:110px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;color:${leadFilterCompleteness==='incomplete'?'var(--amber-700)':'var(--text-main)'};" onchange="leadFilterCompleteness=this.value;refreshLeadsTable();">
        <option value="ALL" ${leadFilterCompleteness==='ALL'?'selected':''}>全部完整度</option>
        <option value="incomplete" ${leadFilterCompleteness==='incomplete'?'selected':''}>⚠ 信息不全 (&lt;60%)</option>
        <option value="partial" ${leadFilterCompleteness==='partial'?'selected':''}>部分完善 (60-85%)</option>
        <option value="complete" ${leadFilterCompleteness==='complete'?'selected':''}>已完整 (≥85%)</option>
      </select>
      <select class="form-select" style="height:30px;padding:0 24px 0 8px;font-size:12px;min-width:100px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;" onchange="leadFilterChannel=this.value;refreshLeadsTable();">
        <option value="ALL" ${leadFilterChannel==='ALL'?'selected':''}>全部渠道</option>
        <option value="抖音" ${leadFilterChannel==='抖音'?'selected':''}>抖音</option>
        <option value="小红书" ${leadFilterChannel==='小红书'?'selected':''}>小红书</option>
        <option value="朋友圈" ${leadFilterChannel==='朋友圈'?'selected':''}>朋友圈</option>
        <option value="知乎" ${leadFilterChannel==='知乎'?'selected':''}>知乎</option>
        <option value="转介绍" ${leadFilterChannel==='转介绍'?'selected':''}>转介绍</option>
        <option value="线下" ${leadFilterChannel==='线下'?'selected':''}>线下</option>
      </select>
      <div class="filter-divider"></div>
      <div class="filter-actions">
        <span class="filter-count">${count}条</span>
        <button class="btn btn-ghost btn-sm" style="height:28px;font-size:11px;" onclick="resetLeadsFilters()">
          <i data-lucide="rotate-ccw" style="width:11px;height:11px;"></i>重置
        </button>
      </div>
    </div>
  `;
}

// ── TAB 2: 导入与合规准入中心 ──

function renderImportCenter() {
  const steps = [
    {n:1, label:'上传名单'}, {n:2, label:'字段映射'}, {n:3, label:'数据校验'},
    {n:4, label:'授权审核'}, {n:5, label:'导入完成'}
  ];

  // Mock data per document spec: total 100, pending review 20, passed 80, unsub 2, blacklist 3, dup 5, format error 2, available 68
  // 读取共享名单池: 合规中心审核通过/驳回会实时更新此处数字
  const pool = (AppState.shared && AppState.shared.importPool) || { total:100, pending:20, approved:80, blacklist:3, unsub:2, dup:5, formatErr:2 };
  const summary = { total: pool.total, valid: pool.total - pool.dup - pool.formatErr, dup: pool.dup, formatErr: pool.formatErr, blacklist: pool.blacklist, unsub: pool.unsub, pending: pool.pending, available: pool.approved };

  const errorRows = [
    {row:17, phone:'138****5a78', type:'格式错误', desc:'手机号包含字母a', advice:'修正号码或跳过'},
    {row:43, phone:'139****2341', type:'黑名单', desc:'客户已在企业黑名单（投诉2次）', advice:'拦截，加入过滤'},
    {row:58, phone:'137****8902', type:'重复数据', desc:'与库中L10023重复', advice:'合并或跳过'},
    {row:62, phone:'136****4521', type:'格式错误', desc:'号码位数不足11位', advice:'修正号码或跳过'},
    {row:71, phone:'135****7834', type:'已退订', desc:'客户于2026-07-15申请退订', advice:'拦截，加入退订表'},
    {row:79, phone:'131****3322', type:'黑名单', desc:'客户标记为恶意骚扰', advice:'拦截，加入过滤'},
    {row:85, phone:'150****6678', type:'重复数据', desc:'与本次导入第23行重复', advice:'跳过重复行'},
    {row:91, phone:'158****2211', type:'重复数据', desc:'与库中L10045重复', advice:'合并或跳过'},
    {row:96, phone:'186****9901', type:'重复数据', desc:'与本次导入第14行重复', advice:'跳过重复行'},
    {row:100, phone:'199****4433', type:'重复数据', desc:'与库中L10089重复', advice:'合并或跳过'},
    {row:24, phone:'152****1122', type:'黑名单', desc:'客户明确拒绝外呼', advice:'拦截，加入过滤'},
    {row:37, phone:'189****7788', type:'已退订', desc:'客户于2026-08-01退订', advice:'拦截，加入退订表'},
  ];

  const filteredErrors = importFilterError === 'ALL' ? errorRows : errorRows.filter(r => r.type === importFilterError);

  return `
    <div class="view-fade-enter">
      <div class="page-header">
        <div class="page-title-group">
          <div class="page-title"><i data-lucide="upload-cloud"></i>名单导入与合规准入</div>
          <div class="page-subtitle">文件上传 · 字段映射 · 格式校验 · 授权审核 · 黑名单/退订过滤</div>
        </div>
        <div class="page-actions">
          <span class="badge badge-neutral" style="font-size:10.5px;line-height:18px;">模拟数据</span>
          <button class="btn btn-outline btn-sm" onclick="switchLeadsTab('list')"><i data-lucide="arrow-left"></i>返回列表</button>
        </div>
      </div>

      <!-- Stepper -->
      <div class="card" style="padding:16px 20px;margin-bottom:var(--content-gap);">
        <div style="display:flex;align-items:center;gap:0;">
          ${steps.map((s, i) => `
            <div style="display:flex;align-items:center;flex:${i<steps.length-1?'1':'0 0 auto'};">
              <div style="display:flex;align-items:center;gap:8px;">
                <div style="width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;
                  ${s.n < importStep ? 'background:var(--emerald-500);color:#fff;' : s.n === importStep ? 'background:var(--brand-500);color:#fff;box-shadow:0 0 0 3px var(--brand-100);' : 'background:var(--ink-100);color:var(--text-muted);'}">
                  ${s.n < importStep ? '<i data-lucide="check" style="width:12px;height:12px;"></i>' : s.n}
                </div>
                <span style="font-size:11.5px;font-weight:${s.n===importStep?'600':'400'};color:${s.n<=importStep?'var(--text-main)':'var(--text-muted)'};white-space:nowrap;">${s.label}</span>
              </div>
              ${i < steps.length-1 ? `<div style="flex:1;height:2px;background:${s.n<importStep?'var(--emerald-500)':'var(--ink-100)'};margin:0 10px;"></div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>

      ${importStep < 5 ? renderImportStep(importStep, summary) : `

      <!-- STEP 5: Completion -->
      <div style="display:grid;grid-template-columns:1fr 340px;gap:var(--content-gap);">
        <div style="display:flex;flex-direction:column;gap:var(--content-gap);">
          <!-- Completion Summary -->
          <div class="card" style="padding:20px;text-align:center;">
            <div style="width:52px;height:52px;border-radius:50%;background:var(--emerald-50);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;">
              <i data-lucide="check-circle" style="width:26px;height:26px;color:var(--emerald-600);"></i>
            </div>
            <div style="font-size:15px;font-weight:700;color:var(--text-main);margin-bottom:4px;">导入完成</div>
            <div style="font-size:11.5px;color:var(--text-muted);margin-bottom:16px;">批次 IMP-20260820-003 已完成准入校验，${summary.available}条潜客进入可外呼池</div>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;max-width:480px;margin:0 auto;">
              <div style="padding:10px;background:var(--ink-50);border-radius:var(--radius-md);">
                <div style="font-size:20px;font-weight:800;color:var(--text-main);font-variant-numeric:tabular-nums;line-height:1;">${summary.total}</div>
                <div style="font-size:10px;color:var(--text-muted);margin-top:2px;">导入总数</div>
              </div>
              <div style="padding:10px;background:var(--emerald-50);border-radius:var(--radius-md);">
                <div style="font-size:20px;font-weight:800;color:var(--emerald-600);font-variant-numeric:tabular-nums;line-height:1;">${summary.available}</div>
                <div style="font-size:10px;color:var(--emerald-700);margin-top:2px;">可外呼</div>
              </div>
              <div style="padding:10px;background:var(--amber-50);border-radius:var(--radius-md);">
                <div style="font-size:20px;font-weight:800;color:var(--amber-600);font-variant-numeric:tabular-nums;line-height:1;">${summary.pending}</div>
                <div style="font-size:10px;color:var(--amber-700);margin-top:2px;">待授权审核</div>
              </div>
              <div style="padding:10px;background:var(--rose-50);border-radius:var(--radius-md);">
                <div style="font-size:20px;font-weight:800;color:var(--rose-600);font-variant-numeric:tabular-nums;line-height:1;">${summary.dup+summary.formatErr+summary.blacklist+summary.unsub}</div>
                <div style="font-size:10px;color:var(--rose-700);margin-top:2px;">已拦截</div>
              </div>
            </div>
            <div style="margin-top:16px;display:flex;gap:8px;justify-content:center;">
              <button class="btn btn-primary btn-sm" onclick="App.navigate('campaigns');App.showToast('可在任务创建中选择此分组','success')"><i data-lucide="plus"></i>创建外呼任务</button>
              <button class="btn btn-outline btn-sm" onclick="setImportStep(1)"><i data-lucide="rotate-ccw"></i>再次导入</button>
            </div>
          </div>

          <!-- 画像补全机制说明: 号码→通话中AI提取→结构化画像 -->
          <div class="card" style="padding:14px 16px;">
            <div style="font-size:12px;font-weight:600;color:var(--text-main);display:flex;align-items:center;gap:6px;margin-bottom:10px;">
              <i data-lucide="sparkles" style="width:13px;height:13px;color:var(--brand-500);"></i>名单画像补全机制
              <span class="badge" style="font-size:9.5px;line-height:15px;background:var(--brand-50);color:var(--brand-700);border:1px solid var(--brand-200);">号码 → 识别 → 补全</span>
              <button class="btn btn-ghost btn-sm" style="margin-left:auto;height:24px;padding:0 10px;font-size:10.5px;color:var(--amber-700);background:var(--amber-50);border:1px solid var(--amber-200);" onclick="switchLeadsTab('list');leadFilterCompleteness='incomplete';refreshLeadsTable();">
                <i data-lucide="user-round-pen" style="width:11px;height:11px;"></i>前往手动补全（信息不全 ${AppState.leads.filter(l => AppState.leadCompleteness(l) < 60).length} 人）
              </button>
            </div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">
              <div style="padding:10px 12px;background:var(--ink-50);border-radius:var(--radius-md);border:1px solid var(--border-subtle);">
                <div style="font-size:10.5px;font-weight:600;color:var(--text-muted);margin-bottom:5px;"><i data-lucide="phone" style="width:11px;height:11px;vertical-align:-1px;margin-right:3px;"></i>1. 原始名单字段</div>
                <div style="font-size:11px;color:var(--text-main);line-height:1.7;">手机号 <span style="color:var(--text-muted);">（多数客户仅有这一项）</span></div>
                <div style="font-size:11px;color:var(--text-main);line-height:1.7;">姓名 / 来源渠道 <span style="color:var(--text-muted);">（可选）</span></div>
                <div style="font-size:10px;color:var(--amber-600);margin-top:4px;">画像完整度 ≈ 15%</div>
              </div>
              <div style="padding:10px 12px;background:var(--brand-50);border-radius:var(--radius-md);border:1px solid var(--brand-200);">
                <div style="font-size:10.5px;font-weight:600;color:var(--brand-700);margin-bottom:5px;"><i data-lucide="mic" style="width:11px;height:11px;vertical-align:-1px;margin-right:3px;"></i>2. 外呼通话中 AI 提取</div>
                <div style="font-size:11px;color:var(--text-secondary);line-height:1.7;">ASR 转写 + LLM 结构化提取：职业、学历、年龄段、择偶偏好、婚恋状态…</div>
                <div style="font-size:10px;color:var(--emerald-600);margin-top:4px;">自动写入客户档案（可到沙盒「提取关键词」查看实时过程）</div>
              </div>
              <div style="padding:10px 12px;background:var(--emerald-50);border-radius:var(--radius-md);border:1px solid var(--emerald-200);">
                <div style="font-size:10.5px;font-weight:600;color:var(--emerald-700);margin-bottom:5px;"><i data-lucide="database" style="width:11px;height:11px;vertical-align:-1px;margin-right:3px;"></i>3. 授权数据源补全</div>
                <div style="font-size:11px;color:var(--text-secondary);line-height:1.7;">实名授权表单、历史到店记录、红娘人工补充访谈</div>
                <div style="font-size:10px;color:var(--emerald-700);margin-top:4px;">无授权的外部数据 <strong style="color:var(--rose-600);">严禁</strong>用于外呼（合规红线）</div>
              </div>
            </div>
          </div>

          <!-- Error Details -->
          <div class="card" style="padding:0;overflow:hidden;">
            <div style="padding:10px 14px;border-bottom:1px solid var(--border-color);display:flex;align-items:center;justify-content:space-between;">
              <div style="font-size:12px;font-weight:600;color:var(--text-main);display:flex;align-items:center;gap:6px;">
                <i data-lucide="alert-triangle" style="width:13px;height:13px;color:var(--amber-500);"></i>异常与拦截明细
                <span class="badge badge-warning" style="font-size:10px;line-height:16px;">${errorRows.length}条</span>
              </div>
              <div style="display:flex;gap:3px;">
                ${['ALL','格式错误','重复数据','黑名单','已退订'].map(f => `
                  <button class="btn btn-sm" style="height:24px;padding:0 8px;font-size:10.5px;${importFilterError===f?'background:var(--brand-50);color:var(--brand-700);border-color:var(--brand-200);':'background:transparent;color:var(--text-muted);border-color:transparent;'}" onclick="setImportFilter('${f}')">${f==='ALL'?'全部':f}</button>
                `).join('')}
              </div>
            </div>
            <div style="overflow-x:auto;">
              <table class="data-table" style="font-size:11px;">
                <thead><tr><th style="width:50px;">行号</th><th style="width:110px;">脱敏手机号</th><th style="width:80px;">错误类型</th><th>错误说明</th><th style="width:120px;">处理建议</th></tr></thead>
                <tbody>
                  ${filteredErrors.map(r => `
                    <tr>
                      <td style="font-family:var(--font-mono);font-size:11px;">${r.row}</td>
                      <td style="font-family:var(--font-mono);font-size:11px;">${r.phone}</td>
                      <td><span class="badge ${r.type==='格式错误'?'badge-neutral':r.type==='重复数据'?'badge-warning':r.type==='黑名单'?'badge-danger':'badge-basic'}" style="font-size:9.5px;line-height:15px;">${r.type}</span></td>
                      <td style="color:var(--text-secondary);font-size:11px;">${r.desc}</td>
                      <td style="color:var(--text-muted);font-size:10.5px;">${r.advice}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Right: Authorization Review Panel -->
        <div style="display:flex;flex-direction:column;gap:var(--content-gap);">
          <div class="card" style="padding:14px;">
            <div style="font-size:12px;font-weight:600;color:var(--text-main);margin-bottom:10px;display:flex;align-items:center;gap:6px;">
              <i data-lucide="shield-check" style="width:13px;height:13px;color:var(--amber-500);"></i>待授权审核
              <span class="badge badge-warning" style="font-size:10px;line-height:16px;">${summary.pending}条</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:6px;">
              ${[
                {name:'张明华', phone:'138****3344', source:'抖音信息流', time:'2026-08-20 10:23', hasProof:true},
                {name:'李婷婷', phone:'139****5566', source:'小红书', time:'2026-08-20 10:45', hasProof:false},
                {name:'王建国', phone:'137****7788', source:'转介绍', time:'2026-08-20 11:02', hasProof:true},
              ].map((p,i) => `
                <div style="padding:8px 10px;background:var(--ink-50);border-radius:var(--radius-md);border-left:3px solid ${p.hasProof?'var(--amber-400)':'var(--rose-400)'};">
                  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:3px;">
                    <span style="font-size:11.5px;font-weight:600;color:var(--text-main);">${p.name}</span>
                    <span style="font-size:10px;color:var(--text-muted);font-variant-numeric:tabular-nums;">${p.time.split(' ')[1]}</span>
                  </div>
                  <div style="font-size:10px;color:var(--text-muted);margin-bottom:5px;font-variant-numeric:tabular-nums;">
                    ${p.phone} · ${p.source} ${!p.hasProof?'· <span style="color:var(--rose-600);">缺授权证明</span>':''}
                  </div>
                  <div style="display:flex;gap:3px;">
                    <button class="btn btn-ghost btn-sm" style="height:22px;padding:0 8px;font-size:10px;color:var(--emerald-700);background:var(--emerald-50);border-color:transparent;" onclick="App.showToast('已通过 ${p.name} 的授权审核','success')"><i data-lucide="check" style="width:10px;height:10px;"></i>通过</button>
                    <button class="btn btn-ghost btn-sm" style="height:22px;padding:0 8px;font-size:10px;color:var(--rose-700);background:var(--rose-50);border-color:transparent;" onclick="App.showToast('已驳回 ${p.name}','warning')"><i data-lucide="x" style="width:10px;height:10px;"></i>驳回</button>
                    <button class="btn btn-ghost btn-sm" style="height:22px;padding:0 6px;font-size:10px;" onclick="App.showToast('查看授权凭证','info')"><i data-lucide="file-text" style="width:10px;height:10px;"></i></button>
                  </div>
                </div>
              `).join('')}
              <button class="btn btn-outline btn-sm" style="width:100%;margin-top:4px;font-size:11px;" onclick="App.showToast('已批量通过17条审核','success')">
                批量通过剩余 17 条
              </button>
            </div>
          </div>

          <div class="card" style="padding:14px;">
            <div style="font-size:12px;font-weight:600;color:var(--text-main);margin-bottom:10px;display:flex;align-items:center;gap:6px;">
              <i data-lucide="file-info" style="width:13px;height:13px;color:var(--brand-500);"></i>导入批次信息
            </div>
            <div style="display:flex;flex-direction:column;gap:5px;font-size:11px;">
              <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-muted);">批次号</span><span style="font-family:var(--font-mono);color:var(--text-main);">IMP-20260820-003</span></div>
              <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-muted);">文件名</span><span style="color:var(--text-main);">杭州名校潜客_0820.xlsx</span></div>
              <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-muted);">来源渠道</span><span style="color:var(--text-main);">抖音信息流-优质脱单</span></div>
              <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-muted);">授权类型</span><span style="color:var(--text-main);">表单勾选授权</span></div>
              <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-muted);">责任人</span><span style="color:var(--text-main);">林总监</span></div>
              <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-muted);">导入时间</span><span style="font-family:var(--font-mono);color:var(--text-main);">2026-08-20 14:32</span></div>
            </div>
          </div>

          <div class="card" style="padding:14px;background:var(--amber-50);border-color:var(--amber-200);">
            <div style="font-size:11px;font-weight:600;color:var(--amber-800);margin-bottom:5px;display:flex;align-items:center;gap:4px;">
              <i data-lucide="info" style="width:12px;height:12px;"></i>合规提示
            </div>
            <div style="font-size:10.5px;color:var(--amber-700);line-height:1.6;">
              所有外呼名单必须保留来源授权凭证。本页为原型演示，实际生产须留存授权截图/表单记录至少2年，并在客户退订后T+1内加入黑名单。
            </div>
          </div>
        </div>
      </div>
      `}
    </div>
  `;
}

function renderImportStep(step, summary) {
  // For demo, show a "demo" step with a "jump to completion" button
  const stepContent = {
    1: { icon:'upload-cloud', title:'上传名单文件', desc:'拖拽或选择 Excel/CSV 文件，填写来源渠道和授权信息' },
    2: { icon:'columns', title:'字段映射', desc:'将原始文件列映射到系统标准字段（姓名/手机号/性别/年龄/城市/学历/职业/来源）' },
    3: { icon:'check-square', title:'数据校验', desc:'系统自动校验格式、去重、黑名单匹配、退订过滤' },
    4: { icon:'shield', title:'授权审核', desc:'审核名单来源授权证明，确认可外呼' },
  };
  const s = stepContent[step];
  return `
    <div class="card" style="padding:40px 24px;text-align:center;">
      <div style="width:56px;height:56px;border-radius:50%;background:var(--brand-50);display:flex;align-items:center;justify-content:center;margin:0 auto 14px;">
        <i data-lucide="${s.icon}" style="width:24px;height:24px;color:var(--brand-500);"></i>
      </div>
      <div style="font-size:14px;font-weight:600;color:var(--text-main);margin-bottom:6px;">步骤 ${step}：${s.title}</div>
      <div style="font-size:12px;color:var(--text-muted);max-width:480px;margin:0 auto 18px;line-height:1.6;">${s.desc}</div>
      <div style="display:flex;gap:8px;justify-content:center;">
        <button class="btn btn-outline btn-sm" onclick="setImportStep(Math.max(1,${step}-1))"><i data-lucide="arrow-left"></i>上一步</button>
        <button class="btn btn-primary btn-sm" onclick="setImportStep(${step+1})">下一步<i data-lucide="arrow-right"></i></button>
        <button class="btn btn-ghost btn-sm" onclick="setImportStep(5)">直接查看完成结果</button>
      </div>
      <div style="margin-top:20px;padding:12px;background:var(--ink-50);border-radius:var(--radius-md);max-width:420px;margin-left:auto;margin-right:auto;text-align:left;font-size:11px;color:var(--text-secondary);">
        <div style="font-weight:600;color:var(--text-main);margin-bottom:6px;"><i data-lucide="database" style="width:12px;height:12px;color:var(--brand-500);display:inline;vertical-align:-1px;margin-right:3px;"></i>模拟批次数据</div>
        <div>总条数 100 · 格式错误2 · 重复5 · 黑名单3 · 退订2 · 待审核20</div>
        <div style="color:var(--emerald-600);font-weight:600;margin-top:3px;font-variant-numeric:tabular-nums;">预计可外呼 ${summary.available} 条</div>
      </div>
    </div>
  `;
}

// ── Actions ──

function switchLeadsTab(tab) {
  leadsActiveTab = tab;
  if (tab === 'import') importStep = 5; // start at completion for demo
  App.refreshCurrentView();
}

function setImportStep(n) { importStep = n; App.refreshCurrentView(); }
function setImportFilter(f) { importFilterError = f; App.refreshCurrentView(); }
function refreshLeadsTable() { App.refreshCurrentView(); }

function resetLeadsFilters() {
  leadSearchTerm = ''; leadFilterTier = 'ALL'; leadFilterStatus = 'ALL'; leadFilterCompleteness = 'ALL'; leadFilterChannel = 'ALL';
  App.refreshCurrentView();
}
function exportLeadsCsv() { App.showToast('潜客数据已导出（演示）', 'success'); }
function openImportLeadsModal() { switchLeadsTab('import'); }

// ── 手动补全画像弹窗: 打开客户信息编辑, 保存写回 AppState ──
function openLeadEditModal(leadId) {
  const lead = AppState.leads.find(l => l.id === leadId);
  if (!lead) return;
  const comp = AppState.leadCompleteness(lead);

  App.showModal({
    title: `手动补全画像 - ${lead.name}`,
    size: 'lg',
    content: `
      <div style="padding:2px 0;display:flex;flex-direction:column;gap:12px;">
        <!-- 完整度概览 -->
        <div style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:linear-gradient(135deg,rgba(245,158,11,0.08),rgba(14,165,233,0.06));border:1px solid rgba(245,158,11,0.25);border-radius:var(--radius-md);">
          <div style="width:52px;height:52px;border-radius:50%;background:conic-gradient(var(--amber-500) 0deg ${comp*3.6}deg, var(--ink-100) ${comp*3.6}deg 360deg);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <div style="width:40px;height:40px;border-radius:50%;background:var(--bg-card);display:flex;align-items:center;justify-content:center;flex-direction:column;">
              <span style="font-size:13px;font-weight:800;color:var(--amber-600);line-height:1;">${comp}%</span>
              <span style="font-size:7.5px;color:var(--text-muted);">完整度</span>
            </div>
          </div>
          <div style="font-size:11px;color:var(--text-secondary);line-height:1.6;">
            <div style="font-weight:600;color:var(--text-main);margin-bottom:2px;"><i data-lucide="sparkles" style="width:11px;height:11px;display:inline;vertical-align:-1px;margin-right:3px;"></i>补全建议</div>
            当前仅有：${lead.phone}${lead.age>0 ? ' · '+lead.age+'岁' : ''}${lead.education ? ' · '+lead.education : ''}<br>
            建议优先补全 <strong style="color:var(--amber-700);">职业、年收入、择偶要求</strong> 等核心字段，补全后可参与精准匹配。
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label">客户姓名</label>
            <input type="text" id="edit_lead_name" class="form-input" value="${lead.name}" style="height:32px;width:100%;">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label">年龄</label>
            <input type="number" id="edit_lead_age" class="form-input" value="${lead.age > 0 ? lead.age : ''}" placeholder="未知可留空" style="height:32px;width:100%;">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label">性别</label>
            <select id="edit_lead_gender" class="form-select" style="height:32px;width:100%;">
              <option value="女" ${lead.gender==='女'?'selected':''}>女</option>
              <option value="男" ${lead.gender==='男'?'selected':''}>男</option>
            </select>
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label">所在区域</label>
            <input type="text" id="edit_lead_city" class="form-input" value="${lead.city || ''}" placeholder="如：杭州·滨江区" style="height:32px;width:100%;">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label">学历</label>
            <input type="text" id="edit_lead_edu" class="form-input" value="${lead.education || ''}" placeholder="如：浙江大学·硕士" style="height:32px;width:100%;">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label">职业</label>
            <input type="text" id="edit_lead_occ" class="form-input" value="${lead.occupation || ''}" placeholder="如：阿里资深后端架构师" style="height:32px;width:100%;">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label">年收入</label>
            <input type="text" id="edit_lead_income" class="form-input" value="${lead.annualIncome || ''}" placeholder="如：45-55万" style="height:32px;width:100%;">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label">房产/车辆</label>
            <input type="text" id="edit_lead_house_car" class="form-input" value="${[lead.housingStatus, lead.carStatus].filter(Boolean).join(' / ')}" placeholder="如：滨江商品房 / 特斯拉" style="height:32px;width:100%;">
          </div>
        </div>

        <div style="padding:10px 12px;background:var(--brand-50);border:1px solid var(--brand-200);border-radius:var(--radius-md);">
          <div style="font-size:11px;font-weight:700;color:var(--brand-700);margin-bottom:8px;"><i data-lucide="heart" style="width:11px;height:11px;display:inline;vertical-align:-1px;margin-right:3px;"></i>择偶要求（核心匹配字段）</div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label">年龄范围</label>
              <input type="text" id="edit_lead_req_age" class="form-input" value="${lead.mateRequirement.ageRange==='未采集'?'':lead.mateRequirement.ageRange}" placeholder="如：28-33岁" style="height:30px;width:100%;font-size:11.5px;">
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label">身高要求</label>
              <input type="text" id="edit_lead_req_height" class="form-input" value="${lead.mateRequirement.height==='未采集'?'':lead.mateRequirement.height}" placeholder="如：175cm+" style="height:30px;width:100%;font-size:11.5px;">
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label">学历要求</label>
              <input type="text" id="edit_lead_req_edu" class="form-input" value="${lead.mateRequirement.education==='未采集'?'':lead.mateRequirement.education}" placeholder="如：985/211硕士" style="height:30px;width:100%;font-size:11.5px;">
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label">收入要求</label>
              <input type="text" id="edit_lead_req_income" class="form-input" value="${lead.mateRequirement.income==='未采集'?'':lead.mateRequirement.income}" placeholder="如：年薪30万+" style="height:30px;width:100%;font-size:11.5px;">
            </div>
          </div>
          <div class="form-group" style="margin-bottom:0;margin-top:8px;">
            <label class="form-label">核心要求描述</label>
            <textarea id="edit_lead_req_core" class="form-input" rows="2" style="width:100%;font-size:11.5px;padding:7px 10px;resize:none;" placeholder="如：互联网/金融大厂，性格温和有责任感，杭州定居">${lead.mateRequirement.coreReq==='待首次通话后由AI提取择偶偏好'?'':lead.mateRequirement.coreReq}</textarea>
          </div>
        </div>

        <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--ink-50);border-radius:var(--radius-md);font-size:10.5px;color:var(--text-muted);">
          <i data-lucide="lock" style="width:11px;height:11px;flex-shrink:0;color:var(--emerald-600);"></i>
          补全信息仅用于内部精准匹配；手机号等敏感字段保持脱敏，编辑后将同步至客户档案与审计日志。
        </div>
      </div>
    `,
    confirmText: '保存补全',
    onConfirm: () => {
      const v = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
      const n = (id, fallback) => { const el = document.getElementById(id); if (!el || !el.value.trim()) return fallback; return el.value.trim(); };

      const houseCar = v('edit_lead_house_car').split('/').map(s => s.trim()).filter(Boolean);
      const patch = {
        name: v('edit_lead_name') || lead.name,
        age: v('edit_lead_age') ? parseInt(v('edit_lead_age'), 10) : lead.age,
        gender: v('edit_lead_gender') || lead.gender,
        city: v('edit_lead_city') || '杭州',
        education: n('edit_lead_edu', lead.education || '未采集'),
        occupation: n('edit_lead_occ', lead.occupation || '待补全'),
        annualIncome: n('edit_lead_income', lead.annualIncome || '待定'),
        housingStatus: houseCar[0] || lead.housingStatus || '',
        carStatus: houseCar[1] || lead.carStatus || '',
        mateRequirement: {
          ageRange: n('edit_lead_req_age', lead.mateRequirement.ageRange),
          height: n('edit_lead_req_height', lead.mateRequirement.height),
          education: n('edit_lead_req_edu', lead.mateRequirement.education),
          income: n('edit_lead_req_income', lead.mateRequirement.income),
          coreReq: n('edit_lead_req_core', lead.mateRequirement.coreReq)
        }
      };
      const completeness = AppState.updateLeadProfile(lead, patch);
      const badge = completeness >= 85 ? '已完整' : completeness >= 60 ? '已完善' : '待完善';
      App.showToast(`${lead.name} 画像补全成功 · 完整度 ${completeness}%（${badge}）`, 'success');
      App.refreshCurrentView();
    }
  });
}

window.LeadsView = LeadsView;
window.switchLeadsTab = switchLeadsTab;
window.setImportStep = setImportStep;
window.setImportFilter = setImportFilter;
window.refreshLeadsTable = refreshLeadsTable;
window.resetLeadsFilters = resetLeadsFilters;
window.exportLeadsCsv = exportLeadsCsv;
window.openLeadEditModal = openLeadEditModal;
