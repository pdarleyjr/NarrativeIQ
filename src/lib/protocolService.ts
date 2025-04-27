import { supabase } from './supabase';

/**
 * Interface for protocol query response
 */
export interface ProtocolQueryResponse {
  question: string;
  snippets: Array<{
    id: string;
    content_id: string;
    title: string;
    content: string;
    source: string;
    similarity: number;
  }>;
}

/**
 * Query the protocol knowledge base with a specific question
 * @param question - The question to ask
 * @param sources - Array of selected source IDs
 * @param topK - Maximum number of results to return
 * @returns Promise with the query response
 */
export async function queryProtocol(
  question: string,
  sources: string[],
  topK: number = 5
): Promise<ProtocolQueryResponse> {
  try {
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('protocol-query', {
      body: {
        question,
        sources,
        topK
      }
    });

    if (error) {
      console.error('Error querying protocol:', error);
      throw error;
    }

    return data as ProtocolQueryResponse;
  } catch (error) {
    console.error('Error in queryProtocol:', error);
    throw error;
  }
}

/**
 * Format protocol snippets into a readable format
 * @param snippets - Array of protocol snippets
 * @returns Formatted string with the snippets
 */
export function formatProtocolSnippets(
  snippets: ProtocolQueryResponse['snippets']
): string {
  if (!snippets || snippets.length === 0) {
    return 'No relevant protocol information found.';
  }

  return snippets
    .map((snippet, index) => {
      const source = snippet.title ? `${snippet.title}` : 'Protocol';
      const similarity = Math.round(snippet.similarity * 100);
      
      return `[${index + 1}] ${source} (${similarity}% match):\n${snippet.content}\n`;
    })
    .join('\n');
}