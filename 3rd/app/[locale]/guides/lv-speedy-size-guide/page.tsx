import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/lv-speedy-size-guide'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'LV Speedy Size Guide: 20, 25, 30, 35, 40 Thailand | ChicPreowned'
      : 'คู่มือขนาด LV Speedy: 20, 25, 30, 35, 40 ในไทย | ChicPreowned',
    description: isEn
      ? 'Louis Vuitton Speedy size guide for Thailand — dimensions, what fits inside, which holds value best. THB prices 2025.'
      : 'คู่มือขนาด Louis Vuitton Speedy สำหรับคนไทย — ขนาด จุของได้แค่ไหน ขนาดไหนคงมูลค่าดีที่สุด ราคาบาท 2025',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function LVSpeedySizeTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const sizes = isEn ? [
    { size: 'Speedy 20', dims: '20×15×9 cm', for: 'Going-out bag. Phone, cards, keys only. Very compact.', thb: '฿36,000–52,000', note: 'Rarest of the core sizes. Collector piece more than daily.' },
    { size: 'Speedy 25', dims: '25×19×15 cm', for: 'Light daily or evening. Fits A5 notebook, small wallet, phone.', thb: '฿42,000–65,000', note: 'Most popular in Asia. Proportional for Asian frame. Best pre-owned value.' },
    { size: 'Speedy 30', dims: '30×21×17 cm', for: 'Everyday use. Fits tablet, full wallet, cosmetics, water bottle.', thb: '฿44,000–68,000', note: 'Classic proportions. Most-sold Speedy globally. Deepest resale market.' },
    { size: 'Speedy 35', dims: '35×24×17 cm', for: 'Tote-worthy. Fits A4 documents, laptop (no sleeve).', thb: '฿46,000–72,000', note: 'For taller frames or those who carry a lot. Less popular in Thailand.' },
    { size: 'Speedy 40', dims: '40×28×20 cm', for: 'Weekend bag / carry-on. Large items only.', thb: '฿48,000–76,000', note: 'Rarely used as a handbag; functions more as a weekend/travel bag.' },
    { size: 'Speedy Bandoulière 25/30', dims: 'Same as above + strap', for: 'Same capacity + crossbody option.', thb: '฿48,000–75,000', note: 'B version commands ~15–20% premium over base Speedy. Strap is genuine leather.' },
  ] : [
    { size: 'Speedy 20', dims: '20×15×9 ซม.', for: 'กระเป๋าออกงาน โทรศัพท์ บัตร กุญแจเท่านั้น กะทัดรัดมาก', thb: '฿36,000–52,000', note: 'หายากที่สุดในขนาดหลัก ชิ้นสำหรับนักสะสมมากกว่าใช้รายวัน' },
    { size: 'Speedy 25', dims: '25×19×15 ซม.', for: 'ใช้ประจำเบาๆ หรือตอนเย็น ใส่สมุด A5 กระเป๋าสตางค์เล็ก โทรศัพท์', thb: '฿42,000–65,000', note: 'ยอดนิยมที่สุดในเอเชีย สัดส่วนเหมาะกับรูปร่างเอเชีย มูลค่ามือสองดีที่สุด' },
    { size: 'Speedy 30', dims: '30×21×17 ซม.', for: 'ใช้ทุกวัน ใส่แท็บเล็ต กระเป๋าสตางค์เต็ม เครื่องสำอาง ขวดน้ำ', thb: '฿44,000–68,000', note: 'สัดส่วนคลาสสิก Speedy ที่ขายดีที่สุดทั่วโลก ตลาดขายต่อลึกที่สุด' },
    { size: 'Speedy 35', dims: '35×24×17 ซม.', for: 'คล้ายโทต ใส่เอกสาร A4 แล็ปท็อป (ไม่มีซองกัน)', thb: '฿46,000–72,000', note: 'สำหรับรูปร่างสูงหรือคนที่ถือของเยอะ ไม่ค่อยนิยมในไทย' },
    { size: 'Speedy 40', dims: '40×28×20 ซม.', for: 'กระเป๋าวีคเอนด์/กระเป๋าขึ้นเครื่อง ของชิ้นใหญ่เท่านั้น', thb: '฿48,000–76,000', note: 'ไม่ค่อยใช้เป็นกระเป๋าถือ ทำหน้าที่เป็นกระเป๋าวีคเอนด์/เดินทางมากกว่า' },
    { size: 'Speedy Bandoulière 25/30', dims: 'เหมือนด้านบน + สาย', for: 'ความจุเดิม + ตัวเลือกสะพายขวาง', thb: '฿48,000–75,000', note: 'รุ่น B ราคาสูงกว่า Speedy ธรรมดา ~15–20% สายเป็นหนังแท้' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>LV Speedy Size Guide</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'LV Speedy Size Guide: 20 to 40' : 'คู่มือขนาด LV Speedy: 20 ถึง 40'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'The Louis Vuitton Speedy comes in five sizes (20, 25, 30, 35, 40) plus Bandoulière (with shoulder strap). For Thai buyers: Speedy 25 is most popular for smaller frames, Speedy 30 has the deepest pre-owned market.'
          : 'Louis Vuitton Speedy มีห้าขนาด (20, 25, 30, 35, 40) บวก Bandoulière (พร้อมสายสะพาย) สำหรับผู้ซื้อชาวไทย Speedy 25 ยอดนิยมที่สุดสำหรับรูปร่างเล็ก Speedy 30 มีตลาดมือสองลึกที่สุด'}
      </p>

      <div className="space-y-4 mb-10">
        {sizes.map((s, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="font-bold text-gray-900">{s.size}</h2>
                <p className="text-xs text-gray-400">{s.dims}</p>
              </div>
              <span className="text-sm font-semibold text-amber-700 text-right">{s.thb}</span>
            </div>
            <p className="text-sm text-gray-600 mb-1"><strong>{isEn ? 'Best for:' : 'เหมาะกับ:'}</strong> {s.for}</p>
            <p className="text-xs text-gray-400">{s.note}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/lv-speedy-size-guide" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/lv-speedy-size-guide" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/louis-vuitton`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'LV Pre-Owned →' : 'LV มือสอง →'}</Link>
        <Link href={`/${locale}/guides/lv-neverfull-size-guide`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Neverfull Size Guide →</Link>
      </div>
    </div>
  )
}
