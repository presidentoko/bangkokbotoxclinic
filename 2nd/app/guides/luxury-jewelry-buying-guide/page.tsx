import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'Pre-Owned Luxury Jewelry Buying Guide 2025 | SecondLuxuryItems',
  description: 'How to buy pre-owned Cartier, Van Cleef & Arpels, Bulgari and Tiffany jewelry. Authentication, value retention, and price guide for 2025.',
  alternates: { canonical: `${BASE}/guides/luxury-jewelry-buying-guide` },
}

export default function JewelryBuyingGuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-gray-800">Guides</Link>
        <span className="mx-2">/</span>
        <span>Luxury Jewelry Buying Guide</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Pre-Owned Luxury Jewelry Buying Guide 2025</h1>
      <p className="text-gray-500 mb-10">How to buy Cartier, Van Cleef, Bulgari and Tiffany pre-owned — authentication, pricing, and what retains value.</p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Value Retention by Brand</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Brand</th>
                <th className="text-left py-3 px-4 font-semibold">Best Piece</th>
                <th className="text-right py-3 px-4 font-semibold">Retention</th>
                <th className="text-right py-3 px-4 font-semibold">Entry Price</th>
              </tr>
            </thead>
            <tbody>
              {[
                { brand: 'Cartier', best: 'Love Bracelet (YG/WG)', retention: '85–100%', entry: '$3,500' },
                { brand: 'Van Cleef & Arpels', best: 'Vintage Alhambra', retention: '90–110%', entry: '$4,500' },
                { brand: 'Bulgari', best: 'B.zero1 Ring', retention: '70–85%', entry: '$1,200' },
                { brand: 'Tiffany', best: 'T Wire Bracelet', retention: '65–80%', entry: '$1,000' },
                { brand: 'Chopard', best: 'Happy Diamonds', retention: '55–70%', entry: '$2,000' },
              ].map((r, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{r.brand}</td>
                  <td className="py-3 px-4 text-gray-600">{r.best}</td>
                  <td className="text-right py-3 px-4 text-gray-700 font-medium">{r.retention}</td>
                  <td className="text-right py-3 px-4 text-green-700">{r.entry}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Authentication Checklist</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Cartier</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Double-C hallmark inside band + assay marks</li>
              <li>• French eagle head (18k gold) or owl (platinum)</li>
              <li>• Certificate with serial number (format: LV1234)</li>
              <li>• Screws on Love Bracelet: flat slot, not Phillips</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Van Cleef & Arpels</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• VCA + metal + serial engraved inside clasp</li>
              <li>• Motifs should move freely and not rattle</li>
              <li>• Malachite/onyx/coral should be even colour</li>
              <li>• Gold posts on Alhambra should be flush</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">What to Ask Before Buying</h2>
        <ul className="text-sm text-gray-600 space-y-2">
          <li><strong>Does it have the original box and pouch?</strong> Adds 5–15% to resale value for Cartier and VCA.</li>
          <li><strong>Has it been polished?</strong> Excessive polishing removes hallmarks and material. Ask specifically.</li>
          <li><strong>Are all stones original?</strong> Request stone certificates for any piece with diamonds over 0.5ct.</li>
          <li><strong>Any repairs?</strong> Resized rings, resoldered clasps, and replaced prongs should all be disclosed.</li>
          <li><strong>What metal exactly?</strong> "Gold" can mean 14k, 18k, or gold-plated — hallmarks confirm.</li>
        </ul>
      </section>

      <div className="flex gap-3 flex-wrap">
        <Link href="/jewelry" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Browse Jewelry →</Link>
        <Link href="/brands/cartier" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Cartier Guide →</Link>
        <Link href="/compare/cartier-vs-van-cleef" className="border border-gray-200 rounded-lg px-4 py-2 text-sm hover:border-gray-400">Cartier vs VCA →</Link>
      </div>
    </div>
  )
}
