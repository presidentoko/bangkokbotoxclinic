import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/how-to-authenticate-loewe'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'How to Authenticate Loewe in Thailand: 7 Checks (2025) | ChicPreowned'
      : 'วิธียืนยันความถูกต้องของ Loewe ในไทย: 7 จุดตรวจสอบ (2025) | ChicPreowned',
    description: isEn
      ? 'Authenticate any Loewe bag in Thailand — Anagram emboss, Puzzle panel construction, LOEWE hardware engraving, nappa leather quality, interior Made in Spain stamp, stitching, and hardware weight.'
      : 'ยืนยันความถูกต้องของกระเป๋า Loewe ใดก็ตามในไทย การนูน Anagram โครงสร้างแผง Puzzle การแกะสลักฮาร์ดแวร์ LOEWE คุณภาพหนัง nappa ตราประทับ Made in Spain ภายใน การเย็บ และน้ำหนักฮาร์ดแวร์',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

export default async function AuthenticateLoewe({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const checks = isEn ? [
    { title: 'Anagram logo — emboss depth and font', quick: '"LOEWE" inside double-L Anagram: consistently embossed, never printed', detail: 'Anagram must be perfectly embossed — consistent depth across all elements. On hardware: Anagram on turn-lock. On leather accessories: debossed leather patch. Fakes print the logo flat (no depth), use slightly different letterform, or have uneven emboss depth.' },
    { title: 'Puzzle panel construction — single hide', quick: 'Each Puzzle panel from single hide — no colour variance within panel, precise interlocking joints', detail: 'Genuine Puzzle: each panel cut from one piece of nappa calf leather. Panels interlock at precise angles with consistent stitching. Within any panel, grain is perfectly consistent (one hide). Key test: bottom corners where three panels meet — perfect geometric fold, no puckering or gap.' },
    { title: '"LOEWE" hardware engraving', quick: '"LOEWE" in clean capital sans-serif, engraved deep on clasps and zipper pulls', detail: 'Turn-lock: "LOEWE" on front face. Zipper pulls: "LOEWE" on flat face. Engraving is deep, consistent depth per letter. Fakes have shallow lettering, inconsistent character weight, or wrong font entirely.' },
    { title: 'Nappa leather quality', quick: 'Buttery soft, very fine grain, slight natural variation — not uniform PU grain', detail: 'Loewe uses exceptional-quality Spanish and European nappa. Buttery-soft with fine natural grain that has slight variation (intentional). Each hide has minor tonal differences. Fakes use PU leather — too uniform texture, no natural variation, warms quickly in hand.' },
    { title: 'Interior "LOEWE MADE IN SPAIN" stamp', quick: '"LOEWE MADE IN SPAIN" debossed in leather — Spanish house, never Italy', detail: 'Loewe founded 1846 Madrid. All genuine: "MADE IN SPAIN." Interior stamp reads "LOEWE" above "MADE IN SPAIN," debossed (not printed). Serial on separate tag, stamped. Fakes often stamp "MADE IN ITALY" (wrong country).' },
    { title: 'Saddle stitch quality', quick: '8-10 even stitches per inch, exactly matching thread — Puzzle panel edges saddle-stitched', detail: 'Loewe uses traditional saddle-stitch on panel edges. 8-10/inch, consistent tension, exact colour match. Puzzle seams: stitching follows panel edge precisely. Fakes have machine-stitching (less even), wrong thread colour, or gaps at corner joins.' },
    { title: 'Hardware finish and weight', quick: 'Palladium/gold hardware: weighty, satin finish — not lightweight or high-gloss', detail: 'Hardware is substantial in weight with satin (not mirror) finish. Turn-lock engages smoothly with a positive click. Fakes: lightweight hollow hardware, too-shiny finish, turn-locks that wobble.' },
  ] : [
    { title: 'โลโก้ Anagram — ความลึกและฟอนต์ของการนูน', quick: '"LOEWE" ภายใน double-L Anagram: นูนสม่ำเสมอ ไม่ใช่พิมพ์', detail: 'Anagram ต้องนูนสมบูรณ์ ความลึกสม่ำเสมอทั่วทุกองค์ประกอบ บนฮาร์ดแวร์: Anagram บนตัวล็อคหมุน บนอุปกรณ์เสริมหนัง: แผ่นหนังดุน ของปลอมพิมพ์โลโก้แบน (ไม่มีความลึก) ใช้รูปแบบตัวอักษรต่างกัน หรือความลึกการนูนไม่สม่ำเสมอ' },
    { title: 'โครงสร้างแผง Puzzle — หนังผืนเดียว', quick: 'แต่ละแผง Puzzle จากหนังผืนเดียว ไม่มีความผันแปรสีภายในแผง รอยต่อแม่นยำ', detail: 'Puzzle จริง: แต่ละแผงตัดจากหนัง nappa ลูกวัวหนึ่งชิ้น แผงประกบกันที่มุมแม่นยำพร้อมการเย็บสม่ำเสมอ ภายในแผงใดก็ตาม เกรนสม่ำเสมอสมบูรณ์ (หนังผืนเดียว) การทดสอบหลัก: มุมด้านล่างที่สามแผงพบกัน พับเรขาคณิตสมบูรณ์ ไม่ย่น ไม่มีช่องว่าง' },
    { title: 'การแกะสลักฮาร์ดแวร์ "LOEWE"', quick: '"LOEWE" ใน capital sans-serif สะอาด แกะสลักลึกบนตัวล็อคและหัวซิป', detail: 'ตัวล็อคหมุน: "LOEWE" ด้านหน้า หัวซิป: "LOEWE" ด้านแบน การแกะสลักลึก ความลึกสม่ำเสมอต่อตัวอักษร ของปลอมมีตัวอักษรตื้น น้ำหนักตัวอักษรไม่สม่ำเสมอ หรือฟอนต์ผิดทั้งหมด' },
    { title: 'คุณภาพหนัง nappa', quick: 'นุ่มเนื้อเนย เกรนละเอียดมาก มีความผันแปรธรรมชาติเล็กน้อย ไม่ใช่เกรน PU สม่ำเสมอ', detail: 'Loewe ใช้ nappa คุณภาพยอดเยี่ยมจากสเปนและยุโรป นุ่มเนื้อเนยพร้อมเกรนธรรมชาติละเอียดที่มีความผันแปรเล็กน้อย (ตั้งใจ) แต่ละหนังมีความแตกต่างโทนสีเล็กน้อย ของปลอมใช้หนัง PU ที่มีเนื้อสัมผัสสม่ำเสมอเกินไป ไม่มีความผันแปรธรรมชาติ' },
    { title: 'ตราประทับภายใน "LOEWE MADE IN SPAIN"', quick: '"LOEWE MADE IN SPAIN" ดุนในหนัง บ้านสเปน ไม่ใช่อิตาลี', detail: 'Loewe ก่อตั้ง 1846 มาดริด ของแท้ทั้งหมด "MADE IN SPAIN" ตราประทับภายในอ่านว่า "LOEWE" เหนือ "MADE IN SPAIN" ดุน (ไม่ใช่พิมพ์) ซีเรียลบน tag แยก ประทับ ของปลอมมักประทับ "MADE IN ITALY" (ประเทศผิด)' },
    { title: 'คุณภาพการเย็บ saddle', quick: '8-10 เข็มสม่ำเสมอต่อนิ้ว ด้ายตรงกันพอดี ขอบแผง Puzzle เย็บ saddle', detail: 'Loewe ใช้ saddle-stitch แบบดั้งเดิมบนขอบแผง 8-10/นิ้ว แรงตึงสม่ำเสมอ ตรงกับสีพอดี รอยตะเข็บ Puzzle: การเย็บตามขอบแผงแม่นยำ ของปลอมมีการเย็บเครื่อง (ไม่สม่ำเสมอ) ด้ายสีผิด หรือช่องว่างที่รอยต่อมุม' },
    { title: 'ผิวและน้ำหนักฮาร์ดแวร์', quick: 'ฮาร์ดแวร์แพลเลเดียม/ทอง: หนัก ผิวซาตินไม่ใช่ไฮกลอส', detail: 'ฮาร์ดแวร์หนักจริงพร้อมผิวซาติน (ไม่ใช่กระจก) ตัวล็อคหมุนราบรื่นพร้อม click ชัดเจน ของปลอม: ฮาร์ดแวร์เบาข้างในกลวง มันเกินไป ตัวล็อคที่โยกหรือไม่ล็อค' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Authenticate Loewe' : 'ยืนยัน Loewe'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'How to Authenticate Loewe: 7 Checks' : 'วิธียืนยันความถูกต้องของ Loewe: 7 จุดตรวจสอบ'}
      </h1>
      <p className="text-gray-500 mb-4">
        {isEn
          ? 'Loewe has become one of the most faked luxury brands since the Puzzle bag\'s rise under Jonathan Anderson from 2014. High-quality fakes now replicate the construction closely — but panel geometry, leather quality, and hardware always reveal the truth.'
          : 'Loewe กลายเป็นหนึ่งในแบรนด์หรูที่ถูกปลอมมากที่สุดตั้งแต่กระเป๋า Puzzle เพิ่มขึ้นภายใต้ Jonathan Anderson ตั้งแต่ปี 2014 ของปลอมคุณภาพสูงตอนนี้เลียนแบบโครงสร้างได้ใกล้เคียง แต่เรขาคณิตแผง คุณภาพหนัง และฮาร์ดแวร์เสมอเผยความจริง'}
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
        <p className="text-sm text-amber-900 font-medium">{isEn ? 'Fastest check: Puzzle panel corner geometry' : 'ตรวจสอบด่วนที่สุด: เรขาคณิตมุมแผง Puzzle'}</p>
        <p className="text-sm text-amber-800">
          {isEn
            ? 'On a genuine Puzzle, look at the bottom corners where three different panels meet. Geometry is precise — each panel meets at a clean angle with no puckering, gaps, or irregular stitching. On fakes, these corners almost always show puckering or a gap between panels.'
            : 'บน Puzzle จริง มองที่มุมด้านล่างที่สามแผงต่างกันพบกัน เรขาคณิตแม่นยำ แต่ละแผงพบกันที่มุมสะอาดโดยไม่ย่น ไม่มีช่องว่าง ไม่มีการเย็บไม่สม่ำเสมอ บนของปลอม มุมเหล่านี้เกือบเสมอแสดงการย่นหรือช่องว่างระหว่างแผง'}
        </p>
      </div>

      <div className="space-y-4 mb-10">
        {checks.map((c, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <h2 className="font-semibold text-gray-900 mb-1">{i + 1}. {c.title}</h2>
            <p className="text-xs text-amber-700 font-medium mb-2">{c.quick}</p>
            <p className="text-sm text-gray-600">{c.detail}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/how-to-authenticate-loewe" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/how-to-authenticate-loewe" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/loewe`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Loewe →</Link>
        <Link href={`/${locale}/compare/loewe-vs-celine`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Loewe vs Celine →</Link>
        <Link href={`/${locale}/compare/fendi-vs-loewe`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Fendi vs Loewe →</Link>
        <Link href={`/${locale}/compare/jacquemus-vs-loewe`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Jacquemus vs Loewe →</Link>
      </div>
    </div>
  )
}
