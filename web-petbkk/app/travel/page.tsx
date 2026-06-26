import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'เดินทางกับสัตว์เลี้ยง — ขึ้นเครื่อง รถไฟ และข้ามประเทศ | ThailandPetHub',
  description: 'วิธีเดินทางกับสุนัขและแมวในไทย นำขึ้นเครื่องบิน รถไฟ และเดินทางระหว่างประเทศ เอกสารที่ต้องใช้ และการเตรียมสัตว์เลี้ยงก่อนเดินทาง',
  alternates: { canonical: 'https://www.thailandpethub.com/travel' },
  keywords: ['เดินทางกับสุนัข', 'นำแมวขึ้นเครื่อง', 'เดินทางสัตว์เลี้ยง', 'สายการบินรับสัตว์เลี้ยง', 'ส่งออกสัตว์เลี้ยง'],
  openGraph: {
    title: 'เดินทางกับสัตว์เลี้ยง — ขึ้นเครื่อง รถไฟ และข้ามประเทศ',
    description: 'วิธีเดินทางกับสุนัขและแมว เอกสาร และการเตรียมก่อนเดินทาง',
    url: 'https://www.thailandpethub.com/travel',
  },
}

function TravelSchemaLd() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'สายการบินไทยที่รับสัตว์เลี้ยงขึ้นเครื่องมีไหน?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Thai Airways อนุญาตสัตว์เลี้ยงในห้องโดยสาร (ขนาดเล็ก) และใต้เครื่อง (สัตว์ใหญ่) Bangkok Airways มีนโยบายรับสัตว์เลี้ยงเช่นกัน สายการบินต่างประเทศขึ้นอยู่กับนโยบายของแต่ละสาย ควรตรวจสอบก่อนจอง',
        },
      },
      {
        '@type': 'Question',
        name: 'เอกสารอะไรบ้างที่ต้องใช้เดินทางระหว่างประเทศกับสัตว์เลี้ยง?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'เอกสารหลักที่ต้องมี: ใบรับรองสุขภาพจากสัตวแพทย์ (ไม่เกิน 10 วันก่อนเดินทาง), ประวัติการฉีดวัคซีน (พิษสุนัขบ้า), ไมโครชิป (ISO 11784/5), และอาจต้องมี import permit ของประเทศปลายทาง',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

const AIRLINE_POLICIES = [
  { airline: 'Thai Airways (TG)', cabin: 'ได้ (≤7 กก.)', cargo: 'ได้', note: 'กรง + สัตว์ รวมกัน ≤8 กก. ในห้องโดยสาร' },
  { airline: 'Bangkok Airways (PG)', cabin: 'ได้ (≤7 กก.)', cargo: 'ได้', note: 'ต้องจองล่วงหน้า' },
  { airline: 'Thai Lion Air (SL)', cabin: 'ไม่ได้', cargo: 'ได้', note: 'เฉพาะสัตว์เลี้ยงใน cargo hold' },
  { airline: 'AirAsia (FD)', cabin: 'ไม่ได้', cargo: 'ไม่ได้', note: 'ไม่รับสัตว์เลี้ยงโดยตรง' },
]

const DOCUMENTS_DOMESTIC = [
  'ประวัติการฉีดวัคซีน พิษสุนัขบ้า (ไม่เกิน 1 ปี)',
  'ใบรับรองสุขภาพจากสัตวแพทย์ (ออกไม่เกิน 7-10 วันก่อนเดินทาง)',
  'ปลอกคอและสายจูง (สุนัข)',
]

const DOCUMENTS_INTERNATIONAL = [
  'ไมโครชิป ISO 11784/5 (ต้องฝังก่อนเดินทาง)',
  'ใบรับรองสุขภาพจากสัตวแพทย์ (ออกไม่เกิน 10 วัน)',
  'ประวัติวัคซีนพิษสุนัขบ้า (หลายประเทศต้องการ titer test ด้วย)',
  'Import permit จากประเทศปลายทาง (บางประเทศ)',
  'กรณีออสเตรเลีย/ญี่ปุ่น/สิงคโปร์: อาจต้องกักกัน 10-30 วัน',
]

export default function TravelPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <TravelSchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">เดินทางกับสัตว์เลี้ยง</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">✈️ เดินทางกับสัตว์เลี้ยง</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-2xl">
        การเดินทางกับสัตว์เลี้ยงต้องวางแผนล่วงหน้า ทั้งเรื่องเอกสาร สุขภาพ
        และนโยบายของสายการบินหรือพาหนะที่ใช้
      </p>

      {/* Airline table */}
      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">✈️ สายการบินในไทยและนโยบายสัตว์เลี้ยง</h2>
        <p className="text-xs text-gray-400 mb-4">*นโยบายอาจเปลี่ยนแปลง ตรวจสอบกับสายการบินก่อนจองเสมอ</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs text-gray-500">
                <th className="text-left py-2 pr-3 font-medium">สายการบิน</th>
                <th className="text-center py-2 px-2 font-medium">ห้องโดยสาร</th>
                <th className="text-center py-2 px-2 font-medium">Cargo</th>
              </tr>
            </thead>
            <tbody>
              {AIRLINE_POLICIES.map(a => (
                <tr key={a.airline} className="border-b border-gray-50 last:border-0">
                  <td className="py-2.5 pr-3">
                    <p className="font-medium text-gray-800">{a.airline}</p>
                    <p className="text-xs text-gray-400">{a.note}</p>
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${a.cabin.includes('ได้') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{a.cabin}</span>
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${a.cargo === 'ได้' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{a.cargo}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <section className="bg-white rounded-2xl border shadow-sm p-5">
          <h2 className="font-black text-gray-900 text-base mb-3">🇹🇭 เที่ยวในไทย</h2>
          <ul className="space-y-2">
            {DOCUMENTS_DOMESTIC.map(d => (
              <li key={d} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">✓</span>{d}
              </li>
            ))}
          </ul>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-700 mb-1">รถ:</p>
            <p className="text-xs text-gray-500">ใส่กรงหรือรัดสายในรถ ป้องกันอุบัติเหตุ ไม่ควรให้โผล่หน้าออกหน้าต่าง</p>
          </div>
        </section>

        <section className="bg-white rounded-2xl border shadow-sm p-5">
          <h2 className="font-black text-gray-900 text-base mb-3">🌍 เดินทางต่างประเทศ</h2>
          <ul className="space-y-2">
            {DOCUMENTS_INTERNATIONAL.map(d => (
              <li key={d} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-blue-500 font-bold mt-0.5 flex-shrink-0">✓</span>{d}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">🛄 กรงเดินทางที่เหมาะสม (IATA standards)</h2>
        <ul className="space-y-2">
          {[
            'ขนาด: น้องต้องยืน เดินหมุน และนอนได้สบาย',
            'วัสดุ: แข็งแรง มีรูระบายอากาศทุกด้าน',
            'ประตู: ล็อคได้ดี ป้องกันหลุดระหว่างบิน',
            'ไม่ใส่สายจูงในกรงระหว่างขนส่ง เพราะอาจพันคอ',
            'ติดป้ายข้อมูลเจ้าของและสัตว์เลี้ยงที่กรงทุกครั้ง',
          ].map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-orange-500 font-bold mt-0.5 flex-shrink-0">•</span>{s}
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/microchip" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">📡 ไมโครชิป</a>
        <a href="/vaccine" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">💉 ตารางวัคซีน</a>
        <a href="/hospital" className="px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 transition-colors">🏥 ใบรับรองสุขภาพ</a>
      </div>

      <RelatedGuides current="tips" count={4} />
    </main>
  )
}
