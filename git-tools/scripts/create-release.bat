@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo 🏷️ ReciteKing版本发布工具
echo ================================
echo.

REM 检查参数
if "%~1"=="" (
    echo ❌ 错误：请提供版本号
    echo.
    echo 使用方法:
    echo   create-release.bat [版本号] "[发布说明]"
    echo.
    echo 示例:
    echo   create-release.bat v2.1.0 "添加新的学习模式"
    echo   create-release.bat v2.0.1 "修复导航栏问题"
    echo.
    pause
    exit /b 1
)

set VERSION=%~1
set RELEASE_NOTES=%~2

REM 切换到项目根目录
cd /d "%~dp0..\.."

echo 📂 当前目录: %CD%
echo 🏷️ 创建版本: %VERSION%
echo.

REM 检查工作区是否干净
git status --porcelain | findstr /r /v "^$" >nul
if not errorlevel 1 (
    echo ⚠️ 警告：工作区有未提交的修改
    echo 📋 当前状态:
    git status --short
    echo.
    set /p choice="是否继续创建版本? (y/N): "
    if /i not "!choice!"=="y" (
        echo ❌ 已取消版本创建
        pause
        exit /b 1
    )
    echo.
    echo 📦 先提交所有修改...
    git add .
    git commit -m "chore: 准备发布 %VERSION%"
)

echo 🏷️ 创建Git标签...
if "%RELEASE_NOTES%"=="" (
    git tag -a %VERSION% -m "Release %VERSION%"
) else (
    git tag -a %VERSION% -m "%RELEASE_NOTES%"
)

if errorlevel 1 (
    echo ❌ 标签创建失败！
    pause
    exit /b 1
)

echo 🌐 推送标签到GitHub...
git push origin %VERSION%

if errorlevel 1 (
    echo ❌ 推送标签失败！
    pause
    exit /b 1
)

echo 🌐 推送代码到GitHub...
git push origin main

REM 创建发布说明文件
set RELEASE_FILE=RELEASE_%VERSION%.md
echo # 🎉 ReciteKing %VERSION% 发布 > %RELEASE_FILE%
echo. >> %RELEASE_FILE%
echo ## 📅 发布信息 >> %RELEASE_FILE%
echo. >> %RELEASE_FILE%
echo - **版本**: %VERSION% >> %RELEASE_FILE%
echo - **日期**: %date% %time% >> %RELEASE_FILE%
echo - **分支**: main >> %RELEASE_FILE%
echo. >> %RELEASE_FILE%
echo ## 📝 更新内容 >> %RELEASE_FILE%
echo. >> %RELEASE_FILE%
if not "%RELEASE_NOTES%"=="" (
    echo %RELEASE_NOTES% >> %RELEASE_FILE%
    echo. >> %RELEASE_FILE%
)
echo 详细更改请查看提交历史： >> %RELEASE_FILE%
git log --oneline -10 >> %RELEASE_FILE%
echo. >> %RELEASE_FILE%
echo ## 🌐 在线访问 >> %RELEASE_FILE%
echo. >> %RELEASE_FILE%
echo - **GitHub仓库**: https://github.com/entity003official/ReciteKing >> %RELEASE_FILE%
echo - **在线演示**: 下载后运行 start_server.bat >> %RELEASE_FILE%

echo.
echo ✅ 版本发布完成！
echo 📄 发布说明已保存到: %RELEASE_FILE%
echo 🎉 GitHub标签: https://github.com/entity003official/ReciteKing/releases/tag/%VERSION%
echo.
pause
