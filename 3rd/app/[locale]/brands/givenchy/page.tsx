import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'brands/givenchy'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Givenchy Pre-Owned Thailand ${PRICE_YEAR}: Antigona, Pandora | ChicPreowned`
      : `Givenchy มือสองในไทย ${PRICE_YEAR} — คู่มือซื้อ: Antigona Pandora | ChicPreowned`,
    description: isEn
      ? 'Givenchy pre-owned bags Thailand — Antigona Medium, Small, Pandora Satchel. THB prices, resale values, best Givenchy to buy used.'
      : 'กระเป๋า Givenchy มือสองในไทย — Antigona Medium Small Pandora Satchel ราคาบาท มูลค่าขายต่อ Givenchy ที่ดีที่สุดที่ควรซื้อมือสอง',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

function formatPriceTHB(usd: number) {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export default async function GivenchyTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const bags = isEn ? [
    {
      name: 'Antigona Medium',
      thb: `${formatPriceTHB(600)}–${formatPriceTHB(1100)}`,
      retail: `~${formatPriceTHB(2200)}`,
      pct: '27–50%',
      note: 'The iconic structured tote. Riccardo Tisci-era Antigona (pre-2018) holds value slightly better. Best in black smooth leather.',
    },
    {
      name: 'Antigona Small',
      thb: `${formatPriceTHB(500)}–${formatPriceTHB(900)}`,
      retail: `~${formatPriceTHB(1900)}`,
      pct: '26–47%',
      note: 'More wearable in Asian daily context. Same structured look at smaller scale. Very popular in Thailand as a gift item.',
    },
    {
      name: 'Pandora Satchel',
      thb: `${formatPriceTHB(400)}–${formatPriceTHB(750)}`,
      retail: `~${formatPriceTHB(1500)}`,
      pct: '27–50%',
      note: 'The Tisci-era statement piece — crosshatch leather, structured flap. Strong resale demand from Givenchy heritage collectors.',
    },
    {
      name: '4G Crossbody',
      thb: `${formatPriceTHB(550)}–${formatPriceTHB(950)}`,
      retail: `~${formatPriceTHB(1700)}`,
      pct: '32–56%',
      note: 'The 4G logo hardware piece under Matthew Williams. More logo-forward. Holds slightly better than Antigona for newer buyers.',
    },
  ] : [
    {
      name: 'Antigona Medium',
      thb: `${formatPriceTHB(600)}–${formatPriceTHB(1100)}`,
      retail: `~${formatPriceTHB(2200)}`,
      pct: '27–50%',
      note: 'กระเป๋าโครงสร้างสัญลักษณ์ ยุค Riccardo Tisci (ก่อนปี 2018) คงมูลค่าได้ดีกว่าเล็กน้อย ดีที่สุดในหนังเรียบสีดำ',
    },
    {
      name: 'Antigona Small',
      thb: `${formatPriceTHB(500)}–${formatPriceTHB(900)}`,
      retail: `~${formatPriceTHB(1900)}`,
      pct: '26–47%',
      note: 'ใช้งานง่ายกว่าในบริบทรายวันเอเชีย รูปลักษณ์มีโครงสร้างเหมือนกันแต่เล็กกว่า ยอดนิยมมากในไทยเป็นของขวัญ',
    },
    {
      name: 'Pandora Satchel',
      thb: `${formatPriceTHB(400)}–${formatPriceTHB(750)}`,
      retail: `~${formatPriceTHB(1500)}`,
      pct: '27–50%',
      note: 'ชิ้นสำคัญยุค Tisci — หนังลายตาราง ฝาแข็ง ความต้องการขายต่อแข็งแกร่งจากนักสะสม Givenchy ยุคดั้งเดิม',
    },
    {
      name: '4G Crossbody',
      thb: `${formatPriceTHB(550)}–${formatPriceTHB(950)}`,
      retail: `~${formatPriceTHB(1700)}`,
      pct: '32–56%',
      note: 'ชิ้น hardware โลโก้ 4G ยุค Matthew Williams โลโก้เด่นกว่า คงมูลค่าได้ดีกว่า Antigona เล็กน้อยสำหรับผู้ซื้อใหม่',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/brands`} className="hover:text-gray-800">{isEn ? 'Brands' : 'แบรนด์'}</Link>
        <span className="mx-2">/</span>
        <span>Givenchy</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Givenchy Pre-Owned Bags' : 'กระเป๋า Givenchy มือสอง'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Givenchy bags offer genuine luxury at strong discounts pre-owned. The Tisci-era (2005–2017) Antigona is the standout piece. Resale retention sits at 27–56% — lower than Chanel or Hermès, but the entry price is far more accessible.'
          : 'กระเป๋า Givenchy มอบความหรูแท้ในราคาลดมากเมื่อซื้อมือสอง Antigona ยุค Tisci (2005–2017) เป็นชิ้นที่โดดเด่น การคงมูลค่าขายต่ออยู่ที่ 27–56% ต่ำกว่า Chanel หรือ Hermès แต่ราคาเข้าถึงได้มากกว่ามาก'}
      </p>

      <div className="space-y-4 mb-10">
        {bags.map((b, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
              <h2 className="font-bold text-gray-900">{b.name}</h2>
              <div className="text-right shrink-0">
                <div className="font-semibold text-amber-700">{b.thb}</div>
                <div className="text-xs text-gray-400">{isEn ? 'Retail' : 'ราคาร้าน'}: {b.retail}</div>
                <div className="text-xs text-gray-500">{isEn ? 'vs retail' : 'vs ราคาร้าน'}: {b.pct}</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">{b.note}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/brands/givenchy" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/brands/givenchy" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/compare/balenciaga-vs-valentino`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Balenciaga vs Valentino →</Link>
        <Link href={`/${locale}/compare/saint-laurent-vs-gucci`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">SL vs Gucci →</Link>
      </div>
    </div>
  )
}
