#!/bin/bash

set -e

echo "🚀 启动 Mastra AI Chat 项目..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js 18+"
    exit 1
fi

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装"
    exit 1
fi

# 安装依赖
echo "📦 安装项目依赖..."
npm install

# 创建环境变量文件
if [ ! -f .env ]; then
    echo "📝 创建环境变量文件..."
    cp .env.example .env
    echo "✅ 已创建 .env 文件，请根据需要修改配置"
fi

# 检查 Mastra 服务器
echo "🔍 检查 Mastra 服务器连接..."
if curl -f http://localhost:4111/api/health &> /dev/null; then
    echo "✅ Mastra 服务器已运行"
else
    echo "⚠️  Mastra 服务器未运行在 http://localhost:4111"
    echo "请在另一个终端中运行以下命令启动 Mastra 服务器："
    echo ""
    echo "  npm create mastra@latest my-mastra-server"
    echo "  cd my-mastra-server"
    echo "  npm run dev"
    echo ""
    echo "然后重新运行此脚本，或直接启动前端："
    echo "  npm run dev"
    echo ""
    read -p "按 Enter 继续启动前端（无 Mastra 服务器） 或 Ctrl+C 退出..."
fi

# 启动开发服务器
echo "🌟 启动开发服务器..."
echo "前端地址: http://localhost:3000"
echo "Mastra 服务器: http://localhost:4111"
echo ""
npm run dev
