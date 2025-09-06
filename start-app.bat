@echo off
echo ========================================
echo    ReciteKing - 新标准日本语词汇学习系统      
echo ========================================
echo.

:: 检查Python是否可用
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo Python未找到，将使用默认浏览器打开
    start "" "web\index.html"
    exit /b 0
)

echo 选择启动模式:
echo 1. 启动本地服务器（推荐，支持完整功能）
echo 2. 直接打开HTML文件（简单，可能有功能限制）
echo.

set /p choice=请选择 (1/2): 

if "%choice%"=="1" (
    echo 正在启动本地服务器...
    echo 请在浏览器中访问 http://localhost:8080
    echo 按Ctrl+C可以停止服务器
    echo.
    cd web
    python -m http.server 8080
) else (
    echo 正在直接打开HTML文件...
    start "" "web\index.html"
)

exit /b 0
