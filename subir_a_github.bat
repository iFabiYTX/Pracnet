@echo off
title Subir Cambios a GitHub - PRACNET
echo ====================================================================
echo  SUBIENDO ARQUITECTURA PRACNET v2.0 A GITHUB
echo ====================================================================
echo.

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git no esta instalado en tu equipo o no se encuentra en el PATH.
    echo.
    echo 1. Descarga e instala Git desde: https://git-scm.com/download/win
    echo    (Durante la instalacion, deja las opciones por defecto para que anada Git al PATH).
    echo 2. Una vez instalado, vuelve a hacer doble clic en este archivo.
    echo.
    pause
    exit /b
)

echo 1. Verificando repositorio Git local...
if not exist .git (
    git init
    git remote add origin https://github.com/iFabiYTX/Pracnet.git
)

echo 2. Configurando rama principal (master)...
git branch -M master

echo 3. Preparando archivos modificados...
git add .

echo 4. Creando commit de la nueva arquitectura...
git commit -m "Refactor v2.0: Migracion oficial a MySQL 8.0, Redis 7.2, Backend Node.js y Docker AWS EC2"

echo 5. Subiendo cambios al repositorio remoto...
git push -u origin master --force

echo.
echo ====================================================================
echo  Subida completada con exito!
echo  Puedes ver los cambios en: https://github.com/iFabiYTX/Pracnet
echo ====================================================================
pause
