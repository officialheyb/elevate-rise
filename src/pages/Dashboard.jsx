import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { supabase } from '../lib/supabase'

const HOUSING = [
  { level: 0, name: 'Studio Apartment', emoji: '🏠', ep: 0 },
  { level: 1, name: 'Small Apartment', emoji: '🏡', ep: 10000 },
  { level: 2, name: 'Townhome', emoji: '🏘️', ep: 50000 },
  { level: 3, name: 'House', emoji: '🏰', ep: 150000 },
  { level: 4, name: 'Luxury Home', emoji: '🏛️', ep: 500000 },
  { level: 5, name: 'Mansion', emoji: '🏆', ep: 1000000 },
]

export default function Dashboard() {
  const { profile, refreshProfile } = useAuth()
  const [leaderboardRank, setLeaderboardRank] = useState(null)
  const [referralCount, setReferralCount] = useState(0)

  useEffect(() => {
    refreshProfile()
    fetchRank()
    fetchReferralCount()
    // eslint-disable-next-line
  }, [])

  async function fetchRank() {
    if (!profile?.id) return
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gt('total_ep', profile.total_ep)
    setLeaderboardRank((count ?? 0) + 1)
  }

  async function fetchReferralCount() {
    if (!profile?.id) return
    const { count } = await supabase
      .from('referrals')
      .select('*', { count: 'exact', head: true })
      .eq('referrer_id', profile.id)
    setReferralCount(count ?? 0)
  }

  if (!profile) return null

  const housing = HOUSING[profile.housing_level] || HOUSING[0]
  const nextHousing = HOUSING[profile.housing_level + 1]
  const progressPct = nextHousing
    ? Math.min(100, ((profile.total_ep - housing.ep) / (nextHousing.ep - housing.ep)) * 100)
    : 100

  return (
    <div className="screen safe-top" style={{ paddingTop: 24 }}>
      <div className="container fade-in">

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 13, color: '#8A82A0' }}>Welcome back,</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{profile.username}</div>
          </div>
          <Link to="/profile" style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'linear-gradient(135deg,#A06EF0,#7B3FCC)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
            border: '2px solid rgba(240,168,48,0.3)'
          }}>
            {profile.character_gender === 'male' ? '🧑‍🦱' : '👩'}
          </Link>
        </div>

        {/* EP Hero card */}
        <div className="card" style={{
          textAlign: 'center', padding: '32px 20px', marginBottom: 16,
          background: 'radial-gradient(ellipse 100% 100% at 50% 0%, rgba(240,168,48,0.12) 0%, transparent 70%), #161024',
          border: '1px solid rgba(240,168,48,0.2)'
        }}>
          <div style={{ fontSize: 12, color: '#F0A830', fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>
            ⚡ TOTAL ELEVATION POINTS
          </div>
          <div className="display" style={{
            fontSize: 56, color: '#FFD060',
            textShadow: '0 0 30px rgba(240,168,48,0.5)', lineHeight: 1
          }}>
            {profile.total_ep.toLocaleString()}
          </div>
          <div style={{ fontSize: 12, color: '#8A82A0', marginTop: 6 }}>
            Rank #{leaderboardRank ?? '—'} · {profile.rank_label}
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          <div className="card" style={{ textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>🔥</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#F0A830' }}>{profile.current_streak}</div>
            <div style={{ fontSize: 11, color: '#8A82A0', letterSpacing: 0.5 }}>DAY STREAK</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>🤝</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#A06EF0' }}>{referralCount}</div>
            <div style={{ fontSize: 11, color: '#8A82A0', letterSpacing: 0.5 }}>REFERRALS</div>
          </div>
        </div>

        {/* Housing progression */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 40 }}>{housing.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: '#8A82A0', letterSpacing: 1 }}>YOUR HOUSING</div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>{housing.name}</div>
            </div>
          </div>
          {nextHousing && (
            <>
              <div style={{
                height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 10, overflow: 'hidden', marginBottom: 8
              }}>
                <div style={{
                  height: '100%', width: `${progressPct}%`,
                  background: 'linear-gradient(90deg, #C8892A, #F0A830, #FFD060)',
                  borderRadius: 10, transition: 'width 0.5s ease'
                }} />
              </div>
              <div style={{ fontSize: 12, color: '#8A82A0' }}>
                {(nextHousing.ep - profile.total_ep).toLocaleString()} EP to <strong style={{ color: '#fff' }}>{nextHousing.name}</strong> {nextHousing.emoji}
              </div>
            </>
          )}
        </div>

        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          <Link to="/tap" className="btn btn-gold" style={{ textDecoration: 'none' }}>
            👆 Tap to Earn
          </Link>
          <Link to="/sessions" className="btn btn-purple" style={{ textDecoration: 'none' }}>
            ⏰ Lift Sessions
          </Link>
        </div>

        {/* Referral CTA */}
        <Link to="/referrals" className="card" style={{
          display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none',
          border: '1px dashed rgba(160,110,240,0.4)', background: 'rgba(160,110,240,0.06)'
        }}>
          <div style={{ fontSize: 28 }}>🎁</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Invite friends, earn 6,000 EP</div>
            <div style={{ fontSize: 12, color: '#8A82A0' }}>+1,000 on join · +5,000 when active</div>
          </div>
          <div style={{ color: '#A06EF0', fontSize: 18 }}>→</div>
        </Link>

      </div>
    </div>
  )
}
