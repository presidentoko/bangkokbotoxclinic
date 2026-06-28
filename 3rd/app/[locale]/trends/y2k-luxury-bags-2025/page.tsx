import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'trends/y2k-luxury-bags-2025'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Y2K Luxury Bags Trending in Thailand 2025 | ChicPreowned'
      : 'กระเป๋าหรู Y2K เทรนด์ในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Y2K luxury bag trends 2025 for Thailand — Fendi Baguette, Dior Saddle, Prada Re-Edition 2000. What Y2K bags to buy pre-owned in Bangkok.'
      : 'เทรนด์กระเป๋าหรู Y2K 2025 สำหรับไทย — Fendi Baguette Dior Saddle Prada Re-Edition 2000 กระเป๋า Y2K ไหนที่ควรซื้อมือสองในกรุงเทพ',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

function formatPriceTHB(usd: number) {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export default async function Y2KBagsTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const bags = isEn ? [
    {
      name: 'Fendi Baguette (Vintage 2000–2005)',
      thb: `${formatPriceTHB(600)}–${formatPriceTHB(1800)}`,
      hot: true,
      note: 'The Y2K bag that started it all. Reissued by Fendi in 2020 but vintage 2000–2005 versions (with original FF hardware) are the collector target. Silk, beaded, and denim versions command the highest premiums.',
    },
    {
      name: 'Dior Saddle (Vintage John Galliano Era 1999–2007)',
      thb: `${formatPriceTHB(900)}–${formatPriceTHB(2200)}`,
      hot: true,
      note: 'Galliano-era saddle bags are the most desirable. The 2018 reissue renewed interest. Original pieces from the early 2000s — especially embroidered or stacked-D logo versions — have seen 40–80% price increases since 2022.',
    },
    {
      name: 'Prada Re-Edition 2000 (Mini Nylon Hobo)',
      thb: `${formatPriceTHB(700)}–${formatPriceTHB(1200)}`,
      hot: true,
      note: 'A 2020 Prada reissue that became a viral hit. Nylon construction, tiny chain strap, no logo screaming — understated Y2K cool. Current resale is nearly at retail, suggesting sustained demand.',
    },
    {
      name: 'Balenciaga City Bag (2001–2010)',
      thb: `${formatPriceTHB(500)}–${formatPriceTHB(1500)}`,
      hot: false,
      note: 'Nicolas Ghesquière-era City Bag (especially 2006–2010 leather quality) is the dream. Faded colors add to Y2K character. Values stable-to-rising as vintage appreciation builds.',
    },
    {
      name: 'Gucci Tom Ford Mini Bag (1999–2004)',
      thb: `${formatPriceTHB(400)}–${formatPriceTHB(900)}`,
      hot: false,
      note: 'Tom Ford-era Gucci bamboo handles, G-logo square bags, and Jackie 1961 predecessors. Harder to authenticate — get expert verification. Values rising as Tom Ford era gains cult status.',
    },
  ] : [
    {
      name: 'Fendi Baguette (วินเทจ 2000–2005)',
      thb: `${formatPriceTHB(600)}–${formatPriceTHB(1800)}`,
      hot: true,
      note: 'กระเป๋า Y2K ที่เริ่มต้นทุกอย่าง Fendi ออกใหม่ในปี 2020 แต่เวอร์ชั่นวินเทจ 2000–2005 (พร้อม hardware FF ดั้งเดิม) คือเป้าหมายของนักสะสม เวอร์ชั่นผ้าไหม ลูกปัด และยีนส์ได้ราคาพรีเมียมสูงสุด',
    },
    {
      name: 'Dior Saddle (วินเทจยุค John Galliano 1999–2007)',
      thb: `${formatPriceTHB(900)}–${formatPriceTHB(2200)}`,
      hot: true,
      note: 'กระเป๋า saddle ยุค Galliano น่าสนใจที่สุด การออกใหม่ปี 2018 ได้รับความสนใจใหม่ ชิ้นดั้งเดิมต้นยุค 2000 — โดยเฉพาะเวอร์ชั่นปักหรือโลโก้ D ซ้อน — ราคาเพิ่ม 40–80% ตั้งแต่ปี 2022',
    },
    {
      name: 'Prada Re-Edition 2000 (Mini Nylon Hobo)',
      thb: `${formatPriceTHB(700)}–${formatPriceTHB(1200)}`,
      hot: true,
      note: 'Prada ออกใหม่ปี 2020 ที่กลายเป็นไวรัล ผ้า nylon สายโซ่เล็ก ไม่ตะโกนโลโก้ — ความเย็นแบบ Y2K ไม่ฉูดฉาด มือสองปัจจุบันแทบเท่าราคาร้าน บ่งชี้ความต้องการต่อเนื่อง',
    },
    {
      name: 'Balenciaga City Bag (2001–2010)',
      thb: `${formatPriceTHB(500)}–${formatPriceTHB(1500)}`,
      hot: false,
      note: 'City Bag ยุค Nicolas Ghesquière (โดยเฉพาะคุณภาพหนังปี 2006–2010) คือความฝัน สีซีดเพิ่มความเป็น Y2K มูลค่าคงที่ถึงเพิ่มขึ้นเมื่อวินเทจได้รับความนิยม',
    },
    {
      name: 'Gucci Tom Ford Mini Bag (1999–2004)',
      thb: `${formatPriceTHB(400)}–${formatPriceTHB(900)}`,
      hot: false,
      note: 'Gucci ยุค Tom Ford ที่จับไม้ไผ่ กระเป๋าสี่เหลี่ยมโลโก้ G และต้นแบบ Jackie 1961 ตรวจสอบยากกว่า ต้องการผู้เชี่ยวชาญ มูลค่าเพิ่มเมื่อยุค Tom Ford ได้รับสถานะลัทธิ',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/brands`} className="hover:text-gray-800">{isEn ? 'Trends' : 'เทรนด์'}</Link>
        <span className="mx-2">/</span>
        <span>Y2K Bags 2025</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Y2K Luxury Bags Trending in 2025' : 'กระเป๋าหรู Y2K เทรนด์ในปี 2025'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Early 2000s aesthetics are everywhere in 2025 — and the bags that defined the era are following. Fendi Baguette, Dior Saddle, and Prada Re-Edition 2000 lead a Y2K pre-owned wave in Thailand. Here is what to buy and what to skip.'
          : 'สุนทรียศาสตร์ต้นยุค 2000 อยู่ทุกที่ในปี 2025 และกระเป๋าที่กำหนดยุคสมัยกำลังตามมา Fendi Baguette Dior Saddle และ Prada Re-Edition 2000 นำคลื่น Y2K มือสองในไทย นี่คือสิ่งที่ควรซื้อและสิ่งที่ควรข้าม'}
      </p>

      <div className="space-y-4 mb-10">
        {bags.map((b, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-gray-900">{b.name}</h2>
                {b.hot && <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">{isEn ? 'HOT' : 'กำลังมา'}</span>}
              </div>
              <span className="font-semibold text-amber-700 shrink-0">{b.thb}</span>
            </div>
            <p className="text-sm text-gray-600">{b.note}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/trends/y2k-luxury-bags-2025" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/trends/y2k-luxury-bags-2025" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/fendi`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Fendi Pre-Owned →' : 'Fendi มือสอง →'}</Link>
        <Link href={`/${locale}/trends/most-valuable-pre-owned-bags-2025`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Most Valuable 2025 →' : 'มีมูลค่าสูงสุด 2025 →'}</Link>
      </div>
    </div>
  )
}
