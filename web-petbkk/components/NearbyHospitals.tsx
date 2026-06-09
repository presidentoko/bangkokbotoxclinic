import type { Hospital } from '@/lib/types'
import { getNearbyHospitals, hospitalSlug } from '@/lib/hospitals'

function getRatingColor(rating: number | null): string {
  if (rating == null) return '#6b7280'
  if (rating >= 4.5) return '#16a34a'
  if (rating >= 4.0) return '#65a30d'
  if (rating >= 3.5) return '#ca8a04'
  return '#6b7280'
}

interface Props {
  hospital: Hospital
}

export default function NearbyHospitals({ hospital }: Props) {
  const nearby = getNearbyHospitals(hospital, 3)
  if (!nearby.length) return null

  return (
    <section>
      <h2 className="font-semibold mb-3">โรงพยาบาลใกล้เคียง</h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {nearby.map(({ hospital: h, distKm }) => {
          const ratingColor = getRatingColor(h.google_rating)
          return (
            <a
              key={h.id}
              href={`/hospital/${hospitalSlug(h)}`}
              className="flex-shrink-0 w-48 bg-white border rounded-xl p-3 hover:border-blue-300 transition-colors"
            >
              {/* Name */}
              <p className="text-sm font-medium leading-tight line-clamp-1 mb-2">
                {h.name_th}
              </p>

              <div className="flex items-center gap-2 mb-2">
                {/* Rating circle (40px) */}
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs"
                  style={{ backgroundColor: ratingColor }}
                >
                  {h.google_rating != null ? h.google_rating.toFixed(1) : 'N/A'}
                </div>

                <div className="flex-1 min-w-0">
                  {/* 24h badge */}
                  {h.is_24h && (
                    <span className="block text-xs px-1.5 py-0.5 bg-red-100 text-red-700 rounded-full w-fit mb-1">
                      24 ชม.
                    </span>
                  )}
                  {/* Distance */}
                  <p className="text-xs text-gray-400">{distKm.toFixed(1)} km</p>
                </div>
              </div>
            </a>
          )
        })}
      </div>
    </section>
  )
}
