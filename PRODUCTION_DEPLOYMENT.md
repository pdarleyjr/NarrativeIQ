# Production Deployment Guide for EZ Narratives on Hostinger VPS

This guide outlines the steps to deploy the EZ Narratives application to a Hostinger VPS for production use.

## Prerequisites

- A Hostinger VPS with SSH access
- Node.js 18+ and npm installed on the VPS
- Git installed on the VPS
- Nginx or Apache web server installed
- Domain name configured to point to your VPS IP address

## Initial Server Setup

1. **Update the server**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Install required packages**:
   ```bash
   sudo apt install -y nginx certbot python3-certbot-nginx
   ```

3. **Set up firewall**:
   ```bash
   sudo ufw allow 'Nginx Full'
   sudo ufw allow OpenSSH
   sudo ufw enable
   ```

## Deployment Steps

### 1. Clone the Repository

```bash
# Create the web directory if it doesn't exist
sudo mkdir -p /var/www

# Set proper ownership
sudo chown -R $USER:$USER /var/www

# Clone the repository
cd /var/www
git clone https://github.com/your-username/NarrativeIQ.git eznarratives.com
cd eznarratives.com
```

### 2. Set Up Environment Variables

```bash
# Copy the production environment file
cp .env.production .env
```

Ensure all sensitive keys and credentials in `.env.production` are properly set for your production environment.

### 3. Install Dependencies and Build

```bash
# Install production dependencies
npm ci --production

# Build the application with PWA support
NODE_ENV=production npm run build:with-pwa
```

### 4. Configure Web Server

#### For Nginx:

1. Copy the production Nginx configuration:
   ```bash
   sudo cp nginx.conf.production /etc/nginx/sites-available/eznarratives.com
   ```

2. Create a symbolic link to enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/eznarratives.com /etc/nginx/sites-enabled/
   ```

3. Test the configuration:
   ```bash
   sudo nginx -t
   ```

4. If the test is successful, restart Nginx:
   ```bash
   sudo systemctl restart nginx
   ```

#### For Apache:

1. Ensure the necessary modules are enabled:
   ```bash
   sudo a2enmod rewrite
   sudo a2enmod headers
   sudo a2enmod ssl
   ```

2. The deployment script will create the necessary `.htaccess` file for routing.

3. Restart Apache:
   ```bash
   sudo systemctl restart apache2
   ```

### 5. Set Up SSL Certificate

```bash
sudo certbot --nginx -d eznarratives.com -d www.eznarratives.com
```

Follow the prompts to complete the SSL certificate setup.

### 6. Run the Deployment Script

```bash
# Make the script executable
chmod +x scripts/deploy.sh

# Run the deployment script
./scripts/deploy.sh
```

### 7. Verify the Deployment

1. Visit your domain in a web browser to ensure the application is running correctly.
2. Check the deployment verification page at `https://yourdomain.com/deployment-check.html`.

## Setting Up Automatic Deployments (Optional)

### Using GitHub Actions

1. Create a `.github/workflows/deploy.yml` file with the following content:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up SSH
        uses: webfactory/ssh-agent@v0.7.0
        with:
          ssh-private-key: ${{ secrets.SSH_PRIVATE_KEY }}
          
      - name: Deploy to VPS
        run: |
          ssh -o StrictHostKeyChecking=no user@your-vps-ip "cd /var/www/eznarratives.com && git pull && ./scripts/deploy.sh"
```

2. Add your SSH private key to GitHub repository secrets as `SSH_PRIVATE_KEY`.

## Maintenance and Monitoring

### Log Rotation

Set up log rotation for your application logs:

```bash
sudo nano /etc/logrotate.d/eznarratives
```

Add the following configuration:

```
/var/www/eznarratives.com/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        systemctl reload nginx
    endscript
}
```

### Monitoring

Consider setting up monitoring for your VPS using tools like:

- Hostinger's built-in monitoring tools
- UptimeRobot for external monitoring
- Prometheus and Grafana for advanced monitoring

## Backup Strategy

1. **Database Backups**: Set up automated Supabase backups.
2. **File Backups**: The deployment script automatically creates backups before each deployment.
3. **Full Server Backups**: Use Hostinger's backup solutions or set up your own using tools like Duplicity or Restic.

## Troubleshooting

### Common Issues

1. **Application not loading**: Check Nginx/Apache error logs at `/var/log/nginx/error.log` or `/var/log/apache2/error.log`.
2. **API errors**: Check the Supabase dashboard for function errors.
3. **Permission issues**: Ensure proper file permissions with `sudo chown -R www-data:www-data /var/www/html`.

### Rollback Procedure

If a deployment fails, you can roll back to a previous version:

```bash
# Extract the backup
cd /var/www/backups
tar -xzf html_backup_TIMESTAMP.tar.gz -C /var/www/html
sudo systemctl restart nginx  # or apache2
```

## Security Best Practices

1. **Keep the server updated**: Regularly run `sudo apt update && sudo apt upgrade`.
2. **Secure SSH**: Disable password authentication and use key-based authentication only.
3. **Use a firewall**: Ensure UFW is properly configured.
4. **Regular security audits**: Periodically check for vulnerabilities.
5. **Monitor logs**: Regularly check server logs for suspicious activity.

## Performance Optimization

1. **Enable Gzip compression**: Already configured in the Nginx/Apache setup.
2. **Browser caching**: Already configured in the server setup.
3. **Content Delivery Network (CDN)**: Consider using Cloudflare or another CDN for static assets.
4. **Database optimization**: Regularly check and optimize Supabase queries.

---

For any issues or questions, please contact the development team.