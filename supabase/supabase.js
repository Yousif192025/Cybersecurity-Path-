import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

const supabaseUrl = "https://YOURPROJECT.supabase.co"
const supabaseKey = "YOUR_ANON_KEY"

export const supabase = createClient(supabaseUrl, supabaseKey)
