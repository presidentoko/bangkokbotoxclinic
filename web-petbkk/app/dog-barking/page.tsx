import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'สุนัขเห่ามาก — สาเหตุ วิธีฝึกหยุดเห่า และเมื่อไหร่ที่น่าเป็นห่วง',
  description: 'ทำไมสุนัขถึงเห่า? วิธีหยุดเห่าที่ได้ผล 5 เทคนิค และเมื่อไหร่ต้องพาหาสัตวแพทย์พฤติกรรม',
  alternates: { canonical: 'https://www.thailandpethub.com/dog-barking' },
  keywords: ['สุนัขเห่ามาก', 'ฝึกสุนัขไม่ให้เห่า', 'หมาเห่าทั้งคืน', 'วิธีหยุดเห่า', 'สุนัขเห่าไม่หยุด'],
  openGraph: {
    title: 'สุนัขเห่ามาก — วิธีหยุดเห่าที่ได้ผลจริง',
    description: '5 เทคนิคที่สัตวแพทย์พฤติกรรมแนะนำ',
    url: 'https://www.thailandpethub.com/dog-barking',
  },
}

function BarkingSchemaLd() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'ทำไมสุนัขถึงเห่าไม่หยุด?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'สาเหตุหลัก: แยกเจ้าของไม่ได้ (Separation Anxiety), เห่าเตือนภัย, เห่าเพื่อขอความสนใจ, เห่าจากความกลัว หรือเห่าเพราะเบื่อ/ขาดการออกกำลังกาย แต่ละสาเหตุต้องการวิธีแก้ที่ต่างกัน',
        },
      },
      {
        '@type': 'Question',
        name: 'ห้ามเห่าด้วยการตีหรือตะคอกได้ผลไหม?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ไม่ได้ผลและทำให้แย่ลง การลงโทษทางกายทำให้สุนัขกลัวและวิตกกังวลมากขึ้น ซึ่งอาจทำให้เห่ามากขึ้นหรือกัด วิธีที่ได้ผลคือ Positive Reinforcement — ให้รางวัลเมื่อเงียบ',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

const BARK_TYPES = [
  { type: 'เห่าเมื่อคนไม่อยู่บ้าน', cause: 'Separation Anxiety', fix: '/anxiety', fixLabel: 'แก้ Separation Anxiety' },
  { type: 'เห่าเมื่อเห็นคนแปลกหน้า/เสียง', cause: 'เตือนภัย (ปกติ)', fix: '/training', fixLabel: 'ฝึกคำสั่ง "เงียบ"' },
  { type: 'เห่าเพื่อขออาหาร/ความสนใจ', cause: 'Demand Barking', fix: null, fixLabel: null },
  { type: 'เห่าทั้งคืน', cause: 'วิตกกังวล เจ็บปวด หรือสมองเสื่อม', fix: '/senior-care', fixLabel: 'ดูแลน้องสูงวัย' },
  { type: 'เห่าเมื่อเห็นสุนัขอื่น', cause: 'Reactivity/กลัว', fix: null, fixLabel: null },
]

const TECHNIQUES = [
  { step: '1', name: 'หยุดให้รางวัลพฤติกรรมเห่า', detail: 'ห้ามแม้แต่มองเมื่อน้องเห่าขอความสนใจ — มองเมื่อเงียบเท่านั้น' },
  { step: '2', name: 'คำสั่ง "เงียบ" + รางวัล', detail: 'รอให้หยุดเห่า 2 วินาที แล้วพูด "เงียบ" พร้อมให้ขนม ทำซ้ำ 5-10 ครั้ง/วัน' },
  { step: '3', name: 'เพิ่มการออกกำลังกาย', detail: 'สุนัขเหนื่อยเห่าน้อยลง — เดิน 30-60 นาที/วัน เพิ่มกิจกรรมสมอง' },
  { step: '4', name: 'Desensitization', detail: 'สัมผัสสิ่งที่ทำให้เห่า (เสียง คน) ในระยะที่ไม่ตอบสนอง แล้วค่อยๆ ลดระยะ' },
  { step: '5', name: 'ปรึกษาสัตวแพทย์พฤติกรรม', detail: 'ถ้าเห่าจาก Anxiety รุนแรง อาจต้องใช้ยาร่วมกับการฝึก' },
]

export default function DogBarkingPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <BarkingSchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">สุนัขเห่ามาก</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🐕 สุนัขเห่ามาก — วิธีหยุดเห่าที่ได้ผลจริง</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-2xl">
        ก่อนแก้ ต้องรู้ก่อนว่าน้องเห่าเพราะอะไร แต่ละสาเหตุต้องการวิธีแก้ที่ต่างกัน
      </p>

      <section className="mb-6">
        <h2 className="font-black text-gray-900 text-base mb-3">🔍 เห่าแบบไหน? รู้สาเหตุก่อน</h2>
        <div className="space-y-2">
          {BARK_TYPES.map(b => (
            <div key={b.type} className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-start justify-between">
              <div>
                <p className="font-bold text-sm text-gray-800">{b.type}</p>
                <p className="text-xs text-gray-500 mt-0.5">{b.cause}</p>
              </div>
              {b.fix && <a href={b.fix} className="text-xs text-orange-500 underline flex-shrink-0 ml-3 mt-0.5 font-semibold">{b.fixLabel}</a>}
            </div>
          ))}
        </div>
      </section>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
        <p className="font-bold text-amber-700 text-sm mb-1">⚠️ สิ่งที่ไม่ควรทำ</p>
        <ul className="space-y-1">
          {['ตี ตะคอก หรือทำให้กลัว — ทำให้แย่ลง', 'เห่าตอบกลับ — น้องคิดว่าคุณกำลังเห่าด้วยกัน', 'ให้รางวัลเมื่อเห่า — เป็นการ reinforce พฤติกรรม'].map(s => (
            <li key={s} className="text-xs text-amber-700 flex items-center gap-2"><span>✗</span>{s}</li>
          ))}
        </ul>
      </div>

      <section className="bg-white rounded-2xl border shadow-sm p-5 mb-6">
        <h2 className="font-black text-gray-900 text-base mb-4">✅ 5 เทคนิคที่ได้ผล</h2>
        <div className="space-y-4">
          {TECHNIQUES.map(t => (
            <div key={t.step} className="flex items-start gap-3">
              <span className="w-7 h-7 bg-orange-100 text-orange-600 font-black text-sm rounded-full flex items-center justify-center flex-shrink-0">{t.step}</span>
              <div>
                <p className="font-bold text-sm text-gray-800">{t.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/anxiety" className="px-4 py-2.5 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors">😰 แก้ Separation Anxiety</a>
        <a href="/training" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🎓 ฝึกสุนัขพื้นฐาน</a>
      </div>

      <RelatedGuides current="dog-barking" count={4} />
    </main>
  )
}
