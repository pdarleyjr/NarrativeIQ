#!/bin/bash
# EZ Narratives Setup Script
# This script helps set up the development environment for EZ Narratives

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print header
echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}          EZ Narratives Setup Script            ${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Check Python version
echo -e "${YELLOW}Checking Python version...${NC}"
python_version=$(python3 --version 2>&1 | awk '{print $2}')
python_major=$(echo $python_version | cut -d. -f1)
python_minor=$(echo $python_version | cut -d. -f2)

if [ "$python_major" -lt 3 ] || ([ "$python_major" -eq 3 ] && [ "$python_minor" -lt 9 ]); then
    echo -e "${RED}Error: Python 3.9+ is required. Found Python $python_version${NC}"
    exit 1
fi

echo -e "${GREEN}Found Python $python_version${NC}"

# Create virtual environment
echo -e "${YELLOW}Creating virtual environment...${NC}"
if [ -d "venv" ]; then
    echo -e "${YELLOW}Virtual environment already exists. Skipping...${NC}"
else
    python3 -m venv venv
    echo -e "${GREEN}Virtual environment created${NC}"
fi

# Activate virtual environment
echo -e "${YELLOW}Activating virtual environment...${NC}"
source venv/bin/activate

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
pip install --upgrade pip
pip install -r requirements.txt

# Check for .env.local file
echo -e "${YELLOW}Checking for .env.local file...${NC}"
if [ -f ".env.local" ]; then
    echo -e "${GREEN}.env.local file found${NC}"
else
    echo -e "${YELLOW}.env.local file not found. Creating from template...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo -e "${GREEN}.env.local file created from template${NC}"
        echo -e "${YELLOW}Please edit .env.local with your API keys and configuration${NC}"
    else
        echo -e "${YELLOW}Creating minimal .env.local file...${NC}"
        cat > .env.local << EOF
# Supabase Configuration
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
PG_CONNECTION_STRING=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI Configuration
OPENAI_API_KEY=
OPENAI_EMBEDDING_MODEL=text-embedding-3-small

# OpenRouter Configuration
OPENROUTER_API_KEY=
EOF
        echo -e "${GREEN}.env.local file created${NC}"
        echo -e "${YELLOW}Please edit .env.local with your API keys and configuration${NC}"
    fi
fi

# Initialize Reflex (if needed)
echo -e "${YELLOW}Initializing Reflex...${NC}"
if [ -d ".web" ]; then
    echo -e "${YELLOW}Reflex already initialized. Skipping...${NC}"
else
    reflex init
    echo -e "${GREEN}Reflex initialized${NC}"
fi

# Run smoke tests
echo -e "${YELLOW}Running smoke tests...${NC}"
python smoke_test.py || {
    echo -e "${RED}Smoke tests failed. Please check the output above for errors.${NC}"
    echo -e "${YELLOW}You may need to configure your .env.local file with valid API keys.${NC}"
}

# Print success message
echo ""
echo -e "${BLUE}================================================${NC}"
echo -e "${GREEN}Setup completed successfully!${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""
echo -e "To run the web application:"
echo -e "${YELLOW}reflex run${NC}"
echo ""
echo -e "To run the desktop/mobile application:"
echo -e "${YELLOW}python main.py${NC}"
echo ""
echo -e "For more information, see the README.md file."
echo ""