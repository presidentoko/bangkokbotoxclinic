import { ImageResponse } from 'next/og'
import { getItemsByCategory } from '@/lib/data'

export const runtime = 'nodejs'
// How often the image may be regenerated. Does not currently affect the
// Cache-Control Vercel emits for dynamic-segment metadata routes — see the
// note on the ImageResponse headers below.
export const revalidate = 86400
export const alt = 'Pre-owned luxury handbag prices — Chanel, LV, Hermès'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  const items = getItemsByCategory('handbags').slice(0, 4)
  const brands = [...new Set(items.map(i => i.brand))].slice(0, 4).join(' · ')

  return new ImageResponse(
    (
      <div style={{ background: '#0a0a0a', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '60px 72px', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex' }}>
          <div style={{ color: '#ffffff', fontSize: '20px', fontWeight: 600 }}>SecondLuxuryItems.com</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ color: '#888', fontSize: '22px' }}>Pre-Owned Handbag Price Guide</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ color: '#ffffff', fontSize: '56px', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-1.5px' }}>Real Second-Hand</div>
            <div style={{ color: '#ffffff', fontSize: '56px', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-1.5px' }}>Handbag Prices</div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ color: '#aaa', fontSize: '28px' }}>{brands}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ color: '#555', fontSize: '18px' }}>Updated weekly · Compare by condition</div>
          <div style={{ background: '#fff', color: '#000', fontSize: '18px', fontWeight: 600, padding: '12px 24px', borderRadius: '8px' }}>Browse Prices →</div>
        </div>
      </div>
    ),
    {
      ...size,
      // Intent: a day at the edge. The art comes from build-time data, so it
      // cannot go stale sooner.
      //
      // NOTE: on Vercel this is currently overridden for routes under a
      // dynamic segment — they are served as bare `public, max-age=0` no
      // matter what is set here or in `revalidate` below, no ETag, and a
      // conditional request still returns the full 50 KB body. The edge TTL
      // that actually holds is enforced by a Cloudflare Cache Rule on
      // /*opengraph-image*. Keep this header: it is correct, it works for the
      // static root routes, and it is what should apply if Vercel stops
      // rewriting it.
      headers: {
        'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
      },
    }
  )
}
