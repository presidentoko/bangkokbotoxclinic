import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/chanel-mini-vs-small-flap'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Chanel Mini vs Small Classic Flap Thailand 2025 | ChicPreowned'
      : 'Chanel Mini vs Small Classic Flap ในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Chanel Mini Flap vs Small Classic Flap for Thai buyers — dimensions, what fits, THB price difference, which size to buy pre-owned in Bangkok 2025.'
      : 'Chanel Mini Flap vs Small Classic Flap สำหรับผู้ซื้อชาวไทย — ขนาด ใส่อะไรได้บ้าง ราคาต่างกันเท่าไหร่ ขนาดไหนควรซื้อมือสองในกรุงเทพ 2025',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

function formatPriceTHB(usd: number) {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export default async function ChanelMiniVsSmallTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const sizes = isEn ? [
    { name: 'Mini Rectangular (15.2 × 10.2 × 6.4 cm)', category: 'Mini', thb: `${formatPriceTHB(2200)}–${formatPriceTHB(3800)}`, retail: `~${formatPriceTHB(4600)}`, fits: 'Phone, cards, lipstick, small wallet only', note: 'The evening bag. Most often worn crossbody. High resale demand in Thailand. Not a daily bag. Mini Rectangular comes with a full chain; Mini Square with dual chains.' },
    { name: 'Mini Square (16 × 11.4 × 6.4 cm)', category: 'Mini', thb: `${formatPriceTHB(2500)}–${formatPriceTHB(4200)}`, retail: `~${formatPriceTHB(5100)}`, fits: 'Phone, cards, small wallet', note: 'Slightly wider than Rectangular. Equal Thai market popularity. Pre-owned price tracks within ฿11,000 of Rectangular. Some collectors prefer the square proportions.' },
    { name: 'Small Classic Flap (24.9 × 15.2 × 6.6 cm)', category: 'Small', thb: `${formatPriceTHB(4500)}–${formatPriceTHB(7500)}`, retail: `~${formatPriceTHB(9300)}`, fits: 'iPhone 15 Pro Max, AirPods, wallet, keys, lipstick, thin notebook', note: 'The everyday Chanel. Fits everything a Mini does not. Most investment-grade size for pre-owned. Chanel price increases affect this size most significantly — it has doubled since 2019.' },
  ] : [
    { name: 'Mini Rectangular (15.2 × 10.2 × 6.4 ซม.)', category: 'Mini', thb: `${formatPriceTHB(2200)}–${formatPriceTHB(3800)}`, retail: `~${formatPriceTHB(4600)}`, fits: 'โทรศัพท์ บัตร ลิปสติก กระเป๋าสตางค์เล็กเท่านั้น', note: 'กระเป๋าราตรี สวมสายข้ามตัวส่วนใหญ่ ความต้องการมือสองสูงในไทย ไม่ใช่กระเป๋าประจำวัน Mini Rectangular มีโซ่เต็ม Mini Square มีโซ่คู่' },
    { name: 'Mini Square (16 × 11.4 × 6.4 ซม.)', category: 'Mini', thb: `${formatPriceTHB(2500)}–${formatPriceTHB(4200)}`, retail: `~${formatPriceTHB(5100)}`, fits: 'โทรศัพท์ บัตร กระเป๋าสตางค์เล็ก', note: 'กว้างกว่า Rectangular เล็กน้อย ความนิยมเท่ากันในตลาดไทย ราคามือสองต่างกัน ฿11,000 จาก Rectangular บางนักสะสมชอบสัดส่วนสี่เหลี่ยม' },
    { name: 'Small Classic Flap (24.9 × 15.2 × 6.6 ซม.)', category: 'Small', thb: `${formatPriceTHB(4500)}–${formatPriceTHB(7500)}`, retail: `~${formatPriceTHB(9300)}`, fits: 'iPhone 15 Pro Max, AirPods, กระเป๋าสตางค์ ลูกกุญแจ ลิปสติก สมุดบันทึกบาง', note: 'Chanel ประจำวัน ใส่ทุกอย่างที่ Mini ไม่สามารถ ขนาดที่ดีที่สุดสำหรับการลงทุนมือสอง การขึ้นราคา Chanel ส่งผลต่อขนาดนี้มากที่สุด ราคาเพิ่มขึ้นเป็น 2 เท่าตั้งแต่ปี 2019' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Chanel Mini vs Small Flap' : 'Chanel Mini vs Small Flap'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Chanel Mini Flap vs Small Classic Flap 2025' : 'Chanel Mini Flap vs Small Classic Flap 2025'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'The most common Chanel size question in Thailand. Mini is the bag for photos and evenings. Small is the bag for daily life. They look similar in photos but differ completely in what you can actually carry. Price difference: ฿82,000–฿135,000 pre-owned.'
          : 'คำถามขนาด Chanel ที่พบบ่อยที่สุดในไทย Mini คือกระเป๋าสำหรับถ่ายรูปและงานเลี้ยง Small คือกระเป๋าสำหรับชีวิตประจำวัน ดูคล้ายกันในรูปแต่ต่างกันโดยสิ้นเชิงในสิ่งที่ใส่ได้จริง ราคาต่าง: ฿82,000–฿135,000 มือสอง'}
      </p>

      <div className="space-y-4 mb-10">
        {sizes.map((s, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
              <div>
                <h2 className="font-bold text-gray-900">{s.name}</h2>
                <p className="text-xs text-gray-400 mt-0.5 font-medium uppercase tracking-wide">{s.category} — {isEn ? 'Fits' : 'ใส่ได้'}: {s.fits}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="font-semibold text-amber-700">{s.thb}</div>
                <div className="text-xs text-gray-400">{isEn ? 'Retail' : 'ราคาร้าน'}: {s.retail}</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">{s.note}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">{isEn ? 'Buy the Mini if:' : 'ซื้อ Mini ถ้า:'}</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            {(isEn ? [
              'You already have a daily bag and want a special occasion piece',
              'You prefer crossbody carry or single-chain styling',
              'Budget is ฿79,000–฿151,200 pre-owned',
              'You want the Chanel with highest resale demand',
            ] : [
              'คุณมีกระเป๋าประจำวันอยู่แล้วและต้องการกระเป๋าสำหรับโอกาสพิเศษ',
              'ชอบสวมข้ามตัวหรือสไตล์โซ่เดี่ยว',
              'งบประมาณ ฿79,000–฿151,200 มือสอง',
              'ต้องการ Chanel ที่มีความต้องการมือสองสูงที่สุด',
            ]).map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-2">{isEn ? 'Buy the Small if:' : 'ซื้อ Small ถ้า:'}</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            {(isEn ? [
              'You want one Chanel that does everything',
              'You need to carry a full phone, wallet, and keys daily',
              'Investment hold is your priority — Small outperforms Mini long-term',
              'You prefer double-chain carry or shoulder wear',
            ] : [
              'ต้องการ Chanel หนึ่งใบที่ทำได้ทุกอย่าง',
              'ต้องใส่โทรศัพท์เต็ม กระเป๋าสตางค์ และลูกกุญแจทุกวัน',
              'การลงทุนคือลำดับความสำคัญ Small ทำผลงานดีกว่า Mini ระยะยาว',
              'ชอบสวมโซ่คู่หรือพาดบ่า',
            ]).map((item, i) => <li key={i}>• {item}</li>)}
          </ul>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/chanel-mini-vs-small-flap" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/chanel-mini-vs-small-flap" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/chanel`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Chanel Pre-Owned →' : 'Chanel มือสอง →'}</Link>
        <Link href={`/${locale}/guides/chanel-classic-vs-boy`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Classic vs Boy Bag →</Link>
        <Link href={`/${locale}/trends/chanel-price-increase-2025`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Chanel Price Trends →' : 'เทรนด์ราคา Chanel →'}</Link>
      </div>
    </div>
  )
}
