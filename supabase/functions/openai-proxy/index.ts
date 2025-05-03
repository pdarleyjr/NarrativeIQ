import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.2.1';

// Initialize OpenAI client
const configuration = new Configuration({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
});
const openai = new OpenAIApi(configuration);

// Define models
const MODELS = {
  EMBEDDING: Deno.env.get('OPENAI_EMBEDDING_MODEL') || 'text-embedding-3-small',
  CHAT: 'gpt-4.1-nano',
};

// Exponential backoff function for retrying API calls
async function withExponentialBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 5,
  initialDelay = 1000
): Promise<T> {
  let retries = 0;
  let delay = initialDelay;

  while (true) {
    try {
      return await fn();
    } catch (error) {
      if (
        error.response?.status === 429 || // Rate limit
        error.response?.status === 500 || // Server error
        error.response?.status === 503 || // Service unavailable
        error.code === 'ECONNRESET' ||
        error.code === 'ETIMEDOUT'
      ) {
        retries++;
        if (retries > maxRetries) {
          throw error;
        }
        
        // Calculate delay with exponential backoff and jitter
        delay = delay * 2 * (0.5 + Math.random() * 0.5);
        console.log(`Retrying after ${delay}ms (attempt ${retries}/${maxRetries})...`);
        
        // Wait for the delay
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      throw error;
    }
  }
}

serve(async (req) => {
  try {
    // Get the origin from the request
    const origin = req.headers.get('origin') || '*';
    
    // Production CORS headers - restrict to specific domains
    const headers = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Credentials': 'true',
      'Content-Type': 'application/json',
    };

    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers });
    }

    // Parse request body
    const { action, ...params } = await req.json();

    // Handle different actions
    switch (action) {
      case 'generate-embedding': {
        const { text } = params;
        if (!text) {
          return new Response(
            JSON.stringify({ error: 'Text is required' }),
            { status: 400, headers }
          );
        }

        const response = await withExponentialBackoff(() => 
          openai.createEmbedding({
            model: MODELS.EMBEDDING,
            input: text,
          })
        );

        return new Response(
          JSON.stringify({ embedding: response.data.data[0].embedding }),
          { headers }
        );
      }

      case 'generate-narrative': {
        const { runInfo, contextSnippets = [] } = params;
        if (!runInfo) {
          return new Response(
            JSON.stringify({ error: 'Run info is required' }),
            { status: 400, headers }
          );
        }

        const systemMessage = `
### System
You are an EMS narrative assistant. Generate a comprehensive NFIRS-compliant narrative based on the provided run data.
Use only the reference materials provided to inform your narrative. Do not invent facts or procedures not mentioned in the reference materials.
Format the narrative professionally and include all relevant details from the run data.
`;

        const userMessage = `
### User
Run Data:
${runInfo}

Reference Materials:
${contextSnippets.join('\n\n')}
`;

        const response = await withExponentialBackoff(() => 
          openai.createChatCompletion({
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
          })
        );

        return new Response(
          JSON.stringify({ narrative: response.data.choices[0].message?.content || 'Unable to generate narrative' }),
          { headers }
        );
      }

      case 'generate-narrative-web-search': {
        const { runInfo } = params;
        if (!runInfo) {
          return new Response(
            JSON.stringify({ error: 'Run info is required' }),
            { status: 400, headers }
          );
        }

        const systemMessage = `
### System
You are an EMS narrative assistant. Generate a comprehensive NFIRS-compliant narrative based on the provided run data.
Use your knowledge of EMS protocols and best practices to create an accurate and professional narrative.
Format the narrative professionally and include all relevant details from the run data.
`;

        const userMessage = `
### User
Run Data:
${runInfo}
`;

        const response = await withExponentialBackoff(() => 
          openai.createChatCompletion({
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
          })
        );

        return new Response(
          JSON.stringify({ narrative: response.data.choices[0].message?.content || 'Unable to generate narrative' }),
          { headers }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers }
        );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});