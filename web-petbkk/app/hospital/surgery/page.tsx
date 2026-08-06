import type { Metadata } from 'next'
import { filterHospitals } from '@/lib/hospitals'
import HospitalCard from '@/components/HospitalCard'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'โรงพยาบาลสัตว์ผ่าตัด — รายการครบที่สุดทั่วไทย',
  description: 'รวมโรงพยาบาลสัตว์ที่มีห้องผ่าตัดทั่วไทย พร้อมที่อยู่ เบอร์โทร คะแนน Google รองรับผ่าตัดฉุกเฉินและนัดหมายล่วงหน้า',
  alternates: { canonical: 'https://www.thailandpethub.com/hospital/surgery' },
  // Every scraped record has has_surgery = true, so this page's list is identical
  // to /hospital's — Google was picking its own canonical between the two. Keep it
  // reachable (and crawlable, so it keeps feeding links to the 503 detail pages)
  // but out of the index until the scraper can actually distinguish surgical care.
  robots: { index: false, follow: true },
  keywords: ['โรงพยาบาลสัตว์ผ่าตัด', 'คลินิกสัตว์ผ่าตัด', 'ผ่าตัดสัตว์เลี้ยง', 'ทำหมันสัตว์', 'ผ่าตัดสุนัขแมว'],
  openGraph: {
    title: 'โรงพยาบาลสัตว์ผ่าตัด กรุงเทพ',
    description: 'รวมโรงพยาบาลสัตว์ที่มีห้องผ่าตัดในกรุงเทพ พร้อมที่อยู่และเส้นทาง',
    url: 'https://www.thailandpethub.com/hospital/surgery',
  },
}

function FaqJsonLd({ count }: { count: number }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'โรงพยาบาลสัตว์ที่มีห้องผ่าตัดในกรุงเทพมีกี่แห่ง?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `ThailandPetHub รวบรวมโรงพยาบาลสัตว์ที่มีห้องผ่าตัดในกรุงเทพและปริมณฑลจำนวน ${count} แห่ง พร้อมข้อมูลที่อยู่ เบอร์โทร และคะแนน Google`,
        },
      },
      {
        '@type': 'Question',
        name: 'การทำหมันสัตว์เลี้ยงราคาเท่าไหร่?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ราคาทำหมันสัตว์เลี้ยงขึ้นอยู่กับขนาดและเพศ โดยทั่วไปสุนัขตัวผู้ประมาณ 1,500-3,000 บาท ตัวเมีย 2,500-5,000 บาท แมวตัวผู้ 800-1,500 บาท ตัวเมีย 1,500-3,000 บาท ควรโทรสอบถามราคาก่อนนัด',
        },
      },
      {
        '@type': 'Question',
        name: 'การผ่าตัดสัตว์เลี้ยงต้องเตรียมตัวอย่างไร?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'งดอาหารและน้ำ 8-12 ชั่วโมงก่อนผ่าตัด ตรวจเลือดก่อนวางยาสลบ (บางแห่งกำหนด) นำประวัติสุขภาพและวัคซีนมาด้วย และมีผู้ดูแลรับกลับบ้านหลังผ่าตัด',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export default function HospitalSurgeryPage() {
  const hospitals = filterHospitals({ has_surgery: true })

  return (
    <main className="max-w-4xl mx-auto">
      <FaqJsonLd count={hospitals.length} />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <a href="/hospital" className="hover:text-orange-600">โรงพยาบาลสัตว์</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">ผ่าตัด</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🏥 โรงพยาบาลสัตว์ผ่าตัด ทั่วไทย</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-2 max-w-2xl">
        รวม <strong>{hospitals.length} แห่ง</strong>ที่มีห้องผ่าตัดและทีมสัตวแพทย์เชี่ยวชาญ
        รองรับทั้งการผ่าตัดฉุกเฉินและนัดหมายล่วงหน้า ทำหมัน ผ่าตัดทางเดินอาหาร กระดูก และอื่นๆ
      </p>
      <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-2xl">
        การผ่าตัดสัตว์เลี้ยงต้องการสัตวแพทย์ที่มีความเชี่ยวชาญเฉพาะทางและอุปกรณ์ครบครัน
        ควรโทรนัดหมายล่วงหน้าและซักถามเกี่ยวกับราคาและขั้นตอนก่อนเข้ารับบริการ
      </p>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 flex items-start gap-3">
        <span className="text-2xl">💡</span>
        <div>
          <p className="font-bold text-blue-700 text-sm mb-1">ก่อนผ่าตัด</p>
          <p className="text-sm text-blue-600">งดอาหารและน้ำ 8-12 ชม. · นำประวัติวัคซีนมาด้วย · มีผู้รับกลับบ้านหลังผ่าตัด</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {hospitals.map(h => <HospitalCard key={h.id} hospital={h} />)}
      </div>

      <section className="bg-white border rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">คำถามที่พบบ่อยเกี่ยวกับการผ่าตัดสัตว์เลี้ยง</h2>
        <div className="space-y-4 divide-y divide-gray-100">
          {[
            { q: 'การทำหมันสัตว์เลี้ยงราคาเท่าไหร่?', a: 'สุนัขตัวผู้ประมาณ 1,500-3,000 บาท ตัวเมีย 2,500-5,000 บาท แมวตัวผู้ 800-1,500 บาท ตัวเมีย 1,500-3,000 บาท ขึ้นอยู่กับขนาดและโรงพยาบาล' },
            { q: 'การผ่าตัดสัตว์เลี้ยงต้องเตรียมตัวอย่างไร?', a: 'งดอาหารและน้ำ 8-12 ชม. ก่อนผ่าตัด นำประวัติสุขภาพและวัคซีนมาด้วย ตรวจเลือดก่อนวางยาสลบ (บางแห่งกำหนด) และมีผู้ดูแลรับกลับบ้าน' },
            { q: 'หลังผ่าตัดสัตว์เลี้ยงต้องดูแลอย่างไร?', a: 'พักผ่อนในที่สงบ จำกัดกิจกรรม 7-14 วัน ห้ามเลียแผล (ใส่ปลอกคอ) ให้ยาตามที่สัตวแพทย์สั่ง นัดตรวจติดตามผล สังเกตสัญญาณการติดเชื้อ' },
          ].map((item, i) => (
            <div key={i} className={i > 0 ? 'pt-4' : ''}>
              <h3 className="font-semibold text-gray-800 mb-1">{item.q}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex gap-3">
        <a href="/hospital" className="px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 transition-colors">← ดูโรงพยาบาลทั้งหมด</a>
        <a href="/hospital/24h" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">⏰ 24 ชั่วโมง →</a>
        <a href="/hospital/emergency" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🚨 ฉุกเฉิน →</a>
      </div>

      <RelatedGuides current="hospital" count={4} />
    </main>
  )
}
