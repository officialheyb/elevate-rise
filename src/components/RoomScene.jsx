// Illustrated "room" scenes built entirely from CSS/divs.
// Swap to a real <img src={tier.image}> once AI art is ready —
// see HouseInteriorModal.jsx for the swap logic.

export default function RoomScene({ tier }) {
  const { palette, sceneType } = tier

  return (
    <div style={{
      position: 'relative', width: '100%', aspectRatio: '4/3',
      borderRadius: 16, overflow: 'hidden',
      background: `linear-gradient(180deg, ${palette.wall} 0%, ${palette.wall} 60%, ${palette.floor} 60%, ${palette.floor} 100%)`,
    }}>
      {sceneType === 'busted-studio' && <BustedStudio palette={palette} />}
      {sceneType === 'small-apartment' && <SmallApartment palette={palette} />}
      {sceneType === 'townhome' && <Townhome palette={palette} />}
      {sceneType === 'house' && <HouseScene palette={palette} />}
      {sceneType === 'luxury' && <LuxuryScene palette={palette} />}
      {sceneType === 'mansion' && <MansionScene palette={palette} />}

      {/* vignette for mood */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 120% 100% at 50% 50%, transparent 50%, rgba(0,0,0,0.35) 100%)',
        pointerEvents: 'none'
      }} />
    </div>
  )
}

// ── TIER 0: Busted Studio ──
function BustedStudio({ palette }) {
  return (
    <>
      {/* bare bulb */}
      <div style={{ position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)', width: 1, height: 26, background: '#5a5040' }} />
      <div style={{
        position: 'absolute', top: 30, left: '50%', transform: 'translateX(-50%)',
        width: 16, height: 20, borderRadius: '50% 50% 60% 60%',
        background: 'radial-gradient(circle, #fff8d0, #d4c060)',
        boxShadow: '0 0 30px 10px rgba(255,240,180,0.4)'
      }} />

      {/* cracked wall patch */}
      <div style={{ position: 'absolute', top: '10%', left: '8%', width: '30%', height: '25%', opacity: 0.15, background: 'repeating-linear-gradient(115deg, transparent, transparent 8px, #000 9px)' }} />

      {/* sheet curtain over window */}
      <div style={{ position: 'absolute', top: '8%', right: '6%', width: '32%', height: '40%', background: '#e8e0c8', opacity: 0.85, borderRadius: 2, boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(90deg, transparent, transparent 10%, rgba(0,0,0,0.06) 11%)' }} />
        <div style={{ position: 'absolute', top: -4, left: 0, right: 0, height: 6, background: '#7a6a4a' }} />
      </div>

      {/* mattress on floor */}
      <div style={{ position: 'absolute', bottom: '8%', left: '6%', width: '38%', height: '14%', background: 'linear-gradient(180deg,#9a8f72,#7a7058)', borderRadius: 6, boxShadow: '0 4px 10px rgba(0,0,0,0.4)' }}>
        <div style={{ position: 'absolute', top: 3, left: 3, right: 3, height: '40%', background: 'rgba(255,255,255,0.12)', borderRadius: 4 }} />
      </div>
      <div style={{ position: 'absolute', bottom: '20%', left: '8%', width: '14%', height: '8%', background: '#bcb29a', borderRadius: '40%', opacity: 0.8 }} /> {/* pillow */}

      {/* old tub silhouette in corner */}
      <div style={{ position: 'absolute', bottom: '6%', right: '5%', width: '34%', height: '20%' }}>
        <div style={{
          width: '100%', height: '100%', borderRadius: '40% 40% 12% 12%',
          background: 'linear-gradient(180deg, #c9c2a8, #a39c84)',
          border: '2px solid #8a8268', position: 'relative'
        }}>
          {/* rust streaks */}
          <div style={{ position: 'absolute', top: '20%', left: '20%', width: 3, height: '60%', background: '#8a5a30', opacity: 0.5, borderRadius: 4 }} />
          <div style={{ position: 'absolute', top: '15%', left: '55%', width: 2, height: '50%', background: '#8a5a30', opacity: 0.4, borderRadius: 4 }} />
          {/* faucet */}
          <div style={{ position: 'absolute', top: -10, left: '15%', width: 10, height: 12, background: '#6a6458', borderRadius: 3 }} />
        </div>
      </div>

      {/* floor cracks */}
      <div style={{ position: 'absolute', bottom: '2%', left: '40%', width: '20%', height: 2, background: 'rgba(0,0,0,0.3)', transform: 'rotate(-8deg)' }} />
    </>
  )
}

// ── TIER 1: Small Apartment ──
function SmallApartment({ palette }) {
  return (
    <>
      {/* window with real curtains */}
      <div style={{ position: 'absolute', top: '6%', right: '8%', width: '28%', height: '38%', background: 'linear-gradient(180deg,#cfe0ea,#9bb8cc)', borderRadius: 4, border: '3px solid #6a5a40' }} />
      <div style={{ position: 'absolute', top: '4%', right: '6%', width: 10, height: '44%', background: '#a8703a', borderRadius: 2 }} />
      <div style={{ position: 'absolute', top: '4%', right: '34%', width: 10, height: '44%', background: '#a8703a', borderRadius: 2 }} />

      {/* bed with frame */}
      <div style={{ position: 'absolute', bottom: '8%', left: '6%', width: '36%', height: '6%', background: '#5a4530', borderRadius: '4px 4px 0 0' }} />
      <div style={{ position: 'absolute', bottom: '13%', left: '6%', width: '36%', height: '14%', background: 'linear-gradient(180deg,#d8cdb0,#b8a888)', borderRadius: 6 }}>
        <div style={{ position: 'absolute', top: 3, left: 3, width: '35%', height: '60%', background: '#fff', opacity: 0.5, borderRadius: 4 }} />
      </div>
      <div style={{ position: 'absolute', bottom: '14%', left: '3%', width: 6, height: '20%', background: '#5a4530', borderRadius: 2 }} />

      {/* small table */}
      <div style={{ position: 'absolute', bottom: '6%', left: '52%', width: '16%', height: '14%', background: '#8a6a44', borderRadius: 3 }} />
      <div style={{ position: 'absolute', bottom: '4%', left: '54%', width: 3, height: '12%', background: '#5a4530' }} />
      <div style={{ position: 'absolute', bottom: '4%', left: '63%', width: 3, height: '12%', background: '#5a4530' }} />

      {/* clean tub */}
      <div style={{ position: 'absolute', bottom: '6%', right: '5%', width: '26%', height: '18%', borderRadius: '30% 30% 10% 10%', background: 'linear-gradient(180deg,#f0eee5,#dcd8c8)', border: '2px solid #c0b89a' }} />
    </>
  )
}

// ── TIER 2: Townhome ──
function Townhome({ palette }) {
  return (
    <>
      {/* window with blinds */}
      <div style={{ position: 'absolute', top: '5%', left: '6%', width: '24%', height: '36%', background: 'linear-gradient(180deg,#bcd8e8,#88b0cc)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 12%, rgba(255,255,255,0.4) 13%)' }} />
      </div>
      <div style={{ position: 'absolute', top: '4%', left: '5%', width: '26%', height: '38%', border: '3px solid #7a5a38', borderRadius: 5, boxSizing: 'border-box' }} />

      {/* couch */}
      <div style={{ position: 'absolute', bottom: '6%', left: '34%', width: '30%', height: '16%', background: 'linear-gradient(180deg,#7a5a8a,#5a3a6a)', borderRadius: 8 }}>
        <div style={{ position: 'absolute', top: -8, left: 4, width: '40%', height: 10, background: '#7a5a8a', borderRadius: '6px 6px 0 0' }} />
        <div style={{ position: 'absolute', top: -8, right: 4, width: '40%', height: 10, background: '#7a5a8a', borderRadius: '6px 6px 0 0' }} />
      </div>

      {/* kitchen counter */}
      <div style={{ position: 'absolute', bottom: '6%', right: '5%', width: '28%', height: '14%', background: 'linear-gradient(180deg,#e0d8c0,#c8bc98)', borderRadius: 4 }} />
      <div style={{ position: 'absolute', bottom: '18%', right: '7%', width: '24%', height: '10%', background: '#5a4a36', borderRadius: '4px 4px 0 0' }} />

      {/* floor lines (hardwood) */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: `repeating-linear-gradient(90deg, transparent, transparent 8%, rgba(0,0,0,0.06) 8.3%)` }} />
    </>
  )
}

// ── TIER 3: House ──
function HouseScene({ palette }) {
  return (
    <>
      {/* big window with yard view */}
      <div style={{ position: 'absolute', top: '4%', left: '6%', width: '40%', height: '42%', background: 'linear-gradient(180deg,#a8d8e0 0%,#a8d8e0 60%,#7ab87a 60%,#5a9a5a 100%)', borderRadius: 6, border: '4px solid #8a6a40' }} />

      {/* kitchen island */}
      <div style={{ position: 'absolute', bottom: '6%', left: '52%', width: '30%', height: '16%', background: 'linear-gradient(180deg,#2a2a2e,#1a1a1e)', borderRadius: 6 }}>
        <div style={{ position: 'absolute', top: -4, left: 0, right: 0, height: 6, background: '#3a3a3e', borderRadius: 4 }} />
      </div>

      {/* couch, nicer */}
      <div style={{ position: 'absolute', bottom: '6%', left: '6%', width: '34%', height: '18%', background: 'linear-gradient(180deg,#6a8a9a,#4a6a7a)', borderRadius: 10 }} />

      {/* walk-in shower glass */}
      <div style={{ position: 'absolute', top: '6%', right: '5%', width: '20%', height: '40%', background: 'rgba(180,210,220,0.3)', border: '2px solid rgba(255,255,255,0.4)', borderRadius: 4 }} />
    </>
  )
}

// ── TIER 4: Luxury ──
function LuxuryScene({ palette }) {
  return (
    <>
      {/* floor to ceiling window, city view */}
      <div style={{ position: 'absolute', top: '3%', left: 0, width: '55%', height: '60%', background: 'linear-gradient(180deg,#1a2a4a 0%,#3a4a6a 50%,#5a4a3a 100%)', overflow: 'hidden' }}>
        {[...Array(8)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute', bottom: `${10 + (i % 3) * 12}%`, left: `${i * 13}%`,
            width: '6%', height: `${20 + (i % 4) * 10}%`,
            background: '#0a1428', opacity: 0.8
          }} />
        ))}
        {/* lit windows in skyline */}
        {[...Array(14)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute', bottom: `${15 + (i % 5) * 8}%`, left: `${5 + i * 7}%`,
            width: 2, height: 2, background: '#ffd060', opacity: 0.8, borderRadius: 1
          }} />
        ))}
      </div>

      {/* designer sofa */}
      <div style={{ position: 'absolute', bottom: '6%', left: '8%', width: '38%', height: '16%', background: 'linear-gradient(180deg,#c8a868,#a88848)', borderRadius: 10 }} />

      {/* rain shower + freestanding tub */}
      <div style={{ position: 'absolute', bottom: '6%', right: '6%', width: '26%', height: '20%', borderRadius: '50% 50% 20% 20%', background: 'linear-gradient(180deg,#fff,#e8e4d8)', border: '2px solid #d0c8a8' }} />
    </>
  )
}

// ── TIER 5: Mansion ──
function MansionScene({ palette }) {
  return (
    <>
      {/* grand window with private grounds */}
      <div style={{ position: 'absolute', top: '3%', left: '4%', width: '46%', height: '50%', background: 'linear-gradient(180deg,#bce0ec 0%,#bce0ec 55%,#6aa86a 55%,#4a8a4a 100%)', borderRadius: 6, border: '5px solid #d4b860' }} />

      {/* marble floor pattern */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%', background: 'linear-gradient(135deg, #e8e0c8 25%, #d8d0b8 25%, #d8d0b8 50%, #e8e0c8 50%, #e8e0c8 75%, #d8d0b8 75%)', backgroundSize: '24px 24px' }} />

      {/* grand staircase suggestion */}
      <div style={{ position: 'absolute', bottom: '6%', right: '6%', width: '26%', height: '40%' }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute', bottom: `${i * 7}%`, right: 0,
            width: `${100 - i * 8}%`, height: '8%',
            background: '#e8dcb8', border: '1px solid #c8b888'
          }} />
        ))}
      </div>

      {/* gold accents / chandelier hint */}
      <div style={{ position: 'absolute', top: 4, left: '55%', width: 2, height: 18, background: '#d4b860' }} />
      <div style={{
        position: 'absolute', top: 20, left: '52%', width: '10%', height: 14, borderRadius: '50%',
        background: 'radial-gradient(circle, #fff4c8, #d4b860)',
        boxShadow: '0 0 40px 14px rgba(255,224,140,0.5)'
      }} />
    </>
  )
}
