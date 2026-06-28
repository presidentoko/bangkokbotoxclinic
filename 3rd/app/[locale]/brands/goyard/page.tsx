import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'brands/goyard'

function formatPriceTHB(usd: number): string {
  const thb = Math.round(usd * 36 / 500) * 500
  return `฿${thb.toLocaleString()}`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? 'Goyard Pre-Owned Thailand: Saint-Louis, Anjou Price Guide | ChicPreowned'
      : 'Goyard มือสองในไทย: ราคา Saint-Louis, Anjou | ChicPreowned',
    description: isEn
      ? 'Buy pre-owned Goyard in Thailand — Saint-Louis Tote, Anjou reversible, Artois. THB prices, value retention guide, where to buy.'
      : 'ซื้อ Goyard มือสองในไทย — Saint-Louis Tote, Anjou reversible, Artois ราคาบาท คู่มือมูลค่าคืน แหล่งซื้อ',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}` } },
  }
}

export default async function GoyardTH({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'

  const pieces = [
    { name: 'Saint-Louis PM', usdMin: 1200, usdMax: 1800, note: isEn ? 'Most accessible Goyard. Canvas/leather combo with strap.' : 'Goyard ที่เข้าถึงได้มากที่สุด ผสมผ้าและหนังพร้อมสาย' },
    { name: 'Saint-Louis GM', usdMin: 1500, usdMax: 2200, note: isEn ? 'Larger version — same strong value retention.' : 'ขนาดใหญ่กว่า — มูลค่าคงตัวแข็งแกร่งเท่ากัน' },
    { name: 'Anjou PM (reversible)', usdMin: 1600, usdMax: 2400, note: isEn ? 'Two-color reversible tote, slightly more structured.' : 'โทตสองสีพลิกได้ โครงสร้างแน่นขึ้นเล็กน้อย' },
    { name: 'Artois PM', usdMin: 1800, usdMax: 2800, note: isEn ? 'Top-handle structured tote. Very limited.' : 'โทตมีที่จับแข็งทรง หายากมาก' },
    { name: 'Cap Vert PM', usdMin: 2200, usdMax: 3500, note: isEn ? 'Doctor bag shape. Collector piece.' : 'ทรงกระเป๋าแพทย์ ชิ้นสำหรับนักสะสม' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/brands`} className="hover:text-gray-800">{isEn ? 'Brands' : 'แบรนด์'}</Link>
        <span className="mx-2">/</span>
        <span>Goyard</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">Goyard {isEn ? 'Pre-Owned' : 'มือสอง'}</h1>
      <p className="text-gray-600 text-sm mb-3">
        {isEn
          ? 'Founded 1853, Paris. No online store, no social media — by design. Goyard scarcity is intentional. Pre-owned Goyard often sells at or above retail.'
          : 'ก่อตั้ง 1853 ปารีส ไม่มีร้านออนไลน์ ไม่มีโซเชียลมีเดีย — โดยตั้งใจ ความหายากของ Goyard เป็นเจตนา Goyard มือสองมักขายที่หรือสูงกว่าราคาร้าน'}
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-900 mb-8">
        <strong>{isEn ? 'Why Goyard holds value:' : 'ทำไม Goyard คงมูลค่า:'}</strong>{' '}
        {isEn
          ? 'No e-commerce, minimal global boutiques, zero influencer marketing. Demand consistently exceeds supply.'
          : 'ไม่มี e-commerce บูติกทั่วโลกน้อยมาก ไม่มีการตลาดผ่านอินฟลูเอนเซอร์ ความต้องการสูงกว่าอุปทานเสมอ'}
      </div>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {isEn ? 'Pre-Owned Prices' : 'ราคามือสอง'} (THB / USD)
        </h2>
        <div className="space-y-3">
          {pieces.map((p, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-gray-900">{p.name}</span>
                <div className="text-right">
                  <div className="text-sm font-semibold text-amber-700">{formatPriceTHB(p.usdMin)}–{formatPriceTHB(p.usdMax)}</div>
                  <div className="text-xs text-gray-400">${p.usdMin.toLocaleString()}–${p.usdMax.toLocaleString()}</div>
                </div>
              </div>
              <p className="text-sm text-gray-500">{p.note}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/brands/goyard" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/brands/goyard" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/louis-vuitton`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'LV Pre-Owned →' : 'LV มือสอง →'}</Link>
        <Link href={`/${locale}/guides/authentication-basics`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">{isEn ? 'Authentication Guide →' : 'คู่มือตรวจสอบ →'}</Link>
      </div>
    </div>
  )
}
