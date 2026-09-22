const BOOKS = {
  'life-story-book': {
    name: '人生故事书', category: '为父母、祖父母或自己', image: 'life-book-collection.webp', color: '#e6dfcf',
    card: '用一个个温柔的问题，把一生的经历变成家人可以永久珍藏的书。',
    hero: '把一生的记忆，变成', accent: '家人可以捧在手中的人生故事书。',
    lead: '那些一直想问的问题，可以成为家人永远留下的故事。Meminto 陪伴父母、祖父母或你自己，慢慢讲完一生。',
    question: '小时候，你最喜欢在哪里玩到天黑？', follow: '这件事，还有谁知道？',
    problem: '故事一直都在。', problemAccent: '只是还没有人把它写下来。',
    definition: '人生故事书是一套带有引导问题的回忆录工具。问题涵盖童年、家庭、工作、爱情、信念和人生转折；讲述者可以按自己的节奏回答，再把文字、照片、语音和视频汇成一本个人精装书。',
    prompts: ['父母为什么为你取这个名字？','你最喜欢的童年记忆是什么？','哪一句忠告一直陪着你？','你希望曾孙辈记住你什么？','人生中最勇敢的一刻是什么？','哪首歌能让你瞬间回到过去？']
  },
  'family-yearbook': {
    name: '家庭年鉴', category: '记录一家人的这一年', image: 'family-yearbook.webp', color: '#dfe6d6',
    card: '不只保存照片，也保存这一年每个瞬间背后的意义。',
    hero: '一家人的这一年，', accent: '值得成为一本书。',
    lead: '照片记录发生了什么，故事记录它为什么重要。把今年的小事、变化、笑声和传统留在同一本家庭年鉴里。',
    question: '今年，哪一个普通的周末最值得记住？', follow: '当时发生了什么，让它变得特别？',
    problem: '照片告诉我们发生过什么。', problemAccent: '故事告诉我们，那件事意味着什么。',
    definition: '家庭年鉴不只是年度照片集。它邀请每位家人回答关于这一年的问题、补充自己的视角，再把共同经历整理成可以反复翻阅的家庭记录。',
    prompts: ['今年全家笑得最开心的一次是什么？','哪一个新习惯留了下来？','孩子今年说过最有趣的话是什么？','今年最让你感到骄傲的时刻？','哪一次出发改变了我们？','明年最想一起完成什么？']
  },
  'memorial-book': {
    name: '纪念册', category: '纪念生命中重要的人', image: 'memorial-book.webp', color: '#d9ddd7',
    card: '邀请家人一起收集关于同一个人的故事，让熟悉的声音不被时间带走。',
    hero: '愿他的故事，', accent: '不随离去而消散。',
    lead: '回忆仍然在那里，只是声音正在慢慢变轻。把家人各自记得的瞬间、照片与录音，汇成一本共同的纪念册。',
    question: '遇到麻烦时，他最常说的一句话是什么？', follow: '你还记得他说这句话时的样子吗？',
    problem: '记忆还在。', problemAccent: '只是随着时间，越来越少被说起。',
    definition: '纪念册不是普通相册。它收集亲友对同一个人的不同记忆，让习惯、口头禅、人生选择和珍贵录音都找到自己的位置，并成为可以传给下一代的家庭故事。',
    prompts: ['他最让人安心的习惯是什么？','你们第一次见面在哪里？','哪道菜会让你想起他？','他教会你最重要的事是什么？','哪段录音你一直舍不得删除？','希望下一代怎样认识他？']
  },
  'wedding-guest-book': {
    name: '婚礼故事书', category: '婚礼与纪念日', image: 'wedding-book.webp', color: '#eadbd4',
    card: '收集亲友眼中的婚礼、祝福与幕后瞬间，比传统签到簿留下更多故事。',
    hero: '你们的婚礼有一百种视角，', accent: '把它们都收藏起来。',
    lead: '传统签到簿留下名字和祝福，Meminto 留下完整故事。让每位宾客通过二维码讲述他们眼中的你们。',
    question: '你第一次意识到他们很适合彼此，是什么时候？', follow: '也许，这段故事新人自己从未听过。',
    problem: '一场婚礼有很多瞬间。', problemAccent: '新人只看见了其中一小部分。',
    definition: '婚礼故事书让宾客通过手机回答问题、上传照片或录音，把祝福、幕后趣事和共同回忆汇成一本全彩精装书。婚礼当天没来得及看见的，都能在以后重新发现。',
    prompts: ['你第一次见到新郎或新娘是什么时候？','哪件小事最能代表他们的感情？','今天让你最感动的瞬间？','给十年后的他们一句话？','你拍到但新人可能没看到的画面？','他们最适合一起完成什么梦想？']
  },
  'childhood-memory-book': {
    name: '童年回忆书', category: '为孩子记录最初的岁月', image: 'childhood-book.webp', color: '#e7dfcc',
    card: '照片会留下模样，这本书替孩子保存照片背后的故事。',
    hero: '最初的那些年，', accent: '成为孩子自己的故事。',
    lead: '你已经拍了很多照片，但照片背后的声音、口头禅和小习惯更容易消失。趁记忆清晰时，把它们写下来。',
    question: '孩子第一次让全家笑到停不下来，是因为什么？', follow: '这些细节，有一天会成为最珍贵的礼物。',
    problem: '照片都还在。', problemAccent: '照片背后的故事却会慢慢模糊。',
    definition: '童年回忆书不是婴儿相册，而是一部由父母讲述的早年故事。超过 250 个问题帮助你记录出生、第一次、家庭日常、成长变化和只属于孩子的小小个性。',
    prompts: ['第一次抱起孩子时，你在想什么？','他最早学会说的词是什么？','哪个睡前仪式坚持了最久？','小时候最喜欢的玩具叫什么？','哪一刻你发现孩子突然长大了？','希望十八岁的他读到哪句话？']
  },
  'book-for-mom-and-dad': {
    name: '写给爸爸妈妈的书', category: '由孩子们共同讲述', image: 'parents-book.webp', color: '#e4e8dd',
    card: '兄弟姐妹一起回答问题，把父母陪伴我们长大的岁月送还给他们。',
    hero: '写给爸爸妈妈的家庭记忆书，', accent: '由你们共同讲述。',
    lead: '你们回答问题，爸爸妈妈收到一本真正的书。兄弟姐妹可以从不同视角讲述同一个家，一起完成这份礼物。',
    question: '小时候，我们的家对你来说是怎样的地方？', follow: '有些答案，父母也许从来没有听过。',
    problem: '最好的那些年没有消失。', problemAccent: '只是散落在每个孩子的记忆里。',
    definition: '这是一本孩子写给父母的定制记忆书。兄弟姐妹可以分别回答问题、上传照片、讲述不同记忆，最后把共同长大的岁月汇成一份全家完成的礼物。',
    prompts: ['你最喜欢妈妈做的哪道菜？','爸爸教会你的第一件事是什么？','我们的家最特别的传统？','哪一次旅行最像“我们一家人”？','长大后才理解父母的哪件事？','最想对他们说却不常说的话？']
  },
  'love-story-book': {
    name: '爱情故事书', category: '两个人、两种视角', image: 'love-story-book.webp', color: '#ead8d1',
    card: '同一段关系，从两个人的记忆出发，写成只属于彼此的爱情故事。',
    hero: '同一个故事，', accent: '两个人的记忆。',
    lead: '相爱的两个人常常记得不同的细节。分别回答同一个问题，让差异、默契与共同成长都成为故事的一部分。',
    question: '你第一次觉得“我们也许会很特别”，是什么时候？', follow: '对方记住的，会是同一个瞬间吗？',
    problem: '重要时刻一直都在。', problemAccent: '只是我们很少同时听见两个人的版本。',
    definition: '爱情故事书由伴侣共同完成。你们可以分别回答关于相识、日常、挑战和未来的问题，再把两种视角编排在同一本书中，看见关系里那些熟悉又意外的细节。',
    prompts: ['第一次见面时，你对我有什么印象？','什么时候你最确信我们是一队？','我们最不像浪漫电影的一件小事？','哪次争执让我们更了解彼此？','最喜欢我们的哪一个日常？','十年后，希望我们还在做什么？']
  },
  'youth-book': {
    name: '成长寄语书', category: '留给正在长大的孩子', image: 'childhood-book.webp', color: '#e5e0d2',
    card: '家人把回忆、祝福和人生经验写给孩子，在重要时刻交到他们手中。',
    hero: '把成长路上的声音，', accent: '留给未来的孩子。',
    lead: '由父母、祖父母和重要的人共同写下记忆与寄语，让孩子在未来仍能听见家人此刻的声音。',
    question: '你希望孩子在迷茫时，最先想起哪句话？', follow: '有些话，值得在未来被重新读到。',
    problem: '孩子一直在长大。', problemAccent: '我们想说的话也值得被好好留下。',
    definition: '成长寄语书是一份面向未来的家庭礼物。亲友可以共同回答问题、写信、上传照片与录音，在成年礼、毕业或其他重要节点交给孩子。',
    prompts: ['你第一次见到这个孩子时是什么心情？','他身上最让你欣赏的品质？','想分享给他的一次失败经历？','成年并不意味着什么？','希望他永远保留的童真？','未来遇到困难时，想对他说什么？']
  },
  'travel-book': {
    name: '旅行故事书', category: '把一次旅程完整带回家', image: 'travel-book.webp', color: '#dce5df',
    card: '不是只挑好看的照片，而是把一路上的感受、意外与改变都写进书里。',
    hero: '那段最重要的旅程，', accent: '现在成为一本书。',
    lead: '旅行结束后，照片留在手机里，故事却会慢慢变淡。用问题重新走一遍那段路，把当时的感受一起保存。',
    question: '旅途中，哪一个瞬间至今还会突然回到你脑海？', follow: '十年后翻开书，你会再次回到那里。',
    problem: '记忆都还在。', problemAccent: '只是需要有人问起，它们才会重新出现。',
    definition: '旅行故事书不是照片书。它用问题带你回忆出发前的期待、路上的意外、遇见的人和回来后的改变，并把照片、路线、语音与文字一起装订。',
    prompts: ['出发前最期待的是什么？','哪次迷路反而带来了惊喜？','旅途中最好吃的一顿饭？','遇见了谁，让你改变看法？','哪张照片背后有一段长故事？','回家后，你有什么不一样了？']
  },
  'dog-memory-book': {
    name: '爱犬回忆书', category: '记录你们共同的生活', image: 'dog-book.webp', color: '#e3ddd2',
    card: '它从来不只是一只狗。把日常、陪伴和只有你知道的小习惯留在书里。',
    hero: '你们共同的生活，', accent: '永远留在一本书里。',
    lead: '每一次散步、等待和无条件的陪伴，都是你们的共同故事。照片之外，也把叫声、视频和那些只属于你们的小事留下来。',
    question: '哪一件小事，每次想起来都会让你笑？', follow: '一只狗，从来不只是一只狗。',
    problem: '共同生活的日常很普通。', problemAccent: '所以才最容易被时间轻轻带走。',
    definition: '爱犬回忆书用专门的问题回顾相遇、成长、性格、旅行和陪伴。你可以添加叫声与视频，让纸质书不仅记录模样，也保留它真实存在过的声音。',
    prompts: ['第一次见到它时发生了什么？','它最奇怪的小习惯是什么？','哪条散步路线最熟悉？','它怎样知道你心情不好？','你们最难忘的一次旅行？','最想永远记住它的哪个表情？']
  },
  'blank-book': {
    name: '自由创作书', category: '没有预设问题的空白书', image: 'blank-book.webp', color: '#e1e5dc',
    card: '你已经知道想写什么，就从自己的章节、内容和结构开始。',
    hero: '你的内容，你的书，', accent: '不设预设问题。',
    lead: '小说、家谱、企业纪事、食谱或任何无法归类的想法。你带来内容，Meminto 让它成为一本真正的精装书。',
    question: '你已经知道最想保存的内容了吗？', follow: '很好，直接从你自己的结构开始。',
    problem: '有些内容不需要问题。', problemAccent: '它只需要一条通往成书的简单路径。',
    definition: '自由创作书保留 Meminto 的语音转文字、媒体上传、协作和自动排版能力，但不提供固定问题。你可以完全自行设置章节、标题和顺序，也可以导入已经写好的内容。',
    prompts: ['一部个人小说','家族或企业纪事','一本家庭食谱','旅行随笔合集','周年纪念册','任何值得完成的书稿']
  },
  'christian-life-story-book': {
    name: '信仰人生故事书', category: '记录信仰、恩典与见证', image: 'life-book-collection.webp', color: '#e7e2d5',
    card: '在一生的故事中，保存信仰如何陪伴、改变并塑造一个家庭。',
    hero: '把信仰、恩典与人生见证，', accent: '留给下一代。',
    lead: '通过关于家庭、祷告、转折与盼望的问题，把信仰如何贯穿一生讲给未来的家人。',
    question: '人生中，哪一次祷告的回应让你至今难忘？', follow: '这份见证，也许正是下一代需要的答案。',
    problem: '信仰活在日常里。', problemAccent: '但很多见证从未被完整讲述。',
    definition: '信仰人生故事书在人生回忆的基础上，加入关于祷告、教会、恩典、困境与盼望的引导问题，让个人见证成为可以代代传递的家庭财富。',
    prompts: ['是谁最早带你认识信仰？','哪段经文陪你走过低谷？','你经历过怎样的祷告回应？','信仰怎样影响你的家庭？','哪位同行者改变了你？','想给下一代留下怎样的祝福？']
  }
};

const base = document.body.dataset.base || './';
const page = document.body.dataset.page;
const href = path => `${base}${path}`;
const asset = name => `${base}assets/${name}`;

function headerMarkup() {
  const dark = page === 'home' ? ' dark' : '';
  const groups = [
    ['人生与成长', ['life-story-book', 'family-yearbook', 'youth-book', 'childhood-memory-book']],
    ['共同珍藏', ['memorial-book', 'book-for-mom-and-dad', 'love-story-book', 'wedding-guest-book']],
    ['属于自己的故事', ['travel-book', 'dog-memory-book', 'christian-life-story-book', 'blank-book']]
  ];
  const desktopBooks = groups.map(([title, slugs]) => `<section><p>${title}</p>${slugs.map(slug => `<a href="${href(`memory-books/${slug}/index.html`)}"><strong>${BOOKS[slug].name}</strong><span>${BOOKS[slug].card}</span></a>`).join('')}</section>`).join('');
  const mobileBooks = Object.entries(BOOKS).map(([slug, book]) => `<a href="${href(`memory-books/${slug}/index.html`)}">${book.name}</a>`).join('');
  return `<header class="site-header${dark}"><div class="shell nav-shell"><a class="brand" href="${href('index.html')}" aria-label="Meminto 首页"><img src="${asset('meminto-logo.png')}" alt="Meminto Stories"></a><nav class="main-nav" aria-label="主导航"><button class="discover-toggle" type="button" aria-expanded="false">探索记忆书 <span>⌄</span></button><a href="${href('index.html#how')}">适用场景⌄</a><a href="${href('memory-books/life-story-book/index.html')}">写自己的书⌄</a><a href="${href('index.html#reviews')}">用户故事</a><a href="${href('index.html#faq')}">帮助</a></nav><div class="nav-utility"><a href="#">我的账户</a><span class="lang">中文⌄</span><a class="btn btn-small ${page === 'home' ? 'btn-ghost' : 'btn-outline'}" href="${href('memory-books/index.html')}">开始创作</a><a class="btn btn-small ${page === 'home' ? 'btn-paper' : 'btn-dark'}" href="${href('memory-books/index.html')}">赠送一本书</a></div><button class="menu-toggle" type="button" aria-label="打开菜单" aria-expanded="false"><span></span><span></span><span></span></button></div><div class="discover-menu" aria-label="选择记忆书"><div class="shell discover-grid">${desktopBooks}<aside><p>产品能力</p><a href="${href('memory-books/life-story-book/index.html#features')}">语音转文字</a><a href="${href('memory-books/life-story-book/index.html#features')}">电话讲述</a><a href="${href('memory-books/life-story-book/index.html#features')}">音视频二维码</a><a href="${href('memory-books/life-story-book/index.html#features')}">家庭协作</a><a class="discover-all" href="${href('memory-books/index.html')}">查看全部记忆书 →</a></aside></div></div><nav class="mobile-nav"><p>选择一本记忆书</p><div class="mobile-book-grid">${mobileBooks}</div><a class="mobile-all" href="${href('memory-books/index.html')}">比较全部书型 →</a><a href="${href('index.html#how')}">使用方式</a><a href="${href('index.html#faq')}">帮助与常见问题</a></nav></header>`;
}

function footerMarkup() {
  return `<footer class="site-footer"><div class="shell footer-top"><div class="footer-brand"><img src="${asset('meminto-logo.png')}" alt="Meminto Stories"><p>让故事把家人重新带到一起。</p><p>Meminto · 留下一小片不朽</p></div><div class="newsletter"><h2>让记忆继续发生。</h2><p>接收故事灵感与产品更新，只发送你真正关心的内容。</p><form class="newsletter-form"><input type="email" aria-label="电子邮箱" placeholder="你的电子邮箱"><button class="btn btn-paper" type="submit">订阅</button></form></div></div><div class="shell footer-links"><div><strong>记忆书</strong><a href="${href('memory-books/life-story-book/index.html')}">人生故事书</a><a href="${href('memory-books/family-yearbook/index.html')}">家庭年鉴</a><a href="${href('memory-books/memorial-book/index.html')}">纪念册</a><a href="${href('memory-books/wedding-guest-book/index.html')}">婚礼故事书</a><a href="${href('memory-books/childhood-memory-book/index.html')}">童年回忆书</a></div><div><strong>更多主题</strong><a href="${href('memory-books/book-for-mom-and-dad/index.html')}">写给爸爸妈妈</a><a href="${href('memory-books/love-story-book/index.html')}">爱情故事书</a><a href="${href('memory-books/travel-book/index.html')}">旅行故事书</a><a href="${href('memory-books/dog-memory-book/index.html')}">爱犬回忆书</a></div><div><strong>了解 Meminto</strong><a href="${href('index.html#how')}">使用方式</a><a href="${href('memory-books/index.html')}">全部书型</a><a href="${href('index.html#reviews')}">用户故事</a><a href="#">博客</a></div><div><strong>支持</strong><a href="#">我的账户</a><a href="${href('index.html#faq')}">帮助中心</a><a href="${href('index.html#faq')}">常见问题</a><a href="#">线上讲座</a></div></div><div class="shell legal"><span>© 2026 Meminto Stories GmbH. 保留所有权利。</span><span>法律声明 · 隐私 · 条款 · 配送 · 支付</span></div></footer><button class="chat" type="button" aria-label="在线咨询">•••</button>`;
}

function bookCard(slug, book) {
  return `<a class="book-card" href="${href(`memory-books/${slug}/index.html`)}" style="--card-bg:${book.color}"><div class="book-card-media"><img src="${asset(book.image)}" alt="${book.name}"></div><div class="book-card-body"><p class="eyebrow">${book.category}</p><h3>${book.name}</h3><p>${book.card}</p><b>了解这本书 →</b></div></a>`;
}

function fillBookGrids() {
  document.querySelectorAll('[data-book-grid]').forEach(grid => {
    const entries = Object.entries(BOOKS);
    const selected = grid.dataset.bookGrid === 'featured' ? entries.slice(0, 6) : entries;
    grid.innerHTML = selected.map(([slug, book]) => bookCard(slug, book)).join('');
  });
}

function renderProduct() {
  const slug = document.body.dataset.product;
  const book = BOOKS[slug] || BOOKS['life-story-book'];
  document.title = `${book.name}｜Meminto 中文版`;
  const steps = [['选择适合的问题','使用为这类故事准备的问题，也可以修改、跳过或添加自己的问题。'],['轻松讲述与上传','打字、录音、视频或电话回答，选择对你和家人最自然的方式。'],['邀请家人一起完成','让不同的人补充照片、记忆与各自的视角，共同把故事讲完整。'],['设计并印成精装书','内容自动排版，你可以调整封面与细节，最后收到全彩精装成书。']];
  const prompts = book.prompts.map((prompt, index) => `<article><span>${String(index + 1).padStart(2, '0')}</span><p>${prompt}</p></article>`).join('');
  const stepCards = steps.map((item, index) => `<article><span>${String(index + 1).padStart(2, '0')}</span><h3>${item[0]}</h3><p>${item[1]}</p></article>`).join('');
  const related = Object.entries(BOOKS).filter(([key]) => key !== slug).slice(0, 3).map(([key, value]) => bookCard(key, value)).join('');
  document.querySelector('main').innerHTML = `<div class="breadcrumb shell"><a href="${href('index.html')}">首页</a><span>›</span><a href="${href('memory-books/index.html')}">记忆书</a><span>›</span><span>${book.name}</span></div><section class="product-hero"><div class="shell product-hero-grid"><div><p class="eyebrow">${book.category}</p><h1>${book.hero}<em>${book.accent}</em></h1><p class="lead">${book.lead}</p><div class="button-row"><a class="btn btn-dark" href="#purchase">把这本书送给家人</a><a class="btn btn-outline" href="#how-product">为自己开始创作</a></div><p class="trust"><span>★★★★★</span> <strong>4.8</strong> 分 · 一次购买 · 无订阅</p></div><div class="product-visual"><img src="${asset(book.image)}" alt="${book.name}精装书"><span>精装 · 全彩印刷 · 支持音视频</span></div></div></section><section class="fact-strip"><div class="shell"><span>◆ 个性化精装书</span><span>◆ iOS 与 Android 应用</span><span>◆ 可通过电话回答</span><span>◆ 文字、语音、照片和视频</span></div></section><section class="big-question"><div class="shell"><h2>${book.question}</h2><p>${book.follow}</p></div></section><section class="problem-band"><div class="shell problem-grid"><p class="eyebrow">趁故事还清晰</p><div><h2>${book.problem}<em>${book.problemAccent}</em></h2><p>从今天的一次回答开始，就能让这段记忆有一个长久的归处。</p></div></div></section><section class="section"><div class="shell definition-grid"><div><p class="eyebrow">这本书是什么？</p><h2>${book.name}，<em>让记忆一次次被重新看见。</em></h2><p>${book.definition}</p><a class="text-link" href="#how-product">看看它如何完成 →</a></div><img src="${asset(book.image)}" alt="${book.name}产品展示"></div></section><section class="section product-how" id="how-product"><div class="shell center-copy"><p class="eyebrow">使用方式</p><h2>Meminto 负责提问，<em>你只需要讲述。</em></h2><p>不必一次写完，也不必先整理好所有照片。按照自己的节奏，一步一步完成。</p></div><div class="shell step-grid">${stepCards}</div></section><section class="section product-prompts"><div class="shell center-copy"><p class="eyebrow">问题已经准备好了</p><h2>从一个问题开始，<em>故事就会自己展开。</em></h2><p>每个问题都可以保留、改写、跳过，或替换成只属于你们的问题。</p></div><div class="shell prompt-cards">${prompts}</div></section><section class="section"><div class="shell center-copy"><p class="eyebrow">讲故事可以很简单</p><h2>用你最舒服的方式，<em>留下真实的声音。</em></h2></div><div class="shell product-features"><article><i>◉</i><h3>说话就能写书</h3><p>支持多语言语音转文字，保留讲述者自己的语气和表达。</p></article><article><i>▣</i><h3>纸质书也能听见声音</h3><p>书页二维码连接原始录音与视频，家人随时可以重新听见。</p></article><article><i>✦</i><h3>温柔的 AI 辅助</h3><p>整理口语、修复旧照片、辅助排版，但不会把你的故事改成别人的。</p></article></div></section><section class="product-pricing" id="purchase"><div class="shell product-pricing-grid"><img src="${asset(book.image)}" alt="${book.name}"><div><p class="eyebrow light">选择你的${book.name}</p><h2>从第一次回答，<em>到一本真正的书。</em></h2><p>一次购买，无需订阅。根据需要选择页数、额外副本与礼赠方式。</p><ul><li>专属引导问题</li><li>文字、照片、语音和视频</li><li>最长两年创作时间</li><li>支持家人协作</li><li>个性化全彩精装书</li><li>自动排版与编辑工具</li></ul><p class="price">¥699 起</p><div class="button-row"><a class="btn btn-paper" href="#">赠送这本书</a><a class="btn btn-ghost" href="#">为自己开始</a></div></div></div></section><section class="section related"><div class="shell section-heading"><div><p class="eyebrow">也许更适合你的故事</p><h2>继续看看其他<em>记忆书。</em></h2></div><a class="text-link" href="${href('memory-books/index.html')}">查看全部 →</a></div><div class="shell book-grid">${related}</div></section><section class="final-cta"><div class="shell center-copy"><p class="eyebrow">一个问题就足够开始</p><h2>故事不需要先写完，<br><em>它只需要先开始。</em></h2><p>把讲述的邀请送给重要的人，或从今天开始保存自己的故事。</p><div class="button-row centered"><a class="btn btn-dark" href="#purchase">赠送${book.name}</a><a class="btn btn-outline" href="#how-product">开始创作</a></div></div></section>`;
}

document.head.insertAdjacentHTML('beforeend', `<style>
  .main-nav{height:100%;align-items:center}.main-nav>a,.main-nav>.discover-toggle{display:inline-flex;height:100%;align-items:center;justify-content:center;padding:0;line-height:1}.main-nav a,.main-nav button,.nav-utility a{font-size:15px;white-space:nowrap}.discover-toggle{border:0;background:transparent;color:inherit;cursor:pointer}.discover-toggle span{display:inline-block;transition:transform .22s}.discover-toggle[aria-expanded="true"] span{transform:rotate(180deg)}
  .discover-menu{position:absolute;top:72px;left:0;width:100%;background:var(--paper);color:var(--ink);border-bottom:1px solid var(--line);box-shadow:0 22px 42px rgba(33,38,30,.14);opacity:0;visibility:hidden;pointer-events:none;transform:translateY(-12px);transition:opacity .22s,transform .22s,visibility .22s}.discover-menu.open{opacity:1;visibility:visible;pointer-events:auto;transform:none}.discover-grid{display:grid;grid-template-columns:repeat(3,1fr) 210px;gap:28px;padding-block:28px}.discover-grid section>p,.discover-grid aside>p,.mobile-nav>p{margin:0 0 10px;font:800 12px Fraunces,serif;text-transform:uppercase;color:var(--gold)}.discover-grid section>a{display:block;padding:9px 10px;transition:background .2s,transform .2s}.discover-grid section>a:hover{background:var(--canvas);transform:translateX(3px)}.discover-grid strong{display:block;font:700 16px Fraunces,serif;color:var(--green)}.discover-grid span{display:block;margin-top:2px;color:var(--muted);font-size:12px;line-height:1.35}.discover-grid aside{border-left:1px solid var(--line);padding-left:26px}.discover-grid aside a{display:block;padding:5px 0;font-size:14px}.discover-grid .discover-all{margin-top:14px;font-weight:750;text-decoration:underline}
  .scroll-reveal{opacity:0;transform:translateY(28px);transition:opacity .7s ease,transform .7s ease}.scroll-reveal.is-visible{opacity:1;transform:none}.book-card{transition:transform .28s,box-shadow .28s}.book-card:hover{transform:translateY(-7px);box-shadow:0 18px 38px rgba(45,38,28,.12)}
  @media(max-width:1050px){.discover-menu{display:none}.mobile-nav>p{margin-bottom:2px}.mobile-book-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.mobile-book-grid a{border:1px solid var(--line);padding:9px 10px;font-size:13px}.mobile-all{font-weight:750;text-decoration:underline;margin:4px 0 8px}}
  @media(prefers-reduced-motion:reduce){.scroll-reveal{opacity:1;transform:none;transition:none}}
</style>`);

if (page === 'product') renderProduct();
document.body.insertAdjacentHTML('afterbegin', headerMarkup());
document.body.insertAdjacentHTML('beforeend', footerMarkup());
fillBookGrids();

const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
menuButton.addEventListener('click', () => { const open = mobileNav.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open)); });
mobileNav.addEventListener('click', () => { mobileNav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); });
const discoverButton = document.querySelector('.discover-toggle');
const discoverMenu = document.querySelector('.discover-menu');
discoverButton?.addEventListener('click', () => {
  const open = discoverMenu.classList.toggle('open');
  discoverButton.setAttribute('aria-expanded', String(open));
});
document.addEventListener('click', event => {
  if (discoverMenu && !discoverMenu.contains(event.target) && !discoverButton.contains(event.target)) {
    discoverMenu.classList.remove('open');
    discoverButton.setAttribute('aria-expanded', 'false');
  }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    discoverMenu?.classList.remove('open');
    discoverButton?.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }
});
const revealTargets = document.querySelectorAll('main section > .shell, .book-card, .feature-grid article, .product-features article');
revealTargets.forEach(target => target.classList.add('scroll-reveal'));
const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    entry.target.classList.add('is-visible');
    revealObserver.unobserve(entry.target);
  }
}), { threshold: .08, rootMargin: '0px 0px -36px' });
revealTargets.forEach(target => revealObserver.observe(target));
document.querySelector('.newsletter-form').addEventListener('submit', event => { event.preventDefault(); event.currentTarget.querySelector('button').textContent = '已订阅'; });
