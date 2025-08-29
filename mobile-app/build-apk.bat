@echo off
title 假名背诵王 - Android APK 构建工具
cls
echo ========================================
echo    假名背诵王 Android APK 构建工具
echo ========================================
echo.

echo 检查环境...
echo.

REM 检查Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未找到 Node.js，请先安装 Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✅ Node.js 已安装
)

REM 检查Cordova
cordova --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未找到 Cordova，正在安装...
    npm install -g cordova
    if %errorlevel% neq 0 (
        echo ❌ Cordova 安装失败
        pause
        exit /b 1
    )
) else (
    echo ✅ Cordova 已安装
)

echo.
echo 选择构建类型:
echo [1] 初始化项目 (首次使用)
echo [2] 构建调试版 APK
echo [3] 构建发布版 APK
echo [4] 退出
echo.
set /p choice="请输入选择 (1-4): "

if "%choice%"=="1" goto init
if "%choice%"=="2" goto debug
if "%choice%"=="3" goto release
if "%choice%"=="4" goto end
goto menu

:init
echo.
echo 正在初始化 Cordova 项目...
cordova platform add android
if %errorlevel% neq 0 (
    echo ❌ 初始化失败
) else (
    echo ✅ 初始化完成
)
goto end

:debug
echo.
echo 正在构建调试版 APK...
cordova build android
if %errorlevel% neq 0 (
    echo ❌ 构建失败
) else (
    echo ✅ 构建完成
    echo APK 位置: platforms\android\app\build\outputs\apk\debug\app-debug.apk
)
goto end

:release
echo.
echo 正在构建发布版 APK...
cordova build android --release
if %errorlevel% neq 0 (
    echo ❌ 构建失败
) else (
    echo ✅ 构建完成
    echo APK 位置: platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk
    echo.
    echo 注意: 发布版需要签名才能安装
)
goto end

:end
echo.
pause
