import type { Metadata } from 'next'
import { loadHospitals, hospitalSlug, toLightHospital } from './hospitals'
import { getHours, summarizeHours } from './hospitalHours'
import { getLicense, LICENSE_CLASS } from './licenses'
import { CITY_META, type CityKey } from './cityHub'
import HospitalCard from '@/components/HospitalCard'
import type { Hospital } from './types'

const SITE = 'https://www.thailandpethub.com'

/**
 * `/hospital/<city>/24h` — the one clinic question that is an emergency.
 *
 * "โรงพยาบาลสัตว์ 24 ชั่วโมง" had a page, but only for Bangkok, because
 * `/hospital/24h` is built from `loadBangkokHospitals()`. Someone in Chiang Mai
 * at 2am got the Bangkok list or the city's full 201-clinic list, most of which
 * closed hours ago.
 *
 * A city gets a page only where enough clinics are open around the clock to
 * make one worth reading (MIN_CLINICS). Phuket has one, so Phuket has no page
 * and its clinic sits on the city hub instead — a page listing a single row is
 * exactly the thin, generated shape the site is trying to get out from under.
 */
const MIN_CLINICS = 5

export function cities24h(): CityKey[] {
  return (Object.keys(CITY_META) as CityKey[]).filter(c => open24hIn(c).length >= MIN_CLINICS)
}

export function open24hIn(city: CityKey): Hospital[] {
  return loadHospitals()
    .filter(h => h.city === city && h.is_24h)
    .sort((a, b) =>
      (b.google_rating ?? 0) - (a.google_rating ?? 0) ||
      (b.google_review_count ?? 0) - (a.google_review_count ?? 0))
}

export function city24hMetadata(city: CityKey): Metadata {
  const { th, slug } = CITY_META[city]
  const list = open24hIn(city)
  const title = `โรงพยาบาลสัตว์ 24 ชั่วโมง ${th} — ${list.length} แห่ง เบอร์โทรและเส้นทาง`
  const description =
    `รายชื่อโรงพยาบาลสัตว์ที่เปิด 24 ชั่วโมงใน${th} ${list.length} แห่ง พร้อมเบอร์โทร ที่อยู่ คะแนน Google ` +
    `และสถานะใบอนุญาตสถานพยาบาลสัตว์จากกรมปศุสัตว์ — โทรยืนยันก่อนเดินทางทุกครั้ง`
  return {
    title,
    description,
    keywords: [
      `โรงพยาบาลสัตว์ 24 ชั่วโมง ${th}`,
      `คลินิกสัตว์ 24 ชม ${th}`,
      `หมาป่วยกลางคืน ${th}`,
      `สัตวแพทย์ฉุกเฉิน ${th}`,
    ],
    alternates: { canonical: `${SITE}/hospital/${slug}/24h` },
    openGraph: { title, description, url: `${SITE}/hospital/${slug}/24h`, type: 'website' },
  }
}

function faqsFor(city: CityKey, list: Hospital[]) {
  const { th } = CITY_META[city]
  const licensed = list.filter(h => getLicense(h.id))
  const overnight = licensed.filter(h => {
    const c = getLicense(h.id)?.license_class
    return c === '02' || c === '03'
  })
  return [
    {
      q: `${th}มีโรงพยาบาลสัตว์เปิด 24 ชั่วโมงกี่แห่ง?`,
      a: `เท่าที่เรารวบรวมได้มี ${list.length} แห่งใน${th}ที่ระบุว่าเปิดตลอด 24 ชั่วโมง ` +
         `ได้แก่ ${list.slice(0, 5).map(h => h.name_th).join(', ')}${list.length > 5 ? ' และอื่น ๆ' : ''} ` +
         `ข้อมูลเวลาทำการมาจาก Google และอาจเปลี่ยนในวันหยุด จึงควรโทรยืนยันก่อนเดินทางเสมอ`,
    },
    {
      q: `กลางคืนพาสัตว์เลี้ยงไปหาหมอที่${th} ต้องเตรียมอะไรบ้าง?`,
      a: 'โทรแจ้งอาการล่วงหน้าเพื่อให้ทีมเตรียมรับ นำยาที่สัตว์เลี้ยงกินอยู่หรือถ่ายรูปฉลากยาไปด้วย ' +
         'ถ้าเคยตรวจเลือดหรือเอกซเรย์ที่อื่นให้นำผลไปด้วย และถ้าสงสัยว่ากินสารพิษ ให้นำบรรจุภัณฑ์ไปให้สัตวแพทย์ดู',
    },
    {
      q: `โรงพยาบาลสัตว์ 24 ชั่วโมงใน${th}รับสัตว์ป่วยค้างคืนได้ไหม?`,
      a: overnight.length
        ? `เปิด 24 ชั่วโมงกับรับค้างคืนเป็นคนละเรื่อง ใน ${list.length} แห่งนี้ เราจับคู่กับทะเบียนกรมปศุสัตว์ได้ ` +
          `${licensed.length} แห่ง และในจำนวนนั้น ${overnight.length} แห่งถือใบอนุญาตประเภทที่มีที่พักสัตว์ป่วยค้างคืน ` +
          `ส่วนที่เหลือควรโทรถามก่อนว่ารับแอดมิทหรือต้องส่งต่อ`
        : 'เปิด 24 ชั่วโมงไม่ได้แปลว่ารับสัตว์ป่วยค้างคืนเสมอไป ประเภทใบอนุญาตสถานพยาบาลสัตว์เป็นตัวบอกว่าที่นั่นมีที่พักสัตว์ป่วยหรือไม่ ' +
          'แนะนำให้โทรถามก่อนเดินทาง',
    },
  ]
}

function JsonLd({ city, list }: { city: CityKey; list: Hospital[] }) {
  const { th, slug } = CITY_META[city]
  const graph = [
    {
      '@type': 'ItemList',
      name: `โรงพยาบาลสัตว์ 24 ชั่วโมงใน${th}`,
      numberOfItems: list.length,
      itemListElement: list.map((h, i) => ({
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
        { '@type': 'ListItem', position: 2, name: 'โรงพยาบาลสัตว์', item: `${SITE}/hospital` },
        { '@type': 'ListItem', position: 3, name: th, item: `${SITE}/hospital/${slug}` },
        { '@type': 'ListItem', position: 4, name: 'เปิด 24 ชั่วโมง' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqsFor(city, list).map(f => ({
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

export function City24hPage({ city }: { city: CityKey }) {
  const { th, slug } = CITY_META[city]
  const list = open24hIn(city)
  const faqs = faqsFor(city, list)
  const licensed = list.filter(h => getLicense(h.id))

  return (
    <main className="max-w-2xl mx-auto">
      <JsonLd city={city} list={list} />

      <nav aria-label="breadcrumb" className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <a href="/hospital" className="hover:text-orange-600">โรงพยาบาลสัตว์</a>
        <span className="mx-1.5">›</span>
        <a href={`/hospital/${slug}`} className="hover:text-orange-600">{th}</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">เปิด 24 ชั่วโมง</span>
      </nav>

      <h1 className="text-2xl font-black text-gray-900 mb-1">🚨 โรงพยาบาลสัตว์ 24 ชั่วโมง {th}</h1>
      <p className="text-sm text-gray-500 mb-5">
        {list.length} แห่งที่ระบุว่าเปิดตลอด 24 ชั่วโมง · เรียงตามคะแนน Google
      </p>

      <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
        <p className="text-sm text-red-900 leading-relaxed">
          <strong>โทรก่อนเดินทางเสมอ</strong> — เวลาทำการมาจากข้อมูล Google และอาจเปลี่ยนในวันหยุดนักขัตฤกษ์
          หรือเมื่อสัตวแพทย์เวรไม่อยู่ การโทรแจ้งอาการล่วงหน้ายังช่วยให้ทีมเตรียมรับได้ทันด้วย
        </p>
        {licensed.length > 0 && (
          <p className="text-xs text-red-800 mt-2">
            {licensed.length} ใน {list.length} แห่งนี้จับคู่กับทะเบียนสถานพยาบาลสัตว์ของกรมปศุสัตว์ได้ —
            ดูประเภทใบอนุญาต (รับค้างคืนได้หรือไม่) ได้ในหน้าของแต่ละแห่ง
          </p>
        )}
      </div>

      <div className="space-y-3">
        {list.map(h => {
          const hours = getHours(h.id)
          const lic = getLicense(h.id)
          return (
            <div key={h.id}>
              <HospitalCard hospital={toLightHospital(h)} />
              <p className="text-[11px] text-gray-400 mt-1 ml-1">
                {hours ? summarizeHours(hours) : 'เวลาทำการ: ระบุว่าเปิด 24 ชั่วโมง'}
                {lic?.license_class ? ` · ใบอนุญาต ${lic.license_no} (${LICENSE_CLASS[lic.license_class].short})` : ''}
              </p>
            </div>
          )
        })}
      </div>

      <section className="mt-8 bg-white border rounded-xl p-4">
        <h2 className="text-base font-bold text-gray-900 mb-3">คำถามที่พบบ่อย</h2>
        <div className="space-y-3 divide-y divide-gray-100">
          {faqs.map((f, i) => (
            <div key={i} className={i > 0 ? 'pt-3' : ''}>
              <h3 className="font-semibold text-sm text-gray-800 mb-1">{f.q}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-2 mt-6">
        <a href={`/hospital/${slug}`} className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-600 hover:border-orange-200 hover:text-orange-600">
          🏥 โรงพยาบาลสัตว์ใน{th}ทั้งหมด
        </a>
        <a href="/emergency" className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-600 hover:border-orange-200 hover:text-orange-600">
          🚑 คู่มือฉุกเฉิน
        </a>
        <a href="/hospital/license" className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-600 hover:border-orange-200 hover:text-orange-600">
          ✅ ตรวจสอบใบอนุญาต
        </a>
      </div>
    </main>
  )
}
