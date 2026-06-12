import { createClientForServer } from '@/lib/supabase'
import Link from 'next/link' // <-- Questo permette al bottone di funzionare

export default async function ClientPage() {
  const supabase = await createClientForServer()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', color: '#111827', marginBottom: '4px' }}>
          👋 Benvenuto nella tua Dashboard
        </h1>
        <p style={{ color: '#4b5563', margin: 0 }}>
          Accesso effettuato come: <strong style={{ color: '#1f2937' }}>{user?.email}</strong>
        </p>
      </header>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
        {/* Link per andare alla chat */}
        <Link href="/client/chat" style={{ textDecoration: 'none', color: '#2563eb', fontWeight: '500' }}>
          💬 Vai ai tuoi messaggi
        </Link>
      </div>

      <section style={{ 
        backgroundColor: '#fff', 
        padding: '24px', 
        borderRadius: '12px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <h2 style={{ fontSize: '18px', color: '#111827', marginTop: 0, marginBottom: '12px' }}>
          🗓️ I tuoi prossimi appuntamenti
        </h2>
        <p style={{ color: '#6b7280', margin: 0, fontSize: '15px' }}>
          Non hai ancora appuntamenti prenotati. Vuoi fissarne uno con la nostra AI vocale?
        </p>
        
        {/* Abbiamo avvolto il bottone nel Link per farlo funzionare */}
        <Link href="/client/book">
          <button style={{
            marginTop: '16px',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '6px',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
            Prenota una visita
          </button>
        </Link>
      </section>
    </div>
  )
}