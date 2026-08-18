import type { Metadata } from 'next'
import Link from 'next/link'
import { PRICE_YEAR } from '@/lib/site'

export const metadata: Metadata = {
  title: 'How to Authenticate a Pre-Owned Hermès Scarf or Bag | SecondLuxuryItems',
  description:
    'Complete Hermès authentication guide for scarves and bags. Hand-rolled hems, blind stamps, saddle stitching, and where to buy safely.',
  alternates: {
    canonical: 'https://www.secondluxuryitems.com/guides/how-to-authenticate-hermes',
  },
}

const faqItems = [
  {
    q: 'How do I authenticate a Hermès scarf?',
    a: 'Check for the hand-rolled hem (hand-stitched, not machine-sewn), look for the artist signature woven into the design, verify "Hermès Paris" appears in small text in the border, and confirm the silk weight is substantial. Post-2007 scarves have a small © with year in the border.',
  },
  {
    q: 'What is the Hermès blind stamp and where is it?',
    a: "The blind stamp is a small letter embossed inside the bag near the strap attachment. Each letter represents a production year — for example, A=1945, then cycling with different symbols. From 2014 onward, Hermès uses a letter inside a square. From 2021, the system changed again. The blind stamp confirms year of manufacture.",
  },
  {
    q: 'How many stitches per inch does authentic Hermès use?',
    a: 'Hermès uses saddle stitch — a two-needle hand-stitching technique. Authentic pieces have 8-9 stitches per inch (approximately), extremely even and consistent throughout. This hand-stitching is one of the hardest details to replicate because machines cannot produce the same result.',
  },
  {
    q: 'Are Hermès bags the most counterfeited luxury item?',
    a: 'Yes, along with Chanel and Louis Vuitton. Hermès Birkin and Kelly bags are the most counterfeited luxury handbags in the world due to their extreme retail prices and waiting lists. Even high-quality fakes fail on the blind stamp, saddle stitch count, and hardware engraving details.',
  },
  {
    q: 'Where should I buy a pre-owned Hermès bag?',
    a: 'Vestiaire Collective and specialist Hermès resellers like Privé Porter or Madison Avenue Couture are the safest options. Use authentication services like Authenticate4u or Real Authentication for private purchases. Never buy from unverified sellers due to the volume and quality of Hermès counterfeits.',
  },
]

const scarfSections = [
  {
    id: 'scarf-hem',
    title: 'Hand-Rolled Hem',
    body: [
      "Every authentic Hermès scarf has a hand-stitched rolled hem. Run your finger along the edge — you should feel the slight ridge of the hand-rolled and hand-sewn border. It is not machine-sewn and will not be perfectly uniform, which is actually part of the authentication.",
      "On counterfeits, the hem is typically machine-sewn and sits flat. It feels different to the touch — smoother and more uniform. On authentic scarves, you can feel slight irregularities that confirm hand-work.",
    ],
  },
  {
    id: 'scarf-signature',
    title: 'Signature in Pattern',
    body: [
      "The artist who designed the scarf's illustration has their name woven into the design itself — usually at the bottom of the central image. Look closely at the graphic and find the artist credit.",
      "Additionally, 'Hermès Paris' appears in small text woven into the border. It is subtle and requires close inspection. The text should be crisp and legible even at small scale.",
    ],
  },
  {
    id: 'scarf-silk',
    title: 'Silk Quality',
    body: [
      "Authentic Hermès scarves are 100% silk with a weight and drape unlike any other silk product. The fabric feels substantial — not lightweight or thin. Colors are extremely vibrant and resist bleeding even after decades of use.",
      "Post-2007 scarves have a small copyright symbol and year woven into the border, providing an additional date reference. Pre-2007 pieces can be dated by the pattern and artist signature.",
    ],
  },
]

const bagSections = [
  {
    id: 'blind-stamp',
    title: 'Blind Stamp',
    body: [
      "Every Hermès leather bag has a blind stamp embossed inside, near the strap attachment or inside the flap. A letter (and in some eras, a symbol) represents the production year. The letter coding runs A through Z and then restarts with different accompanying symbols.",
      "The current system (post-2014): a single letter inside a square. Pre-2014: a letter inside a circle. Before that: a plain letter. This system allows precise dating of any Hermès bag. Counterfeiters often get the letter right but use incorrect framing or proportions.",
      "The craftsman's stamp (a number) also appears nearby. Each Hermès artisan who finishes a bag stamps it with their individual identifier — authentic bags will have this artisan mark.",
    ],
  },
  {
    id: 'stitching',
    title: 'Stitching',
    body: [
      "Hermès uses saddle stitch — a two-needle technique done entirely by hand. This creates a different visual and structural result than machine stitching. With saddle stitch, if one thread breaks, the stitch holds because it is interlocked through the same holes.",
      "The count: approximately 8-9 stitches per inch, perfectly even throughout the bag. The tension is consistent — no stitches that sit looser or tighter than their neighbors. This level of consistency is what makes it identifiable as hand-work rather than machine-work.",
      "Thread color on authentic Hermès always matches the leather or is a carefully considered contrast. The thread itself is linen (on older pieces) or waxed linen — not cotton or nylon.",
    ],
  },
  {
    id: 'hardware',
    title: 'Hardware',
    body: [
      "Hermès hardware is solid and heavy — palladium-plated or gold-plated over solid brass. It feels substantial in the hand. The turnlock mechanism on a Birkin or Kelly should operate smoothly with a satisfying resistance — not too loose, not stiff.",
      "On the clasp, 'Hermès Paris' is engraved — not stamped or printed. The engraving is deep and precise. The lettering uses the Hermès house font, which is distinctive. Counterfeits often have slightly thicker or thinner letterforms.",
      "Palladium hardware has a bright, slightly cool silver tone. Gold hardware has a warm, deep gold. Neither should show any plating wear on new or recent pieces. Legitimate vintage Hermès will show appropriate age on hardware.",
    ],
  },
  {
    id: 'where-to-authenticate',
    title: 'Where to Authenticate',
    body: [
      "Hermès bags are among the most counterfeited luxury goods in the world. Even experienced buyers can be deceived by high-quality fakes. Independent authentication is essential for any private purchase.",
      "Vestiaire Collective authenticates all Hermès pieces using specialists before shipping. Privé Porter and Madison Avenue Couture specialize in Hermès and have deep expertise. For third-party authentication certificates, Authenticate4u and Real Authentication are well-regarded.",
      "Budget for authentication: $30-80 for a certificate from a reputable service. On a bag that may cost $10,000-40,000, this is non-negotiable due diligence.",
    ],
  },
]

export default function HowToAuthenticateHermesPage() {
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
        How to Authenticate a Pre-Owned Hermès Scarf or Bag
      </h1>
      <p className="text-[#8C7355] text-sm mb-10">Updated {PRICE_YEAR} · 8 min read</p>

      <nav className="mb-10 p-5 border border-[#E8E2D9] bg-[#F5F0E8]">
        <p className="text-xs uppercase tracking-wider text-[#9C8B7A] mb-3">In this guide</p>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-[#9C8B7A] uppercase tracking-wider mb-1">Scarves</p>
            <ol className="space-y-1">
              {scarfSections.map((s, idx) => (
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
          </div>
          <div>
            <p className="text-xs text-[#9C8B7A] uppercase tracking-wider mb-1">Bags</p>
            <ol className="space-y-1">
              {bagSections.map((s, idx) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors"
                  >
                    {idx + 1 + scarfSections.length}. {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </nav>

      <h2
        className="text-3xl text-[#1A1A1A] mb-6"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        Authenticating Hermès Scarves
      </h2>

      {scarfSections.map(s => (
        <section key={s.id} id={s.id} className="mb-10 scroll-mt-4">
          <h3
            className="text-2xl text-[#1A1A1A] mb-4"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            {s.title}
          </h3>
          <div className="space-y-4">
            {s.body.map((para, i) => (
              <p key={i} className="text-[#6B6052] leading-relaxed">
                {para}
              </p>
            ))}
          </div>
        </section>
      ))}

      <h2
        className="text-3xl text-[#1A1A1A] mb-6 mt-12 pt-10 border-t border-[#E8E2D9]"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        Authenticating Hermès Bags
      </h2>

      {bagSections.map(s => (
        <section key={s.id} id={s.id} className="mb-10 scroll-mt-4">
          <h3
            className="text-2xl text-[#1A1A1A] mb-4"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            {s.title}
          </h3>
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
        <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">Browse Hermès</p>
        <p className="text-[#E8D9C0] mb-4 text-sm leading-relaxed">
          All Hermès listings on our authenticated partner platforms, with pre-owned price data and
          retail comparison.
        </p>
        <Link
          href="/hermes"
          className="inline-block border border-[#B8954A] text-[#B8954A] hover:bg-[#B8954A] hover:text-white px-5 py-2.5 text-sm transition-all duration-200"
        >
          View Hermès Price Guide →
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
