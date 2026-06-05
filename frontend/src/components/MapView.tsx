import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Props {
  pickupLat?: number
  pickupLng?: number
  dropoffLat?: number
  dropoffLng?: number
  showRoute?: boolean
}

const cyanIcon = L.divIcon({
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#00F2FE;
         box-shadow:0 0 12px #00F2FE,0 0 24px rgba(0,242,254,0.5);
         border:2px solid white;"></div>`,
  className: '',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

const purpleIcon = L.divIcon({
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#4FACFE;
         box-shadow:0 0 12px #4FACFE,0 0 24px rgba(79,172,254,0.5);
         border:2px solid white;"></div>`,
  className: '',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

export default function MapView({ pickupLat, pickupLng, dropoffLat, dropoffLng, showRoute }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const layersRef = useRef<L.Layer[]>([])

  // Initialise map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    const map = L.map(containerRef.current, {
      center: [39.8283, -98.5795],
      zoom: 4,
      zoomControl: true,
    })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)
    mapRef.current = map
    return () => { map.remove(); mapRef.current = null }
  }, [])

  // Update markers / route whenever coords change
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Remove previous dynamic layers
    layersRef.current.forEach(l => map.removeLayer(l))
    layersRef.current = []

    if (pickupLat && pickupLng) {
      const m = L.marker([pickupLat, pickupLng], { icon: cyanIcon })
        .addTo(map)
        .bindPopup('<b style="color:#00F2FE">Pickup</b>')
      layersRef.current.push(m)
    }

    if (dropoffLat && dropoffLng) {
      const m = L.marker([dropoffLat, dropoffLng], { icon: purpleIcon })
        .addTo(map)
        .bindPopup('<b style="color:#4FACFE">Dropoff</b>')
      layersRef.current.push(m)
    }

    if (showRoute && pickupLat && pickupLng && dropoffLat && dropoffLng) {
      const line = L.polyline(
        [[pickupLat, pickupLng], [dropoffLat, dropoffLng]],
        { color: '#00F2FE', weight: 3, opacity: 0.7, dashArray: '8, 6' }
      ).addTo(map)
      layersRef.current.push(line)
      map.fitBounds(L.latLngBounds([[pickupLat, pickupLng], [dropoffLat, dropoffLng]]), { padding: [60, 60] })
    } else if (pickupLat && pickupLng) {
      map.setView([pickupLat, pickupLng], 13)
    }
  }, [pickupLat, pickupLng, dropoffLat, dropoffLng, showRoute])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}
