#!/usr/bin/env node

/**
 * Icon and Splash Screen Generator for EZ Narratives
 * 
 * This script uses the 'sharp' library to generate all required app icons and splash screens
 * from a master logo source file.
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SOURCE_LOGO = path.join(__dirname, '../src/assets/logo-source.png');
const ICONS_DIR = path.join(__dirname, '../public/icons');
const SPLASH_DIR = path.join(__dirname, '../public/splash');
const BACKGROUND_COLOR = '#4f46e5'; // Indigo color from the theme

// Ensure directories exist
[ICONS_DIR, SPLASH_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Check if source logo exists
if (!fs.existsSync(SOURCE_LOGO)) {
  console.error(`Error: Source logo not found at ${SOURCE_LOGO}`);
  console.log('Please ensure the logo file exists at src/assets/logo-source.png');
  process.exit(1);
}

// Icon sizes to generate
const iconSizes = [
  { name: 'icon-72x72.png', size: 72 },
  { name: 'icon-96x96.png', size: 96 },
  { name: 'icon-128x128.png', size: 128 },
  { name: 'icon-144x144.png', size: 144 },
  { name: 'icon-152x152.png', size: 152 },
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-384x384.png', size: 384 },
  { name: 'icon-512x512.png', size: 512 },
  { name: 'apple-touch-icon-152x152.png', size: 152 },
  { name: 'apple-touch-icon-167x167.png', size: 167 },
  { name: 'apple-touch-icon-180x180.png', size: 180 },
  { name: 'badge-72x72.png', size: 72 },
  { name: 'shortcut-dashboard.png', size: 192 },
  { name: 'shortcut-new.png', size: 192 }
];

// Splash screen sizes to generate
const splashSizes = [
  { name: 'apple-splash-2048-2732.png', width: 2048, height: 2732 },
  { name: 'apple-splash-1668-2388.png', width: 1668, height: 2388 },
  { name: 'apple-splash-1536-2048.png', width: 1536, height: 2048 },
  { name: 'apple-splash-1125-2436.png', width: 1125, height: 2436 },
  { name: 'apple-splash-750-1334.png', width: 750, height: 1334 },
  { name: 'apple-splash-640-1136.png', width: 640, height: 1136 }
];

// Function to generate an icon
async function generateIcon(sourcePath, outputPath, size, padding = 0) {
  try {
    // Calculate padding
    const paddingSize = Math.floor(size * padding);
    const imageSize = size - (paddingSize * 2);
    
    await sharp(sourcePath)
      .resize(imageSize, imageSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .extend({
        top: paddingSize,
        bottom: paddingSize,
        left: paddingSize,
        right: paddingSize,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(outputPath);
    
    console.log(`Generated: ${path.basename(outputPath)} (${size}x${size})`);
  } catch (error) {
    console.error(`Error generating ${outputPath}:`, error);
  }
}

// Function to generate a splash screen
async function generateSplashScreen(sourcePath, outputPath, width, height) {
  try {
    // Parse background color
    const hex = BACKGROUND_COLOR.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Calculate logo size (40% of the smallest dimension)
    const logoSize = Math.floor(Math.min(width, height) * 0.4);
    
    // Create a blank canvas with the background color
    const canvas = sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { r, g, b, alpha: 255 }
      }
    });
    
    // Resize the logo
    const logo = await sharp(sourcePath)
      .resize(logoSize, logoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();
    
    // Composite the logo onto the center of the canvas
    await canvas
      .composite([{
        input: logo,
        gravity: 'center'
      }])
      .png()
      .toFile(outputPath);
    
    console.log(`Generated: ${path.basename(outputPath)} (${width}x${height})`);
  } catch (error) {
    console.error(`Error generating ${outputPath}:`, error);
  }
}

// Main function to generate all assets
async function generateAllAssets() {
  console.log('Starting asset generation...');
  
  // Generate icons
  console.log('\nGenerating icons...');
  const iconPromises = iconSizes.map(icon => {
    const outputPath = path.join(ICONS_DIR, icon.name);
    // Add padding for badge and shortcut icons
    const padding = icon.name.includes('badge') ? 0.15 : 
                   icon.name.includes('shortcut') ? 0.1 : 0;
    return generateIcon(SOURCE_LOGO, outputPath, icon.size, padding);
  });
  
  // Generate splash screens
  console.log('\nGenerating splash screens...');
  const splashPromises = splashSizes.map(splash => {
    const outputPath = path.join(SPLASH_DIR, splash.name);
    return generateSplashScreen(SOURCE_LOGO, outputPath, splash.width, splash.height);
  });
  
  // Wait for all generation to complete
  await Promise.all([...iconPromises, ...splashPromises]);
  
  console.log('\nAsset generation completed successfully!');
}

// Run the main function
generateAllAssets().catch(error => {
  console.error('Error during asset generation:', error);
  process.exit(1);
});