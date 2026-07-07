import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'ทำไมสุนัขกินหญ้า? — อันตรายไหม ต้องห้ามหรือเปล่า',
  description: 'สุนัขกินหญ้าเป็นเรื่องปกติหรือไม่? สาเหตุ 5 อย่าง และเมื่อไหร่ที่น่าเป็นห่วง',
  alternates: { canonical: 'https://www.thailandpethub.com/why-dogs-eat-grass' },
  keywords: ['สุนัขกินหญ้า', 'ทำไมสุนัขกินหญ้า', 'หมากินหญ้า', 'dog eat grass', 'สุนัขกินหญ้าแล้วอาเจียน'],
  openGraph: {
    title: 'ทำไมสุนัขกินหญ้า? อันตรายไหม?',
    description: 'คำตอบที่สัตวแพทย์แนะนำ + เมื่อไหร่ที่น่ากังวล',
    url: 'https://www.thailandpethub.com/why-dogs-eat-grass',
  },
}

function GrassSchemaLd() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'ทำไมสุนัขถึงกินหญ้า?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'สาเหตุที่พบบ่อยที่สุด: ต้องการไฟเบอร์, ท้องไม่สบายและต้องการอาเจียน, ความเบื่อหรือสัญชาตญาณจากบรรพบุรุษ การศึกษาพบว่าสุนัขส่วนใหญ่ (82%) กินหญ้าโดยไม่มีอาการป่วยก่อนหน้า',
        },
      },
      {
        '@type': 'Question',
        name: 'สุนัขกินหญ้าแล้วอาเจียนอันตรายไหม?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'โดยทั่วไปไม่อันตราย สุนัขประมาณ 25% อาเจียนหลังกินหญ้า ถือว่าปกติ แต่ถ้าอาเจียนบ่อย ซึม หรือมีเลือด ต้องพาหมอ',
        },
      },
      {
        '@type': 'Question',
        name: 'ควรป้องกันไม่ให้สุนัขกินหญ้าไหม?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'หญ้าธรรมดาปลอดภัย แต่ระวังหญ้าที่ฉีดยาฆ่าแมลงหรือยาฆ่าหญ้า — อันนั้นอันตราย ถ้ากินบ่อยมาก อาจเพิ่มไฟเบอร์ในอาหารหรือเปลี่ยนยี่ห้ออาหาร',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

const REASONS = [
  { emoji: '🌾', title: 'ต้องการไฟเบอร์', desc: 'ถ้าอาหารขาดไฟเบอร์ สุนัขจะหาจากหญ้า — ลองเปลี่ยนอาหารที่มี fiber สูงขึ้น', common: true },
  { emoji: '🤢', title: 'ท้องไม่สบาย ต้องการอาเจียน', desc: 'สัญชาตญาณช่วยให้อาเจียนสิ่งที่ตกค้างในกระเพาะ', common: true },
  { emoji: '😴', title: 'ความเบื่อ', desc: 'สุนัขที่ออกกำลังกายน้อยหรือขาดการกระตุ้นมักกินหญ้าเพื่อหาความสนุก', common: true },
  { emoji: '🧬', title: 'สัญชาตญาณบรรพบุรุษ', desc: 'หมาป่ากินหญ้าด้วย — เป็นพฤติกรรมปกติในสัตว์กินเนื้อ', common: true },
  { emoji: '🍽️', title: 'ชอบรสชาติ', desc: 'บางตัวชอบกินหญ้าโดยไม่มีเหตุผลอื่น — เพราะชอบรสหรือกลิ่น', common: false },
]

export default function WhyDogsEatGrassPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <GrassSchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">ทำไมสุนัขกินหญ้า?</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🌿 ทำไมสุนัขกินหญ้า?</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-4 max-w-2xl">
        เจ้าของหลายคนกังวลเมื่อเห็นสุนัขกินหญ้า ความจริงแล้ว <strong>นี่เป็นพฤติกรรมปกติ</strong> พบในสุนัขสุขภาพดีถึง 79% ตามการศึกษาของ UC Davis
      </p>

      <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex gap-3">
        <span className="text-2xl">✅</span>
        <div>
          <p className="font-bold text-green-700 text-sm">โดยทั่วไปปลอดภัย</p>
          <p className="text-xs text-green-600">82% ของสุนัขที่กินหญ้าไม่แสดงอาการป่วยก่อนหน้า และ 91% ไม่อาเจียน</p>
        </div>
      </div>

      <section className="mb-6">
        <h2 className="font-black text-gray-900 text-base mb-3">🔍 สาเหตุที่พบบ่อย</h2>
        <div className="space-y-3">
          {REASONS.map(r => (
            <div key={r.title} className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex gap-3">
              <span className="text-2xl flex-shrink-0">{r.emoji}</span>
              <div>
                <p className="font-bold text-sm text-gray-800">{r.title} {r.common && <span className="text-xs text-orange-500 font-semibold">(พบบ่อย)</span>}</p>
                <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
        <p className="font-bold text-red-700 text-sm mb-2">🚨 พาหมอถ้า</p>
        <ul className="space-y-1">
          {['กินหญ้าแล้วอาเจียนทุกครั้ง มากกว่า 3 ครั้ง/วัน', 'อุจจาระมีเลือดหรือมูก', 'ซึม ไม่กินอาหาร น้ำหนักลด', 'หญ้าในบริเวณที่อาจมียาฆ่าแมลง'].map(s => (
            <li key={s} className="text-xs text-red-600 flex items-center gap-2"><span>✗</span>{s}</li>
          ))}
        </ul>
      </div>

      <section className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
        <h2 className="font-bold text-blue-700 text-sm mb-2">💡 ลดพฤติกรรมได้ด้วย</h2>
        <ul className="space-y-1.5">
          {['เพิ่มไฟเบอร์ในอาหาร (ฟักทอง แครอท)', 'เพิ่มการออกกำลังกายและกิจกรรม', 'เปลี่ยนอาหารที่มีคุณภาพสูงขึ้น'].map(s => (
            <li key={s} className="text-xs text-blue-700 flex items-center gap-2"><span>✓</span>{s}</li>
          ))}
        </ul>
        <a href="/food" className="mt-2 inline-block text-xs text-blue-700 underline font-semibold">→ ดูอาหารที่มีไฟเบอร์สูง</a>
      </section>

      <RelatedGuides current="why-dogs-eat-grass" count={4} />
    </main>
  )
}
