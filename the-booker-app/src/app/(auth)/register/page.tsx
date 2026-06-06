import { signup } from '../actions' // <-- Corretto l'import relativo

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', fontFamily: 'sans-serif' }}>
      <h2>Crea un nuovo account</h2>
      
      {params.error && <p style={{ color: 'red' }}>⚠️ {params.error}</p>}

      <form action={signup} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <label>Nome Completo</label>
        <input type="text" name="fullName" required style={{ padding: '8px' }} />

        <label>Email</label>
        <input type="email" name="email" required style={{ padding: '8px' }} />

        <label>Password</label>
        <input type="password" name="password" required style={{ padding: '8px' }} />

        <button type="submit" style={{ padding: '10px', background: '#10b981', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Registrati
        </button>
      </form>
      <p style={{ marginTop: '15px' }}>
        Hai già un account? <a href="/login">Accedi</a>
      </p>
    </div>
  )
}