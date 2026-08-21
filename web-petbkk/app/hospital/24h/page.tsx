import type { Metadata } from 'next'
import { filterHospitals, hospitalSlug, toLightHospital } from '@/lib/hospitals'
import type { Hospital } from '@/lib/types'
import HospitalCard from '@/components/HospitalCard'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'โรงพยาบาลสัตว์ 24 ชั่วโมง กรุงเทพ — รายการครบที่สุด',
  description: 'รวมโรงพยาบาลสัตว์ที่เปิด 24 ชั่วโมงในกรุงเทพและปริมณฑล พร้อมที่อยู่ เบอร์โทร คะแนน Google และเส้นทาง ค้นหาฟรี ไม่มีค่าใช้จ่าย',
  alternates: { canonical: 'https://www.thailandpethub.com/hospital/24h' },
  keywords: ['โรงพยาบาลสัตว์ 24 ชั่วโมง', 'โรงพยาบาลสัตว์ 24 ชม กรุงเทพ', 'หมอสัตว์ 24 ชั่วโมง', 'คลินิกสัตว์ 24 ชั่วโมง'],
  openGraph: {
    title: 'โรงพยาบาลสัตว์ 24 ชั่วโมง กรุงเทพ',
    description: 'รวมโรงพยาบาลสัตว์ที่เปิด 24 ชั่วโมงในกรุงเทพ พร้อมที่อยู่และเส้นทาง',
    url: 'https://www.thailandpethub.com/hospital/24h',
  },
}

const SITE = 'https://www.thailandpethub.com'

/**
 * "โรงพยาบาลสัตว์ 24 ชั่วโมง" is a list question, and an answer engine can only
 * cite a list it can read as one. The page rendered 79 cards with no ItemList
 * tying them together, and the visible breadcrumb had no BreadcrumbList behind
 * it — both are added here alongside the existing FAQ.
 */
function Hospital24hJsonLd({ hospitals }: { hospitals: Hospital[] }) {
  const count = hospitals.length
  const faq = {
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'โรงพยาบาลสัตว์ 24 ชั่วโมงในกรุงเทพมีกี่แห่ง?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `ThailandPetHub รวบรวมข้อมูลโรงพยาบาลสัตว์ที่เปิด 24 ชั่วโมงในกรุงเทพและปริมณฑลจำนวน ${count} แห่ง พร้อมที่อยู่ เบอร์โทร และคะแนน Google`,
        },
      },
      {
        '@type': 'Question',
        name: 'ต้องทำอย่างไรเมื่อสัตว์เลี้ยงเจ็บป่วยฉุกเฉินกลางดึก?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'โทรหาโรงพยาบาลสัตว์ 24 ชั่วโมงที่ใกล้ที่สุดก่อน อธิบายอาการเบื้องต้นและถามว่าควรพาไปทันทีหรือไม่ หากสัตว์เลี้ยงหายใจไม่ออก ชัก หมดสติ หรือมีเลือดออกมาก ควรไปโรงพยาบาลทันที',
        },
      },
      {
        '@type': 'Question',
        name: 'ค่าบริการโรงพยาบาลสัตว์ 24 ชั่วโมงแพงกว่าปกติไหม?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'โรงพยาบาลสัตว์ 24 ชั่วโมงส่วนใหญ่คิดค่าบริการนอกเวลา (after-hours surcharge) เพิ่มจากค่าตรวจปกติ อัตราแตกต่างกันไปในแต่ละแห่ง แนะนำให้โทรสอบถามก่อนเดินทาง',
        },
      },
    ],
  }

  const itemList = {
    '@type': 'ItemList',
    '@id': `${SITE}/hospital/24h#list`,
    name: 'โรงพยาบาลสัตว์ที่เปิด 24 ชั่วโมงในกรุงเทพ',
    numberOfItems: count,
    itemListElement: hospitals.map((h, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE}/hospital/${hospitalSlug(h)}`,
      name: h.name_th,
    })),
  }

  const breadcrumb = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'หน้าหลัก', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'โรงพยาบาลสัตว์', item: `${SITE}/hospital` },
      { '@type': 'ListItem', position: 3, name: '24 ชั่วโมง' },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': [breadcrumb, itemList, faq] }),
      }}
    />
  )
}

export default function Hospital24hPage() {
  const hospitals = filterHospitals({ is_24h: true })

  return (
    <main className="max-w-4xl mx-auto">
      <Hospital24hJsonLd hospitals={hospitals} />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <a href="/hospital" className="hover:text-orange-600">โรงพยาบาลสัตว์</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">24 ชั่วโมง</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🏥 โรงพยาบาลสัตว์ 24 ชั่วโมง กรุงเทพ</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-2 max-w-2xl">
        รวม <strong>{hospitals.length} แห่ง</strong>ที่เปิดให้บริการ 24 ชั่วโมง พร้อมที่อยู่ เบอร์โทร
        คะแนน Google และเส้นทางแบบเรียลไทม์ ค้นหาฟรี ไม่มีค่าใช้จ่าย
      </p>
      <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-2xl">
        เมื่อสัตว์เลี้ยงเจ็บป่วยกลางดึกหรือช่วงวันหยุด โรงพยาบาลสัตว์ 24 ชั่วโมงพร้อมรับฉุกเฉินตลอดเวลา
        แนะนำให้โทรแจ้งอาการล่วงหน้าระหว่างเดินทาง เพื่อให้ทีมเตรียมรับเคสไว้ก่อน
      </p>

      <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6 flex items-start gap-3">
        <span className="text-2xl">🚨</span>
        <div>
          <p className="font-bold text-red-700 text-sm mb-1">กรณีฉุกเฉินทันที</p>
          <p className="text-sm text-red-600">หายใจลำบาก · ชัก · หมดสติ · กินสารพิษ · มีเลือดออกมาก → ไปโรงพยาบาลทันที อย่ารอ</p>
          <a href="/emergency" className="mt-2 inline-block text-xs font-semibold text-red-700 underline">ดูคู่มือฉุกเฉินสัตว์เลี้ยง →</a>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {hospitals.map(h => <HospitalCard key={h.id} hospital={toLightHospital(h)} />)}
      </div>

      <section className="bg-white border rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">คำถามที่พบบ่อย</h2>
        <div className="space-y-4 divide-y divide-gray-100">
          {[
            { q: 'โรงพยาบาลสัตว์ 24 ชั่วโมงในกรุงเทพมีกี่แห่ง?', a: `ThailandPetHub รวบรวมข้อมูลโรงพยาบาลสัตว์ที่เปิด 24 ชั่วโมงในกรุงเทพและปริมณฑลจำนวน ${hospitals.length} แห่ง พร้อมที่อยู่ เบอร์โทร และคะแนน Google` },
            { q: 'ต้องทำอย่างไรเมื่อสัตว์เลี้ยงเจ็บป่วยฉุกเฉินกลางดึก?', a: 'โทรหาโรงพยาบาลสัตว์ 24 ชั่วโมงที่ใกล้ที่สุดก่อน อธิบายอาการเบื้องต้น หากสัตว์เลี้ยงหายใจไม่ออก ชัก หมดสติ หรือมีเลือดออกมาก ควรไปทันที' },
            { q: 'ค่าบริการโรงพยาบาลสัตว์ 24 ชั่วโมงแพงกว่าปกติไหม?', a: 'มักมีค่าบริการนอกเวลา (after-hours surcharge) เพิ่มจากค่าตรวจปกติ อัตราแตกต่างกันไปในแต่ละแห่ง แนะนำให้โทรสอบถามก่อนเดินทาง' },
          ].map((item, i) => (
            <div key={i} className={i > 0 ? 'pt-4' : ''}>
              <h3 className="font-semibold text-gray-800 mb-1">{item.q}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex gap-3">
        <a href="/hospital" className="px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 transition-colors">
          ← ดูโรงพยาบาลทั้งหมด
        </a>
        <a href="/hospital/emergency" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">
          🚨 โรงพยาบาลฉุกเฉิน →
        </a>
      </div>

      <RelatedGuides current="hospital" count={4} />
    </main>
  )
}
