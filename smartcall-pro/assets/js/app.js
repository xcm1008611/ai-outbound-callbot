// smartcall-pro/assets/js/app.js
// 核心路由、全局状态总线、多租户/角色切换、模态弹窗与沉浸式演示控制器

const App = {
  currentRoute: 'dashboard',
  currentRole: 'admin', // 'admin' | 'matchmaker' | 'qa_manager'
  currentTenant: '杭州旗舰总店 (知缘高端婚恋)',
  toastTimeout: null,

  init() {
    console.log('知缘 AI 红娘智能外呼原型系统启动...');
    this.bindEvents();
    this.renderNavigation();
    this.navigate('dashboard');
    this.setupShortcuts();
  },

  navigate(route) {
    // Sub-route to parent mapping for nav highlighting
    const routeMap = { 'campaign-monitor': 'campaigns' };
    const systemRoutes = ['flows','rules','scoring','compliance','knowledge','lines','agents','integrations','audit'];
    const highlightRoute = routeMap[route] || route;

    // Auto-expand system menu when visiting system pages
    if (systemRoutes.includes(route)) {
      this.systemMenuOpen = true;
      // Re-render nav if already mounted (defer to after DOM update)
      setTimeout(() => {
        const items = document.getElementById('sys-menu-items');
        const chev = document.getElementById('sys-menu-chevron');
        if (items) items.style.display = '';
        if (chev) { chev.setAttribute('data-lucide','chevron-down'); if(window.lucide)lucide.createIcons(); }
      }, 0);
    }

    this.currentRoute = route;
    
    // Update active state in sidebar
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.getAttribute('data-route') === highlightRoute) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    this.renderCurrentView();
  },

  refreshCurrentView() {
    this.renderCurrentView();
  },

  renderCurrentView() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    let contentHtml = '';

    switch (this.currentRoute) {
      case 'dashboard':
        contentHtml = window.DashboardView ? window.DashboardView.render() : '<div class="p-8">正在加载仪表盘...</div>';
        break;
      case 'simulator':
        // 沙盒已整合到外呼任务调度，重定向
        this.currentRoute = 'campaigns';
        contentHtml = window.CampaignsView ? window.CampaignsView.render() : '';
        break;
      case 'leads':
        contentHtml = window.LeadsView ? window.LeadsView.render() : '<div class="p-8">正在加载名单中心...</div>';
        break;
      case 'campaigns':
        contentHtml = window.CampaignsView ? window.CampaignsView.render() : '<div class="p-8">正在加载外呼任务...</div>';
        break;
      case 'matchmaker':
        contentHtml = window.MatchmakerView ? window.MatchmakerView.render() : '<div class="p-8">正在加载红娘工作台...</div>';
        break;
      case 'qa':
        contentHtml = window.QAView ? window.QAView.render() : '<div class="p-8">正在加载质检中心...</div>';
        break;
      case 'reports':
        contentHtml = window.ReportsView ? window.ReportsView.render() : '<div class="p-8">正在加载转化分析...</div>';
        break;
      case 'rules':
        contentHtml = window.RulesView ? window.RulesView.render() : '<div class="p-8">正在加载规则配置...</div>';
        break;
      case 'campaign-monitor':
        contentHtml = window.CampaignMonitorView ? window.CampaignMonitorView.render() : '<div class="p-8">正在加载任务监控...</div>';
        break;
      case 'calls':
        contentHtml = window.CallsView ? window.CallsView.render() : '<div class="p-8">正在加载通话记录...</div>';
        break;
      case 'flows':
        contentHtml = window.FlowsView ? window.FlowsView.render() : '<div class="p-8">正在加载流程编排...</div>';
        break;
      case 'compliance':
        contentHtml = window.ComplianceView ? window.ComplianceView.render() : renderPlaceholderPage('合规台账', 'shield', '统一管理授权审核、黑名单、退订、频控和违规审计记录');
        break;
      case 'knowledge':
        contentHtml = window.KnowledgeView ? window.KnowledgeView.render() : renderPlaceholderPage('知识库与智能体绑定', 'book-open', '管理 MaxKB 应用绑定、连接状态和版本发布');
        break;
      case 'lines':
        contentHtml = window.LinesView ? window.LinesView.render() : renderPlaceholderPage('线路与号码池', 'server', '管理 SIP 线路、主叫号码、健康状态和路由策略');
        break;
      case 'agents':
        contentHtml = window.AgentsView ? window.AgentsView.render() : renderPlaceholderPage('坐席与转人工队列', 'headphones', '管理坐席状态、技能组、排队监控和转接记录');
        break;
      case 'integrations':
        contentHtml = window.IntegrationsView ? window.IntegrationsView.render() : renderPlaceholderPage('系统集成与连接状态', 'puzzle', '管理 SmartCall、MaxKB、企微、ASR/TTS 等外部服务连接');
        break;
      case 'scoring':
        contentHtml = window.ScoringView ? window.ScoringView.render() : renderPlaceholderPage('评分规则版本', 'gauge', '管理意向评分维度、阈值、命中规则、版本发布与回滚');
        break;
      case 'audit':
        contentHtml = window.AuditView ? window.AuditView.render() : renderPlaceholderPage('操作审计日志', 'history', '记录发布、启停、导入、审核、连接测试和权限变更等关键操作');
        break;
      default:
        contentHtml = window.DashboardView ? window.DashboardView.render() : '';
    }

    // Fade out old content
    mainContent.style.opacity = '0';
    
    setTimeout(() => {
      mainContent.innerHTML = contentHtml;
      
      // Apply Apple-style stagger entrance animations
      this.applyEntranceAnimations();
      
      // Fade in new content
      mainContent.style.opacity = '1';
      mainContent.style.transition = 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
      
      // Refresh icons
      if (window.lucide) {
        lucide.createIcons();
      }
    }, 150);
  },

  applyEntranceAnimations() {
    // Add stagger-container class to metrics grids
    const metricsGrids = document.querySelectorAll('.metrics-grid');
    metricsGrids.forEach(grid => {
      if (!grid.classList.contains('stagger-container')) {
        grid.classList.add('stagger-container');
      }
    });

    // Add stagger to data tables
    const dataTables = document.querySelectorAll('.data-table tbody');
    dataTables.forEach(tbody => {
      tbody.querySelectorAll('tr').forEach((row, idx) => {
        row.style.animationDelay = `${0.05 + idx * 0.03}s`;
      });
    });

    // Add stagger to kanban columns
    const kanbanCards = document.querySelectorAll('.kanban-card');
    kanbanCards.forEach((card, idx) => {
      card.style.animationDelay = `${0.05 + idx * 0.05}s`;
    });

    // Add entrance animation to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, idx) => {
      if (!card.classList.contains('animate-entrance')) {
        card.style.animationDelay = `${0.1 + idx * 0.05}s`;
      }
    });
  },

  renderNavigation() {
    const navContainer = document.getElementById('sidebar-nav');
    if (!navContainer) return;

    const businessItems = [
      { id: 'dashboard', label: '运营驾驶舱', icon: 'layout-dashboard', badge: '实时' },
      { id: 'campaigns', label: '外呼任务调度', icon: 'phone-outgoing', badge: '核心', highlight: true },
      { id: 'leads', label: '名单准入与池子', icon: 'users' },
      { id: 'calls', label: '通话记录中心', icon: 'phone-call' },
      { id: 'matchmaker', label: '红娘跟进工作台', icon: 'heart-handshake', badge: '28' },
      { id: 'qa', label: '智能质检中心', icon: 'shield-check' },
      { id: 'reports', label: '全链路转化ROI', icon: 'line-chart' }
    ];

    const systemItems = [
      { id: 'flows', label: '机器人流程编排', icon: 'workflow' },
      { id: 'rules', label: '引擎参数配置', icon: 'sliders' },
      { id: 'scoring', label: '评分规则版本', icon: 'gauge' },
      { id: 'compliance', label: '合规台账', icon: 'shield' },
      { id: 'knowledge', label: '知识库绑定', icon: 'book-open' },
      { id: 'lines', label: '线路与号码', icon: 'server' },
      { id: 'agents', label: '坐席与队列', icon: 'headphones' },
      { id: 'integrations', label: '系统集成', icon: 'puzzle' },
      { id: 'audit', label: '操作审计日志', icon: 'history' }
    ];

    const sysOpen = this.systemMenuOpen !== false; // default open

    navContainer.innerHTML = `
      <div class="sidebar-section-title">业务工作台</div>
      ${businessItems.map(item => `
        <a href="javascript:void(0)" class="nav-item ${item.highlight ? 'nav-item-highlight' : ''}" data-route="${item.id}" onclick="App.navigate('${item.id}')">
          <i data-lucide="${item.icon}"></i>
          <span style="flex:1;min-width:0;">${item.label}</span>
          ${item.badge ? `<span class="badge ${item.highlight ? 'badge-primary' : 'badge-neutral'}" style="font-size:9.5px;padding:1px 5px;line-height:15px;flex-shrink:0;">${item.badge}</span>` : ''}
        </a>
      `).join('')}
      <div class="sidebar-section-title" style="cursor:pointer;display:flex;align-items:center;justify-content:space-between;" onclick="App.toggleSystemMenu()">
        <span>系统运营</span>
        <i data-lucide="chevron-${sysOpen?'down':'right'}" id="sys-menu-chevron" style="width:12px;height:12px;color:var(--text-muted);"></i>
      </div>
      <div id="sys-menu-items" style="${sysOpen?'':'display:none;'}">
        ${systemItems.map(item => `
          <a href="javascript:void(0)" class="nav-item nav-item-sub" data-route="${item.id}" onclick="App.navigate('${item.id}')">
            <i data-lucide="${item.icon}"></i>
            <span style="flex:1;min-width:0;">${item.label}</span>
          </a>
        `).join('')}
      </div>
    `;
  },

  toggleSystemMenu() {
    this.systemMenuOpen = this.systemMenuOpen === false;
    const items = document.getElementById('sys-menu-items');
    const chev = document.getElementById('sys-menu-chevron');
    if (items) items.style.display = this.systemMenuOpen ? '' : 'none';
    if (chev) chev.setAttribute('data-lucide', this.systemMenuOpen ? 'chevron-down' : 'chevron-right');
    if (window.lucide) lucide.createIcons();
  },

  bindEvents() {
    // Global clicks or shortcuts
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        App.openCommandPalette();
      }
      // ESC closes live sandbox drawer
      if (e.key === 'Escape' && typeof closeLiveSandbox === 'function') {
        const container = document.getElementById('live-sandbox-container');
        if (container && container.classList.contains('open')) {
          closeLiveSandbox();
        }
      }
    });
  },

  setupShortcuts() {
    console.log('快捷键支持: Ctrl+K / Cmd+K 开启全局指挥搜索');
  },

  switchTenant(tenantName) {
    this.currentTenant = tenantName;
    App.showToast(`已切换至租户门店：${tenantName}`, 'info');
    document.getElementById('current-tenant-label').innerText = tenantName;
  },

  switchRole(roleName) {
    this.currentRole = roleName;
    const roleMap = {
      'admin': '运营总监 (超级管理)',
      'matchmaker': '金牌红娘 (业务坐席)',
      'qa_manager': '质检总监 (合规风控)'
    };
    App.showToast(`已切换当前工作角色为：${roleMap[roleName] || roleName}`, 'info');
    document.getElementById('current-role-label').innerText = roleMap[roleName] || roleName;
  },

  // Toast Notification System
  showToast(message, type = 'info') {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const iconMap = {
      success: 'check-circle',
      error: 'alert-triangle',
      info: 'info',
      warning: 'alert-circle'
    };

    toast.innerHTML = `
      <i data-lucide="${iconMap[type] || 'info'}" style="width:16px;height:16px;"></i>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  },

  // Global Modal System
  showModal(options) {
    const modalBackdrop = document.getElementById('modal-backdrop');
    if (!modalBackdrop) return;

    modalBackdrop.innerHTML = `
      <div class="modal-card" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h3 class="modal-title">${options.title || '系统提示'}</h3>
          <button class="btn btn-ghost btn-sm" style="width:28px;height:28px;padding:0;" onclick="App.closeModal()">
            <i data-lucide="x" style="width:14px;height:14px;"></i>
          </button>
        </div>
        <div class="modal-body">
          ${options.content || ''}
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline btn-sm" style="height:32px;padding:0 16px;font-size:12px;" onclick="App.closeModal()">取消</button>
          <button class="btn btn-primary btn-sm" style="height:32px;padding:0 16px;font-size:12px;" id="modal-confirm-btn">${options.confirmText || '确定'}</button>
        </div>
      </div>
    `;

    modalBackdrop.classList.add('open');
    if (window.lucide) lucide.createIcons();

    document.getElementById('modal-confirm-btn').onclick = () => {
      if (options.onConfirm) options.onConfirm();
      App.closeModal();
    };
  },

  closeModal() {
    const modalBackdrop = document.getElementById('modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.classList.remove('open');
    }
  },

  // Global Command Palette (⌘K)
  openCommandPalette() {
    App.showModal({
      title: '全局智能指令与快速跳转',
      content: `
        <div style="display:flex;flex-direction:column;gap:10px;">
          <div style="position:relative;">
            <i data-lucide="search" style="position:absolute;left:10px;top:50%;transform:translateY(-50%);width:14px;height:14px;color:var(--text-muted);"></i>
            <input type="text" placeholder="输入功能模块、客户姓名、电话或操作指令..." autofocus
              style="width:100%;height:36px;padding:0 12px 0 32px;font-size:13px;border:1px solid var(--border-color);border-radius:var(--radius-md);background:var(--ink-50);outline:none;">
          </div>
          <div style="font-size:10.5px;font-weight:600;color:var(--text-muted);padding:0 2px;">快捷入口</div>
          <div style="display:flex;flex-direction:column;gap:3px;">
            ${[
              ['campaigns','phone-outgoing','外呼任务调度 · 实时监控通话','核心特性','badge-primary'],
              ['matchmaker','heart-handshake','红娘线索跟进看板','28条待办','badge-neutral'],
              ['campaigns','radio','查看运行中任务的AI实时沙盒','',''],
              ['qa','shield-check','智能质检中心与录音分析','','']
            ].map(([route,icon,label,badge,badgeCls]) => `
              <div onclick="App.navigate('${route}'); App.closeModal(); ${route==='campaigns' && label.includes('沙盒') ? "setTimeout(()=>{const c=AppState.campaigns.find(x=>x.status==='running');if(c&&typeof openLiveSandbox==='function')openLiveSandbox(c.id);},300)" : ""}" style="padding:8px 10px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:space-between;gap:8px;cursor:pointer;transition:background 0.15s;" onmouseover="this.style.background='var(--ink-50)'" onmouseout="this.style.background='transparent'">
                <span style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text-main);">
                  <i data-lucide="${icon}" style="width:13px;height:13px;color:var(--brand-500);"></i>${label}
                </span>
                ${badge ? `<span class="badge ${badgeCls}" style="font-size:10px;line-height:16px;">${badge}</span>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `,
      confirmText: '关闭'
    });
  },

  // One-Click Immersive Guided Demo Experience
  startFullDemo() {
    App.showToast('正在启动【AI红娘外呼全流程沉浸式演示】...', 'success');
    App.navigate('campaigns');
    // After view renders, open sandbox for first running campaign
    setTimeout(() => {
      const firstRunning = AppState.campaigns.find(c => c.status === 'running');
      if (firstRunning && typeof openLiveSandbox === 'function') {
        openLiveSandbox(firstRunning.id);
      }
    }, 400);
  }
};

window.App = App;

// Placeholder page for unbuilt system pages
function renderPlaceholderPage(title, icon, desc) {
  return `
    <div class="view-fade-enter">
      <div class="page-header">
        <div class="page-title-group">
          <div class="page-title"><i data-lucide="${icon}"></i>${title}</div>
          <div class="page-subtitle">${desc}</div>
        </div>
      </div>
      <div class="card" style="padding:48px 24px;text-align:center;">
        <div style="width:56px;height:56px;border-radius:50%;background:var(--ink-50);display:flex;align-items:center;justify-content:center;margin:0 auto 14px;">
          <i data-lucide="hammer" style="width:24px;height:24px;color:var(--text-muted);"></i>
        </div>
        <div style="font-size:14px;font-weight:600;color:var(--text-main);margin-bottom:6px;">${title} · 原型建设中</div>
        <div style="font-size:12px;color:var(--text-muted);max-width:420px;margin:0 auto;line-height:1.6;">
          该页面已完成导航占位，详细功能原型将按MVP优先级陆续补齐。当前演示请使用业务工作台页面（外呼任务、通话记录、红娘跟进、质检、ROI分析）。
        </div>
        <div style="margin-top:16px;display:flex;gap:8px;justify-content:center;">
          <span class="badge badge-neutral" style="font-size:10.5px;line-height:18px;">演示环境</span>
          <span class="badge badge-neutral" style="font-size:10.5px;line-height:18px;">待接口核验</span>
        </div>
      </div>
    </div>
  `;
}
window.renderPlaceholderPage = renderPlaceholderPage;

// Auto init on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

// Global drawer opener
AppState.openLeadDrawer = function(leadId) {
  if (window.LeadDrawer) LeadDrawer.open(leadId);
};
