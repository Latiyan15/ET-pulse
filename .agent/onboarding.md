# AI Agent Onboarding - ET Pulse

Welcome, ET Pulse AI Assistant! This document provides the essential context to understand and continue development on this project.

## 📌 Project Overview
ET Pulse is a personalized financial news platform featuring AI-driven briefings and a contextual chatbot.

## 🏗️ Technical Architecture
- **Frontend**: React (Vite) + Vanilla CSS.
- **Backend**: Node.js Express server (`/server`).
- **AI Engine**: Gemini 2.0 Flash (via OpenRouter API).
- **News Engine**: Custom logic in `server/services/news.js` that mixes real-time fetches with robust mock fallback data.

## 🚀 Key Features to Maintain
1. **Vernacular Translation**: Uses a custom `useLanguage` hook and `i18n.js` for instant UI translation. AI responses are dynamically translated via the backend.
2. **Properly Framed AI**: All AI responses must use `ReactMarkdown` for structural elements (bold, bullets, paragraphs).
3. **Dual AI Modes**:
   - `mode=summary`: Hero sector quick brief.
   - `mode=deep`: Deep-dive analysis for specific articles.

## 🛠️ Critical Implementation Notes
- **API Communication**: Frontend calls `src/utils/api.js`. Backend calls `server/services/gemini.js`.
- **HMR Stability**: The `useLanguage` hook is stabilized with `useCallback` to prevent infinite render loops in chat interfaces.
- **AI Persona**: Professional, expert, and engaging. Avoid casual fillers ("Okay", "I can help with that").

## 📂 Important Files
- `src/pages/BriefingPage.jsx`: Main AI generation and chat interface.
- `src/pages/ExplorePage.jsx`: Global search and follow-up bot.
- `server/index.js`: Main API routes for chat, translation, and news.
- `server/services/gemini.js`: System prompts and OpenRouter integration.
- `src/utils/i18n.js`: Localized dictionary (English, Hindi, Tamil, Telugu, Bengali, Marathi).

## 🚀 Future Tasks (If Applicable)
- Keep all AI-generated text "Properly Framed".
- Ensure any new UI elements match the premium Light/Indigo theme.
- Maintain consistency across all vernacular translations.

---
**Note to the Agent**: Read `README.md` for local setup and `.env.example` for required keys.
