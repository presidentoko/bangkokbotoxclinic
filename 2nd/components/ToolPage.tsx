import Link from 'next/link'
import { DATA_DATE, VALUE_SITE } from '@/lib/value'

const BASE = 'https://www.secondluxuryitems.com'

/** Shared frame for the tools: heading, the interactive part, then the
 *  static explanation and FAQ that a crawler (and a sceptical visitor) reads. */
export function ToolPage({ path, kicker, title, intro, children, method, faqs, related }: {
  path: string
  kicker: string
  title: string
  intro: string
  children: React.ReactNode
  method: React.ReactNode
  faqs: { q: string; a: string }[]
  related?: { href: string; label: string }[]
}) {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: title,
      url: `${BASE}${path}`,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: intro,
    },
    ...(faqs.length
      ? [{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        }]
      : []),
  ]
  return (
    <article className="max-w-3xl mx-auto">
      {schema.map((s, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />)}
      <p className="text-xs tracking-[0.2em] uppercase text-[#B8954A] mb-3">{kicker}</p>
      <h1 className="text-3xl sm:text-4xl leading-tight mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>{title}</h1>
      <p className="text-lg text-[#6B6052] mb-8">{intro}</p>
      <section className="border border-[#E8E2D9] rounded-lg p-5 bg-[#F5F0E8]">{children}</section>
      <section className="mt-10 text-[15px] leading-relaxed space-y-3">{method}</section>
      {faqs.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>Questions</h2>
          {faqs.map(f => (
            <div key={f.q} className="mb-4">
              <h3 className="font-medium">{f.q}</h3>
              <p className="text-[#6B6052]">{f.a}</p>
            </div>
          ))}
        </section>
      )}
      <section className="mt-10 text-sm text-[#6B6052] border-t border-[#E8E2D9] pt-6">
        <p>
          Prices are medians of sold listings on Vestiaire Collective&apos;s US marketplace, matched to each model&apos;s
          exact size, collected {DATA_DATE}. Per-model data, trends and sources:{' '}
          <a className="underline" href={`${VALUE_SITE}/en/value`}>chicpreowned.com resale value database</a>.
        </p>
        {related && related.length > 0 && (
          <p className="mt-2">More tools: {related.map((r, i) => (
            <span key={r.href}>{i ? ' · ' : ''}<Link className="underline" href={r.href}>{r.label}</Link></span>
          ))}</p>
        )}
      </section>
    </article>
  )
}

export const TOOLS = [
  { href: '/calculator/resale-value', label: 'Resale value calculator' },
  { href: '/calculator/retail-vs-resale', label: 'New vs pre-owned calculator' },
  { href: '/calculator/depreciation', label: 'What is my bag worth now?' },
  { href: '/checklist/authenticity', label: 'Authenticity checklist' },
  { href: '/sizes/chanel', label: 'Size guides' },
]
