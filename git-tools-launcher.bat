@echo off
chcp 65001 >nul

REM 设置控制台标题
title ReciteKing Git管理中心

REM 切换到git-tools目录
cd /d "%~dp0git-tools"

REM 启动Git管理器
call git-manager.bat
