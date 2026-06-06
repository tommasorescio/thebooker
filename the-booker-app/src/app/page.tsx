import { createClientForServer } from '@/lib/supabase'

export default async function Home() {
  // Inizializziamo il client del server (richiede await perché Next 15 aspetta i cookie)
  const supabase = await createClientForServer()
  
  // Proviamo a recuperare dati da una tabella (es. 'profiles')
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(5)

  if (error) {
    console.error("Errore durante il recupero dei dati:", error.message)
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>The Booker App 📚</h1>
      <p>Se vedi questa pagina senza errori di build, la configurazione è perfetta!</p>
      
      <h2>Connessione Supabase:</h2>
      {error ? (
        <p style={{ color: 'red' }}>Errore: {error.message} (Controlla se la tabella 'profiles' esiste!)</p>
      ) : (
        <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '5px' }}>
          {JSON.stringify(profiles, null, 2)}
        </pre>
      )}
    </main>
  )
}