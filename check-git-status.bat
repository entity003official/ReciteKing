@echo off
echo ========================================
echo    ReciteKing项目 - Git状态检查工具      
echo ========================================
echo.

:: 确保Git已安装
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] Git未找到，请确保已安装Git
    pause
    exit /b 1
)

echo [检查] Git版本信息:
git --version
echo.

:: 检查是否为Git仓库
if not exist ".git" (
    echo [警告] 当前目录不是Git仓库!
    echo        请先运行初始化脚本或执行 git init
    pause
    exit /b 1
)

:: 检查Git配置
echo [检查] Git用户信息:
echo   用户名: 
git config user.name
echo   邮箱: 
git config user.email
echo.

:: 检查远程仓库配置
echo [检查] 远程仓库设置:
git remote -v
echo.

:: 检查当前分支
echo [检查] 当前分支:
git branch
echo.

:: 检查工作区状态
echo [检查] 工作区状态:
git status
echo.

:: 检查提交历史
echo [检查] 最近提交:
git log --oneline --max-count=5
echo.

:: 建议操作
echo ========================================
echo 诊断与建议:
echo ----------------------------------------

git remote -v | findstr "entity003official/ReciteKing" >nul
if %errorlevel% neq 0 (
    echo [问题] 远程仓库未正确设置为您的GitHub仓库
    echo [解决] 请运行:
    echo     git remote add origin https://github.com/entity003official/ReciteKing.git
    echo     或
    echo     git remote set-url origin https://github.com/entity003official/ReciteKing.git
    echo.
)

git branch | findstr "main" >nul
if %errorlevel% neq 0 (
    echo [问题] 未找到main分支
    echo [解决] 请运行:
    echo     git branch -M main
    echo.
)

git log --oneline --max-count=1 >nul 2>&1
if %errorlevel% neq 0 (
    echo [问题] 没有提交记录
    echo [解决] 请先提交更改:
    echo     git add .
    echo     git commit -m "Initial commit"
    echo.
)

echo [后续步骤] 如果上述问题已解决，请执行:
echo     git push -u origin main
echo.
echo [身份验证] 如遇到身份验证问题，请使用个人访问令牌(PAT)而非密码
echo     https://github.com/settings/tokens
echo.

echo ========================================
echo 完成检查！
pause
