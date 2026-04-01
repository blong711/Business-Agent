import React, { useState } from 'react';
import { Bot, LogIn, UserPlus2 } from 'lucide-react';

interface AuthViewProps {
  onAuth: (username: string, password: string, mode: 'login' | 'register') => Promise<void>;
  authError: string;
}

export const AuthView: React.FC<AuthViewProps> = ({ onAuth, authError }) => {
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
          <div className="logo-center">
            <div className="logo-box-large">
              <Bot size={36} color="white" />
            </div>
          </div>
          <h2>{authMode === 'login' ? 'Đăng Nhập' : 'Tạo Tài Khoản'}</h2>
          <p className="auth-subtitle">Trung tâm điều khiển AI Business Agent</p>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          {authError && <div className="auth-error">{authError}</div>}
          
          <div className="input-group">
            <label>Tên đăng nhập</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              placeholder="Ví dụ: admin" 
            />
          </div>
          
          <div className="input-group">
            <label>Mật khẩu</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="••••••••" 
            />
          </div>

          <button type="submit" className="auth-btn">
            {authMode === 'login' ? <><LogIn size={20}/> Đăng Nhập Hệ Thống</> : <><UserPlus2 size={20}/> Khởi Tạo Tài Khoản</>}
          </button>
        </form>
        
        <div className="auth-switch">
          {authMode === 'login' ? (
            <p>Chưa có tài khoản? <span onClick={() => setAuthMode('register')}>Đăng ký ngay</span></p>
          ) : (
            <p>Đã có tài khoản? <span onClick={() => setAuthMode('login')}>Đăng nhập tại đây</span></p>
          )}
        </div>
      </div>
    </div>
  );
};
