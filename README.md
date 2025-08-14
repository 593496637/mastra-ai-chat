# 🤖 Mastra AI Chat

基于 Mastra AI 框架的现代化 React + TypeScript 聊天应用

## ✨ 功能特性

- 🤖 **智能 Agent 对话**：支持多个 AI Agent 实时对话
- 🔄 **工作流管理**：可视化工作流创建、执行和监控
- 📚 **RAG 知识库**：文档管理和智能检索
- 📊 **Agent 评估**：自动化测试和性能评估
- 🧠 **记忆管理**：Agent 上下文记忆和重要信息存储
- ☁️ **云端部署**：一键部署到 Cloudflare Pages

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 启动 Mastra 服务器

在另一个终端中：

```bash
npm create mastra@latest my-mastra-server
cd my-mastra-server
npm run dev
```

### 部署到 Cloudflare Pages

```bash
npm run deploy
```

## 🛠️ 技术栈

- **前端**: React 18 + TypeScript + Vite
- **样式**: Tailwind CSS
- **AI 框架**: Mastra AI
- **部署**: Cloudflare Pages
- **开发工具**: ESLint + Prettier + TypeScript

## 📱 界面预览

现代化的聊天界面，支持实时流式对话和多种 AI Agent 选择。

## 🔧 配置

1. 复制 `.env.example` 到 `.env`
2. 填入您的 API 密钥
3. 启动 Mastra 服务器
4. 运行前端应用

## 📚 文档

详细文档请查看 [部署指南](./docs/deployment-guide.md)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
