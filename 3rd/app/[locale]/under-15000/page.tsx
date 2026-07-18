import type { Metadata } from 'next'
import { getItemsUnderBudget } from '@/lib/data'
import { SortableItemGrid } from '@/components/SortableItemGrid'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const BUDGET = 15000
const SLUG = 'under-15000'
const USD_APPROX = '~$500'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Pre-Owned Luxury Under ฿15,000 (${USD_APPROX}) | ChicPreowned`
      : `สินค้า Luxury มือสอง ราคาไม่เกิน ฿15,000 | ChicPreowned`,
    description: isEn
      ? 'Discover authenticated pre-owned luxury accessories under ฿15,000 in Thailand — scarves, card holders, belts and more. Updated weekly.'
      : 'ของ Luxury มือสองราคาไม่เกิน ฿15,000 ในไทย — ผ้าพันคอ กระเป๋าใบเล็ก เข็มขัดดีไซเนอร์ อัปเดตทุกสัปดาห์',
    alternates: {
      canonical: `${BASE}/${locale}/${SLUG}`,
      languages: {
        en: `${BASE}/en/${SLUG}`,
        th: `${BASE}/th/${SLUG}`,
        'x-default': `${BASE}/en/${SLUG}`,
      },
    },
  }
}

const faqs = {
  en: [
    {
      q: 'What luxury items can I find under ฿15,000?',
      a: 'Hermès scarves, LV card holders, and designer belts regularly appear under ฿15,000 on Vestiaire.',
    },
    {
      q: 'Is ฿15,000 enough for a luxury item?',
      a: 'Yes — accessories like scarves and small leather goods from top brands are accessible at this price point.',
    },
    {
      q: 'Are pre-owned luxury items authenticated?',
      a: 'On Vestiaire Collective, all items pass authentication review before sale.',
    },
  ],
  th: [
    {
      q: 'ของ Luxury อะไรที่หาได้ในงบ ฿15,000?',
      a: 'ผ้าพันคอ Hermès ที่ใช้แล้ว กระเป๋าสตางค์ใบเล็ก LV และเข็มขัดดีไซเนอร์มักอยู่ในช่วงนี้',
    },
    {
      q: 'งบ ฿15,000 เพียงพอสำหรับ Luxury มือสองไหม?',
      a: 'เพียงพอสำหรับเครื่องประดับและของชิ้นเล็ก เช่น ผ้าพันคอและกระเป๋าใบเล็กจากแบรนด์ชั้นนำ',
    },
    {
      q: 'สินค้า Luxury มือสองผ่านการตรวจสอบหรือเปล่า?',
      a: 'บน Vestiaire Collective ทุกชิ้นผ่านการตรวจสอบความแท้ก่อนขาย',
    },
  ],
}

export default async function Under15000Page({ params }: Props) {
  const { locale } = await params
  const isEn = locale === 'en'
  const items = getItemsUnderBudget(BUDGET)
  const faqList = isEn ? faqs.en : faqs.th

  return (
    <>
      <h1
        className="font-serif text-4xl text-[#1A1A1A] mb-3"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        {isEn
          ? `Pre-Owned Luxury Under ฿${BUDGET.toLocaleString()} (${USD_APPROX})`
          : `สินค้า Luxury มือสอง ราคาไม่เกิน ฿${BUDGET.toLocaleString()}`}
      </h1>
      <p className="text-sm text-[#9C8B7A] mb-10">
        {isEn
          ? `${items.length} item${items.length !== 1 ? 's' : ''} available`
          : `พบ ${items.length} รายการ`}
      </p>

      {items.length > 0 ? (
        <SortableItemGrid items={items} locale={locale} />
      ) : (
        <p className="text-[#8C7355] py-8">
          {isEn
            ? 'No items currently listed under this price. Check back weekly as prices update.'
            : 'ขณะนี้ไม่มีรายการในช่วงราคานี้ กลับมาตรวจสอบอีกครั้งทุกสัปดาห์'}
        </p>
      )}

      <section className="mt-16 border-t border-[#E8E2D9] pt-10">
        <h2
          className="font-serif text-2xl text-[#1A1A1A] mb-6"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {isEn ? 'Frequently Asked Questions' : 'คำถามที่พบบ่อย'}
        </h2>
        <div className="space-y-6">
          {faqList.map((faq, i) => (
            <div key={i} className="border-b border-[#E8E2D9] pb-6">
              <h3 className="text-[#1A1A1A] font-medium mb-2">{faq.q}</h3>
              <p className="text-[#6B6052] text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
