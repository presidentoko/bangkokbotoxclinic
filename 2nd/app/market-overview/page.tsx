import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllItems, getAvgPrice, formatPrice } from '@/lib/data'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Pre-Owned Luxury Market Overview 2025 | SecondLuxuryItems',
  description: 'Live price data from 200+ pre-owned luxury items across 8 categories. Category averages, top value retainers, best deals, and brand rankings.',
  alternates: { canonical: `${BASE}/market-overview` },
}

const CATEGORY_LABELS: Record<string, string> = {
  handbags: 'Handbags',
  watches: 'Watches',
  shoes: 'Shoes',
  jewelry: 'Jewelry',
  belts: 'Belts',
  scarves: 'Scarves',
  'small-leather-goods': 'Small Leather Goods',
  clothing: 'Clothing',
}

export default function MarketOverviewPage() {
  const allItems = getAllItems()

  const categories = ['handbags', 'watches', 'shoes', 'jewelry', 'belts', 'scarves', 'small-leather-goods'] as const

  const categoryRows = categories.map(cat => {
    const catItems = allItems.filter(i => i.category === cat)
    const withPrice = catItems.filter(i => i.price_ranges.very_good && i.retail_price_usd > 0)
    const avgRetail = withPrice.length
      ? Math.round(withPrice.reduce((s, i) => s + i.retail_price_usd, 0) / withPrice.length)
      : 0
    const avgResale = withPrice.length
      ? Math.round(withPrice.reduce((s, i) => s + getAvgPrice(i.price_ranges.very_good!), 0) / withPrice.length)
      : 0
    const avgSavings = avgRetail ? Math.round((1 - avgResale / avgRetail) * 100) : 0
    return { cat, count: catItems.length, avgRetail, avgResale, avgSavings }
  })

  const withPriceItems = allItems.filter(i => i.price_ranges.very_good && i.retail_price_usd > 0)

  const topRetainers = [...withPriceItems]
    .map(i => {
      const avg = getAvgPrice(i.price_ranges.very_good!)
      const retentionPct = Math.round((avg / i.retail_price_usd) * 100)
      return { ...i, retentionPct }
    })
    .sort((a, b) => b.retentionPct - a.retentionPct)
    .slice(0, 10)

  const bestDeals = [...withPriceItems]
    .map(i => {
      const avg = getAvgPrice(i.price_ranges.very_good!)
      const savingsPct = Math.round((1 - avg / i.retail_price_usd) * 100)
      return { ...i, savingsPct }
    })
    .sort((a, b) => b.savingsPct - a.savingsPct)
    .slice(0, 10)

  const brandCounts = allItems.reduce((acc, i) => {
    acc[i.brand] = (acc[i.brand] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topBrands = Object.entries(brandCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  return (
    <>
      <p className="text-sm text-[#9C8B7A] mb-2">
        <Link href="/" className="hover:text-[#1A1A1A] transition-colors">Home</Link> › Market Overview
      </p>

      <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">Data Report</p>
      <h1 className="font-serif text-4xl sm:text-5xl text-[#1A1A1A] leading-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
        Pre-Owned Luxury Market: Price Overview 2025
      </h1>
      <p className="text-[#6B6052] text-lg leading-relaxed mb-12 max-w-2xl">
        Live price data from 200+ pre-owned luxury items across 8 categories.
      </p>

      <section className="mb-16">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-[#E8E2D9]" />
          <span className="text-xs tracking-[0.15em] uppercase text-[#9C8B7A]">By Category</span>
          <div className="flex-1 h-px bg-[#E8E2D9]" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#E8E2D9]">
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">Category</th>
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">Items</th>
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">Avg Retail</th>
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">Avg Resale</th>
                <th className="text-left py-3 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">Avg Savings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              {categoryRows.map(row => (
                <tr key={row.cat}>
                  <td className="py-3 pr-4 font-medium text-[#1A1A1A]">{CATEGORY_LABELS[row.cat] ?? row.cat}</td>
                  <td className="py-3 pr-4 text-[#1A1A1A]">{row.count}</td>
                  <td className="py-3 pr-4 text-[#9C8B7A]">{row.avgRetail ? formatPrice(row.avgRetail) : '—'}</td>
                  <td className="py-3 pr-4 text-[#1A1A1A]">{row.avgResale ? formatPrice(row.avgResale) : '—'}</td>
                  <td className={`py-3 font-medium ${row.avgSavings > 0 ? 'text-[#4A7A35]' : 'text-[#8C7355]'}`}>
                    {row.avgSavings > 0 ? `-${row.avgSavings}%` : row.avgSavings < 0 ? `+${Math.abs(row.avgSavings)}%` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-16">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-[#E8E2D9]" />
          <span className="text-xs tracking-[0.15em] uppercase text-[#9C8B7A]">Top Value Retainers</span>
          <div className="flex-1 h-px bg-[#E8E2D9]" />
        </div>
        <p className="text-sm text-[#6B6052] mb-6">Items where pre-owned price is closest to original retail — strongest value retention.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#E8E2D9]">
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">#</th>
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">Item</th>
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">Resale Avg</th>
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">Retail</th>
                <th className="text-left py-3 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">Retention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              {topRetainers.map((item, idx) => {
                const avg = getAvgPrice(item.price_ranges.very_good!)
                return (
                  <tr key={item.id}>
                    <td className="py-3 pr-4 text-[#9C8B7A] text-xs">{idx + 1}</td>
                    <td className="py-3 pr-4">
                      <Link href={`/${item.slug}`} className="text-[#1A1A1A] hover:text-[#B8954A] transition-colors">
                        {item.brand} {item.model}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 font-medium text-[#1A1A1A]">{formatPrice(avg)}</td>
                    <td className="py-3 pr-4 text-[#9C8B7A]">{formatPrice(item.retail_price_usd)}</td>
                    <td className={`py-3 font-medium ${item.retentionPct >= 100 ? 'text-[#8C7355]' : 'text-[#4A7A35]'}`}>
                      {item.retentionPct}%
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-16">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-[#E8E2D9]" />
          <span className="text-xs tracking-[0.15em] uppercase text-[#9C8B7A]">Best Deals</span>
          <div className="flex-1 h-px bg-[#E8E2D9]" />
        </div>
        <p className="text-sm text-[#6B6052] mb-6">Items with the largest discount from retail — maximum savings on pre-owned.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#E8E2D9]">
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">#</th>
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">Item</th>
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">Resale Avg</th>
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">Retail</th>
                <th className="text-left py-3 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">Savings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              {bestDeals.map((item, idx) => {
                const avg = getAvgPrice(item.price_ranges.very_good!)
                return (
                  <tr key={item.id}>
                    <td className="py-3 pr-4 text-[#9C8B7A] text-xs">{idx + 1}</td>
                    <td className="py-3 pr-4">
                      <Link href={`/${item.slug}`} className="text-[#1A1A1A] hover:text-[#B8954A] transition-colors">
                        {item.brand} {item.model}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 font-medium text-[#1A1A1A]">{formatPrice(avg)}</td>
                    <td className="py-3 pr-4 text-[#9C8B7A]">{formatPrice(item.retail_price_usd)}</td>
                    <td className="py-3 font-medium text-[#4A7A35]">-{item.savingsPct}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-16">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-[#E8E2D9]" />
          <span className="text-xs tracking-[0.15em] uppercase text-[#9C8B7A]">Most Tracked Brands</span>
          <div className="flex-1 h-px bg-[#E8E2D9]" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {topBrands.map(([brand, count]) => (
            <div key={brand} className="border border-[#E8E2D9] p-4 text-center hover:border-[#B8954A] transition-colors">
              <p className="text-sm font-medium text-[#1A1A1A] mb-1">{brand}</p>
              <p className="text-xs text-[#8C7355]">{count} model{count !== 1 ? 's' : ''}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
