import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPriceTHB } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/dior-vs-celine'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Dior vs Céline Pre-Owned Thailand ${PRICE_YEAR} | ChicPreowned`
      : `Dior vs Céline มือสองในไทย ${PRICE_YEAR} | ChicPreowned`,
    description: isEn
      ? 'Dior vs Céline for Thai buyers — Lady Dior vs Luggage price comparison in THB, value retention, Philo era explained.'
      : 'Dior vs Céline สำหรับคนไทย — เปรียบ Lady Dior กับ Luggage ราคาบาท รักษามูลค่า อธิบายยุค Philo',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function DiorVsCelineTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const diorItems = getItemsByBrand('dior').filter(i => i.price_ranges?.very_good).slice(0, 2)
  const celineItems = getItemsByBrand('celine').filter(i => i.price_ranges?.very_good).slice(0, 2)

  const rows = isEn ? [
    { aspect: 'Iconic bag', dior: 'Lady Dior, Book Tote, Saddle', celine: 'Luggage Tote, 16, Triomphe chain' },
    { aspect: 'Aesthetic', dior: 'Romantic, embellished, logo options', celine: 'Minimalist (Philo) or sleek rock (Slimane)' },
    { aspect: 'Pre-owned entry (THB)', dior: '฿22,500 (accessories)', celine: '฿17,500 (small leather goods)' },
    { aspect: 'Bags pre-owned (THB)', dior: '฿45,000–400,000+', celine: '฿30,000–125,000' },
    { aspect: 'Value retention', dior: '55–75% (Lady Dior)', celine: '45–65% (Luggage); Philo +15–25%' },
    { aspect: 'Best buy', dior: 'Lady Dior Medium (black lambskin)', celine: 'Philo-era Luggage or Belt bag' },
  ] : [
    { aspect: 'กระเป๋าไอคอน', dior: 'Lady Dior, Book Tote, Saddle', celine: 'Luggage Tote, 16, Triomphe chain' },
    { aspect: 'สไตล์', dior: 'โรแมนติก ประดับตกแต่ง ตัวเลือกโลโก้', celine: 'มินิมัล (Philo) หรือ rock เรียบ (Slimane)' },
    { aspect: 'ราคาเริ่มต้นมือสอง (บาท)', dior: '22,500 บาท (อุปกรณ์เสริม)', celine: '17,500 บาท (small leather goods)' },
    { aspect: 'กระเป๋ามือสอง (บาท)', dior: '45,000–400,000+ บาท', celine: '30,000–125,000 บาท' },
    { aspect: 'รักษามูลค่า', dior: '55–75% (Lady Dior)', celine: '45–65% (Luggage); ยุค Philo +15–25%' },
    { aspect: 'ซื้อดีที่สุด', dior: 'Lady Dior Medium (หนังแกะดำ)', celine: 'Luggage หรือ Belt ยุค Philo' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/compare`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบ'}</Link>
        <span className="mx-2">/</span>
        <span>Dior vs Céline</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Dior vs Céline Pre-Owned in Thailand' : 'Dior vs Céline มือสองในไทย'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Two Parisian giants, very different vibes. Dior is embellished and romantic; Céline (Philo era) built a cult of minimalism. Both have strong pre-owned markets in Thailand.'
          : 'สองยักษ์ปารีส สไตล์ต่างกันมาก Dior โรแมนติกและประดับตกแต่ง Céline (ยุค Philo) สร้างลัทธินิยมมินิมัล ทั้งคู่มีตลาดมือสองแข็งแกร่งในไทย'}
      </p>

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Aspect' : 'หัวข้อ'}</th>
              <th className="text-left py-3 px-4 font-semibold">Dior</th>
              <th className="text-left py-3 px-4 font-semibold">Céline</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-700">{row.aspect}</td>
                <td className="py-3 px-4 text-gray-600">{row.dior}</td>
                <td className="py-3 px-4 text-gray-600">{row.celine}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(diorItems.length > 0 || celineItems.length > 0) && (
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {diorItems.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Dior {isEn ? 'Pre-Owned' : 'มือสอง'}</h3>
              {diorItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                  <Link href={`/${locale}/${item.slug}`} className="text-gray-700 hover:text-blue-600">{item.model}</Link>
                  <span className="text-gray-500">{formatPriceTHB(item.price_ranges.very_good!.min)}+</span>
                </div>
              ))}
            </div>
          )}
          {celineItems.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Céline {isEn ? 'Pre-Owned' : 'มือสอง'}</h3>
              {celineItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                  <Link href={`/${locale}/${item.slug}`} className="text-gray-700 hover:text-blue-600">{item.model}</Link>
                  <span className="text-gray-500">{formatPriceTHB(item.price_ranges.very_good!.min)}+</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/compare/dior-vs-celine" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/dior-vs-celine" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/dior`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Dior →</Link>
        <Link href={`/${locale}/brands/celine`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Céline →</Link>
        <Link href={`/${locale}/compare/dior-vs-chanel`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Dior vs Chanel →</Link>
      </div>
    </div>
  )
}
