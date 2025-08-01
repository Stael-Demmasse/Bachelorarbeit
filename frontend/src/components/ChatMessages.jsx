import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MarkdownRenderer from './MarkdownRenderer';

const ChatMessages = ({ 
  messages, 
  loading, 
  chatMode, 
  darkMode, 
  speechSynthesisRef, 
  speakText 
}) => {
  const { t } = useTranslation();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getModelColor = (model) => {
    const colors = {
      chatgpt: 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700',
      gemini: 'text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700',
      deepseek: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700',
      claude: 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-700'
    };
    return colors[model] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getModelIcon = (model) => {
    const icons = {
      chatgpt: '🤖',
      gemini: '💎',
      deepseek: '🧠',
      claude: '🎭'
    };
    return icons[model] || '🤖';
  };

  return (
    <div className="h-96 lg:h-[500px] overflow-y-auto p-6 space-y-4">
      {messages.length === 0 && (
        <div className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <div className="text-6xl mb-4">🤖</div>
          <p className="text-lg">{t('startConversation')}</p>
          <p className="text-sm mt-2">
            {t('currentMode')}: {
              chatMode === 'compare' ? t('comparativeMode') :
              chatMode === 'chatgpt' ? t('chatgptOnly') :
              chatMode === 'gemini' ? t('geminiOnly') :
              chatMode === 'deepseek' ? t('deepseekOnly') :
              t('claudeOnly')
            }
          </p>

        </div>
      )}

      {messages.map((message, index) => (
        <div key={index} className="space-y-3">
          {message.sender === 'user' && (
            <div className="flex justify-end">
              <div className="bg-blue-600 text-white px-4 py-2 rounded-lg max-w-xs lg:max-w-md">
                {message.text}
              </div>
            </div>
          )}

          {message.sender === 'ai' && message.mode === 'compare' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['chatgpt', 'gemini', 'deepseek', 'claude'].map(model => (
                <div key={model} className={`p-4 rounded-lg border-l-4 relative ${getModelColor(model)}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getModelIcon(model)}</span>
                    <span className={`font-medium text-sm uppercase ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      {model}
                    </span>
                    {message[`${model}_response_time`] && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        message[`${model}_response_time`] < 2 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        message[`${model}_response_time`] < 5 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        ⏱️ {message[`${model}_response_time`].toFixed(2)}s
                      </span>
                    )}
                    {speechSynthesisRef.current && message[model] && (
                      <button
                        onClick={() => speakText(message[model])}
                        className={`ml-auto p-1 rounded text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}
                        title={`${t('listenResponse')} ${model}`}
                      >
                        🔊
                      </button>
                    )}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                    <MarkdownRenderer content={message[model]} darkMode={darkMode} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {message.sender === 'ai' && message.mode !== 'compare' && (
            <div className="flex justify-start">
              <div className={`p-4 rounded-lg border-l-4 max-w-xs lg:max-w-2xl relative ${getModelColor(message.provider)}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{getModelIcon(message.provider)}</span>
                  <span className={`font-medium text-sm uppercase ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    {message.provider}
                  </span>
                  {message.response_time && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      message.response_time < 2 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      message.response_time < 5 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      ⏱️ {message.response_time.toFixed(2)}s
                    </span>
                  )}
                  {message.sources && message.sources.length > 0 && (
                    <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                      📄 {message.sources.length} source{message.sources.length > 1 ? 's' : ''}
                    </span>
                  )}
                  {speechSynthesisRef.current && message.text && (
                    <button
                      onClick={() => speakText(message.text)}
                      className={`ml-auto p-1 rounded text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}
                      title={`${t('listenResponse')} ${message.provider}`}
                    >
                      🔊
                    </button>
                  )}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                  <MarkdownRenderer content={message.text} darkMode={darkMode} />
                </div>
                {message.sources && message.sources.length > 0 && (
                  <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      📚 Sources utilisées:
                    </p>
                    <div className="space-y-1">
                      {message.sources.map((source, idx) => (
                        <div key={idx} className={`text-xs p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {source.filename}
                          </span>
                          {source.page && (
                            <span className={`ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              (page {source.page})
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {message.sender === 'system' && (
            <div className="flex justify-center">
              <div className={`px-4 py-2 rounded-lg text-sm ${
                darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
              }`}>
                {message.text}
              </div>
            </div>
          )}
        </div>
      ))}

      {loading && (
        <div className="flex justify-start">
          <div className={`p-4 rounded-lg ${
            darkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <div className="flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {chatMode === 'compare' ? t('fourAIThinking') : t('aiThinking')}
              </span>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;