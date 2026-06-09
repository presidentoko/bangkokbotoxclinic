import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'เตรียมพร้อมรับสัตว์เลี้ยงใหม่ — PetBKK',
  description: 'เช็คลิสต์ครบถ้วนสำหรับการรับสุนัขหรือแมวมาเลี้ยงครั้งแรก',
}

interface CheckItem { label: string; detail: string }
interface Section { title: string; icon: string; items: CheckItem[] }

const SECTIONS: Section[] = [
  {
    title: 'ก่อนน้องมาถึงบ้าน',
    icon: '🏠',
    items: [
      { label: 'ซื้อที่นอนและกรงที่เหมาะสม', detail: 'ขนาดพอดีตัว อากาศถ่ายเท ล้างทำความสะอาดง่าย' },
      { label: 'ชามอาหารและน้ำแบบสแตนเลสหรือเซรามิก', detail: 'หลีกเลี่ยงพลาสติกที่ขูดขีดได้ เป็นแหล่งแบคทีเรีย' },
      { label: 'สายจูงและปลอกคอ (สุนัข)', detail: 'ปลอกคอ Breakaway สำหรับแมว — ปลดออกได้เมื่อติดค้าน' },
      { label: 'กระบะทรายและทรายแมว (แมว)', detail: 'ขนาดกระบะอย่างน้อย 1.5 เท่าของความยาวตัว' },
      { label: 'ของเล่นสำหรับวัยลูก', detail: 'ของเล่นเขี้ยว ของเล่นไล่จับ ป้องกันเบื่อและทำลายข้าวของ' },
      { label: 'หาสัตวแพทย์ประจำตัวล่วงหน้า', detail: 'โทรนัดไว้ก่อน จะได้ไปตรวจสุขภาพภายใน 48 ชั่วโมงแรก' },
    ],
  },
  {
    title: 'สัปดาห์แรก',
    icon: '📅',
    items: [
      { label: 'ตรวจสุขภาพเบื้องต้นกับสัตวแพทย์', detail: 'ตรวจหนอนพยาธิ เห็บ หมัด และโรคพื้นฐาน' },
      { label: 'เริ่มโปรแกรมวัคซีน', detail: 'สอบถามสัตวแพทย์ว่าต้องเริ่มฉีดอะไรบ้าง' },
      { label: 'ให้น้องปรับตัวในพื้นที่จำกัดก่อน', detail: 'อย่าปล่อยทั่วบ้านทันที ให้ห้องเดียวก่อน 1-2 สัปดาห์' },
      { label: 'ใช้อาหารยี่ห้อเดิมที่เคยกิน', detail: 'เปลี่ยนอาหารกะทันหันทำให้ท้องเสีย ค่อยๆ เปลี่ยนใน 7-10 วัน' },
      { label: 'ตั้งตารางให้อาหารสม่ำเสมอ', detail: 'เวลาเดิมทุกวัน ช่วยให้น้องรู้สึกปลอดภัยและคาดเดาได้' },
    ],
  },
  {
    title: 'เดือนแรก',
    icon: '🌙',
    items: [
      { label: 'นัดทำหมัน (อายุ 6 เดือนขึ้นไป)', detail: 'ลดความเสี่ยงมะเร็ง ลดพฤติกรรมก้าวร้าว ป้องกันสัตว์จร' },
      { label: 'ฝังไมโครชิป', detail: 'ทำครั้งเดียวตลอดชีวิต ช่วยตามหาน้องถ้าหาย' },
      { label: 'เริ่มฝึกพื้นฐาน (สุนัข)', detail: 'นั่ง, หยุด, มาหา — ใช้ positive reinforcement เท่านั้น' },
      { label: 'ทำความสะอาดฟัน', detail: 'ใช้แปรงสีฟันสำหรับสัตว์เลี้ยง ป้องกันโรคเหงือกและลมปาก' },
      { label: 'ประเมินน้ำหนักและปรับอาหาร', detail: 'ชั่งน้ำหนักทุก 2 สัปดาห์ ให้อาหารตามน้ำหนักตัวที่เหมาะสม' },
    ],
  },
  {
    title: 'ของใช้ฉุกเฉิน',
    icon: '🆘',
    items: [
      { label: 'เบอร์โทรโรงพยาบาลสัตว์ 24 ชม. ใกล้บ้าน', detail: 'บันทึกไว้ในโทรศัพท์ก่อนมีเหตุฉุกเฉิน' },
      { label: 'กรงพาหมอขนาดเหมาะสม', detail: 'สำหรับการเดินทาง และฉุกเฉินต่างๆ' },
      { label: 'ผ้าพันแผลและยาฆ่าเชื้อสำหรับสัตว์', detail: 'Povidone-iodine สำหรับสัตว์เลี้ยง ห้ามใช้ Betadine เข้มข้น' },
      { label: 'ยาพยาธิและยาเห็บหมัด', detail: 'ตามคำแนะนำของสัตวแพทย์ ให้ตรงตามน้ำหนักตัว' },
    ],
  },
]

export default function NewPetPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-black text-gray-900 mb-1">🆕 คู่มือเลี้ยงน้องใหม่</h1>
      <p className="text-sm text-gray-400 mb-6">เช็คลิสต์ 20 ข้อสำหรับเจ้าของน้องมือใหม่</p>

      <div className="space-y-8">
        {SECTIONS.map(section => (
          <section key={section.title}>
            <h2 className="text-base font-black text-gray-900 mb-3 mt-6 flex items-center gap-2">
              <span>{section.icon}</span>
              <span>{section.title}</span>
            </h2>
            <div className="space-y-3">
              {section.items.map(item => (
                <div key={item.label} className="bg-white rounded-xl border p-4">
                  <div className="flex items-start gap-3 py-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-orange-300 bg-orange-50 mt-0.5"></span>
                    <div>
                      <p className="font-semibold text-sm text-gray-900 leading-relaxed">{item.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <a href="/food" className="text-center bg-white border rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
          <p className="text-2xl mb-1">🍖</p>
          <p className="font-semibold text-sm">ตรวจสอบอาหาร</p>
        </a>
        <a href="/hospital" className="text-center bg-white border rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
          <p className="text-2xl mb-1">🏥</p>
          <p className="font-semibold text-sm">หาโรงพยาบาลสัตว์</p>
        </a>
        <a href="/vaccine" className="text-center bg-white border rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
          <p className="text-2xl mb-1">💉</p>
          <p className="font-semibold text-sm">ตารางวัคซีน</p>
        </a>
      </div>
    </main>
  )
}
