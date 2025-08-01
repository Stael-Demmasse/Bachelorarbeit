import React from "react";
import { useTranslation } from "react-i18next";

const APIInfo = ({ darkMode }) => {
  const { t } = useTranslation();
  return (
    <div
      className={`mt-6 p-4 rounded-lg border-2 border-dashed ${
        darkMode ? "border-gray-600 bg-gray-800" : "border-gray-300 bg-gray-50"
      }`}
    >
      <h3
        className={`font-semibold mb-2 ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        🔧 {t("premiumIntegrations")}
      </h3>
      <div
        className={`text-sm space-y-1 ${
          darkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        <p>
          <strong>🤖 ChatGPT:</strong> {t("chatgptDescription")}
        </p>
        <p>
          <strong>💎 Gemini:</strong> {t("geminiDescription")}
        </p>
        <p>
          <strong>🧠 DeepSeek:</strong> {t("deepseekDescription")}
        </p>
        <p>
          <strong>🎭 Claude:</strong> {t("claudeDescription")}
        </p>
        <p>
          <strong>🎤 Speech:</strong> {t("speechDescription")}
        </p>

        <p>
          <strong>👤 Auth:</strong> {t("authDescription")}
        </p>
        <div>
          <p>
            🚀 <strong>{t("multiModalAssistant")}:</strong>
            {t("assistantFeatures")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default APIInfo;
