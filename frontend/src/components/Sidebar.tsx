import React from 'react';
import { Bot, MessageSquare, Users, LogOut } from 'lucide-react';

interface SidebarProps {
  currentUser: string;
  currentUserRole: string;
  viewMode: 'chat' | 'users' | 'telegram';
  setViewMode: (mode: 'chat' | 'users' | 'telegram') => void;
  onLogout: () => void;
  fetchUsers: () => void;
  fetchTelegramGroups: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentUser, 
  currentUserRole, 
  viewMode, 
  setViewMode, 
  onLogout,
  fetchUsers,
  fetchTelegramGroups
}) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-box">
          <Bot size={24} color="white" />
        </div>
        <h1 className="logo-text">AI Nexus</h1>
      </div>

      <div className={`nav-item ${viewMode === 'chat' ? 'active' : ''}`} onClick={() => setViewMode('chat')}>
        <MessageSquare size={18} />
        <span>Hội thoại ({currentUser})</span>
      </div>

      {currentUserRole === 'admin' && (
        <>
          <div className="spacer" style={{flex: 0}}></div>
          <p className="nav-section-title">System Admin</p>
          <div 
            className={`nav-item ${viewMode === 'users' ? 'active' : ''}`} 
            onClick={() => { setViewMode('users'); fetchUsers(); }}
          >
            <Users size={18} />
            <span>Quản lý Tài khoản</span>
          </div>
          <div 
            className={`nav-item ${viewMode === 'telegram' ? 'active' : ''}`} 
            onClick={() => { setViewMode('telegram'); fetchTelegramGroups(); }}
          >
            <MessageSquare size={18} />
            <span>Nhóm Telegram</span>
          </div>
        </>
      )}

      <div className="spacer"></div>

      <div className="nav-item logout-btn" onClick={onLogout}>
        <LogOut size={18} />
        <span>Đăng xuất hệ thống</span>
      </div>
    </div>
  );
};
