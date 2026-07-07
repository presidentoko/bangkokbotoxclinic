import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'ดูแลหูสัตว์เลี้ยง — ทำความสะอาด อาการหูติดเชื้อ และวิธีแก้',
  description: 'วิธีทำความสะอาดหูสุนัขและแมว อาการหูอักเสบติดเชื้อ สาเหตุและวิธีป้องกัน พร้อมสัญญาณที่ต้องพาหมอ',
  alternates: { canonical: 'https://www.thailandpethub.com/ear-care' },
  keywords: ['ดูแลหูสุนัข', 'หูแมวกลิ่น', 'หูสัตว์เลี้ยงอักเสบ', 'ทำความสะอาดหูสัตว์เลี้ยง', 'หูติดเชื้อ'],
  openGraph: {
    title: 'ดูแลหูสัตว์เลี้ยง — ทำความสะอาดและป้องกันหูอักเสบ',
    description: 'คู่มือทำความสะอาดหู อาการหูติดเชื้อ และวิธีดูแลที่ถูกต้อง',
    url: 'https://www.thailandpethub.com/ear-care',
  },
}

function EarCareSchemaLd() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'ควรทำความสะอาดหูสุนัขบ่อยแค่ไหน?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ขึ้นอยู่กับสายพันธุ์ สุนัขหูตั้งที่อากาศถ่ายเทดี อาจสะอาดทุก 1-2 เดือน สุนัขหูพับ (Basset, Cocker, Labrador) ควรทุก 1-2 สัปดาห์ ถ้าหูมีกลิ่นหรือน้องตะกายหูบ่อย อย่ารอ ควรทำความสะอาดทันที',
        },
      },
      {
        '@type': 'Question',
        name: 'หูสัตว์เลี้ยงกลิ่นเหม็นต้องทำอะไร?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'กลิ่นจากหูอาจเกิดจากยีสต์ (กลิ่นมัน หวาน), แบคทีเรีย (กลิ่นเหม็น), หรือไรหู (ขี้หูดำๆ) ทำความสะอาดเบื้องต้นได้ แต่ถ้ายังมีกลิ่นหลังทำความสะอาด หรือน้องเจ็บปวด ควรพาสัตวแพทย์',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

const SIGNS_OF_INFECTION = [
  { sign: 'ตะกายหูบ่อย', severity: 'เฝ้าระวัง' },
  { sign: 'ส่ายหัวบ่อยๆ', severity: 'เฝ้าระวัง' },
  { sign: 'หูมีกลิ่น', severity: 'เฝ้าระวัง' },
  { sign: 'ขี้หูดำหรือสีน้ำตาลมาก', severity: 'พาหมอ' },
  { sign: 'หูบวม แดง ร้อน', severity: 'พาหมอ' },
  { sign: 'น้องร้องเมื่อแตะหู', severity: 'พาหมอด่วน' },
  { sign: 'หัวเอียง เดินเซ', severity: 'พาหมอด่วน' },
]

const SEVERITY_COLORS: Record<string, string> = {
  'เฝ้าระวัง': 'bg-yellow-100 text-yellow-700',
  'พาหมอ': 'bg-orange-100 text-orange-700',
  'พาหมอด่วน': 'bg-red-500 text-white',
}

const CLEANING_STEPS = [
  'เตรียม ear cleaner สำหรับสัตว์เลี้ยง (ไม่ใช้น้ำเปล่าหรือแอลกอฮอล์)',
  'หยอด cleaner ลงในช่องหู ปริมาณตามฉลาก',
  'นวดโคนหูเบาๆ 30-60 วินาที จะได้ยินเสียงการไหล',
  'ปล่อยให้น้องส่ายหัว เพื่อขับออก',
  'ใช้สำลีสะอาดเช็ดรอบนอกและขอบหู ห้ามใช้ cotton bud ลึกๆ',
  'ทำซ้ำอีกด้านถ้าจำเป็น',
]

export default function EarCarePage() {
  return (
    <main className="max-w-3xl mx-auto">
      <EarCareSchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">ดูแลหู</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">👂 ดูแลหูสัตว์เลี้ยง</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-2xl">
        หูสัตว์เลี้ยงโดยเฉพาะสุนัขหูพับมักมีปัญหาหูอักเสบ ไรหู หรือยีสต์
        ซึ่งป้องกันได้ง่ายด้วยการทำความสะอาดสม่ำเสมอ
      </p>

      <section className="bg-white rounded-2xl border shadow-sm p-5 mb-6">
        <h2 className="font-black text-gray-900 text-base mb-4">🚿 วิธีทำความสะอาดหู</h2>
        <ol className="space-y-2">
          {CLEANING_STEPS.map((s, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-red-500">⚠️ ห้ามใส่ cotton bud ลึกเกิน ทำให้ขี้หูอัดแน่นและแก้วหูเสียหายได้</p>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="font-black text-gray-900 text-base mb-4">🔍 สัญญาณหูมีปัญหา</h2>
        <div className="space-y-2">
          {SIGNS_OF_INFECTION.map(s => (
            <div key={s.sign} className="flex items-center justify-between bg-white rounded-xl border px-4 py-2.5">
              <span className="text-sm text-gray-700">{s.sign}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${SEVERITY_COLORS[s.severity]}`}>{s.severity}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-5 mb-6">
        <h2 className="font-black text-gray-900 text-base mb-3">🦟 ไรหู (Ear Mites)</h2>
        <p className="text-sm text-gray-700 mb-2">ไรหูพบบ่อยในแมวมากกว่าสุนัข สัญญาณ: ขี้หูดำเหมือนกาแฟบด ตะกายหูมาก</p>
        <p className="text-xs text-gray-500">การรักษา: ยาหยอดหู 7-14 วัน หรือยา spot-on บางชนิด ต้องให้สัตวแพทย์วินิจฉัยก่อน — อย่าซื้อยาหยอดเองโดยไม่แน่ใจ</p>
      </section>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/grooming" className="px-4 py-2.5 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors">🪮 Grooming ครบ</a>
        <a href="/hospital" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🏥 หาโรงพยาบาล</a>
      </div>

      <RelatedGuides current="ear-care" count={4} />
    </main>
  )
}
