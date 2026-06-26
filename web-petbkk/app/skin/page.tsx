import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'ผิวหนังสัตว์เลี้ยง — โรคผิวหนัง คัน ขนร่วง และวิธีดูแล | ThailandPetHub',
  description: 'โรคผิวหนังสัตว์เลี้ยงพบบ่อย อาการคัน ขนร่วง สะเก็ด ผิวแดง สาเหตุและวิธีดูแล',
  alternates: { canonical: 'https://www.thailandpethub.com/skin' },
  keywords: ['สัตว์เลี้ยงคัน', 'สุนัขขนร่วง', 'แมวคัน', 'โรคผิวหนังสัตว์', 'สัตว์เลี้ยงผิวหนัง'],
  openGraph: {
    title: 'โรคผิวหนังสัตว์เลี้ยง — คัน ขนร่วง ผิวแดง',
    description: 'สาเหตุที่พบบ่อย และวิธีดูแลเบื้องต้นก่อนพาหมอ',
    url: 'https://www.thailandpethub.com/skin',
  },
}

function SkinSchemaLd() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'สัตว์เลี้ยงคันทั้งตัวสาเหตุคืออะไร?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'สาเหตุหลักได้แก่ หมัด/เห็บ, การแพ้อาหาร, การแพ้สิ่งแวดล้อม (เกสร ฝุ่น), ผิวหนังติดเชื้อรา หรือสะเก็ดเงิน ต้องตรวจหาสาเหตุจริงก่อนรักษา',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

const CONDITIONS = [
  { name: 'หมัด/เห็บ', symptoms: 'คันรุนแรง โดยเฉพาะหลังและโคนหาง', action: 'ยากำจัดหมัด', href: '/flea' },
  { name: 'แพ้อาหาร', symptoms: 'คัน ผิวแดง หู/ท้องอักเสบ มักหน้า/เท้า', action: 'Elimination diet', href: '/allergy' },
  { name: 'แพ้สิ่งแวดล้อม', symptoms: 'คันตามฤดูกาล ลูบตา จาม', action: 'Apoquel หรือยาแพทย์', href: null },
  { name: 'เชื้อรา (Ringworm)', symptoms: 'หัวโล้นเป็นวงกลม ขุยขาว ไม่คันมาก', action: 'ยาต้านเชื้อรา', href: null },
  { name: 'Pyoderma (ติดเชื้อแบคทีเรีย)', symptoms: 'ตุ่มหนอง สะเก็ด กลิ่นเหม็น', action: 'ยาปฏิชีวนะ', href: null },
  { name: 'ขาดสารอาหาร', symptoms: 'ขนหยาบ/ร่วง ผิวแห้ง', action: 'เพิ่ม Omega-3', href: '/supplements' },
]

export default function SkinPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <SkinSchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">ผิวหนัง</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🐾 โรคผิวหนังสัตว์เลี้ยง — คัน ขนร่วง ผิวแดง</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-2xl">
        โรคผิวหนังเป็นปัญหาที่พาสัตว์เลี้ยงมาหาหมอบ่อยที่สุด การวินิจฉัยสาเหตุที่ถูกต้องสำคัญมาก
      </p>

      <section className="mb-6">
        <h2 className="font-black text-gray-900 text-base mb-3">🔍 โรคผิวหนังที่พบบ่อย</h2>
        <div className="space-y-3">
          {CONDITIONS.map(c => (
            <div key={c.name} className="bg-white border border-gray-200 rounded-xl px-4 py-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-sm text-gray-800">{c.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{c.symptoms}</p>
                </div>
                {c.href ? (
                  <a href={c.href} className="text-xs text-orange-500 font-semibold flex-shrink-0 ml-2 underline">{c.action}</a>
                ) : (
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{c.action}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
        <h2 className="font-bold text-blue-700 text-sm mb-2">🏠 ดูแลที่บ้านเบื้องต้น</h2>
        <ul className="space-y-1.5">
          {['อาบน้ำด้วยแชมพูสัตว์เลี้ยง (ไม่ใช้แชมพูคน)', 'เพิ่ม Omega-3 ในอาหาร ช่วยผิวชุ่มชื้น', 'กำจัดหมัด/เห็บก่อนรักษาอาการคัน', 'สังเกตว่าคันหลังกินอาหารใหม่หรือไม่', 'ถ้าคันนาน > 1 สัปดาห์ พาหมอเพื่อตรวจ'].map(s => (
            <li key={s} className="flex items-center gap-2 text-xs text-blue-700">
              <span className="font-bold">✓</span>{s}
            </li>
          ))}
        </ul>
      </section>

      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
        <p className="font-bold text-red-700 text-sm mb-1">🚨 พาหมอทันทีถ้า</p>
        <ul className="space-y-1">
          {['ผิวเป็นแผลเปิด มีหนอง', 'คันจนเลือดออก หยุดเองไม่ได้', 'บวมขึ้นเรื่อยๆ', 'ผื่นลามเร็ว'].map(s => (
            <li key={s} className="text-xs text-red-600">✗ {s}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/allergy" className="px-4 py-2.5 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors">🤧 แพ้อาหาร?</a>
        <a href="/flea" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🦟 หมัด/เห็บ</a>
        <a href="/supplements" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">💊 Omega-3</a>
      </div>

      <RelatedGuides current="allergy" count={4} />
    </main>
  )
}
