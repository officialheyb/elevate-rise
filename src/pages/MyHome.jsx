import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { HOUSING } from '../lib/housingConfig'
import RoomScene from '../components/RoomScene'
import HouseInteriorModal from '../components/HouseInteriorModal'

export default function MyHome() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [selectedTier, setSelectedTier] = useState(null)

  if (!profile) return null

  return (
    <div className="screen safe-top" style={{ paddingTop: 24 }}>
      <div className="container fade-in">
        <button onClick={() => navigate(-1)} style={{ color: '#8A82A0', fontSize: 13, marginBottom: 14 }}>
          ← Back
        </button>
        <div className="display" style={{ fontSize: 32, color: '#F0A830', marginBottom: 4 }}>MY HOME</div>
        <p style={{ fontSize: 13, color: '#8A82A0', marginBottom: 24 }}>
          Tap any tier to step inside. Your housing upgrades automatically as your EP grows.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {HOUSING.map(tier => {
            const isCurrent = tier.level === profile.housing_level
            const isUnlocked = tier.level <= profile.housing_level

            return (
              <button
                key={tier.level}
                onClick={() => setSelectedTier(tier)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  borderRadius: 18, overflow: 'hidden',
                  border: isCurrent ? '2px solid rgba(240,168,48,0.5)' : '1px solid rgba(255,255,255,0.06)',
                  background: '#161024', position: 'relative'
                }}
              >
                <div style={{ position: 'relative' }}>
                  <div style={{ aspectRatio: '16/7', position: 'relative' }}>
                    <RoomScene tier={tier} />
                    {tier.image && (
                      <img src={tier.image} alt={tier.name} style={{
                        position: 'absolute', inset: 0, width: '100%', height: '100%',
                        objectFit: 'cover'
                      }} />
                    )}
                  </div>
                  {!isUnlocked && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(5,3,10,0.65)', backdropFilter: 'blur(2px)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <div style={{ fontSize: 28 }}>🔒</div>
                    </div>
                  )}
                  {isCurrent && (
                    <div style={{
                      position: 'absolute', top: 10, right: 10,
                      fontSize: 10, fontWeight: 700, color: '#1a0f00',
                      background: 'linear-gradient(135deg,#FFD060,#F0A830)',
                      padding: '4px 10px', borderRadius: 50, letterSpacing: 0.5
                    }}>
                      YOUR HOME
                    </div>
                  )}
                </div>
                <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{tier.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>{tier.name}</div>
                    <div style={{ fontSize: 11, color: '#8A82A0' }}>
                      {tier.ep === 0 ? 'Starting tier' : `${tier.ep.toLocaleString()} EP required`}
                    </div>
                  </div>
                  <div style={{ color: isUnlocked ? '#F0A830' : '#5F5876', fontSize: 16 }}>→</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {selectedTier && (
        <HouseInteriorModal
          tier={selectedTier}
          currentLevel={profile.housing_level}
          onClose={() => setSelectedTier(null)}
        />
      )}
    </div>
  )
}
