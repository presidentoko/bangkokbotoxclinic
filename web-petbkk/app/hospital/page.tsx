import { Suspense } from 'react'
import type { Metadata } from 'next'
import HospitalListClient from '@/components/HospitalListClient'
import RelatedGuides from '@/components/RelatedGuides'
import AdSlot from '@/components/AdSlot'
import { loadHospitals, hospitalSlug } from '@/lib/hospitals'
import { getIndexableDistricts } from '@/lib/districts'
import type { Hospital } from '@/lib/types'

const SITE = 'https://www.thailandpethub.com'

// Counted from the dataset rather than typed in: the hardcoded "503 แห่ง"
// survived a backfill that dropped 7 permanently-closed and delisted clinics,
// and a title that overstates the list is the kind of mismatch Google notices.
const TOTAL = loadHospitals().length
const OPEN_24H = loadHospitals().filter(h => h.is_24h).length

export const metadata: Metadata = {
  title: `โรงพยาบาลสัตว์ในกรุงเทพ — ${TOTAL} แห่ง ค้นหาใกล้คุณ เปิด 24 ชม.`,
  description:
    `รายชื่อโรงพยาบาลสัตว์และคลินิกสัตว์ในกรุงเทพ ${TOTAL} แห่ง แยกตามเขต พร้อมคะแนน Google จำนวนรีวิว เบอร์โทร ที่อยู่ และรายชื่อที่เปิด 24 ชั่วโมง ${OPEN_24H} แห่ง`,
  keywords: ['โรงพยาบาลสัตว์', 'สัตวแพทย์ใกล้ฉัน', 'คลินิกสัตว์ใกล้ฉัน', 'คลินิกสัตว์เลี้ยง', 'สัตวแพทย์ 24 ชั่วโมง', 'vet Bangkok', 'โรงพยาบาลสัตว์กรุงเทพ'],
  alternates: { canonical: `${SITE}/hospital` },
  openGraph: {
    title: `โรงพยาบาลสัตว์ในกรุงเทพ — ${TOTAL} แห่ง ค้นหาใกล้คุณ`,
    description: 'คะแนน Google รีวิว เบอร์โทร และรายชื่อที่เปิด 24 ชั่วโมง แยกตามเขต',
    url: `${SITE}/hospital`,
    type: 'website',
  },
}

/** Rating alone puts a 5.0-from-3-reviews clinic on top, so require real volume. */
function topRated(all: Hospital[], count: number): Hospital[] {
  return all
    .filter(h => h.google_rating != null && (h.google_review_count ?? 0) >= 100)
    .sort((a, b) =>
      (b.google_rating ?? 0) - (a.google_rating ?? 0) ||
      (b.google_review_count ?? 0) - (a.google_review_count ?? 0)
    )
    .slice(0, count)
}

/**
 * ItemList is the format answer engines actually lift for "best vet in Bangkok"
 * style questions — a ranked list with names and URLs they can attribute. Every
 * value below is read off the dataset, so the markup cannot drift from the page.
 */
function HubJsonLd({ all }: { all: Hospital[] }) {
  const open24h = all.filter(h => h.is_24h)
  const top = topRated(all, 10)
  const rated = all.filter(h => h.google_rating != null)
  const avg = rated.length
    ? (rated.reduce((s, h) => s + (h.google_rating ?? 0), 0) / rated.length).toFixed(2)
    : null

  const faqs: Array<{ q: string; a: string }> = [
    {
      q: 'โรงพยาบาลสัตว์ในกรุงเทพที่คะแนนรีวิวสูงที่สุดคือที่ไหน?',
      a: `จากข้อมูล ${all.length} แห่งที่ ThailandPetHub รวบรวม โรงพยาบาลสัตว์ที่มีคะแนน Google สูงที่สุด (นับเฉพาะที่มีรีวิวตั้งแต่ 100 รีวิวขึ้นไป) คือ ${top.slice(0, 5).map(h => `${h.name_th} (${h.google_rating?.toFixed(1)} ดาว จาก ${h.google_review_count?.toLocaleString()} รีวิว)`).join(', ')}`,
    },
    {
      q: 'โรงพยาบาลสัตว์เปิด 24 ชั่วโมงในกรุงเทพมีกี่แห่ง?',
      a: `มี ${open24h.length} แห่งจากทั้งหมด ${all.length} แห่งที่ระบุว่าเปิดตลอด 24 ชั่วโมง เช่น ${open24h.slice(0, 4).map(h => h.name_th).join(', ')} ดูรายชื่อทั้งหมดได้ที่หน้าโรงพยาบาลสัตว์ 24 ชั่วโมง`,
    },
    {
      q: 'ค้นหาคลินิกสัตว์ใกล้ฉันในกรุงเทพได้อย่างไร?',
      a: `พิมพ์ชื่อโรงพยาบาลหรือย่านที่ต้องการในช่องค้นหาบนหน้านี้ หรือกรองเฉพาะที่เปิด 24 ชั่วโมง แต่ละแห่งมีเบอร์โทร ที่อยู่ คะแนน Google และลิงก์เส้นทาง Google Maps`,
    },
    ...(avg ? [{
      q: 'โรงพยาบาลสัตว์ในกรุงเทพคะแนนรีวิวเฉลี่ยเท่าไหร่?',
      a: `คะแนน Google เฉลี่ยของโรงพยาบาลสัตว์ ${rated.length} แห่งที่มีคะแนนอยู่ที่ ${avg} จาก 5 ดาว`,
    }] : []),
    {
      q: 'สัตว์เลี้ยงป่วยฉุกเฉินกลางดึกต้องทำอย่างไร?',
      a: 'พาไปโรงพยาบาลสัตว์ที่เปิด 24 ชั่วโมงทันที และโทรแจ้งอาการล่วงหน้าระหว่างเดินทางเพื่อให้ทีมเตรียมรับเคส สัญญาณที่ต้องไปทันที ได้แก่ ชัก หายใจลำบาก เลือดออกไม่หยุด ท้องบวมแข็ง หรือหมดสติ',
    },
  ]

  const graph = [
    {
      '@type': 'CollectionPage',
      '@id': `${SITE}/hospital#page`,
      url: `${SITE}/hospital`,
      name: 'โรงพยาบาลสัตว์ในกรุงเทพ',
      description: `รายชื่อโรงพยาบาลสัตว์และคลินิกสัตว์ในกรุงเทพ ${all.length} แห่ง`,
      inLanguage: 'th-TH',
      isPartOf: { '@id': `${SITE}/#website` },
      about: { '@type': 'Thing', name: 'โรงพยาบาลสัตว์ในกรุงเทพ' },
    },
    {
      '@type': 'ItemList',
      '@id': `${SITE}/hospital#toplist`,
      name: 'โรงพยาบาลสัตว์ในกรุงเทพที่คะแนนรีวิวสูงที่สุด',
      description: 'เรียงตามคะแนน Google เฉพาะที่มีรีวิวตั้งแต่ 100 รีวิวขึ้นไป',
      numberOfItems: top.length,
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      itemListElement: top.map((h, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE}/hospital/${hospitalSlug(h)}`,
        name: h.name_th,
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'หน้าหลัก', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'โรงพยาบาลสัตว์' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ]

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }}
    />
  )
}

/**
 * An answer-first summary. Both featured snippets and AI answer engines want a
 * self-contained factual paragraph near the top of the document; the hub
 * previously opened straight into a client-rendered filter widget, so a crawler
 * or a model got no extractable statement about what this page even covers.
 */
function KeyFacts({ all }: { all: Hospital[] }) {
  const open24h = all.filter(h => h.is_24h).length
  const rated = all.filter(h => h.google_rating != null)
  const avg = rated.length
    ? (rated.reduce((s, h) => s + (h.google_rating ?? 0), 0) / rated.length).toFixed(2)
    : '—'
  const highly = all.filter(h => (h.google_rating ?? 0) >= 4.5).length

  return (
    <section className="bg-white border border-orange-100 rounded-xl p-4 mb-6">
      <p className="text-sm text-gray-700 leading-relaxed">
        ThailandPetHub รวบรวม <strong>โรงพยาบาลสัตว์และคลินิกสัตว์ในกรุงเทพ {all.length} แห่ง</strong>{' '}
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
    </section>
  )
}

/**
 * District entry points. "คลินิกสัตว์ใกล้ฉัน" converts at roughly 11% CTR here
 * while the clinic brand names that supply most impressions convert under 0.2%,
 * and until now there was no page for that intent to land on.
 */
function DistrictIndex() {
  const districts = getIndexableDistricts()
  if (!districts.length) return null
  return (
    <section className="mb-8">
      <h2 className="text-base font-bold text-gray-800 mb-1">ค้นหาตามเขต</h2>
      <p className="text-xs text-gray-400 mb-3">{districts.length} เขตในกรุงเทพที่มีข้อมูลโรงพยาบาลสัตว์</p>
      <div className="flex flex-wrap gap-2">
        {districts.map(d => (
          <a
            key={d.district.slug}
            href={`/hospital/area/${d.district.slug}`}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700 hover:border-orange-300 hover:text-orange-600 transition-colors"
          >
            เขต{d.district.th} <span className="text-gray-400">{d.hospitals.length}</span>
          </a>
        ))}
      </div>
    </section>
  )
}

/** Ranked shortlist, server-rendered so it is visible to crawlers and to models. */
function TopRatedList({ all }: { all: Hospital[] }) {
  const top = topRated(all, 10)
  if (!top.length) return null

  return (
    <section className="mt-10">
      <h2 className="text-base font-bold text-gray-800 mb-1">
        โรงพยาบาลสัตว์ในกรุงเทพที่คะแนนรีวิวสูงที่สุด 10 อันดับ
      </h2>
      <p className="text-xs text-gray-400 mb-3">
        เรียงตามคะแนน Google นับเฉพาะที่มีรีวิวตั้งแต่ 100 รีวิวขึ้นไป
      </p>
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

// The interactive list above is client-rendered (it needs geolocation and URL
// filters), so a crawler's first pass sees only its loading state — which left
// all 500+ detail pages with effectively no inbound internal link. This static
// directory is server-rendered so the hub actually links to what it indexes.
function HospitalDirectory({ all }: { all: Hospital[] }) {
  const hospitals = [...all].sort((a, b) =>
    (a.name_th || a.name_en).localeCompare(b.name_th || b.name_en, 'th')
  )

  return (
    <section className="mt-12 border-t border-gray-100 pt-6">
      <h2 className="text-base font-bold text-gray-800 mb-1">รายชื่อโรงพยาบาลสัตว์ทั้งหมด</h2>
      <p className="text-xs text-gray-400 mb-4">{hospitals.length} แห่งในกรุงเทพ — เรียงตามตัวอักษร</p>
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

export default function HospitalPage() {
  const all = loadHospitals()

  return (
    <main>
      <h1 className="text-2xl font-black text-gray-900 mb-1">🏥 โรงพยาบาลสัตว์ในกรุงเทพ</h1>
      <p className="text-sm text-gray-400 mb-5">
        ค้นหาโรงพยาบาลสัตว์และคลินิกสัตว์ใกล้คุณ — {all.length} แห่งในกรุงเทพ
      </p>
      <KeyFacts all={all} />
      <AdSlot slot="1234567891" format="leaderboard" />
      <DistrictIndex />
      <Suspense fallback={null}>
        <HospitalListClient />
      </Suspense>
      <TopRatedList all={all} />
      <AdSlot slot="1234567892" format="inline" />
      <HospitalDirectory all={all} />
      <RelatedGuides current="hospital" count={4} />
      <HubJsonLd all={all} />
    </main>
  )
}
