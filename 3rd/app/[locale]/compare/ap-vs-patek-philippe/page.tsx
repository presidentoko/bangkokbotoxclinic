import type { Metadata } from 'next'
import Link from 'next/link'
import { getItemsByBrand, formatPriceTHB } from '@/lib/data'
import { PRICE_YEAR } from '@/lib/site'
import { ThaiPriceCallout } from '@/components/ThaiPriceCallout'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'compare/ap-vs-patek-philippe'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Audemars Piguet vs Patek Philippe: Royal Oak vs Nautilus ${PRICE_YEAR} | ChicPreowned`
      : `Audemars Piguet vs Patek Philippe: Royal Oak vs Nautilus ในไทย ${PRICE_YEAR} | ChicPreowned`,
    description: isEn
      ? 'AP vs Patek Philippe pre-owned comparison for Thai buyers — Royal Oak vs Nautilus price history, THB values, both above retail.'
      : 'เปรียบ AP กับ Patek Philippe มือสองสำหรับคนไทย — ราคา Royal Oak vs Nautilus ในบาท ทั้งคู่ขายเกิน retail',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function APvsPatekTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const apItems = getItemsByBrand('audemars piguet').filter(i => i.price_ranges?.very_good).slice(0, 2)
  const patekItems = getItemsByBrand('patek philippe').filter(i => i.price_ranges?.very_good).slice(0, 2)

  const rows = isEn ? [
    { aspect: 'Iconic model', ap: 'Royal Oak (1972 — Gerald Genta)', patek: 'Nautilus (1976 — Gerald Genta)' },
    { aspect: 'Pre-owned entry (THB)', ap: '฿410,000 (Code 11:59)', patek: '฿292,000 (Calatrava 5196)' },
    { aspect: 'Royal Oak 15500ST', ap: '฿720,000–980,000', patek: 'n/a' },
    { aspect: 'Nautilus 5711 (disc.)', ap: 'n/a', patek: '฿2,500,000–4,600,000' },
    { aspect: 'Value vs retail', ap: '80–120% of retail', patek: '150–300%+ (5711)' },
    { aspect: 'Thai AD availability', ap: 'AP House Gaysorn — requires spend history', patek: '5711 discontinued 2021; Calatrava available' },
  ] : [
    { aspect: 'รุ่นไอคอน', ap: 'Royal Oak (1972 — Gerald Genta)', patek: 'Nautilus (1976 — Gerald Genta)' },
    { aspect: 'ราคาเริ่มต้นมือสอง (บาท)', ap: '410,000 บาท (Code 11:59)', patek: '292,000 บาท (Calatrava 5196)' },
    { aspect: 'Royal Oak 15500ST', ap: '720,000–980,000 บาท', patek: 'n/a' },
    { aspect: 'Nautilus 5711 (หยุดผลิต)', ap: 'n/a', patek: '2,500,000–4,600,000 บาท' },
    { aspect: 'มูลค่าเทียบ retail', ap: '80–120% ของ retail', patek: '150–300%+ (5711)' },
    { aspect: 'AD ในไทย', ap: 'AP House Gaysorn — ต้องมีประวัติซื้อ', patek: '5711 หยุดผลิต 2021; Calatrava หาได้' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/compare`} className="hover:text-gray-800">{isEn ? 'Compare' : 'เปรียบ'}</Link>
        <span className="mx-2">/</span>
        <span>AP vs Patek Philippe</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Audemars Piguet vs Patek Philippe Pre-Owned' : 'Audemars Piguet vs Patek Philippe มือสอง'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'Both above retail. Both designed by Gerald Genta. The Royal Oak and Nautilus share DNA — here\'s how they differ in the Thai market.'
          : 'ทั้งคู่ขายเกิน retail ทั้งคู่ออกแบบโดย Gerald Genta Royal Oak และ Nautilus มีต้นกำเนิดเดียวกัน — นี่คือสิ่งที่แตกต่างในตลาดไทย'}
      </p>

      <ThaiPriceCallout
        slugs={['audemars-piguet/royal-oak-15500', 'patek-philippe/nautilus-5711']}
        locale={locale}
      />

      <div className="overflow-x-auto mb-10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold">{isEn ? 'Aspect' : 'หัวข้อ'}</th>
              <th className="text-left py-3 px-4 font-semibold">Audemars Piguet</th>
              <th className="text-left py-3 px-4 font-semibold">Patek Philippe</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-700">{row.aspect}</td>
                <td className="py-3 px-4 text-gray-600">{row.ap}</td>
                <td className="py-3 px-4 text-gray-600">{row.patek}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900 mb-8">
        <strong>{isEn ? 'The Genta factor:' : 'ปัจจัย Genta:'}</strong>
        <span className="ml-2">
          {isEn
            ? 'Both Royal Oak and Nautilus were designed by Gerald Genta — the same man, the same era. That shared design heritage is unique in watchmaking history. It also means both pieces tend to track each other in collectability over the long term.'
            : 'ทั้ง Royal Oak และ Nautilus ออกแบบโดย Gerald Genta — คนเดียวกัน ยุคเดียวกัน มรดกการออกแบบร่วมกันนี้ไม่มีใครเหมือนในประวัติศาสตร์การทำนาฬิกา นั่นหมายความว่าทั้งคู่มักติดตามกันในด้านความสะสมในระยะยาว'}
        </span>
      </div>

      {(apItems.length > 0 || patekItems.length > 0) && (
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {apItems.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">AP {isEn ? 'Pre-Owned' : 'มือสอง'}</h3>
              {apItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-gray-100">
                  <Link href={`/${locale}/${item.slug}`} className="text-gray-700 hover:text-blue-600">{item.model}</Link>
                  <span className="text-gray-500">{formatPriceTHB(item.price_ranges.very_good!.min)}+</span>
                </div>
              ))}
            </div>
          )}
          {patekItems.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Patek {isEn ? 'Pre-Owned' : 'มือสอง'}</h3>
              {patekItems.map(item => (
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
          ? <Link href="/th/compare/ap-vs-patek-philippe" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/compare/ap-vs-patek-philippe" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/audemars-piguet`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">AP {isEn ? 'Guide' : 'คู่มือ'} →</Link>
        <Link href={`/${locale}/brands/patek-philippe`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Patek {isEn ? 'Guide' : 'คู่มือ'} →</Link>
        <Link href={`/${locale}/compare/rolex-vs-audemars-piguet`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Rolex vs AP →</Link>
      </div>
    </div>
  )
}
