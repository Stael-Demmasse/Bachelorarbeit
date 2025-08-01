import React, { useState } from 'react';
import LoginForm from './LoginForm.jsx';
import RegisterForm from './RegisterForm.jsx';

const AuthGate = () => {
  const [showRegister, setShowRegister] = useState(false);
  
  return showRegister ? 
    <RegisterForm onSwitchToLogin={() => setShowRegister(false)} /> :
    <LoginForm onSwitchToRegister={() => setShowRegister(true)} />;
};

export default AuthGate;