import { ImageResponse } from 'next/og'
import { getItemBySlug, formatPriceTHB } from '@/lib/data'
import { marketPrice, getThaiAliases, getThaiMeta } from '@/lib/thai-market'

export const runtime = 'nodejs'
// How often the image may be regenerated. Does not currently affect the
// Cache-Control Vercel emits for dynamic-segment metadata routes — see the
// note on the ImageResponse headers below.
export const revalidate = 86400
export const alt = 'ราคา pre-owned luxury ในไทย'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * The item's price, as a card.
 *
 * This is the only picture the site owns. It is the social preview, it is the
 * `image` on the page's Product schema, and it is rendered on the page itself
 * — one artefact doing three jobs, which is the only reason a site with no
 * photography has anything for an image search to find.
 *
 * It reads `marketPrice()`, the same function the page headline reads. It used
 * to read `price_ranges.very_good` instead, which is the Vestiaire figure: the
 * card for the Classic Flap Medium went out at 196,500 THB while the page it
 * linked to said 259,000. A share card that contradicts its own page is worse
 * than no share card, because it is the half that travels.
 */
export default async function Image({ params }: { params: Promise<{ locale: string; brand: string; model: string }> }) {
  const { locale, brand, model } = await params
  const item = getItemBySlug(brand, model)
  const isTH = locale === 'th'

  if (!item) {
    return new ImageResponse(
      (
        <div style={{ background: '#0a0a0a', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 48, fontFamily: 'sans-serif' }}>
          chicpreowned.com
        </div>
      ),
      size
    )
  }

  const market = marketPrice(item)
  const aliases = getThaiAliases(item.slug)
  const { generated } = getThaiMeta()
  const title = `${item.brand} ${item.model}`

  // The label has to match where the number came from. Calling a converted
  // dollar figure "the Thai market price" is the exact claim this pipeline
  // was built to stop the site making.
  const thai = market?.basis === 'thai'
  const family = market?.basis === 'thai_family'
  const kicker = thai
    ? (isTH ? 'ราคาที่ร้านไทยตั้งขาย' : 'Asking prices at Thai dealers')
    : family
      ? (isTH ? `${market?.familyLabel} ทุกขนาด ที่ร้านไทย` : `${market?.familyLabel}, all sizes, Thai dealers`)
      : (isTH ? 'ราคาตลาดสากล แปลงเป็นบาท' : 'International market, converted to baht')

  const priceText = market ? formatPriceTHB(market.value) : '—'
  const rangeText = market?.range
    ? `${formatPriceTHB(market.range.min)} – ${formatPriceTHB(market.range.max)}`
    : ''
  const basisText = market
    ? (thai || family
        ? (isTH ? `จาก ${market.n} ประกาศจริง · อัปเดต ${generated}` : `${market.n} live listings · updated ${generated}`)
        : (isTH ? `จาก ${market.n} รายการอ้างอิง` : `${market.n} reference listings`))
    : ''

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
          padding: '56px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', color: '#ffffff', fontSize: '20px', fontWeight: 600 }}>
            chicpreowned.com
          </div>
          <div style={{ display: 'flex', color: '#555', fontSize: '20px' }}>·</div>
          <div style={{ display: 'flex', color: '#888', fontSize: '18px' }}>
            {isTH ? 'ราคาของมือสองในไทย' : 'Pre-Owned Price Guide Thailand'}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', color: '#B8954A', fontSize: '21px', fontWeight: 500, marginBottom: '14px' }}>
            {kicker}
          </div>
          <div style={{ display: 'flex', color: '#ffffff', fontSize: '50px', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: '6px' }}>
            {title}
          </div>

          {/* The notation the reader is actually holding. Someone who came
              from a reseller's post knows "Classic 10" and has never seen the
              words "Classic Flap Medium". */}
          {aliases.length > 0 && (
            <div style={{ display: 'flex', color: '#8C8171', fontSize: '22px', marginBottom: '14px' }}>
              {isTH ? 'ร้านไทยเรียก ' : 'Thai dealers call it '}
              {aliases.map(a => a.name).join(' / ')}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '18px' }}>
            <div style={{ display: 'flex', color: '#ffffff', fontSize: '58px', fontWeight: 600 }}>
              {priceText}
            </div>
            {rangeText && (
              <div style={{ display: 'flex', color: '#9C8B7A', fontSize: '26px' }}>
                {rangeText}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', color: '#666', fontSize: '18px' }}>
            {basisText}
          </div>
          <div style={{ display: 'flex', flex: 1 }} />
          <div style={{
            display: 'flex',
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
