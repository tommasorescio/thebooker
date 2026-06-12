import { NextResponse, type NextRequest } from 'next/server'
// Importiamo direttamente dal tuo file funzionante dentro src/lib
import { createClientForServer } from './lib/supabase'

export async function middleware(request: NextRequest) {
  // Usiamo la tua funzione che sappiamo funzionare bene
  const supabase = await createClientForServer()
  const { data: { user } } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const pathname = url.pathname

  // 1. Se l'utente NON è loggato e prova ad accedere a zone protette
  if (!user) {
    if (pathname.startsWith('/professional') || pathname.startsWith('/client') || pathname.startsWith('/onboarding')) {
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // 2. Se l'utente È loggato, verifichiamo i suoi ruoli nel database
  const [profCheck, clientCheck] = await Promise.all([
    supabase.from('professional_data').select('id').eq('id', user.id).maybeSingle(),
    supabase.from('client_data').select('id').eq('id', user.id).maybeSingle()
  ])

  const isProfessional = !!profCheck.data
  const isClient = !!clientCheck.data

  // Caso A: Utente NUOVO (Non è ancora né professionista né cliente)
  if (!isProfessional && !isClient) {
    if (pathname !== '/onboarding') {
      url.pathname = '/onboarding'
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // Caso B: È un Professionista
  if (isProfessional) {
    if (pathname.startsWith('/client') || pathname === '/onboarding') {
      url.pathname = '/professional'
      return NextResponse.redirect(url)
    }
  }

  // Caso C: È un Cliente
  if (isClient) {
    if (pathname.startsWith('/professional') || pathname === '/onboarding') {
      url.pathname = '/client'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/professional/:path*', '/client/:path*', '/onboarding'],
}