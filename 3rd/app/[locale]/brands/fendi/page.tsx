import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'
import { BrandPriceTable } from '@/components/BrandPriceTable'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const SLUG = 'brands/fendi'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn ? 'Pre-Owned Fendi Bags in Thailand 2025 | ChicPreowned' : 'กระเป๋า Fendi มือสองในไทย 2025 | ChicPreowned',
    description: isEn
      ? 'Fendi Baguette, Peekaboo & First pre-owned prices in Thailand. Save 35-50% vs retail. Buy authentic Fendi bags in Bangkok.'
      : 'ราคากระเป๋า Fendi มือสองในไทย — Baguette, Peekaboo, First ประหยัด 35-50% เทียบกับราคาใหม่',
    alternates: { canonical: `${BASE}/${locale}/${SLUG}`, languages: { en: `${BASE}/en/${SLUG}`, th: `${BASE}/th/${SLUG}`, 'x-default': `${BASE}/en/${SLUG}` } },
  }
}

export default async function FendiBrandPage({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'


  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href={`/${locale}`} className="hover:text-gray-800">{isEn ? 'Home' : 'หน้าแรก'}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/handbags`} className="hover:text-gray-800">{isEn ? 'Handbags' : 'กระเป๋า'}</Link>
        <span className="mx-2">/</span>
        <span>Fendi</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {isEn ? `Pre-Owned Fendi Bags in Thailand ${PRICE_YEAR}` : `กระเป๋า Fendi มือสองในไทย ${PRICE_YEAR}`}
      </h1>
      <p className="text-gray-500 mb-8">
        {isEn ? 'Baguette · Peekaboo · First · Save 30–55% vs Thai retail prices'
          : 'Baguette · Peekaboo · First · ประหยัด 30–55% เทียบกับราคาขายในไทย'}
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 text-sm text-blue-900">
        <strong>{isEn ? 'The Baguette story:' : 'เรื่องราวของ Baguette:'}</strong>
        <span className="ml-2">
          {isEn
            ? 'Kim Jones revived the Fendi Baguette in 2023 with fresh leather treatments and updated silhouettes. Pre-owned versions from the original 1997 Silvia Venturini Fendi era are highly collectible — condition matters enormously for vintage pieces.'
            : 'Kim Jones ฟื้น Fendi Baguette ในปี 2023 ด้วยหนังสัมผัสใหม่และเส้นสายที่ทันสมัย Baguette รุ่นดั้งเดิมจากยุค Silvia Venturini Fendi ปี 1997 เป็นที่ต้องการของนักสะสม — สภาพมีผลอย่างมากสำหรับของวินเทจ'}
        </span>
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isEn ? 'Fendi Pre-Owned Buying Guide Thailand' : 'ราคา Fendi มือสองในไทย'}
        </h2>
        <BrandPriceTable brandSlug="fendi" locale={locale} />
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {isEn ? 'Authentication Tips' : 'วิธีตรวจสอบความแท้'}
        </h2>
        <ul className="text-sm text-gray-600 space-y-2">
          {isEn ? <>
            <li><strong>FF logo:</strong> The double-F Zucca monogram should be symmetric — asymmetric stitching is a red flag</li>
            <li><strong>Baguette clasp:</strong> Authentic clasps have a satisfying click; fakes often feel loose or hollow</li>
            <li><strong>Serial number:</strong> Inside pocket — format 8BXXXXX (leather) or BXXXXX (canvas)</li>
            <li><strong>Dust bag:</strong> Genuine Fendi dust bags are dove grey with gold stitching</li>
          </> : <>
            <li><strong>โลโก้ FF:</strong> ลาย Zucca double-F ต้องสมมาตร — การเย็บที่ไม่สม่ำเสมอเป็นสัญญาณน่าสงสัย</li>
            <li><strong>ตัวล็อค Baguette:</strong> ตัวล็อคแท้มีเสียงคลิกชัดเจน ของปลอมมักรู้สึกหลวมหรือกลวง</li>
            <li><strong>หมายเลขซีเรียล:</strong> ในกระเป๋าด้านใน — รูปแบบ 8BXXXXX (หนัง) หรือ BXXXXX (ผ้าใบ)</li>
            <li><strong>ถุงผ้า:</strong> ถุงผ้า Fendi แท้เป็นสีเทาเงินพร้อมด้ายทอง</li>
          </>}
        </ul>
      </section>

      <div className="flex gap-3 flex-wrap">
        {locale === 'en'
          ? <Link href="/th/brands/fendi" className="text-sm text-blue-600 hover:underline">ดูในภาษาไทย →</Link>
          : <Link href="/en/brands/fendi" className="text-sm text-blue-600 hover:underline">View in English →</Link>
        }
        <Link href={`/${locale}/handbags`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          {isEn ? 'All Handbags →' : 'กระเป๋าทั้งหมด →'}
        </Link>
        <Link href={`/${locale}/brands/loewe`} className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">
          {isEn ? 'Loewe Prices →' : 'ราคา Loewe →'}
        </Link>
      </div>
    </div>
  )
}
