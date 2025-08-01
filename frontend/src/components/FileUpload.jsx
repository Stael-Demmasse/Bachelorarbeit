import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useAuth } from './AuthContext.jsx';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
const API = `${BACKEND_URL}/api`;

const FileUpload = ({ onFileUploaded, darkMode }) => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Vérifier le type de fichier
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/json',
      'text/xml',
      'application/xml',
      'text/markdown'
    ];

    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.md')) {
      setError('Type de fichier non supporté. Formats acceptés: PDF, DOCX, TXT, CSV, XLSX, JSON, XML, MD');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API}/files/upload`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (onFileUploaded) {
        onFileUploaded(response.data);
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      if (error.response) {
        // Erreur de réponse du serveur
        const errorMessage = error.response.data?.detail || 'Erreur du serveur';
        setError(`Erreur: ${errorMessage}`);
      } else if (error.request) {
        // Erreur de réseau
        setError('Erreur de connexion au serveur');
      } else {
        // Autre erreur
        setError('Erreur lors du téléchargement du fichier');
      }
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept=".pdf,.docx,.txt,.csv,.xlsx,.json,.xml,.md"
        className="hidden"
      />
      
      <button
        type="button"
        onClick={handleFileSelect}
        disabled={uploading}
        className={`px-3 py-3 rounded-lg font-medium transition-colors ${
          uploading
            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
            : darkMode
            ? "bg-gray-600 text-white hover:bg-gray-700"
            : "bg-gray-500 text-white hover:bg-gray-600"
        }`}
        title="Ajouter un fichier"
      >
        {uploading ? "⏳" : "📎"}
      </button>

      {error && (
        <div className={`absolute top-full left-0 mt-1 p-2 rounded text-xs ${
          darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700'
        } whitespace-nowrap z-10`}>
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;