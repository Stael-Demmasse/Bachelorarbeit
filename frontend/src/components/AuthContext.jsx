import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Helper function to format error messages
  const formatErrorMessage = (error) => {
    if (typeof error === 'string') {
      return error;
    }
    
    // Handle FastAPI validation errors
    if (Array.isArray(error)) {
      return error.map(err => {
        if (err.msg) {
          return `${err.loc ? err.loc.join('.') + ': ' : ''}${err.msg}`;
        }
        return JSON.stringify(err);
      }).join(', ');
    }
    
    // Handle object errors
    if (typeof error === 'object' && error !== null) {
      if (error.msg) {
        return error.msg;
      }
      return JSON.stringify(error);
    }
    
    return String(error);
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get(`${API}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
        } catch (error) {
          console.error('Auth check failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API}/auth/login`, {
        username,
        password
      });
      
      const { access_token, user: userData } = response.data;
      setToken(access_token);
      setUser(userData);
      localStorage.setItem('token', access_token);
      return { success: true };
    } catch (error) {
      const errorDetail = error.response?.data?.detail;
      return { 
        success: false, 
        message: formatErrorMessage(errorDetail) || 'Erreur de connexion' 
      };
    }
  };

  const register = async (username, password) => {
    try {
      const registerData = {
        username,
        password
      };
      
      await axios.post(`${API}/auth/register`, registerData);
      
      // Auto-login after registration
      return await login(username, password);
    } catch (error) {
      const errorDetail = error.response?.data?.detail;
      return { 
        success: false, 
        message: formatErrorMessage(errorDetail) || 'Erreur lors de l\'inscription' 
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.clear();
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};