import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'วิธีให้ยาสัตว์เลี้ยง — ยาเม็ด ยาน้ำ และยาหยอด | ThailandPetHub',
  description: 'เทคนิคให้ยาสุนัขและแมวที่ไม่ยอมกินยา วิธีซ่อนยาในอาหาร วิธีกล้ำยาเม็ด ยาน้ำ และยาหยอดตา/หู สำหรับเจ้าของที่ทำเองที่บ้าน',
  alternates: { canonical: 'https://www.thailandpethub.com/medicine-tips' },
  keywords: ['วิธีให้ยาแมว', 'วิธีให้ยาสุนัข', 'สัตว์เลี้ยงไม่กินยา', 'กล้ำยาสุนัข', 'ซ่อนยาในอาหาร'],
  openGraph: {
    title: 'วิธีให้ยาสัตว์เลี้ยง — เทคนิคสำหรับน้องที่ไม่ยอมกิน',
    description: 'ให้ยาสุนัขและแมวที่บ้าน ยาเม็ด ยาน้ำ ยาหยอด ทำได้เอง',
    url: 'https://www.thailandpethub.com/medicine-tips',
  },
}

function MedicineSchemaLd() {
  const howto = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'วิธีให้ยาเม็ดแมวและสุนัข',
    step: [
      { '@type': 'HowToStep', name: 'ห่อตัว/จับให้มั่น', text: 'ห่อแมวด้วยผ้าขนหนูเพื่อจำกัดอุ้งเท้า จับสุนัขให้นิ่งที่ร่างกาย' },
      { '@type': 'HowToStep', name: 'เปิดปาก', text: 'ใช้นิ้วโป้งและนิ้วชี้บีบมุมปากเบาๆ หรือใช้มือกดหัวเปิดปากกว้าง' },
      { '@type': 'HowToStep', name: 'วางยาบนโคนลิ้น', text: 'วางยาเม็ดไกลสุดที่โคนลิ้น ด้านหลังเส้น V ของลิ้น' },
      { '@type': 'HowToStep', name: 'ปิดปากและลูบคอ', text: 'ปิดปากน้อง ยกหัวขึ้นเล็กน้อย ลูบคอเบาๆ จนได้ยินเสียงกลืน' },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howto) }} />
}

const HIDE_IN_FOOD = [
  { food: 'ขนม Pill Pocket', note: 'ขนมสำหรับซ่อนยาโดยเฉพาะ ราคาสมเหตุผล หาซื้อที่ร้านสัตว์' },
  { food: 'เนยถั่ว (ไม่มี Xylitol)', note: 'เหมาะสุนัข ตรวจสอบส่วนผสมว่าไม่มี Xylitol ก่อนใช้' },
  { food: 'ชีสนิ่ม/cream cheese', note: 'สุนัขและแมวบางตัว ปริมาณน้อยๆ' },
  { food: 'อาหารเปียกพิเศษ', note: 'ซ่อนยาในอาหาร wet food ที่กลิ่นแรง' },
  { food: 'ไก่ต้มชิ้นเล็ก', note: 'ห่อยาแล้วซ่อนกลางชิ้นไก่' },
]

export default function MedicineTipsPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <MedicineSchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">วิธีให้ยา</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">💊 วิธีให้ยาสัตว์เลี้ยงที่ไม่ยอมกิน</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-2xl">
        สัตว์เลี้ยงส่วนใหญ่ไม่ยอมกินยาตรงๆ แต่มีหลายเทคนิคที่ช่วยได้
        ตั้งแต่การซ่อนยาในอาหารไปจนถึงวิธีกล้ำยาเม็ดที่ถูกต้อง
      </p>

      <section className="bg-white rounded-2xl border shadow-sm p-5 mb-6">
        <h2 className="font-black text-gray-900 text-base mb-4">🍗 ซ่อนยาในอาหาร (วิธีง่ายที่สุด)</h2>
        <div className="space-y-2">
          {HIDE_IN_FOOD.map(h => (
            <div key={h.food} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
              <span className="text-orange-500 font-black text-base flex-shrink-0 mt-0.5">•</span>
              <div>
                <p className="font-semibold text-sm text-gray-800">{h.food}</p>
                <p className="text-xs text-gray-500">{h.note}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-yellow-600 bg-yellow-50 rounded-xl p-2">
          💡 เทคนิค: ให้อาหารเปล่า 1-2 ชิ้นก่อน แล้วตามด้วยชิ้นที่มียา น้องจะไม่สงสัย
        </div>
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-5 mb-6">
        <h2 className="font-black text-gray-900 text-base mb-4">💊 กล้ำยาเม็ดโดยตรง</h2>
        <ol className="space-y-3">
          {[
            { step: 'ห่อตัว/จับให้มั่น', detail: 'แมว: ห่อผ้าขนหนู / สุนัข: จับลำตัวระหว่างขา นั่งบนพื้น' },
            { step: 'เปิดปากเบาๆ', detail: 'บีบมุมปาก ไม่ต้องบังคับมาก แค่ให้ปากเปิด' },
            { step: 'วางยาโคนลิ้น ลึกสุด', detail: 'ยิ่งลึกยิ่งดี อยู่หลังเส้น V ของลิ้น กลืนง่ายกว่า' },
            { step: 'ปิดปาก ลูบคอ', detail: 'ยกหัวขึ้นเล็กน้อย ลูบคอเบาๆ รอเสียงกลืน' },
            { step: 'ตามด้วยน้ำเล็กน้อย', detail: 'ฉีดน้ำด้วยกระบอกฉีด 2-3 มล. ป้องกันยาค้างในหลอดอาหาร' },
          ].map((s, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
              <div>
                <p className="font-semibold text-sm text-gray-800">{s.step}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-5 mb-6">
        <h2 className="font-black text-gray-900 text-base mb-4">💧 ยาน้ำและยาหยอด</h2>
        <div className="space-y-3">
          {[
            { title: 'ยาน้ำ (Liquid)', detail: 'ใช้กระบอกฉีดไม่มีเข็ม ฉีดที่กระพุ้งแก้ม (ไม่ใช่คอตรงๆ) ทีละน้อย ประมาณ 1 มล.ต่อครั้ง' },
            { title: 'ยาหยอดตา', detail: 'ยกหัวขึ้น เปิดตาด้วยนิ้วโป้งและนิ้วชี้ หยอดที่มุมตาด้านใน ไม่ให้หัวขวดสัมผัสตา' },
            { title: 'ยาหยอดหู', detail: 'ดึงใบหูขึ้นเบาๆ หยอดลงช่องหู นวดโคนหู 30-60 วินาที ปล่อยให้ส่ายหัว' },
          ].map(y => (
            <div key={y.title} className="flex items-start gap-3">
              <span className="text-orange-400 font-black text-lg flex-shrink-0 mt-0.5">•</span>
              <div>
                <p className="font-bold text-sm text-gray-800">{y.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{y.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-red-50 border border-red-200 rounded-2xl p-3 mb-6">
        <p className="text-xs font-semibold text-red-600">⚠️ ยาที่ห้ามบดหรือตัด: ยา slow-release, ยาเคลือบกรด บางชนิดจะหมดฤทธิ์หรืออันตรายถ้าบด — ถามสัตวแพทย์ก่อนเสมอ</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/deworming" className="px-4 py-2.5 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors">🪱 ถ่ายพยาธิ</a>
        <a href="/flea" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🦟 ยาหมัด/เห็บ</a>
        <a href="/hospital" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🏥 หาโรงพยาบาล</a>
      </div>

      <RelatedGuides current="tips" count={4} />
    </main>
  )
}
