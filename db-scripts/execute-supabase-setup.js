/**
 * Execute Supabase Setup Script
 * 
 * This script executes the SQL setup directly in Supabase using the existing connection.
 * It will create all necessary tables, extensions, and functions for the knowledge base integration.
 * 
 * Usage: node execute-supabase-setup.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import pg from 'pg';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Supabase connection details
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const pgConnectionString = process.env.PG_CONNECTION_STRING;

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables. Please check your .env.local file.');
  process.exit(1);
}

if (!pgConnectionString) {
  console.error('❌ Missing PostgreSQL connection string. Please check your .env.local file.');
  process.exit(1);
}

console.log('🔍 Setting up Supabase database...');

// Create PostgreSQL client for direct SQL execution
const client = new pg.Client(pgConnectionString);

async function executeSetup() {
  try {
    // Connect to the database
    await client.connect();
    console.log('✅ Connected to Supabase PostgreSQL database');
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'supabase-setup.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Execute all statements in the SQL file at once
    await client.query(sql);
    console.log('✅ Executed SQL setup file');
    
    console.log('🎉 Database setup complete!');
    
    // Verify the tables were created
    const { rows: tables } = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('knowledge_base_embeddings', 'knowledge_base_sources', 'user_kb_preferences');
    `);
    
    console.log('\n📋 Verification:');
    console.log(`- knowledge_base_embeddings: ${tables.some(t => t.table_name === 'knowledge_base_embeddings') ? '✅' : '❌'}`);
    console.log(`- knowledge_base_sources: ${tables.some(t => t.table_name === 'knowledge_base_sources') ? '✅' : '❌'}`);
    console.log(`- user_kb_preferences: ${tables.some(t => t.table_name === 'user_kb_preferences') ? '✅' : '❌'}`);
    
    // Verify the pgvector extension
    const { rows: extensions } = await client.query(`
      SELECT extname FROM pg_extension WHERE extname = 'vector';
    `);
    
    console.log(`- pgvector extension: ${extensions.length > 0 ? '✅' : '❌'}`);
    
    // Verify the functions
    const { rows: functions } = await client.query(`
      SELECT proname FROM pg_proc 
      WHERE proname IN ('match_embeddings', 'create_match_embeddings_procedure')
      AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
    `);
    
    console.log(`- match_embeddings function: ${functions.some(f => f.proname === 'match_embeddings') ? '✅' : '❌'}`);
    console.log(`- create_match_embeddings_procedure function: ${functions.some(f => f.proname === 'create_match_embeddings_procedure') ? '✅' : '❌'}`);
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
  } finally {
    // Close the database connection
    await client.end();
  }
}

// Run the setup
executeSetup().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});