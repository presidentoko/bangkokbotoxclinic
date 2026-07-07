import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'โรคไตในแมวและสุนัข (CKD) — อาการ อาหาร และการดูแล',
  description: 'โรคไตเรื้อรัง (CKD) ในแมวและสุนัข อาการที่ต้องระวัง อาหารที่เหมาะสม การดูแลที่บ้าน และสัญญาณที่ต้องพาไปสัตวแพทย์',
  alternates: { canonical: 'https://www.thailandpethub.com/kidney-disease' },
  keywords: ['โรคไตแมว', 'โรคไตสุนัข', 'CKD แมว', 'ไตวายแมว', 'อาหารแมวโรคไต'],
  openGraph: {
    title: 'โรคไตในแมวและสุนัข (CKD) — อาการ อาหาร และการดูแล',
    description: 'คู่มือโรคไตเรื้อรังในสัตว์เลี้ยง อาการ อาหาร และการดูแลที่บ้าน',
    url: 'https://www.thailandpethub.com/kidney-disease',
  },
}

function KidneySchemaLd() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'แมวโรคไตกินอาหารอะไรได้?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'อาหารโรคไตควรมีโปรตีนต่ำ (แต่คุณภาพสูง) ฟอสฟอรัสต่ำ โซเดียมต่ำ และน้ำสูง อาหารเปียก (wet food) ดีกว่าอาหารแห้ง เพราะช่วยให้สัตว์เลี้ยงได้รับน้ำมากขึ้น ควรปรึกษาสัตวแพทย์ก่อนเปลี่ยนอาหาร',
        },
      },
      {
        '@type': 'Question',
        name: 'อาการโรคไตในแมวมีอะไรบ้าง?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'อาการหลักคือ กินน้ำมาก ปัสสาวะบ่อย น้ำหนักลด เบื่ออาหาร อาเจียน อ่อนแรง ขนทึบมัน และหายใจมีกลิ่น CKD มักไม่แสดงอาการชัดเจนในระยะแรก การตรวจเลือดประจำปีสำคัญมาก',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

const STAGES = [
  { stage: 'ระยะ 1', creatinine: '< 1.6 mg/dL', sdma: '< 18 µg/dL', note: 'ไตทำงานได้ > 33% ยังไม่มีอาการชัดเจน', color: 'bg-green-100 text-green-700' },
  { stage: 'ระยะ 2', creatinine: '1.6–2.8 mg/dL', sdma: '18–35 µg/dL', note: 'ไตทำงาน 25-33% อาจเริ่มกินน้ำมากขึ้น', color: 'bg-yellow-100 text-yellow-700' },
  { stage: 'ระยะ 3', creatinine: '2.9–5.0 mg/dL', sdma: '36–54 µg/dL', note: 'ไตทำงาน 10-25% น้ำหนักลด อาเจียน', color: 'bg-orange-100 text-orange-700' },
  { stage: 'ระยะ 4', creatinine: '> 5.0 mg/dL', sdma: '> 54 µg/dL', note: 'ไตทำงาน < 10% อาการรุนแรง', color: 'bg-red-100 text-red-700' },
]

const SYMPTOMS = [
  'ดื่มน้ำมากกว่าปกติ ปัสสาวะบ่อย',
  'น้ำหนักลดไม่ทราบสาเหตุ กล้ามเนื้อลีบ',
  'เบื่ออาหาร หรืออาเจียนหลังกิน',
  'อ่อนแรง ไม่กระฉับกระเฉง',
  'หายใจมีกลิ่น (กลิ่นแอมโมเนีย)',
  'ขนร่วง ขนหยาบ ทึบมัน',
  'ปากแผลหรือเหงือกซีดขาว',
]

const DIET_TIPS = [
  { tip: 'อาหารเปียก (wet food) ดีกว่าอาหารแห้ง', reason: 'เพิ่มปริมาณน้ำ ช่วยไตกรอง' },
  { tip: 'ฟอสฟอรัสต่ำ — ≤ 0.5% DM (แมว)', reason: 'ฟอสฟอรัสสูงทำให้ CKD แย่ลงเร็ว' },
  { tip: 'โปรตีนปรับตาม stage ตามคำแนะนำสัตวแพทย์', reason: 'โปรตีนต่ำเกินอาจทำให้กล้ามเนื้อลีบ' },
  { tip: 'น้ำให้ไม่อั้น เพิ่มแหล่งน้ำหลายจุด', reason: 'สัตว์ป่วยโรคไตต้องขับของเสียมาก' },
]

export default function KidneyDiseasePage() {
  return (
    <main className="max-w-3xl mx-auto">
      <KidneySchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">โรคไต CKD</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🫘 โรคไตในแมวและสุนัข (CKD)</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-2 max-w-2xl">
        โรคไตเรื้อรัง (Chronic Kidney Disease — CKD) เป็นโรคที่พบบ่อยในแมวมากกว่าสุนัข
        โดยเฉพาะแมวอายุมากกว่า 7 ปี ไม่สามารถรักษาให้หายขาดได้
        แต่การจัดการที่ดีช่วยให้น้องมีคุณภาพชีวิตที่ดีและอยู่ได้นานขึ้น
      </p>
      <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-2xl">
        แมวอายุมากกว่า 7 ปี ควรตรวจเลือดประจำปี — CKD ระยะแรกไม่มีอาการชัดเจน
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
        <p className="font-bold text-blue-700 text-sm mb-1">📊 ระดับ CKD (IRIS Staging)</p>
        <p className="text-xs text-blue-500">แพทย์จะใช้ค่า Creatinine และ SDMA ในเลือดเพื่อจัดระยะ</p>
      </div>

      <section className="bg-white rounded-2xl border shadow-sm p-5 mb-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-xs text-gray-500">
              <th className="text-left py-2 pr-3 font-medium">ระยะ</th>
              <th className="text-left py-2 pr-3 font-medium">Creatinine (แมว)</th>
              <th className="text-left py-2 px-2 font-medium">อาการ</th>
            </tr>
          </thead>
          <tbody>
            {STAGES.map(s => (
              <tr key={s.stage} className="border-b border-gray-50 last:border-0">
                <td className="py-2.5 pr-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${s.color}`}>{s.stage}</span>
                </td>
                <td className="py-2.5 pr-3 text-xs font-mono text-gray-600">{s.creatinine}</td>
                <td className="py-2.5 text-xs text-gray-500">{s.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">🔍 อาการที่ต้องระวัง</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SYMPTOMS.map(s => (
            <div key={s} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-orange-400 mt-0.5 flex-shrink-0 font-bold">•</span>{s}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">🍽️ การจัดการอาหาร</h2>
        <div className="space-y-3">
          {DIET_TIPS.map(d => (
            <div key={d.tip} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
              <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">✓</span>
              <div>
                <p className="font-semibold text-sm text-gray-800">{d.tip}</p>
                <p className="text-xs text-gray-400 mt-0.5">{d.reason}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-red-50 rounded-xl p-3 mt-4">
          <p className="text-xs font-semibold text-red-600 mb-1">❌ สิ่งที่ควรหลีกเลี่ยง</p>
          <p className="text-xs text-red-500">อาหารที่มีฟอสฟอรัสสูง เช่น ปลาทูน่ากระป๋อง ตับ กระดูกป่น ขนมแมวอัดเม็ด และอาหารเค็ม</p>
        </div>
      </section>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/food" className="px-4 py-2.5 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors">🍖 ตรวจสอบส่วนผสมอาหาร</a>
        <a href="/hospital" className="px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 transition-colors">🏥 หาสัตวแพทย์</a>
        <a href="/allergy" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🤧 อาหารแพ้</a>
      </div>

      <RelatedGuides current="kidney-disease" count={4} />
    </main>
  )
}
