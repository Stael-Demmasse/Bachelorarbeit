@echo off

rem Démarrer le backend
cd backend
start "Backend Server" cmd /k "python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000"

rem Revenir au répertoire racine et démarrer le frontend
cd ..
cd frontend
start "Frontend Server" cmd /k "npm start"

echo Serveurs démarrés. Fermez les fenêtres pour arrêter.
pause