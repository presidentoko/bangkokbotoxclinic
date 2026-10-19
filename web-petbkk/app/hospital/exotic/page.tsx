import type { Metadata } from 'next'
import { loadHospitals, hospitalSlug, districtLabel } from '@/lib/hospitals'
import { getLicense, LICENSE_CLASS } from '@/lib/licenses'
import { specialPetClinics, clinicsForAnimal, SIGNAL_SOURCE } from '@/lib/hospitalSignals'
import { CITY_META } from '@/lib/cityHub'

// CITY_META carries the cities that have their own hub; Bangkok is /hospital
// itself and so is not in it.
const CITY_TH: Record<string, string> = {
  bangkok: 'กรุงเทพ',
  ...Object.fromEntries(Object.entries(CITY_META).map(([k, v]) => [k, v.th])),
}
import type { Hospital } from '@/lib/types'

const SITE = 'https://www.thailandpethub.com'

export const metadata: Metadata = {
  title: 'โรงพยาบาลสัตว์รักษากระต่าย นก สัตว์เลื้อยคลาน — 103 แห่งที่มีคนพาไปจริง',
  description:
    'รวมโรงพยาบาลและคลินิกสัตว์ที่เจ้าของเขียนรีวิวว่าพากระต่าย แฮมสเตอร์ นก เต่า ชูการ์ไกลเดอร์ ไปรักษาจริง คัดจากรีวิวภาษาไทย 16,308 รีวิว พร้อมคำพูดของเจ้าของและใบอนุญาตสถานพยาบาลสัตว์',
  alternates: { canonical: `${SITE}/hospital/exotic` },
  keywords: [
    'โรงพยาบาลสัตว์ รักษากระต่าย', 'หมอกระต่าย', 'คลินิกสัตว์พิเศษ', 'หมอรักษานก',
    'โรงพยาบาลสัตว์ exotic', 'รักษาแฮมสเตอร์', 'หมอเต่า', 'สัตว์เลี้ยงชนิดพิเศษ',
  ],
  openGraph: {
    title: 'โรงพยาบาลสัตว์รักษาสัตว์พิเศษ — คัดจากรีวิวที่เจ้าของเขียนเอง',
    description: 'กระต่าย นก สัตว์เลื้อยคลาน แฮมสเตอร์ ชูการ์ไกลเดอร์ — 103 แห่งที่มีคนพาไปจริง',
    url: `${SITE}/hospital/exotic`,
  },
}

const KINDS: Array<{ key: string; icon: string; th: string; blurb: string }> = [
  { key: 'rabbit', icon: '🐰', th: 'กระต่าย', blurb: 'กระต่ายต้องการสัตวแพทย์ที่คุ้นเคยกับระบบย่อยอาหารและฟันที่งอกตลอดชีวิต' },
  { key: 'rodent', icon: '🐹', th: 'แฮมสเตอร์ / หนู / เม่นแคระ', blurb: 'สัตว์ฟันแทะตัวเล็กมาก การวางยาสลบและการให้ยาต้องแม่นยำเป็นพิเศษ' },
  { key: 'bird', icon: '🦜', th: 'นก', blurb: 'นกซ่อนอาการป่วยจนถึงนาทีสุดท้าย การมีหมอที่อ่านอาการนกออกจึงสำคัญ' },
  { key: 'reptile', icon: '🦎', th: 'เต่า / สัตว์เลื้อยคลาน', blurb: 'เต่าและสัตว์เลื้อยคลานต้องการความรู้เรื่องอุณหภูมิ แสง UVB และแคลเซียมโดยเฉพาะ' },
  { key: 'sugarglider', icon: '🐿️', th: 'ชูการ์ไกลเดอร์', blurb: 'สัตว์กลางคืนตัวเล็ก พบหมอที่เคยรักษาได้ยากที่สุดกลุ่มหนึ่ง' },
  { key: 'exotic', icon: '✨', th: 'ระบุว่า “สัตว์พิเศษ / exotic”', blurb: 'รีวิวที่เอ่ยคำว่าสัตว์พิเศษหรือ exotic ตรง ๆ' },
]

function ClinicRow({ h, kinds, mentions }: { h: Hospital; kinds: Array<{ key: string; signal: { label_th: string; count: number; quotes: string[] } }>; mentions: number }) {
  const slug = hospitalSlug(h)
  const lic = getLicense(h.id)
  const district = districtLabel(h)
  const quote = kinds.map(k => k.signal.quotes[0]).find(Boolean)
  return (
    <li className="py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-baseline justify-between gap-3 mb-1">
        <a href={`/hospital/${slug}`} className="font-bold text-gray-900 hover:text-orange-600 leading-snug">
          {h.name_th || h.name_en}
        </a>
        <span className="text-xs text-gray-400 shrink-0">{mentions} รีวิวพูดถึง</span>
      </div>
      <p className="text-xs text-gray-500 mb-2">
        {CITY_TH[h.city] ?? ''}{district ? ` · ${district}` : ''}
        {h.google_rating != null && <> · ⭐ {h.google_rating.toFixed(1)}</>}
        {h.is_24h && <> · เปิด 24 ชม.</>}
        {lic?.license_class && LICENSE_CLASS[lic.license_class] && (
          <> · ใบอนุญาต{LICENSE_CLASS[lic.license_class].short}</>
        )}
      </p>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {kinds.map(k => {
          const meta = KINDS.find(x => x.key === k.key)
          return (
            <span key={k.key} className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 border border-orange-100 rounded-full text-xs text-orange-800">
              <span>{meta?.icon ?? '•'}</span>
              <span className="font-semibold">{meta?.th ?? k.signal.label_th}</span>
              <span className="text-orange-400">{k.signal.count}</span>
            </span>
          )
        })}
      </div>
      {quote && (
        <p className="text-sm text-gray-600 leading-relaxed border-l-2 border-orange-100 pl-3">
          “{quote}”
        </p>
      )}
    </li>
  )
}

export default function ExoticPage() {
  const byId = new Map(loadHospitals().map(h => [h.id, h]))
  const all = specialPetClinics().filter(c => byId.has(c.id))
  const multi = all.filter(c => c.kinds.length >= 2)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'หน้าหลัก', item: SITE },
          { '@type': 'ListItem', position: 2, name: 'โรงพยาบาลสัตว์', item: `${SITE}/hospital` },
          { '@type': 'ListItem', position: 3, name: 'สัตว์พิเศษ' },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': `${SITE}/hospital/exotic#list`,
        name: 'โรงพยาบาลสัตว์ที่มีคนพาสัตว์พิเศษไปรักษา',
        numberOfItems: all.length,
        itemListElement: all.slice(0, 50).map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${SITE}/hospital/${hospitalSlug(byId.get(c.id)!)}`,
          name: byId.get(c.id)!.name_th,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'พากระต่ายไปรักษาที่ไหนดี?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `หน้านี้รวบรวม ${clinicsForAnimal('rabbit').length} แห่งที่มีเจ้าของเขียนรีวิวว่าพากระต่ายไปรักษาจริง คัดจากรีวิวภาษาไทย 16,308 รีวิว ไม่ใช่รายการบริการที่คลินิกประกาศเอง แนะนำให้โทรยืนยันก่อนเดินทางทุกครั้ง เพราะสัตวแพทย์เฉพาะทางอาจไม่ได้อยู่ทุกวัน`,
            },
          },
          {
            '@type': 'Question',
            name: 'ทำไมสัตว์พิเศษต้องหาหมอเฉพาะ?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'กระต่าย หนู นก และสัตว์เลื้อยคลานมีสรีรวิทยาต่างจากหมาแมวมาก ทั้งขนาดยา การวางยาสลบ และการอ่านอาการ สัตว์เล็กหลายชนิดซ่อนอาการป่วยจนกระทั่งอาการหนักแล้ว การพาไปหาสัตวแพทย์ที่เคยรักษาชนิดนั้นจึงต่างจากการพาไปคลินิกทั่วไป',
            },
          },
          {
            '@type': 'Question',
            name: 'รายชื่อนี้มาจากไหน?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'มาจากการนับรีวิวภาษาไทยที่เจ้าของเขียนเองใน Google Maps จำนวน 16,308 รีวิว โดยนับเฉพาะรีวิวที่เอ่ยถึงสัตว์ชนิดนั้นจริง ๆ ตัวเลขข้างชื่อคือจำนวนรีวิวที่พูดถึง ไม่ใช่คำรับรองจากคลินิก และการที่คลินิกไม่อยู่ในรายการไม่ได้แปลว่าไม่รับรักษา',
            },
          },
        ],
      },
    ],
  }

  return (
    <main className="max-w-4xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <a href="/hospital" className="hover:text-orange-600">โรงพยาบาลสัตว์</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">สัตว์พิเศษ</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">
        🐰 โรงพยาบาลสัตว์ที่รักษากระต่าย นก และสัตว์พิเศษ
      </h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-2 max-w-2xl">
        พาหมาแมวไปหาหมอที่ไหนก็ได้ แต่พอเป็นกระต่าย แฮมสเตอร์ นก หรือเต่า คำถามจะเปลี่ยนเป็น
        “ที่ไหนรับ” ทันที — และไม่มีใครตอบได้ เพราะคลินิกส่วนใหญ่ไม่ได้ประกาศไว้
      </p>
      <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-2xl">
        หน้านี้ตอบจากอีกทางหนึ่ง: อ่านรีวิวภาษาไทย <strong>16,308 รีวิว</strong>
        ที่เจ้าของเขียนเอง แล้วนับว่าที่ไหนมีคนเล่าว่า<strong>พาสัตว์ชนิดนั้นไปรักษาจริง</strong>
        ได้ออกมา <strong>{all.length} แห่ง</strong> ใน {new Set(all.map(c => byId.get(c.id)!.city)).size} จังหวัด
        โดย {multi.length} แห่งมีคนพาสัตว์พิเศษไปมากกว่า 1 ชนิด
      </p>

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-8 text-sm text-amber-900 leading-relaxed">
        <strong>อ่านตัวเลขอย่างไร</strong> — เลขข้างชื่อคือ “จำนวนรีวิวที่พูดถึง” ไม่ใช่รายการบริการที่คลินิกรับรอง
        คลินิกที่ไม่อยู่ในรายการแปลว่า<strong>ยังไม่มีใครเขียนถึง</strong> ไม่ได้แปลว่าไม่รับ
        และสัตวแพทย์เฉพาะทางอาจไม่ได้ลงตรวจทุกวัน <strong>โทรยืนยันก่อนเดินทางทุกครั้ง</strong>
      </div>

      {/* Jump list by animal: the query is almost always one specific species. */}
      <div className="flex flex-wrap gap-2 mb-8">
        {KINDS.map(k => {
          const n = clinicsForAnimal(k.key).filter(c => byId.has(c.id)).length
          if (!n) return null
          return (
            <a key={k.key} href={`#${k.key}`}
               className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-600 hover:border-orange-200 hover:text-orange-600 transition-colors">
              {k.icon} {k.th} <span className="text-gray-400">{n}</span>
            </a>
          )
        })}
      </div>

      {KINDS.map(k => {
        const full = clinicsForAnimal(k.key).filter(c => byId.has(c.id))
        const list = full.slice(0, 20)
        if (list.length === 0) return null
        return (
          <section key={k.key} id={k.key} className="mb-10 scroll-mt-4">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {k.icon} {k.th}
              <span className="ml-2 text-sm font-normal text-gray-400">
                {/* Say what is shown, not only what exists: the section caps at
                    20 and a count the list does not match is the kind of small
                    dishonesty this whole page is arguing against. */}
                {full.length > list.length ? `แสดง ${list.length} จาก ${full.length} แห่ง` : `${full.length} แห่ง`}
              </span>
            </h2>
            <p className="text-sm text-gray-500 mb-3 max-w-2xl leading-relaxed">{k.blurb}</p>
            <ul className="bg-white border rounded-2xl px-4">
              {list.map(c => (
                <ClinicRow
                  key={c.id}
                  h={byId.get(c.id)!}
                  kinds={c.kinds.filter(x => x.key === k.key).concat(c.kinds.filter(x => x.key !== k.key))}
                  mentions={c.mentions}
                />
              ))}
            </ul>
          </section>
        )
      })}

      <section className="bg-white border rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">คำถามที่พบบ่อย</h2>
        <div className="space-y-4 divide-y divide-gray-100">
          {[
            {
              q: 'พากระต่ายไปรักษาที่ไหนดี?',
              a: `หน้านี้รวบรวม ${clinicsForAnimal('rabbit').length} แห่งที่มีเจ้าของเขียนรีวิวว่าพากระต่ายไปรักษาจริง คัดจากรีวิวภาษาไทย 16,308 รีวิว ไม่ใช่รายการบริการที่คลินิกประกาศเอง แนะนำให้โทรยืนยันก่อนเดินทางทุกครั้ง`,
            },
            {
              q: 'ทำไมสัตว์พิเศษต้องหาหมอเฉพาะ?',
              a: 'กระต่าย หนู นก และสัตว์เลื้อยคลานมีสรีรวิทยาต่างจากหมาแมวมาก ทั้งขนาดยา การวางยาสลบ และการอ่านอาการ สัตว์เล็กหลายชนิดซ่อนอาการป่วยจนกระทั่งอาการหนักแล้ว',
            },
            {
              q: 'รายชื่อนี้มาจากไหน?',
              a: 'นับจากรีวิวภาษาไทยที่เจ้าของเขียนเองใน Google Maps 16,308 รีวิว เฉพาะรีวิวที่เอ่ยถึงสัตว์ชนิดนั้นจริง ๆ ตัวเลขข้างชื่อคือจำนวนรีวิวที่พูดถึง ไม่ใช่คำรับรองจากคลินิก',
            },
            {
              q: 'ฉุกเฉินกลางดึก พาสัตว์พิเศษไปที่ไหน?',
              a: 'ดูรายการที่มีสัญลักษณ์ “เปิด 24 ชม.” ในหน้านี้ก่อน แล้วโทรแจ้งชนิดสัตว์ระหว่างเดินทาง เพราะบางแห่งเปิด 24 ชั่วโมงแต่สัตวแพทย์สัตว์พิเศษไม่ได้อยู่เวรกลางคืน',
            },
          ].map((item, i) => (
            <div key={i} className={i > 0 ? 'pt-4' : ''}>
              <h3 className="font-semibold text-gray-800 mb-1">{item.q}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-400 mb-6 leading-relaxed">
        ที่มา: {SIGNAL_SOURCE.source} · ประมวลผล {SIGNAL_SOURCE.built} ·
        นับเฉพาะรีวิวที่เจ้าของเขียนเป็นภาษาไทย ไม่ใช้คำแปลอัตโนมัติ
      </p>

      <div className="flex flex-wrap gap-3">
        <a href="/hospital" className="px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 transition-colors">
          ← ดูโรงพยาบาลทั้งหมด
        </a>
        <a href="/hospital/24h" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">
          🕐 เปิด 24 ชั่วโมง
        </a>
        <a href="/hospital/license" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">
          ✅ ตรวจสอบใบอนุญาต
        </a>
      </div>
    </main>
  )
}
