import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Authenticate a Pre-Owned Chanel Bag: Complete Guide 2025',
  description:
    'Step-by-step guide to authenticating a second-hand Chanel bag. Check serial numbers, hardware, stitching, and dust bags.',
  alternates: {
    canonical: 'https://www.secondluxuryitems.com/guides/how-to-authenticate-chanel',
  },
}

const faqItems = [
  {
    q: 'How do I check if a Chanel bag is authentic?',
    a: 'Check the serial sticker inside (should match the authenticity card), verify CC hardware alignment (right C overlaps on top, left C on bottom), and confirm stitching is even with 10-12 stitches per diamond. For peace of mind, buy from authenticated resale platforms like Vestiaire Collective or The RealReal.',
  },
  {
    q: 'What serial number format does Chanel use?',
    a: "Chanel used 8-digit serial numbers on a sticker inside the bag from 1986 onward. From 2021, Chanel switched to a microchip embedded in the bag lining instead. Bags made after 2021 no longer have a visible serial sticker — that's intentional, not a sign of a fake.",
  },
  {
    q: 'What are the most common fake Chanel signs?',
    a: 'Misaligned CC logo (left C should go over right C at top), lightweight hardware that feels hollow or flaky, uneven or loose stitching, serial stickers that peel easily or sit raised from the lining, and dust bags that are grey fabric rather than white felt.',
  },
  {
    q: 'Is Vestiaire Collective authentication reliable?',
    a: 'Yes — Vestiaire Collective uses a combination of AI screening and human authentication experts before items ship to buyers. They reject items that fail checks and offer a money-back guarantee on authenticity. It is one of the most trusted platforms for pre-owned Chanel.',
  },
  {
    q: 'Can I get a Chanel bag authenticated independently?',
    a: 'Yes — services like Entrupy, Real Authentication, and Authenticate First offer authentication certificates for $15-30. Entrupy uses AI image analysis; Real Authentication and Authenticate First use human experts. A certificate adds value if you plan to resell.',
  },
]

const sections = [
  {
    id: 'serial',
    title: 'The Serial Number',
    body: [
      'All Chanel bags made after 1986 contain a serial sticker sewn inside the lining — typically behind a side pocket or along an interior seam. The format is an 8-digit number (e.g., 12345678) printed on a white sticker with a holographic overlay.',
      'The serial number should match exactly the number printed on the accompanying white authenticity card. Pre-2000 bags have shorter serials (6-7 digits). Early 2000s bags have 7 digits. Post-2005 bags use 8 digits.',
      'From 2021 onward, Chanel eliminated the serial sticker entirely and switched to a microchip (RFID) embedded in the bag lining. Post-2021 bags have no visible serial sticker — this is correct. Counterfeiters often still add a fake sticker to modern bags, which is actually a red flag on items from recent seasons.',
    ],
  },
  {
    id: 'hardware',
    title: 'Hardware Quality',
    body: [
      'Genuine Chanel hardware is made from solid brass. It feels heavy, dense, and smooth. On gold-tone pieces, the finish is deep and even. On silver-tone pieces, it is bright and cool. Neither should flake, peel, or feel hollow when you tap it.',
      'Zippers bear the word "Chanel" or the manufacturer name "Lampo" engraved on the pull. Check that the lettering is sharp and even — on fakes, zipper text is often blurry or stamped too shallow.',
      'The interlocking CC logo is the most scrutinized detail. The correct alignment: the right C should overlap over the top of the left C at the top of the logo, and the left C should overlap over the bottom of the right C at the base. Reversed alignment is the most common hardware authentication fail.',
    ],
  },
  {
    id: 'stitching',
    title: 'Stitching',
    body: [
      'Chanel quilted bags have 10-12 stitches per individual diamond on lambskin, and slightly fewer on caviar leather (which has a stiffer texture). Spacing between stitches should be perfectly even throughout the bag — no gaps, no bunching.',
      'Thread color always matches the bag color. A black bag has black thread; a beige bag has beige thread. Mismatched or slightly off-shade thread is a common tell on fakes.',
      'Check the interior seams as well. The lining stitching should be neat and flat, with no loose threads or fraying. Pull gently at the interior corners — authentic Chanel stitching does not give.',
    ],
  },
  {
    id: 'dustbag',
    title: 'Dust Bag & Box',
    body: [
      "Authentic Chanel dust bags are made from white felt with the Chanel logo printed in gold. The drawstring is black and double — two cords, not one. Older dust bags (pre-2010) may be cream or off-white felt rather than bright white.",
      'The authenticity card is white cardstock, not black. It has the serial number printed in gold on the front, and a holographic sticker on the back. The sticker has micro-text and a distinctive rainbow sheen — it should not peel off cleanly.',
      'The holographic sticker on the auth card should match the serial sticker in the bag exactly. Counterfeiters sometimes get one right but not both — always cross-reference.',
    ],
  },
  {
    id: 'where-to-buy',
    title: 'Where to Buy Safely',
    body: [
      'Vestiaire Collective authenticates every item using AI and human experts before it ships to the buyer. Returns are accepted if authentication fails post-delivery.',
      'The RealReal uses in-house luxury experts to authenticate all handbags. Pricing is transparent and all items are described with condition notes.',
      'For private purchases (eBay, Facebook Marketplace, local resellers), use an independent authentication service like Entrupy ($15-25, AI-based) or Real Authentication ($20-30, human expert). A certificate significantly increases resale value if you plan to sell later.',
    ],
  },
]

export default function HowToAuthenticateChanelPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems.map(({ q, a }) => ({
              '@type': 'Question',
              name: q,
              acceptedAnswer: { '@type': 'Answer', text: a },
            })),
          }),
        }}
      />

      <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">
        Authentication Guide
      </p>
      <h1
        className="text-4xl text-[#1A1A1A] leading-tight mb-4"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        How to Authenticate a Pre-Owned Chanel Bag (2025 Guide)
      </h1>
      <p className="text-[#8C7355] text-sm mb-10">Updated 2025 · 6 min read</p>

      <nav className="mb-10 p-5 border border-[#E8E2D9] bg-[#F5F0E8]">
        <p className="text-xs uppercase tracking-wider text-[#9C8B7A] mb-3">In this guide</p>
        <ol className="space-y-1">
          {sections.map((s, idx) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors"
              >
                {idx + 1}. {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {sections.map(s => (
        <section key={s.id} id={s.id} className="mb-10 scroll-mt-4">
          <h2
            className="text-2xl text-[#1A1A1A] mb-4"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            {s.title}
          </h2>
          <div className="space-y-4">
            {s.body.map((para, i) => (
              <p key={i} className="text-[#6B6052] leading-relaxed">
                {para}
              </p>
            ))}
          </div>
        </section>
      ))}

      <section className="mb-12 bg-[#1A1A1A] text-white p-6">
        <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">Browse Chanel</p>
        <p className="text-[#E8D9C0] mb-4 text-sm leading-relaxed">
          All Chanel listings on our authenticated partner platforms, with pre-owned price data and
          retail comparison.
        </p>
        <Link
          href="/chanel"
          className="inline-block border border-[#B8954A] text-[#B8954A] hover:bg-[#B8954A] hover:text-white px-5 py-2.5 text-sm transition-all duration-200"
        >
          View Chanel Price Guide →
        </Link>
      </section>

      <section className="border-t border-[#E8E2D9] pt-10">
        <h2
          className="text-2xl text-[#1A1A1A] mb-6"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqItems.map(({ q, a }) => (
            <div key={q}>
              <h3 className="font-medium text-[#1A1A1A] mb-2 text-sm">{q}</h3>
              <p className="text-sm text-[#6B6052] leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      <nav className="mt-10 pt-6 border-t border-[#E8E2D9]">
        <p className="text-xs uppercase tracking-wider text-[#9C8B7A] mb-3">Related Price Guides</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/chanel" className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors">All Chanel Prices →</Link>
          <Link href="/chanel/classic-flap-medium" className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors">Classic Flap Price →</Link>
          <Link href="/chanel/boy-medium" className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors">Boy Bag Price →</Link>
          <Link href="/chanel/19-medium-flap" className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors">Chanel 19 Price →</Link>
          <Link href="/guides/luxury-condition-guide" className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors">Condition Guide →</Link>
        </div>
      </nav>
    </article>
  )
}
