import React from 'react';
import { Bot, MessageSquare, Users, Package, Target, HelpCircle } from 'lucide-react';
import { translations, Language } from '../i18n';

interface SidebarProps {
  currentUser: string;
  currentUserRole: string;
  viewMode: 'chat' | 'users' | 'telegram' | 'employees' | 'production' | 'profile' | 'agent_settings' | 'marketing' | 'docs';
  setViewMode: (mode: 'chat' | 'users' | 'telegram' | 'employees' | 'production' | 'profile' | 'agent_settings' | 'marketing' | 'docs') => void;
  fetchUsers: () => void;
  fetchTelegramGroups: () => void;
  fetchEmployees: () => void;
  lang: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentUser, 
  currentUserRole, 
  viewMode, 
  setViewMode, 
  fetchUsers,
  fetchTelegramGroups,
  fetchEmployees,
  lang
}) => {
  const t = translations[lang];

  return (
    <div className="sidebar">
      <div className={`nav-item ${viewMode === 'chat' ? 'active' : ''}`} onClick={() => setViewMode('chat')}>
        <MessageSquare size={18} />
        <span>{t.nexusChat} ({currentUser})</span>
      </div>

      {currentUserRole === 'admin' && (
        <>
          <p className="nav-section-title">{t.prodManagement}</p>
          <div 
            className={`nav-item ${viewMode === 'production' ? 'active' : ''}`} 
            onClick={() => setViewMode('production')}
          >
            <Package size={18} />
            <span>{t.prodTime}</span>
          </div>

          <p className="nav-section-title">{t.cskh}</p>
          <div 
            className={`nav-item ${viewMode === 'telegram' ? 'active' : ''}`} 
            onClick={() => { setViewMode('telegram'); fetchTelegramGroups(); }}
          >
            <MessageSquare size={18} />
            <span>{t.teleData}</span>
          </div>

          <p className="nav-section-title">{t.marketingMgt}</p>
          <div 
            className={`nav-item ${viewMode === 'marketing' ? 'active' : ''}`} 
            onClick={() => setViewMode('marketing')}
          >
            <Target size={18} />
            <span>{t.creativeAsset}</span>
          </div>

          <p className="nav-section-title">{t.accHr}</p>
          <div 
            className={`nav-item ${viewMode === 'employees' ? 'active' : ''}`} 
            onClick={() => { setViewMode('employees'); fetchEmployees(); }}
          >
            <Users size={18} />
            <span>{t.payroll}</span>
          </div>

          <p className="nav-section-title">{t.sysAdmin}</p>
          <div 
            className={`nav-item ${viewMode === 'users' ? 'active' : ''}`} 
            onClick={() => { setViewMode('users'); fetchUsers(); }}
          >
            <Users size={18} />
            <span>{t.accManagement}</span>
          </div>

          <div 
            className={`nav-item ${viewMode === 'agent_settings' ? 'active' : ''}`} 
            onClick={() => setViewMode('agent_settings')}
          >
            <Bot size={18} />
            <span>{t.agentSettings}</span>
          </div>
        </>
      )}
      <div 
        className={`nav-item ${viewMode === 'docs' ? 'active' : ''}`} 
        onClick={() => setViewMode('docs')}
        style={{ marginTop: 'auto' }}
      >
        <HelpCircle size={18} />
        <span>{t.docs}</span>
      </div>

      <div className="spacer"></div>

    </div>
  );
};
