import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'สัตว์เลี้ยงไม่ยอมกินอาหาร — สาเหตุและวิธีแก้ | ThailandPetHub',
  description: 'สุนัขหรือแมวไม่กินอาหาร ไม่กินข้าว สาเหตุที่พบบ่อย วิธีแก้ที่บ้าน และสัญญาณที่ต้องพาสัตวแพทย์',
  alternates: { canonical: 'https://www.thailandpethub.com/not-eating' },
  keywords: ['สุนัขไม่กินอาหาร', 'แมวไม่กิน', 'สัตว์เลี้ยงเบื่ออาหาร', 'แมวไม่กินข้าว', 'สุนัขเบื่ออาหาร'],
  openGraph: {
    title: 'สัตว์เลี้ยงไม่ยอมกิน — สาเหตุและวิธีแก้',
    description: 'ทำไมน้องถึงไม่กิน และจะแก้อย่างไรให้กลับมากินได้',
    url: 'https://www.thailandpethub.com/not-eating',
  },
}

function NotEatingSchemaLd() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'แมวไม่กินอาหารกี่วันถือว่าอันตราย?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'แมวที่ไม่กินอาหาร 24-48 ชั่วโมงต้องพาสัตวแพทย์ เพราะแมวเสี่ยงโรคตับคั่งไขมัน (Hepatic Lipidosis) จากการอดอาหารมากกว่าสุนัขมาก ไม่ควรรอนานเกิน 48 ชั่วโมง',
        },
      },
      {
        '@type': 'Question',
        name: 'ทำไมสุนัขถึงไม่กินอาหาร?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'สาเหตุหลักคือ 1) อาหารเบื่อ/ไม่อร่อย 2) ความเครียด/เปลี่ยนสภาพแวดล้อม 3) ฟันเจ็บปวด 4) ป่วย มีไข้ 5) กินขนมมากเกินจนอิ่มจากขนม',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

const DOG_REASONS = [
  { reason: 'เบื่ออาหารเดิม', fix: 'เพิ่มท็อปปิ้ง เช่น ไก่ต้มหรืออาหารเปียก อย่าเปลี่ยนอาหารทั้งหมดทันที' },
  { reason: 'กินขนมมากเกินไป', fix: 'งดขนมทั้งหมด รอจนหิวพอให้กินมื้อหลัก 15-30 นาที แล้วเก็บ' },
  { reason: 'ความเครียด ย้ายบ้าน/สมาชิกใหม่', fix: 'ให้เวลาปรับตัว 3-5 วัน ให้อาหารในที่เงียบ' },
  { reason: 'ฟันเจ็บ/ปากอักเสบ', fix: 'สังเกตน้ำลาย กลิ่นปาก ถ้ามี พาหมอตรวจช่องปาก' },
  { reason: 'ไม่สบาย/มีไข้', fix: 'ดูอาการอื่น ซึม ท้องเสีย ถ้ามีอาการร่วม พาหมอ' },
]

const CAT_REASONS = [
  { reason: 'ไม่ชอบอาหารใหม่/เปลี่ยนยี่ห้อ', fix: 'ค่อยๆ ผสมอาหารใหม่เข้าของเดิม 7-10 วัน' },
  { reason: 'กระบะทรายใกล้ชามอาหาร', fix: 'แยกจุดอาหารและกระบะทรายให้ห่างกันมาก' },
  { reason: 'ชามสกปรกหรือมีกลิ่น', fix: 'ล้างชามอาหารทุกมื้อด้วยน้ำร้อน ห้ามใช้น้ำยาหอม' },
  { reason: 'เครียด/วิตกกังวล', fix: 'Feliway pheromone diffuser ช่วยได้' },
  { reason: 'ป่วย — อันตรายในแมว', fix: 'แมวไม่กิน 24 ชม. ต้องพาหมอ' },
]

export default function NotEatingPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <NotEatingSchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">สัตว์เลี้ยงไม่กิน</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🍽️ สัตว์เลี้ยงไม่ยอมกินอาหาร</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-2xl">
        สาเหตุที่น้องไม่กินอาจตั้งแต่เรื่องเล็กน้อยไปจนถึงเร่งด่วน
        สำคัญที่สุดคือรู้จักสัญญาณที่ต้องพาหมอโดยเฉพาะในแมว
      </p>

      <div className="bg-red-50 border border-red-200 rounded-2xl p-3 mb-6">
        <p className="text-xs font-bold text-red-600">⚠️ แมวที่ไม่กินอาหาร &gt; 24-48 ชั่วโมง เสี่ยงโรคตับร้ายแรง (Hepatic Lipidosis) — พาหมอทันที</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <section className="bg-white rounded-2xl border shadow-sm p-5">
          <h2 className="font-black text-gray-900 text-sm mb-3">🐕 สุนัขไม่กิน — สาเหตุและวิธีแก้</h2>
          <div className="space-y-3">
            {DOG_REASONS.map(r => (
              <div key={r.reason} className="border-b border-gray-50 pb-2 last:border-0">
                <p className="font-semibold text-xs text-gray-700">{r.reason}</p>
                <p className="text-xs text-orange-600 mt-0.5">→ {r.fix}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="bg-white rounded-2xl border shadow-sm p-5">
          <h2 className="font-black text-gray-900 text-sm mb-3">🐱 แมวไม่กิน — สาเหตุและวิธีแก้</h2>
          <div className="space-y-3">
            {CAT_REASONS.map(r => (
              <div key={r.reason} className="border-b border-gray-50 pb-2 last:border-0">
                <p className="font-semibold text-xs text-gray-700">{r.reason}</p>
                <p className="text-xs text-orange-600 mt-0.5">→ {r.fix}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="bg-white rounded-2xl border shadow-sm p-5 mb-6">
        <h2 className="font-black text-gray-900 text-sm mb-3">🚨 ต้องพาหมอเมื่อ</h2>
        <ul className="space-y-1.5">
          {[
            'ไม่กิน > 24 ชั่วโมง (แมว) หรือ 48-72 ชั่วโมง (สุนัข)',
            'มีอาการอื่นร่วม: อาเจียน ท้องเสีย ซึม',
            'น้ำหนักลดชัดเจน',
            'ดื่มน้ำมากหรือน้อยผิดปกติ',
            'ลูกสัตว์เลี้ยง (อันตรายเร็วกว่า)',
          ].map(s => (
            <li key={s} className="flex items-start gap-2 text-xs text-red-600">
              <span className="font-bold flex-shrink-0">•</span>{s}
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/food" className="px-4 py-2.5 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors">🍖 เปรียบเทียบอาหาร</a>
        <a href="/hospital" className="px-4 py-2.5 bg-red-500 text-white font-semibold rounded-xl text-sm hover:bg-red-600 transition-colors">🏥 หาโรงพยาบาล</a>
        <a href="/diarrhea" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">💩 ท้องเสีย</a>
      </div>

      <RelatedGuides current="emergency" count={4} />
    </main>
  )
}
