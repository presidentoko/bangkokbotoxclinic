import Link from 'next/link'
import { getItemBySlug, formatPriceTHB } from '@/lib/data'
import { getThaiEntry, getThaiMeta } from '@/lib/thai-market'

/**
 * Live Thai dealer prices, droppable into any editorial page.
 *
 * The guides are the site's thinnest surface — the Thai edition of the Chanel
 * price-history guide ran to 146 words — and they are thin in the way that is
 * hardest to fix by writing more: they assert things (a retail hike table
 * typed in by hand, "pre-owned is the smarter buy") without ever showing a
 * current number. A paragraph of prose added to that is still prose.
 *
 * This puts the actual market underneath the argument, cites the shops it
 * came from, and updates itself every week — so the guide gets more
 * substantial on its own instead of ageing into a stale claim.
 *
 * Renders nothing when none of the named items have Thai data.
 */
export function ThaiPriceCallout({
  slugs,
  locale,
  title,
}: {
  /** Item slugs, e.g. 'chanel/classic-flap-medium'. Missing ones are skipped. */
  slugs: string[]
  locale: string
  title?: string
}) {
  const th = locale === 'th'
  const { generated } = getThaiMeta()

  const rows = slugs
    .map(slug => {
      const item = getItemBySlug(...(slug.split('/') as [string, string]))
      const entry = getThaiEntry(slug)
      const summary = entry?.variant ?? entry?.family
      if (!item || !entry || !summary) return null
      return { item, entry, summary, exact: !!entry.variant }
    })
    .filter((r): r is NonNullable<typeof r> => !!r)

  if (!rows.length) return null

  return (
    <section className="my-8 border border-[#B8954A]/40 bg-[#FDFBF7]">
      <div className="px-5 py-4 border-b border-[#E8E2D9]">
        <h2 className="font-serif text-lg text-[#1A1A1A]" style={{ fontFamily: 'var(--font-playfair)' }}>
          {title ?? (th ? 'ราคาจริงที่ร้านไทยตั้งขายตอนนี้' : 'What Thai shops are asking right now')}
        </h2>
        <p className="text-xs text-[#6B6052] mt-1">
          {th ? `อัปเดต ${generated}` : `Updated ${generated}`}
        </p>
      </div>

      <table className="w-full text-sm">
        <tbody>
          {rows.map(({ item, summary, exact }) => (
            <tr key={item.id} className="border-b border-[#F0EBE3] last:border-0">
              <td className="px-5 py-3">
                <Link href={`/${locale}/${item.slug}`} className="hover:text-[#8C7355]">
                  {item.brand} {item.model}
                </Link>
                {!exact && (
                  <span className="text-xs text-[#9C8B7A]"> · {th ? 'ทุกขนาด' : 'all sizes'}</span>
                )}
              </td>
              <td className="px-5 py-3 text-right whitespace-nowrap font-medium text-[#1A1A1A]">
                {formatPriceTHB(summary.median)}
              </td>
              <td className="px-5 py-3 text-right whitespace-nowrap text-xs text-[#9C8B7A] hidden sm:table-cell">
                {formatPriceTHB(summary.min)}–{formatPriceTHB(summary.max)}
                {' · '}
                {th ? `${summary.n} ประกาศ` : `${summary.n} listings`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="px-5 py-3 text-xs text-[#9C8B7A] border-t border-[#E8E2D9] leading-relaxed">
        {th ? 'ราคาตั้งขายจากร้านมือสองในไทยที่เราอ่านทุกสัปดาห์ · ' : 'Asking prices read weekly from Thai dealers · '}
        <Link href={`/${locale}/dealers`} className="underline hover:text-[#6B6052]">
          {th ? 'ดูแหล่งข้อมูลและวิธีคำนวณ' : 'sources and method'}
        </Link>
      </p>
    </section>
  )
}
