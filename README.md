# AI Image Generator

一个基于 Next.js 构建的 AI 图片生成应用，支持通过文本描述生成自定义图片。

## 功能特点

- **文本生成图片**: 通过自然语言描述生成独特的图片
- **提示词优化**: 内置提示词优化功能，帮助生成更好的结果
- **多种模型**: 支持选择不同的生成模型（默认、艺术风格、写实风格）
- **图片管理**:
  - 图片下载功能
  - 图片缩放功能
  - 实时生成状态显示
- **响应式设计**: 完美支持桌面端和移动端

## 技术栈

- [Next.js](https://nextjs.org) - React 框架
- TypeScript - 类型安全
- Tailwind CSS - 样式处理
- Shadcn UI - UI 组件库

## 快速开始

1. 克隆项目并安装依赖：

```bash
git clone <repository-url>
cd ai-image-generator
npm install
# 或
yarn install
# 或
pnpm install
```

2. 配置环境变量：

创建 `.env.local` 文件并添加以下内容：
```env
NEXT_PUBLIC_API_KEY=your_api_key_here
```

3. 启动开发服务器：

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

4. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
ai-image-generator/
├── app/                    # Next.js 应用目录
├── components/            # React 组件
│   ├── ui/               # 基础 UI 组件
│   └── ai-image-generator.tsx  # 主要组件
├── lib/                  # 工具函数和 API
│   ├── api.ts           # API 调用
│   └── utils.ts         # 工具函数
└── public/              # 静态资源
```

## API 使用说明

该项目使用了 AI 图片生成 API，支持以下功能：

- 文本到图片的转换
- 流式响应处理
- 多种模型选择

## 开发指南

1. 组件开发遵循 React 最佳实践
2. 使用 TypeScript 确保类型安全
3. 使用 Tailwind CSS 进行样式开发
4. 遵循 Next.js 13+ 的应用目录结构

## 部署

项目可以部署到任何支持 Next.js 的平台，推荐使用 Vercel：

```bash
npm run build
# 或
yarn build
# 或
pnpm build
```

## 贡献指南

欢迎提交 Pull Request 和 Issue！

## 许可证

MIT License
