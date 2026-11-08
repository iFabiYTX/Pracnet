@echo off
title PRACNET - Frontend Web (Jefatura de Carrera)
echo ===================================================
echo   Iniciando Portal Web Institucional PRACNET USM
echo   Conectado a: https://pracnet-api.onrender.com
echo ===================================================
cd /d "%~dp0frontend-web"
set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"
start http://localhost:3000
npm run dev
pause
