// Back-compat shim: some legacy modules import from "@/supabaseClient" or "../supabaseClient".
// The canonical client lives in src/lib/supabase.ts.

export { supabase } from "@/lib/supabase";
