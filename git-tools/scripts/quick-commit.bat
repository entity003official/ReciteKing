@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo 🚀 ReciteKing快速提交工具
echo ================================
echo.

REM 检查参数
if "%~1"=="" (
    echo ❌ 错误：请提供提交信息
    echo.
    echo 使用方法:
    echo   quick-commit.bat "你的提交信息"
    echo.
    echo 示例:
    echo   quick-commit.bat "feat: 添加新功能"
    echo   quick-commit.bat "fix: 修复导航栏问题"
    echo   quick-commit.bat "docs: 更新文档"
    echo.
    pause
    exit /b 1
)

set COMMIT_MSG=%~1

REM 切换到项目根目录
cd /d "%~dp0..\.."

echo 📂 当前目录: %CD%
echo.

echo 🔍 检查Git状态...
git status --porcelain >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误：当前目录不是Git仓库
    pause
    exit /b 1
)

echo 📋 显示当前状态:
git status --short

echo.
echo 📦 添加所有修改...
git add .

echo.
echo 💾 提交修改...
git commit -m "%COMMIT_MSG%"

if errorlevel 1 (
    echo ❌ 提交失败！
    pause
    exit /b 1
)

echo.
echo 🌐 推送到GitHub...
git push origin main

if errorlevel 1 (
    echo ❌ 推送失败！
    echo 💡 可能需要先拉取最新代码：git pull origin main
    pause
    exit /b 1
)

echo.
echo ✅ 成功！
echo 📊 查看最新提交:
git log --oneline -3

echo.
echo 🎉 Git操作完成！
echo 📱 仓库地址: https://github.com/entity003official/ReciteKing
pause
