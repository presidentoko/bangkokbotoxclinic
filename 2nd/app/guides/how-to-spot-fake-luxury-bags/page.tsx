import type { Metadata } from 'next'
import Link from 'next/link'

const BASE = 'https://www.secondluxuryitems.com'

export const metadata: Metadata = {
  title: 'How to Spot a Fake Luxury Bag: 2025 Authentication Guide',
  description: 'Learn how to spot counterfeit luxury bags. Chanel, Louis Vuitton, Hermès, and Gucci authentication tells — stitching, hardware, date codes, and more.',
  alternates: { canonical: `${BASE}/guides/how-to-spot-fake-luxury-bags` },
}

const generalTells = [
  { label: 'Weight', detail: 'Genuine luxury bags are heavy. High-quality hardware (palladium, gold plating, brass) is dense. If a bag feels light for its size, the hardware is likely low-grade zinc alloy — a counterfeit tell across all brands.' },
  { label: 'Hardware finish', detail: 'Authentic luxury hardware dulls slowly and evenly with age. Counterfeit hardware chips, flakes, or shows uneven plating within months. Rub hardware gently — real gold or palladium plating does not transfer to your finger; cheap plating leaves residue.' },
  { label: 'Stitching', detail: 'Count stitches per centimetre. Luxury brands specify exact stitch counts and enforce them. Uneven spacing, thread that puckers, or stitches at irregular angles all indicate counterfeit origin. The thread color should match the brand specification exactly.' },
  { label: 'Smell', detail: 'Genuine leather has a distinctive natural smell — slightly earthy, sometimes faintly sweet or nutty depending on tannage. Counterfeits often smell of plastic, chemicals, glue, or artificial leather scent. A strong chemical smell on a supposedly leather bag is a serious red flag.' },
  { label: 'Serial numbers', detail: 'Format, font size, placement, and depth of serial numbers vary by brand and era. Research the specific model you are buying — counterfeiters often use the right number format but wrong font, wrong depth, or wrong location.' },
]

const brandTells = [
  {
    brand: 'Chanel',
    tells: [
      'Hologram sticker: every Chanel bag since 1986 has a hologram sticker inside with a serial number that matches a card in the box. The hologram should shift between silver and gold when tilted. Fakes have flat, non-shifting holograms.',
      'CC alignment: on Classic Flap bags, the CC logo on the clasp must be perfectly centred. The left C should be on top at left, the right C on top at right — if reversed, it is a fake.',
      'Quilting: the diamond quilting on lambskin must be perfectly uniform across the entire bag. Any variation in diamond size or stitching depth indicates a counterfeit.',
    ],
  },
  {
    brand: 'Louis Vuitton',
    tells: [
      'Date code: LV embosses a production code inside every bag. For modern pieces, format is two letters (factory code) + two digits (week) + two digits (year). Pre-2007 bags use a different format. No date code at all on a post-1980s bag is a red flag.',
      'Vachetta leather: authentic LV vachetta is ivory cream when new, darkening to honey with use. It should feel supple and slightly rough — not plasticky or too uniform. Bright white or perfectly smooth vachetta is suspicious.',
      'Canvas alignment: the LV monogram is never cut on the seams — it wraps or terminates before the seam line. Counterfeits often have LV letters cut in half at seams.',
    ],
  },
  {
    brand: 'Hermès',
    tells: [
      'Blind stamp: Hermès uses a single letter blind-stamped inside the bag to denote production year (A=1997, B=1998... the system cycles). If the stamp is absent or the letter does not match the claimed age, it is a fake.',
      'Stitching density: Hermès craftspeople stitch 8–9 stitches per centimetre using a saddle-stitch technique with two needles. Fakes typically have 4–6 stitches per centimetre, and machine-stitched seams that look too uniform.',
      'Hardware: Hermès uses genuine palladium or gold plating (18k on gold pieces). Tap the hardware lightly on a hard surface — genuine Hermès hardware produces a clear, resonant ring. Zinc alloy fakes produce a dull thud.',
    ],
  },
  {
    brand: 'Gucci',
    tells: [
      'Serial tag: inside the bag should be a leather tag with two lines: a 6-digit model code (top) and a 10-digit serial number (bottom). The font is thin, precise, and evenly spaced. Fakes often have bold or blurry text.',
      'GG hardware: the interlocked GG motif should be symmetrical and sharp-edged. The G shapes should be identical in size and perfectly aligned. Any asymmetry or soft edges indicate a counterfeit.',
      'Lining: vintage Gucci used dark brown or tan suede-like lining; modern Gucci uses a specific GG-motif textile or clean leather lining. Generic synthetic lining in a supposed designer piece is a serious flag.',
    ],
  },
]

const faqs = [
  {
    q: 'Can you tell if a luxury bag is fake just by looking at photos?',
    a: "Experienced authenticators can identify most fakes from photos, but high-quality super-fakes require physical examination. Hologram stickers, hardware weight, stitching depth, and smell cannot be assessed from photos alone. For purchases over $500, always require physical authentication.",
  },
  {
    q: 'What are super-fakes and how dangerous are they?',
    a: "Super-fakes are high-quality counterfeits that use genuine leather, correct hardware weight, and accurate serial numbers. They are most common for Chanel and Hermès bags. The counterfeit Hermès market is the most sophisticated — some super-fakes fool inexperienced resellers. Services like Entrupy use AI and microscopy to detect even super-fakes through material analysis.",
  },
  {
    q: 'Which authentication services are most reliable?',
    a: "Entrupy uses AI microscopy to authenticate luxury goods with a digital certificate — highly accurate for LV, Gucci, Chanel, and Dior. LegitGrails is a popular manual authentication service used by many platforms. REAL Authentication specializes in Hermès. For platform purchases, Vestiaire Collective and The RealReal authenticate in-house before listing.",
  },
  {
    q: 'Should I buy luxury bags from private sellers?',
    a: "Only from private sellers with documented provenance: original receipt, complete accessories set (box, dust bag, care card), and willingness to allow independent authentication before purchase. For bags over $1,000, commission a third-party authentication service before sending payment. Never pay by wire transfer to a private seller — use a platform with buyer protection or a credit card that supports chargebacks.",
  },
]

export default function HowToSpotFakeLuxuryBagsPage() {
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

      <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">Authentication Guide</p>
      <h1
        className="text-4xl text-[#1A1A1A] leading-tight mb-4"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        How to Spot a Fake Luxury Bag (2025 Guide)
      </h1>
      <p className="text-[#8C7355] text-sm mb-10">Updated 2025 · Covers Chanel, LV, Hermès, Gucci</p>

      <section className="mb-10">
        <p className="text-[#6B6052] leading-relaxed">
          The counterfeit luxury market generates an estimated $500 billion annually. Super-fakes have become convincing enough to fool platforms and inexperienced buyers. These are the key authentication tells that separate genuine from fake.
        </p>
      </section>

      <section className="mb-10">
        <h2
          className="text-2xl text-[#1A1A1A] mb-6"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Universal Authentication Tells
        </h2>
        <ul className="space-y-4">
          {generalTells.map(({ label, detail }) => (
            <li key={label} className="flex gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-[#B8954A] shrink-0" />
              <div>
                <span className="font-medium text-[#1A1A1A]">{label}: </span>
                <span className="text-sm text-[#6B6052]">{detail}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2
          className="text-2xl text-[#1A1A1A] mb-6"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Brand-Specific Authentication
        </h2>
        <div className="space-y-8">
          {brandTells.map(({ brand, tells }) => (
            <div key={brand}>
              <h3
                className="text-lg text-[#1A1A1A] mb-4 border-b border-[#E8E2D9] pb-2"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                {brand}
              </h3>
              <ul className="space-y-3">
                {tells.map((tell, i) => (
                  <li key={i} className="flex gap-3 text-sm text-[#6B6052]">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#E8E2D9] shrink-0" />
                    {tell}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
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

      <div className="mt-10 pt-6 border-t border-[#E8E2D9] flex flex-wrap gap-6">
        <Link href="/guides/how-to-authenticate-chanel" className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors">
          Authenticate Chanel →
        </Link>
        <Link href="/guides/how-to-authenticate-louis-vuitton" className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors">
          Authenticate Louis Vuitton →
        </Link>
        <Link href="/guides/how-to-authenticate-hermes" className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors">
          Authenticate Hermès →
        </Link>
      </div>
    </article>
  )
}
