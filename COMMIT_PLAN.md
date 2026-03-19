# 1.0.0 版本发布提交计划

## 提交原则

### 1. 清晰明确 (Clear and Concise)
- 提交信息应清楚说明"做了什么"以及"为什么这么做"
- 避免模糊不清或过于宽泛的描述
- 使用命令式语气（如 "Add" 而非 "Added"）

### 2. 原子性 (Atomic)
- 每次提交只包含一个逻辑上的变更
- 修复 bug 和添加功能应分成两次提交
- 便于代码审查、回滚和问题排查

### 3. 格式化 (Structured)
- 采用统一的 Conventional Commits 格式
- 便于工具解析和自动生成 CHANGELOG

## 提交格式规范

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

- **feat**: 新功能
- **fix**: 问题修复
- **docs**: 文档更新
- **style**: 代码风格（不影响功能）
- **refactor**: 代码重构
- **perf**: 性能优化
- **test**: 测试相关
- **chore**: 构建、依赖、工具等

### Scope 范围

- `api`: GitHub API 相关
- `ui`: 用户界面
- `graph`: 图谱可视化
- `analyzer`: 分析器
- `config`: 配置文件
- `deps`: 依赖管理
- `docs`: 文档

### Subject 主题

- 不超过 50 个字符
- 首字母大写
- 不以句号结尾
- 使用命令式语气

### Body 正文

- 说明变更的原因和影响
- 每行不超过 72 个字符
- 可选，但重要变更应包含

### Footer 页脚

- 关闭相关 issue：`Closes #123`
- 破坏性变更：`BREAKING CHANGE: description`

## 提交计划（按逻辑顺序）

### 第一阶段：核心功能提交

#### 1. 初始化项目结构
```
chore(config): Initialize project with Next.js 16 and TypeScript

- Set up Next.js 16 with React 19
- Configure TypeScript with strict mode
- Set up Tailwind CSS v4 and shadcn/ui
- Configure ESLint and code quality tools
```

#### 2. GitHub API 集成
```
feat(api): Implement GitHub API client and types

- Create GitHub API client with authentication support
- Define TypeScript types for GitHub entities (User, Repository, etc.)
- Implement error handling and rate limit management
- Support both authenticated and unauthenticated requests
```

#### 3. 社交图谱分析器
```
feat(analyzer): Implement social graph analyzer

- Create analyzer to fetch user followers and repositories
- Implement relationship detection (follows, collaborates, stars)
- Add recommendation algorithm based on collaboration patterns
- Calculate language distribution statistics
```

#### 4. 图谱可视化组件
```
feat(graph): Implement interactive force-directed graph visualization

- Integrate react-force-graph-2d for graph rendering
- Implement node painting with avatars and glow effects
- Implement link rendering with type-based colors
- Add zoom, pan, and drag interactions
- Add hover tooltips for node information
```

#### 5. 星空背景组件
```
feat(ui): Add starfield background component

- Create animated starfield background
- Implement parallax scrolling effect
- Add twinkling star animation
- Optimize performance with requestAnimationFrame
```

#### 6. 彩蛋功能
```
feat(ui): Implement Easter eggs

- Add Konami code detection
- Implement developer quotes display
- Add hidden features trigger
```

#### 7. 主页面实现
```
feat(ui): Implement main page with analysis workflow

- Create search input for GitHub username
- Implement analysis trigger and loading states
- Display statistics cards
- Show social graph visualization
- Display developer recommendations
- Show language distribution
- Add error handling and user feedback
```

#### 8. API 路由实现
```
feat(api): Implement /api/analyze endpoint

- Create POST endpoint for user analysis
- Validate input parameters
- Handle GitHub API errors
- Return formatted analysis results
```

### 第二阶段：文档和配置

#### 9. 更新项目信息
```
docs: Update project metadata and personal information

- Update package.json with project name and author info
- Update README with correct repository links
- Add author contact information
```

#### 10. 清理项目结构
```
chore: Remove Coze platform specific files and scripts

- Remove .coze configuration file
- Remove scripts/ directory (Coze-specific)
- Remove public/ directory (unused assets)
- Remove src/server.ts (custom HTTP server)
- Update package.json scripts to use Next.js native commands
```

#### 11. 添加 CHANGELOG
```
docs: Add CHANGELOG for version 1.0.0

- Document all features and improvements
- Add technical stack information
- Include project structure overview
- Add getting started guide
- Document known limitations and future roadmap
```

#### 12. 添加贡献指南
```
docs: Add CONTRIBUTING guide

- Document development workflow
- Add code style guidelines
- Include commit message conventions
- Add pull request process
```

### 第三阶段：版本发布

#### 13. 版本标签
```
chore(release): Release version 1.0.0

- Update version in package.json to 1.0.0
- Create git tag v1.0.0
- Prepare for npm publish
```

## 提交检查清单

在每次提交前，确保：

- [ ] 提交信息遵循格式规范
- [ ] 只包含一个逻辑变更
- [ ] 代码通过 TypeScript 类型检查
- [ ] 代码通过 ESLint 检查
- [ ] 相关文档已更新
- [ ] 没有调试代码或 console.log
- [ ] 提交信息清晰准确

## 提交命令示例

```bash
# 查看当前状态
git status

# 暂存文件
git add <file>

# 提交更改
git commit -m "feat(scope): Add feature description"

# 查看提交历史
git log --oneline

# 创建版本标签
git tag -a v1.0.0 -m "Release version 1.0.0"

# 推送到远程
git push origin main
git push origin v1.0.0
```

## 注意事项

1. **不要混合多个功能**：每个提交应该是独立的、可回滚的
2. **保持提交历史清晰**：避免 "fix typo" 这样的提交，应该在原提交中修复
3. **及时推送**：定期推送到远程仓库，避免本地提交过多
4. **代码审查**：在合并到 main 前进行代码审查
5. **版本管理**：遵循语义化版本规范

## 相关资源

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Git Commit Best Practices](https://chris.beams.io/posts/git-commit/)
