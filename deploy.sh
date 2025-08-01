#!/bin/bash

# Script de déploiement automatisé pour le chatbot
# Usage: ./deploy.sh [docker|production|development]

set -e

DEPLOY_TYPE=${1:-docker}

echo "🚀 Démarrage du déploiement en mode: $DEPLOY_TYPE"

case $DEPLOY_TYPE in
  "docker")
    echo "📦 Déploiement avec Docker..."
    
    # Vérifier si .env existe
    if [ ! -f ".env" ]; then
      echo "❌ Fichier .env manquant. Copiez .env.example vers .env et configurez vos clés API."
      cp .env.example .env
      echo "📝 Fichier .env créé. Veuillez le configurer avec vos clés API."
      exit 1
    fi
    
    # Construire et démarrer les services
    echo "🔨 Construction des images Docker..."
    docker-compose build
    
    echo "🚀 Démarrage des services..."
    docker-compose up -d
    
    echo "✅ Déploiement Docker terminé!"
    echo "🌐 Frontend: http://localhost"
    echo "🔧 Backend: http://localhost:8000"
    echo "📚 API Docs: http://localhost:8000/docs"
    ;;
    
  "production")
    echo "🏭 Déploiement en production..."
    
    # Backend
    echo "🔧 Configuration du backend..."
    cd backend
    pip install -r requirements.txt
    
    # Créer le fichier de configuration PM2
    cat > ecosystem.config.json << EOF
{
  "name": "chatbot-backend",
  "script": "server.py",
  "interpreter": "python3",
  "instances": "max",
  "exec_mode": "cluster",
  "env": {
    "PORT": "8000",
    "ENVIRONMENT": "production"
  }
}
EOF
    
    # Démarrer avec PM2
    pm2 start ecosystem.config.json
    pm2 save
    
    cd ..
    
    # Frontend
    echo "🎨 Construction du frontend..."
    cd frontend
    npm install
    npm run build
    
    # Copier vers nginx (ajustez le chemin selon votre configuration)
    sudo cp -r build/* /var/www/html/ 2>/dev/null || echo "⚠️  Copiez manuellement le dossier build vers votre serveur web"
    
    cd ..
    
    echo "✅ Déploiement production terminé!"
    echo "🔄 N'oubliez pas de configurer nginx et SSL"
    ;;
    
  "development")
    echo "🛠️  Démarrage en mode développement..."
    
    # Démarrer le backend
    echo "🔧 Démarrage du backend..."
    cd backend
    python server.py &
    BACKEND_PID=$!
    cd ..
    
    # Démarrer le frontend
    echo "🎨 Démarrage du frontend..."
    cd frontend
    npm start &
    FRONTEND_PID=$!
    cd ..
    
    echo "✅ Serveurs de développement démarrés!"
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔧 Backend: http://localhost:8000"
    
    # Fonction pour arrêter les processus
    cleanup() {
      echo "🛑 Arrêt des serveurs..."
      kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
      exit 0
    }
    
    trap cleanup SIGINT SIGTERM
    
    echo "💡 Appuyez sur Ctrl+C pour arrêter les serveurs"
    wait
    ;;
    
  *)
    echo "❌ Mode de déploiement invalide: $DEPLOY_TYPE"
    echo "Usage: $0 [docker|production|development]"
    exit 1
    ;;
esac