import { notFound } from 'next/navigation'
import { getHospitalBySlug, loadHospitals, hospitalSlug } from '@/lib/hospitals'
import { getHospitalReviews } from '@/lib/petreviews'
import NearbyHospitals from '@/components/NearbyHospitals'
import HospitalShareButtons from '@/components/HospitalShareButtons'
import PantipReviews from '@/components/PantipReviews'
import RelatedGuides from '@/components/RelatedGuides'
import type { Metadata } from 'next'
import type { Hospital } from '@/lib/types'

export const dynamicParams = false

export function generateStaticParams() {
  return loadHospitals().map(h => ({ slug: hospitalSlug(h) }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const h = getHospitalBySlug(slug)
  if (!h) return { title: 'ไม่พบข้อมูล' }

  const services: string[] = []
  if (h.is_24h) services.push('เปิด 24 ชม.')
  if (h.has_emergency) services.push('ฉุกเฉิน')
  if (h.has_surgery) services.push('ผ่าตัดได้')

  const ratingPart = h.google_rating != null
    ? `⭐${h.google_rating.toFixed(1)}${h.google_review_count ? ` (${h.google_review_count.toLocaleString()} รีวิว)` : ''}`
    : ''
  const serviceStr = services.join(' · ')

  const titleParts = [h.name_th, ratingPart, serviceStr].filter(Boolean)
  const title = titleParts.join(' · ')

  const priceInfo = h.price_consult ? ` · ค่าตรวจ ${h.price_consult.toLocaleString()} บาท` : ''
  const description = `${h.name_th}${serviceStr ? ` (${serviceStr})` : ''} ${ratingPart} · ${h.address}${priceInfo} · ดูแผนที่ เบอร์โทร ราคา`

  const hasEnName = h.name_en && h.name_en !== h.name_th
  const keywords = [h.name_th, ...(hasEnName ? [h.name_en!] : []), 'โรงพยาบาลสัตว์', 'สัตวแพทย์', ...services]

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `https://www.thailandpethub.com/hospital/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.thailandpethub.com/hospital/${slug}`,
      type: 'website',
    },
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

function HospitalFaqJsonLd({ h }: { h: Hospital }) {
  const faqs: { q: string; a: string }[] = [
    {
      q: `${h.name_th} เปิดทำการกี่โมง?`,
      a: h.is_24h
        ? `${h.name_th} เปิดให้บริการ 24 ชั่วโมง ทุกวัน ไม่มีวันหยุด`
        : `กรุณาโทรสอบถามเวลาเปิด-ปิดโดยตรง${h.phone ? ` ที่เบอร์ ${h.phone}` : ''}`,
    },
    {
      q: `${h.name_th} อยู่ที่ไหน?`,
      a: `${h.name_th} ตั้งอยู่ที่ ${h.address} ประเทศไทย สามารถดูเส้นทางได้จาก Google Maps`,
    },
    {
      q: `${h.name_th} ราคาค่าตรวจเท่าไหร่?`,
      a: h.price_consult != null
        ? `ค่าตรวจเริ่มต้นประมาณ ${h.price_consult.toLocaleString()} บาท${h.price_emergency_surcharge != null ? ` ค่าบริการนอกเวลา ${h.price_emergency_surcharge.toLocaleString()} บาท` : ''}`
        : `กรุณาโทรสอบถามราคา${h.phone ? ` ที่เบอร์ ${h.phone}` : 'โดยตรง'}`,
    },
  ]

  if (h.has_surgery) {
    faqs.push({
      q: `${h.name_th} มีบริการผ่าตัดสัตว์เลี้ยงไหม?`,
      a: `ใช่ ${h.name_th} มีบริการผ่าตัดสัตว์เลี้ยง${h.price_neuter_male != null ? ` ราคาทำหมันสุนัขผู้เริ่มต้นที่ ${h.price_neuter_male.toLocaleString()} บาท` : ' กรุณาสอบถามราคาโดยตรง'}`,
    })
  }

  if (h.price_vaccine != null) {
    faqs.push({
      q: `${h.name_th} ราคาฉีดวัคซีนสัตว์เลี้ยงเท่าไหร่?`,
      a: `ค่าฉีดวัคซีนเริ่มต้นที่ ${h.price_vaccine.toLocaleString()} บาท`,
    })
  }

  if (h.has_emergency || h.is_24h) {
    faqs.push({
      q: `${h.name_th} รับเคสฉุกเฉินสัตว์เลี้ยงไหม?`,
      a: h.is_24h
        ? `ใช่ ${h.name_th} เปิด 24 ชั่วโมง รับเคสฉุกเฉินตลอดเวลา`
        : `ใช่ ${h.name_th} มีบริการฉุกเฉิน${h.phone ? ` โทร ${h.phone}` : ' กรุณาโทรสอบถามก่อนเดินทาง'}`,
    })
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="mt-6 bg-white border rounded-xl p-4">
        <h2 className="text-base font-bold text-gray-900 mb-3">คำถามที่พบบ่อย</h2>
        <div className="space-y-3 divide-y divide-gray-100">
          {faqs.map((f, i) => (
            <div key={i} className={i > 0 ? 'pt-3' : ''}>
              <p className="font-semibold text-sm text-gray-800 mb-1">{f.q}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

function BreadcrumbJsonLd({ name }: { name: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'หน้าหลัก', item: 'https://www.thailandpethub.com' },
      { '@type': 'ListItem', position: 2, name: 'โรงพยาบาลสัตว์', item: 'https://www.thailandpethub.com/hospital' },
      { '@type': 'ListItem', position: 3, name },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

function LocalBusinessJsonLd({ h, slug }: { h: Hospital; slug: string }) {
  const availableService = []
  if (h.has_surgery) availableService.push({ '@type': 'MedicalProcedure', name: 'ผ่าตัดสัตว์เลี้ยง' })
  if (h.has_emergency) availableService.push({ '@type': 'MedicalProcedure', name: 'บริการฉุกเฉินสัตว์' })
  if (h.is_24h) availableService.push({ '@type': 'MedicalProcedure', name: 'บริการตลอด 24 ชั่วโมง' })

  const priceRange = h.price_consult
    ? `฿${h.price_consult.toLocaleString()}+`
    : h.price_vaccine
    ? `฿${h.price_vaccine.toLocaleString()}+`
    : undefined

  const hasEnName = h.name_en && h.name_en !== h.name_th

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'VeterinaryCare',
    name: h.name_th,
    ...(hasEnName ? { alternateName: h.name_en } : {}),
    url: `https://www.thailandpethub.com/hospital/${slug}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: h.address,
      addressCountry: 'TH',
      addressLocality: 'Bangkok',
    },
    geo: h.lat && h.lng ? {
      '@type': 'GeoCoordinates',
      latitude: h.lat,
      longitude: h.lng,
    } : undefined,
    hasMap: h.lat && h.lng ? `https://www.google.com/maps?q=${h.lat},${h.lng}` : undefined,
    telephone: h.phone || undefined,
    openingHours: h.is_24h ? 'Mo-Su 00:00-24:00' : undefined,
    ...(priceRange ? { priceRange } : {}),
    ...(availableService.length > 0 ? { availableService } : {}),
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
  const pantipReview = getHospitalReviews(h.id)
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
                เปิด 24 ชม.
              </span>
            )}
            {h.has_emergency && (
              <span className="px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                ฉุกเฉิน
              </span>
            )}
            {h.has_surgery && (
              <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                ผ่าตัดได้
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
        {h.phone && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">📞</span>
            <a href={`tel:${h.phone}`} className="text-gray-700 hover:text-green-600">{h.phone}</a>
          </div>
        )}
        {h.price_consult != null && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">💊</span>
            <span className="text-gray-700">ค่าตรวจเริ่มต้น <strong>{h.price_consult.toLocaleString()} บาท</strong></span>
          </div>
        )}
        {h.price_neuter_male != null && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">✂️</span>
            <span className="text-gray-700">ทำหมันสุนัขผู้เริ่มต้น <strong>{h.price_neuter_male.toLocaleString()} บาท</strong></span>
          </div>
        )}
        {h.price_vaccine != null && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">💉</span>
            <span className="text-gray-700">ฉีดวัคซีนเริ่มต้น <strong>{h.price_vaccine.toLocaleString()} บาท</strong></span>
          </div>
        )}
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
            <span>อ่านรีวิวใน Google ({h.google_review_count?.toLocaleString() ?? 0} รีวิว)</span>
          </a>
        )}
      </div>

      {/* Embedded map */}
      {h.lat && h.lng && (
        <div className="mb-4 rounded-xl overflow-hidden border">
          <iframe
            title={`แผนที่ ${h.name_th}`}
            src={`https://maps.google.com/maps?q=${h.lat},${h.lng}&z=16&output=embed`}
            width="100%"
            height="260"
            style={{ border: 0, display: 'block' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}

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
        {h.phone && (
          <a
            href={`tel:${h.phone}`}
            className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors"
          >
            📞 โทร
          </a>
        )}
        {!h.phone && reviewUrl && (
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
      {h.phone && reviewUrl && (
        <a
          href={reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-blue-600 hover:underline mb-6"
        >
          <span>⭐</span>
          <span>อ่านรีวิวทั้งหมดใน Google</span>
        </a>
      )}

      <HospitalShareButtons />

      {/* Pantip reviews */}
      {pantipReview && <PantipReviews review={pantipReview} />}

      {/* Nearby hospitals */}
      <NearbyHospitals hospital={h} />

      {/* Related guides */}
      <div className="flex flex-wrap gap-2 mt-6">
        <a href="/emergency" className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-600 hover:border-orange-200 hover:text-orange-600 transition-colors">🚨 คู่มือฉุกเฉิน</a>
        {h.has_surgery && (
          <a href="/neutering" className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-600 hover:border-orange-200 hover:text-orange-600 transition-colors">✂️ ทำหมัน</a>
        )}
        <a href="/vaccine" className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-600 hover:border-orange-200 hover:text-orange-600 transition-colors">💉 ตารางวัคซีน</a>
        <a href="/insurance" className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-600 hover:border-orange-200 hover:text-orange-600 transition-colors">🛡️ ประกันสัตว์เลี้ยง</a>
      </div>

      <RelatedGuides current="hospital" count={4} />

      <HospitalFaqJsonLd h={h} />

      <BreadcrumbJsonLd name={h.name_th} />
      <LocalBusinessJsonLd h={h} slug={slug} />
    </main>
  )
}
