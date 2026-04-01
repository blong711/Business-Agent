import React, { useState, useEffect } from 'react';
import './index.css';

import { AuthView } from './components/AuthView';
import { Sidebar } from './components/Sidebar';
import { ChatView } from './components/ChatView';
import { AdminUsers } from './components/AdminUsers';
import { AdminTelegram } from './components/AdminTelegram';

import { apiService } from './api';
import { Message, UserItem, TelegramGroup, TelegramMember } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string>('user');
  const [viewMode, setViewMode] = useState<'chat' | 'users' | 'telegram'>('chat');
  
  const [authError, setAuthError] = useState('');
  const [linkMessage, setLinkMessage] = useState('');
  
  // Chat States
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Admin States
  const [userList, setUserList] = useState<UserItem[]>([]);
  const [telegramGroups, setTelegramGroups] = useState<TelegramGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<TelegramGroup | null>(null);
  const [telegramMembers, setTelegramMembers] = useState<TelegramMember[]>([]);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);

  // Background animation elements could be placed here if needed
  
  const handleLinkTelegram = async (username: string, tid: string) => {
    try {
      await apiService.linkTelegram(username, tid);
      setLinkMessage(`Đã liên kết thành công với Telegram ID: ${tid}`);
      // Xóa param trên URL cho sạch
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (e: any) {
      console.error(e);
      setLinkMessage(`Lỗi liên kết: ${e.message}`);
    }
  };

  const loadHistory = async (user: string) => {
    try {
      const data = await apiService.fetchHistory(user);
      const historyMsgs: Message[] = data.map((msg: any, i: number) => ({
        id: `hist-${i}-${Date.now()}`,
        text: msg.content,
        sender: msg.role === 'user' ? 'user' : 'bot',
        intent: msg.intent,
        time: new Date(msg.timestamp).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})
      }));
      
      const welcomeMsg: Message = {
        id: '1',
        sender: 'bot',
        time: new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}),
        text: historyMsgs.length > 0 
          ? `Chào mừng **${user}** trở lại! Hiệu suất agent đã được thiết lập. Dưới đây là lịch sử chat của bạn.` 
          : `Chào mừng **${user}**! Dường như bạn là người mới. Bạn cần hỗ trợ gì từ Hệ sinh thái Agent hôm nay?`
      };
      
      setMessages([welcomeMsg, ...historyMsgs]);
    } catch (e) {
      console.error(e);
      setMessages([
        { id: '1', text: `Chào mừng **${user}**!`, sender: 'bot', time: new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}) }
      ]);
    }
  };

  useEffect(() => {
    // Load auth from localStorage on mount
    const savedUser = localStorage.getItem('ai_agent_user');
    const savedRole = localStorage.getItem('ai_agent_role');
    if (savedUser && savedRole) {
      setCurrentUser(savedUser);
      setCurrentUserRole(savedRole);
      loadHistory(savedUser);
      
      const urlParams = new URLSearchParams(window.location.search);
      const tid = urlParams.get('telegram_id');
      if (tid) {
        handleLinkTelegram(savedUser, tid);
      }
    }
  }, []);

  const handleAuth = async (username: string, password: string, mode: 'login' | 'register') => {
    setAuthError('');
    if (!username.trim() || !password.trim()) {
      setAuthError('Vui lòng nhập đầy đủ tài khoản và mật khẩu.');
      return;
    }
    
    try {
      const data = mode === 'login' 
        ? await apiService.login(username, password)
        : await apiService.register(username, password);
        
      setCurrentUser(data.username);
      setCurrentUserRole(data.role || 'user');

      // Persist to localStorage
      localStorage.setItem('ai_agent_user', data.username);
      localStorage.setItem('ai_agent_role', data.role || 'user');
      
      // Auto link if telegram_id exists in URL
      const urlParams = new URLSearchParams(window.location.search);
      const tid = urlParams.get('telegram_id');
      if (tid) {
        handleLinkTelegram(data.username, tid);
      }

      setViewMode('chat');
      loadHistory(data.username);
    } catch (err: any) {
      setAuthError(err.message || 'Lỗi kết nối Server! Backend đang đóng.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentUserRole('user');
    setViewMode('chat');
    setMessages([]);
    localStorage.removeItem('ai_agent_user');
    localStorage.removeItem('ai_agent_role');
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading || !currentUser) return;
    
    const timeNow = new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'});
    const userMsg: Message = { id: Date.now().toString(), text, sender: 'user', time: timeNow };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const data = await apiService.sendMessage(text, currentUser);
      
      const botMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        text: data.response, 
        sender: 'bot', 
        intent: data.intent,
        time: new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}) 
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        id: `error-${Date.now()}`, 
        text: 'Ôi, lỗi kết nối! Backend chưa phản hồi. Vui lòng kiểm tra lại.', 
        sender: 'bot', 
        time: new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}) 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    setIsLoadingAdmin(true);
    try {
      const data = await apiService.fetchUsers();
      setUserList(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingAdmin(false);
    }
  };

  const loadTelegramGroups = async () => {
    setIsLoadingAdmin(true);
    try {
      const data = await apiService.fetchTelegramGroups();
      setTelegramGroups(data);
      setSelectedGroup(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingAdmin(false);
    }
  };

  const loadTelegramMembers = async (chatId: number, group: TelegramGroup) => {
    setIsLoadingAdmin(true);
    setSelectedGroup(group);
    try {
      const data = await apiService.fetchTelegramMembers(chatId);
      setTelegramMembers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingAdmin(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="app-layout">
        <div className="background-elements">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
        </div>
        <AuthView onAuth={handleAuth} authError={authError} />
      </div>
    );
  }

  return (
    <div className="app-layout">
      <div className="background-elements">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
      
      <div className="app-container slide-right">
        <Sidebar 
          currentUser={currentUser} 
          currentUserRole={currentUserRole}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onLogout={handleLogout}
          fetchUsers={loadUsers}
          fetchTelegramGroups={loadTelegramGroups}
        />

        <div className="main-wrapper">
          {viewMode === 'chat' && (
            <>
              {linkMessage && (
                <div className="link-success-toast slide-up">
                  {linkMessage}
                  <button onClick={() => setLinkMessage('')}>×</button>
                </div>
              )}
              <ChatView 
                messages={messages} 
                currentUser={currentUser} 
                currentUserRole={currentUserRole} 
                loading={loading}
                onSendMessage={handleSendMessage}
                input={input}
                setInput={setInput}
              />
            </>
          )}

          {viewMode === 'users' && (
            <AdminUsers userList={userList} isLoading={isLoadingAdmin} />
          )}

          {viewMode === 'telegram' && (
            <AdminTelegram 
              groups={telegramGroups} 
              members={telegramMembers}
              selectedGroup={selectedGroup}
              onSelectGroup={loadTelegramMembers}
              onBack={() => { setSelectedGroup(null); loadTelegramGroups(); }}
              isLoading={isLoadingAdmin}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
