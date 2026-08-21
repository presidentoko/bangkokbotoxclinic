import type { Metadata } from 'next'
import { loadFoods, getFoodGrade } from '@/lib/petfood'
import { loadHospitals } from '@/lib/hospitals'
import { getIndexableDistricts } from '@/lib/districts'

export const metadata: Metadata = {
  title: 'เกี่ยวกับเรา และวิธีที่เราให้เกรด',
  description:
    'ThailandPetHub รวบรวมข้อมูลโรงพยาบาลสัตว์ในกรุงเทพและวิเคราะห์ส่วนประกอบอาหารสัตว์เลี้ยง — อธิบายแหล่งข้อมูล วิธีให้เกรด และข้อจำกัดของข้อมูลอย่างตรงไปตรงมา',
  alternates: { canonical: 'https://www.thailandpethub.com/about' },
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-orange-50 rounded-xl py-3 px-2 text-center">
      <p className="text-xl font-black text-orange-600 leading-none">{value}</p>
      <p className="text-[11px] text-gray-500 mt-1 leading-tight">{label}</p>
    </div>
  )
}

/**
 * The publisher page. Two jobs: tell a reader who is behind the numbers, and
 * state the method and its limits plainly.
 *
 * The limits section is not boilerplate — it names the two real holes in the
 * dataset (no prices at all, and an ingredient panel for only a quarter of the
 * catalogue). A directory that hides its gaps invites a reader to trust a
 * figure it cannot support; saying so is what makes the rest credible.
 */
export default function AboutPage() {
  const foods = loadFoods()
  const hospitals = loadHospitals()
  const graded = foods.filter(f => getFoodGrade(f) !== null)
  const withPanel = foods.filter(f => f.ing_total > 0)
  const open24 = hospitals.filter(h => h.is_24h)
  const rated = hospitals.filter(h => h.google_rating != null)
  const districts = getIndexableDistricts()

  return (
    <main className="max-w-2xl mx-auto">
      <nav aria-label="breadcrumb" className="text-xs text-gray-400 mb-4">
        <a href="/" className="hover:text-orange-600">หน้าหลัก</a>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">เกี่ยวกับเรา</span>
      </nav>

      <h1 className="text-2xl font-black text-gray-900 mb-2">เกี่ยวกับ ThailandPetHub</h1>
      <p className="text-sm text-gray-600 leading-relaxed mb-5">
        ThailandPetHub เป็นฐานข้อมูลสาธารณะสำหรับเจ้าของสัตว์เลี้ยงในกรุงเทพฯ
        เรารวบรวม<strong>โรงพยาบาลและคลินิกสัตว์ {hospitals.length} แห่ง</strong>{' '}
        พร้อมที่อยู่ เบอร์โทร เวลาทำการ และคะแนนรีวิว
        และ<strong>วิเคราะห์ส่วนประกอบอาหารสัตว์เลี้ยงที่ขายในไทย</strong>{' '}
        เพื่อให้เปรียบเทียบได้ว่าฉลากบอกอะไรบ้าง — ใช้งานฟรีทั้งหมด ไม่ต้องสมัครสมาชิก
      </p>

      <dl className="grid grid-cols-4 gap-2 mb-8">
        <Stat value={hospitals.length.toLocaleString()} label="โรงพยาบาล/คลินิก" />
        <Stat value={open24.length.toString()} label="เปิด 24 ชม." />
        <Stat value={districts.length.toString()} label="เขตที่มีข้อมูล" />
        <Stat value={foods.length.toLocaleString()} label="อาหารในฐานข้อมูล" />
      </dl>

      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-2">ข้อมูลมาจากไหน</h2>
        <div className="text-sm text-gray-600 leading-relaxed space-y-2">
          <p>
            <strong>โรงพยาบาลสัตว์</strong> — ข้อมูลพื้นฐาน (ชื่อ ที่อยู่ พิกัด เบอร์โทร เวลาทำการ
            คะแนนและจำนวนรีวิว) ดึงจาก Google Places API และตรวจสอบซ้ำเป็นระยะ
            ปัจจุบันมี {rated.length} แห่งที่มีคะแนนรีวิว
            และ {hospitals.filter(h => h.website).length} แห่งที่มีเว็บไซต์หรือเพจอย่างเป็นทางการ
            เราไม่ได้เก็บค่ารักษา เพราะราคาขึ้นกับอาการและไม่มีแหล่งข้อมูลกลางที่เชื่อถือได้
          </p>
          <p>
            <strong>อาหารสัตว์เลี้ยง</strong> — รายการสินค้าและส่วนประกอบมาจากหน้าเว็บไซต์ทางการของผู้ผลิต
            เราอ่านเฉพาะ “ตารางส่วนประกอบ” บนฉลาก ไม่ได้นำข้อความโฆษณามาคิดคะแนน
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-2">เราให้เกรดอาหารอย่างไร</h2>
        <div className="text-sm text-gray-600 leading-relaxed space-y-2">
          <p>
            เกรด A–F คำนวณจาก<strong>ลำดับและชนิดของส่วนผสมที่ระบุบนฉลาก</strong> ไม่ใช่จากรีวิวหรือความนิยม
            หลักการคือ:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>ส่วนผสมที่ระบุแหล่งที่มาชัดเจน</strong> (เช่น “เนื้อไก่”, “ปลาแซลมอน”, “ตับวัว”)
              ถือเป็นข้อดี เพราะบอกได้ว่าโปรตีนมาจากอะไร
            </li>
            <li>
              <strong>ธัญพืชและแป้ง</strong> (ข้าว ข้าวโพด มันฝรั่ง ถั่วลันเตา) เป็นแหล่งพลังงาน — ไม่ใช่ข้อเสีย
              แต่ก็ไม่ใช่ข้อดีเมื่อเทียบกับโปรตีนจากเนื้อสัตว์
            </li>
            <li>
              <strong>ผลพลอยได้ที่ไม่ระบุชนิดสัตว์</strong> (เช่น “ผลพลอยได้จากเนื้อสัตว์”, “ไขมันสัตว์”)
              ถูกนับเป็นข้อเสีย เพราะตรวจสอบแหล่งที่มาไม่ได้ — แต่ถ้าระบุชนิดชัดเจนจะถูกลดระดับความรุนแรงลง
            </li>
            <li>
              <strong>สารกันบูดและสีสังเคราะห์บางชนิด</strong> (BHA, BHT, ethoxyquin, สีผสมอาหารสังเคราะห์)
              ถือเป็นข้อเสียร้ายแรง
            </li>
            <li>
              <strong>วิตามินและแร่ธาตุไม่ถูกนำมาคิดเกรด</strong> — เป็นส่วนประกอบปกติของอาหารสูตรสมบูรณ์
              การนับเป็นข้อเสียจะทำให้อาหารที่ครบถ้วนได้คะแนนแย่ลงโดยไม่มีเหตุผล
            </li>
          </ul>
          <p>
            ถ้าเราอ่านฉลากได้ไม่ถึงครึ่ง <strong>เราจะไม่ให้เกรดเลย</strong> แทนที่จะเดา
            ปัจจุบันมี {graded.length} รายการที่มีข้อมูลมากพอจะให้เกรดได้
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-2">ข้อจำกัดของข้อมูล</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-600 leading-relaxed space-y-2">
          <p>
            <strong>ยังไม่มีราคา</strong> — เรายังไม่ได้เชื่อมแหล่งราคาที่เชื่อถือได้
            จึงไม่แสดงราคาต่อกิโลกรัมของสินค้าใด ๆ แทนที่จะแสดงตัวเลขที่ล้าสมัย
          </p>
          <p>
            <strong>ฉลากไม่ครบทุกสินค้า</strong> — มี {withPanel.length} จาก {foods.length} รายการที่เราอ่านตารางส่วนประกอบได้
            ที่เหลือผู้ผลิตไม่ได้เผยแพร่ไว้บนหน้าเว็บ เราจึงไม่ให้เกรดและไม่ส่งหน้านั้นเข้าระบบค้นหา
          </p>
          <p>
            <strong>เวลาทำการอาจเปลี่ยน</strong> — ข้อมูลจาก Google อาจไม่ตรงกับความเป็นจริงในวันหยุดนักขัตฤกษ์
            <strong> กรุณาโทรยืนยันก่อนเดินทางเสมอ โดยเฉพาะกรณีฉุกเฉิน</strong>
          </p>
          <p>
            เจอข้อมูลผิด?{' '}
            <a href="/contact" className="text-orange-600 hover:underline font-medium">แจ้งเราได้ที่นี่</a>{' '}
            — เราแก้ให้ทุกเคส
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-2">ความเป็นอิสระของเนื้อหา</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          เว็บไซต์นี้มีรายได้จากโฆษณาและลิงก์พันธมิตร ซึ่งเป็นสิ่งที่ทำให้ข้อมูลทั้งหมดเปิดให้ใช้ฟรีได้
          แต่<strong>ผู้ลงโฆษณาไม่สามารถซื้อเกรด อันดับ หรือการถูกจัดให้อยู่ในรายการแนะนำได้</strong>{' '}
          พื้นที่โฆษณาทุกชิ้นมีคำว่า “โฆษณา” หรือ “ผู้สนับสนุน” กำกับไว้ชัดเจนและแยกออกจากผลการจัดอันดับ
          รายละเอียดอยู่ใน{' '}
          <a href="/privacy" className="text-orange-600 hover:underline">นโยบายความเป็นส่วนตัว</a>
          {' '}และ{' '}
          <a href="/advertise" className="text-orange-600 hover:underline">หน้าสำหรับผู้ลงโฆษณา</a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-900 mb-2">ไม่ใช่คำแนะนำทางสัตวแพทย์</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          เนื้อหาทั้งหมดจัดทำเพื่อการศึกษาและช่วยให้คุณตั้งคำถามกับสัตวแพทย์ได้ดีขึ้นเท่านั้น
          ไม่ใช่การวินิจฉัยหรือการรักษา หากสัตว์เลี้ยงของคุณมีอาการผิดปกติ{' '}
          <a href="/emergency" className="text-orange-600 hover:underline font-medium">ดูขั้นตอนฉุกเฉิน</a>{' '}
          และติดต่อสัตวแพทย์ทันที
        </p>
      </section>

      <div className="border-t border-gray-100 pt-5 text-sm text-gray-500">
        <p>
          <a href="/hospital" className="text-orange-600 hover:underline">ค้นหาโรงพยาบาลสัตว์</a>
          {' · '}
          <a href="/food" className="text-orange-600 hover:underline">ตรวจสอบอาหาร</a>
          {' · '}
          <a href="/contact" className="text-orange-600 hover:underline">ติดต่อเรา</a>
        </p>
      </div>
    </main>
  )
}
