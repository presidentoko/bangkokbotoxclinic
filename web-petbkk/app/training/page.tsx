import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'ฝึกสุนัขเบื้องต้น — คำสั่งพื้นฐานและการฝึกห้องน้ำ | ThailandPetHub',
  description: 'วิธีฝึกสุนัขด้วยตัวเองที่บ้าน คำสั่งพื้นฐาน (นั่ง นอน อยู่ที่) การฝึกห้องน้ำ และการแก้พฤติกรรมไม่พึงประสงค์ ใช้ positive reinforcement',
  alternates: { canonical: 'https://www.thailandpethub.com/training' },
  keywords: ['ฝึกสุนัข', 'สอนสุนัขนั่ง', 'ฝึกสุนัขห้องน้ำ', 'สอนสุนัข', 'ฝึกสุนัขด้วยตัวเอง'],
  openGraph: {
    title: 'ฝึกสุนัขเบื้องต้น — คำสั่งพื้นฐานและการฝึกห้องน้ำ',
    description: 'วิธีฝึกสุนัขด้วยตัวเองที่บ้าน positive reinforcement',
    url: 'https://www.thailandpethub.com/training',
  },
}

function TrainingSchemaLd() {
  const howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'วิธีฝึกสุนัขคำสั่ง "นั่ง" (Sit)',
    description: 'ขั้นตอนการสอนสุนัขนั่งด้วยวิธี positive reinforcement',
    step: [
      { '@type': 'HowToStep', position: 1, name: 'เตรียมขนม', text: 'เตรียมขนมชิ้นเล็กๆ ที่น้องชอบ หรือใช้ clicker ถ้ามี' },
      { '@type': 'HowToStep', position: 2, name: 'ให้น้องสนใจขนม', text: 'ถือขนมตรงจมูก ให้น้องสนใจ อย่าเริ่มจนน้องพร้อม' },
      { '@type': 'HowToStep', position: 3, name: 'เลื่อนขนมขึ้น', text: 'เลื่อนมือถือขนมช้าๆ ไปด้านหลังศีรษะ น้องจะนั่งลงตามธรรมชาติ' },
      { '@type': 'HowToStep', position: 4, name: 'พูด "นั่ง" และให้รางวัล', text: 'ทันทีที่นั่ง พูดคำว่า "นั่ง" แล้วให้ขนมทันที ชมเชยด้วยเสียงสนุก' },
    ],
  }
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'ควรเริ่มฝึกสุนัขตั้งแต่อายุเท่าไหร่?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'เริ่มได้ตั้งแต่อายุ 7-8 สัปดาห์ ลูกสุนัขเรียนรู้ได้เร็วมากในช่วง 8-16 สัปดาห์ (socialization window) ยิ่งเริ่มเร็วยิ่งดี แต่สุนัขโตก็ฝึกได้เช่นกัน แค่ใช้เวลามากกว่า',
        },
      },
      {
        '@type': 'Question',
        name: 'ใช้เวลานานแค่ไหนกว่าสุนัขจะเรียนคำสั่ง?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'คำสั่งง่ายอย่าง "นั่ง" สุนัขมักเรียนได้ใน 1-3 วันถ้าฝึกสม่ำเสมอ การฝึกสั้นๆ 5-10 นาที 2-3 ครั้งต่อวัน ดีกว่าฝึกนานชั่วโมงเดียว',
        },
      },
    ],
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    </>
  )
}

const COMMANDS = [
  {
    cmd: 'นั่ง (Sit)',
    emoji: '🐾',
    difficulty: 'ง่าย',
    steps: [
      'ถือขนมตรงจมูกน้อง ให้สนใจ',
      'เลื่อนมือช้าๆ ไปด้านหลังศีรษะ น้องจะนั่งลงเอง',
      'ทันทีที่นั่ง พูด "นั่ง" แล้วให้ขนมทันที',
      'ทำซ้ำ 5-10 ครั้ง แล้วหยุดพักก่อนรอบหน้า',
    ],
  },
  {
    cmd: 'นอน (Down)',
    emoji: '😴',
    difficulty: 'ปานกลาง',
    steps: [
      'ให้น้องนั่งก่อน',
      'เลื่อนขนมลงช้าๆ ระหว่างขาหน้า น้องจะนอนลงตาม',
      'ทันทีที่นอน พูด "นอน" แล้วให้รางวัล',
      'อย่าดันตัวน้องลง ให้น้องเลือกนอนเอง',
    ],
  },
  {
    cmd: 'อยู่ที่ (Stay)',
    emoji: '✋',
    difficulty: 'ยาก',
    steps: [
      'ให้น้องนั่ง พูด "อยู่ที่" พร้อมแสดงฝ่ามือ',
      'ถอยหลังออก 1 ก้าว รอ 2 วินาที แล้วกลับมาให้รางวัล',
      'ค่อยๆ เพิ่มระยะทางและเวลาทีละน้อย',
      'ถ้าน้องลุกมา เริ่มใหม่ด้วยระยะสั้นกว่าเดิม',
    ],
  },
  {
    cmd: 'มาหา (Come)',
    emoji: '🏃',
    difficulty: 'ปานกลาง',
    steps: [
      'นั่งลงในระดับเดียวกับน้อง แสดงว่าเป็นมิตร',
      'ยกมือออก พูด "มาหา" ด้วยเสียงสนุก',
      'เมื่อน้องมา ชมเชยอย่างดีและให้ขนมทันที',
      'ไม่เรียกมาเพื่อทำสิ่งน้องไม่ชอบ เช่น อาบน้ำ',
    ],
  },
]

const TIPS = [
  { title: 'Positive Reinforcement เสมอ', detail: 'ให้รางวัลเมื่อทำถูก ไม่ตี ไม่ดุ ไม่ทำโทษ การลงโทษทำให้น้องกลัวและไม่ยอมเรียนรู้' },
  { title: 'ฝึกสั้นๆ บ่อยๆ', detail: '5-10 นาที 2-3 ครั้ง/วัน ดีกว่าฝึกชั่วโมงเดียว สุนัขสมาธิสั้น ควรหยุดก่อนที่น้องจะเบื่อ' },
  { title: 'สม่ำเสมอ', detail: 'ทุกคนในบ้านต้องใช้คำสั่งเดียวกัน อย่าให้สิ่งที่คนหนึ่งห้ามอีกคนอนุญาต' },
  { title: 'จบแต่ละครั้งด้วยความสำเร็จ', detail: 'ก่อนหยุดฝึก ให้น้องทำสิ่งที่รู้แล้วสำเร็จก่อน เพื่อให้จบด้วยพลังบวก' },
]

export default function TrainingPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <TrainingSchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">ฝึกสุนัข</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🐕 ฝึกสุนัขเบื้องต้น</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-2 max-w-2xl">
        การฝึกสุนัขไม่ใช่แค่ทำให้น้องเชื่อฟัง แต่เป็นการสร้างสัมพันธ์และการสื่อสารที่ดีระหว่างกัน
      </p>
      <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-2xl">
        หลักสำคัญ: <strong>Positive Reinforcement</strong> — ให้รางวัลเมื่อทำถูก ไม่ใช้การลงโทษ
        สุนัขทุกตัวเรียนรู้ได้ แค่ต้องใช้วิธีที่ถูกต้องและใช้เวลา
      </p>

      <section className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6">
        <p className="font-bold text-amber-700 text-sm mb-2">⏱️ ควรฝึกเมื่อน้อง...</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-amber-600">
          {['ไม่หิวมาก (ไม่หลังมื้อใหญ่)', 'ไม่ง่วงหรือตื่นเต้นเกินไป', 'สภาพแวดล้อมเงียบ ไม่มีสิ่งรบกวน', 'พร้อมทั้งคุณและน้อง'].map(t => (
            <div key={t} className="flex items-start gap-1.5"><span>✓</span><span>{t}</span></div>
          ))}
        </div>
      </section>

      <div className="space-y-4 mb-8">
        {COMMANDS.map(c => (
          <section key={c.cmd} className="bg-white rounded-2xl border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-gray-900 text-lg">{c.emoji} {c.cmd}</h2>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                c.difficulty === 'ง่าย' ? 'bg-green-100 text-green-700' :
                c.difficulty === 'ปานกลาง' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>{c.difficulty}</span>
            </div>
            <ol className="space-y-2.5">
              {c.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">💡 หลักการฝึกที่ได้ผล</h2>
        <div className="space-y-4">
          {TIPS.map(tip => (
            <div key={tip.title} className="border-l-2 border-orange-300 pl-4">
              <p className="font-bold text-sm text-gray-800">{tip.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{tip.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6">
        <p className="font-bold text-red-700 text-sm mb-2">❌ สิ่งที่ไม่ควรทำ</p>
        <ul className="space-y-1.5 text-xs text-red-600">
          {['ตี ดึง หรือกดบังคับ — ทำให้น้องกลัวและต่อต้าน', 'ฝึกนานเกิน 20 นาทีต่อครั้ง', 'ให้รางวัลเมื่อน้องทำพฤติกรรมไม่ดี (แม้ตั้งใจปลอบ)', 'เปลี่ยนคำสั่งบ่อยๆ หรือใช้คำสั่งหลายคำ'].map(i => (
            <li key={i} className="flex items-start gap-1.5"><span>•</span><span>{i}</span></li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/newpet" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🆕 คู่มือเลี้ยงใหม่</a>
        <a href="/tips" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">📚 เคล็ดลับดูแลน้อง</a>
        <a href="/food/puppy" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🐶 อาหาร Puppy</a>
      </div>

      <RelatedGuides current="tips" count={4} />
    </main>
  )
}
