import { ImageResponse } from 'next/og'
import { getItemsByCategory } from '@/lib/data'

export const runtime = 'nodejs'
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
