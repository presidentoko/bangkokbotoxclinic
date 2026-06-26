import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getItemsByBrand, getAllBrands } from '@/lib/data'
import { SortableItemGrid } from '@/components/SortableItemGrid'

const BASE = 'https://www.secondluxuryitems.com'

interface Props { params: Promise<{ brand: string }> }

export async function generateStaticParams() {
  return getAllBrands().map(b => ({ brand: b.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand } = await params
  const items = getItemsByBrand(brand)
  if (!items.length) return {}
  const brandName = items[0].brand
  return {
    title: `Used ${brandName} Prices — Pre-Owned Price Guide | SecondLuxuryItems`,
    description: `Current second-hand prices for ${brandName}. Compare ${items.length} models with price ranges by condition.`,
    alternates: { canonical: `${BASE}/${brand}` },
  }
}

export default async function BrandPage({ params }: Props) {
  const { brand } = await params
  const items = getItemsByBrand(brand)
  if (!items.length) notFound()
  const brandName = items[0].brand

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Used ${brandName} Price Guide`,
    url: `${BASE}/${brand}`,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE}/${item.slug}`,
      name: `Used ${item.brand} ${item.model}`,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <p className="text-sm text-[#9C8B7A] mb-2">
        <Link href="/" className="hover:text-[#1A1A1A] transition-colors">Home</Link> › {brandName}
      </p>
      <h1 className="font-serif text-4xl text-[#1A1A1A] mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
        Used {brandName} Prices
      </h1>
      <p className="text-[#6B6052] mb-2">
        Pre-owned {brandName} prices by condition. All prices from authenticated listings, updated weekly.
      </p>
      <p className="text-[#6B6052] mb-8">Pre-owned price guide for {items.length} {brandName} model{items.length !== 1 ? 's' : ''}.</p>
      {(() => {
        const itemsWithSavings = items.filter(i => i.price_ranges.very_good && i.retail_price_usd > 0)
        if (!itemsWithSavings.length) return null
        const avgSav = Math.round(
          itemsWithSavings.reduce((sum, i) => {
            const vg = i.price_ranges.very_good!
            const avg = (vg.min + vg.max) / 2
            return sum + ((i.retail_price_usd - avg) / i.retail_price_usd * 100)
          }, 0) / itemsWithSavings.length
        )
        if (avgSav <= 0) return null
        return (
          <div className="flex items-center gap-3 mb-6 p-4 bg-[#F5F0E8] border-l-2 border-[#B8954A]">
            <span className="text-2xl font-bold text-[#4A7A35]">{avgSav}%</span>
            <span className="text-sm text-[#6B6052]">average savings vs retail across all {brandName} models</span>
          </div>
        )
      })()}
      <SortableItemGrid items={items} />
    </>
  )
}
