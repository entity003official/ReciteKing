@echo off
echo ========================================
echo    ReciteKing项目 - GitHub强制同步工具      
echo ========================================
echo.

:: 设置账号信息
set GITHUB_USER=entity003official
set GITHUB_REPO=ReciteKing
set GITHUB_EMAIL=entity.003.official@gmail.com

echo 账号: %GITHUB_USER%
echo 仓库: %GITHUB_REPO%
echo 邮箱: %GITHUB_EMAIL%
echo.

:: 确认操作
echo 此操作将强制同步本地更改到GitHub仓库
echo 警告: 这可能会覆盖远程仓库的更改
echo.
set /p confirm=确认继续? (Y/N): 

if /i not "%confirm%"=="Y" (
    echo 操作已取消
    pause
    exit /b 0
)

echo.
echo 开始同步过程...

:: 配置Git
echo 配置Git用户信息...
git config user.name "%GITHUB_USER%"
git config user.email "%GITHUB_EMAIL%"

:: 检查仓库
if not exist ".git" (
    echo 初始化Git仓库...
    git init
)

:: 设置远程仓库
echo 设置远程仓库...
git remote -v | findstr "origin" >nul
if %errorlevel% neq 0 (
    git remote add origin https://github.com/%GITHUB_USER%/%GITHUB_REPO%.git
) else (
    git remote set-url origin https://github.com/%GITHUB_USER%/%GITHUB_REPO%.git
)

:: 添加所有文件
echo 添加所有项目文件...
git add .

:: 提交更改
echo 创建提交...
git commit -m "Force sync - Complete vocabulary database [%date% %time%]"

:: 确保使用main分支
echo 设置main分支...
git branch -M main

:: 强制推送
echo 强制推送到GitHub...
echo.
echo 即将执行: git push -f -u origin main
echo 请在提示时输入您的GitHub凭据
echo 注意: 请使用个人访问令牌(PAT)而非密码
echo.

git push -f -u origin main

if %errorlevel% neq 0 (
    echo.
    echo 推送失败!
    echo.
    echo 可能的原因:
    echo 1. 网络连接问题
    echo 2. GitHub凭据错误
    echo 3. 仓库权限问题
    echo.
    echo 请检查错误信息并重试。
    echo 如需创建个人访问令牌，请访问:
    echo https://github.com/settings/tokens
) else (
    echo.
    echo 同步成功!
    echo.
    echo 您的项目已成功推送到:
    echo https://github.com/%GITHUB_USER%/%GITHUB_REPO%
    echo.
    echo 注意: 由于使用了强制推送，
    echo       远程仓库中任何独立更改可能已被覆盖。
)

echo.
echo 完成!
pause
