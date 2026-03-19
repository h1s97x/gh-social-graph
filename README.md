# 🌌 GitHub Social Graph

<div align="center">

**探索你的开发者社交宇宙**

可视化 GitHub 开发者之间的关系网络，发现潜在合作者，探索代码宇宙的星辰大海。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/h1s97x/gh-social-graph.svg?style=social)](https://github.com/h1s97x/gh-social-graph/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/h1s97x/gh-social-graph.svg)](https://github.com/h1s97x/gh-social-graph/issues)

[在线演示](#) · [报告Bug](https://github.com/h1s97x/gh-social-graph/issues) · [功能建议](https://github.com/h1s97x/gh-social-graph/issues)

</div>

---

## ✨ 功能特性

### 🔍 深度社交分析
- **共同关注者**：发现与你互相关注的开发者
- **协作仓库**：分析你与他人共同贡献的项目
- **共同 Star**：找到志同道合的开发者

### 📊 可视化图谱
- **力导向图**：使用 D3.js 实现的交互式网络图
- **星空主题**：沉浸式的宇宙深空视觉体验
- **节点发光**：动态发光效果，模拟星辰闪烁
- **流畅交互**：支持缩放、平移、拖拽节点

### 🎯 智能推荐
- 基于协作关系的开发者推荐
- 编程语言分布分析
- 顶级协作者排行

### 🎮 彩蛋功能
- **Konami 代码**：输入 `↑↑↓↓←→←→BA` 触发神秘彩蛋
- **随机名言**：开发者的智慧语录随机出现

## 🚀 快速开始

### 前置要求

- Node.js 18+ 
- pnpm 9+
- GitHub Personal Access Token（可选，用于提高 API 限制）

### 安装

```bash
# 克隆仓库
git clone https://github.com/h1s97x/gh-social-graph.git

# 进入目录
cd gh-social-graph

# 安装依赖
pnpm install
```

### 配置（可选）

创建 `.env.local` 文件以提高 GitHub API 限制：

```env
GITHUB_TOKEN=your_github_personal_access_token
```

> 💡 **提示**：没有 token 也可以使用，但 API 限制为 60 次/小时。有 token 后提升至 5000 次/小时。

### 运行

```bash
# 开发模式
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

访问 [http://localhost:5000](http://localhost:5000) 查看应用。

## 📸 截图

### 主界面
![主界面](./docs/screenshots/main.png)

### 社交图谱
![社交图谱](./docs/screenshots/graph.png)

### 推荐开发者
![推荐开发者](./docs/screenshots/recommendations.png)

## 🛠️ 技术栈

- **框架**: [Next.js 16](https://nextjs.org/) - React 全栈框架
- **UI 组件**: [shadcn/ui](https://ui.shadcn.com/) - 精美的 React 组件库
- **样式**: [Tailwind CSS v4](https://tailwindcss.com/) - 原子化 CSS 框架
- **可视化**: [D3.js](https://d3js.org/) + [react-force-graph](https://github.com/vasturiano/react-force-graph) - 力导向图
- **图标**: [Lucide React](https://lucide.dev/) - 精美的图标库
- **类型检查**: [TypeScript](https://www.typescriptlang.org/) - 类型安全
- **包管理**: [pnpm](https://pnpm.io/) - 快速、节省磁盘空间

## 🎨 设计理念

### 宇宙星空主题
我们选择了深邃的宇宙深空作为视觉主题，将每个开发者视为宇宙中的一颗星星，协作关系则是连接它们的引力线。这种隐喻不仅美观，更深层地表达了开源社区的连接与探索精神。

### 交互体验
- **节点发光**：模拟星辰的闪烁效果
- **平滑动画**：力导向图的物理模拟让节点自然分布
- **悬停信息**：鼠标悬停显示详细信息卡片
- **一键访问**：点击节点直接跳转到 GitHub 主页

## 📖 使用指南

### 基础使用

1. 在搜索框输入 GitHub 用户名
2. 点击"探索宇宙"按钮开始分析
3. 等待分析完成（通常需要 10-30 秒）
4. 探索生成的社交图谱和推荐

### 高级选项

- **Personal Access Token**：提供你的 GitHub token 以分析更多数据
- **分析深度**：控制抓取的关注者/仓库数量

### 交互技巧

- 🔍 **缩放**：鼠标滚轮或双指捏合
- 🖱️ **平移**：拖拽空白区域
- ✋ **拖拽节点**：拖拽节点调整位置
- 👆 **查看详情**：点击节点打开 GitHub 主页
- ⌨️ **彩蛋**：试试 Konami 代码！

## 🤝 贡献指南

欢迎所有形式的贡献！请查看 [贡献指南](CONTRIBUTING.md) 了解详情。

### 开发流程

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 代码规范

- 使用 TypeScript 编写代码
- 遵循 ESLint 配置
- 优先使用 shadcn/ui 组件
- 编写清晰的提交信息

## 📝 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- [GitHub API](https://docs.github.com/en/rest) - 提供丰富的开发者数据
- [shadcn/ui](https://ui.shadcn.com/) - 精美的 UI 组件
- [D3.js](https://d3js.org/) - 强大的数据可视化库
- 所有为开源社区做出贡献的开发者们

## 📮 联系方式

- 项目主页: [https://github.com/h1s97x/gh-social-graph](https://github.com/h1s97x/gh-social-graph)
- 问题反馈: [GitHub Issues](https://github.com/h1s97x/gh-social-graph/issues)
- 邮箱: yang1297656998@outlook.com

---

<div align="center">

**如果这个项目对你有帮助，请给一个 ⭐️ Star 支持一下！**

Made with ❤️ by [h1s97x](https://github.com/h1s97x)

</div>
