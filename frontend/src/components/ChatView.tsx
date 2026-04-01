import React, { useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import Markdown from 'markdown-to-jsx';
import { Message } from '../types';

interface ChatViewProps {
  messages: Message[];
  currentUser: string;
  currentUserRole: string;
  loading: boolean;
  onSendMessage: (text: string) => void;
  input: string;
  setInput: (text: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  currentUser,
  currentUserRole,
  loading,
  onSendMessage,
  input,
  setInput
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = () => {
    onSendMessage(input);
  };

  return (
    <div className="main-chat fade-in">
      <div className="chat-header glass-header">
        <div>
          <h2 className="model-name">Claude 3.5 Sonnet</h2>
          <div className="status-indicator">
            <div className="status-dot"></div>
            <span>Trực tiếp - Bạn đang là {currentUserRole.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-wrapper ${msg.sender} slide-up`}>
            <div className={`message-content-wrapper ${msg.sender === 'user' ? 'align-end' : 'align-start'}`}>
              <div className={`message-author ${msg.sender}`}>
                {msg.sender === 'bot' ? <Bot size={14} color="#a78bfa" /> : <User size={14} color="#60a5fa" />}
                <span>{msg.sender === 'bot' ? (msg.intent || 'Nexus AI') : currentUser}</span>
              </div>
              
              <div className={`message-bubble ${msg.sender}-bubble glass-bubble`}>
                <Markdown>{msg.text}</Markdown>
              </div>
              
              <span className="message-time">{msg.time}</span>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="message-wrapper bot slide-up">
            <div className="message-content-wrapper align-start">
              <div className="message-author bot">
                <Bot size={14} color="#a78bfa" />
                <span>Nexus AI</span>
              </div>
              <div className="message-bubble bot-bubble glass-bubble">
                <div className="typing-indicator">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} style={{ height: 1 }} />
      </div>

      <div className="input-area glass-input-area">
        <div className="input-container">
          <input 
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Nhập yêu cầu quản lý hoặc hỗ trợ... (VD: Tạo báo cáo tài chính)"
            disabled={loading}
          />
          <button className="send-btn" onClick={handleSend} disabled={loading || !input.trim()}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
