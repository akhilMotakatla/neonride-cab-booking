import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authLogin } from '../services/api'

export default function Login() {
  const navigate = useNavigate()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const data = await authLogin({ email, password })
      localStorage.setItem('neonride_token', data.token)
      localStorage.setItem('neonride_user', JSON.stringify({ userId: data.userId, fullName: data.fullName, email: data.email }))
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      <div className="auth-card fade-in-up">
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'32px' }}>
          <div style={{ width:'48px', height:'48px', borderRadius:'14px',
            background:'linear-gradient(135deg, var(--cyan), var(--purple))',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'24px', boxShadow:'var(--glow-cyan)' }}>🚖</div>
          <div>
            <div style={{ fontSize:'24px', fontWeight:700, fontFamily:'var(--font-display)' }} className="gradient-text">
              NeonRide
            </div>
            <div style={{ fontSize:'11px', color:'var(--text-muted)', letterSpacing:'0.12em', textTransform:'uppercase' }}>
              Premium Rides
            </div>
          </div>
        </div>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to access your account, ride history, and saved preferences.</p>

        {error && <div className="error-msg" style={{ marginBottom:'16px' }}>⚠ {error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Email address</label>
            <input className="input" type="email" required placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input className="input" type="password" required placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button className="btn btn-primary w-full" type="submit" disabled={loading}
            style={{ marginTop:'10px', padding:'15px', fontSize:'15px' }}>
            {loading ? <><span className="loading-spinner" /> Signing in…</> : '→ Sign In'}
          </button>
        </form>

        <div className="auth-divider" style={{ marginTop:'24px' }}>or continue as</div>
        <Link to="/" className="btn btn-ghost w-full" style={{ textAlign:'center', display:'flex', marginTop:'4px' }}>
          🚀 Guest — no account needed
        </Link>

        <p className="auth-footer" style={{ marginTop:'20px' }}>
          Don't have an account?{' '}
          <Link to="/signup" className="auth-link">Create one free →</Link>
        </p>

        <div className="trust-badges">
          <div className="trust-badge">🔒 256-bit SSL</div>
          <div className="trust-badge">✦ 4.9★ Rated</div>
          <div className="trust-badge">🌎 All 50 States</div>
        </div>
      </div>
    </div>
  )
}
