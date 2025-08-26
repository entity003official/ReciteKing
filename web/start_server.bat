@echo off
echo 正在启动假名背诵王Web应用...
echo.
echo 请在浏览器中访问: http://localhost:8000
echo 按 Ctrl+C 可以停止服务器
echo.
python -m http.server 8000
pause
