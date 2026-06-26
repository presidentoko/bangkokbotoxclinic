import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'ท้องเสียสัตว์เลี้ยง — สาเหตุ วิธีดูแลที่บ้าน และเมื่อไหร่ต้องพาหมอ | ThailandPetHub',
  description: 'สุนัขหรือแมวท้องเสีย สาเหตุที่พบบ่อย วิธีดูแลเบื้องต้นที่บ้าน สัญญาณอันตราย และเมื่อไหร่ต้องพาสัตวแพทย์ทันที',
  alternates: { canonical: 'https://www.thailandpethub.com/diarrhea' },
  keywords: ['สุนัขท้องเสีย', 'แมวท้องเสีย', 'สัตว์เลี้ยงท้องเสีย', 'อาเจียนสุนัข', 'แมวถ่ายเหลว'],
  openGraph: {
    title: 'ท้องเสียสัตว์เลี้ยง — สาเหตุ ดูแลที่บ้าน และสัญญาณต้องพาหมอ',
    description: 'สุนัขแมวท้องเสีย ดูแลเองได้ไหม หรือต้องพาหมอ',
    url: 'https://www.thailandpethub.com/diarrhea',
  },
}

function DiarrheaSchemaLd() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'สุนัขท้องเสียต้องพาหมอไหม?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ท้องเสียเบาๆ 1-2 ครั้ง ยังกินน้ำได้ ยังแอคทีฟ ดูแลที่บ้านได้ 24-48 ชั่วโมง แต่ถ้ามีเลือดในอุจจาระ อาเจียนด้วย ซึม ไม่กินน้ำ หรือท้องเสียมากกว่า 48 ชั่วโมง ต้องพาหมอ',
        },
      },
      {
        '@type': 'Question',
        name: 'ดูแลสัตว์เลี้ยงท้องเสียที่บ้านอย่างไร?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'อดอาหาร 12-24 ชั่วโมง (แต่ให้น้ำสะอาดตลอด) เพื่อให้ระบบย่อยพัก จากนั้นเริ่มอาหารอ่อน เช่น ไก่ต้มกับข้าวสุก 2-3 วัน ก่อนกลับมาอาหารปกติทีละน้อย',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

const CAUSES = [
  { cause: 'เปลี่ยนอาหารกะทันหัน', common: true, note: 'เปลี่ยนอาหารต้องทีละน้อย 7-10 วัน' },
  { cause: 'กินอาหารเน่า/ขยะ', common: true, note: 'พบบ่อยมากในสุนัข' },
  { cause: 'ความเครียด (เดินทาง ย้ายบ้าน)', common: true, note: 'มักหายเองภายใน 1-2 วัน' },
  { cause: 'พยาธิลำไส้', common: true, note: 'ต้องยาถ่ายพยาธิจากสัตวแพทย์' },
  { cause: 'แพ้อาหาร/ส่วนผสม', common: false, note: 'มักมาพร้อมคันและผิวหนัง' },
  { cause: 'ติดเชื้อแบคทีเรีย/ไวรัส', common: false, note: 'มักมีไข้ อาเจียนร่วมด้วย' },
  { cause: 'โรคตับ/ตับอ่อน/ไต', common: false, note: 'ต้องตรวจเลือดวินิจฉัย' },
]

const DANGER_SIGNS = [
  'มีเลือดในอุจจาระ (แดงสด หรือดำเหนียว)',
  'อาเจียนด้วย (อาจขาดน้ำเร็ว)',
  'ซึม ไม่แอคทีฟ ไม่กินน้ำ',
  'ท้องแข็ง/บวม',
  'ท้องเสียนาน > 48 ชั่วโมง',
  'ลูกสุนัข/ลูกแมว หรือสัตว์สูงวัย',
]

export default function DiarrheaPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <DiarrheaSchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">ท้องเสีย</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">💩 สัตว์เลี้ยงท้องเสีย — ดูแลที่บ้านหรือต้องพาหมอ?</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-2xl">
        ท้องเสียเบาๆ มักหายเองได้ในไม่กี่วัน แต่บางสัญญาณบ่งบอกว่าน้องต้องพบสัตวแพทย์ทันที
        รู้จักความแตกต่างเพื่อตัดสินใจได้ถูกต้อง
      </p>

      <section className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6">
        <h2 className="font-black text-blue-700 text-base mb-3">🏠 ดูแลเบื้องต้นที่บ้าน (กรณีเบา)</h2>
        <ol className="space-y-2">
          {[
            { step: 'อดอาหาร 12-24 ชั่วโมง', detail: 'ให้ระบบย่อยพัก แต่ให้น้ำสะอาดตลอด' },
            { step: 'ให้น้ำอย่างพอเพียง', detail: 'กังวลภาวะขาดน้ำ ถ้าน้องไม่กินน้ำใช้กระบอกฉีด' },
            { step: 'เริ่มอาหารอ่อนหลัง 12-24 ชม.', detail: 'ไก่ต้มไม่ปรุง + ข้าวสุก สัดส่วน 1:3' },
            { step: 'กลับมาอาหารปกติทีละน้อย', detail: 'ผสมอาหารเดิมเข้าไปทีละน้อย 3-5 วัน' },
          ].map((s, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-blue-700">
              <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
              <div>
                <p className="font-semibold">{s.step}</p>
                <p className="text-xs text-blue-500 mt-0.5">{s.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6">
        <h2 className="font-black text-red-700 text-base mb-3">🚨 สัญญาณต้องพาหมอทันที</h2>
        <ul className="space-y-1.5">
          {DANGER_SIGNS.map(s => (
            <li key={s} className="flex items-start gap-2 text-sm text-red-600">
              <span className="text-red-500 font-bold flex-shrink-0">✗</span>{s}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-5 mb-6">
        <h2 className="font-black text-gray-900 text-base mb-4">🔍 สาเหตุที่พบบ่อย</h2>
        <div className="space-y-2">
          {CAUSES.map(c => (
            <div key={c.cause} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
              <span className={`text-xs px-1.5 py-0.5 rounded font-semibold flex-shrink-0 mt-0.5 ${c.common ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>{c.common ? 'บ่อย' : 'น้อย'}</span>
              <div>
                <p className="font-semibold text-sm text-gray-800">{c.cause}</p>
                <p className="text-xs text-gray-500">{c.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/hospital" className="px-4 py-2.5 bg-red-500 text-white font-semibold rounded-xl text-sm hover:bg-red-600 transition-colors">🏥 หาโรงพยาบาล</a>
        <a href="/toxic" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">⚠️ อาหารต้องห้าม</a>
        <a href="/deworming" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🪱 ถ่ายพยาธิ</a>
      </div>

      <RelatedGuides current="emergency" count={4} />
    </main>
  )
}
