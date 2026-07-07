import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'โรคระบบทางเดินปัสสาวะแมว (FLUTD/FUS) — อาการและวิธีดูแล',
  description: 'โรคทางเดินปัสสาวะแมว (FLUTD/FUS) อาการ สาเหตุ การป้องกัน และวิธีดูแลที่บ้าน — พบบ่อยในแมวตัวผู้',
  alternates: { canonical: 'https://www.thailandpethub.com/urinary' },
  keywords: ['โรคทางเดินปัสสาวะแมว', 'FLUTD', 'แมวปัสสาวะลำบาก', 'แมวฉี่เลือด', 'FUS แมว'],
  openGraph: {
    title: 'โรคทางเดินปัสสาวะแมว (FLUTD) — อาการและการดูแล',
    description: 'พบบ่อยในแมวตัวผู้ รู้จักอาการ ป้องกันได้',
    url: 'https://www.thailandpethub.com/urinary',
  },
}

function UrinarySchemaLd() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'แมวปัสสาวะลำบากอันตรายไหม?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'อันตรายมาก โดยเฉพาะแมวตัวผู้ที่อาจมีท่อปัสสาวะอุดตัน (Urethral Blockage) ถ้าแมวไม่ปัสสาวะ 24 ชั่วโมง มีความเจ็บปวด หรือปัสสาวะมีเลือด ต้องพาหมอทันที — ถ้าอุดตัน เสียชีวิตได้ภายใน 24-48 ชั่วโมง',
        },
      },
      {
        '@type': 'Question',
        name: 'ป้องกันโรคทางเดินปัสสาวะแมวได้ยังไง?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ให้ดื่มน้ำมากๆ (ชามน้ำพุ/น้ำพุแมว) ให้อาหารเปียก (wet food) เพิ่ม ลดอาหารแห้งที่มีแมกนีเซียมสูง ลดความเครียด และตรวจสุขภาพประจำปี',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

const SYMPTOMS = [
  { s: 'เข้าออกกระบะทรายบ่อย แต่ปัสสาวะได้น้อย', urgent: true },
  { s: 'ปัสสาวะมีเลือด (สีชมพู/แดง)', urgent: true },
  { s: 'ร้องเจ็บขณะปัสสาวะ', urgent: true },
  { s: 'ปัสสาวะนอกกระบะทราย (บนพื้น เตียง)', urgent: false },
  { s: 'เลียอวัยวะเพศบ่อยมาก', urgent: false },
  { s: 'ท้องแข็ง/แน่น ไม่ยอมให้จับท้อง', urgent: true },
  { s: 'ไม่ปัสสาวะนาน > 12-24 ชั่วโมง', urgent: true },
]

export default function UrinaryPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <UrinarySchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">โรคทางเดินปัสสาวะ</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🚨 โรคทางเดินปัสสาวะแมว (FLUTD)</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-2xl">
        FLUTD (Feline Lower Urinary Tract Disease) พบบ่อยในแมวตัวผู้ที่กินอาหารแห้งและดื่มน้ำน้อย
        กรณีรุนแรง (อุดตัน) เป็นฉุกเฉินชีวิต
      </p>

      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
        <p className="font-bold text-red-700 text-sm mb-1">🚨 ฉุกเฉิน — ถ้าแมวตัวผู้ไม่ปัสสาวะ 12+ ชั่วโมง</p>
        <p className="text-xs text-red-600">อาจมีท่อปัสสาวะอุดตัน ต้องพาหมอทันที ห้ามรอ</p>
        <a href="/hospital" className="mt-2 inline-block text-xs text-red-700 underline font-semibold">หาโรงพยาบาลเปิด 24 ชั่วโมง →</a>
      </div>

      <section className="mb-6">
        <h2 className="font-black text-gray-900 text-base mb-3">🔍 อาการที่พบ</h2>
        <div className="space-y-2">
          {SYMPTOMS.map(s => (
            <div key={s.s} className={`flex items-center justify-between rounded-xl px-4 py-2.5 border ${s.urgent ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
              <span className="text-sm text-gray-700">{s.s}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ml-2 ${s.urgent ? 'bg-red-500 text-white' : 'bg-yellow-100 text-yellow-700'}`}>{s.urgent ? 'ด่วน' : 'เฝ้าดู'}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-5 mb-6">
        <h2 className="font-black text-gray-900 text-base mb-4">🛡️ ป้องกันได้ด้วย</h2>
        <div className="space-y-3">
          {[
            { tip: 'น้ำพุแมว', desc: 'แมวชอบน้ำไหล ช่วยให้ดื่มน้ำมากขึ้น 30-50%' },
            { tip: 'อาหารเปียก (Wet Food) มากขึ้น', desc: 'wet food มีน้ำ 70-80% เทียบกับ dry 10% ช่วยเจือจางปัสสาวะ' },
            { tip: 'กระบะทรายสะอาด', desc: 'แมวกักปัสสาวะถ้าไม่ชอบกระบะ ทำให้ปัสสาวะเข้มข้น' },
            { tip: 'ลดความเครียด', desc: 'ความเครียดกระตุ้น FLUTD ได้ (Feliway ช่วยได้)' },
            { tip: 'อาหาร Urinary care', desc: 'อาหารสูตรเฉพาะลด struvite/oxalate crystals ถามสัตวแพทย์ก่อน' },
          ].map(t => (
            <div key={t.tip} className="flex items-start gap-2">
              <span className="text-green-500 font-bold flex-shrink-0 mt-0.5">✓</span>
              <div>
                <p className="font-bold text-sm text-gray-800">{t.tip}</p>
                <p className="text-xs text-gray-500">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/hospital/24h" className="px-4 py-2.5 bg-red-500 text-white font-semibold rounded-xl text-sm hover:bg-red-600 transition-colors">🏥 หาโรงพยาบาล 24 ชม.</a>
        <a href="/kidney-disease" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🫘 โรคไต</a>
        <a href="/diarrhea" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">💩 ท้องเสีย</a>
      </div>

      <RelatedGuides current="urinary" count={4} />
    </main>
  )
}
