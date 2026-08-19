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
        <div style={{ fontSize: 84, letterSpacing: 4, color: '#B8954A', display: 'flex' }}>ChicPreowned</div>
        <div style={{ fontSize: 32, marginTop: 24, color: '#E8E2D9', display: 'flex' }}>
          Luxury Pre-Owned Price Guide — Thailand
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
