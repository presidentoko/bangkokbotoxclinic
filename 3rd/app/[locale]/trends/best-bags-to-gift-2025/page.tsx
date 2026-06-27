import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'trends/best-bags-to-gift-2025'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Best Luxury Bags to Gift in Thailand 2025 | ChicPreowned' : 'กระเป๋า Luxury มือสองของขวัญที่ดีที่สุดในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Best pre-owned luxury bags to gift in Thailand 2025 — by THB budget, what lands well in Bangkok, and gifting tips.'
      : 'กระเป๋า luxury มือสองของขวัญที่ดีที่สุดในไทย 2025 — แยกตามงบประมาณบาท สิ่งที่ดีในกรุงเทพ และเคล็ดลับการให้ของขวัญ',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

export default async function BestBagsGiftTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const budgets = isEn ? [
    {
      budget: 'Under ฿20,000',
      picks: [
        { item: 'Louis Vuitton Pochette Accessoires', price: '฿11,000–17,000', note: 'Highest recognition for the price — instant LV impact' },
        { item: 'Gucci GG Pouch', price: '฿10,000–15,000', note: 'Popular in Thailand, works for all ages' },
        { item: 'Loewe Anagram Card Holder', price: '฿7,000–12,000', note: 'Small luxury SLG — great for "first luxury" gift' },
      ]
    },
    {
      budget: '฿20,000–฿50,000',
      picks: [
        { item: 'LV Speedy 25 Monogram', price: '฿22,000–32,000', note: 'The most universally beloved LV bag in Thailand' },
        { item: 'Chanel Mini Wallet on Chain', price: '฿22,000–34,000', note: 'Entry Chanel — very high gifting impact' },
        { item: 'Dior Saddle Pouch', price: '฿18,000–28,000', note: 'Trend-right, Siam Paragon crowd will know it' },
      ]
    },
    {
      budget: '฿50,000–฿120,000',
      picks: [
        { item: 'Chanel Classic Flap Mini', price: '฿58,000–75,000', note: 'The most gifted Chanel in Thailand — perfect proportion' },
        { item: 'Loewe Puzzle Small', price: '฿48,000–78,000', note: 'Fashion-insider pick — increasingly recognized' },
        { item: 'Dior Lady Dior Small', price: '฿55,000–85,000', note: 'Elegant, formal, very well received' },
      ]
    },
    {
      budget: '฿120,000+',
      picks: [
        { item: 'Chanel Classic Flap Small', price: '฿210,000–285,000', note: 'Investment + gift in one — 95–100% value retention' },
        { item: 'Hermès Picotin 18', price: '฿130,000–185,000', note: 'Entry Hermès open-top bucket — attainable orange box moment' },
        { item: 'Cartier Love Bracelet Yellow Gold', price: '฿140,000–200,000', note: 'Crosses into jewelry — universal wow factor' },
      ]
    },
  ] : [
    {
      budget: 'ต่ำกว่า 20,000 บาท',
      picks: [
        { item: 'Louis Vuitton Pochette Accessoires', price: '11,000–17,000 บาท', note: 'การจดจำสูงสุดสำหรับราคา — impact LV ทันที' },
        { item: 'Gucci GG Pouch', price: '10,000–15,000 บาท', note: 'ดังในไทย ใช้ได้ทุกอายุ' },
        { item: 'Loewe Anagram Card Holder', price: '7,000–12,000 บาท', note: 'SLG luxury เล็กๆ — ดีสำหรับของขวัญ "luxury ชิ้นแรก"' },
      ]
    },
    {
      budget: '20,000–50,000 บาท',
      picks: [
        { item: 'LV Speedy 25 Monogram', price: '22,000–32,000 บาท', note: 'กระเป๋า LV ที่คนไทยชื่นชอบมากที่สุด' },
        { item: 'Chanel Mini Wallet on Chain', price: '22,000–34,000 บาท', note: 'Chanel เริ่มต้น — impact การให้ของขวัญสูงมาก' },
        { item: 'Dior Saddle Pouch', price: '18,000–28,000 บาท', note: 'ทันกระแส กลุ่มสยามพารากอนรู้จัก' },
      ]
    },
    {
      budget: '50,000–120,000 บาท',
      picks: [
        { item: 'Chanel Classic Flap Mini', price: '58,000–75,000 บาท', note: 'Chanel ที่ได้รับของขวัญมากที่สุดในไทย — สัดส่วนสมบูรณ์แบบ' },
        { item: 'Loewe Puzzle Small', price: '48,000–78,000 บาท', note: 'ตัวเลือกคนรักแฟชั่น — เป็นที่รู้จักมากขึ้น' },
        { item: 'Dior Lady Dior Small', price: '55,000–85,000 บาท', note: 'หรูหรา เป็นทางการ ได้รับการตอบรับดีมาก' },
      ]
    },
    {
      budget: '120,000 บาท+',
      picks: [
        { item: 'Chanel Classic Flap Small', price: '210,000–285,000 บาท', note: 'การลงทุน + ของขวัญในหนึ่งเดียว — รักษามูลค่า 95–100%' },
        { item: 'Hermès Picotin 18', price: '130,000–185,000 บาท', note: 'Hermès เริ่มต้นแบบ open-top bucket — โมเมนต์กล่องส้ม' },
        { item: 'Cartier Love Bracelet Yellow Gold', price: '140,000–200,000 บาท', note: 'ข้ามไปเป็นเครื่องประดับ — wow factor ที่ทุกคนรู้จัก' },
      ]
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/trends`} className="hover:text-gray-800">{isEn ? 'Trends' : 'เทรนด์'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Best Bags to Gift 2025' : 'กระเป๋าของขวัญที่ดีที่สุด 2025'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Best Pre-Owned Luxury Bags to Gift in Thailand 2025' : 'กระเป๋า Luxury มือสองของขวัญที่ดีที่สุดในไทย 2025'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn ? 'Gifting pre-owned saves 20–40% vs boutique — same bag, same reaction. Here\'s what lands best in Thailand by THB budget.'
          : 'ของขวัญมือสองประหยัดกว่าบูติก 20–40% — กระเป๋าเดิม ปฏิกิริยาเดิม นี่คือสิ่งที่ได้ผลดีที่สุดในไทยตามงบบาท'}
      </p>

      <div className="space-y-6 mb-10">
        {budgets.map((section, i) => (
          <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-5 py-3 font-semibold text-gray-900 border-b border-gray-200">{section.budget}</div>
            <div className="divide-y divide-gray-100">
              {section.picks.map((pick, j) => (
                <div key={j} className="px-5 py-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900 text-sm">{pick.item}</span>
                    <span className="text-green-700 font-medium text-sm">{pick.price}</span>
                  </div>
                  <p className="text-xs text-gray-500">{pick.note}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/trends/best-bags-to-gift-2025" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/trends/best-bags-to-gift-2025" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/guides/luxury-gift-guide`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          {isEn ? 'Gift Guide →' : 'คู่มือของขวัญ →'}
        </Link>
        <Link href={`/${locale}/trends/thai-luxury-market-2025`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          {isEn ? 'Thai Market 2025 →' : 'ตลาดไทย 2025 →'}
        </Link>
      </div>
    </div>
  )
}
