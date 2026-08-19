import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/rolex-vs-cartier'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Rolex vs Cartier Pre-Owned Thailand ${PRICE_YEAR}: Submariner vs Santos | ChicPreowned`
      : `Rolex vs Cartier มือสองในไทย ${PRICE_YEAR}: Submariner vs Santos | ChicPreowned`,
    description: isEn
      ? `Rolex vs Cartier for Thai buyers — Submariner vs Santos, THB prices, investment case, which Swiss watchmaker to buy pre-owned in Bangkok ${PRICE_YEAR}.`
      : `Rolex vs Cartier สำหรับผู้ซื้อชาวไทย — Submariner vs Santos ราคาบาท กรณีลงทุน นาฬิกาสวิสแบรนด์ไหนควรซื้อมือสองในกรุงเทพ ${PRICE_YEAR}`,
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

function formatPriceTHB(usd: number) {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export default async function RolexVsCartierTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { metric: 'Founded', rolex: 'London 1905, Geneva. Sports/professional tool watch DNA. COSC-certified precision.', cartier: 'Paris 1847. Jewelry house that invented the wristwatch. Santos (1904) was the first aviator wristwatch.' },
    { metric: 'Icon watches', rolex: `Submariner (${formatPriceTHB(8500)}–${formatPriceTHB(20000)}), Datejust (${formatPriceTHB(5000)}–${formatPriceTHB(12000)}), GMT-Master II (${formatPriceTHB(11000)}–${formatPriceTHB(25000)})`, cartier: `Santos (${formatPriceTHB(3500)}–${formatPriceTHB(7000)}), Tank (${formatPriceTHB(2500)}–${formatPriceTHB(6000)}), Ballon Bleu (${formatPriceTHB(3000)}–${formatPriceTHB(6000)})` },
    { metric: 'Entry price', rolex: `${formatPriceTHB(3500)}+ (Oyster Perpetual)`, cartier: `${formatPriceTHB(1800)}+ (Tank Solo steel)` },
    { metric: 'Movement', rolex: 'In-house manufacture. COSC chronometer. ±2 sec/day. Best tool-watch movement in class.', cartier: 'Mix of manufacture and ETA/Sellita. Jewelry-grade accuracy. Not a tool-watch movement focus.' },
    { metric: 'Resale vs retail', rolex: '80–150%+ for sports models (Sub, GMT, Daytona). Datejust: 70–90%.', cartier: '65–85% (Santos, Ballon Bleu). Vintage Tank: 80–100%+.' },
    { metric: 'Thailand market', rolex: 'Highest demand. Submariner and GMT-Master II have waitlists at Bangkok boutiques. Pre-owned trades at or above retail for steel sports.', cartier: 'Strong. Santos and Ballon Bleu popular. Tank popular for gift-giving and graduation presents in Thai market.' },
    { metric: 'Best for', rolex: 'Maximum resale value, global recognition, sports watch collecting, investment', cartier: 'Lower entry, jewelry-house heritage, dress watch elegance, Santos as sports alternative' },
  ] : [
    { metric: 'ก่อตั้ง', rolex: 'ลอนดอน 1905 เจนีวา DNA นาฬิกาเครื่องมือ/มืออาชีพ ความแม่นยำรับรอง COSC', cartier: 'ปารีส 1847 บ้านเครื่องประดับที่ประดิษฐ์นาฬิกาข้อมือ Santos (1904) คือนาฬิกาข้อมือนักบินเรือนแรก' },
    { metric: 'นาฬิกาสัญลักษณ์', rolex: `Submariner (${formatPriceTHB(8500)}–${formatPriceTHB(20000)}) Datejust (${formatPriceTHB(5000)}–${formatPriceTHB(12000)}) GMT-Master II (${formatPriceTHB(11000)}–${formatPriceTHB(25000)})`, cartier: `Santos (${formatPriceTHB(3500)}–${formatPriceTHB(7000)}) Tank (${formatPriceTHB(2500)}–${formatPriceTHB(6000)}) Ballon Bleu (${formatPriceTHB(3000)}–${formatPriceTHB(6000)})` },
    { metric: 'ราคาเริ่มต้น', rolex: `${formatPriceTHB(3500)}+ (Oyster Perpetual)`, cartier: `${formatPriceTHB(1800)}+ (Tank Solo เหล็ก)` },
    { metric: 'การเคลื่อนไหว', rolex: 'ผลิตภายใน รับรอง COSC chronometer ±2 วินาที/วัน การเคลื่อนไหวนาฬิกาเครื่องมือที่ดีที่สุดในคลาส', cartier: 'ผสมระหว่างผลิตภายในและ ETA/Sellita ความแม่นยำระดับเครื่องประดับ ไม่เน้นการเคลื่อนไหวนาฬิกาเครื่องมือ' },
    { metric: 'ขายต่อ vs ราคาร้าน', rolex: '80–150%+ สำหรับ sports (Sub, GMT, Daytona) Datejust: 70–90%', cartier: '65–85% (Santos, Ballon Bleu) Tank วินเทจ: 80–100%+' },
    { metric: 'ตลาดไทย', rolex: 'ความต้องการสูงสุด Submariner และ GMT-Master II มี waitlist ที่บูติกกรุงเทพ มือสองซื้อขายเทียบเท่าหรือสูงกว่าราคาร้านสำหรับ steel sports', cartier: 'แข็งแกร่ง Santos และ Ballon Bleu ได้รับความนิยม Tank ได้รับความนิยมสำหรับของขวัญและของที่ระลึกจบการศึกษาในตลาดไทย' },
    { metric: 'ดีที่สุดสำหรับ', rolex: 'มูลค่าขายต่อสูงสุด การรับรู้ทั่วโลก การสะสมนาฬิกา sports การลงทุน', cartier: 'ราคาเริ่มต้นต่ำกว่า มรดกบ้านเครื่องประดับ ความหรูหรานาฬิกาออกงาน Santos เป็นทางเลือก sports' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/brands`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>Rolex vs Cartier</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? `Rolex vs Cartier Pre-Owned ${PRICE_YEAR}` : `Rolex vs Cartier มือสอง ${PRICE_YEAR}`}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Rolex is the most recognized watch brand globally — precision, status, investment-grade resale. Cartier invented the wristwatch — Parisian jewelry heritage, elegance, dress watch excellence. Both are Swiss. For Thai buyers: Rolex wins on investment and resale; Cartier wins on entry price and jewelry-adjacent prestige.'
          : 'Rolex คือแบรนด์นาฬิกาที่เป็นที่รู้จักมากที่สุดในโลก ความแม่นยำ สถานะ การขายต่อระดับการลงทุน Cartier ประดิษฐ์นาฬิกาข้อมือ มรดกเครื่องประดับปารีส ความหรูหรา ความเป็นเลิศของนาฬิกาออกงาน ทั้งสองเป็นสวิส สำหรับผู้ซื้อชาวไทย Rolex ชนะด้านการลงทุนและขายต่อ Cartier ชนะด้านราคาเริ่มต้นและศักดิ์ศรีระดับเครื่องประดับ'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 w-1/3"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Rolex</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Cartier</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wide">{r.metric}</td>
                <td className="py-3 px-4 text-gray-700">{r.rolex}</td>
                <td className="py-3 px-4 text-gray-700">{r.cartier}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/rolex-vs-cartier" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/rolex-vs-cartier" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/rolex`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Rolex Pre-Owned →' : 'Rolex มือสอง →'}</Link>
        <Link href={`/${locale}/brands/cartier`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Cartier Pre-Owned →' : 'Cartier มือสอง →'}</Link>
        <Link href={`/${locale}/compare/rolex-vs-omega`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Omega →</Link>
      </div>
    </div>
  )
}
