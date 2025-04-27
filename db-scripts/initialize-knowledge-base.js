/**
 * Knowledge Base Initialization Script
 * 
 * This script processes the knowledge base JSON files and creates embeddings
 * for use with the RAG system. It should be run once to set up the knowledge base.
 * 
 * Usage: node initialize-knowledge-base.js
 */

import { createClient } from '@supabase/supabase-js';
import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Supabase connection details
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const pgConnectionString = process.env.PG_CONNECTION_STRING;

// OpenAI API key
const openaiApiKey = process.env.VITE_OPENAI_API_KEY;

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables. Please check your .env.local file.');
  process.exit(1);
}

if (!openaiApiKey) {
  console.error('❌ Missing OpenAI API key. Please check your .env.local file.');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create OpenAI client
const openai = new OpenAI({
  apiKey: openaiApiKey
});

// Knowledge base files
const knowledgeBaseDir = path.join(__dirname, '..', 'src', 'data', 'knowledge-base');
const knowledgeBaseFiles = [
  {
    path: path.join(knowledgeBaseDir, 'ems_guidelines.json'),
    source: 'national-ems-guidelines'
  },
  {
    path: path.join(knowledgeBaseDir, 'ems_guidelines_chunks.json'),
    source: 'national-ems-guidelines-chunks'
  },
  {
    path: path.join(knowledgeBaseDir, 'South_FL_Regional_ems_protocols.json'),
    source: 'south-fl-regional-protocols'
  }
];

/**
 * Generate embeddings for a text string
 * @param {string} text - The text to generate embeddings for
 * @returns {Promise<number[]>} A vector of embeddings
 */
async function generateEmbedding(text) {
  try {
        const model = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';
        const response = await openai.embeddings.create({
          model,
          input: text,
        });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Process a knowledge base file and create embeddings
 * @param {string} filePath - Path to the JSON file
 * @param {string} source - Source identifier
 */
async function processKnowledgeBaseFile(filePath, source) {
  console.log(`\n📄 Processing ${path.basename(filePath)}...`);
  
  try {
    // Read the JSON file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    console.log(`Found ${data.length} items to process`);
    
    // Process each item in batches to avoid rate limiting
    const batchSize = 10;
    let processedCount = 0;
    
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      
      // Process items in parallel
      await Promise.all(batch.map(async (item) => {
        // Extract content and metadata
        const content = item.text || item.content || '';
        const title = item.title || '';
        const contentId = item.chunk_id || item.id || `${source}-${processedCount}`;
        
        if (!content) return;
        
        try {
          // Generate embedding
          const embedding = await generateEmbedding(content);
          
          // Store in the database
          const { error } = await supabase
            .from('knowledge_base_embeddings')
            .upsert({
              content_id: `${source}-${contentId}`,
              title,
              content,
              embedding,
              source
            });
          
          if (error) {
            console.error(`❌ Error storing embedding for ${contentId}:`, error.message);
          } else {
            processedCount++;
          }
        } catch (error) {
          console.error(`❌ Error processing item ${contentId}:`, error.message);
        }
      }));
      
      console.log(`Progress: ${Math.min(i + batchSize, data.length)}/${data.length} items processed`);
    }
    
    console.log(`✅ Successfully processed ${processedCount} items from ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

/**
 * Create the stored procedure for vector similarity search
 */
async function createMatchEmbeddingsProcedure() {
  console.log('\n🔍 Creating match_embeddings procedure...');
  
  try {
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'create-match-embeddings-procedure.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Execute the SQL
    const { error } = await supabase.rpc('create_match_embeddings_procedure');
    
    if (error) {
      console.error('❌ Error creating match_embeddings procedure:', error.message);
    } else {
      console.log('✅ match_embeddings procedure created successfully');
    }
  } catch (error) {
    console.error('❌ Error creating match_embeddings procedure:', error.message);
  }
}

/**
 * Initialize the knowledge base
 */
async function initializeKnowledgeBase() {
  console.log('🚀 Initializing knowledge base...');
  
  try {
    // Create the stored procedure for similarity search
    await createMatchEmbeddingsProcedure();
    
    // Process each knowledge base file
    for (const file of knowledgeBaseFiles) {
      await processKnowledgeBaseFile(file.path, file.source);
    }
    
    console.log('\n🎉 Knowledge base initialization complete!');
  } catch (error) {
    console.error('❌ Error initializing knowledge base:', error.message);
    process.exit(1);
  }
}

// Run the initialization
initializeKnowledgeBase().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});