import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send, Sparkles, ArrowLeft, History, Plus, ChevronRight, Globe, Trash2, Clock, MessageSquare
} from 'lucide-react';
import { askQuestion } from '../utils/api';
import { useLanguage } from '../utils/i18n';
import ReactMarkdown from 'react-markdown';
import './ExplorePage.css';

const ExplorePage = () => {
  console.log('--- EXPLORE PAGE V10 ---');
  const navigate = useNavigate();

  // Load profile for personalization
  const profile = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('etpulse_profile')) || { user_type: 'reader', language: 'English' };
    } catch {
      return { user_type: 'reader', language: 'English' };
    }
  }, []);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('etpulse_user')) || { name: 'There' };
    } catch {
      return { name: 'There' };
    }
  }, []);

  const firstName = user.name?.split(' ')[0] || 'There';

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(`explore_${Date.now()}`);
  const messagesEndRef = useRef(null);

  const { t, fullLanguageName } = useLanguage(profile);

  const [recentChats, setRecentChats] = useState([]);
  
  useEffect(() => {
    try {
      const chats = JSON.parse(localStorage.getItem('etpulse_chats')) || [];
      if (chats.length === 0) {
        // Fallback mock data if none exists
        setRecentChats([
          { id: '1', title: 'What impact does the repo rate have?', topic: 'Repo Rate', date: 'Today' },
          { id: '2', title: 'Explain inflation trends in FMCG', topic: 'Inflation', date: 'Yesterday' },
          { id: '3', title: 'How is the tech sector performing?', topic: 'IT Sector', date: '2 days ago' }
        ]);
      } else {
        setRecentChats(chats.slice(0, 3));
      }
    } catch {
      setRecentChats([]);
    }
  }, []);

  const quickTopics = [
    "Markets Today", "Budget 2025", "RBI Policy", "Nifty Outlook", "Sector Watch", "Rupee vs Dollar"
  ];

  // Initial greeting
  useEffect(() => {
    // Try to load existing chat for this session or just show welcome
    const personaType = profile.user_type || 'reader';
    const welcomeText = t('explore.greeting', { 
      name: firstName, 
      type: t(`persona.${personaType}`, {defaultValue: personaType}) 
    });
    
    setMessages(prev => {
      // Only set the initial welcome message if there are no messages yet
      if (prev.length === 0) {
        return [{ role: 'ai', content: welcomeText }];
      }
      return prev;
    });
  }, [firstName, profile.user_type, t]);

  const suggestions = useMemo(() => {
    // These keys will need to be added to i18n.js
    if (profile.user_type === 'investor') return [
      t('explore.sug.investor_1', {defaultValue: "Which of my sectors are up today?"}),
      t('explore.sug.investor_2', {defaultValue: "Any news on my portfolio stocks?"}),
      t('explore.sug.investor_3', {defaultValue: "Explain the latest quarterly earnings."})
    ];
    if (profile.user_type === 'student') return [
      t('explore.sug.student_1', {defaultValue: "What is a repo rate?"}),
      t('explore.sug.student_2', {defaultValue: "Explain inflation simply."}),
      t('explore.sug.student_3', {defaultValue: "How does the stock market work?"})
    ];
    if (profile.user_type === 'founder') return [
      t('explore.sug.founder_1', {defaultValue: "Any recent startup funding news?"}),
      t('explore.sug.founder_2', {defaultValue: "What are the new compliance rules?"}),
      t('explore.sug.founder_3', {defaultValue: "How is the tech sector performing?"})
    ];
    return [
      t('explore.sug.default_1', {defaultValue: "What's moving the markets today?"}),
      t('explore.sug.default_2', {defaultValue: "Explain RBI policies simply."})
    ];
  }, [profile.user_type, t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text) => {
    const messageText = text || input;
    if (!messageText.trim() || loading) return;

    setMessages(prev => [...prev, { role: 'user', content: messageText }]);
    setInput('');
    setLoading(true);

    try {
      // Exclude the very first welcome message from the history sent to AI to save tokens, or send it, doesn't matter much.
      const historyToSend = messages.slice(1).map(m => ({ role: m.role, content: m.content }));

      const response = await askQuestion("Explore", messageText, historyToSend, {
        userType: profile.user_type,
        language: profile.preferred_language || 'English',
        sectors: profile.sectors || [],
        interests: profile.interests || [],
        sessionId
      });

      console.log('🤖 Explore Response:', response);
      const aiReply = response.answer;

      if (!aiReply) throw new Error('Empty response from AI');

      setMessages(prev => {
        const newMsgs = [...prev, { role: 'ai', content: aiReply }];
        // Save to local storage for profile page
        const savedChats = JSON.parse(localStorage.getItem('etpulse_chats') || '[]');
        const existingChatIdx = savedChats.findIndex(c => c.id === sessionId);
        if (existingChatIdx >= 0) {
          savedChats[existingChatIdx].messages = newMsgs.length;
          savedChats[existingChatIdx].date = new Date().toLocaleDateString('en-GB');
        } else {
          savedChats.unshift({
            id: sessionId,
            title: messageText.substring(0, 30) + '...',
            date: new Date().toLocaleDateString('en-GB'),
            messages: newMsgs.length
          });
        }
        localStorage.setItem('etpulse_chats', JSON.stringify(savedChats.slice(0, 10)));
        return newMsgs;
      });
    } catch (err) {
      console.error('❌ Explore Chat Error:', err);
      setMessages(prev => [...prev, { role: 'ai', content: t('explore.error') }]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setSessionId(`explore_${Date.now()}`);
    setMessages([{ role: 'ai', content: t('explore.new_chat', { name: firstName }) }]);
  };

  return (
    <div className="explore-container">
      {/* Header */}
      <header className="explore-header">
        <button className="icon-btn" onClick={() => navigate('/home')}>
          <ArrowLeft size={20} />
        </button>
        <div className="explore-header-center">
          <Sparkles size={18} className="sparkle-icon" />
          <span>{t('explore.title')}</span>
        </div>
        <button className="icon-btn" onClick={handleNewChat} title={t('explore.new_chat_title', {defaultValue: 'New Chat'})}>
          <Plus size={20} />
        </button>
      </header>

      {/* Chat Area */}
      <main className="chat-area">
        <div className="messages-container">
          {messages.map((msg, i) => (
            <div key={i} className={`message-wrapper ${msg.role}`}>
              <div className="message-bubble">
                {msg.role === 'ai' ? <ReactMarkdown>{msg.content}</ReactMarkdown> : msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="message-wrapper ai">
              <div className="message-bubble loading-bubble">
                <div className="dot-typing"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions - only show initially */}
        {messages.length <= 1 && (
          <div className="chat-start-content">
            <div className="chat-suggestions">
              <p className="suggestions-label">{t('explore.try_asking')}</p>
              <div className="suggestions-grid">
                {suggestions.map((s, i) => (
                  <button key={`sug-${i}`} className="suggestion-item" onClick={() => handleSend(s)}>
                    {s} <ChevronRight size={14} />
                  </button>
                ))}
              </div>
            </div>

            <div className="quick-topics-section">
              <p className="suggestions-label">Quick topics</p>
              <div className="quick-topics-row">
                {quickTopics.map((topic, i) => (
                  <button key={`qt-${i}`} className="quick-topic-chip" onClick={() => handleSend(`Tell me about ${topic}`)}>
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {recentChats.length > 0 && (
              <div className="recent-conversations-section">
                <p className="suggestions-label">Recent Conversations</p>
                <div className="recent-chats-list">
                  {recentChats.map((chat, i) => (
                    <div key={`chat-${i}`} className="recent-chat-card" onClick={() => handleSend(chat.title)}>
                      <div className="rc-header">
                        <span className="rc-topic-tag">{chat.topic || 'General'}</span>
                        <span className="rc-date"><Clock size={12} /> {chat.date}</span>
                      </div>
                      <p className="rc-summary"><MessageSquare size={14} /> {chat.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Input Area */}
      <div className="chat-input-wrapper">
        <div className="chat-input-container">
          <input
            type="text"
            placeholder={t('explore.input', { topic: profile.sectors?.[0] || 'markets' })}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
          />
          <button
            className={`send-btn ${input.trim() && !loading ? 'active' : ''}`}
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
          >
            <Send size={18} />
          </button>
        </div>
        <div className="chat-footer-note">
          <Globe size={12} /> {t('explore.footer', { lang: fullLanguageName })}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
