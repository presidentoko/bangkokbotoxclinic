import type { Metadata } from 'next'
import { filterHospitals } from '@/lib/hospitals'
import HospitalCard from '@/components/HospitalCard'

export const metadata: Metadata = {
  title: 'โรงพยาบาลสัตว์ฉุกเฉิน กรุงเทพ — พร้อมรับเคสฉุกเฉิน | ThailandPetHub',
  description: 'รวมโรงพยาบาลสัตว์ฉุกเฉินในกรุงเทพ พร้อมที่อยู่ เบอร์โทร และคะแนน Google เมื่อน้องเจ็บป่วยฉุกเฉิน ค้นหาได้เลย ฟรี 100%',
  alternates: { canonical: 'https://www.thailandpethub.com/hospital/emergency' },
  keywords: ['โรงพยาบาลสัตว์ฉุกเฉิน', 'คลินิกสัตว์ฉุกเฉิน กรุงเทพ', 'สัตวแพทย์ฉุกเฉิน', 'สัตว์เลี้ยงเจ็บป่วยฉุกเฉิน'],
  openGraph: {
    title: 'โรงพยาบาลสัตว์ฉุกเฉิน กรุงเทพ',
    description: 'รวมโรงพยาบาลสัตว์ฉุกเฉินในกรุงเทพ พร้อมที่อยู่และเบอร์โทร',
    url: 'https://www.thailandpethub.com/hospital/emergency',
  },
}

function FaqJsonLd({ count }: { count: number }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'สัตว์เลี้ยงอาการแบบไหนถือว่าฉุกเฉิน?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'อาการที่ต้องพาไปโรงพยาบาลสัตว์ทันที ได้แก่ หายใจลำบากหรือหายใจไม่ออก ชักหรือหมดสติ อาเจียนเป็นเลือดหรือถ่ายเป็นเลือด ท้องโป่งผิดปกติ กินสารพิษหรือยาเกินขนาด กระดูกหัก หรือถูกรถชน',
        },
      },
      {
        '@type': 'Question',
        name: 'ระหว่างรอไปโรงพยาบาลสัตว์ฉุกเฉินควรทำอย่างไร?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'โทรแจ้งโรงพยาบาลล่วงหน้าก่อนเดินทาง วางสัตว์เลี้ยงในกล่องหรือผ้าห่มที่อบอุ่น ห้ามให้น้ำหรืออาหาร ห้ามกดบาดแผลหากมีกระดูกหัก ขับรถไปโดยตรง อย่าเสียเวลาโทรสอบถามหลายที่',
        },
      },
      {
        '@type': 'Question',
        name: 'โรงพยาบาลสัตว์ฉุกเฉินในกรุงเทพมีกี่แห่ง?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `ThailandPetHub รวบรวมข้อมูลโรงพยาบาลสัตว์ที่รับเคสฉุกเฉินในกรุงเทพและปริมณฑลจำนวน ${count} แห่ง`,
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export default function HospitalEmergencyPage() {
  const hospitals = filterHospitals({ has_emergency: true })

  return (
    <main className="max-w-4xl mx-auto">
      <FaqJsonLd count={hospitals.length} />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <a href="/hospital" className="hover:text-orange-600">โรงพยาบาลสัตว์</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">ฉุกเฉิน</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🚨 โรงพยาบาลสัตว์ฉุกเฉิน กรุงเทพ</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-2 max-w-2xl">
        รวม <strong>{hospitals.length} แห่ง</strong>ที่รับเคสฉุกเฉิน พร้อมที่อยู่ เบอร์โทร
        คะแนน Google และเส้นทาง
      </p>
      <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-2xl">
        โรงพยาบาลสัตว์ฉุกเฉินพร้อมรับผ่าตัดฉุกเฉิน ให้ยาพิษ รักษาอาการวิกฤต
        หลายแห่งมีทีมสัตวแพทย์ตลอด 24 ชั่วโมง
      </p>

      <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6">
        <p className="font-bold text-red-700 text-sm mb-2">⚠️ อาการที่ต้องไปทันที</p>
        <ul className="text-sm text-red-600 space-y-1 list-none">
          <li>• หายใจลำบาก / หายใจไม่ออก</li>
          <li>• ชัก / หมดสติ / ไม่ตอบสนอง</li>
          <li>• กินสารพิษ / ยาเกินขนาด</li>
          <li>• อาเจียนหรือถ่ายเป็นเลือด</li>
          <li>• ท้องโป่งผิดปกติ / กระดูกหัก</li>
        </ul>
        <a href="/emergency" className="mt-3 inline-block text-xs font-semibold text-red-700 underline">ดูคู่มือฉุกเฉินสัตว์เลี้ยงฉบับเต็ม →</a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {hospitals.map(h => <HospitalCard key={h.id} hospital={h} />)}
      </div>

      <section className="bg-white border rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">คำถามที่พบบ่อย</h2>
        <div className="space-y-4 divide-y divide-gray-100">
          {[
            { q: 'สัตว์เลี้ยงอาการแบบไหนถือว่าฉุกเฉิน?', a: 'อาการฉุกเฉิน ได้แก่ หายใจลำบาก ชักหรือหมดสติ อาเจียนเป็นเลือดหรือถ่ายเป็นเลือด ท้องโป่งผิดปกติ กินสารพิษ กระดูกหัก หรือถูกรถชน' },
            { q: 'ระหว่างรอไปโรงพยาบาลสัตว์ฉุกเฉินควรทำอย่างไร?', a: 'โทรแจ้งโรงพยาบาลล่วงหน้า วางสัตว์เลี้ยงในที่อบอุ่น ห้ามให้น้ำหรืออาหาร ขับรถไปทันที อย่าเสียเวลาโทรสอบถามหลายที่' },
            { q: 'โรงพยาบาลสัตว์ฉุกเฉินในกรุงเทพมีกี่แห่ง?', a: `ThailandPetHub รวบรวมข้อมูลโรงพยาบาลสัตว์ที่รับเคสฉุกเฉินในกรุงเทพและปริมณฑลจำนวน ${hospitals.length} แห่ง` },
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
        <a href="/hospital/24h" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">
          ⏰ โรงพยาบาล 24 ชั่วโมง →
        </a>
      </div>
    </main>
  )
}
