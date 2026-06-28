import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/dior-vs-valentino'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Dior vs Valentino Thailand 2025: Lady Dior vs Rockstud | ChicPreowned'
      : 'Dior vs Valentino ไทย 2025: Lady Dior vs Rockstud | ChicPreowned',
    description: isEn
      ? 'Dior vs Valentino for Bangkok buyers — Lady Dior vs Roman Stud, THB prices, resale, investment case. Which luxury house to buy pre-owned in Thailand 2025?'
      : 'Dior vs Valentino สำหรับผู้ซื้อกรุงเทพ Lady Dior vs Roman Stud ราคาบาท การขายต่อ คุณค่าการลงทุน ควรซื้อบ้านหรูอันไหนมือสองในไทย 2025?',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

function formatPriceTHB(usd: number) {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export default async function DiorVsValentinoTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const rows = isEn ? [
    { label: 'Founded', dior: 'Paris, 1946. One of fashion\'s "Big Six."', valentino: 'Rome, 1960 by Valentino Garavani. "The last couturier."' },
    { label: 'Creative direction', dior: 'Maria Grazia Chiuri (2016–present)', valentino: 'Alessandro Michele (2023–present). Previously Gucci creative director.' },
    { label: 'Signature bags', dior: 'Lady Dior, Book Tote, Saddle Bag, 30 Montaigne', valentino: 'Rockstud, Roman Stud, VSling, Loco bag' },
    { label: 'Pre-owned price', dior: `Lady Dior small: $1,800–$3,200 (${formatPriceTHB(1800)}–${formatPriceTHB(3200)})`, valentino: `Rockstud: $600–$1,400 (${formatPriceTHB(600)}–${formatPriceTHB(1400)})` },
    { label: 'Resale value', dior: 'Lady Dior: 55–75% of retail. Saddle: 60–80%.', valentino: 'Rockstud: 45–60%. Roman Stud: 40–55%. Below Dior.' },
    { label: 'Investment case', dior: 'Stronger. Lady Dior is an established collector\'s piece.', valentino: 'Weaker for bags. Shoes (Rockstud heels) have stronger resale than bags.' },
    { label: 'Bangkok context', dior: 'Dior at Siam Paragon, Emporium. Strong recognition. Lady Dior waitlist-level demand.', valentino: 'Valentino at Emporium, ICONSIAM. Less secondary market activity in Bangkok than Dior.' },
  ] : [
    { label: 'ก่อตั้ง', dior: 'ปารีส 1946 หนึ่งใน "Big Six" แฟชั่น', valentino: 'โรม 1960 โดย Valentino Garavani "นักออกแบบ haute couture คนสุดท้าย"' },
    { label: 'ทิศทางสร้างสรรค์', dior: 'Maria Grazia Chiuri (2016–ปัจจุบัน)', valentino: 'Alessandro Michele (2023–ปัจจุบัน) อดีต creative director Gucci' },
    { label: 'กระเป๋าหลัก', dior: 'Lady Dior, Book Tote, Saddle Bag, 30 Montaigne', valentino: 'Rockstud, Roman Stud, VSling, Loco bag' },
    { label: 'ราคามือสอง', dior: `Lady Dior small: $1,800–$3,200 (${formatPriceTHB(1800)}–${formatPriceTHB(3200)})`, valentino: `Rockstud: $600–$1,400 (${formatPriceTHB(600)}–${formatPriceTHB(1400)})` },
    { label: 'มูลค่าขายต่อ', dior: 'Lady Dior: 55–75% ราคาร้าน Saddle: 60–80%', valentino: 'Rockstud: 45–60% Roman Stud: 40–55% ต่ำกว่า Dior' },
    { label: 'คุณค่าการลงทุน', dior: 'แข็งแกร่งกว่า Lady Dior เป็นชิ้นของนักสะสมที่มั่นคง', valentino: 'อ่อนแอกว่าสำหรับกระเป๋า รองเท้า (Rockstud heels) มีการขายต่อแข็งแกร่งกว่ากระเป๋า' },
    { label: 'บริบทกรุงเทพ', dior: 'Dior ที่ Siam Paragon, Emporium การรู้จักแข็งแกร่ง ความต้องการระดับรายชื่อรอสำหรับ Lady Dior', valentino: 'Valentino ที่ Emporium, ICONSIAM กิจกรรมตลาดรองกรุงเทพน้อยกว่า Dior' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/compare`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบเทียบ'}</Link>
        <span className="mx-2">/</span>
        <span>Dior vs Valentino</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Dior vs Valentino 2025' : 'Dior vs Valentino 2025'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Two European luxury houses with very different investment profiles. Dior is commercially dominant — Lady Dior consistently holds value above 55% of retail. Valentino is the insider choice — deep couture heritage, Alessandro Michele\'s 2023 reinvention, and shoes (Rockstud heels) that often outperform the bags on resale.'
          : 'สองบ้านหรูยุโรปที่มีโปรไฟล์การลงทุนแตกต่างกันมาก Dior ครองตลาดเชิงพาณิชย์ Lady Dior รักษามูลค่าเกิน 55% ของราคาร้านอย่างสม่ำเสมอ Valentino คือทางเลือกของผู้รู้จัก มรดก haute couture ที่ลึก การสร้างใหม่ของ Alessandro Michele ในปี 2023 และรองเท้า (Rockstud heels) ที่มักมีผลการขายต่อดีกว่ากระเป๋า'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="w-32 text-left py-3 px-4 font-semibold text-gray-500 uppercase text-xs tracking-wide"></th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Christian Dior</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Valentino</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">{row.label}</td>
                <td className="py-3 px-4 text-gray-700 text-sm">{row.dior}</td>
                <td className="py-3 px-4 text-gray-700 text-sm">{row.valentino}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/dior-vs-valentino" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/dior-vs-valentino" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/dior`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Dior Pre-Owned →' : 'Dior มือสอง →'}</Link>
        <Link href={`/${locale}/compare/dior-vs-gucci`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Dior vs Gucci →</Link>
        <Link href={`/${locale}/compare/balenciaga-vs-valentino`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Balenciaga vs Valentino →</Link>
      </div>
    </div>
  )
}
