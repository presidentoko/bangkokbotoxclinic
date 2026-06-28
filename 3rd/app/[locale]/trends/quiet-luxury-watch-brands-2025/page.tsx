import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'trends/quiet-luxury-watch-brands-2025'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Quiet Luxury Watch Brands Thailand 2025 | ChicPreowned'
      : 'นาฬิกา Quiet Luxury ในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Quiet luxury watch brands for Thai buyers — A. Lange, JLC, Vacheron, IWC. Watches that signal taste, not just money. THB prices.'
      : 'แบรนด์นาฬิกา quiet luxury สำหรับคนไทย — A. Lange, JLC, Vacheron, IWC นาฬิกาที่แสดงรสนิยม ไม่ใช่แค่เงิน ราคาบาท',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

export default async function QuietLuxuryWatchTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const brands = isEn ? [
    { name: 'A. Lange & Söhne', thb: '฿320,000–560,000 entry pre-owned', note: 'German master. 5,000 pieces/year. Lange 1\'s off-center dial is unmistakable.' },
    { name: 'Jaeger-LeCoultre (JLC)', thb: '฿100,000–220,000 (Reverso)', note: 'Reverso Art Deco is the quintessential elegant dress watch. Reversible case.' },
    { name: 'Vacheron Constantin', thb: '฿240,000–480,000 (Patrimony)', note: 'Oldest watch brand (1755). Patrimony = zero logo, pure proportion. Old money.' },
    { name: 'IWC Schaffhausen', thb: '฿80,000–180,000 (Portofino)', note: 'Engineering precision, understated design. Portugieser is the key piece.' },
    { name: 'Breguet', thb: '฿140,000–320,000 (Classique)', note: 'Napoleon\'s watchmaker. Guilloché dial is signature. Heritage unmatched.' },
  ] : [
    { name: 'A. Lange & Söhne', thb: '320,000–560,000 บาท เริ่มต้นมือสอง', note: 'ปรมาจารย์เยอรมัน 5,000 ชิ้น/ปี หน้าปัด off-center ของ Lange 1 ไม่มีใครเหมือน' },
    { name: 'Jaeger-LeCoultre (JLC)', thb: '100,000–220,000 บาท (Reverso)', note: 'Reverso Art Deco คือนาฬิกา dress ที่สง่างามที่สุด เคสพลิกได้' },
    { name: 'Vacheron Constantin', thb: '240,000–480,000 บาท (Patrimony)', note: 'แบรนด์นาฬิกาเก่าแก่ที่สุด (1755) Patrimony = ศูนย์โลโก้ สัดส่วนสวยงาม' },
    { name: 'IWC Schaffhausen', thb: '80,000–180,000 บาท (Portofino)', note: 'วิศวกรรมแม่นยำ ออกแบบเรียบง่าย Portugieser คือชิ้นสำคัญ' },
    { name: 'Breguet', thb: '140,000–320,000 บาท (Classique)', note: 'ช่างนาฬิกาของนโปเลียน หน้าปัด guilloché เป็นเอกลักษณ์ มรดกไม่มีใครเทียบ' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/trends`} className="hover:text-gray-800">{isEn ? 'Trends' : 'เทรนด์'}</Link>
        <span className="mx-2">/</span>
        <span>{isEn ? 'Quiet Luxury Watches' : 'นาฬิกา Quiet Luxury'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {isEn ? 'Quiet Luxury Watch Brands 2025' : 'แบรนด์นาฬิกา Quiet Luxury 2025'}
      </h1>
      <p className="text-gray-500 mb-10">
        {isEn
          ? 'The anti-Rolex movement. These brands signal horological taste to those who know — and nothing to those who don\'t. Five quiet luxury watch brands worth buying pre-owned.'
          : 'ขบวนการ anti-Rolex แบรนด์เหล่านี้แสดงรสนิยมด้านนาฬิกาให้คนที่รู้ — และไม่มีความหมายสำหรับคนที่ไม่รู้ ห้าแบรนด์นาฬิกา quiet luxury ที่ควรซื้อมือสอง'}
      </p>

      <div className="space-y-4 mb-10">
        {brands.map((b, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-4">
            <div className="flex justify-between items-start mb-2">
              <h2 className="font-bold text-gray-900">{b.name}</h2>
              <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-1 rounded ml-3 text-right">{b.thb}</span>
            </div>
            <p className="text-sm text-gray-600">{b.note}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/trends/quiet-luxury-watch-brands-2025" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/trends/quiet-luxury-watch-brands-2025" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/compare/ap-vs-patek-philippe`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">AP vs Patek →</Link>
        <Link href={`/${locale}/trends/watch-buying-guide-thailand`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Watch Guide TH →' : 'คู่มือนาฬิกาไทย →'}</Link>
      </div>
    </div>
  )
}
