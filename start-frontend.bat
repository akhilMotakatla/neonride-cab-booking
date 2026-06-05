@echo off
title NeonRide Frontend
echo.
echo  ==========================================
echo   NeonRide Frontend ^|  http://localhost:5173
echo  ==========================================
echo.
cd /d "%~dp0frontend"
npm run dev
pause
