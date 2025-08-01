import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext.jsx";
import { useTranslation } from 'react-i18next';
import { gsap } from "gsap";

const LoginForm = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const { t } = useTranslation();
  
  // Refs pour les animations GSAP
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const formRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const buttonRef = useRef(null);
  const switchButtonRef = useRef(null);
  const errorRef = useRef(null);

  // Animation d'entrée au montage du composant
  useEffect(() => {
    const tl = gsap.timeline();
    
    // Animation du conteneur principal
    gsap.set(containerRef.current, { opacity: 0, scale: 0.8 });
    gsap.set([titleRef.current, subtitleRef.current], { opacity: 0, y: -30 });
    gsap.set(formRef.current, { opacity: 0, y: 50 });
    gsap.set([usernameRef.current, passwordRef.current], { opacity: 0, x: -50 });
    gsap.set([buttonRef.current, switchButtonRef.current], { opacity: 0, scale: 0.8 });
    
    tl.to(containerRef.current, { 
      duration: 0.6, 
      opacity: 1, 
      scale: 1, 
      ease: "back.out(1.7)" 
    })
    .to(titleRef.current, { 
      duration: 0.5, 
      opacity: 1, 
      y: 0, 
      ease: "power2.out" 
    }, "-=0.3")
    .to(subtitleRef.current, { 
      duration: 0.5, 
      opacity: 1, 
      y: 0, 
      ease: "power2.out" 
    }, "-=0.3")
    .to(formRef.current, { 
      duration: 0.6, 
      opacity: 1, 
      y: 0, 
      ease: "power2.out" 
    }, "-=0.2")
    .to(usernameRef.current, { 
      duration: 0.4, 
      opacity: 1, 
      x: 0, 
      ease: "power2.out" 
    }, "-=0.3")
    .to(passwordRef.current, { 
      duration: 0.4, 
      opacity: 1, 
      x: 0, 
      ease: "power2.out" 
    }, "-=0.2")
    .to([buttonRef.current, switchButtonRef.current], { 
      duration: 0.5, 
      opacity: 1, 
      scale: 1, 
      ease: "back.out(1.7)" 
    }, "-=0.2");
  }, []);
  
  // Animation pour les erreurs
  useEffect(() => {
    if (error && errorRef.current) {
      gsap.fromTo(errorRef.current, 
        { opacity: 0, y: -20, scale: 0.8 },
        { 
          duration: 0.5, 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          ease: "back.out(1.7)" 
        }
      );
    }
  }, [error]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // Animation du bouton pendant le chargement
    gsap.to(buttonRef.current, {
      duration: 0.3,
      scale: 0.95,
      ease: "power2.out"
    });

    const result = await login(formData.username, formData.password);

    if (!result.success) {
      setError(result.message);
      // Animation de secousse en cas d'erreur
      gsap.to(formRef.current, {
        duration: 0.1,
        x: -10,
        yoyo: true,
        repeat: 5,
        ease: "power2.inOut"
      });
    }
    
    // Remettre le bouton à sa taille normale
    gsap.to(buttonRef.current, {
      duration: 0.3,
      scale: 1,
      ease: "power2.out"
    });

    setLoading(false);
  };
  
  // Animations d'interaction pour les champs
  const handleInputFocus = (ref) => {
    gsap.to(ref.current, {
      duration: 0.3,
      scale: 1.02,
      boxShadow: "0 0 20px rgba(99, 102, 241, 0.3)",
      ease: "power2.out"
    });
  };
  
  const handleInputBlur = (ref) => {
    gsap.to(ref.current, {
      duration: 0.3,
      scale: 1,
      boxShadow: "0 0 0px rgba(99, 102, 241, 0)",
      ease: "power2.out"
    });
  };
  
  // Animation hover pour les boutons
  const handleButtonHover = (ref, isEntering) => {
    gsap.to(ref.current, {
      duration: 0.3,
      scale: isEntering ? 1.05 : 1,
      ease: "power2.out"
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div ref={containerRef} className="max-w-md w-full space-y-8">
        <div>
          <h2 ref={titleRef} className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            🤖 {t('chatTitle')}
          </h2>
          <p ref={subtitleRef} className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('welcome')}
          </p>
        </div>

        <form ref={formRef} className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div ref={errorRef} className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded transform">
              {error}
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                ref={usernameRef}
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 transition-all duration-300"
                placeholder={t('username')}
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                onFocus={() => handleInputFocus(usernameRef)}
                onBlur={() => handleInputBlur(usernameRef)}
              />
            </div>
            <div>
              <input
                ref={passwordRef}
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 transition-all duration-300"
                placeholder={t('password')}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                onFocus={() => handleInputFocus(passwordRef)}
                onBlur={() => handleInputBlur(passwordRef)}
              />
            </div>
          </div>

          <div>
            <button
              ref={buttonRef}
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-300"
              onMouseEnter={() => !loading && handleButtonHover(buttonRef, true)}
              onMouseLeave={() => !loading && handleButtonHover(buttonRef, false)}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('loading')}
                </div>
              ) : (
                t('login')
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              ref={switchButtonRef}
              type="button"
              onClick={onSwitchToRegister}
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-all duration-300"
              onMouseEnter={() => handleButtonHover(switchButtonRef, true)}
              onMouseLeave={() => handleButtonHover(switchButtonRef, false)}
            >
              {t('register')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
