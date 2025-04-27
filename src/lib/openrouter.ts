
import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

if (!apiKey) {
  console.error('OpenRouter API key is missing. Please ensure you have:');
  console.error('1. Created a .env.production file with VITE_OPENROUTER_API_KEY');
  console.error('2. Or set this environment variable through your hosting provider');
  throw new Error('OpenRouter API key is missing. Ensure VITE_OPENROUTER_API_KEY is set in .env.production');
}

const openrouter = new OpenAI({
  apiKey,
  baseURL: 'https://openrouter.ai/api/v1',
  dangerouslyAllowBrowser: true,
});

export const OPENROUTER_MODELS = {
  CHAT: 'openai/gpt-4-turbo', // Default model, can be changed as needed
};

/**
 * Generate a narrative using OpenRouter
 * @param runInfo - Information about the EMS run
 * @param contextSnippets - Relevant context snippets from the knowledge base
 * @returns Generated narrative text
 */
export async function generateNarrativeWithOpenRouter(
  runInfo: string, 
  contextSnippets: string[]
): Promise<string> {
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

    const response = await openrouter.chat.completions.create({
      model: OPENROUTER_MODELS.CHAT,
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
    console.error('Error generating narrative with OpenRouter:', error);
    throw error;
  }
}

/**
 * Generate a narrative with web search when no knowledge base is selected
 * @param runInfo - Information about the EMS run
 * @returns Generated narrative text
 */
export async function generateNarrativeWithWebSearchOpenRouter(runInfo: string): Promise<string> {
  try {
    const systemMessage = `
      You are an EMS narrative assistant. Generate a comprehensive NFIRS-compliant narrative based on the provided run data.
      Use your knowledge of EMS protocols and best practices to create an accurate and professional narrative.
      Format the narrative professionally and include all relevant details from the run data.
    `;

    const response = await openrouter.chat.completions.create({
      model: OPENROUTER_MODELS.CHAT,
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
    console.error('Error generating narrative with web search using OpenRouter:', error);
    throw error;
  }
}

export default openrouter;
