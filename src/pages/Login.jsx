import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn({ email, password })
      navigate('/')
    } catch (err) {
      setError(err.message || 'Could not sign in. Check your details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="screen safe-top" style={{
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      minHeight: '100vh', paddingBottom: 40,
      background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(123,63,204,0.18) 0%, transparent 60%), #07040F'
    }}>
      <div className="container fade-in">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="display" style={{
            fontSize: 56, color: '#F0A830',
            textShadow: '0 0 30px rgba(240,168,48,0.6)'
          }}>ELEV8</div>
          <div style={{ color: '#A06EF0', fontSize: 13, letterSpacing: 3, fontWeight: 700, marginTop: 4 }}>
            RISE · EVERY DAY
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              className="input" type="email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} required
            />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              className="input" type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} required
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(240,85,74,0.1)', border: '1px solid rgba(240,85,74,0.3)',
              borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#F0554A', marginBottom: 16
            }}>{error}</div>
          )}

          <button className="btn btn-gold" type="submit" disabled={loading} style={{ marginBottom: 16 }}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 14, color: '#8A82A0' }}>
          New here? <Link to="/register" style={{ color: '#F0A830', fontWeight: 700 }}>Create an account</Link>
        </p>
      </div>
    </div>
  )
}
