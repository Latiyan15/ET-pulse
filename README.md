# ET-pulse
 ET Pulse — Personalized financial news platform by Economic Times. Features an AI-powered market intelligence dashboard with real-time sector heatmaps, personalized news feed with Pulse Score ranking, AI market summaries, and an interactive "Explore with AI" assistant. Built for retail investors and students to understand market news faster.
# ET Pulse — Personalized Financial News

> Your personalized financial news feed, powered by AI.

## Overview
ET Pulse is a web application built on top of the Economic Times content ecosystem. It delivers personalized financial news, real-time market data, and AI-powered story breakdowns tailored to the user's interests and knowledge level.

## Features
- **Personalized Feed** — Stories ranked by user interests, sector preference, and reading history
- **Sector Heatmap** — Real-time colour-coded market intelligence across IT, Banking, Auto, Pharma, FMCG, Energy, and Real Estate
- **Pulse Score** — Proprietary virality + market-relevance score (0–100) on every story
- **Market Urgency Indicator** — Visual urgency bar showing how time-sensitive each story is
- **Why It Matters** — AI-generated one-liner explaining the investor angle of every story
- **AI Market Summary** — Daily market mood, key driver, and momentum tag at the top of Markets
- **Explore with AI** — Conversational AI assistant (Pulse AI) for financial concepts and news queries
- **Study Stream** — Daily concept explainer tied to today's news, with learning streak tracking
- **Today in 30s** — Quick audio/video digest of the day's top stories

## Tech Stack
- Frontend: React + Vite
- Styling: Tailwind CSS
- Routing: React Router
- Data: ET Markets API + custom AI layer

## Design System
- Background: #f5f0e8 (warm newsprint cream)
- Primary: #E53935 (ET Red)
- Data positive: #1b5e20 (green — gains only)
- Data negative: #b71c1c (dark red — losses only)
- Education accent: #f59e0b (amber)
- Surfaces: #ffffff with #e8e0d0 warm borders
- Typography: System sans-serif, headline weight 800

## Getting Started
```bash
npm install
npm run dev
```
App runs on `http://localhost:5173`

## Pages
| Route | Description |
|-------|-------------|
| `/home` | Personalized feed, hero story, interests, latest updates |
| `/markets` | AI summary, market overview, sector heatmap, trending stories |
| `/explore` | Pulse AI chat interface with quick topics and conversation history |

## Roadmap
- [ ] Micro-animations and card hover states
- [ ] Skeleton loading screens
- [ ] Heatmap expanded stock drill-down with live sparklines
- [ ] Push notifications for breaking stories above Pulse Score 90
- [ ] Dark mode support
