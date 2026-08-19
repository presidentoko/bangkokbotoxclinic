import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/loewe-vs-celine'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Loewe vs Celine Thailand ${PRICE_YEAR}: Puzzle vs Triomphe | ChicPreowned`
      : `Loewe vs Celine ไทย ${PRICE_YEAR}: Puzzle vs Triomphe | ChicPreowned`,
    description: isEn
      ? `Loewe vs Celine for Bangkok buyers — Puzzle bag vs Triomphe, Philo vs Slimane era, THB prices, resale, quiet luxury comparison ${PRICE_YEAR}.`
      : `Loewe vs Celine สำหรับผู้ซื้อกรุงเทพ Puzzle bag vs Triomphe ยุค Philo vs Slimane ราคาบาท การขายต่อ เปรียบเทียบ quiet luxury ${PRICE_YEAR}`,
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

function formatPriceTHB(usd: number) {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export default async function LoeweVsCelineTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { label: 'Founded', loewe: 'Madrid, 1846. Leather cooperative. LVMH since 1996.', celine: 'Paris, 1945. LVMH since 1987.' },
    { label: 'Creative direction', loewe: 'Jonathan Anderson (2013–present). Art-world craft positioning.', celine: 'Phoebe Philo (2008–2018) = most collectible. Hedi Slimane (2018–present).' },
    { label: 'Entry price', loewe: `Flamenco small: $400–$700 (${formatPriceTHB(400)}–${formatPriceTHB(700)})`, celine: `Triomphe canvas mini: $300–$550 (${formatPriceTHB(300)}–${formatPriceTHB(550)})` },
    { label: 'Most iconic piece', loewe: `Puzzle Bag — unique geometry. Medium pre-owned: $1,200–$1,800 (${formatPriceTHB(1200)}–${formatPriceTHB(1800)})`, celine: `Philo-era bags (Phantom, Trio, Classic Box) — collector tier $700–$2,500+ (${formatPriceTHB(700)}–${formatPriceTHB(2500)})` },
    { label: 'Leather quality', loewe: 'Exceptional proprietary nappa and calfskin. Notably supple and buttery.', celine: 'Strong under Philo. More mixed under Slimane — some leather thinner.' },
    { label: 'Resale value', loewe: 'Puzzle: 55–75% of retail. Consistent.', celine: 'Philo-era: 60–100%+ of retail. Slimane-era: 40–60%.' },
    { label: 'Quiet luxury', loewe: 'Strong craft narrative, art-world cachet, no visible branding required.', celine: 'Philo = quiet luxury defined. Slimane = logo aesthetic.' },
  ] : [
    { label: 'ก่อตั้ง', loewe: 'มาดริด 1846 สหกรณ์เครื่องหนัง LVMH ตั้งแต่ปี 1996', celine: 'ปารีส 1945 LVMH ตั้งแต่ปี 1987' },
    { label: 'ทิศทางสร้างสรรค์', loewe: 'Jonathan Anderson (2013–ปัจจุบัน) การวางตำแหน่งงานฝีมือโลกศิลปะ', celine: 'Phoebe Philo (2008–2018) = ที่สะสมมากที่สุด Hedi Slimane (2018–ปัจจุบัน)' },
    { label: 'ราคาเริ่มต้น', loewe: `Flamenco small: $400–$700 (${formatPriceTHB(400)}–${formatPriceTHB(700)})`, celine: `Triomphe canvas mini: $300–$550 (${formatPriceTHB(300)}–${formatPriceTHB(550)})` },
    { label: 'ชิ้นไอคอนที่สุด', loewe: `Puzzle Bag เรขาคณิตเฉพาะ Medium มือสอง: $1,200–$1,800 (${formatPriceTHB(1200)}–${formatPriceTHB(1800)})`, celine: `กระเป๋ายุค Philo (Phantom, Trio, Classic Box) ระดับนักสะสม $700–$2,500+ (${formatPriceTHB(700)}–${formatPriceTHB(2500)})` },
    { label: 'คุณภาพหนัง', loewe: 'ยอดเยี่ยม นัปปาและหนังลูกวัวเฉพาะ นุ่มและลื่นอย่างโดดเด่น', celine: 'แข็งแกร่งภายใต้ Philo ผสมกันมากกว่าภายใต้ Slimane หนังบางบางชิ้น' },
    { label: 'มูลค่าขายต่อ', loewe: 'Puzzle: 55–75% ราคาร้าน สม่ำเสมอ', celine: 'ยุค Philo: 60–100%+ ราคาร้าน ยุค Slimane: 40–60%' },
    { label: 'Quiet luxury', loewe: 'การบรรยายงานฝีมือที่แข็งแกร่ง cachet โลกศิลปะ ไม่ต้องการ branding ที่มองเห็นได้', celine: 'Philo = นิยาม quiet luxury Slimane = สุนทรียภาพโลโก้' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/compare`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>Loewe vs Celine</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? `Loewe vs Celine ${PRICE_YEAR}` : `Loewe vs Celine ${PRICE_YEAR}`}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Two quiet luxury powerhouses, both LVMH, both minimal. Loewe under Jonathan Anderson is the brand for people who care about craft. Celine under Phoebe Philo defined effortless minimalism. For Bangkok buyers: Philo-era Celine holds value best; Loewe Puzzle is consistent. Era matters enormously when buying Celine.'
          : 'สองพลังแห่ง quiet luxury ทั้ง LVMH ทั้ง minimal Loewe ภายใต้ Jonathan Anderson คือแบรนด์สำหรับคนที่ใส่ใจงานฝีมือ Celine ภายใต้ Phoebe Philo นิยาม minimalism ที่ไม่ต้องพยายาม สำหรับผู้ซื้อกรุงเทพ Celine ยุค Philo รักษามูลค่าได้ดีที่สุด Loewe Puzzle สม่ำเสมอ ยุคสมัยมีความสำคัญอย่างมากเมื่อซื้อ Celine'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="w-32 text-left py-3 px-4 font-semibold text-gray-500 uppercase text-xs tracking-wide"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Loewe</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Celine</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">{row.label}</td>
                <td className="py-3 px-4 text-gray-700 text-sm">{row.loewe}</td>
                <td className="py-3 px-4 text-gray-700 text-sm">{row.celine}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-10">
        <h3 className="font-semibold text-blue-900 mb-2">{isEn ? 'Celine era note: Philo vs Slimane' : 'หมายเหตุยุค Celine: Philo vs Slimane'}</h3>
        <p className="text-sm text-blue-800">{isEn ? 'Era is everything when buying Celine pre-owned. Philo pieces (2008–2018): Phantom, Trio, Classic Box, Cabas command collector premiums. Slimane added the accent to "Céline" and shifted to rockier aesthetic. Philo-era consistently outperforms Slimane-era on resale — always verify which era you are buying.' : 'ยุคสมัยคือทุกอย่างเมื่อซื้อ Celine มือสอง ชิ้น Philo (2008–2018): Phantom, Trio, Classic Box, Cabas มีพรีเมียมนักสะสม Slimane เพิ่มสำเนียงให้ "Céline" และเปลี่ยนไปสู่สุนทรียภาพสไตล์ rock ยุค Philo มีผลการขายต่อดีกว่ายุค Slimane อย่างสม่ำเสมอ ตรวจสอบยุคที่คุณซื้อเสมอ'}</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/loewe-vs-celine" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/loewe-vs-celine" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/loewe`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Loewe Pre-Owned →' : 'Loewe มือสอง →'}</Link>
        <Link href={`/${locale}/brands/celine`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Celine Pre-Owned →' : 'Celine มือสอง →'}</Link>
        <Link href={`/${locale}/compare/fendi-vs-loewe`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Fendi vs Loewe →</Link>
      </div>
    </div>
  )
}
