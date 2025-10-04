# 🎵 Voice Clone App

基于 Azure AI 的专业文本转语音平台，部署在 Cloudflare Workers + Pages。

## ✨ 功能特点

- 🎤 **文本转语音**: 支持 15 个高质量中文声音
- 📝 **历史记录**: 自动保存生成历史
- 📊 **统计分析**: 实时使用统计
- 🎨 **现代UI**: 基于 shadcn/ui，支持暗色模式
- 📱 **响应式**: 完美适配移动端和桌面端
- ⚡ **极速**: Cloudflare 全球 CDN 加速
- 💰 **免费**: 在免费套餐内可支撑大量请求

## 🏗️ 技术栈

### 前端
- **Next.js 15** - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **shadcn/ui** - UI 组件库
- **Cloudflare Pages** - 部署平台

### 后端
- **Cloudflare Workers** - 无服务器计算
- **Hono** - 轻量级 Web 框架
- **Cloudflare D1** - SQLite 数据库
- **Azure TTS API** - 语音合成服务

## 🚀 快速开始

### 前置要求

- Node.js >= 18
- npm 或 pnpm
- Cloudflare 账号
- Azure Speech Key

### 本地开发

1. **克隆项目**
   ```bash
   git clone https://github.com/你的用户名/voice-clone-app.git
   cd voice-clone-app
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置后端**
   ```bash
   cd workers
   
   # 创建 .dev.vars 文件
   echo 'AZURE_SPEECH_KEY="你的Azure密钥"' > .dev.vars
   
   # 初始化数据库
   npx wrangler d1 execute voice-clone-db --file=./schema.sql --local
   ```

4. **启动开发服务器**
   
   **终端 1 - 后端**:
   ```bash
   cd workers
   npx wrangler dev
   ```
   
   **终端 2 - 前端**:
   ```bash
   npm run dev
   ```

5. **访问应用**
   
   打开浏览器访问: http://localhost:3000

## 📦 部署到 Cloudflare

### 方法 A：快速部署（推荐）

查看详细步骤: [快速部署命令.md](../tts/快速部署命令.md)

### 方法 B：完整部署

查看完整指南: [Cloudflare部署完整指南.md](../tts/Cloudflare部署完整指南.md)

### 简要步骤

1. **部署后端 API**
   ```bash
   cd workers
   npx wrangler d1 create voice-clone-db-prod
   # 更新 wrangler.toml 中的 database_id
   npx wrangler d1 execute voice-clone-db-prod --file=./schema.sql --remote
   npx wrangler secret put AZURE_SPEECH_KEY --env production
   npx wrangler deploy --env production
   ```

2. **部署前端**
   ```bash
   # 创建 .env.production
   echo 'NEXT_PUBLIC_API_URL=https://你的worker.workers.dev' > .env.production
   
   npm run build
   npx wrangler pages deploy out --project-name=voice-clone-app
   ```

## 📁 项目结构

```
voice-clone-app/
├── app/                      # Next.js 页面
│   ├── page.tsx             # 首页
│   ├── tts/                 # TTS 页面
│   ├── voices/              # 声音库
│   ├── history/             # 历史记录
│   ├── stats/               # 统计分析
│   └── settings/            # 设置
├── components/              # React 组件
│   ├── features/            # 功能组件
│   │   ├── tts/            # TTS 相关
│   │   ├── home/           # 首页组件（广告轮播）
│   │   ├── history/        # 历史记录
│   │   └── stats/          # 统计图表
│   ├── layout/             # 布局组件
│   │   ├── header.tsx      # 顶部导航
│   │   └── sidebar.tsx     # 侧边栏
│   ├── shared/             # 共享组件
│   └── ui/                 # UI 基础组件
├── lib/                     # 工具库
│   ├── api/                # API 客户端
│   └── utils.ts            # 工具函数
├── workers/                 # Cloudflare Workers 后端
│   ├── src/
│   │   ├── index.ts        # 入口文件
│   │   ├── routes/         # API 路由
│   │   │   ├── tts.ts      # TTS API
│   │   │   ├── history.ts  # 历史记录 API
│   │   │   ├── voices.ts   # 声音库 API
│   │   │   └── stats.ts    # 统计 API
│   │   └── services/       # 业务服务
│   │       ├── azure-tts.service.ts    # Azure TTS
│   │       ├── database.service.ts     # 数据库服务
│   │       └── storage.service.ts      # 存储服务
│   ├── schema.sql          # 数据库结构
│   └── wrangler.toml       # Workers 配置
└── public/                  # 静态资源
```

## 🎨 可用声音

支持 15 个 Azure 中文声音：

| 声音 ID | 名称 | 性别 |
|---------|------|------|
| zh-CN-XiaoxiaoNeural | 晓晓 | 女 |
| zh-CN-YunxiNeural | 云希 | 男 |
| zh-CN-YunyangNeural | 云扬 | 男 |
| zh-CN-XiaoyiNeural | 晓伊 | 女 |
| zh-CN-YunjianNeural | 云健 | 男 |
| zh-CN-XiaochenNeural | 晓辰 | 女 |
| zh-CN-XiaohanNeural | 晓涵 | 女 |
| zh-CN-XiaomoNeural | 晓墨 | 女 |
| zh-CN-XiaoruiNeural | 晓睿 | 女 |
| zh-CN-XiaoxuanNeural | 晓萱 | 女 |
| zh-CN-YunfengNeural | 云枫 | 男 |
| zh-CN-YunhaoNeural | 云皓 | 男 |
| zh-CN-YunxiaNeural | 云夏 | 男 |
| zh-CN-YunyeNeural | 云野 | 男 |
| zh-CN-YunzeNeural | 云泽 | 男 |

## 🔧 配置说明

### 环境变量

**开发环境** (`workers/.dev.vars`):
```env
AZURE_SPEECH_KEY=你的Azure密钥
```

**生产环境** (Cloudflare Secrets):
```bash
npx wrangler secret put AZURE_SPEECH_KEY --env production
```

**前端环境** (`.env.production`):
```env
NEXT_PUBLIC_API_URL=https://你的worker.workers.dev
```

## 📊 成本估算

在 Cloudflare 免费套餐内：

- Workers: 100,000 请求/天
- D1: 5GB 存储 + 500万行读取/天
- Pages: 无限请求
- 带宽: 无限

**结论**: 个人项目和小型网站完全免费！

## 🛠️ 开发命令

```bash
# 开发
npm run dev              # 启动前端开发服务器
cd workers && npx wrangler dev  # 启动后端开发服务器

# 构建
npm run build            # 构建生产版本

# 部署
npx wrangler deploy --env production  # 部署后端
npx wrangler pages deploy out --project-name=voice-clone-app  # 部署前端

# 数据库
npx wrangler d1 execute <db-name> --file=./schema.sql --remote  # 运行迁移
npx wrangler d1 execute <db-name> --command "SELECT * FROM tts_history LIMIT 5" --remote  # 查询

# 日志
npx wrangler tail --env production  # 查看实时日志
```

## 📝 更新日志

### v1.0.0 (2025-10-04)

#### 新增
- ✨ 完整的 TTS 功能，支持 15 个中文声音
- 📝 历史记录自动保存
- 📊 使用统计和分析
- 🎨 现代化 UI 设计
- 🌙 暗色模式支持
- 📱 完整响应式布局
- 💼 首页广告轮播组件

#### 技术
- ⚡ Cloudflare Workers + Pages 部署
- 🗄️ D1 数据库集成
- 🎤 Azure TTS API 集成
- 🔒 安全的密钥管理

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

- **站长微信**: A13567894515
- **服务内容**:
  - C/C++、小程序等项目开发
  - 广告位招租

## 📄 许可证

MIT License

---

**开发者**: AI Assistant  
**维护者**: 站长  
**最后更新**: 2025-10-04
