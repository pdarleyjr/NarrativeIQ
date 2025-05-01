#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the CSS file - updated with the new filename
const cssFilePath = path.join(__dirname, 'dist/assets/index-XGI0GARC.css');

// Read the CSS file
let cssContent = fs.readFileSync(cssFilePath, 'utf8');

// Define the CSS optimizations we want to apply
const optimizations = [
  // Remove container padding - more specific targeting
  {
    search: /\.container\s*\{[^}]*padding-right:2rem;padding-left:2rem;[^}]*\}/g,
    replace: match => {
      return match.replace(/padding-right:2rem;padding-left:2rem;/, 'padding-right:0;padding-left:0;');
    }
  },
  // Alternative approach for container padding
  {
    search: /\.container\s*\{([^}]*)\}/g,
    replace: (match, p1) => {
      return `.container{${p1.replace(/padding-right:[^;]+;/g, 'padding-right:0;').replace(/padding-left:[^;]+;/g, 'padding-left:0;')}}`;
    }
  }
];

// Apply optimizations
optimizations.forEach(opt => {
  cssContent = cssContent.replace(opt.search, opt.replace);
});

// Add any missing CSS classes or override existing ones
const additionalCSS = `
/* Additional optimizations for IntegratedDashboard */
.container{width:100%;margin-right:auto;margin-left:auto;padding-right:0 !important;padding-left:0 !important;}
.px-0{padding-left:0 !important;padding-right:0 !important;}
.mx-0{margin-left:0 !important;margin-right:0 !important;}
.max-w-screen{max-width:100vw !important;}
.\\!px-0{padding-left:0 !important;padding-right:0 !important;}
`;

// Append additional CSS
cssContent += additionalCSS;

// Write the optimized CSS back to the file
fs.writeFileSync(cssFilePath, cssContent);

console.log('CSS optimization completed successfully!');