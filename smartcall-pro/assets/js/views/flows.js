// View: Flows (机器人与话术流程编排) - Canvas-based flow editor

const FlowsView = {
  selectedNodeId: 'node-start',
  activeFlowId: 'flow-1',
  zoom: 100,
  validationOpen: false,
  hasUnsavedChanges: false,
  nodeSnapEnabled: true,
  interruptEnabled: true,

  flows: [
    { id:'flow-1', name:'婚恋潜客首次筛选', scene:'婚恋交友-首触', status:'published', version:'v1.2.3', updated:'2分钟前', active:true },
    { id:'flow-2', name:'老客户回访激活', scene:'婚恋交友-召回', status:'published', version:'v1.0.8', updated:'1小时前', active:false },
    { id:'flow-3', name:'活动邀约通知', scene:'婚恋交友-活动', status:'draft', version:'v0.3.0', updated:'昨天 18:20', active:false },
    { id:'flow-4', name:'售后满意度调研', scene:'通用-调研', status:'disabled', version:'v2.1.0', updated:'3天前', active:false },
    { id:'flow-5', name:'高意向客户深度跟进', scene:'婚恋交友-转化', status:'draft', version:'v0.1.2', updated:'5天前', active:false }
  ],

  // Node type definitions
  nodeTypes: {
    start:    { label:'开始', icon:'phone-incoming', color:'var(--emerald-500)', colorDark:'var(--emerald-600)', colorBg:'var(--emerald-50)', pill:true },
    say:      { label:'机器人播报', icon:'message-square', color:'var(--blue-500)', colorDark:'var(--blue-700)', colorBg:'var(--blue-50)' },
    question: { label:'提问/等待回复', icon:'help-circle', color:'var(--violet-500)', colorDark:'var(--violet-600)', colorBg:'var(--violet-50)' },
    intent:   { label:'意图识别', icon:'brain', color:'var(--violet-600)', colorDark:'var(--violet-700)', colorBg:'var(--violet-50)' },
    condition:{ label:'条件分支', icon:'git-branch', color:'var(--amber-500)', colorDark:'var(--amber-600)', colorBg:'var(--amber-50)', diamond:true },
    knowledge:{ label:'知识库问答', icon:'book-open', color:'var(--brand-600)', colorDark:'var(--brand-700)', colorBg:'var(--brand-50)' },
    extract:  { label:'结构化提取', icon:'database', color:'var(--brand-500)', colorDark:'var(--brand-600)', colorBg:'var(--brand-50)' },
    transfer: { label:'转人工', icon:'headphones', color:'var(--emerald-500)', colorDark:'var(--emerald-600)', colorBg:'var(--emerald-50)' },
    hangup:   { label:'挂机/结束', icon:'phone-off', color:'var(--rose-500)', colorDark:'var(--rose-600)', colorBg:'var(--rose-50)' },
    nurture:  { label:'记录培育', icon:'user-plus', color:'#06b6d4', colorDark:'#0891b2', colorBg:'#ecfeff' },
    objection:{ label:'异议处理', icon:'shield-alert', color:'var(--amber-600)', colorDark:'var(--amber-700)', colorBg:'var(--amber-50)' },
    wecom:    { label:'企微推送', icon:'send', color:'var(--blue-500)', colorDark:'var(--blue-700)', colorBg:'var(--blue-50)' },
    end:      { label:'结束', icon:'flag', color:'var(--ink-400)', colorDark:'var(--ink-600)', colorBg:'var(--ink-100)', pill:true }
  },

  // Canvas nodes with positions (x, y relative to canvas content area)
  nodes: [
    { id:'node-start',     type:'start',     title:'来电接入',                          x:300, y:10,   w:120 },
    { id:'node-greet',     type:'say',       title:'开场问候', subtitle:'您好{name}，我是知缘AI红娘助理...', x:275, y:90,   w:170 },
    { id:'node-identity',  type:'question',  title:'身份确认', subtitle:'是否本人？',       x:285, y:185,  w:150 },
    { id:'node-branch1',   type:'condition', title:'分支判断', subtitle:'是/否/拒接',       x:310, y:285,  w:100 },
    { id:'node-hangup1',   type:'hangup',    title:'礼貌挂机',                          x:60,  y:400,  w:120 },
    { id:'node-need',      type:'question',  title:'婚恋需求挖掘', subtitle:'择偶条件采集', x:275, y:400,  w:170 },
    { id:'node-intent',    type:'intent',    title:'意图识别', subtitle:'高/中/低/反感',    x:285, y:500,  w:150 },
    { id:'node-obj',       type:'objection', title:'异议处理', subtitle:'安抚+挽留',        x:20,  y:620,  w:130 },
    { id:'node-nurture',   type:'nurture',   title:'记录培育', subtitle:'标记低意向',        x:180, y:620,  w:130 },
    { id:'node-kb',        type:'knowledge', title:'知识库问答', subtitle:'RAG匹配回答',     x:380, y:620,  w:150 },
    { id:'node-extract',   type:'extract',   title:'结构化提取', subtitle:'年龄/城市/学历/收入/房车', x:255, y:740, w:210 },
    { id:'node-branch2',   type:'condition', title:'意向评分', subtitle:'意向≥85?',         x:310, y:850,  w:100 },
    { id:'node-wecom',     type:'wecom',     title:'发送企微资料', subtitle:'自动推送名片',  x:130, y:970,  w:150 },
    { id:'node-transfer',  type:'transfer',  title:'转人工红娘', subtitle:'高意向队列',      x:380, y:970,  w:150 },
    { id:'node-end',       type:'end',       title:'结束',                              x:300, y:1090, w:100 }
  ],

  // Validation issues
  validationIssues: [
    { severity:'warning', nodeId:'node-greet', message:'开场话术超过120字，建议精简至90字以内以保证接通率' },
    { severity:'warning', nodeId:'node-obj', message:'异议处理节点未配置兜底转人工策略' },
    { severity:'info', nodeId:'node-extract', message:'字段"房车情况"未绑定变量输出，提取结果将不写入CRM' }
  ],

  render() {
    const activeFlow = this.flows.find(f => f.id === this.activeFlowId) || this.flows[0];
    return `
      <div class="view-fade-enter" style="display:flex;flex-direction:column;height:calc(100vh - var(--header-height) - 32px);min-height:0;gap:0;">
        ${this.renderCommandBar(activeFlow)}
        ${this.renderStatusBar(activeFlow)}
        <!-- Three Column Layout -->
        <div style="display:flex;gap:var(--content-gap);flex:1;min-height:0;margin-top:var(--content-gap);">
          ${this.renderFlowList()}
          ${this.renderCanvas()}
          ${this.renderPropertiesPanel()}
        </div>
        ${this.renderValidationDrawer()}
      </div>
    `;
  },

  renderCommandBar(flow) {
    const statusBadge = flow.status === 'published'
      ? `<span style="display:inline-flex;align-items:center;gap:3px;font-size:10px;padding:2px 7px;border-radius:var(--radius-sm);background:var(--emerald-50);color:var(--emerald-600);font-weight:600;white-space:nowrap;"><i data-lucide="check-circle-2" style="width:10px;height:10px;"></i>${flow.version} · 已发布</span>`
      : flow.status === 'draft'
      ? `<span style="display:inline-flex;align-items:center;gap:3px;font-size:10px;padding:2px 7px;border-radius:var(--radius-sm);background:var(--amber-50);color:var(--amber-600);font-weight:600;white-space:nowrap;"><i data-lucide="file-edit" style="width:10px;height:10px;"></i>${flow.version} · 草稿</span>`
      : `<span style="display:inline-flex;align-items:center;gap:3px;font-size:10px;padding:2px 7px;border-radius:var(--radius-sm);background:var(--ink-100);color:var(--text-muted);font-weight:600;white-space:nowrap;"><i data-lucide="pause-circle" style="width:10px;height:10px;"></i>${flow.version} · 已停用</span>`;

    return `
      <div style="display:flex;align-items:center;gap:10px;background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:8px 14px;height:44px;flex-shrink:0;">
        <!-- LEFT: Back + Breadcrumb -->
        <div style="display:flex;align-items:center;gap:8px;min-width:0;flex-shrink:0;">
          <button class="btn btn-ghost btn-sm" style="height:28px;padding:0 8px;font-size:11px;color:var(--text-secondary);" onclick="App.navigate('campaigns')">
            <i data-lucide="arrow-left" style="width:12px;height:12px;"></i>
            返回
          </button>
          <div style="width:1px;height:16px;background:var(--border-color);"></div>
          <div style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--text-muted);white-space:nowrap;">
            <span>机器人流程</span>
            <i data-lucide="chevron-right" style="width:11px;height:11px;"></i>
            <span style="color:var(--text-main);font-weight:600;max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">婚恋潜客首次筛选</span>
          </div>
          ${statusBadge}
          <span style="font-size:9px;padding:2px 6px;border-radius:var(--radius-sm);background:var(--violet-50);color:var(--violet-600);font-weight:600;white-space:nowrap;">流程原型 · 待接口核验</span>
        </div>

        <!-- CENTER: Editable flow name -->
        <div style="flex:1;display:flex;justify-content:center;min-width:0;">
          <div style="display:flex;align-items:center;gap:6px;max-width:360px;" ondblclick="FlowsView.editFlowName(this)">
            <i data-lucide="workflow" style="width:13px;height:13px;color:var(--brand-500);flex-shrink:0;"></i>
            <span id="flow-name-display" style="font-size:13px;font-weight:700;color:var(--text-main);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${flow.name}流程</span>
            <i data-lucide="pencil" style="width:11px;height:11px;color:var(--text-muted);opacity:0.4;flex-shrink:0;cursor:pointer;" onclick="FlowsView.editFlowName(this.parentElement)"></i>
          </div>
        </div>

        <!-- RIGHT: Action buttons -->
        <div style="display:flex;align-items:center;gap:5px;flex-shrink:0;">
          <button class="btn btn-outline btn-sm" style="height:28px;padding:0 10px;font-size:11px;" onclick="FlowsView.saveDraft()">
            <i data-lucide="save" style="width:11px;height:11px;"></i>保存草稿
          </button>
          <button class="btn btn-outline btn-sm" style="height:28px;padding:0 10px;font-size:11px;" onclick="FlowsView.validateFlow()">
            <i data-lucide="check-square" style="width:11px;height:11px;"></i>校验流程
          </button>
          <button class="btn btn-primary btn-sm" style="height:28px;padding:0 12px;font-size:11px;gap:4px;" onclick="FlowsView.testRun()">
            <i data-lucide="play" style="width:11px;height:11px;"></i>测试运行
          </button>
          <button class="btn btn-sm" style="height:28px;padding:0 12px;font-size:11px;background:var(--emerald-500);color:#fff;border:1px solid var(--emerald-500);font-weight:600;" onclick="FlowsView.publishVersion()">
            <i data-lucide="rocket" style="width:11px;height:11px;"></i>发布版本
          </button>
          <button class="btn btn-ghost btn-sm" style="height:28px;padding:0 8px;font-size:11px;color:var(--text-secondary);" onclick="FlowsView.showVersionHistory()">
            <i data-lucide="history" style="width:12px;height:12px;"></i>版本历史
          </button>
        </div>
      </div>
    `;
  },

  renderStatusBar(flow) {
    const nodeCount = this.nodes.length;
    return `
      <div style="display:flex;align-items:center;gap:16px;padding:6px 14px;background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-md);margin-top:6px;height:30px;flex-shrink:0;font-size:10.5px;color:var(--text-secondary);">
        ${this.hasUnsavedChanges ? `
          <span style="display:inline-flex;align-items:center;gap:4px;color:var(--amber-600);">
            <span style="width:6px;height:6px;border-radius:50%;background:var(--amber-500);display:inline-block;"></span>
            未保存的更改
          </span>
        ` : `
          <span style="display:inline-flex;align-items:center;gap:4px;color:var(--emerald-600);">
            <i data-lucide="check" style="width:11px;height:11px;"></i>
            已保存
          </span>
        `}
        <div style="width:1px;height:12px;background:var(--border-color);"></div>
        <span style="display:inline-flex;align-items:center;gap:4px;">
          <i data-lucide="box" style="width:11px;height:11px;"></i>
          ${nodeCount} 个节点
        </span>
        <div style="width:1px;height:12px;background:var(--border-color);"></div>
        <span style="display:inline-flex;align-items:center;gap:4px;">
          <i data-lucide="clock" style="width:11px;height:11px;"></i>
          上次保存：${flow.updated}
        </span>
        <div style="flex:1;"></div>
        <span style="color:var(--text-muted);font-size:10px;">快捷键：Del 删除节点 · Ctrl+S 保存 · Ctrl+Z 撤销</span>
      </div>
    `;
  },

  renderFlowList() {
    return `
      <div style="width:180px;flex-shrink:0;background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);display:flex;flex-direction:column;overflow:hidden;">
        <div style="padding:10px 12px 8px;border-bottom:1px solid var(--border-subtle);flex-shrink:0;">
          <div style="font-size:12px;font-weight:700;color:var(--text-main);margin-bottom:8px;display:flex;align-items:center;gap:5px;">
            <i data-lucide="list" style="width:12px;height:12px;color:var(--brand-500);"></i>
            流程列表
          </div>
          <div style="position:relative;">
            <i data-lucide="search" style="position:absolute;left:7px;top:50%;transform:translateY(-50%);width:11px;height:11px;color:var(--text-muted);"></i>
            <input type="text" placeholder="搜索流程..." style="width:100%;height:26px;padding:0 8px 0 24px;font-size:10.5px;border:1px solid var(--border-color);border-radius:var(--radius-sm);background:var(--ink-50);outline:none;color:var(--text-main);">
          </div>
        </div>
        <div style="flex:1;overflow-y:auto;padding:4px 6px;">
          ${this.flows.map(f => {
            const isActive = f.id === this.activeFlowId;
            const statusCls = f.status === 'published' ? 'background:var(--emerald-50);color:var(--emerald-600);'
              : f.status === 'draft' ? 'background:var(--amber-50);color:var(--amber-600);'
              : 'background:var(--ink-100);color:var(--text-muted);';
            const statusText = f.status === 'published' ? '已发布' : f.status === 'draft' ? '草稿' : '已停用';
            return `
              <div onclick="FlowsView.switchFlow('${f.id}')" style="
                padding:8px 8px 8px 10px;margin-bottom:2px;border-radius:var(--radius-sm);cursor:pointer;
                border-left:2px solid ${isActive ? 'var(--brand-500)' : 'transparent'};
                background:${isActive ? 'var(--brand-50)' : 'transparent'};
                transition:background 0.15s;
              " onmouseover="if(!${isActive})this.style.background='var(--ink-50)'" onmouseout="if(!${isActive})this.style.background='transparent'">
                <div style="font-size:11px;font-weight:600;color:${isActive ? 'var(--brand-700)' : 'var(--text-main)'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:2px;">${f.name}</div>
                <div style="font-size:9.5px;color:var(--text-muted);margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${f.scene}</div>
                <div style="display:flex;align-items:center;gap:4px;justify-content:space-between;">
                  <span style="font-size:9px;padding:1px 5px;border-radius:3px;${statusCls}font-weight:600;">${statusText}</span>
                  <span style="font-size:9px;color:var(--text-muted);font-variant-numeric:tabular-nums;">${f.version}</span>
                </div>
                <div style="font-size:9px;color:var(--text-muted);margin-top:2px;">${f.updated}</div>
              </div>
            `;
          }).join('')}
        </div>
        <div style="padding:8px 10px;border-top:1px solid var(--border-subtle);flex-shrink:0;">
          <button class="btn btn-outline btn-sm" style="width:100%;height:28px;font-size:11px;justify-content:center;gap:4px;border-style:dashed;" onclick="FlowsView.createFlow()">
            <i data-lucide="plus" style="width:12px;height:12px;"></i>新建流程
          </button>
        </div>
      </div>
    `;
  },

  renderCanvas() {
    return `
      <div style="flex:1;min-width:0;background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);display:flex;flex-direction:column;overflow:hidden;">
        <!-- Canvas Toolbar -->
        <div style="display:flex;align-items:center;gap:6px;padding:7px 12px;border-bottom:1px solid var(--border-subtle);flex-shrink:0;height:36px;">
          <div style="display:flex;align-items:center;gap:1px;background:var(--ink-50);border-radius:var(--radius-sm);border:1px solid var(--border-color);">
            <button class="btn btn-ghost btn-sm" style="height:24px;padding:0 7px;font-size:11px;border-radius:var(--radius-sm) 0 0 var(--radius-sm);" onclick="FlowsView.zoomOut()">
              <i data-lucide="minus" style="width:11px;height:11px;"></i>
            </button>
            <span style="font-size:10.5px;font-weight:600;color:var(--text-main);padding:0 6px;min-width:40px;text-align:center;font-variant-numeric:tabular-nums;border-left:1px solid var(--border-color);border-right:1px solid var(--border-color);height:24px;display:flex;align-items:center;justify-content:center;cursor:pointer;" onclick="FlowsView.resetZoom()">${this.zoom}%</span>
            <button class="btn btn-ghost btn-sm" style="height:24px;padding:0 7px;font-size:11px;border-radius:0 var(--radius-sm) var(--radius-sm) 0;" onclick="FlowsView.zoomIn()">
              <i data-lucide="plus" style="width:11px;height:11px;"></i>
            </button>
          </div>
          <button class="btn btn-ghost btn-sm" style="height:24px;padding:0 8px;font-size:10.5px;color:var(--text-secondary);gap:3px;" onclick="FlowsView.fitView()">
            <i data-lucide="maximize-2" style="width:11px;height:11px;"></i>适应视图
          </button>
          <div style="width:1px;height:16px;background:var(--border-color);margin:0 2px;"></div>
          <button class="btn btn-ghost btn-sm" style="height:24px;padding:0 8px;font-size:10.5px;gap:3px;${this.nodeSnapEnabled ? 'color:var(--brand-600);background:var(--brand-50);' : 'color:var(--text-muted);'}" onclick="FlowsView.toggleSnap()">
            <i data-lucide="${this.nodeSnapEnabled ? 'magnet' : 'magnet'}" style="width:11px;height:11px;"></i>节点吸附 ${this.nodeSnapEnabled ? '开' : '关'}
          </button>
          <div style="flex:1;"></div>
          <div style="display:flex;align-items:center;gap:4px;">
            <button class="btn btn-ghost btn-sm" style="height:24px;padding:0 6px;font-size:10.5px;color:var(--text-muted);" onclick="App.showToast('迷你地图已开启','info')">
              <i data-lucide="map" style="width:11px;height:11px;"></i>
            </button>
            <button class="btn btn-ghost btn-sm" style="height:24px;padding:0 6px;font-size:10.5px;color:var(--text-muted);" onclick="App.showToast('快捷键提示已显示','info')">
              <i data-lucide="keyboard" style="width:11px;height:11px;"></i>
            </button>
          </div>
        </div>
        <!-- Canvas Body -->
        <div class="canvas-body" id="flow-canvas-body" style="
          flex:1;position:relative;overflow:auto;
          background-color:var(--ink-50);
          background-image:
            linear-gradient(var(--ink-200) 1px, transparent 1px),
            linear-gradient(90deg, var(--ink-200) 1px, transparent 1px);
          background-size:20px 20px;
          background-position:-1px -1px;
        ">
          <div id="flow-canvas-content" style="position:relative;width:720px;height:1200px;margin:24px auto;transform-origin:top center;transform:scale(${this.zoom/100});transition:transform 0.2s ease;">
            ${this.renderConnectors()}
            ${this.nodes.map(n => this.renderNode(n)).join('')}
          </div>
        </div>
      </div>
    `;
  },

  renderConnectors() {
    const lineColor = 'var(--ink-300)';
    const labelStyle = 'position:absolute;font-size:9px;font-weight:600;color:var(--text-muted);background:var(--ink-50);padding:0 4px;border-radius:3px;white-space:nowrap;z-index:2;';

    // Helper: get node center x and bottom y
    const nc = (id) => {
      const n = this.nodes.find(x => x.id === id);
      return { cx: n.x + n.w/2, top: n.y, bot: n.y + 44, left: n.x, right: n.x + n.w, w: n.w };
    };

    const connectors = [];
    let cid = 0;
    const vLine = (x, y1, y2) => {
      if (y2 <= y1) return;
      connectors.push(`<div style="position:absolute;left:${x-0.75}px;top:${y1}px;width:1.5px;height:${y2-y1}px;background:${lineColor};z-index:1;"></div>`);
    };
    const hLine = (x1, x2, y) => {
      const left = Math.min(x1, x2);
      const w = Math.abs(x2 - x1);
      connectors.push(`<div style="position:absolute;left:${left}px;top:${y-0.75}px;width:${w}px;height:1.5px;background:${lineColor};z-index:1;"></div>`);
    };
    const arrowDown = (x, y) => {
      connectors.push(`<div style="position:absolute;left:${x-4}px;top:${y-6}px;width:0;height:0;border-left:4px solid transparent;border-right:4px solid transparent;border-top:5px solid ${lineColor};z-index:1;"></div>`);
    };
    const label = (x, y, text) => {
      connectors.push(`<div style="${labelStyle}left:${x}px;top:${y}px;">${text}</div>`);
    };

    // 1. Start -> Greet
    {
      const a = nc('node-start'), b = nc('node-greet');
      vLine(a.cx, a.bot, b.top);
      arrowDown(a.cx, b.top);
    }
    // 2. Greet -> Identity
    {
      const a = nc('node-greet'), b = nc('node-identity');
      vLine(a.cx, a.bot, b.top);
      arrowDown(a.cx, b.top);
    }
    // 3. Identity -> Branch1
    {
      const a = nc('node-identity'), b = nc('node-branch1');
      vLine(a.cx, a.bot, b.top);
      arrowDown(a.cx, b.top);
    }

    // 4. Branch1 splits:
    //    Right (是) -> Need (down then right/center)
    //    Left (否/拒接) -> Hangup1
    {
      const br = nc('node-branch1');
      const hup = nc('node-hangup1');
      const need = nc('node-need');
      const branchY = br.bot;
      const mergeY = need.top - 20;

      // Left branch: from branch-left to hangup1
      const leftX = br.left; // go left to hangup column
      vLine(leftX, branchY, mergeY);
      hLine(leftX, hup.cx, mergeY);
      vLine(hup.cx, mergeY, hup.top);
      arrowDown(hup.cx, hup.top);
      label(leftX - 10, branchY + 18, '否/拒接');

      // Right branch (是): continue down main spine
      vLine(br.cx, branchY, need.top);
      arrowDown(br.cx, need.top);
      label(br.cx + 6, branchY + 8, '是');
    }

    // 5. Need -> Intent
    {
      const a = nc('node-need'), b = nc('node-intent');
      vLine(a.cx, a.bot, b.top);
      arrowDown(a.cx, b.top);
    }

    // 6. Intent splits into 3 branches:
    //    Left (反感) -> Objection
    //    Mid-left (低意向) -> Nurture
    //    Right (中/高意向) -> KB
    {
      const it = nc('node-intent');
      const obj = nc('node-obj');
      const nur = nc('node-nurture');
      const kb = nc('node-kb');
      const branchY = it.bot;
      const mergeY = nur.top - 20;

      // Draw horizontal bar
      const leftMost = obj.cx;
      const rightMost = kb.cx;
      const barY = branchY + 30;
      vLine(it.cx, branchY, barY);
      hLine(leftMost, rightMost, barY);

      // Down to each node
      vLine(obj.cx, barY, obj.top); arrowDown(obj.cx, obj.top);
      vLine(nur.cx, barY, nur.top); arrowDown(nur.cx, nur.top);
      vLine(kb.cx, barY, kb.top); arrowDown(kb.cx, kb.top);

      // Labels
      label(obj.cx - 14, branchY + 4, '反感');
      label(nur.cx - 16, branchY + 4, '低意向');
      label(kb.cx - 18, branchY + 4, '中/高意向');
    }

    // 7. Obj -> End? (hangup path) - goes down to end via converge
    //    Nurture -> End (hangup path)
    //    KB -> Extract (main path continues)
    {
      const obj = nc('node-obj');
      const nur = nc('node-nurture');
      const kb = nc('node-kb');
      const ext = nc('node-extract');
      const convergeY = ext.top - 20;

      // KB continues down main to Extract
      vLine(kb.cx, kb.bot, convergeY);
      // Need to get from kb.cx (right side) to ext.cx (center)
      // Actually kb is at x=380+75=455, ext is at 255+105=360
      // Let me route: kb -> down to convergeY -> horizontal to ext.cx -> down to ext
      hLine(kb.cx, ext.cx, convergeY);
      vLine(ext.cx, convergeY, ext.top);
      arrowDown(ext.cx, ext.top);

      // Obj and Nurture hangup paths: go down and eventually to end
      // Route them down to a hangup-converge line then to end
      // Actually let's route them: down past extract level, then across to end
      const endConvY = 1060; // above end node
      // From obj
      vLine(obj.cx, obj.bot, endConvY);
      // From nurture
      vLine(nur.cx, nur.bot, endConvY);
    }

    // 8. Extract -> Branch2
    {
      const a = nc('node-extract'), b = nc('node-branch2');
      vLine(a.cx, a.bot, b.top);
      arrowDown(a.cx, b.top);
    }

    // 9. Branch2 splits:
    //    Left (否) -> WeCom
    //    Right (是) -> Transfer
    {
      const br = nc('node-branch2');
      const wc = nc('node-wecom');
      const tr = nc('node-transfer');
      const branchY = br.bot;
      const mergeY = wc.top - 20;

      const barY = branchY + 25;
      vLine(br.cx, branchY, barY);
      hLine(wc.cx, tr.cx, barY);
      vLine(wc.cx, barY, wc.top); arrowDown(wc.cx, wc.top);
      vLine(tr.cx, barY, tr.top); arrowDown(tr.cx, tr.top);

      label(wc.cx - 4, branchY + 4, '否');
      label(tr.cx - 4, branchY + 4, '是');
    }

    // 10. All paths converge to End
    {
      const wc = nc('node-wecom');
      const tr = nc('node-transfer');
      const hup = nc('node-hangup1');
      const end = nc('node-end');
      const endBarY = end.top - 25;

      // WeCom -> down to endBar
      vLine(wc.cx, wc.bot, endBarY);
      // Transfer -> down to endBar, then across
      vLine(tr.cx, tr.bot, endBarY);
      // Hangup1 -> down to endBar (already routed down to endConvY=1060, extend to endBarY)
      // Actually let's route hangup1 and obj/nurture to end too
      // Already have vLine from hup1 down area; let me add from hup1.bot
      vLine(hup.cx, hup.bot, endBarY);

      // Horizontal bar to center
      const leftMost = Math.min(wc.cx, hup.cx);
      const rightMost = Math.max(tr.cx, end.cx);
      hLine(leftMost, rightMost, endBarY);
      vLine(end.cx, endBarY, end.top);
      arrowDown(end.cx, end.top);
    }

    return connectors.join('');
  },

  renderNode(n) {
    const t = this.nodeTypes[n.type];
    const isSelected = n.id === this.selectedNodeId;
    const isDiamond = t.diamond;
    const isPill = t.pill;

    const borderStyle = isSelected
      ? 'border:2px solid var(--brand-500);box-shadow:0 0 0 3px rgba(14,165,233,0.12),var(--shadow-sm);'
      : `border:1px solid var(--border-color);box-shadow:var(--shadow-xs);`;

    if (isDiamond) {
      // Diamond shape: wrapper at position, inner rotated div for diamond shape, counter-rotated text
      const size = 72;
      return `
        <div class="flow-node" data-node-id="${n.id}" onclick="FlowsView.selectNode('${n.id}')" style="
          position:absolute;left:${n.x}px;top:${n.y}px;width:${n.w}px;cursor:pointer;z-index:5;
        ">
          <div style="position:relative;width:${n.w}px;height:${size}px;display:flex;align-items:center;justify-content:center;">
            <div style="
              position:absolute;width:${size-10}px;height:${size-10}px;
              background:${t.colorBg};
              border:1.5px solid ${t.color};
              transform:rotate(45deg);
              border-radius:6px;
              ${isSelected ? 'box-shadow:0 0 0 3px rgba(14,165,233,0.12),var(--shadow-sm);border-color:var(--brand-500);border-width:2px;' : ''}
            "></div>
            <div style="position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:1px;text-align:center;">
              <i data-lucide="${t.icon}" style="width:13px;height:13px;color:${isSelected ? 'var(--brand-600)' : t.colorDark};"></i>
              <span style="font-size:10.5px;font-weight:700;color:var(--text-main);white-space:nowrap;">${n.title}</span>
              ${n.subtitle ? `<span style="font-size:9px;color:var(--text-muted);white-space:nowrap;">${n.subtitle}</span>` : ''}
            </div>
          </div>
        </div>
      `;
    }

    const borderRadius = isPill ? '9999px' : '8px';

    return `
      <div class="flow-node" data-node-id="${n.id}" onclick="FlowsView.selectNode('${n.id}')" style="
        position:absolute;left:${n.x}px;top:${n.y}px;width:${n.w}px;
        background:#fff;
        ${borderStyle}
        border-left:3px solid ${isSelected ? 'var(--brand-500)' : t.color};
        border-radius:${borderRadius};
        padding:8px 12px;
        cursor:pointer;
        z-index:5;
        transition:box-shadow 0.15s,border-color 0.15s;
      " onmouseover="if(!${isSelected}){this.style.boxShadow='var(--shadow-sm)';}" onmouseout="if(!${isSelected}){this.style.boxShadow='var(--shadow-xs)';}">
        <div style="display:flex;align-items:flex-start;gap:7px;">
          <div style="width:24px;height:24px;border-radius:var(--radius-sm);background:${t.colorBg};display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">
            <i data-lucide="${t.icon}" style="width:12px;height:12px;color:${isSelected ? 'var(--brand-600)' : t.colorDark};"></i>
          </div>
          <div style="flex:1;min-width:0;text-align:left;">
            <div style="font-size:11px;font-weight:700;color:var(--text-main);line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${n.title}</div>
            ${n.subtitle ? `<div style="font-size:9.5px;color:var(--text-secondary);line-height:1.4;margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${n.subtitle}</div>` : ''}
            ${n.id === 'node-transfer' ? `<div style="font-size:9px;color:var(--emerald-600);margin-top:2px;display:inline-flex;align-items:center;gap:2px;background:var(--emerald-50);padding:1px 5px;border-radius:3px;font-weight:600;"><i data-lucide="users" style="width:9px;height:9px;"></i>高意向队列</div>` : ''}
          </div>
        </div>
      </div>
    `;
  },

  renderPropertiesPanel() {
    const node = this.nodes.find(n => n.id === this.selectedNodeId);
    return `
      <div style="width:280px;flex-shrink:0;background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);display:flex;flex-direction:column;overflow:hidden;">
        <div style="padding:10px 12px;border-bottom:1px solid var(--border-subtle);flex-shrink:0;display:flex;align-items:center;justify-content:space-between;">
          <div style="font-size:12px;font-weight:700;color:var(--text-main);display:flex;align-items:center;gap:5px;">
            <i data-lucide="settings-2" style="width:12px;height:12px;color:var(--brand-500);"></i>
            节点属性
          </div>
          ${node ? `<span style="font-size:9px;color:var(--text-muted);font-variant-numeric:tabular-nums;">ID: ${node.id}</span>` : ''}
        </div>
        <div style="flex:1;overflow-y:auto;padding:0;">
          ${node ? this.renderNodeProperties(node) : this.renderEmptyProperties()}
        </div>
      </div>
    `;
  },

  renderEmptyProperties() {
    return `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 20px;text-align:center;height:100%;">
        <div style="width:48px;height:48px;border-radius:50%;background:var(--ink-50);display:flex;align-items:center;justify-content:center;margin-bottom:12px;">
          <i data-lucide="mouse-pointer-click" style="width:20px;height:20px;color:var(--text-muted);"></i>
        </div>
        <div style="font-size:12px;font-weight:600;color:var(--text-secondary);margin-bottom:4px;">选择一个节点查看属性</div>
        <div style="font-size:10.5px;color:var(--text-muted);line-height:1.5;">点击画布中的任意节点，可在此编辑话术内容、配置参数和高级选项</div>
      </div>
    `;
  },

  renderNodeProperties(node) {
    const t = this.nodeTypes[node.type];
    return `
      <!-- Node Info Header -->
      <div style="padding:12px;border-bottom:1px solid var(--border-subtle);background:${t.colorBg};">
        <div style="display:flex;align-items:center;gap:8px;">
          <div style="width:32px;height:32px;border-radius:var(--radius-md);background:#fff;border:1px solid ${t.color}30;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:var(--shadow-xs);">
            <i data-lucide="${t.icon}" style="width:15px;height:15px;color:${t.colorDark};"></i>
          </div>
          <div style="min-width:0;flex:1;">
            <div style="font-size:12px;font-weight:700;color:var(--text-main);">${node.title}</div>
            <div style="font-size:10px;color:${t.colorDark};font-weight:600;margin-top:1px;">${t.label}</div>
          </div>
        </div>
      </div>

      <!-- Basic Section -->
      <div style="padding:12px;border-bottom:1px solid var(--border-subtle);">
        <div style="font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">基础配置</div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <div>
            <label style="font-size:10.5px;color:var(--text-secondary);display:block;margin-bottom:3px;font-weight:500;">节点名称</label>
            <input type="text" value="${node.title}" style="width:100%;height:28px;padding:0 8px;font-size:11.5px;border:1px solid var(--border-color);border-radius:var(--radius-sm);background:#fff;outline:none;color:var(--text-main);" onfocus="this.style.borderColor='var(--brand-500)';this.style.boxShadow='0 0 0 2px rgba(14,165,233,0.1)'" onblur="this.style.borderColor='var(--border-color)';this.style.boxShadow='none'">
          </div>
          <div style="display:flex;gap:6px;">
            <div style="flex:1;">
              <label style="font-size:10.5px;color:var(--text-secondary);display:block;margin-bottom:3px;font-weight:500;">超时(秒)</label>
              <input type="number" value="8" style="width:100%;height:28px;padding:0 8px;font-size:11.5px;border:1px solid var(--border-color);border-radius:var(--radius-sm);background:#fff;outline:none;color:var(--text-main);font-variant-numeric:tabular-nums;">
            </div>
            <div style="flex:1;">
              <label style="font-size:10.5px;color:var(--text-secondary);display:block;margin-bottom:3px;font-weight:500;">重试次数</label>
              <input type="number" value="2" style="width:100%;height:28px;padding:0 8px;font-size:11.5px;border:1px solid var(--border-color);border-radius:var(--radius-sm);background:#fff;outline:none;color:var(--text-main);font-variant-numeric:tabular-nums;">
            </div>
          </div>
        </div>
      </div>

      <!-- Content Section -->
      <div style="padding:12px;border-bottom:1px solid var(--border-subtle);">
        <div style="font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">内容配置</div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          ${this.renderNodeContentFields(node)}
        </div>
      </div>

      <!-- Advanced Section -->
      <div style="padding:12px;">
        <div style="font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">高级选项</div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <div style="display:flex;align-items:center;justify-content:space-between;padding:7px 10px;background:var(--ink-50);border-radius:var(--radius-sm);">
            <div>
              <div style="font-size:11px;font-weight:500;color:var(--text-main);">允许客户打断</div>
              <div style="font-size:9.5px;color:var(--text-muted);margin-top:1px;">VAD检测到客户说话时中断播报</div>
            </div>
            <div onclick="FlowsView.toggleInterrupt(this)" style="width:32px;height:18px;border-radius:9px;background:${this.interruptEnabled ? 'var(--brand-500)' : 'var(--ink-300)'};position:relative;cursor:pointer;transition:background 0.2s;flex-shrink:0;">
              <div style="position:absolute;top:2px;${this.interruptEnabled ? 'right:2px;' : 'left:2px;'}width:14px;height:14px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,0.15);transition:right 0.2s,left 0.2s;"></div>
            </div>
          </div>
          <div>
            <label style="font-size:10.5px;color:var(--text-secondary);display:block;margin-bottom:3px;font-weight:500;">失败处理策略</label>
            <select style="width:100%;height:28px;padding:0 8px;font-size:11.5px;border:1px solid var(--border-color);border-radius:var(--radius-sm);background:#fff;outline:none;color:var(--text-main);">
              <option>重试后进入下一节点</option>
              <option>直接转人工</option>
              <option>礼貌挂机</option>
              <option>跳转至指定节点</option>
            </select>
          </div>
          <div>
            <label style="font-size:10.5px;color:var(--text-secondary);display:block;margin-bottom:3px;font-weight:500;">备注说明</label>
            <textarea placeholder="添加节点备注（仅内部可见）" style="width:100%;height:52px;padding:6px 8px;font-size:11px;border:1px solid var(--border-color);border-radius:var(--radius-sm);background:#fff;outline:none;color:var(--text-main);resize:none;font-family:var(--font-sans);line-height:1.5;"></textarea>
          </div>
        </div>
      </div>

      <!-- Delete button -->
      <div style="padding:10px 12px;border-top:1px solid var(--border-subtle);flex-shrink:0;">
        <button class="btn btn-sm" style="width:100%;height:28px;font-size:11px;color:var(--rose-600);background:var(--rose-50);border:1px solid var(--rose-100);justify-content:center;gap:4px;" onclick="App.showToast('节点删除功能演示中','warning')">
          <i data-lucide="trash-2" style="width:11px;height:11px;"></i>删除此节点
        </button>
      </div>
    `;
  },

  renderNodeContentFields(node) {
    switch(node.type) {
      case 'say':
      case 'wecom':
      case 'nurture':
      case 'obj':
        return `
          <div>
            <label style="font-size:10.5px;color:var(--text-secondary);display:block;margin-bottom:3px;font-weight:500;">话术内容</label>
            <textarea style="width:100%;height:80px;padding:7px 9px;font-size:11px;border:1px solid var(--border-color);border-radius:var(--radius-sm);background:#fff;outline:none;color:var(--text-main);resize:vertical;font-family:var(--font-sans);line-height:1.6;" onfocus="this.style.borderColor='var(--brand-500)';this.style.boxShadow='0 0 0 2px rgba(14,165,233,0.1)'" onblur="this.style.borderColor='var(--border-color)';this.style.boxShadow='none'">${node.type === 'say' ? '您好{name}，我是知缘AI红娘助理，之前您在我们平台留了交友意向，今天特意给您同步个好消息...' : node.type === 'wecom' ? '已为您匹配到3位高契合度嘉宾，请添加红娘企微查看完整资料和照片。' : node.type === 'nurture' ? '记录客户意向等级为"低"，加入培育池，30天后再次回访。' : '非常理解您的顾虑，很多优秀嘉宾一开始也有类似想法...'}</textarea>
            <div style="display:flex;justify-content:space-between;margin-top:3px;">
              <span style="font-size:9.5px;color:var(--text-muted);">支持 {"{"}变量{"}"} 插值 · {"{"}name{"}{"}{"}{"}"} {"{"}city{"}{"}"} {"{"}age{"}{"}"}</span>
              <span style="font-size:9.5px;color:var(--amber-600);font-weight:600;">建议≤90字</span>
            </div>
          </div>
        `;
      case 'question':
        return `
          <div>
            <label style="font-size:10.5px;color:var(--text-secondary);display:block;margin-bottom:3px;font-weight:500;">问题文本</label>
            <textarea style="width:100%;height:60px;padding:7px 9px;font-size:11px;border:1px solid var(--border-color);border-radius:var(--radius-sm);background:#fff;outline:none;color:var(--text-main);resize:vertical;font-family:var(--font-sans);line-height:1.6;" onfocus="this.style.borderColor='var(--brand-500)';this.style.boxShadow='0 0 0 2px rgba(14,165,233,0.1)'" onblur="this.style.borderColor='var(--border-color)';this.style.boxShadow='none'">${node.id === 'node-identity' ? '请问是{name}本人接听电话吗？' : '方便跟我说下您的择偶条件吗？比如年龄范围、所在城市、学历要求这些~'}</textarea>
          </div>
          <div>
            <label style="font-size:10.5px;color:var(--text-secondary);display:block;margin-bottom:3px;font-weight:500;">变量绑定</label>
            <select style="width:100%;height:28px;padding:0 8px;font-size:11.5px;border:1px solid var(--border-color);border-radius:var(--radius-sm);background:#fff;outline:none;color:var(--text-main);">
              <option>不绑定（仅判断意图）</option>
              <option selected>intent.confirmed (确认度)</option>
              <option>slots.age</option>
              <option>slots.city</option>
            </select>
          </div>
        `;
      case 'condition':
        return `
          <div>
            <label style="font-size:10.5px;color:var(--text-secondary);display:block;margin-bottom:3px;font-weight:500;">条件表达式</label>
            <input type="text" value="${node.id === 'node-branch1' ? 'slots.identity_confirmed == true' : 'intent.score >= 85'}" style="width:100%;height:28px;padding:0 8px;font-size:11px;border:1px solid var(--border-color);border-radius:var(--radius-sm);background:var(--ink-50);outline:none;color:var(--text-main);font-family:var(--font-mono);">
          </div>
          <div style="display:flex;gap:6px;">
            <div style="flex:1;padding:7px 8px;background:var(--emerald-50);border:1px solid var(--emerald-200);border-radius:var(--radius-sm);">
              <div style="font-size:9.5px;color:var(--emerald-700);font-weight:600;margin-bottom:3px;">是 (True)</div>
              <div style="font-size:9px;color:var(--text-muted);流向：下一节点</div>
            </div>
            <div style="flex:1;padding:7px 8px;background:var(--rose-50);border:1px solid var(--rose-200);border-radius:var(--radius-sm);">
              <div style="font-size:9.5px;color:var(--rose-700);font-weight:600;margin-bottom:3px;">否 (False)</div>
              <div style="font-size:9px;color:var(--text-muted);流向：分支节点</div>
            </div>
          </div>
        `;
      case 'intent':
        return `
          <div>
            <label style="font-size:10.5px;color:var(--text-secondary);display:block;margin-bottom:3px;font-weight:500;">识别模型</label>
            <select style="width:100%;height:28px;padding:0 8px;font-size:11.5px;border:1px solid var(--border-color);border-radius:var(--radius-sm);background:#fff;outline:none;color:var(--text-main);">
              <option selected>intent-v3 (婚恋场景精调)</option>
              <option>intent-v2 (通用)</option>
            </select>
          </div>
          <div>
            <label style="font-size:10.5px;color:var(--text-secondary);display:block;margin-bottom:4px;font-weight:500;">意图分支</label>
            <div style="display:flex;flex-direction:column;gap:3px;">
              ${['高意向 (score≥85)','中意向 (60-84)','低意向 (30-59)','反感/拒绝 (<30)'].map((lbl,i) => `
                <div style="display:flex;align-items:center;gap:6px;padding:5px 8px;background:var(--ink-50);border-radius:var(--radius-sm);font-size:10.5px;color:var(--text-secondary);">
                  <span style="width:6px;height:6px;border-radius:50%;background:${['var(--emerald-500)','var(--brand-500)','var(--amber-500)','var(--rose-500)'][i]};flex-shrink:0;"></span>
                  ${lbl}
                </div>
              `).join('')}
            </div>
          </div>
        `;
      case 'knowledge':
        return `
          <div>
            <label style="font-size:10.5px;color:var(--text-secondary);display:block;margin-bottom:3px;font-weight:500;">绑定知识库</label>
            <select style="width:100%;height:28px;padding:0 8px;font-size:11.5px;border:1px solid var(--border-color);border-radius:var(--radius-sm);background:#fff;outline:none;color:var(--text-main);">
              <option selected>知缘婚恋FAQ库 (1,420条)</option>
              <option>嘉宾资料向量库 (8,600条)</option>
              <option>服务价格与套餐说明</option>
            </select>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;padding:7px 10px;background:var(--ink-50);border-radius:var(--radius-sm);">
            <span style="font-size:10.5px;color:var(--text-secondary);">无结果时兜底话术</span>
            <span style="font-size:9.5px;color:var(--brand-600);font-weight:600;">已配置</span>
          </div>
        `;
      case 'extract':
        return `
          <div>
            <label style="font-size:10.5px;color:var(--text-secondary);display:block;margin-bottom:4px;font-weight:500;">提取字段</label>
            <div style="display:flex;flex-wrap:wrap;gap:4px;">
              ${['年龄','城市','学历','收入','房车','婚姻状况','职业'].map((f,i) => `
                <span style="font-size:10px;padding:2px 7px;border-radius:var(--radius-sm);background:${i<5?'var(--brand-50);color:var(--brand-700);border:1px solid var(--brand-200);':'var(--ink-100);color:var(--text-muted);border:1px solid var(--border-color);'};font-weight:600;">${f}${i<5?' ✓':''}</span>
              `).join('')}
            </div>
          </div>
          <div>
            <label style="font-size:10.5px;color:var(--text-secondary);display:block;margin-bottom:3px;font-weight:500;">写入目标</label>
            <select style="width:100%;height:28px;padding:0 8px;font-size:11.5px;border:1px solid var(--border-color);border-radius:var(--radius-sm);background:#fff;outline:none;color:var(--text-main);">
              <option selected>CRM 客户档案</option>
              <option>企微客户备注</option>
            </select>
          </div>
        `;
      case 'transfer':
        return `
          <div>
            <label style="font-size:10.5px;color:var(--text-secondary);display:block;margin-bottom:3px;font-weight:500;">转人工队列</label>
            <select style="width:100%;height:28px;padding:0 8px;font-size:11.5px;border:1px solid var(--border-color);border-radius:var(--radius-sm);background:#fff;outline:none;color:var(--text-main);">
              <option selected>高意向队列 (金牌红娘)</option>
              <option>普通咨询队列</option>
              <option>售后投诉队列</option>
            </select>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;padding:7px 10px;background:var(--ink-50);border-radius:var(--radius-sm);">
            <div>
              <div style="font-size:11px;color:var(--text-main);font-weight:500;">通话摘要传递</div>
              <div style="font-size:9.5px;color:var(--text-muted);margin-top:1px;">转接时同步AI对话摘要给红娘</div>
            </div>
            <div style="width:32px;height:18px;border-radius:9px;background:var(--emerald-500);position:relative;cursor:pointer;flex-shrink:0;">
              <div style="position:absolute;top:2px;right:2px;width:14px;height:14px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,0.15);"></div>
            </div>
          </div>
          <div>
            <label style="font-size:10.5px;color:var(--text-secondary);display:block;margin-bottom:3px;font-weight:500;">转接等待话术</label>
            <input type="text" value="正在为您转接金牌红娘，请稍等..." style="width:100%;height:28px;padding:0 8px;font-size:11px;border:1px solid var(--border-color);border-radius:var(--radius-sm);background:#fff;outline:none;color:var(--text-main);">
          </div>
        `;
      case 'hangup':
        return `
          <div>
            <label style="font-size:10.5px;color:var(--text-secondary);display:block;margin-bottom:3px;font-weight:500;">挂机前话术</label>
            <textarea style="width:100%;height:52px;padding:7px 9px;font-size:11px;border:1px solid var(--border-color);border-radius:var(--radius-sm);background:#fff;outline:none;color:var(--text-main);resize:vertical;font-family:var(--font-sans);line-height:1.5;" onfocus="this.style.borderColor='var(--brand-500)';this.style.boxShadow='0 0 0 2px rgba(14,165,233,0.1)'" onblur="this.style.borderColor='var(--border-color)';this.style.boxShadow='none'">好的，不打扰您了，祝您生活愉快，再见！</textarea>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;padding:7px 10px;background:var(--rose-50);border:1px solid var(--rose-200);border-radius:var(--radius-sm);">
            <span style="font-size:10.5px;color:var(--rose-700);">挂机后标记客户状态</span>
            <span style="font-size:9.5px;color:var(--rose-600);font-weight:600;">无意向/拒绝</span>
          </div>
        `;
      case 'start':
        return `
          <div style="padding:10px;background:var(--emerald-50);border:1px solid var(--emerald-200);border-radius:var(--radius-sm);font-size:10.5px;color:var(--emerald-700);line-height:1.5;">
            <i data-lucide="info" style="width:11px;height:11px;display:inline;vertical-align:-1px;"></i>
            来电接入为流程入口节点，由外呼任务触发，无需配置话术内容。
          </div>
          <div>
            <label style="font-size:10.5px;color:var(--text-secondary);display:block;margin-bottom:3px;font-weight:500;">触发方式</label>
            <select style="width:100%;height:28px;padding:0 8px;font-size:11.5px;border:1px solid var(--border-color);border-radius:var(--radius-sm);background:#fff;outline:none;color:var(--text-main);">
              <option selected>外呼任务自动触发</option>
              <option>API 调用触发</option>
              <option>定时触发</option>
            </select>
          </div>
        `;
      case 'end':
        return `
          <div style="padding:10px;background:var(--ink-50);border:1px solid var(--border-color);border-radius:var(--radius-sm);font-size:10.5px;color:var(--text-secondary);line-height:1.5;">
            <i data-lucide="info" style="width:11px;height:11px;display:inline;vertical-align:-1px;"></i>
            流程结束节点，通话完成后自动记录通话结果、更新客户标签、触发后续工作流。
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;padding:7px 10px;background:var(--ink-50);border-radius:var(--radius-sm);">
            <span style="font-size:10.5px;color:var(--text-secondary);">自动写回CRM</span>
            <span style="font-size:9.5px;color:var(--emerald-600);font-weight:600;">已开启</span>
          </div>
        `;
      default:
        return `<div style="font-size:11px;color:var(--text-muted);padding:8px 0;">此节点类型暂无可配置内容</div>`;
    }
  },

  renderValidationDrawer() {
    const errors = this.validationIssues.filter(i => i.severity === 'error').length;
    const warnings = this.validationIssues.filter(i => i.severity === 'warning').length;
    const infos = this.validationIssues.filter(i => i.severity === 'info').length;
    const total = this.validationIssues.length;

    return `
      <div id="validation-drawer" style="margin-top:${this.validationOpen ? 'var(--content-gap)' : '6px'};background:var(--bg-card);border:1px solid ${warnings > 0 ? 'var(--amber-200)' : 'var(--border-color)'};border-radius:var(--radius-lg);flex-shrink:0;overflow:hidden;transition:all 0.25s ease;">
        <!-- Drawer Header (always visible) -->
        <div onclick="FlowsView.toggleValidation()" style="display:flex;align-items:center;gap:10px;padding:8px 14px;cursor:pointer;height:34px;">
          <i data-lucide="chevron-${this.validationOpen ? 'down' : 'right'}" style="width:13px;height:13px;color:var(--text-muted);transition:transform 0.2s;"></i>
          <div style="font-size:12px;font-weight:700;color:var(--text-main);display:flex;align-items:center;gap:5px;">
            <i data-lucide="alert-triangle" style="width:13px;height:13px;color:${warnings > 0 ? 'var(--amber-500)' : 'var(--emerald-500)'};"></i>
            流程校验结果
          </div>
          <div style="display:flex;align-items:center;gap:6px;">
            ${errors > 0 ? `<span style="font-size:10px;padding:1px 6px;border-radius:var(--radius-sm);background:var(--rose-50);color:var(--rose-600);font-weight:600;">${errors} 错误</span>` : ''}
            ${warnings > 0 ? `<span style="font-size:10px;padding:1px 6px;border-radius:var(--radius-sm);background:var(--amber-50);color:var(--amber-600);font-weight:600;">${warnings} 警告</span>` : ''}
            ${infos > 0 ? `<span style="font-size:10px;padding:1px 6px;border-radius:var(--radius-sm);background:var(--brand-50);color:var(--brand-600);font-weight:600;">${infos} 提示</span>` : ''}
          </div>
          <div style="flex:1;"></div>
          <span style="font-size:10px;color:var(--text-muted);">${this.validationOpen ? '点击收起' : '点击展开详情'}</span>
        </div>
        <!-- Drawer Body (collapsible) -->
        <div style="display:${this.validationOpen ? 'block' : 'none'};border-top:1px solid var(--border-subtle);padding:10px 14px;max-height:200px;overflow-y:auto;">
          ${total === 0 ? `
            <div style="display:flex;align-items:center;gap:8px;padding:12px;background:var(--emerald-50);border-radius:var(--radius-sm);color:var(--emerald-700);font-size:11.5px;">
              <i data-lucide="check-circle-2" style="width:16px;height:16px;"></i>
              校验通过，当前流程无错误和警告，可安全发布。
            </div>
          ` : `
            <div style="display:flex;flex-direction:column;gap:4px;">
              ${this.validationIssues.map(issue => {
                const sevIcon = issue.severity === 'error' ? 'x-circle' : issue.severity === 'warning' ? 'alert-triangle' : 'info';
                const sevColor = issue.severity === 'error' ? 'var(--rose-500)' : issue.severity === 'warning' ? 'var(--amber-500)' : 'var(--brand-500)';
                const sevBg = issue.severity === 'error' ? 'var(--rose-50)' : issue.severity === 'warning' ? 'var(--amber-50)' : 'var(--brand-50)';
                const node = this.nodes.find(n => n.id === issue.nodeId);
                return `
                  <div style="display:flex;align-items:flex-start;gap:8px;padding:8px 10px;background:${sevBg};border-radius:var(--radius-sm);cursor:pointer;" onclick="FlowsView.selectNode('${issue.nodeId}')">
                    <i data-lucide="${sevIcon}" style="width:14px;height:14px;color:${sevColor};flex-shrink:0;margin-top:1px;"></i>
                    <div style="flex:1;min-width:0;">
                      <div style="font-size:11px;color:var(--text-main);line-height:1.5;">${issue.message}</div>
                      ${node ? `<div style="font-size:9.5px;color:var(--text-muted);margin-top:2px;display:inline-flex;align-items:center;gap:3px;"><i data-lucide="box" style="width:10px;height:10px;"></i>节点: ${node.title} <i data-lucide="arrow-right" style="width:9px;height:9px;"></i> 点击定位</div>` : ''}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>
      </div>
    `;
  },

  // ── Actions ──

  selectNode(nodeId) {
    this.selectedNodeId = nodeId;
    App.refreshCurrentView();
  },

  switchFlow(flowId) {
    this.activeFlowId = flowId;
    this.hasUnsavedChanges = false;
    App.showToast('已切换到流程', 'success');
    App.refreshCurrentView();
  },

  createFlow() {
    App.showModal({
      title: '新建流程',
      content: `
        <div style="display:flex;flex-direction:column;gap:10px;">
          <div>
            <label style="font-size:11px;color:var(--text-secondary);display:block;margin-bottom:4px;font-weight:500;">流程名称</label>
            <input type="text" id="new-flow-name" placeholder="例如：周末活动邀约" autofocus style="width:100%;height:32px;padding:0 10px;font-size:12px;border:1px solid var(--border-color);border-radius:var(--radius-md);background:var(--ink-50);outline:none;">
          </div>
          <div>
            <label style="font-size:11px;color:var(--text-secondary);display:block;margin-bottom:4px;font-weight:500;">业务场景</label>
            <select style="width:100%;height:32px;padding:0 10px;font-size:12px;border:1px solid var(--border-color);border-radius:var(--radius-md);background:#fff;outline:none;">
              <option>婚恋交友-首触</option>
              <option>婚恋交友-召回</option>
              <option>婚恋交友-活动</option>
              <option>通用-调研</option>
            </select>
          </div>
        </div>
      `,
      confirmText: '创建流程',
      onConfirm: () => {
        const name = document.getElementById('new-flow-name')?.value || '新流程';
        App.showToast(`流程"${name}"已创建，开始编排吧`, 'success');
      }
    });
  },

  saveDraft() {
    this.hasUnsavedChanges = false;
    App.showToast('草稿已保存', 'success');
    App.refreshCurrentView();
  },

  validateFlow() {
    this.validationOpen = true;
    App.showToast(`校验完成：发现 ${this.validationIssues.length} 个问题（${this.validationIssues.filter(i=>i.severity==='warning').length} 警告）`, 'warning');
    App.refreshCurrentView();
  },

  testRun() {
    App.showToast('正在启动沙盒测试...', 'info');
    App.navigate('campaigns');
    setTimeout(() => {
      if (typeof openLiveSandbox === 'function') {
        const firstRunning = (window.AppState && window.AppState.campaigns) ? window.AppState.campaigns.find(c => c.status === 'running') : null;
        if (firstRunning) {
          openLiveSandbox(firstRunning.id);
        }
      }
    }, 400);
  },

  publishVersion() {
    App.showModal({
      title: '发布新版本',
      content: `
        <div style="display:flex;flex-direction:column;gap:10px;">
          <div style="padding:10px;background:var(--brand-50);border-radius:var(--radius-sm);font-size:11px;color:var(--brand-700);line-height:1.5;">
            <i data-lucide="info" style="width:12px;height:12px;display:inline;vertical-align:-1px;"></i>
            当前最新版本 <b>v1.2.3</b>（已发布），发布后将升级为 <b>v1.2.4</b>
          </div>
          <div>
            <label style="font-size:11px;color:var(--text-secondary);display:block;margin-bottom:4px;font-weight:500;">版本说明</label>
            <textarea id="publish-notes" placeholder="描述本次更新内容，例如：优化开场话术、新增房车字段提取" style="width:100%;height:80px;padding:8px 10px;font-size:12px;border:1px solid var(--border-color);border-radius:var(--radius-md);background:var(--ink-50);outline:none;resize:vertical;font-family:var(--font-sans);line-height:1.5;"></textarea>
          </div>
          <div style="display:flex;gap:8px;align-items:center;">
            <label style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--text-secondary);cursor:pointer;">
              <input type="checkbox" checked style="accent-color:var(--brand-500);width:13px;height:13px;">
              发布后立即灰度10%流量
            </label>
          </div>
        </div>
      `,
      confirmText: '确认发布 v1.2.4',
      onConfirm: () => {
        App.showToast('v1.2.4 已发布', 'success');
      }
    });
  },

  showVersionHistory() {
    const versions = [
      { ver:'v1.2.3', date:'2026-08-20 14:32', author:'张运营', notes:'优化开场话术，新增房车字段提取', current:true },
      { ver:'v1.2.2', date:'2026-08-18 10:15', author:'李产品', notes:'修复异议处理节点跳转bug', current:false },
      { ver:'v1.2.1', date:'2026-08-15 16:48', author:'张运营', notes:'调整意图识别阈值从80到85', current:false }
    ];
    App.showModal({
      title: '版本历史',
      content: `
        <div style="display:flex;flex-direction:column;gap:6px;max-height:320px;overflow-y:auto;">
          ${versions.map(v => `
            <div style="padding:10px 12px;border-radius:var(--radius-md);border:1px solid ${v.current ? 'var(--brand-200)' : 'var(--border-color)'};background:${v.current ? 'var(--brand-50)' : 'var(--ink-50)'};">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
                <div style="display:flex;align-items:center;gap:6px;">
                  <span style="font-size:12px;font-weight:700;color:${v.current ? 'var(--brand-700)' : 'var(--text-main)'};">${v.ver}</span>
                  ${v.current ? '<span style="font-size:9px;padding:1px 6px;border-radius:3px;background:var(--emerald-500);color:#fff;font-weight:600;">当前版本</span>' : ''}
                </div>
                <span style="font-size:10px;color:var(--text-muted);font-variant-numeric:tabular-nums;">${v.date}</span>
              </div>
              <div style="font-size:10.5px;color:var(--text-secondary);margin-bottom:3px;">${v.notes}</div>
              <div style="font-size:9.5px;color:var(--text-muted);">发布人：${v.author}</div>
              ${!v.current ? `
                <div style="display:flex;gap:4px;margin-top:6px;">
                  <button class="btn btn-ghost btn-sm" style="height:24px;padding:0 8px;font-size:10px;" onclick="App.showToast('版本预览功能演示中','info');App.closeModal()">查看差异</button>
                  <button class="btn btn-outline btn-sm" style="height:24px;padding:0 8px;font-size:10px;" onclick="App.showToast('已回滚到${v.ver}','warning');App.closeModal()">回滚到此版本</button>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      `,
      confirmText: '关闭'
    });
  },

  zoomIn() {
    if (this.zoom < 200) {
      this.zoom += 10;
      App.showToast(`缩放：${this.zoom}%`, 'info');
      App.refreshCurrentView();
    }
  },

  zoomOut() {
    if (this.zoom > 50) {
      this.zoom -= 10;
      App.showToast(`缩放：${this.zoom}%`, 'info');
      App.refreshCurrentView();
    }
  },

  resetZoom() {
    this.zoom = 100;
    App.showToast('已重置为100%', 'info');
    App.refreshCurrentView();
  },

  fitView() {
    this.zoom = 90;
    App.showToast('已适应视图', 'info');
    App.refreshCurrentView();
  },

  toggleSnap() {
    this.nodeSnapEnabled = !this.nodeSnapEnabled;
    App.showToast(`节点吸附已${this.nodeSnapEnabled ? '开启' : '关闭'}`, 'info');
    App.refreshCurrentView();
  },

  toggleValidation() {
    this.validationOpen = !this.validationOpen;
    App.refreshCurrentView();
  },

  toggleInterrupt(el) {
    this.interruptEnabled = !this.interruptEnabled;
    App.showToast(`允许打断已${this.interruptEnabled ? '开启' : '关闭'}`, this.interruptEnabled ? 'success' : 'info');
    App.refreshCurrentView();
  },

  editFlowName(container) {
    const display = document.getElementById('flow-name-display');
    if (!display) return;
    const currentName = display.textContent.replace('流程', '');
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentName;
    input.style.cssText = 'font-size:13px;font-weight:700;color:var(--text-main);border:1px solid var(--brand-500);border-radius:var(--radius-sm);padding:2px 8px;outline:none;width:200px;background:#fff;box-shadow:0 0 0 2px rgba(14,165,233,0.1);';
    display.style.display = 'none';
    display.parentElement.insertBefore(input, display);
    input.focus();
    input.select();
    const commit = () => {
      const newName = input.value.trim() || currentName;
      display.textContent = newName + '流程';
      display.style.display = '';
      input.remove();
      this.hasUnsavedChanges = true;
      App.showToast(`流程名称已更新为"${newName}流程"`, 'info');
    };
    input.addEventListener('blur', commit);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); input.blur(); }
      if (e.key === 'Escape') { input.value = currentName; input.blur(); }
    });
  }
};

window.FlowsView = FlowsView;
