
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_OPENAI_API_KEY: string;
  readonly OPENAI_EMBEDDING_MODEL: string;
  readonly VITE_OPENROUTER_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
