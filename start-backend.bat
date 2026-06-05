@echo off
title NeonRide Backend
echo.
echo  ==========================================
echo   NeonRide Backend  ^|  http://localhost:5000
echo  ==========================================
echo.
cd /d "%~dp0backend"
dotnet run --urls "http://localhost:5000"
pause
