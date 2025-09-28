@echo off
echo 🚀 Setting up Taskify MERN Application...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v14 or higher.
    pause
    exit /b 1
)

echo ✅ Node.js detected
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm.
    pause
    exit /b 1
)

echo ✅ npm detected

REM Install root dependencies
echo ℹ️ Installing root dependencies...
call npm install

REM Setup Backend
echo ℹ️ Setting up backend...
cd backend

REM Install backend dependencies
echo ℹ️ Installing backend dependencies...
call npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo ℹ️ Creating backend .env file...
    (
        echo PORT=5000
        echo MONGO_URI=mongodb://localhost:27017/taskify
        echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
        echo NODE_ENV=development
    ) > .env
    echo ⚠️ Please update the .env file with your actual MongoDB URI and JWT secret
) else (
    echo ✅ Backend .env file already exists
)

cd ..

REM Setup Frontend
echo ℹ️ Setting up frontend...
cd frontend

REM Install frontend dependencies
echo ℹ️ Installing frontend dependencies...
call npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo ℹ️ Creating frontend .env file...
    (
        echo REACT_APP_API_URL=http://localhost:5000
    ) > .env
    echo ✅ Frontend .env file created
) else (
    echo ✅ Frontend .env file already exists
)

cd ..

REM Create necessary directories
echo ℹ️ Creating necessary directories...
if not exist backend\uploads mkdir backend\uploads
if not exist frontend\public\images mkdir frontend\public\images

REM Create start scripts
echo ℹ️ Creating start scripts...

REM Create start-dev.bat
(
    echo @echo off
    echo echo 🚀 Starting Taskify in development mode...
    echo echo Backend will run on http://localhost:5000
    echo echo Frontend will run on http://localhost:3000
    echo echo.
    echo echo Press Ctrl+C to stop both servers
    echo echo.
    echo.
    echo REM Start backend in background
    echo start "Backend Server" cmd /k "cd backend && npm run dev"
    echo.
    echo REM Wait a moment for backend to start
    echo timeout /t 3 /nobreak >nul
    echo.
    echo REM Start frontend
    echo start "Frontend Server" cmd /k "cd frontend && npm start"
    echo.
    echo echo ✅ Both servers started!
    echo echo Close this window to stop the application
    echo pause
) > start-dev.bat

REM Create start-prod.bat
(
    echo @echo off
    echo echo 🚀 Starting Taskify in production mode...
    echo.
    echo REM Build frontend
    echo echo Building frontend...
    echo cd frontend
    echo call npm run build
    echo cd ..
    echo.
    echo REM Start backend
    echo echo Starting backend server...
    echo cd backend
    echo call npm start
) > start-prod.bat

echo ✅ Start scripts created:
echo   - start-dev.bat (development mode)
echo   - start-prod.bat (production mode)

REM Display setup completion
echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Make sure MongoDB is running (or use MongoDB Atlas)
echo 2. Update the .env files with your actual configuration
echo 3. Run the application:
echo    - Development: start-dev.bat
echo    - Production:  start-prod.bat
echo.
echo 🔗 URLs:
echo    - Frontend: http://localhost:3000
echo    - Backend:  http://localhost:5000
echo.
echo 📚 Documentation:
echo    - README.md - Project overview and features
echo    - DEPLOYMENT.md - Deployment guide
echo.
echo Happy coding! 🚀
pause
