@echo off
echo ========================================
echo    ReciteKing项目 - GitHub上传工具      
echo ========================================
echo.

:: 检查PowerShell是否可用
where powershell >nul 2>&1
if %errorlevel% neq 0 (
    echo PowerShell未找到，请确保您的系统已安装PowerShell
    pause
    exit /b 1
)

:: 以管理员权限启动PowerShell脚本
echo 正在启动上传工具...
powershell -ExecutionPolicy Bypass -File "%~dp0upload-to-github.ps1"

pause
