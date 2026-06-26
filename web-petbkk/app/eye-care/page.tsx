import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'ตาสัตว์เลี้ยงเป็นหนอง/อักเสบ — สาเหตุและวิธีดูแล | ThailandPetHub',
  description: 'ตาแมวตาสุนัขเป็นหนอง น้ำตาไหล ตาแดง สาเหตุที่พบบ่อย วิธีดูแลที่บ้าน และอาการที่ต้องพาสัตวแพทย์',
  alternates: { canonical: 'https://www.thailandpethub.com/eye-care' },
  keywords: ['ตาแมวเป็นหนอง', 'ตาสุนัขอักเสบ', 'สัตว์เลี้ยงตาแดง', 'น้ำตาไหลแมว', 'ดูแลตาสัตว์เลี้ยง'],
  openGraph: {
    title: 'ตาสัตว์เลี้ยงเป็นหนอง — สาเหตุและวิธีดูแล',
    description: 'ตาแดง น้ำตา หนองตา ดูแลได้ที่บ้านหรือต้องพาหมอ?',
    url: 'https://www.thailandpethub.com/eye-care',
  },
}

function EyeSchemaLd() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'ตาแมวมีขี้ตาควรทำอย่างไร?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ขี้ตาน้ำตาล/เทาในปริมาณน้อยเป็นเรื่องปกติ เช็ดด้วยผ้าสะอาดชุบน้ำอุ่นเบาๆ แต่ถ้าขี้ตาเป็นสีเหลืองเขียว หรือมาก หรือตาแดงบวม ควรพาสัตวแพทย์',
        },
      },
      {
        '@type': 'Question',
        name: 'ตาสุนัขแดงบวม ทำได้เองไหม?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ห้ามใช้ยาหยอดตาคนกับสัตว์เลี้ยง เพราะอาจมีสารที่เป็นอันตราย ล้างด้วย saline สำหรับสัตว์เลี้ยงได้ แต่ถ้าตาแดงบวม มีหนอง หรือน้องขยี้ตาตลอด ควรพาสัตวแพทย์ภายใน 24 ชั่วโมง',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

const CONDITIONS = [
  { name: 'ขี้ตาปกติ (น้ำตาล/เทา)', severity: 'ปกติ', cause: 'ร่างกายขจัดฝุ่นและเซลล์', action: 'เช็ดด้วยผ้าชุบน้ำอุ่น ไม่ต้องทำอะไรพิเศษ' },
  { name: 'น้ำตาไหลมาก (epiphora)', severity: 'เฝ้าดู', cause: 'ขนเกสร ฝุ่น ใบหน้าหน้าแบน (Pug/Persian)', action: 'เช็ดทำความสะอาดรอบตา ถ้าไม่ดีขึ้นใน 2-3 วัน พาหมอ' },
  { name: 'ขี้ตาสีเหลือง/เขียว', severity: 'พาหมอ', cause: 'การติดเชื้อแบคทีเรีย', action: 'ต้องยาหยอดตาจากสัตวแพทย์' },
  { name: 'ตาแดง บวม', severity: 'พาหมอ', cause: 'เยื่อตาอักเสบ ต้อหิน ของแปลก', action: 'พาหมอภายใน 24 ชั่วโมง' },
  { name: 'น้องขยี้ตาตลอด', severity: 'พาหมอ', cause: 'เจ็บปวด คันมาก ของแปลก', action: 'ห้ามปล่อยไว้ เสี่ยงตาช้ำ พาหมอ' },
  { name: 'ตาขุ่น เนื้อขาวขึ้น', severity: 'พาหมอด่วน', cause: 'ต้อกระจก ต้อหิน กระจกตาถลอก', action: 'พาหมอทันที' },
]

const SEVERITY_COLORS: Record<string, string> = {
  'ปกติ': 'bg-green-100 text-green-700',
  'เฝ้าดู': 'bg-yellow-100 text-yellow-700',
  'พาหมอ': 'bg-orange-100 text-orange-700',
  'พาหมอด่วน': 'bg-red-500 text-white',
}

export default function EyeCarePage() {
  return (
    <main className="max-w-3xl mx-auto">
      <EyeSchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">ดูแลตา</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">👁️ ตาสัตว์เลี้ยงมีปัญหา — สาเหตุและวิธีดูแล</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-2xl">
        ตาเป็นอวัยวะที่บ่งบอกสุขภาพโดยรวมได้ดี
        รู้จักสัญญาณที่ควรดูแลเองกับสัญญาณที่ต้องพาสัตวแพทย์ทันที
      </p>

      <section className="mb-6">
        <h2 className="font-black text-gray-900 text-base mb-4">🔍 อาการและความเร่งด่วน</h2>
        <div className="space-y-2">
          {CONDITIONS.map(c => (
            <div key={c.name} className="bg-white rounded-xl border shadow-sm p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-sm text-gray-800">{c.name}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ml-2 ${SEVERITY_COLORS[c.severity]}`}>{c.severity}</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-1 text-xs">
                <div><span className="text-gray-400">สาเหตุ:</span> <span className="text-gray-600">{c.cause}</span></div>
                <div><span className="text-gray-400">ทำอะไร:</span> <span className="text-blue-600">{c.action}</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-5 mb-6">
        <h2 className="font-black text-gray-900 text-base mb-3">🧹 วิธีทำความสะอาดตา</h2>
        <ol className="space-y-2">
          {[
            'ใช้ผ้าสะอาดชุบน้ำอุ่น (หรือ saline สำหรับสัตว์เลี้ยง)',
            'เช็ดจากหัวตาออกมาด้านนอก ไม่เช็ดกลับ',
            'ใช้ผ้าแยกทำความสะอาดแต่ละตา',
            'ห้ามใช้ยาหยอดตาคน (มีส่วนผสมที่เป็นอันตราย)',
            'ห้ามใช้ cotton ball ที่ขนติดตาได้',
          ].map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-orange-500 font-bold flex-shrink-0">{i + 1}.</span>{s}
            </li>
          ))}
        </ol>
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
        <p className="font-bold text-blue-700 text-sm mb-1">🐱 แมวหน้าแบน (Flat-faced) พิเศษ</p>
        <p className="text-xs text-blue-600">Persian, Exotic, Scottish Fold มักมีน้ำตาไหลตลอดเพราะโครงสร้างหน้า ต้องเช็ดรอบตาทุกวันเพื่อป้องกันเชื้อรา ไม่ใช่สัญญาณอันตรายเสมอ</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/emergency" className="px-4 py-2.5 bg-red-500 text-white font-semibold rounded-xl text-sm hover:bg-red-600 transition-colors">🚨 คู่มือฉุกเฉิน</a>
        <a href="/grooming" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🪮 Grooming</a>
        <a href="/hospital" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🏥 หาโรงพยาบาล</a>
      </div>

      <RelatedGuides current="emergency" count={4} />
    </main>
  )
}
