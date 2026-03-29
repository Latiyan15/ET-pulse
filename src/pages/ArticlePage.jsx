import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Share2, Bookmark, Sparkles, 
  Zap, Globe, ChevronRight, MessageSquare, ArrowRight
} from 'lucide-react';
import { mockArticles } from '../data/mockData';
import { useLanguage } from '../utils/i18n';
import './ArticlePage.css';

const ArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const [profile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('etpulse_profile')) || { language: 'English' };
    } catch {
      return { language: 'English' };
    }
  });

  const { t } = useLanguage(profile);
  const userType = profile.user_type || 'reader';

  // Generate personalized follow-up questions based on user type
  const personalizedQuestions = useMemo(() => {
    const articleTitle = article?.title || '';
    
    if (userType === 'investor') {
      const stocks = profile.stocks || [];
      const invType = profile.investor_type;
      const qs = [];
      if (stocks.length > 0) {
        qs.push(`How does this affect ${stocks[0]} specifically?`);
        qs.push(`Is this a lead indicator for ${stocks.slice(0, 2).join(' or ')}?`);
      } else {
        qs.push(t('article.q_market_impact', { defaultValue: 'How does this impact my portfolio?' }));
      }
      if (invType === 'trader') qs.push('What are the key support/resistance levels to watch now?');
      else qs.push(t('article.q_buy_sell', { defaultValue: 'Should I buy, hold, or sell based on this?' }));
      return qs.slice(0, 3);
    }
    
    if (userType === 'student') {
      const stream = profile.study_stream;
      if (stream === 'ca') return ["Explain the tax/audit implications for my studies", "How does this relate to recent ICAI updates?", "Explain the technical accounting impact"];
      if (stream === 'mba') return ["What are the strategic management lessons here?", "How does this affect sector valuations?", "Explain the M&A perspective of this news"];
      if (stream === 'economics') return ["What is the macroeconomic impact on India's GDP?", "Explain the fiscal policy relationship here", "How does this affect the inflation outlook?"];
      return [
        t('article.q_simple', { defaultValue: 'Explain this in simple terms for my exams' }),
        t('article.q_concept', { defaultValue: 'What economic concept does this relate to?' }),
      ];
    }
    
    if (userType === 'founder') {
      const stage = profile.startup_stage;
      const sector = (profile.startup_sector || [])[0];
      const qs = [];
      if (sector) qs.push(`How does this change the outlook for ${sector} startups?`);
      if (stage === 'idea' || stage === 'early') qs.push("What early-stage grants or pivots does this suggest?");
      else qs.push("How does this affect Series B+ valuations in India?");
      qs.push(t('article.q_opportunity', { defaultValue: 'Any business opportunities from this news?' }));
      return qs.slice(0, 3);
    }
    
    if (userType === 'business_owner') {
      const challenges = profile.business_challenges || [];
      const qs = [];
      if (challenges.includes('GST & Taxation')) qs.push("What are the specific tax implications for my business?");
      if (challenges.includes('Input costs & inflation')) qs.push("Will this increase my raw material or operational costs?");
      qs.push(t('article.q_cost', { defaultValue: 'How will this affect my business costs?' }));
      return qs.slice(0, 3);
    }

    const questions = {
      professional: [
        t('article.q_institutional', { defaultValue: 'What are the institutional implications?' }),
        t('article.q_regulatory', { defaultValue: 'Are there regulatory changes to watch?' }),
      ],
      reader: [
        t('article.q_daily_life', { defaultValue: 'How does this affect my daily life?' }),
        t('article.q_explain', { defaultValue: 'Can you explain this more simply?' }),
      ],
    };
    return questions[userType] || questions.reader;
  }, [userType, article, profile, t]);

  useEffect(() => {
    const loadArticle = async () => {
      const decodedId = decodeURIComponent(id);
      
      // 1. Try mock data first
      const found = mockArticles.find(a => 
        a.id?.toString() === id || 
        a.title === decodedId ||
        a.title?.toLowerCase().includes(decodedId.toLowerCase())
      );
      
      if (found) {
        setArticle(found);
        return;
      }

      // 2. Fetch from API for real-time GNews articles (use relative URL)
      try {
        const lang = profile.preferred_language || 'English';
        const sectors = (profile.sectors || []).join(',');
        const response = await fetch(`/api/news/personalized?extraTopic=${encodeURIComponent(decodedId)}&user_type=${userType}&language=${lang}&sectors=${sectors}`);
        const arts = await response.json();
        if (arts && arts.length > 0) {
          setArticle(arts[0]);
        } else {
          // Fallback if search fails
          setArticle(mockArticles[0]);
        }
      } catch (err) {
        console.error("Failed to fetch article details", err);
        setArticle(mockArticles[0]);
      }
    };
    loadArticle();
  }, [id, userType, profile.preferred_language, profile.sectors]);

  if (!article) return <div className="loading-state">🚀 Pulse AI is reconstructing this story...</div>;

  return (
    <div className="article-container">
      {/* Top Header */}
      <header className="article-header">
        <button className="icon-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <div className="article-header-actions">
          <button className="icon-btn" onClick={() => setIsBookmarked(!isBookmarked)}>
            <Bookmark size={20} fill={isBookmarked ? "#E53935" : "none"} color={isBookmarked ? "#E53935" : "#1a1a2e"} />
          </button>
          <button className="icon-btn">
            <Share2 size={20} />
          </button>
        </div>
      </header>

      <main className="article-body">
        <div className="article-meta">
          <span className="article-source-tag">{article.source}</span>
          <span className="dot">•</span>
          <span>{article.time || t('feed.just_now')}</span>
          <span className="dot">•</span>
          <span>{article.readTime || '4 min'} {t('briefing.read', { defaultValue: 'read' })}</span>
        </div>

        <h1 className="article-title">{article.title}</h1>

        <div className="article-hero-image">
          <img src={article.thumbnail || article.image} alt={article.title} />
        </div>

        <div className="article-content">
          {article.fullContent ? (
            <div className="content-text">
              {article.fullContent.split('\n').map((para, i) => (
                <p key={i}>{para.trim()}</p>
              ))}
            </div>
          ) : (
            <div className="content-text">
              <p>{article.content || article.summary}</p>
              {article.url && article.url.startsWith('http') && (
                <div className="external-source-link">
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more-btn">
                    {t('article.read_full', { defaultValue: `Read Full Article on ${article.source}` })} <ArrowRight size={16} />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* AI Action Trigger — Single CTA */}
        <div className="ai-trigger-section">
          <div className="ai-trigger-card">
            <div className="trigger-header">
              <Sparkles size={20} className="sparkle-icon" />
              <h3>{t('article.ai_insights')}</h3>
            </div>
            <p>{t('article.ai_subtitle')}</p>
            <div className="trigger-buttons">
              <button 
                className="trigger-btn primary"
                onClick={() => navigate(`/briefing/${id}?mode=flash`)}
              >
                <Zap size={18} fill="currentColor" /> {t('hero.cta')}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Personalized Suggested Follow-ups */}
      <section className="article-related-questions">
        <h4>{t('people.asking')}</h4>
        <div className="question-list">
          {personalizedQuestions.map((q, i) => (
            <button 
              key={i}
              className="q-item" 
              onClick={() => navigate(`/explore?q=${encodeURIComponent(q)}&context=${id}`)}
            >
              {q} <MessageSquare size={14} />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ArticlePage;
