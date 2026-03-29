# Implementation Plan: Vernacular Language System

To fully localize the ET Pulse application based on user preferences without changing any existing functionality, we will implement a lightweight custom Internationalization (i18n) dictionary system.

## Proposed Changes

### 1. New Utility: `src/utils/i18n.js`
Create a new file holding:
- A `translations` dictionary for all 6 supported languages (`en`, `hi`, `ta`, `te`, `bn`, `mr`).
- Key UI strings translated (e.g., "Good morning", "Understand in 30s", "Winners", "Risks", "Explore with Pulse AI").
- A custom React hook `useLanguage()` that:
  - Reads `preferred_language` from `localStorage` (defaulting to English).
  - Exposes a `t(key)` function to retrieve the translated string.
  - Exposes `currentLang` to conditionally format variables.

### 2. AI Article Translation (Backend)
- **`server/services/gemini.js`**: Create `translateArticleList(articles, language)` to batch-translate a JSON array of articles in one fast LLM pass.
- **`server/services/news.js`**: Update `fetchArticlesByProfile(sectors, interests, language)` to intercept the final mixed articles. If `language !== 'English'`, pass them through `translateArticleList` before returning them.
- **`server/index.js`**: Pass the `language` query param down to `NewsService`.

### 3. Update `src/pages/HomePage.jsx`
- Introduce a dynamic React state for `profile` (replacing the static useMemo). 
- When a user toggles the language, update the profile state instead of triggering `window.location.reload()`. This will instantly trigger a re-render of UI text and a re-fetch of the translated news feed.
- Replace all hardcoded English strings with `t('key')` calls.

## User Review Required
> [!NOTE] 
> This will translate all static UI elements (buttons, headers, navigation). AI-generated content (the actual briefings) is already instructed to output in the preferred language by the backend prompt. Combining these two ensures a 100% vernacular experience. No existing functions will be changed.

## Verification
- Toggle between English, Hindi, and another language on the Home page.
- Verify that the Navigation, Hero, Section Titles, and AI buttons translate correctly.
- Verify that navigating to a Briefing shows translated headers for "Winners", "Risks", etc.

## Phase 11: Real-time Translation & Deep Dive
**Updates to existing functionality to address edge cases and new feature requests:**
1. **Fixing Sector Typo (`HomePage.jsx` / `i18n.js`)**:
   - Add specific dictionary entries for `sector.banking`, `sector.it`, etc. to `i18n.js` in all 6 supported languages. This will replace the hardcoded "sector.[name]" that appears when a translation is missing.

2. **Frontend Translation Fallback (`HomePage.jsx`)**:
   - If the News API fails or times out (returning English mock articles), implement a `useEffect` that catches these and hits the backend `/api/ai/translate` endpoint manually to translate the titles and excerpts. This ensures that even fallback content is strictly in the user's preferred vernacular.

3. **Re-routing to Deep Analysis (`HomePage.jsx`)**:
   - Change the text on the article card buttons from "Understand in 30s" to "Analyze with AI" (and translate respectively in `i18n.js`).
   - Change the button's navigation target from `?mode=flash` to `?mode=deep`.

4. **Enhancing Deep Dive AI Prompt (`server/services/gemini.js`)**:
   - Locate the system prompt for `mode === 'deep'`.
   - Explicitly instruct the AI: *"Explain the article in detail. You must include concrete examples, relevant past information or historical context, and any other required breakdowns to comprehensively explain the implications to a {userType}."*

## Phase 13: UI Refinements (Reference Images)
**Updates to match the provided reference images exactly:**
1. **"Your Interests" Section (`HomePage.jsx`, `HomePage.css`)**:
   - Replace the static topic cards with actual articles fetched based on user interests.
   - Style the cards with a top cover image, title, hashtags (e.g. `#HOT`, `#SECTOR`), and a "Get AI Breakdown >" text link at the bottom.
   - Retain the colored left-border accent to match the visual design.

2. **"Latest Updates" Sector Pills (`HomePage.jsx`)**:
   - Add a horizontal scrolling list of sector pills (Banking, IT, Pharma, Auto, Energy, FMCG, Real Estate) directly above the feed.
   - Highlight the active sector with a solid blue background (like the "IT" pill in the reference).
   - Clicking a pill fetches articles for that specific sector.

3. **"Latest Updates" Feed Cards (`HomePage.jsx`, `HomePage.css`)**:
   - Update the horizontal news card styling.
   - Adjust the thumbnail to have the AI sparkle icon positioned exactly at the top-right.
   - Make the "Analyze with AI" button appear with a gray background and dark text (secondary button style).
   - Add a red outline/border highlight to the cards (either on hover or for the top "hot" article) as shown in the reference.

## Phase 17: Properly Framed AI & Markdown Rendering
Beautify the AI interaction by ensuring structural "framing" and proper layout rendering.

### [Backend] gemini.js
- Update `askAI` system prompt to be "Expert but engaging" (Professional, not robotic).
- Strictly enforce structural framing (bullet points, bold highlights).
- Remove casual fillers like "Okay, here's how..." and "Simple/Exam-friendly".

### [Frontend] BriefingPage.jsx
- Import `ReactMarkdown` and use it for AI message bubbles.
- Add specific CSS to style markdown lists and bold text within the bubbles.

## Phase 18: Project Portability & Documentation
Ensure the project is easily shareable and readable for both humans and future AI assistants.

### [Setup] scripts
- `README.md`: Prerequisites, install, and run guide.
- `.env.example`: Template for OpenRouter and News API keys.
- `setup.bat`: One-click Windows install.
- `start-app.bat`: One-click Windows launch for both services.

### [Agent] .agent/
- `onboarding.md`: Primer for future Antigravity agents.
- `brain/`: Sync of `task.md`, `walkthrough.md`, and `implementation_plan.md`.

## Phase 19: Real-Time News & Article Specificity
Ensure every article is unique and real-time capable.

### 1. Robust Mock Matching (`server/services/news.js`)
- Prevent falling back to the entire feed if a specific article headline lookup fails.
- If `extraTopic` is provided (is a headline) and not found, return an empty array to trigger the graceful AI error screen instead of a generic RBI report.

### 2. GNews.io Integration (`server/services/news.js`)
- Add support for `GNEWS_API_KEY` in `.env`.
- Implement `fetchFromGNews(topic)` as a more reliable free-tier alternative to NewsAPI.org.
- GNews allows 100 requests/day and better keyword matching for Indian regional news.

### 3. Navigation Cleanups
- Ensure `BriefingPage.jsx` and `HomePage.jsx` handle double-encoded titles correctly.

