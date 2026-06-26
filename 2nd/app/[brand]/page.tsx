import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getItemsByBrand, getAllBrands, formatPrice } from '@/lib/data'

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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map(item => {
          const vg = item.price_ranges.very_good
          const savingsPct =
            vg && item.retail_price_usd > 0
              ? Math.round(
                  ((item.retail_price_usd - (vg.min + vg.max) / 2) /
                    item.retail_price_usd) *
                    100,
                )
              : null
          return (
            <Link
              key={item.id}
              href={`/${item.slug}`}
              className="group block p-6 bg-white border border-[#E8E2D9] rounded-sm hover:border-[#B8954A] hover:shadow-md transition-all duration-200"
            >
              <p className="text-xs tracking-[0.15em] uppercase text-[#9C8B7A] mb-2">{item.brand}</p>
              <h3 className="font-serif text-xl text-[#1A1A1A] group-hover:text-[#8C7355] transition-colors mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
                {item.model}
              </h3>
              {vg && (
                <div className="flex items-baseline gap-3">
                  <span className="text-lg font-medium text-[#1A1A1A]">{formatPrice(vg.min)} – {formatPrice(vg.max)}</span>
                  {savingsPct !== null && savingsPct > 0 && (
                    <span className="text-xs px-2 py-0.5 bg-[#F5F0E8] text-[#8C7355] rounded-full">save {savingsPct}%</span>
                  )}
                </div>
              )}
            </Link>
          )
        })}
      </div>
    </>
  )
}
