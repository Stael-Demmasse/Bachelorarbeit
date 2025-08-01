import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext.jsx';
import { useTranslation } from 'react-i18next';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SessionPanel = ({ 
  darkMode, 
  sessions, 
  currentSessionId, 
  loadSession, 
  deleteSession, 
  loadSessions 
}) => {
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editingSessionName, setEditingSessionName] = useState('');
  const { token } = useAuth();
  const { t } = useTranslation();

  const updateSessionName = async (sessionId, newName) => {
    try {
      await axios.put(`${API}/sessions/${sessionId}?session_name=${encodeURIComponent(newName)}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadSessions();
      setEditingSessionId(null);
      setEditingSessionName('');
    } catch (error) {
      console.error('Error updating session name:', error);
    }
  };

  return (
    <div className={`lg:w-1/4 rounded-xl shadow-lg p-4 ${
      darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
    }`}>
      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        📜 {t('sessions')}
      </h3>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {sessions.map(session => (
          <div
            key={session.session_id}
            className={`p-3 rounded-lg border cursor-pointer transition-colors hover:shadow-md ${
              currentSessionId === session.session_id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                : darkMode ? 'border-gray-600 bg-gray-700 hover:bg-gray-600' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-between">
              {editingSessionId === session.session_id ? (
                <input
                  type="text"
                  value={editingSessionName}
                  onChange={(e) => setEditingSessionName(e.target.value)}
                  onBlur={() => updateSessionName(session.session_id, editingSessionName)}
                  onKeyPress={(e) => e.key === 'Enter' && updateSessionName(session.session_id, editingSessionName)}
                  className={`flex-1 text-sm font-medium bg-transparent border-none outline-none ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}
                  autoFocus
                />
              ) : (
                <div 
                  className="flex-1"
                  onClick={() => loadSession(session.session_id)}
                >
                  <div className={`text-sm font-medium truncate ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    {session.session_name}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {session.message_count} messages
                  </div>
                </div>
              )}
              
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingSessionId(session.session_id);
                    setEditingSessionName(session.session_name);
                  }}
                  className={`p-1 text-xs rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  ✏️
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.session_id);
                  }}
                  className={`p-1 text-xs rounded hover:bg-red-200 dark:hover:bg-red-800 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionPanel;