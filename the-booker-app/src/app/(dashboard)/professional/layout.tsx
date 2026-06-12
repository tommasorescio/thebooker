import { createClientForServer } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export default async function ProfessionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClientForServer()
  const { data: { user }, error } = await supabase.auth.getUser()

  // 1. Controllo se è loggato
  if (error || !user) {
    const headersList = await headers()
    const forwardedHost = headersList.get('x-forwarded-host')
    const host = forwardedHost || headersList.get('host') || 'localhost:3000'
    const protocol = forwardedHost ? 'https' : 'http'
    return redirect(`${protocol}://${host}/login?error=Accesso_negato`)
  }

  // 2. Controllo di Sicurezza: Verifichiamo se è DAVVERO un professionista nel DB
  const { data: isProf } = await supabase
    .from('professional_data')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  // Se non è nella tabella professionisti, rimbalzalo indietro
  if (!isProf) {
    const headersList = await headers()
    const forwardedHost = headersList.get('x-forwarded-host')
    const host = forwardedHost || headersList.get('host') || 'localhost:3000'
    const protocol = forwardedHost ? 'https' : 'http'
    return redirect(`${protocol}://${host}/client?error=Area_riservata_ai_professionisti`)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <main>{children}</main>
    </div>
  )
}