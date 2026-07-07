import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'สัตว์เลี้ยงแยกเจ้าของไม่ได้ (Separation Anxiety) — สัญญาณและวิธีแก้',
  description: 'สุนัขหรือแมวมีอาการวิตกกังวลเมื่อแยกจากเจ้าของ เห่า ทำลายข้าวของ ฉี่ผิดที่ วิธีช่วยน้องรับมือกับการอยู่คนเดียวอย่างปลอดภัย',
  alternates: { canonical: 'https://www.thailandpethub.com/anxiety' },
  keywords: ['สุนัข separation anxiety', 'สุนัขวิตกกังวล', 'สัตว์เลี้ยงอยู่คนเดียวไม่ได้', 'แก้นิสัยสุนัขเห่า', 'สุนัขทำลายข้าวของ'],
  openGraph: {
    title: 'สัตว์เลี้ยงวิตกกังวลเมื่อแยกจากเจ้าของ — สัญญาณและวิธีแก้',
    description: 'วิธีช่วยสุนัขและแมวรับมือกับการอยู่คนเดียว',
    url: 'https://www.thailandpethub.com/anxiety',
  },
}

function AnxietySchemaLd() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'วิธีรักษา separation anxiety ในสุนัขมีอะไรบ้าง?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'วิธีหลักคือการฝึก desensitization ค่อยๆ เพิ่มเวลาที่อยู่ตามลำพัง ใช้ของเล่นกระตุ้นสมอง กรณีรุนแรงอาจต้องใช้ยากล่อมประสาท สำหรับสุนัข ให้ปรึกษาสัตวแพทย์หรือ animal behaviorist',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

const SIGNS = [
  { sign: 'เห่า/ร้องต่อเนื่อง', detail: 'เริ่มเมื่อเจ้าของออกไปหรือกำลังจะออก' },
  { sign: 'ทำลายข้าวของ', detail: 'โดยเฉพาะบริเวณทางออก ประตู หน้าต่าง' },
  { sign: 'ฉี่/อึผิดที่', detail: 'แม้น้องปกติฉี่ถูกที่เสมอ' },
  { sign: 'ปฏิเสธอาหาร', detail: 'เมื่ออยู่คนเดียว แม้ปกติกินเก่ง' },
  { sign: 'เดินวนซ้ำๆ', detail: 'พฤติกรรมซ้ำๆ (stereotypy) จากความเครียด' },
  { sign: 'ติดตามเจ้าของทุกที่', detail: 'ไม่ยอมอยู่คนเดียวแม้ชั่วคราว' },
]

const STEPS = [
  { title: 'ฝึก desensitization', detail: 'เริ่มออกจากบ้านสั้นๆ แค่ 30 วินาที กลับมา ค่อยๆ เพิ่มเวลาทุกวัน สำคัญ: ออก-เข้า ต้องเงียบๆ ไม่โอ้อ้า', icon: '⏱️' },
  { title: 'สัญญาณออกจากบ้านที่ไม่ทำให้เครียด', detail: 'น้องตอบสนองต่อสัญญาณ เช่น หยิบกุญแจ = น้องวิตก ฝึกหยิบกุญแจบ่อยๆ โดยไม่ออกไปไหน', icon: '🔑' },
  { title: 'กระตุ้นสมองก่อนออก', detail: 'เล่นหนักหรือให้ puzzle feeder ก่อนออก น้องที่เหนื่อยจะสงบกว่า', icon: '🧠' },
  { title: 'Safe space', detail: 'ฝึกให้น้องชอบกรงหรือที่นอน ที่รู้สึกปลอดภัย ใส่เสื้อหรือกลิ่นเจ้าของ', icon: '🏠' },
  { title: 'ไม่ทำโทษ', detail: 'การทำลายข้าวของเกิดจากความเครียด ไม่ใช่ความดื้อ การลงโทษทำให้แย่ลง', icon: '❤️' },
]

export default function AnxietyPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <AnxietySchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">Separation Anxiety</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">😰 สัตว์เลี้ยงวิตกกังวลเมื่อแยกจากเจ้าของ</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-2 max-w-2xl">
        Separation Anxiety เป็นภาวะที่สัตว์เลี้ยงไม่สามารถรับมือกับการอยู่คนเดียวได้
        ไม่ใช่ความดื้อหรือนิสัยเสีย แต่เป็นความเครียดทางจิตใจที่ต้องการความช่วยเหลือ
      </p>
      <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-2xl">
        พบบ่อยมากขึ้นหลัง WFH ระบาด เพราะน้องเคยชินกับเจ้าของอยู่บ้านตลอด
      </p>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">🔍 สัญญาณที่บ่งบอก</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SIGNS.map(s => (
            <div key={s.sign} className="border border-gray-100 rounded-xl p-3">
              <p className="font-bold text-sm text-gray-800 mb-0.5">{s.sign}</p>
              <p className="text-xs text-gray-500">{s.detail}</p>
            </div>
          ))}
        </div>
        <div className="bg-blue-50 rounded-xl p-3 mt-4">
          <p className="text-xs font-semibold text-blue-700">💡 วิธียืนยัน</p>
          <p className="text-xs text-blue-600 mt-0.5">ติดกล้องบันทึกพฤติกรรมตอนออกจากบ้าน น้องที่ทำลายข้าวของเฉพาะตอนเจ้าของไม่อยู่ มักมี separation anxiety</p>
        </div>
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">🛠️ วิธีช่วยน้อง</h2>
        <div className="space-y-4">
          {STEPS.map(step => (
            <div key={step.title} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <span className="text-2xl flex-shrink-0">{step.icon}</span>
              <div>
                <p className="font-bold text-gray-800 text-sm">{step.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6">
        <p className="font-bold text-amber-700 text-sm mb-2">🏥 เมื่อไหร่ควรปรึกษาผู้เชี่ยวชาญ?</p>
        <ul className="space-y-1.5 text-xs text-amber-600">
          {['อาการรุนแรง ไม่ดีขึ้นหลังฝึก 4-6 สัปดาห์', 'น้องทำร้ายตัวเอง', 'ไม่กินอาหารเลยตอนอยู่คนเดียว', 'ฝึก desensitization ไม่ได้ผล'].map(i => (
            <li key={i} className="flex items-start gap-1.5"><span>•</span><span>{i}</span></li>
          ))}
        </ul>
        <p className="text-xs text-amber-700 font-medium mt-2">ยา anxiolytics เช่น Reconcile (fluoxetine) อาจช่วยได้ร่วมกับ behavior modification</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/training" className="px-4 py-2.5 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors">🎓 ฝึกสุนัขเบื้องต้น</a>
        <a href="/tips" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">📚 เคล็ดลับดูแลน้อง</a>
        <a href="/hospital" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🏥 ปรึกษาสัตวแพทย์</a>
      </div>

      <RelatedGuides current="anxiety" count={4} />
    </main>
  )
}
