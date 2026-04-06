import React, { useState } from 'react';
import { User, Mail, Shield, Save, Key, Camera, Layout } from 'lucide-react';

import { translations, Language } from '../i18n';

interface UserProfileProps {
  currentUser: string;
  role: string;
  lang: Language;
}

export const UserProfile: React.FC<UserProfileProps> = ({ currentUser, role, lang }) => {
  const t = translations[lang];
  const [name, setName] = useState(currentUser);
  const [email, setEmail] = useState(`${currentUser.toLowerCase()}@nexus.ai`);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert(t.profileUpdateSuccess || 'Thông tin đã được cập nhật.');
    }, 1000);
  };

  return (
    <div className="main-content profile-page fade-in">
      <header className="aura-header slide-up">
        <div className="header-icon-box">
          <User size={28} />
        </div>
        <div className="header-info-group">
          <h2 className="aura-title">{t.profileTitle}</h2>
          <p className="aura-subtitle">{t.adminUsersSubtitle}</p>
        </div>
        <div className="header-actions">
           <button onClick={handleSave} className="top-control-btn" disabled={isSaving}>
            {isSaving ? <div className="loader-sm"></div> : <Save size={20} />}
            <span>{isSaving ? t.saving : t.saveChanges}</span>
          </button>
        </div>
      </header>

      <div className="profile-container">
        <div className="glass-card profile-hero-card slide-up">
          <div className="profile-banner"></div>
          <div className="profile-avatar-wrap">
            <div className="profile-avatar-main">
              <User size={60} />
              <button className="avatar-edit-btn" title="Thay đổi ảnh">
                <Camera size={20} />
              </button>
            </div>
            <div className="profile-meta">
              <h2 className="profile-hero-name">{name}</h2>
              <div className="profile-role-badge">
                <Shield size={14} />
                <span>{role.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-content-grid">
          <div className="glass-card info-card slide-up">
            <div className="card-header">
              <Layout size={20} />
              <h3>THÔNG TIN CƠ BẢN</h3>
            </div>
            <div className="card-body">
              <div className="profile-input-group">
                <label>Họ và tên</label>
                <div className="profile-input-wrapper">
                  <User size={18} className="input-icon" />
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập tên của bạn..."
                  />
                </div>
              </div>

              <div className="profile-input-group">
                <label>Email liên hệ</label>
                <div className="profile-input-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@nexus.ai"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card security-card slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="card-header">
              <Key size={20} />
              <h3>BẢO MẬT HỆ THỐNG</h3>
            </div>
            <div className="card-body">
              <div className="profile-input-group">
                <label>Mật khẩu mới</label>
                <div className="profile-input-wrapper">
                  <Key size={18} className="input-icon" />
                  <input type="password" placeholder="••••••••••••" />
                </div>
              </div>
              <p className="security-note">
                Sử dụng ít nhất 12 ký tự, bao gồm chữ hoa, chữ thường và ký tự đặc biệt để đảm bảo an toàn cho tài khoản Agent.
              </p>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button 
            className="profile-save-btn" 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <span className="loader-sm"></span>
            ) : (
              <>
                <Save size={18} />
                <span>LƯU THÔNG TIN</span>
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .profile-page {
          padding: 40px;
          display: flex;
          justify-content: center;
        }

        .profile-container {
          width: 100%;
          max-width: 900px;
        }

        .profile-hero-card {
          position: relative;
          overflow: hidden;
          margin-bottom: 32px;
          padding: 0 !important;
          border-radius: 32px;
        }

        .profile-banner {
          height: 160px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          opacity: 0.8;
          filter: blur(40px);
          transform: scale(1.2);
          background-size: cover;
          background-position: center;
        }

        .profile-avatar-wrap {
          display: flex;
          align-items: flex-end;
          gap: 24px;
          padding: 0 40px 40px 40px;
          margin-top: -60px;
          position: relative;
          z-index: 2;
        }

        .profile-avatar-main {
          width: 120px;
          height: 120px;
          background: #1e293b;
          border-radius: 30px;
          border: 4px solid var(--bg-app);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          position: relative;
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5);
        }

        .avatar-edit-btn {
          position: absolute;
          right: -10px;
          bottom: -10px;
          width: 40px;
          height: 40px;
          background: var(--primary);
          border-radius: 12px;
          border: 4px solid var(--bg-app);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.3s;
        }
        .avatar-edit-btn:hover { transform: scale(1.1); }

        .profile-hero-name {
          font-size: 32px;
          font-weight: 900;
          color: white;
          margin: 0;
          letter-spacing: -0.02em;
          text-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }

        .profile-role-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--primary-glow);
          color: var(--primary);
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 800;
          margin-top: 8px;
          border: 1px solid var(--glass-border);
        }

        .profile-content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-bottom: 40px;
        }

        .profile-card {
          /* Handled by .glass-card */
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          color: var(--primary);
        }

        .card-header h3 {
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.1em;
          margin: 0;
          color: var(--text-main);
        }

        .profile-input-group {
          margin-bottom: 24px;
        }

        .profile-input-group label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          margin-bottom: 8px;
          padding-left: 4px;
        }

        .profile-input-wrapper {
          position: relative;
          background: var(--input-bg);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          transition: 0.3s;
        }

        .profile-input-wrapper:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 20px var(--primary-glow);
        }

        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .profile-input-wrapper input {
          width: 100%;
          background: transparent;
          border: none;
          padding: 14px 16px 14px 48px;
          color: var(--text-main);
          font-size: 15px;
          font-weight: 600;
          outline: none;
        }

        .security-note {
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.6;
          margin: 0;
        }

        .profile-actions {
          display: flex;
          justify-content: flex-end;
        }

        .profile-save-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--primary);
          color: white;
          border: none;
          padding: 16px 40px;
          border-radius: 16px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          transition: 0.3s;
          box-shadow: 0 10px 20px var(--primary-glow);
        }

        .profile-save-btn:hover {
          transform: translateY(-4px);
          background: var(--secondary);
          box-shadow: 0 15px 30px var(--primary-glow);
        }

        .profile-save-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .loader-sm {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
