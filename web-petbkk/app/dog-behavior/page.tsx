import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'พฤติกรรมสุนัข — ทำไมสุนัขถึงเห่า ขุด กัด และวิธีแก้ | ThailandPetHub',
  description: 'อ่านภาษาสุนัข ทำไมสุนัขถึงเห่า กัด ขุดดิน วิ่งไล่ หรือกินอุจจาระ วิธีแก้ไขพฤติกรรมที่ไม่พึงประสงค์ด้วย positive reinforcement',
  alternates: { canonical: 'https://www.thailandpethub.com/dog-behavior' },
  keywords: ['พฤติกรรมสุนัข', 'สุนัขเห่า', 'สุนัขกัด', 'สุนัขขุดดิน', 'แก้นิสัยสุนัข', 'ภาษากาย สุนัข'],
  openGraph: {
    title: 'พฤติกรรมสุนัข — ทำไมสุนัขถึงเห่า กัด ขุด และวิธีแก้',
    description: 'คู่มืออ่านภาษาสุนัขและแก้ไขพฤติกรรมที่ไม่พึงประสงค์',
    url: 'https://www.thailandpethub.com/dog-behavior',
  },
}

function DogBehaviorSchemaLd() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'ทำไมสุนัขถึงเห่ามาก วิธีแก้คืออะไร?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'สุนัขเห่าด้วยเหตุผลหลายอย่าง เช่น เตือนภัย ต้องการความสนใจ เบื่อ กลัว หรือวิตกกังวล วิธีแก้ขึ้นอยู่กับสาเหตุ การฝึก "เงียบ" ด้วย positive reinforcement ช่วยได้ ถ้าเกิดจาก separation anxiety ต้องแก้ที่ต้นเหตุ',
        },
      },
      {
        '@type': 'Question',
        name: 'สุนัขกัดคนในบ้านทำอย่างไรดี?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'หยุดเล่นทันทีและหันหน้าออกเมื่อถูกกัด (time-out สั้นๆ) สอนว่า "กัด = เกมจบ" ลูกสุนัขมักกัดเพื่อสำรวจ สุนัขโตที่กัดรุนแรงควรปรึกษาผู้เชี่ยวชาญ พฤติกรรมก้าวร้าวอาจมาจากความกลัวหรือเจ็บปวด',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

const BEHAVIORS = [
  {
    q: 'ทำไมสุนัขถึงเห่า?',
    icon: '🗣️',
    reasons: ['เตือนภัย (เห่าเห็นคนแปลกหน้า)', 'ต้องการความสนใจ', 'เบื่อ ขาดกิจกรรม', 'วิตกกังวล separation anxiety', 'ตื่นเต้นมาก'],
    fix: 'ไม่ตอบสนองตอนเห่าเพื่อเรียกร้อง — รอเงียบก่อนให้ความสนใจ ฝึก "เงียบ" เป็นคำสั่ง ให้กิจกรรมเพียงพอ',
  },
  {
    q: 'ทำไมสุนัขถึงกัด?',
    icon: '🦷',
    reasons: ['ลูกสุนัขกัดเพื่อสำรวจ (ฟันขึ้น)', 'เล่นหนักเกินไป', 'กลัวหรือรู้สึกถูกคุกคาม', 'เจ็บปวด', 'ปกป้องอาหาร/ของเล่น'],
    fix: 'หยุดเล่นทันทีเมื่อถูกกัด หันหลัง ไม่ตีหรือตะโกน ฝึก bite inhibition ตั้งแต่เล็ก สุนัขโตที่กัดรุนแรงควรปรึกษาผู้เชี่ยวชาญ',
  },
  {
    q: 'ทำไมสุนัขถึงขุดดิน?',
    icon: '⛏️',
    reasons: ['สัญชาตญาณดั้งเดิม (เก็บของ ล่าสัตว์)', 'ร้อนอยากนอนในดินเย็น', 'เบื่อ ขาดสิ่งกระตุ้น', 'หนีจากคอก'],
    fix: 'เพิ่มกิจกรรม กำหนดพื้นที่ขุดได้ ให้ของเล่น puzzle feeder ออกกำลังกายให้เพียงพอก่อนปล่อยอยู่คนเดียว',
  },
  {
    q: 'ทำไมสุนัขถึงกินอุจจาระ?',
    icon: '🤢',
    reasons: ['ขาดสารอาหาร/เอนไซม์', 'เลียนแบบแม่ (ลูกสุนัข)', 'เบื่อ/วิตกกังวล', 'อาหารไม่อิ่ม', 'โรคบางชนิด'],
    fix: 'ตรวจสอบอาหารว่าสมดุลไหม เก็บอุจจาระทันที เพิ่มสารเอนไซม์ย่อยอาหาร ถ้าทำบ่อยปรึกษาสัตวแพทย์',
  },
  {
    q: 'ทำไมสุนัขถึงกระโดดทักทาย?',
    icon: '🐾',
    reasons: ['แสดงความตื่นเต้น ยินดี', 'ต้องการอยู่ระดับสายตา', 'เคยถูกให้รางวัลเมื่อกระโดด (โดยไม่รู้ตัว)'],
    fix: 'ไม่สนใจเมื่อกระโดด (หันหลัง ไขว้แขน) ให้ความสนใจเมื่อสี่เท้าอยู่บนพื้นเท่านั้น ฝึกสม่ำเสมอกับทุกคนในบ้าน',
  },
]

const BODY_LANGUAGE = [
  { signal: 'หางโยกแรง', meaning: 'ตื่นเต้น — ไม่ได้หมายความว่าเป็นมิตรเสมอ' },
  { signal: 'หางม้วนระหว่างขา', meaning: 'กลัว วิตกกังวล หรือยอมแพ้' },
  { signal: 'ขนตั้งที่คอ-หลัง', meaning: 'ตื่นตัว ระมัดระวัง หรือพร้อมป้องกัน' },
  { signal: 'นอนหงายอ้าท้อง', meaning: 'ไว้วางใจ หรือยอมแพ้ (ขึ้นอยู่กับกล้ามเนื้อ)' },
  { signal: 'เลียปาก บ่อยๆ', meaning: 'ความเครียด ไม่สบายใจ (calming signal)' },
  { signal: 'หมอบหัวต่ำ ก้น up', meaning: 'ชวนเล่น (play bow)' },
  { signal: 'ตาแข็ง จ้อง นิ่ง', meaning: 'เตือน อาจโจมตี อย่าโต้ตอบโดยตรง' },
]

export default function DogBehaviorPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <DogBehaviorSchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">พฤติกรรมสุนัข</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🐕 พฤติกรรมสุนัข</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-2xl">
        ทุกพฤติกรรมสุนัขมีสาเหตุ สุนัขไม่ทำสิ่งต่างๆ เพื่อ "แก้แค้น" หรือ "แหกกฎ"
        แต่กำลังสื่อสารความต้องการหรือความรู้สึก การเข้าใจสาเหตุคือกุญแจสำคัญสู่การแก้ไข
      </p>

      <div className="space-y-4 mb-8">
        {BEHAVIORS.map(b => (
          <details key={b.q} className="bg-white rounded-2xl border shadow-sm group" open={b === BEHAVIORS[0]}>
            <summary className="p-5 cursor-pointer font-black text-gray-900 text-base flex items-center gap-3 list-none select-none">
              <span className="text-xl">{b.icon}</span>
              <span className="flex-1">{b.q}</span>
              <span className="text-gray-400 text-xs group-open:rotate-180 transition-transform">▾</span>
            </summary>
            <div className="px-5 pb-5 border-t border-gray-50 pt-4">
              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">สาเหตุที่เป็นไปได้</p>
              <ul className="space-y-1 mb-4">
                {b.reasons.map(r => (
                  <li key={r} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-orange-400 mt-0.5 flex-shrink-0">•</span>{r}
                  </li>
                ))}
              </ul>
              <div className="bg-blue-50 rounded-xl p-3">
                <p className="text-xs font-semibold text-blue-700 mb-1">💡 วิธีแก้</p>
                <p className="text-xs text-blue-600 leading-relaxed">{b.fix}</p>
              </div>
            </div>
          </details>
        ))}
      </div>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">🔍 อ่านภาษากายสุนัข</h2>
        <div className="divide-y divide-gray-50">
          {BODY_LANGUAGE.map(b => (
            <div key={b.signal} className="py-2.5 flex items-start gap-3">
              <span className="font-semibold text-sm text-gray-700 w-36 flex-shrink-0">{b.signal}</span>
              <span className="text-sm text-gray-500">{b.meaning}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/training" className="px-4 py-2.5 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors">🎓 ฝึกสุนัขเบื้องต้น</a>
        <a href="/anxiety" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">😰 Separation Anxiety</a>
        <a href="/cat-behavior" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🐱 พฤติกรรมแมว</a>
      </div>

      <RelatedGuides current="dog-behavior" count={4} />
    </main>
  )
}
