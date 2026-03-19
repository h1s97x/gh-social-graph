# Changelog

所有对本项目的重要变更都会记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
本项目遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/) 版本规范。

## [1.0.0] - 2026-03-19

### Added

- ✨ **GitHub 社交图谱可视化**：使用 D3.js 和 react-force-graph 实现交互式力导向图，展示开发者之间的关系网络
- 🔍 **深度社交分析**：
  - 分析共同关注者，发现互相关注的开发者
  - 识别协作仓库，找出共同贡献的项目
  - 发现共同 Star，找到志同道合的开发者
- 📊 **智能推荐系统**：基于协作关系的开发者推荐，帮助用户发现潜在合作者
- 🎯 **数据统计与分析**：
  - 编程语言分布分析
  - 顶级协作者排行
  - 社交网络统计（节点数、连接数等）
- 🌌 **沉浸式星空主题**：
  - 宇宙深空视觉设计
  - 节点发光效果，模拟星辰闪烁
  - 平滑的力导向图物理模拟
- 🎮 **交互功能**：
  - 支持缩放、平移、拖拽节点
  - 点击节点直接跳转到 GitHub 主页
  - 鼠标悬停显示详细信息卡片
- 🎁 **彩蛋功能**：
  - Konami 代码触发神秘彩蛋
  - 随机开发者名言展示
- 🔐 **GitHub API 集成**：
  - 支持个人访问令牌（PAT）提高 API 限制
  - 无 token 支持（60 次/小时限制）
  - 有 token 支持（5000 次/小时限制）
- 🎨 **现代化 UI 设计**：
  - 基于 shadcn/ui 的精美组件库
  - Tailwind CSS v4 原子化样式
  - 深色/浅色主题支持
  - 响应式设计，支持多设备
- 📱 **完整的用户界面**：
  - 搜索框输入 GitHub 用户名
  - 实时加载状态反馈
  - 错误处理与提示
  - 统计卡片展示关键数据
  - 推荐开发者卡片列表
  - 语言分布徽章展示
- 🛠️ **开发者友好**：
  - TypeScript 类型安全
  - ESLint 代码质量检查
  - 清晰的项目结构
  - 完整的 README 文档
  - 贡献指南

### Technical Stack

- **框架**：Next.js 16 + React 19
- **样式**：Tailwind CSS v4 + shadcn/ui
- **可视化**：D3.js + react-force-graph-2d
- **类型检查**：TypeScript 5
- **包管理**：pnpm 9
- **API 集成**：GitHub REST API v3
- **UI 组件**：Radix UI + Lucide React

### Project Structure

```
gh-social-graph/
├── src/
│   ├── app/
│   │   ├── api/analyze/          # GitHub 分析 API 端点
│   │   ├── layout.tsx            # 应用布局
│   │   ├── page.tsx              # 主页面
│   │   └── globals.css           # 全局样式
│   ├── components/
│   │   ├── social-graph.tsx      # 社交图谱可视化组件
│   │   ├── starfield-background.tsx  # 星空背景
│   │   ├── easter-eggs.tsx       # 彩蛋功能
│   │   └── ui/                   # shadcn/ui 组件库
│   ├── hooks/
│   │   └── use-mobile.ts         # 移动设备检测 Hook
│   └── lib/
│       └── github/
│           ├── api.ts            # GitHub API 客户端
│           ├── analyzer.ts       # 社交图谱分析器
│           └── types.ts          # TypeScript 类型定义
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── eslint.config.mjs
└── README.md
```

### Getting Started

```bash
# 克隆仓库
git clone https://github.com/h1s97x/gh-social-graph.git
cd gh-social-graph

# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

### Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

### Known Limitations

- GitHub API 速率限制（无 token 60 次/小时，有 token 5000 次/小时）
- 大型社交网络（1000+ 节点）可能影响性能
- 某些浏览器可能不支持 Canvas 渲染优化

### Future Roadmap

- [ ] 导出图谱为 PNG/SVG
- [ ] 本地数据缓存
- [ ] 多语言支持
- [ ] 高级过滤选项
- [ ] 实时协作功能
- [ ] 移动应用版本

---

## 版本说明

### 版本号规则

- **主版本号**（Major）：不兼容的 API 修改
- **次版本号**（Minor）：向下兼容的功能新增
- **修订号**（Patch）：向下兼容的问题修复

### 发布周期

- 新功能和改进：每月发布一个次版本
- 问题修复：根据需要随时发布修订版本
- 主版本更新：每年或重大功能更新时发布
