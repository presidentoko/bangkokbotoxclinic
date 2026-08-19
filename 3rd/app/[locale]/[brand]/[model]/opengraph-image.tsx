import { ImageResponse } from 'next/og'
import { getItemBySlug, formatPriceTHB, getAvgPrice } from '@/lib/data'

export const runtime = 'nodejs'
export const alt = 'ราคา pre-owned luxury ในไทย'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ locale: string; brand: string; model: string }> }) {
  const { locale, brand, model } = await params
  const item = getItemBySlug(brand, model)

  const vg = item?.price_ranges.very_good
  const priceText = vg ? formatPriceTHB(getAvgPrice(vg)) : 'ดูราคาในหน้า'
  const title = item ? `${item.brand} ${item.model}` : 'Pre-Owned Luxury'
  const isTH = locale === 'th'

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
          <div style={{ color: '#ffffff', fontSize: '20px', fontWeight: 600 }}>
            chicpreowned.com
          </div>
          <div style={{ color: '#555', fontSize: '20px' }}>·</div>
          <div style={{ color: '#888', fontSize: '18px' }}>
            {isTH ? 'ราคาของมือสองในไทย' : 'Pre-Owned Price Guide Thailand'}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ color: '#888', fontSize: '22px', fontWeight: 500 }}>
            {isTH ? 'มือสอง · สภาพดี' : 'Second-Hand · Very Good Condition'}
          </div>
          <div style={{ color: '#ffffff', fontSize: '54px', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-1.5px' }}>
            {isTH ? `${title} มือสอง` : `Used ${title}`}
          </div>
          <div style={{ color: '#e0e0e0', fontSize: '38px', fontWeight: 500 }}>
            {priceText}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ color: '#555', fontSize: '18px' }}>
            {isTH ? 'อัปเดตทุกสัปดาห์จากข้อมูลจริง' : 'Updated weekly from live listings'}
          </div>
          <div style={{ flex: 1 }} />
          <div style={{
            background: '#ffffff',
            color: '#000000',
            fontSize: '18px',
            fontWeight: 600,
            padding: '12px 24px',
            borderRadius: '8px',
          }}>
            {isTH ? 'ดูราคา →' : 'See prices →'}
          </div>
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
