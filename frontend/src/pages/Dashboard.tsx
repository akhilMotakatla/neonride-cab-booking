import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ThreeDBackground from '../components/ThreeDBackground'
import { ridesEstimate, ridesBook, TierEstimate } from '../services/api'
import { searchPlaces, GeoPlace, placeIcon } from '../services/geocode'

/* ── Animated counter ─────────────────────────────────────────────────── */
function useCounter(target: number, duration = 1600) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let v = 0; const step = target / (duration / 16)
    const t = setInterval(() => { v = Math.min(v + step, target); setVal(Math.floor(v)); if (v >= target) clearInterval(t) }, 16)
    return () => clearInterval(t)
  }, [target, duration])
  return val
}

function useDebounce<T>(value: T, delay: number): T {
  const [dv, setDv] = useState(value)
  useEffect(() => { const t = setTimeout(() => setDv(value), delay); return () => clearTimeout(t) }, [value, delay])
  return dv
}

/* ── SVG car silhouettes ──────────────────────────────────────────────── */
function CarSvg({ tier, size = 72 }: { tier: string; size?: number }) {
  const c = tier === 'Luxury' ? '#F5C842' : tier === 'SUV' ? '#7B61FF' : tier === 'Premium' ? '#4FACFE' : '#00F2FE'
  const h = Math.round(size * 0.56)
  if (tier === 'SUV') return (
    <svg viewBox="0 0 64 36" fill="none" style={{ width: size, height: h }}>
      <rect x="2" y="17" width="60" height="15" rx="3" fill={c} opacity="0.1" stroke={c} strokeWidth="0.5"/>
      <path d="M8 17 L15 7 L49 7 L56 17" fill={c} opacity="0.16" stroke={c} strokeWidth="0.8"/>
      <circle cx="14" cy="30" r="4" fill="none" stroke={c} strokeWidth="1.5" opacity="0.85"/>
      <circle cx="50" cy="30" r="4" fill="none" stroke={c} strokeWidth="1.5" opacity="0.85"/>
      <circle cx="14" cy="30" r="1.5" fill={c} opacity="0.55"/><circle cx="50" cy="30" r="1.5" fill={c} opacity="0.55"/>
      <rect x="17" y="9" width="10" height="6" rx="1" fill={c} opacity="0.25"/>
      <rect x="30" y="9" width="16" height="6" rx="1" fill={c} opacity="0.25"/>
      <rect x="54" y="19" width="6" height="3" rx="1" fill={c} opacity="0.5"/>
    </svg>
  )
  if (tier === 'Luxury') return (
    <svg viewBox="0 0 64 36" fill="none" style={{ width: size, height: h }}>
      <rect x="1" y="20" width="62" height="12" rx="3" fill={c} opacity="0.1" stroke={c} strokeWidth="0.5"/>
      <path d="M6 20 L18 10 L46 10 L58 20" fill={c} opacity="0.13" stroke={c} strokeWidth="0.8"/>
      <path d="M18 10 L22 5 L42 5 L46 10" fill={c} opacity="0.08" stroke={c} strokeWidth="0.6"/>
      <circle cx="15" cy="30" r="4" fill="none" stroke={c} strokeWidth="1.5" opacity="0.9"/>
      <circle cx="49" cy="30" r="4" fill="none" stroke={c} strokeWidth="1.5" opacity="0.9"/>
      <circle cx="15" cy="30" r="1.5" fill={c} opacity="0.65"/><circle cx="49" cy="30" r="1.5" fill={c} opacity="0.65"/>
      <rect x="20" y="11" width="8" height="7" rx="1" fill={c} opacity="0.2"/>
      <rect x="31" y="11" width="13" height="7" rx="1" fill={c} opacity="0.2"/>
      <line x1="6" y1="20" x2="58" y2="20" stroke={c} strokeWidth="0.8" opacity="0.4"/>
      <rect x="56" y="21" width="5" height="2.5" rx="1" fill={c} opacity="0.6"/>
    </svg>
  )
  return (
    <svg viewBox="0 0 64 36" fill="none" style={{ width: size, height: h }}>
      <rect x="2" y="19" width="60" height="13" rx="3" fill={c} opacity="0.1" stroke={c} strokeWidth="0.5"/>
      <path d="M7 19 L17 9 L47 9 L57 19" fill={c} opacity="0.16" stroke={c} strokeWidth="0.8"/>
      <circle cx="15" cy="30" r="4" fill="none" stroke={c} strokeWidth="1.5" opacity="0.85"/>
      <circle cx="49" cy="30" r="4" fill="none" stroke={c} strokeWidth="1.5" opacity="0.85"/>
      <circle cx="15" cy="30" r="1.5" fill={c} opacity="0.55"/><circle cx="49" cy="30" r="1.5" fill={c} opacity="0.55"/>
      <rect x="18" y="10" width="9" height="7" rx="1" fill={c} opacity="0.24"/>
      <rect x="30" y="10" width="14" height="7" rx="1" fill={c} opacity="0.24"/>
      <rect x="55" y="20" width="5" height="2.5" rx="1" fill={c} opacity="0.5"/>
    </svg>
  )
}

/* ── Location input with live geocoding ───────────────────────────────── */
interface LocInputProps {
  value: string; onChange: (v: string) => void; onSelect: (p: GeoPlace) => void
  placeholder: string; suggestions: GeoPlace[]; loading: boolean
  showSuggs: boolean; onFocus: () => void; onBlur: () => void
  dotClass: string; confirmed: boolean
}
function LocationInput({ value, onChange, onSelect, placeholder, suggestions,
  loading, showSuggs, onFocus, onBlur, dotClass, confirmed }: LocInputProps) {
  const isPickup = dotClass === 'dot-pickup'
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: 18, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
          <div className={`dot ${dotClass}`} style={confirmed ? {
            boxShadow: `0 0 14px ${isPickup ? 'var(--cyan)' : 'var(--purple)'},0 0 28px ${isPickup ? 'rgba(0,242,254,0.3)' : 'rgba(123,97,255,0.3)'}`
          } : {}} />
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          <input className="input" placeholder={placeholder} value={value}
            onChange={e => onChange(e.target.value)} onFocus={onFocus} onBlur={onBlur} autoComplete="off"
            style={{
              paddingRight: (loading || confirmed) ? '38px' : undefined,
              borderColor: confirmed ? (isPickup ? 'rgba(0,242,254,0.4)' : 'rgba(123,97,255,0.4)') : undefined,
              fontSize: '14px',
            }} />
          {loading && <span style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)' }}>
            <span className="loading-spinner" style={{ width:'14px', height:'14px', borderWidth:'1.5px' }} /></span>}
          {confirmed && !loading && <span style={{ position:'absolute', right:'13px', top:'50%', transform:'translateY(-50%)',
            color: isPickup ? 'var(--cyan)' : 'var(--purple)', fontSize:'16px', fontWeight: 700 }}>✓</span>}
        </div>
      </div>
      {showSuggs && suggestions.length > 0 && (
        <ul style={{
          position:'absolute', top:'100%', left:'30px', right:0, zIndex:400,
          background:'rgba(6,10,22,0.98)',
          border:`1px solid ${isPickup ? 'rgba(0,242,254,0.2)' : 'rgba(123,97,255,0.2)'}`,
          borderRadius:'12px', overflow:'hidden', listStyle:'none',
          boxShadow:'0 20px 60px rgba(0,0,0,0.8)', marginTop:'6px', backdropFilter:'blur(24px)',
        }}>
          {suggestions.map((p, i) => (
            <li key={`${p.lat}-${p.lng}-${i}`}
              style={{ padding:'11px 16px', cursor:'pointer',
                borderBottom: i < suggestions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                transition:'background 0.1s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = isPickup ? 'rgba(0,242,254,0.07)' : 'rgba(123,97,255,0.07)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '' }}
              onMouseDown={e => { e.preventDefault(); onSelect(p) }}>
              <div style={{ display:'flex', gap:'10px', alignItems:'flex-start' }}>
                <span style={{ fontSize:'16px', lineHeight:1.3, flexShrink:0 }}>{placeIcon(p.type)}</span>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontSize:'13px', color:'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.label}</div>
                  {p.state && <div style={{ fontSize:'11px', color:'var(--text-muted)', marginTop:'2px' }}>{p.state}, USA</div>}
                </div>
              </div>
            </li>
          ))}
          <li style={{ padding:'4px 14px', background:'rgba(0,0,0,0.35)', fontSize:'10px', color:'var(--text-muted)', textAlign:'right' }}>
            © OpenStreetMap contributors
          </li>
        </ul>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   DASHBOARD
   ═══════════════════════════════════════════════════════════════════════════ */
interface Coords { lat: number; lng: number }
interface LocField { address: string; coords: Coords | null }

export default function Dashboard() {
  const navigate = useNavigate()
  const [mode,         setMode]         = useState<'user'|'guest'>('guest')
  const [pickup,       setPickup]       = useState<LocField>({ address:'', coords:null })
  const [dropoff,      setDropoff]      = useState<LocField>({ address:'', coords:null })
  const [pickupQuery,  setPickupQuery]  = useState('')
  const [dropoffQuery, setDropoffQuery] = useState('')
  const [pickupSuggs,  setPickupSuggs]  = useState<GeoPlace[]>([])
  const [dropoffSuggs, setDropoffSuggs] = useState<GeoPlace[]>([])
  const [loadingPick,  setLoadingPick]  = useState(false)
  const [loadingDrop,  setLoadingDrop]  = useState(false)
  const [pickFocused,  setPickFocused]  = useState(false)
  const [dropFocused,  setDropFocused]  = useState(false)
  const [tiers,        setTiers]        = useState<TierEstimate[]>([])
  const [selected,     setSelected]     = useState<TierEstimate | null>(null)
  const [distKm,       setDistKm]       = useState(0)
  const [guestEmail,   setGuestEmail]   = useState('')
  const [guestPhone,   setGuestPhone]   = useState('')
  const [loadingEst,   setLoadingEst]   = useState(false)
  const [loadingBook,  setLoadingBook]  = useState(false)
  const [error,        setError]        = useState('')

  const debouncedPick = useDebounce(pickupQuery,  350)
  const debouncedDrop = useDebounce(dropoffQuery, 350)
  const rides   = useCounter(4200000)
  const drivers = useCounter(10482)
  const states  = useCounter(50)

  useEffect(() => {
    if (!debouncedPick || pickup.coords) { setPickupSuggs([]); return }
    let cancelled = false; setLoadingPick(true)
    searchPlaces(debouncedPick).then(r => { if (!cancelled) { setPickupSuggs(r); setLoadingPick(false) } })
    return () => { cancelled = true }
  }, [debouncedPick, pickup.coords])

  useEffect(() => {
    if (!debouncedDrop || dropoff.coords) { setDropoffSuggs([]); return }
    let cancelled = false; setLoadingDrop(true)
    searchPlaces(debouncedDrop).then(r => { if (!cancelled) { setDropoffSuggs(r); setLoadingDrop(false) } })
    return () => { cancelled = true }
  }, [debouncedDrop, dropoff.coords])

  const handlePickupChange  = (v: string) => { setPickupQuery(v);  setPickup({ address:v, coords:null });  setTiers([]); setSelected(null) }
  const handleDropoffChange = (v: string) => { setDropoffQuery(v); setDropoff({ address:v, coords:null }); setTiers([]); setSelected(null) }
  const selectPickup  = (p: GeoPlace) => { setPickup({ address:p.label, coords:{lat:p.lat,lng:p.lng} }); setPickupQuery(p.label);  setPickupSuggs([]) }
  const selectDropoff = (p: GeoPlace) => { setDropoff({ address:p.label, coords:{lat:p.lat,lng:p.lng} }); setDropoffQuery(p.label); setDropoffSuggs([]) }

  const fetchEstimates = useCallback(async () => {
    if (!pickup.coords || !dropoff.coords) { setError('Please select both pickup and dropoff from the suggestions.'); return }
    setError(''); setLoadingEst(true)
    try {
      const res = await ridesEstimate({
        pickupLat: pickup.coords.lat, pickupLng: pickup.coords.lng,
        dropoffLat: dropoff.coords.lat, dropoffLng: dropoff.coords.lng,
        pickupAddress: pickup.address, dropoffAddress: dropoff.address,
      })
      setTiers(res.tiers); setDistKm(res.distanceKm); setSelected(res.tiers[0])
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not fetch estimates.') }
    finally { setLoadingEst(false) }
  }, [pickup, dropoff])

  const handleBook = async () => {
    if (!selected || !pickup.coords || !dropoff.coords) return
    setError(''); setLoadingBook(true)
    const getUser    = () => { try { return JSON.parse(localStorage.getItem('neonride_user') ?? 'null') } catch { return null } }
    const getGuestId = () => { let id = localStorage.getItem('neonride_guest_id'); if (!id) { id = crypto.randomUUID(); localStorage.setItem('neonride_guest_id', id) } return id }
    const user = getUser()
    try {
      const ride = await ridesBook({
        pickupAddress: pickup.address, dropoffAddress: dropoff.address,
        pickupLat: pickup.coords.lat,  pickupLng: pickup.coords.lng,
        dropoffLat: dropoff.coords.lat, dropoffLng: dropoff.coords.lng,
        rideTier: selected.tier, fare: selected.fare,
        userId: user?.userId,
        guestSessionId: !user ? getGuestId() : undefined,
        guestEmail: !user ? guestEmail || undefined : undefined,
        guestPhone: !user ? guestPhone || undefined : undefined,
      })
      navigate(`/track/${ride.rideId}`)
    } catch (e) { setError(e instanceof Error ? e.message : 'Booking failed. Please try again.') }
    finally { setLoadingBook(false) }
  }

  const getUser = () => { try { return JSON.parse(localStorage.getItem('neonride_user') ?? 'null') } catch { return null } }
  const user    = getUser()
  const step    = !pickup.coords || !dropoff.coords ? (pickup.coords || dropoff.coords ? 1 : 0) : tiers.length === 0 ? 1 : 2
  const hasTiers = tiers.length > 0
  const timeStr  = new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })

  const swapLocations = () => {
    const [tp, tq] = [pickup, pickupQuery]
    setPickup(dropoff); setDropoff(tp); setPickupQuery(dropoffQuery); setDropoffQuery(tq)
    setTiers([]); setSelected(null)
  }

  return (
    <div className="dashboard">
      {/* ── 3D animated background ── */}
      <div className="dashboard-3d-bg">
        <ThreeDBackground />
      </div>
      <div className="dashboard-map-fade" />

      {/* ══ Centred floating glass card ══════════════════════════════════ */}
      <div className="booking-float fade-in-up">

        {/* ── Header bar (full width) ─────────────────────────────────── */}
        <div className="booking-header">
          {/* Logo + title */}
          <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
            <div style={{ width:46, height:46, borderRadius:14,
              background:'linear-gradient(135deg,var(--cyan),var(--purple))',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:22, boxShadow:'var(--glow-cyan)', flexShrink:0 }}>🚖</div>
            <div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:700, lineHeight:1 }} className="gradient-text">
                NeonRide
              </div>
              <div style={{ fontSize:11, color:'var(--text-muted)', letterSpacing:'0.12em', textTransform:'uppercase', marginTop:3 }}>
                Premium · Nationwide
              </div>
            </div>
          </div>

          {/* Stats strip — right side of header */}
          <div style={{ display:'flex', gap:'20px' }}>
            {[
              { val: `${(rides/1000000).toFixed(1)}M+`, lbl: 'Rides' },
              { val: `${states}`,                       lbl: 'States' },
              { val: `${(drivers/1000).toFixed(1)}K`,   lbl: 'Drivers' },
            ].map(s => (
              <div key={s.lbl} style={{ textAlign:'center' }}>
                <div style={{ fontSize:16, fontWeight:700, fontFamily:'var(--font-display)', lineHeight:1 }} className="gradient-text">{s.val}</div>
                <div style={{ fontSize:10, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', marginTop:2 }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Thin divider under header */}
        <div style={{ height:1, background:'linear-gradient(90deg,transparent,rgba(0,242,254,0.12),transparent)', margin:'16px 32px 0' }} />

        {/* ── Two-column body ─────────────────────────────────────────── */}
        <div className="booking-inner">

          {/* ════ LEFT COLUMN — inputs & controls ════ */}
          <div className="booking-col-left">

            {/* Headline */}
            <div>
              <h1 style={{ fontFamily:'var(--font-display)', fontSize:30, fontWeight:700, lineHeight:1.15, letterSpacing:'-0.01em' }}>
                <span className="gradient-text">Where are you</span><br />heading today?
              </h1>
              <p style={{ fontSize:13, color:'var(--text-secondary)', marginTop:6, lineHeight:1.5 }}>
                All 50 states · Instant matching · Real-time tracking
              </p>
            </div>

            {/* Step progress */}
            <div className="step-progress">
              <div className="step">
                <div className={`step-circle ${step>0?'done':'active'}`}>{step>0?'✓':'1'}</div>
                <span className="step-label">Location</span>
              </div>
              <div className={`step-connector ${step>=1?'done':''}`} />
              <div className="step">
                <div className={`step-circle ${step>1?'done':step===1?'active':'idle'}`}>{step>1?'✓':'2'}</div>
                <span className="step-label">Ride Type</span>
              </div>
              <div className={`step-connector ${step>=2?'done':''}`} />
              <div className="step">
                <div className={`step-circle ${step>=2&&selected?'active':'idle'}`}>3</div>
                <span className="step-label">Confirm</span>
              </div>
            </div>

            {/* Mode toggle */}
            {!user && (
              <div className="mode-toggle">
                <button className={`mode-btn ${mode==='guest'?'active':''}`} onClick={() => setMode('guest')}>🚀 Guest Checkout</button>
                <button className={`mode-btn ${mode==='user' ?'active':''}`} onClick={() => setMode('user')}>👤 Signed In</button>
              </div>
            )}
            {!user && mode==='user' && (
              <p style={{ fontSize:13, color:'var(--text-secondary)', textAlign:'center' }}>
                <a href="/login" className="auth-link">Sign in</a> for history &amp; saved addresses.
              </p>
            )}

            {/* Pickup input */}
            <LocationInput
              value={pickupQuery} onChange={handlePickupChange} onSelect={selectPickup}
              placeholder="Pickup — any US address or landmark…"
              suggestions={pickupSuggs} loading={loadingPick}
              showSuggs={pickFocused && pickupSuggs.length > 0}
              onFocus={() => setPickFocused(true)}
              onBlur={() => setTimeout(() => setPickFocused(false), 200)}
              dotClass="dot-pickup" confirmed={!!pickup.coords}
            />

            {/* Connector + swap */}
            <div style={{ display:'flex', alignItems:'center', paddingLeft:18 }}>
              <div className="dot-connector" />
              {pickup.coords && dropoff.coords && (
                <button onClick={swapLocations} style={{
                  marginLeft:'auto', padding:'4px 12px', fontSize:'11px',
                  background:'rgba(0,242,254,0.06)', border:'1px solid rgba(0,242,254,0.15)',
                  borderRadius:999, color:'var(--cyan)', cursor:'pointer', transition:'all 0.2s'
                }} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(0,242,254,0.12)'}}
                   onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='rgba(0,242,254,0.06)'}}>
                  ⇅ Swap
                </button>
              )}
            </div>

            {/* Dropoff input */}
            <LocationInput
              value={dropoffQuery} onChange={handleDropoffChange} onSelect={selectDropoff}
              placeholder="Dropoff — any US address or landmark…"
              suggestions={dropoffSuggs} loading={loadingDrop}
              showSuggs={dropFocused && dropoffSuggs.length > 0}
              onFocus={() => setDropFocused(true)}
              onBlur={() => setTimeout(() => setDropFocused(false), 200)}
              dotClass="dot-dropoff" confirmed={!!dropoff.coords}
            />

            {/* Guest contact fields */}
            {hasTiers && !user && mode==='guest' && (
              <>
                <div className="section-divider"><span>Ride updates</span></div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  <div className="input-group">
                    <label className="input-label">Email</label>
                    <input className="input" type="email" placeholder="you@example.com"
                      value={guestEmail} onChange={e=>setGuestEmail(e.target.value)} style={{ fontSize:13 }} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Phone</label>
                    <input className="input" type="tel" placeholder="+1 (555) 000"
                      value={guestPhone} onChange={e=>setGuestPhone(e.target.value)} style={{ fontSize:13 }} />
                  </div>
                </div>
              </>
            )}

            {/* Error message */}
            {error && <div className="error-msg fade-in">⚠ {error}</div>}

            {/* Promo banner */}
            {!hasTiers && (
              <div className="promo-banner">
                <span style={{ fontSize:18 }}>🎁</span>
                <div style={{ fontSize:13, color:'var(--text-secondary)' }}>
                  <strong style={{ color:'var(--gold)' }}>20% off</strong> your first Luxury ride · Code <strong style={{ color:'var(--gold)' }}>NEON20</strong>
                </div>
              </div>
            )}

            {/* CTA buttons */}
            {!hasTiers ? (
              <button className="btn btn-primary w-full"
                onClick={fetchEstimates}
                disabled={!pickup.coords||!dropoff.coords||loadingEst}
                style={{ padding:15, fontSize:15, marginTop:'auto' }}>
                {loadingEst ? <><span className="loading-spinner" /> Calculating fares…</> : '✦ See Ride Options'}
              </button>
            ) : (
              <button
                className={`btn w-full ${selected?.tier==='Luxury'?'btn-gold':'btn-primary'}`}
                onClick={handleBook}
                disabled={!selected||!pickup.coords||!dropoff.coords||loadingBook}
                style={{ padding:15, fontSize:15, marginTop:'auto' }}>
                {loadingBook
                  ? <><span className="loading-spinner" /> Booking your ride…</>
                  : `✦ Book ${selected?.tier??''} — $${selected?.fare.toFixed(2)??''}`}
              </button>
            )}

            {hasTiers && (
              <p style={{ fontSize:11, color:'var(--text-muted)', textAlign:'center', lineHeight:1.5 }}>
                🔒 Secure booking · Final price may vary with traffic &amp; tolls
              </p>
            )}
          </div>

          {/* ════ RIGHT COLUMN — tier cards ════ */}
          <div className="booking-col-right">
            {!hasTiers ? (
              /* Placeholder when no tiers yet */
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                height:'100%', gap:20, opacity:0.5 }}>
                <div style={{ fontSize:56 }}>🌆</div>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontSize:16, fontWeight:600, color:'var(--text-secondary)' }}>Ride options appear here</div>
                  <div style={{ fontSize:13, color:'var(--text-muted)', marginTop:6, lineHeight:1.5 }}>
                    Enter your pickup &amp; dropoff then tap<br />"See Ride Options" to view real-time pricing
                  </div>
                </div>
                {/* Feature pills */}
                <div style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center', marginTop:8 }}>
                  {['🛡️ Verified Drivers','⚡ Instant Match','📍 Live GPS Tracking','🌟 4.9★ Rating'].map(f => (
                    <span key={f} style={{ padding:'5px 12px', background:'rgba(0,242,254,0.05)',
                      border:'1px solid rgba(0,242,254,0.12)', borderRadius:999,
                      fontSize:11, color:'var(--text-secondary)' }}>{f}</span>
                  ))}
                </div>
              </div>
            ) : (
              /* Tier cards */
              <>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'var(--text-secondary)' }}>Choose your ride</div>
                  <div style={{ fontSize:11, color:'var(--text-muted)' }}>📏 {distKm.toFixed(1)} km</div>
                </div>

                {tiers.map((tier, idx) => (
                  <div key={tier.tier}
                    className={`tier-card ${tier.tier==='Luxury'?'luxury-tier':''} ${selected?.tier===tier.tier?'selected':''} fade-in-up`}
                    style={{ animationDelay:`${idx*0.05}s`, padding:'14px 16px', gap:12 }}
                    onClick={() => setSelected(tier)}>
                    {selected?.tier===tier.tier && <div className="tier-check">✓</div>}

                    {/* Car + tier info */}
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, flexShrink:0 }}>
                      <CarSvg tier={tier.tier} size={68} />
                      <span style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em',
                        color: tier.tier==='Luxury' ? 'var(--gold)' : tier.tier==='SUV' ? 'var(--purple)'
                             : tier.tier==='Premium' ? 'var(--blue)' : 'var(--cyan)' }}>
                        {tier.tier}
                      </span>
                    </div>

                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:600 }}>{tier.description}</div>
                      {tier.tier==='Luxury' && <div className="luxury-badge" style={{ marginTop:4 }}>✦ Black Car Service</div>}
                      <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:4 }}>⏱ ~{tier.etaMinutes} min away</div>
                    </div>

                    <div style={{ textAlign:'right', flexShrink:0 }}>
                      <div className={`tier-price-amount ${tier.tier==='Luxury'?'gold-text':'gradient-text'}`}
                        style={{ fontSize:20 }}>${tier.fare.toFixed(2)}</div>
                      <div style={{ fontSize:10, color:'var(--text-muted)', marginTop:2 }}>estimated</div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
