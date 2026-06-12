'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createAppointment } from './actions'

const DAYS_MAP: { [key: number]: string } = {
  1: 'Lunedì',
  2: 'Martedì',
  3: 'Mercoledì',
  4: 'Giovedì',
  5: 'Venerdì',
  6: 'Sabato',
  7: 'Domenica',
  0: 'Domenica'
}

// ⏱️ DURATA DELLA VISITA IN MINUTI
const SLOT_DURATION = 30;

// Algoritmo per spezzettare le macro-disponibilità del database in slot da 30 min
function generateTimeSlots(startTime: string, endTime: string, durationMin: number) {
  const slots: string[] = [];
  let [h, m] = startTime.split(':').map(Number);
  let [endH, endM] = endTime.split(':').map(Number);
  
  let currentMinutes = h * 60 + m;
  const endMinutes = endH * 60 + endM;
  
  while (currentMinutes + durationMin <= endMinutes) {
    const slotH = Math.floor(currentMinutes / 60).toString().padStart(2, '0');
    const slotM = (currentMinutes % 60).toString().padStart(2, '0');
    slots.push(`${slotH}:${slotM}`);
    currentMinutes += durationMin;
  }
  return slots;
}

export default function BookingForm({ professionals }: { professionals: any[] }) {
  const router = useRouter()
  
  const [selectedProf, setSelectedProf] = useState<any | null>(null)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  
  const [isBooking, setIsBooking] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  const handleFinalBooking = async () => {
    if (!selectedTime || !selectedDay || !selectedProf) return
    
    setIsBooking(true)
    const dayNumber = Object.keys(DAYS_MAP).find(key => DAYS_MAP[Number(key)] === selectedDay)
    
    try {
      const result = await createAppointment(
        selectedProf.id, 
        Number(dayNumber), 
        selectedTime
      )
      
      if (result.success) {
        setBookingSuccess(true)
      } else {
        alert(`Impossibile prenotare: ${result.error}`)
      }
    } catch (err) {
      alert('Errore di rete o utente non autenticato.')
    } finally {
      setIsBooking(false)
    }
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif', maxWidth: '700px', margin: '0 auto' }}>
      
      <button 
        onClick={() => {
          if (bookingSuccess) {
            router.push('/client')
          } else if (selectedProf) {
            setSelectedProf(null)
            setSelectedTime(null)
            setSelectedDay(null)
          } else {
            router.push('/client')
          }
        }}
        style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '14px', fontWeight: '500', marginBottom: '24px', padding: 0 }}
      >
        ← Torna indietro
      </button>

      {/* STEP 1: Elenco dei Professionisti caricati dal DB */}
      {!selectedProf ? (
        <div>
          <h1 style={{ fontSize: '24px', color: '#111827', marginBottom: '8px' }}>🗓️ Prenota una Visita</h1>
          <p style={{ color: '#4b5563', fontSize: '15px', marginBottom: '24px' }}>Seleziona lo specialista con cui desideri fissare un appuntamento:</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {professionals.length === 0 ? (
              <p style={{ color: '#6b7280', fontStyle: 'italic' }}>Nessun professionista disponibile nel database.</p>
            ) : (
              professionals.map((prof) => (
                <div 
                  key={prof.id}
                  onClick={() => setSelectedProf(prof)}
                  style={{
                    padding: '20px',
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{ fontWeight: '600', color: '#111827', fontSize: '16px' }}>
                    {prof.profiles?.full_name || 'Specialista Anonimo'}
                  </div>
                  <div style={{ fontSize: '14px', color: '#2563eb', fontWeight: '500', marginTop: '2px' }}>
                    {prof.specialty}
                  </div>
                  {prof.bio && <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px', whiteSpace: 'pre-line' }}>{prof.bio}</div>}
                </div>
              ))
            )}
          </div>
        </div>
      ) : bookingSuccess ? (
        /* STEP 3: Schermata di Successo */
        <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #e5e7eb', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h1 style={{ fontSize: '48px', margin: '0 0 16px 0' }}>🎉</h1>
          <h2 style={{ color: '#10b981', marginTop: 0 }}>Prenotazione Confermata!</h2>
          <p style={{ color: '#4b5563', fontSize: '15px', marginBottom: '24px' }}>
            Il tuo appuntamento con <strong>{selectedProf.profiles?.full_name}</strong> è stato registrato per il giorno <strong>{selectedDay}</strong> alle ore <strong>{selectedTime}</strong>.
          </p>
          <button 
            onClick={() => router.push('/client')}
            style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
          >
            Vai alla tua Dashboard
          </button>
        </div>
      ) : (
        /* STEP 2: Il Calendario a Slot Orari Spaccati */
        <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '4px 12px', borderRadius: '9999px', fontSize: '13px', fontWeight: '600' }}>
            {selectedProf.specialty}
          </span>
          <h1 style={{ fontSize: '22px', color: '#111827', marginTop: '12px', marginBottom: '4px' }}>
            {selectedProf.profiles?.full_name}
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: 0, marginBottom: '28px' }}>
            Seleziona la fascia oraria che preferisci:
          </p>

          {(!selectedProf.availability || selectedProf.availability.filter((a: any) => a.is_active).length === 0) ? (
            <p style={{ color: '#dc2626', fontSize: '14px', fontStyle: 'italic' }}>
              Questo professionista non ha orari attivi disponibili.
            </p>
          ) : (
            selectedProf.availability
              .filter((av: any) => av.is_active)
              .map((av: any) => {
                const slots = generateTimeSlots(av.start_time, av.end_time, SLOT_DURATION);

                return (
                  <div key={av.id} style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '15px', color: '#374151', marginBottom: '12px', borderBottom: '1px solid #f3f4f6', paddingBottom: '6px' }}>
                      📅 {DAYS_MAP[av.day_of_week]}
                    </h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
                      {slots.map((time) => {
                        const isSelected = selectedDay === DAYS_MAP[av.day_of_week] && selectedTime === time;
                        return (
                          <button
                            key={time}
                            onClick={() => {
                              setSelectedDay(DAYS_MAP[av.day_of_week]);
                              setSelectedTime(time);
                            }}
                            style={{
                              padding: '10px',
                              borderRadius: '6px',
                              border: isSelected ? '2px solid #2563eb' : '1px solid #d1d5db',
                              backgroundColor: isSelected ? '#eff6ff' : '#fff',
                              color: isSelected ? '#2563eb' : '#111827',
                              fontWeight: isSelected ? '600' : '400',
                              cursor: 'pointer',
                              fontSize: '14px',
                              transition: 'all 0.1s ease'
                            }}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })
          )}

          <button
            disabled={!selectedTime || isBooking}
            onClick={handleFinalBooking}
            style={{
              width: '100%',
              marginTop: '20px',
              backgroundColor: selectedTime ? '#10b981' : '#d1d5db',
              color: '#fff',
              border: 'none',
              padding: '14px',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: selectedTime ? 'pointer' : 'not-allowed',
              boxShadow: selectedTime ? '0 4px 12px rgba(16, 185, 129, 0.15)' : 'none'
            }}
          >
            {isBooking ? 'Scrittura a database...' : selectedTime ? `Conferma Appuntamento alle ${selectedTime}` : 'Scegli un orario per continuare'}
          </button>
        </div>
      )}
    </div>
  )
}