
import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Better error message for missing configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration is missing. Please ensure you have:');
  console.error('1. Created a .env.production file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  console.error('2. Or set these environment variables through your hosting provider');
  throw new Error('Supabase configuration is missing. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env.production');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check Supabase configuration
export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey;
};
