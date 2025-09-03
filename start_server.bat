@echo off
chcp 65001 >nul
echo 正在启动日语单词背诵王开发服务器...
echo.
echo 服务器将在 http://localhost:8080 启动
echo 按 Ctrl+C 停止服务器
echo.
cd /d "%~dp0web"
python -m http.server 8080
pause
