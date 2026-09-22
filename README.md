# 智能外呼机器人 · 前端 Demo 与调研

围绕「AI 智能外呼」这个方向做的**调研 + 原型 + 对标**工作区。

---

## 仓库内容

```
├── 市场调研/                 ← 先读这里：调研结论与产品需求
│   ├── AI外拨机器人调研与落地方案（修订整合版V2.1）.docx
│   ├── AI红娘相亲潜客智能外呼业务需求规格说明书BRD-PRD V1.0.docx
│   ├── AI外拨机器人MVP产品需求草稿V0.1.docx
│   ├── AI本地知识库电话助手｜对标全套开源项目清单（可商用、带官网地址）.docx
│   ├── 原型展示与SmartCall扫描执行准则.md
│   └── 原型缺口分析与AI生成提示词.md
├── smartcall-pro/           自建原型（静态 HTML，双击 index.html 即可打开）
├── meminto-life-story-clone/  人生故事类网站的页面复刻
├── meminto-life-story.html    单页版
├── output/playwright/       竞品页面的实测截图
└── SmartCall-master/        ⚠️ 第三方开源项目，见下
```

## ⚠️ 关于 `SmartCall-master/`

这是**第三方开源项目**（SmartCall · AI 客服呼叫中心，上游 <https://qidiangk.com/>），
放在这里作为**对标参考**，不是本项目自研的代码。它的原始 `README.md` / `README.en.md`
保留在 `SmartCall-master/SmartCall-master/` 里。

出于体积考虑，以下**未包含**在本仓库：

| 内容 | 原因 |
|---|---|
| `SmartCall-master.zip`（64MB） | 打包产物，解压后内容已在上面的目录里 |
| 数据库转储（`*.sql` / `*.rar`） | 属于数据不是源码 |
| SkyWalking Agent 等第三方二进制（`*.jar`） | 应由构建或下载获得，共 197 个文件 |

> 上游项目 `application*.yml` 里的 `password: nacos` / `123456` / `jpower` 等
> 是它自带的默认配置值，不是真实凭据。

---

<sub>本仓库为单次快照，不含 git 历史。</sub>
