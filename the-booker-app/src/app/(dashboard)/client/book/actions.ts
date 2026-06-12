'use server'

import { createClientForServer } from '@/lib/supabase'

// Funzione di supporto per trovare la data del prossimo giorno della settimana specifico
function getNextDateForDayOfWeek(dayOfWeek: number, timeStr: string): Date {
  const resultDate = new Date()
  const currentDay = resultDate.getDay() // 0 = Domenica, 1 = Lunedì...
  
  // Convertiamo il sistema ISO (1=Lunedì, 7=Domenica) per farlo combaciare con JS (0=Domenica)
  const targetDay = dayOfWeek === 7 ? 0 : dayOfWeek
  
  let daysAhead = (targetDay - currentDay + 7) % 7
  if (daysAhead === 0) daysAhead = 7 // Se è oggi, saltiamo al venerdì della prossima settimana
  
  resultDate.setDate(resultDate.getDate() + daysAhead)
  
  const [hours, minutes] = timeStr.split(':').map(Number)
  resultDate.setHours(hours, minutes, 0, 0)
  
  return resultDate
}

export async function createAppointment(professionalId: string, dayOfWeek: number, timeSlot: string) {
  const supabase = await createClientForServer()
  
  // 1. Recuperiamo l'ID del cliente attualmente loggato
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Utente non autenticato')

  // 2. Calcoliamo la data di inizio (start_at) e fine (end_at = +30 minuti)
  const startAt = getNextDateForDayOfWeek(dayOfWeek, timeSlot)
  const endAt = new Date(startAt.getTime() + 30 * 60000) // +30 minuti in millisecondi

  // 3. Inseriamo il record nella tabella appointments come da tuo schema
  const { data, error } = await supabase
    .from('appointments')
    .insert([
      {
        client_id: user.id,
        professional_id: professionalId,
        start_at: startAt.toISOString(),
        end_at: endAt.toISOString(),
        status: 'confirmed',
        booking_mode: 'web' // Specifichiamo che arriva dal sito e non dalla voce
      }
    ])
    .select()

  if (error) {
    console.error('Errore inserimento appuntamento:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}