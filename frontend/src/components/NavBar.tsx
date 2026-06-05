import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function NavBar() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const user      = getUser()

  function getUser() {
    try { return JSON.parse(localStorage.getItem('neonride_user') ?? 'null') } catch { return null }
  }
  function logout() {
    localStorage.removeItem('neonride_token')
    localStorage.removeItem('neonride_user')
    navigate('/')
  }
  const isActive = (p: string) => location.pathname === p ? 'navbar-link active' : 'navbar-link'

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <div className="navbar-logo-icon">🚖</div>
        <span className="gradient-text">NeonRide</span>
        <span style={{ fontSize: '11px', fontFamily: 'var(--font-body)',
          fontWeight: 400, color: 'var(--text-muted)', letterSpacing: '0.15em',
          marginLeft: '2px', textTransform: 'uppercase' }}>
          PREMIUM
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {/* Live status pill */}
        <div className="navbar-pill" style={{ marginRight: '8px' }}>
          <div className="navbar-pill-dot" />
          <span>10,482 drivers online</span>
        </div>

        <Link to="/" className={isActive('/')}>Book Ride</Link>

        {user ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px',
              padding: '6px 14px', borderRadius: '999px',
              background: 'rgba(245,200,66,0.08)',
              border: '1px solid rgba(245,200,66,0.2)', marginLeft: '6px' }}>
              <span style={{ fontSize: '16px' }}>👤</span>
              <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                {user.fullName.split(' ')[0]}
              </span>
            </div>
            <button
              className="btn btn-ghost"
              style={{ padding: '7px 16px', fontSize: '13px' }}
              onClick={logout}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login"  className={isActive('/login')}>Sign In</Link>
            <Link to="/signup" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '13px' }}>
              ✦ Join Free
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
