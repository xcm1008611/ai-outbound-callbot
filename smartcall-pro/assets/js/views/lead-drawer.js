// Lead Drawer (潜客360°全景画像抽屉) v2 - 统一紧凑SaaS风格

const LeadDrawer = {
  isOpen: false,
  currentLead: null,
  activeTab: 'profile',

  open(leadId) {
    this.currentLead = window.MockData ? window.MockData.getLeadById(leadId) : (AppState.leads ? AppState.leads.find(l => l.id === leadId) : null);
    if (!this.currentLead) {
      App.showToast('未找到指定客户信息', 'error');
      return;
    }
    this.isOpen = true;
    this.activeTab = 'profile';
    this.render();
  },

  close() {
    this.isOpen = false;
    const drawerEl = document.getElementById('lead-drawer-container');
    if (drawerEl) {
      drawerEl.classList.remove('open');
      setTimeout(() => { drawerEl.innerHTML = ''; }, 300);
    }
  },

  switchTab(tab) { this.activeTab = tab; this.render(); },

  render() {
    let drawerContainer = document.getElementById('lead-drawer-container');
    if (!drawerContainer) {
      drawerContainer = document.createElement('div');
      drawerContainer.id = 'lead-drawer-container';
      drawerContainer.className = 'drawer-backdrop';
      document.body.appendChild(drawerContainer);
      drawerContainer.addEventListener('click', (e) => { if (e.target === drawerContainer) this.close(); });
    }

    if (!this.isOpen || !this.currentLead) return;
    const lead = this.currentLead;

    drawerContainer.innerHTML = `
      <div class="drawer-panel" onclick="event.stopPropagation()">
        <!-- Header -->
        <div style="padding:14px 20px;border-bottom:1px solid var(--border-color);display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
          <div style="display:flex;align-items:center;gap:10px;min-width:0;flex:1;">
            <div class="lead-avatar-bubble ${lead.gender==='女'?'female':''}" style="width:40px;height:40px;font-size:16px;flex-shrink:0;">${lead.name[0]}</div>
            <div style="min-width:0;">
              <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:2px;">
                <span style="font-size:15px;font-weight:700;color:var(--text-main);">${lead.name}</span>
                <span style="font-size:11px;color:var(--text-muted);">${lead.gender==='男'?'♂':'♀'} · ${lead.age > 0 ? lead.age + '岁' : '年龄未知'}</span>
                <span class="tier-pill tier-${(lead.tier||'B').toLowerCase()}">${lead.tier}级意向</span>
              </div>
              <div style="display:flex;align-items:center;gap:6px;font-size:10.5px;color:var(--text-muted);flex-wrap:wrap;font-variant-numeric:tabular-nums;">
                <span>${lead.phone||'138****5678'}</span>
                <span style="color:var(--border-color);">·</span>
                <span>${lead.occupation||'算法工程师'}</span>
                <span style="color:var(--border-color);">·</span>
                <span>${lead.city||'杭州'}</span>
              </div>
            </div>
          </div>
          <div style="display:flex;gap:4px;flex-shrink:0;">
            <button class="btn btn-outline btn-sm" style="height:30px;font-size:11px;color:var(--amber-700);border-color:var(--amber-300);background:var(--amber-50);" onclick="LeadDrawer.close();setTimeout(()=>{ window.openLeadEditModal && openLeadEditModal('${lead.id}') },260)" title="手动补全画像">
              <i data-lucide="user-round-pen" style="width:12px;height:12px;"></i>补全画像
            </button>
            <button class="btn btn-primary btn-sm" style="height:30px;font-size:11px;" onclick="MatchmakerView && MatchmakerView.quickAddWeCom ? MatchmakerView.quickAddWeCom('${lead.id}') : App.showToast('请切换至红娘工作台操作','info')">
              <i data-lucide="user-plus" style="width:12px;height:12px;"></i>加微
            </button>
            <button class="btn btn-ghost btn-sm" style="width:30px;height:30px;padding:0;" onclick="LeadDrawer.close()">
              <i data-lucide="x" style="width:14px;height:14px;"></i>
            </button>
          </div>
        </div>

        <!-- Tabs -->
        <div style="display:flex;gap:0;padding:0 12px;border-bottom:1px solid var(--border-color);background:var(--bg-card);">
          ${[
            ['profile','user','360°画像'],
            ['match_engine','sparkles','智能匹配'],
            ['call_record','phone-call','通话质检'],
            ['timeline','history','生命周期']
          ].map(([id,icon,label]) => `
            <button onclick="LeadDrawer.switchTab('${id}')" style="padding:10px 14px;font-size:11px;font-weight:${this.activeTab===id?'600':'400'};color:${this.activeTab===id?'var(--brand-600)':'var(--text-muted)'};border:none;background:transparent;border-bottom:2px solid ${this.activeTab===id?'var(--brand-500)':'transparent'};cursor:pointer;display:inline-flex;align-items:center;gap:4px;transition:all 0.15s;">
              <i data-lucide="${icon}" style="width:12px;height:12px;"></i>${label}
            </button>
          `).join('')}
        </div>

        <!-- Body -->
        <div style="padding:16px 20px;overflow-y:auto;flex:1;height:calc(100vh - 120px);">
          ${this.activeTab === 'profile' ? this.renderProfileTab(lead) :
            this.activeTab === 'match_engine' ? this.renderMatchEngineTab(lead) :
            this.activeTab === 'call_record' ? this.renderCallRecordTab(lead) :
            this.renderTimelineTab(lead)}
        </div>
      </div>
    `;

    setTimeout(() => {
      drawerContainer.classList.add('open');
      if (window.lucide) lucide.createIcons();
    }, 10);
  },

  renderProfileTab(lead) {
    return `
      <div style="display:flex;flex-direction:column;gap:12px;">
        <!-- AI Summary -->
        <div style="background:linear-gradient(135deg,var(--brand-50),var(--violet-50));border:1px solid var(--brand-100);border-radius:var(--radius-md);padding:10px 12px;">
          <div style="display:flex;align-items:center;gap:4px;font-size:10.5px;font-weight:600;color:var(--brand-600);margin-bottom:4px;">
            <i data-lucide="sparkles" style="width:12px;height:12px;"></i>AI提炼画像特征
          </div>
          <div style="font-size:11.5px;color:var(--text-secondary);line-height:1.6;">
            高知IT技术骨干，社交圈狭窄无时间线下社交，性格内敛重视家庭，择偶看重性格合拍与学历相当（本科以上），对体制内/教师/设计师类偏好度95%。
          </div>
        </div>

        <!-- Basic Info -->
        <div class="card" style="padding:12px 14px;">
          <div style="font-size:11px;font-weight:700;color:var(--text-main);margin-bottom:10px;display:flex;align-items:center;gap:5px;">
            <i data-lucide="id-card" style="width:12px;height:12px;color:var(--brand-500);"></i>个人条件
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0;font-size:11.5px;">
            ${[
              ['身高/体重','178cm / 72kg'],
              ['学历院校','硕士 · 浙江大学'],
              ['职业单位',lead.occupation||'字节跳动算法工程师'],
              ['年收入','45-60万'],
              ['房车资产','杭州滨江全款房·有车'],
              ['婚姻状况','未婚未育']
            ].map(([k,v]) => `
              <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border-subtle);gap:8px;">
                <span style="color:var(--text-muted);flex-shrink:0;">${k}</span>
                <span style="color:var(--text-main);font-weight:500;text-align:right;">${v}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Partner Preferences -->
        <div class="card" style="padding:12px 14px;">
          <div style="font-size:11px;font-weight:700;color:var(--text-main);margin-bottom:10px;display:flex;align-items:center;gap:5px;">
            <i data-lucide="heart" style="width:12px;height:12px;color:var(--rose-500);"></i>择偶核心标准
          </div>
          <div style="display:flex;flex-direction:column;gap:6px;font-size:11.5px;">
            <div style="display:flex;align-items:flex-start;gap:8px;">
              <span style="color:var(--text-muted);width:64px;flex-shrink:0;padding-top:1px;">年龄偏好</span>
              <span style="color:var(--text-main);">25-30岁 (94-99年)</span>
            </div>
            <div style="display:flex;align-items:flex-start;gap:8px;">
              <span style="color:var(--text-muted);width:64px;flex-shrink:0;padding-top:1px;">学历期望</span>
              <span style="color:var(--text-main);">统招本科及以上（硕士优先）</span>
            </div>
            <div style="display:flex;align-items:flex-start;gap:8px;">
              <span style="color:var(--text-muted);width:64px;flex-shrink:0;padding-top:1px;">行业偏好</span>
              <div style="display:flex;flex-wrap:wrap;gap:3px;">
                ${['体制内/公务员','高校教师','设计师/创意'].map(t => `<span class="badge badge-info" style="font-size:10px;line-height:16px;">${t}</span>`).join('')}
              </div>
            </div>
            <div style="display:flex;align-items:flex-start;gap:8px;">
              <span style="color:var(--text-muted);width:64px;flex-shrink:0;padding-top:1px;">红线忌讳</span>
              <span style="color:var(--rose-600);font-weight:500;">抽烟、沉迷酒吧夜店、异地恋</span>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderMatchEngineTab(lead) {
    const candidates = [
      {name:'林舒涵',age:27,occ:'网易UI资深设计师',edu:'浙大硕士',h:'166cm',score:98,tags:['高颜值','性格温和','无房贷压力'],reason:'同浙大研究生，同在滨江网易科技园，爱好摄影自驾完全重合'},
      {name:'张雅婷',age:26,occ:'杭州重点公办中学英语教师',edu:'华东师大本科',h:'164cm',score:93,tags:['体制内编制','原生家庭优','擅长厨艺'],reason:'父母体制内干部，知书达理，寒暑假陪伴时间多，家庭氛围极佳'}
    ];
    return `
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <span style="font-size:11px;color:var(--text-muted);">基于360°画像实时推荐，匹配度越高越优先</span>
          <button class="btn btn-outline btn-sm" style="height:26px;font-size:10.5px;padding:0 8px;" onclick="App.showToast('正在重新计算匹配度...','info')">
            <i data-lucide="refresh-cw" style="width:11px;height:11px;"></i>重算
          </button>
        </div>
        ${candidates.map(c => `
          <div class="card" style="padding:12px 14px;border:1px solid var(--border-color);">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;gap:8px;">
              <div style="display:flex;align-items:center;gap:6px;min-width:0;flex:1;">
                <div class="lead-avatar-bubble female" style="width:28px;height:28px;font-size:11px;">${c.name[0]}</div>
                <div style="min-width:0;">
                  <span style="font-size:12px;font-weight:700;color:var(--text-main);">${c.name}</span>
                  <span style="font-size:10.5px;color:var(--text-muted);margin-left:4px;">女·${c.age}岁·${c.h}</span>
                </div>
              </div>
              <span class="tier-pill tier-s" style="font-size:10px;padding:0 6px;line-height:16px;">匹配 ${c.score}%</span>
            </div>
            <div style="font-size:10.5px;color:var(--text-secondary);margin-bottom:6px;">${c.occ} · ${c.edu}</div>
            <div style="background:var(--brand-50);border:1px solid var(--brand-100);border-radius:var(--radius-sm);padding:6px 8px;font-size:10.5px;color:var(--brand-700);line-height:1.5;margin-bottom:6px;">
              <strong>推荐理由：</strong>${c.reason}
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <div style="display:flex;gap:3px;flex-wrap:wrap;">
                ${c.tags.map(t => `<span style="font-size:9.5px;padding:1px 5px;border-radius:3px;background:var(--ink-100);color:var(--text-muted);line-height:15px;">${t}</span>`).join('')}
              </div>
              <button class="btn btn-primary btn-sm" style="height:24px;padding:0 8px;font-size:10px;" onclick="App.showToast('已将【${c.name}】脱敏资料推送至客户企微','success')">
                <i data-lucide="send" style="width:10px;height:10px;"></i>推送
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  renderCallRecordTab(lead) {
    return `
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div class="card" style="padding:12px 14px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
            <span style="font-size:11px;font-weight:700;color:var(--text-main);">AI外呼录音</span>
            <span class="tier-pill tier-s" style="font-size:10px;">质检96分·优秀</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;padding:8px 10px;background:var(--ink-50);border-radius:var(--radius-md);">
            <button class="btn btn-primary btn-sm" style="width:28px;height:28px;padding:0;border-radius:50%;flex-shrink:0;" onclick="App.showToast('正在播放录音...','info')">
              <i data-lucide="play" style="width:11px;height:11px;"></i>
            </button>
            <div style="flex:1;display:flex;align-items:center;gap:6px;">
              <div class="progress-bar-container" style="flex:1;height:4px;">
                <div class="progress-bar" style="width:45%;background:var(--brand-500);"></div>
              </div>
              <span style="font-size:10.5px;color:var(--text-muted);font-variant-numeric:tabular-nums;flex-shrink:0;">01:15 / 02:48</span>
            </div>
          </div>
        </div>

        <div class="card" style="padding:12px 14px;">
          <div style="font-size:11px;font-weight:700;color:var(--text-main);margin-bottom:8px;">通话逐字稿关键切片</div>
          <div style="display:flex;flex-direction:column;gap:4px;font-size:11px;line-height:1.6;">
            <div style="padding:6px 8px;background:var(--ink-50);border-radius:var(--radius-sm);color:var(--text-secondary);">
              <span style="color:var(--brand-600);font-weight:500;">[00:01] AI红娘：</span>您好，我是知缘婚恋的资深红娘助理...
            </div>
            <div style="padding:6px 8px;background:var(--brand-50);border-radius:var(--radius-sm);color:var(--text-secondary);">
              <span style="color:var(--brand-600);font-weight:500;">[00:15] AI红娘：</span>特别理解您！程序员工作确实忙，我们库里正好有位网易UI设计师姑娘，也是浙大毕业...
            </div>
            <div style="padding:6px 8px;background:var(--emerald-50);border-radius:var(--radius-sm);color:var(--emerald-700);font-weight:600;">
              [00:46] 客户：行吧，微信号就是我手机号，你让她加我吧。
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderTimelineTab(lead) {
    const events = [
      {color:'var(--emerald-500)',title:'企业微信加好友申请已发起',time:'2025-05-18 10:28',desc:'操作人: AI自动化调度器'},
      {color:'var(--brand-500)',title:'AI外呼通话结束 · S级极高意向',time:'2025-05-18 10:27',desc:'通话2分48秒 · 质检96分'},
      {color:'var(--ink-400)',title:'名单准入与清洗入库',time:'2025-05-18 09:10',desc:'来源: 杭州985硕博高知专场'}
    ];
    return `
      <div style="padding:4px 0;">
        <div style="position:relative;padding-left:16px;">
          <div style="position:absolute;left:5px;top:4px;bottom:4px;width:2px;background:var(--border-color);"></div>
          ${events.map((e,i) => `
            <div style="position:relative;padding-bottom:${i===events.length-1?'0':'16px'};">
              <div style="position:absolute;left:-16px;top:3px;width:12px;height:12px;border-radius:50%;background:${e.color};border:2px solid var(--bg-card);box-shadow:0 0 0 2px ${e.color}30;"></div>
              <div style="font-size:11.5px;font-weight:600;color:var(--text-main);margin-bottom:2px;">${e.title}</div>
              <div style="font-size:10.5px;color:var(--text-muted);font-variant-numeric:tabular-nums;">${e.time} · ${e.desc}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
};

window.LeadDrawer = LeadDrawer;
