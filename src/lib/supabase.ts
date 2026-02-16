import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Provide a fallback or log a clear error to prevent silent boot-up failure
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('CRITICAL: Supabase environment variables are missing. App will fail to load.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);

/**
 * Handles OAuth/Magic Link redirection code exchange.
 * Vital for successful login flow on Vercel.
 */
export async function exchangeCodeForSessionFromUrl(): Promise<boolean> {
  const url = new URL(window.location.href);
  const code = url.searchParams.get('code');
  if (!code) return false;

  try {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;

    // Clean URL after exchange to prevent session re-hydration issues
    url.searchParams.delete('code');
    url.searchParams.delete('state');
    window.history.replaceState({}, document.title, url.toString());
    return true;
  } catch (err) {
    console.error("Auth Code Exchange Error:", err);
    return false;
  }
}