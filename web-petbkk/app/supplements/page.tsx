import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'อาหารเสริมสัตว์เลี้ยง — โอเมก้า 3 กลูโคซามีน โพรไบโอติก | ThailandPetHub',
  description: 'คู่มืออาหารเสริมสำหรับสุนัขและแมว น้ำมันปลา โอเมก้า 3 กลูโคซามีน โพรไบโอติก วิตามิน ตัวไหนจำเป็น ตัวไหนไม่ต้องซื้อ',
  alternates: { canonical: 'https://www.thailandpethub.com/supplements' },
  keywords: ['อาหารเสริมสัตว์เลี้ยง', 'โอเมก้า 3 สุนัข', 'กลูโคซามีนสุนัข', 'โพรไบโอติกแมว', 'วิตามินสัตว์เลี้ยง'],
  openGraph: {
    title: 'อาหารเสริมสัตว์เลี้ยง — ตัวไหนจำเป็น ตัวไหนไม่ต้องซื้อ',
    description: 'คู่มืออาหารเสริม โอเมก้า 3 กลูโคซามีน โพรไบโอติก สำหรับสุนัขและแมว',
    url: 'https://www.thailandpethub.com/supplements',
  },
}

function SupplementsSchemaLd() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'สัตว์เลี้ยงที่กินอาหารสำเร็จรูปคุณภาพดีจำเป็นต้องกินอาหารเสริมไหม?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'โดยทั่วไปไม่จำเป็น อาหารสำเร็จรูป "complete and balanced" ที่ผ่านมาตรฐาน AAFCO มีสารอาหารครบแล้ว อาหารเสริมมักจำเป็นในกรณีที่มีโรคเฉพาะ (ข้อ ไต ผิวหนัง) หรืออาหารที่กินไม่ครบ',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

const SUPPLEMENTS = [
  {
    name: 'โอเมก้า 3 / น้ำมันปลา',
    icon: '🐟',
    benefit: 'ขนเงางาม ลดอักเสบ สนับสนุนสมองและหัวใจ',
    best_for: 'ทุกตัว โดยเฉพาะน้องที่ผิวแห้ง คันเรื้อรัง หรือข้ออักเสบ',
    dose: '20-55 mg EPA+DHA ต่อ น้ำหนักตัว 1 กก./วัน',
    note: 'เลือกน้ำมันปลา (salmon, sardine) ไม่ใช่ น้ำมันตับปลา (สูงวิตามิน A)',
    verdict: 'แนะนำ',
  },
  {
    name: 'กลูโคซามีน + คอนดรอยติน',
    icon: '🦴',
    benefit: 'สนับสนุนสุขภาพข้อต่อและกระดูกอ่อน',
    best_for: 'สุนัขสายพันธุ์ใหญ่ สัตว์สูงอายุ หรือที่มีปัญหาข้อ',
    dose: '20 mg/kg กลูโคซามีน ต่อวัน',
    note: 'ควรใช้ร่วมกับ MSM สำหรับผลดีที่สุด ต้องใช้ต่อเนื่อง 4-8 สัปดาห์จึงเห็นผล',
    verdict: 'แนะนำสำหรับน้องสูงวัย/สายพันธุ์ใหญ่',
  },
  {
    name: 'โพรไบโอติก',
    icon: '🦠',
    benefit: 'สมดุลจุลินทรีย์ในลำไส้ ลดท้องเสีย ท้องอืด',
    best_for: 'น้องที่มีปัญหาระบบย่อยอาหาร หรือหลังกินยาปฏิชีวนะ',
    dose: 'ตามฉลาก เลือกชนิดที่ผ่านการวิจัยในสัตว์ (Enterococcus faecium)',
    note: 'ควรเลือกสูตรสำหรับสัตว์เลี้ยงโดยเฉพาะ ไม่ใช่สำหรับคน',
    verdict: 'แนะนำสถานการณ์เฉพาะ',
  },
  {
    name: 'วิตามิน E + C',
    icon: '💊',
    benefit: 'สารต้านอนุมูลอิสระ ระบบภูมิคุ้มกัน',
    best_for: 'ส่วนใหญ่ไม่จำเป็นถ้ากินอาหารสำเร็จรูป AAFCO',
    dose: 'ขึ้นอยู่กับผลิตภัณฑ์',
    note: 'วิตามิน C สุนัขผลิตเองได้ ไม่ต้องเสริม ยกเว้นมีโรคบางชนิด',
    verdict: 'ไม่จำเป็นสำหรับส่วนใหญ่',
  },
  {
    name: 'ไบโอติน (Biotin)',
    icon: '✨',
    benefit: 'สนับสนุนสุขภาพขนและผิวหนัง',
    best_for: 'น้องที่ขนร่วงผิดปกติหรือผิวหนังแห้ง',
    dose: 'ตามฉลาก',
    note: 'ถ้าสาเหตุขนร่วงไม่ใช่การขาดไบโอติน การเสริมจะไม่ช่วย ปรึกษาสัตวแพทย์ก่อน',
    verdict: 'ตามอาการ',
  },
]

const VERDICT_COLORS: Record<string, string> = {
  'แนะนำ': 'bg-green-100 text-green-700',
  'แนะนำสำหรับน้องสูงวัย/สายพันธุ์ใหญ่': 'bg-blue-100 text-blue-700',
  'แนะนำสถานการณ์เฉพาะ': 'bg-yellow-100 text-yellow-700',
  'ไม่จำเป็นสำหรับส่วนใหญ่': 'bg-gray-100 text-gray-500',
  'ตามอาการ': 'bg-purple-100 text-purple-600',
}

export default function SupplementsPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <SupplementsSchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">อาหารเสริม</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">💊 อาหารเสริมสัตว์เลี้ยง</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-2 max-w-2xl">
        อาหารเสริมสำหรับสัตว์เลี้ยงมีให้เลือกหลากหลาย แต่ไม่ใช่ทุกชนิดที่จำเป็น
        ถ้าสัตว์เลี้ยงกินอาหาร "complete and balanced" คุณภาพดีอยู่แล้ว
        มักไม่ต้องเสริมอะไรเพิ่ม
      </p>
      <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-2xl">
        ปรึกษาสัตวแพทย์ก่อนเริ่มอาหารเสริมใหม่ โดยเฉพาะถ้าน้องมีโรคประจำตัว
      </p>

      <div className="space-y-4 mb-8">
        {SUPPLEMENTS.map(s => (
          <div key={s.name} className="bg-white rounded-2xl border shadow-sm p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{s.icon}</span>
                <h2 className="font-black text-gray-900 text-base">{s.name}</h2>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ml-2 ${VERDICT_COLORS[s.verdict]}`}>{s.verdict}</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{s.benefit}</p>
            <div className="space-y-1 text-xs text-gray-400">
              <p><span className="font-medium text-gray-500">เหมาะกับ:</span> {s.best_for}</p>
              <p><span className="font-medium text-gray-500">ขนาด:</span> {s.dose}</p>
              {s.note && <p className="text-blue-500 italic">{s.note}</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
        <p className="font-bold text-amber-700 text-sm mb-2">⚠️ ข้อควรระวัง</p>
        <ul className="space-y-1.5 text-xs text-amber-600">
          {[
            'อาหารเสริม "มากเกินไป" อาจเป็นอันตราย เช่น วิตามิน A D สะสมในตับ',
            'ห้ามให้อาหารเสริมสำหรับคนโดยไม่ปรึกษาสัตวแพทย์',
            'Xylitol ในอาหารเสริมบางชนิดอันตรายสำหรับสุนัขมาก',
            'บางชนิดอาจมีปฏิกิริยากับยาที่น้องกินอยู่',
          ].map(w => <li key={w} className="flex items-start gap-1.5"><span>•</span><span>{w}</span></li>)}
        </ul>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/food" className="px-4 py-2.5 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors">🍖 ตรวจสอบอาหาร</a>
        <a href="/allergy" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🤧 อาหารแพ้</a>
        <a href="/hospital" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🏥 ปรึกษาสัตวแพทย์</a>
      </div>

      <RelatedGuides current="tips" count={4} />
    </main>
  )
}
