import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1A1A1A',
          color: '#FAFAF9',
        }}
      >
        <div style={{ fontSize: 76, letterSpacing: 4, color: '#B8954A', display: 'flex' }}>SecondLuxuryItems</div>
        <div style={{ fontSize: 32, marginTop: 24, color: '#E8E2D9', display: 'flex' }}>
          Pre-Owned Luxury Price Guide
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
