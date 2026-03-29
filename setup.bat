@echo off
echo ==========================================
echo   ET PULSE - PROJECT SETUP (WINDOWS)
echo ==========================================

echo [1/3] Installing Frontend Dependencies (Root)...
call npm install

echo [2/3] Installing Backend Dependencies (Server Folder)...
cd server
call npm install
cd ..

echo [3/3] Checking for Environment Variables...
if not exist .env (
    echo [!] WARNING: Root .env file not found. Copying from .env.example...
    copy .env.example .env
    echo [!] ACTION REQUIRED: Please edit the .env file and add your OPENROUTER_API_KEY.
)

if not exist server\.env (
    echo [!] WARNING: Server .env file not found. Copying from .env.example...
    copy .env.example server\.env
)

echo ==========================================
echo   SETUP COMPLETE!
echo ==========================================
echo To start:
echo 1. Open one terminal and run: npm run dev
echo 2. Open another terminal and run: cd server && node index.js
pause
