import Link from 'next/link'
import { Item } from '@/lib/data'
import { getThaiEntry, sourceLabel } from '@/lib/thai-market'

/**
 * The page's main call to action.
 *
 * It used to send everyone to `carousell.co.th`. That domain does not
 * resolve — NXDOMAIN, not a redirect — so the primary button on all 190
 * model pages, in both languages, went nowhere, and the copy around it named
 * "Carousell Thailand" and "C2C.in.th" as where the prices came from. Neither
 * domain exists and neither was ever the source.
 *
 * Now it points at something real: the cheapest live listing we actually
 * read, at a dealer we name. Where there is no Thai listing for this item it
 * goes to the dealer directory rather than inventing a destination.
 */
export function AffiliateCTA({
  item,
  ctaLabel,
  locale,
}: {
  item: Item
  ctaLabel: string
  locale: string
}) {
  const entry = getThaiEntry(item.slug)
  const cheapest = entry?.listings.find(l => l.in_stock) ?? entry?.listings[0]

  const className =
    'block w-full bg-[#1A1A1A] text-white text-center py-3 px-6 text-sm tracking-wide hover:bg-[#8C7355] transition-colors'

  if (!cheapest) {
    return (
      <div className="my-8">
        <Link href={`/${locale}/dealers`} className={className}>
          {locale === 'th' ? 'ดูร้านที่เราติดตามราคา →' : 'See the dealers we track →'}
        </Link>
      </div>
    )
  }

  return (
    <div className="my-8">
      <a
        href={cheapest.url}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className={className}
      >
        {ctaLabel}
      </a>
      <p className="mt-2 text-xs text-[#9C8B7A] text-center">
        {locale === 'th'
          ? `ประกาศถูกที่สุดที่เราพบ · ${sourceLabel(cheapest.source)} · เราไม่ได้รับค่าคอมมิชชัน`
          : `Lowest listing we found · ${sourceLabel(cheapest.source)} · we earn no commission`}
      </p>
    </div>
  )
}
