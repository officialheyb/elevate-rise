import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

const RANKS = [
  { ep: 0, name: 'Newcomer' },
  { ep: 10000, name: 'Rising' },
  { ep: 50000, name: 'Focused' },
  { ep: 100000, name: 'Consistent' },
  { ep: 250000, name: 'Builder' },
  { ep: 500000, name: 'Leader' },
  { ep: 1000000, name: 'Elevated' },
]

export default function Profile() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [confirmingSignOut, setConfirmingSignOut] = useState(false)

  if (!profile) return null

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  const currentRankIdx = RANKS.findIndex(r => r.name === profile.rank_label)
  const nextRank = RANKS[currentRankIdx + 1]

  return (
    <div className="screen safe-top" style={{ paddingTop: 24 }}>
      <div className="container fade-in">
        <div className="display" style={{ fontSize: 32, color: '#F0A830', marginBottom: 20 }}>PROFILE</div>

        {/* Character card */}
        <div className="card" style={{
          textAlign: 'center', padding: '32px 20px', marginBottom: 16,
          background: 'radial-gradient(ellipse 100% 100% at 50% 0%, rgba(160,110,240,0.12) 0%, transparent 70%), #161024'
        }}>
          <div style={{
            width: 88, height: 88, borderRadius: '50%', margin: '0 auto 14px',
            background: 'linear-gradient(135deg,#A06EF0,#7B3FCC)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44,
            border: '3px solid rgba(240,168,48,0.3)'
          }}>
            {profile.character_gender === 'male' ? '🧑‍🦱' : '👩'}
          </div>
          <div style={{ fontWeight: 800, fontSize: 20 }}>{profile.username}</div>
          <div style={{
            display: 'inline-block', marginTop: 8, padding: '4px 14px', borderRadius: 50,
            background: 'rgba(240,168,48,0.12)', color: '#F0A830', fontSize: 12, fontWeight: 700
          }}>
            {profile.rank_label}
          </div>
        </div>

        {/* Rank progress */}
        {nextRank && (
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: '#8A82A0', marginBottom: 10, fontWeight: 700, letterSpacing: 1 }}>
              NEXT RANK
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <span style={{ fontWeight: 800, fontSize: 16 }}>{nextRank.name}</span>
              <span style={{ fontSize: 12, color: '#8A82A0' }}>
                {(nextRank.ep - profile.total_ep).toLocaleString()} EP to go
              </span>
            </div>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${Math.min(100, (profile.total_ep / nextRank.ep) * 100)}%`,
                background: 'linear-gradient(90deg, #7B3FCC, #A06EF0)', borderRadius: 10
              }} />
            </div>
          </div>
        )}

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          <StatBox label="Total EP" value={profile.total_ep.toLocaleString()} icon="⚡" />
          <StatBox label="Current Streak" value={`${profile.current_streak} days`} icon="🔥" />
          <StatBox label="Longest Streak" value={`${profile.longest_streak} days`} icon="🏅" />
          <StatBox label="Housing Level" value={`Tier ${profile.housing_level}`} icon="🏠" />
        </div>

        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: '#8A82A0', marginBottom: 4 }}>Referral Code</div>
          <div style={{ fontFamily: "'Space Mono', monospace", color: '#F0A830', fontSize: 14, fontWeight: 700 }}>
            {profile.referral_code}
          </div>
        </div>

        {confirmingSignOut ? (
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost" onClick={() => setConfirmingSignOut(false)}>Cancel</button>
            <button className="btn" style={{ background: '#F0554A', color: '#fff' }} onClick={handleSignOut}>
              Confirm Sign Out
            </button>
          </div>
        ) : (
          <button className="btn btn-ghost" onClick={() => setConfirmingSignOut(true)}>
            Sign Out
          </button>
        )}

        {profile.is_admin && (
          <button
            className="btn btn-purple"
            style={{ marginTop: 12 }}
            onClick={() => navigate('/admin')}
          >
            🛠 Admin Panel
          </button>
        )}
      </div>
    </div>
  )
}

function StatBox({ label, value, icon }) {
  return (
    <div className="card" style={{ padding: 14 }}>
      <div style={{ fontSize: 18, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontWeight: 800, fontSize: 16 }}>{value}</div>
      <div style={{ fontSize: 11, color: '#8A82A0' }}>{label}</div>
    </div>
  )
}
