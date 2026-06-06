import { login } from '../actions' // <-- Corretto l'import relativo

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const params = await searchParams

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', fontFamily: 'sans-serif' }}>
      <h2>Accedi alla Piattaforma</h2>
      
      {params.error && <p style={{ color: 'red' }}>⚠️ {params.error}</p>}
      {params.message && <p style={{ color: 'green' }}>✅ {params.message}</p>}

      <form action={login} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <label>Email</label>
        <input type="email" name="email" required style={{ padding: '8px' }} />

        <label>Password</label>
        <input type="password" name="password" required style={{ padding: '8px' }} />

        <button type="submit" style={{ padding: '10px', background: '#0070f3', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Accedi
        </button>
      </form>
      <p style={{ marginTop: '15px' }}>
        Non hai un account? <a href="/register">Registrati qui</a>
      </p>
    </div>
  )
}