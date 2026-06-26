import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'ไมโครชิปสัตว์เลี้ยง — ขั้นตอน ราคา และประโยชน์ | ThailandPetHub',
  description: 'ทุกอย่างที่ควรรู้เกี่ยวกับไมโครชิปสำหรับสุนัขและแมว ราคาฝังไมโครชิป ขั้นตอนการดำเนินการ และความสำคัญสำหรับสัตว์เลี้ยงในประเทศไทย',
  alternates: { canonical: 'https://www.thailandpethub.com/microchip' },
  keywords: ['ไมโครชิปสุนัข', 'ฝังไมโครชิปแมว', 'ไมโครชิปสัตว์เลี้ยง', 'ราคาไมโครชิป', 'ลงทะเบียนสัตว์เลี้ยง'],
  openGraph: {
    title: 'ไมโครชิปสัตว์เลี้ยง — ขั้นตอน ราคา และประโยชน์',
    description: 'ทุกอย่างที่ควรรู้เกี่ยวกับไมโครชิปสำหรับสุนัขและแมว',
    url: 'https://www.thailandpethub.com/microchip',
  },
}

function MicrochipSchemaLd() {
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'การฝังไมโครชิปเจ็บไหม?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'เจ็บน้อยมาก เทียบได้กับการฉีดวัคซีน ไมโครชิปมีขนาดเท่าเมล็ดข้าว ฉีดเข้าใต้ผิวหนังบริเวณหลัง ไม่ต้องวางยาสลบ ใช้เวลาไม่กี่วินาที',
        },
      },
      {
        '@type': 'Question',
        name: 'ราคาฝังไมโครชิปในประเทศไทยเท่าไหร่?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ราคาฝังไมโครชิปในไทยอยู่ที่ประมาณ 300-800 บาท ขึ้นอยู่กับคลินิกหรือโรงพยาบาลสัตว์ บางแห่งมีค่าบริการลงทะเบียนเพิ่มเติมอีก 100-200 บาท',
        },
      },
      {
        '@type': 'Question',
        name: 'ไมโครชิปสัตว์เลี้ยงสามารถติดตามตำแหน่งได้ไหม?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ไม่ได้ ไมโครชิปไม่ใช่ GPS ไม่สามารถติดตามตำแหน่งแบบ real-time ได้ ทำหน้าที่เก็บรหัสประจำตัวเพื่อระบุตัวสัตว์เมื่อนำไปอ่านด้วยเครื่อง scanner เท่านั้น',
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
}

const STEPS = [
  { title: 'ปรึกษาสัตวแพทย์', detail: 'แจ้งสัตวแพทย์ว่าต้องการฝังไมโครชิป ระบุข้อมูลเจ้าของที่ถูกต้องสำหรับการลงทะเบียน' },
  { title: 'ฉีดไมโครชิป', detail: 'สัตวแพทย์ฉีดชิปขนาดเท่าเมล็ดข้าวเข้าใต้ผิวหนังบริเวณหลังกรงคอ ใช้เวลาไม่ถึง 1 นาที' },
  { title: 'ตรวจสอบ', detail: 'ใช้ scanner อ่านเพื่อยืนยันว่าชิปทำงานได้ถูกต้องและอ่านรหัส 15 หลักได้' },
  { title: 'ลงทะเบียน', detail: 'ลงทะเบียนรหัส 15 หลักกับฐานข้อมูลสัตว์เลี้ยงแห่งชาติหรือเอกชน พร้อมข้อมูลติดต่อเจ้าของ' },
  { title: 'เก็บเอกสาร', detail: 'เก็บใบรับรองไมโครชิปไว้ในที่ปลอดภัย เพื่อใช้ในการเดินทางระหว่างประเทศหรือกรณีจำเป็น' },
]

const BENEFITS = [
  { icon: '🔍', title: 'ค้นหาสัตว์หาย', detail: 'หากน้องหายไป โรงพยาบาลและสถานพักพิงสัตว์สแกนไมโครชิปเพื่อติดต่อเจ้าของได้ทันที' },
  { icon: '🌏', title: 'เดินทางระหว่างประเทศ', detail: 'ประเทศส่วนใหญ่รวมถึง EU, UK, ออสเตรเลีย กำหนดให้ต้องมีไมโครชิปก่อนเดินทาง' },
  { icon: '📋', title: 'พิสูจน์ความเป็นเจ้าของ', detail: 'ใช้ยืนยันความเป็นเจ้าของกรณีพิพาทหรือสัตว์ถูกขโมย' },
  { icon: '🏥', title: 'บันทึกทางการแพทย์', detail: 'บางโรงพยาบาลเชื่อมประวัติการรักษากับรหัสไมโครชิป ทำให้เข้าถึงข้อมูลได้ง่าย' },
]

export default function MicrochipPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <MicrochipSchemaLd />

      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">ไมโครชิปสัตว์เลี้ยง</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">📡 ไมโครชิปสัตว์เลี้ยง</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-2xl">
        ไมโครชิปเป็นวิธีระบุตัวสัตว์เลี้ยงที่ถาวรและเชื่อถือได้ที่สุด
        แตกต่างจากปลอกคอที่อาจหลุดหาย ไมโครชิปอยู่ใต้ผิวหนังตลอดชีวิตของสัตว์เลี้ยง
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'ราคา', value: '300-800 ฿', sub: 'ค่าฝัง' },
          { label: 'ขนาด', value: '~2 มม.', sub: 'เท่าเมล็ดข้าว' },
          { label: 'อายุการใช้งาน', value: 'ตลอดชีวิต', sub: 'ไม่ต้องเปลี่ยน' },
          { label: 'มาตรฐาน', value: 'ISO 11784/5', sub: '15 หลัก' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border p-4 text-center">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className="font-black text-orange-500 text-lg leading-none">{s.value}</p>
            <p className="text-[11px] text-gray-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-5">✅ ขั้นตอนการฝังไมโครชิป</h2>
        <ol className="space-y-4">
          {STEPS.map((step, i) => (
            <li key={i} className="flex items-start gap-4">
              <span className="w-7 h-7 rounded-full bg-orange-500 text-white text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
              <div>
                <p className="font-bold text-gray-800 text-sm">{step.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">💡 ประโยชน์ของไมโครชิป</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {BENEFITS.map(b => (
            <div key={b.title} className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">{b.icon}</span>
              <div>
                <p className="font-bold text-sm text-gray-800">{b.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{b.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6">
        <p className="font-bold text-blue-700 text-sm mb-2">❓ ไมโครชิป VS ปลอกคอ</p>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="font-semibold text-gray-700 mb-1.5">📡 ไมโครชิป</p>
            <ul className="space-y-1 text-gray-600">
              <li>✓ ถาวร ไม่หาย</li>
              <li>✓ ใช้เดินทางต่างประเทศ</li>
              <li>✗ ต้องใช้ scanner อ่าน</li>
              <li>✗ ไม่แสดงข้อมูลทันที</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-1.5">🏷️ ปลอกคอ+ป้าย</p>
            <ul className="space-y-1 text-gray-600">
              <li>✓ มองเห็นได้ทันที</li>
              <li>✓ ใส่เบอร์โทรได้</li>
              <li>✗ หลุดหรือหายได้</li>
              <li>✗ ไม่เป็นที่ยอมรับระหว่างประเทศ</li>
            </ul>
          </div>
        </div>
        <p className="text-xs text-blue-600 mt-3 font-medium">💡 ควรใช้ทั้งสองอย่างร่วมกัน</p>
      </div>

      <section className="bg-white rounded-2xl border p-6 mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-4">คำถามที่พบบ่อย</h2>
        <div className="space-y-4 divide-y divide-gray-100">
          {[
            { q: 'ไมโครชิปเจ็บไหม?', a: 'เจ็บน้อยมาก เทียบได้กับการฉีดวัคซีน ไมโครชิปมีขนาดเท่าเมล็ดข้าว ฉีดเข้าใต้ผิวหนัง ไม่ต้องวางยาสลบ' },
            { q: 'ราคาฝังไมโครชิปเท่าไหร่?', a: 'ราคาอยู่ที่ประมาณ 300-800 บาท ขึ้นอยู่กับคลินิก บางแห่งมีค่าลงทะเบียนเพิ่มอีก 100-200 บาท' },
            { q: 'ไมโครชิปติดตาม GPS ได้ไหม?', a: 'ไม่ได้ ไมโครชิปไม่ใช่ GPS ทำหน้าที่เก็บรหัสประจำตัว 15 หลักเท่านั้น ต้องใช้ scanner อ่าน' },
            { q: 'ต้องลงทะเบียนไมโครชิปหลังฝังไหม?', a: 'ใช่ การฝังไมโครชิปโดยไม่ลงทะเบียนเท่ากับไม่มีประโยชน์ ต้องลงทะเบียนข้อมูลเจ้าของในฐานข้อมูลเพื่อให้ค้นหาได้' },
          ].map((item, i) => (
            <div key={i} className={i > 0 ? 'pt-4' : ''}>
              <h3 className="font-semibold text-gray-800 mb-1 text-sm">{item.q}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/hospital" className="px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 transition-colors">🏥 หาโรงพยาบาลสัตว์</a>
        <a href="/vaccine" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">💉 ตารางวัคซีน</a>
        <a href="/newpet" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">🆕 คู่มือเลี้ยงใหม่</a>
      </div>

      <RelatedGuides current="vaccine" count={4} />
    </main>
  )
}
