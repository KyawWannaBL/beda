import { createClient } from '@supabase/supabase-js'

/**
 * Environment Variables (Vite)
 * Must start with VITE_
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Fail fast if env is missing
 * Prevents silent black screen issues
 */
if (!supabaseUrl) {
  throw new Error(
    'Missing VITE_SUPABASE_URL. Check your .env file and restart the dev server.'
  )
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_ANON_KEY. Check your .env file and restart the dev server.'
  )
}

/**
 * Create Supabase client
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export default supabase
