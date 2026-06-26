import { useState, useEffect } from 'react'
import { useAuth } from '../lib/AuthContext'
import { supabase } from '../lib/supabase'
import PublicProfileModal from '../components/PublicProfileModal'

export default function Leaderboard() {
  const { profile } = useAuth()
  const [tab, setTab] = useState('all_time')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    fetchLeaderboard(tab)
    // eslint-disable-next-line
  }, [tab])

  async function fetchLeaderboard(period) {
    setLoading(true)

    if (period === 'all_time') {
      const { data } = await supabase
        .from('profiles')
        .select('id, username, total_ep, rank_label, character_gender, housing_level, current_streak')
        .order('total_ep', { ascending: false })
        .limit(50)
      setRows(data || [])
    } else {
      const daysBack = period === 'daily' ? 1 : 7
      const since = new Date()
      since.setDate(since.getDate() - daysBack)
      const sinceStr = since.toISOString().slice(0, 10)

      const { data } = await supabase
        .from('daily_activity')
        .select('user_id, ep_earned_today, profiles(username, character_gender, rank_label, housing_level, current_streak)')
        .gte('activity_date', sinceStr)

      const totals = {}
      for (const row of data || []) {
        if (!totals[row.user_id]) {
          totals[row.user_id] = {
            id: row.user_id,
            username: row.profiles?.username,
            character_gender: row.profiles?.character_gender,
            rank_label: row.profiles?.rank_label,
            housing_level: row.profiles?.housing_level,
            current_streak: row.profiles?.current_streak,
            total_ep: 0
          }
        }
        totals[row.user_id].total_ep += row.ep_earned_today
      }
      const sorted = Object.values(totals).sort((a, b) => b.total_ep - a.total_ep).slice(0, 50)
      setRows(sorted)
    }
    setLoading(false)
  }

  return (
    <div className="screen safe-top" style={{ paddingTop: 24 }}>
      <div className="container fade-in">
        <div className="display" style={{ fontSize: 32, color: '#F0A830', marginBottom: 4 }}>LEADERBOARD</div>
        <p style={{ fontSize: 13, color: '#8A82A0', marginBottom: 20 }}>
          See who's rising fastest in the community.
        </p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {[
            { key: 'daily', label: 'Today' },
            { key: 'weekly', label: 'This Week' },
            { key: 'all_time', label: 'All Time' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 12,
                fontSize: 13, fontWeight: 700,
                background: tab === t.key ? 'linear-gradient(135deg,#F0A830,#C8892A)' : '#161024',
                color: tab === t.key ? '#1a0f00' : '#8A82A0',
                border: tab === t.key ? 'none' : '1px solid rgba(255,255,255,0.06)'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: '#8A82A0', padding: 40 }}>Loading rankings...</div>
        ) : rows.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: '#8A82A0', padding: 30 }}>
            No activity yet for this period.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {rows.map((row, i) => {
              const isMe = row.id === profile?.id
              const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null
              return (
                <button
                  key={row.id}
                  onClick={() => setSelectedUser(row)}
                  className="card"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                    border: isMe ? '1.5px solid rgba(240,168,48,0.4)' : '1px solid rgba(255,255,255,0.06)',
                    background: isMe ? 'rgba(240,168,48,0.06)' : '#161024',
                    width: '100%', textAlign: 'left', cursor: 'pointer'
                  }}
                >
                  <div style={{
                    width: 28, textAlign: 'center', fontWeight: 800, fontSize: medal ? 20 : 14,
                    color: medal ? 'inherit' : '#8A82A0'
                  }}>
                    {medal || `#${i + 1}`}
                  </div>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'linear-gradient(135deg,#A06EF0,#7B3FCC)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
                  }}>
                    {row.character_gender === 'male' ? '🧑‍🦱' : '👩'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>
                      {row.username} {isMe && <span style={{ color: '#F0A830', fontSize: 11 }}>(you)</span>}
                    </div>
                    <div style={{ fontSize: 11, color: '#8A82A0' }}>{row.rank_label}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: '#F0A830', fontSize: 14 }}>
                      {row.total_ep.toLocaleString()}
                    </div>
                    <div style={{ fontSize: 10, color: '#8A82A0' }}>EP</div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {selectedUser && (
        <PublicProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  )
}
