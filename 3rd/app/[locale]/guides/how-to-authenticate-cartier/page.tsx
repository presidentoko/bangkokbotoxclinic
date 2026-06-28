import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/how-to-authenticate-cartier'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'How to Authenticate Cartier Love Bracelet & Jewelry 2025 | ChicPreowned Thailand'
      : 'วิธีตรวจสอบความแท้กำไล Cartier Love และเครื่องประดับ 2025 | ChicPreowned ไทย',
    description: isEn
      ? 'Cartier authentication guide — Love bracelet screw details, hallmarks, serial numbers, weight, engravings. Buy authentic pre-owned Cartier in Thailand.'
      : 'คู่มือตรวจสอบ Cartier — รายละเอียดสกรู Love bracelet hallmark หมายเลขซีเรียล น้ำหนัก การแกะสลัก ซื้อ Cartier มือสองของแท้ในไทย',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

export default async function AuthCartierTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const checks = isEn ? [
    { n: '1', title: 'Love Bracelet Screws', body: 'Cartier Love bracelet screws are oval-shaped, not round. Each screw head has a subtle flat slot for the proprietary Cartier screwdriver. Screws must be uniform in size and perfectly flush with the bracelet surface. Non-oval or raised screws indicate fake.' },
    { n: '2', title: 'Hallmark and Metal Purity Stamps', body: 'Authentic Cartier pieces have small hallmarks stamped inside: gold purity (750 = 18k, 950 = platinum), country of import mark, and Cartier reference mark. A loupe reveals these clearly on real pieces. Fakes either omit them or stamp them too boldly (look fake).' },
    { n: '3', title: 'Serial Number on Inner Edge', body: 'Love bracelets have a serial number engraved on the inner edge — typically starting with the year code. Format: two letters + numbers (e.g., PD1234). The engraving is laser-precise, fine, and even. Deep, uneven, or missing serials are red flags.' },
    { n: '4', title: 'Weight and Feel', body: '18k gold Cartier bracelets are notably heavy. An authentic Love bracelet in yellow gold weighs approximately 37–43g depending on size. If a piece feels suspiciously light, it may be gold-plated base metal. Use a postal scale if possible when buying pre-owned.' },
    { n: '5', title: '"Cartier" Engraving Quality', body: 'On Trinity rings, Love bracelets, and Juste un Clou, "CARTIER" is engraved inside with a specific font — thin, clean serifs. The text is perfectly spaced and level. Fake pieces often show uneven spacing, thick fonts, or laser-etched (not engraved) text.' },
    { n: '6', title: 'Certificate and Packaging', body: 'Authentic Cartier comes with a cream/ivory box, a "Cartier Red Book" warranty booklet, and a certificate of authenticity. Box quality is impeccable — heavy lid, clean printing, ribbon pull. However, authentic boxes can be separated from authentic pieces, so packaging alone is insufficient. Always verify the piece itself.' },
  ] : [
    { n: '1', title: 'สกรู Love Bracelet', body: 'สกรู Cartier Love bracelet มีรูปทรงรี ไม่ใช่กลม หัวสกรูแต่ละตัวมีร่องแบนละเอียดสำหรับไขควง Cartier เฉพาะทาง สกรูต้องสม่ำเสมอในขนาดและพอดีกับผิวกำไล สกรูไม่รีหรือนูนขึ้นมาบ่งชี้ว่าเป็นของปลอม' },
    { n: '2', title: 'Hallmark และตราความบริสุทธิ์ของโลหะ', body: 'ชิ้น Cartier แท้มีรหัสขนาดเล็กประทับด้านใน: ความบริสุทธิ์ทอง (750 = 18k, 950 = แพลตินัม) เครื่องหมายนำเข้าของประเทศ และเครื่องหมายอ้างอิง Cartier แว่นขยายเปิดเผยสิ่งเหล่านี้อย่างชัดเจนบนชิ้นของแท้ ของปลอมไม่ประทับหรือประทับใหญ่เกินไป' },
    { n: '3', title: 'หมายเลขซีเรียลที่ขอบด้านใน', body: 'Love bracelet มีหมายเลขซีเรียลแกะสลักที่ขอบด้านใน — มักเริ่มด้วยรหัสปี รูปแบบ: ตัวอักษรสองตัว + ตัวเลข (เช่น PD1234) การแกะสลักใช้เลเซอร์ที่แม่นยำ บาง และสม่ำเสมอ ซีเรียลลึก ไม่สม่ำเสมอ หรือไม่มีเป็นสัญญาณเตือน' },
    { n: '4', title: 'น้ำหนักและความรู้สึก', body: 'กำไล Cartier ทอง 18k หนักเห็นได้ชัด Love bracelet ของแท้ในทองเหลืองหนักประมาณ 37–43 กรัมขึ้นอยู่กับขนาด ถ้าชิ้นรู้สึกเบาผิดปกติอาจเป็นโลหะฐานชุบทอง ใช้ตาชั่งไปรษณีย์ถ้าเป็นไปได้เมื่อซื้อมือสอง' },
    { n: '5', title: 'คุณภาพการแกะสลัก "Cartier"', body: 'บน Trinity ring Love bracelet และ Juste un Clou "CARTIER" แกะสลักด้านในด้วยตัวอักษรเฉพาะ — เซอริฟบาง สะอาด ข้อความเว้นระยะสมบูรณ์และระดับ ของปลอมมักแสดงระยะห่างไม่สม่ำเสมอ ตัวอักษรหนา หรือข้อความ laser-etched (ไม่ใช่แกะสลัก)' },
    { n: '6', title: 'ใบรับรองและบรรจุภัณฑ์', body: 'Cartier ของแท้มากับกล่องสีครีม/งาช้าง "Cartier Red Book" หนังสือรับประกัน และใบรับรองความแท้ คุณภาพกล่องไม่มีที่ติ — ฝาหนัก การพิมพ์สะอาด ริบบิ้นดึง อย่างไรก็ตามกล่องของแท้สามารถแยกจากชิ้นของแท้ได้ ดังนั้นบรรจุภัณฑ์เพียงอย่างเดียวไม่เพียงพอ ต้องตรวจสอบตัวชิ้นงานเสมอ' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Authenticate Cartier' : 'ตรวจสอบ Cartier'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'How to Authenticate Cartier Jewelry' : 'วิธีตรวจสอบความแท้เครื่องประดับ Cartier'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Cartier Love bracelets are among the most faked jewelry pieces in Southeast Asia. The oval screws, weight, and interior engraving are the clearest indicators. Six checks every pre-owned Cartier buyer in Thailand should know.'
          : 'กำไล Cartier Love เป็นหนึ่งในเครื่องประดับที่ถูกปลอมแปลงมากที่สุดในเอเชียตะวันออกเฉียงใต้ สกรูรูปไข่ น้ำหนัก และการแกะสลักภายในเป็นตัวบ่งชี้ที่ชัดเจนที่สุด หกขั้นตอนที่ผู้ซื้อ Cartier มือสองในไทยทุกคนควรรู้'}
      </p>

      <div className="space-y-5 mb-10">
        {checks.map((c) => (
          <div key={c.n} className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-start gap-4">
              <span className="text-2xl font-bold text-gray-200 leading-none">{c.n}</span>
              <div>
                <h2 className="font-semibold text-gray-900 mb-1">{c.title}</h2>
                <p className="text-sm text-gray-600">{c.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/how-to-authenticate-cartier" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/how-to-authenticate-cartier" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/compare/cartier-vs-tiffany`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Cartier vs Tiffany →</Link>
        <Link href={`/${locale}/guides/luxury-jewelry-buying-guide`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Jewelry Buying Guide →' : 'คู่มือซื้อเครื่องประดับ →'}</Link>
      </div>
    </div>
  )
}
