import { Item } from '@/lib/data'

export function AffiliateCTA({ item }: { item: Item }) {
  const vestiaireUrl = item.affiliate_links?.vestiaire ||
    `https://www.vestiairecollective.com/search/?q=${encodeURIComponent(item.brand + ' ' + item.model)}`
  const realrealUrl = item.affiliate_links?.therealreal ||
    `https://www.therealreal.com/search?query=${encodeURIComponent(item.brand + ' ' + item.model)}`

  return (
    <div className="flex flex-col sm:flex-row gap-3 my-8">
      <a
        href={vestiaireUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 bg-[#1A1A1A] text-white text-center py-3 px-6 text-sm tracking-wide hover:bg-[#8C7355] transition-colors"
      >
        Shop on Vestiaire →
      </a>
      <a
        href={realrealUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 border border-[#E8E2D9] text-[#6B6052] text-center py-3 px-6 text-sm tracking-wide hover:border-[#B8954A] hover:text-[#B8954A] transition-colors"
      >
        Shop on The RealReal →
      </a>
    </div>
  )
}
