'use client'
import { useEffect, useRef } from 'react'
import type { Hospital } from '@/lib/types'
import 'leaflet/dist/leaflet.css'

export default function HospitalMap({ hospitals }: { hospitals: Hospital[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<unknown>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    import('leaflet').then(L => {
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
      })
      mapRef.current = map

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
            `<a href="/hospital/${h.id}" style="color:#f97316">ดูรายละเอียด →</a>`
          )
          .addTo(map)
      })
    })

    return () => {
      if (mapRef.current) {
        (mapRef.current as { remove(): void }).remove()
        mapRef.current = null
      }
    }
  }, [hospitals])

  return (
    <div
      ref={containerRef}
      className="h-96 w-full rounded-xl border bg-gray-100"
      style={{ zIndex: 0 }}
    />
  )
}
