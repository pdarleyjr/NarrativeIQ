import { supabase } from './supabase';
import { generateEmbedding } from './openai-client';
import fs from 'fs';
import path from 'path';

/**
 * Interface for knowledge base source
 */
export interface KnowledgeBaseSource {
  id: string;
  name: string;
  description: string | null;
  file_path: string;
  is_enabled: boolean;
}

/**
 * Interface for knowledge base embedding
 */
export interface KnowledgeBaseEmbedding {
  id: string;
  content_id: string;
  title: string;
  content: string;
  embedding: number[];
  source: string;
}

/**
 * Interface for user knowledge base preferences
 */
export interface UserKbPreferences {
  user_id: string;
  selected_sources: string[];
  use_web_search: boolean;
}

/**
 * Get all available knowledge base sources
 */
export async function getKnowledgeBaseSources(): Promise<KnowledgeBaseSource[]> {
  const { data, error } = await supabase
    .from('knowledge_base_sources')
    .select('*')
    .eq('is_enabled', true);

  if (error) {
    console.error('Error fetching knowledge base sources:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get user's knowledge base preferences
 * @param userId - The user's ID
 */
export async function getUserKbPreferences(userId: string): Promise<UserKbPreferences | null> {
  const { data, error } = await supabase
    .from('user_kb_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    console.error('Error fetching user KB preferences:', error);
    throw error;
  }

  return data;
}

/**
 * Save user's knowledge base preferences
 * @param userId - The user's ID
 * @param selectedSources - Array of selected source IDs
 * @param useWebSearch - Whether to use web search
 */
export async function saveUserKbPreferences(
  userId: string,
  selectedSources: string[],
  useWebSearch: boolean
): Promise<void> {
  const { data, error } = await supabase
    .from('user_kb_preferences')
    .upsert({
      user_id: userId,
      selected_sources: selectedSources,
      use_web_search: useWebSearch,
      updated_at: new Date().toISOString()
    });

  if (error) {
    console.error('Error saving user KB preferences:', error);
    throw error;
  }
}

/**
 * Search for relevant content in the knowledge base
 * @param query - The search query
 * @param selectedSources - Array of selected source IDs
 * @param limit - Maximum number of results to return
 */
export async function searchKnowledgeBase(
  query: string,
  selectedSources: string[],
  limit: number = 5
): Promise<string[]> {
  try {
    // Generate embedding for the query
    const embedding = await generateEmbedding(query);
    
    // Get source file paths for the selected sources
    const { data: sourcesData } = await supabase
      .from('knowledge_base_sources')
      .select('file_path')
      .in('id', selectedSources);
    
    if (!sourcesData || sourcesData.length === 0) {
      return [];
    }
    
    // Search for similar embeddings
    const { data, error } = await supabase.rpc('match_embeddings', {
      query_embedding: embedding,
      match_threshold: 0.7,
      match_count: limit,
      source_filter: selectedSources
    });
    
    if (error) {
      console.error('Error searching knowledge base:', error);
      throw error;
    }
    
    // Extract content from the results
    return data.map((item: any) => item.content);
  } catch (error) {
    console.error('Error in searchKnowledgeBase:', error);
    throw error;
  }
}

/**
 * Process and embed a knowledge base file
 * @param filePath - Path to the JSON file
 * @param source - Source identifier
 */
export async function processKnowledgeBaseFile(filePath: string, source: string): Promise<void> {
  try {
    // Read the JSON file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    // Process each item in the file
    for (const item of data) {
      // Generate embedding for the content
      const content = item.text || item.content || '';
      const title = item.title || '';
      const contentId = item.chunk_id || item.id || '';
      
      if (!content) continue;
      
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
        console.error(`Error storing embedding for ${contentId}:`, error);
      }
    }
    
    console.log(`Successfully processed ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    throw error;
  }
}

/**
 * Create a stored procedure for vector similarity search
 */
export async function createMatchEmbeddingsProcedure(): Promise<void> {
  const { error } = await supabase.rpc('create_match_embeddings_procedure');
  
  if (error) {
    console.error('Error creating match_embeddings procedure:', error);
    throw error;
  }
}

/**
 * Initialize the knowledge base by processing all source files
 */
export async function initializeKnowledgeBase(): Promise<void> {
  try {
    // Create the stored procedure for similarity search
    await createMatchEmbeddingsProcedure();
    
    // Get all knowledge base sources
    const sources = await getKnowledgeBaseSources();
    
    // Process each source file
    for (const source of sources) {
      await processKnowledgeBaseFile(source.file_path, source.id);
    }
    
    console.log('Knowledge base initialization complete');
  } catch (error) {
    console.error('Error initializing knowledge base:', error);
    throw error;
  }
}