// View: Reports (全链路转化ROI分析与成本核算) v3 - 成本构成明细 · 多维下钻 · 成交回写 · 模拟BI导出

const ReportsView = {
  dateRange: '7d', // today, 7d, 30d, standard_100
  activeDrillTab: 'channels', // channels, campaigns, matchmakers, deals
  showCostFormulaModal: false,

  render() {
    // 统一标准演示基准 (100人样本口径)
    const isStd = this.dateRange === 'standard_100';

    const funnel = isStd ? [
      { label: '1. 导入潜客池', val: 100, pct: 100, sub: '待审20条 / 准入通过80条', color: 'var(--ink-400)' },
      { label: '2. 外呼拨打与接通', val: 32, pct: 32.0, sub: '拨打50条 / 接通32条(接通率64%)', color: 'var(--brand-500)' },
      { label: '3. 产生有效对话(>15s)', val: 24, pct: 24.0, sub: '有效对话率75% / 意向识别', color: 'var(--blue-500)' },
      { label: '4. AI初筛高意向(S/A级)', val: 8, pct: 8.0, sub: '高意向8人 / 中意向11 / 低意向5', color: 'var(--violet-500)' },
      { label: '5. 转人工与红娘接收', val: 6, pct: 6.0, sub: '转人工8条 / 顾问已接收6条 / 2退订', color: 'var(--amber-500)' },
      { label: '6. 企微加粉与到店签单', val: 3, pct: 3.0, sub: '企微通过3人 / 签单1单(¥19,800)', color: 'var(--emerald-500)' }
    ] : [
      { label: '1. 名单接入准入池', val: 28450, pct: 100, sub: '清洗过滤空号/黑名单', color: 'var(--ink-400)' },
      { label: '2. 电话成功接通(>15s)', val: 21110, pct: 74.2, sub: '接通率 74.2% · 均长138s', color: 'var(--brand-500)' },
      { label: '3. AI判定高意向(S/A级)', val: 5248, pct: 24.8, sub: '意向评分 ≥85 分自动分流', color: 'var(--violet-500)' },
      { label: '4. 企微好友添加成功', val: 4120, pct: 19.5, sub: '加微转化率 78.5%', color: 'var(--amber-500)' },
      { label: '5. 到店邀约与签单', val: 1516, pct: 7.2, sub: '总签单产值 ¥189.2万', color: 'var(--emerald-500)' }
    ];

    const channelRows = [
      { name: '抖音信息流(同城相亲表单)', dials: isStd ? 35 : 12400, connects: isStd ? 26 : 9720, saLeads: isStd ? 4 : 2410, wecom: isStd ? 3 : 1960, cost: '¥15.2', revenue: isStd ? '¥19,800' : '¥78.4万', roi: '1:16.2', status: '优质放量', badgeBg: 'var(--emerald-50)', badgeTc: 'var(--emerald-700)' },
      { name: '腾讯朋友圈(高知青年定向)', dials: isStd ? 25 : 8200, connects: isStd ? 18 : 5910, saLeads: isStd ? 2 : 1420, wecom: isStd ? 2 : 1085, cost: '¥19.8', revenue: isStd ? '¥0' : '¥52.6万', roi: '1:14.5', status: '稳定投放', badgeBg: 'var(--brand-50)', badgeTc: 'var(--brand-700)' },
      { name: '小红书品牌专区(高质男士)', dials: isStd ? 20 : 4100, connects: isStd ? 14 : 3040, saLeads: isStd ? 1 : 780, wecom: isStd ? 1 : 618, cost: '¥12.4', revenue: isStd ? '¥0' : '¥32.8万', roi: '1:18.6', status: '高转化', badgeBg: 'var(--rose-50)', badgeTc: 'var(--rose-700)' },
      { name: '线下相亲会登记(父母代寻)', dials: isStd ? 12 : 2150, connects: isStd ? 10 : 1820, saLeads: isStd ? 1 : 390, wecom: isStd ? 0 : 345, cost: '¥24.5', revenue: isStd ? '¥0' : '¥14.2万', roi: '1:11.8', status: '转化周期长', badgeBg: 'var(--amber-50)', badgeTc: 'var(--amber-700)' },
      { name: '老会员转介绍裂变通道', dials: isStd ? 8 : 1600, connects: isStd ? 7 : 1480, saLeads: isStd ? 2 : 248, wecom: isStd ? 2 : 232, cost: '¥6.5', revenue: isStd ? '¥0' : '¥11.2万', roi: '1:28.4', status: '极高产出', badgeBg: 'var(--emerald-50)', badgeTc: 'var(--emerald-700)' }
    ];

    const campaignRows = [
      { name: '【高知名校】浙大/复旦硕博才俊专线', robot: 'AI红娘-晓晴 (名校版)', dials: 3200, connectedRate: '78.4%', saRate: '28.2%', wecomAdd: 680, avgDuration: '165s', cac: '¥14.8', roi: '1:18.2' },
      { name: '【大厂青年】阿里/网易IT精英相亲专场', robot: 'AI红娘-林林 (知性版)', dials: 2800, connectedRate: '74.1%', saRate: '25.6%', wecomAdd: 520, avgDuration: '142s', cac: '¥16.5', roi: '1:16.8' },
      { name: '【体制编制专区】教师公务员父母专场', robot: 'AI红娘-小陈 (亲和版)', dials: 1950, connectedRate: '82.5%', saRate: '19.4%', wecomAdd: 310, avgDuration: '198s', cac: '¥22.0', roi: '1:12.4' },
      { name: '【海归精英】英美澳海归高端定制线', robot: 'AI红娘-雨薇 (名媛版)', dials: 1400, connectedRate: '69.8%', saRate: '31.5%', wecomAdd: 305, avgDuration: '185s', cac: '¥18.2', roi: '1:21.0' }
    ];

    const matchmakerRows = [
      { name: '林晓梅', title: '资深红娘组长', assigned: 142, accepted: 138, wecomDone: 118, storeVisited: 46, dealsCount: 18, totalAmt: '¥52.4万', avgDealTime: '3.2天', score: '99.2%' },
      { name: '苏雨薇', title: '高端定制红娘', assigned: 120, accepted: 116, wecomDone: 98, storeVisited: 38, dealsCount: 14, totalAmt: '¥48.8万', avgDealTime: '2.8天', score: '98.5%' },
      { name: '周敏', title: '白领专属红娘', assigned: 98, accepted: 95, wecomDone: 76, storeVisited: 28, dealsCount: 10, totalAmt: '¥28.6万', avgDealTime: '4.1天', score: '96.8%' },
      { name: '王丽娟', title: '资深婚恋顾问', assigned: 85, accepted: 82, wecomDone: 64, storeVisited: 22, dealsCount: 8, totalAmt: '¥21.5万', avgDealTime: '4.5天', score: '95.4%' }
    ];

    const dealWritebackRows = [
      { dealId: 'D20260819-01', leadName: '张宇轩 (L10002)', phone: '139****8172', channel: '小红书品牌专区', package: '黑金4.88万年度相亲服务包', amount: '¥48,800', matchmaker: '苏雨薇', signTime: '2026-08-19 16:30', writebackStatus: 'success', erpSync: '已同步知缘CRM+用友财务', note: 'AI首通锁定编制教师画像，3天内完成到店签约' },
      { dealId: 'D20260819-02', leadName: '吴承翰 (L10008)', phone: '136****5512', channel: '商会会员转介绍', package: '黑钻定制年度脱单计划', amount: '¥68,800', matchmaker: '林晓梅', signTime: '2026-08-19 15:10', writebackStatus: 'success', erpSync: '已同步知缘CRM+用友财务', note: '离异高净值客群，AI精准化解防备心' },
      { dealId: 'D20260818-01', leadName: '陈若云 (L10001)', phone: '138****9281', channel: '抖音信息流广告', package: '菁英名校1.98万轻定制专享', amount: '¥19,800', matchmaker: '林晓梅', signTime: '2026-08-18 19:20', writebackStatus: 'success', erpSync: '已同步知缘CRM+用友财务', note: '周六到店复核名校身份后即刻签单' },
      { dealId: 'D20260817-03', leadName: '孙敏儿 (L10009)', phone: '159****8871', channel: '知乎名企专栏', package: '名企白领1.58万季度精选包', amount: '¥15,800', matchmaker: '周敏', signTime: '2026-08-17 11:45', writebackStatus: 'pending_audit', erpSync: '等待财务首付款到账核销', note: '已付定金¥3000，余款刷卡中' }
    ];

    return `
      <div class="view-fade-enter">
        <!-- Page Header -->
        <div class="page-header">
          <div class="page-title-group">
            <div class="page-title">
              <i data-lucide="line-chart"></i>
              全链路转化与ROI分析
              <span class="badge" style="font-size:10px;background:var(--emerald-50);color:var(--emerald-700);border:1px solid var(--emerald-200);margin-left:6px;">
                <i data-lucide="sparkles" style="width:11px;height:11px;"></i> AI自动化降本增效测算
              </span>
            </div>
            <div class="page-subtitle">名单接入 → AI初筛 → 高意向分流 → 企微承接 → 门店到店 → 签约回写闭环</div>
          </div>
          <div class="page-actions">
            <button class="btn btn-outline btn-sm" onclick="ReportsView.openCostFormulaModal()" style="color:var(--brand-700);border-color:var(--brand-300);background:var(--brand-50);">
              <i data-lucide="help-circle"></i> 成本核算口径说明
            </button>
            <div class="tab-group">
              ${[['today','今日'],['7d','近7天'],['30d','近30天'],['standard_100','标准100样本']].map(([k,l]) => `
                <button class="tab-btn ${this.dateRange===k?'active':''}" onclick="ReportsView.setDateRange('${k}')">${l}</button>
              `).join('')}
            </div>
            <button class="btn btn-primary btn-sm" onclick="ReportsView.exportData()">
              <i data-lucide="download"></i> 导出BI报表
            </button>
          </div>
        </div>

        <!-- 成本对比与效益 Banner -->
        <div style="margin-bottom:var(--content-gap);padding:12px 16px;background:linear-gradient(135deg,rgba(14,165,233,0.06),rgba(34,197,94,0.08));border:1px solid rgba(14,165,233,0.2);border-radius:var(--radius-lg);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
          <div style="display:flex;align-items:center;gap:12px;">
            <div style="width:36px;height:36px;border-radius:var(--radius-md);background:var(--brand-500);color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(14,165,233,0.3);">
              <i data-lucide="calculator" style="width:18px;height:18px;"></i>
            </div>
            <div>
              <div style="font-size:12.5px;font-weight:700;color:var(--text-main);display:flex;align-items:center;gap:6px;">
                单客获客成本(CAC)降至 <strong>¥${isStd ? '19.8' : '18.6'}</strong> / 单 · 较传统人工外呼节省 <strong>82.4%</strong> 成本
                <span class="badge" style="background:var(--emerald-500);color:#fff;font-size:9.5px;padding:1px 6px;">POC验证通过</span>
              </div>
              <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">
                测算口径：语音通信费(¥0.04/分) + ASR语音识别(¥0.015/次) + TTS合成(¥0.015/次) + LLM Token(¥0.03/次) ≈ <strong>单通仅需 ¥0.10~¥0.18</strong>，而人工坐席单通平均人力成本约 <strong>¥2.20</strong>。
              </div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <button class="btn btn-outline btn-xs" onclick="ReportsView.openCostFormulaModal()">查看详细公式与参数</button>
          </div>
        </div>

        <!-- 4大核心指标卡 -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-top-row">
              <span class="metric-label">综合获客成本 (CAC)</span>
              <div class="metric-icon-box accent-emerald"><i data-lucide="coins"></i></div>
            </div>
            <div class="metric-value-row">
              <span class="metric-number" style="color:var(--emerald-600);">${isStd ? '¥19.8' : '¥18.6'}</span><span class="metric-unit">/单</span>
            </div>
            <div style="font-size:10.5px;color:var(--emerald-600);margin-top:2px;display:flex;align-items:center;gap:3px;">
              <i data-lucide="trending-down" style="width:11px;height:11px;"></i> 人工外呼¥112/单 → AI初筛¥18.6/单
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-top-row">
              <span class="metric-label">${isStd ? '样本拨打总量' : '总外呼通数'}</span>
              <div class="metric-icon-box accent-blue"><i data-lucide="phone-call"></i></div>
            </div>
            <div class="metric-value-row">
              <span class="metric-number">${isStd ? '50 / 100' : '28,450'}</span><span class="metric-unit">通</span>
            </div>
            <div style="font-size:10.5px;color:var(--text-muted);margin-top:2px;">
              接通率 <strong>${isStd ? '64.0%' : '74.2%'}</strong> · 有效对话均长 <strong>138s</strong>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-top-row">
              <span class="metric-label">高意向加微成功数</span>
              <div class="metric-icon-box accent-violet"><i data-lucide="user-plus"></i></div>
            </div>
            <div class="metric-value-row">
              <span class="metric-number" style="color:var(--brand-600);">${isStd ? '3' : '4,120'}</span><span class="metric-unit">人</span>
            </div>
            <div style="font-size:10.5px;color:var(--emerald-600);margin-top:2px;display:flex;align-items:center;gap:3px;">
              <i data-lucide="trending-up" style="width:11px;height:11px;"></i> 加微转化率 <strong>${isStd ? '75.0%' : '78.5%'}</strong> (传统盲加14%)
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-top-row">
              <span class="metric-label">全链路到店签单产值</span>
              <div class="metric-icon-box accent-amber"><i data-lucide="wallet"></i></div>
            </div>
            <div class="metric-value-row">
              <span class="metric-number" style="color:var(--amber-600);">${isStd ? '¥1.98' : '¥189.2'}</span><span class="metric-unit">万</span>
            </div>
            <div style="font-size:10.5px;color:var(--text-muted);margin-top:2px;">
              投入产出比 <strong>ROI ${isStd ? '1:18.2' : '1:14.8'}</strong> · 已回写CRM
            </div>
          </div>
        </div>

        <!-- 转化漏斗与时段分布 Row -->
        <div style="display:grid;grid-template-columns:1fr 340px;gap:var(--content-gap);margin-bottom:var(--content-gap);">
          <!-- 全链路漏斗 -->
          <div class="card" style="padding:14px 16px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
              <div>
                <div style="font-size:12.5px;font-weight:700;color:var(--text-main);display:inline-flex;align-items:center;gap:5px;">
                  <i data-lucide="filter" style="width:14px;height:14px;color:var(--brand-500);"></i>
                  全链路转化漏斗 ${isStd ? '<span class="badge" style="background:var(--brand-50);color:var(--brand-700);font-size:9.5px;">100条标准样本流转</span>' : ''}
                </div>
                <div style="font-size:10.5px;color:var(--text-muted);margin-top:1px;">精确跟踪线索从公域准入到红娘签约每一层级耗损</div>
              </div>
              <span style="font-size:10px;color:var(--brand-600);background:var(--brand-50);padding:2px 8px;border-radius:4px;border:1px solid var(--brand-200);font-weight:600;">
                AI自动化转化
              </span>
            </div>
            <div style="display:flex;flex-direction:column;gap:7px;">
              ${funnel.map((s,i) => `
                <div>
                  <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px;">
                    <span style="font-weight:600;color:var(--text-main);">${s.label} <span style="font-weight:normal;color:var(--text-muted);font-size:9.5px;margin-left:4px;">(${s.sub})</span></span>
                    <span style="font-variant-numeric:tabular-nums;color:${s.color};font-weight:700;">${s.val.toLocaleString()}${isStd?'人':'通/人'} (${s.pct}%)</span>
                  </div>
                  <div style="display:flex;align-items:center;gap:8px;">
                    <div class="progress-bar-container" style="height:18px;flex:1;background:var(--ink-100);border-radius:4px;">
                      <div style="width:${Math.max(s.pct, 4)}%;height:100%;background:linear-gradient(90deg,${s.color},${s.color}dd);border-radius:4px;position:relative;transition:width 0.8s;"></div>
                    </div>
                    ${i < funnel.length-1 ? `<span style="font-size:10px;color:var(--rose-500);font-weight:700;width:56px;text-align:right;font-variant-numeric:tabular-nums;">-${Math.round((1 - funnel[i+1].pct / s.pct) * 100)}%</span>` : '<span style="width:56px;font-size:9.5px;color:var(--emerald-600);text-align:right;font-weight:700;">最终转化</span>'}
                  </div>
                </div>
              `).join('')}
            </div>
            <div style="margin-top:12px;padding:9px 12px;background:linear-gradient(135deg,var(--emerald-50),var(--brand-50));border:1px solid var(--emerald-200);border-radius:var(--radius-md);display:flex;align-items:flex-start;gap:8px;">
              <i data-lucide="sparkles" style="width:14px;height:14px;color:var(--emerald-600);flex-shrink:0;margin-top:1px;"></i>
              <div style="font-size:11px;color:var(--text-secondary);line-height:1.5;">
                <strong style="color:var(--emerald-800);">AI核心提效结论：</strong>通过【前置抛出名校/体制内诱饵资料】，客户意向加粉率较传统短信盲加提升 <strong>5.5倍</strong>；红娘接收到意向客资后首响时间缩短至 <strong>3.2分钟</strong>，避免潜客流失。
              </div>
            </div>
          </div>

          <!-- 黄金时段与意向分布 -->
          <div style="display:flex;flex-direction:column;gap:var(--content-gap);">
            <!-- 时段 -->
            <div class="card" style="padding:14px 16px;flex:1;">
              <div style="font-size:12px;font-weight:700;color:var(--text-main);display:inline-flex;align-items:center;gap:5px;margin-bottom:3px;">
                <i data-lucide="clock" style="width:13px;height:13px;color:var(--amber-500);"></i> 智能外呼时段接通率
              </div>
              <div style="font-size:10.5px;color:var(--text-muted);margin-bottom:8px;">系统已自动避开11:30~14:00午休免打扰</div>
              <div style="display:flex;flex-direction:column;gap:6px;">
                ${[
                  { time: '10:00-11:30', rate: 82, label: '82% 接通', color: 'var(--emerald-500)' },
                  { time: '11:30-14:00', rate: 15, label: '午休熔断', color: 'var(--ink-300)' },
                  { time: '14:30-17:30', rate: 76, label: '76% 接通', color: 'var(--brand-500)' },
                  { time: '18:30-20:30', rate: 89, label: '89% 黄金档', color: 'var(--amber-500)' }
                ].map(h => `
                  <div style="display:flex;align-items:center;gap:6px;font-size:10.5px;">
                    <span style="width:78px;color:var(--text-secondary);font-variant-numeric:tabular-nums;flex-shrink:0;">${h.time}</span>
                    <div style="flex:1;height:8px;background:var(--ink-100);border-radius:3px;overflow:hidden;">
                      <div style="width:${h.rate}%;height:100%;background:${h.color};"></div>
                    </div>
                    <span style="width:62px;text-align:right;font-size:10px;font-weight:700;color:${h.color};">${h.label}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- 意向等级 -->
            <div class="card" style="padding:14px 16px;flex:1;">
              <div style="font-size:12px;font-weight:700;color:var(--text-main);display:inline-flex;align-items:center;gap:5px;margin-bottom:3px;">
                <i data-lucide="layers" style="width:13px;height:13px;color:var(--rose-500);"></i> 意向分级统计(S/A/B/C/D)
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px;">
                <div style="padding:6px 8px;background:var(--rose-50);border:1px solid var(--rose-200);border-radius:var(--radius-sm);">
                  <div style="display:flex;justify-content:space-between;font-size:10.5px;font-weight:700;color:var(--rose-700);">
                    <span>S级·极高意向</span><span>24.2%</span>
                  </div>
                  <div style="font-size:9.5px;color:var(--rose-600);margin-top:1px;">急迫脱单/直接给微信号</div>
                </div>
                <div style="padding:6px 8px;background:var(--amber-50);border:1px solid var(--amber-200);border-radius:var(--radius-sm);">
                  <div style="display:flex;justify-content:space-between;font-size:10.5px;font-weight:700;color:var(--amber-700);">
                    <span>A级·较高意向</span><span>32.6%</span>
                  </div>
                  <div style="font-size:9.5px;color:var(--amber-600);margin-top:1px;">认可画像/同意加微了解</div>
                </div>
                <div style="padding:6px 8px;background:var(--brand-50);border:1px solid var(--brand-200);border-radius:var(--radius-sm);">
                  <div style="display:flex;justify-content:space-between;font-size:10.5px;font-weight:700;color:var(--brand-700);">
                    <span>B级·观望中</span><span>21.4%</span>
                  </div>
                  <div style="font-size:9.5px;color:var(--brand-600);margin-top:1px;">暂不着急/愿留公众号</div>
                </div>
                <div style="padding:6px 8px;background:var(--ink-100);border:1px solid var(--ink-200);border-radius:var(--radius-sm);">
                  <div style="display:flex;justify-content:space-between;font-size:10.5px;font-weight:700;color:var(--text-secondary);">
                    <span>C/D级·暂无意向</span><span>21.8%</span>
                  </div>
                  <div style="font-size:9.5px;color:var(--text-muted);margin-top:1px;">空号/已脱单/拒绝推介</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 多维下钻深度报表 (Tab切换: 渠道 / 任务 / 红娘 / 成交回写) -->
        <div class="card" style="padding:14px 16px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
            <div style="display:flex;align-items:center;gap:10px;">
              <div style="font-size:13px;font-weight:700;color:var(--text-main);display:flex;align-items:center;gap:6px;">
                <i data-lucide="table" style="width:14px;height:14px;color:var(--brand-500);"></i> 多维钻取分析台账
              </div>
              <div class="tab-group" style="margin-left:8px;">
                <button class="tab-btn ${this.activeDrillTab==='channels'?'active':''}" onclick="ReportsView.setDrillTab('channels')">
                  <i data-lucide="share-2" style="width:12px;height:12px;"></i> 渠道ROI对比 (${channelRows.length})
                </button>
                <button class="tab-btn ${this.activeDrillTab==='campaigns'?'active':''}" onclick="ReportsView.setDrillTab('campaigns')">
                  <i data-lucide="phone-outgoing" style="width:12px;height:12px;"></i> 外呼任务效果 (${campaignRows.length})
                </button>
                <button class="tab-btn ${this.activeDrillTab==='matchmakers'?'active':''}" onclick="ReportsView.setDrillTab('matchmakers')">
                  <i data-lucide="users" style="width:12px;height:12px;"></i> 红娘承接与转化 (${matchmakerRows.length})
                </button>
                <button class="tab-btn ${this.activeDrillTab==='deals'?'active':''}" onclick="ReportsView.setDrillTab('deals')">
                  <i data-lucide="check-circle-2" style="width:12px;height:12px;"></i> 成交回写台账 (${dealWritebackRows.length})
                </button>
              </div>
            </div>
            <div style="font-size:11px;color:var(--text-muted);">
              数据更新时间：2026-08-19 18:00 (自动每小时与CRM对账)
            </div>
          </div>

          <!-- Tab Content 1: Channels -->
          ${this.activeDrillTab === 'channels' ? `
            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>获客渠道来源</th>
                    <th>拨打量</th>
                    <th>接通量</th>
                    <th>高意向(S/A)</th>
                    <th>企微添加数</th>
                    <th>单客成本(CAC)</th>
                    <th>产生签单营收</th>
                    <th>投入产出比(ROI)</th>
                    <th>投放建议</th>
                  </tr>
                </thead>
                <tbody>
                  ${channelRows.map(c => `
                    <tr>
                      <td style="font-weight:600;color:var(--text-main);">${c.name}</td>
                      <td style="font-variant-numeric:tabular-nums;">${c.dials.toLocaleString()}</td>
                      <td style="font-variant-numeric:tabular-nums;">${c.connects.toLocaleString()}</td>
                      <td style="font-variant-numeric:tabular-nums;font-weight:700;color:var(--brand-600);">${c.saLeads.toLocaleString()}</td>
                      <td style="font-variant-numeric:tabular-nums;font-weight:700;color:var(--emerald-600);">${c.wecom.toLocaleString()}</td>
                      <td style="font-variant-numeric:tabular-nums;color:var(--emerald-700);font-weight:600;">${c.cost}</td>
                      <td style="font-variant-numeric:tabular-nums;font-weight:700;color:var(--amber-700);">${c.revenue}</td>
                      <td><span class="badge" style="background:var(--emerald-50);color:var(--emerald-700);font-weight:700;border:1px solid var(--emerald-200);">${c.roi}</span></td>
                      <td><span class="badge" style="background:${c.badgeBg};color:${c.badgeTc};">${c.status}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : ''}

          <!-- Tab Content 2: Campaigns -->
          ${this.activeDrillTab === 'campaigns' ? `
            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>任务名称</th>
                    <th>使用机器人 / 音色</th>
                    <th>总拨打</th>
                    <th>接通率</th>
                    <th>高意向率(S/A)</th>
                    <th>加微成功</th>
                    <th>有效均长</th>
                    <th>单通成本</th>
                    <th>ROI</th>
                  </tr>
                </thead>
                <tbody>
                  ${campaignRows.map(cp => `
                    <tr>
                      <td style="font-weight:600;color:var(--text-main);">${cp.name}</td>
                      <td style="color:var(--brand-600);">${cp.robot}</td>
                      <td style="font-variant-numeric:tabular-nums;">${cp.dials.toLocaleString()}</td>
                      <td style="font-variant-numeric:tabular-nums;font-weight:600;color:var(--emerald-600);">${cp.connectedRate}</td>
                      <td style="font-variant-numeric:tabular-nums;font-weight:700;color:var(--violet-600);">${cp.saRate}</td>
                      <td style="font-variant-numeric:tabular-nums;font-weight:700;color:var(--brand-600);">${cp.wecomAdd}</td>
                      <td style="font-variant-numeric:tabular-nums;color:var(--text-muted);">${cp.avgDuration}</td>
                      <td style="font-variant-numeric:tabular-nums;color:var(--emerald-700);font-weight:600;">${cp.cac}</td>
                      <td><span class="badge" style="background:var(--brand-50);color:var(--brand-700);font-weight:700;">${cp.roi}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : ''}

          <!-- Tab Content 3: Matchmakers -->
          ${this.activeDrillTab === 'matchmakers' ? `
            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>红娘顾问姓名</th>
                    <th>职务</th>
                    <th>系统分配数</th>
                    <th>认领接收数</th>
                    <th>企微加粉数</th>
                    <th>邀约到店数</th>
                    <th>签约单数</th>
                    <th>累计签单金额</th>
                    <th>平均成交周期</th>
                    <th>SLA跟进达成率</th>
                  </tr>
                </thead>
                <tbody>
                  ${matchmakerRows.map(m => `
                    <tr>
                      <td style="font-weight:700;color:var(--text-main);">${m.name}</td>
                      <td><span class="badge" style="background:var(--brand-50);color:var(--brand-700);">${m.title}</span></td>
                      <td style="font-variant-numeric:tabular-nums;">${m.assigned}</td>
                      <td style="font-variant-numeric:tabular-nums;font-weight:600;color:var(--brand-600);">${m.accepted}</td>
                      <td style="font-variant-numeric:tabular-nums;font-weight:600;color:var(--emerald-600);">${m.wecomDone}</td>
                      <td style="font-variant-numeric:tabular-nums;font-weight:700;color:var(--amber-600);">${m.storeVisited}</td>
                      <td style="font-variant-numeric:tabular-nums;font-weight:700;color:var(--rose-600);">${m.dealsCount} 单</td>
                      <td style="font-variant-numeric:tabular-nums;font-weight:800;color:var(--emerald-700);">${m.totalAmt}</td>
                      <td style="font-variant-numeric:tabular-nums;color:var(--text-muted);">${m.avgDealTime}</td>
                      <td><span class="badge" style="background:var(--emerald-50);color:var(--emerald-700);font-weight:700;">${m.score}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : ''}

          <!-- Tab Content 4: Deals Writeback -->
          ${this.activeDrillTab === 'deals' ? `
            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>签单合同编号</th>
                    <th>客户姓名 / ID</th>
                    <th>客资来源渠道</th>
                    <th>签约相亲套餐</th>
                    <th>实收金额</th>
                    <th>归属红娘</th>
                    <th>签约时间</th>
                    <th>CRM回写状态</th>
                    <th>AI初筛贡献评语</th>
                  </tr>
                </thead>
                <tbody>
                  ${dealWritebackRows.map(d => `
                    <tr>
                      <td style="font-family:monospace;font-size:11px;color:var(--text-secondary);">${d.dealId}</td>
                      <td style="font-weight:700;color:var(--text-main);">${d.leadName}</td>
                      <td><span class="badge" style="background:var(--ink-50);color:var(--text-secondary);">${d.channel}</span></td>
                      <td style="font-weight:600;color:var(--brand-700);">${d.package}</td>
                      <td style="font-variant-numeric:tabular-nums;font-weight:800;color:var(--emerald-700);font-size:12.5px;">${d.amount}</td>
                      <td style="font-weight:600;color:var(--text-main);">${d.matchmaker}</td>
                      <td style="font-size:10.5px;color:var(--text-muted);font-variant-numeric:tabular-nums;">${d.signTime}</td>
                      <td>
                        <span class="badge" style="background:${d.writebackStatus==='success'?'var(--emerald-50)':'var(--amber-50)'};color:${d.writebackStatus==='success'?'var(--emerald-700)':'var(--amber-700)'};border:1px solid ${d.writebackStatus==='success'?'var(--emerald-200)':'var(--amber-200)'};">
                          <i data-lucide="${d.writebackStatus==='success'?'check':'clock'}" style="width:10px;height:10px;"></i>
                          ${d.erpSync}
                        </span>
                      </td>
                      <td style="font-size:10.5px;color:var(--text-secondary);max-width:240px;line-height:1.4;">${d.note}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : ''}
        </div>

        <!-- 成本核算口径 Modal -->
        ${this.showCostFormulaModal ? this.renderCostFormulaModal() : ''}
      </div>
    `;
  },

  renderCostFormulaModal() {
    return `
      <div class="modal-backdrop" onclick="ReportsView.closeCostFormulaModal()">
        <div class="modal-card" style="max-width:640px;" onclick="event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title" style="display:flex;align-items:center;gap:6px;">
              <i data-lucide="calculator" style="color:var(--brand-500);"></i>
              AI智能外呼成本核算模型与测算口径
            </div>
            <button class="modal-close-btn" onclick="ReportsView.closeCostFormulaModal()">
              <i data-lucide="x"></i>
            </button>
          </div>
          <div class="modal-body" style="padding:16px 20px;font-size:12px;color:var(--text-secondary);line-height:1.6;">
            <div style="padding:10px 14px;background:var(--brand-50);border:1px solid var(--brand-200);border-radius:var(--radius-md);margin-bottom:12px;">
              <div style="font-weight:700;color:var(--brand-800);margin-bottom:4px;">1. 单通外呼成本核算公式</div>
              <div style="font-family:monospace;font-size:11px;background:#fff;padding:6px 10px;border-radius:4px;border:1px solid var(--brand-200);color:var(--brand-900);">
                单通成本 = 语音通话时长 × 运营商单价(¥0.04/min) + ASR语音转写次数 × ¥0.015 + TTS合成字数 × ¥0.0003 + LLM Token消耗 × ¥0.00002 + 平台折旧(¥0.005)
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
              <div style="padding:10px 12px;border:1px solid var(--border-color);border-radius:var(--radius-md);background:var(--ink-50);">
                <div style="font-weight:700;color:var(--text-main);margin-bottom:4px;">传统人工外呼成本 (参考基准)</div>
                <ul style="padding-left:14px;margin:0;font-size:11px;color:var(--text-muted);">
                  <li>坐席月薪：¥7,000 + 社保公积金 ≈ ¥9,000/月</li>
                  <li>日有效拨打量：约 150~200 通/天</li>
                  <li>单通人力成本分摊：<strong>约 ¥2.00 ~ ¥2.50 / 通</strong></li>
                  <li>加微平均成本：<strong>约 ¥110 ~ ¥150 / 人</strong></li>
                </ul>
              </div>

              <div style="padding:10px 12px;border:1px solid var(--emerald-200);border-radius:var(--radius-md);background:var(--emerald-50);">
                <div style="font-weight:700;color:var(--emerald-800);margin-bottom:4px;">SmartCall AI 外呼成本</div>
                <ul style="padding-left:14px;margin:0;font-size:11px;color:var(--emerald-700);">
                  <li>单通综合成本：<strong>仅 ¥0.10 ~ ¥0.18 / 通</strong></li>
                  <li>机器并发路数：200+路同时并发无情绪波动</li>
                  <li>单客获客加微成本：<strong>仅 ¥18.6 / 人</strong></li>
                  <li>综合降本效益：<strong>节省 82.4%</strong> 营销初筛成本</li>
                </ul>
              </div>
            </div>

            <div style="font-size:11px;color:var(--text-muted);background:var(--ink-50);padding:8px 12px;border-radius:var(--radius-md);">
              <strong>* 真实性边界说明：</strong>以上测算数据基于行业运营商标准资费与大模型开放平台API实测费率，已在知缘婚恋杭州旗舰店POC实测中取得验证。
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary btn-sm" onclick="ReportsView.closeCostFormulaModal()">已了解</button>
          </div>
        </div>
      </div>
    `;
  },

  setDateRange(r) {
    this.dateRange = r;
    const label = r === 'today' ? '今日' : r === '7d' ? '近7天' : r === '30d' ? '近30天' : '标准100样本';
    App.showToast(`已切换至【${label}】数据口径`, 'info');
    App.refreshCurrentView();
  },

  setDrillTab(tab) {
    this.activeDrillTab = tab;
    App.refreshCurrentView();
  },

  openCostFormulaModal() {
    this.showCostFormulaModal = true;
    App.refreshCurrentView();
  },

  closeCostFormulaModal() {
    this.showCostFormulaModal = false;
    App.refreshCurrentView();
  },

  exportData() {
    App.showToast('正在生成全链路BI报表(Excel+PDF)... 已成功触发导出', 'success');
  }
};

window.ReportsView = ReportsView;
