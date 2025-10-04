# Cloudflare Pages 部署指南

## 📋 前提条件

✅ 后端 Workers 已部署：https://voice-clone-worker-production.myaiapp.workers.dev
✅ 前端代码已准备就绪
✅ 配置文件已更新为 next.config.mjs

---

## 🚀 部署步骤

### 步骤 1：推送代码到 GitHub

#### 1.1 初始化 Git 仓库（如果还没有）

```bash
git init
git add .
git commit -m "Initial commit: Voice Clone App"
```

#### 1.2 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 仓库名称：`voice-clone-app`（或您喜欢的名称）
3. 设置为 **Private**（如果不想公开）
4. **不要**勾选"Add README"、"Add .gitignore"、"Choose a license"
5. 点击 "Create repository"

#### 1.3 推送代码

复制 GitHub 提供的命令，类似于：

```bash
git remote add origin https://github.com/您的用户名/voice-clone-app.git
git branch -M main
git push -u origin main
```

---

### 步骤 2：在 Cloudflare Pages 连接仓库

#### 2.1 登录 Cloudflare Dashboard

访问：https://dash.cloudflare.com/

#### 2.2 创建 Pages 项目

1. 左侧菜单选择 **Workers & Pages**
2. 点击 **Create application**
3. 选择 **Pages** 标签
4. 点击 **Connect to Git**

#### 2.3 授权 GitHub

1. 选择 **GitHub**
2. 授权 Cloudflare 访问您的 GitHub 账户
3. 选择仓库访问权限（可以只选择 voice-clone-app 仓库）

#### 2.4 选择仓库

1. 在列表中找到 `voice-clone-app` 仓库
2. 点击 **Begin setup**

---

### 步骤 3：配置构建设置

在 "Set up builds and deployments" 页面：

#### 3.1 基本设置

| 配置项 | 值 |
|--------|-----|
| **Project name** | `voice-clone-app`（或您喜欢的名称） |
| **Production branch** | `main` |

#### 3.2 构建配置

| 配置项 | 值 |
|--------|-----|
| **Framework preset** | Next.js (Static HTML Export) |
| **Build command** | `yarn build` |
| **Build output directory** | `out` |

#### 3.3 环境变量（重要！）

点击 **Environment variables (advanced)**，添加：

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `NEXT_PUBLIC_API_URL` | `https://voice-clone-worker-production.myaiapp.workers.dev` | Production |
| `NODE_VERSION` | `18` | Production |

> ⚠️ **注意**：使用 Node 18 而不是 22，因为构建环境更稳定

---

### 步骤 4：开始部署

1. 检查所有配置无误
2. 点击 **Save and Deploy**
3. 等待构建完成（约 2-5 分钟）

---

## ✅ 验证部署

### 构建成功后

1. Cloudflare 会提供一个 URL，类似：
   ```
   https://voice-clone-app.pages.dev
   ```

2. 点击访问，测试功能：
   - ✅ 首页正常显示
   - ✅ TTS 功能正常
   - ✅ 历史记录正常
   - ✅ 统计页面正常

### 如果构建失败

1. 点击 **View build log** 查看日志
2. 检查错误信息
3. 常见问题：
   - 环境变量未设置
   - Node 版本不兼容（改用 Node 18）
   - Build command 错误

---

## 🔄 后续更新

每次修改代码后：

```bash
git add .
git commit -m "描述您的修改"
git push
```

Cloudflare Pages 会自动检测并重新构建部署！

---

## 🌐 自定义域名（可选）

### 添加自定义域名

1. 在 Pages 项目页面，点击 **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入您的域名（例如：voice.yourdomain.com）
4. 按照提示配置 DNS 记录
5. 等待 DNS 生效（通常几分钟）

---

## 🛠️ 故障排查

### 问题：构建失败 "Module not found"

**解决**：
1. 确保 `yarn.lock` 已提交到 Git
2. 检查 build command 是否正确

### 问题：页面空白或 404

**解决**：
1. 检查 `next.config.mjs` 中 `output: 'export'` 是否存在
2. 检查 Build output directory 是否为 `out`

### 问题：API 连接失败

**解决**：
1. 检查环境变量 `NEXT_PUBLIC_API_URL` 是否正确设置
2. 测试 Workers URL 是否可访问：
   ```
   https://voice-clone-worker-production.myaiapp.workers.dev/health
   ```

### 问题：CORS 错误

**解决**：
检查 Workers 的 CORS 配置，确保允许 Pages 域名访问

---

## 📊 部署信息

| 项目 | 信息 |
|------|------|
| **前端部署** | Cloudflare Pages |
| **后端 API** | https://voice-clone-worker-production.myaiapp.workers.dev |
| **构建工具** | Next.js 14.2.18 |
| **包管理器** | Yarn |
| **Node 版本** | 18 (推荐) |

---

## 📞 需要帮助？

如果遇到问题：
1. 查看 Cloudflare Pages 构建日志
2. 查看本项目的其他文档
3. 检查 Cloudflare 官方文档

---

**创建日期**：2025-10-04  
**状态**：✅ 准备就绪，可以部署

