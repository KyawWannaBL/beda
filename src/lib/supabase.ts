import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined

// Prefer NEW publishable key (sb_publishable_...). Fall back to older env names.
const supabaseKey =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  (import.meta.env.VITE_SUPABASE_KEY as string | undefined)

if (!supabaseUrl || !supabaseKey) {
  // Don’t hard-crash at import time; surface a clear error in the console.
  // (Login will fail with a 401 otherwise.)
  console.error(
    '[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY. ' +
      'Create .env.local from .env.example. If your project has "Legacy API keys disabled", ' +
      'you MUST use the Publishable key (sb_publishable_...).',
  )
}

export const supabase = createClient(supabaseUrl ?? '', supabaseKey ?? '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
