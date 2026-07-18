import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'trends/most-valuable-pre-owned-bags-2025'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Most Valuable Pre-Owned Bags 2025 Thailand | ChicPreowned'
      : 'กระเป๋ามือสองที่มีมูลค่าสูงสุดในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'The most valuable pre-owned luxury bags in 2025 for Thai buyers — Hermès Birkin, Chanel Classic, Kelly. Which bag appreciates most? THB market prices.'
      : 'กระเป๋าหรูมือสองที่มีมูลค่าสูงสุดในปี 2025 สำหรับผู้ซื้อชาวไทย — Hermès Birkin Chanel Classic Kelly กระเป๋าไหนเพิ่มมูลค่าสูงสุด ราคาตลาดบาท',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

function formatPriceTHB(usd: number) {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export default async function MostValuableTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const bags = isEn ? [
    { rank: 1, name: 'Hermès Birkin 25 (Exotic leathers)', thb: `${formatPriceTHB(25000)}+`, change: '+15–30% YoY', note: 'Niloticus crocodile and porosus crocodile Birkin 25 in rare colors outperform everything. Waiting lists exceed 5 years. The ultimate pre-owned investment.' },
    { rank: 2, name: 'Hermès Birkin 25 (Togo/Epsom)', thb: `${formatPriceTHB(15000)}–${formatPriceTHB(22000)}`, change: '+10–18% YoY', note: 'Standard leather Birkin 25 has shown consistent 10–18% annual appreciation since 2019. Demand exceeds supply at all price points.' },
    { rank: 3, name: 'Chanel Classic Flap (Medium, Black)', thb: `${formatPriceTHB(7500)}–${formatPriceTHB(12000)}`, change: '+8–12% YoY', note: 'Chanel raises retail prices 8–15% per year. Pre-owned tracks retail. Black caviar leather CC hardware is the benchmark — most liquid of all.' },
    { rank: 4, name: 'Hermès Kelly 25 (Sellier)', thb: `${formatPriceTHB(12000)}–${formatPriceTHB(18000)}`, change: '+8–15% YoY', note: 'The rigid Kelly 25 in Sellier construction. Harder to find than Birkin at same size. Strong collector demand from royal and diplomatic circles.' },
    { rank: 5, name: 'Patek Philippe Nautilus 5711', thb: `${formatPriceTHB(120000)}–${formatPriceTHB(200000)}`, change: '3–5× retail', note: 'Not a bag, but the watch equivalent. Discontinued 2021. Every year further from production, demand intensifies. Liquid worldwide.' },
    { rank: 6, name: 'Louis Vuitton Neverfull MM (Discontinued Prints)', thb: `${formatPriceTHB(1800)}–${formatPriceTHB(3500)}`, change: '+5–12% (limited prints)', note: 'Standard Damier and Monogram hold flat. Discontinued special editions (Kusama, Stephen Sprouse) appreciate significantly. Research before buying.' },
  ] : [
    { rank: 1, name: 'Hermès Birkin 25 (หนังพิเศษ)', thb: `${formatPriceTHB(25000)}+`, change: '+15–30% ต่อปี', note: 'Birkin 25 หนังจระเข้ niloticus และ porosus สีหายากดีที่สุดกว่าทุกอย่าง คิวรอเกิน 5 ปี การลงทุนมือสองขั้นสูงสุด' },
    { rank: 2, name: 'Hermès Birkin 25 (Togo/Epsom)', thb: `${formatPriceTHB(15000)}–${formatPriceTHB(22000)}`, change: '+10–18% ต่อปี', note: 'Birkin 25 หนังมาตรฐานแสดงการเพิ่มมูลค่า 10–18% ต่อปีสม่ำเสมอตั้งแต่ปี 2019 ความต้องการเกินอุปทานในทุกระดับราคา' },
    { rank: 3, name: 'Chanel Classic Flap (Medium, ดำ)', thb: `${formatPriceTHB(7500)}–${formatPriceTHB(12000)}`, change: '+8–12% ต่อปี', note: 'Chanel ขึ้นราคาร้าน 8–15% ต่อปี มือสองติดตามร้าน หนัง caviar สีดำ hardware CC คือมาตรฐาน — มีสภาพคล่องสูงสุดของทุกอย่าง' },
    { rank: 4, name: 'Hermès Kelly 25 (Sellier)', thb: `${formatPriceTHB(12000)}–${formatPriceTHB(18000)}`, change: '+8–15% ต่อปี', note: 'Kelly 25 แข็งทรงแบบ Sellier หายากกว่า Birkin ขนาดเดียวกัน ความต้องการจากนักสะสมแข็งแกร่งจากวงราชวงศ์และการทูต' },
    { rank: 5, name: 'Patek Philippe Nautilus 5711', thb: `${formatPriceTHB(120000)}–${formatPriceTHB(200000)}`, change: '3–5× ราคาร้าน', note: 'ไม่ใช่กระเป๋า แต่เทียบเท่าในวงนาฬิกา ยุติการผลิตปี 2021 ทุกปีที่ห่างจากการผลิต ความต้องการเพิ่มขึ้น มีสภาพคล่องทั่วโลก' },
    { rank: 6, name: 'Louis Vuitton Neverfull MM (ลายที่ยุติการผลิต)', thb: `${formatPriceTHB(1800)}–${formatPriceTHB(3500)}`, change: '+5–12% (ลาย Limited)' , note: 'Damier และ Monogram มาตรฐานทรงตัว รุ่น Limited Edition ที่ยุติการผลิต (Kusama, Stephen Sprouse) เพิ่มมูลค่าสำคัญ ศึกษาก่อนซื้อ' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/brands`} className="hover:text-gray-800">{isEn ? 'Trends' : 'เทรนด์'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Most Valuable Pre-Owned 2025' : 'กระเป๋ามีมูลค่าสูงสุด 2025'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Most Valuable Pre-Owned Bags 2025' : 'กระเป๋ามือสองที่มีมูลค่าสูงสุด 2025'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Not all pre-owned luxury appreciates. Most depreciates. These six pieces — led by Hermès exotics and Chanel Classic — have consistently outperformed inflation and even traditional investments. Ranked by long-term value retention.'
          : 'ไม่ใช่ทุกอย่างหรูมือสองที่เพิ่มมูลค่า ส่วนใหญ่ลดลง หกชิ้นนี้ — นำโดย Hermès exotics และ Chanel Classic — แสดงประสิทธิภาพสม่ำเสมอเหนือเงินเฟ้อและแม้แต่การลงทุนแบบดั้งเดิม จัดอันดับตามการรักษามูลค่าระยะยาว'}
      </p>

      <div className="space-y-4 mb-10">
        {bags.map((b) => (
          <div key={b.rank} className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-start gap-4">
              <span className="text-2xl font-bold text-gray-200 leading-none shrink-0">#{b.rank}</span>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-2">
                  <h2 className="font-bold text-gray-900">{b.name}</h2>
                  <div className="text-right shrink-0">
                    <div className="font-semibold text-amber-700">{b.thb}</div>
                    <div className="text-xs text-green-600 font-medium">{b.change}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{b.note}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/trends/most-valuable-pre-owned-bags-2025" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/trends/most-valuable-pre-owned-bags-2025" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/guides/most-iconic-bags-to-buy-used`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Top 10 Iconic Bags →' : 'กระเป๋าไอคอน Top 10 →'}</Link>
        <Link href={`/${locale}/guides/luxury-bags-as-investments`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Bags as Investments →' : 'กระเป๋าเป็นการลงทุน →'}</Link>
      </div>
    </div>
  )
}
