import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPriceTHB } from '@/lib/data'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/lv-neverfull-size-guide'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'LV Neverfull PM vs MM vs GM: Thailand Size Guide 2025 | ChicPreowned'
      : 'LV Neverfull PM vs MM vs GM: คู่มือขนาดในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Louis Vuitton Neverfull size guide for Thai buyers — PM vs MM vs GM dimensions, THB prices, which size to buy pre-owned in Thailand.'
      : 'คู่มือขนาด LV Neverfull สำหรับคนไทย — PM vs MM vs GM ขนาด ราคาบาท ซื้อขนาดไหนมือสองในไทย',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

export default async function NeverfullSizeGuideTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const lvItems = getItemsByBrand('louis vuitton')
    .filter(i => i.model?.toLowerCase().includes('neverfull') && i.price_ranges?.very_good)
    .slice(0, 3)

  const sizes = isEn ? [
    { name: 'PM', dims: '28×22×14 cm', thb: '฿20,000–27,000', best: 'Light daily, evenings', note: 'Rarest PM — harder to find pre-owned' },
    { name: 'MM ★', dims: '31×28×17 cm', thb: '฿25,000–35,000', best: 'Work, daily, travel', note: 'Best resale — widest pre-owned choice' },
    { name: 'GM', dims: '39×32×19 cm', thb: '฿27,000–38,000', best: 'Beach, gym, travel', note: 'Best value per litre; often overlooked' },
  ] : [
    { name: 'PM', dims: '28×22×14 cm', thb: '20,000–27,000 บาท', best: 'ใช้เบาๆ, ตอนเย็น', note: 'PM หายากที่สุด — หามือสองยากกว่า' },
    { name: 'MM ★', dims: '31×28×17 cm', thb: '25,000–35,000 บาท', best: 'ทำงาน, ใช้ทุกวัน, เดินทาง', note: 'Resale ดีที่สุด — เลือกมือสองได้มากสุด' },
    { name: 'GM', dims: '39×32×19 cm', thb: '27,000–38,000 บาท', best: 'ชายหาด, ฟิตเนส, เดินทาง', note: 'คุ้มที่สุดต่อลิตร; มักถูกมองข้าม' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>Neverfull Size Guide</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'LV Neverfull PM vs MM vs GM: Which Size?' : 'LV Neverfull PM vs MM vs GM: ขนาดไหนดี?'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'The Neverfull is Louis Vuitton\'s bestseller — and one of the most active bags on the Thai pre-owned market. Three sizes, very different uses.'
          : 'Neverfull คือกระเป๋าขายดีที่สุดของ Louis Vuitton — และเป็นหนึ่งในกระเป๋ามือสองที่ซื้อขายมากที่สุดในไทย มีสามขนาด ใช้งานต่างกันมาก'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Size' : 'ขนาด'}</th>
              <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Dimensions' : 'มิติ'}</th>
              <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Pre-Owned (THB)' : 'มือสอง (บาท)'}</th>
              <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Best For' : 'เหมาะกับ'}</th>
              <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Note' : 'หมายเหตุ'}</th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 font-bold text-gray-900">{row.name}</td>
                <td className="py-3 px-4 text-gray-600">{row.dims}</td>
                <td className="py-3 px-4 text-amber-700 font-semibold">{row.thb}</td>
                <td className="py-3 px-4 text-gray-600">{row.best}</td>
                <td className="py-3 px-4 text-gray-400 text-xs">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {lvItems.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">{isEn ? 'Available Now' : 'มีในสต็อก'}</h2>
          {lvItems.map(item => (
            <div key={item.id} className="flex justify-between text-sm py-2 border-b border-gray-100">
              <Link href={`/${locale}/${item.slug}`} className="text-gray-700 hover:text-blue-600">{item.model}</Link>
              <span className="text-gray-500">{formatPriceTHB(item.price_ranges.very_good!.min)}+</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/lv-neverfull-size-guide" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/lv-neverfull-size-guide" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/louis-vuitton`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">LV {isEn ? 'Pre-Owned' : 'มือสอง'} →</Link>
        <Link href={`/${locale}/compare/lv-vs-gucci`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">LV vs Gucci →</Link>
      </div>
    </div>
  )
}
