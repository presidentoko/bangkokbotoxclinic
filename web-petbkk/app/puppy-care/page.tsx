import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'เลี้ยงลูกสุนัข — คู่มือดูแลตั้งแต่แรกเกิดถึง 1 ปี | ThailandPetHub',
  description: 'คู่มือดูแลลูกสุนัขตั้งแต่แรกเกิด อาหาร วัคซีน การเข้าสังคม ฝึกนิสัย และช่วงอายุที่สำคัญ',
  alternates: { canonical: 'https://www.thailandpethub.com/puppy-care' },
  keywords: ['เลี้ยงลูกสุนัข', 'ดูแลลูกสุนัข', 'ลูกสุนัขแรกเกิด', 'อาหารลูกสุนัข', 'ฝึกลูกสุนัข'],
  openGraph: {
    title: 'เลี้ยงลูกสุนัข — คู่มือตั้งแต่แรกเกิดถึง 1 ปี',
    description: 'คู่มือครบสำหรับลูกสุนัขใหม่ อาหาร วัคซีน ฝึกนิสัย และช่วงอายุสำคัญ',
    url: 'https://www.thailandpethub.com/puppy-care',
  },
}

function PuppyCareSchemaLd() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'ลูกสุนัขกินอาหารอะไรได้บ้าง?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ลูกสุนัขแรกเกิด-4 สัปดาห์: นมแม่หรือนม KMR / 4-8 สัปดาห์: อาหารเปียกสูตร Puppy ผสมนมทดแทน / 8 สัปดาห์ขึ้นไป: อาหาร Puppy สูตร complete ทั้งเปียกหรือแห้ง 3-4 มื้อต่อวัน',
        },
      },
      {
        '@type': 'Question',
        name: 'ลูกสุนัขควรออกนอกบ้านได้ตอนไหน?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ควรรอจนวัคซีนชุดแรกครบ (ประมาณ 12-16 สัปดาห์) ก่อนออกนอกบ้านสาธารณะ ก่อนนั้นให้เดินบริเวณบ้านตัวเองได้ สำหรับการเข้าสังคมกับสุนัขอื่น ควรเลือกสุนัขที่ฉีดวัคซีนครบแล้วเท่านั้น',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

const MILESTONES = [
  { age: '0-2 สัปดาห์', points: ['ตาและหูยังปิด', 'กินนมแม่ทุก 2-3 ชั่วโมง', 'ต้องการความอบอุ่น 30-35°C', 'น้ำหนักควรเพิ่มขึ้นทุกวัน'] },
  { age: '2-4 สัปดาห์', points: ['ตาและหูเปิด', 'เริ่มเดินได้', 'เล่นกับพี่น้อง', 'ฟันน้ำนมเริ่มขึ้น'] },
  { age: '4-8 สัปดาห์', points: ['หย่านมได้', 'เริ่มอาหาร Puppy', 'ช่วง critical socialization window', 'วัคซีนแรกอายุ 6-8 สัปดาห์'] },
  { age: '8-12 สัปดาห์', points: ['วัคซีนชุดแรก', 'เรียนรู้ชื่อและคำสั่งง่ายๆ', 'ฝึกฉี่ถูกที่', 'เข้าสังคมกับคนหลายหน้า'] },
  { age: '3-6 เดือน', points: ['วัคซีนครบ', 'ฟันแท้เริ่มขึ้น (3-7 เดือน)', 'ฝึกคำสั่งพื้นฐาน (นั่ง นอน มาหา)', 'ทำหมันได้ 4-6 เดือน'] },
  { age: '6-12 เดือน', points: ['เปลี่ยนเป็นอาหาร Junior/Adult ทีละน้อย', 'พลังงานสูงมาก ต้องออกกำลังสม่ำเสมอ', 'ยังเรียนรู้และเติบโตต่อ', 'ตรวจสุขภาพประจำปีครั้งแรก'] },
]

export default function PuppyCarePage() {
  return (
    <main className="max-w-3xl mx-auto">
      <PuppyCareSchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">เลี้ยงลูกสุนัข</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🐶 เลี้ยงลูกสุนัข</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-2xl">
        ลูกสุนัขในช่วง 0-1 ปีมีพัฒนาการสำคัญที่ต้องดูแลอย่างใส่ใจ
        ทั้งด้านโภชนาการ วัคซีน การเข้าสังคม และการฝึกนิสัย
      </p>

      <section className="mb-8">
        <h2 className="font-black text-gray-900 text-lg mb-4">📅 พัฒนาการตามอายุ</h2>
        <div className="space-y-3">
          {MILESTONES.map(m => (
            <div key={m.age} className="bg-white rounded-2xl border shadow-sm p-4">
              <p className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200 inline-block mb-2">{m.age}</p>
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
        <h2 className="font-black text-gray-900 text-base mb-4">🏠 วันแรกที่บ้าน</h2>
        <ul className="space-y-2">
          {[
            'เตรียมพื้นที่ปลอดภัย จำกัดบริเวณในช่วงแรก',
            'กระบะทราย/แผ่นรองฉี่ไว้ในจุดเดิมเสมอ',
            'น้ำและอาหารในที่เดิมตลอด',
            'ห้องอบอุ่น เงียบ ไม่ร้อนหรือหนาวเกิน',
            'เวลา 3 วันแรก: ปล่อยให้น้องสำรวจ ไม่บังคับ',
            'ระวัง: อย่าให้ใกล้ชิดสุนัขอื่นก่อนวัคซีนครบ',
          ].map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-orange-400 font-bold mt-0.5 flex-shrink-0">•</span>{s}
            </li>
          ))}
        </ul>
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
        <p className="font-bold text-blue-700 text-sm mb-2">⏰ Socialization Window: 3-14 สัปดาห์</p>
        <p className="text-xs text-blue-600">ช่วงนี้สำคัญที่สุดในชีวิต ลูกสุนัขที่ได้รับการเข้าสังคมที่ดีจะมีพฤติกรรมดีตลอดชีวิต ให้เจอคนหลายหน้า เสียงหลายแบบ สภาพแวดล้อมต่างๆ อย่างปลอดภัย</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/food/puppy" className="px-4 py-2.5 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors">🍖 อาหาร Puppy</a>
        <a href="/training" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🎓 ฝึกสุนัข</a>
        <a href="/vaccine" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">💉 วัคซีน</a>
      </div>

      <RelatedGuides current="newpet" count={4} />
    </main>
  )
}
