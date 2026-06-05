import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar    from './components/NavBar'
import Dashboard from './pages/Dashboard'
import TrackRide from './pages/TrackRide'
import Login     from './pages/Login'
import Signup    from './pages/Signup'
import ChatWidget from './components/ChatWidget'
import CityScape  from './components/CityScape'

export default function App() {
  return (
    <BrowserRouter>
      {/* ── Global CSS-only background (no canvas here — dashboard has its own 3D canvas) ── */}
      <div className="global-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
        <div className="grid-3d-wrap">
          <div className="grid-3d" />
        </div>
        <div className="city-skyline">
          <CityScape />
        </div>
      </div>

      <div className="app-layout">
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/"              element={<Dashboard />} />
            <Route path="/track/:rideId" element={<TrackRide />} />
            <Route path="/login"         element={<Login />} />
            <Route path="/signup"        element={<Signup />} />
          </Routes>
        </main>
        <ChatWidget />
      </div>
    </BrowserRouter>
  )
}
