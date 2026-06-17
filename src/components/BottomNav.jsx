import { NavLink } from 'react-router-dom'

const items = [
  { to: '/', icon: '🏠', label: 'Home' },
  { to: '/tap', icon: '👆', label: 'Tap' },
  { to: '/sessions', icon: '⏰', label: 'Sessions' },
  { to: '/leaderboard', icon: '🏆', label: 'Ranks' },
  { to: '/profile', icon: '👤', label: 'Profile' },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {items.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <span className="nav-icon">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
