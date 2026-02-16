import { createClient } from '@supabase/supabase-js';

// Retrieve variables with fallbacks to prevent top-level crashes
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

// Create the client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Log a clear diagnostic to the browser console
if (!import.meta.env.VITE_SUPABASE_URL) {
  console.error("🛑 CONFIG ERROR: VITE_SUPABASE_URL is missing in Vercel settings.");
}