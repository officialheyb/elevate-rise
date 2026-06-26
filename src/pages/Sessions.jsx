import { useState, useEffect } from 'react'
import { useAuth } from '../lib/AuthContext'
import { supabase } from '../lib/supabase'
import { useToast } from '../components/useToast'

function getChicagoTime() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' }))
}

function getWindowStatus(hour) {
  const now = getChicagoTime()
  const h = now.getHours()
  const m = now.getMinutes()
  const nowMins = h * 60 + m
  const windowStart = hour * 60
  const windowEnd = hour * 60 + 60

  if (nowMins >= windowStart && nowMins <= windowEnd) return 'open'
  if (nowMins < windowStart) return 'upcoming'
  return 'closed'
}

function minutesUntil(hour) {
  const now = getChicagoTime()
  const nowMins = now.getHours() * 60 + now.getMinutes()
  let target = hour * 60
  let diff = target - nowMins
  if (diff < 0) diff += 24 * 60
  const hh = Math.floor(diff / 60)
  const mm = diff % 60
  return `${hh}h ${mm}m`
}

export default function Sessions() {
  const { profile, refreshProfile } = useAuth()
  const { showToast, ToastEl } = useToast()
  const [activity, setActivity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [, setTick] = useState(0)

  useEffect(() => {
    fetchActivity()
    const interval = setInterval(() => setTick(t => t + 1), 30000)
    return () => clearInterval(interval)
    // eslint-disable-next-line
  }, [])

  async function fetchActivity() {
    if (!profile?.id) return
    const today = new Date().toISOString().slice(0, 10)
    const { data } = await supabase
      .from('daily_activity')
      .select('*')
      .eq('user_id', profile.id)
      .eq('activity_date', today)
      .maybeSingle()
    setActivity(data)
    setLoading(false)
  }

  async function checkIn(session) {
    const { data, error } = await supabase.rpc('handle_session_checkin', {
      p_user_id: profile.id,
      p_session: session
    })
    if (error) {
      showToast('Something went wrong', '⚠️')
      return
    }
    if (data.window_closed) {
      showToast(`The ${session} window isn't open right now`, '⏳')
    } else if (data.already_checked_in) {
      showToast("You've already checked in for this session", '✅')
    } else if (data.success) {
      showToast(`+${data.ep_awarded} EP! Session locked in`, '🔥')
      fetchActivity()
      refreshProfile()
    }
  }

  const morningStatus = getWindowStatus(8)
  const eveningStatus = getWindowStatus(20)
  const morningDone = !!activity?.morning_session_at
  const eveningDone = !!activity?.evening_session_at

  return (
    <div className="screen safe-top" style={{ paddingTop: 24 }}>
      <div className="container fade-in">
        <div className="display" style={{ fontSize: 32, color: '#F0A830', marginBottom: 4 }}>LIFT SESSIONS</div>
        <p style={{ fontSize: 13, color: '#8A82A0', marginBottom: 24 }}>
          Show up twice a day. +1,000 EP per session. Push together, pray together, elevate forever.
        </p>

        {loading ? (
          <div style={{ textAlign: 'center', color: '#8A82A0', padding: 40 }}>Loading...</div>
        ) : (
          <>
            <SessionCard
              icon="🌅"
              title="Morning Lift"
              time="8:00 AM"
              tz="Central Time"
              status={morningDone ? 'done' : morningStatus}
              countdown={morningStatus === 'upcoming' ? minutesUntil(8) : null}
              color="gold"
              onCheckIn={() => checkIn('morning')}
            />
            <div style={{ height: 14 }} />
            <SessionCard
              icon="🌙"
              title="Evening Lift"
              time="8:00 PM"
              tz="Central Time"
              status={eveningDone ? 'done' : eveningStatus}
              countdown={eveningStatus === 'upcoming' ? minutesUntil(20) : null}
              color="purple"
              onCheckIn={() => checkIn('evening')}
            />

            <div className="card" style={{ marginTop: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: '#8A82A0', marginBottom: 4 }}>TODAY'S SESSION EP</div>
              <div className="display" style={{ fontSize: 28, color: '#FFD060' }}>
                {((morningDone ? 1000 : 0) + (eveningDone ? 1000 : 0)).toLocaleString()} / 2,000
              </div>
            </div>
          </>
        )}
      </div>
      {ToastEl}
    </div>
  )
}

function SessionCard({ icon, title, time, tz, status, countdown, color, onCheckIn }) {
  const isDone = status === 'done'
  const isOpen = status === 'open'
  const isClosed = status === 'closed'

  const accentColor = color === 'gold' ? '#F0A830' : '#A06EF0'
  const accentBg = color === 'gold' ? 'rgba(240,168,48,0.08)' : 'rgba(160,110,240,0.08)'
  const accentBorder = color === 'gold' ? 'rgba(240,168,48,0.3)' : 'rgba(160,110,240,0.3)'

  return (
    <div className="card" style={{
      border: isOpen ? `2px solid ${accentBorder}` : '1px solid rgba(255,255,255,0.06)',
      background: isOpen ? accentBg : '#161024'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
        <div style={{ fontSize: 36 }}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 17 }}>{title}</div>
          <div style={{ fontSize: 12, color: '#8A82A0' }}>{time} · {tz}</div>
        </div>
        {isOpen && (
          <div style={{
            fontSize: 11, fontWeight: 700, color: accentColor, letterSpacing: 1,
            display: 'flex', alignItems: 'center', gap: 4
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%', background: accentColor,
              animation: 'pulse 1.2s ease-in-out infinite'
            }} />
            LIVE
          </div>
        )}
      </div>

      {isDone ? (
        <div className="btn" style={{
          background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ADE80'
        }}>
          ✅ Checked in · +1,000 EP earned
        </div>
      ) : isOpen ? (
        <button
          className="btn"
          onClick={onCheckIn}
          style={{
            background: color === 'gold'
              ? 'linear-gradient(135deg, #FFD060, #F0A830)'
              : 'linear-gradient(135deg, #A06EF0, #7B3FCC)',
            color: color === 'gold' ? '#1a0f00' : '#fff',
            boxShadow: color === 'gold'
              ? '0 4px 0 #C8892A, 0 6px 20px rgba(240,168,48,0.35)'
              : '0 4px 0 #5a2ba8, 0 6px 20px rgba(123,63,204,0.35)'
          }}
        >
          Check In Now · +1,000 EP
        </button>
      ) : isClosed ? (
        <div className="btn btn-ghost" style={{ opacity: 0.5 }}>
          Window closed for today
        </div>
      ) : (
        <div className="btn btn-ghost">
          Opens in {countdown}
        </div>
      )}
    </div>
  )
}
