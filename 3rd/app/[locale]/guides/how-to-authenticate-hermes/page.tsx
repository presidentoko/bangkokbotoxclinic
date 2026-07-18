import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/how-to-authenticate-hermes'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'How to Authenticate Hermès Bags Thailand 2025 | ChicPreowned'
      : 'วิธีตรวจสอบกระเป๋า Hermès แท้ในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Authenticate Hermès Birkin and Kelly in Thailand — blind stamps, leather types, hardware, stitching. 2025 guide.'
      : 'ตรวจสอบ Hermès Birkin และ Kelly ในไทย — ตราประทับ ประเภทหนัง hardware การเย็บ คู่มือ 2025',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function AuthHermesTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const checks = isEn ? [
    { step: 1, title: 'Blind Stamp (Year Letter)', detail: 'Hermès stamps a letter inside the bag indicating the year made. Each letter is used for one year (A=2017, B=2018, C=2019, D=2020, E=2021, F=2022, G=2023, H=2024). The stamp appears inside a square or circle, with the craftsman\'s initial. A missing or unverifiable stamp is a major red flag.' },
    { step: 2, title: 'Leather Identification', detail: 'Common leathers: Togo (pebbled, scratch-resistant), Clemence (slightly slouchy pebble), Epsom (structured grid pattern), Box Calf (smooth, formal), Chevre (goat, light grain). Each has specific texture and sheen. Fakes often use Togo-style texture but wrong scale or stiffness. Authentic Hermès leather has a unique living quality.' },
    { step: 3, title: 'Saddle Stitching', detail: 'All Hermès bags are hand-sewn with the saddle stitch: two needles from each end, creating an X pattern from each side. Count ~10 stitches per 2cm. Thread is linen, waxed. Under magnification, the thread should show the wax coating. Machine stitching (one loop per stitch) = fake.' },
    { step: 4, title: 'Hardware Weight & Engraving', detail: 'Hermès hardware (palladium or gold) is extremely heavy. The "HERMÈS PARIS" engraving on the lock, turnkey, and closures should be crisp and deep. Shallow or fuzzy engraving = fake. The clochette (key holder) bell should have "HERMÈS" engraved.' },
    { step: 5, title: 'Interior Stamp', detail: '"HERMÈS PARIS Made in France" stamped in gold (or blind) on the inner flap. The typeface is specific — slightly wider than modern sans-serif fonts. Stamp placement is consistent: centered on the main interior flap near the top.' },
    { step: 6, title: 'Dust Bag & Box', detail: 'Authentic Hermès comes in the orange box with brown ribbon. The dust bag is felt — orange for regular bags, cream/ecru for specific leathers. The "H" on the dust bag should be centered and proportional. Generic white bags or wrong-shade orange boxes are red flags.' },
  ] : [
    { step: 1, title: 'Blind Stamp (ตัวอักษรปีผลิต)', detail: 'Hermès ประทับตัวอักษรภายในกระเป๋าบอกปีผลิต แต่ละตัวอักษรใช้หนึ่งปี (A=2017, B=2018... H=2024) ประทับในกรอบสี่เหลี่ยมหรือวงกลมพร้อมตราของช่าง ขาดหรือตรวจสอบไม่ได้ = สัญญาณอันตราย' },
    { step: 2, title: 'การระบุประเภทหนัง', detail: 'หนังทั่วไป: Togo (ผิวเม็ด ทนรอย), Clemence (เม็ดนิ่มกว่า), Epsom (ลายตาราง แข็งทรง), Box Calf (เรียบ เป็นทางการ), Chevre (แพะ เม็ดเล็ก) แต่ละชนิดมีเนื้อสัมผัสและเงาเฉพาะ ของปลอมมักใช้ลายเลียน Togo แต่ขนาดหรือความแข็งผิด' },
    { step: 3, title: 'Saddle Stitching (การเย็บอาน)', detail: 'Hermès ทุกใบเย็บมือด้วย saddle stitch: เข็มสองเส้นจากแต่ละด้าน สร้างลาย X นับ ~10 เข็มต่อ 2 ซม. ด้ายเป็นลินินเคลือบขี้ผึ้ง ภายใต้กล้องขยายเห็นขี้ผึ้งเคลือบ การเย็บด้วยเครื่อง (ห่วงเดียวต่อเข็ม) = ปลอม' },
    { step: 4, title: 'น้ำหนักและการแกะสลัก Hardware', detail: 'Hardware Hermès (พัลลาเดียมหรือทอง) หนักมาก ตัวอักษร "HERMÈS PARIS" บนกุญแจและตัวล็อกควรคมชัดและลึก แกะสลักตื้นหรือพร่ามัว = ปลอม กระดิ่ง clochette ควรมี "HERMÈS" แกะสลัก' },
    { step: 5, title: 'ตราประทับภายใน', detail: '"HERMÈS PARIS Made in France" ประทับทองหรือ blind บนแผ่นหนังด้านใน แบบอักษรเฉพาะ ตำแหน่งประทับสม่ำเสมอ: ตรงกลางแผ่นด้านในใกล้ด้านบน' },
    { step: 6, title: 'ถุงผ้าและกล่อง', detail: 'Hermès แท้มาในกล่องสีส้มพร้อมริบบิ้นน้ำตาล ถุงผ้าเป็นเฟลต — สีส้มสำหรับกระเป๋าทั่วไป ครีม/เอครูสำหรับหนังบางชนิด "H" บนถุงผ้าควรอยู่ตรงกลางสมส่วน ถุงสีขาวทั่วไปหรือสีส้มผิดเฉด = สัญญาณอันตราย' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Authenticate Hermès' : 'ตรวจสอบ Hermès'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'How to Authenticate Hermès Bags' : 'วิธีตรวจสอบกระเป๋า Hermès แท้'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Authentic Hermès has multiple tells that counterfeiters cannot fully replicate — especially the saddle stitch, blind stamp year letter, and leather quality.'
          : 'Hermès แท้มีเครื่องหมายหลายอย่างที่ผู้ปลอมไม่สามารถลอกได้ครบ โดยเฉพาะ saddle stitch blind stamp และคุณภาพหนัง'}
      </p>

      <div className="space-y-4 mb-10">
        {checks.map(c => (
          <div key={c.step} className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center shrink-0">{c.step}</span>
              <h2 className="font-semibold text-gray-900">{c.title}</h2>
            </div>
            <p className="text-sm text-gray-600 ml-10">{c.detail}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/how-to-authenticate-hermes" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/how-to-authenticate-hermes" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/hermes`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Hermès Pre-Owned →' : 'Hermès มือสอง →'}</Link>
        <Link href={`/${locale}/guides/hermes-birkin-vs-kelly`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Birkin vs Kelly →</Link>
      </div>
    </div>
  )
}
