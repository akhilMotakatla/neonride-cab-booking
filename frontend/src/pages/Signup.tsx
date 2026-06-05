import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authRegister } from '../services/api'

export default function Signup() {
  const navigate = useNavigate()
  const [fullName,  setFullName]  = useState('')
  const [email,     setEmail]     = useState('')
  const [phone,     setPhone]     = useState('')
  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [error,     setError]     = useState('')
  const [loading,   setLoading]   = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); setError('')
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 6)  { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      const data = await authRegister({ fullName, email, password, phoneNumber: phone || undefined })
      localStorage.setItem('neonride_token', data.token)
      localStorage.setItem('neonride_user', JSON.stringify({ userId: data.userId, fullName: data.fullName, email: data.email }))
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      <div className="auth-card fade-in-up">
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'28px' }}>
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

        <h1 className="auth-title">Join NeonRide</h1>
        <p className="auth-subtitle">Create your account and experience premium rides across all 50 states.</p>

        {error && <div className="error-msg" style={{ marginBottom:'16px' }}>⚠ {error}</div>}

        {/* Perks strip */}
        <div style={{ display:'flex', gap:'6px', marginBottom:'20px', flexWrap:'wrap' }}>
          {['✦ First ride discount', '🔒 Safe & Verified', '📍 50 States'].map(p => (
            <span key={p} style={{ padding:'4px 10px', background:'rgba(0,242,254,0.06)',
              border:'1px solid rgba(0,242,254,0.15)', borderRadius:'999px',
              fontSize:'11px', color:'var(--cyan)', whiteSpace:'nowrap' }}>{p}</span>
          ))}
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input className="input" type="text" required placeholder="Alex Johnson"
              value={fullName} onChange={e => setFullName(e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Email address</label>
            <input className="input" type="email" required placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label">Phone (optional)</label>
            <input className="input" type="tel" placeholder="+1 (555) 000-0000"
              value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
            <div className="input-group">
              <label className="input-label">Password</label>
              <input className="input" type="password" required placeholder="Min 6 chars"
                value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Confirm</label>
              <input className="input" type="password" required placeholder="Repeat"
                value={confirm} onChange={e => setConfirm(e.target.value)} />
            </div>
          </div>

          {/* Password strength */}
          {password.length > 0 && (
            <div>
              <div style={{ height:'3px', borderRadius:'2px', background:'var(--border)', overflow:'hidden' }}>
                <div style={{
                  height:'100%', borderRadius:'2px', transition:'all 0.3s',
                  width: password.length < 6 ? '25%' : password.length < 10 ? '55%' : '100%',
                  background: password.length < 6 ? '#ef4444' : password.length < 10 ? 'var(--gold)' : 'var(--cyan)',
                }} />
              </div>
              <div style={{ fontSize:'10px', color:'var(--text-muted)', marginTop:'3px' }}>
                {password.length < 6 ? 'Weak' : password.length < 10 ? 'Good' : 'Strong'} password
              </div>
            </div>
          )}

          <button className="btn btn-primary w-full" type="submit" disabled={loading}
            style={{ marginTop:'8px', padding:'15px', fontSize:'15px' }}>
            {loading ? <><span className="loading-spinner" /> Creating account…</> : '✦ Create Free Account'}
          </button>
        </form>

        <p className="auth-footer" style={{ marginTop:'20px' }}>
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in →</Link>
        </p>
        <p className="auth-footer" style={{ marginTop:'6px', fontSize:'11px', color:'var(--text-muted)' }}>
          By signing up, you agree to our Terms of Service and Privacy Policy.
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
