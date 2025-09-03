@echo off
chcp 65001 >nul

echo.
echo 📦 ReciteKing Git管理工具
echo ================================
echo.

:menu
echo 请选择操作:
echo.
echo   1. 🚀 快速提交并推送
echo   2. 📊 查看项目统计
echo   3. 🏷️ 创建版本发布
echo   4. ⚙️ 配置Git环境
echo   5. 🔍 查看Git状态
echo   6. 📚 查看提交历史
echo   7. 🌿 管理分支
echo   0. ❌ 退出
echo.

set /p choice="请输入选择 (0-7): "

if "%choice%"=="1" goto quick_commit
if "%choice%"=="2" goto show_stats  
if "%choice%"=="3" goto create_release
if "%choice%"=="4" goto setup_git
if "%choice%"=="5" goto show_status
if "%choice%"=="6" goto show_history
if "%choice%"=="7" goto manage_branches
if "%choice%"=="0" goto exit
goto invalid

:quick_commit
echo.
set /p commit_msg="💾 请输入提交信息: "
if "%commit_msg%"=="" (
    echo ❌ 提交信息不能为空
    pause
    goto menu
)
call "%~dp0scripts\quick-commit.bat" "%commit_msg%"
pause
goto menu

:show_stats
echo.
call "%~dp0scripts\git-stats.bat"
goto menu

:create_release
echo.
set /p version="🏷️ 请输入版本号 (例如: v2.1.0): "
if "%version%"=="" (
    echo ❌ 版本号不能为空
    pause
    goto menu
)
set /p notes="📝 请输入发布说明 (可选): "
call "%~dp0scripts\create-release.bat" "%version%" "%notes%"
pause
goto menu

:setup_git
echo.
call "%~dp0scripts\setup-git.bat"
goto menu

:show_status
echo.
echo 🔍 Git状态信息:
echo ================================
cd /d "%~dp0.."
echo.
echo 📂 当前分支:
git branch --show-current
echo.
echo 📋 文件状态:
git status
echo.
pause
goto menu

:show_history
echo.
echo 📚 提交历史:
echo ================================
cd /d "%~dp0.."
echo.
echo 📊 最近20次提交:
git log --oneline -20
echo.
pause
goto menu

:manage_branches
echo.
echo 🌿 分支管理:
echo ================================
cd /d "%~dp0.."
echo.
echo 📋 所有分支:
git branch -a
echo.
echo 请选择分支操作:
echo   1. 创建新分支
echo   2. 切换分支
echo   3. 删除分支
echo   4. 返回主菜单
echo.
set /p branch_choice="请选择 (1-4): "

if "%branch_choice%"=="1" (
    set /p branch_name="🌱 请输入新分支名称: "
    git checkout -b !branch_name!
) else if "%branch_choice%"=="2" (
    set /p branch_name="🔄 请输入要切换的分支名称: "
    git checkout !branch_name!
) else if "%branch_choice%"=="3" (
    set /p branch_name="🗑️ 请输入要删除的分支名称: "
    git branch -d !branch_name!
) else if "%branch_choice%"=="4" (
    goto menu
)

pause
goto manage_branches

:invalid
echo.
echo ❌ 无效选择，请重新输入
echo.
pause
goto menu

:exit
echo.
echo 👋 感谢使用ReciteKing Git管理工具！
echo.
pause
