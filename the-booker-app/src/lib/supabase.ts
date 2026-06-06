import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY! // <-- Aggiornata con il nuovo nome moderno

// 1. Client per i Server Components
export async function createClientForServer() {
  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Gestione silenziosa per i Server Components puri
        }
      },
    },
  })
}

// 2. Client per i Client Components
export function createClientForBrowser() {
  return createBrowserClient(supabaseUrl, supabasePublishableKey)
}