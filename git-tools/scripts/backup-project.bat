@echo off
chcp 65001 >nul

echo.
echo 💾 ReciteKing项目备份工具
echo ================================
echo.

REM 切换到项目根目录
cd /d "%~dp0..\.."

REM 设置备份目录
set BACKUP_DIR=%USERPROFILE%\Desktop\ReciteKing_Backups
set TODAY=%date:~0,4%-%date:~5,2%-%date:~8,2%
set TIME=%time:~0,2%-%time:~3,2%-%time:~6,2%
set TIME=%TIME: =0%
set BACKUP_NAME=ReciteKing_%TODAY%_%TIME%

echo 📂 项目目录: %CD%
echo 💾 备份目录: %BACKUP_DIR%\%BACKUP_NAME%
echo.

REM 创建备份目录
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

echo 📦 开始备份...
echo.

REM 复制项目文件
xcopy . "%BACKUP_DIR%\%BACKUP_NAME%" /E /I /H /Y /EXCLUDE:%~dp0..\templates\backup-exclude.txt

if errorlevel 1 (
    echo ❌ 备份失败！
    pause
    exit /b 1
)

REM 创建备份信息文件
echo # 📦 ReciteKing项目备份 > "%BACKUP_DIR%\%BACKUP_NAME%\BACKUP_INFO.md"
echo. >> "%BACKUP_DIR%\%BACKUP_NAME%\BACKUP_INFO.md"
echo ## 📅 备份信息 >> "%BACKUP_DIR%\%BACKUP_NAME%\BACKUP_INFO.md"
echo. >> "%BACKUP_DIR%\%BACKUP_NAME%\BACKUP_INFO.md"
echo - **备份时间**: %date% %time% >> "%BACKUP_DIR%\%BACKUP_NAME%\BACKUP_INFO.md"
echo - **备份名称**: %BACKUP_NAME% >> "%BACKUP_DIR%\%BACKUP_NAME%\BACKUP_INFO.md"
echo - **源目录**: %CD% >> "%BACKUP_DIR%\%BACKUP_NAME%\BACKUP_INFO.md"
echo. >> "%BACKUP_DIR%\%BACKUP_NAME%\BACKUP_INFO.md"
echo ## 📊 Git信息 >> "%BACKUP_DIR%\%BACKUP_NAME%\BACKUP_INFO.md"
echo. >> "%BACKUP_DIR%\%BACKUP_NAME%\BACKUP_INFO.md"
echo - **当前分支**: >> "%BACKUP_DIR%\%BACKUP_NAME%\BACKUP_INFO.md"
git branch --show-current >> "%BACKUP_DIR%\%BACKUP_NAME%\BACKUP_INFO.md"
echo. >> "%BACKUP_DIR%\%BACKUP_NAME%\BACKUP_INFO.md"
echo - **最新提交**: >> "%BACKUP_DIR%\%BACKUP_NAME%\BACKUP_INFO.md"
git log --oneline -1 >> "%BACKUP_DIR%\%BACKUP_NAME%\BACKUP_INFO.md"

echo ✅ 备份完成！
echo.
echo 📍 备份位置: %BACKUP_DIR%\%BACKUP_NAME%
echo 📊 备份大小: 
dir "%BACKUP_DIR%\%BACKUP_NAME%" /-C /S | find "个文件"

echo.
echo 🎉 备份成功创建！
echo 💡 建议定期备份重要版本
echo.

REM 询问是否打开备份文件夹
set /p open_choice="是否打开备份文件夹? (y/N): "
if /i "%open_choice%"=="y" (
    start "" "%BACKUP_DIR%"
)

pause
