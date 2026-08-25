import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'
import { ThaiPriceCallout } from '@/components/ThaiPriceCallout'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/lv-alma-vs-speedy'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `LV Alma vs Speedy Thailand ${PRICE_YEAR}: Size Guide & Pre-Owned | ChicPreowned`
      : `LV Alma vs Speedy ในไทย ${PRICE_YEAR}: คู่มือขนาด & มือสอง | ChicPreowned`,
    description: isEn
      ? `LV Alma vs Speedy for Bangkok buyers ${PRICE_YEAR} — arch shape vs barrel, size comparison, THB prices, Vernis Alma investment tip, and which to buy pre-owned in Thailand.`
      : `LV Alma vs Speedy สำหรับผู้ซื้อกรุงเทพ ${PRICE_YEAR} ทรงโค้งvs ทรงถัง เปรียบเทียบขนาด ราคาบาท เคล็ดลับการลงทุน Vernis Alma และควรซื้อมือสองอันไหนในไทย`,
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

function formatPriceTHB(usdLow: number, usdHigh: number) {
  const low = Math.round(usdLow * 36 / 500) * 500
  const high = Math.round(usdHigh * 36 / 500) * 500
  return `฿${low.toLocaleString()}–฿${high.toLocaleString()}`
}

export default async function LvAlmaVsSpeedyTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { aspect: 'Shape', alma: 'Arch (dome-shaped, flat bottom, rigid)', speedy: 'Barrel (rounded, soft structure)' },
    { aspect: 'Launched', alma: '1934 (Art Deco)', speedy: '1930 (inspired by Keepall)' },
    { aspect: 'Closure', alma: 'Turn-lock clasp — rigid', speedy: 'Top zip (B25+) — soft' },
    { aspect: 'Sizes', alma: 'BB (25cm), PM (36cm), MM (40cm)', speedy: 'B20, B25, B30, B35, B40' },
    { aspect: 'New price', alma: `$1,480–2,150 (${formatPriceTHB(1480, 2150)}) BB–PM`, speedy: `$1,380–1,780 (${formatPriceTHB(1380, 1780)}) B25–B30` },
    { aspect: 'Pre-owned entry', alma: `$700–1,000 (${formatPriceTHB(700, 1000)}) BB worn`, speedy: `$650–900 (${formatPriceTHB(650, 900)}) B25 worn` },
    { aspect: 'Resale retention', alma: '60–75% (Vernis: up to 80%)', speedy: '65–80% (Empreinte: 75–85%)' },
    { aspect: 'Investment tier', alma: 'B+ (Vernis standout)', speedy: 'B+ (Empreinte strongest)' },
    { aspect: 'Bangkok boutique', alma: 'LV Siam Paragon, EmSphere, ICON Siam', speedy: 'Same locations — both always stocked' },
  ] : [
    { aspect: 'รูปทรง', alma: 'โค้งประตูชัย (ทรงโดม ก้นแบน แข็งแรง)', speedy: 'ทรงถัง (กลม โครงสร้างนุ่ม)' },
    { aspect: 'เปิดตัว', alma: '1934 (Art Deco)', speedy: '1930 (ได้รับแรงบันดาลใจจาก Keepall)' },
    { aspect: 'การปิด', alma: 'ตัวล็อคหมุน แข็งแรง', speedy: 'ซิปบน (B25+) นุ่ม' },
    { aspect: 'ขนาด', alma: 'BB (25cm), PM (36cm), MM (40cm)', speedy: 'B20, B25, B30, B35, B40' },
    { aspect: 'ราคาใหม่', alma: `$1,480–2,150 (${formatPriceTHB(1480, 2150)}) BB–PM`, speedy: `$1,380–1,780 (${formatPriceTHB(1380, 1780)}) B25–B30` },
    { aspect: 'มือสองเริ่มต้น', alma: `$700–1,000 (${formatPriceTHB(700, 1000)}) BB สภาพใช้`, speedy: `$650–900 (${formatPriceTHB(650, 900)}) B25 สภาพใช้` },
    { aspect: 'อัตราการรักษามูลค่า', alma: '60–75% (Vernis: สูงถึง 80%)', speedy: '65–80% (Empreinte: 75–85%)' },
    { aspect: 'ระดับการลงทุน', alma: 'B+ (Vernis โดดเด่น)', speedy: 'B+ (Empreinte แข็งแกร่งสุด)' },
    { aspect: 'บูทีคกรุงเทพ', alma: 'LV Siam Paragon, EmSphere, ICON Siam', speedy: 'สถานที่เดียวกัน ทั้งคู่มีสต็อกเสมอ' },
  ]

  const almaSizes = isEn ? [
    'Alma BB (25cm): Phone, wallet, keys, lipstick — going-out bag',
    'Alma PM (36cm): Full work day — laptop won\'t fit, everything else will',
    'Alma MM (40cm): Roomy weekend — overtly large on petite frames',
  ] : [
    'Alma BB (25cm): โทรศัพท์ กระเป๋าสตางค์ กุญแจ ลิปสติก กระเป๋าออกงาน',
    'Alma PM (36cm): ทำงานทั้งวัน แล็ปท็อปไม่พอดี ของอื่นใส่ได้หมด',
    'Alma MM (40cm): ช่วงสุดสัปดาห์กว้างขวาง ดูใหญ่เกินไปกับคนตัวเล็ก',
  ]

  const speedySizes = isEn ? [
    'Speedy B20: Tiny — phone and cards only',
    'Speedy B25: Most popular — daily essentials, proportional on most frames',
    'Speedy B30: Generous carry, balanced — best for taller frames',
    'Speedy B35: Weekend/overnight — overtly large for daily use',
  ] : [
    'Speedy B20: เล็กมาก โทรศัพท์และบัตรเท่านั้น',
    'Speedy B25: ยอดนิยม ของใช้ประจำวัน สัดส่วนเหมาะกับส่วนใหญ่',
    'Speedy B30: ใส่ของได้เยอะ ยังสมดุล เหมาะกับคนตัวสูง',
    'Speedy B35: สุดสัปดาห์/ข้ามคืน ใหญ่เกินไปสำหรับการใช้ประจำวัน',
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>LV Alma vs Speedy</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? `LV Alma vs Speedy (${PRICE_YEAR}): Size Guide & Which to Buy Pre-Owned` : `LV Alma vs Speedy (${PRICE_YEAR}): คู่มือขนาด & ควรซื้อมือสองอันไหน`}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Both are Louis Vuitton icons with nearly a century of history. The Alma is rigid Art Deco architecture; the Speedy is relaxed barrel freedom. The decision ultimately comes down to structure preference and whether you need a shoulder strap.'
          : 'ทั้งสองเป็นสัญลักษณ์ของ Louis Vuitton ที่มีประวัติศาสตร์เกือบหนึ่งศตวรรษ Alma คือสถาปัตยกรรม Art Deco แข็งแรง Speedy คือความอิสระทรงถังผ่อนคลาย การตัดสินใจขึ้นอยู่กับความชอบโครงสร้างและว่าต้องการสายสะพายไหล่หรือไม่'}
      </p>

      <ThaiPriceCallout
        slugs={['louis-vuitton/alma-bb', 'louis-vuitton/speedy-25']}
        locale={locale}
      />

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">{isEn ? 'Aspect' : 'ด้าน'}</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-amber-800">Alma</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-amber-600">Speedy</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="p-3 border border-gray-200 font-medium text-gray-700 text-xs">{row.aspect}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.alma}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.speedy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-2">{isEn ? 'Alma size guide' : 'คู่มือขนาด Alma'}</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            {almaSizes.map((s, i) => <li key={i}>• {s}</li>)}
          </ul>
        </div>
        <div className="border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-2">{isEn ? 'Speedy size guide' : 'คู่มือขนาด Speedy'}</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            {speedySizes.map((s, i) => <li key={i}>• {s}</li>)}
          </ul>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-10">
        <h3 className="font-semibold text-amber-900 mb-2">{isEn ? 'Vernis Alma: the pre-owned exception' : 'Vernis Alma: ข้อยกเว้นของมือสอง'}</h3>
        <p className="text-sm text-amber-800">
          {isEn
            ? `Alma in Vernis (patent leather) is the standout pre-owned play from this family. Older Vernis Alma in Rose Indien, Fuchsia, or Amarante have strong collector demand. Pre-owned Vernis Alma BB: $800–1,200 (${formatPriceTHB(800, 1200)}) excellent condition. Retention: up to 80% for rare colourways.`
            : `Alma ใน Vernis (หนังมันวาว) คือการลงทุนมือสองที่โดดเด่นที่สุดในตระกูลนี้ Vernis Alma รุ่นเก่าใน Rose Indien, Fuchsia หรือ Amarante มีความต้องการจากนักสะสมสูง มือสอง Vernis Alma BB: $800–1,200 (${formatPriceTHB(800, 1200)}) สภาพดีเยี่ยม อัตราการรักษา: สูงถึง 80% สำหรับสีหายาก`}
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/lv-alma-vs-speedy" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/lv-alma-vs-speedy" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/louis-vuitton`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">LV →</Link>
        <Link href={`/${locale}/compare/lv-speedy-vs-neverfull`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Speedy vs Neverfull →</Link>
        <Link href={`/${locale}/guides/how-to-authenticate-louis-vuitton`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Authenticate LV' : 'ยืนยัน LV'} →</Link>
      </div>
    </div>
  )
}
