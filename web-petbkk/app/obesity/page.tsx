import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'สัตว์เลี้ยงอ้วน — วิธีลดน้ำหนักสุนัขและแมวให้ถูกต้อง | ThailandPetHub',
  description: 'วิธีลดน้ำหนักสัตว์เลี้ยง ตรวจสอบ BCS สาเหตุที่ทำให้อ้วน และแผนอาหาร — ลดช้าๆ ปลอดภัยกว่า',
  alternates: { canonical: 'https://www.thailandpethub.com/obesity' },
  keywords: ['สัตว์เลี้ยงอ้วน', 'สุนัขอ้วน', 'แมวอ้วน', 'ลดน้ำหนักสัตว์เลี้ยง', 'BCS สัตว์'],
  openGraph: {
    title: 'สัตว์เลี้ยงอ้วน — ลดน้ำหนักถูกวิธี',
    description: 'ตรวจสอบว่าน้องอ้วนไหม และวิธีลดน้ำหนักที่ปลอดภัย',
    url: 'https://www.thailandpethub.com/obesity',
  },
}

function ObesitySchemaLd() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'สัตว์เลี้ยงอ้วนอันตรายแค่ไหน?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ความอ้วนเพิ่มความเสี่ยงโรคเบาหวาน ข้อเสื่อม หัวใจ ตับ และอายุขัยสั้นลง 2-3 ปี ถือว่าเป็นปัญหาสุขภาพอันดับ 1 ในสัตว์เลี้ยงบ้านเรา',
        },
      },
      {
        '@type': 'Question',
        name: 'ควรลดน้ำหนักสัตว์เลี้ยงเร็วแค่ไหน?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ลดไม่เกิน 1-2% ของน้ำหนักตัวต่อสัปดาห์ แมวต้องระวังเป็นพิเศษ — อดอาหารเร็วเกินเสี่ยง Hepatic Lipidosis (โรคตับ) เสียชีวิตได้',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

const BCS_LEVELS = [
  { bcs: '1-2', label: 'ผอมมาก', desc: 'เห็นกระดูกชัด ไม่มีไขมัน', color: 'bg-blue-100 text-blue-700' },
  { bcs: '3',   label: 'ผอมพอดี', desc: 'คลำซี่โครงได้ง่าย เอวชัด', color: 'bg-blue-50 text-blue-600' },
  { bcs: '4-5', label: '✓ สุขภาพดี', desc: 'คลำซี่โครงได้ เอวเห็น พุงไม่ห้อย', color: 'bg-green-100 text-green-700' },
  { bcs: '6-7', label: 'อ้วนเล็กน้อย', desc: 'ซี่โครงคลำลำบาก พุงเริ่มห้อย', color: 'bg-yellow-100 text-yellow-700' },
  { bcs: '8-9', label: 'อ้วนมาก', desc: 'มองไม่เห็นซี่โครง ไขมันสะสมมาก', color: 'bg-red-100 text-red-700' },
]

export default function ObesityPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <ObesitySchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">น้องอ้วน</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🐾 สัตว์เลี้ยงอ้วน — ตรวจสอบและลดน้ำหนัก</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-2xl">
        สัตว์เลี้ยงในไทยกว่า 50% มีน้ำหนักเกิน ความอ้วนเพิ่มความเสี่ยงโรคร้ายแรงและอายุขัยสั้น
      </p>

      <section className="mb-6">
        <h2 className="font-black text-gray-900 text-base mb-3">📊 BCS — ตรวจสอบน้ำหนักด้วยมือ</h2>
        <p className="text-xs text-gray-500 mb-3">คลำซี่โครงและดูรูปทรงร่างกาย — ไม่ต้องใช้ตาชั่ง</p>
        <div className="space-y-2">
          {BCS_LEVELS.map(b => (
            <div key={b.bcs} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${b.color}`}>
              <span className="font-black text-sm w-10 flex-shrink-0">BCS {b.bcs}</span>
              <div>
                <p className="font-bold text-sm">{b.label}</p>
                <p className="text-xs opacity-80">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <a href="/weight" className="mt-3 inline-block text-xs text-orange-600 underline">→ ดูรายละเอียด BCS เพิ่มเติม</a>
      </section>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
        <p className="font-bold text-amber-700 text-sm mb-2">⚠️ ข้อควรระวัง — แมวลดน้ำหนัก</p>
        <p className="text-xs text-amber-600">แมวห้ามอดอาหารเร็ว ลดเกิน 2% ต่อสัปดาห์เสี่ยง <strong>Hepatic Lipidosis</strong> (ไขมันสะสมในตับ) อันตรายถึงชีวิต ต้องปรึกษาสัตวแพทย์ก่อนเสมอ</p>
      </div>

      <section className="bg-white rounded-2xl border shadow-sm p-5 mb-6">
        <h2 className="font-black text-gray-900 text-base mb-4">🍽️ แผนลดน้ำหนักที่ปลอดภัย</h2>
        <div className="space-y-3">
          {[
            { step: '1', tip: 'ชั่งน้ำหนักทุกสัปดาห์', desc: 'ตั้งเป้าลด 0.5-1% ต่อสัปดาห์ (ไม่ใช่ต่อวัน)' },
            { step: '2', tip: 'ลดอาหาร 20-25% จากเดิม', desc: 'อย่าเปลี่ยนยี่ห้อทันที — ค่อยๆ ลดปริมาณ' },
            { step: '3', tip: 'เพิ่มกิจกรรม', desc: 'เดิน 20-30 นาที/วัน (สุนัข) หรือเล่นด้วย wand toy (แมว)' },
            { step: '4', tip: 'ขนมต้องนับรวม', desc: 'ขนมควรไม่เกิน 10% ของแคลอรี่ทั้งหมด' },
            { step: '5', tip: 'ปรึกษาหมอก่อนลด > 10%', desc: 'น้ำหนักเกินมากต้องตรวจเพิ่มเติม (ไทรอยด์ เบาหวาน)' },
          ].map(s => (
            <div key={s.step} className="flex items-start gap-3">
              <span className="w-7 h-7 bg-orange-100 text-orange-600 font-black text-sm rounded-full flex items-center justify-center flex-shrink-0">{s.step}</span>
              <div>
                <p className="font-bold text-sm text-gray-800">{s.tip}</p>
                <p className="text-xs text-gray-500">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/weight" className="px-4 py-2.5 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors">⚖️ เครื่องมือ BCS</a>
        <a href="/diabetes" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🩺 โรคเบาหวาน</a>
        <a href="/food" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🍖 เลือกอาหาร low-cal</a>
      </div>

      <RelatedGuides current="weight" count={4} />
    </main>
  )
}
