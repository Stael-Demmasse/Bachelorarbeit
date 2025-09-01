# Technische Dokumentation - Chatbot-Anwendung

## Überblick

Diese Anwendung ist ein moderner, mehrsprachiger Chatbot, der mehrere Large Language Models (LLMs) integriert und eine benutzerfreundliche Web-Oberfläche bietet. Das System ermöglicht es Benutzern, mit verschiedenen AI-Modellen zu interagieren, Dateien hochzuladen und Chat-Sitzungen zu verwalten.

## Architektur

### Systemarchitektur (3-Tier-Architektur)

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Frontend     │    │     Backend     │    │    Database     │
│   (React.js)    │◄──►│   (FastAPI)     │◄──►│   (MongoDB)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  LLM Services   │
                       │ (4 AI-Modelle)  │
                       └─────────────────┘
```

### Komponenten-Übersicht

1. **Frontend (React.js)**: Benutzeroberfläche mit modernem Design
2. **Backend (FastAPI)**: RESTful API-Server mit asynchroner Verarbeitung
3. **Datenbank (MongoDB)**: NoSQL-Datenbank für Benutzer- und Chat-Daten
4. **LLM-Services**: Integration von 4 verschiedenen AI-Modellen

## Backend-Architektur (FastAPI)

### Projektstruktur

```
backend/
├── config/
│   ├── database.py          # MongoDB-Verbindung
│   └── settings.py          # Konfigurationseinstellungen
├── models/
│   └── schemas.py           # Pydantic-Datenmodelle
├── routes/
│   ├── auth.py             # Authentifizierungs-Endpunkte
│   ├── chat.py             # Chat-Endpunkte
│   ├── files.py            # Datei-Upload-Endpunkte
│   └── status.py           # Status-Endpunkte
├── services/
│   ├── auth_service.py     # Authentifizierungs-Services
│   ├── file_processor.py   # Dateiverarbeitung
│   └── llm_service.py      # LLM-API-Integration
├── server.py               # Hauptserver-Datei
└── requirements.txt        # Python-Abhängigkeiten
```

### Hauptkomponenten

#### 1. Server-Konfiguration (`server.py`)
- **FastAPI-Anwendung** mit CORS-Middleware
- **Logging-Konfiguration** für Debugging und Monitoring
- **Routen-Integration**: Auth, Chat, Status, Files
- **Lebenszyklus-Events**: MongoDB-Verbindung bei Start/Stop
- **HTTPS-Unterstützung** für Produktionsumgebung

#### 2. Datenbank-Integration (`database.py`)
- **Asynchrone MongoDB-Verbindung** mit `motor.motor_asyncio`
- **Verbindungsmanagement**: Connect, Disconnect, Get Database
- **Fehlerbehandlung** für Datenbankoperationen
- **Serverless-Unterstützung** für Vercel-Deployment

#### 3. API-Endpunkte

##### Authentifizierung (`auth.py`)
- `POST /register`: Benutzerregistrierung
- `POST /login`: Benutzeranmeldung
- **JWT-Token-Generierung** für sichere Authentifizierung
- **Passwort-Hashing** mit bcrypt

##### Chat (`chat.py`)
- `POST /chat`: Hauptchat-Endpunkt mit Multi-Model-Unterstützung
- `GET /sessions`: Chat-Sitzungen abrufen
- `POST /sessions`: Neue Chat-Sitzung erstellen
- `PUT /sessions/{session_id}`: Sitzung aktualisieren
- `DELETE /sessions/{session_id}`: Sitzung löschen
- `DELETE /history`: Chat-Verlauf löschen

##### Dateien (`files.py`)
- Datei-Upload und -Verarbeitung
- Unterstützung für PDF und DOCX
- Textextraktion für AI-Verarbeitung

##### Status (`status.py`)
- Systemstatus-Überprüfung
- Health-Check-Endpunkte

#### 4. Services

##### LLM-Service (`llm_service.py`)
- **4 AI-Modelle integriert**:
  - OpenAI GPT-4o
  - Google Gemini-1.5-Pro
  - Anthropic Claude-3.5-Sonnet
  - DeepSeek Chat
- **Asynchrone API-Aufrufe** für bessere Performance
- **Fehlerbehandlung** und Retry-Logik
- **Vergleichsmodus** für Multi-Model-Antworten

##### Authentifizierungs-Service (`auth_service.py`)
- JWT-Token-Verwaltung
- Passwort-Hashing und -Verifizierung
- Benutzer-Session-Management

##### Dateiverarbeitung (`file_processor.py`)
- PDF-Textextraktion
- DOCX-Textextraktion
- Datei-Validierung

### Datenmodelle (`schemas.py`)

```python
# Hauptdatenmodelle
class ChatMessage(BaseModel):
    user_message: str
    responses: Dict[str, str]  # Antworten von verschiedenen LLMs
    chat_mode: str
    timestamp: datetime
    files: Optional[List[str]]

class ChatSession(BaseModel):
    session_id: str
    user_id: str
    title: str
    created_at: datetime
    updated_at: datetime

class User(BaseModel):
    username: str
    email: str
    hashed_password: str
    created_at: datetime
```

## Frontend-Architektur (React.js)

### Projektstruktur

```
frontend/src/
├── components/
│   ├── APIInfo.jsx         # API-Informationen
│   ├── AuthContext.jsx     # Authentifizierungs-Kontext
│   ├── ChatApp.jsx         # Haupt-Chat-Komponente
│   ├── ChatInput.jsx       # Chat-Eingabe
│   ├── ChatMessages.jsx    # Chat-Nachrichten
│   ├── FileUpload.jsx      # Datei-Upload
│   ├── Header.jsx          # App-Header
│   ├── LoginForm.jsx       # Anmeldeformular
│   ├── RegisterForm.jsx    # Registrierungsformular
│   └── SessionPanel.jsx    # Sitzungsverwaltung
├── App.jsx                 # Haupt-App-Komponente
├── i18n.js                 # Internationalisierung
├── index.js                # App-Einstiegspunkt
└── App.css                 # Styling
```

### Hauptkomponenten

#### 1. App-Struktur (`App.jsx`)
- **AuthProvider**: Authentifizierungs-Kontext
- **ChatApp**: Haupt-Chat-Interface
- **AuthGate**: Authentifizierungs-Gatekeeper
- **Loading-States**: Benutzerfreundliche Ladeanzeigen

#### 2. Authentifizierung (`AuthContext.jsx`)
- **React Context** für globale Authentifizierung
- **Token-Management** mit localStorage
- **Automatische Token-Validierung**
- **Fehlerbehandlung** für Auth-Operationen

#### 3. Chat-Interface (`ChatApp.jsx`)
- **State-Management** für:
  - Chat-Modus (einzeln/vergleichen)
  - Nachrichten und Sitzungen
  - Datei-Uploads
  - Dark Mode
  - Sprache
- **Real-time Updates** für Chat-Nachrichten
- **Session-Management** für Chat-Verlauf

#### 4. UI-Komponenten
- **Responsive Design** mit Tailwind CSS
- **Dark/Light Mode** Toggle
- **Mehrsprachige Unterstützung** (i18next)
- **Moderne UI-Elemente** mit Animationen

## Verwendete Technologien

### Backend-Technologien

| Technologie | Version | Zweck | Begründung |
|-------------|---------|-------|------------|
| **FastAPI** | Latest | Web-Framework | Hohe Performance, automatische API-Dokumentation, asynchrone Unterstützung |
| **Python** | 3.8+ | Programmiersprache | Umfangreiche AI/ML-Bibliotheken, einfache Syntax |
| **MongoDB** | Latest | Datenbank | Flexible Schema, JSON-ähnliche Dokumente, skalierbar |
| **Motor** | Latest | Async MongoDB Driver | Asynchrone Datenbankoperationen für bessere Performance |
| **Pydantic** | Latest | Datenvalidierung | Typsicherheit, automatische Validierung |
| **JWT** | Latest | Authentifizierung | Stateless, sichere Token-basierte Auth |
| **aiohttp** | Latest | HTTP-Client | Asynchrone HTTP-Requests zu LLM-APIs |
| **Uvicorn** | Latest | ASGI-Server | Hohe Performance, HTTP/2-Unterstützung |

### Frontend-Technologien

| Technologie | Version | Zweck | Begründung |
|-------------|---------|-------|------------|
| **React.js** | 18+ | UI-Framework | Komponentenbasiert, große Community, Virtual DOM |
| **Tailwind CSS** | Latest | CSS-Framework | Utility-first, responsive Design, kleine Bundle-Größe |
| **Axios** | Latest | HTTP-Client | Promise-basiert, Request/Response-Interceptors |
| **i18next** | Latest | Internationalisierung | Mehrsprachige Unterstützung, React-Integration |
| **React Router** | Latest | Routing | Client-side Routing, Navigation |
| **GSAP** | Latest | Animationen | Hochperformante Animationen, Timeline-Kontrolle |

### LLM-APIs

| Anbieter | Modell | Stärken | Anwendungsfall |
|----------|--------|---------|----------------|
| **OpenAI** | GPT-4o | Multimodale Fähigkeiten, Allgemeine Intelligenz | Vielseitige Aufgaben, Code-Generierung |
| **Google** | Gemini-1.5-Pro | Langer Kontext (1M Token), Schnelle Verarbeitung | Lange Dokumente, Komplexe Analysen |
| **Anthropic** | Claude-3.5-Sonnet | Sicherheit, Ethische AI, Präzise Antworten | Sichere Anwendungen, Professionelle Texte |
| **DeepSeek** | DeepSeek-Chat | Logisches Denken, Kosteneffizient | Mathematik, Programmierung, Budget-bewusste Nutzung |

## Datenbank-Design (MongoDB)

### Collections

#### 1. Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  hashed_password: String,
  created_at: Date,
  updated_at: Date
}
```

#### 2. Messages Collection
```javascript
{
  _id: ObjectId,
  session_id: String,
  user_id: String,
  user_message: String,
  responses: {
    gpt4: String,
    gemini: String,
    claude: String,
    deepseek: String
  },
  chat_mode: String, // "single" oder "compare"
  files: [String], // Datei-IDs
  timestamp: Date,
  response_times: {
    gpt4: Number,
    gemini: Number,
    claude: Number,
    deepseek: Number
  }
}
```

#### 3. Sessions Collection
```javascript
{
  _id: ObjectId,
  session_id: String (unique),
  user_id: String,
  title: String,
  created_at: Date,
  updated_at: Date,
  message_count: Number
}
```

#### 4. Files Collection
```javascript
{
  _id: ObjectId,
  filename: String,
  original_name: String,
  file_type: String, // "pdf", "docx"
  file_size: Number,
  extracted_text: String,
  user_id: String,
  upload_date: Date
}
```

### Indizierung
- **Users**: `username`, `email`
- **Messages**: `session_id`, `user_id`, `timestamp`
- **Sessions**: `session_id`, `user_id`, `updated_at`
- **Files**: `user_id`, `upload_date`

## API-Endpunkte

### Authentifizierung
```
POST /auth/register
POST /auth/login
```

### Chat
```
POST /chat/chat
GET /chat/sessions
POST /chat/sessions
PUT /chat/sessions/{session_id}
DELETE /chat/sessions/{session_id}
DELETE /chat/history
```

### Dateien
```
POST /files/upload
GET /files/{file_id}
DELETE /files/{file_id}
```

### Status
```
GET /status/health
GET /status/models
```

## Deployment-Strategien

### 1. Docker-Containerisierung
```dockerfile
# Backend Dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]

# Frontend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### 2. Vercel-Deployment
- **Backend**: Serverless Functions
- **Frontend**: Static Site Generation
- **Automatische Deployments** bei Git-Push

### 3. Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - MONGODB_URL=mongodb://mongo:27017/chatbot
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
  
  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
```

## Sicherheitskonzepte

### 1. Authentifizierung & Autorisierung
- **JWT-Token** mit Ablaufzeit
- **Passwort-Hashing** mit bcrypt
- **Token-Refresh-Mechanismus**
- **Role-based Access Control** (vorbereitet)

### 2. API-Sicherheit
- **CORS-Konfiguration** für Cross-Origin-Requests
- **Input-Validierung** mit Pydantic
- **Rate Limiting** (implementierbar)
- **HTTPS-Enforcement** in Produktion

### 3. Datenschutz
- **Umgebungsvariablen** für API-Keys
- **Keine Speicherung** von API-Keys in Code
- **Datenminimierung** bei Speicherung
- **Sichere Datei-Uploads** mit Validierung

## Performance-Optimierungen

### Backend
- **Asynchrone Verarbeitung** für alle I/O-Operationen
- **Connection Pooling** für Datenbank
- **Caching-Strategien** (implementierbar)
- **Batch-Processing** für Multiple-LLM-Requests

### Frontend
- **Code-Splitting** mit React.lazy
- **Memoization** für teure Berechnungen
- **Virtualisierung** für lange Listen
- **Image-Optimierung** und Lazy Loading

### Datenbank
- **Indizierung** für häufige Abfragen
- **Aggregation Pipelines** für komplexe Queries
- **Sharding** für Skalierung (vorbereitet)

## Monitoring & Logging

### Logging
- **Strukturiertes Logging** mit Python logging
- **Request/Response Logging** für API-Calls
- **Error Tracking** mit Stack Traces
- **Performance Metrics** für LLM-Response-Times

### Monitoring
- **Health Checks** für alle Services
- **Uptime Monitoring** für externe APIs
- **Resource Usage** Tracking
- **Alert-System** für kritische Fehler

## Erweiterungsmöglichkeiten

### Geplante Features
1. **Voice-to-Text** Integration
2. **Real-time Collaboration** mit WebSockets
3. **Advanced File Processing** (Excel, PowerPoint)
4. **Custom AI Models** Integration
5. **Analytics Dashboard** für Nutzungsstatistiken
6. **Mobile App** mit React Native
7. **Plugin-System** für Erweiterungen
8. **Advanced Search** in Chat-Verlauf

### Skalierungsstrategien
1. **Microservices-Architektur** für größere Teams
2. **Load Balancing** für hohe Verfügbarkeit
3. **CDN-Integration** für globale Performance
4. **Database Sharding** für große Datenmengen
5. **Kubernetes-Deployment** für Container-Orchestrierung

## Fazit

Diese Chatbot-Anwendung stellt eine moderne, skalierbare und benutzerfreundliche Lösung dar, die mehrere State-of-the-Art LLMs integriert. Die Architektur ist darauf ausgelegt, sowohl für kleine Teams als auch für größere Unternehmensanwendungen geeignet zu sein, mit klaren Erweiterungspfaden und robusten Sicherheitsmaßnahmen.

Die Verwendung von FastAPI und React.js ermöglicht eine schnelle Entwicklung und einfache Wartung, während die MongoDB-Integration flexible Datenmodellierung und Skalierung unterstützt. Die Multi-Model-LLM-Integration bietet Benutzern die Möglichkeit, die Stärken verschiedener AI-Modelle zu nutzen und Antworten zu vergleichen.