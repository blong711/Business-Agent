import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Send, Bot, User, Mic, Volume2, VolumeX, Loader2, Headphones } from 'lucide-react';
import Markdown from 'markdown-to-jsx';
import { Message } from '../types';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

import { translations, Language } from '../i18n';

interface ChatViewProps {
  messages: Message[];
  currentUser: string;
  currentUserRole: string;
  loading: boolean;
  onSendMessage: (text: string) => void;
  input: string;
  setInput: (text: string) => void;
  lang: Language;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  currentUser,
  currentUserRole,
  loading,
  onSendMessage,
  input,
  setInput,
  lang = 'vi'
}) => {
  const t = translations[lang] || translations['vi'];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [handsFree, setHandsFree] = useState(false);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    // Auto play last bot message if voice is enabled and it's from bot
    const lastMsg = messages[messages.length - 1];
    if (voiceEnabled && lastMsg && lastMsg.sender === 'bot' && !isPlaying) {
      playVoice(lastMsg.text, lastMsg.id);
    }
  }, [messages, loading]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
  };

  const startSpeechRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      alert(t.speechNotSupported);
      return;
    }

    if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
    }

    const recognition = new window.webkitSpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = lang === 'vi' ? 'vi-VN' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true; // Show partial results for better feedback

    recognition.onstart = () => {
        setIsRecording(true);
        console.log("Speech recognition: STARTED");
    };
    recognition.onend = () => {
        setIsRecording(false);
        console.log("Speech recognition: ENDED");
    };
    recognition.onspeechstart = () => console.log("Speech recognition: Speech detected...");
    recognition.onspeechend = () => console.log("Speech recognition: Speech finished.");
    recognition.onerror = (event: any) => {
      console.error("Speech Recognition Error:", event.error);
      setIsRecording(false);
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      const isFinal = event.results[event.results.length - 1].isFinal;

      if (isFinal) {
        console.log("Speech recognition FINAL RESULT:", transcript);
        setInput(transcript);
        onSendMessage(transcript);
        recognition.stop();
      } else {
        console.log("Speech recognition partial:", transcript);
        setInput(transcript);
      }
    };

    try {
        recognition.start();
    } catch (e) {
        console.error("Recognition start error:", e);
    }
  }, [onSendMessage, setInput]);

  const playVoice = async (text: string, msgId: string) => {
    try {
      setIsPlaying(msgId);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const apiUrl = `http://${window.location.hostname}:8000/api/v1/voice/tts?text=${encodeURIComponent(text)}`;
      const audio = new Audio(apiUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsPlaying(null);
        // Hands-free: start listening again after bot finishes speaking
        if (handsFree) {
            setTimeout(startSpeechRecognition, 500);
        }
      };
      audio.onerror = () => setIsPlaying(null);
      
      await audio.play();
    } catch (e) {
      console.error("Lỗi phát âm thanh:", e);
      setIsPlaying(null);
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (!voiceEnabled && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(null);
    }
  };

  const toggleHandsFree = () => {
    const newState = !handsFree;
    setHandsFree(newState);
    if (newState) {
        setVoiceEnabled(true);
        startSpeechRecognition();
    } else {
        if (recognitionRef.current) recognitionRef.current.stop();
    }
  };

  return (
    <div className="chat-container-aura fade-in">
      <div className="chat-bg-aura"></div>
      
      <div className="chat-controls-bar">
        <div className="chat-status-pill">
          <div className="status-dot" style={{ backgroundColor: handsFree ? '#8b5cf6' : '#10b981' }}></div>
          <span>{handsFree ? t.handsFreeLabel : t.liveLabel}</span>
        </div>
        
        <div className="chat-voice-actions">
          <button 
              className={`voice-pill-btn ${handsFree ? 'active' : ''}`} 
              onClick={toggleHandsFree}
              title={handsFree ? t.handsFreeOff : t.handsFreeOn}
          >
              <Headphones size={16} />
              <span>{handsFree ? t.handsFreeActive : t.handsFree}</span>
          </button>

          <button 
              className={`voice-pill-btn ${voiceEnabled && !handsFree ? 'active' : ''}`} 
              onClick={toggleVoice}
              title={voiceEnabled ? t.ttsOff : t.ttsOn}
              disabled={handsFree}
          >
              {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span>TTS</span>
          </button>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((msg, idx) => (
          <div 
            key={msg.id} 
            className={`message-wrapper ${msg.sender}`} 
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className={`message-content-wrapper ${msg.sender === 'bot' ? 'align-start' : 'align-end'}`}>
              <div className={`message-author ${msg.sender}`}>
                <div className="avatar-mini">
                  {msg.sender === 'bot' ? <Bot size={14} /> : <User size={14} />}
                </div>
                <span>{msg.sender === 'bot' ? 'Nexus AI' : (currentUser || 'User')}</span>
                
                {msg.sender === 'bot' && (
                  <button 
                    className={`btn-play-msg ${isPlaying === msg.id ? 'playing' : ''}`}
                    onClick={() => playVoice(msg.text, msg.id)}
                  >
                    {isPlaying === msg.id ? <Loader2 size={12} className="animate-spin" /> : <Volume2 size={12} />}
                  </button>
                )}
              </div>
              
              <div className={`glass-bubble ${msg.sender}-bubble shadow-glow`}>
                <Markdown options={{ forceBlock: true }}>{msg.text}</Markdown>
                {msg.sender === 'bot' && isPlaying === msg.id && (
                  <div className="speaking-indicator">
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                  </div>
                )}
              </div>
              
              <div className="message-time">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
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

      <div className="glass-input-area">
        <div className="input-container cyber-glow">
          <div className="input-prefix">
            <Bot size={18} className={loading ? 'pulse-anim' : ''} />
          </div>
          
          <input 
            type="text" 
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isRecording ? t.listening : handsFree ? t.handsFreeActive : t.chatPlaceholder}
            disabled={loading || isRecording}
          />
          
          <div className="input-actions">
            <button 
              className={`mic-btn ${isRecording ? 'active' : ''}`}
              onClick={startSpeechRecognition}
              disabled={loading}
              title="Voice input"
            >
              {isRecording ? <Loader2 className="spin" size={20}/> : <Mic size={20}/>}
            </button>
            
            <button 
              className="send-btn" 
              onClick={handleSend}
              disabled={!input.trim() || loading || isRecording}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
