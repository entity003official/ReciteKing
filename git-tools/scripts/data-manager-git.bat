@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

REM 数据管理Git分支操作脚本
title ReciteKing 数据管理 - Git分支操作

echo.
echo 🔧 ReciteKing 数据管理 Git操作工具
echo ================================

if "%1"=="" goto :menu

REM 处理命令行参数
if "%1"=="create" goto :create_branch
if "%1"=="switch" goto :switch_branch
if "%1"=="merge" goto :merge_branch
if "%1"=="delete" goto :delete_branch
if "%1"=="list" goto :list_branches
if "%1"=="status" goto :show_status
goto :menu

:menu
echo.
echo 请选择操作:
echo   1. 🌱 创建新分支
echo   2. 🔄 切换分支
echo   3. 🔀 合并分支
echo   4. 🗑️ 删除分支
echo   5. 📋 查看所有分支
echo   6. 📊 查看Git状态
echo   7. 📝 提交数据更改
echo   8. 📤 推送到远程
echo   0. ❌ 退出
echo.
set /p choice="请输入选择 (0-8): "

if "%choice%"=="1" goto :create_branch
if "%choice%"=="2" goto :switch_branch
if "%choice%"=="3" goto :merge_branch
if "%choice%"=="4" goto :delete_branch
if "%choice%"=="5" goto :list_branches
if "%choice%"=="6" goto :show_status
if "%choice%"=="7" goto :commit_data
if "%choice%"=="8" goto :push_changes
if "%choice%"=="0" goto :exit
goto :invalid

:create_branch
echo.
echo 🌱 创建新分支
echo ================================
cd /d "%~dp0.."

if "%2"=="" (
    set /p branch_name="🏷️ 请输入分支名称: "
) else (
    set branch_name=%2
)

if "!branch_name!"=="" (
    echo ❌ 分支名称不能为空
    pause
    goto :menu
)

echo.
echo 📋 当前分支信息:
git branch --show-current
echo.

echo 🌱 正在创建分支: !branch_name!
git checkout -b !branch_name!

if !ERRORLEVEL! EQU 0 (
    echo ✅ 分支 !branch_name! 创建成功
    echo 📝 建议添加分支描述信息到README或项目文档中
) else (
    echo ❌ 分支创建失败
)

if "%2"=="" pause
goto :menu

:switch_branch
echo.
echo 🔄 切换分支
echo ================================
cd /d "%~dp0.."

echo 📋 可用分支:
git branch -a
echo.

if "%2"=="" (
    set /p branch_name="🔄 请输入要切换的分支名称: "
) else (
    set branch_name=%2
)

if "!branch_name!"=="" (
    echo ❌ 分支名称不能为空
    pause
    goto :menu
)

echo.
echo 🔄 正在切换到分支: !branch_name!
git checkout !branch_name!

if !ERRORLEVEL! EQU 0 (
    echo ✅ 已切换到分支: !branch_name!
    echo 📊 当前分支状态:
    git status --short
) else (
    echo ❌ 分支切换失败
)

if "%2"=="" pause
goto :menu

:merge_branch
echo.
echo 🔀 合并分支
echo ================================
cd /d "%~dp0.."

echo 📋 当前分支:
git branch --show-current
echo.
echo 📋 所有分支:
git branch
echo.

if "%2"=="" (
    set /p branch_name="🔀 请输入要合并的分支名称: "
) else (
    set branch_name=%2
)

if "!branch_name!"=="" (
    echo ❌ 分支名称不能为空
    pause
    goto :menu
)

echo.
echo ⚠️ 准备合并分支 !branch_name! 到当前分支
set /p confirm="确定要继续吗？ (y/N): "

if /i "!confirm!"=="y" (
    echo 🔀 正在合并分支: !branch_name!
    git merge !branch_name!
    
    if !ERRORLEVEL! EQU 0 (
        echo ✅ 分支合并成功
        echo 📊 合并后状态:
        git log --oneline -5
    ) else (
        echo ❌ 分支合并失败，可能存在冲突
        echo 💡 请手动解决冲突后再次尝试
    )
) else (
    echo ↩️ 合并操作已取消
)

if "%2"=="" pause
goto :menu

:delete_branch
echo.
echo 🗑️ 删除分支
echo ================================
cd /d "%~dp0.."

echo 📋 当前分支:
git branch --show-current
echo.
echo 📋 所有分支:
git branch
echo.

if "%2"=="" (
    set /p branch_name="🗑️ 请输入要删除的分支名称: "
) else (
    set branch_name=%2
)

if "!branch_name!"=="" (
    echo ❌ 分支名称不能为空
    pause
    goto :menu
)

REM 检查是否为主分支
if "!branch_name!"=="main" (
    echo ❌ 不能删除主分支！
    pause
    goto :menu
)

if "!branch_name!"=="master" (
    echo ❌ 不能删除主分支！
    pause
    goto :menu
)

echo.
echo ⚠️ 准备删除分支: !branch_name!
set /p confirm="确定要删除这个分支吗？ (y/N): "

if /i "!confirm!"=="y" (
    echo 🗑️ 正在删除分支: !branch_name!
    git branch -d !branch_name!
    
    if !ERRORLEVEL! EQU 0 (
        echo ✅ 分支删除成功
    ) else (
        echo ⚠️ 普通删除失败，尝试强制删除...
        set /p force="强制删除分支？(将丢失未合并的更改) (y/N): "
        if /i "!force!"=="y" (
            git branch -D !branch_name!
            echo ✅ 分支已强制删除
        ) else (
            echo ↩️ 删除操作已取消
        )
    )
) else (
    echo ↩️ 删除操作已取消
)

if "%2"=="" pause
goto :menu

:list_branches
echo.
echo 📋 查看所有分支
echo ================================
cd /d "%~dp0.."

echo 🌿 本地分支:
git branch
echo.

echo 🌐 远程分支:
git branch -r
echo.

echo 🔍 分支详细信息:
git branch -vv
echo.

echo 📊 最近提交:
git log --oneline --graph --all -10

if "%2"=="" pause
goto :menu

:show_status
echo.
echo 📊 Git状态信息
echo ================================
cd /d "%~dp0.."

echo 📂 当前目录: %CD%
echo.

echo 🌿 当前分支:
git branch --show-current
echo.

echo 📊 工作区状态:
git status
echo.

echo 📝 最近提交:
git log --oneline -5
echo.

echo 🔍 文件变更统计:
git diff --stat

if "%2"=="" pause
goto :menu

:commit_data
echo.
echo 📝 提交数据更改
echo ================================
cd /d "%~dp0.."

echo 📊 当前工作区状态:
git status
echo.

set /p commit_msg="📝 请输入提交信息: "

if "!commit_msg!"=="" (
    echo ❌ 提交信息不能为空
    pause
    goto :menu
)

echo.
echo 📝 正在提交更改...
git add .
git commit -m "!commit_msg!"

if !ERRORLEVEL! EQU 0 (
    echo ✅ 提交成功
    echo 📊 提交后状态:
    git log --oneline -3
) else (
    echo ❌ 提交失败
)

pause
goto :menu

:push_changes
echo.
echo 📤 推送到远程仓库
echo ================================
cd /d "%~dp0.."

echo 🌿 当前分支:
set current_branch=
for /f "tokens=*" %%i in ('git branch --show-current') do set current_branch=%%i

echo 当前分支: !current_branch!
echo.

echo 📤 正在推送到远程仓库...
git push origin !current_branch!

if !ERRORLEVEL! EQU 0 (
    echo ✅ 推送成功
) else (
    echo ❌ 推送失败
    echo 💡 可能需要先设置上游分支:
    echo    git push --set-upstream origin !current_branch!
    echo.
    set /p setup_upstream="是否设置上游分支并推送？ (y/N): "
    if /i "!setup_upstream!"=="y" (
        git push --set-upstream origin !current_branch!
    )
)

pause
goto :menu

:invalid
echo.
echo ❌ 无效选择，请重新输入
echo.
pause
goto :menu

:exit
echo.
echo 👋 感谢使用ReciteKing数据管理Git工具！
echo.
pause
