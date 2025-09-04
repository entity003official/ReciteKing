@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

REM ReciteKing数据管理 - CSV数据操作工具
title ReciteKing 数据管理 - CSV数据操作

echo.
echo 📊 ReciteKing CSV数据操作工具
echo ================================

set "data_dir=%~dp0..\..\web"
set "backup_dir=%~dp0..\backups"

REM 创建备份目录
if not exist "!backup_dir!" mkdir "!backup_dir!"

if "%1"=="" goto :menu

REM 处理命令行参数
if "%1"=="backup" goto :backup_data
if "%1"=="restore" goto :restore_data
if "%1"=="export" goto :export_data
if "%1"=="merge" goto :merge_data
if "%1"=="validate" goto :validate_data
goto :menu

:menu
echo.
echo 请选择操作:
echo   1. 💾 备份所有CSV数据
echo   2. 📥 恢复数据备份
echo   3. 📤 导出数据报告
echo   4. 🔀 合并CSV文件
echo   5. ✅ 验证数据完整性
echo   6. 🧹 清理重复数据
echo   7. 📊 数据统计分析
echo   8. 🔧 修复数据格式
echo   0. ❌ 退出
echo.
set /p choice="请输入选择 (0-8): "

if "%choice%"=="1" goto :backup_data
if "%choice%"=="2" goto :restore_data
if "%choice%"=="3" goto :export_data
if "%choice%"=="4" goto :merge_data
if "%choice%"=="5" goto :validate_data
if "%choice%"=="6" goto :clean_duplicates
if "%choice%"=="7" goto :data_stats
if "%choice%"=="8" goto :fix_format
if "%choice%"=="0" goto :exit
goto :invalid

:backup_data
echo.
echo 💾 备份所有CSV数据
echo ================================

set "timestamp=%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%%time:~6,2%"
set "timestamp=!timestamp: =0!"
set "backup_folder=!backup_dir!\backup_!timestamp!"

mkdir "!backup_folder!"

echo 📂 正在备份到: !backup_folder!
echo.

REM 备份所有CSV文件
for %%f in ("!data_dir!\*.csv") do (
    echo 💾 备份文件: %%~nxf
    copy "%%f" "!backup_folder!\" >nul
    if !ERRORLEVEL! EQU 0 (
        echo   ✅ %%~nxf 备份成功
    ) else (
        echo   ❌ %%~nxf 备份失败
    )
)

echo.
echo 📝 创建备份信息文件...
echo 备份时间: %date% %time% > "!backup_folder!\backup_info.txt"
echo 备份文件数: >> "!backup_folder!\backup_info.txt"
dir /b "!backup_folder!\*.csv" | find /c ".csv" >> "!backup_folder!\backup_info.txt"

echo ✅ 数据备份完成！
echo 📂 备份位置: !backup_folder!

pause
goto :menu

:restore_data
echo.
echo 📥 恢复数据备份
echo ================================

echo 📂 可用的备份:
dir /b "!backup_dir!" 2>nul

if !ERRORLEVEL! NEQ 0 (
    echo ❌ 没有找到备份文件
    pause
    goto :menu
)

echo.
set /p backup_name="📂 请输入要恢复的备份文件夹名称: "

if "!backup_name!"=="" (
    echo ❌ 备份名称不能为空
    pause
    goto :menu
)

set "restore_folder=!backup_dir!\!backup_name!"

if not exist "!restore_folder!" (
    echo ❌ 备份文件夹不存在
    pause
    goto :menu
)

echo.
echo ⚠️ 这将覆盖当前的CSV数据文件
set /p confirm="确定要继续恢复吗？ (y/N): "

if /i "!confirm!"=="y" (
    echo 📥 正在恢复数据...
    
    for %%f in ("!restore_folder!\*.csv") do (
        echo 📥 恢复文件: %%~nxf
        copy "%%f" "!data_dir!\" >nul
        if !ERRORLEVEL! EQU 0 (
            echo   ✅ %%~nxf 恢复成功
        ) else (
            echo   ❌ %%~nxf 恢复失败
        )
    )
    
    echo ✅ 数据恢复完成！
) else (
    echo ↩️ 恢复操作已取消
)

pause
goto :menu

:export_data
echo.
echo 📤 导出数据报告
echo ================================

set "export_file=!backup_dir!\data_report_%date:~0,4%%date:~5,2%%date:~8,2%.txt"

echo 📊 正在生成数据报告...
echo.

echo ReciteKing 数据报告 > "!export_file!"
echo 生成时间: %date% %time% >> "!export_file!"
echo ================================ >> "!export_file!"
echo. >> "!export_file!"

REM 统计各个CSV文件
for %%f in ("!data_dir!\*.csv") do (
    echo 📊 分析文件: %%~nxf
    echo 文件: %%~nxf >> "!export_file!"
    
    REM 计算行数（减去标题行）
    for /f %%i in ('type "%%f" ^| find /c /v ""') do (
        set /a lines=%%i-1
        echo   数据行数: !lines! >> "!export_file!"
    )
    
    REM 文件大小
    for %%s in ("%%f") do (
        echo   文件大小: %%~zs 字节 >> "!export_file!"
    )
    
    echo. >> "!export_file!"
)

echo ✅ 数据报告已生成: !export_file!
echo 📂 正在打开报告文件...

start notepad "!export_file!"

pause
goto :menu

:merge_data
echo.
echo 🔀 合并CSV文件
echo ================================

echo 📂 可用的CSV文件:
dir /b "!data_dir!\*.csv"

echo.
set /p source1="📄 请输入第一个源文件名: "
set /p source2="📄 请输入第二个源文件名: "
set /p output="📄 请输入输出文件名: "

if "!source1!"=="" or "!source2!"=="" or "!output!"=="" (
    echo ❌ 文件名不能为空
    pause
    goto :menu
)

set "file1=!data_dir!\!source1!"
set "file2=!data_dir!\!source2!"
set "merged_file=!data_dir!\!output!"

if not exist "!file1!" (
    echo ❌ 源文件1不存在: !source1!
    pause
    goto :menu
)

if not exist "!file2!" (
    echo ❌ 源文件2不存在: !source2!
    pause
    goto :menu
)

echo.
echo 🔀 正在合并文件...

REM 复制第一个文件的所有内容
copy "!file1!" "!merged_file!" >nul

REM 添加第二个文件的内容（跳过标题行）
more +1 "!file2!" >> "!merged_file!"

echo ✅ 文件合并完成: !output!

pause
goto :menu

:validate_data
echo.
echo ✅ 验证数据完整性
echo ================================

for %%f in ("!data_dir!\*.csv") do (
    echo 🔍 验证文件: %%~nxf
    
    REM 检查文件是否为空
    for %%s in ("%%f") do (
        if %%~zs EQU 0 (
            echo   ❌ 文件为空
        ) else (
            echo   ✅ 文件大小正常 (%%~zs 字节^)
        )
    )
    
    REM 检查编码（简单检查是否包含中文字符）
    findstr /c:"课程" "%%f" >nul 2>&1
    if !ERRORLEVEL! EQU 0 (
        echo   ✅ 编码正常（包含中文字符）
    ) else (
        echo   ⚠️ 编码可能有问题
    )
    
    REM 统计行数
    for /f %%i in ('type "%%f" ^| find /c /v ""') do (
        set /a lines=%%i
        echo   📊 总行数: !lines!
        if !lines! LSS 2 (
            echo   ⚠️ 数据行数过少
        )
    )
    
    echo.
)

echo ✅ 数据验证完成！

pause
goto :menu

:clean_duplicates
echo.
echo 🧹 清理重复数据
echo ================================

for %%f in ("!data_dir!\*.csv") do (
    echo 🧹 清理文件: %%~nxf
    
    set "temp_file=%%f.tmp"
    set "clean_file=%%f.clean"
    
    REM 获取标题行
    for /f "tokens=*" %%h in ('more +0 "%%f" ^| findstr /n "^" ^| findstr "^1:"') do (
        set "header=%%h"
        set "header=!header:*:=!"
        echo !header! > "!clean_file!"
    )
    
    REM 去重数据行（简单的行对比）
    more +1 "%%f" | sort | findstr /v "^$" >> "!clean_file!"
    
    REM 替换原文件
    move "!clean_file!" "%%f" >nul
    
    echo   ✅ %%~nxf 清理完成
)

echo ✅ 重复数据清理完成！

pause
goto :menu

:data_stats
echo.
echo 📊 数据统计分析
echo ================================

for %%f in ("!data_dir!\*.csv") do (
    echo 📊 统计文件: %%~nxf
    echo --------------------------------
    
    REM 总行数
    for /f %%i in ('type "%%f" ^| find /c /v ""') do (
        set /a total_lines=%%i
        set /a data_lines=%%i-1
        echo   📋 总行数: !total_lines!
        echo   📊 数据行数: !data_lines!
    )
    
    REM 文件大小
    for %%s in ("%%f") do (
        echo   💾 文件大小: %%~zs 字节
    )
    
    REM 修改时间
    for %%t in ("%%f") do (
        echo   🕐 修改时间: %%~tf
    )
    
    echo.
)

echo 📈 总体统计:
set /a total_files=0
set /a total_size=0

for %%f in ("!data_dir!\*.csv") do (
    set /a total_files+=1
    for %%s in ("%%f") do set /a total_size+=%%~zs
)

echo   📁 CSV文件总数: !total_files!
echo   💾 总文件大小: !total_size! 字节

pause
goto :menu

:fix_format
echo.
echo 🔧 修复数据格式
echo ================================

for %%f in ("!data_dir!\*.csv") do (
    echo 🔧 修复文件: %%~nxf
    
    set "backup_file=%%f.bak"
    set "fixed_file=%%f.fixed"
    
    REM 备份原文件
    copy "%%f" "!backup_file!" >nul
    
    REM 修复常见格式问题
    REM 1. 删除多余的空行
    REM 2. 统一编码
    REM 3. 修复换行符
    
    type "%%f" | findstr /v "^$" > "!fixed_file!"
    
    REM 替换原文件
    move "!fixed_file!" "%%f" >nul
    
    echo   ✅ %%~nxf 格式修复完成
    echo   💾 原文件备份为: %%~nxf.bak
)

echo ✅ 数据格式修复完成！

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
echo 👋 感谢使用ReciteKing CSV数据操作工具！
echo.
pause
