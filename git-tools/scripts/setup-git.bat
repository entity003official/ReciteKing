@echo off
chcp 65001 >nul

echo.
echo ⚙️ ReciteKing Git环境配置
echo ================================
echo.

REM 切换到项目根目录
cd /d "%~dp0..\.."

echo 📂 当前目录: %CD%
echo.

echo 🔧 配置Git提交模板...
git config commit.template git-tools/templates/commit-template.txt

echo 🔧 配置用户信息...
git config user.name "ReciteKing Developer"
git config user.email "developer@reciteking.com"

echo 🔧 配置Git行为...
git config core.autocrlf true
git config core.safecrlf warn
git config push.default simple

echo 🔧 配置Git别名...
git config alias.st "status --short"
git config alias.co "checkout"
git config alias.br "branch"
git config alias.ci "commit"
git config alias.unstage "reset HEAD --"
git config alias.last "log -1 HEAD"
git config alias.visual "!gitk"
git config alias.lg "log --color --graph --pretty=format:'%%Cred%%h%%Creset -%%C(yellow)%%d%%Creset %%s %%Cgreen(%%cr) %%C(bold blue)<%%an>%%Creset' --abbrev-commit"

echo.
echo 📋 当前Git配置:
echo   👤 用户名称: 
git config user.name
echo   📧 用户邮箱: 
git config user.email
echo   📝 提交模板: 
git config commit.template
echo   🌐 远程仓库: 
git remote get-url origin

echo.
echo ✅ Git环境配置完成！
echo.
echo 💡 可用的Git别名:
echo   git st      - 简洁状态显示
echo   git lg      - 美观的提交历史
echo   git last    - 显示最后一次提交
echo   git unstage - 取消暂存文件
echo.

pause
