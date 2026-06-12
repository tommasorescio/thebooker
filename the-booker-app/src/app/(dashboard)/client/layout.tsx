import { createClientForServer } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClientForServer()
  
  // Controlliamo se esiste una sessione utente attiva
  const { data: { user }, error } = await supabase.auth.getUser()

  // Se non è loggato, calcoliamo l'URL corretto e lo rispediamo al login
  if (error || !user) {
    const headersList = await headers()
    const forwardedHost = headersList.get('x-forwarded-host')
    const host = forwardedHost || headersList.get('host') || 'localhost:3000'
    const protocol = forwardedHost ? 'https' : 'http'
    
    return redirect(`${protocol}://${host}/login?error=Effettua_il_login_per_accedere`)
  }

  // Se è loggato, gli mostriamo il contenuto della dashboard
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Qui in futuro metteremo una barra di navigazione comune a tutto il pannello cliente */}
      <main>{children}</main>
    </div>
  )
}