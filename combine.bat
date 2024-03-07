@echo off
setlocal enabledelayedexpansion

:: Lista las carpetas y pide al usuario que elija una
echo Selecciona una carpeta:
set /a count=0
for /d %%d in (*) do (
    set /a count+=1
    set "folder!count!=%%d"
    echo !count!. %%d
)

:: Recibe la selección del usuario
set /p choice="Ingresa el numero de la carpeta: "
set "selectedFolder=!folder%choice%!"

:: Verifica si se ha seleccionado una carpeta
if defined selectedFolder (
    echo Has seleccionado la carpeta: !selectedFolder!
    git pull origin main
    node merge.js "!selectedFolder!"
) else (
    echo Selección inválida.
)
pause