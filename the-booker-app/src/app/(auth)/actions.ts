'use server'

import { createClientForServer } from '@/lib/supabase' 
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

async function getTrueOrigin() {
  const headersList = await headers()
  
  // GitHub Codespaces usa questo header per mostrare il vero URL esterno
  const forwardedHost = headersList.get('x-forwarded-host') 
  const host = forwardedHost || headersList.get('host') || 'localhost:3000'
  
  // Se siamo su GitHub usiamo https, se siamo in locale su HTTP standard
  const protocol = forwardedHost ? 'https' : 'http' 
  
  return `${protocol}://${host}`
}

export async function login(formData: FormData) {
  const supabase = await createClientForServer()
  const trueOrigin = await getTrueOrigin()

  const email = (formData.get('email') as string).trim().toLowerCase()
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect(`${trueOrigin}/login?error=${encodeURIComponent(error.message)}`)
  }

  return redirect(`${trueOrigin}/callback`) 
}

export async function signup(formData: FormData) {
  const supabase = await createClientForServer()
  const trueOrigin = await getTrueOrigin()

  const email = (formData.get('email') as string).trim().toLowerCase()
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    return redirect(`${trueOrigin}/register?error=${encodeURIComponent(error.message)}`)
  }

  return redirect(`${trueOrigin}/login?message=Controlla la tua email per confermare la registrazione`)
}