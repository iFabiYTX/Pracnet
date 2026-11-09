@echo off
title PRACNET - Compilador APK Android
echo ===================================================
echo   Compilando APK de PRACNET Móvil (Android)
echo ===================================================
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
set "ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk"
set "PATH=%JAVA_HOME%\bin;%PATH%"
cd /d "%~dp0android-app"
call gradlew.bat assembleDebug
echo.
echo ===================================================
echo   APK generado en: android-app\app\build\outputs\apk\debug\app-debug.apk
echo ===================================================
pause
