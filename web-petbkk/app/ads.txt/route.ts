/**
 * /ads.txt — the IAB authorised-sellers file.
 *
 * Without it, most demand-side platforms treat the domain's inventory as
 * unauthorised and bid far lower or not at all, so it is worth having in place
 * before the first ad is served rather than after. The publisher id is the same
 * `ca-pub-…` value the ad script uses (`lib/ads.ts`); ads.txt wants it without
 * the `ca-` prefix.
 *
 * Served with a 404 if that id is ever blank — an ads.txt listing no sellers is
 * worse than none, because crawlers cache the empty file.
 */

import { ADSENSE_CLIENT } from '@/lib/ads'

export const dynamic = 'force-static'

const ADSENSE_ID = ADSENSE_CLIENT

export function GET() {
  if (!ADSENSE_ID) {
    return new Response('Not Found', { status: 404 })
  }

  const pub = ADSENSE_ID.replace(/^ca-/, '')
  const lines = [
    '# ThailandPetHub authorised digital sellers',
    `google.com, ${pub}, DIRECT, f08c47fec0942fa0`,
    '',
  ]

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=86400',
    },
  })
}
