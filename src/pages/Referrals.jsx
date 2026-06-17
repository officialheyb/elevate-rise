import { useState, useEffect } from 'react'
import { useAuth } from '../lib/AuthContext'
import { supabase } from '../lib/supabase'
import { useToast } from '../components/useToast'

export default function Referrals() {
  const { profile } = useAuth()
  const { showToast, ToastEl } = useToast()
  const [referrals, setReferrals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReferrals()
    // eslint-disable-next-line
  }, [])

  async function fetchReferrals() {
    if (!profile?.id) return
    const { data } = await supabase
      .from('referrals')
      .select('*, profiles!referrals_referred_id_fkey(username, character_gender)')
      .eq('referrer_id', profile.id)
      .order('created_at', { ascending: false })
    setReferrals(data || [])
    setLoading(false)
  }

  const referralLink = `${window.location.origin}/register?ref=${profile?.referral_code}`
  const activeCount = referrals.filter(r => r.is_active).length

  function copyLink() {
    navigator.clipboard.writeText(referralLink)
    showToast('Referral link copied!', '📋')
  }

  return (
    <div className="screen safe-top" style={{ paddingTop: 24 }}>
      <div className="container fade-in">
        <div className="display" style={{ fontSize: 32, color: '#F0A830', marginBottom: 4 }}>REFERRALS</div>
        <p style={{ fontSize: 13, color: '#8A82A0', marginBottom: 20 }}>
          Invite friends. Earn EP when they join — and more when they stay active.
        </p>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#A06EF0' }}>{referrals.length}</div>
            <div style={{ fontSize: 11, color: '#8A82A0' }}>TOTAL INVITES</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#4ADE80' }}>{activeCount}</div>
            <div style={{ fontSize: 11, color: '#8A82A0' }}>ACTIVE</div>
          </div>
        </div>

        {/* Referral link box */}
        <div className="card" style={{
          marginBottom: 24,
          border: '1px solid rgba(240,168,48,0.25)',
          background: 'rgba(240,168,48,0.05)'
        }}>
          <div style={{ fontSize: 12, color: '#8A82A0', marginBottom: 10, fontWeight: 700, letterSpacing: 1 }}>
            YOUR REFERRAL LINK
          </div>
          <div style={{
            background: '#0D0919', borderRadius: 10, padding: '12px 14px',
            fontSize: 12, color: '#F0A830', marginBottom: 12, wordBreak: 'break-all',
            fontFamily: "'Space Mono', monospace"
          }}>
            {referralLink}
          </div>
          <button className="btn btn-gold" onClick={copyLink}>
            📋 Copy Link
          </button>
        </div>

        {/* Reward breakdown */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          <div className="card" style={{ flex: 1, textAlign: 'center', padding: 14 }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>🎉</div>
            <div style={{ fontWeight: 800, color: '#F0A830', fontSize: 16 }}>+1,000</div>
            <div style={{ fontSize: 10, color: '#8A82A0' }}>On join</div>
          </div>
          <div className="card" style={{ flex: 1, textAlign: 'center', padding: 14 }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>🔥</div>
            <div style={{ fontWeight: 800, color: '#4ADE80', fontSize: 16 }}>+5,000</div>
            <div style={{ fontSize: 10, color: '#8A82A0' }}>When active (3+ days)</div>
          </div>
        </div>

        {/* Referral list */}
        <div style={{ fontSize: 12, color: '#8A82A0', fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>
          YOUR INVITES
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#8A82A0', padding: 20 }}>Loading...</div>
        ) : referrals.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: '#8A82A0', padding: 30 }}>
            No referrals yet. Share your link to start earning!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {referrals.map(r => (
              <div key={r.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#A06EF0,#7B3FCC)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
                }}>
                  {r.profiles?.character_gender === 'male' ? '🧑‍🦱' : '👩'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{r.profiles?.username || 'Unknown'}</div>
                  <div style={{ fontSize: 11, color: '#8A82A0' }}>{r.distinct_login_days} login days</div>
                </div>
                <div style={{
                  fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 50,
                  background: r.is_active ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.06)',
                  color: r.is_active ? '#4ADE80' : '#8A82A0'
                }}>
                  {r.is_active ? '✓ Active' : 'Pending'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {ToastEl}
    </div>
  )
}
