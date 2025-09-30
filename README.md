# 个人主页

这是一个简单的个人主页，使用HTML、Tailwind CSS v3和Font Awesome构建，可以轻松部署到GitHub Pages。

## 功能特点

- 响应式设计，适配桌面和移动设备
- 现代化UI设计，包含平滑过渡和动画效果
- 包含关于我、技能、项目和联系方式等核心模块
- 使用Tailwind CSS v3实现样式，无需安装额外依赖
- 可以直接在GitHub Pages上部署

## 如何在GitHub Pages上部署

### 方法1：直接使用index.html

1. **创建GitHub仓库**
   - 在GitHub上创建一个新的仓库，命名为 `username.github.io`（其中 `username` 是你的GitHub用户名）

2. **上传文件**
   - 将 `index.html` 文件上传到仓库的根目录

3. **启用GitHub Pages**
   - 进入仓库的 **Settings** > **Pages**
   - 在 **Source** 部分，选择 `main` 分支和 `/ (root)` 目录
   - 点击 **Save**
   - 等待几分钟，你的个人主页将可以通过 `https://username.github.io` 访问

### 方法2：使用Git命令行

```bash
# 克隆仓库
git clone https://github.com/username/username.github.io.git

# 进入仓库目录
cd username.github.io

# 将文件复制到仓库目录
cp /path/to/index.html .

# 添加文件到暂存区
git add .

# 提交更改
git commit -m "Initial commit"

# 推送到GitHub
git push origin main
```

然后按照方法1的步骤3启用GitHub Pages。

## 自定义内容

你可以通过修改 `index.html` 文件来自定义个人主页的内容：

1. **更改个人信息**：修改关于我部分的文本内容
2. **更新技能**：调整技能部分的进度条和百分比
3. **替换项目**：更改项目部分的图片、标题和描述
4. **更新联系方式**：修改邮箱、电话和地址等联系信息
5. **更改颜色主题**：在Tailwind配置中调整颜色变量

## 技术栈

- HTML5
- Tailwind CSS v3（通过CDN引入）
- Font Awesome（通过CDN引入）
- JavaScript（原生）

## 浏览器兼容性

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证

本项目采用MIT许可证。