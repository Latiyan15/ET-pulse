import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search, Bell, User, ChevronRight, X, Sparkles,
  FileText, Target, TrendingUp, Eye, Link2,
  Home, Newspaper, BarChart3, Settings, Star, BookOpen,
  ArrowUpRight, ArrowDownRight, Minus, Zap, ArrowRight, Bookmark, Share2, ChevronLeft, Clock
} from 'lucide-react';
import { 
  mockArticles, marketIndices, sectorPerformance, 
  topGainers, topLosers, trendingAssets 
} from '../data/mockData';
import { fetchNewsByFilters, fetchNewsBySector, fetchTrendingNews, translateContent } from '../utils/api';
import { useLanguage } from '../utils/i18n';
import SplashTransition from '../components/SplashTransition';
import './HomePage.css';

const getSectorFallbackColor = (sector = '') => {
  switch(sector.toLowerCase()) {
    case 'banking': return '#1e293b'; 
    case 'it': return '#0f172a'; 
    case 'auto': return '#c2410c'; 
    case 'pharma': return '#065f46'; 
    default: return '#334155'; 
  }
};

const tickerData = [
  { name: 'SENSEX', value: '73,428', change: '+1.24%', positive: true },
  { name: 'NIFTY 50', value: '22,217', change: '+1.18%', positive: true },
  { name: 'BANK NIFTY', value: '47,832', change: '+1.85%', positive: true },
  { name: 'HDFC BANK', value: '₹1,642', change: '-0.43%', positive: false },
  { name: 'INFOSYS', value: '₹1,487', change: '+0.31%', positive: true },
  { name: 'USD/INR', value: '83.42', change: '0.09%', positive: true },
];

// Map stock symbols to their exact local brand logos
const stockLogoMap = {
  'INFY': '/stock-logos/infosys.svg',
  'RELIANCE': '/stock-logos/reliance.svg',
  'TCS': '/stock-logos/tcs.svg',
  'HDFCBANK': '/stock-logos/hdfcbank.svg',
  'SUNPHARMA': '/stock-logos/sunpharma.svg',
  'MARUTI': '/stock-logos/maruti.svg',
  'ONGC': '/stock-logos/ongc.svg',
  'COALINDIA': '/stock-logos/coalindia.svg',
  'ZOMATO': '/stock-logos/zomato.svg',
  'ADANIENT': '/stock-logos/adanient.svg',
  'TATASTEEL': '/stock-logos/tatasteel.svg',
};

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStory, setActiveStory] = useState(null);
  const [heatmapPeriod, setHeatmapPeriod] = useState('1D');
  const [activeSectorDetail, setActiveSectorDetail] = useState(null);
  const [activeNav, setActiveNav] = useState('Home');
  const [activeGLTab, setActiveGLTab] = useState('gainers');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Splash Transition State
  const [showSplash, setShowSplash] = useState(location.state?.showSplashTransition || false);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('etpulse_user')) || { name: 'Investor' };
    } catch {
      return { name: 'Investor' };
    }
  }, []);

  const [profile, setProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('etpulse_profile')) || { language: 'English' };
    } catch {
      return { language: 'English' };
    }
  });

  const { t, fullLanguageName } = useLanguage(profile);

  const firstName = user.name?.split(' ')[0] || 'Investor';
  const displayLanguage = profile.preferred_language || profile.languages?.[0] || 'English';

  const [interestArticles, setInterestArticles] = useState([]);
  const [feedArticles, setFeedArticles] = useState([]);
  const [heroHighlights, setHeroHighlights] = useState('');
  const [activeHeroSector, setActiveHeroSector] = useState('');
  const [activeFeedSector, setActiveFeedSector] = useState(() => {
    // Default to the user's first selected sector from onboarding
    try {
      const p = JSON.parse(localStorage.getItem('etpulse_profile')) || {};
      return p.sectors?.[0] || 'it';
    } catch { return 'it'; }
  });
  
  // Notification State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Generate personalized notifications based on user profile
  useEffect(() => {
    const userSectors = profile.sectors || ['markets'];
    const topSector = userSectors[0]?.charAt(0).toUpperCase() + userSectors[0]?.slice(1) || 'Market';
    const userStocks = profile.stocks || [];
    const stockAlert = userStocks.length > 0 
      ? `${userStocks[0]} ${t('notif.stock_moved', { defaultValue: 'moved significantly today!' })}` 
      : `${topSector} sector is trending today!`;
    
    setNotifications([
      { id: 1, text: stockAlert, time: t('feed.min_ago', { count: 2 }), read: false },
      { id: 2, text: t('notif.ai_summary', { defaultValue: 'New AI market summary generated' }), time: t('feed.min_ago', { count: 15 }), read: false },
      { id: 3, text: `${topSector} ${t('notif.strong_results', { defaultValue: 'reports strong quarterly results' })}`, time: '1h ago', read: true },
    ]);
  }, [profile.sectors, profile.stocks, t]);
  const unreadCount = notifications.filter(n => !n.read).length;

  const feedSectors = useMemo(() => {
    const userSectors = (profile.sectors || []).filter(s => s && s.trim() !== '');
    const defaults = [
      { id: 'banking', label: 'Banking' },
      { id: 'it', label: 'IT' },
      { id: 'pharma', label: 'Pharma' },
      { id: 'auto', label: 'Auto' },
      { id: 'energy', label: 'Energy' },
      { id: 'fmcg', label: 'FMCG' },
      { id: 'realestate', label: 'Real Estate' },
      { id: 'metals', label: 'Metals' },
      { id: 'infra', label: 'Infrastructure' },
    ];
    
    // Prioritize user selected sectors
    const userSectorPills = userSectors.map(s => ({
      id: s.toLowerCase(),
      label: s.charAt(0).toUpperCase() + s.slice(1)
    }));
    
    const combined = [...userSectorPills];
    defaults.forEach(d => {
      if (!combined.find(c => c.id === d.id)) {
        combined.push(d);
      }
    });
    
    return combined;
  }, [profile.sectors]);

  useEffect(() => {
    if (profile.sectors?.length > 0 && !activeHeroSector) {
      setActiveHeroSector(profile.sectors[0]);
    }
  }, [profile, activeHeroSector]);

  // 1. Fetch Interest Articles — 3 per sector from user's selected sectors
  useEffect(() => {
    const loadInterests = async () => {
      try {
        const userSectors = profile.sectors || [];
        if (userSectors.length > 0) {
          // Fetch 3 articles per user sector for a balanced "Your Interests" feed
          const arts = await fetchNewsByFilters(userSectors, [], displayLanguage, profile.user_type || 'investor');
          if (arts && arts.length > 0) {
            setInterestArticles(arts);
          } else throw new Error('Empty sector results');
        } else {
          // No sectors selected — fetch general trending
          const arts = await fetchTrendingNews(profile);
          if (arts && arts.length > 0) {
            setInterestArticles(arts.slice(0, 9));
          } else throw new Error('Empty trending results');
        }
      } catch (err) {
        console.error("Interest fetch failed", err);
        import('../data/mockData').then(({ mockArticles }) => {
          setInterestArticles(mockArticles.slice(0, 6));
        });
      }
    };
    loadInterests();
  }, [profile, displayLanguage]);

  // 2. Fetch Feed Articles based on selected Sector Pill
  useEffect(() => {
    const loadFeed = async () => {
      setLoading(true);
      try {
        const arts = await fetchNewsBySector(activeFeedSector, displayLanguage);
        if (arts && arts.length > 0) {
          setFeedArticles(arts);
          if (activeFeedSector === activeHeroSector) {
            setHeroHighlights(arts[0].title);
          }
        } else throw new Error("Empty API Response");
      } catch (err) {
        import('../data/mockData').then(({ mockArticles }) => {
          const filtered = mockArticles.filter(a => a.sector === activeFeedSector);
          const finalArts = filtered.length > 0 ? filtered : mockArticles.slice(0, 4);
          setFeedArticles(finalArts);
        });
      } finally {
        setLoading(false);
      }
    };
    loadFeed();
  }, [activeFeedSector, activeHeroSector, displayLanguage]);

  // Fetch specialized highlights for the Hero sector if different from feed
  useEffect(() => {
    if (activeHeroSector && activeHeroSector !== activeFeedSector) {
      fetchNewsBySector(activeHeroSector, displayLanguage).then(arts => {
        if (arts && arts.length > 0) setHeroHighlights(arts[0].title);
      }).catch(() => {
        import('../data/mockData').then(({ mockArticles }) => {
          const arts = mockArticles.filter(a => a.sector === activeHeroSector);
          if (arts.length > 0) setHeroHighlights(arts[0].title);
        });
      });
    }
  }, [activeHeroSector, activeFeedSector]);

  // Determine personalized content based on the selected Hero Sector chip
  const heroTopic = activeHeroSector || 'markets';
  const heroTopicDisplay = t(`sector.${heroTopic}`) || (heroTopic.charAt(0).toUpperCase() + heroTopic.slice(1));
  const heroTitle = `${heroTopicDisplay} — ${t('hero.briefing')}`;
  const heroDesc = t('hero.subtitle', { type: profile.user_type?.replace('_', ' ') || 'Reader', lang: fullLanguageName });

  // Map generic colors to hashtags
  const topicColors = ['#4B0082', '#E31E24', '#059669', '#D97706'];

  const getFirstName = (fullName) => {
    if (!fullName) return '';
    return fullName.split(' ')[0];
  };

  const getColorClassForChange = (changeStr) => {
    const val = parseFloat(changeStr);
    if (val >= 2) return 'heatmap-bg-dark-green';
    if (val >= 1) return 'heatmap-bg-mid-green';
    if (val > 0) return 'heatmap-bg-light-green';
    if (val === 0) return 'heatmap-bg-neutral';
    if (val > -0.5) return 'heatmap-bg-light-red';
    if (val > -1.5) return 'heatmap-bg-mid-red';
    return 'heatmap-bg-dark-red';
  };

  const getUrgencyColor = (level) => {
    switch(level) {
      case 'very_high': return '#EF4444';
      case 'high': return '#F59E0B';
      case 'medium': return '#4B5563';
      default: return '#9CA3AF';
    }
  };

  const getUrgencyWidth = (level) => {
    switch(level) {
      case 'very_high': return '95%';
      case 'high': return '75%';
      case 'medium': return '45%';
      default: return '20%';
    }
  };

  const getUrgencyLabel = (level) => {
    switch(level) {
      case 'very_high': return t('urgency.very_high', {defaultValue: 'Very High'});
      case 'high': return t('urgency.high', {defaultValue: 'High'});
      case 'medium': return t('urgency.medium', {defaultValue: 'Medium'});
      default: return t('urgency.low', {defaultValue: 'Low'});
    }
  };

  return (
    <div className="home-page">
      {/* Top Navigation Bar */}
      <header className="top-nav">
        <div className="top-nav-inner">
          <div className="top-nav-left">
            <div className="onboarding-brand clickable" onClick={() => navigate('/home')}>
              <div className="ob-logo-circle">ET</div>
              <span className="ob-logo-text">Pulse</span>
            </div>
            <nav className="nav-tabs">
              {[
                { id: 'Home', key: 'nav.home' },
                { id: 'Explore with AI', key: 'nav.explore' },
                { id: 'Markets', key: 'nav.markets' }
              ].map(tab => (
                <button
                  key={tab.id}
                  className={`nav-tab ${activeNav === tab.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveNav(tab.id);
                    if (tab.id === 'Explore with AI') navigate('/explore');
                  }}
                >
                  {t(tab.key)}
                </button>
              ))}
            </nav>
          </div>
          <div className="top-nav-right">
            <div className="language-toggle">
              {(profile.languages && profile.languages.length > 0 ? profile.languages : [profile.preferred_language || 'en']).map(lang => {
                const langLabels = {
                  'English': 'EN', 'en': 'EN',
                  'Hindi': 'हि', 'hi': 'हि',
                  'Tamil': 'த', 'ta': 'த',
                  'Telugu': 'తె', 'te': 'తె',
                  'Bengali': 'বাংলা', 'bn': 'বাংলা',
                  'Marathi': 'म', 'mr': 'म'
                };
                
                // Map both ways to compare properly
                const normalizedLang = lang === 'English' ? 'en' : lang;
                const normalizedActive = displayLanguage === 'English' ? 'en' : displayLanguage;

                return (
                  <button 
                    key={lang}
                    className={`lang-btn ${normalizedActive === normalizedLang ? 'active' : ''}`}
                    onClick={() => {
                      const newProfile = { ...profile, preferred_language: lang };
                      localStorage.setItem('etpulse_profile', JSON.stringify(newProfile));
                      setProfile(newProfile); // Trigger instant re-translate without reload
                    }}
                  >
                    {langLabels[lang] || lang.substring(0, 2).toUpperCase()}
                  </button>
                );
              })}
            </div>
            <div className="search-box">
              <Search size={16} />
              <span>{t('search.placeholder')}</span>
            </div>
            
            <div className="pulse-alert-wrapper">
              <button 
                className={`pulse-alert-btn ${unreadCount > 0 ? 'has-unread' : ''}`}
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="Alerts"
              >
                <Bell size={20} />
                {unreadCount > 0 && <span className="pulse-alert-badge">{unreadCount}</span>}
              </button>

              {showNotifications && (
                <div className="pulse-alerts-dropdown animate-fadeInDown">
                  <div className="pulse-alerts-header">
                    <h4>{t('notif.alerts')}</h4>
                    {unreadCount > 0 && (
                      <button 
                        className="mark-read-btn" 
                        onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                      >
                        {t('notif.mark_read')}
                      </button>
                    )}
                  </div>
                  <div className="pulse-alerts-list">
                    {notifications.length > 0 ? (
                      notifications.map(notif => (
                        <div key={notif.id} className={`pulse-alert-item ${!notif.read ? 'unread' : ''}`}>
                          <div className="alert-dot"></div>
                          <div className="alert-content">
                            <p>{notif.text}</p>
                            <span>{notif.time}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-alerts">{t('notif.empty')}</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button className="avatar-btn profile-right" onClick={() => navigate('/profile')}>
              {firstName.charAt(0)}
            </button>
          </div>
        </div>
      </header>

      {/* Market Ticker */}
      <div className="market-ticker sticky-ticker">
        <div className="ticker-scroll">
          {[...marketIndices, ...marketIndices].map((ticker, i) => (
            <div key={i} className="ticker-item clickable" onClick={() => navigate(`/briefing/${ticker.id}?mode=flash`)}>
              <div className="ticker-sparkline">
                <svg width="40" height="20" viewBox="0 0 40 20">
                  <polyline
                    fill="none"
                    stroke={ticker.status === 'up' ? '#10B981' : '#EF4444'}
                    strokeWidth="1.5"
                    points={ticker.sparkline.map((val, idx) => `${(idx * 40) / 9},${20 - val / 5}`).join(' ')}
                  />
                </svg>
              </div>
              <span className="ticker-name">{ticker.name}</span>
              <span className="ticker-value">{ticker.value}</span>
              <span className={`ticker-change ${ticker.status === 'up' ? 'positive' : 'negative'}`}>
                {ticker.percent}
              </span>
            </div>
          ))}
        </div>
      </div>

      <main className="home-main">
        {activeNav === 'Markets' ? (
          <div className="markets-dashboard-view animate-fadeIn">
            {/* AI Market Summary Top Section */}
            <section className="ai-market-summary-top" style={{ marginBottom: '24px' }}>
              <div className="ai-summary-card-v2" style={{ background: 'rgba(255, 255, 255, 0.7)', borderRadius: '24px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#B45309' }}>
                    <Zap size={20} fill="currentColor" />
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: '#1a1a2e' }}>{t('markets.ai_summary')}</h3>
                  </div>
                  <div style={{ background: '#ECFDF5', color: '#059669', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <span style={{ width: '6px', height: '6px', background: '#10B981', borderRadius: '50%' }}></span> {t('markets.bullish', {defaultValue: 'Bullish'})}
                  </div>
                </div>
                <p style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#1A1A2E', fontWeight: '700', lineHeight: '1.4' }}>
                  {t('markets.bullish_summary', {defaultValue: 'Markets are bullish today driven by IT rally and strong FII inflows.'})}
                </p>
                <p style={{ margin: '0 0 16px 0', fontSize: '0.9rem', color: '#4B5563', fontWeight: '600' }}>
                   <strong style={{ color: '#1A1A2E' }}>Key driver:</strong> IT sector +2.47% led by Infosys deal
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <span style={{ background: 'rgba(79, 70, 229, 0.1)', color: '#4F46E5', padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '800' }}>
                    {t('markets.momentum', {defaultValue: 'High Momentum'})}
                  </span>
                </div>
              </div>
            </section>

            {/* Market Overview Hero Stack (Larger) */}
            <section className="market-overview-section" style={{ marginBottom: '40px' }}>
              <div className="stacked-cards-container market-hero-stack-v2" onClick={() => {
                setActiveHeroSector(prev => {
                  const indices = ['sensex', 'nifty', 'banknifty', 'fmcg_card', 'pharma_card'];
                  const currentIndex = indices.indexOf(prev || 'sensex');
                  const nextIndex = (currentIndex + 1) % indices.length;
                  return indices[nextIndex];
                });
              }} style={{ height: '320px' }}>
                {['sensex', 'nifty', 'banknifty', 'fmcg_card', 'pharma_card'].map((indexId, idx) => {
                  const indicesList = ['sensex', 'nifty', 'banknifty', 'fmcg_card', 'pharma_card'];
                  const activeIdx = indicesList.indexOf(activeHeroSector) === -1 ? 0 : indicesList.indexOf(activeHeroSector);
                  const offset = (idx - activeIdx + indicesList.length) % indicesList.length;
                  
                  let cardClass = 'stacked-card hidden';
                  if (offset === 0) cardClass = 'stacked-card active';
                  else if (offset === 1) cardClass = 'stacked-card next-1';
                  else if (offset === 2) cardClass = 'stacked-card next-2';
                  else if (offset === 3) cardClass = 'stacked-card next-3';
                  else if (offset === 4) cardClass = 'stacked-card next-4';

                  const getIndexData = (id) => {
                    switch(id) {
                      case 'sensex': return { name: 'SENSEX', val: '73,428', change: '+1.24%', grad: 'linear-gradient(135deg, #1A1A2E 0%, #3B3061 100%)', label: 'SENSEX' };
                      case 'nifty': return { name: 'NIFTY 50', val: '22,227', change: '+1.12%', grad: 'linear-gradient(135deg, #1A1A2E 0%, #2563EB 100%)', label: 'NIFTY 50' };
                      case 'banknifty': return { name: 'BANK NIFTY', val: '47,832', change: '+1.85%', grad: 'linear-gradient(135deg, #1A1A2E 0%, #E31E24 100%)', label: t('sector.banking') };
                      case 'pharma_card': return { name: 'PHARMA', val: '18,432', change: '-0.34%', grad: 'linear-gradient(135deg, #1A1A2E 0%, #059669 100%)', label: t('sector.pharma') };
                      case 'fmcg_card': return { name: 'FMCG', val: '54,210', change: '+0.85%', grad: 'linear-gradient(135deg, #1A1A2E 0%, #D97706 100%)', label: t('sector.fmcg') };
                      default: return { name: 'SENSEX', val: '73,428', change: '+1.24%', grad: 'linear-gradient(135deg, #1A1A2E 0%, #3B3061 100%)', label: 'SENSEX' };
                    }
                  };
                  const data = getIndexData(indexId);

                  return (
                    <div key={indexId} className={cardClass} style={{ background: data.grad, height: '320px', overflow: 'hidden' }}>
                      <div className="hero-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '32px' }}>
                        <div className="hero-badge" style={{ marginBottom: '16px', alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(5px)' }}>
                          <Zap size={14} fill="currentColor" /> {t('markets.overview_badge', {defaultValue: 'MARKET OVERVIEW'})}
                        </div>
                        
                        {offset === 0 && (
                          <>
                            <div className="market-hero-main-stat" style={{ marginBottom: '24px' }}>
                               <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
                                 <h1 style={{ fontSize: '3.5rem', fontWeight: '900', lineHeight: 1, margin: 0, letterSpacing: '-2px' }}>{data.name}</h1>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontSize: '1.4rem', fontWeight: '800' }}>
                                    <ArrowUpRight size={24} /> {data.val} <span style={{ opacity: 0.9, fontSize: '1.1rem' }}>{data.change}</span>
                                  </div>
                               </div>
                            </div>
                            
                            <div className="market-hero-secondary-stats-v2" style={{ display: 'flex', gap: '32px', opacity: 0.8, fontSize: '1rem', fontWeight: '700' }}>
                               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                 <span style={{ color: 'rgba(255,255,255,0.5)' }}>NIFTY 50</span>
                                 <TrendingUp size={14} style={{ color: '#10B981' }} /> 22,227
                               </div>
                               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                 <span style={{ color: 'rgba(255,255,255,0.5)' }}>BANK</span>
                                 <TrendingUp size={14} style={{ color: '#10B981' }} /> 47,832
                               </div>
                            </div>

                            <button 
                              className="hero-cta" 
                              onClick={(e) => { e.stopPropagation(); navigate(`/briefing/${indexId}?mode=deep`); }}
                              style={{ 
                                marginTop: 'auto', alignSelf: 'flex-start', background: 'rgba(255,255,255,0.1)', color: 'white', 
                                border: '1px solid rgba(255,255,255,0.2)', padding: '12px 24px', borderRadius: '30px', 
                                fontSize: '1rem', fontWeight: '700', backdropFilter: 'blur(10px)',
                                display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.3s'
                              }}
                            >
                              {t('markets.see_driving')} <ArrowRight size={18} />
                            </button>
                            
                            {/* Visual background overlay */}
                            <div className="hero-visual" style={{ right: '0', bottom: '-10%', opacity: 0.3, pointerEvents: 'none', width: '60%' }}>
                               <svg viewBox="0 0 100 50" style={{ fill: 'none', stroke: 'white', strokeWidth: 1.5 }}>
                                  <path d="M0 40 Q 15 35, 30 38 T 60 15 T 85 20 T 100 5" />
                                  <circle cx="100" cy="5" r="2" fill="white" />
                               </svg>
                            </div>
                          </>
                        )}

                        {offset !== 0 && (
                          <div style={{ position: 'absolute', bottom: '24px', right: '32px', fontSize: '1.2rem', fontWeight: '800', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px' }}>
                            {data.label}
                          </div>
                        )}
                      </div>
                      <div className="card-glossy-overlay"></div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* TWO COLUMN GRID FOR DASHBOARD */}
            <div className="markets-two-col-grid" style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
              {/* TOP SECTION: Market Intelligence */}
              <div className="markets-col-left" style={{ width: '100%' }}>
                <section className="sector-heatmap-section" style={{ background: 'white', borderRadius: '24px', padding: '32px', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                  <div className="section-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <TrendingUp size={22} style={{ color: '#059669' }} />
                        <h2 className="section-title" style={{ margin: 0, fontSize: '1.4rem' }}>{t('markets.intelligence')}</h2>
                      </div>
                      <div className="period-toggles" style={{ display: 'flex', background: '#1a1a2e', padding: '4px', borderRadius: '12px', gap: '4px' }}>
                        {['1D', '1W', '1M'].map(p => (
                          <button 
                            key={p}
                            onClick={() => setHeatmapPeriod(p)}
                            style={{ 
                              padding: '6px 16px', borderRadius: '8px', border: 'none', fontSize: '0.85rem', fontWeight: '800', cursor: 'pointer',
                              background: heatmapPeriod === p ? 'white' : 'transparent',
                              boxShadow: heatmapPeriod === p ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                              color: heatmapPeriod === p ? '#1A1A2E' : '#9CA3AF',
                              transition: 'all 0.2s'
                            }}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                  </div>

                  <div className="market-intelligence-inner">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                       <Share2 size={18} style={{ color: '#1A1A2E' }} />
                       <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>{t('markets.sector_heatmap', {defaultValue: 'Sector Heatmap'})}</h3>
                       <button 
                         onClick={() => navigate('/briefing/sectors?mode=heatmap')}
                         style={{ marginLeft: 'auto', border: 'none', background: '#F9FAFB', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}
                        >
                          {t('markets.view_heatmap_cta', {defaultValue: 'View heatmap →'})}
                       </button>
                    </div>

                    <div className="heatmap-grid-treemap">
                      {sectorPerformance.map((sector) => {
                        const periodData = sector[`data${heatmapPeriod}`] || { change: '0%', status: 'flat', strength: 0 };
                        return (
                          <div 
                            key={sector.id}
                            className={`heatmap-block ${sector.weight === 2 ? 'span-2' : ''} ${getColorClassForChange(periodData.change)}`}
                            onClick={() => setActiveSectorDetail(activeSectorDetail === sector.id ? null : sector.id)}
                          >
                            <div className="sector-name">{sector.name}</div>
                            <div className="change-val">{periodData.change}</div>
                            <div className="top-mover">
                              {periodData.status === 'down' ? `${t('markets.worst')}: ` : `${t('markets.top')}: `}
                              {sector.topMover}
                            </div>
                            <div className="strength-bar-bg">
                              <div className="strength-bar-fill" style={{ width: `${periodData.strength}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Legend Scale */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '20px', fontSize: '0.75rem', fontWeight: '700', color: '#9CA3AF' }}>
                      <span>{t('market.strong_sell', {defaultValue: 'Strong sell'})}</span>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#991B1B' }}></div>
                        <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#DC2626' }}></div>
                        <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#F87171' }}></div>
                        <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#E5393580' }}></div>
                        <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#10B981' }}></div>
                        <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#059669' }}></div>
                        <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#065F46' }}></div>
                      </div>
                      <span>{t('markets.strong_buy')}</span>
                    </div>

                    {/* Stock Details Panel (Slides open below heatmap) */}
                    {activeSectorDetail && (() => {
                      const activeSector = sectorPerformance.find(s => s.id === activeSectorDetail);
                      if (!activeSector) return null;
                      
                      return (
                        <div className="sector-stock-panel">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                             <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>
                               {activeSector.name} {t('markets.stocks_suffix')}
                             </h4>
                             <button 
                               onClick={(e) => { e.stopPropagation(); setActiveSectorDetail(null); }}
                               style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                             >
                               <X size={18} />
                             </button>
                          </div>
                          
                          <div className="stock-grid-2col">
                            {activeSector.stocks?.map(stock => (
                              <div key={stock.symbol} className="stock-card-mini">
                                <div className="stock-info-main">
                                  <span className="ticker">{stock.symbol}</span>
                                  <span className="name">{stock.name}</span>
                                </div>
                                
                                <div style={{ height: '30px', width: '60px' }}>
                                  <svg width="100%" height="100%" viewBox="0 0 100 40">
                                    <polyline
                                      fill="none"
                                      stroke={parseFloat(stock.change) >= 0 ? '#10B981' : '#EF4444'}
                                      strokeWidth="3"
                                      points={stock.sparkline?.map((p, x) => `${(x / (stock.sparkline.length - 1)) * 100},${40 - p}`).join(' ') || ""}
                                    />
                                  </svg>
                                </div>

                                <div className="stock-price-info">
                                  <span className="price">₹{stock.price}</span>
                                  <span className="change" style={{ color: parseFloat(stock.change) >= 0 ? '#10B981' : '#EF4444' }}>
                                    {stock.change}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </section>
              </div>

              {/* BOTTOM SECTION: Trending Stories */}
              <div className="markets-col-bottom" style={{ width: '100%' }}>
                <section className="trending-assets-section" style={{ background: 'white', borderRadius: '24px', padding: '32px', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                  <div className="section-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Newspaper size={22} style={{ color: '#E31E24' }} />
                      <h2 className="section-title" style={{ margin: 0, fontSize: '1.4rem' }}>{t('markets.trending')}</h2>
                    </div>
                    <button className="view-all" style={{ color: '#4B5563', fontSize: '0.95rem', fontWeight: '600', border: 'none', background: 'none', cursor: 'pointer' }}>
                      {t('topics.view_all')} <ArrowRight size={16} />
                    </button>
                  </div>
                  
                  <div className="trending-stories-grid-v2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    {mockArticles.slice(0, 3).sort((a, b) => (b.pulseScore || 0) - (a.pulseScore || 0)).map((article) => (
                      <div 
                        key={article.id} 
                        className="trending-story-card-v3" 
                        onClick={() => navigate(`/briefing/${article.id}?mode=impact`)}
                        style={{ background: '#F9FAFB', borderRadius: '18px', padding: '24px', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <span style={{ background: '#FEE2E2', color: '#DC2626', padding: '4px 10px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: '800' }}>{t('feed.breaking_label')}</span>
                            <span style={{ background: '#FEF3C7', color: '#B45309', padding: '4px 10px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: '800' }}>{t(`sector.${article.sector}`, {defaultValue: article.sector?.toUpperCase()})}</span>
                          </div>
                          <div className="pulse-badge">
                            <div className="pulse-dot"></div> {article.pulseScore || 0}
                          </div>
                        </div>

                        <div className="urgency-container">
                          <div className="urgency-labels">
                            <span>{t('feed.market_urgency')}</span>
                            <span className="urgency-level-label" style={{ color: getUrgencyColor(article.urgencyLevel) }}>{getUrgencyLabel(article.urgencyLevel)}</span>
                          </div>
                          <div className="urgency-bar-bg">
                            <div className="urgency-bar-fill" style={{ width: getUrgencyWidth(article.urgencyLevel), background: getUrgencyColor(article.urgencyLevel) }}></div>
                          </div>
                        </div>

                        <h4 style={{ fontSize: '1.25rem', fontWeight: '800', lineHeight: 1.3, marginBottom: '12px', color: '#1A1A2E' }}>{article.title}</h4>
                        
                        <div className="why-it-matters-box">
                          <span className="why-it-matters-title">{t('feed.why_it_matters')}</span>
                          <p className="why-it-matters-text">{article.whyItMatters}</p>
                        </div>

                        <div className="time-read-row">
                          <div className="tags-row">
                            {article.tags?.map(tag => (
                              <button key={tag} className="tag-btn">{tag}</button>
                            ))}
                          </div>
                          <div className="read-time">
                            <Clock size={14} /> {t('feed.read_time', { count: article.readTime || 5 })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            {/* Floating 'Today in 30s' Button (Bottom Right) */}
            <button 
              className="floating-today-btn" 
              onClick={() => navigate('/briefing/overall?mode=flash')}
              style={{
                position: 'fixed', bottom: '32px', right: '32px',
                background: '#E53935',
                color: 'white', border: 'none', padding: '14px 28px', borderRadius: '30px',
                fontSize: '1.1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px',
                boxShadow: '0 10px 30px rgba(229, 57, 53, 0.4)', zIndex: 1001, cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
            >
              <Zap size={22} fill="currentColor" /> {t('markets.today_30s')} <ArrowRight size={20} />
            </button>

            {/* Floating Breaking Bar */}
            <div className="floating-breaking-bar-v2" style={{ position: 'fixed', bottom: '32px', left: '32px', background: 'rgba(26, 26, 46, 0.95)', borderRadius: '100px', padding: '6px 6px 6px 16px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 12px 32px rgba(0,0,0,0.3)', zIndex: 1000, width: 'max-content', maxWidth: '60%', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '6px', borderRadius: '50%', display: 'flex' }}>
                 <Bell size={18} />
              </div>
              <span style={{ background: '#E31E24', color: 'white', padding: '4px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.5px' }}>{t('feed.breaking_label')}</span>
              <span style={{ color: 'white', fontSize: '0.95rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t('hero.rbi_headline')}</span>
              <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
                 <button 
                   onClick={() => navigate('/home')}
                   style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                 >
                   {t('markets.impact')} <ChevronRight size={16} />
                 </button>
              </div>
            </div>

          </div>
        ) : (
          <>
            {/* Personalized Greeting */}
            <div className="personalized-greeting" style={{ padding: '0 20px 20px', maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>
            {profile.onboarding_skipped ? t('greeting', { name: firstName }) + '!' : t('greeting', { name: firstName })}
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            {profile.onboarding_skipped 
              ? "You're viewing a generic briefing. Complete your profile for market intelligence tailored to your portfolio."
              : t('greeting.sub', { type: profile.user_type?.replace('_', ' ') || 'Reader' })}
          </p>
        </div>

        {/* Complete Profile CTA for skipped users */}
        {profile.onboarding_skipped && (
          <div className="complete-profile-cta-banner">
            <div className="cta-banner-content">
              <div className="cta-icon-wrapper">
                <Sparkles size={24} className="cta-sparkle" />
              </div>
              <div className="cta-text-wrapper">
                <h3>{t('hero.unlock_title')}</h3>
                <p>{t('hero.unlock_sub')}</p>
              </div>
              <button className="cta-finish-btn" onClick={() => navigate('/onboarding')}>
                {t('hero.complete_profile')} <ArrowRight size={18} />
              </button>
              <button className="cta-close-btn" onClick={() => {
                const newProfile = { ...profile, onboarding_skipped: false, onboarding_dismissed_cta: true };
                localStorage.setItem('etpulse_profile', JSON.stringify(newProfile));
                setProfile(newProfile);
              }}>
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        {/* HERO SECTION / SLIDING CARDS */}
        <section className="hero-briefing">
          <div className="stacked-cards-container" onClick={() => setActiveHeroSector(prev => {
            const sectors = profile.sectors && profile.sectors.length > 0 ? profile.sectors : ['it', 'auto', 'banking', 'pharma', 'energy'];
            const currentIndex = sectors.indexOf(prev);
            const nextIndex = (currentIndex + 1) % sectors.length;
            return sectors[nextIndex];
          })}>
            {(profile.sectors && profile.sectors.length > 0 ? profile.sectors : ['it', 'auto', 'banking', 'pharma', 'energy']).map((sector, index) => {
              const sectors = profile.sectors && profile.sectors.length > 0 ? profile.sectors : ['it', 'auto', 'banking', 'pharma', 'energy'];
              const currentIndex = sectors.indexOf(activeHeroSector) === -1 ? 0 : sectors.indexOf(activeHeroSector);
              const offset = (index - currentIndex + sectors.length) % sectors.length;
              
              let cardClass = 'stacked-card hidden';
              if (offset === 0) cardClass = 'stacked-card active';
              else if (offset === 1) cardClass = 'stacked-card next-1';
              else if (offset === 2) cardClass = 'stacked-card next-2';
              else if (offset === 3) cardClass = 'stacked-card next-3';
              else if (offset === 4) cardClass = 'stacked-card next-4';
              else if (offset === 5) cardClass = 'stacked-card next-5';

              const rawSectorName = t(`sector.${sector}`) || sector.charAt(0).toUpperCase() + sector.slice(1);
              const sectorDisplay = sector.toLowerCase() === 'it' ? 'IT' : rawSectorName;
              const cardTitle = offset === 0 ? heroTitle : `${sectorDisplay} — Briefing`;

              // Dynamic Gradient based on sector so color stays with the topic
              const getSectorGradient = (sec) => {
                switch(sec.toLowerCase()) {
                  case 'it': return 'linear-gradient(135deg, #1A1A2E 0%, #059669 100%)';
                  case 'auto': return 'linear-gradient(135deg, #1A1A2E 0%, #E31E24 100%)';
                  case 'banking': return 'linear-gradient(135deg, #1A1A2E 0%, #2563EB 100%)';
                  case 'pharma': return 'linear-gradient(135deg, #1A1A2E 0%, #D97706 100%)';
                  case 'energy': return 'linear-gradient(135deg, #1A1A2E 0%, #4B0082 100%)';
                  default: return 'linear-gradient(135deg, #1A1A2E 0%, #4B0082 100%)';
                }
              };

              return (
                <div key={sector} className={cardClass} style={{ background: getSectorGradient(sector) }}>
                  <div className="hero-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div className="hero-badge" style={{ marginBottom: 0, backgroundColor: 'rgba(255,255,255,0.2)' }}>
                        <Sparkles size={14} fill="currentColor" /> {offset === 0 ? `TOP STORIES • ${sectorDisplay}` : sectorDisplay}
                      </div>
                      
                      {offset === 0 && (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {sectors.map((_, i) => (
                            <div key={i} style={{ 
                              width: '6px', height: '6px', borderRadius: '50%', 
                              background: i === currentIndex ? '#fff' : 'rgba(255,255,255,0.3)',
                              transition: 'background 0.3s'
                            }}></div>
                          ))}
                        </div>
                      )}
                    </div>

                    <h1 className="hero-title" style={{ 
                      fontSize: offset === 0 ? '2.4rem' : '1.5rem', 
                      marginTop: offset === 0 ? '10px' : '20px',
                      marginBottom: '10px',
                      lineHeight: '1.2'
                    }}>
                      {offset === 0 && heroHighlights ? heroHighlights : cardTitle}
                    </h1>
                    
                    {offset === 0 && heroHighlights && (
                      <p className="hero-subtitle" style={{ fontSize: '1.1rem', opacity: 0.9, marginTop: '8px' }}>
                         {t('hero.read_insights', { defaultValue: `Read the detailed insights and market impact analysis for ${sectorDisplay}.` })}
                      </p>
                    )}

                        <button 
                          className="hero-cta" 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/briefing/${heroTopic}?mode=flash`);
                          }}
                          style={{ 
                            marginTop: 'auto', 
                            alignSelf: 'flex-start', 
                            background: 'white', 
                            color: '#1A1A2E', 
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '24px',
                            fontSize: '1rem',
                            fontWeight: '700',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          {t('hero.cta')} <ArrowRight size={18} />
                        </button>
                  </div>
                  {offset === 0 && (
                    <div className="hero-visual">
                      <Sparkles size={120} className="sparkle-bg" />
                    </div>
                  )}
                  {offset !== 0 && (
                    <div style={{ 
                      position: 'absolute', 
                      bottom: '24px', 
                      right: '32px', 
                      fontSize: '1.2rem', 
                      fontWeight: '800', 
                      opacity: 0.9,
                      writingMode: 'vertical-rl',
                      transform: 'rotate(180deg)'
                    }}>
                      {sectorDisplay}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* PERSONA SPECIFIC SECTION */}
        {profile.user_type === 'investor' && (profile.stocks?.length > 0 || profile.has_mf) && (
          <section className="persona-section investor-portfolio animate-fadeIn">
            <div className="section-header-row">
              <h2 className="section-title"><TrendingUp size={20} className="section-icon" /> {t('persona.portfolio_pulse', {defaultValue: 'Portfolio Pulse'})}</h2>
              <button className="view-all" onClick={() => navigate('/portfolio')}>{t('topics.view_all')}</button>
            </div>
            <div className="portfolio-mini-grid hide-scrollbar">
              {(profile.stocks || []).slice(0, 4).map(stock => (
                <div key={stock} className="portfolio-mini-card" onClick={() => navigate(`/explore?q=${encodeURIComponent(`Latest news on ${stock}`)}`)}>
                  <div className="pmc-header">
                    <span className="stock-symbol">{stock}</span>
                    <span className="stock-change pos">+1.4%</span>
                  </div>
                  <div className="pmc-footer">
                    <span className="stock-label">{t('portfolio.hold', {defaultValue: 'Personalized Hold'})}</span>
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              ))}
              {profile.has_mf && (
                <div className="portfolio-mini-card mf-card" onClick={() => navigate('/explore?q=Mutual fund market update')}>
                  <div className="pmc-header">
                    <span className="stock-symbol">{t('portfolio.mf', {defaultValue: 'Mutual Funds'})}</span>
                    <span className="stock-change pos">▲</span>
                  </div>
                  <div className="pmc-footer">
                    <span className="stock-label">{t('portfolio.mf_type', {type: (profile.mf_categories || ['Equity'])[0], defaultValue: `${(profile.mf_categories || ['Equity'])[0]} Funds`})}</span>
                    <Target size={14} />
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {profile.user_type === 'student' && (
          <section className="persona-section student-stream animate-fadeIn">
            <div className="section-header-row">
              <h2 className="section-title"><BookOpen size={20} className="section-icon" /> {t('persona.study_stream', {defaultValue: 'Study Stream'})}</h2>
              <span className="persona-tag">{t('persona.focus', {stream: profile.study_stream?.toUpperCase(), defaultValue: `${profile.study_stream?.toUpperCase()} focus`})}</span>
            </div>
            <div className="study-explainers-list">
              <div className="explainer-item-v2" onClick={() => navigate('/explore?q=Explain today\'s market for a finance student')}>
                <div className="explainer-content">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                    <div className="explainer-icon-v2"><Zap size={16} fill="currentColor" /></div>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: '#1A1A2E' }}>
                      {t('persona.explainer_title', {defaultValue: 'Daily Concept Explainer'})}
                    </h4>
                  </div>
                  <p style={{ margin: '4px 0 0 28px', fontSize: '0.9rem', color: '#B45309', fontWeight: '700' }}>
                    Today: What is a repo rate?
                  </p>
                </div>
                <div className="explainer-streak">
                   <span style={{ fontSize: '1.1rem' }}>🔥</span>
                   <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#F59E0B' }}>5 day streak</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {profile.user_type === 'founder' && (
          <section className="persona-section founder-hub animate-fadeIn">
            <div className="section-header-row">
              <h2 className="section-title"><Target size={20} className="section-icon" /> {t('persona.startup_hub', {defaultValue: 'Startup Hub'})}</h2>
              <span className="persona-tag">{profile.startup_stage?.toUpperCase()}</span>
            </div>
            <div className="startup-priority-row">
              {['funding', 'regulation', 'competition'].map(p => (
                <button 
                  key={p} 
                  className={`priority-chip ${profile.news_priority === p ? 'active' : ''}`}
                  onClick={() => navigate(`/explore?q=Startup ${p} news`)}
                >
                  {t(`startup.priority.${p}`, {defaultValue: p.charAt(0).toUpperCase() + p.slice(1)})}
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="trending-topics-section">
          <div className="section-header-row">
            <h2 className="section-title">{t('topics.title')}</h2>
            <button className="view-all">{t('topics.view_all')}</button>
          </div>
          <div className="horizontal-scroll hide-scrollbar">
            {interestArticles.map((article, i) => (
              <div 
                key={`interest-${i}`} 
                className="interest-card" 
                onClick={() => navigate(`/article/${encodeURIComponent(article.title)}`)}
              >
                <div className="interest-card-img">
                  <img 
                    src={article.image || article.thumbnail || 'invalid'} 
                    alt={article.title}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if(e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="img-fallback" style={{ display: 'none', width: '100%', height: '100%', backgroundColor: getSectorFallbackColor(article.sector), alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)' }}>
                    <Newspaper size={40} />
                  </div>
                </div>
                <div className="interest-card-content">
                  <div className="interest-tags">
                    <span className="tag">#{article.sector?.toUpperCase() || profile.sectors?.[0]?.toUpperCase() || 'MARKET'}</span>
                    <span className="tag hotter">#TRENDING</span>
                  </div>
                  <h3 className="interest-title">{article.title}</h3>
                  
                  <div className="interest-actions">
                    <button
                      className="understand-30s-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/briefing/${encodeURIComponent(article.title)}?mode=flash`);
                      }}
                    >
                      <Zap size={14} fill="currentColor" /> {t('hero.cta')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* LATEST NEWS (VERTICAL) */}
        <section className="latest-updates-section">
          {/* Feed Header */}
          <h2 className="section-title">{t('feed.title')}</h2>
          
          {/* Feed Sectors Horizontal Nav */}
          <div className="feed-sector-pills hide-scrollbar">
            {feedSectors.map(sector => (
              <button
                key={sector.id}
                className={`feed-pill ${activeFeedSector === sector.id ? 'active' : ''}`}
                onClick={() => setActiveFeedSector(sector.id)}
              >
                {t(`sector.${sector.id}`, {defaultValue: sector.label})}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>{t('feed.loading')}</div>
          ) : (
            <div className="latest-feed">
              {feedArticles.filter(a => a.sector === activeFeedSector).map((article, index) => {
                if (index === 0) {
                  // Top Story Hero Card (clean layout)
                  return (
                    <div key={index} className="top-story-hero-card" onClick={() => navigate(`/article/${encodeURIComponent(article.title)}`)}>
                      <div className="hero-card-img-wrapper" style={{ position: 'relative' }}>
                        <img 
                          src={article.thumbnail || article.image || 'invalid'} 
                          alt={article.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            if(e.target.nextElementSibling && e.target.nextElementSibling.className === 'img-fallback') e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                        <div className="img-fallback" style={{ display: 'none', width: '100%', height: '100%', backgroundColor: getSectorFallbackColor(article.sector), alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', position: 'absolute', top: 0, left: 0 }}>
                          <Newspaper size={48} />
                        </div>
                        <span className="hero-badge-breaking" style={{ zIndex: 2 }}>{t('feed.breaking_label', {defaultValue: 'BREAKING'})} - {t(`sector.${article.sector}`, {defaultValue: article.sector?.toUpperCase() || 'MARKET'})}</span>
                      </div>
                      <div className="hero-card-footer">
                        <div className="hero-card-meta">
                          <span className="hero-card-source">{article.source || t('feed.source_default', {defaultValue: 'Economic Times'})}</span>
                          <span className="dot">•</span>
                          <span className="hero-card-time">{article.timestamp || t('feed.just_now')}</span>
                        </div>
                        <h3 className="hero-card-title">{article.title}</h3>
                        <p className="hero-card-excerpt">{article.content ? article.content.substring(0, 150) : ''}...</p>
                        <button
                          className="understand-30s-btn hero-30s"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/briefing/${encodeURIComponent(article.title)}?mode=flash`);
                          }}
                        >
                          <Zap size={14} fill="currentColor" /> {t('hero.cta')}
                        </button>
                      </div>
                    </div>
                  );
                } else {
                  // Feed List Item
                  return (
                    <div key={index} className="feed-list-item" onClick={() => navigate(`/article/${encodeURIComponent(article.title)}`)}>
                      <div className="feed-item-img">
                        <img 
                          src={article.thumbnail || article.image || 'invalid'} 
                          alt={article.title}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            if(e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                        <div className="img-fallback" style={{ display: 'none', width: '100%', height: '100%', backgroundColor: getSectorFallbackColor(article.sector), alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)' }}>
                          <Newspaper size={32} />
                        </div>
                      </div>
                      <div className="feed-item-content">
                        <div className="feed-item-meta">
                          {index === 1 && <span className="breaking-label">{t('feed.breaking_label', {defaultValue: 'BREAKING'})}</span>}
                          <span className="feed-item-source">{article.source || t('feed.source_default', {defaultValue: 'Economic Times'})}</span>
                          <span className="feed-item-time">{article.timestamp || t('feed.min_ago', {count: index * 15})}</span>
                        </div>
                        <h3 className="feed-item-title">{article.title}</h3>
                        <p className="feed-item-excerpt">{article.content ? article.content.substring(0, 100) : ''}...</p>
                        <button
                          className="understand-30s-btn feed-30s"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/briefing/${encodeURIComponent(article.title)}?mode=flash`);
                          }}
                        >
                          <Zap size={14} fill="currentColor" /> {t('hero.cta')}
                        </button>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          )}
          </section>
        </>
      )}
    </main>
    

    {/* Splash Transition Override */}
    {showSplash && <SplashTransition onComplete={() => setShowSplash(false)} />}
    </div>
  );
}

export default HomePage;
