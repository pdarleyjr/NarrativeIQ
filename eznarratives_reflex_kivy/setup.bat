@echo off
REM EZ Narratives Setup Script for Windows
REM This script helps set up the development environment for EZ Narratives

echo ================================================
echo          EZ Narratives Setup Script            
echo ================================================
echo.

REM Check Python version
echo Checking Python version...
python --version 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Python not found. Please install Python 3.9+ and add it to your PATH.
    exit /b 1
)

REM Create virtual environment
echo Creating virtual environment...
if exist venv (
    echo Virtual environment already exists. Skipping...
) else (
    python -m venv venv
    echo Virtual environment created
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt

REM Check for .env.local file
echo Checking for .env.local file...
if exist .env.local (
    echo .env.local file found
) else (
    echo .env.local file not found. Creating from template...
    if exist .env.example (
        copy .env.example .env.local
        echo .env.local file created from template
        echo Please edit .env.local with your API keys and configuration
    ) else (
        echo Creating minimal .env.local file...
        (
            echo # Supabase Configuration
            echo VITE_SUPABASE_URL=
            echo VITE_SUPABASE_ANON_KEY=
            echo PG_CONNECTION_STRING=
            echo SUPABASE_SERVICE_ROLE_KEY=
            echo.
            echo # OpenAI Configuration
            echo OPENAI_API_KEY=
            echo OPENAI_EMBEDDING_MODEL=text-embedding-3-small
            echo.
            echo # OpenRouter Configuration
            echo OPENROUTER_API_KEY=
        ) > .env.local
        echo .env.local file created
        echo Please edit .env.local with your API keys and configuration
    )
)

REM Initialize Reflex (if needed)
echo Initializing Reflex...
if exist .web (
    echo Reflex already initialized. Skipping...
) else (
    reflex init
    echo Reflex initialized
)

REM Run smoke tests
echo Running smoke tests...
python smoke_test.py
if %ERRORLEVEL% NEQ 0 (
    echo Smoke tests failed. Please check the output above for errors.
    echo You may need to configure your .env.local file with valid API keys.
)

REM Print success message
echo.
echo ================================================
echo Setup completed successfully!
echo ================================================
echo.
echo To run the web application:
echo reflex run
echo.
echo To run the desktop/mobile application:
echo python main.py
echo.
echo For more information, see the README.md file.
echo.

REM Keep the window open
pause