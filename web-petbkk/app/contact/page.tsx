import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ติดต่อเรา | ThailandPetHub',
  description: 'ติดต่อทีมงาน ThailandPetHub — แจ้งข้อมูลโรงพยาบาล ส่งข้อมูลอาหาร หรือพูดคุยเรื่องสัตว์เลี้ยง',
  alternates: { canonical: 'https://www.thailandpethub.com/contact' },
}

const TOPICS = [
  { icon: '🏥', title: 'แจ้งข้อมูลโรงพยาบาลสัตว์', desc: 'พบโรงพยาบาลที่ยังไม่มีในระบบ หรือข้อมูลไม่ถูกต้อง?' },
  { icon: '🍖', title: 'ข้อมูลอาหารสัตว์เลี้ยง', desc: 'อยากให้เพิ่มอาหารยี่ห้อไหน หรือพบข้อมูลผิดพลาด?' },
  { icon: '🐾', title: 'ร่วมกันสร้างชุมชน', desc: 'มีไอเดียหรืออยากร่วมพัฒนาแพลตฟอร์ม?' },
  { icon: '📣', title: 'ลงโฆษณา / พาร์ทเนอร์', desc: 'สนใจโฆษณาหรือพาร์ทเนอร์กับเรา?' },
]

export default function ContactPage() {
  return (
    <main className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">ติดต่อเรา</h1>
        <p className="text-gray-500 text-sm">
          ThailandPetHub สร้างโดยคนรักสัตว์เลี้ยง เพื่อคนรักสัตว์เลี้ยง — ทุก feedback มีความหมาย
        </p>
      </div>

      {/* Topic cards */}
      <div className="grid grid-cols-1 gap-3 mb-8">
        {TOPICS.map(t => (
          <div key={t.title} className="bg-white border rounded-xl p-4 flex gap-4 items-start">
            <span className="text-2xl flex-shrink-0">{t.icon}</span>
            <div>
              <p className="font-semibold text-sm text-gray-900">{t.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Contact box */}
      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 text-center mb-6">
        <p className="text-sm text-gray-500 mb-3">ส่งอีเมลหาเราได้เลย</p>
        <a
          href="mailto:umma@xx.gg"
          className="inline-block text-lg font-bold text-orange-600 hover:text-orange-700 transition-colors"
        >
          umma@xx.gg
        </a>
        <p className="text-xs text-gray-400 mt-3">ตอบกลับภายใน 1–2 วันทำการ</p>
      </div>

      {/* Mission note */}
      <div className="bg-green-50 border border-green-100 rounded-2xl p-5 text-center">
        <p className="text-sm text-green-800 font-medium mb-1">ภารกิจของเรา</p>
        <p className="text-sm text-green-700 leading-relaxed">
          เราอยากให้คนไทยรู้จักการ <strong>รับเลี้ยง</strong> สัตว์จากศูนย์พักพิง<br />
          แทนการซื้อ — เพราะสัตว์ทุกตัวสมควรได้รับความรัก 🐾
        </p>
        <a href="/adopt" className="mt-3 inline-block text-sm text-green-600 underline hover:text-green-700">
          ดูสัตว์รอบ้าน →
        </a>
      </div>
    </main>
  )
}
