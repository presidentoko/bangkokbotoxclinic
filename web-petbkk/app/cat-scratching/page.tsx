import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'แมวข่วนเฟอร์นิเจอร์ — วิธีหยุดและเปลี่ยนพฤติกรรม',
  description: 'ทำไมแมวถึงข่วน วิธีหยุดแมวข่วนโซฟาและเฟอร์นิเจอร์ สิ่งที่ต้องจัดเตรียม และวิธีฝึกให้ข่วนในที่ที่ถูกต้อง',
  alternates: { canonical: 'https://www.thailandpethub.com/cat-scratching' },
  keywords: ['แมวข่วนโซฟา', 'หยุดแมวข่วน', 'เสาข่วน', 'แมวข่วนเฟอร์นิเจอร์', 'ฝึกแมว'],
  openGraph: {
    title: 'แมวข่วนเฟอร์นิเจอร์ — วิธีแก้และเปลี่ยนพฤติกรรม',
    description: 'ทำไมแมวข่วน วิธีหยุด และวิธีให้น้องข่วนในที่ที่ถูกต้อง',
    url: 'https://www.thailandpethub.com/cat-scratching',
  },
}

function ScratchSchemaLd() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'ทำไมแมวถึงชอบข่วน?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'การข่วนเป็นพฤติกรรมธรรมชาติที่แมวทุกตัวต้องทำ มีหลายสาเหตุ: (1) ลับเล็บ — ลอกชั้นนอกเก่าออก (2) ยืดกล้ามเนื้อและเอ็น (3) ทำเครื่องหมาย — ต่อมน้ำมันที่เท้าทิ้งกลิ่น (4) ระบายอารมณ์ความเครียด',
        },
      },
      {
        '@type': 'Question',
        name: 'ห้ามแมวข่วนได้ไหม?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ห้ามแมวข่วนทั้งหมดไม่ได้และไม่ควรทำ เพราะเป็นความต้องการพื้นฐาน สิ่งที่ทำได้คือ redirect ให้ข่วนในที่ที่เหมาะสม (เสาข่วน/กระดาษลูกฟูก) แทนเฟอร์นิเจอร์',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

const SOLUTIONS = [
  { title: 'จัดเสาข่วนในที่ที่ดีที่สุด', desc: 'วางใกล้โซฟา หน้าต่าง หรือที่แมวชอบ ไม่ใช่มุมห้องไม่มีใครเห็น แมวข่วนเพื่อ "ทำเครื่องหมาย" ต้องการให้เห็น' },
  { title: 'เลือกวัสดุที่แมวชอบ', desc: 'แมวแต่ละตัวชอบต่างกัน — ลองทั้งไม้, sisal rope, กระดาษลูกฟูก, พรม ส่วนใหญ่ชอบ sisal rope' },
  { title: 'เสาต้องสูงพอ', desc: 'สูงอย่างน้อย 60-90 ซม. แมวต้องยืดตัวได้เต็มที่ เสาเตี้ยเกินไปถูกเพิกเฉย' },
  { title: 'ปิดกั้นเฟอร์นิเจอร์ชั่วคราว', desc: 'ใช้ double-sided tape, แผ่นพลาสติก, หรือฟอยล์อะลูมิเนียมติดโซฟา ระหว่างรอให้แมวคุ้นเคยเสาข่วนใหม่' },
  { title: 'ใช้สเปรย์กลิ่น (Pheromone)', desc: 'Feliway Classic ช่วยลดความเครียด ลดแรงกระตุ้นข่วน ราคาแพงแต่ได้ผลสำหรับแมวบางตัว' },
  { title: 'ตัดเล็บสม่ำเสมอ', desc: 'ตัดเล็บทุก 2-3 สัปดาห์ ลดความเสียหายจากการข่วน แต่ไม่หยุดพฤติกรรม' },
]

const SURFACE_PREFERENCE = [
  { surface: 'Sisal Rope', rating: '⭐⭐⭐⭐⭐', note: 'ชนิดที่นิยมที่สุด สัมผัสดี เกาะได้ดี' },
  { surface: 'กระดาษลูกฟูก', rating: '⭐⭐⭐⭐', note: 'ราคาถูก แมวหลายตัวชอบมาก แนวนอน' },
  { surface: 'ไม้ธรรมชาติ', rating: '⭐⭐⭐⭐', note: 'ทนทาน แมวที่ชอบต้นไม้มักชอบ' },
  { surface: 'พรม', rating: '⭐⭐⭐', note: 'ระวัง แมวอาจข่วนพรมจริงด้วย' },
]

export default function CatScratchingPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <ScratchSchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">แมวข่วนเฟอร์นิเจอร์</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🐾 แมวข่วนเฟอร์นิเจอร์ — วิธีแก้ที่ได้ผลจริง</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-2xl">
        การข่วนเป็นความต้องการพื้นฐานของแมว ไม่สามารถห้ามได้ทั้งหมด
        แต่สามารถ redirect ให้ข่วนในที่ที่เหมาะสมได้ด้วยการจัดสภาพแวดล้อมให้ถูกต้อง
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
        <p className="font-bold text-blue-700 text-sm mb-1">💡 ทำไมแมวข่วน?</p>
        <ul className="text-xs text-blue-600 space-y-1">
          {['ลับเล็บ — ลอกชั้นเก่าออก', 'ยืดกล้ามเนื้อและเอ็น', 'ทำเครื่องหมายกลิ่น (ต่อมน้ำมันที่อุ้งตีน)', 'ระบายความเครียดและอารมณ์'].map(r => (
            <li key={r} className="flex items-center gap-1.5"><span>•</span>{r}</li>
          ))}
        </ul>
      </div>

      <section className="mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">✅ 6 วิธีแก้ที่ได้ผล</h2>
        <div className="space-y-3">
          {SOLUTIONS.map((s, i) => (
            <div key={s.title} className="bg-white rounded-2xl border shadow-sm p-4 flex gap-3">
              <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
              <div>
                <p className="font-bold text-sm text-gray-800">{s.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-5 mb-6">
        <h2 className="font-black text-gray-900 text-base mb-4">🪵 วัสดุเสาข่วนที่แมวชอบ</h2>
        <div className="space-y-2">
          {SURFACE_PREFERENCE.map(s => (
            <div key={s.surface} className="flex items-center gap-3 text-sm border-b border-gray-50 pb-2 last:border-0">
              <span className="font-bold text-gray-700 w-32 flex-shrink-0">{s.surface}</span>
              <span className="text-yellow-500 text-xs">{s.rating}</span>
              <span className="text-gray-500 text-xs">{s.note}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/cat-behavior" className="px-4 py-2.5 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors">🐱 พฤติกรรมแมว</a>
        <a href="/grooming" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🪮 ตัดเล็บแมว</a>
        <a href="/kitten-care" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🐱 เลี้ยงลูกแมว</a>
      </div>

      <RelatedGuides current="cat-scratching" count={4} />
    </main>
  )
}
