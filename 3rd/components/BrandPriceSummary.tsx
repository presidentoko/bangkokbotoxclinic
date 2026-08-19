import Link from 'next/link'
import { formatPriceTHB } from '@/lib/data'
import { getBrandStats } from '@/lib/brand-stats'

/**
 * Answers "what does this brand actually cost in Thailand" above the grid.
 *
 * The brand pages already rank for that query and answered it with model cards
 * alone — a price with no sense of whether it is a good one. Everything here is
 * derived from the tracked listings, so it stays true to the model pages and
 * updates itself on each scrape. Nothing is asserted that the data does not
 * support: sections disappear when the numbers behind them do not exist.
 */
export function BrandPriceSummary({
  brandSlug,
  locale,
}: {
  brandSlug: string
  locale: string
}) {
  const s = getBrandStats(brandSlug)
  if (!s || !s.tracked) return null
  const th = locale === 'th'

  const cards: { label: string; value: string; note?: string }[] = []

  if (s.cheapest && s.dearest && s.cheapest.item.id !== s.dearest.item.id) {
    cards.push({
      label: th ? 'ช่วงราคามือสอง' : 'Pre-owned range',
      value: `${formatPriceTHB(s.cheapest.price)} – ${formatPriceTHB(s.dearest.price)}`,
      note: th
        ? `จาก ${s.cheapest.item.model} ถึง ${s.dearest.item.model}`
        : `${s.cheapest.item.model} to ${s.dearest.item.model}`,
    })
  }
  if (s.medianDiscountPct !== null) {
    cards.push({
      label: th ? 'ส่วนลดเทียบราคาใหม่' : 'Typical saving vs new',
      value: `${s.medianDiscountPct}%`,
      note: th
        ? `ค่ากลางจาก ${s.belowRetail.length} รุ่นที่ถูกกว่าราคาใหม่`
        : s.belowRetail.length === 1
          ? 'the one model priced under retail'
          : `median across ${s.belowRetail.length} models priced under retail`,
    })
  }
  if (s.aboveRetail.length) {
    cards.push({
      label: th ? 'ซื้อขายเหนือราคาใหม่' : 'Trading above retail',
      value: `${s.aboveRetail.length} / ${s.tracked}`,
      note: th
        ? `สูงสุด ${s.aboveRetail[0].item.model} +${s.aboveRetail[0].premiumPct}%`
        : `highest ${s.aboveRetail[0].item.model} +${s.aboveRetail[0].premiumPct}%`,
    })
  }
  if (!cards.length) return null

  return (
    <section className="mb-10">
      <h2 className="font-serif text-2xl text-[#1A1A1A] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
        {th
          ? `ราคา ${s.brandName} มือสองในไทยเป็นอย่างไร`
          : `What ${s.brandName} actually costs pre-owned in Thailand`}
      </h2>

      <div className="grid gap-3 sm:grid-cols-3 mb-4">
        {cards.map(c => (
          <div key={c.label} className="border border-[#E8E2D9] bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-[#9C8B7A] mb-1">{c.label}</p>
            <p className="text-xl font-medium text-[#1A1A1A]">{c.value}</p>
            {c.note && <p className="text-xs text-[#9C8B7A] mt-1">{c.note}</p>}
          </div>
        ))}
      </div>

      {s.aboveRetail.length > 0 && (
        <div className="p-4 bg-[#FDF6E9] border-l-2 border-[#B8954A] text-sm text-[#4A3F35] mb-3">
          {th
            ? `${s.aboveRetail.length} รุ่นซื้อขายสูงกว่าราคาใหม่ — สำหรับรุ่นเหล่านี้ ตลาดมือสองไม่ได้ถูกกว่า แต่เป็นทางเดียวที่ซื้อได้จริงโดยไม่ต้องรอคิว: `
            : `${s.aboveRetail.length} model${s.aboveRetail.length > 1 ? 's' : ''} sell for more than they cost new. For these the second-hand market is not the cheaper option, it is the available one: `}
          {s.aboveRetail.slice(0, 3).map((a, i) => (
            <span key={a.item.id}>
              {i > 0 && ', '}
              <Link href={`/${locale}/${a.item.slug}`} className="underline hover:text-[#B8954A]">
                {a.item.model}
              </Link>{' '}
              +{a.premiumPct}%
            </span>
          ))}
          .
        </div>
      )}

      {s.belowRetail.length > 0 && (
        <div className="p-4 bg-[#F3F7F1] border-l-2 border-[#4A7A35] text-sm text-[#3A4A32]">
          {th ? 'ส่วนลดมากที่สุด: ' : 'Biggest discounts to retail: '}
          {s.belowRetail.slice(0, 3).map((b, i) => (
            <span key={b.item.id}>
              {i > 0 && ', '}
              <Link href={`/${locale}/${b.item.slug}`} className="underline hover:text-[#4A7A35]">
                {b.item.model}
              </Link>{' '}
              −{b.discountPct}%
            </span>
          ))}
          .
        </div>
      )}

      <p className="text-xs text-[#9C8B7A] mt-3">
        {th
          ? `คำนวณจากประกาศขายจริง ${s.sampleCount.toLocaleString()} รายการใน ${s.tracked} รุ่น · อัปเดต ${s.updated}`
          : `Computed from ${s.sampleCount.toLocaleString()} tracked listings across ${s.tracked} models · updated ${s.updated}`}
      </p>
    </section>
  )
}
