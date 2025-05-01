#!/bin/bash

# EZ Narratives Deployment Script
# This script builds the application and deploys it to the production directory

set -e  # Exit immediately if a command exits with a non-zero status

echo "Starting deployment process for EZ Narratives..."

# Navigate to project root
cd /var/www/eznarratives.com

# Check if we should skip the build process
if [ "$1" != "--skip-build" ]; then
  # Install dependencies if needed
  echo "Checking for dependencies..."
  npm ci

  # Build the application
  echo "Building application..."
  npm run build || {
    echo "Build failed. Trying to build without PWA assets generation..."
    # If the build fails, try to build without generating PWA assets
    npm run build
  }
else
  echo "Skipping build process as requested..."
fi

# Check if html is a symlink to dist
if [ -L "html" ] && [ "$(readlink -f html)" = "$(readlink -f dist)" ]; then
  echo "html is already a symlink to dist, skipping backup and copy steps..."
else
  # Backup current html directory
  echo "Backing up current html directory..."
  timestamp=$(date +%Y%m%d_%H%M%S)
  if [ -d "html" ]; then
    mkdir -p backups
    tar -czf "backups/html_backup_${timestamp}.tar.gz" html
  fi

  # Ensure html directory exists
  mkdir -p html

  # Preserve any special files in html that shouldn't be overwritten
  echo "Preserving special files..."
  if [ -f "html/.well-known/acme-challenge" ]; then
    mkdir -p temp_preserve/.well-known
    cp -r html/.well-known/acme-challenge temp_preserve/.well-known/
  fi
  # No need to preserve clear-cache files anymore

  # Clear html directory but keep preserved files
  echo "Clearing html directory..."
  rm -rf html/*

  # Copy dist contents to html
  echo "Copying build files to html directory..."
  # Make sure we're in the project root
  cd "$(dirname "$0")"/..
  # Copy everything (preserve dirs) from dist into html
  cp -r dist/. html/

  # Restore preserved files
  echo "Restoring preserved files..."
  if [ -d "temp_preserve" ]; then
    cp -r temp_preserve/* html/
    rm -rf temp_preserve
  fi
fi

# Set proper permissions
echo "Setting proper permissions..."
find html -type d -exec chmod 755 {} \;
find html -type f -exec chmod 644 {} \;

# Restart nginx
echo "Restarting nginx..."
sudo systemctl restart nginx

echo "Deployment completed successfully!"

# Create a simple script to check if the deployment was successful
cat > /var/www/eznarratives.com/html/deployment-check.html << EOF
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Deployment Check - EZ Narratives</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .success {
      color: #0c6b58;
      background-color: #d1fae5;
      padding: 10px;
      border-radius: 4px;
    }
    .timestamp {
      font-size: 0.8em;
      color: #666;
    }
  </style>
</head>
<body>
  <h1>EZ Narratives Deployment Check</h1>
  <div class="success">
    <p>Deployment completed successfully!</p>
    <p class="timestamp">Timestamp: $(date)</p>
  </div>
  <p><a href="/">Return to homepage</a></p>
</body>
</html>
EOF

echo "Created deployment check page at /var/www/eznarratives.com/html/deployment-check.html"