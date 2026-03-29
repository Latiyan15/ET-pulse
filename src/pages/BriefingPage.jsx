import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, Share2, Bookmark, MessageSquare, Zap, 
  TrendingUp, TrendingDown, Lightbulb, CheckCircle2, 
  ChevronRight, Globe, X, Send, Sparkles, Activity,
  Info, BarChart3, Newspaper, Layers
} from 'lucide-react';
import { getBriefing, askQuestion } from '../utils/api';
import { useLanguage } from '../utils/i18n';
import ReactMarkdown from 'react-markdown';
import './BriefingPage.css';
import './chatStyles.css';

const BriefingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine view mode from URL (?mode=flash or ?mode=deep)
  const queryParams = new URLSearchParams(location.search);
  const viewMode = queryParams.get('mode') || 'deep'; // Default to deep dive

  const [loading, setLoading] = useState(true);
  const [briefing, setBriefing] = useState(null);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  
  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [isAsking, setIsAsking] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [sessionId, setSessionId] = useState(`session_${Date.now()}`);
  
  const chatEndRef = useRef(null);
  
  // Real-time listener for profile changes (since localstorage events don't trigger across same window easily,
  // we can just read the current state on every render, but useLanguage handes it via the passed profile)
  // For instantaneous updates from Home, Briefing page gets remounted or we read from localStorage
  const userProfile = useMemo(() => JSON.parse(localStorage.getItem('etpulse_profile') || '{}'), [location.search]);
  const userType = userProfile.user_type || 'reader';
  const { t } = useLanguage(userProfile);

  // Loading Steps Animation
  useEffect(() => {
    if (!loading) return;
    const intervals = [
      setTimeout(() => setLoadingStep(1), 1200),
      setTimeout(() => setLoadingStep(2), 2600)
    ];
    return () => intervals.forEach(clearTimeout);
  }, [loading]);

  // Auto-scroll chat
  useEffect(() => {
    if (isChatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isChatOpen, isAsking]);

  // Fetch real briefing from backend
  useEffect(() => {
    const fetchBriefingData = async () => {
      setLoading(true);
      try {
        const data = await getBriefing(id, userType, { 
          language: userProfile.preferred_language || 'English',
          sectors: userProfile.sectors || [],
          interests: userProfile.interests || [],
          mode: viewMode
        });
        
        if (data && !data.error) {
          setBriefing(data);
          setError(null);
          
          // Save to history automatically
          const history = JSON.parse(localStorage.getItem('etpulse_history') || '[]');
          if (!history.find(h => h.id === id)) {
            history.unshift({
              id,
              title: data.title,
              date: new Date().toLocaleDateString('en-GB'),
              type: viewMode === 'flash' ? '30s Summary' : 'Deep Breakdown'
            });
            localStorage.setItem('etpulse_history', JSON.stringify(history.slice(0, 20)));
          }
        } else {
          setError(data?.error || "Failed to generate AI analysis.");
        }
      } catch (err) {
        console.error("Fetch failed", err);
        setError(t('briefing.error_network', { defaultValue: 'Network error connecting to Pulse AI. Please try again.' }));
      } finally {
        setLoading(false);
      }
    };

    fetchBriefingData();
  }, [id, userType, userProfile.preferred_language, viewMode]);

  const handleAskAI = async (question) => {
    if (!question.trim()) return;
    
    setIsChatOpen(true);
    setChatInput('');
    setIsAsking(true);
    
    // Add user message immediately
    const userMsg = { role: 'user', content: question };
    setChatHistory(prev => [...prev, userMsg]);

    try {
      const response = await askQuestion(id, question, chatHistory, {
        userType: userType,
        language: userProfile.preferred_language || 'English',
        sectors: userProfile.sectors || [],
        interests: userProfile.interests || [],
        sessionId
      });
      
      setChatHistory(prev => [...prev, { role: 'ai', content: response.answer }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'ai', content: "I'm having trouble connecting right now. Please try again." }]);
    } finally {
      setIsAsking(false);
    }
  };

  if (error) {
    return (
      <div className="briefing-error-screen">
        <h2 className="error-title">{t('briefing.error_title')}</h2>
        <p className="error-msg">{error}</p>
        <button className="error-back-btn" onClick={() => navigate(-1)}>{t('nav.back', {defaultValue: 'Go Back'})}</button>
      </div>
    );
  }

  if (loading || !briefing) {
    return (
      <div className="generating-fullscreen">
        <div className="ai-orb-container">
          <div className="ai-ring"></div>
          <div className="ai-ring"></div>
          <div className="ai-orb">
            <Sparkles size={32} color="white" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
          </div>
        </div>
        <h2 className="generating-text">{t('loading.analyzing')}</h2>
        <div className="loading-steps">
          <div className={`loading-step ${loadingStep >= 0 ? 'active' : ''}`}>
             <CheckCircle2 size={18} /> {t('loading.scanning')}
          </div>
          <div className={`loading-step ${loadingStep >= 1 ? 'active' : ''}`}>
             <Activity size={18} /> {t('loading.tailoring', { type: userType.replace('_', ' ') })}
          </div>
          <div className={`loading-step ${loadingStep >= 2 ? 'active' : ''}`}>
             <Zap size={18} /> {t('loading.building', { mode: viewMode === 'flash' ? t('briefing.flash').replace('⚡ ', '') : t('briefing.deep').replace('🔍 ', '') })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="briefing-container">
      {/* Mode Indicator Overlay */}
      <div className="mode-indicator">
        {viewMode === 'flash' ? t('briefing.flash') : t('briefing.deep')}
      </div>

      {/* Top Action Bar */}
      <header className="briefing-nav">
        <div className="briefing-nav-left">
          <button className="icon-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={22} />
          </button>
          <span style={{ fontWeight: 800, fontSize: '1rem', color: '#1e1b4b' }}>{t('briefing.title_deep').replace(' DEEP BREAKDOWN', '')} Pulse AI</span>
        </div>
        
        <div className="briefing-nav-actions">
          <button className="icon-btn" onClick={() => setIsBookmarked(!isBookmarked)}>
            <Bookmark size={22} fill={isBookmarked ? "#4338ca" : "none"} color={isBookmarked ? "#4338ca" : "currentColor"} />
          </button>
          <button className="icon-btn">
            <Share2 size={22} />
          </button>
        </div>
      </header>

      <main className="briefing-main">
        {/* Title Section */}
        <div className="briefing-hero">
          <div className="ai-badge">
            <Sparkles size={16} /> {viewMode === 'flash' ? t('briefing.title_flash').toUpperCase() : t('briefing.title_deep')}
          </div>
          <h1 className="briefing-title">{briefing.title}</h1>
          <div className="briefing-meta">
            <Newspaper size={18} />
            <span>{briefing.source_count} {t('briefing.sources')}</span>
            <span className="dot">•</span>
            <span>{briefing.reading_time} {t('briefing.read')}</span>
          </div>
        </div>

        {/* --- VIEW MODE: FLASH (30s) --- */}
        {viewMode === 'flash' && (
          <div className="flash-view-layout">
            {/* Sector pulse section as requested */}
            <section className="briefing-section highlight-card" style={{ borderLeftColor: '#10b981', background: '#f0fdf4' }}>
              <div className="section-header">
                <div className="section-icon" style={{ background: '#dcfce7', color: '#059669' }}>
                  <BarChart3 size={24} />
                </div>
                <h3 style={{ color: '#065f46' }}>{t('briefing.sector_pulse')}</h3>
              </div>
              <ul className="tldr-list">
                 {briefing.sector_highlights?.map((highlight, i) => (
                   <li key={i} style={{ fontWeight: 600, color: '#065f46' }}>
                     <div className="bullet"><Activity size={18} /></div>
                     {highlight}
                   </li>
                 ))}
                 {!briefing.sector_highlights && briefing.themes.map((theme, i) => (
                   <li key={i} style={{ fontWeight: 600, color: '#065f46' }}>
                     <div className="bullet"><Activity size={18} /></div>
                     {theme}: Major momentum shift observed
                   </li>
                 ))}
              </ul>
            </section>

            <section className="briefing-section">
              <div className="section-header">
                <div className="section-icon tldr-icon">
                  <Zap size={24} />
                </div>
                <h3>{t('briefing.quick_take')}</h3>
              </div>
              <p className="simple-explanation-text" style={{ fontWeight: 600, fontSize: '1.25rem' }}>
                {briefing.simple_explanation}
              </p>
              <ul className="tldr-list">
                {briefing.tldr.slice(0, 3).map((item, i) => (
                  <li key={i}>
                    <div className="bullet"><CheckCircle2 size={22} /></div>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}

        {/* --- VIEW MODE: DEEP (Breakdown) --- */}
        {viewMode === 'deep' && (
          <div className="deep-view-layout">
            <section className="briefing-section highlight-card">
              <div className="section-header">
                <div className="section-icon" style={{ background: '#eef2ff', color: '#6366f1' }}>
                  <Lightbulb size={24} />
                </div>
                <h3 style={{ color: '#3730a3' }}>{t('briefing.personalized')}</h3>
              </div>
              <p className="personalized-text" style={{ fontSize: '1.25rem', fontWeight: 500 }}>
                {briefing.personalized_take}
              </p>
              <button 
                className="explain-simply-btn"
                onClick={() => handleAskAI("Can you explain this analysis in very simple terms?")}
              >
                <Globe size={20} /> {t('briefing.explain')}
              </button>
            </section>

            <section className="briefing-section">
              <div className="section-header">
                <div className="section-icon tldr-icon">
                  <Layers size={24} />
                </div>
                <h3>{t('briefing.full_summary')}</h3>
              </div>
              <p className="simple-explanation-text">
                {briefing.simple_explanation}
              </p>
              <ul className="tldr-list">
                {briefing.tldr.map((item, i) => (
                  <li key={i}>
                    <div className="bullet"><ChevronRight size={22} /></div>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}

        {/* Impact Cards (Shown in both, but maybe smaller in flash) */}
        <div className="impact-grid" style={viewMode === 'flash' ? { gap: '16px' } : {}}>
          <section className={`briefing-section impact-card winning ${viewMode === 'flash' ? 'small' : ''}`}>
            <div className="section-header" style={viewMode === 'flash' ? { marginBottom: '12px' } : {}}>
              <div className="section-icon winning-icon" style={viewMode === 'flash' ? { width: 32, height: 32 } : {}}>
                <TrendingUp size={viewMode === 'flash' ? 18 : 22} />
              </div>
              <h3 style={viewMode === 'flash' ? { fontSize: '1.1rem' } : {}}>{t('briefing.winners')}</h3>
            </div>
            <ul className="impact-list">
              {(viewMode === 'flash' ? briefing.impact?.winners?.slice(0, 2) : briefing.impact?.winners)?.map((item, i) => (
                <li key={i}>
                  <div className="bullet"><ChevronRight size={18} color="#10b981"/></div>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className={`briefing-section impact-card losing ${viewMode === 'flash' ? 'small' : ''}`}>
            <div className="section-header" style={viewMode === 'flash' ? { marginBottom: '12px' } : {}}>
              <div className="section-icon losing-icon" style={viewMode === 'flash' ? { width: 32, height: 32 } : {}}>
                <TrendingDown size={viewMode === 'flash' ? 18 : 22} />
              </div>
              <h3 style={viewMode === 'flash' ? { fontSize: '1.1rem' } : {}}>{t('briefing.risks')}</h3>
            </div>
            <ul className="impact-list">
              {(viewMode === 'flash' ? briefing.impact?.losers?.slice(0, 2) : briefing.impact?.losers)?.map((item, i) => (
                <li key={i}>
                  <div className="bullet"><ChevronRight size={18} color="#ef4444"/></div>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Suggested Questions (Dive Deeper) - Always kept as requested */}
        <div className="ai-footer">
          <h4 className="footer-title">{t('briefing.dive_deeper')}</h4>
          <div className="suggestion-chips">
            {briefing.suggested_questions?.map((q, i) => (
              <button 
                key={i} 
                className="suggestion-chip"
                onClick={() => handleAskAI(q)}
                disabled={isAsking}
              >
                {q} <ChevronRight size={22} color="#6366f1"/>
              </button>
            ))}
          </div>
          
          <button 
            className="ask-ai-floating-btn"
            onClick={() => setIsChatOpen(true)}
          >
            <div className="ask-ai-inner">
              <MessageSquare size={24} />
              <span>{t('briefing.ask_ai_btn')}</span>
            </div>
          </button>
        </div>
      </main>

      {/* Slide-up Chat Panel */}
      {isChatOpen && (
        <div className="chat-panel-overlay">
          <div className="chat-panel">
            <div className="chat-panel-header">
              <h3><Sparkles size={20} color="#4338ca" /> {t('chat.title')}</h3>
              <button className="icon-btn" style={{ border: 'none', background: 'transparent' }} onClick={() => setIsChatOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="chat-messages" style={{ background: '#f8fafc' }}>
              {chatHistory.length === 0 && !isAsking && (
                <div className="chat-msg ai" style={{ background: 'white', border: '1px solid #e2e8f0', color: '#1e293b' }}>
                  {t('chat.greeting', { count: briefing.source_count })}
                </div>
              )}
              {chatHistory.map((msg, i) => (
                <div key={i} className={`chat-msg ${msg.role}`} style={msg.role === 'ai' ? { background: 'white', border: '1px solid #e2e8f0', color: '#1e293b' } : { background: '#4338ca', color: 'white' }}>
                  {msg.role === 'ai' ? <ReactMarkdown>{msg.content}</ReactMarkdown> : msg.content}
                </div>
              ))}
              {isAsking && (
                <div className="chat-msg ai" style={{ background: 'transparent', border: 'none', opacity: 0.7, color: '#64748b' }}>
                  <div className="dot-typing" style={{ '--dot-color': '#4338ca' }}></div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            
            <div className="chat-input-area" style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
              <div className="chat-input-wrapper" style={{ background: '#f1f5f9', border: 'none' }}>
                <input 
                  type="text" 
                  style={{ color: '#0f172a' }}
                  placeholder={t('chat.input')} 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAskAI(chatInput)}
                  disabled={isAsking}
                  autoFocus
                />
                <button 
                  className={`send-btn ${(!chatInput.trim() || isAsking) ? 'disabled' : ''}`}
                  style={{ background: '#4338ca' }}
                  onClick={() => handleAskAI(chatInput)}
                  disabled={!chatInput.trim() || isAsking}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BriefingPage;
