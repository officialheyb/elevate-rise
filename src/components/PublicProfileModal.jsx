import { HOUSING } from '../lib/housingConfig'

export default function PublicProfileModal({ user, onClose }) {
  if (!user) return null

  const housing = HOUSING[user.housing_level] || HOUSING[0]

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="card fade-in"
        style={{ maxWidth: 400, width: '100%' }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
          <button onClick={onClose} style={{ fontSize: 16, color: '#8A82A0', padding: 4 }}>✕</button>
        </div>

        {/* Character avatar */}
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{
            width: 88, height: 88, borderRadius: '50%', margin: '0 auto 14px',
            background: 'linear-gradient(135deg,#A06EF0,#7B3FCC)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44,
            border: '3px solid rgba(240,168,48,0.3)'
          }}>
            {user.character_gender === 'male' ? '🧑‍🦱' : '👩'}
          </div>
          <div style={{ fontWeight: 800, fontSize: 20 }}>{user.username}</div>
          <div style={{
            display: 'inline-block', marginTop: 8, padding: '4px 14px', borderRadius: 50,
            background: 'rgba(240,168,48,0.12)', color: '#F0A830', fontSize: 12, fontWeight: 700
          }}>
            {user.rank_label}
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          <div className="card" style={{ textAlign: 'center', padding: 14 }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>⚡</div>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#F0A830' }}>
              {user.total_ep?.toLocaleString() ?? '—'}
            </div>
            <div style={{ fontSize: 10, color: '#8A82A0' }}>TOTAL EP</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: 14 }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>🔥</div>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#F0A830' }}>
              {user.current_streak ?? 0} days
            </div>
            <div style={{ fontSize: 10, color: '#8A82A0' }}>STREAK</div>
          </div>
        </div>

        {/* Housing */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 32 }}>{housing.emoji}</div>
          <div>
            <div style={{ fontSize: 11, color: '#8A82A0' }}>LIVES IN</div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{housing.name}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
