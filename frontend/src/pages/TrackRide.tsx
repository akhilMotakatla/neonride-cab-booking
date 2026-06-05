import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import MapView from '../components/MapView'
import { ridesTrack, ridesCancel, TrackResponse } from '../services/api'

const STEPS = [
  { key: 'Searching',      label: 'Finding Driver',   icon: '🔍', sub: 'Matching you with the best available driver' },
  { key: 'DriverArriving', label: 'Driver En Route',  icon: '🚗', sub: 'Your driver is heading to your pickup location' },
  { key: 'Active',         label: 'Ride In Progress', icon: '🛣️', sub: 'Sit back and enjoy your premium ride' },
  { key: 'Completed',      label: 'Arrived',          icon: '✅', sub: 'You have reached your destination' },
]
const STATUS_ORDER = ['Searching', 'DriverArriving', 'Active', 'Completed']

const STATUS_CSS: Record<string, string> = {
  Searching:      'status-searching',
  DriverArriving: 'status-driverarriving',
  Active:         'status-active',
  Completed:      'status-completed',
  Cancelled:      'status-cancelled',
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="star-rating">
      {[1,2,3,4,5].map(n => (
        <span key={n} className={`star ${n <= Math.round(rating) ? '' : 'empty'}`}>★</span>
      ))}
      <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: '4px' }}>{rating.toFixed(1)}</span>
    </div>
  )
}

export default function TrackRide() {
  const { rideId } = useParams<{ rideId: string }>()
  const navigate   = useNavigate()
  const [ride,       setRide]       = useState<TrackResponse | null>(null)
  const [error,      setError]      = useState('')
  const [cancelling, setCancelling] = useState(false)
  const [countdown,  setCountdown]  = useState<number | null>(null)
  const [sosPressed, setSosPressed] = useState(false)

  const fetchStatus = useCallback(async () => {
    if (!rideId) return
    try {
      const data = await ridesTrack(rideId)
      setRide(data)
      if (data.etaMinutes && data.status !== 'Completed' && data.status !== 'Cancelled')
        setCountdown(prev => prev ?? data.etaMinutes! * 60)
    } catch { setError('Could not load ride status.') }
  }, [rideId])

  useEffect(() => { fetchStatus(); const t = setInterval(fetchStatus, 8000); return () => clearInterval(t) }, [fetchStatus])
  useEffect(() => {
    if (!countdown || countdown <= 0) return
    const t = setInterval(() => setCountdown(c => (c && c > 1 ? c - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [countdown])

  const handleCancel = async () => {
    if (!rideId || !window.confirm('Are you sure you want to cancel this ride?')) return
    setCancelling(true)
    try { await ridesCancel(rideId); fetchStatus() }
    catch { setError('Could not cancel ride.') }
    finally { setCancelling(false) }
  }

  const formatEta = (s: number) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`
  const initials  = (name?: string) => name ? name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() : '?'
  const stepIndex = STATUS_ORDER.indexOf(ride?.status ?? 'Searching')
  const isDone    = ride?.status === 'Completed' || ride?.status === 'Cancelled'

  return (
    <div className="track-page">
      {/* ══ Info Panel ══════════════════════════════════════════════════ */}
      <aside className="track-panel">
        {error && <div className="error-msg">⚠ {error}</div>}

        {!ride && !error && (
          <div style={{ display:'flex', alignItems:'center', gap:'12px', color:'var(--text-secondary)', padding:'8px 0' }}>
            <span className="loading-spinner" /> Loading ride details…
          </div>
        )}

        {ride && (
          <>
            {/* Status badge */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div className={`status-badge ${STATUS_CSS[ride.status] ?? 'status-searching'}`}>
                <div className="status-pulse" />
                {ride.status === 'Cancelled' ? 'Ride Cancelled' : STEPS.find(s=>s.key===ride.status)?.label ?? ride.status}
              </div>
              <span style={{ fontSize:'11px', color:'var(--text-muted)' }}>
                #{ride.rideId.slice(0,8).toUpperCase()}
              </span>
            </div>

            {/* ETA countdown */}
            {countdown !== null && countdown > 0 && !isDone && (
              <div className="eta-card fade-in">
                <div className="eta-label">Estimated Arrival In</div>
                <div className="eta-value gradient-text">{formatEta(countdown)}</div>
                <div className="eta-unit">minutes · seconds</div>
              </div>
            )}

            {/* Status timeline */}
            {ride.status !== 'Cancelled' && (
              <div className="status-timeline">
                {STEPS.map((s, i) => {
                  const state = i < stepIndex ? 'done' : i === stepIndex ? 'active' : 'idle'
                  return (
                    <div key={s.key} className="timeline-step">
                      <div className="timeline-left">
                        <div className={`timeline-dot ${state}`}>{state === 'done' ? '✓' : s.icon}</div>
                        {i < STEPS.length - 1 && <div className={`timeline-line ${i < stepIndex ? 'done' : ''}`} />}
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-title" style={{ color: state === 'idle' ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                          {s.label}
                        </div>
                        {state !== 'idle' && <div className="timeline-subtitle">{s.sub}</div>}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Driver card */}
            {ride.driverName && (
              <div className="driver-card fade-in">
                <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'12px' }}>
                  <div className="driver-avatar">{initials(ride.driverName)}</div>
                  <div className="driver-info" style={{ flex:1 }}>
                    <div className="driver-name">{ride.driverName}</div>
                    <div className="driver-vehicle">{ride.driverVehicle}</div>
                    {ride.driverRating && <div style={{ marginTop:'6px' }}><Stars rating={ride.driverRating} /></div>}
                  </div>
                </div>
                {/* Share trip row */}
                <div style={{ display:'flex', gap:'8px' }}>
                  <button onClick={() => navigator.clipboard?.writeText(window.location.href).then(() => alert('Tracking link copied!'))}
                    style={{ flex:1, padding:'8px', background:'rgba(0,242,254,0.06)', border:'1px solid rgba(0,242,254,0.15)',
                      borderRadius:'8px', color:'var(--cyan)', fontSize:'12px', cursor:'pointer' }}>
                    📤 Share Trip
                  </button>
                  <button onClick={() => alert('In-app messaging coming soon!')}
                    style={{ flex:1, padding:'8px', background:'rgba(123,97,255,0.06)', border:'1px solid rgba(123,97,255,0.15)',
                      borderRadius:'8px', color:'var(--purple)', fontSize:'12px', cursor:'pointer' }}>
                    💬 Message
                  </button>
                </div>
              </div>
            )}

            {/* Fare */}
            <div className="fare-display">
              <div>
                <div className="fare-label">Estimated Fare</div>
                <div style={{ fontSize:'12px', color:'var(--text-muted)', marginTop:'2px' }}>Final may vary</div>
              </div>
              <div className="fare-amount gradient-text">
                {/* Fare not in TrackResponse; show based on tier or placeholder */}
                {ride.status !== 'Cancelled' ? '—' : 'Refunded'}
              </div>
            </div>

            {/* Route */}
            <div className="route-info" style={{ padding:'16px', background:'rgba(255,255,255,0.025)',
              border:'1px solid var(--border)', borderRadius:'var(--radius-md)', gap:'0' }}>
              <div className="route-stop" style={{ paddingBottom:'10px' }}>
                <div className="route-dot-wrap">
                  <div className="dot dot-pickup" />
                  <div className="route-line" />
                </div>
                <div>
                  <div className="route-label">📍 Pickup</div>
                  <div className="route-address">{ride.pickupAddress || `${ride.pickupLat.toFixed(4)}, ${ride.pickupLng.toFixed(4)}`}</div>
                </div>
              </div>
              <div className="route-stop">
                <div className="route-dot-wrap">
                  <div className="dot dot-dropoff" />
                </div>
                <div>
                  <div className="route-label">🏁 Dropoff</div>
                  <div className="route-address">{ride.dropoffAddress || `${ride.dropoffLat.toFixed(4)}, ${ride.dropoffLng.toFixed(4)}`}</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {!isDone ? (
              <>
                <button className="sos-btn" onClick={() => {
                  setSosPressed(true)
                  setTimeout(() => setSosPressed(false), 3000)
                  alert('🚨 Emergency SOS activated! Emergency services and NeonRide safety team notified.')
                }}>
                  <span style={{ fontSize:'20px' }}>🚨</span>
                  <span>{sosPressed ? 'SOS Alert Sent!' : 'Emergency SOS'}</span>
                </button>
                <button className="btn btn-danger w-full" onClick={handleCancel} disabled={cancelling}>
                  {cancelling ? <><span className="loading-spinner" /> Cancelling…</> : '✕ Cancel Ride'}
                </button>
              </>
            ) : (
              <div style={{ textAlign:'center', padding:'12px' }}>
                {ride.status === 'Completed' && (
                  <p style={{ fontSize:'14px', color:'var(--text-secondary)', marginBottom:'14px' }}>
                    🌟 How was your ride? Rate your driver.
                  </p>
                )}
                <button className="btn btn-primary w-full" onClick={() => navigate('/')}>
                  🚖 Book Another Ride
                </button>
              </div>
            )}
          </>
        )}
      </aside>

      {/* ══ Map ══════════════════════════════════════════════════════════ */}
      <section className="track-map">
        {ride && (
          <>
            <div style={{ width:'100%', height:'100%' }}>
              <MapView
                pickupLat={ride.pickupLat}  pickupLng={ride.pickupLng}
                dropoffLat={ride.dropoffLat} dropoffLng={ride.dropoffLng}
                showRoute
              />
            </div>
            <div className="map-overlay-badge">
              <div className="map-badge">
                <div className="map-badge-dot" style={{
                  background: ride.status==='Active' ? '#4ade80'
                            : ride.status==='DriverArriving' ? 'var(--cyan)'
                            : ride.status==='Completed' ? 'var(--purple)' : '#FCD34D'
                }} />
                {STEPS.find(s=>s.key===ride.status)?.label ?? ride.status}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
