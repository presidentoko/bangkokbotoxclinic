import { ImageResponse } from 'next/og'
import { getItemsByCategory } from '@/lib/data'

export const runtime = 'nodejs'
// How often the image may be regenerated. Does not currently affect the
// Cache-Control Vercel emits for dynamic-segment metadata routes — see the
// note on the ImageResponse headers below.
export const revalidate = 86400
export const alt = 'ราคานาฬิกาแบรนด์เนมมือสองในไทย'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const items = getItemsByCategory('watches').slice(0, 4)
  const brands = [...new Set(items.map(i => i.brand))].slice(0, 4).join(' · ')
  const isTH = locale === 'th'

  return new ImageResponse(
    (
      <div style={{ background: '#0a0a0a', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '60px 72px', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex' }}>
          <div style={{ color: '#ffffff', fontSize: '20px', fontWeight: 600 }}>chicpreowned.com</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ color: '#888', fontSize: '22px' }}>{isTH ? 'ราคานาฬิกามือสอง' : 'Pre-Owned Watch Prices Thailand'}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ color: '#ffffff', fontSize: '52px', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-1.5px' }}>{isTH ? 'นาฬิกาแบรนด์เนมมือสอง' : 'Used Luxury Watches'}</div>
            <div style={{ color: '#ffffff', fontSize: '52px', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-1.5px' }}>{isTH ? 'ราคาจริงในไทย' : 'Real Prices in THB'}</div>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ color: '#aaa', fontSize: '26px' }}>{brands}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ color: '#555', fontSize: '18px' }}>{isTH ? 'อัปเดตทุกสัปดาห์' : 'Updated weekly from live listings'}</div>
          <div style={{ background: '#fff', color: '#000', fontSize: '18px', fontWeight: 600, padding: '12px 24px', borderRadius: '8px' }}>{isTH ? 'ดูราคา →' : 'See Prices →'}</div>
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
