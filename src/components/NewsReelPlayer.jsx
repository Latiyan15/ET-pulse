import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, X, Volume2, VolumeX, Share2, Subtitles, Settings, ChevronRight, FileText, CheckCircle2 } from 'lucide-react';
import './NewsReelPlayer.css';
import { useLanguage } from '../utils/i18n';

// Simulated highlights for the video playback
const generateHighlights = (article) => {
  return [
    `Breaking Update: ${article.title.substring(0, 50)}...`,
    "Key impact analyzed across major sectors.",
    "Experts predict mixed short-term reactions.",
    "Stay tuned to ET Pulse for live updates.",
  ];
};

const NewsReelPlayer = ({ article, onClose, defaultLanguage = 'en' }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentHighlightIdx, setCurrentHighlightIdx] = useState(0);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState(defaultLanguage);

  const duration = 60; // 60-second simulated video
  const timerRef = useRef(null);
  
  // Dummy profile for i18n
  const { t } = useLanguage({ preferred_language: activeLanguage });
  const highlights = generateHighlights(article);

  // Auto-play / pause logic
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            clearInterval(timerRef.current);
            setIsPlaying(false);
            return duration;
          }
          return prev + 0.1; // 100ms ticks
        });
      }, 100);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying]);

  // Sync progress bar and subtitles
  useEffect(() => {
    setProgress((currentTime / duration) * 100);
    
    // Cycle through highlights based on time
    const highlightDuration = duration / highlights.length;
    const newIdx = Math.min(
      Math.floor(currentTime / highlightDuration),
      highlights.length - 1
    );
    if (newIdx !== currentHighlightIdx) {
      setCurrentHighlightIdx(newIdx);
    }
  }, [currentTime, duration, highlights.length, currentHighlightIdx]);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (currentTime >= duration) setCurrentTime(0); // Restart if ended
    setIsPlaying(!isPlaying);
  };

  const handleDragDown = (e) => {
    // A simplified swipe down simulator
    if (e.changedTouches && e.changedTouches[0].clientY > window.innerHeight * 0.7) {
      onClose();
    }
  };

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  ];

  return (
    <div className="reel-overlay" onClick={togglePlay} onTouchEnd={handleDragDown}>
      <div className="reel-container">
        {/* Background Video Simulation */}
        <div className="reel-video-bg">
          <img src={article.image || article.thumbnail || 'https://images.unsplash.com/photo-1611974714405-1a8b13c1935e?auto=format&fit=crop&q=80&w=600'} alt="News bg" />
          <div className="reel-gradient-overlay"></div>
        </div>

        {/* Top Header */}
        <div className="reel-header" onClick={e => e.stopPropagation()}>
          <div className="reel-progress-container">
            <div className="reel-progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
          
          <div className="reel-top-controls">
            <div className="reel-badge">
              <span className="live-dot"></span>
              {t('breaking_news')}
            </div>
            
            <button className="reel-close-btn" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Center Play/Pause indicator (briefly shown) */}
        {!isPlaying && currentTime < duration && (
          <div className="reel-center-play">
            <Play size={48} fill="currentColor" />
          </div>
        )}

        {/* Bottom Content Area */}
        <div className="reel-bottom-content" onClick={e => e.stopPropagation()}>
          {/* Subtitles / Highlights */}
          <div className="reel-subtitles-container">
            <div className="summarized-badge">
              <CheckCircle2 size={12} />
              {t('reel.ai_summarized')}
            </div>
            <h2 className="reel-title">{article.title}</h2>
            
            <div className="highlight-box">
              <p key={currentHighlightIdx} className="highlight-text animate-slideUp">
                {highlights[currentHighlightIdx]}
              </p>
            </div>
          </div>

          {/* Side / Bottom Controls */}
          <div className="reel-actions-row">
            <div className="left-actions">
              <button 
                className="action-btn" 
                onClick={() => setShowLangMenu(!showLangMenu)}
              >
                <Subtitles size={20} />
                <span>{languages.find(l => l.code === activeLanguage)?.native}</span>
              </button>
              
              <button className="action-btn" onClick={() => setIsMuted(!isMuted)}>
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                <span>{t('reel.sound')}</span>
              </button>
            </div>

            <div className="right-actions">
              <button className="action-btn-circle read-article">
                <FileText size={18} />
              </button>
              <button className="action-btn-circle share-btn">
                <Share2 size={18} />
              </button>
            </div>
          </div>

          {/* Language Menu Overlay */}
          {showLangMenu && (
            <div className="lang-menu-overlay">
              <div className="lang-menu-header">
                <h3>{t('reel.select_lang')}</h3>
                <button onClick={() => setShowLangMenu(false)}><X size={18}/></button>
              </div>
              <div className="lang-list">
                {languages.map(lang => (
                  <button 
                    key={lang.code}
                    className={`lang-option ${activeLanguage === lang.code ? 'active' : ''}`}
                    onClick={() => {
                      setActiveLanguage(lang.code);
                      setShowLangMenu(false);
                      // In a real app, this would trigger an audio track change or trigger re-translation of subtitles
                    }}
                  >
                    <span>{lang.native} ({lang.label})</span>
                    {activeLanguage === lang.code && <CheckCircle2 size={16} className="check-icon" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsReelPlayer;
