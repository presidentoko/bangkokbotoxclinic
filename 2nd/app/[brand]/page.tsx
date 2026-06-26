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
      <p className="text-sm text-gray-400 mb-2">
        <Link href="/">Home</Link> › {brandName}
      </p>
      <h1 className="text-3xl font-bold mb-2">Used {brandName} Prices</h1>
      <p className="text-gray-600 mb-8">Pre-owned price guide for {items.length} {brandName} model{items.length !== 1 ? 's' : ''}.</p>
      <div className="divide-y divide-gray-100">
        {items.map(item => {
          const vg = item.price_ranges.very_good
          return (
            <Link key={item.id} href={`/${item.slug}`} className="flex items-center justify-between py-4 hover:bg-gray-50 -mx-2 px-2 rounded">
              <span className="font-medium">{item.model}</span>
              <span className="text-sm text-gray-500">
                {vg ? `${formatPrice(vg.min)} – ${formatPrice(vg.max)}` : 'See guide'}
              </span>
            </Link>
          )
        })}
      </div>
    </>
  )
}
