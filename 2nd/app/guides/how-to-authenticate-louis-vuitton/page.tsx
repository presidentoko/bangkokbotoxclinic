import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Authenticate a Pre-Owned Louis Vuitton Bag 2025',
  description:
    'How to spot a fake Louis Vuitton bag. Check date codes, Monogram canvas, hardware, stitching, and heat stamps before buying pre-owned LV.',
  alternates: {
    canonical: 'https://www.secondluxuryitems.com/guides/how-to-authenticate-louis-vuitton',
  },
}

const faqItems = [
  {
    q: 'How do I check if a Louis Vuitton bag is authentic?',
    a: 'Check the date code stamped inside (format: two letters + four numbers indicating factory + month/year), inspect the heat stamp font inside the bag (clean, deep, even), and verify Monogram canvas alignment — the LV initials should never be cut off at the seams on intentional design lines. Buy from authenticated platforms for certainty.',
  },
  {
    q: 'Where is the date code on a Louis Vuitton bag?',
    a: 'LV date codes are stamped (not stitched or on a sticker) on the lining, usually on a leather tab, interior pocket, or flat against the lining. Common locations: inside a zippered pocket, on a small leather flap near the zipper, or on the lining near a seam. Some bags have it on the exterior strap hardware.',
  },
  {
    q: 'What does the LV date code mean?',
    a: 'The format is two letters (factory code) followed by four numbers. For bags made before 2007: the numbers indicate month and year in alternating digits — e.g., SD0051 means SD factory, made in January 2005. Post-2007 format: the first and third digits = week, second and fourth = year. E.g., VI1013 means week 10 of 2013.',
  },
  {
    q: 'Is LV Monogram canvas real leather?',
    a: 'No — Monogram canvas is a coated canvas (PVC over cotton), not leather. That is intentional and is not a sign of a fake. It is also never stitched, printed, or embossed — it is heat-stamped, giving it a uniform, tactile texture. The canvas should feel firm and slightly waxy, not soft or flimsy.',
  },
  {
    q: 'What are the most common fake Louis Vuitton signs?',
    a: 'Symmetrical Monogram pattern at seams (real LV canvas intentionally has asymmetric cuts at seams on most models), mustard-yellow stitching that looks orange or too bright, hardware that feels light or flakes gold, heat stamp font that is thin or uneven, and date codes on stickers rather than stamped directly into the material.',
  },
]

const sections = [
  {
    id: 'date-code',
    title: 'The Date Code',
    body: [
      'Louis Vuitton does not use serial numbers — they use date codes stamped directly into the lining or a leather tab inside the bag. The code consists of two letters (factory of origin) followed by four numbers (production date).',
      'Pre-2007 date code format: the four digits represent month and year in an alternating pattern. The 1st and 3rd digits = month; the 2nd and 4th digits = year. Example: SD0052 → SD factory, May 2002.',
      'Post-2007 date code format: the 1st and 3rd digits = production week; the 2nd and 4th digits = year. Example: AR1013 → AR factory, week 10 of 2013. The date code is always stamped, never on a sticker or embossed label.',
    ],
  },
  {
    id: 'monogram',
    title: 'Monogram Canvas',
    body: [
      'LV Monogram canvas is a coated PVC canvas, not leather — this is correct and intentional. It should feel firm, slightly waxy, and warm to the touch. The texture is uniform across the entire surface with no soft or floppy sections.',
      'The Monogram pattern is heat-stamped, not printed or embossed separately. Running your fingernail lightly across the canvas, you should feel a subtle texture from the pattern, not a flat surface with applied graphics.',
      'Canvas alignment at seams: on most LV models, the Monogram pattern is deliberately asymmetric where pieces of canvas are joined. However the LV initials and flower motifs should never be partially cut through in the center of a visible design area — asymmetry at edges is fine, slicing through a central motif is not.',
    ],
  },
  {
    id: 'hardware',
    title: 'Hardware',
    body: [
      'Authentic LV hardware is made from brass and develops a natural golden-brown patina over time. New hardware is bright brass-gold; aged hardware turns a warm amber-brown. This patina is gradual and even across all hardware pieces — not flaky, not peeling.',
      'Hardware that looks orange-gold, has a plastic-y shine, or feels lightweight is a red flag. Genuine LV clasps, D-rings, and locks have weight and a matte-to-satin finish, not a high-gloss chrome look.',
      'Padlocks on LV bags (where included) should have a brass-colored key that fits smoothly. The lock should have "Louis Vuitton Paris" engraved cleanly, not stamped or printed. The number on the lock matches the number on the key.',
    ],
  },
  {
    id: 'stitching',
    title: 'Stitching',
    body: [
      'Louis Vuitton uses a distinctive mustard-yellow thread on all Monogram canvas bags. The shade is a warm, muted yellow — not bright orange, not pale cream. If the stitching looks orange or neon-yellow, that is a common sign of a replica.',
      'Stitch count should be consistent: approximately 5 stitches per centimeter on most models. Stitches are even, tight, and angled slightly. There should be no loose threads, skipped stitches, or fraying anywhere on the exterior.',
      'Interior stitching on leather-lined bags (like the Neverfull) should be as clean as the exterior. Check corners, where the base meets the sides, and the area around handles.',
    ],
  },
  {
    id: 'heat-stamp',
    title: 'Heat Stamp',
    body: [
      'Every authentic LV bag has "Louis Vuitton Paris" and "Made in [country]" stamped in gold or silver inside the bag. The font is a specific sans-serif — letters are evenly spaced, well-defined, and pressed cleanly into the material without bleeding or blurring.',
      'The depth of the stamp is important: authentic stamps are pressed with consistent pressure, so all letters sit at the same depth. Fake stamps are often too shallow (barely visible) or uneven (some letters deeper than others).',
      'Older LV bags (pre-1980s) may not have "Made in" text — this is normal. Bags made from the 1980s onward include it. The country of manufacture is typically France, Spain, or the USA for LV.',
    ],
  },
]

export default function HowToAuthenticateLouisVuittonPage() {
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
        How to Authenticate a Pre-Owned Louis Vuitton Bag (2025 Guide)
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
        <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">
          Browse Louis Vuitton
        </p>
        <p className="text-[#E8D9C0] mb-4 text-sm leading-relaxed">
          Pre-owned LV prices across all models — Neverfull, Speedy, Alma, Pochette Metis, and more.
        </p>
        <Link
          href="/louis-vuitton"
          className="inline-block border border-[#B8954A] text-[#B8954A] hover:bg-[#B8954A] hover:text-white px-5 py-2.5 text-sm transition-all duration-200"
        >
          View Louis Vuitton Price Guide →
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
