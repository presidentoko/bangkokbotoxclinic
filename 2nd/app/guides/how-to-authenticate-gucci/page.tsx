import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Authenticate a Pre-Owned Gucci Bag: 2025 Guide | SecondLuxuryItems',
  description:
    'Step-by-step Gucci authentication guide. Serial numbers, GG canvas, hardware, and interior details — know the signs of a genuine Gucci bag.',
  alternates: {
    canonical: 'https://www.secondluxuryitems.com/guides/how-to-authenticate-gucci',
  },
}

const faqItems = [
  {
    q: 'How do I check if a Gucci bag is authentic?',
    a: 'Check the serial number inside (two-row format: style number on top, serial on bottom), verify the GG canvas interlocking pattern is tight and even, confirm hardware is solid brass with Lampo or Riri zippers, and check the "Gucci" stamp inside is in an elegant, non-bold font. Buy from authenticated platforms for guaranteed peace of mind.',
  },
  {
    q: 'What serial number format does Gucci use?',
    a: 'Gucci serial numbers appear on a leather tab inside the bag in two rows. The top row is the style/model number; the bottom row is the serial number. Font is crisp and evenly spaced. Pre-2000s Gucci bags may have different formats — a date code rather than a two-row serial.',
  },
  {
    q: 'What zipper brands does authentic Gucci use?',
    a: 'Authentic Gucci bags use Lampo zippers on older pieces (pre-2010) and Riri on more recent bags. Both are high-quality Italian zipper manufacturers. The zipper pull will have the manufacturer name engraved on it. Cheap counterfeit zippers feel light and often have no engraving or blurry text.',
  },
  {
    q: 'How do I authenticate Gucci GG canvas?',
    a: 'The GG monogram canvas should have a tight, even pattern with properly interlocking G letters. The G\'s should be symmetrical and the pattern should align correctly at seams. Counterfeit GG canvas often has slightly off spacing or G\'s that don\'t interlock cleanly. Stitching along canvas edges is perfectly even on authentic pieces.',
  },
  {
    q: 'Is The RealReal reliable for Gucci authentication?',
    a: 'Yes — The RealReal employs trained luxury experts who physically inspect every item. They are one of the most established platforms for pre-owned Gucci. Vestiaire Collective uses AI plus human authentication. Both offer money-back guarantees if an authenticated item turns out to be counterfeit.',
  },
]

const sections = [
  {
    id: 'serial',
    title: 'The Serial Number',
    body: [
      "All Gucci bags produced since the 1990s contain a serial number on a leather tab inside. The format is two rows: the top row is the style/model number, the bottom row is the individual serial number. On authentic pieces, the font is crisp, even, and consistent throughout.",
      "The leather tab itself should be firmly attached — not peeling or loose. The font used is a clean, slightly condensed typeface. Counterfeits often use bold or poorly-spaced lettering that looks slightly off even to untrained eyes.",
      "Pre-1990s Gucci bags may not have the two-row serial format. Vintage pieces sometimes use different authentication methods — if buying very old Gucci, consult a specialist for that era's specific markers.",
    ],
  },
  {
    id: 'gg-canvas',
    title: 'GG Canvas',
    body: [
      "Authentic GG canvas has a tight, even pattern where the interlocking G's are precisely formed and consistent across the entire piece. The G's should interlock at clearly defined points — not merged or disconnected.",
      "At seams and edges, the GG pattern should align as neatly as possible. Gucci is careful about pattern placement at key areas like the flap edge and handles. Counterfeit canvas often shows misalignment or the pattern continuing incorrectly across a seam.",
      "The stitching along canvas edges is even and consistent, using thread that matches the canvas color. Irregular stitch spacing or visible thread ends at any point indicate a counterfeit.",
    ],
  },
  {
    id: 'hardware',
    title: 'Hardware',
    body: [
      "Gucci uses solid brass for hardware — it feels weighty and dense. When you tap it lightly, it should sound solid, not hollow. The surface finish should be even with no peeling, flaking, or color inconsistency.",
      "Zippers on authentic Gucci are made by Lampo (older pieces) or Riri (newer pieces). Both are premium Italian zipper manufacturers. The zipper pull will have the manufacturer name engraved — check that this text is sharp and legible.",
      "The GG logo hardware on clasps, rings, and D-rings should be weighty and well-finished. The two interlocking G's should be evenly rendered and identical in proportion. Logo hardware that looks slightly different between two G's is a common tell on fakes.",
    ],
  },
  {
    id: 'interior',
    title: 'Interior',
    body: [
      "Inside every authentic Gucci bag, the word 'Gucci' is stamped into a leather tab or patch — typically near the main opening or on the interior center panel. The font used is elegant and clean, never bold or heavy. Counterfeit interior stamps often use incorrect fonts.",
      "Interior lining quality varies by bag tier. Entry-level Gucci (GG canvas) uses fabric lining; leather bags have leather or suede interiors. In both cases, stitching is neat and flat with no loose threads.",
      "Check interior pockets for serial number tab placement. The tab should be firmly sewn, flat, and clean. Peeling, lifting, or stiff tags are common on counterfeits.",
    ],
  },
  {
    id: 'dustbag',
    title: 'Dust Bag',
    body: [
      "Authentic Gucci dust bags use a drawstring closure (not zipper) in beige or cream fabric with 'Gucci' written in light gold lettering. The fabric should feel substantial — not thin or shiny. Cheap polyester fabric is a red flag.",
      "The 'Gucci' text on the dust bag is not metallic or shiny — it is a matte, woven-style gold tone. Counterfeit dust bags often use shiny metallic lettering that looks flashy rather than understated.",
      "Not all pre-owned Gucci bags include their original dust bag — absence of a dust bag alone is not proof of a counterfeit. But if a dust bag is present, check its quality carefully.",
    ],
  },
]

export default function HowToAuthenticateGucciPage() {
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
        How to Authenticate a Pre-Owned Gucci Bag (2025 Guide)
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
        <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">Browse Gucci</p>
        <p className="text-[#E8D9C0] mb-4 text-sm leading-relaxed">
          All Gucci listings on our authenticated partner platforms, with pre-owned price data and
          retail comparison.
        </p>
        <Link
          href="/gucci"
          className="inline-block border border-[#B8954A] text-[#B8954A] hover:bg-[#B8954A] hover:text-white px-5 py-2.5 text-sm transition-all duration-200"
        >
          View Gucci Price Guide →
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
    </article>
  )
}
