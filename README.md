# ET Pulse - Personalized Financial News with AI

ET Pulse is a modern financial news platform that delivers personalized briefings, deep-dive analysis, and an AI chat assistant tailored to your specific user profile (Investor, Founder, Student, etc.) and sectors of interest.

### 🚀 Quick Start Guide (One-Click)

The easiest way to get started is using the provided batch scripts:

1.  **Setup**: Run `setup.bat`. This will install all dependencies for both the frontend and backend and set up your `.env` files.
2.  **Launch**: Run `start-app.bat`. This will automatically launch both the **Backend (Port 3001)** and the **Frontend (Port 5173)** in two separate windows.

---

### 🛠️ Manual Execution (Alternative)

If you prefer using the terminal manually, follow these steps:

#### 1. Installation
Run `npm run install-all` from the root directory to install both frontend and backend dependencies.

#### 2. Running
You must run **both** services simultaneously:
- **Backend**: `npm run server` (starts the Express API on port 3001).
- **Frontend**: `npm run dev` (starts the Vite React app on port 5173).

---

## 🛠️ Project Structure
- `/src`: Frontend React application (Vite).
- `/server`: Node.js Express backend.
- `/server/services`: AI logic (Gemini/OpenRouter) and News services.
- `/public`: Static assets and icons.

## 🤖 AI Features
- **Understand in 30s**: Instant AI briefings for your top sectors.
- **Analyze with AI**: Deep-dive breakthroughs for specific news articles.
- **Pulse AI Chat**: Context-aware assistant for follow-up questions.
- **Vernacular Support**: Full UI and AI translation for Hindi, Tamil, Telugu, Bengali, and Marathi.

## ❓ Troubleshooting
- **401 Unauthorized**: Ensure your `OPENROUTER_API_KEY` is correct in both the root `.env` and `/server/.env`.
- **Port 3001 Busy**: If the backend fails to start, ensure no other process is using port 3001.
- **Stuck Loading**: Check the browser console and `server` terminal for AI generation timeouts.

---

## 📦 How to Zip and Share
When sharing this project via ZIP, please **exclude** the following folders to keep the file size manageable:
- `node_modules` (in both the root and the `server` folder)
- `dist` (frontend build output if present)
- `.git` (if initialized)

The recipient should run `setup.bat` immediately after unzipping to restore these dependencies.

