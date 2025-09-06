# GitHub项目上传指南

## 准备工作

1. 确保你已经安装了Git
   - 可以通过在命令行运行 `git --version` 来检查
   - 如果没有安装，请从 [Git官网](https://git-scm.com/downloads) 下载安装

2. 在GitHub上创建一个新的仓库
   - 访问 [GitHub新建仓库页面](https://github.com/new)
   - 输入仓库名称，建议使用 `ReciteKing`
   - 选择公开(Public)或私有(Private)
   - 不要初始化仓库，保持为空

## 上传步骤

### 方法1: 使用自动化脚本（推荐）

1. 在项目根目录下，双击运行 `upload-to-github.bat`
2. 按照脚本提示输入信息：
   - GitHub用户名
   - 仓库名称 (默认为ReciteKing)
   - 提交信息 (默认为"Initial commit - Complete vocabulary database for 初级1")
3. 确认上传操作
4. 如果要求输入GitHub账户和密码，请输入
   - 注意：从2021年8月起，GitHub不再支持密码认证，请使用个人访问令牌(PAT)
   - 可以在[GitHub设置页面](https://github.com/settings/tokens)生成令牌

### 方法2: 手动Git命令

如果自动化脚本未能正常工作，可以按以下步骤手动操作：

```bash
# 初始化Git仓库
git init

# 添加所有文件
git add .

# 创建首次提交
git commit -m "Initial commit - Complete vocabulary database for 初级1"

# 添加远程仓库 (替换YOUR_USERNAME为你的GitHub用户名)
git remote add origin https://github.com/YOUR_USERNAME/ReciteKing.git

# 推送到远程仓库
git push -u origin main
```

## 常见问题解决

1. **推送失败**
   - 检查远程仓库URL是否正确
   - 确认GitHub账户权限
   - 使用个人访问令牌(PAT)而不是密码

2. **分支名称不同**
   - 如果本地分支名为master而不是main，请使用：
     ```bash
     git branch -M main
     ```

3. **身份验证问题**
   - 如果遇到身份验证问题，可以运行：
     ```bash
     git config --global credential.helper store
     ```
   - 然后再次尝试推送，输入您的凭据

## 上传后的操作

1. 访问您的GitHub仓库页面
2. 确认所有文件已正确上传
3. 编辑仓库设置，如启用GitHub Pages等

## 相关链接

- [Git官方文档](https://git-scm.com/doc)
- [GitHub帮助中心](https://docs.github.com/cn)
- [GitHub Pages指南](https://docs.github.com/cn/pages)

---

如有任何问题，请在GitHub仓库提交Issue或联系项目维护者。
