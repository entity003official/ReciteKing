@echo off
title Kana Recite King Web Server
cls
echo ================================
echo    Kana Recite King Web Server
echo ================================
echo.
echo Starting server...
echo.
echo Please visit in your browser:
echo   http://localhost:8000
echo   http://127.0.0.1:8000
echo.
echo Press Ctrl+C to stop server
echo ================================
echo.
python -m http.server 8000 --bind 127.0.0.1
echo.
echo Server stopped.
pause
