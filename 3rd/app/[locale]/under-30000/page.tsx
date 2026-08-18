import type { Metadata } from 'next'
import { getItemsUnderBudget, toGridItems } from '@/lib/data'
import { SortableItemGrid } from '@/components/SortableItemGrid'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://www.chicpreowned.com'
const BUDGET = 30000
const SLUG = 'under-30000'
const USD_APPROX = '~$1,000'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'
  return {
    title: isEn
      ? `Pre-Owned Luxury Under ฿30,000 (${USD_APPROX}) | ChicPreowned`
      : `สินค้า Luxury มือสอง ราคาไม่เกิน ฿30,000 | ChicPreowned`,
    description: isEn
      ? 'Browse authenticated pre-owned luxury items under ฿30,000 in Thailand — entry-level bags, accessories, and designer pieces. Updated weekly.'
      : 'ของ Luxury มือสองราคาไม่เกิน ฿30,000 ในไทย — กระเป๋า เครื่องประดับ และไอเทมดีไซเนอร์ อัปเดตทุกสัปดาห์',
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
      q: 'What can I buy pre-owned luxury for under ฿30,000?',
      a: 'At ฿30,000 you can find LV Speedy bags in good condition, Gucci accessories, and entry-level Chanel pieces on Vestiaire Collective.',
    },
    {
      q: 'Is ฿30,000 (~$1,000) a good budget for a first luxury purchase?',
      a: 'Yes — this budget opens up entry-level Louis Vuitton and Gucci bags in very good condition, as well as nearly all luxury accessories.',
    },
    {
      q: 'How do I verify a pre-owned luxury item under ฿30,000?',
      a: 'Stick to authenticated platforms like Vestiaire Collective. For local purchases, request original receipts, authenticity cards, and inspect item photos closely.',
    },
  ],
  th: [
    {
      q: 'ของ Luxury มือสองอะไรที่ได้ในงบ ฿30,000?',
      a: 'งบ ฿30,000 เปิดโอกาสให้หา LV Speedy สภาพดี อุปกรณ์เสริม Gucci และไอเทมเริ่มต้นของ Chanel บน Vestiaire Collective',
    },
    {
      q: 'งบ ฿30,000 (~$1,000) เหมาะกับการซื้อ Luxury ครั้งแรกไหม?',
      a: 'เหมาะมาก — ได้กระเป๋า Louis Vuitton และ Gucci ระดับเริ่มต้นในสภาพดีมาก รวมถึงเครื่องประดับ Luxury แทบทุกชนิด',
    },
    {
      q: 'ตรวจสอบของ Luxury มือสองราคาไม่เกิน ฿30,000 อย่างไร?',
      a: 'เลือกแพลตฟอร์มที่มีการตรวจสอบความแท้ เช่น Vestiaire Collective หรือขอใบเสร็จ บัตรรับประกัน และตรวจสอบรูปภาพสินค้าอย่างละเอียด',
    },
  ],
}

export default async function Under30000Page({ params }: Props) {
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
        <SortableItemGrid items={toGridItems(items)} locale={locale} />
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
