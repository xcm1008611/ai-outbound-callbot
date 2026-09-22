// View: Scoring (评分规则版本) - 评分维度·阈值分组·命中规则·版本发布回滚

// ── State ──────────────────────────────────────────────────
let scoringActiveTab = 'dimensions';
let scoringPublishMode = false;
let scoringPublishNote = '';

// ── Mock Data ──────────────────────────────────────────────

const CURRENT_VERSION = {
  version: 'v3.2',
  publisher: '王主管',
  publishTime: '2026-08-15 14:30',
  note: '优化异议处理权重，新增"提供手机号"加分规则',
  status: 'current'
};

const VERSION_HISTORY = [
  { version:'v3.2', publisher:'王主管', publishTime:'2026-08-15 14:30', note:'优化异议处理权重，新增"提供手机号"加分规则', status:'current' },
  { version:'v3.1', publisher:'李经理', publishTime:'2026-08-10 09:15', note:'调整高意向阈值从80分提升至85分，新增情绪正向度维度', status:'history' },
  { version:'v3.0', publisher:'王主管', publishTime:'2026-08-01 16:45', note:'评分体系大版本重构，引入5维度加权模型', status:'history' },
  { version:'v2.5', publisher:'张总监', publishTime:'2026-07-20 11:00', note:'新增"我有对象了"直接无意向规则，修复连续轮次扣分bug', status:'history' },
];

const SCORING_DIMENSIONS = [
  { id:'D01', name:'意向表达明确度', weight:30, color:'var(--brand-500)', colorBg:'var(--brand-50)', desc:'评估客户在对话中是否明确表达了解意愿或进一步接触的意向', keywords:['想了解','加微信','怎么收费','可以看看','感兴趣','发资料'], enabled:true },
  { id:'D02', name:'信息完整度', weight:20, color:'var(--blue-500)', colorBg:'var(--blue-50)', desc:'客户是否主动提供个人基本信息（年龄、城市、职业、择偶要求等）', keywords:['年龄','城市','职业','择偶要求','收入','学历'], enabled:true },
  { id:'D03', name:'互动积极度', weight:20, color:'var(--violet-500)', colorBg:'var(--violet-50)', desc:'基于对话轮次、回复速度、反问次数等指标评估客户参与度', keywords:['对话轮次','回复时长','反问次数','主动提问','延续话题'], enabled:true },
  { id:'D04', name:'情绪正向度', weight:15, color:'var(--emerald-500)', colorBg:'var(--emerald-50)', desc:'识别客户语气中的正向情绪信号，如笑声、感谢、愉快语气词', keywords:['语气词','笑声','感谢','开心','认同','赞美'], enabled:true },
  { id:'D05', name:'异议处理结果', weight:15, color:'var(--amber-500)', colorBg:'var(--amber-50)', desc:'评估AI坐席对客户疑虑/异议的化解效果，以及客户的最终态度', keywords:['成功化解','未解决','明确拒绝','犹豫','考虑一下','再说吧'], enabled:true },
];

const INTENTION_LEVELS = [
  { key:'high', name:'高意向', min:85, max:100, color:'var(--emerald-600)', bg:'var(--emerald-50)', border:'var(--emerald-200)', barBg:'var(--emerald-500)', action:'立即转红娘', actionDesc:'优先分配资深红娘1对1跟进', count:142, icon:'heart-handshake' },
  { key:'medium', name:'中意向', min:60, max:84, color:'var(--brand-600)', bg:'var(--brand-50)', border:'var(--brand-200)', barBg:'var(--brand-500)', action:'继续培育', actionDesc:'加入培育池，AI定期触达升温', count:386, icon:'user-check' },
  { key:'low', name:'低意向', min:40, max:59, color:'var(--amber-600)', bg:'var(--amber-50)', border:'var(--amber-200)', barBg:'var(--amber-500)', action:'二次跟进', actionDesc:'标记低意向，7天后安排二次外呼', count:521, icon:'user-minus' },
  { key:'none', name:'无意向', min:0, max:39, color:'var(--rose-600)', bg:'var(--rose-50)', border:'var(--rose-200)', barBg:'var(--rose-500)', action:'加入黑名单', actionDesc:'标记无意向，不再主动外呼', count:218, icon:'user-x' },
];

const HIT_RULES = [
  { id:'HR01', name:'明确说"加微信"', condition:'客户对话中出现"加微信/加个微信/微信聊"等表达', score:20, scoreType:'add', scene:'意向表达', enabled:true },
  { id:'HR02', name:'明确拒绝话术', condition:'客户说"不需要/不要再打/别打了/没兴趣"', score:0, scoreType:'reject', scene:'异议识别', enabled:true },
  { id:'HR03', name:'主动问价格', condition:'客户主动询问收费标准、会员价格、服务费用', score:15, scoreType:'add', scene:'意向表达', enabled:true },
  { id:'HR04', name:'提供手机号', condition:'客户主动提供或确认手机号码', score:25, scoreType:'add', scene:'信息提供', enabled:true },
  { id:'HR05', name:'连续敷衍回应', condition:'连续3轮以上仅以"嗯/哦/啊/好"等单字回应', score:-10, scoreType:'sub', scene:'互动质量', enabled:true },
  { id:'HR06', name:'询问对方条件', condition:'客户主动询问匹配对象的条件、照片、资料', score:10, scoreType:'add', scene:'意向表达', enabled:true },
  { id:'HR07', name:'已有对象声明', condition:'客户提及"我有对象了/我结婚了/我已经有男/女朋友了"', score:0, scoreType:'reject', scene:'异议识别', enabled:true },
  { id:'HR08', name:'长通话无拒绝', condition:'通话时长>3分钟且未出现拒绝类话术', score:15, scoreType:'add', scene:'互动质量', enabled:false },
];

// ── Status Helpers ─────────────────────────────────────────

function ruleStatusBadge(enabled) {
  if (enabled) {
    return '<span style="display:inline-flex;align-items:center;gap:3px;padding:1px 6px;border-radius:var(--radius-sm);font-size:10.5px;font-weight:500;background:var(--emerald-50);color:var(--emerald-700);white-space:nowrap;"><span style="width:5px;height:5px;border-radius:50%;background:var(--emerald-500);flex-shrink:0;"></span>启用</span>';
  }
  return '<span style="display:inline-flex;align-items:center;gap:3px;padding:1px 6px;border-radius:var(--radius-sm);font-size:10.5px;font-weight:500;background:var(--ink-100);color:var(--text-muted);white-space:nowrap;"><span style="width:5px;height:5px;border-radius:50%;background:var(--ink-400);flex-shrink:0;"></span>停用</span>';
}

function versionStatusBadge(status) {
  if (status === 'current') {
    return '<span style="display:inline-flex;align-items:center;gap:3px;padding:1px 7px;border-radius:var(--radius-sm);font-size:10.5px;font-weight:600;background:var(--emerald-50);color:var(--emerald-700);white-space:nowrap;"><span style="width:5px;height:5px;border-radius:50%;background:var(--emerald-500);flex-shrink:0;"></span>当前版本</span>';
  }
  return '<span style="display:inline-flex;align-items:center;padding:1px 7px;border-radius:var(--radius-sm);font-size:10.5px;font-weight:500;background:var(--ink-100);color:var(--text-muted);white-space:nowrap;">历史版本</span>';
}

function scoreActionBadge(rule) {
  if (rule.scoreType === 'reject') {
    return '<span style="display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:var(--radius-sm);font-size:10.5px;font-weight:600;background:var(--rose-50);color:var(--rose-700);white-space:nowrap;"><i data-lucide="octagon-x" style="width:10px;height:10px;"></i>立即判定·无意向</span>';
  }
  var sign = rule.scoreType === 'sub' ? '-' : '+';
  var color = rule.scoreType === 'sub' ? 'var(--rose-600)' : 'var(--emerald-600)';
  var bg = rule.scoreType === 'sub' ? 'var(--rose-50)' : 'var(--emerald-50)';
  return '<span style="display:inline-flex;align-items:center;gap:2px;padding:2px 7px;border-radius:var(--radius-sm);font-size:11px;font-weight:700;background:' + bg + ';color:' + color + ';white-space:nowrap;font-variant-numeric:tabular-nums;">' + sign + rule.score + '分</span>';
}

function sceneBadge(scene) {
  var map = {
    '意向表达': { bg:'var(--brand-50)', text:'var(--brand-700)' },
    '信息提供': { bg:'var(--blue-50)', text:'var(--blue-700)' },
    '互动质量': { bg:'var(--violet-50)', text:'var(--violet-700)' },
    '异议识别': { bg:'var(--rose-50)', text:'var(--rose-700)' },
  };
  var s = map[scene] || { bg:'var(--ink-100)', text:'var(--text-muted)' };
  return '<span style="display:inline-flex;align-items:center;padding:1px 6px;border-radius:var(--radius-sm);font-size:10.5px;font-weight:500;background:' + s.bg + ';color:' + s.text + ';white-space:nowrap;">' + scene + '</span>';
}

// ── View Object ────────────────────────────────────────────
var ScoringView = {
  get activeTab() { return scoringActiveTab; },

  render: function() {
    return renderScoringView();
  },

  switchTab: function(tab) {
    scoringActiveTab = tab;
    scoringPublishMode = false;
    App.refreshCurrentView();
  },

  publishVersion: function() {
    if (!scoringPublishMode) {
      scoringPublishMode = true;
      App.refreshCurrentView();
      return;
    }
    scoringPublishMode = false;
    CURRENT_VERSION.version = 'v3.3';
    CURRENT_VERSION.publisher = '当前用户';
    var now = new Date();
    var timeStr = '2026-08-20 ' + String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
    CURRENT_VERSION.publishTime = timeStr;
    CURRENT_VERSION.note = scoringPublishNote || '规则优化调整';
    CURRENT_VERSION.status = 'current';
    VERSION_HISTORY.unshift({ version:'v3.3', publisher:'当前用户', publishTime:timeStr, note:CURRENT_VERSION.note, status:'current' });
    VERSION_HISTORY[1].status = 'history';
    scoringPublishNote = '';
    App.showToast('发布成功！新版本 v3.3 已生效', 'success');
    App.refreshCurrentView();
  },

  rollbackVersion: function(version) {
    App.showModal({
      title: '确认回滚版本',
      content: '<div style="font-size:12px;color:var(--text-secondary);line-height:1.6;">' +
        '<div style="margin-bottom:10px;">确定回滚到 <strong style="color:var(--text-main);">' + version + '</strong>？</div>' +
        '<div style="padding:8px 10px;background:var(--amber-50);border-radius:var(--radius-sm);border-left:3px solid var(--amber-500);font-size:11px;color:var(--amber-700);">' +
        '<i data-lucide="alert-triangle" style="width:12px;height:12px;vertical-align:-2px;margin-right:4px;"></i>' +
        '回滚后当前规则将被覆盖，需要重新发布。回滚操作会记录在版本历史中。</div></div>',
      confirmText: '确认回滚',
      onConfirm: function() {
        App.showToast('已回滚到 ' + version + '，请检查规则后重新发布', 'success');
      }
    });
  }
};

// ── Toggle Switch Helper ──────────────────────────────────
function renderToggle(enabled, onclick) {
  return '<label style="position:relative;display:inline-block;width:38px;height:20px;cursor:pointer;" onclick="' + onclick + 'event.preventDefault();">' +
    '<span style="position:absolute;inset:0;border-radius:10px;transition:0.2s;' + (enabled ? 'background:var(--emerald-500);' : 'background:var(--ink-300);') + '">' +
    '<span style="position:absolute;top:2px;left:' + (enabled ? '20px' : '2px') + ';width:16px;height:16px;border-radius:50%;background:#fff;transition:0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.15);"></span>' +
    '</span></label>';
}

// ── Main Render ────────────────────────────────────────────
function renderScoringView() {
  var tabs = [
    { key:'dimensions', label:'评分维度配置', icon:'gauge', badge:SCORING_DIMENSIONS.length, badgeColor:'primary' },
    { key:'thresholds', label:'阈值与分组', icon:'sliders', badge:INTENTION_LEVELS.length, badgeColor:'success' },
    { key:'hitrules', label:'命中规则', icon:'git-branch', badge:HIT_RULES.filter(function(r){return r.enabled;}).length+'/'+HIT_RULES.length, badgeColor:'warning' },
    { key:'history', label:'版本历史', icon:'history', badge:VERSION_HISTORY.length, badgeColor:'neutral' },
  ];

  var enabledRules = HIT_RULES.filter(function(r){return r.enabled;}).length;

  var publishArea = '';
  if (scoringPublishMode) {
    publishArea = '<div class="card" style="padding:14px 16px;margin-bottom:var(--content-gap);border-left:3px solid var(--brand-500);background:var(--brand-50);border-radius:var(--radius-md);">' +
      '<div style="display:flex;align-items:flex-start;gap:12px;">' +
      '<div style="width:32px;height:32px;border-radius:var(--radius-sm);background:var(--brand-100);display:flex;align-items:center;justify-content:center;flex-shrink:0;">' +
      '<i data-lucide="rocket" style="width:15px;height:15px;color:var(--brand-600);"></i></div>' +
      '<div style="flex:1;min-width:0;">' +
      '<div style="font-size:12.5px;font-weight:600;color:var(--text-main);margin-bottom:8px;">发布新版本 v3.3</div>' +
      '<div style="margin-bottom:8px;"><label style="font-size:11px;color:var(--text-secondary);display:block;margin-bottom:4px;">版本说明（变更内容）</label>' +
      '<input type="text" id="scoring-publish-note" class="form-input" style="width:100%;height:30px;line-height:30px;padding:0 10px;font-size:12px;border-radius:var(--radius-sm);" placeholder="请输入本次规则变更说明..." value="' + scoringPublishNote + '" oninput="scoringPublishNote=this.value"></div>' +
      '<div style="display:flex;gap:6px;">' +
      '<button class="btn btn-primary btn-sm" onclick="confirmPublishScoring()"><i data-lucide="check"></i>确认发布</button>' +
      '<button class="btn btn-ghost btn-sm" onclick="cancelPublishScoring()">取消</button>' +
      '</div></div></div></div>';
  }

  var tabsHtml = '<div style="display:flex;gap:0;border-bottom:1px solid var(--border-color);margin-bottom:var(--content-gap);">';
  for (var i = 0; i < tabs.length; i++) {
    var t = tabs[i];
    var badgeClass = 'badge-neutral';
    if (t.badgeColor === 'danger') badgeClass = 'badge-danger';
    else if (t.badgeColor === 'warning') badgeClass = 'badge-warning';
    else if (t.badgeColor === 'success') badgeClass = 'badge-success';
    else if (t.badgeColor === 'primary') badgeClass = 'badge-primary';
    var activeCls = scoringActiveTab === t.key ? 'active' : '';
    tabsHtml += '<button onclick="switchScoringTab(\'' + t.key + '\')" class="tab-btn ' + activeCls + '">' +
      '<i data-lucide="' + t.icon + '" style="width:12px;height:12px;"></i>' + t.label +
      '<span class="badge ' + badgeClass + '" style="font-size:9.5px;line-height:15px;margin-left:4px;">' + t.badge + '</span></button>';
  }
  tabsHtml += '</div>';

  return '<div class="view-fade-enter">' +
    '<div class="page-header">' +
    '<div class="page-title-group">' +
    '<div class="page-title"><i data-lucide="gauge"></i>评分规则版本</div>' +
    '<div class="page-subtitle">评分维度·阈值分组·命中规则·版本发布回滚</div></div>' +
    '<div class="page-actions" style="display:flex;align-items:center;gap:6px;">' +
    '<span class="badge badge-neutral" style="font-size:10px;line-height:16px;background:var(--ink-50);color:var(--text-muted);border:1px solid var(--border-subtle);">' +
    '<i data-lucide="flask-conical" style="width:9px;height:9px;margin-right:2px;"></i>模拟配置·演示版</span>' +
    '<button class="btn btn-outline btn-sm" onclick="App.showToast(\'规则校验中...\',\'info\');setTimeout(function(){App.showToast(\'规则校验通过，共' + enabledRules + '条启用规则\',\'success\');},600)">' +
    '<i data-lucide="check-circle-2"></i>规则校验</button>' +
    '<button class="btn btn-primary btn-sm" onclick="publishScoringVersion()"><i data-lucide="rocket"></i>发布新版本</button>' +
    '</div></div>' +
    publishArea +
    tabsHtml +
    renderScoringTabContent() +
    '</div>';
}

function renderScoringTabContent() {
  switch(scoringActiveTab) {
    case 'dimensions': return renderDimensionsTab();
    case 'thresholds': return renderThresholdsTab();
    case 'hitrules': return renderHitRulesTab();
    case 'history': return renderHistoryTab();
    default: return renderDimensionsTab();
  }
}

// ── Tab 1: 评分维度配置 ──────────────────────────────────
function renderDimensionsTab() {
  var enabledDims = SCORING_DIMENSIONS.filter(function(d){return d.enabled;});
  var totalWeight = 0;
  for (var i = 0; i < enabledDims.length; i++) totalWeight += enabledDims[i].weight;
  var weightValid = totalWeight === 100;
  var enabledCount = enabledDims.length;
  var enabledRules = HIT_RULES.filter(function(r){return r.enabled;}).length;
  var dimIcons = ['target','file-text','messages-square','smile','shield-check'];

  var kpi = '<div class="metrics-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:var(--content-gap);">';
  var kpis = [
    { label:'维度总数', value:SCORING_DIMENSIONS.length, unit:'个', icon:'layers', iconBg:'var(--brand-50)', iconColor:'var(--brand-600)', valueColor:'var(--text-main)' },
    { label:'当前权重', value:totalWeight, unit:'%', icon:'pie-chart', iconBg:weightValid?'var(--emerald-50)':'var(--rose-50)', iconColor:weightValid?'var(--emerald-600)':'var(--rose-600)', valueColor:weightValid?'var(--emerald-600)':'var(--rose-600)' },
    { label:'启用规则', value:enabledRules, unit:'条', icon:'git-branch', iconBg:'var(--blue-50)', iconColor:'var(--blue-600)', valueColor:'var(--blue-600)' },
    { label:'当前版本', value:CURRENT_VERSION.version, unit:'', icon:'tag', iconBg:'var(--violet-50)', iconColor:'var(--violet-600)', valueColor:'var(--violet-600)' }
  ];
  for (var ki = 0; ki < kpis.length; ki++) {
    var k = kpis[ki];
    kpi += '<div class="metric-card" style="padding:10px 12px;min-height:56px;">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">' +
      '<span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">' + k.label + '</span>' +
      '<div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:' + k.iconBg + ';flex-shrink:0;">' +
      '<i data-lucide="' + k.icon + '" style="width:11px;height:11px;color:' + k.iconColor + ';"></i></div></div>' +
      '<div style="font-size:18px;font-weight:700;color:' + k.valueColor + ';font-variant-numeric:tabular-nums;line-height:1.2;letter-spacing:' + (ki===3?'-0.3px':'normal') + ';">' + k.value + (k.unit?'<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">'+k.unit+'</span>':'') + '</div></div>';
  }
  kpi += '</div>';

  // Weight bar
  var wbar = '<div class="card" style="padding:12px 16px;margin-bottom:var(--content-gap);">' +
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">' +
    '<span style="font-size:11px;font-weight:600;color:var(--text-secondary);">权重分布</span>' +
    '<span style="font-size:10.5px;color:var(--text-muted);font-variant-numeric:tabular-nums;">启用维度 ' + enabledCount + ' 个</span></div>' +
    '<div style="display:flex;height:8px;border-radius:4px;overflow:hidden;background:var(--ink-100);gap:2px;">';
  for (var wi = 0; wi < enabledDims.length; wi++) {
    wbar += '<div style="flex:' + enabledDims[wi].weight + ';background:' + enabledDims[wi].color + ';border-radius:2px;transition:0.3s;" title="' + enabledDims[wi].name + ' ' + enabledDims[wi].weight + '%"></div>';
  }
  wbar += '</div><div style="display:flex;gap:10px;margin-top:8px;flex-wrap:wrap;">';
  for (var wi2 = 0; wi2 < enabledDims.length; wi2++) {
    wbar += '<div style="display:flex;align-items:center;gap:4px;font-size:10.5px;color:var(--text-secondary);">' +
      '<span style="width:8px;height:8px;border-radius:2px;background:' + enabledDims[wi2].color + ';flex-shrink:0;"></span>' +
      enabledDims[wi2].name + ' <span style="font-weight:700;color:var(--text-main);font-variant-numeric:tabular-nums;">' + enabledDims[wi2].weight + '%</span></div>';
  }
  wbar += '</div></div>';

  // Dimension cards
  var cards = '<div style="display:flex;flex-direction:column;gap:8px;">';
  for (var di = 0; di < SCORING_DIMENSIONS.length; di++) {
    var dim = SCORING_DIMENSIONS[di];
    var kwHtml = '';
    for (var kwi = 0; kwi < dim.keywords.length; kwi++) {
      kwHtml += '<span style="display:inline-flex;align-items:center;padding:1px 7px;border-radius:var(--radius-sm);background:' + dim.colorBg + ';font-size:10.5px;color:' + dim.color + ';">' + dim.keywords[kwi] + '</span>';
    }
    cards += '<div class="card" style="padding:14px 16px;' + (dim.enabled?'':'opacity:0.55;') + '">' +
      '<div style="display:flex;align-items:flex-start;gap:14px;">' +
      '<div style="width:40px;height:40px;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;flex-shrink:0;background:' + (dim.enabled?dim.colorBg:'var(--ink-100)') + ';">' +
      '<i data-lucide="' + dimIcons[di] + '" style="width:17px;height:17px;color:' + (dim.enabled?dim.color:'var(--text-muted)') + ';"></i></div>' +
      '<div style="flex:1;min-width:0;">' +
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">' +
      '<span style="font-size:13px;font-weight:600;color:var(--text-main);">' + dim.name + '</span>' +
      '<span style="font-size:10px;color:var(--text-muted);font-family:var(--font-mono);">' + dim.id + '</span>' +
      (dim.enabled ? '' : '<span style="font-size:10px;color:var(--text-muted);">（已停用）</span>') +
      '</div>' +
      '<div style="font-size:11px;color:var(--text-secondary);line-height:1.5;margin-bottom:8px;">' + dim.desc + '</div>' +
      '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:10px;">' + kwHtml + '</div>' +
      '<div style="display:flex;align-items:center;gap:10px;">' +
      '<span style="font-size:10.5px;color:var(--text-muted);white-space:nowrap;">权重占比</span>' +
      '<div style="flex:1;position:relative;height:6px;background:var(--ink-100);border-radius:3px;cursor:pointer;" onclick="App.showToast(\'权重调整演示 · ' + dim.name + '\',\'info\')">' +
      '<div style="position:absolute;left:0;top:0;height:100%;width:' + dim.weight + '%;background:' + dim.color + ';border-radius:3px;transition:0.3s;"></div>' +
      '<div style="position:absolute;top:50%;left:' + dim.weight + '%;transform:translate(-50%,-50%);width:14px;height:14px;border-radius:50%;background:#fff;border:2px solid ' + dim.color + ';box-shadow:0 1px 3px rgba(0,0,0,0.12);transition:0.3s;cursor:grab;"></div>' +
      '</div>' +
      '<span style="font-size:13px;font-weight:700;color:' + dim.color + ';font-variant-numeric:tabular-nums;min-width:36px;text-align:right;">' + dim.weight + '%</span>' +
      '</div></div>' +
      '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;flex-shrink:0;">' +
      renderToggle(dim.enabled, 'toggleDimension(\'' + dim.id + '\',\'' + dim.name + '\');') +
      '<button class="btn btn-ghost btn-sm" style="height:26px;padding:0 8px;font-size:10.5px;" onclick="App.showToast(\'编辑维度 · ' + dim.name + '\',\'info\')">' +
      '<i data-lucide="edit-2" style="width:10px;height:10px;"></i>编辑</button>' +
      '</div></div></div>';
  }
  cards += '</div>';

  var validation = '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:12px;padding:10px 14px;background:' + (weightValid?'var(--emerald-50)':'var(--rose-50)') + ';border-radius:var(--radius-md);border:1px solid ' + (weightValid?'var(--emerald-200)':'var(--rose-200)') + ';">' +
    '<div style="display:flex;align-items:center;gap:8px;">' +
    '<i data-lucide="' + (weightValid?'check-circle':'alert-triangle') + '" style="width:14px;height:14px;color:' + (weightValid?'var(--emerald-600)':'var(--rose-600)') + ';"></i>' +
    '<span style="font-size:11.5px;color:' + (weightValid?'var(--emerald-700)':'var(--rose-700)') + ';">' +
    (weightValid ? '权重配置合法，总权重为 100%' : '权重异常：当前总权重 ' + totalWeight + '%，需调整为 100%') + '</span></div>' +
    '<span style="font-size:13px;font-weight:700;color:' + (weightValid?'var(--emerald-700)':'var(--rose-700)') + ';font-variant-numeric:tabular-nums;">总权重: ' + totalWeight + '%</span></div>';

  return kpi + wbar + cards + validation;
}

// ── Tab 2: 阈值与分组 ──────────────────────────────────
function renderThresholdsTab() {
  var totalLeads = 0;
  for (var i = 0; i < INTENTION_LEVELS.length; i++) totalLeads += INTENTION_LEVELS[i].count;

  var infoBar = '<div class="card" style="padding:10px 14px;margin-bottom:var(--content-gap);display:flex;align-items:center;gap:10px;background:var(--ink-50);border-radius:var(--radius-md);">' +
    '<i data-lucide="info" style="width:14px;height:14px;color:var(--brand-500);flex-shrink:0;"></i>' +
    '<span style="font-size:11px;color:var(--text-secondary);line-height:1.5;">评分阈值决定客户意向等级的自动判定，阈值调整后所有新通话将按新规则评分。当前潜客池共 <strong style="color:var(--text-main);font-variant-numeric:tabular-nums;">' + totalLeads + '</strong> 条线索。</span></div>';

  var levelCards = '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:var(--content-gap);">';
  for (var li = 0; li < INTENTION_LEVELS.length; li++) {
    var level = INTENTION_LEVELS[li];
    var pct = ((level.count / totalLeads) * 100).toFixed(1);
    var rangeDisplay = (level.min === 0 ? '0' : level.min) + '<span style="font-size:12px;font-weight:400;color:var(--text-muted);">-</span>' + level.max;
    levelCards += '<div class="card" style="padding:14px;border-top:3px solid ' + level.barBg + ';border-radius:var(--radius-md);position:relative;overflow:hidden;">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">' +
      '<div style="display:flex;align-items:center;gap:6px;">' +
      '<div style="width:28px;height:28px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:' + level.bg + ';">' +
      '<i data-lucide="' + level.icon + '" style="width:13px;height:13px;color:' + level.color + ';"></i></div>' +
      '<span style="font-size:13px;font-weight:700;color:' + level.color + ';">' + level.name + '</span></div></div>' +
      '<div style="margin-bottom:10px;"><div style="font-size:10px;color:var(--text-muted);margin-bottom:3px;">分数区间</div>' +
      '<div style="font-size:20px;font-weight:800;color:var(--text-main);font-variant-numeric:tabular-nums;line-height:1.1;letter-spacing:-0.5px;">' + rangeDisplay + '<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">分</span></div></div>' +
      '<div style="padding:6px 8px;background:' + level.bg + ';border-radius:var(--radius-sm);margin-bottom:10px;">' +
      '<div style="font-size:10px;color:' + level.color + ';font-weight:600;margin-bottom:1px;"><i data-lucide="zap" style="width:9px;height:9px;vertical-align:-1px;"></i> ' + level.action + '</div>' +
      '<div style="font-size:10px;color:var(--text-secondary);line-height:1.4;">' + level.actionDesc + '</div></div>' +
      '<div><div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:4px;">' +
      '<span style="font-size:10px;color:var(--text-muted);">当前线索</span>' +
      '<span style="font-size:11px;font-weight:700;color:var(--text-main);font-variant-numeric:tabular-nums;">' + level.count + '<span style="font-weight:400;color:var(--text-muted);font-size:10px;"> 条 (' + pct + '%)</span></span></div>' +
      '<div style="height:4px;background:var(--ink-100);border-radius:2px;overflow:hidden;">' +
      '<div style="height:100%;width:' + pct + '%;background:' + level.barBg + ';border-radius:2px;transition:0.5s;"></div></div></div></div>';
  }
  levelCards += '</div>';

  // Sliders section
  var sliders = '<div class="card" style="padding:16px;">' +
    '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">' +
    '<div><div style="font-size:12.5px;font-weight:600;color:var(--text-main);margin-bottom:2px;">阈值调整</div>' +
    '<div style="font-size:10.5px;color:var(--text-muted);">拖动滑块调整各等级分界点，总分范围 0-100</div></div>' +
    '<button class="btn btn-ghost btn-sm" style="height:28px;font-size:11px;" onclick="App.showToast(\'阈值已重置为默认值\',\'info\')">' +
    '<i data-lucide="rotate-ccw" style="width:11px;height:11px;"></i>恢复默认</button></div>';

  // Spectrum visual
  sliders += '<div style="position:relative;margin-bottom:20px;padding:0 10px;">' +
    '<div style="display:flex;height:12px;border-radius:6px;overflow:hidden;">' +
    '<div style="flex:39;background:var(--rose-400);cursor:pointer;" onclick="App.showToast(\'阈值调整演示\',\'info\')"></div>' +
    '<div style="flex:20;background:var(--amber-400);cursor:pointer;" onclick="App.showToast(\'阈值调整演示\',\'info\')"></div>' +
    '<div style="flex:25;background:var(--brand-400);cursor:pointer;" onclick="App.showToast(\'阈值调整演示\',\'info\')"></div>' +
    '<div style="flex:16;background:var(--emerald-400);cursor:pointer;" onclick="App.showToast(\'阈值调整演示\',\'info\')"></div>' +
    '</div>' +
    '<div style="position:absolute;top:-4px;left:calc(39% - 8px);width:20px;height:20px;border-radius:50%;background:#fff;border:3px solid var(--rose-500);box-shadow:0 1px 4px rgba(0,0,0,0.15);cursor:grab;" onclick="App.showToast(\'低/无意向阈值：40分\',\'info\')"></div>' +
    '<div style="position:absolute;top:-4px;left:calc(59% - 8px);width:20px;height:20px;border-radius:50%;background:#fff;border:3px solid var(--amber-500);box-shadow:0 1px 4px rgba(0,0,0,0.15);cursor:grab;" onclick="App.showToast(\'中/低意向阈值：60分\',\'info\')"></div>' +
    '<div style="position:absolute;top:-4px;left:calc(84% - 8px);width:20px;height:20px;border-radius:50%;background:#fff;border:3px solid var(--brand-500);box-shadow:0 1px 4px rgba(0,0,0,0.15);cursor:grab;" onclick="App.showToast(\'高/中意向阈值：85分\',\'info\')"></div>' +
    '<div style="display:flex;justify-content:space-between;margin-top:16px;">' +
    '<span style="font-size:10px;color:var(--rose-600);font-weight:600;">0</span>' +
    '<span style="font-size:10px;color:var(--rose-600);font-weight:600;">40</span>' +
    '<span style="font-size:10px;color:var(--amber-600);font-weight:600;">60</span>' +
    '<span style="font-size:10px;color:var(--brand-600);font-weight:600;">85</span>' +
    '<span style="font-size:10px;color:var(--emerald-600);font-weight:600;">100</span>' +
    '</div></div>';

  var sliderRows = [
    { name:'高/中意向分界', value:85, color:'var(--emerald-500)' },
    { name:'中/低意向分界', value:60, color:'var(--brand-500)' },
    { name:'低/无意向分界', value:40, color:'var(--amber-500)' }
  ];
  sliders += '<div style="display:flex;flex-direction:column;gap:12px;">';
  for (var si = 0; si < sliderRows.length; si++) {
    var sr = sliderRows[si];
    sliders += '<div style="display:flex;align-items:center;gap:12px;">' +
      '<span style="font-size:11px;color:var(--text-secondary);width:110px;flex-shrink:0;">' + sr.name + '</span>' +
      '<div style="flex:1;position:relative;height:4px;background:var(--ink-100);border-radius:2px;cursor:pointer;" onclick="App.showToast(\'' + sr.name + '阈值调整演示\',\'info\')">' +
      '<div style="position:absolute;left:0;top:0;height:100%;width:' + sr.value + '%;background:' + sr.color + ';border-radius:2px;"></div>' +
      '<div style="position:absolute;top:50%;left:' + sr.value + '%;transform:translate(-50%,-50%);width:14px;height:14px;border-radius:50%;background:#fff;border:2px solid ' + sr.color + ';box-shadow:0 1px 3px rgba(0,0,0,0.12);cursor:grab;"></div>' +
      '</div>' +
      '<span style="font-size:12px;font-weight:700;color:' + sr.color + ';font-variant-numeric:tabular-nums;min-width:36px;text-align:right;">' + sr.value + '分</span></div>';
  }
  sliders += '</div>';

  sliders += '<div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--border-subtle);display:flex;justify-content:flex-end;gap:6px;">' +
    '<button class="btn btn-outline btn-sm" onclick="App.showToast(\'请先完成规则校验\',\'warning\')"><i data-lucide="save"></i>保存草稿</button>' +
    '<button class="btn btn-primary btn-sm" onclick="publishScoringVersion()"><i data-lucide="rocket"></i>应用并发布</button>' +
    '</div></div>';

  return infoBar + levelCards + sliders;
}

// ── Tab 3: 命中规则 ──────────────────────────────────────

// 命中规则筛选状态 (真实联动)
let hitRuleSearch = '';
let hitRuleScene = 'ALL';
let hitRuleType = 'ALL';

function setHitRuleFilter(kind, val) {
  if (kind === 'search') hitRuleSearch = val;
  if (kind === 'scene') hitRuleScene = val;
  if (kind === 'type') hitRuleType = val;
  App.refreshCurrentView();
}

function renderHitRulesTab() {
  var filteredRules = HIT_RULES.filter(function(r) {
    var q = hitRuleSearch.toLowerCase();
    var matchSearch = !q || r.name.toLowerCase().includes(q) || r.condition.toLowerCase().includes(q);
    var matchScene = hitRuleScene === 'ALL' || r.scene === hitRuleScene;
    var matchType = hitRuleType === 'ALL' ||
      (hitRuleType === 'add' && r.scoreType === 'add') ||
      (hitRuleType === 'sub' && r.scoreType === 'sub') ||
      (hitRuleType === 'reject' && r.scoreType === 'reject');
    return matchSearch && matchScene && matchType;
  });
  var enabledCount = HIT_RULES.filter(function(r){return r.enabled;}).length;
  var rejectCount = HIT_RULES.filter(function(r){return r.scoreType==='reject';}).length;

  var kpi = '<div class="metrics-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:var(--content-gap);">';
  var kpis = [
    { label:'规则总数', value:HIT_RULES.length, unit:'条', icon:'git-branch', iconBg:'var(--brand-50)', iconColor:'var(--brand-600)', valueColor:'var(--text-main)' },
    { label:'已启用', value:enabledCount, unit:'条', icon:'check-circle', iconBg:'var(--emerald-50)', iconColor:'var(--emerald-600)', valueColor:'var(--emerald-600)' },
    { label:'直接判定规则', value:rejectCount, unit:'条', icon:'octagon-x', iconBg:'var(--rose-50)', iconColor:'var(--rose-600)', valueColor:'var(--rose-600)' },
    { label:'加分/减分规则', value:HIT_RULES.length-rejectCount, unit:'条', icon:'plus-minus', iconBg:'var(--blue-50)', iconColor:'var(--blue-600)', valueColor:'var(--blue-600)' }
  ];
  for (var ki = 0; ki < kpis.length; ki++) {
    var k = kpis[ki];
    kpi += '<div class="metric-card" style="padding:10px 12px;min-height:56px;">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">' +
      '<span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">' + k.label + '</span>' +
      '<div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:' + k.iconBg + ';flex-shrink:0;">' +
      '<i data-lucide="' + k.icon + '" style="width:11px;height:11px;color:' + k.iconColor + ';"></i></div></div>' +
      '<div style="font-size:18px;font-weight:700;color:' + k.valueColor + ';font-variant-numeric:tabular-nums;line-height:1.2;">' + k.value + '<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">' + k.unit + '</span></div></div>';
  }
  kpi += '</div>';

  var filterBar = '<div class="filter-bar">' +
    '<div style="position:relative;flex:1;min-width:180px;max-width:220px;">' +
    '<i data-lucide="search" style="position:absolute;left:8px;top:50%;transform:translateY(-50%);width:12px;height:12px;color:var(--text-muted);"></i>' +
    '<input type="text" class="form-input" style="width:100%;height:30px;line-height:30px;padding:0 10px 0 26px;font-size:12px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;" placeholder="搜索规则名称/条件" value="' + hitRuleSearch + '" oninput="setHitRuleFilter(\'search\',this.value)"></div>' +
    '<select class="form-select" style="height:30px;padding:0 24px 0 8px;font-size:12px;min-width:100px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;" onchange="setHitRuleFilter(\'scene\',this.value)"><option value="ALL"' + (hitRuleScene==='ALL'?' selected':'') + '>全部场景</option><option value="意向表达"' + (hitRuleScene==='意向表达'?' selected':'') + '>意向表达</option><option value="信息提供"' + (hitRuleScene==='信息提供'?' selected':'') + '>信息提供</option><option value="互动质量"' + (hitRuleScene==='互动质量'?' selected':'') + '>互动质量</option><option value="异议识别"' + (hitRuleScene==='异议识别'?' selected':'') + '>异议识别</option></select>' +
    '<select class="form-select" style="height:30px;padding:0 24px 0 8px;font-size:12px;min-width:100px;border-radius:var(--radius-md);background:var(--ink-50);border:1px solid transparent;" onchange="setHitRuleFilter(\'type\',this.value)"><option value="ALL"' + (hitRuleType==='ALL'?' selected':'') + '>全部类型</option><option value="add"' + (hitRuleType==='add'?' selected':'') + '>加分规则</option><option value="sub"' + (hitRuleType==='sub'?' selected':'') + '>减分规则</option><option value="reject"' + (hitRuleType==='reject'?' selected':'') + '>直接判定</option></select>' +
    '<div class="filter-divider"></div>' +
    '<div class="filter-actions"><span class="filter-count">' + filteredRules.length + '条</span>' +
    '<button class="btn btn-ghost btn-sm" style="height:28px;font-size:11px;" onclick="hitRuleSearch=\'\';hitRuleScene=\'ALL\';hitRuleType=\'ALL\';App.refreshCurrentView();"><i data-lucide="rotate-ccw" style="width:11px;height:11px;"></i>重置</button>' +
    '<button class="btn btn-primary btn-sm" style="height:28px;font-size:11px;" onclick="App.showToast(\'新增命中规则面板演示中\',\'info\')"><i data-lucide="plus" style="width:11px;height:11px;"></i>新增规则</button></div></div>';

  var table = '<div class="card" style="padding:0;overflow:hidden;"><div style="overflow-x:auto;"><table class="data-table"><thead><tr>' +
    '<th style="width:70px;">规则ID</th><th style="width:130px;">规则名称</th><th>触发条件</th><th style="width:110px;">分值调整</th><th style="width:80px;">应用场景</th><th style="width:62px;">状态</th><th style="width:120px;text-align:right;">操作</th>' +
    '</tr></thead><tbody class="stagger-container">';
  for (var ri = 0; ri < filteredRules.length; ri++) {
    var rule = filteredRules[ri];
    var rejectTag = rule.scoreType === 'reject' ? '<span style="display:inline-flex;align-items:center;gap:2px;padding:0 4px;border-radius:3px;font-size:9px;font-weight:700;background:var(--rose-100);color:var(--rose-700);white-space:nowrap;">判定</span>' : '';
    table += '<tr style="' + (rule.enabled?'':'opacity:0.5;') + '">' +
      '<td><span style="font-size:11px;font-weight:500;color:var(--text-muted);font-variant-numeric:tabular-nums;font-family:var(--font-mono);">' + rule.id + '</span></td>' +
      '<td><div style="display:flex;align-items:center;gap:6px;"><span style="font-size:11.5px;font-weight:600;color:var(--text-main);white-space:nowrap;">' + rule.name + '</span>' + rejectTag + '</div></td>' +
      '<td><div style="font-size:11px;color:var(--text-secondary);line-height:1.5;max-width:320px;">' + rule.condition + '</div></td>' +
      '<td>' + scoreActionBadge(rule) + '</td>' +
      '<td>' + sceneBadge(rule.scene) + '</td>' +
      '<td>' + ruleStatusBadge(rule.enabled) + '</td>' +
      '<td style="text-align:right;"><div style="display:flex;gap:2px;justify-content:flex-end;align-items:center;">' +
      '<button class="btn btn-ghost btn-sm" style="width:26px;height:26px;padding:0;" onclick="App.showToast(\'编辑规则 · ' + rule.name + '\',\'info\')" title="编辑"><i data-lucide="edit-2" style="width:11px;height:11px;"></i></button>' +
      renderToggle(rule.enabled, 'toggleHitRule(\'' + rule.id + '\',\'' + rule.name + '\');') +
      '</div></td></tr>';
  }
  table += '</tbody></table></div></div>';

  var footer = '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;padding:0 2px;">' +
    '<div style="display:flex;align-items:center;gap:10px;font-size:10.5px;color:var(--text-muted);">' +
    '<span style="display:flex;align-items:center;gap:3px;"><span style="width:8px;height:8px;border-radius:2px;background:var(--rose-400);"></span>直接判定规则命中后立即终止评分</span>' +
    '<span style="display:flex;align-items:center;gap:3px;"><span style="width:8px;height:8px;border-radius:2px;background:var(--emerald-400);"></span>加分规则可叠加</span></div>' +
    '<span style="font-size:11px;color:var(--text-muted);font-variant-numeric:tabular-nums;">共 ' + HIT_RULES.length + ' 条规则</span></div>';

  return kpi + filterBar + table + footer;
}

// ── Tab 4: 版本历史 ──────────────────────────────────────
function renderHistoryTab() {
  var kpi = '<div class="metrics-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:var(--content-gap);">';
  var kpis = [
    { label:'当前版本', value:CURRENT_VERSION.version, unit:'', icon:'tag', iconBg:'var(--emerald-50)', iconColor:'var(--emerald-600)', valueColor:'var(--emerald-600)', big:true },
    { label:'历史版本', value:VERSION_HISTORY.length-1, unit:'个', icon:'history', iconBg:'var(--ink-100)', iconColor:'var(--text-muted)', valueColor:'var(--text-main)', big:false },
    { label:'发布人', value:CURRENT_VERSION.publisher, unit:'', icon:'user', iconBg:'var(--brand-50)', iconColor:'var(--brand-600)', valueColor:'var(--text-main)', big:false, isText:true },
    { label:'发布时间', value:CURRENT_VERSION.publishTime, unit:'', icon:'calendar', iconBg:'var(--blue-50)', iconColor:'var(--blue-600)', valueColor:'var(--text-main)', big:false, isText:true }
  ];
  for (var ki = 0; ki < kpis.length; ki++) {
    var k = kpis[ki];
    kpi += '<div class="metric-card" style="padding:10px 12px;min-height:56px;">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">' +
      '<span style="font-size:10.5px;color:var(--text-muted);font-weight:500;">' + k.label + '</span>' +
      '<div style="width:22px;height:22px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:' + k.iconBg + ';flex-shrink:0;">' +
      '<i data-lucide="' + k.icon + '" style="width:11px;height:11px;color:' + k.iconColor + ';"></i></div></div>';
    if (k.isText) {
      kpi += '<div style="font-size:' + (k.big?'18px':'13px') + ';font-weight:' + (k.big?'700':'600') + ';color:' + k.valueColor + ';font-variant-numeric:tabular-nums;line-height:1.2;' + (k.big?'letter-spacing:-0.3px;':'') + '">' + k.value + '</div>';
    } else {
      kpi += '<div style="font-size:' + (k.big?'18px':'18px') + ';font-weight:700;color:' + k.valueColor + ';font-variant-numeric:tabular-nums;line-height:1.2;letter-spacing:' + (k.big?'-0.3px':'normal') + ';">' + k.value + (k.unit?'<span style="font-size:10px;font-weight:400;color:var(--text-muted);margin-left:1px;">'+k.unit+'</span>':'') + '</div>';
    }
    kpi += '</div>';
  }
  kpi += '</div>';

  var table = '<div class="card" style="padding:0;overflow:hidden;"><div style="overflow-x:auto;"><table class="data-table"><thead><tr>' +
    '<th style="width:70px;">版本号</th><th style="width:80px;">发布人</th><th style="width:140px;">发布时间</th><th>变更说明</th><th style="width:80px;">状态</th><th style="width:140px;text-align:right;">操作</th>' +
    '</tr></thead><tbody class="stagger-container">';
  for (var vi = 0; vi < VERSION_HISTORY.length; vi++) {
    var v = VERSION_HISTORY[vi];
    var checkIcon = v.status==='current' ? '<i data-lucide="check-circle-2" style="width:12px;height:12px;color:var(--emerald-500);"></i>' : '';
    var rollbackBtn = v.status === 'current'
      ? '<button class="btn btn-ghost btn-sm" style="height:26px;padding:0 8px;font-size:10.5px;color:var(--text-muted);" disabled><i data-lucide="undo-2" style="width:10px;height:10px;"></i>当前版本</button>'
      : '<button class="btn btn-outline btn-sm" style="height:26px;padding:0 8px;font-size:10.5px;color:var(--amber-600);border-color:var(--amber-200);" onclick="rollbackScoringVersion(\'' + v.version + '\')"><i data-lucide="undo-2" style="width:10px;height:10px;"></i>回滚</button>';
    table += '<tr style="' + (v.status==='current'?'background:var(--emerald-50);':'') + '">' +
      '<td><div style="display:flex;align-items:center;gap:6px;"><span style="font-size:12.5px;font-weight:700;color:' + (v.status==='current'?'var(--emerald-700)':'var(--text-main)') + ';font-variant-numeric:tabular-nums;letter-spacing:-0.3px;">' + v.version + '</span>' + checkIcon + '</div></td>' +
      '<td><div style="display:flex;align-items:center;gap:5px;">' +
      '<div class="lead-avatar-bubble" style="width:22px;height:22px;font-size:10px;flex-shrink:0;background:' + (v.status==='current'?'var(--emerald-100)':'var(--ink-100)') + ';color:' + (v.status==='current'?'var(--emerald-700)':'var(--text-muted)') + ';">' + v.publisher[0] + '</div>' +
      '<span style="font-size:11.5px;color:var(--text-secondary);white-space:nowrap;">' + v.publisher + '</span></div></td>' +
      '<td><span style="font-size:11px;color:var(--text-secondary);font-variant-numeric:tabular-nums;">' + v.publishTime + '</span></td>' +
      '<td><div style="font-size:11px;color:var(--text-secondary);line-height:1.5;max-width:360px;">' + v.note + '</div></td>' +
      '<td>' + versionStatusBadge(v.status) + '</td>' +
      '<td style="text-align:right;"><div style="display:flex;gap:3px;justify-content:flex-end;">' +
      '<button class="btn btn-ghost btn-sm" style="height:26px;padding:0 8px;font-size:10.5px;" onclick="App.showToast(\'版本对比 · ' + v.version + ' vs ' + CURRENT_VERSION.version + '\',\'info\')"><i data-lucide="git-compare" style="width:10px;height:10px;"></i>对比</button>' +
      rollbackBtn +
      '</div></td></tr>';
  }
  table += '</tbody></table></div></div>';

  var timeline = '<div style="margin-top:var(--content-gap);">' +
    '<div style="font-size:11px;font-weight:600;color:var(--text-secondary);margin-bottom:10px;">版本演进时间线</div>' +
    '<div style="position:relative;padding-left:24px;">' +
    '<div style="position:absolute;left:7px;top:8px;bottom:8px;width:2px;background:var(--ink-200);"></div>';
  for (var ti = 0; ti < VERSION_HISTORY.length; ti++) {
    var tv = VERSION_HISTORY[ti];
    var isLast = ti === VERSION_HISTORY.length - 1;
    timeline += '<div style="position:relative;padding-bottom:14px;' + (isLast?'padding-bottom:0;':'') + '">' +
      '<div style="position:absolute;left:-20px;top:3px;width:12px;height:12px;border-radius:50%;background:' + (tv.status==='current'?'var(--emerald-500)':'var(--ink-300)') + ';border:2px solid ' + (tv.status==='current'?'var(--emerald-100)':'#fff') + ';box-shadow:0 0 0 2px ' + (tv.status==='current'?'var(--emerald-200)':'var(--ink-200)') + ';z-index:1;"></div>' +
      '<div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;">' +
      '<span style="font-size:12px;font-weight:700;color:' + (tv.status==='current'?'var(--emerald-700)':'var(--text-main)') + ';font-variant-numeric:tabular-nums;">' + tv.version + '</span>' +
      '<span style="font-size:10.5px;color:var(--text-muted);font-variant-numeric:tabular-nums;">' + tv.publishTime + '</span>' +
      '<span style="font-size:10.5px;color:var(--text-secondary);">— ' + tv.publisher + '</span>' +
      (tv.status==='current' ? versionStatusBadge('current') : '') +
      '</div>' +
      '<div style="font-size:11px;color:var(--text-secondary);line-height:1.5;margin-top:2px;">' + tv.note + '</div></div>';
  }
  timeline += '</div></div>';

  return kpi + table + timeline;
}

// ── Actions ────────────────────────────────────────────────

function switchScoringTab(tab) {
  ScoringView.switchTab(tab);
}

function toggleDimension(id, name) {
  for (var i = 0; i < SCORING_DIMENSIONS.length; i++) {
    if (SCORING_DIMENSIONS[i].id === id) {
      SCORING_DIMENSIONS[i].enabled = !SCORING_DIMENSIONS[i].enabled;
      App.showToast('维度「' + name + '」已' + (SCORING_DIMENSIONS[i].enabled ? '启用' : '停用'), SCORING_DIMENSIONS[i].enabled ? 'success' : 'warning');
      App.refreshCurrentView();
      return;
    }
  }
}

function toggleHitRule(id, name) {
  for (var i = 0; i < HIT_RULES.length; i++) {
    if (HIT_RULES[i].id === id) {
      HIT_RULES[i].enabled = !HIT_RULES[i].enabled;
      App.showToast('规则「' + name + '」已' + (HIT_RULES[i].enabled ? '启用' : '停用'), HIT_RULES[i].enabled ? 'success' : 'warning');
      App.refreshCurrentView();
      return;
    }
  }
}

function publishScoringVersion() {
  ScoringView.publishVersion();
}

function confirmPublishScoring() {
  var input = document.getElementById('scoring-publish-note');
  if (input) {
    scoringPublishNote = input.value;
  }
  ScoringView.publishVersion();
}

function cancelPublishScoring() {
  scoringPublishMode = false;
  scoringPublishNote = '';
  App.refreshCurrentView();
}

function rollbackScoringVersion(version) {
  ScoringView.rollbackVersion(version);
}

// ── Window Exports ─────────────────────────────────────────
window.ScoringView = ScoringView;
window.switchScoringTab = switchScoringTab;
window.toggleDimension = toggleDimension;
window.toggleHitRule = toggleHitRule;
window.publishScoringVersion = publishScoringVersion;
window.confirmPublishScoring = confirmPublishScoring;
window.cancelPublishScoring = cancelPublishScoring;
window.rollbackScoringVersion = rollbackScoringVersion;
window.setHitRuleFilter = setHitRuleFilter;
