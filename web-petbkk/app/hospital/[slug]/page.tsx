import { notFound } from 'next/navigation'
import { getHospitalBySlug, loadHospitals } from '@/lib/hospitals'
import NearbyHospitals from '@/components/NearbyHospitals'
import HospitalShareButtons from '@/components/HospitalShareButtons'
import type { Metadata } from 'next'
import type { Hospital } from '@/lib/types'

export const dynamicParams = false

export function generateStaticParams() {
  return loadHospitals().map(h => ({ slug: h.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const h = getHospitalBySlug(slug)
  if (!h) return { title: 'ไม่พบข้อมูล' }
  const ratingStr = h.google_rating != null ? `⭐${h.google_rating.toFixed(1)}` : ''
  return {
    title: `${h.name_th}${ratingStr ? ` — ${ratingStr}` : ''} — ThailandPetHub`,
  }
}

function getRatingColor(rating: number | null): string {
  if (rating == null) return '#6b7280'
  if (rating >= 4.5) return '#16a34a'
  if (rating >= 4.0) return '#65a30d'
  if (rating >= 3.5) return '#ca8a04'
  return '#6b7280'
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const hasHalf = rating - full >= 0.5
  return (
    <span className="text-sm text-gray-600">
      {'★'.repeat(full)}{hasHalf ? '½' : ''}{'☆'.repeat(5 - full - (hasHalf ? 1 : 0))}
    </span>
  )
}

function LocalBusinessJsonLd({ h }: { h: Hospital }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'VeterinaryCare',
    name: h.name_th,
    address: {
      '@type': 'PostalAddress',
      streetAddress: h.address,
      addressCountry: 'TH',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: h.lat,
      longitude: h.lng,
    },
    telephone: h.phone || undefined,
    openingHours: h.is_24h ? 'Mo-Su 00:00-24:00' : undefined,
    ...(h.google_rating != null ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: h.google_rating,
        reviewCount: h.google_review_count ?? 1,
        bestRating: 5,
        worstRating: 1,
      }
    } : {}),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export default async function HospitalDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const h = getHospitalBySlug(slug)
  if (!h) notFound()

  const ratingColor = getRatingColor(h.google_rating)
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`
  const reviewUrl = h.google_place_id
    ? `https://search.google.com/local/reviews?placeid=${h.google_place_id}`
    : null

  const showEnName = h.name_en && h.name_en !== h.name_th

  return (
    <main className="max-w-2xl mx-auto">
      <a href="/hospital" className="text-sm text-gray-400 hover:text-gray-600 mb-4 inline-block">
        ← กลับ
      </a>

      <h1 className="text-2xl font-bold mb-1">{h.name_th}</h1>
      {showEnName && (
        <p className="text-sm text-gray-500 mb-4">{h.name_en}</p>
      )}

      {/* Hero card */}
      <div className="bg-white rounded-xl border p-6 mb-4 flex items-start gap-5">
        {/* Rating circle */}
        <div
          className="flex-shrink-0 w-[72px] h-[72px] rounded-full flex items-center justify-center text-white font-black text-2xl"
          style={{ backgroundColor: ratingColor }}
        >
          {h.google_rating != null ? h.google_rating.toFixed(1) : 'N/A'}
        </div>

        {/* Right side */}
        <div className="flex-1 min-w-0">
          {h.google_rating != null ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                <StarRating rating={h.google_rating} />
                <span className="text-sm font-semibold" style={{ color: ratingColor }}>
                  {h.google_rating.toFixed(1)}
                </span>
              </div>
              {h.google_review_count != null && (
                <p className="text-sm text-gray-500 mb-3">
                  {h.google_review_count.toLocaleString()} รีวิว
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-400 mb-3">ยังไม่มีคะแนน Google</p>
          )}

          <div className="flex flex-wrap gap-2">
            {h.is_24h && (
              <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                24 ชม.
              </span>
            )}
            {h.has_surgery && (
              <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                ผ่าตัด
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Info card */}
      <div className="bg-white rounded-xl border p-4 mb-4 space-y-3 text-sm">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 text-gray-400">📍</span>
          <span className="text-gray-700">{h.address}</span>
        </div>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-blue-600 hover:underline"
        >
          <span>🗺️</span>
          <span>ดูเส้นทางใน Google Maps</span>
        </a>
        {reviewUrl && (
          <a
            href={reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:underline"
          >
            <span>⭐</span>
            <span>อ่านรีวิวใน Google</span>
          </a>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mb-6">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors"
        >
          🗺️ นำทาง
        </a>
        {reviewUrl && (
          <a
            href={reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-white hover:bg-gray-50 border-2 border-gray-200 font-bold py-3 rounded-xl transition-colors"
          >
            ⭐ รีวิว Google
          </a>
        )}
      </div>

      <HospitalShareButtons />

      {/* Nearby hospitals */}
      <NearbyHospitals hospital={h} />

      <LocalBusinessJsonLd h={h} />
    </main>
  )
}
