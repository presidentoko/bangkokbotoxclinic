import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How to Clean and Care for Pre-Owned Luxury Bags | SecondLuxuryItems',
  description:
    'Step-by-step care guide for pre-owned Chanel, LV, Hermès bags. Cleaning, storage, conditioning leather, and hardware care.',
  alternates: {
    canonical: 'https://www.secondluxuryitems.com/guides/how-to-care-for-luxury-bags',
  },
}

const faqItems = [
  {
    q: 'How do you clean a pre-owned Chanel bag?',
    a: 'Use a dry, soft cloth for lambskin. For caviar leather, a barely damp cloth with mild leather cleaner works well. Never use alcohol or water on lambskin — it causes permanent water staining and can crinkle the leather. For any stain on lambskin, take it directly to a professional.',
  },
  {
    q: 'How should you store a luxury bag when not using it?',
    a: "In its dust bag, stuffed with acid-free tissue paper to maintain shape. Store upright, never stacked. Avoid plastic bags which trap moisture and can cause mildew on leather. Keep away from direct sunlight and heat sources — both fade leather and hardware over time.",
  },
  {
    q: 'How often should you condition a leather bag?',
    a: '2-3 times per year for bags in regular use, once a year for pieces used occasionally. Use a quality leather conditioner like Leather Honey or Apple Garde Rain & Stain Repellent. Always test on a hidden interior seam first — some conditioners can darken lighter leathers.',
  },
  {
    q: 'Can you restore a worn pre-owned luxury bag?',
    a: 'Yes — handle re-dyeing, leather conditioning, interior cleaning, and hardware polishing can significantly improve condition. Professional services like Bag Spa, Leather Surgeons, or Couture Cleaners charge $50-200 depending on work needed. Color transfer and deep handle darkening are the most common restoration requests.',
  },
]

const materialSections = [
  {
    material: 'Lambskin (Chanel)',
    instructions: [
      'Use a soft, dry microfiber cloth only — never wet.',
      'Never use water, alcohol, or any liquid cleaner directly on lambskin.',
      'For stains, go immediately to a professional cleaner. Attempting home stain removal typically makes damage permanent.',
      'Lambskin scratches easily — store stuffed and in its dust bag at all times.',
    ],
  },
  {
    material: 'Canvas (LV Monogram, Damier)',
    instructions: [
      'Wipe with a slightly damp cloth and a tiny amount of mild soap (pH neutral).',
      'Avoid getting the leather trim wet — tape off leather sections if possible.',
      'Dry immediately with a clean cloth. Canvas can handle light moisture; the leather trim cannot.',
      'Vachetta leather trim (honey-colored) will naturally darken (patina) over time — this is expected and desirable.',
    ],
  },
  {
    material: 'Caviar Leather (Chanel)',
    instructions: [
      'Most durable Chanel leather — gentle leather cleaner applied with a soft cloth is appropriate.',
      'Wipe in circular motions, then buff dry.',
      'Conditioning 2-3x per year helps maintain the pebbled texture.',
      'Hardware scratches are more visible on caviar than lambskin — use a polishing cloth on metal parts separately.',
    ],
  },
  {
    material: 'Saffiano Leather (Prada)',
    instructions: [
      'The most durable luxury bag leather — cross-hatch texture resists scratches and water.',
      'Clean with a barely damp cloth. Mild soap is fine for dirt.',
      'No conditioner needed — the wax coating on Saffiano does not absorb conditioners well.',
      'Avoid abrasive cloths which can flatten the distinctive texture.',
    ],
  },
]

export default function HowToCareForLuxuryBagsPage() {
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

      <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">Care Guide</p>
      <h1
        className="text-4xl text-[#1A1A1A] leading-tight mb-4"
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        How to Care for a Pre-Owned Luxury Bag
      </h1>
      <p className="text-[#8C7355] text-sm mb-10">Updated 2025 · 7 min read</p>

      <nav className="mb-10 p-5 border border-[#E8E2D9] bg-[#F5F0E8]">
        <p className="text-xs uppercase tracking-wider text-[#9C8B7A] mb-3">In this guide</p>
        <ol className="space-y-1">
          {[
            { id: 'cleaning', label: 'Cleaning by Material' },
            { id: 'hardware', label: 'Hardware Care' },
            { id: 'storage', label: 'Storage' },
            { id: 'conditioning', label: 'Conditioning Leather' },
            { id: 'professional', label: 'When to Get Professional Help' },
          ].map(({ id, label }, idx) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className="text-sm text-[#B8954A] hover:text-[#8C7355] transition-colors"
              >
                {idx + 1}. {label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <section id="cleaning" className="mb-10 scroll-mt-4">
        <h2
          className="text-2xl text-[#1A1A1A] mb-6"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Cleaning by Material
        </h2>
        <div className="space-y-6">
          {materialSections.map(({ material, instructions }) => (
            <div key={material} className="border border-[#E8E2D9] p-5">
              <h3
                className="text-lg text-[#1A1A1A] mb-3"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                {material}
              </h3>
              <ul className="space-y-2">
                {instructions.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#B8954A] shrink-0" />
                    <p className="text-sm text-[#6B6052] leading-relaxed">{step}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="hardware" className="mb-10 scroll-mt-4">
        <h2
          className="text-2xl text-[#1A1A1A] mb-4"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Hardware Care
        </h2>
        <p className="text-[#6B6052] leading-relaxed mb-4">
          Luxury bag hardware requires different care depending on the finish. The wrong approach can
          permanently damage plating that is expensive to restore.
        </p>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-[#1A1A1A] mb-2">Brass hardware</h3>
            <p className="text-[#6B6052] text-sm leading-relaxed">
              Use a dry polishing cloth — the kind included with most watches. Buff in small
              circular motions. Avoid any chemical cleaners, which can strip the protective coating.
              Some tarnish is normal and expected on brass; excessive darkening can be addressed by
              a professional.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-[#1A1A1A] mb-2">Gold-plated hardware</h3>
            <p className="text-[#6B6052] text-sm leading-relaxed">
              Water is the enemy of gold plating. Even minor moisture exposure accelerates
              wear-through. Dry cloth only. Never use silver polish or brass cleaner on
              gold-plated hardware — the abrasives remove the plating. Once gold plating is worn
              through, re-plating costs $80-200 at specialist restorers.
            </p>
          </div>
        </div>
      </section>

      <section id="storage" className="mb-10 scroll-mt-4">
        <h2
          className="text-2xl text-[#1A1A1A] mb-4"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Storage
        </h2>
        <p className="text-[#6B6052] leading-relaxed mb-4">
          How you store a bag between uses matters as much as how you clean it. Poor storage causes
          shape loss, leather cracking, and hardware tarnish — none of which can be fully reversed.
        </p>
        <ul className="space-y-3">
          {[
            'Stuff with acid-free tissue paper to maintain shape — never newspaper, which transfers ink.',
            'Always use the dust bag. If the original is lost, a breathable cotton pillowcase works.',
            "Store upright, not stacked. Stacking crushes handles and distorts the bag's structure.",
            'Never hang by handles — this stretches the handle attachment points over time.',
            'Keep away from direct sunlight, which fades leather and discolors canvas.',
            'Avoid plastic bags, which trap moisture and can cause mold inside the lining.',
            'For bags with chain straps, wrap the chain in tissue to prevent impressions on leather.',
          ].map((tip, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-[#B8954A] shrink-0" />
              <p className="text-[#6B6052] text-sm leading-relaxed">{tip}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="conditioning" className="mb-10 scroll-mt-4">
        <h2
          className="text-2xl text-[#1A1A1A] mb-4"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Conditioning Leather
        </h2>
        <p className="text-[#6B6052] leading-relaxed mb-4">
          Leather is skin — it dries out, cracks, and loses suppleness without periodic conditioning.
          For bags in regular use, condition 2-3 times per year. For pieces stored or used rarely,
          once a year is sufficient.
        </p>
        <p className="text-[#6B6052] leading-relaxed mb-4">
          Recommended conditioners: Apple Garde Rain &amp; Stain Repellent (also adds water
          resistance), Leather Honey Leather Conditioner (penetrates deeply, good for older
          leather), and Collonil 1909 Supreme Cream (preferred by professional restorers for
          smooth leathers).
        </p>
        <div className="bg-[#F5F0E8] border border-[#E8E2D9] p-5">
          <p className="text-sm font-medium text-[#1A1A1A] mb-2">Important: always test first</p>
          <p className="text-sm text-[#6B6052] leading-relaxed">
            Apply conditioner to a hidden interior seam before treating the full exterior. Some
            conditioners darken lighter leathers (especially nude or white) permanently. Test and
            wait 30 minutes to see the result before proceeding.
          </p>
        </div>
      </section>

      <section id="professional" className="mb-12 scroll-mt-4">
        <h2
          className="text-2xl text-[#1A1A1A] mb-4"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          When to Get Professional Help
        </h2>
        <p className="text-[#6B6052] leading-relaxed mb-4">
          Some damage is beyond home care. Attempting to fix serious issues without expertise
          typically makes them worse and more expensive to correct.
        </p>
        <div className="space-y-4">
          {[
            {
              issue: 'Color transfer',
              note: 'Denim or dark fabric transferring color onto light leather. Professional cleaning can remove recent transfer; older transfer may require partial re-dyeing.',
            },
            {
              issue: 'Deep stains on lambskin',
              note: 'Any liquid or oil stain on lambskin requires professional attention. Home attempts with cleaners will spread the stain and may cause irreversible damage to the leather.',
            },
            {
              issue: 'Handle darkening',
              note: 'Natural skin oils accumulate on handles and darken over time, especially on light-colored bags. Professional handle re-dyeing costs $80-150 and can restore original color.',
            },
            {
              issue: 'Interior lining damage',
              note: 'Torn or stained suede lining in older Chanel bags is a specialist repair. Full re-lining starts at $150 at quality restorers.',
            },
          ].map(({ issue, note }) => (
            <div key={issue} className="border-l-2 border-[#B8954A] pl-4">
              <p className="font-medium text-[#1A1A1A] text-sm mb-1">{issue}</p>
              <p className="text-sm text-[#6B6052] leading-relaxed">{note}</p>
            </div>
          ))}
        </div>
        <p className="text-[#6B6052] text-sm leading-relaxed mt-6">
          Recommended professional restorers: Bag Spa, Leather Surgeons, Couture Cleaners, Mela
          Artisans. Costs range from $50 for conditioning treatments to $200+ for full restoration
          work. Always get a quote before authorizing any work.
        </p>
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
