import { Item } from '@/lib/data'

export function AffiliateCTA({ item, ctaLabel }: { item: Item; ctaLabel: string }) {
  return (
    <div className="my-8">
      <a
        href={item.affiliate_links.carousell}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-black text-white text-center py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
      >
        {ctaLabel}
      </a>
    </div>
  )
}
