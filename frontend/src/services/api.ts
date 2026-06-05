const BASE = '/api'

async function request<T>(path: string, opts?: RequestInit): Promise<T> {
  const token = localStorage.getItem('neonride_token')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(opts?.headers as Record<string, string> | undefined),
  }

  let res: Response
  try {
    res = await fetch(`${BASE}${path}`, { ...opts, headers })
  } catch {
    throw new Error('Cannot reach the server. Make sure the backend is running on port 5000.')
  }

  // Guard: read body text first so we never call .json() on an empty / HTML response
  const text = await res.text()

  if (!text || !text.trim()) {
    throw new Error(
      res.ok
        ? 'Server returned an empty response.'
        : `Server error ${res.status} — make sure the backend is running on port 5000.`
    )
  }

  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    // Backend returned non-JSON (e.g. an HTML error page from the proxy)
    const preview = text.slice(0, 120).replace(/<[^>]+>/g, '').trim()
    throw new Error(
      res.ok
        ? `Unexpected response from server: ${preview}`
        : `Server error ${res.status}: ${preview}`
    )
  }

  if (!res.ok) {
    const msg =
      (data as Record<string, string>)?.message ??
      (data as Record<string, string>)?.title ??
      `Request failed with status ${res.status}`
    throw new Error(msg)
  }

  return data as T
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authRegister = (body: {
  fullName: string; email: string; password: string; phoneNumber?: string
}) =>
  request<{ token: string; userId: number; fullName: string; email: string }>(
    '/auth/register', { method: 'POST', body: JSON.stringify(body) }
  )

export const authLogin = (body: { email: string; password: string }) =>
  request<{ token: string; userId: number; fullName: string; email: string }>(
    '/auth/login', { method: 'POST', body: JSON.stringify(body) }
  )

// ── Rides ─────────────────────────────────────────────────────────────────────
export interface TierEstimate {
  tier: string; fare: number; etaMinutes: number; description: string; icon: string
}
export interface EstimateResponse { tiers: TierEstimate[]; distanceKm: number }

export const ridesEstimate = (body: {
  pickupLat: number; pickupLng: number; dropoffLat: number; dropoffLng: number
  pickupAddress: string; dropoffAddress: string
}) =>
  request<EstimateResponse>('/rides/estimate', { method: 'POST', body: JSON.stringify(body) })

export interface RideResponse {
  rideId: string; status: string; pickupAddress: string; dropoffAddress: string
  rideTier: string; fare: number; driverName?: string; driverVehicle?: string
  driverRating?: number; etaMinutes?: number; passengerType: string; createdAt: string
}

export const ridesBook = (body: {
  pickupAddress: string; dropoffAddress: string
  pickupLat: number; pickupLng: number; dropoffLat: number; dropoffLng: number
  rideTier: string; fare: number
  userId?: number; guestSessionId?: string; guestEmail?: string; guestPhone?: string
}) =>
  request<RideResponse>('/rides/book', { method: 'POST', body: JSON.stringify(body) })

export interface TrackResponse {
  rideId: string; status: string; driverName?: string; driverVehicle?: string
  driverRating?: number; etaMinutes?: number
  pickupLat: number; pickupLng: number; dropoffLat: number; dropoffLng: number
  pickupAddress: string; dropoffAddress: string
}

export const ridesTrack  = (id: string) => request<TrackResponse>(`/rides/track/${id}`)
export const ridesCancel = (id: string) =>
  request<{ message: string }>(`/rides/cancel/${id}`, { method: 'POST' })

// ── AI ────────────────────────────────────────────────────────────────────────
export interface AiResponse { reply: string; rideStatus?: string }

export const aiChat = (body: { message: string; currentRideId?: string; isGuest: boolean }) =>
  request<AiResponse>('/ai/chat', { method: 'POST', body: JSON.stringify(body) })
