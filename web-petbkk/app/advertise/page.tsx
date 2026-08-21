import type { Metadata } from 'next'
import { loadHospitals } from '@/lib/hospitals'
import { loadFoods } from '@/lib/petfood'
import { getIndexableDistricts } from '@/lib/districts'

export const metadata: Metadata = {
  title: 'ลงโฆษณากับเรา',
  description:
    'พื้นที่โฆษณาสำหรับโรงพยาบาลสัตว์ คลินิก และแบรนด์อาหารสัตว์เลี้ยงบน ThailandPetHub — เข้าถึงเจ้าของสัตว์เลี้ยงในกรุงเทพที่กำลังหาข้อมูลอยู่จริง',
  alternates: { canonical: 'https://www.thailandpethub.com/advertise' },
}

interface Placement {
  name: string
  where: string
  who: string
  detail: string
}

function placements(districtCount: number): Placement[] {
  return [
    {
      name: 'ผู้สนับสนุนประจำเขต',
      where: `หน้ารวมโรงพยาบาลรายเขต ${districtCount} เขต`,
      who: 'โรงพยาบาลสัตว์ · คลินิก',
      detail:
        'คลินิกของคุณอยู่บนสุดของหน้า “โรงพยาบาลสัตว์ในเขต…” ที่คนในละแวกนั้นเปิดอ่าน ' +
        'ติดป้าย “ผู้สนับสนุน” และแยกจากรายการที่เรียงตามคะแนนรีวิว',
    },
    {
      name: 'ผู้สนับสนุนหน้าฉุกเฉิน / 24 ชั่วโมง',
      where: '/hospital/24h และ /emergency',
      who: 'โรงพยาบาลที่เปิด 24 ชม.',
      detail:
        'ผู้อ่านหน้านี้กำลังมีเหตุจริงและตัดสินใจภายในไม่กี่นาที ' +
        'เป็นพื้นที่ที่ความตั้งใจสูงที่สุดบนเว็บไซต์ จำกัดจำนวนผู้สนับสนุนต่อหน้า',
    },
    {
      name: 'ผู้สนับสนุนหมวดอาหาร',
      where: '/food, /food/dog, /food/cat และหน้าหมวดย่อย',
      who: 'แบรนด์อาหารสัตว์ · ร้านค้า',
      detail:
        'แบนเนอร์ด้านบนของหน้าหมวด พร้อมลิงก์ไปยังหน้าสินค้าหรือร้านค้าของคุณ ' +
        'ไม่กระทบเกรดหรือลำดับของสินค้าใด ๆ',
    },
    {
      name: 'โฆษณาในบทความ',
      where: 'คู่มือดูแลสัตว์เลี้ยงกว่า 60 หน้า',
      who: 'ทุกประเภทธุรกิจสัตว์เลี้ยง',
      detail:
        'แทรกระหว่างเนื้อหาในหน้าคู่มือ เช่น วัคซีน ทำหมัน อาหารเป็นพิษ การดูแลลูกสุนัข',
    },
  ]
}

function Card({ p }: { p: Placement }) {
  return (
    <div className="bg-white border border-orange-100 rounded-xl p-4">
      <div className="flex items-start justify-between gap-3 mb-1">
        <h3 className="font-bold text-gray-900 text-sm">{p.name}</h3>
        <span className="text-[10px] text-orange-600 bg-orange-50 border border-orange-100 rounded-full px-2 py-0.5 whitespace-nowrap flex-shrink-0">
          {p.who}
        </span>
      </div>
      <p className="text-[11px] text-gray-400 mb-2">{p.where}</p>
      <p className="text-sm text-gray-600 leading-relaxed">{p.detail}</p>
    </div>
  )
}

/**
 * The direct-sales page.
 *
 * Deliberately carries no traffic numbers. Analytics has only just been wired
 * up, so any figure quoted here today would be invented — and an inflated media
 * kit is the fastest way to lose the first advertiser who checks. What it does
 * carry is the inventory, the audience, and the editorial rules, all of which
 * are true right now. Numbers go in once there is a full month behind them.
 */
export default function AdvertisePage() {
  const hospitals = loadHospitals()
  const foods = loadFoods()
  const districts = getIndexableDistricts()

  return (
    <main className="max-w-2xl mx-auto">
      <nav aria-label="breadcrumb" className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">ลงโฆษณากับเรา</span>
      </nav>

      <h1 className="text-2xl font-black text-gray-900 mb-2">ลงโฆษณากับ ThailandPetHub</h1>
      <p className="text-sm text-gray-600 leading-relaxed mb-6">
        ThailandPetHub เป็นฐานข้อมูลโรงพยาบาลสัตว์ {hospitals.length} แห่งในกรุงเทพฯ
        และเครื่องมือตรวจสอบอาหารสัตว์เลี้ยง {foods.length.toLocaleString()} รายการ
        ผู้อ่านของเราคือ<strong>เจ้าของสัตว์เลี้ยงที่กำลังหาข้อมูลเพื่อตัดสินใจอยู่ตอนนั้น</strong> —
        หาคลินิกใกล้บ้าน หาที่รักษาตอนกลางคืน หรือกำลังเลือกอาหารให้น้อง
      </p>

      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-1">ทำไมถึงคุ้ม</h2>
        <p className="text-xs text-gray-400 mb-3">ผู้อ่านมาที่นี่พร้อมความตั้งใจ ไม่ได้มาเลื่อนดูเฉย ๆ</p>
        <ul className="space-y-2 text-sm text-gray-600 leading-relaxed">
          <li className="flex gap-2">
            <span className="text-orange-500 flex-shrink-0">▸</span>
            <span>
              <strong>ตรงพื้นที่</strong> — เรามีหน้ารวมคลินิกแยกราย{districts.length}เขต
              คนที่อ่านหน้าเขตห้วยขวางคือคนที่จะไปคลินิกในห้วยขวาง
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-orange-500 flex-shrink-0">▸</span>
            <span>
              <strong>ตรงจังหวะ</strong> — หน้าฉุกเฉินและหน้า 24 ชั่วโมงคือคนที่ต้องตัดสินใจเดี๋ยวนี้
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-orange-500 flex-shrink-0">▸</span>
            <span>
              <strong>เนื้อหาภาษาไทยทั้งหมด</strong> — เขียนให้เจ้าของสัตว์เลี้ยงคนไทยอ่าน ไม่ใช่หน้าแปล
            </span>
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-3">พื้นที่ที่เปิดให้ลงโฆษณา</h2>
        <div className="space-y-3">
          {placements(districts.length).map(p => <Card key={p.name} p={p} />)}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-2">กติกาที่เราไม่ยืดหยุ่น</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-600 leading-relaxed space-y-2">
          <p>
            <strong>ซื้ออันดับไม่ได้</strong> — ลำดับของคลินิกเรียงตามคะแนนและจำนวนรีวิวจริงจาก Google
            และเกรดอาหารคำนวณจากฉลากเท่านั้น เงินไม่เปลี่ยนทั้งสองอย่าง
          </p>
          <p>
            <strong>ติดป้ายเสมอ</strong> — พื้นที่ที่จ่ายเงินจะมีคำว่า “ผู้สนับสนุน” หรือ “โฆษณา” กำกับ
            และออกแบบให้แยกออกจากเนื้อหาปกติอย่างชัดเจน
          </p>
          <p>
            <strong>ไม่รับโฆษณาที่อ้างสรรพคุณรักษาโรค</strong> ที่ไม่มีหลักฐานทางสัตวแพทย์รองรับ
            และไม่รับโฆษณาฟาร์มเพาะพันธุ์ที่ไม่มีใบอนุญาต
          </p>
        </div>
      </section>

      <section className="mb-8 bg-orange-50 border border-orange-100 rounded-2xl p-5">
        <h2 className="text-base font-bold text-gray-900 mb-1">สนใจลงโฆษณา?</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          บอกเราว่าคุณเป็นคลินิกในเขตไหน หรือเป็นแบรนด์อะไร
          แล้วเราจะส่งสถิติผู้เข้าชมล่าสุด ตำแหน่งที่ว่าง และราคากลับไปให้
          รับลงโฆษณาทั้งแบบรายเดือนและแบบทดลอง
        </p>
        <a
          href="/contact"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-colors"
        >
          ติดต่อฝ่ายโฆษณา →
        </a>
      </section>

      <div className="border-t border-gray-100 pt-5 text-sm text-gray-500">
        <p>
          <a href="/about" className="text-orange-600 hover:underline">วิธีที่เราให้เกรดและแหล่งข้อมูล</a>
          {' · '}
          <a href="/privacy" className="text-orange-600 hover:underline">นโยบายความเป็นส่วนตัว</a>
        </p>
      </div>
    </main>
  )
}
