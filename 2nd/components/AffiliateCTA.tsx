import { Item } from '@/lib/data'

export function AffiliateCTA({ item }: { item: Item }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 my-8">
      <a
        href={item.affiliate_links.vestiaire}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 bg-black text-white text-center py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
      >
        Browse on Vestiaire Collective →
      </a>
      <a
        href={item.affiliate_links.therealreal}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 border-2 border-black text-black text-center py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
      >
        Shop on The RealReal →
      </a>
    </div>
  )
}
