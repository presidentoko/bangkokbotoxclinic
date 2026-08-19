import { ImageResponse } from 'next/og'
import { getItemsByBrand, formatPriceTHB } from '@/lib/data'

export const runtime = 'nodejs'
export const alt = 'ราคาสินค้าแบรนด์เนมมือสองในไทย'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ locale: string; brand: string }> }) {
  const { locale, brand } = await params
  const items = getItemsByBrand(brand)
  const brandName = items[0]?.brand ?? brand
  const isTH = locale === 'th'
  const models = items.slice(0, 3).map(i => {
    const vg = i.price_ranges.very_good
    return vg ? `${i.model}: ${formatPriceTHB(vg.min)}–${formatPriceTHB(vg.max)}` : i.model
  })

  return new ImageResponse(
    (
      <div style={{ background: '#0a0a0a', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '60px 72px', fontFamily: 'sans-serif' }}>
        <div style={{ color: '#ffffff', fontSize: '20px', fontWeight: 600 }}>chicpreowned.com</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ color: '#888', fontSize: '22px' }}>{isTH ? 'ราคามือสองในไทย' : 'Pre-Owned Price Guide Thailand'}</div>
          <div style={{ color: '#ffffff', fontSize: '60px', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-1.5px' }}>
            {isTH ? `${brandName} มือสอง` : `Used ${brandName}`}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {models.map((m, i) => (
              <div key={i} style={{ color: '#aaa', fontSize: '20px' }}>{m}</div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ color: '#555', fontSize: '18px' }}>{isTH ? 'อัปเดตทุกสัปดาห์' : 'Updated weekly'}</div>
          <div style={{ background: '#fff', color: '#000', fontSize: '18px', fontWeight: 600, padding: '12px 24px', borderRadius: '8px' }}>{isTH ? 'ดูราคา →' : 'See Prices →'}</div>
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
