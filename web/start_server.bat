@echo off
chcp 65001 >nul 2>&1
echo ������������������WebӦ��...
echo.
echo ����������з���: http://localhost:8000
echo �� Ctrl+C ����ֹͣ������
echo.
python -m http.server 8000
pause
