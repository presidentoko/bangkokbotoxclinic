import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'สอนสุนัขเดินสายจูง — วิธีฝึกไม่ให้ดึงและเดินข้างๆ เจ้าของ',
  description: 'วิธีฝึกสุนัขเดินสายจูงอย่างถูกต้อง ไม่ดึง ไม่กระโจน ฝึกเดินข้างเจ้าของ เหมาะสำหรับลูกสุนัขและสุนัขโต',
  alternates: { canonical: 'https://www.thailandpethub.com/leash-training' },
  keywords: ['ฝึกสุนัขเดินสายจูง', 'สุนัขดึงสายจูง', 'leash training', 'สอนเดินข้าง', 'ฝึกสุนัข'],
  openGraph: {
    title: 'สอนสุนัขเดินสายจูง — ฝึกไม่ให้ดึง step-by-step',
    description: 'คู่มือฝึกสุนัขเดินสายจูงอย่างถูกต้อง ทั้งลูกสุนัขและสุนัขโต',
    url: 'https://www.thailandpethub.com/leash-training',
  },
}

function LeashSchemaLd() {
  const howto = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'วิธีฝึกสุนัขเดินสายจูงไม่ดึง',
    description: 'ฝึกสุนัขให้เดินข้างเจ้าของโดยไม่ดึงสายจูง ใช้ positive reinforcement',
    step: [
      { '@type': 'HowToStep', name: 'สวม Harness หรือ Collar ให้คุ้นเคย', text: 'ก่อนฝึกออกเดิน ให้น้องสวม harness/collar ในบ้านก่อน 1-2 วัน พร้อมให้รางวัลเมื่อน้องยืนนิ่ง' },
      { '@type': 'HowToStep', name: 'ฝึก "มาหา" เมื่อเรียกชื่อ', text: 'ก่อนออกเดิน น้องต้องรู้จักชื่อตัวเองและหันมาหาเมื่อเรียก นี่เป็นพื้นฐานของ recall ขณะเดิน' },
      { '@type': 'HowToStep', name: 'เดินเป็นวงสั้นๆ ในบ้านก่อน', text: 'เริ่มในบ้านหรือสวนบ้าน เดิน 5-10 นาที ให้รางวัลทุกครั้งที่น้องเดินข้างโดยไม่ดึง' },
      { '@type': 'HowToStep', name: 'หยุดทันทีเมื่อน้องดึง', text: 'เมื่อน้องดึงสายจูง หยุดเดินทันที รอจนน้องหันมาหาหรือสายหย่อน จึงเดินต่อ ไม่ต้องดึงกลับ' },
      { '@type': 'HowToStep', name: 'เพิ่มระยะทางและสิ่งรบกวนทีละน้อย', text: 'เมื่อน้องทำได้ดีในที่เงียบ ค่อยเพิ่มระยะทางและสิ่งรบกวน (สุนัขอื่น รถ คน)' },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howto) }} />
}

const MISTAKES = [
  { mistake: 'ดึงกลับทุกครั้งที่น้องดึง', why: 'สุนัขมี oppositional reflex — ถ้าดึง น้องจะดึงตามสัญชาตญาณ' },
  { mistake: 'เดินซิกแซกไม่มีทิศทาง', why: 'สุนัขไม่รู้ว่าจะไปไหน ทำให้ไม่สนใจเจ้าของ' },
  { mistake: 'ให้รางวัลหลังดึงแล้วหยุด', why: 'น้องเข้าใจผิดว่าการดึงแล้วหยุดเองได้รางวัล' },
  { mistake: 'ฝึกนานเกินไปในครั้งเดียว', why: 'น้องเหนื่อยและเบื่อ ประสิทธิภาพลดลง' },
]

const GEAR = [
  { item: 'Front-clip Harness', note: 'แนะนำสำหรับสุนัขดึงมาก ช่วยหันหน้าน้องกลับมาหาเจ้าของ' },
  { item: 'Standard Flat Collar', note: 'เหมาะสุนัขที่ฝึกดีแล้ว ไม่เหมาะสุนัขดึงมากเพราะกดคอ' },
  { item: 'Martingale Collar', note: 'ป้องกันหลุดหัว ไม่รัดคอเหมือนเชือกรัด แต่ไม่ได้หยุดการดึง' },
  { item: 'Head Halter (Gentle Leader)', note: 'ควบคุมหัวโดยตรง ต้องคุ้นเคยก่อนใช้ ไม่ใช่อุปกรณ์ทรมาน' },
]

export default function LeashTrainingPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <LeashSchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">ฝึกสายจูง</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🦮 สอนสุนัขเดินสายจูงไม่ดึง</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-2xl">
        สุนัขดึงสายจูงเป็นปัญหาที่แก้ได้ด้วยการฝึกอย่างสม่ำเสมอ
        หลักการคือ "หยุดเมื่อดึง รางวัลเมื่อสายหย่อน" — ไม่ต้องดึงกลับ ไม่ต้องลงโทษ
      </p>

      <section className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-6">
        <h2 className="font-black text-orange-700 text-base mb-3">📋 5 ขั้นตอนฝึกเดินสายจูง</h2>
        <ol className="space-y-3">
          {[
            { step: 'สวม Harness/Collar ในบ้านก่อน 1-2 วัน', detail: 'ให้น้องคุ้นเคย ให้รางวัลขณะสวม' },
            { step: 'ฝึก recall — เรียกชื่อแล้วหัน', detail: 'พื้นฐานสำคัญ ถ้าน้องรู้จักชื่อ การฝึกเดินง่ายขึ้นมาก' },
            { step: 'เดินในบ้านก่อน 5-10 นาที', detail: 'สิ่งรบกวนน้อย น้องเรียนรู้เร็วกว่า' },
            { step: 'หยุดทุกครั้งที่สายตึง รอจนหย่อน', detail: 'ไม่ต้องพูด ไม่ต้องดึงกลับ แค่หยุด' },
            { step: 'เพิ่มระยะทางและสิ่งรบกวนทีละน้อย', detail: 'ค่อยๆ ออกนอกบ้าน เพิ่มความยากขึ้น' },
          ].map((s, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
              <div>
                <p className="font-semibold text-sm text-gray-800">{s.step}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-5 mb-6">
        <h2 className="font-black text-gray-900 text-base mb-4">❌ ข้อผิดพลาดที่ทำให้ฝึกไม่สำเร็จ</h2>
        <div className="space-y-3">
          {MISTAKES.map(m => (
            <div key={m.mistake} className="flex items-start gap-3">
              <span className="text-red-500 text-lg flex-shrink-0">✗</span>
              <div>
                <p className="font-semibold text-sm text-red-700">{m.mistake}</p>
                <p className="text-xs text-gray-500 mt-0.5">{m.why}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-5 mb-6">
        <h2 className="font-black text-gray-900 text-base mb-4">🛒 อุปกรณ์ที่เหมาะ</h2>
        <div className="space-y-2">
          {GEAR.map(g => (
            <div key={g.item} className="flex items-start gap-2 text-sm">
              <span className="font-bold text-gray-700 flex-shrink-0 w-40">{g.item}</span>
              <span className="text-gray-500 text-xs">{g.note}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-orange-500 mt-3 italic">หลีกเลี่ยง: Prong collar, Choke chain — ไม่จำเป็นและอาจทำร้ายน้อง</p>
      </section>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/training" className="px-4 py-2.5 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors">🎓 ฝึกสุนัขพื้นฐาน</a>
        <a href="/dog-behavior" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🐕 พฤติกรรมสุนัข</a>
        <a href="/anxiety" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">😰 Separation Anxiety</a>
      </div>

      <RelatedGuides current="leash-training" count={4} />
    </main>
  )
}
