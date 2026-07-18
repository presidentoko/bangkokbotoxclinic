import type { Metadata } from 'next'
import { getItemsUnderBudget } from '@/lib/data'
import { SortableItemGrid } from '@/components/SortableItemGrid'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const BUDGET = 60000
const SLUG = 'under-60000'
const USD_APPROX = '~$2,000'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Pre-Owned Luxury Under ฿60,000 (${USD_APPROX}) | ChicPreowned`
      : `สินค้า Luxury มือสอง ราคาไม่เกิน ฿60,000 | ChicPreowned`,
    description: isEn
      ? 'Browse pre-owned luxury handbags and accessories under ฿60,000 in Thailand — LV, Gucci, and more. Authenticated listings updated weekly.'
      : 'ของ Luxury มือสองราคาไม่เกิน ฿60,000 ในไทย — LV, Gucci และอีกมากมาย ผ่านการตรวจสอบ อัปเดตทุกสัปดาห์',
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
      q: 'What luxury bags can I find under ฿60,000 (~$2,000)?',
      a: 'At ฿60,000 you can find LV Speedy and Neverfull (used), Gucci Marmont, and various Prada and Burberry pieces in very good condition on Vestiaire Collective.',
    },
    {
      q: 'Is ฿60,000 enough for a quality pre-owned handbag?',
      a: 'Absolutely. This budget covers most entry-to-mid-range luxury handbags — Louis Vuitton Monogram, Gucci GG Supreme, and many more in very good condition.',
    },
    {
      q: 'What should I check when buying a pre-owned bag under ฿60,000?',
      a: 'Always verify authentication, check hardware condition, examine the lining and stitching, and confirm the item comes from a reputable seller with buyer protection.',
    },
  ],
  th: [
    {
      q: 'กระเป๋า Luxury อะไรที่หาได้ในงบ ฿60,000 (~$2,000)?',
      a: 'งบ ฿60,000 เปิดโอกาสให้หา LV Speedy, Neverfull มือสอง, Gucci Marmont รวมถึงกระเป๋า Prada และ Burberry ในสภาพดีมาก',
    },
    {
      q: 'งบ ฿60,000 เพียงพอสำหรับกระเป๋า Luxury คุณภาพดีไหม?',
      a: 'เพียงพออย่างแน่นอน — ครอบคลุมกระเป๋า Luxury ระดับกลางถึงต้น เช่น Louis Vuitton Monogram, Gucci GG Supreme ในสภาพดีมาก',
    },
    {
      q: 'ควรตรวจสอบอะไรบ้างเมื่อซื้อกระเป๋ามือสองในงบ ฿60,000?',
      a: 'ตรวจสอบการรับรองความแท้ สภาพอุปกรณ์โลหะ บุด้านใน และการเย็บ ควรซื้อจากผู้ขายที่น่าเชื่อถือและมีระบบคุ้มครองผู้ซื้อ',
    },
  ],
}

export default async function Under60000Page({ params }: Props) {
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
