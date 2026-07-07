import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'ดูแลขนและอาบน้ำสัตว์เลี้ยง — คู่มือ Grooming ครบฉบับ',
  description: 'วิธีอาบน้ำสุนัขและแมวที่บ้าน ตัดขน แปรงขน ตัดเล็บ และดูแลหูอย่างถูกต้อง ความถี่ที่แนะนำและสัญญาณที่ต้องไปร้าน Grooming',
  alternates: { canonical: 'https://www.thailandpethub.com/grooming' },
  keywords: ['อาบน้ำสุนัข', 'ดูแลขนแมว', 'grooming สัตว์เลี้ยง', 'ตัดขนสุนัข', 'ดูแลเล็บสัตว์เลี้ยง'],
  openGraph: {
    title: 'ดูแลขนและอาบน้ำสัตว์เลี้ยง — คู่มือ Grooming',
    description: 'วิธีอาบน้ำ แปรงขน ตัดเล็บ ดูแลหู สำหรับสุนัขและแมว',
    url: 'https://www.thailandpethub.com/grooming',
  },
}

function GroomingSchemaLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'คู่มือดูแลขนและ Grooming สัตว์เลี้ยง',
    description: 'วิธีอาบน้ำสุนัขและแมวที่บ้าน แปรงขน ตัดเล็บ ดูแลหู',
    url: 'https://www.thailandpethub.com/grooming',
    publisher: { '@type': 'Organization', name: 'ThailandPetHub', url: 'https://www.thailandpethub.com' },
    inLanguage: 'th',
  }
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'ควรอาบน้ำสุนัขบ่อยแค่ไหน?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'สุนัขพันธุ์ขนสั้นอาบน้ำทุก 4-6 สัปดาห์ พันธุ์ขนยาวทุก 2-4 สัปดาห์ ถ้าเหม็น ขนมัน หรือเปื้อนก็ควรอาบทันที ไม่ควรอาบบ่อยเกินไปเพราะจะทำให้ผิวแห้งและน้ำมันธรรมชาติสูญเสียไป',
        },
      },
      {
        '@type': 'Question',
        name: 'แมวต้องอาบน้ำไหม?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'แมวส่วนใหญ่ดูแลความสะอาดตัวเองได้ดีมาก ไม่จำเป็นต้องอาบน้ำบ่อย อาบน้ำเมื่อขนเปื้อนหนักหรือน้องมีปัญหาผิวหนัง สำหรับแมวที่ต้องอาบ ค่อยๆ ฝึกตั้งแต่ยังเล็กจะได้ผลดีกว่า',
        },
      },
    ],
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    </>
  )
}

const FREQ_TABLE = [
  { task: 'อาบน้ำสุนัขขนสั้น',   dog: 'ทุก 4-6 สัปดาห์',  cat: '—' },
  { task: 'อาบน้ำสุนัขขนยาว',    dog: 'ทุก 2-4 สัปดาห์',  cat: '—' },
  { task: 'อาบน้ำแมว',           dog: '—',                  cat: 'เมื่อจำเป็น' },
  { task: 'แปรงขน (ขนสั้น)',     dog: '1-2 ครั้ง/สัปดาห์', cat: '1-2 ครั้ง/สัปดาห์' },
  { task: 'แปรงขน (ขนยาว)',      dog: 'ทุกวัน',             cat: 'ทุกวัน' },
  { task: 'ตัดเล็บ',             dog: 'ทุก 2-4 สัปดาห์',   cat: 'ทุก 2-4 สัปดาห์' },
  { task: 'เช็ดหู',              dog: 'ทุก 1-2 สัปดาห์',   cat: 'ทุก 2-4 สัปดาห์' },
  { task: 'แปรงฟัน',             dog: '3+ ครั้ง/สัปดาห์',  cat: '3+ ครั้ง/สัปดาห์' },
]

const SECTIONS = [
  {
    emoji: '🛁',
    title: 'วิธีอาบน้ำสุนัขที่บ้าน',
    items: [
      'ใช้น้ำอุ่น (ไม่ร้อน ไม่เย็น) อุณหภูมิเดียวกับที่เราสบาย',
      'แปรงขนก่อนอาบน้ำเพื่อลดขนพัน และกำจัดขนที่หลุดร่วง',
      'ใช้แชมพูสำหรับสัตว์เลี้ยงเท่านั้น แชมพูคนมี pH ต่างกันและอาจระคายเคือง',
      'หลีกเลี่ยงน้ำและแชมพูเข้าหู — ใช้สำลีหรือนุ่นอุดหูระหว่างอาบ',
      'เป่าแห้งสนิทด้วยเครื่องเป่าผม (ระดับเย็นหรืออุ่น) ป้องกันเชื้อราและหนาวเย็น',
    ],
  },
  {
    emoji: '🪮',
    title: 'การแปรงขน',
    items: [
      'แปรงขนก่อนอาบน้ำเสมอ ขนที่พันกันเมื่อเปียกน้ำจะแก้ยากขึ้นมาก',
      'เลือกแปรงให้เหมาะกับประเภทขน: ขนยาวใช้ slicker brush, ขนสั้นใช้ rubber brush',
      'แปรงเบาๆ ตามทิศทางขนจากหัวถึงหาง หลีกเลี่ยงการดึงหรือดึงขนพัน',
      'ขนพันควรค่อยๆ คลาย อย่าตัดเองถ้าไม่แน่ใจ เพราะอาจบาดผิว',
    ],
  },
  {
    emoji: '✂️',
    title: 'การตัดเล็บ',
    items: [
      'ใช้กรรไกรตัดเล็บสัตว์เลี้ยงโดยเฉพาะ ไม่ใช้กรรไกรคนหรือที่ตัดคิ้ว',
      'ตัดเฉพาะส่วนโค้งขาว หลีกเลี่ยงเส้นสีชมพู (เส้นเลือด quick) ถ้าตัดโดนจะเลือดออก',
      'ถ้าเล็บสีดำไม่เห็น quick ให้ตัดทีละน้อยจนเห็นจุดสีเทาตรงกลาง',
      'เตรียม styptic powder หรือแป้งฝุ่นไว้กรณีเล็บเลือดออก',
    ],
  },
  {
    emoji: '👂',
    title: 'การดูแลหู',
    items: [
      'เช็คหูทุกสัปดาห์ สังเกตกลิ่น สีผิดปกติ หรือขี้หูมากผิดปกติ',
      'ใช้น้ำยาล้างหูสัตว์เลี้ยง หยดเข้าช่องหูแล้วนวดโคนหูเบาๆ 30 วินาที',
      'ให้สัตว์เลี้ยงสั่นหัวเพื่อช่วยไล่ขี้หูออก แล้วเช็คด้วยสำลีสะอาด',
      'ไม่ควรใช้ไม้พันสำลีเข้าในช่องหูลึกๆ อาจทำลายแก้วหู',
    ],
  },
]

export default function GroomingPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <GroomingSchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">ดูแลขน & Grooming</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🪮 ดูแลขนและ Grooming สัตว์เลี้ยง</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-2xl">
        การดูแลความสะอาดและขนของสัตว์เลี้ยงไม่ใช่แค่เรื่องความสวยงาม
        แต่ยังช่วยป้องกันโรคผิวหนัง ขนพัน หูอักเสบ และเล็บยาวที่อาจทำให้เดินเจ็บ
      </p>

      {/* Frequency table */}
      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">📅 ความถี่ที่แนะนำ</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 pr-4 text-gray-500 font-medium">งาน</th>
                <th className="text-center py-2 px-3 text-gray-700 font-semibold">🐕 สุนัข</th>
                <th className="text-center py-2 px-3 text-gray-700 font-semibold">🐈 แมว</th>
              </tr>
            </thead>
            <tbody>
              {FREQ_TABLE.map(row => (
                <tr key={row.task} className="border-b border-gray-50 last:border-0">
                  <td className="py-2.5 pr-4 text-gray-700">{row.task}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${row.dog === '—' ? 'text-gray-300' : 'bg-blue-50 text-blue-700'}`}>{row.dog}</span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${row.cat === '—' ? 'text-gray-300' : 'bg-purple-50 text-purple-700'}`}>{row.cat}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="space-y-6 mb-8">
        {SECTIONS.map(sec => (
          <section key={sec.title} className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="font-black text-gray-900 text-lg mb-4">{sec.emoji} {sec.title}</h2>
            <ul className="space-y-2.5">
              {sec.items.map(item => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <span className="text-orange-500 font-bold mt-0.5 flex-shrink-0">•</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-6">
        <p className="font-bold text-orange-700 text-sm mb-2">🏪 เมื่อไหร่ควรไปร้าน Grooming?</p>
        <ul className="space-y-1.5 text-xs text-orange-600">
          {['ขนพันหนักจนคลายเองไม่ได้', 'ต้องการตัดขนทรงพิเศษ (แต่งขน)', 'น้องกลัวหรือต่อต้านการตัดเล็บมาก', 'ต้องการบีบต่อมกลิ่น (Anal gland)'].map(s => (
            <li key={s} className="flex items-start gap-1.5"><span>•</span><span>{s}</span></li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/dental" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🦷 ดูแลฟัน</a>
        <a href="/deworming" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🪱 ถ่ายพยาธิ</a>
        <a href="/tips" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">📚 เคล็ดลับดูแล</a>
      </div>

      <RelatedGuides current="grooming" count={4} />
    </main>
  )
}
