import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `Where to Sell Pre-Owned Luxury Bags in ${PRICE_YEAR} | SecondLuxuryItems`,
  description: 'Vestiaire vs TheRealReal vs eBay vs Fashionphile: platform fees, authentication, and payout speed compared. Where to get the most for your luxury bag.',
  alternates: { canonical: `${BASE}/guides/where-to-sell-luxury-bags` },
}

const platforms = [
  {
    name: 'Vestiaire Collective',
    bestFor: 'Global reach, European brands',
    fee: '15–25%',
    authentication: 'In-house + Physical auth available',
    payoutSpeed: '3–10 days after sale',
    notes: 'Largest global luxury resale platform. Strong for Hermès, Chanel, and European brands. Commission is lower than TheRealReal.',
  },
  {
    name: 'The RealReal',
    bestFor: 'High-end consignment, hands-off selling',
    fee: '30–50%',
    authentication: 'Expert in-house authentication',
    payoutSpeed: '14–30 days',
    notes: 'US-focused. They handle everything: pickup, photography, listing, sale. Very high commission but zero effort from you. Best for $5,000+ pieces where service matters.',
  },
  {
    name: 'eBay',
    bestFor: 'Lower-value items, experienced sellers',
    fee: '8–13% final value fee',
    authentication: 'Buyer-funded 3rd-party auth available',
    payoutSpeed: '1–3 days after sale',
    notes: 'Lowest fees but most effort. You handle photos, description, shipping. Buyer trust is lower — buyers expect detailed proof of authenticity. Not ideal for first-time sellers.',
  },
  {
    name: 'Fashionphile',
    bestFor: 'Instant cash, LV/Chanel/Hermès specialists',
    fee: 'N/A (they buy outright)',
    authentication: 'In-house',
    payoutSpeed: '1–3 days (instant quote)',
    notes: 'Fashionphile offers an immediate purchase — you get cash quickly but at wholesale prices (typically 30–50% of pre-owned retail value). Best if speed matters more than maximum return.',
  },
  {
    name: 'Local Consignment',
    bestFor: 'Premium local markets (NYC, LA, London)',
    fee: '25–40%',
    authentication: 'Varies by shop',
    payoutSpeed: '30–90 days',
    notes: 'Local luxury consignment shops offer in-person authentication and direct customer relationships. Payout after sale. Rates vary widely — negotiate commission for high-value pieces.',
  },
]

const faqs = [
  {
    q: 'Which platform gives the highest payout when selling a luxury bag?',
    a: "eBay gives the highest net payout (lowest fees at 8–13%) but requires the most effort and expertise. Vestiaire Collective is the best balance of reach and fees (15–25%) for most sellers. TheRealReal pays the least (30–50% commission) but handles everything — worth it for very high-value consignments where effort matters.",
  },
  {
    q: 'Should I sell my luxury bag myself or use a consignment service?',
    a: "Sell yourself (eBay, Vestiaire) if the bag is under $3,000 and you can take quality photos and write a detailed listing. Use consignment (TheRealReal, local shops) if the bag is $5,000+ and you want zero hassle. Fashionphile is ideal if you want cash in 48 hours and are willing to accept a lower price.",
  },
  {
    q: 'How do I get the best price when selling a luxury bag?',
    a: "Condition is the biggest factor — clean the bag (no harsh chemicals), stuff it with tissue to restore shape, and photograph it in natural light against a white background. Include all original accessories: dust bag, box, care cards, receipt. Bags with full sets sell for 15–25% more than bag-only. List at a premium and be patient; rushed sellers leave significant money on the table.",
  },
  {
    q: 'What bags sell fastest on resale platforms?',
    a: "Louis Vuitton Neverfull and Speedy sell fastest — the deepest buyer pools of any luxury bag. Chanel Classic Flap in black or beige/classic colors sell quickly at a premium. Hermès pieces sell fast but only on authenticated platforms where buyers have confidence. Niche or trend pieces (seasonal colors, collaborations) can sit for months — price aggressively to move them.",
  },
]

export default function WhereToSellLuxuryBagsPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">Seller&apos;s Guide</p>
      <h1
        className="text-4xl text-[#1A1A1A] leading-tight mb-4"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        Where to Sell Your Luxury Bag in {PRICE_YEAR}: Platform Comparison
      </h1>
      <p className="text-[#8C7355] text-sm mb-10">Updated {PRICE_YEAR} · 5 platforms compared</p>

      <section className="mb-10">
        <p className="text-[#6B6052] leading-relaxed">
          Where you sell your luxury bag matters as much as how much you paid for it. Platform fees range from 8% to 50% — the difference between $3,000 and $4,500 net on a $5,000 bag. Here is the complete breakdown.
        </p>
      </section>

      <section className="mb-10">
        <h2
          className="text-2xl text-[#1A1A1A] mb-6"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Platform Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#E8E2D9]">
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">Platform</th>
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">Best for</th>
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">Seller fee</th>
                <th className="text-left py-3 pr-4 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">Authentication</th>
                <th className="text-left py-3 text-[#9C8B7A] font-normal uppercase tracking-wider text-xs">Payout speed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              {platforms.map(p => (
                <tr key={p.name}>
                  <td className="py-3 pr-4 font-medium text-[#1A1A1A]">{p.name}</td>
                  <td className="py-3 pr-4 text-[#6B6052]">{p.bestFor}</td>
                  <td className="py-3 pr-4 text-[#1A1A1A]">{p.fee}</td>
                  <td className="py-3 pr-4 text-[#6B6052]">{p.authentication}</td>
                  <td className="py-3 text-[#6B6052]">{p.payoutSpeed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2
          className="text-2xl text-[#1A1A1A] mb-5"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Platform Deep Dives
        </h2>
        <div className="space-y-6">
          {platforms.map(p => (
            <div key={p.name} className="border-l-2 border-[#E8E2D9] pl-5">
              <h3 className="font-medium text-[#1A1A1A] mb-2">{p.name}</h3>
              <p className="text-sm text-[#6B6052] leading-relaxed">{p.notes}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10 p-5 border border-[#E8E2D9] bg-[#F5F0E8]">
        <h2
          className="text-lg text-[#1A1A1A] mb-4"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Recommendation by Bag Value
        </h2>
        <ul className="space-y-3">
          {[
            { range: 'Under $1,000', rec: 'eBay — low fees maximize your return on lower-value items where service overhead isn\'t worth it.' },
            { range: '$1,000–$5,000', rec: 'Vestiaire Collective — global reach, authenticated listings, and 15–25% fees give the best balance.' },
            { range: '$5,000+', rec: 'TheRealReal or specialist consignment — the high commission is offset by their buyer network and white-glove service.' },
          ].map(({ range, rec }) => (
            <li key={range} className="flex gap-3 text-sm">
              <span className="font-semibold text-[#1A1A1A] shrink-0 w-28">{range}</span>
              <span className="text-[#6B6052]">{rec}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-[#E8E2D9] pt-10">
        <h2
          className="text-2xl text-[#1A1A1A] mb-6"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map(({ q, a }) => (
            <div key={q}>
              <h3 className="font-medium text-[#1A1A1A] mb-2 text-sm">{q}</h3>
              <p className="text-sm text-[#6B6052] leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-10 pt-6 border-t border-[#E8E2D9]">
        <Link href="/guides/luxury-bags-as-investments" className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors">
          Are luxury bags good investments? →
        </Link>
      </div>
    </article>
  )
}
