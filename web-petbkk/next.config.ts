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

      // Dropped by the Places API backfill: one reports CLOSED_PERMANENTLY and
      // six no longer exist in Google at all. Their pages were indexed, so they
      // are folded into the hub rather than left to 404.
      { source: '/hospital/799-animal-hospital', destination: '/hospital', permanent: true },
      { source: '/hospital/sukhumvit-62-pet-hospital', destination: '/hospital', permanent: true },
      { source: '/hospital/animal-clinic', destination: '/hospital', permanent: true },
      { source: '/hospital/the-vorarat-polyclinic', destination: '/hospital', permanent: true },
      { source: '/hospital/phra-khanong-veterinary', destination: '/hospital', permanent: true },
      { source: '/hospital/%E0%B8%84%E0%B8%A5%E0%B8%99%E0%B8%81%E0%B8%AA%E0%B8%95%E0%B8%A7%E0%B9%80%E0%B8%A5%E0%B8%A2%E0%B8%87-458', destination: '/hospital', permanent: true },
      { source: '/hospital/%E0%B8%84%E0%B8%A5%E0%B8%99%E0%B8%81%E0%B8%A3%E0%B8%81%E0%B8%A9%E0%B8%B2%E0%B8%AA%E0%B8%95%E0%B8%A7%E0%B9%80%E0%B8%AB%E0%B8%A1%E0%B8%A2%E0%B8%A7%E0%B8%AA%E0%B9%82%E0%B8%A1%E0%B8%AA%E0%B8%A3-meow-samosorn-vet-clinic', destination: '/hospital', permanent: true },
    ]
  },
}

export default config
