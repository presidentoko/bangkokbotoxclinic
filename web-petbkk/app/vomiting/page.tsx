import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'สัตว์เลี้ยงอาเจียน — สาเหตุ วิธีดูแลที่บ้าน และสัญญาณต้องพาหมอ | ThailandPetHub',
  description: 'สุนัขหรือแมวอาเจียน สาเหตุที่พบบ่อย ดูแลที่บ้านได้ไหม อาเจียนแบบไหนต้องพาหมอทันที',
  alternates: { canonical: 'https://www.thailandpethub.com/vomiting' },
  keywords: ['สุนัขอาเจียน', 'แมวอาเจียน', 'สัตว์เลี้ยงอาเจียน', 'แมวอ้วก', 'สุนัขอ้วก'],
  openGraph: {
    title: 'สัตว์เลี้ยงอาเจียน — ดูแลที่บ้านหรือต้องพาหมอ?',
    description: 'สาเหตุ อาการร่วม และเมื่อไหร่ที่ต้องรีบพาหมอ',
    url: 'https://www.thailandpethub.com/vomiting',
  },
}

function VomitingSchemaLd() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'แมวอาเจียนบ่อยแค่ไหนถือว่าปกติ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'แมวที่อาเจียนก้อนขน (hairball) ทุก 1-2 สัปดาห์ถือว่าปกติ แต่ถ้าอาเจียนทุกวัน หรืออาเจียนมีเลือด หรืออาเจียนพร้อมกับซึมไม่กิน ต้องพาหมอ',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

const VOMIT_TYPES = [
  { type: 'น้ำเหลืองใส/เมือก', cause: 'กระเพาะว่าง กินหญ้า ฉุกเฉินน้อย', urgent: false },
  { type: 'อาหารที่กินไปเพิ่งกิน', cause: 'กินเร็วเกิน เปลี่ยนอาหารใหม่ ฉุกเฉินน้อย', urgent: false },
  { type: 'ก้อนขน (แมว)', cause: 'ปกติในแมว แต่บ่อยเกินพาหมอ', urgent: false },
  { type: 'อาหารที่ย่อยแล้ว (สีน้ำตาล)', cause: 'กระเพาะหรือลำไส้มีปัญหา', urgent: false },
  { type: 'สีเหลือง/เขียว (น้ำดี)', cause: 'กระเพาะอักเสบ อดอาหารนาน', urgent: false },
  { type: 'มีเลือด (สีแดง/ดำ)', cause: 'แผลในกระเพาะ สิ่งแปลก อันตราย', urgent: true },
  { type: 'โฟมขาว พร้อมซึม', cause: 'พิษ โรคร้ายแรง', urgent: true },
]

export default function VomitingPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <VomitingSchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">อาเจียน</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🤢 สัตว์เลี้ยงอาเจียน — ดูแลที่บ้านหรือต้องพาหมอ?</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-2xl">
        อาเจียนครั้งเดียวอาจไม่ร้ายแรง แต่บางสัญญาณบ่งบอกถึงอันตราย
        สีและลักษณะของสิ่งที่อาเจียนช่วยบอกสาเหตุได้มาก
      </p>

      <section className="mb-6">
        <h2 className="font-black text-gray-900 text-base mb-3">🔍 ดูสีที่อาเจียน</h2>
        <div className="space-y-2">
          {VOMIT_TYPES.map(v => (
            <div key={v.type} className={`flex items-start justify-between rounded-xl px-4 py-3 border ${v.urgent ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
              <div>
                <p className="font-semibold text-sm text-gray-800">{v.type}</p>
                <p className="text-xs text-gray-500 mt-0.5">{v.cause}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ml-3 mt-0.5 ${v.urgent ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'}`}>{v.urgent ? 'ด่วน' : 'เฝ้าดู'}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
        <p className="font-bold text-red-700 text-sm mb-2">🚨 พาหมอทันทีถ้า</p>
        <ul className="space-y-1">
          {['อาเจียนมีเลือด', 'อาเจียนมากกว่า 5 ครั้ง/วัน', 'ซึม ไม่กินน้ำ อ่อนแรง', 'ท้องแข็ง/บวม', 'อาเจียนพร้อมท้องเสียพร้อมกัน', 'สัตว์เลี้ยงอายุน้อย/สูงอายุ'].map(s => (
            <li key={s} className="flex items-center gap-2 text-xs text-red-600">
              <span className="font-bold">✗</span>{s}
            </li>
          ))}
        </ul>
      </div>

      <section className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
        <h2 className="font-bold text-blue-700 text-sm mb-2">🏠 ดูแลที่บ้าน (กรณีเบา)</h2>
        <ol className="space-y-1.5">
          {['งดอาหาร 4-6 ชั่วโมง (ไม่ใช่น้ำ)', 'ให้น้ำสะอาดในปริมาณน้อยบ่อยครั้ง', 'เริ่มอาหารอ่อน (ไก่ต้ม+ข้าว) หลัง 6 ชั่วโมง', 'ถ้าไม่ดีขึ้นใน 24 ชั่วโมง พาหมอ'].map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-blue-700">
              <span className="font-bold">{i + 1}.</span>{s}
            </li>
          ))}
        </ol>
      </section>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/diarrhea" className="px-4 py-2.5 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors">💩 ท้องเสียด้วยไหม?</a>
        <a href="/not-eating" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🍽️ ไม่กินด้วยไหม?</a>
        <a href="/hospital" className="px-4 py-2.5 bg-red-500 text-white font-semibold rounded-xl text-sm hover:bg-red-600 transition-colors">🏥 หาโรงพยาบาล</a>
      </div>

      <RelatedGuides current="emergency" count={4} />
    </main>
  )
}
