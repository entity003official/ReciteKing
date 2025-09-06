@echo off
echo ========================================
echo    ReciteKing项目 - GitHub修正上传工具      
echo ========================================
echo.

:: 确保Git已安装
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo Git未找到，请确保已安装Git
    pause
    exit /b 1
)

echo 正在为GitHub账号 entity003official 配置上传...
echo 项目地址: https://github.com/entity003official/ReciteKing
echo.

:: 检查是否已初始化Git仓库
if not exist ".git" (
    echo 初始化Git仓库...
    git init
    if %errorlevel% neq 0 (
        echo Git初始化失败
        pause
        exit /b 1
    )
) else (
    echo 检测到现有Git仓库
)

:: 配置Git用户信息
echo 配置Git用户信息...
git config user.name "entity003official"
git config user.email "entity.003.official@gmail.com"

:: 检查远程仓库
echo 检查远程仓库设置...
git remote -v | findstr "origin" >nul
if %errorlevel% neq 0 (
    echo 添加远程仓库...
    git remote add origin https://github.com/entity003official/ReciteKing.git
) else (
    echo 更新远程仓库地址...
    git remote set-url origin https://github.com/entity003official/ReciteKing.git
)

:: 添加所有文件到暂存区
echo 添加项目文件...
git add .

:: 提交更改
echo 创建提交...
git commit -m "Complete vocabulary database for 初级1 - 24 lessons"

:: 确保本地分支为main
echo 检查分支设置...
git branch | findstr "main" >nul
if %errorlevel% neq 0 (
    echo 创建main分支...
    git branch -M main
) else (
    echo 切换到main分支...
    git checkout main
)

:: 推送到远程仓库
echo 推送到GitHub...
echo 注意: 接下来需要输入GitHub凭据
echo 用户名: entity003official
echo 密码: 请使用个人访问令牌(PAT)而非密码
echo.
echo 如果您还没有创建个人访问令牌，请访问:
echo https://github.com/settings/tokens
echo 创建一个具有repo权限的令牌。
echo.
git push -u origin main

if %errorlevel% neq 0 (
    echo 推送遇到问题。尝试使用强制推送...
    git push -u -f origin main
    if %errorlevel% neq 0 (
        echo 推送失败。请检查GitHub凭据和网络连接。
        echo.
        echo 手动推送命令:
        echo git push -u origin main
        echo.
        echo 可能需要设置Personal Access Token而不是密码。
    ) else (
        echo 强制推送成功!
    )
) else (
    echo 推送成功!
)

echo.
echo 项目访问地址: https://github.com/entity003official/ReciteKing
echo.
echo 完成！
pause
