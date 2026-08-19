import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPriceTHB } from '@/lib/data'
import { BrandSchema } from '@/components/BrandSchema'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'brands/bulgari'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Bulgari Pre-Owned Thailand: Serpenti, B.zero1 2025 | ChicPreowned' : 'Bulgari มือสองในไทย: Serpenti, B.zero1 2025 | ChicPreowned',
    description: isEn
      ? 'Buy pre-owned Bulgari in Thailand — Serpenti, B.zero1, Diva\'s Dream. THB prices, authentic pieces, Bangkok buying tips.'
      : 'ซื้อ Bulgari มือสองในไทย — Serpenti, B.zero1, Diva\'s Dream ราคาบาท ของแท้ เคล็ดลับซื้อในกรุงเทพ',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function BulgariTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const items = getItemsByBrand('bulgari').filter(i => i.price_ranges?.very_good)

  const pieces = isEn ? [
    { name: 'Serpenti Forever Crossbody', thb: '฿56,000–128,000', note: 'Snake head clasp; black/elaphe best resale' },
    { name: 'Serpenti Turbogas Bracelet', thb: '฿112,000–260,000', note: 'Spring-coil gold — strong demand in TH' },
    { name: 'B.zero1 Ring (yellow gold)', thb: '฿48,000–112,000', note: 'Most recognizable Bulgari piece; 1-3-4 bands' },
    { name: 'Octo Roma Watch', thb: '฿220,000–480,000', note: 'Octagonal case — Bulgari\'s watch reference' },
  ] : [
    { name: 'Serpenti Forever Crossbody', thb: '56,000–128,000 บาท', note: 'หัวงูทอง; สีดำ/elaphe resale ดีที่สุด' },
    { name: 'Serpenti Turbogas Bracelet', thb: '112,000–260,000 บาท', note: 'สร้อยข้อมือสปริงทอง — ความต้องการแข็งแกร่งในไทย' },
    { name: 'B.zero1 Ring (yellow gold)', thb: '48,000–112,000 บาท', note: 'แหวนที่จดจำได้มากที่สุดของ Bulgari; วงแหวน 1-3-4' },
    { name: 'Octo Roma Watch', thb: '220,000–480,000 บาท', note: 'เคสแปดเหลี่ยม — นาฬิกา reference หลักของ Bulgari' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <BrandSchema brandSlug="bulgari" locale={locale} path={`brands/bulgari`} />
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/brands`} className="hover:text-gray-800">{isEn ? 'Brands' : 'แบรนด์'}</Link>
        <span className="mx-2">/</span>
        <span>Bulgari</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">{isEn ? 'Bulgari Pre-Owned in Thailand' : 'Bulgari มือสองในไทย'}</h1>
      <p className="text-gray-600 text-sm mb-10">
        {isEn
          ? 'Founded Rome 1884. Bold, colorful jewelry with ancient Roman DNA. Now LVMH. Key references: Serpenti, B.zero1, Diva\'s Dream, Octo Roma.'
          : 'ก่อตั้งกรุงโรม 1884 เครื่องประดับสีสันโดดเด่นด้วย DNA โรมันโบราณ ปัจจุบันเป็นของ LVMH Serpenti, B.zero1, Diva\'s Dream, Octo Roma'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Piece' : 'รุ่น'}</th>
              <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Pre-Owned (THB)' : 'มือสอง (บาท)'}</th>
              <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Note' : 'หมายเหตุ'}</th>
            </tr>
          </thead>
          <tbody>
            {pieces.map((p, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-900">{p.name}</td>
                <td className="py-3 px-4 text-amber-700 font-semibold">{p.thb}</td>
                <td className="py-3 px-4 text-gray-400 text-xs">{p.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {items.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
          {items.slice(0, 6).map(item => (
            <Link key={item.id} href={`/${locale}/${item.slug}`} className="border border-gray-200 rounded-xl p-3 hover:border-gray-400">
              <p className="font-medium text-gray-900 text-sm mb-1">{item.model}</p>
              <p className="text-gray-500 text-xs">{formatPriceTHB(item.price_ranges.very_good!.min)}+</p>
            </Link>
          ))}
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/brands/bulgari" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/brands/bulgari" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/compare/cartier-vs-bulgari`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Cartier vs Bulgari →</Link>
        <Link href={`/${locale}/brands/cartier`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Cartier {isEn ? 'Guide' : 'คู่มือ'} →</Link>
      </div>
    </div>
  )
}
