// SmartCall Pro - Enterprise State & Mock Engine

const AppState = {
  theme: 'light',
  currentView: 'dashboard',
  currentRole: 'admin', // admin, matchmaker, qa_lead
  currentTenant: 'hangzhou_center',
  
  // Real-time Metrics
  metrics: {
    todayCalls: 1284,
    connectRate: 74.2,
    intenseLeadsRate: 26.8, // A+S Rate
    wecomAddedRate: 18.5,
    avgDurationSec: 138,
    activeTasks: 6,
    aiEngineQps: 42.8,
    asrLatencyMs: 168,
    llmLatencyMs: 412,
    ttsLatencyMs: 145
  },

  // 12 Comprehensive Leads with Deep Persona & Multi-turn Transcripts
  leads: [
    {
      id: 'L10001',
      name: '陈若云',
      gender: '女',
      age: 28,
      phone: '138****9281',
      city: '杭州·滨江区',
      education: '浙江大学·硕士',
      occupation: '网易高级产品经理',
      annualIncome: '45-55万',
      housingStatus: '滨江独立商品房一套(有贷)',
      carStatus: '特斯拉Model Y',
      tier: 'S',
      intentScore: 96,
      status: 'wecom_added', // pending, calling, connected, claimed, wecom_added, refused
      sourceChannel: '抖音信息流广告-优质脱单计划',
      assignedMatchmaker: '林晓梅 (资深红娘组长)',
      callDuration: '3分45秒',
      callTime: '2026-08-19 14:22',
      tags: ['高知硕士', '高诚意度', '急需同频男友', '接受周末面谈', '预算1.5万+'],
      mateRequirement: {
        ageRange: '28-34岁',
        height: '176cm以上',
        education: '985/211统招硕士',
        income: '年薪40万+',
        coreReq: '互联网/金融大厂，性格温和有责任感，杭州定居有购房能力'
      },
      qaScore: 98,
      qaResult: '合规无违规',
      riskAlerts: [],
      matchmakerNotes: '客户表达非常清晰，极度反感相亲角推销，但对我们AI红娘提及的3位同名校男生画像极具兴趣，已成功添加企业微信，预约周六下午15:00旗舰店线下体验深度匹配。',
      transcript: [
        { role: 'ai', time: '00:02', text: '您好若云女士，我是知缘AI红娘助理晓晴～看到您前天在浙大校友脱单专区提交的缘分卡片，请问现在方便耽误您两分钟做个简短核对吗？', sentiment: 'neutral', tag: '礼貌开场与意图确认' },
        { role: 'user', time: '00:11', text: '哦你好，现在可以说的，你们这个是真人还是AI？声音挺自然的。', sentiment: 'positive', tag: '好感探寻' },
        { role: 'ai', time: '00:17', text: '谢谢若云夸奖～我是知缘专属的智能红娘，结合了我们千万级婚恋知识库，专门帮您高效筛选同频名校嘉宾呢！系统显示您硕士毕业于浙大，目前在滨江大厂负责产品，是希望找一位28到34岁、同样在杭州发展的优质男生对吗？', sentiment: 'neutral', tag: '画像共鸣与关键要素确认' },
        { role: 'user', time: '00:32', text: '对的，主要希望男生学历相当，性格聊得来，别太大男子主义，在阿里或网易这边最好，生活圈子近一点。', sentiment: 'positive', tag: '择偶核心诉求明确' },
        { role: 'ai', time: '00:44', text: '太理解了！我数据库里正好有几位非常匹配的嘉宾：比如有一位30岁浙大计算机硕士、阿里P7的技术专家，平时也爱徒步与胶片摄影，跟您的兴趣高度契合。稍后让我们的资深校友顾问晓梅老师微信把脱敏资料发给您参考，您看加上您这个手机同号微信可以吗？', sentiment: 'positive', tag: '精准推客钩子&企微转化' },
        { role: 'user', time: '01:05', text: '可以的，就这个手机号就是微信，直接加我就行，备注一下知缘校友。', sentiment: 'positive', tag: '同意企微加粉' }
      ]
    },
    {
      id: 'L10002',
      name: '张宇轩',
      gender: '男',
      age: 31,
      phone: '139****8172',
      city: '杭州·余杭未来科技城',
      education: '上海交通大学·本科',
      occupation: '阿里巴巴资深后端架构师(P7)',
      annualIncome: '65-80万',
      housingStatus: '余杭未来科技城新房全款',
      carStatus: '保时捷Macan',
      tier: 'S',
      intentScore: 94,
      status: 'claimed',
      sourceChannel: '小红书品牌专区·高质男士征婚',
      assignedMatchmaker: '苏雨薇 (高端定制红娘)',
      callDuration: '4分12秒',
      callTime: '2026-08-19 11:05',
      tags: ['全款房产', '高净值IT精英', '3个月内结婚意愿', '希望对方体制内或教师'],
      mateRequirement: {
        ageRange: '25-29岁',
        height: '162-170cm',
        education: '一本及以上',
        income: '不限，工作稳定即可',
        coreReq: '公办教师/公务员/医生优先，性格温婉顾家，形象气质佳'
      },
      qaScore: 95,
      qaResult: '合规无违规',
      riskAlerts: [],
      matchmakerNotes: '男士条件极佳，平时工作节奏紧凑无时间社交，愿意购买4.88万黑金相亲服务包，已安排今晚20:00线上腾讯会议视频复核。',
      transcript: [
        { role: 'ai', time: '00:02', text: '张先生您好，我是知缘AI红娘助理，打扰您一分钟，关于您在未来科技城高层次人才婚恋通道留下的匹配需求，系统已为您完成初步初筛～', sentiment: 'neutral', tag: '身份验证' },
        { role: 'user', time: '00:10', text: '你好，我现在在开会间隙，你长话短说，你们有符合我要求的女老师或公务员女生吗？', sentiment: 'neutral', tag: '目标明确' },
        { role: 'ai', time: '00:16', text: '明白您的宝贵时间！目前余杭与西湖区共有14位在册认证的重点中学编制女教师和机关事业单位女生，年龄在26-28岁，都是本科学历且性格非常温和。我们稍后将精选3位无水印生活卡片推送到您企微，您只需花10秒滑动查看。', sentiment: 'positive', tag: '精准命中痛点' },
        { role: 'user', time: '00:35', text: '行，发我微信吧，如果确实合适这周我可以去你们西溪湿地店详聊。', sentiment: 'positive', tag: '高意向邀约承诺' }
      ]
    },
    {
      id: 'L10003',
      name: '李雅静',
      gender: '女',
      age: 26,
      phone: '137****4456',
      city: '杭州·西湖区',
      education: '华东师范大学·本科',
      occupation: '西湖区公立小学语文教师',
      annualIncome: '18-22万',
      housingStatus: '杭州与父母同住(西湖区自有住房)',
      carStatus: 'MINI Cooper',
      tier: 'A',
      intentScore: 88,
      status: 'connected',
      sourceChannel: '腾讯微信朋友圈定向推广',
      assignedMatchmaker: '周敏 (白领专属红娘)',
      callDuration: '2分50秒',
      callTime: '2026-08-19 10:15',
      tags: ['编制教师', '家庭和睦', '知书达礼', '喜欢阳光开朗男生'],
      mateRequirement: {
        ageRange: '27-32岁',
        height: '175cm+',
        education: '全日制统招本科+',
        income: '年薪25万+',
        coreReq: '正当稳定职业，在杭有房无不良嗜好，幽默风趣'
      },
      qaScore: 92,
      qaResult: '合规无违规',
      riskAlerts: [],
      matchmakerNotes: '女生谈吐文雅，非常看重男生谈吐与家庭教养，建议推荐金融分析师或大厂项目经理。',
      transcript: [
        { role: 'ai', time: '00:02', text: '雅静老师您好呀，我是知缘AI红娘小助手～趁着暑期为您准备了青年教师专属的线下咖啡品鉴交友沙龙，想了解下您的近期交友计划呢。', sentiment: 'neutral', tag: '定制化场景切入' },
        { role: 'user', time: '00:14', text: '啊是知缘啊，沙龙大概什么时候？有哪些人参加呀？', sentiment: 'positive', tag: '活动兴趣' }
      ]
    },
    {
      id: 'L10004',
      name: '周逸飞',
      gender: '男',
      age: 29,
      phone: '186****1129',
      city: '杭州·拱墅区',
      education: '悉尼大学·硕士(海归)',
      occupation: '中金财富高级投资顾问',
      annualIncome: '50-70万',
      housingStatus: '拱墅区大运河畔高端住宅一套',
      carStatus: '宝马5系',
      tier: 'A',
      intentScore: 85,
      status: 'calling',
      sourceChannel: '知乎名企职场交友专栏',
      assignedMatchmaker: '待分配 (外呼执行中)',
      callDuration: '进行中 01:24',
      callTime: '2026-08-19 15:40',
      tags: ['海归金融', '形象气质佳', '爱好网球滑雪', '注重精神共鸣'],
      mateRequirement: {
        ageRange: '24-29岁',
        height: '165cm+',
        education: '海归或国内重点名校',
        income: '不限',
        coreReq: '有共同海外背景或艺术爱好，审美在线'
      },
      qaScore: 90,
      qaResult: '监控中',
      riskAlerts: [],
      matchmakerNotes: '正在实时外呼中，AI已识别出高意向，正引导添加企业微信。',
      transcript: [
        { role: 'ai', time: '00:02', text: '周先生您好，这里是知缘高端海归相亲俱乐部，收到您在金融菁英通道的入会预约，跟您确认下当前基本脱单偏好～', sentiment: 'neutral', tag: '身份确认' },
        { role: 'user', time: '00:12', text: '对，我希望找同样有英美澳留学经历的女生，平时能一起打网球看展。', sentiment: 'positive', tag: '核心画像明确' }
      ]
    },
    {
      id: 'L10005',
      name: '宋佳颖',
      gender: '女',
      age: 32,
      phone: '150****6789',
      city: '杭州·上城区',
      education: '同济大学·本科',
      occupation: '知名外企资深建筑设计师',
      annualIncome: '35-45万',
      housingStatus: '钱江新城精装公寓',
      carStatus: '奥迪A4L',
      tier: 'B',
      intentScore: 74,
      status: 'connected',
      sourceChannel: '百度搜索-杭州高端婚介机构',
      assignedMatchmaker: '王丽娟 (资深婚恋顾问)',
      callDuration: '1分48秒',
      callTime: '2026-08-19 09:30',
      tags: ['事业型独立女性', '轻微年龄焦虑', '对男生情商要求高'],
      mateRequirement: {
        ageRange: '30-36岁',
        height: '175cm+',
        education: '统招本科及以上',
        income: '40万+',
        coreReq: '成熟稳重，情绪价值拉满，尊重女性事业'
      },
      qaScore: 88,
      qaResult: '合规无违规',
      riskAlerts: [],
      matchmakerNotes: '对传统相亲有防备心，AI成功化解了其对信息泄露的顾虑，需红娘以专业咨询师身份跟进。',
      transcript: [
        { role: 'ai', time: '00:02', text: '佳颖女士您好，知缘AI隐私保护红娘小晴为您服务，我们严格执行公安部实名认证与端到端加密机制...', sentiment: 'neutral', tag: '隐私安全背书' }
      ]
    },
    {
      id: 'L10006',
      name: '黄志豪',
      gender: '男',
      age: 35,
      phone: '133****9901',
      city: '杭州·萧山区',
      education: '浙江工商大学·本科',
      occupation: '萧山实体制造外贸公司副总',
      annualIncome: '80-120万',
      housingStatus: '萧山自建别墅+钱江世纪城大平层',
      carStatus: '保时捷卡宴',
      tier: 'B',
      intentScore: 78,
      status: 'claimed',
      sourceChannel: '线下商圈展点地推收集',
      assignedMatchmaker: '苏雨薇 (高端定制红娘)',
      callDuration: '3分10秒',
      callTime: '2026-08-19 13:10',
      tags: ['实体二代', '资产雄厚', '父母催婚严重', '希望尽快定婚'],
      mateRequirement: {
        ageRange: '24-30岁',
        height: '163-172cm',
        education: '本科及以上',
        income: '不限',
        coreReq: '知书达理，家风良好，性格开朗，愿在萧山或滨江定居'
      },
      qaScore: 94,
      qaResult: '合规无违规',
      riskAlerts: [],
      matchmakerNotes: '男士经济实力极强，母亲急切催婚，已邀约周日带父母一同到旗舰店与VIP红娘面谈。',
      transcript: []
    },
    {
      id: 'L10007',
      name: '赵子涵',
      gender: '女',
      age: 24,
      phone: '188****3321',
      city: '杭州·钱塘区',
      education: '中国计量大学·本科',
      occupation: '新媒体运营策划',
      annualIncome: '12-15万',
      housingStatus: '租房中',
      carStatus: '无车',
      tier: 'C',
      intentScore: 58,
      status: 'pending',
      sourceChannel: 'Bilibili年轻人脱单短视频',
      assignedMatchmaker: '未分配',
      callDuration: '0分45秒',
      callTime: '2026-08-18 16:20',
      tags: ['应届初入职场', '尝试性脱单', '预算敏感', '倾向线上聊天'],
      mateRequirement: {
        ageRange: '24-28岁',
        height: '178cm+',
        education: '本科+',
        income: '20万+',
        coreReq: '长相帅气阳光，有共同动漫/电竞话题'
      },
      qaScore: 82,
      qaResult: '合规',
      riskAlerts: [],
      matchmakerNotes: '付费意愿较低，更适合进入年轻版线上互选社群沉淀。',
      transcript: []
    },
    {
      id: 'L10008',
      name: '吴承翰',
      gender: '男',
      age: 38,
      phone: '136****5512',
      city: '杭州·拱墅区',
      education: '武汉大学·本科',
      occupation: '离异创业公司CEO',
      annualIncome: '150万+',
      housingStatus: '西湖区独栋排屋',
      carStatus: '奔驰S级',
      tier: 'A',
      intentScore: 82,
      status: 'claimed',
      sourceChannel: '商会会员转介绍',
      assignedMatchmaker: '林晓梅 (资深红娘组长)',
      callDuration: '3分30秒',
      callTime: '2026-08-19 14:00',
      tags: ['离异无孩', '事业成功人士', '渴望真诚陪伴', '高付费能力'],
      mateRequirement: {
        ageRange: '28-34岁',
        height: '165cm+',
        education: '统招本科',
        income: '不限',
        coreReq: '未婚或离异无孩均可，真诚善良，懂得情绪共鸣'
      },
      qaScore: 91,
      qaResult: '合规',
      riskAlerts: [],
      matchmakerNotes: '离异无孩，个人资产千万以上，急切寻找灵魂伴侣，已签约年度黑钻定制会员。',
      transcript: []
    },
    {
      id: 'L10009',
      name: '孙敏儿',
      gender: '女',
      age: 27,
      phone: '159****8871',
      city: '杭州·滨江区',
      education: '华中科技大学·本科',
      occupation: '海康威视嵌入式算法工程师',
      annualIncome: '30-38万',
      housingStatus: '已购滨江期房',
      carStatus: '比亚迪汉',
      tier: 'S',
      intentScore: 91,
      status: 'wecom_added',
      sourceChannel: '知乎名企专栏',
      assignedMatchmaker: '周敏 (白领专属红娘)',
      callDuration: '3分15秒',
      callTime: '2026-08-19 10:45',
      tags: ['工科女学霸', '圈子窄', '性格直爽', '急需脱单'],
      mateRequirement: {
        ageRange: '27-32岁',
        height: '175cm+',
        education: '理工科重点本科',
        income: '30万+',
        coreReq: '在杭技术研发人员优先，爱运动生活规律'
      },
      qaScore: 97,
      qaResult: '合规',
      riskAlerts: [],
      matchmakerNotes: '非常认可AI匹配的高效度，已加企微，系统推荐了张宇轩与周逸飞两位嘉宾，女生很满意。',
      transcript: []
    },
    {
      id: 'L10010',
      name: '刘建平',
      gender: '男',
      age: 42,
      phone: '135****0019',
      city: '杭州·临平区',
      education: '专科',
      occupation: '临平汽配维修店老板',
      annualIncome: '20-30万',
      housingStatus: '临平自住房一套',
      carStatus: '大众帕萨特',
      tier: 'D',
      intentScore: 32,
      status: 'refused',
      sourceChannel: '快手短视频挂载表单',
      assignedMatchmaker: '系统自动归档',
      callDuration: '0分28秒',
      callTime: '2026-08-19 09:12',
      tags: ['态度粗暴', '非目标客群', '多次打断AI'],
      mateRequirement: {
        ageRange: '20-25岁',
        height: '168cm+',
        education: '不限',
        income: '不限',
        coreReq: '年轻漂亮未婚'
      },
      qaScore: 68,
      qaResult: 'AI优雅兜底挂机',
      riskAlerts: ['辱骂敏感词拦截', '非目标客群熔断'],
      matchmakerNotes: '用户言语轻佻，AI触发智能反骚扰机制并在30秒内礼貌结束通话，自动拉入勿扰名单。',
      transcript: [
        { role: 'ai', time: '00:02', text: '您好刘先生，这里是知缘智能婚恋...', sentiment: 'neutral', tag: '开场' },
        { role: 'user', time: '00:06', text: '别废话，你们那有没有二十出头的美女？没有别烦我！', sentiment: 'negative', tag: '不文明用语' },
        { role: 'ai', time: '00:14', text: '知缘实行严格的实名制双向匹配与严肃婚恋准则，感谢您的接听，祝您生活愉快，再见。', sentiment: 'neutral', tag: '触发合规安全挂断' }
      ]
    },
    {
      id: 'L10011',
      name: '何雨桐',
      gender: '女',
      age: 29,
      phone: '177****6623',
      city: '杭州·西湖区',
      education: '中国美术学院·硕士',
      occupation: '独立艺术策展人/美院客座讲师',
      annualIncome: '35-50万',
      housingStatus: '转塘LOFT艺术工作室一套',
      carStatus: '沃尔沃XC40',
      tier: 'A',
      intentScore: 89,
      status: 'claimed',
      sourceChannel: '小红书品牌专区·高知美学脱单',
      assignedMatchmaker: '苏雨薇 (高端定制红娘)',
      callDuration: '3分40秒',
      callTime: '2026-08-19 15:10',
      tags: ['美院硕士', '文艺高雅', '注重精神审美', '希望对方懂艺术或建筑'],
      mateRequirement: {
        ageRange: '29-35岁',
        height: '176cm+',
        education: '国内外重点名校硕士',
        income: '30万+',
        coreReq: '建筑师/高校教师/金融投研，审美能力强，有共同精神世界'
      },
      qaScore: 96,
      qaResult: '合规',
      riskAlerts: [],
      matchmakerNotes: '红娘苏雨薇已推荐海归投顾周逸飞与架构师张宇轩，女方对周逸飞的艺术策展背景表现出极大兴趣。',
      transcript: []
    },
    {
      id: 'L10012',
      name: '陈冠宇',
      gender: '男',
      age: 33,
      phone: '189****1108',
      city: '杭州·滨江区',
      education: '复旦大学·硕士',
      occupation: '生物医药创投基金投资总监',
      annualIncome: '90-120万',
      housingStatus: '奥体板块核心江景房',
      carStatus: '保时捷Taycan',
      tier: 'S',
      intentScore: 95,
      status: 'wecom_added',
      sourceChannel: '复旦校友会专项外呼计划',
      assignedMatchmaker: '林晓梅 (资深红娘组长)',
      callDuration: '4分30秒',
      callTime: '2026-08-19 16:00',
      tags: ['复旦硕士', '金融高管', '资产雄厚', '高意愿寻找高知伴侣'],
      mateRequirement: {
        ageRange: '26-30岁',
        height: '165-172cm',
        education: '985或海外名校',
        income: '20万+',
        coreReq: '知性得体，工作在医疗/高校/外企大厂，情商高'
      },
      qaScore: 99,
      qaResult: '五星标杆录音',
      riskAlerts: [],
      matchmakerNotes: 'AI红娘匹配了浙大硕士陈若云，双方名校背景高度吻合，已互推脱敏信息卡，男女双方均表示惊叹AI的精准度。',
      transcript: []
    },
    {
      id: 'L10013',
      name: '周雅琴',
      gender: '女',
      age: 0,
      phone: '152****3344',
      city: '杭州',
      education: '',
      occupation: '',
      annualIncome: '',
      housingStatus: '',
      carStatus: '',
      tier: 'D',
      intentScore: 0,
      status: 'pending',
      sourceChannel: '线下相亲会登记(仅号码)',
      assignedMatchmaker: '待分配',
      callDuration: '未拨打',
      callTime: '—',
      tags: ['待补全画像', '仅电话号码'],
      mateRequirement: { ageRange: '未采集', height: '未采集', education: '未采集', income: '未采集', coreReq: '待首次通话后由AI提取择偶偏好' },
      qaScore: 0,
      qaResult: '未质检',
      riskAlerts: [],
      matchmakerNotes: '线下展会登记仅留下电话号码，画像信息待补全：可手动编辑，或由AI外呼通话自动提取。',
      transcript: []
    },
    {
      id: 'L10014',
      name: '吴先生',
      gender: '男',
      age: 0,
      phone: '158****9907',
      city: '杭州',
      education: '',
      occupation: '',
      annualIncome: '',
      housingStatus: '',
      carStatus: '',
      tier: 'D',
      intentScore: 0,
      status: 'pending',
      sourceChannel: '抖音信息流(仅号码)',
      assignedMatchmaker: '待分配',
      callDuration: '未拨打',
      callTime: '—',
      tags: ['待补全画像', '仅电话号码', '姓名不完整'],
      mateRequirement: { ageRange: '未采集', height: '未采集', education: '未采集', income: '未采集', coreReq: '待首次通话后由AI提取择偶偏好' },
      qaScore: 0,
      qaResult: '未质检',
      riskAlerts: [],
      matchmakerNotes: '抖音表单仅回传手机号与姓氏，姓名、年龄、职业等均待补全。',
      transcript: []
    },
    {
      id: 'L10015',
      name: '陈先生',
      gender: '男',
      age: 31,
      phone: '137****6652',
      city: '杭州',
      education: '本科',
      occupation: '',
      annualIncome: '',
      housingStatus: '',
      carStatus: '',
      tier: 'C',
      intentScore: 0,
      status: 'pending',
      sourceChannel: '朋友圈广告(信息不完整)',
      assignedMatchmaker: '待分配',
      callDuration: '未拨打',
      callTime: '—',
      tags: ['待补全画像', '职业未采集', '收入未采集'],
      mateRequirement: { ageRange: '未采集', height: '未采集', education: '未采集', income: '未采集', coreReq: '待首次通话后由AI提取择偶偏好' },
      qaScore: 0,
      qaResult: '未质检',
      riskAlerts: [],
      matchmakerNotes: '表单回传了年龄与学历，但职业、收入、房车与择偶偏好缺失，需补全。',
      transcript: []
    }
  ],

  // 6 Active Outbound Campaigns
  campaigns: [
    {
      id: 'CAMP-202608-01',
      name: '【高知名校】浙大/复旦/交大硕博青年才俊外呼专线',
      type: '名校菁英',
      status: 'running', // running, paused, completed, draft
      totalLeads: 1200,
      calledCount: 846,
      connectedCount: 685,
      connectRate: '80.9%',
      highIntentCount: 228,
      wecomAddedCount: 174,
      aiPersona: '晓晴 (知性亲和·高知红娘)',
      voiceType: '声音克隆-林晓梅(柔和专业)',
      concurrency: 30,
      dailySchedule: '09:30 - 11:45, 14:00 - 18:30',
      progress: 70.5
    },
    {
      id: 'CAMP-202608-02',
      name: '【大厂IT专场】滨江&未科互联网大厂单身工程师破冰计划',
      type: '大厂白领',
      status: 'running',
      totalLeads: 2500,
      calledCount: 1650,
      connectedCount: 1188,
      connectRate: '72.0%',
      highIntentCount: 362,
      wecomAddedCount: 245,
      aiPersona: '思语 (活力热情·年轻红娘)',
      voiceType: '标准女声-甜美知心',
      concurrency: 50,
      dailySchedule: '10:00 - 12:00, 14:30 - 20:30',
      progress: 66.0
    },
    {
      id: 'CAMP-202608-03',
      name: '【体制编制专区】杭城公立中小学女教师&公务员精准邀约',
      type: '稳定编制',
      status: 'running',
      totalLeads: 800,
      calledCount: 780,
      connectedCount: 639,
      connectRate: '81.9%',
      highIntentCount: 215,
      wecomAddedCount: 180,
      aiPersona: '慧心 (成熟稳重·金牌顾问)',
      voiceType: '专业女声-严谨优雅',
      concurrency: 20,
      dailySchedule: '09:00 - 11:30, 14:00 - 17:30',
      progress: 97.5
    },
    {
      id: 'CAMP-202608-04',
      name: '【高端商会定制】江浙沪千万级青年企业家婚恋专项',
      type: '财富精英',
      status: 'paused',
      totalLeads: 300,
      calledCount: 120,
      connectedCount: 88,
      connectRate: '73.3%',
      highIntentCount: 38,
      wecomAddedCount: 31,
      aiPersona: '优雅导师 (高端私享会定制)',
      voiceType: '知性沉稳-商务女声',
      concurrency: 10,
      dailySchedule: '14:30 - 17:00',
      progress: 40.0
    },
    {
      id: 'CAMP-202608-05',
      name: '【小红书种草潜客】优质单身女性线下沙龙邀约专场',
      type: '社媒流量转化',
      status: 'running',
      totalLeads: 1500,
      calledCount: 620,
      connectedCount: 434,
      connectRate: '70.0%',
      highIntentCount: 128,
      wecomAddedCount: 96,
      aiPersona: '思语 (活力热情·年轻红娘)',
      voiceType: '甜美自然女声',
      concurrency: 25,
      dailySchedule: '10:30 - 19:30',
      progress: 41.3
    },
    {
      id: 'CAMP-202608-06',
      name: '【沉睡潜客唤醒】历史注册未到店高意愿线索二次激活',
      type: '私域促活',
      status: 'draft',
      totalLeads: 3200,
      calledCount: 0,
      connectedCount: 0,
      connectRate: '0%',
      highIntentCount: 0,
      wecomAddedCount: 0,
      aiPersona: '晓晴 (知性亲和·高知红娘)',
      voiceType: '声音克隆-林晓梅(柔和专业)',
      concurrency: 40,
      dailySchedule: '14:00 - 19:00',
      progress: 0
    }
  ],

  // AI Persona & Script Knowledge Base Config
  scriptRules: {
    greeting: '您好{name}{title}，我是知缘AI红娘助理{botName}～看到您前天在{channel}提交的脱单卡片，请问现在方便两分钟核对下择偶偏好吗？',
    objectionHandling: [
      {
        keyword: '你们是不是骗子/中介',
        reply: '请您完全放心！知缘是杭州正规民政备案婚恋机构，所有入库会员均需进行公安部实名身份核验与学历学信网核验，今天主要是系统为您初步初筛同频嘉宾，不收取任何初始费用呢～'
      },
      {
        keyword: '我现在很忙没时间',
        reply: '好的非常理解您工作忙碌！我这就把为您精选的3位同名校/大厂嘉宾脱敏卡片发送到您微信，您空闲时随手看一眼就行，不耽误您时间～'
      },
      {
        keyword: '我已经有对象了',
        reply: '哇真的太替您开心了！恭喜您找到心仪的另一半，我立刻为您在系统注销脱单登记，祝你们幸福美满，打扰您啦～'
      },
      {
        keyword: '你们是怎么知道我电话的',
        reply: '这是您于{sourceTime}在{channel}点击预约的脱单测评通道，我们严格遵循隐私保护法，全程加密传输，绝不向第三方透露您的隐私。'
      }
    ],
    wecomHooks: [
      '系统里正好有几位和您同名校/同大厂的嘉宾，稍后让资深红娘老师微信发您资料参考',
      '本周末在西溪湿地有一场30人的名校IT海归草坪冷餐沙龙，我微信把邀请函与嘉宾手册发您'
    ]
  },

  // Toast and Modal notification helpers
  showToast(message, type = 'success') {
    const root = document.getElementById('toast-root');
    if (!root) return;
    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;
    
    let icon = '✓';
    if (type === 'info') icon = 'ℹ';
    if (type === 'warning') icon = '⚠';
    if (type === 'danger') icon = '✕';

    toast.innerHTML = `
      <div style="font-weight: 800; font-size: 16px;">${icon}</div>
      <div style="flex:1; font-size: 13px; font-weight: 600; color: var(--text-main);">${message}</div>
    `;
    root.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  },

  // ── 跨页面共享联动层 (Mock 状态总线 · 前端复刻时替换为真实 API 层) ──
  shared: {
    // 名单导入池 (标准100样本口径: 导入100 / 待审20 / 通过80 / 退订2 / 黑名单3 / 可外呼80)
    importPool: { total: 100, pending: 20, approved: 80, blacklist: 3, unsub: 2, dup: 5, formatErr: 2 },
    // 合规台账 (compliance.js 加载时注册, 跨页操作实时写入)
    authRecords: [],
    blacklist: [],
    unsubscribes: [],
    violations: [],
    // 操作审计流 (audit.js 读取展示, 所有关键操作实时追加)
    auditLogs: []
  },

  // 审计日志: 所有关键操作统一留痕, 前端复刻时对应 POST /api/audit-logs
  recordAudit(module, action, object, result, detail) {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const stamp = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    this.shared.auditLogs.unshift({
      id: 'AUD-' + Date.now().toString(36),
      time: stamp,
      operator: '林总监',
      role: '运营总监',
      module,
      action,
      object,
      result,
      detail,
      ip: '192.168.1.***'
    });
    if (this.shared.auditLogs.length > 80) this.shared.auditLogs.length = 80;
  },

  // 名单池联动: 审核通过/驳回时同步 importPool 数字
  updateImportPool(delta) {
    const p = this.shared.importPool;
    ['approved', 'pending', 'blacklist', 'unsub', 'total'].forEach(k => {
      if (delta[k] !== undefined) p[k] = Math.max(0, (p[k] || 0) + delta[k]);
    });
    p.available = p.approved;
  },

  // 根据通话/审核记录匹配潜客实体 (先姓名+年龄, 再脱敏手机号)
  resolveLead({ name, age, phone }) {
    if (!name) return null;
    const byName = this.leads.filter(l => l.name === name);
    if (byName.length === 1) return byName[0];
    if (phone) {
      const byPhone = this.leads.find(l => l.phone === phone);
      if (byPhone) return byPhone;
    }
    return byName.length > 0 ? byName[0] : null;
  },

  // 意向分 ≥85 自动进入高意向组 (联动 leads 评级)
  applyIntentGrade(lead, score) {
    if (!lead) return null;
    lead.intentScore = score;
    if (score >= 85 && lead.tier !== 'S' && lead.tier !== 'A') {
      lead.tier = 'A';
      lead.status = 'pending_claim';
      this.recordAudit('意向评分', '自动升级', `${lead.name} (${lead.id})`, '成功', `AI 意向分 ${score} ≥85，自动进入高意向组并推送红娘待办`);
    }
    return lead.tier;
  },

  // 画像完整度计算: 按关键字段加权评分 (0-100), 用于"信息不全"筛选与补全提示
  leadCompleteness(lead) {
    if (!lead) return 0;
    const weight = {
      name: 12, age: 8, gender: 5, education: 12, occupation: 15, annualIncome: 12,
      housingStatus: 8, carStatus: 5, city: 5, coreReq: 14, callDuration: 4
    };
    let score = 0;
    const has = v => v !== undefined && v !== null && String(v).trim() !== '' && String(v) !== '—' && String(v) !== '未采集' && String(v) !== '未拨打';
    Object.entries(weight).forEach(([k, w]) => {
      let v = lead[k];
      if (k === 'coreReq') v = lead.mateRequirement && lead.mateRequirement.coreReq;
      if (has(v)) score += w;
    });
    return Math.min(100, score);
  },

  // 手动补全画像: 保存编辑字段 → 重算完整度 → 审计留痕
  updateLeadProfile(lead, patch) {
    if (!lead) return null;
    Object.keys(patch).forEach(k => {
      if (patch[k] !== undefined) lead[k] = patch[k];
    });
    if (patch.mateRequirement && lead.mateRequirement) {
      Object.keys(patch.mateRequirement).forEach(k => {
        if (patch.mateRequirement[k] !== undefined) lead.mateRequirement[k] = patch.mateRequirement[k];
      });
    }
    // 标签维护
    if (lead.tags && lead.tags.includes('待补全画像')) {
      const remaining = this.leadCompleteness(lead);
      if (remaining >= 60) {
        lead.tags = lead.tags.filter(t => !['待补全画像', '仅电话号码', '姓名不完整'].includes(t));
      }
    }
    const completeness = this.leadCompleteness(lead);
    this.recordAudit('名单管理', '手动补全画像', `${lead.name} (${lead.id})`, '成功', `完整度 ${completeness}%，补全字段：${Object.keys(patch).join('、')}`);
    return completeness;
  },

  // 退订: 潜客冻结 + 合规台账留痕 (不可再次加入任务)
  optOutLead(lead, source = '通话中') {
    if (!lead) return null;
    lead.status = 'refused';
    lead.tier = 'D';
    const phone = lead.phone || '***';
    this.shared.unsubscribes.unshift({
      id: 'UN' + Date.now().toString(36).toUpperCase().slice(-8),
      leadName: lead.name,
      gender: lead.gender,
      age: lead.age,
      phone,
      channel: source,
      quote: '客户明确表示不需要婚恋服务，要求停止联系（演示操作）',
      status: '已处理',
      regTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
      operator: '运营总监'
    });
    // 同步进黑名单台账
    this.shared.blacklist.unshift({
      id: 'BL' + Date.now().toString(36).toUpperCase().slice(-8),
      leadName: lead.name,
      gender: lead.gender,
      age: lead.age,
      phone,
      type: '明确拒接',
      reason: '客户明确退订（演示操作），禁止再次外呼',
      addTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
      source: '人工标记'
    });
    this.updateImportPool({ unsub: 1, approved: -1 });
    this.recordAudit('退订管理', '登记退订', `${lead.name} (${lead.id})`, '成功', `已冻结号码 ${phone} 并写入退订台账与黑名单`);
    return lead;
  },

  // 转人工: 生成红娘待办 (红娘工作台看板实时可见)
  transferToMatchmaker(lead, note = 'AI初筛高意向，需人工承接') {
    if (!lead) return null;
    lead.status = lead.status === 'wecom_added' ? lead.status : 'claimed';
    lead.assignedMatchmaker = lead.assignedMatchmaker && !lead.assignedMatchmaker.includes('待分配')
      ? lead.assignedMatchmaker
      : '林晓梅 (资深红娘组长)';
    lead.transferNote = note;
    this.recordAudit('转人工', '转派红娘', `${lead.name} (${lead.id})`, '成功', `${note} · 承接人 ${lead.assignedMatchmaker}`);
    return lead;
  },

  // 企微加粉: 状态回写
  markWecomAdded(lead) {
    if (!lead) return null;
    lead.status = 'wecom_added';
    this.recordAudit('企微加粉', '添加成功', `${lead.name} (${lead.id})`, '成功', '企业微信好友添加成功，进入破冰跟进');
    return lead;
  },

  // 新建外呼任务: 任务列表与驾驶舱实时联动
  createCampaign(opts) {
    const count = this.campaigns.length + 1;
    const campaign = {
      id: 'CAMP-' + new Date().getFullYear() + '-N' + String(count).padStart(2, '0'),
      name: opts.name || '新建外呼任务',
      type: opts.type || '自定义',
      status: opts.status || 'running',
      totalLeads: opts.totalLeads || 0,
      calledCount: 0,
      connectedCount: 0,
      connectRate: '0%',
      highIntentCount: 0,
      wecomAddedCount: 0,
      aiPersona: opts.persona || '晓晴 (知性亲和·高知红娘)',
      voiceType: opts.voice || '标准女声-甜美知心',
      concurrency: opts.concurrency || 20,
      dailySchedule: '09:30 - 11:45, 14:00 - 18:30',
      progress: 0
    };
    this.campaigns.unshift(campaign);
    this.recordAudit('外呼任务', '创建并启动', campaign.id, '成功', `「${campaign.name}」有效名单 ${campaign.totalLeads} 条`);
    return campaign;
  },

  // 任务启停/终止: 任务列表 + 驾驶舱 + 监控页三端联动
  updateCampaignStatus(id, status) {
    const c = this.campaigns.find(x => x.id === id);
    if (!c) return null;
    c.status = status;
    const label = status === 'running' ? '启动' : status === 'paused' ? '暂停' : '终止';
    this.recordAudit('外呼任务', label, c.id, '成功', `「${c.name.slice(0, 20)}…」状态已更新为 ${status}`);
    return c;
  },

  // 质检复核结果回写: 联动质检中心与通话记录
  writebackQA(recordId, score, note, reviewer) {
    this.recordAudit('智能质检', '人工复核', recordId, '成功', `${note || '复核完成'} · 修正后得分 ${score}`);
  },

  // Active Lead Drawer
  activeDrawerLead: null,
  openLeadDrawer(leadId) {
    const lead = this.leads.find(l => l.id === leadId);
    if (!lead) return;
    this.activeDrawerLead = lead;
    renderLeadDrawer(lead);
  },
  closeLeadDrawer() {
    this.activeDrawerLead = null;
    const drawer = document.getElementById('lead-drawer-container');
    if (drawer) drawer.classList.remove('open');
  }
};
