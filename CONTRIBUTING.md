# 贡献指南

感谢你考虑为 GitHub Social Graph 做出贡献！🎉

## 📋 目录

- [行为准则](#行为准则)
- [我能如何贡献？](#我能如何贡献)
- [开发流程](#开发流程)
- [代码规范](#代码规范)
- [提交信息规范](#提交信息规范)
- [Pull Request 流程](#pull-request-流程)

## 行为准则

本项目采用贡献者公约作为行为准则。参与此项目即表示你同意遵守其条款。请阅读 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) 了解详情。

## 我能如何贡献？

### 报告 Bug

在提交 Bug 报告之前，请先：
1. 检查 [Issues](https://github.com/your-username/github-social-graph/issues) 中是否已有相同问题
2. 确认你使用的是最新版本
3. 收集以下信息：
   - 操作系统和浏览器版本
   - 复现步骤
   - 预期行为和实际行为
   - 截图或错误日志

提交 Bug 报告时，请使用 [Bug 报告模板](.github/ISSUE_TEMPLATE/bug_report.md)。

### 建议新功能

我们欢迎任何改进建议！请：
1. 使用 [功能请求模板](.github/ISSUE_TEMPLATE/feature_request.md)
2. 详细描述功能和使用场景
3. 如果可能，提供设计草图或原型

### 改进文档

文档改进包括：
- 修正拼写或语法错误
- 添加缺失的文档
- 改进现有文档的清晰度
- 翻译文档

### 提交代码

请参考下方的 [开发流程](#开发流程) 和 [Pull Request 流程](#pull-request-流程)。

## 开发流程

### 1. Fork 并克隆仓库

```bash
# Fork 后克隆你的仓库
git clone https://github.com/your-username/github-social-graph.git

# 进入目录
cd github-social-graph

# 添加上游仓库
git remote add upstream https://github.com/original-owner/github-social-graph.git
```

### 2. 创建分支

```bash
# 创建并切换到新分支
git checkout -b feature/AmazingFeature

# 或修复 bug
git checkout -b fix/BugDescription
```

分支命名规范：
- `feature/` - 新功能
- `fix/` - Bug 修复
- `docs/` - 文档改进
- `refactor/` - 代码重构
- `test/` - 测试相关

### 3. 安装依赖

```bash
pnpm install
```

### 4. 开发

```bash
# 启动开发服务器
pnpm dev

# 在浏览器中打开 http://localhost:5000
```

### 5. 测试

在提交 PR 之前，请确保：
- 代码能正常编译
- 没有 TypeScript 错误
- 功能正常工作
- 没有破坏现有功能

```bash
# 类型检查
pnpm tsc --noEmit

# 构建测试
pnpm build
```

## 代码规范

### TypeScript

- 使用 TypeScript 编写所有代码
- 为所有函数和组件添加类型注解
- 避免 `any` 类型，使用 `unknown` 或具体类型

### React 组件

```tsx
// ✅ 推荐：使用函数组件和 TypeScript
import { Button } from '@/components/ui/button';

interface MyComponentProps {
  title: string;
  onClick?: () => void;
}

export function MyComponent({ title, onClick }: MyComponentProps) {
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={onClick}>Click me</Button>
    </div>
  );
}
```

### 样式

- 优先使用 Tailwind CSS 类
- 使用 shadcn 主题变量（`bg-primary`, `text-foreground` 等）
- 避免内联样式

```tsx
// ✅ 推荐
<div className="flex items-center gap-4 p-4 bg-card text-card-foreground">

// ❌ 避免
<div style={{ display: 'flex', padding: '16px' }}>
```

### 文件组织

```
src/
├── app/              # 页面和路由
├── components/       # React 组件
│   ├── ui/          # shadcn 基础组件
│   └── xxx.tsx      # 业务组件
├── lib/             # 工具函数和 API
└── hooks/           # 自定义 Hooks
```

## 提交信息规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type（类型）

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建/工具相关

### 示例

```bash
# 新功能
feat: add user profile visualization

# Bug 修复
fix: resolve graph rendering issue on mobile

# 文档
docs: update installation guide

# 重构
refactor(analyzer): improve social graph algorithm
```

## Pull Request 流程

### 1. 提交前检查

- [ ] 代码遵循项目规范
- [ ] 已进行自我审查
- [ ] 代码有必要的注释
- [ ] 文档已更新（如有需要）
- [ ] 没有引入新的警告
- [ ] 测试通过

### 2. 创建 Pull Request

1. Push 到你的 fork 仓库
2. 在 GitHub 上创建 Pull Request
3. 填写 PR 模板
4. 等待审查

### 3. PR 审查

- 维护者会审查你的代码
- 可能会提出修改建议
- 及时响应反馈

### 4. 合并

通过审查后，维护者会合并你的 PR。恭喜你成为贡献者！🎉

## 需要帮助？

如果你有任何问题，可以：
- 在 [Discussions](https://github.com/your-username/github-social-graph/discussions) 提问
- 查看 [文档](./docs)
- 联系维护者

再次感谢你的贡献！❤️
