import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'
import { BrandSchema } from '@/components/BrandSchema'
import { BrandPriceTable } from '@/components/BrandPriceTable'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'brands/loewe'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Pre-Owned Loewe Bags in Thailand 2025 | ChicPreowned' : 'กระเป๋า Loewe มือสองในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Loewe Puzzle, Hammock & Gate pre-owned prices in Thailand. Jonathan Anderson era bags save 35-45% vs retail. Buy in Bangkok.'
      : 'ราคากระเป๋า Loewe มือสองในไทย — Puzzle, Hammock, Gate ประหยัด 35-45% เทียบกับราคาใหม่',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function LoeweBrandPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'


  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <BrandSchema brandSlug="loewe" locale={locale} path={`brands/loewe`} />
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/handbags`} className="hover:text-gray-800">{isEn ? 'Handbags' : 'กระเป๋า'}</Link>
        <span className="mx-2">/</span>
        <span>Loewe</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {isEn ? `Pre-Owned Loewe Bags in Thailand ${PRICE_YEAR}` : `กระเป๋า Loewe มือสองในไทย ${PRICE_YEAR}`}
      </h1>
      <p className="text-gray-500 mb-8">
        {isEn ? 'Puzzle · Hammock · Gate · Basket · Save 25–50% vs new Thai retail prices'
          : 'Puzzle · Hammock · Gate · Basket · ประหยัด 25–50% เทียบกับราคาใหม่ในไทย'}
      </p>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8 text-sm text-emerald-900">
        <strong>{isEn ? 'Jonathan Anderson era (2013–2024):' : 'ยุค Jonathan Anderson (2013–2024):'}</strong>
        <span className="ml-2">
          {isEn
            ? "JW Anderson transformed Loewe from a niche Spanish leather house into one of fashion's most sought-after brands. The Puzzle bag (2015) and Hammock (2016) are his most iconic designs — both retain value exceptionally well pre-owned. Thai collectors particularly prize the Puzzle for its architectural quality and craft storytelling."
            : 'JW Anderson เปลี่ยน Loewe จากบ้านหนังสเปนเฉพาะกลุ่มเป็นหนึ่งในแบรนด์แฟชั่นที่ต้องการมากที่สุด กระเป๋า Puzzle (2015) และ Hammock (2016) เป็นการออกแบบที่เป็นสัญลักษณ์มากที่สุดของเขา — ทั้งคู่รักษามูลค่าได้ดีมากในตลาดมือสอง นักสะสมชาวไทยชื่นชอบ Puzzle เป็นพิเศษสำหรับคุณภาพเชิงสถาปัตยกรรมและงานฝีมือ'}
        </span>
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isEn ? 'Loewe Pre-Owned Buying Guide Thailand' : 'ราคา Loewe มือสองในไทย'}
        </h2>
        <BrandPriceTable brandSlug="loewe" locale={locale} />
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isEn ? 'Buying Tips for Thailand' : 'เคล็ดลับการซื้อในไทย'}
        </h2>
        <ul className="text-sm text-gray-600 space-y-2">
          {isEn ? <>
            <li><strong>Puzzle corners:</strong> Check all 8 corners — the geometric cuts are prone to edge wear. Avoid pieces with broken stitching at the triangular panels.</li>
            <li><strong>Hammock hardware:</strong> The top chain and clips tarnish on older pieces. Hardware condition strongly affects resale value.</li>
            <li><strong>Thailand humidity:</strong> Loewe calfskin handles Thai humidity well — better than Chanel lambskin. Still store with silica gel in rainy season.</li>
            <li><strong>Authentication stamp:</strong> "LOEWE" debossed inside, made in Spain. Avoid pieces that say "Made in" without a country.</li>
          </> : <>
            <li><strong>มุม Puzzle:</strong> ตรวจทุก 8 มุม — การตัดเรขาคณิตมีแนวโน้มสึกหรอที่ขอบ หลีกเลี่ยงชิ้นที่มีเย็บขาดที่แผงสามเหลี่ยม</li>
            <li><strong>อุปกรณ์ Hammock:</strong> โซ่บนและคลิปซีดจางบนชิ้นเก่า สภาพอุปกรณ์ส่งผลอย่างมากต่อมูลค่าขายต่อ</li>
            <li><strong>ความชื้นในไทย:</strong> หนังลูกวัว Loewe รับมือกับความชื้นในไทยได้ดี — ดีกว่าหนัง lambskin ของ Chanel ยังคงเก็บด้วยซิลิกาเจลในฤดูฝน</li>
            <li><strong>ตราประทับความแท้:</strong> "LOEWE" ประทับอยู่ด้านใน ผลิตในสเปน หลีกเลี่ยงชิ้นที่เขียน "Made in" โดยไม่มีชื่อประเทศ</li>
          </>}
        </ul>
      </section>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/brands/loewe" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/brands/loewe" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/brands/fendi`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          {isEn ? 'Fendi Prices →' : 'ราคา Fendi →'}
        </Link>
        <Link href={`/${locale}/handbags`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          {isEn ? 'All Handbags →' : 'กระเป๋าทั้งหมด →'}
        </Link>
      </div>
    </div>
  )
}
