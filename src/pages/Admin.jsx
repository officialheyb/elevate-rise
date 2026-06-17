import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { supabase } from '../lib/supabase'
import { useToast } from '../components/useToast'

export default function Admin() {
  const { profile } = useAuth()
  const { showToast, ToastEl } = useToast()
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [epAmount, setEpAmount] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  if (!profile?.is_admin) {
    return <Navigate to="/" replace />
  }

  async function handleSearch(e) {
    e.preventDefault()
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .ilike('username', `%${search}%`)
      .limit(10)
    setUsers(data || [])
    setLoading(false)
  }

  async function grantEp() {
    if (!selectedUser || !epAmount) return
    const amount = parseInt(epAmount)
    if (isNaN(amount)) return

    const { error } = await supabase.rpc('award_ep', {
      p_user_id: selectedUser.id,
      p_amount: amount,
      p_source: amount >= 0 ? 'admin_grant' : 'admin_removal',
      p_note: note || null
    })

    if (error) {
      showToast('Failed to update EP', '⚠️')
    } else {
      showToast(`${amount >= 0 ? 'Granted' : 'Removed'} ${Math.abs(amount)} EP`, amount >= 0 ? '✅' : '➖')
      setEpAmount('')
      setNote('')
      // refresh selected user
      const { data } = await supabase.from('profiles').select('*').eq('id', selectedUser.id).single()
      setSelectedUser(data)
    }
  }

  return (
    <div className="screen safe-top" style={{ paddingTop: 24 }}>
      <div className="container fade-in">
        <div className="display" style={{ fontSize: 32, color: '#F0A830', marginBottom: 4 }}>ADMIN PANEL</div>
        <p style={{ fontSize: 13, color: '#8A82A0', marginBottom: 20 }}>
          Manage members, grant rewards, review activity.
        </p>

        <form onSubmit={handleSearch} style={{ marginBottom: 20 }}>
          <div className="input-group" style={{ marginBottom: 10 }}>
            <input
              className="input" placeholder="Search by username..."
              value={search} onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-gold" type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {users.length > 0 && !selectedUser && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {users.map(u => (
              <button
                key={u.id}
                className="card"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}
                onClick={() => setSelectedUser(u)}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{u.username}</div>
                  <div style={{ fontSize: 11, color: '#8A82A0' }}>{u.rank_label}</div>
                </div>
                <div style={{ fontWeight: 800, color: '#F0A830' }}>{u.total_ep.toLocaleString()} EP</div>
              </button>
            ))}
          </div>
        )}

        {selectedUser && (
          <div className="card" style={{ marginBottom: 20, border: '1px solid rgba(240,168,48,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{selectedUser.username}</div>
                <div style={{ fontSize: 12, color: '#8A82A0' }}>
                  {selectedUser.total_ep.toLocaleString()} EP · {selectedUser.rank_label} · Streak {selectedUser.current_streak}
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} style={{ fontSize: 13, color: '#8A82A0' }}>✕</button>
            </div>

            <div className="input-group">
              <label className="input-label">EP Amount (use negative to remove)</label>
              <input
                className="input" type="number" placeholder="e.g. 5000 or -2000"
                value={epAmount} onChange={e => setEpAmount(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Note (optional)</label>
              <input
                className="input" placeholder="Reason for adjustment"
                value={note} onChange={e => setNote(e.target.value)}
              />
            </div>
            <button className="btn btn-gold" onClick={grantEp} disabled={!epAmount}>
              Apply EP Change
            </button>
          </div>
        )}

        <div className="card" style={{ border: '1px dashed rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: 12, color: '#8A82A0', lineHeight: 1.6 }}>
            💡 Search a user above to view details and grant or remove EP manually.
            All adjustments are logged in the ep_transactions table for audit purposes.
          </div>
        </div>
      </div>
      {ToastEl}
    </div>
  )
}
