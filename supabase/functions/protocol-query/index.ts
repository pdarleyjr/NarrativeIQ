import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.2.1';

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize OpenAI client
const configuration = new Configuration({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
});
const openai = new OpenAIApi(configuration);

// Define embedding model
const EMBEDDING_MODEL = Deno.env.get('OPENAI_EMBEDDING_MODEL') || 'text-embedding-3-small';

/**
 * Generate embeddings for a text string
 * @param text - The text to generate embeddings for
 * @returns A vector of embeddings
 */
async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.createEmbedding({
      model: EMBEDDING_MODEL,
      input: text,
    });
    
    return response.data.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

serve(async (req) => {
  try {
    // CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Content-Type': 'application/json',
    };

    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers });
    }

    // Parse request body
    const { question, sources, topK = 5 } = await req.json();

    // Validate request
    if (!question) {
      return new Response(
        JSON.stringify({ error: 'Question is required' }),
        { status: 400, headers }
      );
    }

    if (!sources || !Array.isArray(sources) || sources.length === 0) {
      return new Response(
        JSON.stringify({ error: 'At least one source must be selected' }),
        { status: 400, headers }
      );
    }

    // Generate embedding for the question
    const embedding = await generateEmbedding(question);

    // Query the database for similar embeddings
    const { data, error } = await supabase.rpc('match_embeddings', {
      query_embedding: embedding,
      match_threshold: 0.7,
      match_count: topK,
      source_filter: sources
    });

    if (error) {
      console.error('Error querying embeddings:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to query knowledge base' }),
        { status: 500, headers }
      );
    }

    // Return the results
    return new Response(
      JSON.stringify({
        question,
        snippets: data || [],
      }),
      { headers }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});