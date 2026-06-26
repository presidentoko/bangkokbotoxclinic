import { ImageResponse } from 'next/og'
import { getItemBySlug, formatPrice } from '@/lib/data'

export const runtime = 'nodejs'
export const alt = 'Pre-owned luxury price guide'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ brand: string; model: string }> }) {
  const { brand, model } = await params
  const item = getItemBySlug(brand, model)

  const vg = item?.price_ranges.very_good
  const priceText = vg ? `${formatPrice(vg.min)} – ${formatPrice(vg.max)}` : 'See price guide'
  const title = item ? `Used ${item.brand} ${item.model}` : 'Pre-Owned Luxury'

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ color: '#ffffff', fontSize: '20px', fontWeight: 600, letterSpacing: '-0.5px' }}>
            SecondLuxuryItems.com
          </div>
          <div style={{ color: '#555', fontSize: '20px' }}>·</div>
          <div style={{ color: '#888', fontSize: '18px' }}>Pre-Owned Price Guide</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ color: '#888', fontSize: '22px', fontWeight: 500 }}>
            {item?.category === 'handbags' ? '👜 Handbag' : '⌚ Watch'} · Very Good Condition
          </div>
          <div style={{ color: '#ffffff', fontSize: '58px', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-1.5px' }}>
            {title}
          </div>
          <div style={{ color: '#e0e0e0', fontSize: '38px', fontWeight: 500 }}>
            {priceText}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ color: '#555', fontSize: '18px' }}>Updated weekly from live listings</div>
          <div style={{ flex: 1 }} />
          <div style={{
            background: '#ffffff',
            color: '#000000',
            fontSize: '18px',
            fontWeight: 600,
            padding: '12px 24px',
            borderRadius: '8px',
          }}>
            See full price guide →
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
