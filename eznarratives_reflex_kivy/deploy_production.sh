#!/bin/bash

# Production deployment script for EZ Narratives Reflex application
# This script deploys the Reflex application to a production environment

set -e  # Exit immediately if a command exits with a non-zero status

echo "Starting production deployment for EZ Narratives Reflex application..."

# Define variables
DEPLOY_DIR="/var/www/reflex"
BACKUP_DIR="/var/www/reflex_backups"
APP_ENV="production"
LOG_FILE="deploy_$(date +%Y%m%d_%H%M%S).log"

# Create log file
touch $LOG_FILE
exec > >(tee -a $LOG_FILE) 2>&1

echo "Deployment started at $(date)"
echo "Setting environment to PRODUCTION"

# Export environment variables
export APP_ENV=production
export NODE_ENV=production

# Check if Python virtual environment exists, create if not
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install or update dependencies
echo "Installing/updating dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Copy production configuration
echo "Setting up production configuration..."
if [ -f "rxconfig.production.py" ]; then
    cp rxconfig.production.py rxconfig.py
    echo "Production configuration applied."
else
    echo "Warning: rxconfig.production.py not found. Using existing configuration."
fi

# Copy production environment variables
echo "Setting up production environment variables..."
if [ -f "../.env.production" ]; then
    cp ../.env.production .env
    echo "Production environment variables applied."
else
    echo "Warning: ../.env.production not found. Using existing environment variables."
fi

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Backup current deployment if it exists
if [ -d "$DEPLOY_DIR" ]; then
    echo "Backing up current deployment..."
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    tar -czf "$BACKUP_DIR/reflex_backup_${TIMESTAMP}.tar.gz" -C $DEPLOY_DIR .
fi

# Build the application
echo "Building Reflex application for production..."
reflex build --production

# Create deployment directory if it doesn't exist
mkdir -p $DEPLOY_DIR

# Deploy the application
echo "Deploying application to $DEPLOY_DIR..."
cp -r build/* $DEPLOY_DIR/

# Set proper permissions
echo "Setting proper permissions..."
find $DEPLOY_DIR -type d -exec chmod 755 {} \;
find $DEPLOY_DIR -type f -exec chmod 644 {} \;

# Create or update systemd service file
echo "Setting up systemd service..."
cat > /tmp/eznarratives-reflex.service << EOF
[Unit]
Description=EZ Narratives Reflex Application
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=$DEPLOY_DIR
ExecStart=$DEPLOY_DIR/eznarratives
Restart=always
RestartSec=5
Environment="APP_ENV=production"

[Install]
WantedBy=multi-user.target
EOF

# Move service file to systemd directory and reload
sudo mv /tmp/eznarratives-reflex.service /etc/systemd/system/
sudo systemctl daemon-reload

# Start or restart the service
echo "Starting/restarting service..."
sudo systemctl restart eznarratives-reflex
sudo systemctl enable eznarratives-reflex

# Check service status
echo "Service status:"
sudo systemctl status eznarratives-reflex --no-pager

# Create a simple verification file
echo "Creating verification file..."
cat > $DEPLOY_DIR/deployment-info.txt << EOF
EZ Narratives Reflex Application
Deployment Timestamp: $(date)
Environment: PRODUCTION
Version: $(grep -m 1 "version" requirements.txt | cut -d'=' -f2 || echo "Unknown")
EOF

echo "Deployment completed successfully at $(date)"
echo "Log file: $LOG_FILE"

# Deactivate virtual environment
deactivate

# Print final message
echo "======================================================"
echo "EZ Narratives Reflex application deployed successfully!"
echo "Verify the deployment by checking the service status:"
echo "  sudo systemctl status eznarratives-reflex"
echo "======================================================"