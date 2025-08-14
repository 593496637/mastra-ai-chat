# 🤖 Mastra AI Chat

基于 Mastra AI 框架的现代化 React + TypeScript 聊天应用

![GitHub stars](https://img.shields.io/github/stars/593496637/mastra-ai-chat?style=social)
![License](https://img.shields.io/github/license/593496637/mastra-ai-chat)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

## ✨ 功能特性

- 🤖 **智能 Agent 对话**：支持多个 AI Agent 实时流式对话
- 🎨 **现代化 UI**：基于 Tailwind CSS 的美观响应式界面
- 🔄 **工作流管理**：可视化工作流创建、执行和监控
- 📚 **RAG 知识库**：文档管理和智能检索增强生成
- 📊 **Agent 评估**：自动化测试和性能评估系统
- 🧠 **记忆管理**：Agent 上下文记忆和重要信息存储
- ☁️ **云端部署**：一键部署到 Cloudflare Pages
- 🛠️ **完整工具链**：TypeScript + Vite + ESLint 开发体验

## 🚀 快速开始

### 方法一：使用一键启动脚本（推荐）

```bash
# 克隆项目
git clone https://github.com/593496637/mastra-ai-chat.git
cd mastra-ai-chat

# 给启动脚本执行权限
chmod +x start.sh

# 一键启动（会自动安装依赖、检查环境、启动服务）
./start.sh
```

### 方法二：手动启动

```bash
# 1. 克隆项目
git clone https://github.com/593496637/mastra-ai-chat.git
cd mastra-ai-chat

# 2. 安装依赖
npm install

# 3. 复制环境变量
cp .env.example .env

# 4. 启动 Mastra 服务器（在另一个终端）
npm create mastra@latest my-mastra-server
cd my-mastra-server
npm run dev  # 运行在 http://localhost:4111

# 5. 启动前端应用
npm run dev  # 运行在 http://localhost:3000
```

## 🌐 在线体验

访问 [GitHub 仓库](https://github.com/593496637/mastra-ai-chat) 查看最新代码

## 📸 界面预览

### 主聊天界面
- 🎯 现代化深色主题设计
- 💬 实时流式对话体验
- 🔄 Agent 实时切换
- 📱 完美适配移动端

### 高级功能面板
- 📊 工作流可视化管理
- 📚 知识库文档管理
- 🧪 Agent 性能评估
- 🧠 记忆系统监控

## 🛠️ 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| **前端框架** | React 18 | 现代化 React Hooks |
| **类型安全** | TypeScript 5 | 完整类型定义 |
| **构建工具** | Vite 4 | 极速开发体验 |
| **样式框架** | Tailwind CSS 3 | 原子化 CSS |
| **AI 框架** | Mastra AI | TypeScript AI Agent 框架 |
| **图标库** | Lucide React | 美观一致的图标 |
| **部署平台** | Cloudflare Pages | 边缘计算部署 |

## 📂 项目结构

```
mastra-ai-chat/
├── src/
│   ├── components/          # React 组件
│   │   └── MastraAIChat.tsx    # 主聊天界面
│   ├── lib/                # 核心库
│   │   └── mastra-client.ts    # Mastra 客户端封装
│   ├── types/              # TypeScript 类型
│   │   └── mastra.ts           # Mastra 相关类型
│   ├── App.tsx             # 应用入口
│   ├── main.tsx            # React 入口
│   └── index.css           # 全局样式
├── public/                 # 静态资源
├── functions/              # Cloudflare Pages Functions
├── start.sh               # 一键启动脚本
├── package.json           # 项目配置
├── vite.config.ts         # Vite 配置
├── tailwind.config.js     # Tailwind 配置
├── wrangler.toml          # Cloudflare 部署配置
└── README.md              # 项目说明
```

## ⚙️ 配置说明

### 环境变量

创建 `.env` 文件并配置：

```bash
# Mastra API 配置
VITE_MASTRA_API_URL=http://localhost:4111

# 可选：如果使用 API 认证
# VITE_MASTRA_API_KEY=your-api-key

# 开发环境
NODE_ENV=development
```

### Mastra 服务器配置

在您的 Mastra 项目中，确保以下配置：

```typescript
// mastra.ts
import { Mastra } from "@mastra/core";
import { Agent } from "@mastra/core/agent";

export const agent = new Agent({
  name: "My Agent",
  instructions: "你是一个有用的 AI 助手",
  model: openai("gpt-4-turbo"),
});

export const mastra = new Mastra({
  agents: { agent },
});
```

## 🚀 部署到 Cloudflare Pages

### 自动部署

```bash
# 构建并部署
npm run deploy
```

### 手动部署

```bash
# 1. 安装 Wrangler
npm install -g wrangler

# 2. 登录 Cloudflare
wrangler login

# 3. 构建项目
npm run build

# 4. 部署到 Pages
wrangler pages publish dist
```

### 环境变量设置

在 Cloudflare Pages 仪表板中设置：

| 变量名 | 值 | 说明 |
|--------|----|----|
| `MASTRA_API_URL` | `https://your-mastra.com` | 生产环境 Mastra API |
| `NODE_VERSION` | `18` | Node.js 版本 |

## 🎯 使用指南

### 基本对话

1. 选择一个 AI Agent
2. 在输入框中输入您的问题
3. 按 Enter 或点击发送按钮
4. 享受实时流式对话体验

### Agent 管理

- **切换 Agent**：使用顶部下拉菜单
- **查看状态**：观察连接指示器
- **配置服务器**：点击设置按钮修改 Mastra 地址

### 高级功能

- **工作流**：创建和执行复杂的 AI 工作流
- **知识库**：上传文档进行 RAG 增强
- **评估**：测试和评估 Agent 性能
- **记忆**：查看和管理 Agent 记忆

## 🔧 开发指南

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查
npm run type-check

# 构建项目
npm run build
```

### 添加新的 Agent

```typescript
// 在您的 Mastra 项目中
const newAgent = new Agent({
  name: "专业顾问",
  instructions: "你是一个专业的技术顾问...",
  model: openai("gpt-4-turbo"),
  tools: [yourCustomTool],
});
```

### 自定义样式

修改 `src/index.css` 或使用 Tailwind 工具类：

```css
/* 自定义主题色 */
:root {
  --primary-color: #8b5cf6;
  --secondary-color: #ec4899;
}
```

## 🧪 测试

```bash
# 运行类型检查
npm run type-check

# 检查代码格式
npm run lint  # 如果配置了 ESLint

# 预览构建结果
npm run preview
```

## 📊 性能优化

- ✅ **代码分割**：自动按路由和组件分割
- ✅ **懒加载**：组件和资源按需加载
- ✅ **Tree Shaking**：移除未使用的代码
- ✅ **缓存策略**：智能请求缓存
- ✅ **压缩优化**：Gzip/Brotli 压缩

## 🔒 安全特性

- 🛡️ **类型安全**：完整 TypeScript 覆盖
- 🔐 **环境隔离**：开发/生产环境分离
- 🚫 **XSS 防护**：React 内置 XSS 防护
- 🌐 **CORS 配置**：合适的跨域策略

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. **Fork** 本仓库
2. **Clone** 到本地：`git clone https://github.com/your-username/mastra-ai-chat.git`
3. **创建分支**：`git checkout -b feature/amazing-feature`
4. **提交更改**：`git commit -m 'Add amazing feature'`
5. **推送分支**：`git push origin feature/amazing-feature`
6. **提交 PR**：在 GitHub 上创建 Pull Request

### 开发规范

- ✅ 使用 TypeScript 进行类型安全开发
- ✅ 遵循 React Hooks 最佳实践
- ✅ 使用 Tailwind CSS 进行样式开发
- ✅ 编写清晰的提交信息
- ✅ 添加必要的注释和文档

## 🆘 故障排除

### 常见问题

**Q: 无法连接到 Mastra 服务器**
```bash
# 检查 Mastra 服务器状态
curl http://localhost:4111/api/health

# 重启 Mastra 服务器
cd your-mastra-project
npm run dev
```

**Q: 构建失败**
```bash
# 清除缓存
rm -rf node_modules package-lock.json
npm install

# 重新构建
npm run build
```

**Q: TypeScript 错误**
```bash
# 重新安装类型定义
npm install --save-dev @types/react @types/react-dom

# 运行类型检查
npm run type-check
```

### 获取帮助

- 📖 [Mastra AI 文档](https://mastra.ai/docs)
- 🐛 [提交 Issue](https://github.com/593496637/mastra-ai-chat/issues)
- 💬 [讨论区](https://github.com/593496637/mastra-ai-chat/discussions)

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源协议。

## 🙏 致谢

- [Mastra AI](https://mastra.ai) - 强大的 TypeScript AI 框架
- [React](https://react.dev) - 用户界面库
- [Tailwind CSS](https://tailwindcss.com) - 实用优先的 CSS 框架
- [Vite](https://vitejs.dev) - 下一代前端构建工具
- [Cloudflare Pages](https://pages.cloudflare.com) - 边缘计算部署平台

## 🔗 相关链接

- [Mastra AI 官网](https://mastra.ai)
- [React 官方文档](https://react.dev)
- [TypeScript 官方文档](https://www.typescriptlang.org)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages)

---

<div align="center">

**如果这个项目对您有帮助，请给它一个 ⭐️！**

[报告 Bug](https://github.com/593496637/mastra-ai-chat/issues) · 
[功能请求](https://github.com/593496637/mastra-ai-chat/issues) · 
[贡献代码](https://github.com/593496637/mastra-ai-chat/pulls)

</div>
