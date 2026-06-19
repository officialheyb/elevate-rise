// ════════════════════════════════════════════════════════════
// HOUSING CONFIG — single source of truth for all housing tiers
// ════════════════════════════════════════════════════════════
//
// To swap in real AI-generated images later: just set `image` to
// a URL (e.g. 'https://yourcdn.com/studio-interior.jpg') on any
// tier below. When `image` is set, it's used instead of the CSS
// scene. No other code needs to change.

export const HOUSING = [
  {
    level: 0,
    name: 'Studio Apartment',
    emoji: '🏠',
    ep: 0,
    image: '/tier-0-studio.jpg',
    mood: 'Rock bottom. This is where everyone starts.',
    description: "A bare studio with peeling paint and a single bare bulb. A mattress sits directly on the floor — no frame. The 'curtains' are just an old bedsheet pinned over the window. The bathtub is rusted and stained, the faucet drips. This is the starting point — humble, a little rough, but it's yours.",
    details: ['Mattress on the floor, no bed frame', 'Bedsheet pinned up as a curtain', 'Old rust-stained tub, dripping faucet', 'Single bare bulb hanging from the ceiling', 'Cracked paint on the walls'],
    sceneType: 'busted-studio',
    palette: { wall: '#3a342b', floor: '#2b261f', accent: '#8a7a5a' }
  },
  {
    level: 1,
    name: 'Small Apartment',
    emoji: '🏡',
    ep: 10000,
    image: null,
    mood: 'Getting somewhere. Still humble, but improving.',
    description: 'A modest one-bedroom. The mattress now has a real frame, and there are proper (if mismatched) curtains. The tub has been re-glazed and actually looks clean. Furniture is secondhand but it\'s starting to feel like a home rather than a holding cell.',
    details: ['Real bed frame, no more floor mattress', 'Mismatched but real curtains', 'Re-glazed, clean tub', 'Secondhand furniture, a small table', 'Fresh coat of paint on one wall'],
    sceneType: 'small-apartment',
    palette: { wall: '#4a4538', floor: '#3a3528', accent: '#c89a4a' }
  },
  {
    level: 2,
    name: 'Townhome',
    emoji: '🏘️',
    ep: 50000,
    image: null,
    mood: 'Comfortable. Things are clicking into place.',
    description: 'A proper townhome with multiple rooms. Real furniture throughout, a matching bedroom set, a kitchen with actual counter space. Natural light pours in through real blinds. This feels like stability.',
    details: ['Matching bedroom furniture set', 'Real blinds, natural light', 'Kitchen with counter space', 'Living room with a couch', 'Hardwood-style flooring'],
    sceneType: 'townhome',
    palette: { wall: '#5a4f3a', floor: '#4a3f2a', accent: '#e0b050' }
  },
  {
    level: 3,
    name: 'House',
    emoji: '🏰',
    ep: 150000,
    image: null,
    mood: 'You made it. A real house, fully yours.',
    description: 'A full house with a yard. Spacious rooms, quality furniture, a proper kitchen island. The bathroom has a walk-in shower and a soaking tub — no more rust, just clean tile and good lighting.',
    details: ['Kitchen island with stone countertop', 'Walk-in shower + soaking tub', 'Spacious living room, quality furniture', 'A real yard out back', 'Large windows, lots of natural light'],
    sceneType: 'house',
    palette: { wall: '#6a5a3f', floor: '#5a4a35', accent: '#f0c060' }
  },
  {
    level: 4,
    name: 'Luxury Home',
    emoji: '🏛️',
    ep: 500000,
    image: null,
    mood: 'Elevated living. Discipline pays off.',
    description: 'High ceilings, designer furniture, floor-to-ceiling windows overlooking the city. The primary bathroom has a rain shower and freestanding tub. Every detail has been considered — this is what consistency built.',
    details: ['Floor-to-ceiling windows, city view', 'Designer furniture throughout', 'Rain shower + freestanding tub', 'Home office / lounge area', 'Smart lighting, high ceilings'],
    sceneType: 'luxury',
    palette: { wall: '#7a6a45', floor: '#6a5a3a', accent: '#ffd060' }
  },
  {
    level: 5,
    name: 'Mansion',
    emoji: '🏆',
    ep: 1000000,
    image: null,
    mood: 'The top of the climb. Total elevation.',
    description: 'A sprawling mansion — marble floors, a grand staircase, a spa-level bathroom with a soaking tub overlooking private grounds. This is the visual proof of everything earned through showing up, every single day.',
    details: ['Marble floors, grand staircase', 'Spa-level primary bathroom', 'Private grounds visible from every window', 'Multiple living spaces', 'Gold and crystal accents throughout'],
    sceneType: 'mansion',
    palette: { wall: '#8a7a50', floor: '#7a6a45', accent: '#ffe080' }
  },
]

export function getHousingForEp(ep) {
  let current = HOUSING[0]
  for (const tier of HOUSING) {
    if (ep >= tier.ep) current = tier
  }
  return current
}

export function getNextHousing(level) {
  return HOUSING[level + 1] || null
}
