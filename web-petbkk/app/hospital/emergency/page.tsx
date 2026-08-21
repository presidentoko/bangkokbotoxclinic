import type { Metadata } from 'next'
import { filterHospitals, toLightHospital } from '@/lib/hospitals'
import HospitalCard from '@/components/HospitalCard'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'โรงพยาบาลสัตว์ฉุกเฉิน 24 ชั่วโมง — อาการแบบไหนต้องไปทันที',
  description: 'สัตว์เลี้ยงอาการแบบไหนถือว่าฉุกเฉิน ต้องทำอย่างไรระหว่างเดินทาง พร้อมรายชื่อโรงพยาบาลสัตว์ที่เปิด 24 ชั่วโมงในกรุงเทพ เบอร์โทรและเส้นทาง ฟรี 100%',
  alternates: { canonical: 'https://www.thailandpethub.com/hospital/emergency' },
  keywords: ['โรงพยาบาลสัตว์ฉุกเฉิน', 'สัตวแพทย์ฉุกเฉิน', 'โรงพยาบาลสัตว์ 24 ชั่วโมง', 'สัตว์เลี้ยงเจ็บป่วยฉุกเฉิน', 'อาการฉุกเฉินสุนัขแมว'],
  openGraph: {
    title: 'โรงพยาบาลสัตว์ฉุกเฉิน 24 ชั่วโมง',
    description: 'อาการแบบไหนต้องไปทันที พร้อมรายชื่อโรงพยาบาลสัตว์เปิด 24 ชม. ในกรุงเทพ',
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
        name: 'โรงพยาบาลสัตว์ที่เปิด 24 ชั่วโมงมีกี่แห่ง?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `ThailandPetHub รวบรวมข้อมูลโรงพยาบาลสัตว์ที่เปิดตลอด 24 ชั่วโมงในกรุงเทพและปริมณฑลจำนวน ${count} แห่ง ซึ่งเป็นตัวเลือกแรกเมื่อเกิดเหตุฉุกเฉินนอกเวลาทำการ`,
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

// No source we scrape publishes a reliable "accepts emergencies" flag, so
// `has_emergency` is false for every record — filtering on it rendered an empty
// page (and a FAQ schema advertising "0 แห่ง"). 24-hour operation is the honest,
// verifiable proxy, so that is what we list, and the copy says so. Only the
// best-rated dozen appear here; /hospital/24h remains the full list.
const SHOWN = 12

export default function HospitalEmergencyPage() {
  const open24h = filterHospitals({ is_24h: true })
  const hospitals = [...open24h]
    .sort((a, b) => (b.google_rating ?? 0) - (a.google_rating ?? 0))
    .slice(0, SHOWN)

  return (
    <main className="max-w-4xl mx-auto">
      <FaqJsonLd count={open24h.length} />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <a href="/hospital" className="hover:text-orange-600">โรงพยาบาลสัตว์</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">ฉุกเฉิน</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🚨 โรงพยาบาลสัตว์ฉุกเฉิน — เปิด 24 ชั่วโมง</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-2 max-w-2xl">
        เมื่อน้องมีอาการวิกฤต สิ่งสำคัญคือหาที่ที่ <strong>เปิดอยู่ตอนนี้</strong> —
        เรารวบรวมโรงพยาบาลสัตว์ที่เปิดตลอด 24 ชั่วโมง <strong>{open24h.length} แห่งในกรุงเทพ</strong>
        พร้อมที่อยู่ เบอร์โทร คะแนน Google และเส้นทาง
      </p>
      <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-2xl">
        ด้านล่างคือ {hospitals.length} แห่งที่คะแนนรีวิวสูงสุด — โรงพยาบาลที่เปิด 24 ชั่วโมง
        มักมีสัตวแพทย์เวรพร้อมรับเคสนอกเวลา แต่ควรโทรยืนยันก่อนเดินทางเสมอ
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
        {hospitals.map(h => <HospitalCard key={h.id} hospital={toLightHospital(h)} />)}
      </div>

      <a
        href="/hospital/24h"
        className="inline-block mb-10 text-sm font-semibold text-blue-600 hover:text-blue-700 underline"
      >
        ดูโรงพยาบาลที่เปิด 24 ชั่วโมงทั้งหมด {open24h.length} แห่ง →
      </a>

      <section className="bg-white border rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">คำถามที่พบบ่อย</h2>
        <div className="space-y-4 divide-y divide-gray-100">
          {[
            { q: 'สัตว์เลี้ยงอาการแบบไหนถือว่าฉุกเฉิน?', a: 'อาการฉุกเฉิน ได้แก่ หายใจลำบาก ชักหรือหมดสติ อาเจียนเป็นเลือดหรือถ่ายเป็นเลือด ท้องโป่งผิดปกติ กินสารพิษ กระดูกหัก หรือถูกรถชน' },
            { q: 'ระหว่างรอไปโรงพยาบาลสัตว์ฉุกเฉินควรทำอย่างไร?', a: 'โทรแจ้งโรงพยาบาลล่วงหน้า วางสัตว์เลี้ยงในที่อบอุ่น ห้ามให้น้ำหรืออาหาร ขับรถไปทันที อย่าเสียเวลาโทรสอบถามหลายที่' },
            { q: 'โรงพยาบาลสัตว์ที่เปิด 24 ชั่วโมงมีกี่แห่ง?', a: `ThailandPetHub รวบรวมข้อมูลโรงพยาบาลสัตว์ที่เปิดตลอด 24 ชั่วโมงในกรุงเทพและปริมณฑลจำนวน ${open24h.length} แห่ง ซึ่งเป็นตัวเลือกแรกเมื่อเกิดเหตุฉุกเฉินนอกเวลาทำการ` },
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

      <RelatedGuides current="hospital" count={4} />
    </main>
  )
}
