import Link from 'next/link'
import type { Hospital } from '@/lib/types'

export default function HospitalCard({ hospital }: { hospital: Hospital }) {
  return (
    <Link
      href={`/hospital/${hospital.id}`}
      className="block bg-white border rounded-xl p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug">{hospital.name_th}</h3>
        {hospital.is_24h && (
          <span className="shrink-0 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
            24 ชม.
          </span>
        )}
      </div>
      <p className="text-xs text-gray-400 mb-3 line-clamp-1">{hospital.address}</p>
      <div className="flex items-center gap-3 text-xs text-gray-500">
        {hospital.google_rating != null && (
          <span>⭐ {hospital.google_rating.toFixed(1)} ({hospital.google_review_count?.toLocaleString()})</span>
        )}
        {hospital.price_consult != null && (
          <span>ค่าตรวจ ฿{hospital.price_consult}</span>
        )}
      </div>
    </Link>
  )
}
