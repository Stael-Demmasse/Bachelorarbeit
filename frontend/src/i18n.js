import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Traductions
const resources = {
  en: {
    translation: {
      // Navigation et interface générale
      welcome: "Welcome",
      login: "Login",
      register: "Register",
      logout: "Logout",
      username: "Username",
      password: "Password",
      email: "Email",
      confirmPassword: "Confirm Password",
      submit: "Submit",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      close: "Close",
      loading: "Loading...",
      error: "Error",
      success: "Success",

      // Chat interface
      chatTitle: "AI Chat Assistant",
      typeMessage: "Type your message...",
      send: "Send",
      newSession: "New Session",
      sessions: "Sessions",
      noSessions: "No sessions yet",
      deleteSession: "Delete Session",
      renameSession: "Rename Session",
      sessionName: "Session Name",

      // Modes de chat
      chatMode: "Chat Mode",
      normalMode: "Normal",
      compareMode: "Compare",
      voiceMode: "Voice",
      fileMode: "File Analysis",
      toggleTheme: "Toggle Theme",
      toggleSpeech: "Toggle Speech",

      // Modèles IA
      aiModel: "AI Model",
      chatgpt: "ChatGPT",
      gemini: "Gemini",
      claude: "Claude",
      deepseek: "DeepSeek",

      // API Info
      premiumIntegrations: "Advanced Premium Integrations",
      chatgptDescription: "OpenAI API (gpt-4o) with authentication",
      geminiDescription: "Secure Google API (gemini-2.5-pro)",
      deepseekDescription: "DeepSeek chat API ",
      claudeDescription: "Ethical Anthropic API (claude-sonnet-4)",
      speechDescription: "Complete Speech Recognition + Synthesis",
      authDescription: "User accounts with private sessions",
      multiModalAssistant: "Complete Multi-Modal AI Assistant",
      assistantFeatures: "Voice chat + File analysis ",

      // Reconnaissance vocale
      startRecording: "Start Recording",
      stopRecording: "Stop Recording",
      listening: "Listening...",
      speechNotSupported: "Speech recognition not supported in this browser",

      // Messages d'erreur
      loginError: "Login failed. Please check your credentials.",
      registerError: "Registration failed. Please try again.",
      networkError: "Network error. Please check your connection.",
      sessionError: "Error managing session",

      // API Info
      apiIntegrations: "Premium Advanced Integrations",
      speechFeature: "Speech: Complete Recognition + Synthesis",
      authFeature: "Auth: User accounts with private sessions",

      // ChatMessages translations
      startConversation: "Start a conversation with AI",
      currentMode: "Current mode",
      comparativeMode: "Comparative (4 models)",
      chatgptOnly: "ChatGPT only",
      geminiOnly: "Gemini only",
      deepseekOnly: "DeepSeek only",
      claudeOnly: "Claude only",

      new: "New",

      listenResponse: "Listen to response",
      fourAIThinking: "The 4 AIs are thinking...",
      aiThinking: "AI is thinking...",
      currentSession: "Current session",
      newConversation: "New conversation",
    },
  },
  fr: {
    translation: {
      // Navigation et interface générale
      welcome: "Bienvenue",
      login: "Connexion",
      register: "Inscription",
      logout: "Déconnexion",
      username: "Nom d'utilisateur",
      password: "Mot de passe",
      email: "Email",
      confirmPassword: "Confirmer le mot de passe",
      submit: "Valider",
      cancel: "Annuler",
      save: "Sauvegarder",
      delete: "Supprimer",
      edit: "Modifier",
      close: "Fermer",
      loading: "Chargement...",
      error: "Erreur",
      success: "Succès",

      // Interface de chat
      chatTitle: "Assistant de Chat IA",
      typeMessage: "Tapez votre message...",
      send: "Envoyer",
      newSession: "Nouvelle Session",
      sessions: "Sessions",
      noSessions: "Aucune session pour le moment",
      deleteSession: "Supprimer la Session",
      renameSession: "Renommer la Session",
      sessionName: "Nom de la Session",

      // Modes de chat
      chatMode: "Mode de Chat",
      normalMode: "Normal",
      compareMode: "Comparaison",
      voiceMode: "Vocal",
      fileMode: "Analyse de Fichier",
      toggleTheme: "Basculer le Thème",
      toggleSpeech: "Basculer la Synthèse Vocale",

      // Modèles IA
      aiModel: "Modèle IA",
      chatgpt: "ChatGPT",
      gemini: "Gemini",
      claude: "Claude",
      deepseek: "DeepSeek",

      // API Info
      premiumIntegrations: "Intégrations Premium Avancées",
      chatgptDescription: "API OpenAI (gpt-4o) avec authentification",
      geminiDescription: "API Google (gemini-2.5-pro)",
      deepseekDescription: "API DeepSeek chat API ",
      claudeDescription: "API Anthropic (claude-sonnet-4) éthique",
      speechDescription: "Reconnaissance + Synthèse vocale complète",
      authDescription: "Comptes utilisateur avec sessions privées",
      multiModalAssistant: "Assistant IA Multi-Modal Complet",
      assistantFeatures: "Chat vocal + Analyse de fichiers",

      // Reconnaissance vocale
      startRecording: "Commencer l'Enregistrement",
      stopRecording: "Arrêter l'Enregistrement",
      listening: "Écoute en cours...",
      speechNotSupported:
        "Reconnaissance vocale non supportée dans ce navigateur",

      // Messages d'erreur
      loginError: "Échec de la connexion. Vérifiez vos identifiants.",
      registerError: "Échec de l'inscription. Veuillez réessayer.",
      networkError: "Erreur réseau. Vérifiez votre connexion.",
      sessionError: "Erreur de gestion de session",

      // API Info
      apiIntegrations: "Intégrations Premium Avancées",
      speechFeature: "Speech : Reconnaissance + Synthèse vocale complète",
      authFeature: "Auth : Comptes utilisateur avec sessions privées",

      // ChatMessages translations
      startConversation: "Commencez une conversation avec l'IA",
      currentMode: "Mode actuel",
      comparativeMode: "Comparatif (4 modèles)",
      chatgptOnly: "ChatGPT uniquement",
      geminiOnly: "Gemini uniquement",
      deepseekOnly: "DeepSeek uniquement",
      claudeOnly: "Claude uniquement",

      new: "Nouveau",

      listenResponse: "Écouter la réponse",
      fourAIThinking: "Les 4 IA réfléchissent...",
      aiThinking: "L'IA réfléchit...",
      currentSession: "Session actuelle",
      newConversation: "Nouvelle conversation",
    },
  },
  de: {
    translation: {
      // Navigation et interface générale
      welcome: "Willkommen",
      login: "Anmelden",
      register: "Registrieren",
      logout: "Abmelden",
      username: "Benutzername",
      password: "Passwort",
      email: "E-Mail",
      confirmPassword: "Passwort bestätigen",
      submit: "Bestätigen",
      cancel: "Abbrechen",
      save: "Speichern",
      delete: "Löschen",
      edit: "Bearbeiten",
      close: "Schließen",
      loading: "Laden...",
      error: "Fehler",
      success: "Erfolg",

      // Chat-Oberfläche
      chatTitle: "KI-Chat-Assistent",
      typeMessage: "Nachricht eingeben...",
      send: "Senden",
      newSession: "Neue Sitzung",
      sessions: "Sitzungen",
      noSessions: "Noch keine Sitzungen",
      deleteSession: "Sitzung löschen",
      renameSession: "Sitzung umbenennen",
      sessionName: "Sitzungsname",

      // Chat-Modi
      chatMode: "Chat-Modus",
      normalMode: "Normal",
      compareMode: "Vergleichen",
      voiceMode: "Sprache",
      fileMode: "Dateianalyse",
      toggleTheme: "Design wechseln",
      toggleSpeech: "Sprachsynthese umschalten",

      // KI-Modelle
      aiModel: "KI-Modell",
      chatgpt: "ChatGPT",
      gemini: "Gemini",
      claude: "Claude",
      deepseek: "DeepSeek",

      // API Info
      premiumIntegrations: "Erweiterte Premium-Integrationen",
      chatgptDescription: "OpenAI API (gpt-4o) mit Authentifizierung",
      geminiDescription: "Sichere Google API (gemini-2.5-pro)",
      deepseekDescription: "DeepSeek chat API ",
      claudeDescription: "Ethische Anthropic API (claude-sonnet-4)",
      speechDescription: "Vollständige Spracherkennung + Synthese",
      authDescription: "Benutzerkonten mit privaten Sitzungen",
      multiModalAssistant: "Vollständiger Multi-Modaler KI-Assistent",
      assistantFeatures: "Sprach-Chat + Dateianalyse ",

      // Spracherkennung
      startRecording: "Aufnahme starten",
      stopRecording: "Aufnahme stoppen",
      listening: "Höre zu...",
      speechNotSupported:
        "Spracherkennung wird in diesem Browser nicht unterstützt",

      // Fehlermeldungen
      loginError: "Anmeldung fehlgeschlagen. Überprüfen Sie Ihre Anmeldedaten.",
      registerError:
        "Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.",
      networkError: "Netzwerkfehler. Überprüfen Sie Ihre Verbindung.",
      sessionError: "Fehler bei der Sitzungsverwaltung",

      // ChatMessages translations
      startConversation: "Beginnen Sie ein Gespräch mit der KI",
      currentMode: "Aktueller Modus",
      comparativeMode: "Vergleichend (4 Modelle)",
      chatgptOnly: "Nur ChatGPT",
      geminiOnly: "Nur Gemini",
      deepseekOnly: "Nur DeepSeek",
      claudeOnly: "Nur Claude",

      new: "Neu",

      listenResponse: "Antwort anhören",
      fourAIThinking: "Die 4 KIs denken nach...",
      aiThinking: "KI denkt nach...",
      currentSession: "Aktuelle Sitzung",
      newConversation: "Neues Gespräch",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    debug: false,

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
  });

export default i18n;
