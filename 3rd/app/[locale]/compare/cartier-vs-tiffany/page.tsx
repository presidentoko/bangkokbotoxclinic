import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/cartier-vs-tiffany'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Cartier vs Tiffany Pre-Owned Thailand 2025 | ChicPreowned'
      : 'Cartier vs Tiffany มือสองในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Cartier vs Tiffany comparison — Love Bracelet vs T1 bangle, resale value, jewelry investment in Thailand. THB prices.'
      : 'เปรียบ Cartier กับ Tiffany — Love Bracelet vs T1 bangle มูลค่าขายต่อ การลงทุนเครื่องประดับในไทย ราคาบาท',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

export default async function CartierVsTiffanyTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { metric: 'Founded', cartier: '1847, Paris', tiffany: '1837, New York' },
    { metric: 'Heritage', cartier: '"Jeweler of Kings" — Napoleon III, British royalty', tiffany: 'America\'s luxury jewelry icon. Iconic blue box.' },
    { metric: 'Flagship bracelet', cartier: 'Love Bracelet (1969): ฿88,000–฿180,000', tiffany: 'T1 Bangle (2014): ฿28,000–฿65,000' },
    { metric: 'Flagship ring', cartier: 'Trinity Ring: ฿24,000–40,000', tiffany: 'Setting Engagement: ฿50,000–200,000+' },
    { metric: 'Resale vs retail (Love Bracelet)', cartier: '75–110% — strong hold, especially YG', tiffany: '50–80% — weaker pre-owned market' },
    { metric: 'Thailand availability', cartier: 'Boutiques at Paragon, ICONSIAM, Emporium', tiffany: 'Boutiques at Paragon, CentralWorld' },
    { metric: 'Resale market depth', cartier: 'Deep — Love Bracelet among most liquid jewelry', tiffany: 'Shallower — T1 market smaller' },
    { metric: 'Gold quality', cartier: '18K gold across all lines', tiffany: '18K gold on premium; 925 sterling on others' },
    { metric: 'Cultural cachet (TH)', cartier: 'Very high — Love Bracelet universally known', tiffany: 'Good — blue box recognized, but less status signal' },
    { metric: 'Investment case', cartier: 'Stronger — gold content + brand premium', tiffany: 'Weaker — larger US-focused buyer base helps somewhat' },
  ] : [
    { metric: 'ก่อตั้ง', cartier: '1847, ปารีส', tiffany: '1837, นิวยอร์ก' },
    { metric: 'มรดก', cartier: '"ช่างอัญมณีของกษัตริย์" — Napoleon III, ราชวงศ์อังกฤษ', tiffany: 'ไอคอนเครื่องประดับหรูของอเมริกา กล่องสีฟ้าอันโด่งดัง' },
    { metric: 'กำไลเด่น', cartier: 'Love Bracelet (1969): ฿88,000–฿180,000', tiffany: 'T1 Bangle (2014): ฿28,000–฿65,000' },
    { metric: 'แหวนเด่น', cartier: 'Trinity Ring: ฿24,000–40,000', tiffany: 'Setting Engagement: ฿50,000–200,000+' },
    { metric: 'ขายต่อ vs ราคาร้าน (Love Bracelet)', cartier: '75–110% — คงมูลค่าดี โดยเฉพาะ YG', tiffany: '50–80% — ตลาดมือสองอ่อนแอกว่า' },
    { metric: 'หาได้ในไทย', cartier: 'บูติกที่พารากอน ICONSIAM เอ็มโพเรียม', tiffany: 'บูติกที่พารากอน เซ็นทรัลเวิลด์' },
    { metric: 'ความลึกตลาดมือสอง', cartier: 'ลึก — Love Bracelet เป็นหนึ่งในเครื่องประดับที่คล่องสุด', tiffany: 'น้อยกว่า — ตลาด T1 เล็กกว่า' },
    { metric: 'คุณภาพทอง', cartier: 'ทอง 18K ทุกไลน์', tiffany: 'ทอง 18K สำหรับพรีเมียม เงิน 925 สำหรับไลน์อื่น' },
    { metric: 'คุณค่าทางวัฒนธรรม (ไทย)', cartier: 'สูงมาก — Love Bracelet รู้จักทั่วไป', tiffany: 'ดี — กล่องสีฟ้ารู้จัก แต่สัญลักษณ์สถานะน้อยกว่า' },
    { metric: 'กรณีการลงทุน', cartier: 'แข็งแกร่งกว่า — ทองคำ + พรีเมียมแบรนด์', tiffany: 'อ่อนแอกว่า — ฐานผู้ซื้อในสหรัฐฯ ช่วยบ้าง' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/brands`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>Cartier vs Tiffany</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Cartier vs Tiffany Pre-Owned' : 'Cartier vs Tiffany มือสอง'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'The old world vs. new world of fine jewelry. Cartier dominates the Thai luxury jewelry market; Tiffany is growing. Pre-owned values diverge significantly.'
          : 'เครื่องประดับระหว่างโลกเก่าและโลกใหม่ Cartier ครองตลาดเครื่องประดับหรูในไทย Tiffany กำลังเติบโต มูลค่ามือสองต่างกันอย่างมีนัยสำคัญ'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-500 w-1/3"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Cartier</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Tiffany</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-500 text-xs font-medium uppercase tracking-wide">{r.metric}</td>
                <td className="py-3 px-4 text-gray-700">{r.cartier}</td>
                <td className="py-3 px-4 text-gray-700">{r.tiffany}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/cartier-vs-tiffany" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/cartier-vs-tiffany" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/cartier`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Cartier Pre-Owned →' : 'Cartier มือสอง →'}</Link>
        <Link href={`/${locale}/compare/cartier-vs-van-cleef`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Cartier vs Van Cleef →</Link>
      </div>
    </div>
  )
}
