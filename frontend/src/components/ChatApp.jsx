import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext.jsx";
import { useTranslation } from 'react-i18next';
import Header from "./Header.jsx";
import SessionInfo from "./SessionInfo.jsx";
import SessionPanel from "./SessionPanel.jsx";


import ChatMessages from "./ChatMessages.jsx";
import ChatInput from "./ChatInput.jsx";
import APIInfo from "./APIInfo.jsx";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function ChatApp() {
  const { t, i18n } = useTranslation();
  
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });
  const [chatMode, setChatMode] = useState("compare");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(
    () => `session-${Date.now()}`
  );
  const [currentSessionName, setCurrentSessionName] = useState(
    () => t('newConversation')
  );
  const [showSessionPanel, setShowSessionPanel] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState(null);


  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [voiceSettings, setVoiceSettings] = useState({
    rate: 1,
    pitch: 1,
    volume: 0.8,
    voice: null,
  });
  const [availableVoices, setAvailableVoices] = useState([]);
  const recognitionRef = useRef(null);
  const speechSynthesisRef = useRef(null);
  const { user, logout, token } = useAuth();

  const handleFileUploaded = (fileData) => {
    setUploadedFiles(prev => [fileData, ...prev]);
    setSelectedFileId(fileData.file_id);
  };

  // Fonction pour sélectionner la voix selon la langue
  const selectVoiceForLanguage = (voices, language) => {
    let selectedVoice = null;
    
    // Mapping des langues i18n vers les codes de langue des voix
    const languageMapping = {
      'fr': 'fr',
      'en': 'en',
      'de': 'de'
    };
    
    const targetLang = languageMapping[language] || 'en';
    
    // Chercher une voix dans la langue cible
    selectedVoice = voices.find((voice) => voice.lang.startsWith(targetLang));
    
    // Si aucune voix trouvée, utiliser l'anglais par défaut
    if (!selectedVoice) {
      selectedVoice = voices.find((voice) => voice.lang.startsWith('en'));
    }
    
    // Si toujours aucune voix, prendre la première disponible
    if (!selectedVoice && voices.length > 0) {
      selectedVoice = voices[0];
    }
    
    if (selectedVoice) {
      setVoiceSettings((prev) => ({ ...prev, voice: selectedVoice }));
    }
  };

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Effet pour changer la voix quand la langue change
  useEffect(() => {
    if (availableVoices.length > 0) {
      selectVoiceForLanguage(availableVoices, i18n.language);
    }
  }, [i18n.language, availableVoices]);

  // Effet pour changer la langue de reconnaissance vocale quand la langue change
  useEffect(() => {
    if (recognitionRef.current) {
      const getRecognitionLanguage = (language) => {
        const languageMapping = {
          'fr': 'fr-FR',
          'en': 'en-US',
          'de': 'de-DE'
        };
        return languageMapping[language] || 'en-US';
      };
      
      recognitionRef.current.lang = getRecognitionLanguage(i18n.language);
    }
  }, [i18n.language]);

  useEffect(() => {
    loadSessions();

    // Initialize Speech Recognition
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      setSpeechSupported(true);
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      const recognition = recognitionRef.current;
      recognition.continuous = false;
      recognition.interimResults = false;
      
      // Fonction pour obtenir le code de langue de reconnaissance
      const getRecognitionLanguage = (language) => {
        const languageMapping = {
          'fr': 'fr-FR',
          'en': 'en-US',
          'de': 'de-DE'
        };
        return languageMapping[language] || 'en-US';
      };
      
      recognition.lang = getRecognitionLanguage(i18n.language);

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        console.error("Error details:", event);

        // Afficher un message d'erreur spécifique selon le type d'erreur
        let errorMessage = "";
        switch (event.error) {
          case "not-allowed":
            errorMessage =
              "Permission du microphone refusée. Veuillez autoriser l'accès au microphone dans les paramètres du navigateur.";
            break;
          case "no-speech":
            errorMessage =
              "Aucune parole détectée. Essayez de parler plus fort ou vérifiez votre microphone.";
            break;
          case "audio-capture":
            errorMessage =
              "Erreur de capture audio. Vérifiez que votre microphone fonctionne.";
            break;
          case "network":
            errorMessage = "Erreur réseau. Vérifiez votre connexion internet.";
            break;
          case "service-not-allowed":
            errorMessage = "Service de reconnaissance vocale non autorisé.";
            break;
          default:
            errorMessage = `Erreur de reconnaissance vocale: ${event.error}`;
        }

        // Afficher l'erreur à l'utilisateur
        alert(errorMessage);
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);
    }

    // Initialize Speech Synthesis
    if ("speechSynthesis" in window) {
      speechSynthesisRef.current = window.speechSynthesis;

      const loadVoices = () => {
        const voices = speechSynthesisRef.current.getVoices();
        setAvailableVoices(voices);
        
        // Sélectionner la voix selon la langue actuelle
        selectVoiceForLanguage(voices, i18n.language);
      };

      loadVoices();
      speechSynthesisRef.current.addEventListener("voiceschanged", loadVoices);

      return () => {
        if (speechSynthesisRef.current) {
          speechSynthesisRef.current.removeEventListener(
            "voiceschanged",
            loadVoices
          );
        }
      };
    }
  }, []);

  const loadSessions = async () => {
    try {
      const response = await axios.get(`${API}/sessions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions(response.data);
    } catch (error) {
      console.error("Error loading sessions:", error);
    }
  };

  const callChatAPI = async (message, mode, sessionId, sessionName) => {
    try {
      const requestData = {
        session_id: sessionId,
        session_name: sessionName,
        message: message,
        mode: mode,
      };

      // Add file context if a file is selected
      if (selectedFileId) {
        requestData.file_id = selectedFileId;
      }



      const response = await axios.post(
        `${API}/chat`,
        requestData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Chat API Error:", error);
      throw error;
    }
  };



  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user", timestamp: Date.now() };
    setMessages((prev) => [...prev, userMessage]);
    const questionText = input;
    setInput("");
    setLoading(true);

    try {
      const response = await callChatAPI(
        questionText,
        chatMode,
        currentSessionId,
        currentSessionName
      );

      if (chatMode === "compare") {
        const aiMessage = {
          chatgpt: response.chatgpt_response,
          gemini: response.gemini_response,
          deepseek: response.deepseek_response,
          claude: response.claude_response,
          chatgpt_response_time: response.chatgpt_response_time,
          gemini_response_time: response.gemini_response_time,
          deepseek_response_time: response.deepseek_response_time,
          claude_response_time: response.claude_response_time,
          sender: "ai",
          mode: "compare",
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, aiMessage]);

        if (speechEnabled && speechSynthesisRef.current) {
          const firstResponse =
            response.chatgpt_response ||
            response.gemini_response ||
            response.deepseek_response ||
            response.claude_response;
          if (firstResponse) {
            speakText(firstResponse);
          }
        }
      } else {
        const responseText = response[`${chatMode}_response`];
        const responseTime = response[`${chatMode}_response_time`];
        const aiMessage = {
          text: responseText,
          sender: "ai",
          provider: chatMode,
          timestamp: Date.now(),
          response_time: responseTime,
          sources: response.sources || [] // Ajouter les sources si disponibles
        };

        setMessages((prev) => [...prev, aiMessage]);

        if (speechEnabled && speechSynthesisRef.current && responseText) {
          speakText(responseText);
        }
      }

      loadSessions();
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Erreur lors de l'envoi du message. Vérifiez vos clés API dans le backend.",
          sender: "system",
          timestamp: Date.now(),
        },
      ]);
    }

    setLoading(false);
  };

  const newSession = () => {
    const newSessionId = `session-${Date.now()}`;
    setCurrentSessionId(newSessionId);
    setCurrentSessionName(t('newConversation'));
    setMessages([]);
  };

  const loadSession = async (sessionId) => {
    try {
      const response = await axios.get(`${API}/chat/history/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sessionMessages = response.data;

      const convertedMessages = [];
      sessionMessages.forEach((msg) => {
        convertedMessages.push({
          text: msg.message,
          sender: "user",
          timestamp: new Date(msg.timestamp).getTime(),
        });

        if (msg.mode === "compare") {
          convertedMessages.push({
            chatgpt: msg.chatgpt_response,
            gemini: msg.gemini_response,
            deepseek: msg.deepseek_response,
            claude: msg.claude_response,
            sender: "ai",
            mode: "compare",
            timestamp: new Date(msg.timestamp).getTime(),
          });
        } else {
          const responseText = msg[`${msg.mode}_response`];
          if (responseText) {
            convertedMessages.push({
              text: responseText,
              sender: "ai",
              provider: msg.mode,
              timestamp: new Date(msg.timestamp).getTime(),
            });
          }
        }
      });

      setMessages(convertedMessages);
      setCurrentSessionId(sessionId);
      setCurrentSessionName(sessionMessages[0]?.session_name || "Conversation");
      setShowSessionPanel(false);
    } catch (error) {
      console.error("Error loading session:", error);
    }
  };

  const deleteSession = async (sessionId) => {
    try {
      await axios.delete(`${API}/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadSessions();
      if (currentSessionId === sessionId) {
        newSession();
      }
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  const startListening = async () => {
    if (!recognitionRef.current || !speechSupported) {
      alert(
        "La reconnaissance vocale n'est pas supportée par votre navigateur."
      );
      return;
    }

    try {
      // Vérifier les permissions du microphone
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({
          name: "microphone",
        });
        if (permission.state === "denied") {
          alert(
            "Permission du microphone refusée. Veuillez autoriser l'accès au microphone dans les paramètres du navigateur."
          );
          return;
        }
      }

      // Demander l'accès au microphone si nécessaire
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (mediaError) {
          console.error("Erreur d'accès au microphone:", mediaError);
          alert(
            "Impossible d'accéder au microphone. Vérifiez que votre microphone est connecté et autorisé."
          );
          return;
        }
      }

      recognitionRef.current.start();
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      alert(
        "Erreur lors du démarrage de la reconnaissance vocale: " + error.message
      );
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const speakText = (text) => {
    if (!speechSynthesisRef.current || !speechEnabled) return;

    speechSynthesisRef.current.cancel();

    const cleanText = text
      .replace(/\[MOCK.*?\]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);

    utterance.rate = voiceSettings.rate;
    utterance.pitch = voiceSettings.pitch;
    utterance.volume = voiceSettings.volume;

    if (voiceSettings.voice) {
      utterance.voice = voiceSettings.voice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event.error);
      setIsSpeaking(false);
    };

    speechSynthesisRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleSpeech = () => {
    setSpeechEnabled(!speechEnabled);
    if (isSpeaking) {
      stopSpeaking();
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="container mx-auto max-w-7xl px-4 py-6">
        {/* Header */}
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          showSessionPanel={showSessionPanel}
          setShowSessionPanel={setShowSessionPanel}

          newSession={newSession}
          chatMode={chatMode}
          setChatMode={setChatMode}
          speechEnabled={speechEnabled}
          toggleSpeech={toggleSpeech}
          isSpeaking={isSpeaking}
          stopSpeaking={stopSpeaking}
          speechSynthesisRef={speechSynthesisRef}
        />

        {/* Current Session Info */}
        <SessionInfo
          darkMode={darkMode}
          currentSessionName={currentSessionName}
          chatMode={chatMode}
        />

        {/* File Context Indicator */}
        {selectedFileId && (
          <div className={`mb-4 p-3 rounded-lg border-l-4 border-purple-500 ${
            darkMode ? 'bg-purple-900/20 border-purple-400' : 'bg-purple-50 border-purple-500'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-purple-600 dark:text-purple-400">📄</span>
                <span className={`text-sm font-medium ${
                  darkMode ? 'text-purple-300' : 'text-purple-700'
                }`}>
                  Fichier sélectionné: {uploadedFiles.find(f => f.file_id === selectedFileId)?.filename || 'Fichier'}
                </span>
              </div>
              <button
                onClick={() => setSelectedFileId(null)}
                className={`p-1 rounded text-xs hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors ${
                  darkMode ? 'text-purple-400' : 'text-purple-600'
                }`}
                title="Désactiver le contexte de fichier"
              >
                ✕
              </button>
            </div>
          </div>
        )}



        <div className="flex flex-col lg:flex-row gap-6">
          {/* Session Panel */}
          {showSessionPanel && (
            <SessionPanel
              darkMode={darkMode}
              sessions={sessions}
              currentSessionId={currentSessionId}
              loadSession={loadSession}
              deleteSession={deleteSession}
              loadSessions={loadSessions}
            />
          )}



          {/* Chat Section */}
          <div
            className={`flex-1 rounded-xl shadow-lg ${
              darkMode
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-200"
            }`}
          >
            {/* Chat Messages */}
            <ChatMessages
              messages={messages}
              loading={loading}
              chatMode={chatMode}
              darkMode={darkMode}
              speechSynthesisRef={speechSynthesisRef}
              speakText={speakText}
            />

            {/* Input Form */}
            <ChatInput
              input={input}
              setInput={setInput}
              loading={loading}
              handleSendMessage={handleSendMessage}
              speechSupported={speechSupported}
              isListening={isListening}
              startListening={startListening}
              stopListening={stopListening}
              isSpeaking={isSpeaking}
              speechSynthesisRef={speechSynthesisRef}
              darkMode={darkMode}
              onFileUploaded={handleFileUploaded}
            />
          </div>
        </div>

        {/* API Integration Info */}
        <APIInfo darkMode={darkMode} />
      </div>
    </div>
  );
}

export default ChatApp;
