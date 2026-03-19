# npm 发布指南

## 重要说明

这个项目是一个 **Next.js 应用**，不是一个可复用的库。发布到 npm 有两种方式：

### 方案 1：发布为完整应用（推荐）
- 用户可以通过 `npm install -g gh-social-graph` 全局安装
- 作为 CLI 工具或独立应用使用
- 需要修改 package.json 配置

### 方案 2：发布为库（不推荐）
- 提取核心组件和功能作为库
- 用户可以在自己的项目中使用
- 需要大量重构

本指南采用 **方案 1**（发布为应用）。

---

## 前置要求

1. **npm 账户**
   - 访问 [npmjs.com](https://www.npmjs.com)
   - 点击 "Sign Up" 创建账户
   - 验证邮箱

2. **本地环境**
   ```bash
   # 检查 npm 版本
   npm --version
   
   # 检查 node 版本
   node --version
   ```

3. **项目准备**
   - 所有代码已提交
   - 版本标签已创建 (v1.0.0)
   - 所有测试通过

---

## 步骤 1：更新 package.json

### 1.1 更新版本号

```json
{
  "name": "gh-social-graph",
  "version": "1.0.0",
  "private": false,
  "description": "Explore your developer social universe - Visualize GitHub social networks with interactive force-directed graphs",
  "keywords": [
    "github",
    "social-graph",
    "visualization",
    "d3",
    "network",
    "developer",
    "collaboration"
  ],
  "homepage": "https://github.com/h1s97x/gh-social-graph",
  "bugs": {
    "url": "https://github.com/h1s97x/gh-social-graph/issues"
  },
  "license": "MIT",
  "author": {
    "name": "h1s97x",
    "email": "yang1297656998@outlook.com",
    "url": "https://github.com/h1s97x"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/h1s97x/gh-social-graph.git"
  },
  "bin": {
    "gh-social-graph": "./bin/cli.js"
  },
  "files": [
    "dist",
    "bin",
    "public",
    "src",
    "package.json",
    "README.md",
    "LICENSE"
  ]
}
```

### 关键字段说明

| 字段 | 说明 |
|------|------|
| `version` | 必须是 1.0.0（与 git tag 一致） |
| `private` | 改为 false 才能发布 |
| `description` | 简短描述（npm 搜索显示） |
| `keywords` | 搜索关键词 |
| `homepage` | 项目主页 |
| `bugs` | 问题反馈链接 |
| `license` | MIT 许可证 |
| `bin` | CLI 入口点（可选） |
| `files` | 发布包含的文件 |

---

## 步骤 2：本地测试

### 2.1 构建项目

```bash
# 安装依赖
pnpm install

# 类型检查
pnpm ts-check

# 代码检查
pnpm lint

# 构建
pnpm build
```

### 2.2 模拟发布

```bash
# 查看将要发布的文件
npm pack

# 这会生成 gh-social-graph-1.0.0.tgz
# 检查文件内容是否正确
tar -tzf gh-social-graph-1.0.0.tgz | head -20
```

### 2.3 本地安装测试

```bash
# 全局安装本地包
npm install -g ./gh-social-graph-1.0.0.tgz

# 测试是否可用
gh-social-graph --version

# 卸载
npm uninstall -g gh-social-graph
```

---

## 步骤 3：npm 登录

### 3.1 登录 npm

```bash
# 登录到 npm
npm login

# 输入用户名
# 输入密码
# 输入邮箱
# 输入一次性密码（如果启用了 2FA）
```

### 3.2 验证登录

```bash
# 查看当前登录用户
npm whoami

# 查看登录信息
npm config get registry
```

---

## 步骤 4：发布到 npm

### 4.1 发布

```bash
# 发布到 npm
npm publish

# 或使用 pnpm
pnpm publish
```

### 4.2 验证发布

```bash
# 查看包信息
npm view gh-social-graph

# 查看版本历史
npm view gh-social-graph versions

# 在 npm 网站查看
# https://www.npmjs.com/package/gh-social-graph
```

---

## 步骤 5：安装验证

### 5.1 全局安装

```bash
# 全局安装
npm install -g gh-social-graph

# 验证
gh-social-graph --version
```

### 5.2 项目中安装

```bash
# 在其他项目中安装
npm install gh-social-graph

# 或
pnpm add gh-social-graph
```

---

## 常见问题

### Q: 包名已被占用怎么办？
A: 改用作用域包名：
```json
{
  "name": "@h1s97x/gh-social-graph"
}
```

### Q: 发布后想撤回怎么办？
A: 
```bash
# 撤回发布（72 小时内）
npm unpublish gh-social-graph@1.0.0

# 或标记为废弃
npm deprecate gh-social-graph@1.0.0 "This version is deprecated"
```

### Q: 如何发布新版本？
A:
```bash
# 更新版本号
npm version minor  # 1.0.0 -> 1.1.0
npm version patch  # 1.0.0 -> 1.0.1
npm version major  # 1.0.0 -> 2.0.0

# 发布
npm publish

# 创建 git 标签
git push origin main
git push origin v1.1.0
```

### Q: 如何发布 beta 版本？
A:
```bash
# 更新版本为 beta
npm version 1.0.0-beta.1

# 发布为 beta
npm publish --tag beta

# 用户安装 beta
npm install gh-social-graph@beta
```

### Q: 发布时出错怎么办？
A: 常见错误：
- **403 Forbidden**: 包名已被占用或权限不足
- **401 Unauthorized**: 未登录或 token 过期
- **400 Bad Request**: package.json 格式错误

解决方案：
```bash
# 重新登录
npm logout
npm login

# 检查 package.json
npm validate

# 查看发布日志
npm publish --dry-run
```

---

## 发布后的维护

### 更新包信息

```bash
# 更新 README
npm publish

# 更新关键词
npm publish

# 更新描述
npm publish
```

### 监控下载量

```bash
# 查看下载统计
npm stats gh-social-graph

# 或访问
# https://www.npmjs.com/package/gh-social-graph/stats
```

### 处理问题

```bash
# 标记版本为废弃
npm deprecate gh-social-graph@1.0.0 "Use 1.1.0 instead"

# 发布补丁版本
npm version patch
npm publish

# 发布主版本
npm version major
npm publish
```

---

## 完整发布流程

```bash
# 1. 确保所有代码已提交
git status

# 2. 更新 package.json
# - 改 version 为 1.0.0
# - 改 private 为 false
# - 添加 description, keywords 等

# 3. 本地测试
pnpm install
pnpm ts-check
pnpm lint
pnpm build

# 4. 模拟发布
npm pack
tar -tzf gh-social-graph-1.0.0.tgz

# 5. 登录 npm
npm login

# 6. 发布
npm publish

# 7. 验证
npm view gh-social-graph
npm install -g gh-social-graph

# 8. 推送到 GitHub
git push origin main
git push origin v1.0.0
```

---

## 发布检查清单

- [ ] 版本号已更新到 1.0.0
- [ ] `private` 改为 false
- [ ] 添加了 description 和 keywords
- [ ] README.md 已更新
- [ ] CHANGELOG.md 已更新
- [ ] 所有测试通过
- [ ] 代码已提交
- [ ] git 标签已创建
- [ ] npm 账户已创建
- [ ] 本地已登录 npm
- [ ] npm pack 测试通过
- [ ] 包名未被占用

---

## 相关资源

- [npm 官方文档](https://docs.npmjs.com/)
- [npm publish 指南](https://docs.npmjs.com/cli/v9/commands/npm-publish)
- [package.json 字段说明](https://docs.npmjs.com/cli/v9/configuring-npm/package-json)
- [npm 最佳实践](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)

---

## 注意事项

1. **包名规范**
   - 小写字母
   - 可以包含连字符 (-)
   - 不能包含空格或特殊字符
   - 长度 214 字符以内

2. **版本号规范**
   - 遵循 Semantic Versioning
   - 格式：MAJOR.MINOR.PATCH
   - 例如：1.0.0, 1.1.0, 1.0.1

3. **发布权限**
   - 只有包的所有者可以发布
   - 可以添加其他维护者
   - 使用 `npm owner` 管理

4. **安全建议**
   - 启用 2FA（双因素认证）
   - 定期更新依赖
   - 及时修复安全漏洞
   - 使用 npm audit 检查

---

## 发布后

### 宣传

- 在 GitHub 发布 Release
- 在社交媒体分享
- 提交到 Awesome 列表
- 写博客文章介绍

### 维护

- 及时回复 issue
- 接受 pull request
- 定期发布更新
- 保持文档最新

### 监控

- 关注下载量
- 收集用户反馈
- 跟踪 bug 报告
- 分析使用情况
