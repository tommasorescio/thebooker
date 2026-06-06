import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://tuo-id-progetto.supabase.co') {
  console.error("ERRORE: Credenziali Supabase mancanti o non configurate in .env.local")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
