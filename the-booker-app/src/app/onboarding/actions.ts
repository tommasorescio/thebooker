// src/app/onboarding/actions.ts
'use server'

import { createClientForServer } from '@/lib/supabase' 
import { redirect } from 'next/navigation'

export async function selectRole(formData: FormData) {
  const supabase = await createClientForServer()
  
  // Prendiamo l'utente loggato
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return redirect('/login')
  }

  // Capiamo quale bottone ha cliccato
  const role = formData.get('role') as string

  if (role === 'professional') {
    // Inseriamo l'ID nella tabella dei professionisti
    const { error } = await supabase.from('professional_data').insert({ id: user.id })
    if (error) console.error("Errore salvataggio pro:", error)
    
    // Lo mandiamo alla sua area riservata
    return redirect('/professional')
    
  } else if (role === 'client') {
    // Inseriamo l'ID nella tabella dei clienti
    const { error } = await supabase.from('client_data').insert({ id: user.id })
    if (error) console.error("Errore salvataggio cliente:", error)
    
    // Lo mandiamo alla sua area riservata
    return redirect('/client')
  }
}