import type { NextConfig } from 'next'

const config: NextConfig = {
  async redirects() {
    return [
      // /hospital/surgery listed all 503 hospitals, because `has_surgery` is
      // hardcoded true in petvet/transform.py — byte-for-byte the same list as
      // /hospital, which is why Search Console reports 16 pages under
      // "Duplicate, Google chose different canonical than user". noindex left
      // the duplicate in place; a 308 folds its link equity into /hospital and
      // retires the fabricated "has an operating room" claim with it.
      { source: '/hospital/surgery', destination: '/hospital', permanent: true },
    ]
  },
}

export default config
