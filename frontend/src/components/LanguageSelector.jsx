import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = ({ darkMode }) => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <div className="relative inline-block">
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
          darkMode
            ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;