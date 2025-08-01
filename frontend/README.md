# Frontend - KI-Chatbot-Assistent

Interface utilisateur React pour le chatbot multi-modal avec support de 4 modèles d'IA.

## 🎯 Fonctionnalités Frontend

### 🤖 Interface Multi-IA
- **Mode Comparaison** : Affichage simultané des réponses de 4 IA
- **Mode Individuel** : Chat avec un modèle spécifique
- **Indicateurs de performance** : Temps de réponse colorés
- **Streaming en temps réel** : Affichage progressif des réponses

### 🎨 Interface Utilisateur
- **Design moderne** avec Tailwind CSS
- **Mode sombre/clair** avec persistance
- **Animations fluides** avec GSAP
- **Design responsive** pour tous les écrans
- **Thème adaptatif** selon les préférences

### 🔐 Authentification
- **Connexion/Inscription** sécurisée
- **Gestion des sessions** avec JWT
- **Contexte d'authentification** React
- **Protection des routes** privées

### 📁 Gestion des Fichiers
- **Upload drag & drop** intuitif
- **Support multi-formats** (PDF, TXT, DOCX)
- **Prévisualisation** des fichiers
- **Analyse de contenu** par IA

### 🎤 Fonctionnalités Vocales
- **Reconnaissance vocale** Web Speech API
- **Synthèse vocale** intégrée
- **Contrôles audio** intuitifs
- **Support multilingue**

### 🌍 Internationalisation
- **3 langues** : Français, Anglais, Allemand
- **Détection automatique** du navigateur
- **Changement dynamique** de langue
- **Traductions complètes** de l'interface

## 🏗️ Architecture des Composants

### Composants Principaux
- `ChatApp.jsx` - Application principale et logique de chat
- `ChatMessages.jsx` - Affichage des messages avec temps de réponse
- `LoginForm.jsx` - Formulaire de connexion avec animations
- `Header.jsx` - Navigation et contrôles utilisateur
- `FileUpload.jsx` - Gestionnaire d'upload de fichiers
- `ChatInput.jsx` - Zone de saisie avec reconnaissance vocale

### Composants Utilitaires
- `AuthContext.jsx` - Contexte d'authentification global
- `MarkdownRenderer.jsx` - Rendu des réponses formatées
- `LanguageSelector.jsx` - Sélecteur de langue
- `SessionPanel.jsx` - Gestion des sessions de chat
- `APIInfo.jsx` - Informations sur les modèles d'IA

## 🛠️ Technologies Utilisées

### Core
- **React 18** - Framework UI moderne
- **React Router** - Navigation SPA
- **React Context** - Gestion d'état global

### Styling & Animations
- **Tailwind CSS** - Framework CSS utility-first
- **GSAP** - Animations haute performance
- **CSS Modules** - Styles scopés

### Fonctionnalités
- **i18next** - Internationalisation
- **Axios** - Client HTTP
- **Web Speech API** - Reconnaissance/synthèse vocale
- **File API** - Gestion des fichiers

## 📦 Scripts Disponibles

### Développement
```bash
npm start          # Démarre le serveur de développement
npm test           # Lance les tests
npm run build      # Build de production
npm run eject      # Eject de Create React App
```

### Configuration
```bash
npm install        # Installe les dépendances
npm audit fix      # Corrige les vulnérabilités
npm update         # Met à jour les packages
```

## ⚙️ Configuration

### Variables d'Environnement
Créez un fichier `.env` dans le dossier frontend :
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_VERSION=1.0.0
```

### Personnalisation
- **Thèmes** : Modifiez `tailwind.config.js`
- **Langues** : Ajoutez des traductions dans `src/i18n.js`
- **API** : Configurez l'URL backend dans `.env`

## 🚀 Démarrage Rapide

1. **Installation**
```bash
cd frontend
npm install
```

2. **Configuration**
```bash
cp .env.example .env
# Éditez .env avec vos paramètres
```

3. **Démarrage**
```bash
npm start
```

4. **Accès**
- Application : http://localhost:3000
- Hot reload activé automatiquement

## 📱 Responsive Design

### Breakpoints Tailwind
- `sm:` 640px+ (Mobile large)
- `md:` 768px+ (Tablette)
- `lg:` 1024px+ (Desktop)
- `xl:` 1280px+ (Large desktop)

### Optimisations Mobile
- Interface tactile optimisée
- Menus adaptatifs
- Performance optimisée
- Gestes intuitifs

## 🎨 Guide de Style

### Couleurs Principales
- **Primary** : Bleu (#3B82F6)
- **Secondary** : Gris (#6B7280)
- **Success** : Vert (#10B981)
- **Warning** : Orange (#F59E0B)
- **Error** : Rouge (#EF4444)

### Animations
- **Entrée** : Fade + Slide
- **Hover** : Scale + Shadow
- **Loading** : Pulse + Spin
- **Error** : Shake + Color

## 🔧 Développement

### Structure des Dossiers
```
src/
├── components/     # Composants React
├── i18n.js        # Configuration i18n
├── App.jsx        # Composant racine
├── index.js       # Point d'entrée
└── styles/        # Styles globaux
```

### Bonnes Pratiques
- Composants fonctionnels avec hooks
- Props TypeScript (optionnel)
- Tests unitaires avec Jest
- Code splitting automatique

Pour plus d'informations, consultez le [README principal](../README.md) du projet.

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
