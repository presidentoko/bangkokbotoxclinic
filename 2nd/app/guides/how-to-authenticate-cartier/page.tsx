import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Authenticate Pre-Owned Cartier Jewelry | SecondLuxuryItems',
  description:
    'Complete guide to authenticating Cartier jewelry pre-owned. Hallmarks, laser engraving, Love Bracelet screws, and certificates.',
  alternates: {
    canonical: 'https://www.secondluxuryitems.com/guides/how-to-authenticate-cartier',
  },
}

const faqItems = [
  {
    q: 'What hallmarks should authentic Cartier gold pieces have?',
    a: "Authentic Cartier gold pieces have 750 stamped for 18k gold (or 950 for platinum), plus the Cartier maker's mark. These hallmarks are tiny and require a jeweler's loupe to read clearly. The stamps should be crisp and precise — not blurry or shallow.",
  },
  {
    q: 'How do I check the serial number on a Cartier piece?',
    a: 'Post-2000 Cartier pieces have a laser-engraved serial number on an inner surface — inside the bracelet band, inside a ring shank, or on the interior of a brooch. It is microscopic and requires 10x magnification. The number should match any certificate of authenticity.',
  },
  {
    q: 'How do I authenticate a Cartier Love Bracelet?',
    a: "Check that screws are uniform slot-head (not Phillips/cross-head) and sit flush when tightened. The bracelet should be solid and heavy — not hollow. The 'Cartier' engraving inside uses the distinctive Cartier font. A certificate with serial number matching the bracelet engraving is the strongest authentication.",
  },
  {
    q: 'Does authentic Cartier come with a certificate?',
    a: "Yes — Cartier issues a white booklet certificate of authenticity with each piece. The serial number inside the certificate matches the laser engraving on the jewelry. Pre-2000s pieces may lack certificates, but the hallmarks and Cartier-specific font on engravings are still authentication markers.",
  },
]

const sections = [
  {
    id: 'hallmarks',
    title: 'Hallmarks',
    body: [
      "All authentic Cartier gold pieces carry hallmarks on an inner surface — typically the inside of a bracelet band or the inner shank of a ring. The mark '750' indicates 18 karat gold (75% pure gold). '950' indicates platinum. These numbers are accompanied by Cartier's maker's mark.",
      "Hallmarks are small and require a jeweler's loupe (10x magnification) to read clearly. On authentic Cartier, the stamps are precise and crisp — not blurry, shallow, or inconsistently sized. If you cannot read the hallmark clearly under magnification, have it examined by a professional jeweler before purchasing.",
      "Country of origin hallmarks may also appear — French pieces carry the owl mark (eagle head for import) as a guarantee mark. These additional hallmarks are a positive sign but not required on all markets. Focus primarily on the '750' or '950' and the Cartier maker's mark.",
    ],
  },
  {
    id: 'laser-engraving',
    title: 'Laser Engraving',
    body: [
      "Cartier has laser-engraved a serial number on all pieces produced after approximately 2000. The engraving appears on an interior surface: inside the bracelet band, inside the ring shank, on the clasp interior of a necklace.",
      "The engraving is microscopic — not visible to the naked eye. A 10x jeweler's loupe is required. Under magnification, the characters should be sharp and uniform. The serial number format varies by collection but is always machine-precise.",
      "This serial number is the piece's unique identifier and matches what appears in Cartier's certificate of authenticity. If a certificate is present, always verify that the number matches. If they don't match, either the certificate or the piece is not authentic.",
    ],
  },
  {
    id: 'weight',
    title: 'Weight and Build Quality',
    body: [
      "Authentic Cartier jewelry uses solid metal — not hollow tubing or plated base metals. The weight of a genuine Cartier piece is immediately noticeable. A Love Bracelet in 18k gold should be substantial and feel dense in the hand.",
      "The LOVE bracelet specifically: authentic versions weigh approximately 30-38g for a standard size in 18k yellow gold, depending on size and whether it has diamonds. The bracelet walls are thick and do not flex. Counterfeits often use thinner-walled construction that flexes slightly or feels light.",
      "Compare the heft of a Trinity Ring, Love Ring, or any piece to what you expect from solid 18k gold. If it feels light or hollow when tapped lightly, it is not solid gold.",
    ],
  },
  {
    id: 'love-screws',
    title: 'Screws on the Love Bracelet',
    body: [
      "The signature screw detail on the Cartier Love Bracelet is one of the most scrutinized authentication points. Authentic Love Bracelet screws are slot-head (a single horizontal groove) — not Phillips or cross-head. This is critical: any Love Bracelet with Phillips-head screws is counterfeit.",
      "When fully tightened, authentic screws sit flush with the bracelet surface. They do not protrude. The screw heads are uniform in size and the slot groove is precisely centered.",
      "The screwdriver provided by Cartier matches the screw head exactly. If you are examining a piece with a screwdriver, it should engage smoothly and turn without any wobble or slipping.",
    ],
  },
  {
    id: 'certificate',
    title: 'Certificate and Packaging',
    body: [
      "Cartier issues a certificate of authenticity in a white booklet format. The serial number is printed inside and should match the laser engraving on the piece exactly. The certificate uses Cartier's typography consistently — the same font across all text.",
      "Original Cartier packaging is a red box with gold Cartier logo on the lid. The box quality is high — sturdy, with precise closing mechanism and consistent red color. The interior has a white pillow or tray appropriate for the piece type.",
      "Not all pre-owned Cartier will come with original certificate or box — that is normal and not an authentication failure. Authentication in the absence of certificate relies on hallmarks, laser engraving, and physical characteristics of the piece itself.",
    ],
  },
]

export default function HowToAuthenticateCartierPage() {
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
        How to Authenticate Pre-Owned Cartier Jewelry
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
        <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">Browse Cartier</p>
        <p className="text-[#E8D9C0] mb-4 text-sm leading-relaxed">
          All Cartier listings on our authenticated partner platforms, with pre-owned price data and
          retail comparison.
        </p>
        <Link
          href="/cartier"
          className="inline-block border border-[#B8954A] text-[#B8954A] hover:bg-[#B8954A] hover:text-white px-5 py-2.5 text-sm transition-all duration-200"
        >
          View Cartier Price Guide →
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
