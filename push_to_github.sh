#!/bin/bash

# Script to push all production configuration changes to GitHub

echo "Pushing production configuration changes to GitHub..."

# Add all modified and new files
git add .

# Commit the changes
git commit -m "Configure project for production deployment on Hostinger VPS

- Added .env.production with production environment variables
- Enhanced Vite configuration for production builds
- Updated Reflex application to support production environment
- Created deployment scripts for Hostinger VPS
- Added Nginx configuration for production
- Created GitHub Actions workflow for automated deployments
- Added comprehensive deployment documentation
- Enhanced security and performance settings"

# Push to GitHub
git push origin main

echo "All changes have been pushed to GitHub successfully!"