import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'พืชพิษสำหรับสัตว์เลี้ยง — ไม้ประดับที่อันตรายกับสุนัขและแมว',
  description: 'รายชื่อพืชและไม้ประดับที่เป็นพิษต่อสุนัขและแมว พืชที่พบบ่อยในบ้านไทย อาการพิษและวิธีปฐมพยาบาลเบื้องต้น',
  alternates: { canonical: 'https://www.thailandpethub.com/poison-plants' },
  keywords: ['พืชพิษสุนัข', 'ไม้ประดับพิษแมว', 'พืชอันตรายสัตว์เลี้ยง', 'ต้นไม้ห้ามสัตว์เลี้ยงกิน'],
  openGraph: {
    title: 'พืชพิษสำหรับสัตว์เลี้ยง — ไม้ประดับอันตรายที่พบบ่อยในบ้านไทย',
    description: 'รายชื่อพืชพิษและวิธีรับมือถ้าสัตว์เลี้ยงกิน',
    url: 'https://www.thailandpethub.com/poison-plants',
  },
}

function PlantSchemaLd() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'ถ้าสัตว์เลี้ยงกินพืชพิษควรทำอะไร?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'โทรหาสัตวแพทย์ทันที แจ้งชื่อพืช (หรือถ่ายรูปนำไปด้วย) ปริมาณที่กิน และอาการที่เห็น ห้ามชักอาเจียนเองโดยไม่ได้รับคำแนะนำจากสัตวแพทย์ เพราะพืชบางชนิดอาจทำอันตรายเพิ่มตอนอาเจียน',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

const TOXIC_PLANTS = [
  { plant: 'ว่านหางจระเข้ (Aloe Vera)', toxic_to: 'สุนัข แมว', severity: 'ปานกลาง', symptom: 'ท้องเสีย อาเจียน ซึม', note: 'เจล ไม่เป็นพิษ แต่น้ำยางเหลือง (latex) ใต้ผิวเป็นพิษ' },
  { plant: 'ลิลลี่ทุกชนิด (Lilies)', toxic_to: 'แมว', severity: 'อันตรายถึงชีวิต', symptom: 'ไตวายฉุกเฉินภายใน 24-72 ชม.', note: 'แมวเสี่ยงสูงมาก แม้แค่เลียละอองดอก' },
  { plant: 'ต้นสน/ต้นคริสต์มาส (Poinsettia)', toxic_to: 'สุนัข แมว', severity: 'เบา', symptom: 'น้ำลายมาก ระคายเคืองปาก อาเจียน', note: 'พิษน้อย แต่ยังควรเฝ้าระวัง' },
  { plant: 'ต้นวิสทีเรีย / หวาย (Wisteria)', toxic_to: 'สุนัข แมว', severity: 'ปานกลาง', symptom: 'อาเจียน ท้องเสีย อ่อนแรง', note: 'เมล็ดพิษมากที่สุด' },
  { plant: 'ต้นดีฟเฟนบาเคีย (Dieffenbachia)', toxic_to: 'สุนัข แมว', severity: 'ปานกลาง-สูง', symptom: 'ปากบวม กลืนลำบาก น้ำลายมาก', note: 'พบบ่อยมากในบ้านไทย' },
  { plant: 'โพทอส / Ivy', toxic_to: 'สุนัข แมว', severity: 'ปานกลาง', symptom: 'ปากระคายเคือง อาเจียน', note: 'ไม้เลื้อยยอดนิยมที่หลายคนไม่รู้ว่าพิษ' },
  { plant: 'ต้นกระเจียว (Azalea/Rhododendron)', toxic_to: 'สุนัข แมว', severity: 'สูงมาก', symptom: 'อาเจียน ท้องเสีย หัวใจเต้นผิดปกติ โคม่า', note: 'แค่ 0.2% น้ำหนักตัวก็อันตรายถึงชีวิต' },
  { plant: 'หัวกระเทียม หัวหอม', toxic_to: 'สุนัข แมว', severity: 'สูง', symptom: 'เม็ดเลือดแดงแตก โลหิตจาง ซีด', note: 'ดิบและปรุงสุกอันตรายเท่ากัน' },
]

const SEVERITY_COLORS: Record<string, string> = {
  'เบา': 'bg-green-100 text-green-700',
  'ปานกลาง': 'bg-yellow-100 text-yellow-700',
  'ปานกลาง-สูง': 'bg-orange-100 text-orange-700',
  'สูง': 'bg-red-100 text-red-600',
  'สูงมาก': 'bg-red-200 text-red-700',
  'อันตรายถึงชีวิต': 'bg-red-500 text-white',
}

export default function PoisonPlantsPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <PlantSchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">พืชพิษ</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🌿 พืชพิษในบ้านที่อันตรายกับสัตว์เลี้ยง</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-2xl">
        ไม้ประดับหลายชนิดที่พบทั่วไปในบ้านไทยเป็นอันตรายต่อสุนัขและแมว
        โดยเฉพาะแมวที่ชอบแทะต้นไม้ การรู้จักพืชพิษช่วยป้องกันอุบัติเหตุได้
      </p>

      <div className="space-y-3 mb-8">
        {TOXIC_PLANTS.map(p => (
          <div key={p.plant} className="bg-white rounded-2xl border shadow-sm p-4">
            <div className="flex items-start justify-between mb-2">
              <h2 className="font-bold text-gray-900 text-sm">{p.plant}</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ml-2 ${SEVERITY_COLORS[p.severity]}`}>{p.severity}</span>
            </div>
            <div className="grid sm:grid-cols-3 gap-2 text-xs">
              <div><span className="font-medium text-gray-500">พิษต่อ:</span> <span className="text-gray-700">{p.toxic_to}</span></div>
              <div><span className="font-medium text-gray-500">อาการ:</span> <span className="text-red-600">{p.symptom}</span></div>
              <div className="sm:col-span-1 text-blue-500 italic">{p.note}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6">
        <h2 className="font-bold text-red-700 text-base mb-3">🚨 ถ้าสัตว์เลี้ยงกินพืชพิษ</h2>
        <ol className="space-y-2">
          {[
            'ไม่ตกใจ — รีบสังเกตอาการและปริมาณที่กิน',
            'โทรสัตวแพทย์ทันที ถ่ายรูปต้นไม้นำไปด้วย',
            'ห้ามชักอาเจียนเองโดยไม่ได้รับคำแนะนำ',
            'เก็บตัวอย่างของที่อาเจียนนำไปให้สัตวแพทย์ตรวจ',
          ].map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-red-600">
              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/toxic" className="px-4 py-2.5 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors">⚠️ อาหารต้องห้าม</a>
        <a href="/first-aid" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🩹 ปฐมพยาบาล</a>
        <a href="/hospital" className="px-4 py-2.5 bg-red-500 text-white font-semibold rounded-xl text-sm hover:bg-red-600 transition-colors">🏥 โรงพยาบาลสัตว์</a>
      </div>

      <RelatedGuides current="poison-plants" count={4} />
    </main>
  )
}
