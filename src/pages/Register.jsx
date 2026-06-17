import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const refCode = searchParams.get('ref') || ''

  const [step, setStep] = useState(1)
  const [gender, setGender] = useState(null)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signUp({ email, password, username, gender, referralCode: refCode })
      navigate('/')
    } catch (err) {
      setError(err.message || 'Could not create account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="screen safe-top" style={{
      minHeight: '100vh', paddingTop: 60, paddingBottom: 40,
      background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(123,63,204,0.18) 0%, transparent 60%), #07040F'
    }}>
      <div className="container fade-in">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="display" style={{ fontSize: 42, color: '#F0A830' }}>JOIN ELEV8</div>
          {refCode && (
            <div style={{ fontSize: 12, color: '#A06EF0', marginTop: 6 }}>
              ✨ Invited by a friend — bonus EP incoming
            </div>
          )}
        </div>

        {step === 1 && (
          <div>
            <p className="input-label" style={{ textAlign: 'center', marginBottom: 18 }}>
              Choose your character
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
              <button
                onClick={() => setGender('male')}
                className="card"
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: 24,
                  border: gender === 'male' ? '2px solid #F0A830' : '1px solid rgba(255,255,255,0.06)',
                  background: gender === 'male' ? 'rgba(240,168,48,0.08)' : '#161024'
                }}
              >
                <div style={{ fontSize: 56 }}>🧑‍🦱</div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Male</div>
              </button>
              <button
                onClick={() => setGender('female')}
                className="card"
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: 24,
                  border: gender === 'female' ? '2px solid #A06EF0' : '1px solid rgba(255,255,255,0.06)',
                  background: gender === 'female' ? 'rgba(160,110,240,0.08)' : '#161024'
                }}
              >
                <div style={{ fontSize: 56 }}>👩</div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Female</div>
              </button>
            </div>
            <button
              className="btn btn-gold"
              disabled={!gender}
              onClick={() => setStep(2)}
            >
              Continue →
            </button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Username</label>
              <input className="input" placeholder="YourName" value={username}
                onChange={e => setUsername(e.target.value)} required minLength={3} maxLength={20} />
            </div>
            <div className="input-group">
              <label className="input-label">Email</label>
              <input className="input" type="email" placeholder="you@example.com" value={email}
                onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="input-group">
              <label className="input-label">Password</label>
              <input className="input" type="password" placeholder="••••••••" value={password}
                onChange={e => setPassword(e.target.value)} required minLength={6} />
            </div>

            {error && (
              <div style={{
                background: 'rgba(240,85,74,0.1)', border: '1px solid rgba(240,85,74,0.3)',
                borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#F0554A', marginBottom: 16
              }}>{error}</div>
            )}

            <button className="btn btn-gold" type="submit" disabled={loading} style={{ marginBottom: 12 }}>
              {loading ? 'Creating account...' : 'Create Account 🚀'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>
              ← Back
            </button>
          </form>
        )}

        <p style={{ textAlign: 'center', fontSize: 14, color: '#8A82A0', marginTop: 24 }}>
          Already have an account? <Link to="/login" style={{ color: '#F0A830', fontWeight: 700 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
