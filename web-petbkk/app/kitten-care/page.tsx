import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'เลี้ยงลูกแมว — คู่มือดูแลลูกแมวตั้งแต่แรกเกิดถึง 1 ปี | ThailandPetHub',
  description: 'คู่มือดูแลลูกแมวตั้งแต่แรกเกิด อาหาร วัคซีน การเข้าสังคม ช่วงอายุที่สำคัญ และอาการที่ต้องพาสัตวแพทย์',
  alternates: { canonical: 'https://www.thailandpethub.com/kitten-care' },
  keywords: ['เลี้ยงลูกแมว', 'ดูแลลูกแมว', 'ลูกแมวแรกเกิด', 'อาหารลูกแมว', 'วัคซีนลูกแมว'],
  openGraph: {
    title: 'เลี้ยงลูกแมว — คู่มือตั้งแต่แรกเกิดถึง 1 ปี',
    description: 'คู่มือครบสำหรับลูกแมวใหม่ อาหาร วัคซีน และช่วงอายุสำคัญ',
    url: 'https://www.thailandpethub.com/kitten-care',
  },
}

function KittenSchemaLd() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'ลูกแมวอายุเท่าไหร่ถึงพรากจากแม่ได้?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'อย่างน้อย 8 สัปดาห์ (2 เดือน) ขึ้นไป ดีที่สุดคือ 12 สัปดาห์ ลูกแมวที่พรากจากแม่เร็วเกินไปมักมีปัญหาพฤติกรรมและภูมิคุ้มกัน',
        },
      },
      {
        '@type': 'Question',
        name: 'ลูกแมวต้องกินอาหารอะไร?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ลูกแมวแรกเกิด-4 สัปดาห์: นมแม่แมวหรือนมทดแทนสำหรับลูกแมว (KMR) เท่านั้น ห้ามนมวัว / 4-8 สัปดาห์: เริ่มอาหารเปียกสูตร Kitten ผสมนม / 8 สัปดาห์ขึ้นไป: อาหาร Kitten สูตร complete and balanced',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

const MILESTONES = [
  { age: '0-2 สัปดาห์', key: 'แรกเกิด', points: ['ตาและหูยังปิด', 'กินนมแม่ทุก 2 ชั่วโมง', 'ต้องการความอบอุ่น 34-38°C', 'แม่ช่วยกระตุ้นการขับถ่าย'] },
  { age: '2-4 สัปดาห์', key: 'เริ่มสำรวจ', points: ['ตาและหูเริ่มเปิด', 'เริ่มเดินได้', 'เริ่มเล่นกับพี่น้อง', 'ยังต้องการนมแม่หลัก'] },
  { age: '4-8 สัปดาห์', key: 'หย่านม', points: ['เริ่มกินอาหารเปียก Kitten', 'เรียนรู้การใช้กระบะทราย (จากแม่)', 'วัคซีนแรก: 8 สัปดาห์', 'เข้าสังคมสำคัญมากช่วงนี้'] },
  { age: '2-4 เดือน', key: 'เติบโต', points: ['วัคซีนครบชุดแรก', 'ฟันน้ำนมขึ้นครบ', 'ซนมาก พลังงานสูง', 'เริ่มฝึกชื่อและกฎบ้าน'] },
  { age: '4-6 เดือน', key: 'วัยรุ่น', points: ['ฟันแท้เริ่มขึ้น เคี้ยวทุกอย่าง', 'อายุเหมาะทำหมัน (4-6 เดือน)', 'วัคซีน booster', 'ยังโตไม่เต็มที่'] },
  { age: '6-12 เดือน', key: 'วัยหนุ่มสาว', points: ['เปลี่ยนเป็นอาหาร Junior/Adult', 'โตเต็มขนาดภายนอก', 'ยังพัฒนาต่อใน 1-3 ปี', 'ตรวจสุขภาพครั้งแรก'] },
]

export default function KittenCarePage() {
  return (
    <main className="max-w-3xl mx-auto">
      <KittenSchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">เลี้ยงลูกแมว</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🐱 เลี้ยงลูกแมว</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-2xl">
        คู่มือครบสำหรับเจ้าของลูกแมวใหม่ ตั้งแต่แรกเกิดจนถึง 1 ปี
        ช่วงนี้สำคัญมากสำหรับพัฒนาการร่างกาย พฤติกรรม และสังคม
      </p>

      <div className="bg-red-50 border border-red-200 rounded-2xl p-3 mb-6">
        <p className="text-xs font-semibold text-red-600">⚠️ ห้ามให้นมวัวลูกแมว — ทำให้ท้องเสียรุนแรงได้ ใช้นม KMR (Kitten Milk Replacer) เท่านั้น</p>
      </div>

      <section className="mb-8">
        <h2 className="font-black text-gray-900 text-lg mb-4">📅 พัฒนาการตามอายุ</h2>
        <div className="space-y-3">
          {MILESTONES.map(m => (
            <div key={m.age} className="bg-white rounded-2xl border shadow-sm p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">{m.age}</span>
                <span className="font-bold text-gray-700 text-sm">{m.key}</span>
              </div>
              <ul className="space-y-1">
                {m.points.map(p => (
                  <li key={p} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="text-orange-400 flex-shrink-0 mt-0.5">•</span>{p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-base mb-4">💉 ตารางวัคซีนลูกแมว</h2>
        <div className="space-y-2">
          {[
            { age: '8 สัปดาห์', vaccine: 'FVRCP (ไข้หัดแมว + แคลิซิไวรัส + ไรโนไทรีไอทิส)' },
            { age: '12 สัปดาห์', vaccine: 'FVRCP ครั้งที่ 2' },
            { age: '16 สัปดาห์', vaccine: 'FVRCP ครั้งที่ 3 + พิษสุนัขบ้า' },
            { age: '1 ปี (ต่อ)', vaccine: 'Booster ตามแพทย์แนะนำ' },
          ].map(v => (
            <div key={v.age} className="flex items-start gap-3 p-2.5 bg-blue-50 rounded-xl">
              <span className="text-xs font-bold text-blue-600 w-24 flex-shrink-0">{v.age}</span>
              <span className="text-xs text-gray-700">{v.vaccine}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/food/puppy" className="px-4 py-2.5 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors">🍖 อาหาร Kitten</a>
        <a href="/vaccine" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">💉 ตารางวัคซีน</a>
        <a href="/cat-behavior" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🐱 พฤติกรรมแมว</a>
      </div>

      <RelatedGuides current="newpet" count={4} />
    </main>
  )
}
