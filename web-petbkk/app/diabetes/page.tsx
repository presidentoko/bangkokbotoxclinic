import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'โรคเบาหวานในสุนัขและแมว — อาการ อาหาร และการรักษา',
  description: 'โรคเบาหวาน (Diabetes Mellitus) ในสุนัขและแมว อาการเตือน การรักษาด้วยอินซูลิน อาหารที่เหมาะสม และการดูแลที่บ้าน',
  alternates: { canonical: 'https://www.thailandpethub.com/diabetes' },
  keywords: ['โรคเบาหวานสุนัข', 'โรคเบาหวานแมว', 'เบาหวาน diabetes สัตว์เลี้ยง', 'อินซูลินสุนัข', 'แมวเบาหวาน'],
  openGraph: {
    title: 'โรคเบาหวานในสุนัขและแมว — อาการ อาหาร และการรักษา',
    description: 'คู่มือโรคเบาหวานสัตว์เลี้ยง อาการ การรักษา และการดูแลที่บ้าน',
    url: 'https://www.thailandpethub.com/diabetes',
  },
}

function DiabetesSchemaLd() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'แมวเบาหวานรักษาให้หายขาดได้ไหม?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'แมวบางตัว (ประมาณ 20-30%) สามารถหยุดอินซูลินได้ถ้าควบคุมน้ำหนักและอาหารได้ดีตั้งแต่แรก สุนัขส่วนใหญ่ต้องฉีดอินซูลินตลอดชีวิต การตรวจน้ำตาลในเลือดสม่ำเสมอสำคัญมาก',
        },
      },
      {
        '@type': 'Question',
        name: 'อาหารแมวเบาหวานควรกินอะไร?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'แมวเบาหวานควรกินอาหารที่มีโปรตีนสูง คาร์โบไฮเดรตต่ำ (ต่ำกว่า 10% DM) อาหารเปียก (wet food) ดีกว่าอาหารแห้งที่มีแป้งสูง หลีกเลี่ยงขนมหวาน ปรึกษาสัตวแพทย์เพื่อเลือกอาหารที่เหมาะสม',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

const SYMPTOMS = [
  { s: 'กินน้ำมาก ปัสสาวะบ่อย', detail: 'Classic "PU/PD" (polyuria/polydipsia)' },
  { s: 'กินเก่งแต่น้ำหนักลด', detail: 'ร่างกายไม่สามารถใช้กลูโคสได้' },
  { s: 'เหนื่อยง่าย อ่อนแรง', detail: 'โดยเฉพาะขาหลัง (แมว: plantigrade stance)' },
  { s: 'ขนหมอง ไม่มันเงา', detail: 'สัญญาณโรคเรื้อรัง' },
  { s: 'ต้อกระจก (สุนัข)', detail: '75% ของสุนัขเบาหวานมีต้อกระจกภายใน 1 ปี' },
  { s: 'อาเจียน เบื่ออาหาร', detail: 'ระยะที่เริ่มรุนแรง (DKA)' },
]

const RISK_FACTORS = [
  { animal: 'สุนัข', risk: 'พันธุ์เสี่ยง: Beagle, Keeshond / เพศหญิงไม่ทำหมัน / อ้วน / Cushing\'s disease' },
  { animal: 'แมว', risk: 'เพศผู้ / อ้วน / อาหารแห้งคาร์โบไฮเดรตสูง / สเตียรอยด์ระยะยาว' },
]

export default function DiabetesPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <DiabetesSchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">โรคเบาหวาน</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🩺 โรคเบาหวานในสัตว์เลี้ยง</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-2 max-w-2xl">
        โรคเบาหวาน (Diabetes Mellitus) เกิดจากการขาดอินซูลินหรือร่างกายดื้อต่ออินซูลิน
        พบบ่อยในสุนัขและแมวสูงอายุ โดยเฉพาะตัวที่มีน้ำหนักเกิน
      </p>
      <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-2xl">
        โรคนี้รักษาได้ แต่ต้องดูแลอย่างต่อเนื่อง สัตว์เลี้ยงที่เบาหวานควบคุมได้ดีมีคุณภาพชีวิตที่ดี
      </p>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">🔍 อาการที่ต้องสังเกต</h2>
        <div className="space-y-2">
          {SYMPTOMS.map(s => (
            <div key={s.s} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
              <span className="text-orange-400 font-bold mt-0.5 flex-shrink-0">•</span>
              <div>
                <p className="font-semibold text-sm text-gray-800">{s.s}</p>
                <p className="text-xs text-gray-400">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-base mb-4">⚠️ ปัจจัยเสี่ยง</h2>
        <div className="space-y-3">
          {RISK_FACTORS.map(r => (
            <div key={r.animal} className="border border-gray-100 rounded-xl p-3">
              <p className="font-bold text-sm text-gray-700 mb-1">{r.animal}</p>
              <p className="text-xs text-gray-500">{r.risk}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-base mb-4">🍽️ อาหารสำหรับสัตว์เลี้ยงเบาหวาน</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold text-sm text-gray-700 mb-2">🐱 แมว</p>
            <ul className="space-y-1.5 text-xs text-gray-600">
              <li className="flex gap-2"><span className="text-green-500">✓</span>โปรตีนสูง (&gt;45% DM)</li>
              <li className="flex gap-2"><span className="text-green-500">✓</span>คาร์โบไฮเดรตต่ำ (&lt;10% DM)</li>
              <li className="flex gap-2"><span className="text-green-500">✓</span>อาหารเปียก (wet food)</li>
              <li className="flex gap-2"><span className="text-red-400">✗</span>อาหารแห้ง (แป้งสูง)</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-700 mb-2">🐕 สุนัข</p>
            <ul className="space-y-1.5 text-xs text-gray-600">
              <li className="flex gap-2"><span className="text-green-500">✓</span>ไฟเบอร์สูง (ย่อยช้า)</li>
              <li className="flex gap-2"><span className="text-green-500">✓</span>คาร์โบไฮเดรต Complex</li>
              <li className="flex gap-2"><span className="text-green-500">✓</span>กินเป็นเวลา (ก่อนฉีดอินซูลิน)</li>
              <li className="flex gap-2"><span className="text-red-400">✗</span>น้ำตาล ขนมหวาน</li>
            </ul>
          </div>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 mt-4">
          <p className="text-xs font-semibold text-blue-700">💡 เวลาฉีดอินซูลิน</p>
          <p className="text-xs text-blue-600 mt-0.5">ฉีดทันทีหลังหรือระหว่างกินอาหาร ถ้ากินน้อยกว่าปกติ ปรึกษาสัตวแพทย์ก่อนฉีดขนาดเต็ม</p>
        </div>
      </section>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/food" className="px-4 py-2.5 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors">🍖 ตรวจสอบส่วนผสมอาหาร</a>
        <a href="/weight" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">⚖️ ประเมินน้ำหนัก</a>
        <a href="/hospital" className="px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 transition-colors">🏥 หาสัตวแพทย์</a>
      </div>

      <RelatedGuides current="diabetes" count={4} />
    </main>
  )
}
