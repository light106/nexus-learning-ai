import { createClient } from '@supabase/supabase-js';

// Access environment variables securely
// We use process.env variables first because they are explicitly defined/replaced in vite.config.ts
// We use optional chaining for import.meta.env to prevent "cannot access property of undefined" errors
const supabaseUrl = process.env.VITE_SUPABASE_URL || (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Authentication will not work.');
}

// Create the client with the provided credentials or fallbacks to prevent runtime crashes
// 'https://placeholder.supabase.co' is used to satisfy the URL requirement if the env var is missing
// We explicitly check for empty strings to ensure the fallback is used
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
