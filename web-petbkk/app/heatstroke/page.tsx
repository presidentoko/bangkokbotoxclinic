import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'โรคลมแดด (Heatstroke) ในสัตว์เลี้ยง — สัญญาณ วิธีปฐมพยาบาล | ThailandPetHub',
  description: 'สัตว์เลี้ยงเสี่ยงโรคลมแดดมากในอากาศร้อนของไทย เรียนรู้อาการเตือน วิธีปฐมพยาบาลฉุกเฉิน และวิธีป้องกันก่อนพาไปสัตวแพทย์',
  alternates: { canonical: 'https://www.thailandpethub.com/heatstroke' },
  keywords: ['โรคลมแดดสุนัข', 'heatstroke สัตว์เลี้ยง', 'สุนัขร้อนจัด', 'สัตว์เลี้ยงอยู่ในรถร้อน', 'ป้องกันความร้อน'],
  openGraph: {
    title: 'โรคลมแดดในสัตว์เลี้ยง — สัญญาณและวิธีปฐมพยาบาลฉุกเฉิน',
    description: 'อาการลมแดด วิธีช่วยฉุกเฉิน และการป้องกันในอากาศร้อนของไทย',
    url: 'https://www.thailandpethub.com/heatstroke',
  },
}

function HeatstrokeSchemaLd() {
  const howto = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'วิธีปฐมพยาบาลสัตว์เลี้ยงที่เป็นลมแดด',
    step: [
      { '@type': 'HowToStep', name: 'พาออกจากที่ร้อนทันที', text: 'เคลื่อนย้ายไปที่ร่ม มีอากาศถ่ายเท เปิดแอร์ถ้าอยู่ในรถ' },
      { '@type': 'HowToStep', name: 'ลดอุณหภูมิร่างกาย', text: 'เอาน้ำเย็น (ไม่ใช่น้ำแข็ง) ชโลมลำตัว ขาหน้า ขาหลัง และคอ ห้ามใช้น้ำแข็งหรือน้ำเย็นจัด' },
      { '@type': 'HowToStep', name: 'ให้ดื่มน้ำ', text: 'ถ้ารู้สึกตัวดี ให้น้ำสะอาดดื่มเอง ไม่บังคับ เพราะอาจสำลัก' },
      { '@type': 'HowToStep', name: 'พาไปสัตวแพทย์ทันที', text: 'แม้อาการดูดีขึ้น ต้องตรวจอวัยวะภายใน เพราะโรคลมแดดอาจทำให้อวัยวะล้มเหลวหลายชั่วโมงหลังเกิดเหตุ' },
    ],
  }
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'สุนัขอยู่ในรถร้อนนานแค่ไหนถึงอันตราย?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ภายใน 10-15 นาที อุณหภูมิในรถที่จอดกลางแดดสามารถสูงถึง 60°C+ แม้แต่วันที่อากาศ 30°C อุณหภูมิในรถอาจสูงถึง 50°C ภายใน 20 นาที ห้ามทิ้งสัตว์เลี้ยงไว้ในรถโดยเด็ดขาด',
        },
      },
    ],
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howto) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    </>
  )
}

const WARNING_SIGNS = [
  { sign: 'หอบแรงผิดปกติ', severity: 'เตือน' },
  { sign: 'น้ำลายไหลมาก หนืด หรือเป็นฟอง', severity: 'เตือน' },
  { sign: 'เหงือกและลิ้นแดงเข้ม', severity: 'เตือน' },
  { sign: 'เดินเซ ขาอ่อนแรง', severity: 'ฉุกเฉิน' },
  { sign: 'อาเจียน หรืออุจจาระมีเลือด', severity: 'ฉุกเฉิน' },
  { sign: 'ชัก หรือหมดสติ', severity: 'ฉุกเฉิน' },
]

const HIGH_RISK_BREEDS = [
  'บัลด็อก Bulldog', 'บ๊อกเซอร์ Boxer', 'ปั๊ก Pug', 'ชิห์สึ Shih Tzu',
  'เปอร์เซีย Persian', 'หน้าสั้นทุกสายพันธุ์', 'สุนัขขนหนา (Husky, Malamute)'
]

export default function HeatstrokePage() {
  return (
    <main className="max-w-3xl mx-auto">
      <HeatstrokeSchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">โรคลมแดด</span>
      </nav>

      <div className="bg-red-500 rounded-2xl p-4 mb-6">
        <p className="font-black text-white text-base mb-1">🌡️ ฉุกเฉิน — โรคลมแดดเป็นอันตรายถึงชีวิต</p>
        <p className="text-red-100 text-xs">ถ้าสัตว์เลี้ยงมีอาการฉุกเฉินด้านล่าง พาไปสัตวแพทย์ทันทีหลังปฐมพยาบาล ไม่รอดูอาการ</p>
      </div>

      <h1 className="text-3xl font-black text-gray-900 mb-3">☀️ โรคลมแดดในสัตว์เลี้ยง</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-2xl">
        ประเทศไทยมีอากาศร้อนทั้งปี โรคลมแดด (Heatstroke) เกิดขึ้นได้เร็วกว่าที่คิด
        โดยเฉพาะสุนัขที่ไม่สามารถระบายความร้อนด้วยการเหงื่อออกได้เหมือนมนุษย์
      </p>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">🚨 สัญญาณที่ต้องระวัง</h2>
        <div className="space-y-2">
          {WARNING_SIGNS.map(s => (
            <div key={s.sign} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${s.severity === 'ฉุกเฉิน' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{s.severity}</span>
              <p className="text-sm text-gray-700">{s.sign}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">🆘 วิธีปฐมพยาบาลฉุกเฉิน</h2>
        <ol className="space-y-4">
          {[
            { step: 'พาออกจากที่ร้อนทันที', detail: 'ย้ายเข้าร่มหรือสถานที่มีแอร์ ถ้าอยู่ในรถ เปิดแอร์และประตูทุกด้านทันที' },
            { step: 'ราดน้ำเย็น (ไม่ใช่น้ำแข็ง)', detail: 'ใช้น้ำเย็นปกติหรือน้ำก๊อก ชโลมตัว คอ ใต้ขาหน้า และขาหลัง ใช้ผ้าชุบน้ำก็ได้ ห้ามใช้น้ำแข็งหรือน้ำเย็นจัด เพราะหลอดเลือดหดทำให้ความร้อนออกช้าลง' },
            { step: 'ให้น้ำดื่ม (ถ้ารู้สึกตัว)', detail: 'ให้ดื่มเองตามใจ ไม่บังคับ ถ้าหมดสติห้ามป้อน' },
            { step: 'พาไปสัตวแพทย์ทันที', detail: 'ห้ามรอดูอาการ โรคลมแดดอาจทำให้อวัยวะล้มเหลวหลายชั่วโมงหลังเกิดเหตุ' },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-red-500 text-white text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
              <div>
                <p className="font-bold text-gray-800 text-sm">{item.step}</p>
                <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-3">🐾 สายพันธุ์ที่เสี่ยงสูง</h2>
        <p className="text-xs text-gray-400 mb-3">สัตว์หน้าสั้น (Brachycephalic) ระบายความร้อนได้ยากกว่าเพราะทางเดินหายใจแคบ</p>
        <div className="flex flex-wrap gap-2">
          {HIGH_RISK_BREEDS.map(b => (
            <span key={b} className="px-2.5 py-1 bg-red-50 border border-red-200 text-red-700 text-xs rounded-full">{b}</span>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-5 mb-6">
        <h2 className="font-black text-gray-900 text-base mb-3">✅ วิธีป้องกัน</h2>
        <ul className="space-y-1.5">
          {[
            'ออกกำลังกายเช้ามืดหรือเย็น ไม่ใช่กลางวัน',
            'มีน้ำดื่มสะอาดพร้อมเสมอ',
            'ห้ามทิ้งไว้ในรถแม้แต่ไม่กี่นาที',
            'จัดที่พักเย็น มีพัดลมหรือแอร์ในวันที่ร้อนจัด',
            'ตัดขนให้เหมาะสม (แต่ไม่สั้นเกินไป — ขนช่วยป้องกันแสงแดดด้วย)',
          ].map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">✓</span>{s}
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/hospital" className="px-4 py-2.5 bg-red-500 text-white font-semibold rounded-xl text-sm hover:bg-red-600 transition-colors">🏥 หาโรงพยาบาลสัตว์ฉุกเฉิน</a>
        <a href="/first-aid" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🩹 ปฐมพยาบาลเบื้องต้น</a>
        <a href="/emergency" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🚨 คู่มือฉุกเฉิน</a>
      </div>

      <RelatedGuides current="emergency" count={4} />
    </main>
  )
}
