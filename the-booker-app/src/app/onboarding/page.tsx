// src/app/onboarding/page.tsx
import { selectRole } from './actions'

export default function OnboardingPage() {
  return (
    <div style={{ maxWidth: '600px', margin: '100px auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Benvenuto a bordo! 🎉</h1>
      <p style={{ fontSize: '18px', color: '#555', marginBottom: '40px' }}>
        Per configurare al meglio il tuo account, dicci chi sei:
      </p>

      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
        {/* Form per il Cliente */}
        <form action={selectRole}>
          <input type="hidden" name="role" value="client" />
          <button 
            type="submit" 
            style={{ padding: '15px 30px', fontSize: '16px', cursor: 'pointer', background: '#0070f3', color: 'white', border: 'none', borderRadius: '8px' }}>
            👤 Sono un Cliente
          </button>
        </form>

        {/* Form per il Professionista */}
        <form action={selectRole}>
          <input type="hidden" name="role" value="professional" />
          <button 
            type="submit" 
            style={{ padding: '15px 30px', fontSize: '16px', cursor: 'pointer', background: '#28a745', color: 'white', border: 'none', borderRadius: '8px' }}>
            💼 Sono un Professionista
          </button>
        </form>
      </div>
    </div>
  )
}