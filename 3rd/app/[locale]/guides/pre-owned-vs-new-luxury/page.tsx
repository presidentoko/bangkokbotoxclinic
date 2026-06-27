import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'guides/pre-owned-vs-new-luxury'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Pre-Owned vs New Luxury in Thailand: Worth It? 2025 | ChicPreowned' : 'มือสองกับของใหม่ Luxury ในไทย: คุ้มไหม? 2025 | ChicPreowned',
    description: isEn
      ? 'Pre-owned vs new luxury bags in Thailand — THB price comparisons, duty considerations, when pre-owned wins, authentication tips for Thai buyers.'
      : 'มือสองกับ luxury ใหม่ในไทย — เปรียบราคาบาท ภาษีนำเข้า เมื่อไหรที่มือสองชนะ เคล็ดลับตรวจสอบสำหรับคนไทย',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

export default async function PreOwnedVsNewTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const comparison = isEn ? [
    { item: 'Chanel Classic Flap S', retail: '฿357,000', preOwned: '฿240,000–300,000', saving: '16–33%' },
    { item: 'LV Neverfull MM', retail: '฿62,000', preOwned: '฿35,000–48,000', saving: '23–44%' },
    { item: 'Hermès Birkin 30', retail: '฿460,000+ (no access)', preOwned: '฿760,000–1,800,000', saving: 'Premium (only market)' },
    { item: 'Bottega Veneta Jodie M', retail: '฿135,000', preOwned: '฿66,000–92,000', saving: '32–51%' },
    { item: 'Rolex Submariner', retail: '฿370,000', preOwned: '฿445,000–570,000', saving: 'Premium (above retail)' },
  ] : [
    { item: 'Chanel Classic Flap S', retail: '357,000 บาท', preOwned: '240,000–300,000 บาท', saving: 'ประหยัด 16–33%' },
    { item: 'LV Neverfull MM', retail: '62,000 บาท', preOwned: '35,000–48,000 บาท', saving: 'ประหยัด 23–44%' },
    { item: 'Hermès Birkin 30', retail: '460,000+ บาท (ซื้อไม่ได้)', preOwned: '760,000–1,800,000 บาท', saving: 'พรีเมียม (ตลาดเดียว)' },
    { item: 'Bottega Veneta Jodie M', retail: '135,000 บาท', preOwned: '66,000–92,000 บาท', saving: 'ประหยัด 32–51%' },
    { item: 'Rolex Submariner', retail: '370,000 บาท', preOwned: '445,000–570,000 บาท', saving: 'พรีเมียม (แพงกว่า retail)' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/guides`} className="hover:text-gray-800">{isEn ? 'Guides' : 'คู่มือ'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Pre-Owned vs New' : 'มือสองกับของใหม่'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Pre-Owned vs New Luxury in Thailand 2025' : 'มือสองกับ Luxury ใหม่ในไทย 2025'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn ? 'Thailand\'s luxury market is unique — import duty on new goods, strong grey market, and a very active pre-owned community. Here\'s when pre-owned wins.'
          : 'ตลาด luxury ไทยไม่เหมือนที่อื่น — ภาษีนำเข้าของใหม่ Grey market แข็งแกร่ง และชุมชนมือสองที่คึกคัก นี่คือเมื่อไหรที่มือสองชนะ'}
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{isEn ? 'Price Comparison (THB 2025)' : 'เปรียบราคา (บาท 2025)'}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Item' : 'สินค้า'}</th>
                <th className="text-left py-3 px-4 font-semibold">{isEn ? 'New Retail' : 'ใหม่ Retail'}</th>
                <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Pre-Owned' : 'มือสอง'}</th>
                <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Difference' : 'ผลต่าง'}</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{row.item}</td>
                  <td className="py-3 px-4 text-gray-600">{row.retail}</td>
                  <td className="py-3 px-4 text-gray-700">{row.preOwned}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-green-700">{row.saving}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900 mb-8">
        <strong>{isEn ? 'Thai import duty context:' : 'บริบทภาษีนำเข้าไทย:'}</strong>
        <span className="ml-2">
          {isEn
            ? 'Thailand levies 30% import duty on luxury bags and 30% on watches. Buying pre-owned locally avoids this — another reason Thai pre-owned is often better value than buying new from Japan or Europe.'
            : 'ไทยเก็บภาษีนำเข้า 30% บนกระเป๋า luxury และ 30% บนนาฬิกา การซื้อมือสองในประเทศหลีกเลี่ยงภาษีนี้ — อีกเหตุผลที่มือสองไทยมักคุ้มค่ากว่าซื้อใหม่จากญี่ปุ่นหรือยุโรป'}
        </span>
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/guides/pre-owned-vs-new-luxury" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/guides/pre-owned-vs-new-luxury" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/guides/authentication-basics`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Authentication Basics →' : 'พื้นฐานตรวจสอบ →'}</Link>
        <Link href={`/${locale}/guides/bangkok-luxury-shopping-guide`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Bangkok Shopping Guide →' : 'คู่มือช้อปกรุงเทพ →'}</Link>
        <Link href={`/${locale}/trends/luxury-above-retail`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Above-Retail Items →' : 'สินค้าเกิน Retail →'}</Link>
      </div>
    </div>
  )
}
