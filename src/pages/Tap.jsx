import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../lib/AuthContext'
import { supabase } from '../lib/supabase'

export default function Tap() {
  const { profile, refreshProfile } = useAuth()
  const [tapCount, setTapCount] = useState(0)
  const [particles, setParticles] = useState([])
  const [pressed, setPressed] = useState(false)
  const [limitReached, setLimitReached] = useState(false)
  const [loading, setLoading] = useState(true)
  const particleId = useRef(0)

  useEffect(() => {
    fetchTodayTaps()
    // eslint-disable-next-line
  }, [])

  async function fetchTodayTaps() {
    if (!profile?.id) return
    const today = new Date().toISOString().slice(0, 10)
    const { data } = await supabase
      .from('daily_activity')
      .select('tap_count')
      .eq('user_id', profile.id)
      .eq('activity_date', today)
      .maybeSingle()
    setTapCount(data?.tap_count ?? 0)
    setLimitReached((data?.tap_count ?? 0) >= 500)
    setLoading(false)
  }

  async function handleTap(e) {
    if (limitReached || !profile?.id) return

    setPressed(true)
    setTimeout(() => setPressed(false), 100)

    // optimistic particle burst
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX ? e.clientX - rect.left : rect.width / 2
    const y = e.clientY ? e.clientY - rect.top : rect.height / 2
    const id = particleId.current++
    setParticles(p => [...p, { id, x, y }])
    setTimeout(() => setParticles(p => p.filter(pt => pt.id !== id)), 700)

    setTapCount(c => c + 1)

    const { data, error } = await supabase.rpc('handle_tap', { p_user_id: profile.id })
    if (!error && data) {
      if (data.limit_reached) {
        setLimitReached(true)
      }
      setTapCount(data.tap_count)
    }
    refreshProfile()
  }

  const remaining = Math.max(0, 500 - tapCount)
  const progressPct = (tapCount / 500) * 100

  return (
    <div className="screen safe-top" style={{
      paddingTop: 24, display: 'flex', flexDirection: 'column', alignItems: 'center',
      minHeight: '100vh'
    }}>
      <div className="container" style={{ width: '100%', textAlign: 'center' }}>
        <div className="display" style={{ fontSize: 32, color: '#F0A830', marginBottom: 4 }}>TAP TO EARN</div>
        <div style={{ fontSize: 13, color: '#8A82A0', marginBottom: 28 }}>
          +1 EP per tap · {remaining} taps left today
        </div>

        {/* progress bar */}
        <div style={{
          height: 10, background: 'rgba(255,255,255,0.06)', borderRadius: 10,
          overflow: 'hidden', marginBottom: 40, maxWidth: 280, margin: '0 auto 40px'
        }}>
          <div style={{
            height: '100%', width: `${progressPct}%`,
            background: limitReached
              ? 'linear-gradient(90deg, #4ADE80, #40E0D0)'
              : 'linear-gradient(90deg, #C8892A, #F0A830, #FFD060)',
            borderRadius: 10, transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* THE TAP COIN */}
      <div style={{
        position: 'relative', width: 260, height: 260,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto'
      }}>
        {/* outer glow ring */}
        <div style={{
          position: 'absolute', inset: -20, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(240,168,48,0.25) 0%, transparent 70%)',
          animation: limitReached ? 'none' : 'pulse 2s ease-in-out infinite'
        }} />

        {/* particles */}
        {particles.map(p => (
          <div key={p.id} className="tap-particle" style={{ left: p.x, top: p.y }}>+1</div>
        ))}

        <button
          onClick={handleTap}
          disabled={limitReached || loading}
          style={{
            width: 220, height: 220, borderRadius: '50%',
            background: limitReached
              ? 'linear-gradient(145deg, #2A3530, #161D1A)'
              : 'linear-gradient(145deg, #FFD060, #F0A830 50%, #C8892A)',
            border: '6px solid rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 4,
            boxShadow: limitReached
              ? 'inset 0 4px 20px rgba(0,0,0,0.4)'
              : `0 0 0 ${pressed ? 2 : 8}px rgba(240,168,48,0.15), inset 0 -8px 20px rgba(0,0,0,0.25), inset 0 8px 20px rgba(255,255,255,0.2), 0 10px 40px rgba(240,168,48,0.3)`,
            transform: pressed ? 'scale(0.94)' : 'scale(1)',
            transition: 'transform 0.1s ease, box-shadow 0.1s ease',
            cursor: limitReached ? 'default' : 'pointer'
          }}
        >
          <div style={{ fontSize: 64 }}>{limitReached ? '✅' : '∞'}</div>
          <div className="display" style={{
            fontSize: 22, color: limitReached ? '#4ADE80' : '#1a0f00', letterSpacing: 1
          }}>
            {limitReached ? 'DONE!' : 'TAP'}
          </div>
        </button>
      </div>

      <div className="container" style={{ width: '100%', marginTop: 40 }}>
        {limitReached ? (
          <div className="card" style={{
            textAlign: 'center', border: '1px solid rgba(74,222,128,0.3)', background: 'rgba(74,222,128,0.06)'
          }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>🎉</div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Daily tap limit reached!</div>
            <div style={{ fontSize: 12, color: '#8A82A0' }}>Come back tomorrow, or hit a Lift Session for bigger EP.</div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', fontSize: 12, color: '#5F5876' }}>
            Tapping is a secondary boost. The fastest way to rise is showing up at the 8AM and 8PM Lift Sessions.
          </div>
        )}
      </div>

      <style>{`
        .tap-particle {
          position: absolute;
          font-family: 'Bangers', cursive;
          font-size: 22px;
          color: #FFD060;
          text-shadow: 0 0 10px rgba(240,168,48,0.8);
          pointer-events: none;
          animation: float-up 0.7s ease-out forwards;
          transform: translate(-50%, -50%);
        }
        @keyframes float-up {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -160%) scale(1.4); }
        }
      `}</style>
    </div>
  )
}
