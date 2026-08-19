import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/kelly-vs-birkin'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Hermès Kelly vs Birkin Thailand ${PRICE_YEAR}: Which to Buy? | ChicPreowned`
      : `Hermès Kelly vs Birkin ไทย ${PRICE_YEAR}: ควรซื้ออันไหน? | ChicPreowned`,
    description: isEn
      ? `Kelly vs Birkin comparison for Bangkok buyers — THB prices, waitlist reality in Thailand, investment value, pre-owned market. Which Hermès to buy first in ${PRICE_YEAR}?`
      : `เปรียบเทียบ Kelly vs Birkin สำหรับผู้ซื้อกรุงเทพ ราคาบาท ความจริงของรายชื่อรอในไทย มูลค่าการลงทุน ตลาดมือสอง ควรซื้อ Hermès อันไหนก่อนในปี ${PRICE_YEAR}?`,
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

function formatPriceTHB(usd: number) {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export default async function KellyVsBirkinTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { label: 'Origin', kelly: 'Introduced 1935, renamed after Grace Kelly in 1956', birkin: 'Created 1984 after chance meeting with Jane Birkin' },
    { label: 'Entry price', kelly: `Kelly 20 Sellier: $4,500–$7,000 pre-owned (${formatPriceTHB(4500)}–${formatPriceTHB(7000)})`, birkin: `Birkin 25: $7,000–$12,000 pre-owned (${formatPriceTHB(7000)}–${formatPriceTHB(12000)})` },
    { label: 'Most popular size', kelly: 'Kelly 25 and Kelly 28', birkin: 'Birkin 30 and Birkin 35' },
    { label: 'Structure', kelly: 'Rigid top flap, holds shape when empty. More formal.', birkin: 'Open-top, no flap. More casual access.' },
    { label: 'Carry options', kelly: 'Sellier (rigid) or Retourné (soft). Handle + optional strap.', birkin: 'Two rolled handles. No shoulder strap on standard Birkin.' },
    { label: 'Retail price 2025', kelly: `Kelly 25 Epsom: ~$9,800 (${formatPriceTHB(9800)})`, birkin: `Birkin 25 Epsom: ~$10,600 (${formatPriceTHB(10600)})` },
    { label: 'Pre-owned resale', kelly: '100–150%+ of retail (leather). Exotics: 200–400%+', birkin: '110–170%+ of retail (leather). Exotics: 300–600%+' },
    { label: 'Investment case', kelly: 'Lower floor, more accessible entry. Strong but slightly below Birkin ceiling.', birkin: 'Consistently highest resale in the luxury bag market. Birkin 25 exotic = strongest asset.' },
    { label: 'Bangkok waitlist', kelly: 'Slightly shorter Hermès waitlist. Kelly 28/32 more accessible than equivalent Birkin at Central Chidlom.', birkin: 'Waitlist-only. Requires significant "relationship spending" at Hermès boutiques in Bangkok.' },
  ] : [
    { label: 'ต้นกำเนิด', kelly: 'แนะนำในปี 1935 เปลี่ยนชื่อตาม Grace Kelly ในปี 1956', birkin: 'สร้างในปี 1984 หลังจากการพบกันโดยบังเอิญกับ Jane Birkin' },
    { label: 'ราคาเริ่มต้น', kelly: `Kelly 20 Sellier: $4,500–$7,000 มือสอง (${formatPriceTHB(4500)}–${formatPriceTHB(7000)})`, birkin: `Birkin 25: $7,000–$12,000 มือสอง (${formatPriceTHB(7000)}–${formatPriceTHB(12000)})` },
    { label: 'ขนาดยอดนิยม', kelly: 'Kelly 25 และ Kelly 28', birkin: 'Birkin 30 และ Birkin 35' },
    { label: 'โครงสร้าง', kelly: 'ฝาบนแข็ง ทรงรูปแม้เมื่อว่าง เป็นทางการมากกว่า', birkin: 'เปิดด้านบน ไม่มีฝาปิด เข้าถึงได้ง่ายกว่า' },
    { label: 'วิธีถือ', kelly: 'Sellier (แข็ง) หรือ Retourné (นิ่ม) มือจับ + สายสะพายตัวเลือก', birkin: 'มือจับม้วนสองข้าง ไม่มีสายสะพายบ่าในรุ่นมาตรฐาน' },
    { label: 'ราคาร้านปี 2025', kelly: `Kelly 25 Epsom: ~$9,800 (${formatPriceTHB(9800)})`, birkin: `Birkin 25 Epsom: ~$10,600 (${formatPriceTHB(10600)})` },
    { label: 'การขายต่อมือสอง', kelly: '100–150%+ ของราคาร้าน (หนัง) สัตว์หายาก: 200–400%+', birkin: '110–170%+ ของราคาร้าน (หนัง) สัตว์หายาก: 300–600%+' },
    { label: 'คุณค่าการลงทุน', kelly: 'ราคาพื้นต่ำกว่า เข้าถึงได้มากกว่า แข็งแกร่งแต่ต่ำกว่าเพดาน Birkin เล็กน้อย', birkin: 'การขายต่อสูงที่สุดในตลาดกระเป๋าหรูอย่างสม่ำเสมอ Birkin 25 สัตว์หายาก = สินทรัพย์ที่แข็งแกร่งที่สุด' },
    { label: 'รายชื่อรอกรุงเทพ', kelly: 'รายชื่อรอ Hermès สั้นกว่าเล็กน้อย Kelly 28/32 เข้าถึงได้มากกว่า Birkin ที่เทียบกัน ที่ Central Chidlom', birkin: 'ต้องมีรายชื่อรอเท่านั้น ต้องการการใช้จ่ายเกี่ยวพันอย่างมีนัยสำคัญที่บูทีค Hermès ในกรุงเทพ' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/compare`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>Kelly vs Birkin</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? `Hermès Kelly vs Birkin ${PRICE_YEAR}` : `Hermès Kelly vs Birkin ${PRICE_YEAR}`}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Two Hermès icons, one decision. Both appreciate well above retail and dominate the secondary market. The Kelly is more formal and structured; the Birkin has a higher resale ceiling and slightly easier daily access. For Bangkok buyers: both require boutique relationships, but the Kelly is marginally more accessible.'
          : 'สอง Hermès ไอคอน หนึ่งการตัดสินใจ ทั้งคู่เพิ่มมูลค่าเกินราคาร้านอย่างมากและครองตลาดรอง Kelly เป็นทางการและมีโครงสร้างมากกว่า Birkin มีเพดานการขายต่อสูงกว่าและเข้าถึงได้ง่ายกว่าในแต่ละวันเล็กน้อย สำหรับผู้ซื้อกรุงเทพ ทั้งคู่ต้องมีความสัมพันธ์กับบูทีค แต่ Kelly เข้าถึงได้มากกว่าเล็กน้อย'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="w-32 text-left py-3 px-4 font-semibold text-gray-500 uppercase text-xs tracking-wide"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Kelly</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Birkin</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">{row.label}</td>
                <td className="py-3 px-4 text-gray-700 text-sm">{row.kelly}</td>
                <td className="py-3 px-4 text-gray-700 text-sm">{row.birkin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">{isEn ? 'Buy Kelly if…' : 'ซื้อ Kelly ถ้า…'}</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            {(isEn ? [
              'You prefer a formal, structured bag',
              'You want the strap carry option',
              'Entry budget under ฿350k pre-owned',
              'You like the classic top-handle look',
            ] : [
              'คุณชอบกระเป๋าที่เป็นทางการและมีโครงสร้าง',
              'คุณต้องการตัวเลือกถือสายสะพาย',
              'งบเริ่มต้นต่ำกว่า ฿350k มือสอง',
              'คุณชอบลุคมือจับด้านบนแบบคลาสสิก',
            ]).map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">{isEn ? 'Buy Birkin if…' : 'ซื้อ Birkin ถ้า…'}</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            {(isEn ? [
              'Maximum investment potential is the goal',
              'You want faster access (no flap to open)',
              'More casual everyday luxury use',
              'You can be patient for the right pre-owned piece',
            ] : [
              'เป้าหมายคือศักยภาพการลงทุนสูงสุด',
              'ต้องการเข้าถึงเร็วกว่า (ไม่มีฝาต้องเปิด)',
              'การใช้หรูหราแบบสบายๆ ในชีวิตประจำวัน',
              'คุณสามารถอดทนรอชิ้นมือสองที่ถูกต้อง',
            ]).map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">{isEn ? 'Pre-owned verdict' : 'คำตัดสินมือสอง'}</h3>
          <p className="text-sm text-gray-600">{isEn ? 'Both outperform nearly every other luxury brand. Birkin has slightly higher ceiling. Kelly more accessible entry. Either is a strong pre-owned buy for Bangkok collectors.' : 'ทั้งคู่มีประสิทธิภาพเหนือกว่าแบรนด์หรูอื่นๆ เกือบทั้งหมด Birkin มีเพดานสูงกว่าเล็กน้อย Kelly เข้าถึงได้มากกว่า ทั้งคู่เป็นการซื้อมือสองที่ดีสำหรับนักสะสมกรุงเทพ'}</p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/kelly-vs-birkin" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/kelly-vs-birkin" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/hermes`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Hermès Pre-Owned →' : 'Hermès มือสอง →'}</Link>
        <Link href={`/${locale}/compare/chanel-vs-hermes`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Chanel vs Hermès →</Link>
      </div>
    </div>
  )
}
