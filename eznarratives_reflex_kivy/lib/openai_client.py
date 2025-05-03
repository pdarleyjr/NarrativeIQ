import os
import json
from typing import Dict, List, Any, Optional
from dotenv import load_dotenv
from openai import OpenAI

# Determine environment and load appropriate .env file
env = os.getenv("APP_ENV", "development")
env_file = ".env.production" if env == "production" else ".env.local"

# Load environment variables
if os.path.exists(env_file):
    load_dotenv(env_file)
else:
    # Fallback to .env.local if the specific environment file doesn't exist
    load_dotenv(".env.local")
    print(f"Warning: {env_file} not found, falling back to .env.local")

# Get OpenAI API key
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise RuntimeError("OPENAI_API_KEY is missing in environment variables")

# Initialize OpenAI client
client = OpenAI(api_key=api_key)

# Models
MODELS = {
    "CHAT": "gpt-4.1-nano",
    "EMBEDDING": os.getenv("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small")
}

async def generate_ems_narrative(form_data: Dict[str, Any], context_snippets: Optional[List[str]] = None) -> str:
    """Generate an EMS narrative using OpenAI.
    
    Args:
        form_data: Dictionary containing EMS form data
        context_snippets: Optional list of context snippets from knowledge base
        
    Returns:
        Generated narrative text
    """
    system_message = """
    You are an EMS narrative assistant. Generate a comprehensive NFIRS-compliant narrative 
    based on the provided run data.
    Use only the reference materials provided to inform your narrative. 
    Do not invent facts or procedures not mentioned in the reference materials.
    Format the narrative professionally and include all relevant details from the run data.
    """
    
    user_message = f"Run Data:\n{json.dumps(form_data, indent=2)}"
    
    if context_snippets and len(context_snippets) > 0:
        user_message += "\n\nReference Materials:\n" + "\n\n".join(context_snippets)
    
    try:
        response = await client.chat.completions.create(
            model=MODELS["CHAT"],
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
            max_tokens=1500
        )
        
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error generating narrative: {e}")
        raise

async def generate_fire_narrative(form_data: Dict[str, Any]) -> str:
    """Generate a Fire narrative using OpenAI.
    
    Args:
        form_data: Dictionary containing Fire form data
        
    Returns:
        Generated narrative text
    """
    system_message = """
    You are a Fire narrative assistant. Generate a comprehensive NFIRS-compliant fire incident narrative 
    based on the provided incident data.
    Format the narrative professionally and include all relevant details from the incident data.
    """
    
    user_message = f"Incident Data:\n{json.dumps(form_data, indent=2)}"
    
    try:
        response = await client.chat.completions.create(
            model=MODELS["CHAT"],
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
            max_tokens=1500
        )
        
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error generating fire narrative: {e}")
        raise

async def chat_completion(messages: List[Dict[str, str]], system_message: Optional[str] = None) -> str:
    """Generate a chat completion response.
    
    Args:
        messages: List of message dictionaries with role and content
        system_message: Optional system message to prepend
        
    Returns:
        Generated response text
    """
    try:
        formatted_messages = []
        
        if system_message:
            formatted_messages.append({"role": "system", "content": system_message})
            
        formatted_messages.extend(messages)
        
        response = await client.chat.completions.create(
            model=MODELS["CHAT"],
            messages=formatted_messages,
            temperature=0.7,
            max_tokens=1000
        )
        
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error in chat completion: {e}")
        raise

async def generate_embeddings(text: str) -> List[float]:
    """Generate embeddings for the given text.
    
    Args:
        text: Text to generate embeddings for
        
    Returns:
        List of embedding values
    """
    try:
        response = await client.embeddings.create(
            model=MODELS["EMBEDDING"],
            input=text
        )
        
        return response.data[0].embedding
    except Exception as e:
        print(f"Error generating embeddings: {e}")
        raise