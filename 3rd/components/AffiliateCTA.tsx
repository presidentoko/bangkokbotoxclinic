import { Item } from '@/lib/data'

export function AffiliateCTA({ item, ctaLabel }: { item: Item; ctaLabel: string }) {
  const url = item.affiliate_links?.carousell
    ? item.affiliate_links.carousell + '?utm_source=chicpreowned.com&utm_medium=referral&utm_campaign=price-guide'
    : `https://www.carousell.co.th/search/${encodeURIComponent(item.brand + ' ' + item.model)}/?utm_source=chicpreowned.com&utm_medium=referral&utm_campaign=price-guide`

  return (
    <div className="my-8">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-[#1A1A1A] text-white text-center py-3 px-6 text-sm tracking-wide hover:bg-[#8C7355] transition-colors"
      >
        {ctaLabel}
      </a>
    </div>
  )
}
