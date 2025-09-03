@echo off
chcp 65001 >nul

echo.
echo 🌐 推送到GitHub
echo ================================
echo.

REM 切换到项目根目录
cd /d "%~dp0..\.."

echo 📂 当前目录: %CD%
echo.

echo 🔍 检查Git状态...
git status --short

echo.
echo 🌿 当前分支:
git branch --show-current

echo.
set /p choice="确认推送到GitHub? (y/N): "
if /i not "%choice%"=="y" (
    echo ❌ 已取消推送
    pause
    exit /b 1
)

echo.
echo 📦 添加所有修改...
git add .

echo.
git status --short

echo.
echo 💾 提交修改 (如果有的话)...
git commit -m "chore: 自动提交待推送的修改" 2>nul

echo.
echo 🌐 推送到GitHub...
git push origin main

if errorlevel 1 (
    echo.
    echo ❌ 推送失败！可能的原因：
    echo   1. 网络连接问题
    echo   2. 需要先拉取最新代码
    echo   3. 权限问题
    echo.
    echo 💡 建议操作：
    echo   git pull origin main
    echo   git push origin main
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ 推送成功！
echo 🌐 GitHub仓库: https://github.com/entity003official/ReciteKing
echo.

echo 📊 最新提交:
git log --oneline -3

echo.
pause
