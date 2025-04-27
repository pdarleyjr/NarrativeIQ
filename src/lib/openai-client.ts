import { supabase } from './supabase';

/**
 * Generate embeddings for a text string using the server-side OpenAI proxy
 * @param text - The text to generate embeddings for
 * @returns A vector of embeddings
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const { data, error } = await supabase.functions.invoke('openai-proxy', {
      body: {
        action: 'generate-embedding',
        text
      }
    });

    if (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }

    return data.embedding;
  } catch (error) {
    console.error('Error in generateEmbedding:', error);
    throw error;
  }
}

/**
 * Generate a narrative using GPT-4.1 nano via the server-side OpenAI proxy
 * @param runInfo - Information about the EMS run
 * @param contextSnippets - Relevant context snippets from the knowledge base
 * @returns Generated narrative text
 */
export async function generateNarrative(
  runInfo: string, 
  contextSnippets: string[]
): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('openai-proxy', {
      body: {
        action: 'generate-narrative',
        runInfo,
        contextSnippets
      }
    });

    if (error) {
      console.error('Error generating narrative:', error);
      throw error;
    }

    return data.narrative;
  } catch (error) {
    console.error('Error in generateNarrative:', error);
    return `Error generating narrative: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

/**
 * Generate a narrative with web search when no knowledge base is selected
 * @param runInfo - Information about the EMS run
 * @returns Generated narrative text
 */
export async function generateNarrativeWithWebSearch(runInfo: string): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('openai-proxy', {
      body: {
        action: 'generate-narrative-web-search',
        runInfo
      }
    });

    if (error) {
      console.error('Error generating narrative with web search:', error);
      throw error;
    }

    return data.narrative;
  } catch (error) {
    console.error('Error in generateNarrativeWithWebSearch:', error);
    return `Error generating narrative: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

export const MODELS = {
  EMBEDDING: 'text-embedding-3-small',
  CHAT: 'gpt-4.1-nano',
};