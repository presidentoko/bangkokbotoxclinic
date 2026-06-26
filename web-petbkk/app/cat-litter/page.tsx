import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'ทรายแมว — เลือกยังไง Bentonite Tofu Silica เปรียบเทียบ | ThailandPetHub',
  description: 'เปรียบเทียบทรายแมวทุกประเภท Bentonite (ดินเหนียว) Tofu (ถั่วเหลือง) Silica และ Wood Pellet ข้อดีข้อเสีย ราคา และการเลือกที่เหมาะกับน้องแมว',
  alternates: { canonical: 'https://www.thailandpethub.com/cat-litter' },
  keywords: ['ทรายแมว', 'ทรายแมว bentonite', 'ทรายแมว tofu', 'ทรายแมวซิลิก้า', 'เลือกทรายแมว'],
  openGraph: {
    title: 'ทรายแมว — Bentonite Tofu Silica เปรียบเทียบและเลือกอย่างไร',
    description: 'เปรียบเทียบทรายแมวทุกประเภท ข้อดีข้อเสีย และวิธีเลือกที่เหมาะสม',
    url: 'https://www.thailandpethub.com/cat-litter',
  },
}

function CatLitterSchemaLd() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'ทรายแมวแบบไหนดีที่สุด?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ขึ้นอยู่กับความต้องการ ทรายเบนโทไนต์จับกลิ่นดีและราคาถูก ทรายเต้าหู้ (Tofu) ปลอดภัยถ้ากินและย่อยสลายได้ ทรายซิลิก้าดูดกลิ่นดีและเปลี่ยนไม่บ่อย แต่ราคาสูง แนะนำให้ทดลองและดูว่าแมวชอบแบบไหน',
        },
      },
      {
        '@type': 'Question',
        name: 'ควรเปลี่ยนทรายแมวบ่อยแค่ไหน?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ทรายจับก้อน: ตักก้อนทุกวัน เปลี่ยนทั้งกระบะทุก 2-4 สัปดาห์ ทรายซิลิก้า: คนทุกวัน เปลี่ยนทั้งกระบะทุก 1 เดือน ทรายเต้าหู้: ตักก้อนทุกวัน เปลี่ยนทั้งกระบะทุก 2-3 สัปดาห์',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

const LITTER_TYPES = [
  {
    name: 'Bentonite (ดินเหนียว)',
    icon: '🪨',
    odor: '⭐⭐⭐⭐',
    clumping: '⭐⭐⭐⭐⭐',
    price: '฿',
    safety: 'ปานกลาง (ฝุ่น)',
    pros: ['จับก้อนแน่น ตักง่าย', 'ราคาถูกที่สุด', 'แมวส่วนใหญ่ชอบ', 'กลิ่นถ่ายดูดซับได้ดี'],
    cons: ['ฝุ่นมาก ระวังปอด', 'หนัก ขนยาก', 'ย่อยสลายไม่ได้', 'กินเข้าไปอันตราย'],
  },
  {
    name: 'Tofu / เต้าหู้',
    icon: '🫘',
    odor: '⭐⭐⭐',
    clumping: '⭐⭐⭐⭐',
    price: '฿฿',
    safety: 'สูง',
    pros: ['ปลอดภัยถ้าแมวกิน', 'ย่อยสลายได้ (กลับมาดินได้)', 'ฝุ่นน้อย', 'น้ำหนักเบา'],
    cons: ['กลิ่นดูดซับน้อยกว่าเบนโทไนต์', 'แมวบางตัวไม่ชอบเนื้อสัมผัส', 'แข็งตัวช้ากว่า'],
  },
  {
    name: 'Silica / Crystal',
    icon: '💎',
    odor: '⭐⭐⭐⭐⭐',
    clumping: 'ไม่จับก้อน',
    price: '฿฿฿',
    safety: 'ปานกลาง',
    pros: ['ดูดกลิ่นดีเยี่ยม', 'เปลี่ยนไม่บ่อย (1 เดือน)', 'แห้งมาก'],
    cons: ['ราคาสูงกว่า', 'ไม่จับก้อน ตักยาก', 'อาจอันตรายถ้าแมวกิน', 'บางตัวไม่ชอบ'],
  },
  {
    name: 'Wood Pellet (ไม้อัดเม็ด)',
    icon: '🪵',
    odor: '⭐⭐⭐',
    clumping: 'แตกเป็นผง',
    price: '฿',
    safety: 'สูง',
    pros: ['ย่อยสลายได้ดี', 'กลิ่นไม้ธรรมชาติ', 'ราคาถูก'],
    cons: ['กลิ่นปัสสาวะอาจแรง', 'ต้องใช้กระบะสองชั้น', 'แมวส่วนใหญ่ไม่ค่อยชอบ'],
  },
]

export default function CatLitterPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <CatLitterSchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">ทรายแมว</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🐱 ทรายแมว — เลือกยังไงดี?</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-2xl">
        ทรายแมวที่ดีมีผลต่อสุขภาพและความสะอาดในบ้าน รวมถึงความพึงพอใจของแมว
        แมวที่ไม่ชอบทรายอาจเลือกฉี่นอกกระบะได้ ดังนั้นการเลือกให้เหมาะสมสำคัญมาก
      </p>

      <div className="space-y-4 mb-8">
        {LITTER_TYPES.map(t => (
          <div key={t.name} className="bg-white rounded-2xl border shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{t.icon}</span>
              <div className="flex-1">
                <h2 className="font-black text-gray-900 text-base">{t.name}</h2>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                  <span>กลิ่น: {t.odor}</span>
                  <span>จับก้อน: {t.clumping}</span>
                  <span className="font-semibold text-orange-500">{t.price}</span>
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${t.safety === 'สูง' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-600'}`}>ความปลอดภัย: {t.safety}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-semibold text-green-600 mb-1">✓ ข้อดี</p>
                <ul className="space-y-0.5">
                  {t.pros.map(p => <li key={p} className="text-xs text-gray-600 flex gap-1.5"><span className="text-green-400">•</span>{p}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-red-500 mb-1">✗ ข้อเสีย</p>
                <ul className="space-y-0.5">
                  {t.cons.map(c => <li key={c} className="text-xs text-gray-600 flex gap-1.5"><span className="text-red-400">•</span>{c}</li>)}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-base mb-4">📦 เคล็ดลับกระบะทราย</h2>
        <ul className="space-y-2">
          {[
            'จำนวนกระบะ = จำนวนแมว + 1 (2 แมว = 3 กระบะ)',
            'ขนาดกระบะ = อย่างน้อย 1.5× ความยาวลำตัวแมว',
            'ใส่ทรายลึก 5-8 ซม. (แมวชอบขุด)',
            'วางในที่เงียบ ไม่ใกล้อาหาร ไม่ถูกรบกวน',
            'แมวสูงอายุหรือมีข้อปัญหา ให้กระบะขอบเตี้ย',
            'เปลี่ยนทรายบ่อยขึ้นถ้ามีแมวหลายตัว',
          ].map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-orange-500 font-bold mt-0.5 flex-shrink-0">•</span>{s}
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/cat-behavior" className="px-4 py-2.5 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors">🐱 พฤติกรรมแมว</a>
        <a href="/potty-training" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🚽 ฝึกฉี่ถูกที่</a>
        <a href="/food/cat" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🍖 อาหารแมว</a>
      </div>

      <RelatedGuides current="cat-behavior" count={4} />
    </main>
  )
}
