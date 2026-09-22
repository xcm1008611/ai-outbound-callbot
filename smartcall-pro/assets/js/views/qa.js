// View: QA (智能质检中心) v2 - 待复核队列 · 申诉流转 · 规则版本 · 5维打分 · 录音波形

const QAView = {
  activeTab: 'all', // all | recheck_queue | disputed | high_risk
  selectedRecordId: 'qa_001',
  isPlaying: false,
  playbackProgress: 35,
  playbackSpeed: 1.0,
  ruleVersion: '婚恋合规质检标准 v2.4 (2026-08-01)',

  records: [
    {
      id: 'qa_001',
      lead_name: '赵子轩',
      phone: '138****9201',
      task_name: '【高知名校】浙大/复旦硕博才俊专线',
      duration: '2分48秒',
      call_time: '2026-08-19 14:24',
      score: 96,
      grade: '优秀',
      risk_level: 'low',
      risk_tags: ['无违规', '话术完整', '痛点锁定准'],
      review_status: 'approved', // pending_review, approved, disputed, revised
      dispute_status: 'none', // none, pending_review, resolved, rejected
      reviewer: 'AI质检引擎自动核验',
      review_note: '多轮语义符合度极高，无虚假承诺，合规红线满分通过。',
      dimensions: { opening: 98, needs: 95, objection: 94, compliance: 100, closing: 96 },
      dialogue: [
        { role: 'ai', time: '00:01', text: '您好赵先生！我是知缘婚恋的资深红娘助理林林。看您之前登记过在杭州从事软件架构，今天同步个好消息~', tag: '标准开场', risk: false },
        { role: 'user', time: '00:08', text: '哦，你们这是相亲中介吧？我平时工作挺忙的，周末经常加班没时间。', tag: '异议表达', risk: false },
        { role: 'ai', time: '00:15', text: '特别理解您！程序员研发任务确实重，所以我们专门推出【1对1精准前置匹配】，不用盲目无效社交。我们库里正好有一位同在滨江网易的UI设计师姑娘，浙大毕业，也喜欢摄影。', tag: '化解+抛诱饵', risk: false },
        { role: 'user', time: '00:30', text: '听起来还挺巧的，她多大啊？平时有什么兴趣爱好？', tag: '意向升温', risk: false },
        { role: 'ai', time: '00:36', text: '姑娘是96年的，性格特别温和爱笑。我让专属红娘老师通过企微把脱敏资料和照片发您过目，您看可以吗？', tag: '企微铺垫', risk: false },
        { role: 'user', time: '00:46', text: '行吧，微信号就是我手机号，你让她加我吧。', tag: '明确同意', risk: false },
        { role: 'ai', time: '00:50', text: '好的赵先生，微信申请马上发出，祝您今天工作顺心，再见！', tag: '礼貌收尾', risk: false }
      ]
    },
    {
      id: 'qa_002',
      lead_name: '孙雅涵',
      phone: '139****1122',
      task_name: '【小红书种草】女嘉宾专场',
      duration: '1分52秒',
      call_time: '2026-08-19 11:15',
      score: 78,
      grade: '待复核',
      risk_level: 'medium',
      risk_tags: ['抢话检测(0.8s)', '意向判定偏高', '坐席申诉中'],
      review_status: 'disputed',
      dispute_status: 'pending_review',
      reviewer: '人工主管复检中',
      review_note: '坐席对打断抢话判定提出申诉，认为属于客户网络延迟造成的重叠。',
      dimensions: { opening: 85, needs: 75, objection: 72, compliance: 95, closing: 82 },
      dialogue: [
        { role: 'ai', time: '00:01', text: '您好孙女士！我是知缘高端婚恋中心的红娘助手晓晴。', tag: '开场', risk: false },
        { role: 'user', time: '00:06', text: '我现在在开会，请晚点打。', tag: '忙碌打断', risk: false },
        { role: 'ai', time: '00:07', text: '好的不好意思打扰！我稍后加您微信留言...', tag: '轻微抢话预警', risk: true },
        { role: 'ai', time: '00:10', text: '祝您工作顺利，再见。', tag: '快速退出', risk: false }
      ]
    },
    {
      id: 'qa_003',
      lead_name: '张建军(父亲)',
      phone: '137****5689',
      task_name: '【体制编制专区】父母帮找专场',
      duration: '3分12秒',
      call_time: '2026-08-19 09:40',
      score: 92,
      grade: '良好',
      risk_level: 'low',
      risk_tags: ['共情力强', '父母画像清晰', '已人工复核通过'],
      review_status: 'approved',
      dispute_status: 'none',
      reviewer: '质检主管-周丽 (复核确认)',
      review_note: '话术亲切自然，有效识别父母长辈代寻诉求并获取信任。',
      dimensions: { opening: 95, needs: 96, objection: 90, compliance: 100, closing: 90 },
      dialogue: [
        { role: 'ai', time: '00:01', text: '叔叔您好！我是知缘婚恋的红娘小陈，看您在网上登记想给儿子找个好姑娘？', tag: '身份确认', risk: false },
        { role: 'user', time: '00:07', text: '是啊，我儿子31了，自己不着急，我们做父母的天天发愁！', tag: '痛点倾诉', risk: false },
        { role: 'ai', time: '00:15', text: '天下父母心，做长辈的确实操心！您放心，我们这边体制内和教师编制的姑娘特别多。我加您微信，把姑娘资料给您和老伴先掌掌眼！', tag: '共情关怀', risk: false }
      ]
    },
    {
      id: 'qa_004',
      lead_name: '刘建平',
      phone: '135****0019',
      task_name: '【全网公域】短视频表单',
      duration: '0分28秒',
      call_time: '2026-08-19 09:12',
      score: 68,
      grade: '违规熔断',
      risk_level: 'high',
      risk_tags: ['敏感词触发', 'AI优雅拦截', '已列入黑名单'],
      review_status: 'approved',
      dispute_status: 'none',
      reviewer: '安全风控模型实时阻断',
      review_note: '用户言语粗暴触发反骚扰规则，AI在30秒内礼貌断呼并自动拉黑。',
      dimensions: { opening: 90, needs: 40, objection: 50, compliance: 100, closing: 60 },
      dialogue: [
        { role: 'ai', time: '00:01', text: '您好刘先生，这里是知缘智能婚恋...', tag: '开场', risk: false },
        { role: 'user', time: '00:06', text: '别废话，你们那有没有二十出头年轻美女？', tag: '不文明用语', risk: true },
        { role: 'ai', time: '00:14', text: '知缘实行严格实名制与严肃婚恋准则，感谢接听，再见。', tag: '合规熔断挂机', risk: false }
      ]
    }
  ],

  render() {
    let filteredRecords = this.records;
    if (this.activeTab === 'recheck_queue') {
      filteredRecords = this.records.filter(r => r.score < 85 || r.review_status === 'pending_review' || r.review_status === 'disputed');
    } else if (this.activeTab === 'disputed') {
      filteredRecords = this.records.filter(r => r.dispute_status !== 'none');
    } else if (this.activeTab === 'high_risk') {
      filteredRecords = this.records.filter(r => r.risk_level === 'high' || r.risk_level === 'medium');
    }

    const selected = filteredRecords.find(r => r.id === this.selectedRecordId) || filteredRecords[0] || this.records[0];

    const disputedCount = this.records.filter(r => r.dispute_status === 'pending_review').length;
    const recheckCount = this.records.filter(r => r.score < 85 || r.review_status === 'disputed').length;

    return `
      <div class="view-fade-enter">
        <!-- Page Header -->
        <div class="page-header">
          <div class="page-title-group">
            <div class="page-title">
              <i data-lucide="shield-check"></i>
              智能质检中心
              <span class="badge badge-primary" style="margin-left:8px;font-size:10px;">${this.ruleVersion.split(' ')[0]}</span>
            </div>
            <div class="page-subtitle">大模型深度语义分析 · 5维量化打分 · 待复核队列 · 申诉改判闭环</div>
          </div>
          <div class="page-actions">
            <button class="btn btn-outline btn-sm" onclick="QAView.showBatchAssignModal()">
              <i data-lucide="user-check"></i>批量分配复核
            </button>
            <button class="btn btn-outline btn-sm" onclick="QAView.exportQAReport()">
              <i data-lucide="download"></i>导出质检报表
            </button>
            <button class="btn btn-primary btn-sm" onclick="QAView.showRuleConfigModal()">
              <i data-lucide="sliders"></i>质检规则版本
            </button>
          </div>
        </div>

        <!-- KPIs -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-top-row">
              <span class="metric-label">平均质检综合分</span>
              <div class="metric-icon-box accent-emerald"><i data-lucide="award"></i></div>
            </div>
            <div class="metric-value-row">
              <span class="metric-number" style="color:var(--emerald-600);">93.4</span><span class="metric-unit">分</span>
              <span class="metric-trend up"><i data-lucide="trending-up" style="width:10px;height:10px;"></i>+1.8</span>
            </div>
            <div style="font-size:10.5px;color:var(--emerald-600);margin-top:2px;">优良率 96.8% (≥85分)</div>
          </div>
          <div class="metric-card">
            <div class="metric-top-row">
              <span class="metric-label">今日质检覆盖通数</span>
              <div class="metric-icon-box accent-blue"><i data-lucide="phone-call"></i></div>
            </div>
            <div class="metric-value-row">
              <span class="metric-number">1,420</span><span class="metric-unit">通</span>
            </div>
            <div style="font-size:10.5px;color:var(--text-muted);margin-top:2px;">100%全量AI质检 · 延迟 < 1.2s</div>
          </div>
          <div class="metric-card">
            <div class="metric-top-row">
              <span class="metric-label">待人工复核队列</span>
              <div class="metric-icon-box accent-amber"><i data-lucide="clipboard-check"></i></div>
            </div>
            <div class="metric-value-row">
              <span class="metric-number" style="color:var(--amber-600);">${recheckCount}</span><span class="metric-unit">通</span>
            </div>
            <div style="font-size:10.5px;color:var(--text-muted);margin-top:2px;">含 ${disputedCount} 通坐席申诉件</div>
          </div>
          <div class="metric-card">
            <div class="metric-top-row">
              <span class="metric-label">人机质检吻合度</span>
              <div class="metric-icon-box accent-violet"><i data-lucide="check-check"></i></div>
            </div>
            <div class="metric-value-row">
              <span class="metric-number" style="color:var(--violet-600);">99.2</span><span class="metric-unit">%</span>
            </div>
            <div style="font-size:10.5px;color:var(--text-muted);margin-top:2px;">规则版本 v2.4 运行中</div>
          </div>
        </div>

        <!-- Tab & Filter Strip -->
        <div class="filter-bar" style="margin-bottom:var(--content-gap);">
          <div style="display:flex;gap:4px;">
            <button class="btn ${this.activeTab==='all'?'btn-primary':'btn-outline'} btn-sm" style="height:28px;font-size:11px;" onclick="QAView.switchTab('all')">
              全部记录 (${this.records.length})
            </button>
            <button class="btn ${this.activeTab==='recheck_queue'?'btn-primary':'btn-outline'} btn-sm" style="height:28px;font-size:11px;" onclick="QAView.switchTab('recheck_queue')">
              <i data-lucide="alert-circle" style="width:11px;height:11px;color:var(--amber-500);margin-right:2px;"></i>待复核队列 (${recheckCount})
            </button>
            <button class="btn ${this.activeTab==='disputed'?'btn-primary':'btn-outline'} btn-sm" style="height:28px;font-size:11px;" onclick="QAView.switchTab('disputed')">
              <i data-lucide="help-circle" style="width:11px;height:11px;color:var(--rose-500);margin-right:2px;"></i>申诉处理 (${disputedCount})
            </button>
            <button class="btn ${this.activeTab==='high_risk'?'btn-primary':'btn-outline'} btn-sm" style="height:28px;font-size:11px;" onclick="QAView.switchTab('high_risk')">
              <i data-lucide="shield-alert" style="width:11px;height:11px;color:var(--rose-500);margin-right:2px;"></i>风险录音
            </button>
          </div>
          <div class="filter-divider"></div>
          <span style="font-size:11px;color:var(--text-muted);">
            当前匹配规则: <strong style="color:var(--text-main);">${this.ruleVersion}</strong>
          </span>
        </div>

        <!-- Main Split: Left Record List + Right Detail -->
        <div style="display:grid;grid-template-columns:320px 1fr;gap:var(--content-gap);min-height:calc(100vh - 300px);">
          <!-- Left: Record List -->
          <div style="display:flex;flex-direction:column;gap:var(--content-gap);">
            <div class="card" style="padding:10px;flex:1;display:flex;flex-direction:column;min-height:0;">
              <div style="display:flex;align-items:center;justify-content:space-between;padding:2px 4px 8px;border-bottom:1px solid var(--border-subtle);margin-bottom:6px;">
                <span style="font-size:11px;font-weight:700;color:var(--text-main);display:inline-flex;align-items:center;gap:4px;"><i data-lucide="list" style="width:12px;height:12px;color:var(--brand-500);"></i>通话录音列表</span>
                <span style="font-size:10.5px;color:var(--text-muted);font-variant-numeric:tabular-nums;">共${filteredRecords.length}条</span>
              </div>
              <div style="display:flex;flex-direction:column;gap:4px;overflow-y:auto;flex:1;">
                ${filteredRecords.map(r => `
                  <div onclick="QAView.selectRecord('${r.id}')" style="cursor:pointer;padding:8px 10px;border-radius:var(--radius-md);border:1px solid ${r.id===selected.id?'var(--brand-200)':'transparent'};background:${r.id===selected.id?'var(--brand-50)':'transparent'};transition:all 0.15s;">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:3px;">
                      <span style="font-size:12px;font-weight:700;color:var(--text-main);">${r.lead_name}</span>
                      <span class="tier-pill ${r.score>=90?'tier-s':r.score>=80?'tier-a':'tier-d'}" style="font-size:9.5px;padding:0 5px;line-height:16px;">${r.score}分 · ${r.grade}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;font-size:10.5px;color:var(--text-muted);margin-bottom:3px;">
                      <span style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${r.task_name}</span>
                      <span style="font-variant-numeric:tabular-nums;flex-shrink:0;margin-left:4px;">${r.duration}</span>
                    </div>
                    <div style="display:flex;gap:3px;flex-wrap:wrap;align-items:center;justify-content:space-between;">
                      <div style="display:flex;gap:2px;flex-wrap:wrap;">
                        ${r.risk_tags.map(t => `<span style="font-size:9px;padding:0 4px;line-height:14px;border-radius:3px;background:var(--ink-100);color:var(--text-muted);">${t}</span>`).join('')}
                      </div>
                      ${r.dispute_status === 'pending_review' ? `<span style="font-size:9px;color:var(--rose-600);font-weight:600;">待复检</span>` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Right: Detail Panel -->
          <div style="display:flex;flex-direction:column;gap:var(--content-gap);min-width:0;">
            <!-- Score & Review Verdict Header -->
            <div class="card" style="padding:14px 16px;">
              <div style="display:flex;align-items:flex-start;justify-content:space-between;padding-bottom:10px;border-bottom:1px solid var(--border-subtle);margin-bottom:10px;">
                <div style="min-width:0;">
                  <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                    <span style="font-size:14px;font-weight:700;color:var(--text-main);">${selected.lead_name} 通话质检详情</span>
                    <span style="font-size:10px;color:var(--text-muted);background:var(--ink-100);padding:1px 6px;border-radius:4px;font-variant-numeric:tabular-nums;">${selected.call_time}</span>
                    <span class="badge ${selected.review_status==='approved'?'badge-success':selected.review_status==='disputed'?'badge-warning':'badge-info'}" style="font-size:9.5px;">
                      ${selected.review_status==='approved'?'复核已通过':selected.review_status==='disputed'?'申诉复检中':'待人工复核'}
                    </span>
                  </div>
                  <div style="font-size:10.5px;color:var(--text-muted);margin-top:3px;">
                    ${selected.task_name} · 电话: ${selected.phone} · 时长: ${selected.duration} · 质检基准: ${this.ruleVersion.split(' ')[0]}
                  </div>
                </div>

                <!-- Big Score + Actions -->
                <div style="display:flex;align-items:center;gap:12px;flex-shrink:0;">
                  <div style="text-align:center;">
                    <div style="font-size:30px;font-weight:800;background:linear-gradient(135deg,${selected.score>=90?'var(--emerald-500),var(--brand-500)':selected.score>=80?'var(--amber-500),var(--brand-500)':'var(--rose-500),var(--amber-500)'});-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-variant-numeric:tabular-nums;line-height:1;">
                      ${selected.score}
                    </div>
                    <div style="font-size:10px;color:var(--text-muted);margin-top:2px;">/ 100 · ${selected.grade}</div>
                  </div>
                  <div style="display:flex;flex-direction:column;gap:4px;">
                    <button class="btn btn-primary btn-sm" style="height:26px;padding:0 8px;font-size:11px;" onclick="QAView.openRecheckModal('${selected.id}')">
                      <i data-lucide="check-square" style="width:11px;height:11px;"></i>人工复核/改判
                    </button>
                    ${selected.dispute_status === 'pending_review' ? `
                      <button class="btn btn-outline btn-sm" style="height:26px;padding:0 8px;font-size:11px;color:var(--rose-600);" onclick="QAView.openDisputeModal('${selected.id}')">
                        <i data-lucide="help-circle" style="width:11px;height:11px;"></i>处理申诉
                      </button>
                    ` : ''}
                  </div>
                </div>
              </div>

              <!-- Review Verdict Note Bar -->
              <div style="background:var(--ink-50);border-radius:var(--radius-md);padding:8px 12px;margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;font-size:11px;">
                <div>
                  <span style="color:var(--text-muted);">复核结论:</span>
                  <span style="color:var(--text-main);font-weight:600;margin-left:4px;">${selected.review_note}</span>
                </div>
                <span style="color:var(--text-muted);font-size:10px;">核验人: ${selected.reviewer}</span>
              </div>

              <!-- 5-Dimension Bars -->
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px 16px;">
                ${[
                  {k:'opening',label:'开场礼貌与身份明示',v:selected.dimensions.opening,c:'var(--brand-500)'},
                  {k:'needs',label:'痛点与择偶诉求挖掘',v:selected.dimensions.needs,c:'var(--violet-500)'},
                  {k:'objection',label:'异议化解与真诚度',v:selected.dimensions.objection,c:'var(--amber-500)'},
                  {k:'compliance',label:'合规红线(严禁夸大脱单率)',v:selected.dimensions.compliance,c:'var(--emerald-500)'},
                  {k:'closing',label:'加微铺垫与线索分流',v:selected.dimensions.closing,c:'var(--rose-500)'}
                ].map(d => `
                  <div>
                    <div style="display:flex;justify-content:space-between;font-size:10.5px;margin-bottom:2px;">
                      <span style="color:var(--text-secondary);">${d.label}</span>
                      <span style="font-weight:700;color:var(--text-main);font-variant-numeric:tabular-nums;">${d.v}分</span>
                    </div>
                    <div class="progress-bar-container" style="height:4px;">
                      <div style="width:${d.v}%;height:100%;background:${d.c};border-radius:2px;"></div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Waveform Player with Risk Marking -->
            <div class="card" style="padding:12px 16px;">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                <div style="display:flex;align-items:center;gap:6px;">
                  <i data-lucide="radio" style="width:13px;height:13px;color:var(--rose-500);"></i>
                  <span style="font-size:11px;font-weight:700;color:var(--text-main);">双轨智能录音波形 (红点标记风险位置)</span>
                </div>
                <div style="display:flex;gap:3px;">
                  ${[1.0, 1.25, 1.5, 2.0].map(s => `
                    <button class="btn ${this.playbackSpeed===s?'btn-primary':'btn-outline'} btn-sm" style="height:22px;padding:0 6px;font-size:10px;min-width:28px;" onclick="QAView.setSpeed(${s})">${s}x</button>
                  `).join('')}
                </div>
              </div>
              <div onclick="QAView.seekAudio(event)" style="height:44px;background:var(--ink-50);border-radius:var(--radius-md);position:relative;cursor:pointer;overflow:hidden;display:flex;align-items:center;justify-content:space-around;padding:0 8px;">
                ${Array.from({length:50}).map((_,i) => {
                  const h = Math.floor(Math.sin(i*0.35)*16+22);
                  const passed = (i/50)*100 <= this.playbackProgress;
                  // Flag risk point at i=12 for demo
                  const isRiskPoint = selected.risk_level !== 'low' && i === 12;
                  return `
                    <div style="width:2.5px;height:${h}px;border-radius:1.5px;background:${isRiskPoint?'var(--rose-500)':(passed?'var(--brand-500)':'var(--ink-200)')};position:relative;">
                      ${isRiskPoint ? `<div style="position:absolute;top:-4px;left:-2px;width:6px;height:6px;border-radius:50%;background:var(--rose-500);"></div>` : ''}
                    </div>
                  `;
                }).join('')}
                <div style="position:absolute;left:${this.playbackProgress}%;top:0;bottom:0;width:2px;background:var(--rose-500);box-shadow:0 0 6px var(--rose-500);"></div>
              </div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px;">
                <div style="display:flex;align-items:center;gap:8px;">
                  <button class="btn btn-primary btn-sm" style="width:28px;height:28px;padding:0;border-radius:50%;" onclick="QAView.togglePlay()">
                    <i data-lucide="${this.isPlaying?'pause':'play'}" style="width:12px;height:12px;"></i>
                  </button>
                  <span style="font-size:11px;color:var(--text-muted);font-variant-numeric:tabular-nums;">00:58 / ${selected.duration}</span>
                </div>
                <span style="font-size:10px;color:var(--text-muted);">点击波形或逐字稿句子可直接跳转定位</span>
              </div>
            </div>

            <!-- Transcript & Intent Markers -->
            <div class="card" style="padding:12px 16px;flex:1;display:flex;flex-direction:column;min-height:0;">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                <span style="font-size:11px;font-weight:700;color:var(--text-main);display:inline-flex;align-items:center;gap:4px;">
                  <i data-lucide="message-square-text" style="width:12px;height:12px;color:var(--brand-500);"></i>逐字稿与意图标记
                </span>
                <span style="font-size:9.5px;color:var(--emerald-600);background:var(--emerald-50);padding:1px 6px;border-radius:3px;">ASR声学模型置信度 98.6%</span>
              </div>
              <div style="display:flex;flex-direction:column;gap:6px;overflow-y:auto;flex:1;">
                ${selected.dialogue.map(d => `
                  <div onclick="QAView.jumpToTime('${d.time}')" style="cursor:pointer;display:flex;gap:8px;padding:6px 8px;border-radius:var(--radius-sm);background:${d.risk?'rgba(239,68,68,0.06)':(d.role==='ai'?'var(--brand-50)':'var(--ink-50)')};border:1px solid ${d.risk?'rgba(239,68,68,0.3)':'transparent'};">
                    <div style="font-size:10px;color:var(--text-muted);font-variant-numeric:tabular-nums;padding-top:1px;flex-shrink:0;width:32px;">${d.time}</div>
                    <div style="flex:1;min-width:0;">
                      <div style="display:flex;align-items:center;gap:4px;margin-bottom:2px;flex-wrap:wrap;">
                        <span style="font-size:10.5px;font-weight:700;color:${d.role==='ai'?'var(--brand-600)':'var(--emerald-600)'};">${d.role==='ai'?'AI红娘助理':selected.lead_name}</span>
                        <span style="font-size:9px;padding:0 4px;line-height:14px;border-radius:3px;background:${d.risk?'var(--rose-100)':(d.role==='ai'?'var(--brand-100)':'var(--emerald-100)')};color:${d.risk?'var(--rose-700)':(d.role==='ai'?'var(--brand-700)':'var(--emerald-700)')};">
                          ${d.tag}
                        </span>
                        ${d.risk ? `<span style="font-size:9px;color:var(--rose-600);font-weight:600;"><i data-lucide="alert-triangle" style="width:9px;height:9px;display:inline;"></i>风险嫌疑</span>` : ''}
                      </div>
                      <div style="font-size:11.5px;color:var(--text-main);line-height:1.5;">${d.text}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  switchTab(t) { this.activeTab = t; App.refreshCurrentView(); },
  selectRecord(id) { this.selectedRecordId = id; App.refreshCurrentView(); },
  togglePlay() { this.isPlaying = !this.isPlaying; App.showToast(this.isPlaying?'正在播放双轨录音...':'已暂停播放','info'); App.refreshCurrentView(); },
  setSpeed(s) { this.playbackSpeed = s; App.showToast(`播放倍速: ${s}x`,'info'); App.refreshCurrentView(); },
  seekAudio(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    this.playbackProgress = Math.max(0, Math.min(100, Math.round((e.clientX-rect.left)/rect.width*100)));
    App.refreshCurrentView();
  },
  jumpToTime(t) { App.showToast(`已定位录音时间戳 ${t}`,'info'); },
  exportQAReport() { App.showToast('正在导出质检分析与合规明细报表...','success'); },

  // Recheck / Correction Modal
  openRecheckModal(recordId) {
    const r = this.records.find(item => item.id === recordId);
    if (!r) return;

    App.showModal({
      title: `人工质检复核 / 纠偏改判 - ${r.lead_name}`,
      content: `
        <div style="padding:4px 0;display:flex;flex-direction:column;gap:10px;">
          <div style="background:var(--ink-50);border-radius:var(--radius-md);padding:10px 12px;">
            <div style="font-size:12px;font-weight:700;color:var(--text-main);">当前AI初检分：${r.score}分 (${r.grade})</div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">所属任务：${r.task_name} · 质检基准：${this.ruleVersion}</div>
          </div>

          <div class="form-group">
            <label class="form-label" style="font-size:11px;">复核判定结论</label>
            <select id="recheck_verdict_select" class="form-select" style="width:100%;height:32px;font-size:12px;">
              <option value="approved">维持原判 (AI质检准确，分值无误)</option>
              <option value="revised">纠偏改判 (AI识别有误，人工修正加分/扣分)</option>
              <option value="dispute_accepted">采纳坐席申诉 (撤销违规扣分，调整至92分)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" style="font-size:11px;">修正后得分</label>
            <input type="number" class="form-input" id="revised_score_input" value="${r.score}" style="width:100%;height:32px;font-size:12px;">
          </div>

          <div class="form-group">
            <label class="form-label" style="font-size:11px;">复核说明与质检评语</label>
            <textarea class="form-input" id="recheck_note_input" rows="3" style="width:100%;font-size:12px;padding:8px 10px;resize:none;" placeholder="填写人工复核依据、纠偏原因或合规建议...">${r.review_note}</textarea>
          </div>
        </div>
      `,
      confirmText: '确认提交复核',
      onConfirm: () => {
        const scoreInput = document.getElementById('revised_score_input');
        const noteInput = document.getElementById('recheck_note_input');
        if (scoreInput) r.score = parseInt(scoreInput.value, 10);
        if (noteInput) r.review_note = noteInput.value;
        r.review_status = 'approved';
        r.dispute_status = 'resolved';
        r.reviewer = '质检主管 (已完成复核)';
        AppState.writebackQA(r.id, r.score, r.review_note, '质检主管');
        App.showToast(`[${r.lead_name}] 质检复核结论已保存`, 'success');
        App.refreshCurrentView();
      }
    });
  },

  // Dispute Handling Modal
  openDisputeModal(recordId) {
    const r = this.records.find(item => item.id === recordId);
    if (!r) return;

    App.showModal({
      title: `处理坐席申诉 - ${r.lead_name}`,
      content: `
        <div style="padding:4px 0;display:flex;flex-direction:column;gap:10px;">
          <div style="background:var(--rose-50);border:1px solid var(--rose-200);border-radius:var(--radius-md);padding:10px 12px;">
            <div style="font-size:11.5px;color:var(--rose-800);font-weight:700;">坐席申诉诉求：撤销抢话扣分 (00:07处)</div>
            <div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">申诉理由：客户在第6秒停顿超过1.5秒，AI判定抢话属于网络抖动延迟。</div>
          </div>
          <div class="form-group">
            <label class="form-label" style="font-size:11px;">申诉裁决</label>
            <div style="display:flex;gap:12px;">
              <label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer;">
                <input type="radio" name="dispute_res" value="accept" checked style="accent-color:var(--brand-500);"> 申诉通过 (改判为92分良好)
              </label>
              <label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer;">
                <input type="radio" name="dispute_res" value="reject" style="accent-color:var(--brand-500);"> 申诉驳回 (维持原判)
              </label>
            </div>
          </div>
        </div>
      `,
      confirmText: '确认申诉裁决',
      onConfirm: () => {
        r.score = 92;
        r.grade = '良好(申诉改判)';
        r.dispute_status = 'resolved';
        r.review_status = 'approved';
        r.review_note = '经质检专家听音核查，同意申诉诉求，撤销抢话扣分。';
        App.showToast('申诉已裁决并通过，分值已更新', 'success');
        App.refreshCurrentView();
      }
    });
  },

  // Batch Recheck Assign Modal
  showBatchAssignModal() {
    App.showModal({
      title: '批量分配人工质检复核任务',
      content: `
        <div style="padding:4px 0;display:flex;flex-direction:column;gap:10px;">
          <div style="font-size:11.5px;color:var(--text-secondary);">
            将当前待复核录音（低于85分或存在申诉）批量分发给质检专员：
          </div>
          <div class="form-group">
            <label class="form-label" style="font-size:11px;">指派质检员</label>
            <select class="form-select" style="width:100%;height:32px;font-size:12px;">
              <option>周丽 (高级质检主管 · 在线)</option>
              <option>陈伟 (合规风控专家 · 在线)</option>
              <option>系统平均轮询分配</option>
            </select>
          </div>
          <div style="background:var(--ink-50);border-radius:var(--radius-md);padding:8px 10px;font-size:11px;color:var(--text-muted);">
            本次将分配 <strong>2通</strong> 待复核件，要求在24小时内完成听音并出具结论。
          </div>
        </div>
      `,
      confirmText: '确认分配',
      onConfirm: () => {
        App.showToast('已成功批量分配质检复核工单', 'success');
        App.refreshCurrentView();
      }
    });
  },

  showRuleConfigModal() {
    App.showModal({
      title: '质检合规规则与版本管理',
      content: `
        <div style="padding:4px 0;display:flex;flex-direction:column;gap:8px;font-size:12px;">
          <div style="background:var(--brand-50);border-radius:var(--radius-md);padding:8px 10px;font-size:11px;color:var(--brand-700);">
            当前生效版本：<strong>${this.ruleVersion}</strong> (发布人：合规风控组)
          </div>
          <div style="font-size:11px;font-weight:700;color:var(--text-main);margin-top:4px;">合规红线一票否决项：</div>
          ${[
            '严禁虚假承诺脱单率（包脱单/保结婚/100%成功）',
            '开场前15秒必须明示AI红娘助理身份与知缘机构名',
            '客户明确拒绝2次以上必须在5秒内礼貌断呼',
            '企微加友必须获得客户明确口头同意',
            '严禁在未脱敏状态下向客户透露第三方完整手机号与住址'
          ].map(t => `
            <label style="display:flex;align-items:center;gap:6px;padding:2px 0;cursor:pointer;">
              <input type="checkbox" checked style="width:13px;height:13px;accent-color:var(--brand-500);">
              <span style="color:var(--text-secondary);font-size:11.5px;">${t}</span>
            </label>
          `).join('')}
        </div>
      `,
      confirmText: '保存并应用新规则'
    });
  }
};

window.QAView = QAView;
