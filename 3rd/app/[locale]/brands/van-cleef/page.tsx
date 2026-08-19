import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPriceTHB } from '@/lib/data'
import { BrandSchema } from '@/components/BrandSchema'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'brands/van-cleef'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Van Cleef & Arpels Pre-Owned Thailand: Alhambra 2025 | ChicPreowned' : 'Van Cleef & Arpels มือสองในไทย: Alhambra 2025 | ChicPreowned',
    description: isEn
      ? 'Buy pre-owned Van Cleef & Arpels in Thailand — Alhambra, Perlee, THB prices, Bangkok buying tips.'
      : 'ซื้อ Van Cleef & Arpels มือสองในไทย — Alhambra, Perlee ราคาบาท เคล็ดลับซื้อในกรุงเทพ',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function VanCleefTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const items = getItemsByBrand('van cleef').filter(i => i.price_ranges?.very_good)

  const pieces = isEn ? [
    { name: 'Vintage Alhambra Pendant (1 motif)', thb: '฿72,000–128,000', note: 'Entry VCA — clover, most accessible' },
    { name: 'Alhambra Bracelet (5 motifs)', thb: '฿180,000–320,000', note: 'Strongest resale; yellow gold most liquid in TH' },
    { name: 'Alhambra Long Necklace (20 motifs)', thb: '฿260,000–440,000', note: 'Statement piece; investment grade' },
    { name: 'Perlee Bracelet (small)', thb: '฿96,000–180,000', note: 'Bead-textured gold; second most recognized line' },
  ] : [
    { name: 'Vintage Alhambra Pendant (1 motif)', thb: '72,000–128,000 บาท', note: 'เริ่มต้น VCA — ดอกโคลเวอร์ เข้าถึงได้มากที่สุด' },
    { name: 'Alhambra Bracelet (5 motifs)', thb: '180,000–320,000 บาท', note: 'Resale แข็งแกร่งที่สุด; ทองเหลืองขายได้ดีที่สุดในไทย' },
    { name: 'Alhambra Long Necklace (20 motifs)', thb: '260,000–440,000 บาท', note: 'Statement piece; ระดับลงทุน' },
    { name: 'Perlee Bracelet (small)', thb: '96,000–180,000 บาท', note: 'ทองลูกปัด; สาย second ที่จดจำได้มากที่สุด' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <BrandSchema brandSlug="van-cleef" locale={locale} path={`brands/van-cleef`} />
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/brands`} className="hover:text-gray-800">{isEn ? 'Brands' : 'แบรนด์'}</Link>
        <span className="mx-2">/</span>
        <span>Van Cleef & Arpels</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        {isEn ? 'Van Cleef & Arpels Pre-Owned in Thailand' : 'Van Cleef & Arpels มือสองในไทย'}
      </h1>
      <p className="text-gray-600 text-sm mb-10">
        {isEn
          ? 'Founded Paris 1896. The Alhambra clover motif is among the most recognized fine jewelry pieces globally. Richemont group. Entry price below Cartier fine jewelry.'
          : 'ก่อตั้งปารีส 1896 โมทีฟดอกโคลเวอร์ Alhambra เป็นหนึ่งในเครื่องประดับชั้นสูงที่จดจำได้มากที่สุดในโลก กลุ่ม Richemont ราคาเริ่มต้นต่ำกว่า Cartier'}
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
          ? <Link href="/th/brands/van-cleef" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/brands/van-cleef" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/compare/cartier-vs-van-cleef`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Cartier vs VCA →</Link>
        <Link href={`/${locale}/brands/cartier`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Cartier →</Link>
      </div>
    </div>
  )
}
