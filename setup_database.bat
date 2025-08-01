@echo off
chcp 65001 >nul
echo ========================================
echo   Configuration MongoDB - Windows
echo ========================================
echo.

REM Vérifier si Python est installé
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python n'est pas installé ou pas dans le PATH
    echo Veuillez installer Python depuis https://python.org
    pause
    exit /b 1
)

echo ✅ Python détecté

REM Vérifier si pymongo est installé
python -c "import pymongo" >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  pymongo n'est pas installé
    echo Installation de pymongo...
    pip install pymongo
    if %errorlevel% neq 0 (
        echo ❌ Erreur lors de l'installation de pymongo
        pause
        exit /b 1
    )
    echo ✅ pymongo installé avec succès
) else (
    echo ✅ pymongo déjà installé
)

echo.
echo Lancement du script de configuration...
echo.

REM Exécuter le script Python
python setup_database.py

echo.
echo Appuyez sur une touche pour fermer...
pause >nul