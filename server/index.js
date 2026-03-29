const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const GeminiService = require('./services/gemini');
const NewsService = require('./services/news');

const app = express();
const PORT = 3001;

// In-memory chat history store (session-based)
const chatHistories = new Map();

console.log('🚀 Starting ET Pulse Backend...');
console.log('🤖 AI: Google Gemini (via OpenRouter)');
console.log('📡 OpenRouter Key:', process.env.OPENROUTER_API_KEY ? '✅ Set' : '❌ Missing');

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// =====================================================
// NEWS ENDPOINTS
// =====================================================

// GET /api/news/trending — General trending news
app.get('/api/news/trending', async (req, res) => {
  try {
    const articles = await NewsService.fetchArticles('Indian business finance stock market');
    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'News Fetch Error' });
  }
});

// GET /api/news/sector/:sectorId — Sector-specific news (for home page tabs)
app.get('/api/news/sector/:sectorId', async (req, res) => {
  try {
    let articles = await NewsService.fetchArticlesBySector(req.params.sectorId);
    const language = req.query.language || 'English';

    if (language !== 'English' && language !== 'en' && articles.length > 0) {
      console.log(`🌍 Translating ${articles.length} sector articles to ${language}...`);
      articles = await GeminiService.translateArticleList(articles, language);
    }

    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sector News Fetch Error' });
  }
});

// GET /api/news/personalized?sectors=banking,it&interests=...&user_type=investor&language=Hindi
app.get('/api/news/personalized', async (req, res) => {
  try {
    const sectors = req.query.sectors ? req.query.sectors.split(',') : [];
    const interests = req.query.interests ? req.query.interests.split(',') : [];
    const language = req.query.language || 'English';
    const userType = req.query.user_type || 'investor';
    const extraTopic = req.query.extraTopic || '';

    let articles = await NewsService.fetchArticlesByProfile(sectors, interests, extraTopic, language, userType);

    if (language !== 'English' && language !== 'en') {
      console.log(`🌍 Translating ${articles.length} feed articles to ${language}...`);
      articles = await GeminiService.translateArticleList(articles, language);
    }

    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Personalized News Fetch Error' });
  }
});

// =====================================================
// BRIEFING ENDPOINTS
// =====================================================

// GET /api/briefing/:topicId?user_type=investor&language=English&sectors=banking,it&interests=...
app.get('/api/briefing/:topicId', async (req, res) => {
  const { topicId } = req.params;
  const {
    user_type = 'investor',
    language = 'English',
    sectors = '',
    interests = '',
    mode = 'flash'
  } = req.query;

  try {
    const sectorList = sectors ? sectors.split(',') : [];
    const interestList = interests ? interests.split(',') : [];

    // Fetch articles for the specific topic or sector
    const articles = await NewsService.fetchArticlesByProfile(sectorList, interestList, topicId);

    if (!articles || articles.length === 0) {
      console.warn('⚠️ No articles found for briefing:', topicId);
      return res.json({
        title: topicId,
        tldr: ['No detailed information found at this moment.', 'Please try again later or with a different topic.'],
        personalized_take: 'We couldn\'t find enough sources to provide a deep analysis for this specific headline right now.',
        source_count: 0
      });
    }

    const aiBriefing = await GeminiService.generateBriefing(articles, user_type, {
      language,
      sectors: sectorList,
      interests: interestList,
      mode
    });

    res.json(aiBriefing);
  } catch (err) {
    console.error('Briefing error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// =====================================================
// CHAT ENDPOINTS
// =====================================================

// POST /api/chat/ask
app.post('/api/chat/ask', async (req, res) => {
  const {
    briefing_id,
    message,
    history = [],
    user_type = 'investor',
    language = 'English',
    sectors = [],
    interests = [],
    session_id = 'default'
  } = req.body;

  try {
    // Get or build briefing context
    let briefingContext = {};
    if (briefing_id && briefing_id !== 'null') {
      // Minimal context — the history should carry context
      briefingContext = { topic: briefing_id };
    }

    console.log(`💬 Chat Prompt [${session_id}]: "${message}" | History: ${history.length} | Lang: ${language}`);
    const answer = await GeminiService.askAI(briefingContext, history, message, {
      language,
      userType: user_type,
      sectors,
      interests
    });
    console.log(`✅ Chat Answer [${session_id}]: ${answer.substring(0, 50)}...`);

    // Save to in-memory history
    if (!chatHistories.has(session_id)) {
      chatHistories.set(session_id, {
        id: session_id,
        title: message.substring(0, 40) + (message.length > 40 ? '...' : ''),
        messages: [],
        created_at: new Date().toISOString()
      });
    }
    const session = chatHistories.get(session_id);
    session.messages.push(
      { role: 'user', content: message },
      { role: 'ai', content: answer }
    );

    res.json({ answer, session_id });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Chat Error' });
  }
});

// GET /api/chat/history/:sessionId
app.get('/api/chat/history/:sessionId', async (req, res) => {
  const session = chatHistories.get(req.params.sessionId);
  if (!session) return res.json({ messages: [], title: 'New Chat' });
  res.json(session);
});

// GET /api/chat/sessions — List all sessions
app.get('/api/chat/sessions', async (req, res) => {
  const sessions = Array.from(chatHistories.values()).map(s => ({
    id: s.id,
    title: s.title,
    created_at: s.created_at,
    message_count: s.messages.length
  }));
  res.json(sessions);
});

// =====================================================
// TRANSLATION
// =====================================================

app.post('/api/ai/translate', async (req, res) => {
  const { content, language, user_type } = req.body;
  try {
    const result = await GeminiService.translateContent(content, language, user_type);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: 'Translation Error' });
  }
});

// =====================================================
// USER / ONBOARDING
// =====================================================

app.get('/api/user/profile', async (req, res) => {
  res.json({ success: true, message: 'Profile fetched' });
});

app.put('/api/user/profile', async (req, res) => {
  const profile = req.body;
  console.log('Updating profile:', JSON.stringify(profile).substring(0, 100));
  res.json({ success: true, message: 'Profile updated successfully' });
});

app.post('/api/onboarding', async (req, res) => {
  const profile = req.body;
  console.log('Onboarding saved — user_type:', profile.user_type, '| sectors:', profile.sectors);
  res.json({ success: true, message: 'Profile saved successfully' });
});

// =====================================================
// SERVE FRONTEND (STATIC ASSETS)
// =====================================================

// Serve static files from the React app build
app.use(express.static(path.join(__dirname, '../dist')));

// =====================================================
// HEALTH CHECK
// =====================================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    ai: 'OpenRouter/Gemini Flash',
    openrouter_key: process.env.OPENROUTER_API_KEY ? 'set' : 'missing'
  });
});

// Any other GET request not handled above should return the React index.html
app.use((req, res) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  } else {
    res.status(404).json({ error: 'Not Found' });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 ET Pulse Backend running at http://localhost:${PORT}`);
  console.log(`📋 Endpoints: /api/news/personalized, /api/briefing/:id, /api/chat/ask\n`);
});
