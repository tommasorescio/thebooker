import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function middleware(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()

  // Se l'utente non è loggato e prova ad entrare nelle dashboard
  if (!user && (url.pathname.startsWith('/professional') || url.pathname.startsWith('/client'))) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Controllo di accesso per l'area Professionista
  if (url.pathname.startsWith('/professional') && user) {
    const { data } = await supabase
      .from('professional_data')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!data) {
      url.pathname = '/client' // Se non è un pro, mandalo alla dashboard cliente
      return NextResponse.redirect(url)
    }
  }

  // Controllo di accesso per l'area Cliente
  if (url.pathname.startsWith('/client') && user) {
    const { data } = await supabase
      .from('client_data')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!data) {
      url.pathname = '/professional' // Se non è un cliente, mandalo alla dashboard pro
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/professional/:path*', '/client/:path*'],
}