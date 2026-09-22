// View: Rules (规则与AI引擎配置) v2 - 标签页+表单

const RulesView = {
  activeTab: 'persona',

  voices: [
    {id:'fangjie',name:'知心大姐姐·芳姐',badge:'王牌主推',tag:'接通加微率最高',desc:'温和有亲和力、带呼吸笑意，适合28-40岁及父母客群',selected:true},
    {id:'mengmeng',name:'活力邻家闺蜜·萌萌',badge:'年轻客群',tag:'95后最爱',desc:'欢快甜美、语速轻快，适合95后/00后高知互联网青年',selected:false},
    {id:'linlaoshi',name:'端庄知性红娘·林老师',badge:'高端定制',tag:'海归/高净值',desc:'咬字清晰干练、知性专业，适合金融精英企业高管',selected:false}
  ],

  render() {
    return `
      <div class="view-fade-enter">
        <!-- Page Header -->
        <div class="page-header">
          <div class="page-title-group">
            <div class="page-title">
              <i data-lucide="sliders"></i>
              规则与AI引擎配置
              <span style="margin-left:8px;font-size:9.5px;padding:2px 7px;border-radius:var(--radius-sm);background:var(--ink-100);color:var(--text-secondary);font-weight:600;">v2.4</span>
            </div>
            <div class="page-subtitle">拟人化音色 · 打断容差 · 合规风控 · 企微路由策略</div>
            <div style="display:flex;align-items:center;gap:10px;margin-top:4px;font-size:10.5px;color:var(--text-muted);">
              <span>发布人：王主管</span><span>·</span><span>发布时间：2026-08-18 14:20</span><span>·</span>
              <a href="javascript:void(0)" onclick="App.showToast('打开版本历史对比','info')" style="color:var(--brand-600);">查看变更</a>
              <span>·</span>
              <a href="javascript:void(0)" onclick="if(confirm('确定回滚到上一版本v2.3？'))App.showToast('已回滚到v2.3','success')" style="color:var(--text-muted);">回滚</a>
            </div>
          </div>
          <div class="page-actions">
            <button class="btn btn-outline btn-sm" onclick="App.showToast('已重置为最佳实践配置','info')">
              <i data-lucide="rotate-ccw"></i>恢复默认
            </button>
            <button class="btn btn-primary btn-sm" onclick="RulesView.saveSettings()">
              <i data-lucide="save"></i>保存生效
            </button>
          </div>
        </div>

        <!-- Tab Navigation -->
        <div style="display:flex;gap:2px;background:var(--ink-50);padding:3px;border-radius:var(--radius-md);margin-bottom:var(--content-gap);width:fit-content;">
          ${[
            ['persona','mic','红娘音色与人设'],
            ['interruption','zap','拟人化打断'],
            ['compliance','shield-check','合规风控频控'],
            ['wecom_route','share-2','企微路由防封']
          ].map(([id,icon,label]) => `
            <button class="tab-btn ${this.activeTab===id?'active':''}" style="border-radius:var(--radius-sm);" onclick="RulesView.switchTab('${id}')">
              <i data-lucide="${icon}"></i>${label}
            </button>
          `).join('')}
        </div>

        <!-- Tab Content -->
        ${this.activeTab === 'persona' ? this.renderPersonaTab() :
          this.activeTab === 'interruption' ? this.renderInterruptionTab() :
          this.activeTab === 'compliance' ? this.renderComplianceTab() :
          this.renderWeComRouteTab()}
      </div>
    `;
  },

  renderPersonaTab() {
    return `
      <div style="display:flex;flex-direction:column;gap:var(--content-gap);">
        <!-- Voice Presets + System Prompt 并排 -->
        <div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:var(--content-gap);align-items:start;">
          <!-- Voice Presets -->
          <div class="card" style="padding:14px 16px;">
            <div style="font-size:12px;font-weight:700;color:var(--text-main);display:inline-flex;align-items:center;gap:5px;margin-bottom:2px;"><i data-lucide="mic" style="width:13px;height:13px;color:var(--brand-500);"></i>AI红娘音色模型</div>
            <div style="font-size:10.5px;color:var(--text-muted);margin-bottom:10px;">端到端TTS神经网络，呼吸音/语气词/笑声无缝拟真</div>
            <div style="display:flex;flex-direction:column;gap:5px;">
              ${this.voices.map(v => `
                <div style="padding:10px 12px;border-radius:var(--radius-md);border:1px solid ${v.selected?'var(--brand-300)':'var(--border-color)'};background:${v.selected?'linear-gradient(135deg,var(--brand-50),var(--violet-50))':'var(--ink-50)'};display:flex;align-items:center;justify-content:space-between;gap:10px;">
                  <div style="min-width:0;flex:1;">
                    <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;margin-bottom:2px;">
                      <span style="font-size:12px;font-weight:700;color:var(--text-main);">${v.name}</span>
                      <span style="font-size:9px;padding:1px 5px;border-radius:3px;background:${v.selected?'var(--brand-100)':'var(--ink-200)'};color:${v.selected?'var(--brand-700)':'var(--text-muted)'};font-weight:600;">${v.badge}</span>
                    </div>
                    <div style="font-size:10.5px;color:var(--text-secondary);line-height:1.4;">${v.desc}</div>
                  </div>
                  <div style="display:flex;gap:4px;flex-shrink:0;">
                    <button class="btn btn-outline btn-sm" style="height:26px;padding:0 8px;font-size:10px;" onclick="App.showToast('试听：${v.name}','info')">
                      <i data-lucide="play" style="width:10px;height:10px;"></i>试听
                    </button>
                    ${v.selected ? `
                      <span style="font-size:9.5px;padding:2px 8px;border-radius:var(--radius-sm);background:var(--brand-500);color:#fff;font-weight:600;display:inline-flex;align-items:center;gap:3px;"><i data-lucide="check" style="width:10px;height:10px;"></i>已启用</span>
                    ` : `
                      <button class="btn btn-ghost btn-sm" style="height:26px;padding:0 8px;font-size:10px;" onclick="App.showToast('已切换至${v.name}','success')">选择</button>
                    `}
                  </div>
                </div>
              `).join('')}
            </div>
            <div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border-subtle);display:flex;align-items:center;justify-content:space-between;">
              <span style="font-size:10.5px;color:var(--text-muted);">上传5分钟无杂音音频即可1:1声音克隆</span>
              <button class="btn btn-primary btn-sm" style="height:26px;padding:0 10px;font-size:11px;" onclick="App.showToast('请上传音频文件进行克隆训练','info')">
                <i data-lucide="upload-cloud" style="width:11px;height:11px;"></i>自定义克隆
              </button>
            </div>
          </div>

          <!-- Quick Config -->
          <div style="display:flex;flex-direction:column;gap:var(--content-gap);">
            <div class="card" style="padding:14px 16px;">
              <div style="font-size:12px;font-weight:700;color:var(--text-main);display:inline-flex;align-items:center;gap:5px;margin-bottom:2px;"><i data-lucide="building-2" style="width:13px;height:13px;color:var(--violet-500);"></i>机构基础信息</div>
              <div style="font-size:10.5px;color:var(--text-muted);margin-bottom:10px;">通话开场自动播报的资质声明</div>
              <div style="display:flex;flex-direction:column;gap:8px;">
                <div>
                  <label class="form-label" style="font-size:10.5px;">机构名称与资质</label>
                  <input type="text" class="form-input" style="width:100%;height:32px;font-size:12px;padding:0 10px;" value="知缘婚恋高端交友中心，杭州民政局认证会员单位，10年老牌">
                </div>
                <div>
                  <label class="form-label" style="font-size:10.5px;">开场白默认问候语</label>
                  <input type="text" class="form-input" style="width:100%;height:32px;font-size:12px;padding:0 10px;" value="您好，我是知缘婚恋的资深红娘助理，今天特意给您同步个好消息">
                </div>
                <div style="display:flex;align-items:center;justify-content:space-between;padding:7px 10px;background:var(--emerald-50);border-radius:var(--radius-sm);margin-top:2px;">
                  <span style="font-size:10.5px;color:var(--emerald-700);display:inline-flex;align-items:center;gap:4px;"><i data-lucide="database" style="width:11px;height:11px;"></i>RAG婚恋知识库</span>
                  <span style="font-size:10px;color:var(--emerald-600);font-weight:600;font-variant-numeric:tabular-nums;">已挂载1,420条嘉宾资料</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- System Prompt 编辑区 -->
        <div class="card" style="padding:16px 20px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
            <div style="font-size:13px;font-weight:700;color:var(--text-main);display:inline-flex;align-items:center;gap:6px;"><i data-lucide="message-square" style="width:14px;height:14px;color:var(--brand-500);"></i>大模型 System Prompt · 核心人设原则</div>
            <span style="font-size:10px;color:var(--text-muted);">修改后点击"保存生效"即时热更新</span>
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin-bottom:10px;">定义AI红娘底层思维链、沟通红线与业务常识库，决定通话风格与策略</div>
          <textarea class="prompt-textarea" style="width:100%;height:200px;font-size:12.5px;padding:12px 14px;resize:vertical;line-height:1.75;font-family:inherit;border:1px solid var(--border-color);border-radius:var(--radius-md);background:#fff;color:var(--text-main);display:block;box-sizing:border-box;" spellcheck="false"
>【身份定位】
你是知缘婚恋高端交友中心的资深AI红娘助理，拥有10年婚恋行业经验，情商高、共情力强，擅长倾听与引导。

【核心沟通原则】
1. 始终保持热情、真诚、耐心的语气，无论客户态度如何，绝不与客户发生争吵；
2. 沟通核心围绕"理解单身痛点 + 抛出匹配异性诱饵"展开，避免生硬推销；
3. 通话第2-3轮，必须敏锐捕捉客户行业/年龄/地域信息，及时抛出高匹配度嘉宾资料作为诱饵；
4. 获得客户明确加微同意后，礼貌确认微信号并快速收尾，不拖沓不死缠烂打；
5. 遇到客户明确拒绝（说"不需要/不要再打"）超过2次，必须礼貌致歉并主动挂断，标记为无意向。

【红线禁令】
- 严禁承诺"包脱单""百分百成功"等夸大宣传话术；
- 严禁泄露其他客户隐私信息，嘉宾资料仅做模糊化描述；
- 严禁在午休(12:00-14:00)和晚间(20:30后)时段主动外呼；
- 必须在通话开场30秒内明示"我是知缘婚恋的红娘助理"身份。</textarea>
          <div style="display:flex;gap:8px;margin-top:10px;align-items:center;">
            <span style="font-size:10.5px;color:var(--text-muted);margin-right:auto;">字符数：约450字 · 建议不超过800字保证响应速度</span>
            <button class="btn btn-ghost btn-sm" style="height:28px;font-size:11px;" onclick="App.showToast('已重置为出厂最佳实践','info')">
              <i data-lucide="rotate-ccw" style="width:11px;height:11px;"></i>重置默认
            </button>
            <button class="btn btn-outline btn-sm" style="height:28px;font-size:11px;" onclick="App.showToast('Prompt已测试通过，逻辑一致性良好','success')">
              <i data-lucide="play-circle" style="width:11px;height:11px;"></i>测试Prompt
            </button>
          </div>
        </div>
      </div>
    `;
  },

  renderInterruptionTab() {
    return `
      <div class="card" style="padding:14px 16px;">
        <div style="font-size:12px;font-weight:700;color:var(--text-main);display:inline-flex;align-items:center;gap:5px;margin-bottom:2px;"><i data-lucide="zap" style="width:13px;height:13px;color:var(--amber-500);"></i>全双工打断与时延控制</div>
        <div style="font-size:10.5px;color:var(--text-muted);margin-bottom:14px;">VAD语音活动检测+语义打断识别，实现真人般丝滑插话</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          ${[
            {name:'VAD起声响应灵敏度',val:'120',unit:'ms',desc:'客户开口后AI停止TTS的延迟，过低易误触发',min:50,max:300,color:'var(--brand-500)'},
            {name:'静音停顿等待判定',val:'450',unit:'ms',desc:'判定"说完一句话"的时延，过低易抢话',min:200,max:800,color:'var(--violet-500)'}
          ].map(s => `
            <div style="padding:10px 12px;border-radius:var(--radius-md);border:1px solid var(--border-color);background:var(--ink-50);">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <span style="font-size:11px;font-weight:600;color:var(--text-main);">${s.name}</span>
                <span style="font-size:13px;font-weight:700;color:${s.color};font-variant-numeric:tabular-nums;">${s.val} ${s.unit}</span>
              </div>
              <div style="font-size:10px;color:var(--text-muted);margin-bottom:6px;">${s.desc}</div>
              <input type="range" min="${s.min}" max="${s.max}" value="${s.val}" style="width:100%;accent-color:${s.color};">
            </div>
          `).join('')}
          <div style="padding:10px 12px;border-radius:var(--radius-md);border:1px solid var(--emerald-200);background:var(--emerald-50);">
            <div style="display:flex;align-items:center;gap:5px;margin-bottom:4px;">
              <i data-lucide="ear" style="width:12px;height:12px;color:var(--emerald-600);"></i>
              <span style="font-size:11px;font-weight:600;color:var(--emerald-700);">语气词智能过滤</span>
              <span style="margin-left:auto;font-size:9px;padding:1px 5px;border-radius:3px;background:var(--emerald-500);color:#fff;font-weight:600;">已开启</span>
            </div>
            <div style="font-size:10px;color:var(--text-secondary);line-height:1.5;">自动识别"嗯/啊/哦/在听"等附和声，AI不中断陈述继续流畅表达</div>
          </div>
          <div style="padding:10px 12px;border-radius:var(--radius-md);border:1px solid var(--brand-200);background:var(--brand-50);">
            <div style="display:flex;align-items:center;gap:5px;margin-bottom:4px;">
              <i data-lucide="activity" style="width:12px;height:12px;color:var(--brand-600);"></i>
              <span style="font-size:11px;font-weight:600;color:var(--brand-700);">语速情绪自适应</span>
              <span style="margin-left:auto;font-size:9px;padding:1px 5px;border-radius:3px;background:var(--brand-500);color:#fff;font-weight:600;">自适应</span>
            </div>
            <div style="font-size:10px;color:var(--text-secondary);line-height:1.5;">年轻客户自动提速10%；长辈客群自动放慢语速并提高清晰度</div>
          </div>
        </div>
      </div>
    `;
  },

  renderComplianceTab() {
    return `
      <div class="card" style="padding:14px 16px;">
        <div style="font-size:12px;font-weight:700;color:var(--text-main);display:inline-flex;align-items:center;gap:5px;margin-bottom:2px;"><i data-lucide="shield-check" style="width:13px;height:13px;color:var(--emerald-500);"></i>合规风控与防骚扰频控</div>
        <div style="font-size:10.5px;color:var(--text-muted);margin-bottom:14px;">严格遵循工信部外呼规范与消保法，杜绝投诉</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
          <div style="display:flex;flex-direction:column;gap:8px;">
            <div>
              <label class="form-label" style="font-size:10.5px;">同号呼叫频次上限</label>
              <select class="form-select" style="width:100%;height:32px;font-size:11px;">
                <option selected>7天内最多1次（推荐安全）</option>
                <option>3天内最多1次</option>
                <option>1天内最多1次</option>
              </select>
            </div>
            <div style="padding:10px 12px;border-radius:var(--radius-md);border:1px solid var(--border-color);background:var(--ink-50);">
              <div style="font-size:11px;font-weight:600;color:var(--text-main);margin-bottom:6px;">黑名单与冷却规则</div>
              <div style="display:flex;flex-direction:column;gap:4px;">
                ${[
                  '明确说"不需要/不要再打"→永久黑名单',
                  '连续拒接/秒挂2次→30天冷却池',
                  '空号/停机/错号→永久注销',
                  '已脱单客户→自动标记排除'
                ].map(t => `
                  <label style="display:flex;align-items:center;gap:6px;font-size:10.5px;color:var(--text-secondary);cursor:pointer;">
                    <input type="checkbox" checked style="width:12px;height:12px;accent-color:var(--brand-500);">
                    ${t}
                  </label>
                `).join('')}
              </div>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            <div style="padding:10px 12px;border-radius:var(--radius-md);border:1px solid var(--emerald-200);background:var(--emerald-50);">
              <div style="display:flex;align-items:center;gap:5px;margin-bottom:4px;">
                <i data-lucide="clock" style="width:12px;height:12px;color:var(--emerald-600);"></i>
                <span style="font-size:11px;font-weight:600;color:var(--emerald-700);">允许外呼时段</span>
              </div>
              <div style="font-size:13px;font-weight:700;color:var(--emerald-600);margin-bottom:2px;font-variant-numeric:tabular-nums;">09:30 - 11:30 , 14:00 - 20:30</div>
              <div style="font-size:10px;color:var(--text-secondary);">法定节假日及20:30后自动切断外呼通道</div>
            </div>
            <div style="padding:10px 12px;border-radius:var(--radius-md);border:1px solid var(--border-color);background:var(--ink-50);">
              <div style="display:flex;align-items:center;gap:5px;margin-bottom:4px;">
                <i data-lucide="phone" style="width:12px;height:12px;color:var(--text-muted);"></i>
                <span style="font-size:11px;font-weight:600;color:var(--text-main);">AXB隐私号轮换</span>
              </div>
              <div style="font-size:10px;color:var(--text-secondary);line-height:1.5;">已接入固话网关，单主叫日外呼<150通，自动避开骚扰标记；触发限制秒级熔断转移</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderWeComRouteTab() {
    const agents = [
      {name:'张老师',role:'金牌红娘·体制内/高知',load:'14/25',pct:56,color:'var(--emerald-500)'},
      {name:'李老师',role:'资深匹配师·年轻互联网',load:'11/25',pct:44,color:'var(--brand-500)'},
      {name:'陈老师',role:'高端定制·海归/高净值',load:'8/20',pct:40,color:'var(--violet-500)'}
    ];
    return `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--content-gap);">
        <div class="card" style="padding:14px 16px;">
          <div style="font-size:12px;font-weight:700;color:var(--text-main);display:inline-flex;align-items:center;gap:5px;margin-bottom:2px;"><i data-lucide="users" style="width:13px;height:13px;color:var(--brand-500);"></i>红娘坐席负载权重池</div>
          <div style="font-size:10.5px;color:var(--text-muted);margin-bottom:10px;">智能权重调度，避免单人过载</div>
          <div style="display:flex;flex-direction:column;gap:6px;">
            ${agents.map(a => `
              <div style="padding:8px 10px;border-radius:var(--radius-md);border:1px solid var(--border-color);background:var(--ink-50);">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
                  <span style="font-size:11px;font-weight:600;color:var(--text-main);">${a.name}</span>
                  <span style="font-size:9.5px;font-variant-numeric:tabular-nums;color:var(--text-muted);">${a.load}</span>
                </div>
                <div style="font-size:9.5px;color:var(--text-secondary);margin-bottom:4px;">${a.role}</div>
                <div class="progress-bar-container" style="height:3px;">
                  <div style="width:${a.pct}%;height:100%;background:${a.color};border-radius:2px;"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="card" style="padding:14px 16px;">
          <div style="font-size:12px;font-weight:700;color:var(--text-main);display:inline-flex;align-items:center;gap:5px;margin-bottom:2px;"><i data-lucide="shield" style="width:13px;height:13px;color:var(--rose-500);"></i>企微防封保护阀</div>
          <div style="font-size:10.5px;color:var(--text-muted);margin-bottom:10px;">加友频率安全守护，触发限制秒级熔断</div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${[
              {label:'单微信号每日主动加友上限',val:'25 人/天',c:'var(--rose-600)'},
              {label:'加友请求发送间隔',val:'30-60秒随机抖动',c:'var(--amber-600)'},
              {label:'单IP企微账号并发',val:'≤3个',c:'var(--brand-600)'},
              {label:'熔断转移响应时间',val:'< 1秒',c:'var(--emerald-600)'}
            ].map(r => `
              <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:var(--ink-50);border-radius:var(--radius-sm);">
                <span style="font-size:10.5px;color:var(--text-secondary);">${r.label}</span>
                <span style="font-size:11px;font-weight:700;color:${r.c};font-variant-numeric:tabular-nums;">${r.val}</span>
              </div>
            `).join('')}
            <div style="margin-top:4px;padding:8px 10px;background:var(--rose-50);border:1px solid var(--rose-200);border-radius:var(--radius-sm);font-size:10px;color:var(--rose-700);line-height:1.5;">
              <i data-lucide="alert-triangle" style="width:10px;height:10px;display:inline;"></i>
              触发企微官方限制时，系统自动转移线索至备用红娘号，确保线索不丢失
            </div>
          </div>
        </div>
      </div>
    `;
  },

  switchTab(t) { this.activeTab = t; App.refreshCurrentView(); },
  saveSettings() { App.showToast('配置已保存并热更新至外呼网关','success'); }
};

window.RulesView = RulesView;
