# GitHub Social Graph - 部署指南

## 项目类型

这是一个 **Next.js 全栈应用**，不是 npm 包。应该部署到云平台，而不是发布到 npm。

## 推荐部署方案

### 方案 1：Vercel（最简单，推荐）⭐

Vercel 是 Next.js 的官方部署平台，提供最佳的集成和性能。

#### 步骤 1：推送代码到 GitHub

```bash
git push origin main
git push origin v1.0.0
```

#### 步骤 2：连接 Vercel

1. 访问 [vercel.com](https://vercel.com)
2. 点击 "New Project"
3. 选择 "Import Git Repository"
4. 选择 `gh-social-graph` 仓库
5. 点击 "Import"

#### 步骤 3：配置环境变量（可选）

在 Vercel 项目设置中添加：

```
GITHUB_TOKEN=your_personal_access_token
```

> 不配置也能用，但 API 限制为 60 次/小时

#### 步骤 4：部署

- 点击 "Deploy"
- 等待构建完成（通常 2-3 分钟）
- 获得自动生成的 URL

**优势：**
- ✅ 零配置
- ✅ 自动部署（每次 push 自动更新）
- ✅ 免费 SSL 证书
- ✅ 全球 CDN
- ✅ 性能监控
- ✅ 预览部署

**成本：** 免费（足够个人项目）

---

### 方案 2：Railway

简单的云部署平台，支持 Node.js 应用。

#### 步骤 1：连接 Railway

1. 访问 [railway.app](https://railway.app)
2. 点击 "New Project"
3. 选择 "Deploy from GitHub"
4. 授权并选择 `gh-social-graph` 仓库

#### 步骤 2：配置

Railway 会自动检测 Node.js 项目

#### 步骤 3：添加环境变量

```
GITHUB_TOKEN=your_personal_access_token
NODE_ENV=production
```

#### 步骤 4：部署

- 点击 "Deploy"
- 等待构建完成
- 获得公开 URL

**成本：** $5/月免费额度，超出后按使用量计费

---

### 方案 3：Render

另一个简单的部署平台。

#### 步骤 1：连接 Render

1. 访问 [render.com](https://render.com)
2. 点击 "New +"
3. 选择 "Web Service"
4. 连接 GitHub 仓库

#### 步骤 2：配置

- **Name**: gh-social-graph
- **Environment**: Node
- **Build Command**: `pnpm install && pnpm build`
- **Start Command**: `pnpm start`

#### 步骤 3：添加环境变量

```
GITHUB_TOKEN=your_personal_access_token
```

#### 步骤 4：部署

- 点击 "Create Web Service"
- 等待部署完成

**成本：** 免费层有限制，付费从 $7/月起

---

## 获取 GitHub Token

为了提高 API 限制，建议配置 GitHub Personal Access Token。

### 步骤

1. 访问 [github.com/settings/tokens](https://github.com/settings/tokens)
2. 点击 "Generate new token"
3. 选择 "Personal access tokens (classic)"
4. 设置名称：`gh-social-graph`
5. 勾选权限：
   - `public_repo` - 访问公开仓库
   - `user` - 访问用户信息
6. 点击 "Generate token"
7. 复制 token（只显示一次）
8. 在部署平台添加为环境变量

### Token 权限说明

- **无 Token**：60 次请求/小时
- **有 Token**：5000 次请求/小时

---

## 部署后的配置

### 自定义域名

#### Vercel

1. 在项目设置中选择 "Domains"
2. 添加自定义域名
3. 按照指示配置 DNS

#### Railway / Render

1. 在项目设置中找到 "Custom Domain"
2. 添加域名
3. 配置 DNS 记录

### 监控和日志

#### Vercel

- 自动收集日志
- 访问 Vercel Dashboard 查看
- 支持集成 Sentry 等监控工具

#### Railway

- 实时日志查看
- 性能指标监控

#### Render

- 日志查看
- 性能监控

---

## 故障排查

### 构建失败

```bash
# 本地测试构建
pnpm build

# 检查依赖
pnpm install

# 检查 TypeScript 错误
pnpm ts-check
```

### API 错误

- 检查环境变量是否正确配置
- 查看部署平台的日志
- 测试 GitHub API 连接

### 性能问题

- 检查网络请求
- 分析构建大小
- 优化图谱渲染

---

## 推荐部署流程

### 1. 本地测试

```bash
pnpm install
pnpm dev
# 测试所有功能
```

### 2. 代码提交

```bash
git add .
git commit -m "feat: Add feature"
git push origin main
```

### 3. 部署到 Vercel

- 自动触发部署
- 等待构建完成
- 访问预览 URL

### 4. 生产验证

- 测试所有功能
- 检查性能
- 监控错误日志

### 5. 发布版本

```bash
git tag v1.0.1
git push origin v1.0.1
```

---

## 常见问题

### Q: 可以发布到 npm 吗？

A: 不建议。这是一个完整的应用，不是库。npm 包应该是可复用的模块。

### Q: 部署后 API 调用失败？

A: 检查：
1. 环境变量是否正确配置
2. GitHub API 速率限制
3. 网络连接

### Q: 如何更新已部署的应用？

A: 只需 push 到 GitHub，部署平台会自动更新。

### Q: 成本是多少？

A: Vercel 免费额度足够个人项目使用，无需付费。

### Q: 如何监控应用状态？

A: 使用部署平台的 Dashboard 和日志功能。

### Q: 可以离线使用吗？

A: 不行。应用需要调用 GitHub API，必须有网络连接。

---

## 下一步

1. 选择部署平台（推荐 Vercel）
2. 按照上述步骤部署
3. 配置自定义域名（可选）
4. 分享应用 URL

---

## 相关资源

- [Vercel 文档](https://vercel.com/docs)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)
- [Railway 文档](https://docs.railway.app)
- [Render 文档](https://render.com/docs)
- [GitHub API 文档](https://docs.github.com/en/rest)
