'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const MOCK_PROFESSIONALS = [
  { id: 'prof_1', name: 'Dott. Alessandro Rossi', specializzazione: 'Fisioterapista', ultimoMessaggio: 'Ci vediamo per la terapia martedì.' },
  { id: 'prof_2', name: 'Dott.ssa Elena Bianchi', specializzazione: 'Nutrizionista', ultimoMessaggio: 'Hai dato un occhio al piano alimentare?' },
  { id: 'prof_3', name: 'Dott. Marco Verdi', specializzazione: 'Cardiologo', ultimoMessaggio: 'I referti degli esami sono perfetti.' }
]

export default function ClientChatPage() {
  const router = useRouter()
  const [activeProf, setActiveProf] = useState(MOCK_PROFESSIONALS[0])

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <button 
        onClick={() => router.push('/client')}
        style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', marginBottom: '24px', fontWeight: '500', fontSize: '14px' }}
      >
        ← Torna alla Dashboard
      </button>

      <h1 style={{ fontSize: '24px', color: '#111827', marginBottom: '24px' }}>💬 Centro Messaggi</h1>

      <div style={{ 
        backgroundColor: '#fff', 
        border: '1px solid #e5e7eb', 
        borderRadius: '12px', 
        height: '600px', 
        display: 'grid', 
        gridTemplateColumns: '300px 1fr', 
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
      }}>
        
        {/* LISTA MEDICI */}
        <div style={{ borderRight: '1px solid #e5e7eb', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px', fontWeight: '600', borderBottom: '1px solid #e5e7eb', color: '#4b5563', fontSize: '14px' }}>
            I TUOI SPECIALISTI
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {MOCK_PROFESSIONALS.map((prof) => (
              <div
                key={prof.id}
                onClick={() => setActiveProf(prof)}
                style={{
                  padding: '16px',
                  borderBottom: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  backgroundColor: activeProf.id === prof.id ? '#eff6ff' : 'transparent',
                  borderLeft: activeProf.id === prof.id ? '4px solid #2563eb' : '4px solid transparent'
                }}
              >
                <div style={{ fontWeight: '600', color: '#111827', fontSize: '15px' }}>{prof.name}</div>
                <div style={{ fontSize: '12px', color: '#2563eb', marginBottom: '4px' }}>{prof.specializzazione}</div>
                <div style={{ fontSize: '13px', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {prof.ultimoMessaggio}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONVERSAZIONE ATTIVA */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#fff' }}>
            <div style={{ fontWeight: '600', color: '#111827' }}>{activeProf.name}</div>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>Specialista in {activeProf.specializzazione}</div>
          </div>
          
          <div style={{ flex: 1, padding: '24px', backgroundColor: '#f3f4f6', overflowY: 'auto' }}>
            <div style={{ backgroundColor: '#fff', padding: '12px 16px', borderRadius: '8px', maxWidth: '70%', border: '1px solid #e5e7eb' }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#374151' }}>{activeProf.ultimoMessaggio}</p>
            </div>
          </div>

          <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '12px', backgroundColor: '#fff' }}>
            <input 
              type="text" 
              placeholder={`Invia un messaggio a ${activeProf.name}...`} 
              style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px' }}
            />
            <button style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
              Invia
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}