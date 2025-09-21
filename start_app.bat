@echo off
echo 🚀 Starting AI Daily Journal Application
echo ================================================

echo 🔄 Starting backend server...
start "Backend Server" cmd /k "python backend/api_server.py"

echo ⏳ Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo 🔄 Starting frontend server...
start "Frontend Server" cmd /k "npm run dev"

echo ✅ Both servers are starting!
echo 📍 Frontend: http://localhost:3000
echo 📍 Backend API: http://localhost:8000
echo 📖 API docs: http://localhost:8000/docs
echo.
echo Press any key to exit...
pause >nul