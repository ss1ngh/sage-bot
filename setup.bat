@echo off
echo ========================================
echo   Sage University Chatbot Setup
echo ========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo [1/4] Docker is running...
echo.

REM Check if .env file exists
if not exist ".env" (
    echo [2/4] Creating .env file from template...
    copy .env.example .env
    echo.
    echo [!] IMPORTANT: Please edit .env and add your GEMINI_API_KEY
    echo     Get your key from: https://makersuite.google.com/app/apikey
    echo.
    pause
) else (
    echo [2/4] .env file already exists
    echo.
)

REM Check if GEMINI_API_KEY is set
findstr /C:"your-gemini-api-key-here" .env >nul
if %errorlevel% equ 0 (
    echo [!] WARNING: GEMINI_API_KEY is not configured!
    echo     Please edit .env and add your actual API key.
    echo.
    set /p CONTINUE="Continue anyway? (y/n): "
    if /i not "%CONTINUE%"=="y" exit /b 1
)

echo [3/4] Building Docker containers (this may take 5-10 minutes)...
echo.
docker-compose build

if %errorlevel% neq 0 (
    echo [ERROR] Docker build failed!
    pause
    exit /b 1
)

echo.
echo [4/4] Starting all services...
echo.
docker-compose up -d

if %errorlevel% neq 0 (
    echo [ERROR] Failed to start services!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Frontend:     http://localhost:3000
echo RabbitMQ UI:  http://localhost:15672 (guest/guest)
echo.
echo Services running:
docker-compose ps
echo.
echo To view logs: docker-compose logs -f
echo To stop:      docker-compose down
echo.
pause
