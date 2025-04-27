/**
 * Database Connection Cleanup Script
 * 
 * This script removes temporary database connection files
 * that are not needed for regular development.
 * 
 * Usage: node cleanup.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Files to be removed
const filesToRemove = [
  'test-supabase-connection.js',
  'install-psql.ps1'
];

// Check if files exist and remove them
console.log('Cleaning up temporary database connection files...');

filesToRemove.forEach(file => {
  const filePath = path.join(projectRoot, file);
  
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`✓ Removed: ${file}`);
    } catch (err) {
      console.error(`✗ Error removing ${file}: ${err.message}`);
    }
  } else {
    console.log(`- Skipped: ${file} (not found)`);
  }
});

console.log('\nCleanup complete. Your project structure is now clean.');
console.log('Database connection details are preserved in .env.local (not committed to Git).');
console.log('Connection instructions are available in README-DB-CONNECTION.md');