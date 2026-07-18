import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/hermes-constance-vs-kelly'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Hermès Constance vs Kelly Thailand 2025: Investment & Pre-Owned | ChicPreowned'
      : 'Hermès Constance vs Kelly ในไทย 2025: การลงทุน & มือสอง | ChicPreowned',
    description: isEn
      ? 'Hermès Constance vs Kelly for Thailand buyers 2025 — H clasp crossbody vs structured frame, THB prices, Kelly 25 Sellier investment case, and which Hermès pre-owned to choose.'
      : 'Hermès Constance vs Kelly สำหรับผู้ซื้อในไทย 2025 สายสะพาย H clasp vs กรอบมีโครงสร้าง ราคาบาท เหตุผลการลงทุน Kelly 25 Sellier และ Hermès มือสองไหนควรเลือก',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

function formatPriceTHB(usdLow: number, usdHigh: number) {
  const low = Math.round(usdLow * 36 / 500) * 500
  const high = Math.round(usdHigh * 36 / 500) * 500
  return `฿${low.toLocaleString()}–฿${high.toLocaleString()}`
}

export default async function HermesConstanceVsKellyTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { aspect: 'Launched', c: '1959', k: '1935 (renamed 1977 after Grace Kelly)' },
    { aspect: 'Shape', c: 'Envelope flap — slim, flat, structured', k: 'Trapezoidal frame — rigid with four feet' },
    { aspect: 'Closure', c: 'H clasp — single turn-lock', k: 'Toggle closure + two belted straps' },
    { aspect: 'Sizes', c: '14cm, 18cm (most sought), 24cm', k: '20, 25 (most sought), 28, 32, 35, 40cm' },
    { aspect: 'New price', c: `$6,800–9,500 (${formatPriceTHB(6800, 9500)}) 18–24cm`, k: `$9,200–14,500 (${formatPriceTHB(9200, 14500)}) 25–32cm` },
    { aspect: 'Pre-owned entry', c: `$5,200–8,000 (${formatPriceTHB(5200, 8000)}) 18cm`, k: `$7,500–12,000 (${formatPriceTHB(7500, 12000)}) 25–28cm` },
    { aspect: 'Resale retention', c: '85–110%+ (often above retail)', k: '90–130%+ (Kelly 25 Sellier: consistently above retail)' },
    { aspect: 'Investment tier', c: 'S-Tier (crossbody demand drives floor)', k: 'S+ Tier (top 3 most investable bags globally)' },
    { aspect: 'Bangkok note', c: 'Available via Hermès Siam Paragon waitlist', k: 'Same waitlist — Kelly allocation even more restricted' },
  ] : [
    { aspect: 'เปิดตัว', c: '1959', k: '1935 (เปลี่ยนชื่อ 1977 ตาม Grace Kelly)' },
    { aspect: 'รูปทรง', c: 'ฝาซองจดหมาย — บาง แบน มีโครงสร้าง', k: 'กรอบสี่เหลี่ยมคางหมู — แข็งพร้อม 4 ขา' },
    { aspect: 'การปิด', c: 'ตัวล็อค H เดียว', k: 'ตัวล็อค toggle + สายคาด 2 เส้น' },
    { aspect: 'ขนาด', c: '14cm, 18cm (ต้องการมากสุด), 24cm', k: '20, 25 (ต้องการมากสุด), 28, 32, 35, 40cm' },
    { aspect: 'ราคาใหม่', c: `$6,800–9,500 (${formatPriceTHB(6800, 9500)}) 18–24cm`, k: `$9,200–14,500 (${formatPriceTHB(9200, 14500)}) 25–32cm` },
    { aspect: 'มือสองเริ่มต้น', c: `$5,200–8,000 (${formatPriceTHB(5200, 8000)}) 18cm`, k: `$7,500–12,000 (${formatPriceTHB(7500, 12000)}) 25–28cm` },
    { aspect: 'อัตราการรักษามูลค่า', c: '85–110%+ (มักเกินราคาขาย)', k: '90–130%+ (Kelly 25 Sellier: สม่ำเสมอเกินราคาขาย)' },
    { aspect: 'ระดับการลงทุน', c: 'S-Tier (ความต้องการสะพายขับเคลื่อน)', k: 'S+ Tier (top 3 กระเป๋าลงทุนได้ดีที่สุดของโลก)' },
    { aspect: 'หมายเหตุกรุงเทพ', c: 'มีผ่าน waitlist Hermès Siam Paragon', k: 'Waitlist เดียวกัน การจัดสรร Kelly จำกัดมากกว่า' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/compare`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>Hermès Constance vs Kelly</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Hermès Constance vs Kelly (2025): Which Is the Better Investment?' : 'Hermès Constance vs Kelly (2025): อันไหนลงทุนได้ดีกว่า?'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Both are S-Tier Hermès investments that consistently trade at or above retail. The Constance wins on wearability and crossbody freedom; the Kelly 25 Sellier is arguably the single best investment bag in the luxury market globally.'
          : 'ทั้งสองเป็นการลงทุน Hermès ระดับ S-Tier ที่ซื้อขายที่หรือเหนือราคาขายปลีกอย่างสม่ำเสมอ Constance ชนะด้านการสวมใส่และอิสระในการสะพาย Kelly 25 Sellier อาจเป็นกระเป๋าลงทุนที่ดีที่สุดในตลาดหรูทั่วโลก'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">{isEn ? 'Aspect' : 'ด้าน'}</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-amber-700">Constance</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-amber-900">Kelly</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="p-3 border border-gray-200 font-medium text-gray-700 text-xs">{row.aspect}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.c}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.k}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-900 text-white rounded-xl p-5 mb-8">
        <h3 className="font-semibold mb-2">{isEn ? 'Kelly 25 Sellier: the single best investment bag' : 'Kelly 25 Sellier: กระเป๋าลงทุนที่ดีที่สุดอันเดียว'}</h3>
        <p className="text-sm text-gray-300">
          {isEn
            ? `The Kelly 25 Sellier in Togo/Epsom Noir with PHW has exceeded retail consistently 2019–2024. A $9,200 retail piece has sold pre-owned for $14,000–18,000 (${formatPriceTHB(14000, 18000)}) — up to 95% above retail. Waitlist years + timeless design + active celebrity placement = sustained demand floor unlike any other bag.`
            : `Kelly 25 Sellier ใน Togo/Epsom Noir พร้อม PHW เกินราคาขายปลีกอย่างสม่ำเสมอ 2019–2024 ชิ้น retail $9,200 ขายมือสองได้ $14,000–18,000 (${formatPriceTHB(14000, 18000)}) สูงขึ้นถึง 95% เหนือ retail Waitlist หลายปี + ดีไซน์ไม่มีวันตกยุค + นักแสดงสวมใส่ = ระดับความต้องการที่คงที่ต่างจากกระเป๋าอื่น`}
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/hermes-constance-vs-kelly" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/hermes-constance-vs-kelly" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/compare/kelly-vs-birkin`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Kelly vs Birkin →</Link>
        <Link href={`/${locale}/guides/hermes-bag-size-guide`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Hermès Size Guide' : 'คู่มือขนาด Hermès'} →</Link>
        <Link href={`/${locale}/guides/how-to-authenticate-hermes`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Authenticate Hermès' : 'ยืนยัน Hermès'} →</Link>
      </div>
    </div>
  )
}
