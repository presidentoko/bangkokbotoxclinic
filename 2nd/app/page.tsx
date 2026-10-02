import Link from 'next/link'
import type { Metadata } from 'next'
import { getCalcModels, VALUE_SITE, DATA_DATE } from '@/lib/value'
import { CHECKLIST_BRANDS, BRAND_CHECKLISTS } from '@/lib/checklists'
import { SIZE_BRANDS, SIZE_GUIDES } from '@/lib/sizes'

export const metadata: Metadata = {
  alternates: { canonical: 'https://www.secondluxuryitems.com' },
}

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Second Luxury Items',
  url: 'https://www.secondluxuryitems.com',
  description: 'Free calculators and checklists for buying and selling pre-owned designer bags, built on real sale prices.',
}

const TOOLS = [
  { href: '/calculator/resale-value', title: 'Resale value calculator', text: 'Your bag and its condition in, the price it actually sells for out — from real sales of that exact size.' },
  { href: '/calculator/retail-vs-resale', title: 'New or pre-owned?', text: 'What a bag costs to own is what you pay minus what you get back. Compare both ways of buying.' },
  { href: '/calculator/depreciation', title: 'What is mine worth now?', text: 'What you paid and when, against what it sells for today — and what owning it has cost per year.' },
  { href: '/checklist/authenticity', title: 'Authenticity checklist', text: 'Start with a price check against real sales, then the steps that protect you before you pay.' },
]

export default function Home() {
  const n = getCalcModels().length
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <h1 className="text-4xl sm:text-5xl leading-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
        Tools for buying and selling pre-owned designer bags
      </h1>
      <p className="text-lg text-[#6B6052] mb-10 max-w-2xl">
        Calculators that run on what {n} designer models actually sell for — matched by size and condition, updated monthly
        (last {DATA_DATE}). Free, no sign-up.
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        {TOOLS.map(t => (
          <Link key={t.href} href={t.href} className="block border border-[#E8E2D9] rounded-lg p-5 bg-white hover:border-[#1A1A1A]">
            <h2 className="text-xl mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>{t.title}</h2>
            <p className="text-sm text-[#6B6052]">{t.text}</p>
          </Link>
        ))}
      </div>
      <section className="grid sm:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Authenticity checklists</h2>
          <ul className="list-disc pl-5">
            {CHECKLIST_BRANDS.map(b => <li key={b}><Link className="underline" href={`/checklist/authenticity/${b}`}>{BRAND_CHECKLISTS[b].brand}</Link></li>)}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>Size guides</h2>
          <ul className="list-disc pl-5">
            {SIZE_BRANDS.map(b => <li key={b}><Link className="underline" href={`/sizes/${b}`}>{SIZE_GUIDES[b].brand} sizes and dimensions</Link></li>)}
          </ul>
        </div>
      </section>
      <p className="mt-12 text-sm text-[#6B6052]">
        Looking up one model? The <a className="underline" href={`${VALUE_SITE}/en/value`}>resale value database</a> has
        each model&apos;s sold prices, trend and retail comparison, and the{' '}
        <a className="underline" href={`${VALUE_SITE}/en/index/value-retention`}>value retention index</a> ranks them.
      </p>
    </div>
  )
}
