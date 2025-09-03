@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo 📊 ReciteKing项目Git统计
echo ================================
echo.

REM 切换到项目根目录
cd /d "%~dp0..\.."

echo 🏗️ 项目基本信息:
echo   📦 项目名称: ReciteKing (日语单词背诵王)
echo   🌐 远程仓库: 
git remote get-url origin

echo.
echo 📈 代码统计:
echo   📂 总文件数:
git ls-files | find /c /v ""
echo   📝 总提交数:
git rev-list --all --count
echo   👥 贡献者数:
git shortlog -sn | find /c /v ""

echo.
echo 🌿 分支信息:
echo   🔄 当前分支:
git branch --show-current
echo   📋 所有分支:
git branch -a

echo.
echo 📅 最近提交历史:
git log --oneline -10

echo.
echo 📊 文件类型统计:
echo.
echo   HTML文件:
git ls-files "*.html" | find /c /v ""
echo   JavaScript文件:
git ls-files "*.js" | find /c /v ""
echo   CSS文件:
git ls-files "*.css" | find /c /v ""
echo   CSV数据文件:
git ls-files "*.csv" | find /c /v ""
echo   Markdown文档:
git ls-files "*.md" | find /c /v ""
echo   批处理脚本:
git ls-files "*.bat" | find /c /v ""

echo.
echo 🏷️ 标签版本:
git tag -l

echo.
echo 📊 代码贡献统计:
git shortlog -sn

echo.
echo ✅ 统计完成！
pause
