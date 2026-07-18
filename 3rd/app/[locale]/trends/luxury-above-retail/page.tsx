import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'trends/luxury-above-retail'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Luxury Items Above Retail in Thailand 2025 | ChicPreowned' : 'สินค้า Luxury ราคาเกิน Retail ในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Which luxury bags and watches sell for MORE than retail in Thailand? Birkin, Daytona, Chanel — THB premiums explained.'
      : 'สินค้า luxury อะไรบ้างที่ขายมือสองในราคาแพงกว่า retail ในไทย? Birkin, Daytona, Chanel — อธิบายราคาบาท',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function AboveRetailTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { item: 'Hermès Birkin 25 (Togo)', retail: '฿460,000', preOwned: '฿720,000–1,200,000+', premium: '+55–160%', why: '2–5 year Thai AD waitlist; best long-term store of value' },
    { item: 'Hermès Kelly 25 (Epsom)', retail: '฿415,000', preOwned: '฿640,000–960,000', premium: '+55–130%', why: 'Same allocation scarcity as Birkin' },
    { item: 'Chanel Classic Flap Small', retail: '฿357,000', preOwned: '฿375,000–460,000', premium: '+5–30%', why: '5 price hikes since 2019; Thai boutique stock limited' },
    { item: 'Rolex Submariner 126610LN', retail: '฿370,000', preOwned: '฿445,000–570,000', premium: '+20–55%', why: 'Thai AD limited allocation; grey market standard' },
    { item: 'Rolex Daytona 116500LN', retail: '฿534,000', preOwned: '฿890,000–1,200,000', premium: '+70–130%', why: 'Most-waitlisted Rolex; Thailand no-AD-relationship policy' },
  ] : [
    { item: 'Hermès Birkin 25 (Togo)', retail: '460,000 บาท', preOwned: '720,000–1,200,000+ บาท', premium: '+55–160%', why: 'รอ AD ไทย 2–5 ปี; สินทรัพย์มูลค่าที่ดีที่สุด' },
    { item: 'Hermès Kelly 25 (Epsom)', retail: '415,000 บาท', preOwned: '640,000–960,000 บาท', premium: '+55–130%', why: 'ความขาดแคลนเหมือน Birkin' },
    { item: 'Chanel Classic Flap Small', retail: '357,000 บาท', preOwned: '375,000–460,000 บาท', premium: '+5–30%', why: 'ขึ้นราคา 5 ครั้งตั้งแต่ 2019; ของในไทยมีจำกัด' },
    { item: 'Rolex Submariner 126610LN', retail: '370,000 บาท', preOwned: '445,000–570,000 บาท', premium: '+20–55%', why: 'AD ไทยมี allocation จำกัด; Grey market ปกติ' },
    { item: 'Rolex Daytona 116500LN', retail: '534,000 บาท', preOwned: '890,000–1,200,000 บาท', premium: '+70–130%', why: 'Rolex ที่รอนานที่สุด; ไทยต้องมีประวัติซื้อกับ AD' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Trends' : 'เทรนด์'}</span>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Above Retail' : 'เกิน Retail'}</span>
      </nav>

      <div className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full mb-4">
        {isEn ? 'Market Trend' : 'เทรนด์ตลาด'}
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Luxury Items Selling Above Retail in Thailand 2025' : 'สินค้า Luxury ราคาเกิน Retail ในไทย 2025'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn ? 'Some items cost MORE pre-owned than brand-new. Here\'s why — and where the biggest premiums are in the Thai market.'
          : 'บางชิ้นราคามือสองแพงกว่าของใหม่ นี่คือเหตุผล — และตลาดไทยมี premium สูงที่สุดที่ไหน'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Item' : 'สินค้า'}</th>
              <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Retail (TH)' : 'Retail (ไทย)'}</th>
              <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Pre-Owned' : 'มือสอง'}</th>
              <th className="text-left py-3 px-4 font-semibold text-amber-700">{isEn ? 'Premium' : 'พรีเมียม'}</th>
              <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Why' : 'ทำไม'}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-900">{row.item}</td>
                <td className="py-3 px-4 text-gray-600">{row.retail}</td>
                <td className="py-3 px-4 text-gray-700">{row.preOwned}</td>
                <td className="py-3 px-4 font-semibold text-amber-700">{row.premium}</td>
                <td className="py-3 px-4 text-gray-500 text-xs">{row.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900 mb-8">
        <strong>{isEn ? 'Thai market context:' : 'บริบทตลาดไทย:'}</strong>
        <span className="ml-2">
          {isEn
            ? 'In Thailand, Hermès Bangkok flagship requires purchase history before offering Birkin allocations. For Rolex, Central Watch and retailer ADs require a relationship — the grey market premium is smaller but real.'
            : 'ใน ไทย Hermès สาขา Central Chidlom ต้องมีประวัติซื้อก่อนจึงจะได้ Birkin สำหรับ Rolex, Central Watch และ AD ต้องการความสัมพันธ์ — Grey market premium มีจริงแต่เล็กกว่าตปท.'}
        </span>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/trends/luxury-above-retail" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/trends/luxury-above-retail" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/hermes`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Hermès Guide →</Link>
        <Link href={`/${locale}/brands/rolex`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex Guide →</Link>
      </div>
    </div>
  )
}
