# AI Image Generator

一个基于 Next.js 构建的 AI 图片生成应用，支持通过文本描述生成自定义图片。

## 功能特点

- **文本生成图片**: 通过自然语言描述生成独特的图片
- **智能提示词优化**: 
  - 使用 LLaMA 模型优化用户输入的提示词
  - 实时优化状态显示
  - 自动更新输入框内容
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

## API 功能

该项目使用了两个主要的 AI API：

### 1. 图片生成 API
- 端点：`https://flux.robus.us.kg/v1/chat/completions`
- 功能：将文本描述转换为图片
- 特点：支持流式响应

### 2. 提示词优化 API
- 端点：`https://fluxprompt.robus.us.kg/v1/chat/completions`
- 功能：优化用户输入的提示词
- 模型：使用 LLaMA 3.2 11B Vision Instruct 模型
- 特点：流式响应处理

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
│   ├── api.ts           # API 调用（图片生成和提示词优化）
│   └── utils.ts         # 工具函数
└── public/              # 静态资源
```

## 使用说明

1. 在输入框中输入图片描述
2. 可以点击"Optimize Prompt"优化你的描述
3. 选择合适的生成模型（可选）
4. 点击"Generate Image"生成图片
5. 生成后可以：
   - 点击图片放大/缩小查看
   - 使用下载按钮保存图片

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
