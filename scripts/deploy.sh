#!/bin/bash

# EZ Narratives Deployment Script for Hostinger VPS
# This script builds the application and deploys it to the production directory

set -e  # Exit immediately if a command exits with a non-zero status

echo "Starting deployment process for EZ Narratives on Hostinger VPS..."

# Define variables
DEPLOY_DIR="/var/www/html"  # Standard Hostinger web directory
BACKUP_DIR="/var/www/backups"
APP_ENV="production"

# Check if we should skip the build process
if [ "$1" != "--skip-build" ]; then
  # Install dependencies if needed
  echo "Checking for dependencies..."
  npm ci --production

  # Set environment to production
  export NODE_ENV=production
  export APP_ENV=production

  # Build the application with PWA assets
  echo "Building application for production..."
  npm run build:with-pwa || {
    echo "Build with PWA failed. Trying standard build..."
    npm run build
  }
else
  echo "Skipping build process as requested..."
fi

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Backup current deployment
echo "Backing up current deployment..."
timestamp=$(date +%Y%m%d_%H%M%S)
if [ -d "$DEPLOY_DIR" ]; then
  tar -czf "$BACKUP_DIR/html_backup_${timestamp}.tar.gz" -C $DEPLOY_DIR .
fi

# Preserve any special files in the deployment directory that shouldn't be overwritten
echo "Preserving special files..."
if [ -d "$DEPLOY_DIR/.well-known" ]; then
  mkdir -p temp_preserve
  cp -r $DEPLOY_DIR/.well-known temp_preserve/
fi

# Clear deployment directory but keep preserved files
echo "Preparing deployment directory..."
find $DEPLOY_DIR -mindepth 1 -not -path "$DEPLOY_DIR/.well-known*" -delete

# Copy dist contents to deployment directory
echo "Copying build files to deployment directory..."
cp -r dist/. $DEPLOY_DIR/

# Restore preserved files
echo "Restoring preserved files..."
if [ -d "temp_preserve" ]; then
  cp -r temp_preserve/. $DEPLOY_DIR/
  rm -rf temp_preserve
fi

# Set proper permissions for Hostinger
echo "Setting proper permissions..."
find $DEPLOY_DIR -type d -exec chmod 755 {} \;
find $DEPLOY_DIR -type f -exec chmod 644 {} \;

# Create .htaccess file for SPA routing
echo "Creating .htaccess file for SPA routing..."
cat > $DEPLOY_DIR/.htaccess << EOF
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Enable GZIP compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Set caching headers
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/json "access plus 0 seconds"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>
EOF

# Restart Apache (Hostinger typically uses Apache)
echo "Restarting web server..."
if command -v systemctl &> /dev/null; then
  sudo systemctl restart apache2 || sudo systemctl restart httpd || echo "Could not restart Apache, may need manual restart"
else
  echo "systemctl not found, please restart the web server manually if needed"
fi

echo "Deployment completed successfully!"

# Create a deployment check page
cat > $DEPLOY_DIR/deployment-check.html << EOF
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
    .env {
      margin-top: 20px;
      padding: 10px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <h1>EZ Narratives Deployment Check</h1>
  <div class="success">
    <p>Deployment completed successfully on Hostinger VPS!</p>
    <p class="timestamp">Timestamp: $(date)</p>
  </div>
  <div class="env">
    <p>Environment: PRODUCTION</p>
    <p>Build Version: $(grep '"version"' package.json | cut -d'"' -f4)</p>
  </div>
  <p><a href="/">Return to homepage</a></p>
</body>
</html>
EOF

echo "Created deployment check page at $DEPLOY_DIR/deployment-check.html"

# Create a robots.txt file for production
cat > $DEPLOY_DIR/robots.txt << EOF
User-agent: *
Allow: /

# Disallow API endpoints
Disallow: /api/
EOF

echo "Created robots.txt for production"