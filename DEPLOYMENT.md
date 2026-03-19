# 部署指南

## 部署平台对比

| 平台 | 支持 API | 免费额度 | 推荐度 | 说明 |
|------|---------|--------|------|------|
| **Vercel** | ✅ | 充足 | ⭐⭐⭐⭐⭐ | 最佳选择，完全支持 Next.js |
| **GitHub Pages** | ❌ | 无限 | ⭐ | 仅支持静态网站，不适合此项目 |
| **Railway** | ✅ | $5/月 | ⭐⭐⭐⭐ | 简单易用，支持 Node.js |
| **Render** | ✅ | 有限 | ⭐⭐⭐⭐ | 免费层有限制 |
| **Fly.io** | ✅ | $3/月 | ⭐⭐⭐ | 全球部署，性能好 |

## 方案 1：Vercel 部署（推荐）

### 前置要求
- GitHub 账户
- Vercel 账户（免费）

### 部署步骤

#### 1. 推送代码到 GitHub
```bash
git add .
git commit -m "chore(release): Release version 1.0.0"
git push origin main
```

#### 2. 连接 Vercel
1. 访问 [vercel.com](https://vercel.com)
2. 点击 "New Project"
3. 选择 "Import Git Repository"
4. 选择 `gh-social-graph` 仓库
5. 点击 "Import"

#### 3. 配置项目
- **Framework Preset**: Next.js（自动检测）
- **Root Directory**: ./（默认）
- **Build Command**: `pnpm build`（自动）
- **Output Directory**: `.next`（自动）

#### 4. 配置环境变量（可选）
在 Vercel 项目设置中添加：
```
GITHUB_TOKEN=your_personal_access_token
```

> 💡 **提示**：不配置 token 也能用，但 API 限制为 60 次/小时

#### 5. 部署
- 点击 "Deploy"
- 等待构建完成（通常 2-3 分钟）
- 获得自动生成的 URL

### 优势
- ✅ 零配置，自动部署
- ✅ 每次 push 自动更新
- ✅ 免费 SSL 证书
- ✅ 全球 CDN
- ✅ 性能监控
- ✅ 预览部署

### 成本
- 免费：足够个人项目使用
- Pro：$20/月（如需更多资源）

---

## 方案 2：Railway 部署

### 前置要求
- GitHub 账户
- Railway 账户（免费）

### 部署步骤

#### 1. 连接 Railway
1. 访问 [railway.app](https://railway.app)
2. 点击 "New Project"
3. 选择 "Deploy from GitHub"
4. 授权并选择 `gh-social-graph` 仓库

#### 2. 配置环境
Railway 会自动检测 Node.js 项目

#### 3. 添加环境变量
在 Railway 项目中添加：
```
GITHUB_TOKEN=your_personal_access_token
NODE_ENV=production
```

#### 4. 部署
- 点击 "Deploy"
- 等待构建完成
- 获得公开 URL

### 成本
- 免费：$5/月额度
- 超出后按使用量计费

---

## 方案 3：GitHub Pages + 外部 API

如果想用 GitHub Pages 部署前端，需要分离前后端。

### 前端部署到 GitHub Pages
```bash
# 1. 修改 next.config.ts
# 添加 output: 'export' 配置

# 2. 构建静态网站
pnpm build

# 3. 部署到 GitHub Pages
# 使用 gh-pages 包或手动上传 out/ 目录
```

### 后端 API 部署到 Vercel
```bash
# 1. 创建 api/ 目录
# 2. 提取 /api/analyze 路由
# 3. 部署到 Vercel Serverless Functions
```

### 配置前端调用外部 API
```typescript
// 修改 src/app/page.tsx
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const response = await fetch(`${API_URL}/api/analyze`, {
  method: 'POST',
  // ...
});
```

---

## 环境变量配置

### 必需变量
无（可选配置）

### 可选变量
```env
# GitHub API Token（提高速率限制）
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx

# 环境标识
NODE_ENV=production

# 日志级别
LOG_LEVEL=info
```

### 获取 GitHub Token
1. 访问 [github.com/settings/tokens](https://github.com/settings/tokens)
2. 点击 "Generate new token"
3. 选择 "Personal access tokens (classic)"
4. 勾选 `public_repo` 和 `user` 权限
5. 生成并复制 token
6. 在部署平台添加为环境变量

---

## 性能优化

### 1. 构建优化
```bash
# 分析构建大小
pnpm build --analyze

# 启用 SWR（Stale-While-Revalidate）
# 在 API 路由中添加缓存头
```

### 2. 运行时优化
```typescript
// 在 src/app/api/analyze/route.ts 中添加
export const revalidate = 3600; // 1 小时缓存
```

### 3. 前端优化
- 使用 dynamic import 加载 ForceGraph2D
- 启用图片优化
- 使用 Next.js Image 组件

---

## 监控和日志

### Vercel
- 自动收集日志
- 访问 Vercel Dashboard 查看
- 支持集成 Sentry 等监控工具

### Railway
- 实时日志查看
- 性能指标监控
- 支持集成第三方工具

---

## 自定义域名

### Vercel
1. 在项目设置中选择 "Domains"
2. 添加自定义域名
3. 按照指示配置 DNS

### Railway
1. 在项目设置中选择 "Custom Domain"
2. 添加域名
3. 配置 DNS 记录

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

1. **本地测试**
   ```bash
   pnpm install
   pnpm dev
   # 测试所有功能
   ```

2. **代码提交**
   ```bash
   git add .
   git commit -m "feat: Add feature"
   git push origin main
   ```

3. **部署到 Vercel**
   - 自动触发部署
   - 等待构建完成
   - 访问预览 URL

4. **生产验证**
   - 测试所有功能
   - 检查性能
   - 监控错误日志

5. **发布版本**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

---

## 常见问题

### Q: 可以用 GitHub Pages 吗？
A: 不行。GitHub Pages 只支持静态网站，而这个项目需要后端 API 来调用 GitHub API。

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

---

## 相关资源

- [Vercel 文档](https://vercel.com/docs)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)
- [Railway 文档](https://docs.railway.app)
- [GitHub Pages 文档](https://pages.github.com)
