@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
  echo Node.js 20 or newer is required. Install Node.js, then run this file again.
  pause
  exit /b 1
)
echo Starting Kindred CRM with its local research API...
timeout /t 2 >nul
start "" "http://127.0.0.1:4173"
node server.mjs
pause
