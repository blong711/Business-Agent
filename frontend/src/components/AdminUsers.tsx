import React, { useState } from 'react';
import { UserItem } from '../types';
import { Users, Edit3, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { apiService } from '../api';
import { translations, Language } from '../i18n';

interface AdminUsersProps {
  userList: UserItem[];
  isLoading: boolean;
  onRefresh: () => void;
  lang: Language;
}

export const AdminUsers: React.FC<AdminUsersProps> = ({ userList, isLoading, onRefresh, lang }) => {
  const t = translations[lang];
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = (user: UserItem) => {
    setEditingUser({ ...user });
  };

  const handleSave = async () => {
    if (!editingUser) return;
    setIsSaving(true);
    try {
      await apiService.updateUser(editingUser.username, editingUser);
      setEditingUser(null);
      onRefresh();
    } catch (e) {
      alert(t.updateError);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (username: string) => {
    if (username === 'admin') {
      alert(t.deleteAdminError);
      return;
    }
    if (window.confirm(`${t.deleteConfirm} ${username}?`)) {
      try {
        await apiService.deleteUser(username);
        onRefresh();
      } catch (e) {
        alert(t.deleteError);
      }
    }
  };

  return (
    <div className="main-content fade-in">
      <header className="aura-header slide-up">
        <div className="header-icon-box">
          <Users size={28} />
        </div>
        <div className="header-info-group">
          <h2 className="aura-title">{t.adminUsersTitle}</h2>
          <p className="aura-subtitle">{t.adminUsersSubtitle}</p>
        </div>
      </header>
      
      <div className="glass-card table-card fade-up">
        <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th><div className="th-content">{t.username}</div></th>
              <th><div className="th-content">{t.role}</div></th>
              <th><div className="th-content">{t.status}</div></th>
              <th><div className="th-content">{t.telegramId}</div></th>
              <th><div className="th-content">{t.joinDate}</div></th>
              <th><div className="th-content">{t.actions}</div></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="empty-state">
                  <div className="loader"></div>
                  <p>{t.loading}</p>
                </td>
              </tr>
            ) : userList.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-state">
                  <p>{t.noData}</p>
                </td>
              </tr>
            ) : (
              userList.map((u, i) => (
                <tr key={u.username} style={{ animationDelay: `${i * 0.05}s` }} className="table-row-animate">
                  <td className="font-semibold text-white">{u.username}</td>
                  <td>
                    <span className={`role-badge ${u.role}`}>{u.role === 'admin' ? t.adminRole.toUpperCase() : t.userRole.toUpperCase()}</span>
                  </td>
                  <td>
                    {u.is_active ? (
                      <span className="status-badge active"><CheckCircle size={14} /> {t.active}</span>
                    ) : (
                      <span className="status-badge inactive"><XCircle size={14} /> {t.suspended}</span>
                    )}
                  </td>
                  <td className="text-blue font-mono">{u.telegram_id || t.notLinked}</td>
                  <td className="text-muted">{new Date(u.created_at).toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US')}</td>
                  <td>
                    <div className="action-group">
                      <button className="icon-btn edit" onClick={() => handleEdit(u)} title={t.edit}>
                        <Edit3 size={18} />
                      </button>
                      <button className="icon-btn delete" onClick={() => handleDelete(u.username)} title={t.delete}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {editingUser && (
        <div className="modal-overlay">
          <div className="modal-content glass-card slide-up">
            <h3>{t.editUserTitle} {editingUser.username}</h3>
            
            <div className="form-group">
              <label>{t.role}</label>
              <select 
                className="modal-select"
                value={editingUser.role} 
                onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
              >
                <option value="user">{t.userRole}</option>
                <option value="admin">{t.adminRole}</option>
              </select>
            </div>

            <div className="form-group">
              <label>{t.accountStatus}</label>
              <select 
                className="modal-select"
                value={editingUser.is_active ? 'true' : 'false'} 
                onChange={(e) => setEditingUser({...editingUser, is_active: e.target.value === 'true'})}
              >
                <option value="true">{t.active}</option>
                <option value="false">{t.suspended}</option>
              </select>
            </div>

            <div className="form-group">
              <label>{t.telegramId} ({t.lang === 'vi' ? 'Thủ công' : 'Manual'})</label>
              <input 
                type="text" 
                value={editingUser.telegram_id || ''} 
                onChange={(e) => setEditingUser({...editingUser, telegram_id: e.target.value})}
                placeholder={t.chatPlaceholder}
              />
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setEditingUser(null)}>{t.cancel}</button>
              <button className="save-btn" onClick={handleSave} disabled={isSaving}>
                {isSaving ? t.loading : t.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
