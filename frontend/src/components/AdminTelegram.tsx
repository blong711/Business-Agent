import React from 'react';
import { TelegramGroup, TelegramMember } from '../types';
import { MessageSquare, ArrowLeft } from 'lucide-react';

import { translations, Language } from '../i18n';

interface AdminTelegramProps {
  groups: TelegramGroup[];
  members: TelegramMember[];
  selectedGroup: TelegramGroup | null;
  onSelectGroup: (chatId: number, group: TelegramGroup) => void;
  onBack: () => void;
  isLoading: boolean;
  lang: Language;
}

export const AdminTelegram: React.FC<AdminTelegramProps> = ({
  groups,
  members,
  selectedGroup,
  onSelectGroup,
  onBack,
  isLoading,
  lang
}) => {
  const t = translations[lang];
  return (
    <div className="main-content fade-in">
      <header className="aura-header slide-up">
        <div className="header-icon-box">
          <MessageSquare size={28} />
        </div>
        <div className="header-info-group">
          <h2 className="aura-title">{t.adminTeleTitle}</h2>
          <p className="aura-subtitle">{t.adminTeleSubtitle}</p>
        </div>
      </header>
      
      <div className="glass-card fade-up">
        <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th><div className="th-content">{t.groupName}</div></th>
              <th><div className="th-content">{t.category}</div></th>
              <th><div className="th-content">{t.lastUpdate}</div></th>
              <th><div className="th-content">{t.actions}</div></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && !selectedGroup ? (
              <tr>
                <td colSpan={4} className="empty-state">
                  <div className="loader"></div>
                  <p>{t.loading}</p>
                </td>
              </tr>
            ) : groups.length === 0 ? (
              <tr>
                <td colSpan={4} className="empty-state">
                  {t.noGroups}
                </td>
              </tr>
            ) : (
              groups.map((g, i) => (
                <tr key={g.chat_id} style={{ animationDelay: `${i * 0.05}s` }} className="table-row-animate">
                  <td className="font-semibold">{g.title || 'Private Chat'}</td>
                  <td>
                    <span className={`role-badge ${g.type === 'private' ? 'user' : 'admin'}`}>
                      {g.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="text-muted">{new Date(g.updated_at).toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US')}</td>
                  <td>
                    <button 
                      className="action-btn" 
                      onClick={() => onSelectGroup(g.chat_id, g)}
                    >
                      {t.viewMembers}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {selectedGroup && (
        <div className="modal-overlay" onClick={onBack}>
          <div 
            className="modal-content slide-up" 
            style={{ 
              maxWidth: '800px', 
              width: '90%', 
              background: '#0f1118', 
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 style={{ margin: 0 }}>{t.membersOf} <span className="highlight-text">{selectedGroup.title || 'Private Chat'}</span></h3>
              <button className="icon-btn" onClick={onBack} title={t.back}>
                <ArrowLeft size={18} /> {t.back}
              </button>
            </div>
            
            <div className="table-container fade-up" style={{ minHeight: '300px', marginTop: '20px' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th><div className="th-content">Username</div></th>
                    <th><div className="th-content">{t.displayName}</div></th>
                    <th><div className="th-content">{t.lastInteraction}</div></th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={3} className="empty-state">
                        <div className="loader"></div>
                        <p>{t.loading}</p>
                      </td>
                    </tr>
                  ) : members.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="empty-state">
                        {t.noMembers}
                      </td>
                    </tr>
                  ) : (
                    members.map((m, i) => (
                      <tr key={m.user_id} style={{ animationDelay: `${i * 0.05}s` }} className="table-row-animate">
                        <td className="font-semibold text-blue">
                          {m.username ? `@${m.username}` : 'N/A'}
                        </td>
                        <td>
                          {m.first_name || ''} {m.last_name || ''}
                        </td>
                        <td className="text-muted">{new Date(m.updated_at).toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US')}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
