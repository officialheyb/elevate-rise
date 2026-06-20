import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './lib/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Tap from './pages/Tap'
import Sessions from './pages/Sessions'
import Leaderboard from './pages/Leaderboard'
import Referrals from './pages/Referrals'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import MyHome from './pages/MyHome'
import BottomNav from './components/BottomNav'

function PrivateRoute({ children }) {
  const { session, loading } = useAuth()
  if (loading) return <SplashLoader />
  if (!session) return <Navigate to="/login" replace />
  return children
}

function SplashLoader() {
  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 16
    }}>
      <div className="display" style={{
        fontSize: 48, color: '#F0A830',
        textShadow: '0 0 30px rgba(240,168,48,0.5)',
        animation: 'pulse 1.5s ease-in-out infinite'
      }}>ELEV8</div>
      <div style={{ color: '#8A82A0', fontSize: 13, letterSpacing: 1 }}>Loading your rise...</div>
    </div>
  )
}

export default function App() {
  const { session } = useAuth()

  return (
    <>
      <Routes>
        <Route path="/login" element={session ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={session ? <Navigate to="/" /> : <Register />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/home" element={<PrivateRoute><MyHome /></PrivateRoute>} />
        <Route path="/tap" element={<PrivateRoute><Tap /></PrivateRoute>} />
        <Route path="/sessions" element={<PrivateRoute><Sessions /></PrivateRoute>} />
        <Route path="/leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
        <Route path="/referrals" element={<PrivateRoute><Referrals /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
      </Routes>
      {session && <BottomNav />}
    </>
  )
}
