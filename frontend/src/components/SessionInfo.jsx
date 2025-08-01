import React from 'react';
import { useTranslation } from 'react-i18next';

const SessionInfo = ({ darkMode, currentSessionName, chatMode }) => {
  const { t } = useTranslation();
  
  return (
    <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('currentSession')}:
          </span>
          <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {currentSessionName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {t('currentMode')}: {chatMode === 'compare' ? t('comparativeMode') : 
                   chatMode === 'chatgpt' ? t('chatgptOnly') :
                   chatMode === 'gemini' ? t('geminiOnly') :
                   chatMode === 'deepseek' ? t('deepseekOnly') :
                   t('claudeOnly')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SessionInfo;