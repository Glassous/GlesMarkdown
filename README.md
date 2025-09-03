# GlesMarkdown 📝

一个功能强大的在线 Markdown 编辑器，基于 React + TypeScript + Vite 构建，支持实时预览、语法高亮、多文件管理和移动端预览。

## ✨ 主要功能

### 📝 编辑模式
- **分屏模式**：同时编辑和预览，支持同步滚动
- **源码模式**：专注于内容创作的纯编辑模式
- **阅读模式**：纯预览模式，专注于内容阅读
- **移动预览**：可拖拽的手机预览窗口

### 🎨 Markdown 功能
- **完整语法支持**：标题、列表、链接、图片、表格、引用等
- **代码高亮**：基于 Prism.js 的语法高亮，支持多种编程语言
- **一键复制**：代码块支持一键复制功能
- **树状结构**：特殊优化的文件树结构显示
- **GFM 支持**：GitHub Flavored Markdown 扩展语法

### 📁 文件管理
- **多标签页**：支持同时打开多个 Markdown 文件
- **自动保存**：内容自动保存到本地存储
- **文件导入**：支持 .md、.markdown、.txt 文件导入
- **文件导出**：一键下载当前编辑的文件
- **会话恢复**：重新打开时自动恢复上次的编辑状态

### 🎯 用户体验
- **响应式设计**：完美适配桌面端和移动端
- **快捷键支持**：Ctrl+S 快速保存
- **同步滚动**：编辑器和预览区域同步滚动
- **现代 UI**：基于 DaisyUI 的美观界面

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 7.0.0 或 yarn >= 1.22.0

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

访问 [http://localhost:5174](http://localhost:5174) 开始使用。

### 项目配置
- **自定义图标**：项目使用自定义的 GlesMarkdown.png 作为网站图标
- **完善的 .gitignore**：包含了 Node.js、Vite、TypeScript 等开发环境的完整忽略规则
- **环境变量支持**：支持 .env 文件配置，便于不同环境的部署

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

### 代码检查
```bash
npm run lint
```

## 🛠️ 技术栈

### 核心框架
- **React 19.1.1** - 用户界面库
- **TypeScript 5.8.3** - 类型安全的 JavaScript
- **Vite 7.1.2** - 现代化构建工具

### UI 组件库
- **Tailwind CSS 3.4.17** - 原子化 CSS 框架
- **DaisyUI 5.1.6** - Tailwind CSS 组件库
- **@tailwindcss/typography** - 排版插件

### Markdown 处理
- **react-markdown 10.1.0** - React Markdown 渲染器
- **remark-gfm 4.0.1** - GitHub Flavored Markdown 支持
- **rehype-raw 7.0.0** - HTML 原始内容支持
- **rehype-highlight 7.0.2** - 语法高亮插件

### 代码高亮
- **react-syntax-highlighter 15.6.6** - 代码语法高亮
- **@monaco-editor/react 4.7.0** - Monaco 编辑器集成

### 工具库
- **marked 16.2.1** - Markdown 解析器
- **react-copy-to-clipboard 5.1.0** - 剪贴板操作

### 开发工具
- **ESLint 9.33.0** - 代码质量检查
- **PostCSS 8.5.6** - CSS 后处理器
- **Autoprefixer 10.4.21** - CSS 自动前缀

## 📁 项目结构

```
glesmarkdown/
├── public/                 # 静态资源
│   └── vite.svg           # Vite 图标
├── src/                   # 源代码
│   ├── components/        # React 组件
│   │   ├── EnhancedMarkdown.tsx  # 增强的 Markdown 渲染器
│   │   ├── TabManager.tsx        # 标签页管理器
│   │   └── MobilePreview.tsx     # 移动端预览组件
│   ├── assets/           # 静态资源
│   │   └── react.svg     # React 图标
│   ├── App.tsx           # 主应用组件
│   ├── App.css           # 应用样式
│   ├── main.tsx          # 应用入口
│   ├── index.css         # 全局样式
│   └── vite-env.d.ts     # Vite 类型声明
├── .gitignore            # Git 忽略文件
├── eslint.config.js      # ESLint 配置
├── index.html            # HTML 模板
├── package.json          # 项目配置
├── postcss.config.js     # PostCSS 配置
├── tailwind.config.js    # Tailwind CSS 配置
├── tsconfig.json         # TypeScript 配置
├── tsconfig.app.json     # 应用 TypeScript 配置
├── tsconfig.node.json    # Node.js TypeScript 配置
├── vite.config.ts        # Vite 配置
└── README.md             # 项目说明文档
```

## 🎯 核心组件说明

### App.tsx
主应用组件，负责：
- 应用状态管理（当前文件、视图模式、同步滚动等）
- 文件上传和下载功能
- 键盘快捷键处理
- 视图模式切换（编辑/预览/分屏）

### EnhancedMarkdown.tsx
增强的 Markdown 渲染器，提供：
- 语法高亮的代码块
- 一键复制功能
- 树状结构特殊渲染
- 主题切换支持

### TabManager.tsx
标签页管理器，实现：
- 多文件标签页管理
- 本地存储持久化
- 文件创建、关闭、重命名
- 会话状态恢复

### MobilePreview.tsx
移动端预览组件，支持：
- 可拖拽的手机预览窗口
- 实时内容同步
- 响应式设计预览

## 🎨 样式系统

项目使用 Tailwind CSS + DaisyUI 构建现代化的用户界面：

- **主题配置**：支持明暗主题切换
- **响应式设计**：完美适配各种屏幕尺寸
- **组件库**：基于 DaisyUI 的预制组件
- **自定义样式**：针对 Markdown 内容的特殊优化

## 🔧 配置说明

### Vite 配置 (vite.config.ts)
- React 插件集成
- 开发服务器配置
- 构建优化设置

### Tailwind 配置 (tailwind.config.js)
- DaisyUI 主题配置
- Typography 插件集成
- 自定义颜色方案

### TypeScript 配置
- 严格类型检查
- 模块解析配置
- 编译目标设置

## 📱 使用指南

### 基本操作
1. **新建文档**：点击 "新建文档" 按钮或使用标签页的 "+" 按钮
2. **打开文件**：点击 "打开文件" 按钮选择本地 Markdown 文件
3. **切换模式**：使用顶部的模式切换按钮选择编辑模式
4. **保存文件**：点击 "保存" 按钮或使用 Ctrl+S 快捷键

### 高级功能
- **同步滚动**：在分屏模式下启用编辑器和预览区域的同步滚动
- **移动预览**：点击 "手机预览" 按钮查看移动端效果
- **代码复制**：悬停在代码块上点击复制按钮
- **多文件管理**：使用标签页同时编辑多个文件

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发流程
1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 代码规范
- 使用 TypeScript 进行类型安全开发
- 遵循 ESLint 配置的代码规范
- 组件使用函数式组件和 Hooks
- 样式使用 Tailwind CSS 类名

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢以下开源项目的支持：
- [React](https://reactjs.org/) - 用户界面库
- [Vite](https://vitejs.dev/) - 构建工具
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [DaisyUI](https://daisyui.com/) - 组件库
- [react-markdown](https://github.com/remarkjs/react-markdown) - Markdown 渲染
- [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) - 语法高亮

---

**开始你的 Markdown 创作之旅吧！** 🎯
