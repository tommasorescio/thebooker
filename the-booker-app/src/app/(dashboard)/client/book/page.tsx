import { createClientForServer } from '@/lib/supabase'
import BookingForm from './BookingForm'

export default async function BookPage() {
  const supabase = await createClientForServer()

  // Interroghiamo professional_data unendo il nome da profiles e gli orari da availability
  const { data: professionals, error } = await supabase
    .from('professional_data')
    .select(`
      id,
      specialty,
      bio,
      profiles (
        full_name,
        avatar_url
      ),
      availability (
        id,
        day_of_week,
        start_time,
        end_time,
        is_active
      )
    `)

  // 👁️ La spia ora è posizionata nel punto corretto, dentro la funzione
  console.log("--- DEBUG SUPABASE BOOKING ---")
  console.log("DATA:", JSON.stringify(professionals, null, 2))
  console.log("ERROR:", error)
  console.log("------------------------------")

  if (error) {
    return (
      <div style={{ padding: '40px', color: '#dc2626', fontFamily: 'sans-serif' }}>
        <h3>❌ Errore nel caricamento dei professionisti</h3>
        <p>{error.message}</p>
      </div>
    )
  }

  // Passiamo i dati reali del database al componente interattivo
  return <BookingForm professionals={professionals || []} />
}