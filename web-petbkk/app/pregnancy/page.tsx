import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'แมวและสุนัขท้อง — ดูแลระหว่างตั้งท้องและหลังคลอด',
  description: 'วิธีดูแลแมวหรือสุนัขที่ตั้งท้อง ระยะเวลาตั้งครรภ์ อาการที่ควรรู้ การเตรียมที่คลอด และการดูแลลูกแรกเกิด',
  alternates: { canonical: 'https://www.thailandpethub.com/pregnancy' },
  keywords: ['แมวท้อง', 'สุนัขท้อง', 'ดูแลแมวตั้งท้อง', 'ลูกแมวแรกเกิด', 'สัตว์เลี้ยงตั้งครรภ์'],
  openGraph: {
    title: 'แมวและสุนัขท้อง — ดูแลระหว่างตั้งท้องและหลังคลอด',
    description: 'คู่มือดูแลสัตว์เลี้ยงระหว่างตั้งท้อง ระยะเวลา อาการ และหลังคลอด',
    url: 'https://www.thailandpethub.com/pregnancy',
  },
}

function PregnancySchemaLd() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'แมวท้องกี่วันถึงคลอด?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'แมวตั้งครรภ์ประมาณ 63-65 วัน (ช่วง 58-70 วัน) สุนัขประมาณ 58-68 วัน เฉลี่ย 63 วัน',
        },
      },
      {
        '@type': 'Question',
        name: 'รู้ได้ยังไงว่าแมวหรือสุนัขท้อง?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'อาการแรกๆ: หัวนมโตขึ้น สีเข้มขึ้น ท้องเริ่มป่อง เบื่ออาหารช่วงแรก ซึมลง หาที่อบอุ่น วิธีที่ดีที่สุดคืออัลตราซาวนด์หรือตรวจเลือดที่สัตวแพทย์ ยืนยันได้จากอัลตราซาวนด์วันที่ 20-25',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

const TIMELINE = [
  { week: 'สัปดาห์ 1-2', cat: 'ผสมพันธุ์ → ไข่ปฏิสนธิ ยังไม่มีอาการ', dog: 'เหมือนกัน' },
  { week: 'สัปดาห์ 3-4', cat: 'หัวนมโต ท้องอาจเริ่มป่อง อัลตราซาวนด์เห็นตัวอ่อน', dog: 'คลื่นไส้เล็กน้อยบางตัว' },
  { week: 'สัปดาห์ 5-6', cat: 'ท้องชัดขึ้น กินมากขึ้น หัวนมขาวออกมา', dog: 'ท้องใหญ่ขึ้นเห็นชัด' },
  { week: 'สัปดาห์ 7-8', cat: 'ลูกดิ้น สัมผัสได้ เริ่มหาที่อบอุ่นเพื่อทำรัง', dog: 'หอบมากขึ้น เตรียมรัง' },
  { week: 'สัปดาห์ 9 (ก่อนคลอด)', cat: 'กระสับกระส่าย ร้องมากขึ้น น้ำนมไหล อุณหภูมิร่างกายลดลง', dog: 'เหมือนกัน' },
]

const WARNING_SIGNS = [
  'ไม่มีลูกหลังเบ่งมา 30-60 นาที',
  'น้ำเขียวออกมาก่อนลูก (ปกติเล็กน้อยได้)',
  'แม่เหนื่อยมากหรือหมดแรง',
  'ลูกคลอดออกมาไม่หายใจหลัง 15-30 วินาที',
  'ตกเลือดรุนแรงหลังคลอด',
  'แม่ไม่กินอาหารเกิน 24 ชั่วโมงหลังคลอด',
]

export default function PregnancyPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <PregnancySchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">สัตว์เลี้ยงท้อง</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🐣 แมวและสุนัขท้อง</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-2 max-w-2xl">
        การตั้งครรภ์ของสัตว์เลี้ยงเป็นช่วงที่ต้องดูแลใส่ใจเป็นพิเศษ
        ทั้งด้านโภชนาการ สุขภาพ และการเตรียมสถานที่คลอด
      </p>
      <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-2xl">
        หมายเหตุ: การทำหมันก่อนตั้งท้องช่วยลดความเสี่ยงสุขภาพและลดปัญหาประชากรสัตว์จรจัด
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 text-center">
          <p className="text-2xl mb-1">🐱</p>
          <p className="font-bold text-purple-700 text-sm">แมว</p>
          <p className="text-xl font-black text-purple-800">63-65 วัน</p>
          <p className="text-xs text-purple-500">(58-70 วัน)</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
          <p className="text-2xl mb-1">🐕</p>
          <p className="font-bold text-blue-700 text-sm">สุนัข</p>
          <p className="text-xl font-black text-blue-800">63 วัน</p>
          <p className="text-xs text-blue-500">(58-68 วัน)</p>
        </div>
      </div>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6 overflow-x-auto">
        <h2 className="font-black text-gray-900 text-lg mb-4">📅 ตารางพัฒนาการ</h2>
        <div className="space-y-3">
          {TIMELINE.map(t => (
            <div key={t.week} className="border-l-2 border-orange-200 pl-4 py-1">
              <p className="font-bold text-orange-600 text-xs uppercase tracking-wide mb-1">{t.week}</p>
              <p className="text-xs text-gray-600">{t.cat}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-base mb-4">🍖 อาหารระหว่างตั้งท้อง</h2>
        <ul className="space-y-2">
          {[
            'ช่วงแรก (4-5 สัปดาห์): ให้อาหารปกติ ไม่ต้องเพิ่ม',
            'ช่วงหลัง (6-9 สัปดาห์): เพิ่มปริมาณ 25-50% ทยอยเพิ่ม',
            'อาหารลูกสุนัข/ลูกแมว (Kitten/Puppy formula) เหมาะสำหรับแม่ท้องด้วย',
            'ห้ามให้วิตามินเสริมโดยไม่ปรึกษาสัตวแพทย์ (Ca มากเกินทำให้คลอดยาก)',
            'น้ำสะอาดตลอดเวลา',
          ].map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-orange-400 mt-0.5 flex-shrink-0 font-bold">•</span>{s}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6">
        <h2 className="font-bold text-red-700 text-base mb-3">🚨 สัญญาณฉุกเฉินขณะคลอด</h2>
        <ul className="space-y-1.5">
          {WARNING_SIGNS.map(s => (
            <li key={s} className="flex items-start gap-2 text-sm text-red-600">
              <span className="font-bold mt-0.5 flex-shrink-0">!</span>{s}
            </li>
          ))}
        </ul>
        <p className="text-xs text-red-500 mt-3 font-medium">→ โทรหาสัตวแพทย์ทันทีหากพบอาการเหล่านี้</p>
      </section>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/neutering" className="px-4 py-2.5 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors">✂️ ทำหมัน</a>
        <a href="/food/puppy" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🐶 อาหาร Puppy</a>
        <a href="/hospital" className="px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 transition-colors">🏥 สัตวแพทย์</a>
      </div>

      <RelatedGuides current="pregnancy" count={4} />
    </main>
  )
}
