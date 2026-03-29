@echo off
echo ==========================================
echo   ET PULSE - LAUNCHING SERVICES
echo ==========================================

echo [1/2] Starting Backend Server...
start "ET Pulse Backend" cmd /k "cd server && node index.js"

echo [2/2] Starting Frontend App...
start "ET Pulse Frontend" cmd /k "npm run dev"

echo ==========================================
echo   SERVICES LAUNCHED!
echo ==========================================
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173 (usually)
pause
