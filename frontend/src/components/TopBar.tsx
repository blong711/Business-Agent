import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Globe, User, Bell, Bot } from 'lucide-react';

import { translations, Language } from '../i18n';

interface TopBarProps {
  title: string;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  lang: Language;
  toggleLang: () => void;
  currentUser: string;
  onLogout: () => void;
  onNavigateProfile: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ 
  title, 
  theme, 
  toggleTheme, 
  lang, 
  toggleLang,
  currentUser,
  onLogout,
  onNavigateProfile
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const t = translations[lang];

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <div className="logo-section">
          <div className="logo-box">
            <Bot size={22} color="white" />
          </div>
          <h1 className="logo-text">Business Agent</h1>
        </div>
      </div>

      <div className="top-bar-right">
        <div className="control-group">
          <button className="top-control-btn" onClick={toggleTheme} title={theme === 'dark' ? t.themeLight : t.themeDark}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button className="top-control-btn lang-btn" onClick={toggleLang} title={lang === 'vi' ? 'SANG TIẾNG ANH' : 'SWITCH TO VIETNAMESE'}>
            <Globe size={20} />
            <span className="lang-label">{lang.toUpperCase()}</span>
          </button>
        </div>

        <div className="divider-vr"></div>

        <button className="top-control-btn" title="Notifications">
          <Bell size={20} />
        </button>

        <div className="user-profile-wrap" ref={menuRef}>
          <div className="user-profile" onClick={() => setShowUserMenu(!showUserMenu)}>
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-info">
              <span className="user-name">{currentUser}</span>
              <span className="user-status">Online</span>
            </div>
          </div>

          {showUserMenu && (
            <div className="user-dropdown-menu slide-up">
              <button className="dropdown-item" onClick={() => { onNavigateProfile(); setShowUserMenu(false); }}>
                <User size={16} />
                <span>{t.profile}</span>
              </button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item logout-btn" onClick={onLogout}>
                <Bot size={16} />
                <span>{t.logout}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
