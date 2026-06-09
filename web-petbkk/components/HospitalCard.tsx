'use client'
import Link from 'next/link'
import SaveHospitalButton from '@/components/SaveHospitalButton'
import type { Hospital } from '@/lib/types'

function ratingColor(rating: number | null): string {
  if (rating == null) return 'bg-gray-200 text-gray-500'
  if (rating >= 4.5) return 'bg-green-500 text-white'
  if (rating >= 4.0) return 'bg-lime-500 text-white'
  if (rating >= 3.5) return 'bg-yellow-400 text-gray-800'
  return 'bg-gray-300 text-gray-600'
}

interface Props {
  hospital: Hospital
  distanceKm?: number
}

export default function HospitalCard({ hospital: h, distanceKm }: Props) {
  return (
    <Link
      href={`/hospital/${h.id}`}
      className="block bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 hover:border-orange-200 transition-all p-4 group"
    >
      {/* Top row: rating circle + name/address + save button */}
      <div className="flex items-start gap-3 mb-3">
        {/* Rating circle */}
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm ${ratingColor(h.google_rating)}`}
        >
          {h.google_rating != null ? h.google_rating.toFixed(1) : '–'}
        </div>

        {/* Name + address */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">
            {h.name_th}
          </p>
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{h.address}</p>
        </div>

        {/* Save button — its own handler already calls stopPropagation */}
        <div className="flex-shrink-0 -mt-1 -mr-1">
          <SaveHospitalButton hospitalId={h.id} size="sm" />
        </div>
      </div>

      {/* Service badges + distance */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        {h.is_24h && (
          <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-[11px] font-semibold">
            24 ชม.
          </span>
        )}
        {h.has_emergency && (
          <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-[11px] font-semibold">
            ฉุกเฉิน
          </span>
        )}
        {h.has_surgery && (
          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[11px] font-semibold">
            ผ่าตัด
          </span>
        )}
        {distanceKm != null && (
          <span className="ml-auto px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-[11px] font-semibold">
            📍{' '}
            {distanceKm < 1
              ? `${Math.round(distanceKm * 1000)} ม.`
              : `${distanceKm.toFixed(1)} กม.`}
          </span>
        )}
      </div>

      {/* Price + reviews row */}
      <div className="flex items-center gap-3 text-xs text-gray-500">
        {h.price_consult != null && (
          <span>
            ฿ ค่าปรึกษา{' '}
            <span className="font-semibold text-gray-700">
              {h.price_consult.toLocaleString()}
            </span>
          </span>
        )}
        {h.google_review_count != null && h.google_review_count > 0 && (
          <span className="ml-auto">
            ⭐{' '}
            <span className="font-semibold text-gray-700">
              {h.google_rating?.toFixed(1)}
            </span>
            <span className="text-gray-400">
              {' '}· {h.google_review_count.toLocaleString()} รีวิว
            </span>
          </span>
        )}
      </div>
    </Link>
  )
}
