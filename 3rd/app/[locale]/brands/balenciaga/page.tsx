import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPrice } from '@/lib/data'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'brands/balenciaga'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Balenciaga Pre-Owned in Thailand 2025 | ChicPreowned' : 'Balenciaga มือสองในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Balenciaga City, Triple S, and Le Cagole pre-owned in Thailand. THB prices, authentication tips, and resale value.'
      : 'Balenciaga City, Triple S และ Le Cagole มือสองในไทย ราคาบาท เคล็ดลับตรวจสอบ และมูลค่าขายต่อ',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

export default async function BalenciagaBrandTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const items = getItemsByBrand('balenciaga').filter(i => i.price_ranges?.very_good)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/brands`} className="hover:text-gray-800">{isEn ? 'Brands' : 'แบรนด์'}</Link>
        <span className="mx-2">/</span>
        <span>Balenciaga</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Balenciaga Pre-Owned in Thailand 2025' : 'Balenciaga มือสองในไทย 2025'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn ? 'Founded 1917 in Spain. The City Bag launched in 2001 defined a generation. Demna era (2015–) redefined street luxury. Here\'s what trades in Thailand.'
          : 'ก่อตั้งปี 2460 ในสเปน City Bag ที่เปิดตัวปี 2544 นิยามยุคสมัย ยุค Demna (2558–) นิยามความหรูหราบนท้องถนนใหม่ นี่คือสิ่งที่ซื้อขายในไทย'}
      </p>

      {items.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {isEn ? 'Balenciaga Pre-Owned Prices (THB)' : 'ราคา Balenciaga มือสอง (บาท)'}
          </h2>
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-100">
                <Link href={`/${locale}/${item.slug}`} className="text-gray-800 hover:text-blue-600 font-medium">{item.model}</Link>
                <span className="text-green-700 font-medium">{formatPrice(item.price_ranges.very_good!.min)}–{formatPrice(item.price_ranges.very_good!.max)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isEn ? 'Value Retention by Model' : 'การรักษามูลค่าตามรุ่น'}
        </h2>
        <div className="space-y-3 text-sm text-gray-600">
          {isEn ? <>
            <div className="border-l-4 border-green-400 pl-4"><strong className="text-gray-900">City Bag (classic hardware):</strong> 60–75% — original 2001 shape with pewter hardware still commands premium</div>
            <div className="border-l-4 border-blue-400 pl-4"><strong className="text-gray-900">Le Cagole:</strong> 55–70% — Demna's most popular current bag; demand strong in Thailand</div>
            <div className="border-l-4 border-amber-400 pl-4"><strong className="text-gray-900">Triple S Sneakers:</strong> 40–60% — chunky sneaker trend cooled 2023–24; good value buy now</div>
            <div className="border-l-4 border-gray-300 pl-4"><strong className="text-gray-900">2022 controversy pieces:</strong> avoid — advertising controversy tanks secondary market for those items</div>
          </> : <>
            <div className="border-l-4 border-green-400 pl-4"><strong className="text-gray-900">City Bag (hardware คลาสสิก):</strong> 60–75% — ทรงดั้งเดิมปี 2544 พร้อม pewter hardware ยังมีราคาพรีเมียม</div>
            <div className="border-l-4 border-blue-400 pl-4"><strong className="text-gray-900">Le Cagole:</strong> 55–70% — กระเป๋าปัจจุบันที่ดังที่สุดของ Demna ความต้องการแข็งแกร่งในไทย</div>
            <div className="border-l-4 border-amber-400 pl-4"><strong className="text-gray-900">Triple S Sneakers:</strong> 40–60% — เทรนด์รองเท้าหนาเย็นลง 2566–67 ซื้อได้ดีในราคานี้</div>
            <div className="border-l-4 border-gray-300 pl-4"><strong className="text-gray-900">ชิ้นที่มีข้อโต้แย้งปี 2565:</strong> หลีกเลี่ยง — ข้อโต้แย้งโฆษณาทำให้ตลาดรองพังสำหรับชิ้นนั้น</div>
          </>}
        </div>
      </section>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/brands/balenciaga" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/brands/balenciaga" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/handbags`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          {isEn ? 'All Bags →' : 'กระเป๋าทั้งหมด →'}
        </Link>
      </div>
    </div>
  )
}
