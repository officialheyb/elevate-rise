import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import RoomScene from './RoomScene'
import { HOUSING } from '../lib/housingConfig'

export default function HouseInteriorModal({ tier, currentLevel, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!tier) return null

  const isLocked = tier.level > currentLevel
  const isCurrent = tier.level === currentLevel

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(5,3,10,0.85)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="fade-in"
        style={{
          width: '100%', maxWidth: 480,
          maxHeight: '88vh', overflowY: 'auto',
          background: '#0D0919',
          borderRadius: '24px 24px 0 0',
          border: '1px solid rgba(240,168,48,0.2)',
          padding: '20px 20px calc(28px + env(safe-area-inset-bottom))'
        }}
      >
        {/* drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{ width: 40, height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.15)' }} />
        </div>

        {/* close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)', color: '#8A82A0',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
          }}
        >✕</button>

        {/* Room visual */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <RoomScene tier={tier} />
          {tier.image && (
            <img src={tier.image} alt={tier.name} style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', borderRadius: 16
            }} />
          )}
          {isLocked && (
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 16,
              background: 'rgba(5,3,10,0.7)', backdropFilter: 'blur(3px)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8
            }}>
              <div style={{ fontSize: 32 }}>🔒</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
                {(tier.ep - 0).toLocaleString()} EP required
              </div>
            </div>
          )}
        </div>

        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 28 }}>{tier.emoji}</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 19 }}>{tier.name}</div>
            <div style={{ fontSize: 12, color: '#8A82A0' }}>Tier {tier.level} · {tier.ep.toLocaleString()} EP</div>
          </div>
          {isCurrent && (
            <span style={{
              marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: '#4ADE80',
              background: 'rgba(74,222,128,0.12)', padding: '4px 12px', borderRadius: 50
            }}>
              YOUR HOME
            </span>
          )}
        </div>

        <div style={{
          fontSize: 13, color: '#F0A830', fontWeight: 600, fontStyle: 'italic', marginBottom: 14
        }}>
          "{tier.mood}"
        </div>

        <p style={{ fontSize: 14, color: '#C0B8D0', lineHeight: 1.7, marginBottom: 18 }}>
          {tier.description}
        </p>

        {/* Detail list */}
        <div style={{ fontSize: 11, color: '#8A82A0', fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>
          WHAT'S INSIDE
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {tier.details.map((d, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: '#A89FBC' }}>
              <span style={{ color: tier.palette.accent, marginTop: 1 }}>•</span>
              {d}
            </div>
          ))}
        </div>

        {isLocked ? (
          <Link to="/tap" className="btn btn-gold" onClick={onClose} style={{ textDecoration: 'none' }}>
            Earn EP to unlock →
          </Link>
        ) : (
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
        )}
      </div>
    </div>
  )
}
