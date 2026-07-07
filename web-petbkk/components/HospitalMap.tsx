'use client'
import { useEffect, useRef, useState } from 'react'
import type { Hospital } from '@/lib/types'
import { hospitalSlug } from '@/lib/hospitals'
import 'leaflet/dist/leaflet.css'

export default function HospitalMap({ hospitals }: { hospitals: Hospital[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<{ dragging: { enable(): void }; scrollWheelZoom: { enable(): void } } | null>(null)
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
      // Fix default icon paths broken by Next.js bundling
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(containerRef.current!, {
        center: [13.7462890, 100.5346890],
        zoom: 12,
        // Start locked so one-finger page-scroll / trackpad scroll doesn't get
        // hijacked by the map — user must tap the overlay to enable panning/zoom.
        dragging: false,
        scrollWheelZoom: false,
      })
      mapRef.current = map as unknown as { dragging: { enable(): void }; scrollWheelZoom: { enable(): void } }

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)

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
            `<a href="/hospital/${hospitalSlug(h)}" style="color:#f97316">ดูรายละเอียด →</a>`
          )
          .addTo(map)
      })
    })

    return () => {
      cancelled = true
      if (mapRef.current) {
        (mapRef.current as unknown as { remove(): void }).remove()
        mapRef.current = null
      }
    }
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
