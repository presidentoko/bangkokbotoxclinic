import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/ap-royal-oak-vs-nautilus'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'AP Royal Oak vs Patek Nautilus Thailand 2025 | ChicPreowned'
      : 'AP Royal Oak vs Patek Nautilus ในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Audemars Piguet Royal Oak vs Patek Nautilus for Thailand buyers 2025 — Gerald Genta legacy, investment tiers, THB prices, production status, and which steel sports watch to buy pre-owned.'
      : 'AP Royal Oak vs Patek Nautilus สำหรับผู้ซื้อในไทย 2025 มรดก Gerald Genta ระดับการลงทุน ราคาบาท สถานะการผลิต และควรซื้อนาฬิกา steel sports ไหนมือสอง',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

function formatPriceTHB(usdLow: number, usdHigh: number) {
  const low = Math.round(usdLow * 36 / 500) * 500
  const high = Math.round(usdHigh * 36 / 500) * 500
  return `฿${low.toLocaleString()}–฿${high.toLocaleString()}`
}

export default async function ApRoyalOakVsNautilusTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { aspect: 'Designed by', ap: 'Gerald Genta — 1972', naut: 'Gerald Genta — 1976 (for Patek)' },
    { aspect: 'Case shape', ap: 'Octagonal bezel, visible screws', naut: 'Round case, integrated "porthole" style' },
    { aspect: 'Dial', ap: '"Petite tapisserie" hobnail guilloché', naut: 'Horizontal striped guilloché' },
    { aspect: 'Pre-owned entry', ap: `$28,000–45,000 (${formatPriceTHB(28000, 45000)}) Royal Oak 15500`, naut: `$60,000–90,000 (${formatPriceTHB(60000, 90000)}) 5711/1A blue` },
    { aspect: 'Resale retention', ap: '100–180%+ (15500 premium above retail)', naut: '200–630%+ (5711/1A Olive Green extreme)' },
    { aspect: 'Investment tier', ap: 'S-Tier (Royal Oak 15500)', naut: 'S+ Tier (5711/1A discontinued; in a class alone)' },
    { aspect: 'Production status', ap: 'Active — waitlist 3–7 years at AD', naut: '5711 discontinued; 5811 replaces (current)' },
    { aspect: 'Bangkok note', ap: 'AP at Siam Paragon — waitlist years for steel', naut: 'Patek at Central Embassy — 5711 secondary only' },
  ] : [
    { aspect: 'ออกแบบโดย', ap: 'Gerald Genta — 1972', naut: 'Gerald Genta — 1976 (สำหรับ Patek)' },
    { aspect: 'รูปทรงเรือน', ap: 'ขอบแปดเหลี่ยม สกรูที่มองเห็นได้', naut: 'เรือนกลม สไตล์ "porthole" ผสมกัน' },
    { aspect: 'หน้าปัด', ap: '"Petite tapisserie" hobnail guilloché', naut: 'Guilloché ลายแนวนอน' },
    { aspect: 'มือสองเริ่มต้น', ap: `$28,000–45,000 (${formatPriceTHB(28000, 45000)}) Royal Oak 15500`, naut: `$60,000–90,000 (${formatPriceTHB(60000, 90000)}) 5711/1A หน้าน้ำเงิน` },
    { aspect: 'อัตราการรักษามูลค่า', ap: '100–180%+ (15500 พรีเมียมเหนือ retail)', naut: '200–630%+ (5711/1A Olive Green สุดขีด)' },
    { aspect: 'ระดับการลงทุน', ap: 'S-Tier (Royal Oak 15500)', naut: 'S+ Tier (5711/1A ยกเลิกผลิต; อยู่ในชั้นของตัวเอง)' },
    { aspect: 'สถานะการผลิต', ap: 'ใช้งานอยู่ รายชื่อรอที่ AD 3–7 ปี', naut: '5711 ยกเลิกผลิต; 5811 แทนที่ (ปัจจุบัน)' },
    { aspect: 'หมายเหตุกรุงเทพ', ap: 'AP ที่ Siam Paragon รอคิวสแตนเลสหลายปี', naut: 'Patek ที่ Central Embassy 5711 ตลาดรองเท่านั้น' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/compare`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>AP Royal Oak vs Nautilus</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'AP Royal Oak vs Patek Nautilus (2025): Which Watch to Buy?' : 'AP Royal Oak vs Patek Nautilus (2025): ควรซื้อนาฬิกาไหน?'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Both designed by Gerald Genta and both define "integrated bracelet steel sports luxury." But they serve different buyers — and their investment profiles differ significantly. The Nautilus 5711/1A is arguably the most valuable production watch of the modern era; the Royal Oak is the category inventor.'
          : 'ทั้งสองออกแบบโดย Gerald Genta และทั้งสองนิยาม "ความหรูหราด้านกีฬาสแตนเลสพร้อมสาย integrated" แต่รับใช้ผู้ซื้อที่แตกต่างกัน และโปรไฟล์การลงทุนของพวกเขาต่างกันอย่างมีนัยสำคัญ Nautilus 5711/1A อาจเป็นนาฬิกาผลิตที่มีค่าที่สุดในยุคสมัยใหม่ Royal Oak คือผู้ประดิษฐ์หมวดหมู่'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">{isEn ? 'Aspect' : 'ด้าน'}</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-blue-800">AP Royal Oak</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-amber-800">Patek Nautilus</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="p-3 border border-gray-200 font-medium text-gray-700 text-xs">{row.aspect}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.ap}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.naut}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-900 text-white rounded-xl p-5 mb-8">
        <h3 className="font-semibold mb-2">{isEn ? 'Gerald Genta: the man who designed both' : 'Gerald Genta: ผู้ชายที่ออกแบบทั้งสอง'}</h3>
        <p className="text-sm text-gray-300">
          {isEn
            ? 'Gerald Genta designed the Royal Oak for AP in 1972 (reportedly in a single night) and the Nautilus for Patek in 1976. Both were radical — steel sports watches priced like complicated dress watches. Both were initially controversial; both became the most sought-after watches in the world.'
            : 'Gerald Genta ออกแบบ Royal Oak สำหรับ AP ในปี 1972 (กล่าวกันว่าในคืนเดียว) และ Nautilus สำหรับ Patek ในปี 1976 ทั้งสองสุดโต่ง นาฬิกา steel sports ที่ตั้งราคาเหมือนนาฬิกาพิธีการที่ซับซ้อน ทั้งสองเป็นที่โต้เถียงในตอนแรก ทั้งสองกลายเป็นนาฬิกาที่ต้องการมากที่สุดในโลก'}
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/ap-royal-oak-vs-nautilus" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/ap-royal-oak-vs-nautilus" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/compare/ap-vs-patek-philippe`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">AP vs Patek →</Link>
        <Link href={`/${locale}/trends/patek-philippe-nautilus-investment-2025`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Nautilus Investment' : 'การลงทุน Nautilus'} →</Link>
        <Link href={`/${locale}/compare/rolex-vs-audemars-piguet`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs AP →</Link>
      </div>
    </div>
  )
}
