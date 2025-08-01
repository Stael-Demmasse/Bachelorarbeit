import React from 'react';
import { useAuth } from './AuthContext.jsx';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector.jsx';

const Header = ({ 
  darkMode, 
  setDarkMode, 
  showSessionPanel, 
  setShowSessionPanel, 

  newSession, 
  chatMode, 
  setChatMode, 
  speechEnabled, 
  toggleSpeech, 
  isSpeaking, 
  stopSpeaking, 
  speechSynthesisRef 
}) => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div className="flex items-center gap-4">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          🤖 {t('chatTitle')}
        </h1>
        <div className={`text-sm px-3 py-1 rounded-full ${
          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
        }`}>
          👤 {user?.username}
        </div>
      </div>
      
      <div className="flex items-center gap-3 flex-wrap">
        {/* Session Management */}
        <button
          onClick={() => setShowSessionPanel(!showSessionPanel)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            showSessionPanel
              ? 'bg-blue-600 text-white'
              : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          💬 {t('sessions')}
        </button>



        {/* New Session */}
        <button
          onClick={newSession}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          ➕ {t('newSession')}
        </button>

        {/* Mode Selector */}
        <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
          <button
            onClick={() => setChatMode('compare')}
            className={`px-3 py-2 text-xs font-medium transition-colors ${
              chatMode === 'compare'
                ? 'bg-indigo-600 text-white'
                : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {t('compareMode')}
          </button>
          <button
            onClick={() => setChatMode('chatgpt')}
            className={`px-3 py-2 text-xs font-medium transition-colors ${
              chatMode === 'chatgpt'
                ? 'bg-green-600 text-white'
                : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            ChatGPT
          </button>
          <button
            onClick={() => setChatMode('gemini')}
            className={`px-3 py-2 text-xs font-medium transition-colors ${
              chatMode === 'gemini'
                ? 'bg-purple-600 text-white'
                : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Gemini
          </button>
          <button
            onClick={() => setChatMode('deepseek')}
            className={`px-3 py-2 text-xs font-medium transition-colors ${
              chatMode === 'deepseek'
                ? 'bg-blue-600 text-white'
                : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            DeepSeek
          </button>
          <button
            onClick={() => setChatMode('claude')}
            className={`px-3 py-2 text-xs font-medium transition-colors ${
              chatMode === 'claude'
                ? 'bg-orange-600 text-white'
                : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Claude
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-lg transition-colors ${
            darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
          }`}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        {/* Speech Toggle */}
        {speechSynthesisRef.current && (
          <button
            onClick={toggleSpeech}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              speechEnabled
                ? 'bg-green-600 text-white hover:bg-green-700'
                : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
            title={speechEnabled ? 'Réponses vocales activées' : 'Réponses vocales désactivées'}
          >
            {speechEnabled ? '🔊' : '🔇'} {t('voiceMode')}
          </button>
        )}

        {/* Stop Speaking Button */}
        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors animate-pulse"
          >
            ⏹️ Stop
          </button>
        )}

        {/* Language Selector */}
        <LanguageSelector darkMode={darkMode} />

        {/* Logout */}
        <button
          onClick={logout}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            darkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-red-500 text-white hover:bg-red-600'
          }`}
        >
          🚪 {t('logout')}
        </button>
      </div>
    </div>
  );
};

export default Header;