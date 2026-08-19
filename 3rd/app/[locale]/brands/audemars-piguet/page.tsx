import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'
import { BrandPriceTable } from '@/components/BrandPriceTable'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'brands/audemars-piguet'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Pre-Owned Audemars Piguet in Thailand 2025 | ChicPreowned' : 'ราคา Audemars Piguet มือสองในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Audemars Piguet Royal Oak pre-owned prices in Thailand. 15500ST trades 150–300% of retail. Buy AP watches at fair prices.'
      : 'ราคา Audemars Piguet Royal Oak มือสองในไทย 15500ST ซื้อขายที่ 150–300% ของราคาปลีก',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function APBrandPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'


  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/watches`} className="hover:text-gray-800">{isEn ? 'Watches' : 'นาฬิกา'}</Link>
        <span className="mx-2">/</span>
        <span>Audemars Piguet</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {isEn ? `Pre-Owned Audemars Piguet in Thailand ${PRICE_YEAR}` : `Audemars Piguet มือสองในไทย ${PRICE_YEAR}`}
      </h1>
      <p className="text-gray-500 mb-8">
        {isEn ? 'Royal Oak 15500ST: 2.5–4× retail · Est. 1875 · The original luxury sports watch'
          : 'Royal Oak 15500ST: 2.5–4 เท่าราคาปลีก · ก่อตั้ง 1875 · นาฬิกากีฬา luxury ดั้งเดิม'}
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 text-sm text-amber-900">
        <strong>{isEn ? 'Royal Oak legacy:' : 'มรดก Royal Oak:'}</strong>
        <span className="ml-2">
          {isEn
            ? 'Designed by Gérald Genta in 1972, the Royal Oak was the world\'s first luxury sports watch in stainless steel — now one of the most coveted references on earth. Thai collectors are among the most active AP buyers in Southeast Asia.'
            : 'ออกแบบโดย Gérald Genta ในปี 1972 Royal Oak เป็นนาฬิกากีฬา luxury สแตนเลสเรือนแรกของโลก — ปัจจุบันเป็นหนึ่งใน reference ที่ต้องการมากที่สุดบนโลก นักสะสมไทยเป็นผู้ซื้อ AP ที่กระตือรือร้นมากที่สุดในเอเชียตะวันออกเฉียงใต้'}
        </span>
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isEn ? 'AP Pre-Owned Buying Guide Thailand' : 'ราคา AP มือสองในไทย'}
        </h2>
        <BrandPriceTable brandSlug="audemars-piguet" locale={locale} />
      </section>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/brands/audemars-piguet" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/brands/audemars-piguet" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/compare/rolex-vs-audemars-piguet`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          Rolex vs AP →
        </Link>
        <Link href={`/${locale}/brands/rolex`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          {isEn ? 'Rolex Prices →' : 'ราคา Rolex →'}
        </Link>
      </div>
    </div>
  )
}
