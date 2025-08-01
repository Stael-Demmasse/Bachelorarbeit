# 🤖 KI-Chatbot-Assistent

Chatbot multi-modal avancé avec support de 4 modèles d'IA, upload de fichiers, reconnaissance vocale, authentification utilisateur et mesure de performance en temps réel.

## 🚀 Fonctionnalités

### 🤖 Modèles d'IA Supportés
- **ChatGPT (GPT-4o)** - API OpenAI avec authentification
- **Gemini (2.0-flash)** - API Google sécurisée
- **Claude (Sonnet-4)** - API Anthropic éthique
- **DeepSeek** - API pour analyses techniques

### 💬 Modes de Chat
- **Mode Comparaison** : Réponses simultanées des 4 modèles d'IA
- **Mode Individuel** : Chat avec un modèle spécifique
- **Analyse de Fichiers** : Upload et analyse de documents
- **Mode Vocal** : Reconnaissance vocale + synthèse complète
- **⚡ Mesure de Performance** : Temps de réponse en temps réel avec indicateurs colorés

### 🎯 Fonctionnalités Avancées
- 🔐 **Authentification utilisateur** avec sessions privées
- 📁 **Upload de fichiers** et analyse de contenu (PDF, TXT, DOCX)
- 🎤 **Reconnaissance vocale** et synthèse text-to-speech
- 🌙 **Thème sombre/clair** avec persistance
- 🌍 **Support multilingue** (Français, Anglais, Allemand)
- 💾 **Gestion des sessions** avec historique
- 📱 **Design responsive** optimisé mobile
- ⏱️ **Indicateurs de performance** avec temps de réponse colorés
- 🔄 **Streaming en temps réel** des réponses IA

## 🛠️ Stack Technologique

### 🎨 Frontend
- **React 18** - Framework UI moderne avec hooks
- **Tailwind CSS** - Framework CSS utility-first
- **GSAP** - Animations haute performance
- **i18next** - Internationalisation complète
- **Axios** - Client HTTP avec intercepteurs
- **React Router** - Navigation SPA
- **Web Speech API** - Reconnaissance/synthèse vocale
- **Context API** - Gestion d'état global

### ⚙️ Backend
- **FastAPI** - Framework Python moderne et rapide
- **MongoDB** - Base de données NoSQL flexible
- **PyMongo** - Driver MongoDB asynchrone
- **Uvicorn** - Serveur ASGI haute performance
- **JWT** - Authentification sécurisée
- **aiohttp** - Requêtes HTTP asynchrones
- **Pydantic** - Validation de données
- **Python-multipart** - Gestion des fichiers

### 🔧 DevOps & Déploiement
- **Docker** - Conteneurisation
- **Docker Compose** - Orchestration multi-services
- **Nginx** - Serveur web et reverse proxy
- **Vercel/Netlify** - Déploiement frontend
- **Heroku/Railway** - Déploiement backend

## 📦 Installation

### 🔧 Prérequis
- **Node.js** (v16 ou supérieur)
- **Python** 3.8+
- **MongoDB** (local ou cloud)
- **Git** pour le clonage

### 1. 📥 Cloner le Repository
```bash
git clone <repository-url>
cd ChatbotProjektFinal
```

### 2. ⚙️ Configuration Backend
```bash
cd backend
pip install -r requirements.txt
```

### 3. 🔑 Variables d'Environnement
Copiez et configurez les fichiers d'environnement :
```bash
# Backend
cp .env.example backend/.env
# Frontend
cp .env.example frontend/.env
```

Éditez `backend/.env` :
```env
# APIs des modèles d'IA
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
CLAUDE_API_KEY=your_claude_api_key_here
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# Base de données
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=chatbot_db

# Sécurité
JWT_SECRET_KEY=your_super_secret_jwt_key_here
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# Configuration serveur
HOST=0.0.0.0
PORT=8000
DEBUG=True
```

Éditez `frontend/.env` :
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_VERSION=1.0.0
```

### 4. 🗄️ Initialiser la Base de Données
```bash
# Démarrer MongoDB (si local)
mongod

# Initialiser la base de données
python setup_database.py
```

### 5. 🎨 Configuration Frontend
```bash
cd ../frontend
npm install
```

## 🚀 Démarrage de l'Application

### 🔧 Méthode 1 : Démarrage Manuel

#### Backend
```bash
cd backend
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend
```bash
cd frontend
npm start
```

### 🚀 Méthode 2 : Démarrage Automatique
```bash
# Windows
.\start_all.bat

# Linux/Mac
./start_all.sh
```

### 🐳 Méthode 3 : Docker
```bash
# Démarrage complet avec Docker Compose
docker-compose up -d

# Arrêt
docker-compose down
```

### 🌐 Accès à l'Application
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:8000
- **Documentation API** : http://localhost:8000/docs
- **MongoDB** : mongodb://localhost:27017 (si local)

## 📚 Scripts Disponibles

### 🎨 Frontend
```bash
npm start          # Serveur de développement
npm test           # Tests unitaires
npm run build      # Build de production
npm run eject      # Eject de Create React App
npm audit fix      # Correction des vulnérabilités
```

### ⚙️ Backend
```bash
uvicorn server:app --reload                    # Serveur de développement
python server.py                               # Démarrage direct
python setup_database.py                      # Initialisation DB
python check_database.py                      # Vérification DB
```

### 🐳 Docker
```bash
docker-compose up -d                          # Démarrage en arrière-plan
docker-compose logs -f                        # Voir les logs
docker-compose down                           # Arrêt des services
docker-compose build                          # Rebuild des images
```

### 🚀 Déploiement
```bash
./deploy.sh docker                            # Déploiement Docker
./deploy.sh production                        # Déploiement production
./deploy.sh development                       # Déploiement développement
```

## 🔧 Configuration Avancée

### 🔑 Clés API Requises
Pour utiliser toutes les fonctionnalités, obtenez des clés API de :
- **[OpenAI](https://platform.openai.com/api-keys)** - GPT-4o
- **[Google AI Studio](https://aistudio.google.com/app/apikey)** - Gemini 2.0-flash
- **[Anthropic](https://console.anthropic.com/)** - Claude Sonnet-4
- **[DeepSeek](https://platform.deepseek.com/)** - DeepSeek

### 📁 Upload de Fichiers
**Formats supportés :**
- **PDF** - Documents, rapports
- **TXT** - Fichiers texte simples
- **DOCX** - Documents Word

**Limitations :**
- Taille maximale : **10MB** par fichier
- Stockage temporaire dans `/backend/uploads/`
- Nettoyage automatique après traitement

### ⚡ Mesure de Performance
**Indicateurs de temps de réponse :**
- 🟢 **Vert** : < 2 secondes (Excellent)
- 🟡 **Jaune** : 2-5 secondes (Bon)
- 🟠 **Orange** : 5-10 secondes (Moyen)
- 🔴 **Rouge** : > 10 secondes (Lent)

**Stockage :**
- Temps de réponse sauvegardés en base
- Historique des performances par modèle
- Statistiques disponibles via API

## 🌍 Internationalisierung

Die Anwendung unterstützt:
- 🇩🇪 Deutsch
- 🇬🇧 Englisch
- 🇫🇷 Französisch

Die Sprache wird automatisch basierend auf den Browser-Einstellungen erkannt.

## 🎨 Animationen

Die Anwendung verwendet GSAP für:
- Eingangsanimationen für Formulare
- Interaktive Hover-Effekte
- Lade-Animationen
- Fehler-Animationen (Shake-Effekt)

## 📱 Responsive Design

Vollständig responsive für:
- Desktop (1920px+)
- Tablet (768px - 1919px)
- Mobile (320px - 767px)

## 🔒 Sicherheit

- JWT-basierte Authentifizierung
- Sichere API-Schlüssel-Verwaltung
- Benutzer-spezifische Datenisolation
- CORS-Konfiguration

## 📄 API-Dokumentation

Die vollständige API-Dokumentation ist verfügbar unter:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🤝 Beitragen

1. Fork das Repository
2. Erstellen Sie einen Feature-Branch
3. Committen Sie Ihre Änderungen
4. Pushen Sie zum Branch
5. Öffnen Sie eine Pull Request

## 📝 Lizenz

Dieses Projekt steht unter der MIT-Lizenz.

## 🚀 Déploiement en Production

### Option 1: Déploiement avec Docker

#### 1. Créer un Dockerfile pour le Backend
```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### 2. Créer un Dockerfile pour le Frontend
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### 3. Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  mongodb:
    image: mongo:7
    container_name: chatbot_mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongodb_data:/data/db
    ports:
      - "27017:27017"

  backend:
    build: ./backend
    container_name: chatbot_backend
    restart: unless-stopped
    environment:
      - MONGODB_URL=mongodb://admin:password@mongodb:27017/chatbot?authSource=admin
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - CLAUDE_API_KEY=${CLAUDE_API_KEY}
      - DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
    depends_on:
      - mongodb
    ports:
      - "8000:8000"

  frontend:
    build: ./frontend
    container_name: chatbot_frontend
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

#### 4. Déployer avec Docker
```bash
# Créer le fichier .env avec vos clés API
echo "OPENAI_API_KEY=your_key" > .env
echo "GEMINI_API_KEY=your_key" >> .env
echo "CLAUDE_API_KEY=your_key" >> .env
echo "DEEPSEEK_API_KEY=your_key" >> .env
echo "JWT_SECRET_KEY=your_secret" >> .env

# Démarrer tous les services
docker-compose up -d
```

### Option 2: Déploiement sur des Services Cloud

#### Backend - Déploiement sur Railway/Render/Heroku

1. **Préparer le backend pour la production:**
```bash
# Créer un Procfile (pour Heroku)
echo "web: uvicorn server:app --host 0.0.0.0 --port \$PORT" > backend/Procfile

# Créer runtime.txt (pour Heroku)
echo "python-3.11.0" > backend/runtime.txt
```

2. **Variables d'environnement à configurer:**
```env
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
CLAUDE_API_KEY=your_claude_key
DEEPSEEK_API_KEY=your_deepseek_key
MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/chatbot
JWT_SECRET_KEY=your_jwt_secret
PORT=8000
```

3. **Base de données MongoDB Atlas:**
   - Créer un cluster sur [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Obtenir l'URL de connexion
   - Configurer les règles de sécurité réseau

#### Frontend - Déploiement sur Vercel/Netlify

1. **Préparer le frontend:**
```bash
cd frontend

# Créer le fichier de configuration pour la production
echo "REACT_APP_BACKEND_URL=https://your-backend-url.com" > .env.production

# Build de production
npm run build
```

2. **Configuration Vercel (vercel.json):**
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "buildCommand": "npm run build",
        "outputDirectory": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

3. **Configuration Netlify (_redirects):**
```
/*    /index.html   200
```

### Option 3: Déploiement sur VPS/Serveur Dédié

#### 1. Préparer le serveur
```bash
# Installer les dépendances
sudo apt update
sudo apt install -y python3 python3-pip nodejs npm nginx mongodb

# Installer PM2 pour la gestion des processus
npm install -g pm2
```

#### 2. Déployer le Backend
```bash
# Cloner et configurer le backend
git clone <your-repo> /var/www/chatbot
cd /var/www/chatbot/backend

# Installer les dépendances Python
pip3 install -r requirements.txt

# Créer le fichier de configuration PM2
echo '{
  "name": "chatbot-backend",
  "script": "server.py",
  "interpreter": "python3",
  "env": {
    "PORT": "8000",
    "MONGODB_URL": "mongodb://localhost:27017/chatbot"
  }
}' > ecosystem.config.json

# Démarrer avec PM2
pm2 start ecosystem.config.json
```

#### 3. Déployer le Frontend
```bash
cd /var/www/chatbot/frontend

# Installer les dépendances et build
npm install
npm run build

# Copier les fichiers vers nginx
sudo cp -r build/* /var/www/html/
```

#### 4. Configuration Nginx
```nginx
# /etc/nginx/sites-available/chatbot
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/chatbot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Option 4: Déploiement avec SSL (HTTPS)

#### Utiliser Certbot pour SSL gratuit
```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx

# Obtenir le certificat SSL
sudo certbot --nginx -d your-domain.com

# Renouvellement automatique
sudo crontab -e
# Ajouter: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Variables d'Environnement de Production

#### Backend (.env)
```env
# API Keys
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=AI...
CLAUDE_API_KEY=sk-ant-...
DEEPSEEK_API_KEY=sk-...

# Database
MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/chatbot

# Security
JWT_SECRET_KEY=your-super-secret-key-here
CORS_ORIGINS=["https://your-frontend-domain.com"]

# Server
PORT=8000
ENVIRONMENT=production
```

#### Frontend (.env.production)
```env
REACT_APP_BACKEND_URL=https://your-backend-domain.com
REACT_APP_ENVIRONMENT=production
```

### Monitoring et Maintenance

#### 1. Logs avec PM2
```bash
# Voir les logs
pm2 logs chatbot-backend

# Monitoring
pm2 monit

# Redémarrer
pm2 restart chatbot-backend
```

#### 2. Backup de la base de données
```bash
# Script de backup automatique
#!/bin/bash
DATE=$(date +"%Y%m%d_%H%M%S")
mongodump --uri="mongodb://localhost:27017/chatbot" --out="/backups/chatbot_$DATE"

# Ajouter au crontab pour backup quotidien
# 0 2 * * * /path/to/backup-script.sh
```

### Sécurité en Production

1. **Firewall Configuration:**
```bash
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

2. **Rate Limiting avec Nginx:**
```nginx
http {
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    
    server {
        location /api {
            limit_req zone=api burst=20 nodelay;
            # ... rest of config
        }
    }
}
```

3. **Variables d'environnement sécurisées:**
   - Ne jamais committer les fichiers .env
   - Utiliser des services de gestion de secrets (AWS Secrets Manager, etc.)
   - Rotation régulière des clés API

## 🆘 Support

Bei Fragen oder Problemen:
1. Überprüfen Sie die API-Dokumentation
2. Stellen Sie sicher, dass alle API-Schlüssel korrekt konfiguriert sind
3. Überprüfen Sie die Browser-Konsole auf Fehler
4. Überprüfen Sie die Backend-Logs

---

**Entwickelt mit ❤️ für die KI-Community**