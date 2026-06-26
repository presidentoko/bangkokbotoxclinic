import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'แมวไม่ยอมใช้กระบะทราย — สาเหตุและวิธีแก้ | ThailandPetHub',
  description: 'แมวไปฉี่/อึนอกกระบะทราย สาเหตุที่พบบ่อย 7 ข้อ และวิธีแก้ทีละขั้นตอน',
  alternates: { canonical: 'https://www.thailandpethub.com/cat-not-using-litter' },
  keywords: ['แมวไม่ยอมใช้กระบะทราย', 'แมวฉี่นอกกระบะ', 'แมวถ่ายนอกกระบะ', 'แก้ปัญหากระบะทรายแมว'],
  openGraph: {
    title: 'แมวไม่ยอมใช้กระบะทราย — แก้ได้!',
    description: 'สาเหตุ 7 อย่าง + วิธีแก้ทีละขั้นตอน',
    url: 'https://www.thailandpethub.com/cat-not-using-litter',
  },
}

function LitterSchemaLd() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'แมวฉี่นอกกระบะทรายเพราะอะไร?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'สาเหตุหลัก: กระบะสกปรก, ตำแหน่งไม่เหมาะ, ทรายผิดประเภท, โรคทางเดินปัสสาวะ (FLUTD), ความเครียด, กระบะน้อยเกินไป, หรือกระบะมีฝา',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

const CAUSES = [
  { cause: 'กระบะสกปรกเกินไป', fix: 'ตักทุกวัน ล้างกระบะทุก 1-2 สัปดาห์', urgent: false },
  { cause: 'โรคทางเดินปัสสาวะ (FLUTD)', fix: 'ถ้าปัสสาวะมีเลือดหรือฉี่ไม่ออก — พาหมอทันที!', urgent: true },
  { cause: 'กระบะมีฝาปิด', fix: 'แมวหลายตัวไม่ชอบกระบะมีฝา — ลองเปิดออก', urgent: false },
  { cause: 'ทรายกลิ่นแรงเกิน', fix: 'แมวไวต่อกลิ่น หลีกเลี่ยงทรายมีน้ำหอม', urgent: false },
  { cause: 'ตำแหน่งกระบะไม่ดี', fix: 'ต้องเงียบ เข้าถึงง่าย ไม่ใกล้อาหาร', urgent: false },
  { cause: 'กระบะน้อยเกินไป', fix: 'กฎ = จำนวนแมว + 1 กระบะ เช่น 2 แมว = 3 กระบะ', urgent: false },
  { cause: 'ความเครียด/เปลี่ยนแปลง', fix: 'แมวใหม่ ย้ายบ้าน เฟอร์นิเจอร์ใหม่ — สร้างความคุ้นเคย', urgent: false },
]

export default function CatNotUsingLitterPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <LitterSchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">แมวไม่ใช้กระบะทราย</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🚽 แมวไม่ยอมใช้กระบะทราย — แก้ได้!</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-2xl">
        ปัญหานี้พบบ่อยมากในแมวทุกวัย มักมีสาเหตุที่แก้ได้ — สิ่งสำคัญคือตรวจว่าเป็นโรคก่อน
      </p>

      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
        <p className="font-bold text-red-700 text-sm mb-1">🚨 ตรวจโรคก่อน</p>
        <p className="text-xs text-red-600">ถ้าแมวพยายามฉี่บ่อย ฉี่ไม่ออก หรือมีเลือด อาจเป็น FLUTD ต้องพาหมอทันที ห้ามรอ</p>
        <a href="/urinary" className="mt-2 inline-block text-xs text-red-700 underline font-semibold">อ่านเรื่อง FLUTD →</a>
      </div>

      <section className="mb-6">
        <h2 className="font-black text-gray-900 text-base mb-3">🔍 เช็คทีละสาเหตุ</h2>
        <div className="space-y-2">
          {CAUSES.map(c => (
            <div key={c.cause} className={`rounded-xl px-4 py-3 border ${c.urgent ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
              <p className="font-bold text-sm text-gray-800">{c.cause} {c.urgent && <span className="text-xs text-red-500 ml-1">(ฉุกเฉิน)</span>}</p>
              <p className="text-xs text-gray-500 mt-0.5">✓ {c.fix}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-5 mb-6">
        <h2 className="font-black text-gray-900 text-base mb-3">🪨 เลือกกระบะทรายให้ถูก</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { title: 'Bentonite ธรรมดา', tip: 'ถูกที่สุด จับตัวเป็นก้อน แต่ฝุ่นเยอะ', ok: true },
            { title: 'Tofu/ถั่วเหลือง', tip: 'กลิ่นน้อย ทิ้งชักโครกได้ แมวส่วนใหญ่ชอบ', ok: true },
            { title: 'Silica Crystal', tip: 'ดูดกลิ่น ทน แต่เสียงกรอบแกรบบางตัวกลัว', ok: true },
            { title: 'ทรายมีน้ำหอม', tip: 'แมวไม่ชอบกลิ่น หลีกเลี่ยงถ้าน้องเลือกกระบะ', ok: false },
          ].map(t => (
            <div key={t.title} className={`rounded-xl border p-3 ${t.ok ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <p className={`font-bold text-xs ${t.ok ? 'text-green-700' : 'text-red-700'}`}>{t.ok ? '✓' : '✗'} {t.title}</p>
              <p className="text-[11px] text-gray-500 mt-1">{t.tip}</p>
            </div>
          ))}
        </div>
        <a href="/cat-litter" className="mt-3 inline-block text-xs text-orange-600 underline">→ เปรียบเทียบทรายแมวทุกประเภทอย่างละเอียด</a>
      </section>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/urinary" className="px-4 py-2.5 bg-red-500 text-white font-semibold rounded-xl text-sm hover:bg-red-600 transition-colors">🚨 ตรวจโรค FLUTD</a>
        <a href="/cat-litter" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🪨 เลือกทรายแมว</a>
      </div>

      <RelatedGuides current="cat-behavior" count={4} />
    </main>
  )
}
