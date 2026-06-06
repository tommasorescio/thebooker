import { NextResponse } from 'next/server'
import { createClientForServer } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    
    const forwardedHost = request.headers.get('x-forwarded-host')
    const host = forwardedHost || request.headers.get('host') || requestUrl.host
    const protocol = forwardedHost ? 'https' : 'http'
    const trueOrigin = `${protocol}://${host}`
    
    const supabase = await createClientForServer()

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) {
        return NextResponse.redirect(`${trueOrigin}/login?error=${encodeURIComponent(error.message)}`)
      }
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.redirect(`${trueOrigin}/login?error=Sessione_non_valida`)
    }

    // 1. Controllo Ruolo: Professionista
    const { data: professional } = await supabase
      .from('professional_data')
      .select('id')
      .eq('id', user.id)
      .maybeSingle()

    if (professional) {
      return NextResponse.redirect(`${trueOrigin}/professional`)
    }

    // 2. Controllo Ruolo: Cliente
    const { data: client } = await supabase
      .from('client_data')
      .select('id')
      .eq('id', user.id)
      .maybeSingle()

    if (client) {
      return NextResponse.redirect(`${trueOrigin}/client`)
    }

    // 3. Destinazione di Default (Utenti nuovi)
    return NextResponse.redirect(`${trueOrigin}/client`)

  } catch (err) {
    // In caso di errore fatale, rimanda al login in modo sicuro
    const requestUrl = new URL(request.url)
    const forwardedHost = request.headers.get('x-forwarded-host')
    const host = forwardedHost || request.headers.get('host') || requestUrl.host
    const protocol = forwardedHost ? 'https' : 'http'
    
    return NextResponse.redirect(`${protocol}://${host}/login?error=Errore_durante_il_login`)
  }
}