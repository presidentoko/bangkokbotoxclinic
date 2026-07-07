import type { Metadata } from 'next'
import RelatedGuides from '@/components/RelatedGuides'

export const metadata: Metadata = {
  title: 'เลี้ยงสัตว์เลี้ยงในคอนโด/อพาร์ทเมนต์ — สายพันธุ์ที่เหมาะและเคล็ดลับ',
  description: 'แนะนำสายพันธุ์สุนัขและแมวที่เหมาะกับคอนโดและอพาร์ทเมนต์ในกรุงเทพ วิธีดูแลสัตว์เลี้ยงในพื้นที่จำกัด และข้อพิจารณากฎของนิติบุคคล',
  alternates: { canonical: 'https://www.thailandpethub.com/apartment-pets' },
  keywords: ['เลี้ยงสัตว์เลี้ยงคอนโด', 'สุนัขในอพาร์ทเมนต์', 'แมวในคอนโด', 'สัตว์เลี้ยงกรุงเทพ', 'คอนโด pet-friendly'],
  openGraph: {
    title: 'เลี้ยงสัตว์เลี้ยงในคอนโด/อพาร์ทเมนต์ — คู่มือฉบับสมบูรณ์',
    description: 'สายพันธุ์ที่เหมาะ เคล็ดลับดูแล และข้อควรระวังสำหรับผู้เลี้ยงในพื้นที่จำกัด',
    url: 'https://www.thailandpethub.com/apartment-pets',
  },
}

const GOOD_DOGS = [
  { breed: 'ชิห์สึ', reason: 'เงียบ พลังงานต่ำ ชอบนอน เหมาะอพาร์ทเมนต์มาก' },
  { breed: 'ปั๊ก', reason: 'สังคมดี ออกกำลังน้อย ไม่ต้องพื้นที่มาก' },
  { breed: 'มัลทีส', reason: 'เบา ผิวหนังดี ไม่ค่อยเห่า' },
  { breed: 'บิชอง', reason: 'ขนหลุดน้อย เป็นมิตร ขนาดพอดี' },
  { breed: 'ชิวาวา', reason: 'เล็กมาก พลังงานปานกลาง' },
  { breed: 'พูเดิล (ทอย)', reason: 'ฉลาด ฝึกง่าย ขนหลุดน้อย' },
]

const GOOD_CATS = [
  { breed: 'แมวทุกสายพันธุ์', reason: 'แมวส่วนใหญ่เหมาะกับในบ้านมากกว่าสุนัข เป็นอิสระ ดูแลตัวเองได้ดี' },
  { breed: 'เปอร์เซีย', reason: 'เงียบ พลังงานต่ำ ชอบอยู่นิ่ง' },
  { breed: 'บริติช ชอร์ตแฮร์', reason: 'สงบ เป็นอิสระ ไม่ต้องการพื้นที่มาก' },
  { breed: 'แมวไทย (วิเชียรมาศ)', reason: 'ปรับตัวดี แต่ช่างพูดมาก' },
]

const TIPS = [
  { tip: 'ออกกำลังกายในบ้าน', detail: 'บอล puzzle feeder เชือก ของเล่นกระตุ้นสมอง ทดแทนพื้นที่วิ่ง' },
  { tip: 'เดินออกกำลัง 2-3 ครั้งต่อวัน', detail: 'สำคัญสำหรับสุนัข แม้แค่ 15 นาที สำคัญมากกว่าระยะทาง' },
  { tip: 'จัดพื้นที่แนวตั้ง (แมว)', detail: 'คอนโซลปีนป่าย ชั้นวาง หน้าต่างที่นั่ง แมวต้องการความสูงมากกว่าพื้นที่กว้าง' },
  { tip: 'ระงับเสียง', detail: 'ฝึกสุนัขไม่เห่าตั้งแต่เล็ก เพื่อนบ้านและนิติบุคคล' },
  { tip: 'ของเล่นที่เก็บกลิ่น', detail: 'ลดกลิ่นที่อาจรบกวนเพื่อนบ้าน ทำความสะอาดกระบะทรายสม่ำเสมอ' },
  { tip: 'ตรวจสอบกฎของนิติบุคคล', detail: 'หลายคอนโดมีน้ำหนักจำกัด หรือห้ามบางสายพันธุ์ ตรวจสอบก่อนรับมา' },
]

export default function ApartmentPetsPage() {
  return (
    <main className="max-w-3xl mx-auto">
      <nav className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">สัตว์เลี้ยงในคอนโด</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-3">🏢 เลี้ยงสัตว์เลี้ยงในคอนโด/อพาร์ทเมนต์</h1>
      <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-2xl">
        กรุงเทพและเมืองใหญ่ส่วนใหญ่เลี้ยงสัตว์ในพื้นที่จำกัด ซึ่งเป็นไปได้มากถ้าเลือกสายพันธุ์เหมาะสม
        และดูแลอย่างถูกต้อง
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <section className="bg-white rounded-2xl border shadow-sm p-5">
          <h2 className="font-black text-gray-900 text-base mb-3">🐕 สุนัขที่เหมาะในคอนโด</h2>
          <div className="space-y-2">
            {GOOD_DOGS.map(d => (
              <div key={d.breed} className="border-b border-gray-50 pb-2 last:border-0">
                <p className="font-semibold text-sm text-gray-800">{d.breed}</p>
                <p className="text-xs text-gray-500">{d.reason}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="bg-white rounded-2xl border shadow-sm p-5">
          <h2 className="font-black text-gray-900 text-base mb-3">🐱 แมวที่เหมาะในคอนโด</h2>
          <div className="space-y-2">
            {GOOD_CATS.map(c => (
              <div key={c.breed} className="border-b border-gray-50 pb-2 last:border-0">
                <p className="font-semibold text-sm text-gray-800">{c.breed}</p>
                <p className="text-xs text-gray-500">{c.reason}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">แมวปรับตัวกับพื้นที่จำกัดได้ดีกว่าสุนัขมาก — ดูแลง่ายกว่าสำหรับคนทำงาน</p>
          </div>
        </section>
      </div>

      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <h2 className="font-black text-gray-900 text-lg mb-4">💡 เคล็ดลับสำหรับผู้เลี้ยงในพื้นที่จำกัด</h2>
        <div className="space-y-4">
          {TIPS.map(t => (
            <div key={t.tip} className="flex items-start gap-3">
              <span className="text-orange-400 font-black text-lg mt-0.5 flex-shrink-0">•</span>
              <div>
                <p className="font-bold text-gray-800 text-sm">{t.tip}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
        <p className="font-bold text-blue-700 text-sm mb-2">🏢 สุนัขสายพันธุ์ที่ไม่เหมาะคอนโด</p>
        <p className="text-xs text-blue-600">สุนัขพลังงานสูง เช่น Husky, Border Collie, Dalmatian, German Shepherd — ต้องการพื้นที่และการออกกำลังมาก อาจทำให้น้องเครียดและเกิดพฤติกรรมที่ไม่พึงประสงค์</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/breeds" className="px-4 py-2.5 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors">🐾 สายพันธุ์ยอดนิยม</a>
        <a href="/adopt" className="px-4 py-2.5 bg-green-600 text-white font-semibold rounded-xl text-sm hover:bg-green-700 transition-colors">💚 รับเลี้ยงแทนซื้อ</a>
        <a href="/anxiety" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">😰 Separation Anxiety</a>
      </div>

      <RelatedGuides current="apartment-pets" count={4} />
    </main>
  )
}
