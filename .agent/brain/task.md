# ET Pulse — Core Experience Implementation

## Phase 1: Backend Enhancements
- [x] Analyze existing codebase
- [x] Switch AI from Google Gemini SDK to OpenRouter API (Gemini model)
- [x] Add personalized news fetching endpoint with sector/interest filtering
- [x] Enhance /api/news/trending to accept user profile for personalization
- [x] Add /api/news/personalized endpoint
- [x] Add /api/chat/history endpoints (save/load)
- [x] Enhance GeminiService to use OpenRouter API key

## Phase 2: Onboarding — Fix Icons + Data Persistence
- [x] Replace emoji icons in userTypes with proper SVG/Lucide icons in mockData.js
- [x] Verify onboarding saves all data correctly to localStorage
- [x] Fix profile data (name from etpulse_user) shown in ProfilePage

## Phase 3: Home Feed — Personalized
- [x] Filter mockArticles by user's selected sectors
- [x] Add personalized greeting with user's name and type
- [x] Add dynamic hero briefing based on user's top sector
- [x] Add trending topics based on user's interests
- [x] Language toggle working with preferred_language from profile
- [x] Filter trending cards based on user's sectors and interests

## Phase 4: Briefing Page — Enhanced
- [x] Show personalized_take from AI based on user_type from profile
- [x] Fix "Ask Pulse AI" to open inline chat instead of alert()
- [x] Add language-aware content (pass preferred_language)
- [x] Add "Explain Simply" button functionality

## Phase 5: Explore (Chatbot) — Enhanced
- [x] Add personalized greeting/context based on user profile
- [x] Add follow-up suggestion chips based on user_type
- [x] Persist conversation history in localStorage
- [x] Add conversation list panel (sidebar or toggle)
- [x] Auto-title new chats

## Phase 6: Profile Page — Real Data
- [x] Show real user name from etpulse_user localStorage
- [x] Show user_type, sectors, interests from etpulse_profile
## Phase 8: Light Theme + Dual AI Views
- [x] Revert `BriefingPage.css` to premium white/light theme
- [x] Revert `ExplorePage.css` to premium white/light theme
- [x] Create distinct "30s Flash" vs "Deep Dive" layouts in `BriefingPage.jsx`
- [x] Update `HomePage.jsx` to trigger different AI modes
- [x] Ensure AI generation loading screen works in light mode
- [x] Refine AI prompts to differentiate between "Summary" and "Breakdown" depth

## Phase 9: Multi-Sector Personalization
- [x] Update `news.js` to mix articles from multiple selected sectors.
- [x] Implement Sector Switcher UI in Hero section of `HomePage.jsx`.
- [x] Style Sector Switcher in `HomePage.css`.

## Phase 10: Vernacular Language System
- [x] Create `src/utils/i18n.js` with UI dictionary and `useLanguage` hook.
- [x] Add `translateArticleList` AI function in `server/services/gemini.js`.
- [x] Update `index.js` to trigger AI translation on mixed feed articles.
- [x] Refactor `HomePage.jsx` to use dynamic state instead of reload on language toggle.
- [x] Add all user-selected languages to the language toggle bar in `HomePage.jsx`.
- [x] Apply `t()` format hook to `HomePage.jsx`, `BriefingPage.jsx`, and `ExplorePage.jsx`.

## Phase 11: Deep Dive Refinements & Translation Fallbacks
- [x] Add sector name translations to `i18n.js` to fix the `sector.` typo.
- [x] Update the article button in `HomePage.jsx` from 'Understand in 30s' to 'Analyze with AI'.
- [x] Route the new 'Analyze with AI' button to the `?mode=deep` view.
- [x] Enhance the `mode='deep'` AI Prompt in `server/services/gemini.js` to explicitly require detailed explanations, examples, and relevant past info.
- [x] Implement a robust frontend effect in `HomePage.jsx` to dynamically translate `mockArticles` via `/api/ai/translate` if the backend news API fails.

## Phase 12: Feature Differentiation & Analysis Fix
- [x] Restore "Understand in 30s" for Hero section in `i18n.js`.
- [x] Keep "Analyze with AI" for Article Feed in `i18n.js`.
- [x] Fix `server/index.js` to use `topicId` (article title) when fetching context for individual analysis.
- [x] Ensure `GeminiService.generateBriefing` handles cases where specific articles are being analyzed.
- [x] Debug "Stuck Loading" by adding timeouts and better error handling in backend news fetching.

## Phase 13: UI Refinements (Reference Images)
- [x] Refactor `HomePage.jsx` to fetch both `interestArticles` and `feedArticles` separately.
- [x] Replace `trendingTopics` static cards with actual `interestArticles` cards styled like Image 1 (Images, hashtags, left-borders, 'Get AI Breakdown').
- [x] Add the horizontal wrapping sector pills above the "Latest Updates" feed.
- [x] Update `HomePage.css` to match the exact spacing, visual layout, and secondary button style for the feed.
- [x] Implement the red highlight box for top/hot articles in the feed as per Image 2.

## Phase 14: AI JSON Parsing & Error Handling
- [x] Update `gemini.js` to detect and strip Markdown blocks (e.g. ` ```json `) from the model's response before calling `JSON.parse`.
- [x] Refactor `BriefingPage.jsx` to introduce an `error` state.
- [x] Render a graceful error screen with a "Go Back" button when AI generation timeouts or parsing fails, replacing the infinite loading loop.
- [x] Fix `api.js` to properly use `encodeURIComponent` for specific article headlines to prevent the backend Express router from crashing with a `URIError` when encountering characters like `%`.
- [x] Update Mock News fallback logic to parse and isolate a single article context during deep dives, instead of accidentally summarizing the entire feed.

## Phase 15: Chatbot Formatting & Interest Feed Cleanup
- [x] Update `askAI` prompt to use Markdown bullet points and explain concepts step-by-step.
- [x] Fix `HomePage.jsx` to dynamically assign `article.sector` or `article.interest` to the interest hashtags instead of hardcoding.
- [x] Fix broken Unsplash images in `news.js` by transitioning to stable seeded placeholders.
- [x] Add 3-4 more articles to the mock feed (Startup/Funding, Economy, etc.) so the "Your Interests" section is well-populated.

## Phase 16: Briefing Error Fix (i18n & Sector Filtering)
- [x] Add missing `briefing.error_network` and `briefing.error_title` keys to `i18n.js`.
- [x] Refine `NewsService.fetchArticlesByProfile` to support flexible sector matching for summaries.
- [x] Design and implement a premium `.briefing-error-screen` CSS style.
- [x] Update `BriefingPage.jsx` to show translated error headers.

## Phase 17: Properly Framed AI & Markdown Rendering
- [x] Refine `askAI` system prompt for "Professional but Engaging" expert persona in `gemini.js`.
- [x] Integrate `ReactMarkdown` into `BriefingPage.jsx` and `ExplorePage.jsx`.
- [x] Add CSS for rendered markdown elements in both chat interfaces.
- [x] Fix Explore chatbot "no response" bug by adding backend diagnostic logs and verifying API flow.
- [x] Fix i18n infinite render loop in `useLanguage` to prevent chat history resets.

## Phase 18: Project Documentation & Portability
- [x] Create comprehensive `README.md` with setup and running instructions.
- [x] Create `.env.example` template for API keys.
- [x] Create `setup.bat` and `start-app.bat` for Windows automation.
- [x] Create `.agent/onboarding.md` to provide immediate context to future AI assistants.
- [x] Sync current `task.md`, `walkthrough.md`, and `implementation_plan.md` to `.agent/brain/`.
- [x] Add `npm run install-all` and `npm run server` to root `package.json`.

## Phase 19: Real-Time News & Article Specificity
- [/] Refine `NewsService.fetchArticlesByProfile` to strictly return an empty array if a specific headline search fails.
- [ ] Integrate GNews.io API as a superior free-tier alternative to NewsAPI.org.
- [ ] Add `GNEWS_API_KEY` to `.env.example` and documentation.
- [ ] Verify unique article generation for all feed items.

