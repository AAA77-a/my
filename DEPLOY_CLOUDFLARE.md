# Cloudflare Pages 部署指南

本指南将帮助你将这个 React + TypeScript + Vite 项目部署到 Cloudflare Pages。

## 前置准备

1. 确保你已经有一个 Cloudflare 账户（如果没有，请访问 https://dash.cloudflare.com/sign-up 注册）
2. 确保你的代码已经推送到 GitHub 仓库

## 部署步骤

### 方法一：通过 Cloudflare Dashboard 部署（推荐）

#### 1. 创建 Cloudflare 账户
- 访问 https://dash.cloudflare.com/sign-up
- 填写邮箱和密码创建账户
- 验证邮箱地址

#### 2. 创建 Pages 项目
- 登录 Cloudflare Dashboard
- 点击左侧菜单的 **Workers & Pages**
- 点击 **Create application**
- 选择 **Pages** 标签
- 点击 **Connect to Git**

#### 3. 连接 GitHub 仓库
- 选择你的 GitHub 仓库（https://github.com/AAA77-a/my.git）
- 授权 Cloudflare 访问你的仓库
- 选择要部署的分支（推荐使用 `main`）

#### 4. 配置构建设置
Cloudflare Pages 会自动检测到这是一个 Vite 项目，通常不需要手动配置。如果需要，使用以下设置：

```
框架预设: Vite
构建命令: npm run build
输出目录: dist
```

#### 5. 环境变量（可选）
如果项目需要环境变量，可以在部署设置中添加。

#### 6. 部署项目
- 点击 **Save and Deploy**
- 等待构建完成（通常需要 1-3 分钟）
- 部署成功后，你会获得一个类似 `https://your-project-name.pages.dev` 的域名

### 方法二：使用 Wrangler CLI 部署

如果你更喜欢使用命令行部署，可以使用 Wrangler CLI。

#### 1. 安装 Wrangler
```bash
npm install -g wrangler
```

#### 2. 登录 Cloudflare
```bash
wrangler login
```

#### 3. 创建 Pages 项目
```bash
wrangler pages project create your-project-name
```

#### 4. 构建项目
```bash
npm run build
```

#### 5. 部署到 Pages
```bash
wrangler pages deploy dist --project-name=your-project-name
```

## 自定义域名

部署成功后，你可以添加自定义域名：

1. 在 Cloudflare Pages 项目中，点击 **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入你的域名
4. 按照提示配置 DNS 记录

## 自动部署

Cloudflare Pages 支持 Git 自动部署：
- 每次推送到连接的分支，会自动触发新的部署
- 你可以在设置中配置部署分支和预览部署

## 本地预览部署

在部署前，你可以在本地预览构建结果：

```bash
npm run build
npm run preview
```

## 常见问题

### Q: 部署失败怎么办？
A: 检查 Cloudflare Pages 的构建日志，通常问题是：
- 依赖安装失败
- 构建命令错误
- TypeScript 类型错误

### Q: 如何更新部署？
A: 只需将新代码推送到 GitHub，Cloudflare Pages 会自动重新部署。

### Q: 支持服务器端代码吗？
A: Cloudflare Pages 是静态托管服务。对于需要后端服务的功能（如 Python 代码执行），你需要：
- 使用 Vercel 或其他支持后端的平台
- 或者使用 Cloudflare Workers 来实现后端功能

## 项目配置

本项目已经配置好了适合 Cloudflare Pages 的构建设置：

- [vite.config.ts](file:///workspace/vite.config.ts) - Vite 配置
- [package.json](file:///workspace/package.json) - 项目脚本配置

构建命令：`npm run build`
输出目录：`dist`

## 注意事项

⚠️ **重要提示**：本项目中的 Python 代码执行功能目前有两种模式：
1. **浏览器执行（Pyodide）** - 完全在前端运行，Cloudflare Pages 完全支持
2. **后端执行（服务器）** - 需要后端服务器，Cloudflare Pages 不直接支持

建议在 Cloudflare Pages 部署时，主要使用浏览器执行模式。
