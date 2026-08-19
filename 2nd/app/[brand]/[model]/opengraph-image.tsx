import { ImageResponse } from 'next/og'
import { getItemBySlug, formatPrice, getAvgPrice } from '@/lib/data'

export const runtime = 'nodejs'
// Vercel derives the edge Cache-Control for a prerendered route from its
// `revalidate`. Without one it serves these images as `public, max-age=0`,
// stripping the s-maxage set on the ImageResponse, and Cloudflare goes back to
// the origin on every unfurl — the routes showed EXPIRED on every request.
export const revalidate = 86400
export const alt = 'Pre-owned luxury price guide'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ brand: string; model: string }> }) {
  const { brand, model } = await params
  const item = getItemBySlug(brand, model)

  const vg = item?.price_ranges.very_good
  const priceText = vg ? `Avg. ${formatPrice(getAvgPrice(vg))}` : 'See price guide'
  const savingsPct = vg && item?.retail_price_usd && item.retail_price_usd > 0
    ? Math.round(((item.retail_price_usd - (vg.min + vg.max) / 2) / item.retail_price_usd) * 100)
    : null
  const categoryLabel = item?.category === 'handbags' ? 'HANDBAG PRICE GUIDE' : 'WATCH PRICE GUIDE'

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '56px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top row: site name + savings badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div style={{ color: '#888888', fontSize: '17px', letterSpacing: '3px' }}>
            SECONDLUXURYITEMS.COM
          </div>
          {savingsPct !== null && savingsPct > 0 && (
            <div style={{
              display: 'flex',
              background: '#B8954A',
              color: '#ffffff',
              fontSize: '26px',
              fontWeight: 700,
              padding: '10px 24px',
              letterSpacing: '-0.5px',
            }}>
              SAVE {savingsPct}%
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: '1px', background: '#222222', marginBottom: '44px' }} />

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          {/* Brand */}
          <div style={{ color: '#B8954A', fontSize: '20px', fontWeight: 600, letterSpacing: '4px', marginBottom: '10px' }}>
            {item?.brand?.toUpperCase() ?? ''}
          </div>
          {/* Model */}
          <div style={{ color: '#ffffff', fontSize: '62px', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-1px', marginBottom: '28px' }}>
            {item?.model ?? 'Pre-Owned Luxury'}
          </div>
          {/* Price range */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '18px', marginBottom: '18px' }}>
            <div style={{ color: '#B8954A', fontSize: '42px', fontWeight: 600 }}>
              {priceText}
            </div>
            <div style={{ color: '#555555', fontSize: '22px' }}>
              Very Good
            </div>
          </div>
          {/* Category label */}
          <div style={{ color: '#444444', fontSize: '14px', letterSpacing: '4px' }}>
            {categoryLabel}
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: '1px', background: '#222222', marginBottom: '24px' }} />

        {/* Bottom row */}
        <div style={{ color: '#555555', fontSize: '15px', letterSpacing: '2px' }}>
          secondluxuryitems.com · Updated Weekly · 76+ Models
        </div>
      </div>
    ),
    {
      ...size,
      // Next stamps metadata images with `public, max-age=0, must-revalidate`
      // and that wins over next.config's headers(), so Cloudflare held these
      // as EXPIRED and revalidated against the origin on every single request.
      // There are ~300 of these across the brand and model routes; social
      // unfurls and crawlers hit them constantly. The art is generated from
      // build-time data, so a day at the edge is safe.
      headers: {
        'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
      },
    }
  )
}
