import React from "react";
import { useTranslation } from 'react-i18next';
import FileUpload from './FileUpload.jsx';

const ChatInput = ({
  input,
  setInput,
  loading,
  handleSendMessage,
  speechSupported,
  isListening,
  startListening,
  stopListening,
  isSpeaking,
  speechSynthesisRef,
  darkMode,
  onFileUploaded,
}) => {
  const { t } = useTranslation();
  return (
    <form
      onSubmit={handleSendMessage}
      className="p-6 border-t border-gray-200 dark:border-gray-700"
    >
      <div className="flex gap-3">
        <FileUpload 
          onFileUploaded={onFileUploaded}
          darkMode={darkMode}
        />
        
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('typeMessage')}
          disabled={loading}
          className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        />

        {speechSupported && (
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            disabled={loading}
            className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
              isListening
                ? "bg-red-600 text-white hover:bg-red-700 animate-pulse"
                : loading
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : darkMode
                ? "bg-gray-600 text-white hover:bg-gray-700"
                : "bg-gray-500 text-white hover:bg-gray-600"
            }`}
            title={isListening ? t('stopRecording') : t('startRecording')}
          >
            {isListening ? "🔴" : "🎤"}
          </button>
        )}

        <button
          type="submit"
          disabled={loading || !input.trim()}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            loading || !input.trim()
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {loading ? "⏳" : "🚀"}
        </button>
      </div>

      {isListening && (
        <div
          className={`mt-2 text-center text-sm ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span>🎧 {t('listening')}</span>
          </div>
        </div>
      )}

      {isSpeaking && (
        <div
          className={`mt-2 text-center text-sm ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>🔊 {t('speechFeature')}</span>
          </div>
        </div>
      )}

      {!speechSupported && (
        <div
          className={`mt-2 text-center text-xs ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          ⚠️ {t('speechNotSupported')}
        </div>
      )}

      {speechSupported && (
        <div
          className={`mt-2 text-center text-xs ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          💡 {t('startRecording')}
        </div>
      )}

      {!speechSynthesisRef.current && (
        <div
          className={`mt-2 text-center text-xs ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          ⚠️ {t('speechNotSupported')}
        </div>
      )}
    </form>
  );
};

export default ChatInput;
