# 部署指南

## 步骤1：创建GitHub仓库
1. 登录GitHub账号
2. 点击右上角的"+"图标，选择"New repository"
3. 仓库名称填写为 `your-username.github.io`（将your-username替换为你的GitHub用户名）
4. 选择"Public"仓库类型
5. 勾选"Add a README file"（可选）
6. 点击"Create repository"

## 步骤2：推送代码到GitHub
1. 复制仓库的HTTPS或SSH地址
2. 在本地终端执行以下命令：
   ```bash
   # 添加远程仓库
   git remote add origin https://github.com/your-username/your-username.github.io.git
   
   # 推送代码
   git push -u origin master
   ```

## 步骤3：部署到Cloudflare Pages
1. 登录Cloudflare账号
2. 导航到"Pages"部分
3. 点击"Create a project"
4. 选择"GitHub"作为连接源
5. 授权Cloudflare访问你的GitHub账号
6. 选择刚刚创建的仓库
7. 配置构建设置：
   - 构建命令：留空（无需构建命令）
   - 构建输出目录：/（根目录）
   - 环境变量：无需设置
8. 点击"Deploy site"
9. 部署完成后，Cloudflare会为你分配一个URL，例如 `your-project.pages.dev`

## 步骤4：访问网站
1. 打开Cloudflare Pages分配的URL
2. 你的个人主页应该已经成功部署并可以访问

## 步骤5：自定义域名（可选）
如果你有自己的域名，可以在Cloudflare Pages的设置中添加自定义域名，将你的个人主页绑定到自己的域名上。