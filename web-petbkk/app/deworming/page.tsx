import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'ถ่ายพยาธิสุนัขและแมว — ตารางและวิธีการถ่ายพยาธิ | ThailandPetHub',
  description: 'ตารางถ่ายพยาธิสุนัขและแมว วิธีสังเกตอาการพยาธิ ประเภทยาถ่ายพยาธิ และคำแนะนำจากสัตวแพทย์ ป้องกันพยาธิอย่างถูกต้อง',
  alternates: { canonical: 'https://www.thailandpethub.com/deworming' },
  keywords: ['ถ่ายพยาธิสุนัข', 'ถ่ายพยาธิแมว', 'พยาธิสัตว์เลี้ยง', 'ยาถ่ายพยาธิ', 'ป้องกันพยาธิ'],
  openGraph: {
    title: 'ถ่ายพยาธิสุนัขและแมว — ตารางและวิธีการ',
    description: 'ตารางถ่ายพยาธิสัตว์เลี้ยง วิธีสังเกตอาการ และคำแนะนำจากสัตวแพทย์',
    url: 'https://www.thailandpethub.com/deworming',
  },
}

function DewormingSchemaLd() {
  const howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'วิธีถ่ายพยาธิสัตว์เลี้ยงอย่างถูกต้อง',
    description: 'ขั้นตอนการถ่ายพยาธิสุนัขและแมวอย่างถูกต้องและปลอดภัย',
    step: [
      { '@type': 'HowToStep', position: 1, name: 'ตรวจอุจจาระก่อน', text: 'ให้สัตวแพทย์ตรวจอุจจาระเพื่อระบุประเภทพยาธิที่มีอยู่' },
      { '@type': 'HowToStep', position: 2, name: 'เลือกยาให้ถูกต้อง', text: 'เลือกยาถ่ายพยาธิที่เหมาะกับน้ำหนักและประเภทพยาธิ ปรึกษาสัตวแพทย์' },
      { '@type': 'HowToStep', position: 3, name: 'ให้ยาตามขนาดที่กำหนด', text: 'ให้ยาตามน้ำหนักตัวอย่างเคร่งครัด ไม่เพิ่มหรือลดขนาดยาเอง' },
      { '@type': 'HowToStep', position: 4, name: 'ทำซ้ำตามตาราง', text: 'ถ่ายพยาธิซ้ำตามตารางที่แนะนำ เพราะยาไม่ฆ่าไข่พยาธิ' },
    ],
  }
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'ควรถ่ายพยาธิสุนัขบ่อยแค่ไหน?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ลูกสุนัขอายุต่ำกว่า 6 เดือน ถ่ายทุก 2 สัปดาห์ อายุ 6 เดือน - 1 ปี ถ่ายทุกเดือน สุนัขโตที่ออกนอกบ้านบ่อย ถ่ายทุก 3 เดือน สุนัขโตที่อยู่แต่ในบ้าน ถ่ายปีละ 2-4 ครั้ง',
        },
      },
      {
        '@type': 'Question',
        name: 'อาการพยาธิในสัตว์เลี้ยงมีอะไรบ้าง?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'อาการพยาธิ ได้แก่ ท้องอืดโป่งโดยเฉพาะในลูกสัตว์ ท้องเสียหรืออาเจียน น้ำหนักลดทั้งๆ ที่กินอาหารปกติ ขนหยาบ หน้าท้องเป็นสีซีด ขุดทวาร และเห็นพยาธิหรือปล้องพยาธิในอุจจาระ',
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

const SCHEDULE = [
  { group: 'ลูกสุนัข/ลูกแมว (< 6 สัปดาห์)', freq: 'ถ่ายพยาธิทุก 2 สัปดาห์', note: 'เริ่มตั้งแต่อายุ 2 สัปดาห์ หรือตามคำแนะนำสัตวแพทย์' },
  { group: 'ลูกสุนัข/ลูกแมว (6 สัปดาห์ - 6 เดือน)', freq: 'ถ่ายพยาธิทุกเดือน', note: 'พยาธิแพร่ได้เร็วในสัตว์วัยเยาว์' },
  { group: 'สุนัขโตที่ออกนอกบ้านบ่อย', freq: 'ทุก 3 เดือน', note: 'เสี่ยงสูงจากดิน น้ำ และสัตว์อื่น' },
  { group: 'สุนัขโตที่อยู่แต่ในบ้าน', freq: 'ปีละ 2-4 ครั้ง', note: 'ยังเสี่ยงจากดินที่ติดรองเท้า' },
  { group: 'แมวในบ้าน', freq: 'ปีละ 2-4 ครั้ง', note: 'แมวที่ออกนอกบ้านควรถ่ายบ่อยขึ้น (ทุก 3 เดือน)' },
]

const WORM_TYPES = [
  { name: 'พยาธิไส้เดือน (Roundworms)', risk: 'สูงมาก', sign: 'ท้องโป่ง ขนหยาบ ขาดสารอาหาร', note: 'ติดต่อสู่คนได้!' },
  { name: 'พยาธิตัวตืด (Tapeworms)', risk: 'สูง', sign: 'ขุดทวาร เห็นปล้องพยาธิในอุจจาระ', note: 'มักมาจากหมัด' },
  { name: 'พยาธิปากขอ (Hookworms)', risk: 'สูง', sign: 'อ่อนแรง ท้องเสียมีเลือด ซีด', note: 'ติดต่อสู่คนได้!' },
  { name: 'พยาธิหนอนหัวใจ (Heartworms)', risk: 'อันตรายมาก', sign: 'ไอ เหนื่อยง่าย ท้องบวม', note: 'ต้องป้องกันด้วยยาสม่ำเสมอ' },
]

export default function DewormingPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <DewormingSchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">ถ่ายพยาธิ</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🪱 ถ่ายพยาธิสุนัขและแมว</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-2xl">
        พยาธิเป็นปัญหาสุขภาพที่พบบ่อยที่สุดในสัตว์เลี้ยง บางชนิดติดต่อสู่คนได้ การถ่ายพยาธิอย่างสม่ำเสมอตามตารางเป็นการดูแลสุขภาพพื้นฐานที่ทุกคนทำได้
      </p>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">📅 ตารางถ่ายพยาธิที่แนะนำ</h2>
        <div className="space-y-3">
          {SCHEDULE.map((s) => (
            <div key={s.group} className="border-b border-gray-50 pb-3 last:border-0 last:pb-0">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                <p className="font-semibold text-gray-800 text-sm">{s.group}</p>
                <span className="text-xs px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full font-medium whitespace-nowrap">{s.freq}</span>
              </div>
              <p className="text-xs text-gray-500">{s.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">🔍 ประเภทพยาธิที่พบบ่อย</h2>
        <div className="space-y-4">
          {WORM_TYPES.map((w) => (
            <div key={w.name} className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="font-bold text-gray-800 text-sm">{w.name}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${w.risk.includes('อันตราย') ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                  ⚠️ {w.risk}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-1"><span className="font-medium">อาการ:</span> {w.sign}</p>
              <p className="text-xs text-blue-600 font-medium">{w.note}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6">
        <p className="font-bold text-red-700 text-sm mb-2">⚠️ สำคัญ — ติดต่อสู่คนได้</p>
        <p className="text-xs text-red-600 leading-relaxed">
          พยาธิไส้เดือนและพยาธิปากขอสามารถติดต่อสู่มนุษย์ได้ โดยเฉพาะเด็กที่เล่นดิน
          ล้างมือทุกครั้งหลังสัมผัสสัตว์เลี้ยงหรือดินในบริเวณที่สัตว์เลี้ยงใช้
        </p>
      </div>

      <section className="bg-white border rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">คำถามที่พบบ่อย</h2>
        <div className="space-y-4 divide-y divide-gray-100">
          {[
            { q: 'ควรถ่ายพยาธิสุนัขบ่อยแค่ไหน?', a: 'ลูกสุนัขถ่ายทุก 2 สัปดาห์จนอายุ 6 เดือน จากนั้นทุกเดือนจนอายุ 1 ปี สุนัขโตที่ออกนอกบ้านบ่อยถ่ายทุก 3 เดือน สุนัขในบ้านถ่ายปีละ 2-4 ครั้ง' },
            { q: 'ยาถ่ายพยาธิซื้อเองได้ไหม?', a: 'ซื้อได้ที่ร้านขายยาสัตว์ แต่ควรปรึกษาสัตวแพทย์ก่อนเพื่อเลือกยาที่เหมาะกับน้ำหนักและประเภทพยาธิ ยาที่ไม่เหมาะสมอาจไม่มีประสิทธิภาพหรือเป็นอันตราย' },
            { q: 'ให้ยาถ่ายพยาธิก่อนหรือหลังอาหาร?', a: 'ขึ้นอยู่กับชนิดยา บางตัวให้ก่อนอาหาร บางตัวให้พร้อมอาหาร ควรอ่านฉลากหรือปรึกษาสัตวแพทย์ก่อนให้ยา' },
          ].map((item, i) => (
            <div key={i} className={i > 0 ? 'pt-4' : ''}>
              <h3 className="font-semibold text-gray-800 mb-1">{item.q}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/hospital" className="px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 transition-colors">🏥 หาสัตวแพทย์ใกล้บ้าน</a>
        <a href="/vaccine" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">💉 ตารางวัคซีน</a>
        <a href="/tips" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">📚 เคล็ดลับดูแล</a>
      </div>

      <RelatedGuides current="tips" count={4} />
    </main>
  )
}
