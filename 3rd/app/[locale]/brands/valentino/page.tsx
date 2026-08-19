import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPriceTHB } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'
import { BrandSchema } from '@/components/BrandSchema'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'brands/valentino'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Valentino Pre-Owned in Thailand 2025 | ChicPreowned' : 'Valentino มือสองในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Valentino Rockstud, VLogo, and Locò pre-owned in Thailand. THB prices, resale value, and Piccioli vs Michele era comparison.'
      : 'Valentino Rockstud, VLogo และ Locò มือสองในไทย ราคาบาท มูลค่าขายต่อ และเปรียบเทียบยุค Piccioli กับ Michele',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function ValentinoBrandTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const items = getItemsByBrand('valentino').filter(i => i.price_ranges?.very_good)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <BrandSchema brandSlug="valentino" locale={locale} path={`brands/valentino`} />
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/brands`} className="hover:text-gray-800">{isEn ? 'Brands' : 'แบรนด์'}</Link>
        <span className="mx-2">/</span>
        <span>Valentino</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? `Valentino Pre-Owned in Thailand ${PRICE_YEAR}` : `Valentino มือสองในไทย ${PRICE_YEAR}`}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn ? 'Founded 1960 in Rome. Iconic for Rockstud hardware (2010–). Piccioli era (2016–2023) defined the modern aesthetic. Alessandro Michele joined 2023.'
          : 'ก่อตั้งปี 2503 ในกรุงโรม โดดเด่นด้วยงานโลหะ Rockstud (2553–) ยุค Piccioli (2559–2566) กำหนดสไตล์สมัยใหม่ Alessandro Michele เข้ามาปี 2566'}
      </p>

      {items.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {isEn ? 'Valentino Pre-Owned Prices (THB)' : 'ราคา Valentino มือสอง (บาท)'}
          </h2>
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-100">
                <Link href={`/${locale}/${item.slug}`} className="text-gray-800 hover:text-blue-600 font-medium">{item.model}</Link>
                <span className="text-green-700 font-medium">{formatPriceTHB(item.price_ranges.very_good!.min)}–{formatPriceTHB(item.price_ranges.very_good!.max)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isEn ? 'Piccioli vs Michele Era' : 'ยุค Piccioli vs Michele'}
        </h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 rounded-xl p-5">
            <div className="font-semibold text-gray-900 mb-2">Piccioli Era (2016–2023)</div>
            <ul className="text-gray-600 space-y-1.5">
              <li>• Rockstud hardware — instantly identifiable</li>
              <li>• Roman Stud XL quilted bags</li>
              <li>• Better pre-owned retention vs Michele era so far</li>
              <li>• Red carpet celebrity association at peak</li>
            </ul>
          </div>
          <div className="bg-amber-50 rounded-xl p-5">
            <div className="font-semibold text-gray-900 mb-2">Michele Era (2023–present)</div>
            <ul className="text-gray-600 space-y-1.5">
              <li>• More eclectic, maximalist direction</li>
              <li>• Early Michele pieces — watch resale carefully</li>
              <li>• Thai market: still adjusting to new aesthetic</li>
              <li>• Potential upside if Michele era collectors emerge</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/brands/valentino" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/brands/valentino" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/handbags`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          {isEn ? 'All Bags →' : 'กระเป๋าทั้งหมด →'}
        </Link>
      </div>
    </div>
  )
}
