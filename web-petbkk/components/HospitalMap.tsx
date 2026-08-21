'use client'
import { useEffect, useRef, useState } from 'react'
import type * as Leaflet from 'leaflet'
import type { HospitalLight } from '@/lib/types'
import 'leaflet/dist/leaflet.css'

// Pins live in their own LayerGroup so a changed hospital list only swaps the
// group's contents — rebuilding the map itself would throw away pan/zoom.
function renderMarkers(L: typeof Leaflet, markers: Leaflet.LayerGroup, hospitals: HospitalLight[]) {
  markers.clearLayers()
  hospitals.forEach(h => {
    const color = h.is_24h ? '#ef4444' : '#3b82f6'
    L.circleMarker([h.lat, h.lng], {
      color,
      fillColor: color,
      fillOpacity: 0.85,
      radius: 8,
      weight: 2,
    })
      .bindPopup(
        `<b>${h.name_th}</b><br>` +
        (h.is_24h ? '⏰ เปิด 24 ชั่วโมง<br>' : '') +
        (h.google_rating ? `⭐ ${h.google_rating}<br>` : '') +
        `<a href="/hospital/${h.slug}" style="color:#f97316">ดูรายละเอียด →</a>`
      )
      .addTo(markers)
  })
}

export default function HospitalMap({ hospitals }: { hospitals: HospitalLight[] }) {
  const containerRef  = useRef<HTMLDivElement>(null)
  const mapRef        = useRef<Leaflet.Map | null>(null)
  const markersRef    = useRef<Leaflet.LayerGroup | null>(null)
  const leafletRef    = useRef<typeof Leaflet | null>(null)
  const hospitalsRef  = useRef(hospitals)
  hospitalsRef.current = hospitals

  const [locked, setLocked] = useState(true)

  function unlock() {
    setLocked(false)
    mapRef.current?.dragging.enable()
    mapRef.current?.scrollWheelZoom.enable()
  }

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    // React Strict Mode mounts effects twice; since the leaflet import is async,
    // a second mount can start before the first's `.then()` resolves and both
    // would try to init the same container. `cancelled` (scoped per effect run)
    // lets the stale one bail out instead of double-initializing.
    let cancelled = false

    import('leaflet').then(L => {
      if (cancelled || !containerRef.current || mapRef.current) return
      leafletRef.current = L
      // Fix default icon paths broken by Next.js bundling
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/leaflet/marker-icon-2x.png',
        iconUrl: '/leaflet/marker-icon.png',
        shadowUrl: '/leaflet/marker-shadow.png',
      })

      const map = L.map(containerRef.current!, {
        center: [13.7462890, 100.5346890],
        zoom: 12,
        // Start locked so one-finger page-scroll / trackpad scroll doesn't get
        // hijacked by the map — user must tap the overlay to enable panning/zoom.
        dragging: false,
        scrollWheelZoom: false,
      })
      mapRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)

      const markers = L.layerGroup().addTo(map)
      markersRef.current = markers
      // The [hospitals] effect already ran (and bailed) before leaflet resolved,
      // so seed the first batch from the ref here.
      renderMarkers(L, markers, hospitalsRef.current)
    })

    return () => {
      cancelled = true
      mapRef.current?.remove()
      mapRef.current = null
      markersRef.current = null
      leafletRef.current = null
    }
  }, [])

  useEffect(() => {
    const L = leafletRef.current
    const markers = markersRef.current
    if (!L || !markers) return
    renderMarkers(L, markers, hospitals)
  }, [hospitals])

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="h-96 w-full rounded-xl border bg-gray-100"
        style={{ zIndex: 0 }}
      />
      {locked && (
        <button
          onClick={unlock}
          className="absolute inset-0 flex items-center justify-center bg-black/5 hover:bg-black/10 transition-colors rounded-xl"
          style={{ zIndex: 1 }}
        >
          <span className="bg-white/95 px-4 py-2.5 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
            👆 แตะเพื่อโต้ตอบกับแผนที่
          </span>
        </button>
      )}
    </div>
  )
}
