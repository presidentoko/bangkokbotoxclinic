import type { Metadata } from 'next'
import registry from '@/data/vet-registry.json'
import { LICENSE_CLASS, LICENSE_SOURCE, licensedCount, type LicenseClass } from '@/lib/licenses'

const URL = 'https://www.thailandpethub.com/vet-license'

/**
 * The guide the licence data earns.
 *
 * `/hospital/license` is a lookup tool; this is the page that explains what the
 * lookup means — what the Animal Clinic Act B.E. 2533 obliges a clinic to show
 * its customers, and what the national register looks like once you add it up.
 * Every legal statement below names its section and links the Department of
 * Livestock Development's own summary of the Act; every number is counted from
 * the register this site collected.
 *
 * This is deliberately one page, not a template. The food section was pruned to
 * nothing partly because it was 1,686 pages of the same shape; the way back
 * into Search is pages a person would send to a friend.
 */

const ACT_SUMMARY = 'https://legal.dld.go.th/images/Pho%20Roh%20Bor/Sathan-phayabansat/5%20Sathan-phayabansat/1.pdf'
const CHECKED = '30 ก.ย. 2569'

type Rec = { province: string; license_class: string }

export const metadata: Metadata = {
  title: { absolute: 'คลินิกสัตว์ต้องมีใบอนุญาตไหม — กฎหมายบังคับอะไร และเช็กยังไง' },
  description:
    'ตาม พ.ร.บ.สถานพยาบาลสัตว์ พ.ศ. 2533 คลินิกและโรงพยาบาลสัตว์ต้องมีใบอนุญาต 2 ใบ ผู้ดำเนินการต้องเป็นสัตวแพทย์ ' +
    'และต้องติดใบอนุญาตกับรายการค่ารักษาให้เห็นชัด — พร้อมวิธีตรวจสอบจากทะเบียนกรมปศุสัตว์ 3,861 แห่งทั่วประเทศ',
  keywords: [
    'คลินิกสัตว์ ใบอนุญาต',
    'โรงพยาบาลสัตว์ ใบอนุญาต',
    'พ.ร.บ. สถานพยาบาลสัตว์ 2533',
    'คลินิกสัตว์เถื่อน',
    'ตรวจสอบคลินิกสัตว์',
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: 'คลินิกสัตว์ต้องมีใบอนุญาตไหม — กฎหมายบังคับอะไร และเช็กยังไง',
    description: 'ใบอนุญาต 2 ใบ · อายุ 3 ปี · ผู้ดำเนินการต้องเป็นสัตวแพทย์ · ต้องติดค่ารักษาให้เห็น',
    url: URL,
    type: 'article',
  },
}

/** What the Act requires a clinic to do where its customers can see it. */
const CHECKLIST: { text: string; section: string; detail: string }[] = [
  {
    text: 'ใบอนุญาตให้ตั้ง และใบอนุญาตให้ดำเนินการ ติดไว้ในที่เปิดเผย',
    section: 'มาตรา 17',
    detail: 'เป็นคนละใบกัน ใบแรกคือ “ตั้งสถานที่ได้” ใบที่สองคือ “เปิดดำเนินการได้” ต้องแสดงทั้งคู่',
  },
  {
    text: 'ชื่อสถานพยาบาลสัตว์ และชื่อสัตวแพทย์ประจำ พร้อมรายละเอียด',
    section: 'มาตรา 16',
    detail: 'ถ้าไม่มีชื่อสัตวแพทย์ติดไว้เลย นั่นคือสิ่งที่กฎหมายข้อนี้ออกมาเพื่อป้องกันโดยตรง',
  },
  {
    text: 'รายการค่ารักษาพยาบาลและค่าบริการ ติดให้เห็นได้ง่าย',
    section: 'มาตรา 16',
    detail: 'ราคาเป็นสิ่งที่ต้องติดไว้ที่คลินิก — ถามได้ ดูได้ ก่อนตัดสินใจ และไม่ต้องเกรงใจ',
  },
  {
    text: 'ไม่รับสัตว์ป่วยค้างคืนเกินจำนวนที่ระบุในใบอนุญาต',
    section: 'มาตรา 24',
    detail: 'ยกเว้นกรณีฉุกเฉินที่ถ้าไม่รับไว้จะเป็นอันตรายต่อสัตว์ป่วย',
  },
  {
    text: 'ไม่โฆษณาเกินจริงหรือทำให้เข้าใจผิดเรื่องการรักษา',
    section: 'มาตรา 18',
    detail: 'ครอบคลุมทั้งชื่อ ที่ตั้ง กิจการ และคุณวุฒิของสัตวแพทย์',
  },
]

const FAQS = [
  {
    q: 'คลินิกรักษาสัตว์ต้องมีใบอนุญาตไหม?',
    a: 'ต้องมี และต้องมีถึง 2 ใบ คือใบอนุญาตให้ตั้งสถานพยาบาลสัตว์ (มาตรา 7) และใบอนุญาตให้ดำเนินการสถานพยาบาลสัตว์ (มาตรา 9) ตาม พ.ร.บ.สถานพยาบาลสัตว์ พ.ศ. 2533 ทั้งสองใบต้องติดแสดงไว้ในที่เปิดเผยและเห็นได้ง่ายที่คลินิก (มาตรา 17)',
  },
  {
    q: 'ใครเป็นผู้ดำเนินการคลินิกสัตว์ได้บ้าง?',
    a: 'ผู้อนุญาตจะออกใบอนุญาตให้ดำเนินการได้ต่อเมื่อผู้ขอเป็นผู้ประกอบวิชาชีพการสัตวแพทย์ เป็นผู้ดำเนินการอยู่แล้วไม่เกินสองแห่ง และสามารถควบคุมดูแลกิจการได้อย่างใกล้ชิด (มาตรา 10) กล่าวคือคนที่ดูแลคลินิกในทางกฎหมายต้องเป็นสัตวแพทย์ ไม่ใช่เจ้าของทั่วไป',
  },
  {
    q: 'ใบอนุญาตมีอายุกี่ปี?',
    a: 'สามปีนับแต่วันที่ออกใบอนุญาต และต้องยื่นคำขอต่ออายุก่อนใบอนุญาตสิ้นอายุ (มาตรา 13) เมื่อยื่นคำขอและชำระค่าธรรมเนียมแล้ว ประกอบกิจการต่อได้จนกว่าจะมีคำสั่งไม่อนุญาต',
  },
  {
    q: 'ค้นในทะเบียนแล้วไม่เจอชื่อคลินิก แปลว่าเถื่อนหรือเปล่า?',
    a: 'ไม่จำเป็น ทะเบียนใช้ “ชื่อที่จดทะเบียน” ซึ่งมักต่างจากชื่อบนป้ายหรือชื่อใน Google Maps และบางแห่งจดในชื่อบริษัท วิธีที่ตรงที่สุดคือดูใบอนุญาตที่ติดอยู่ในคลินิก หรือสอบถามเลขที่ใบอนุญาตโดยตรง หากยังไม่ชัดเจน ติดต่อสำนักงานปศุสัตว์จังหวัด หรือกองสวัสดิภาพสัตว์และสัตวแพทย์บริการ กรมปศุสัตว์',
  },
  {
    q: 'ประเภทใบอนุญาตบอกอะไรกับเจ้าของสัตว์?',
    a: 'กฎหมายแบ่งสถานพยาบาลสัตว์เป็นประเภทที่มีที่พักสัตว์ป่วยไว้ค้างคืน กับประเภทที่ไม่มี (มาตรา 6) ในทะเบียนจึงเห็นเป็นประเภท 01 (ไม่ค้างคืน), 02 (ค้างคืนไม่เกินสิบที่) และ 03 (ค้างคืนเกินสิบที่) ถ้าน้องอาจต้องแอดมิท ประเภทนี้คือสิ่งที่บอกว่าที่นั่นรับไว้ได้จริงหรือต้องส่งต่อ',
  },
]

export default function VetLicensePage() {
  const records = (registry as { records: Rec[] }).records
  const byClass = records.reduce<Record<string, number>>((a, r) => {
    a[r.license_class] = (a[r.license_class] ?? 0) + 1
    return a
  }, {})
  const byProvince = records.reduce<Record<string, number>>((a, r) => {
    a[r.province] = (a[r.province] ?? 0) + 1
    return a
  }, {})
  const provinces = Object.entries(byProvince).sort((a, b) => b[1] - a[1])
  const overnight = (byClass['02'] ?? 0) + (byClass['03'] ?? 0)
  const matched = licensedCount()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: 'คลินิกสัตว์ต้องมีใบอนุญาตไหม — กฎหมายบังคับอะไร และเช็กยังไง',
        inLanguage: 'th',
        url: URL,
        author: { '@type': 'Organization', name: 'ThailandPetHub' },
        publisher: { '@type': 'Organization', name: 'ThailandPetHub', url: 'https://www.thailandpethub.com' },
        citation: [ACT_SUMMARY, LICENSE_SOURCE.url],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'หน้าหลัก', item: 'https://www.thailandpethub.com' },
          { '@type': 'ListItem', position: 2, name: 'โรงพยาบาลสัตว์', item: 'https://www.thailandpethub.com/hospital' },
          { '@type': 'ListItem', position: 3, name: 'ใบอนุญาตสถานพยาบาลสัตว์' },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ],
  }

  const classOrder: LicenseClass[] = ['01', '02', '03', '04', 'gov']

  return (
    <main className="max-w-2xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="breadcrumb" className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <a href="/hospital" className="hover:text-orange-600">โรงพยาบาลสัตว์</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">ใบอนุญาตสถานพยาบาลสัตว์</span>
      </nav>

      <h1 className="text-2xl font-black text-gray-900 mb-2">คลินิกสัตว์ต้องมีใบอนุญาตไหม</h1>
      <p className="text-sm text-gray-600 leading-relaxed mb-6">
        ต้องมี — และกฎหมายยังบังคับให้ติดใบอนุญาต ชื่อสัตวแพทย์ และ<strong>รายการค่ารักษา</strong>ไว้ให้คุณเห็นด้วย
        หน้านี้สรุปว่า พ.ร.บ.สถานพยาบาลสัตว์ พ.ศ. 2533 บังคับอะไรไว้บ้าง อ้างอิงมาตราทุกข้อ
        และดูว่าทะเบียนของกรมปศุสัตว์ทั้งประเทศหน้าตาเป็นอย่างไร
      </p>

      <section className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
        <h2 className="text-base font-bold text-emerald-900 mb-3">เช็กลิสต์ 5 ข้อ ที่ดูได้ตั้งแต่ยืนอยู่หน้าเคาน์เตอร์</h2>
        <ul className="space-y-3">
          {CHECKLIST.map((c, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {c.text} <span className="font-normal text-emerald-700">({c.section})</span>
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">{c.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white border rounded-xl p-4 mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-2">ใบอนุญาต 2 ใบ และอายุ 3 ปี</h2>
        <div className="text-sm text-gray-600 leading-relaxed space-y-2">
          <p>
            กฎหมายแยกเป็น <strong>ใบอนุญาตให้ตั้งสถานพยาบาลสัตว์</strong> (มาตรา 7) กับ{' '}
            <strong>ใบอนุญาตให้ดำเนินการสถานพยาบาลสัตว์</strong> (มาตรา 9) คนละใบ และต้องแสดงทั้งสองใบที่คลินิก (มาตรา 17)
          </p>
          <p>
            ใบอนุญาต<strong>มีอายุสามปี</strong>นับแต่วันที่ออก และต้องยื่นต่ออายุก่อนสิ้นอายุ (มาตรา 13)
            ด้วยเหตุนี้เราจึงไม่แปลงปีในเลขที่ใบอนุญาตเป็น “เปิดมาตั้งแต่ปีไหน” — ตัวเลขนั้นบอกปีที่ออกเลขที่นั้น ไม่ได้บอกอายุกิจการ
          </p>
          <p>
            ใบอนุญาตให้ดำเนินการออกให้เฉพาะ<strong>ผู้ประกอบวิชาชีพการสัตวแพทย์</strong> ที่เป็นผู้ดำเนินการอยู่ไม่เกินสองแห่ง
            และควบคุมดูแลกิจการได้ใกล้ชิด (มาตรา 10) — คนที่รับผิดชอบคลินิกตามกฎหมายจึงต้องเป็นสัตวแพทย์
          </p>
        </div>
      </section>

      <section className="bg-white border rounded-xl p-4 mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-1">ทะเบียนทั้งประเทศ {records.length.toLocaleString()} แห่ง</h2>
        <p className="text-xs text-gray-500 mb-3">
          รวมจากรายชื่อรายเขตปศุสัตว์ทั้ง 10 ชุดของกรมปศุสัตว์ · ดึงข้อมูลเมื่อ {LICENSE_SOURCE.retrieved} · ครอบคลุม {provinces.length} จังหวัด
        </p>
        <div className="space-y-2">
          {classOrder.filter(c => byClass[c]).map(c => {
            const n = byClass[c]
            const pct = Math.round((n / records.length) * 100)
            return (
              <div key={c}>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    <span className="font-mono font-bold">{c === 'gov' ? 'รัฐ' : c}</span> · {LICENSE_CLASS[c].short}
                  </span>
                  <span className="font-semibold text-gray-900">{n.toLocaleString()}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded mt-1">
                  <div className="h-1.5 bg-emerald-500 rounded" style={{ width: `${Math.max(pct, 1)}%` }} />
                </div>
              </div>
            )
          })}
        </div>
        <p className="text-sm text-gray-600 leading-relaxed mt-4">
          แปลว่า <strong>{overnight.toLocaleString()} แห่ง ({Math.round((overnight / records.length) * 100)}%)</strong>{' '}
          เท่านั้นที่ถือใบอนุญาตประเภทที่รับสัตว์ป่วยค้างคืนได้ ที่เหลือเป็นแบบตรวจรักษาไป-กลับ
          เวลาเจอคำว่า “โรงพยาบาลสัตว์” บนป้าย จึงยังไม่ได้แปลว่าแอดมิทได้เสมอไป
        </p>
      </section>

      <section className="bg-white border rounded-xl p-4 mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-3">10 จังหวัดที่มีสถานพยาบาลสัตว์มากที่สุด</h2>
        <ol className="space-y-1.5">
          {provinces.slice(0, 10).map(([name, n], i) => (
            <li key={name} className="flex items-baseline gap-2 text-sm">
              <span className="text-xs font-bold text-emerald-600 w-5 flex-shrink-0">{i + 1}.</span>
              <span className="text-gray-700">{name}</span>
              <span className="text-gray-400 text-xs">{n.toLocaleString()} แห่ง</span>
            </li>
          ))}
        </ol>
      </section>

      <a
        href="/hospital/license"
        className="flex items-center justify-between gap-3 mb-6 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 hover:border-emerald-400 transition-colors"
      >
        <span>
          <span className="block text-sm font-bold text-emerald-900">🔎 ค้นชื่อคลินิกในทะเบียน</span>
          <span className="block text-xs text-emerald-800">
            ค้นได้ทั้ง {records.length.toLocaleString()} แห่ง · จับคู่กับหน้าคลินิกบนเว็บนี้แล้ว {matched.toLocaleString()} แห่ง
          </span>
        </span>
        <span className="text-emerald-700 font-bold">→</span>
      </a>

      <section className="bg-white border rounded-xl p-4 mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-3">คำถามที่พบบ่อย</h2>
        <div className="space-y-3 divide-y divide-gray-100">
          {FAQS.map((f, i) => (
            <div key={i} className={i > 0 ? 'pt-3' : ''}>
              <h3 className="font-semibold text-sm text-gray-800 mb-1">{f.q}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs text-gray-400 leading-relaxed mb-8">
        แหล่งอ้างอิง:{' '}
        <a href={ACT_SUMMARY} target="_blank" rel="noopener noreferrer" className="underline">
          สรุปสาระสำคัญ พ.ร.บ.สถานพยาบาลสัตว์ พ.ศ. 2533
        </a>{' '}
        (กลุ่มกฎหมาย กรมปศุสัตว์) ·{' '}
        <a href={LICENSE_SOURCE.url} target="_blank" rel="noopener noreferrer" className="underline">
          รายชื่อสถานพยาบาลสัตว์ทั่วประเทศ
        </a>{' '}
        ({LICENSE_SOURCE.publisher}) · ตรวจสอบเนื้อหาเมื่อ {CHECKED}
        {' · '}หน้านี้อธิบายข้อกฎหมายโดยย่อเพื่อให้เจ้าของสัตว์ใช้ตรวจสอบเบื้องต้น ไม่ใช่คำปรึกษาทางกฎหมาย
      </p>
    </main>
  )
}
