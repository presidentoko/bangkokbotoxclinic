import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/lv-speedy-vs-neverfull'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `LV Speedy vs Neverfull Thailand ${PRICE_YEAR}: Which Pre-Owned? | ChicPreowned`
      : `LV Speedy vs Neverfull ในไทย ${PRICE_YEAR}: มือสองอันไหนน่าซื้อ? | ChicPreowned`,
    description: isEn
      ? `Louis Vuitton Speedy vs Neverfull for Bangkok buyers ${PRICE_YEAR} — resale retention, THB prices, security considerations, and which LV is the better pre-owned investment in Thailand.`
      : `Louis Vuitton Speedy vs Neverfull สำหรับผู้ซื้อกรุงเทพ ${PRICE_YEAR} อัตราการรักษามูลค่า ราคาบาท ข้อพิจารณาด้านความปลอดภัย และ LV ไหนลงทุนมือสองได้ดีกว่าในไทย`,
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

function formatPriceTHB(usdLow: number, usdHigh: number) {
  const low = Math.round(usdLow * 36 / 500) * 500
  const high = Math.round(usdHigh * 36 / 500) * 500
  return `฿${low.toLocaleString()}–฿${high.toLocaleString()}`
}

export default async function LvSpeedyVsNeverfullTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { aspect: 'Launched', sp: '1930 — inspired by the Keepall', nf: '2007 — designed for everyday shopping' },
    { aspect: 'Shape', sp: 'Structured barrel bag, top handles', nf: 'Open tote with cinch drawstring sides' },
    { aspect: 'New price', sp: `$1,380–1,780 (${formatPriceTHB(1380, 1780)}) Monogram`, nf: `$1,670–1,960 (${formatPriceTHB(1670, 1960)}) Monogram` },
    { aspect: 'Pre-owned entry', sp: `$650–900 (${formatPriceTHB(650, 900)}) B25 Monogram worn`, nf: `$780–1,100 (${formatPriceTHB(780, 1100)}) MM Monogram worn` },
    { aspect: 'Resale retention', sp: '65–80% (Empreinte: 75–85%)', nf: '70–85% (MM most liquid LV tote)' },
    { aspect: 'Investment tier', sp: 'B+ (stable, broad market)', nf: 'A-Tier (exceptional tote liquidity)' },
    { aspect: 'Security in Bangkok', sp: 'Full zip — secure in MBK, MRT, Chatuchak', nf: 'Open top — security concern in crowded areas' },
    { aspect: 'Bangkok boutique', sp: 'LV at Siam Paragon, EmSphere, ICON Siam', nf: 'Same — Neverfull always in stock' },
  ] : [
    { aspect: 'เปิดตัว', sp: '1930 — ได้รับแรงบันดาลใจจาก Keepall', nf: '2007 — ออกแบบสำหรับช้อปปิ้งประจำวัน' },
    { aspect: 'รูปทรง', sp: 'กระเป๋าทรงถัง มีโครงสร้าง หูหิ้วบน', nf: 'โทตเปิดด้านบน พร้อมด้านข้างรัดสาย' },
    { aspect: 'ราคาใหม่', sp: `$1,380–1,780 (${formatPriceTHB(1380, 1780)}) Monogram`, nf: `$1,670–1,960 (${formatPriceTHB(1670, 1960)}) Monogram` },
    { aspect: 'มือสองเริ่มต้น', sp: `$650–900 (${formatPriceTHB(650, 900)}) B25 Monogram สภาพใช้`, nf: `$780–1,100 (${formatPriceTHB(780, 1100)}) MM Monogram สภาพใช้` },
    { aspect: 'อัตราการรักษามูลค่า', sp: '65–80% (Empreinte: 75–85%)', nf: '70–85% (MM LV tote ที่มีสภาพคล่องสูงสุด)' },
    { aspect: 'ระดับการลงทุน', sp: 'B+ (คงที่ ตลาดกว้าง)', nf: 'A-Tier (สภาพคล่อง tote ยอดเยี่ยม)' },
    { aspect: 'ความปลอดภัยในกรุงเทพ', sp: 'ซิปครบ ปลอดภัยใน MBK MRT จตุจักร', nf: 'ด้านบนเปิด ความกังวลด้านความปลอดภัยในพื้นที่คับคั่ง' },
    { aspect: 'บูทีคกรุงเทพ', sp: 'LV ที่ Siam Paragon, EmSphere, ICON Siam', nf: 'เหมือนกัน Neverfull มีสต็อกเสมอ' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/compare`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>LV Speedy vs Neverfull</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'LV Speedy vs Neverfull ({PRICE_YEAR}): Which Pre-Owned to Buy?' : 'LV Speedy vs Neverfull ({PRICE_YEAR}): มือสองอันไหนน่าซื้อ?'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'The two most recognisable LV bags globally — both excellent pre-owned investments. The Speedy is a structured handheld; the Neverfull is the definitive open tote. Bangkok context (MBK, Chatuchak security) and THB prices included.'
          : 'กระเป๋า LV ที่โดดเด่นที่สุดสองใบในโลก ทั้งสองเป็นการลงทุนมือสองที่ยอดเยี่ยม Speedy คือกระเป๋าถือมีโครงสร้าง Neverfull คือโทตเปิดที่เป็นนิยาม รวมบริบทกรุงเทพ (ความปลอดภัย MBK, จตุจักร) และราคาบาท'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">{isEn ? 'Aspect' : 'ด้าน'}</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-amber-800">Speedy</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-amber-600">Neverfull</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="p-3 border border-gray-200 font-medium text-gray-700 text-xs">{row.aspect}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.sp}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{row.nf}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="font-semibold text-amber-900 mb-2">{isEn ? 'Choose Speedy if…' : 'เลือก Speedy ถ้า…'}</h3>
          <ul className="text-sm text-amber-800 space-y-1">
            {(isEn ? [
              'You prefer a structured bag with a secure zip top',
              'Security in Bangkok transit (MBK, MRT, Chatuchak) matters',
              'Empreinte leather is your target — strongest value retention',
              'You want more size flexibility (B20 to B40)',
            ] : [
              'ชอบกระเป๋ามีโครงสร้างพร้อมซิปบนที่ปลอดภัย',
              'ความปลอดภัยในการขนส่งกรุงเทพ (MBK, MRT, จตุจักร) สำคัญ',
              'หนัง Empreinte คือเป้าหมายของคุณ อัตราการรักษามูลค่าสูงสุด',
              'ต้องการความยืดหยุ่นขนาดมากกว่า (B20 ถึง B40)',
            ]).map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
          <h3 className="font-semibold text-amber-800 mb-2">{isEn ? 'Choose Neverfull if…' : 'เลือก Neverfull ถ้า…'}</h3>
          <ul className="text-sm text-amber-700 space-y-1">
            {(isEn ? [
              'You need to carry more — true workhorse tote',
              'Resale is a priority — Neverfull MM among most liquid LV bags',
              'The interior pochette is useful',
              'Shoulder carry only is your preference',
            ] : [
              'ต้องพกของมากกว่า โทตใช้งานได้จริง',
              'การขายต่อเป็นลำดับความสำคัญ Neverfull MM อยู่ใน LV ที่มีสภาพคล่องสูงสุด',
              'Pochette ภายในมีประโยชน์',
              'การสะพายไหล่เท่านั้นคือความชอบของคุณ',
            ]).map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8">
        <h3 className="font-semibold text-gray-900 mb-2">{isEn ? 'Most faked LV bags — buy carefully' : 'กระเป๋า LV ที่ถูกปลอมมากที่สุด ซื้อระวัง'}</h3>
        <p className="text-sm text-gray-600">
          {isEn
            ? 'Both bags have extremely deep pre-owned markets with many fakes in circulation. The Neverfull MM in Monogram is the #1 most counterfeited bag in the world by volume. Get authentication before buying either pre-owned in Thailand.'
            : 'ทั้งสองกระเป๋ามีตลาดมือสองลึกมากพร้อมของปลอมจำนวนมากในการหมุนเวียน Neverfull MM ใน Monogram คือกระเป๋าที่ถูกปลอมมากที่สุดในโลกตามปริมาณ ยืนยันความถูกต้องก่อนซื้อมือสองในไทย'}
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/lv-speedy-vs-neverfull" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/lv-speedy-vs-neverfull" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/louis-vuitton`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">LV →</Link>
        <Link href={`/${locale}/guides/lv-neverfull-size-guide`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Neverfull Size →</Link>
        <Link href={`/${locale}/guides/lv-speedy-size-guide`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Speedy Size →</Link>
        <Link href={`/${locale}/guides/how-to-authenticate-louis-vuitton`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Authenticate LV' : 'ยืนยัน LV'} →</Link>
      </div>
    </div>
  )
}
