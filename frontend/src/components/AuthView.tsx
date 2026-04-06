import React, { useState } from 'react';
import { Bot, LogIn, UserPlus2 } from 'lucide-react';

import { translations, Language } from '../i18n';

interface AuthViewProps {
  onAuth: (username: string, password: string, mode: 'login' | 'register') => Promise<void>;
  authError: string;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  lang: Language;
}

export const AuthView: React.FC<AuthViewProps> = ({ onAuth, authError, theme, toggleTheme, lang }) => {
  const t = translations[lang];
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuth(username, password, authMode);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <button className="auth-theme-toggle" onClick={toggleTheme} type="button">
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
          <div className="logo-center">
            <div className="logo-box-large">
              <Bot size={36} color="white" />
            </div>
          </div>
          <h2>{authMode === 'login' ? t.login : t.register}</h2>
          <p className="auth-subtitle">AI Business Agent Core Control Center</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {authError && <div className="auth-error">{authError}</div>}

          <div className="input-group">
            <label>{t.username}</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="e.g. admin"
            />
          </div>

          <div className="input-group">
            <label>{t.password}</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="auth-btn">
            {authMode === 'login' ? <><LogIn size={20} /> {t.loginSystem}</> : <><UserPlus2 size={20} /> {t.createAccount}</>}
          </button>
        </form>

        <div className="auth-switch">
          {authMode === 'login' ? (
            <p>{t.noAccount} <span onClick={() => setAuthMode('register')}>{t.register} now</span></p>
          ) : (
            <p>{t.hasAccount} <span onClick={() => setAuthMode('login')}>{t.login} here</span></p>
          )}
        </div>
      </div>
    </div>
  );
};
