import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'trends/patek-philippe-nautilus-investment-2025'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Patek Philippe Nautilus Investment Thailand 2025 | ChicPreowned'
      : 'การลงทุน Patek Philippe Nautilus ในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Patek Philippe Nautilus investment analysis for Thailand 2025 — 5711/1A legend status, market correction from 2022 peak, THB prices, and which Nautilus reference to buy pre-owned.'
      : 'การวิเคราะห์การลงทุน Patek Philippe Nautilus สำหรับไทย 2025 สถานะตำนาน 5711/1A การปรับตัวจากจุดสูงสุดปี 2022 ราคาบาท และควรซื้อรุ่น Nautilus ไหนมือสอง',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

function formatPriceTHB(usdLow: number, usdHigh: number) {
  const low = Math.round(usdLow * 36 / 500) * 500
  const high = Math.round(usdHigh * 36 / 500) * 500
  return `฿${low.toLocaleString()}–฿${high.toLocaleString()}`
}

export default async function PatekNautilusInvestmentTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const references = isEn ? [
    { ref: '5711/1A-010', name: 'Nautilus 5711/1A Olive Green (Final)', tag: '↑↑ Legend', price: '$160,000–220,000', thb: formatPriceTHB(160000, 220000), retail: 'Discontinued $34,893', note: 'Last 5711/1A run. Regularly exceeds 5× retail. The "Holy Grail" of modern production watches.' },
    { ref: '5711/1A-011', name: 'Nautilus 5711/1A Blue (Classic)', tag: '↑ Premium', price: '$60,000–90,000', thb: formatPriceTHB(60000, 90000), retail: 'Discontinued $29,765', note: 'Corrected from 2022 peak ($120,000+). Still 2–3× retail — strong long-term hold.' },
    { ref: '5726A', name: 'Nautilus 5726A Annual Calendar', tag: '↑ Rising', price: '$55,000–80,000', thb: formatPriceTHB(55000, 80000), retail: '~$65,000', note: 'Annual Calendar complication. Approached retail in 2023 correction — rebounding.' },
    { ref: '5740G', name: 'Nautilus 5740G Perpetual Calendar (WG)', tag: '↑ Appreciating', price: '$140,000–200,000', thb: formatPriceTHB(140000, 200000), retail: '~$120,000', note: 'Top complication Nautilus. Very limited — premium over retail consistent.' },
  ] : [
    { ref: '5711/1A-010', name: 'Nautilus 5711/1A Olive Green (รุ่นสุดท้าย)', tag: '↑↑ ตำนาน', price: '$160,000–220,000', thb: formatPriceTHB(160000, 220000), retail: 'ยกเลิกผลิต $34,893', note: 'ชุดสุดท้าย 5711/1A เกิน 5× retail เป็นประจำ "Holy Grail" ของนาฬิกาผลิตสมัยใหม่' },
    { ref: '5711/1A-011', name: 'Nautilus 5711/1A หน้าน้ำเงิน (คลาสสิก)', tag: '↑ พรีเมียม', price: '$60,000–90,000', thb: formatPriceTHB(60000, 90000), retail: 'ยกเลิกผลิต $29,765', note: 'ปรับตัวจากจุดสูงสุดปี 2022 ($120,000+) ยังคง 2–3× retail การถือระยะยาวแข็งแกร่ง' },
    { ref: '5726A', name: 'Nautilus 5726A Annual Calendar', tag: '↑ เพิ่มขึ้น', price: '$55,000–80,000', thb: formatPriceTHB(55000, 80000), retail: '~$65,000', note: 'Complication ปฏิทินประจำปี ใกล้เคียง retail ในการปรับตัวปี 2023 กำลังฟื้นตัว' },
    { ref: '5740G', name: 'Nautilus 5740G Perpetual Calendar (WG)', tag: '↑ มูลค่าเพิ่ม', price: '$140,000–200,000', thb: formatPriceTHB(140000, 200000), retail: '~$120,000', note: 'Complication สูงสุด Nautilus หายากมาก พรีเมียมเหนือ retail สม่ำเสมอ' },
  ]

  const tagColor = (tag: string) => {
    if (tag.includes('↑↑') || tag.includes('ตำนาน') || tag.includes('Legend')) return 'bg-green-900 text-green-100'
    if (tag.includes('↑')) return 'bg-green-700 text-green-100'
    return 'bg-gray-700 text-gray-100'
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/trends`} className="hover:text-gray-800">{isEn ? 'Trends' : 'เทรนด์'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Nautilus Investment 2025' : 'การลงทุน Nautilus 2025'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Patek Philippe Nautilus Investment 2025: Which Reference?' : 'การลงทุน Patek Philippe Nautilus 2025: ควรซื้อรุ่นไหน?'}
      </h1>
      <p className="text-gray-500 mb-6">
        {isEn
          ? 'The Nautilus is the most investable watch in the world — but 2022-2024 saw significant market correction. The blue 5711/1A that reached $120,000+ in 2022 is now $60,000-90,000. This correction separates speculators from serious long-term holders.'
          : 'Nautilus คือนาฬิกาที่ลงทุนได้ดีที่สุดในโลก แต่ 2022-2024 เห็นการปรับตัวตลาดอย่างมีนัยสำคัญ Blue 5711/1A ที่ถึง $120,000+ ในปี 2022 ตอนนี้อยู่ที่ $60,000-90,000 การปรับตัวนี้แยกนักเก็งกำไรออกจากผู้ถือระยะยาวที่จริงจัง'}
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
        <p className="text-sm font-medium text-amber-900">{isEn ? '2025 market context' : 'บริบทตลาด 2025'}</p>
        <p className="text-sm text-amber-800">
          {isEn
            ? 'Nautilus peaked 2021-2022 driven by extreme supply constraint. Prices corrected 20-50% from peak but remain 100-500% above retail. The correction created a buying window for the 5726A Annual Calendar (now closer to retail). Long-term: the 5711 is discontinued — demand as a "final chapter" watch is structural.'
            : 'Nautilus พุ่งสูงสุด 2021-2022 ขับเคลื่อนโดยข้อจำกัดอุปทานสุดขีด ราคาปรับตัว 20-50% จากจุดสูงสุด แต่ยังคงสูงกว่า retail 100-500% การปรับตัวสร้างหน้าต่างซื้อสำหรับ Annual Calendar 5726A (ตอนนี้ใกล้เคียง retail) ระยะยาว: 5711 ยกเลิกผลิตแล้ว ความต้องการเป็นนาฬิกา "บทสุดท้าย" เป็นเชิงโครงสร้าง'}
        </p>
      </div>

      <div className="space-y-4 mb-10">
        {references.map((r, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h2 className="font-semibold text-gray-900">{r.name}</h2>
                <p className="text-xs text-gray-500">Ref. {r.ref}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${tagColor(r.tag)}`}>{r.tag}</span>
            </div>
            <div className="flex flex-wrap gap-4 mb-2 text-xs text-gray-500">
              <span>{isEn ? 'Pre-owned' : 'มือสอง'}: <strong className="text-gray-700">{r.price} ({r.thb})</strong></span>
              <span>{isEn ? 'Retail' : 'ราคา retail'}: {r.retail}</span>
            </div>
            <p className="text-sm text-gray-600">{r.note}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 text-white rounded-xl p-5 mb-8">
        <h3 className="font-semibold mb-2">{isEn ? 'Why the 5711/1A Olive Green is in a class of its own' : 'ทำไม 5711/1A Olive Green ถึงอยู่ในชั้นของตัวเอง'}</h3>
        <p className="text-sm text-gray-300">
          {isEn
            ? `Patek announced 5711/1A\'s discontinuation in January 2021 with a final olive green run. Only a few thousand produced. At announcement, blue 5711/1A jumped from $50,000 to $80,000+ immediately. Olive green commands $160,000–220,000 (${formatPriceTHB(160000, 220000)}) for a watch that retailed at $34,893. No other production watch in history has commanded this consistent premium relative to retail.`
            : `Patek ประกาศยกเลิก 5711/1A ในมกราคม 2021 พร้อมชุดสุดท้าย olive green ผลิตเพียงไม่กี่พันชิ้น ณ การประกาศ blue 5711/1A กระโดดจาก $50,000 เป็น $80,000+ ทันที Olive green ราคา $160,000–220,000 (${formatPriceTHB(160000, 220000)}) สำหรับนาฬิกาที่ขาย retail ที่ $34,893 ไม่มีนาฬิกาผลิตชิ้นอื่นในประวัติศาสตร์ที่ได้พรีเมียมสม่ำเสมอนี้เมื่อเทียบกับ retail`}
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/trends/patek-philippe-nautilus-investment-2025" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/trends/patek-philippe-nautilus-investment-2025" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/guides/patek-philippe-nautilus-guide`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Nautilus Guide →</Link>
        <Link href={`/${locale}/compare/rolex-vs-patek-philippe`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs Patek →</Link>
        <Link href={`/${locale}/compare/ap-vs-patek-philippe`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">AP vs Patek →</Link>
        <Link href={`/${locale}/trends/rolex-daytona-investment-2025`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Rolex Daytona Investment' : 'การลงทุน Rolex Daytona'} →</Link>
      </div>
    </div>
  )
}
