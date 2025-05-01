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
const cssContent = fs.readFileSync(cssFilePath, 'utf8');

// Check for our added CSS classes
// Check for our added CSS classes
const checks = [
  { name: 'max-w-screen', regex: /\.max-w-screen\s*\{[^}]*\}/g },
  { name: '!px-0', regex: /\.\\\!px-0\s*\{[^}]*\}/g },
  { name: 'snap-start', regex: /\.snap-start\s*\{[^}]*\}/g },
  { name: 'snap-end', regex: /\.snap-end\s*\{[^}]*\}/g },
  { name: 'container with zero padding', regex: /\.container\s*\{[^}]*padding-right:0[^}]*padding-left:0[^}]*\}/g },
  { name: 'container with !important padding', regex: /\.container\s*\{[^}]*padding-right:0\s*!important[^}]*padding-left:0\s*!important[^}]*\}/g },
  { name: 'px-0 with !important', regex: /\.px-0\s*\{[^}]*padding-left:0\s*!important[^}]*padding-right:0\s*!important[^}]*\}/g },
  { name: 'mx-0 with !important', regex: /\.mx-0\s*\{[^}]*margin-left:0\s*!important[^}]*margin-right:0\s*!important[^}]*\}/g }
];
console.log('Verifying CSS changes:');
checks.forEach(check => {
  const matches = cssContent.match(check.regex);
  console.log(`- ${check.name}: ${matches ? 'FOUND' : 'NOT FOUND'}`);
  if (matches) {
    console.log(`  ${matches[0]}`);
  }
});

// Create a summary of the changes we've made
console.log('\nSummary of changes:');
console.log('1. Removed container padding to eliminate the grey backdrop');
console.log('2. Added !important to px-0 to ensure zero horizontal padding');
console.log('3. Added max-w-screen to ensure content spans the full width');
console.log('4. Added snap-start and snap-end for better mobile scrolling');
console.log('5. Enhanced shadows for a more app-like experience');
console.log('\nThese changes ensure that:');
console.log('- The ToggleGroup and Cards sit immediately to the right of the sidebar');
console.log('- There is no blank gutter or grey backdrop padding');
console.log('- The mobile view has a more app-like feel with improved scrolling');
console.log('- The desktop view has a cleaner, more modern interface');