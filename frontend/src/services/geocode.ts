/**
 * Geocoding via OpenStreetMap Nominatim
 * – Full USA coverage, all 50 states, no API key required
 * – Rate-limited to 1 request/second per OSM policy (we debounce at 350ms)
 */

export interface GeoPlace {
  label: string     // formatted display address
  lat: number
  lng: number
  type: string      // city | suburb | road | building | etc.
  state: string
}

const NOMINATIM = 'https://nominatim.openstreetmap.org'

// Cache to avoid duplicate network calls for identical queries
const cache = new Map<string, GeoPlace[]>()

export async function searchPlaces(query: string): Promise<GeoPlace[]> {
  const q = query.trim()
  if (q.length < 2) return []

  const key = q.toLowerCase()
  if (cache.has(key)) return cache.get(key)!

  try {
    const params = new URLSearchParams({
      q,
      format:         'jsonv2',
      addressdetails: '1',
      limit:          '8',
      countrycodes:   'us',
      dedupe:         '1',
      'accept-language': 'en',
    })

    const res = await fetch(`${NOMINATIM}/search?${params}`, {
      headers: { 'User-Agent': 'NeonRide-CabBooking/1.0' },
    })

    if (!res.ok) return []

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any[] = await res.json()

    const places: GeoPlace[] = data.map(item => {
      const a = item.address ?? {}
      const parts: string[] = []

      // Build a clean, human-readable label
      if (a.house_number && a.road) parts.push(`${a.house_number} ${a.road}`)
      else if (a.road)              parts.push(a.road)
      else if (a.amenity)           parts.push(a.amenity)
      else if (a.tourism)           parts.push(a.tourism)
      else if (a.building)          parts.push(a.building)
      else if (a.leisure)           parts.push(a.leisure)

      if (a.neighbourhood)          parts.push(a.neighbourhood)
      if (a.suburb && !a.neighbourhood) parts.push(a.suburb)

      const city = a.city ?? a.town ?? a.village ?? a.hamlet ?? a.county ?? ''
      if (city) parts.push(city)

      const stateCode = US_STATE_ABBR[a.state] ?? a.state ?? ''
      if (stateCode) parts.push(stateCode)

      if (a.postcode) parts.push(a.postcode)

      return {
        label: parts.filter(Boolean).join(', ') || item.display_name.split(',').slice(0, 4).join(',').trim(),
        lat:   parseFloat(item.lat),
        lng:   parseFloat(item.lon),
        type:  item.addresstype ?? item.type ?? 'place',
        state: a.state ?? '',
      }
    })

    // Deduplicate by label
    const seen = new Set<string>()
    const unique = places.filter(p => {
      if (seen.has(p.label)) return false
      seen.add(p.label)
      return true
    })

    cache.set(key, unique)
    return unique
  } catch {
    return []
  }
}

/** Reverse-geocode a lat/lng to a readable US address */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const params = new URLSearchParams({
      lat: lat.toString(), lon: lng.toString(),
      format: 'jsonv2', addressdetails: '1', zoom: '16',
      'accept-language': 'en',
    })
    const res  = await fetch(`${NOMINATIM}/reverse?${params}`, {
      headers: { 'User-Agent': 'NeonRide-CabBooking/1.0' },
    })
    const data = await res.json()
    return data.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`
  } catch {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`
  }
}

// Full US state abbreviation map
const US_STATE_ABBR: Record<string, string> = {
  Alabama:              'AL', Alaska:               'AK', Arizona:              'AZ',
  Arkansas:             'AR', California:           'CA', Colorado:             'CO',
  Connecticut:          'CT', Delaware:             'DE', Florida:              'FL',
  Georgia:              'GA', Hawaii:               'HI', Idaho:                'ID',
  Illinois:             'IL', Indiana:              'IN', Iowa:                 'IA',
  Kansas:               'KS', Kentucky:             'KY', Louisiana:            'LA',
  Maine:                'ME', Maryland:             'MD', Massachusetts:        'MA',
  Michigan:             'MI', Minnesota:            'MN', Mississippi:          'MS',
  Missouri:             'MO', Montana:              'MT', Nebraska:             'NE',
  Nevada:               'NV', 'New Hampshire':      'NH', 'New Jersey':         'NJ',
  'New Mexico':         'NM', 'New York':           'NY', 'North Carolina':     'NC',
  'North Dakota':       'ND', Ohio:                 'OH', Oklahoma:             'OK',
  Oregon:               'OR', Pennsylvania:         'PA', 'Rhode Island':       'RI',
  'South Carolina':     'SC', 'South Dakota':       'SD', Tennessee:            'TN',
  Texas:                'TX', Utah:                 'UT', Vermont:              'VT',
  Virginia:             'VA', Washington:           'WA', 'West Virginia':      'WV',
  Wisconsin:            'WI', Wyoming:              'WY', 'District of Columbia':'DC',
}

/** Icon for different place types */
export function placeIcon(type: string): string {
  switch (type) {
    case 'house':
    case 'building':
    case 'residential': return '🏠'
    case 'hotel':
    case 'hostel':      return '🏨'
    case 'restaurant':
    case 'fast_food':
    case 'cafe':        return '🍽️'
    case 'airport':     return '✈️'
    case 'station':
    case 'subway':
    case 'bus_stop':    return '🚉'
    case 'hospital':    return '🏥'
    case 'university':
    case 'school':      return '🎓'
    case 'park':
    case 'garden':      return '🌳'
    case 'museum':      return '🏛️'
    case 'stadium':     return '🏟️'
    case 'mall':
    case 'supermarket': return '🛍️'
    case 'city':
    case 'town':
    case 'village':     return '🏙️'
    case 'road':
    case 'street':      return '🛣️'
    default:            return '📍'
  }
}
