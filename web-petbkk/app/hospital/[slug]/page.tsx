import { notFound } from 'next/navigation'
import { getHours, summarizeHours, toSchemaHours, isAlwaysOpen } from '@/lib/hospitalHours'
import AdSlot from '@/components/AdSlot'
import { getHospitalBySlug, loadHospitals, hospitalSlug, hasPreciseCoord } from '@/lib/hospitals'
import { getHospitalReviews } from '@/lib/petreviews'
import NearbyHospitals from '@/components/NearbyHospitals'
import HospitalShareButtons from '@/components/HospitalShareButtons'
import PantipReviews from '@/components/PantipReviews'
import RelatedGuides from '@/components/RelatedGuides'
import type { Metadata } from 'next'
import type { Hospital } from '@/lib/types'
import { districtForHospital } from '@/lib/districts'

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
  // `has_surgery` is true on every record, so surfacing it added a constant
  // string to all 503 titles — pure noise that crowded out the rating.
  const serviceStr = services.join(' · ')

  const ratingPart = h.google_rating != null
    ? `⭐${h.google_rating.toFixed(1)}${h.google_review_count ? ` (${h.google_review_count.toLocaleString()} รีวิว)` : ''}`
    : ''

  // 197 of the 503 records have an English-only name_th, which produced fully
  // English titles on a Thai-language site — they rank but barely get clicked
  // (one query sat at 514 impressions / 1 click). Anchoring every title with the
  // Thai category term gives Thai searchers something to recognise in the SERP.
  const needsThaiAnchor = !/[ก-๙]/.test(h.name_th)
  const titleName = needsThaiAnchor ? `${h.name_th} โรงพยาบาลสัตว์` : h.name_th
  const title = [titleName, ratingPart, serviceStr].filter(Boolean).join(' · ')

  const priceInfo = h.price_consult ? ` · ค่าตรวจ ${h.price_consult.toLocaleString()} บาท` : ''
  // Put the actual opening hours in the snippet rather than the phrase
  // "เวลาทำการ". A searcher deciding where to take a sick animal is scanning
  // for a time, and 442 of the clinics can now show one.
  const hours = getHours(h.id)
  const hoursLine = hours ? summarizeHours(hours) : ''
  const description = [
    `${h.name_th}${serviceStr ? ` (${serviceStr})` : ''}`,
    ratingPart,
    hoursLine,
    h.address,
  ].filter(Boolean).join(' · ') + `${priceInfo} · ดูแผนที่ เบอร์โทร เส้นทาง`

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
  // 442 clinics have real weekly hours now, so this answer no longer has to
  // fall back to "please call" — which is what it said on every page that was
  // not open 24 hours, i.e. most of them.
  const hours = getHours(h.id)
  const hoursLine = hours ? summarizeHours(hours) : ''
  const faqs: { q: string; a: string }[] = [
    {
      q: `${h.name_th} เปิดทำการกี่โมง?`,
      a: hoursLine
        ? `${h.name_th} เปิดทำการ ${hoursLine}`
        : h.is_24h
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

  // A "ใช่ …มีบริการผ่าตัด" FAQ used to be emitted here on every page, gated on
  // `has_surgery` — which petvet/transform.py hardcodes to True. It asserted an
  // unverified service in FAQPage markup 503 times over. Only the neuter price,
  // which is a real scraped value when present, survives.
  if (h.price_neuter_male != null || h.price_neuter_female != null) {
    const prices = [
      h.price_neuter_male != null ? `เพศผู้ ${h.price_neuter_male.toLocaleString()} บาท` : null,
      h.price_neuter_female != null ? `เพศเมีย ${h.price_neuter_female.toLocaleString()} บาท` : null,
    ].filter(Boolean).join(' · ')
    faqs.push({
      q: `${h.name_th} ราคาทำหมันเท่าไหร่?`,
      a: `ราคาทำหมันเริ่มต้นที่ ${prices}`,
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

function BreadcrumbJsonLd({ name, district }: { name: string; district: { th: string; slug: string } | null }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'หน้าหลัก', item: 'https://www.thailandpethub.com' },
      { '@type': 'ListItem', position: 2, name: 'โรงพยาบาลสัตว์', item: 'https://www.thailandpethub.com/hospital' },
      ...(district
        ? [{ '@type': 'ListItem', position: 3, name: `เขต${district.th}`, item: `https://www.thailandpethub.com/hospital/area/${district.slug}` }]
        : []),
      { '@type': 'ListItem', position: district ? 4 : 3, name },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

function LocalBusinessJsonLd({ h, slug }: { h: Hospital; slug: string }) {
  const hours = getHours(h.id)
  const schemaHours = hours ? toSchemaHours(hours) : []
  const availableService = []
  // `has_surgery` is hardcoded `True` for every row in petvet/transform.py, so
  // emitting it declared "this clinic performs surgery" to Google on all 503
  // pages without a single record backing the claim. Same story for
  // `has_emergency`, which is false on every row. Only `is_24h` is derived from
  // a real signal (the "Open 24 hours" line on the source listing card).
  if (h.is_24h) availableService.push({ '@type': 'MedicalProcedure', name: 'บริการตลอด 24 ชั่วโมง' })

  const priceRange = h.price_consult
    ? `฿${h.price_consult.toLocaleString()}+`
    : h.price_vaccine
    ? `฿${h.price_vaccine.toLocaleString()}+`
    : undefined

  const hasEnName = h.name_en && h.name_en !== h.name_th
  const precise = hasPreciseCoord(h)

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'VeterinaryCare',
    name: h.name_th,
    ...(hasEnName ? { alternateName: h.name_en } : {}),
    url: `https://www.thailandpethub.com/hospital/${slug}`,
    address: {
      '@type': 'PostalAddress',
      ...(h.address ? { streetAddress: h.address } : {}),
      addressCountry: 'TH',
      addressLocality: h.district ? `เขต${h.district}` : 'Bangkok',
      addressRegion: 'กรุงเทพมหานคร',
    },
    areaServed: h.district
      ? { '@type': 'Place', name: `เขต${h.district} กรุงเทพมหานคร` }
      : { '@type': 'City', name: 'Bangkok', alternateName: 'กรุงเทพมหานคร' },
    ...(h.website ? { sameAs: [h.website] } : {}),
    // Only published for the 40 records with a coordinate of their own. The
    // other 463 carry the grid probe point, and feeding Google a GeoCoordinates
    // that puts a Thonburi clinic in Pathum Wan is worse than sending none.
    geo: precise ? {
      '@type': 'GeoCoordinates',
      latitude: h.lat,
      longitude: h.lng,
    } : undefined,
    hasMap: precise ? `https://www.google.com/maps?q=${h.lat},${h.lng}` : undefined,
    telephone: h.phone || undefined,
    // Real per-day hours for the 442 clinics Places returned them for. The
    // previous version could only describe the 80 that are open around the
    // clock, so every other clinic published no hours at all — the single most
    // asked question about a vet.
    ...(schemaHours.length > 0
      ? { openingHoursSpecification: schemaHours }
      : h.is_24h
        ? { openingHours: 'Mo-Su 00:00-24:00' }
        : {}),
    isAccessibleForFree: false,
    currenciesAccepted: 'THB',
    ...(priceRange ? { priceRange } : {}),
    ...(availableService.length > 0 ? { availableService } : {}),
    // Google forbids inventing a reviewCount, so omit aggregateRating entirely
    // unless both the rating and a real (non-zero) count exist.
    ...(h.google_rating != null && h.google_review_count != null && h.google_review_count > 0 ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: h.google_rating,
        reviewCount: h.google_review_count,
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
  // Routing by coordinate only works for the 40 records that own their
  // coordinate; for the rest it used to send someone chasing an emergency vet
  // to the grid probe point instead. Falling back to a name+address text query
  // lets Google resolve the business itself, which it does reliably for a named
  // clinic — a lookup, rather than a confidently wrong pin.
  const district = districtForHospital(h)
  const precise = hasPreciseCoord(h)
  const mapsQuery = precise
    ? `${h.lat},${h.lng}`
    : encodeURIComponent([h.name_en || h.name_th, h.address, 'Bangkok'].filter(Boolean).join(' '))
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`
  const mapEmbedUrl = `https://maps.google.com/maps?q=${mapsQuery}&z=${precise ? 16 : 15}&output=embed`
  const pantipReview = getHospitalReviews(h.id)
  const reviewUrl = h.google_place_id
    ? `https://search.google.com/local/reviews?placeid=${h.google_place_id}`
    : null

  const showEnName = h.name_en && h.name_en !== h.name_th
  const hours = getHours(h.id)
  const alwaysOpen = hours ? isAlwaysOpen(hours) : h.is_24h

  return (
    <main className="max-w-2xl mx-auto">
      <nav aria-label="breadcrumb" className="text-sm text-gray-400 mb-4 flex flex-wrap items-center gap-1">
        <a href="/" className="hover:text-orange-500 transition-colors">หน้าหลัก</a>
        <span>›</span>
        <a href="/hospital" className="hover:text-orange-500 transition-colors">โรงพยาบาลสัตว์</a>
        <span>›</span>
        <span className="text-gray-600">{h.name_th}</span>
      </nav>

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
            {/* The "ผ่าตัดได้" and "ฉุกเฉิน" badges are gone: `has_surgery` is
                hardcoded true and `has_emergency` is false on all 503 records,
                so one rendered on every page and the other on none. */}
            {h.google_review_count != null && h.google_review_count >= 500 && (
              <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                รีวิวเยอะ {h.google_review_count.toLocaleString()}+
              </span>
            )}
            {h.google_rating != null && h.google_rating >= 4.5 && (
              <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                คะแนนสูง {h.google_rating.toFixed(1)}
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
        {district && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">🗺️</span>
            <a href={`/hospital/area/${district.slug}`} className="text-blue-600 hover:underline">
              ดูโรงพยาบาลสัตว์อื่นในเขต{district.th}
            </a>
          </div>
        )}
        {h.phone && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">📞</span>
            <a href={`tel:${h.phone}`} className="text-gray-700 hover:text-green-600">{h.phone}</a>
          </div>
        )}
        {h.website && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">🌐</span>
            <a href={h.website} target="_blank" rel="noopener noreferrer nofollow" className="text-blue-600 hover:underline truncate">
              เว็บไซต์ทางการ
            </a>
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

      {/* Opening hours */}
      {hours && (
        <section className="bg-white rounded-xl border p-4 mb-4">
          <div className="flex items-baseline justify-between gap-3 mb-2">
            <h2 className="text-base font-bold text-gray-900">เวลาทำการ</h2>
            {alwaysOpen && (
              <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-full px-2 py-0.5">
                เปิด 24 ชั่วโมง
              </span>
            )}
          </div>
          {alwaysOpen ? (
            <p className="text-sm text-gray-700">{h.name_th} เปิดให้บริการตลอด 24 ชั่วโมง ทุกวัน</p>
          ) : (
            <dl className="text-sm divide-y divide-gray-100">
              {hours.text.map(line => {
                const [day, ...rest] = line.split(':')
                const value = rest.join(':').trim()
                const closed = !/\d/.test(value)
                return (
                  <div key={line} className="flex items-baseline justify-between gap-4 py-1.5">
                    <dt className="text-gray-500">{day}</dt>
                    <dd className={closed ? 'text-gray-400' : 'text-gray-800 font-medium tabular-nums'}>
                      {value}
                    </dd>
                  </div>
                )
              })}
            </dl>
          )}
          <p className="mt-2 text-xs text-gray-400">
            ข้อมูลจาก Google อาจเปลี่ยนแปลงในวันหยุดนักขัตฤกษ์ — กรุณาโทรยืนยันก่อนเดินทาง
          </p>
        </section>
      )}

      <AdSlot slot="1234567896" format="inline" />

      {/* Embedded map */}
      {(precise || h.address) && (
        <div className="mb-4 rounded-xl overflow-hidden border">
          <iframe
            title={`แผนที่ ${h.name_th}`}
            src={mapEmbedUrl}
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
        <a href="/neutering" className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-600 hover:border-orange-200 hover:text-orange-600 transition-colors">✂️ ทำหมัน</a>
        <a href="/cost" className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-600 hover:border-orange-200 hover:text-orange-600 transition-colors">💰 ค่ารักษา</a>
        <a href="/vaccine" className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-600 hover:border-orange-200 hover:text-orange-600 transition-colors">💉 ตารางวัคซีน</a>
        <a href="/insurance" className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-600 hover:border-orange-200 hover:text-orange-600 transition-colors">🛡️ ประกันสัตว์เลี้ยง</a>
      </div>

      <RelatedGuides current="hospital" count={4} />

      <HospitalFaqJsonLd h={h} />

      <BreadcrumbJsonLd name={h.name_th} district={district} />
      <LocalBusinessJsonLd h={h} slug={slug} />
    </main>
  )
}
