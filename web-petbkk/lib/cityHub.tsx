import type { Metadata } from 'next'
import { loadHospitals, hospitalSlug } from './hospitals'
import type { Hospital } from './types'

const SITE = 'https://www.thailandpethub.com'

export const CITY_META: Record<
  Exclude<Hospital['city'], 'bangkok'>,
  { th: string; slug: string; keywords: string[] }
> = {
  chiangmai: { th: 'เชียงใหม่', slug: 'chiangmai', keywords: ['โรงพยาบาลสัตว์เชียงใหม่', 'สัตวแพทย์เชียงใหม่', 'vet Chiang Mai'] },
  pattaya:   { th: 'พัทยา',     slug: 'pattaya',   keywords: ['โรงพยาบาลสัตว์พัทยา', 'สัตวแพทย์พัทยา', 'vet Pattaya'] },
  phuket:    { th: 'ภูเก็ต',     slug: 'phuket',    keywords: ['โรงพยาบาลสัตว์ภูเก็ต', 'สัตวแพทย์ภูเก็ต', 'vet Phuket'] },
}

export type CityKey = keyof typeof CITY_META

export function loadCityHospitals(city: CityKey): Hospital[] {
  return loadHospitals().filter(h => h.city === city)
}

export function cityMetadata(city: CityKey): Metadata {
  const { th, slug } = CITY_META[city]
  const all = loadCityHospitals(city)
  const total = all.length
  const open24 = all.filter(h => h.is_24h).length
  const title = `โรงพยาบาลสัตว์ใน${th} — ${total} แห่ง ค้นหาใกล้คุณ`
  const description =
    `รายชื่อโรงพยาบาลสัตว์และคลินิกสัตว์ใน${th} ${total} แห่ง พร้อมคะแนน Google จำนวนรีวิว ` +
    `เบอร์โทร ที่อยู่ และรายชื่อที่เปิด 24 ชั่วโมง ${open24} แห่ง`
  return {
    title,
    description,
    keywords: CITY_META[city].keywords,
    alternates: { canonical: `${SITE}/hospital/${slug}` },
    openGraph: { title, description, url: `${SITE}/hospital/${slug}`, type: 'website' },
  }
}

function topRated(all: Hospital[], count: number): Hospital[] {
  return all
    .filter(h => h.google_rating != null && (h.google_review_count ?? 0) >= 20)
    .sort((a, b) =>
      (b.google_rating ?? 0) - (a.google_rating ?? 0) ||
      (b.google_review_count ?? 0) - (a.google_review_count ?? 0)
    )
    .slice(0, count)
}

function CityHubJsonLd({ city, all }: { city: CityKey; all: Hospital[] }) {
  const { th, slug } = CITY_META[city]
  const open24h = all.filter(h => h.is_24h)
  const top = topRated(all, 10)
  const rated = all.filter(h => h.google_rating != null)
  const avg = rated.length
    ? (rated.reduce((s, h) => s + (h.google_rating ?? 0), 0) / rated.length).toFixed(2)
    : null

  const faqs: Array<{ q: string; a: string }> = [
    {
      q: `โรงพยาบาลสัตว์ใน${th}ที่คะแนนรีวิวสูงที่สุดคือที่ไหน?`,
      a: top.length
        ? `จากข้อมูล ${all.length} แห่งที่ ThailandPetHub รวบรวมใน${th} โรงพยาบาลสัตว์ที่มีคะแนน Google สูงที่สุด คือ ${top.slice(0, 5).map(h => `${h.name_th} (${h.google_rating?.toFixed(1)} ดาว จาก ${h.google_review_count?.toLocaleString()} รีวิว)`).join(', ')}`
        : `ยังไม่มีข้อมูลคะแนนรีวิวเพียงพอสำหรับการจัดอันดับใน${th}`,
    },
    {
      q: `โรงพยาบาลสัตว์เปิด 24 ชั่วโมงใน${th}มีกี่แห่ง?`,
      a: open24h.length
        ? `มี ${open24h.length} แห่งจากทั้งหมด ${all.length} แห่งที่ระบุว่าเปิดตลอด 24 ชั่วโมง เช่น ${open24h.slice(0, 4).map(h => h.name_th).join(', ')}`
        : `ยังไม่มีข้อมูลยืนยันว่ามีโรงพยาบาลสัตว์เปิด 24 ชั่วโมงใน${th} กรุณาโทรสอบถามก่อนเดินทาง`,
    },
    ...(avg ? [{
      q: `โรงพยาบาลสัตว์ใน${th}คะแนนรีวิวเฉลี่ยเท่าไหร่?`,
      a: `คะแนน Google เฉลี่ยของโรงพยาบาลสัตว์ ${rated.length} แห่งที่มีคะแนนอยู่ที่ ${avg} จาก 5 ดาว`,
    }] : []),
  ]

  const graph = [
    {
      '@type': 'CollectionPage',
      '@id': `${SITE}/hospital/${slug}#page`,
      url: `${SITE}/hospital/${slug}`,
      name: `โรงพยาบาลสัตว์ใน${th}`,
      description: `รายชื่อโรงพยาบาลสัตว์และคลินิกสัตว์ใน${th} ${all.length} แห่ง`,
      inLanguage: 'th-TH',
      isPartOf: { '@id': `${SITE}/#website` },
      about: { '@type': 'Thing', name: `โรงพยาบาลสัตว์ใน${th}` },
    },
    ...(top.length ? [{
      '@type': 'ItemList',
      '@id': `${SITE}/hospital/${slug}#toplist`,
      name: `โรงพยาบาลสัตว์ใน${th}ที่คะแนนรีวิวสูงที่สุด`,
      numberOfItems: top.length,
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      itemListElement: top.map((h, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE}/hospital/${hospitalSlug(h)}`,
        name: h.name_th,
      })),
    }] : []),
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'หน้าหลัก', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'โรงพยาบาลสัตว์', item: `${SITE}/hospital` },
        { '@type': 'ListItem', position: 3, name: th },
      ],
    },
    ...(faqs.length ? [{
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({
        '@type': 'Question', name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    }] : []),
  ]

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }}
    />
  )
}

function KeyFacts({ city, all }: { city: CityKey; all: Hospital[] }) {
  const { th } = CITY_META[city]
  const open24h = all.filter(h => h.is_24h).length
  const rated = all.filter(h => h.google_rating != null)
  const avg = rated.length
    ? (rated.reduce((s, h) => s + (h.google_rating ?? 0), 0) / rated.length).toFixed(2)
    : '—'
  const highly = all.filter(h => (h.google_rating ?? 0) >= 4.5).length

  return (
    <section className="bg-white border border-orange-100 rounded-xl p-4 mb-6">
      <p className="text-sm text-gray-700 leading-relaxed">
        ThailandPetHub รวบรวม <strong>โรงพยาบาลสัตว์และคลินิกสัตว์ใน{th} {all.length} แห่ง</strong>{' '}
        โดยในจำนวนนี้ <strong>{open24h} แห่งเปิดตลอด 24 ชั่วโมง</strong> และ{' '}
        <strong>{highly} แห่งมีคะแนน Google ตั้งแต่ 4.5 ดาวขึ้นไป</strong>{' '}
        คะแนนเฉลี่ยของทั้งหมดอยู่ที่ {avg} จาก 5 ดาว
        ทุกแห่งแสดงเบอร์โทร ที่อยู่ จำนวนรีวิว และลิงก์เส้นทาง Google Maps ฟรี ไม่ต้องสมัครสมาชิก
      </p>
      <dl className="grid grid-cols-3 gap-2 mt-3 text-center">
        {[
          { label: 'ทั้งหมด', value: all.length.toLocaleString() },
          { label: 'เปิด 24 ชม.', value: open24h.toLocaleString() },
          { label: 'คะแนน 4.5+', value: highly.toLocaleString() },
        ].map(s => (
          <div key={s.label} className="bg-orange-50 rounded-lg py-2">
            <dd className="text-lg font-black text-orange-600 leading-none">{s.value}</dd>
            <dt className="text-[11px] text-gray-500 mt-1">{s.label}</dt>
          </div>
        ))}
      </dl>
      <p className="text-xs text-gray-400 mt-3">
        พิกัดผ่านการตรวจสอบกับ Google Places แล้ว — ที่อยู่และตำแหน่งบนแผนที่แม่นยำระดับเดียวกับข้อมูลกรุงเทพ
      </p>
    </section>
  )
}

function TopRatedList({ city, all }: { city: CityKey; all: Hospital[] }) {
  const { th } = CITY_META[city]
  const top = topRated(all, 10)
  if (!top.length) return null

  return (
    <section className="mt-10">
      <h2 className="text-base font-bold text-gray-800 mb-1">
        โรงพยาบาลสัตว์ใน{th}ที่คะแนนรีวิวสูงที่สุด
      </h2>
      <p className="text-xs text-gray-400 mb-3">เรียงตามคะแนน Google</p>
      <ol className="space-y-1.5">
        {top.map((h, i) => (
          <li key={h.id} className="flex items-baseline gap-2 text-sm">
            <span className="text-xs font-bold text-orange-500 w-5 flex-shrink-0">{i + 1}.</span>
            <a href={`/hospital/${hospitalSlug(h)}`} className="text-gray-700 hover:text-orange-600 hover:underline">
              {h.name_th}
            </a>
            <span className="text-xs text-gray-400 whitespace-nowrap">
              ★{h.google_rating?.toFixed(1)} · {h.google_review_count?.toLocaleString()} รีวิว
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}

// No client search widget here yet — HospitalListClient reads the Bangkok-only
// light index (see scripts/build-hospital-index.ts). Until a city gets enough
// traffic to justify its own index and filter UI, this static, fully
// crawlable directory is what both visitors and search engines get: every
// clinic in the city, one real inbound link each.
function HospitalDirectory({ city, all }: { city: CityKey; all: Hospital[] }) {
  const { th } = CITY_META[city]
  const hospitals = [...all].sort((a, b) =>
    (a.name_th || a.name_en).localeCompare(b.name_th || b.name_en, 'th')
  )
  return (
    <section className="mt-12 border-t border-gray-100 pt-6">
      <h2 className="text-base font-bold text-gray-800 mb-1">รายชื่อโรงพยาบาลสัตว์ทั้งหมด</h2>
      <p className="text-xs text-gray-400 mb-4">{hospitals.length} แห่งใน{th} — เรียงตามตัวอักษร</p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1.5">
        {hospitals.map(h => (
          <li key={h.id}>
            <a
              href={`/hospital/${hospitalSlug(h)}`}
              className="text-xs text-gray-500 hover:text-orange-600 hover:underline line-clamp-1"
            >
              {h.name_th || h.name_en}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Full page body, shared by app/hospital/{chiangmai,pattaya,phuket}/page.tsx. */
export function CityHospitalPage({ city }: { city: CityKey }) {
  const { th } = CITY_META[city]
  const all = loadCityHospitals(city)

  return (
    <main>
      <nav aria-label="breadcrumb" className="text-xs text-gray-400 mb-3">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <a href="/hospital" className="hover:text-orange-600">โรงพยาบาลสัตว์</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">{th}</span>
      </nav>
      <h1 className="text-2xl font-black text-gray-900 mb-1">🏥 โรงพยาบาลสัตว์ใน{th}</h1>
      <p className="text-sm text-gray-400 mb-5">
        ค้นหาโรงพยาบาลสัตว์และคลินิกสัตว์ใกล้คุณ — {all.length} แห่งใน{th}
      </p>
      <KeyFacts city={city} all={all} />
      <TopRatedList city={city} all={all} />
      <HospitalDirectory city={city} all={all} />
      <CityHubJsonLd city={city} all={all} />
    </main>
  )
}
