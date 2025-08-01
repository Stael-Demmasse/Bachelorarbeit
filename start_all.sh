#!/bin/bash

# Démarrer le backend
cd backend
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Démarrer le frontend
cd ../frontend
npm start &
FRONTEND_PID=$!

echo "Serveurs démarrés. PIDs: Backend $BACKEND_PID, Frontend $FRONTEND_PID"
echo "Appuyez sur Ctrl+C pour arrêter."

# Attendre les processus
trap "kill $BACKEND_PID $FRONTEND_PID" INT
wait