#!/bin/bash

# EZ Narratives Deployment Script
# This script builds and deploys the application to the production server

set -e  # Exit immediately if a command exits with a non-zero status

# Configuration
DEPLOY_DIR="/var/www/eznarratives.com"
DIST_DIR="$DEPLOY_DIR/dist"
NGINX_CONF="/etc/nginx/sites-available/eznarratives.com"
CLOUDFLARE_DNS="eznarratives.com"
SERVER_IP="145.223.73.170"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment process for EZ Narratives...${NC}"

# Step 1: Install dependencies
echo -e "\n${YELLOW}Installing dependencies...${NC}"
cd $DEPLOY_DIR
npm install
echo -e "${GREEN}Dependencies installed successfully.${NC}"

# Step 2: Generate PWA assets
echo -e "\n${YELLOW}Generating PWA assets...${NC}"
npm run generate-pwa-assets
echo -e "${GREEN}PWA assets generated successfully.${NC}"

# Verify icons were generated
if [ ! -f "$DEPLOY_DIR/public/icons/icon-192x192.png" ] || [ ! -f "$DEPLOY_DIR/public/splash/apple-splash-1125-2436.png" ]; then
  echo -e "${RED}Warning: Some icon files may not have been generated. Continuing anyway...${NC}"
fi

# Step 3: Build the application
echo -e "\n${YELLOW}Building the application...${NC}"
npm run build
echo -e "${GREEN}Application built successfully.${NC}"

# Step 4: Verify build output
if [ ! -d "$DIST_DIR" ]; then
  echo -e "${RED}Error: Build directory not found at $DIST_DIR${NC}"
  exit 1
fi

echo -e "\n${YELLOW}Verifying build output...${NC}"
if [ -f "$DIST_DIR/index.html" ] && [ -f "$DIST_DIR/manifest.json" ] && [ -d "$DIST_DIR/assets" ]; then
  echo -e "${GREEN}Build verification successful.${NC}"
else
  echo -e "${RED}Error: Build verification failed. Missing required files.${NC}"
  exit 1
fi

# Step 5: Check Nginx configuration
echo -e "\n${YELLOW}Checking Nginx configuration...${NC}"
if [ -f "$NGINX_CONF" ]; then
  echo -e "${GREEN}Nginx configuration found.${NC}"
  
  # Test Nginx configuration
  echo -e "${YELLOW}Testing Nginx configuration...${NC}"
  sudo nginx -t
  
  # Reload Nginx to apply any changes
  echo -e "${YELLOW}Reloading Nginx...${NC}"
  sudo systemctl reload nginx
  echo -e "${GREEN}Nginx reloaded successfully.${NC}"
else
  echo -e "${RED}Warning: Nginx configuration not found at $NGINX_CONF${NC}"
  echo -e "${YELLOW}Please ensure Nginx is properly configured for the domain.${NC}"
fi

# Step 6: Verify deployment
echo -e "\n${YELLOW}Verifying deployment...${NC}"
echo -e "${YELLOW}Server IP: $SERVER_IP${NC}"
echo -e "${YELLOW}Domain: $CLOUDFLARE_DNS${NC}"

# Print success message
echo -e "\n${GREEN}==================================================${NC}"
echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}==================================================${NC}"
echo -e "\nThe application is now available at:"
echo -e "  - http://$SERVER_IP"
echo -e "  - https://$CLOUDFLARE_DNS (if DNS is configured)"
echo -e "\n${YELLOW}Post-deployment tasks:${NC}"
echo -e "  1. Test the PWA installation flow on various devices"
echo -e "  2. Verify that icons and splash screens display correctly"
echo -e "  3. Check service worker registration and offline functionality"
echo -e "  4. Validate PWA in Chrome DevTools Lighthouse audit"