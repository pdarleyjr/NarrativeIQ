
import OpenAI from 'openai';

const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
const embeddingModel = import.meta.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';

if (!openaiApiKey) {
  console.error('OpenAI API key is missing. Please ensure you have:');
  console.error('1. Created a .env.production file with VITE_OPENAI_API_KEY');
  console.error('2. Or set this environment variable through your hosting provider');
  throw new Error('OpenAI API key is missing. Ensure VITE_OPENAI_API_KEY is set in .env.production');
}

const openai = new OpenAI({
  apiKey: openaiApiKey,
  dangerouslyAllowBrowser: true
});

export const MODELS = {
  EMBEDDING: embeddingModel,
  CHAT: 'gpt-4.1-nano',
};

export const isOpenAIConfigured = () => {
  return !!openaiApiKey;
};

/**
 * Generate embeddings for a text string
 * @param text - The text to generate embeddings for
 * @returns A vector of embeddings
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  if (!isOpenAIConfigured()) {
    throw new Error('OpenAI is not properly configured. Please check your API key configuration.');
  }

  try {
    const response = await openai.embeddings.create({
      model: MODELS.EMBEDDING,
      input: text,
    });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Generate a narrative using GPT-4.1 nano
 * @param runInfo - Information about the EMS run
 * @param contextSnippets - Relevant context snippets from the knowledge base
 * @returns Generated narrative text
 */
export async function generateNarrative(
  runInfo: string, 
  contextSnippets: string[]
): Promise<string> {
  if (!isOpenAIConfigured()) {
    return "Error: OpenAI is not properly configured. Please check your API key configuration.";
  }

  try {
    const systemMessage = `
      You are an EMS narrative assistant. Generate a comprehensive NFIRS-compliant narrative based on the provided run data.
      Use only the reference materials provided to inform your narrative. Do not invent facts or procedures not mentioned in the reference materials.
      Format the narrative professionally and include all relevant details from the run data.
    `;

    const userMessage = `
      Run Data:
      ${runInfo}

      Reference Materials:
      ${contextSnippets.join('\n\n')}
    `;

    const response = await openai.chat.completions.create({
      model: MODELS.CHAT,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 1500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    return response.choices[0].message.content || 'Unable to generate narrative';
  } catch (error) {
    console.error('Error generating narrative:', error);
    return `Error generating narrative: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

/**
 * Generate a narrative with web search when no knowledge base is selected
 * @param runInfo - Information about the EMS run
 * @returns Generated narrative text
 */
export async function generateNarrativeWithWebSearch(runInfo: string): Promise<string> {
  if (!isOpenAIConfigured()) {
    return "Error: OpenAI is not properly configured. Please check your API key configuration.";
  }

  try {
    const systemMessage = `
      You are an EMS narrative assistant. Generate a comprehensive NFIRS-compliant narrative based on the provided run data.
      Use your knowledge of EMS protocols and best practices to create an accurate and professional narrative.
      Format the narrative professionally and include all relevant details from the run data.
    `;

    const response = await openai.chat.completions.create({
      model: MODELS.CHAT,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: `Run Data:\n${runInfo}` }
      ],
      temperature: 0.7,
      max_tokens: 1500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    return response.choices[0].message.content || 'Unable to generate narrative';
  } catch (error) {
    console.error('Error generating narrative with web search:', error);
    return `Error generating narrative: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

export default openai;
