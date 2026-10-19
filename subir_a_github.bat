@echo off
echo ====================================================================
echo  Subir PRACNET a GitHub para Despliegue en la Nube (Render.com)
echo ====================================================================
echo.
set /p repo="Pega aqui la URL de tu repositorio de GitHub: "
git remote remove origin 2>nul
git remote add origin %repo%
git branch -M main
echo.
echo >> Subiendo codigo a GitHub...
git push -u origin main
echo.
echo ====================================================================
echo  Codigo subido con exito! 
echo  Ahora ve a https://render.com y conecta este repositorio.
echo ====================================================================
pause
