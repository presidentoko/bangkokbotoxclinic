import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: `How to Buy Pre-Owned Luxury Online Safely ${PRICE_YEAR} | SecondLuxuryItems`,
  description: `Complete guide to buying pre-owned luxury bags and watches online safely — authentication, payment, condition grades, red flags. Avoid scams in ${PRICE_YEAR}.`,
  alternates: { canonical: `${BASE}/guides/how-to-buy-pre-owned-luxury-online` },
}

const steps = [
  { n: '1', title: 'Know the retail price first', body: 'Before shopping pre-owned, know the current retail price. Pre-owned should be 30–80% of retail depending on condition. If a Chanel Classic Flap is listed at $12,000 pre-owned and retail is $10,800, walk away — it\'s either fake or mispriced.' },
  { n: '2', title: 'Understand condition grades', body: 'Platforms use different systems — but the universal rule: Excellent/Pristine means minimal use signs, Very Good means light wear, Good means visible wear. Never pay Excellent prices for Good condition. Ask for photos of corners, hardware, interior, and datecode.' },
  { n: '3', title: 'Request serial and date codes', body: 'Chanel has black Hologram stickers (older) or white chip cards. Louis Vuitton has date codes stamped inside. Hermès has blind stamps. Rolex has case reference and serial engraved on the case. No serial/datecode = no buy.' },
  { n: '4', title: 'Verify the seller history', body: 'On resale platforms (Vestiaire, Fashionphile, The RealReal) check: how many items sold, response rate, return policy. For private sellers on Instagram or LINE, request a video call and real-time photos. Scammers use the same stock photos across listings.' },
  { n: '5', title: 'Use payment with protection', body: 'PayPal Goods & Services, credit card through a platform, or platform escrow. Never wire transfer, never crypto, never Zelle/Venmo for first purchases with unknown sellers. Bank-level protection on the card is your last resort.' },
  { n: '6', title: 'Get authentication on arrival', body: 'Budget $20–$50 for independent authentication (Entrupy machine, Real Authentication, or a certified boutique). If the seller refuses authentication, that tells you something. Refund windows close fast — authenticate immediately.' },
]

export default function HowToBuyPreOwnedOnline() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>How to Buy Pre-Owned Luxury Online</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">How to Buy Pre-Owned Luxury Online Safely</h1>
      <p className="text-gray-500 mb-10">The pre-owned luxury market is the fastest-growing sector in fashion — but also the most counterfeited. Knowing how to protect yourself before buying saves thousands. Six rules that eliminate 95% of the risk.</p>

      <div className="space-y-4 mb-10">
        {steps.map((s) => (
          <div key={s.n} className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold">{s.n}</div>
              <div>
                <h2 className="font-bold text-gray-900 mb-1">{s.title}</h2>
                <p className="text-sm text-gray-600">{s.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-10">
        <h3 className="font-semibold text-red-900 mb-3">Red flags — walk away immediately</h3>
        <ul className="space-y-1 text-sm text-red-800">
          <li>• Price is 85–100%+ of retail (not a deal, likely fake)</li>
          <li>• Seller refuses additional photos or video call</li>
          <li>• No serial number, no datecode, no original receipt</li>
          <li>• "Just got it as a gift" from overseas account with no history</li>
          <li>• Requests Zelle, wire transfer, or crypto payment only</li>
          <li>• Stock photos without any background or personal photo</li>
        </ul>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/guides/luxury-condition-guide" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Condition Guide →</Link>
        <Link href="/guides/how-to-spot-fake-luxury-bags" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Spot Fakes →</Link>
        <Link href="/guides/pre-owned-vs-new-luxury" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Pre-Owned vs New →</Link>
      </div>
    </div>
  )
}
