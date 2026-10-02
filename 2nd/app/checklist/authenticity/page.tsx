import type { Metadata } from 'next'
import Link from 'next/link'
import { ToolPage, TOOLS } from '@/components/ToolPage'
import { Checklist, PriceCheck } from '@/components/calc/Checklist'
import { UNIVERSAL, BRAND_CHECKLISTS, CHECKLIST_BRANDS } from '@/lib/checklists'
import { getCalcModels } from '@/lib/value'

const PATH = '/checklist/authenticity'

export const metadata: Metadata = {
  title: 'Designer Bag Authenticity Checklist — Check Before You Pay',
  description: 'A step-by-step pre-purchase checklist for pre-owned designer bags, with a price check against real sales: the fastest way to spot a counterfeit or a scam before you pay.',
  alternates: { canonical: `https://www.secondluxuryitems.com${PATH}` },
}

export default function Page() {
  return (
    <ToolPage
      path={PATH}
      kicker="Checklist"
      title="Authenticity checklist: before you pay"
      intro="Start with the price — it catches more fakes than any stitch count — then work through the checks. Tick them off as you go."
      related={TOOLS.filter(t => t.href !== PATH)}
      method={
        <>
          <h2 className="text-2xl" style={{ fontFamily: 'var(--font-playfair)' }}>The checks</h2>
          <ol className="list-decimal pl-5 space-y-2">
            {UNIVERSAL.map(i => <li key={i.id}><strong>{i.title}.</strong> {i.detail}</li>)}
          </ol>
          <h2 className="text-2xl pt-4" style={{ fontFamily: 'var(--font-playfair)' }}>Brand checklists</h2>
          <ul className="list-disc pl-5">
            {CHECKLIST_BRANDS.map(b => (
              <li key={b}><Link className="underline" href={`${PATH}/${b}`}>{BRAND_CHECKLISTS[b].brand} authenticity checklist</Link></li>
            ))}
          </ul>
          <p className="text-sm text-[#6B6052]">
            No checklist proves a bag is real. It tells you when to walk away, and when to pay a professional to look.
          </p>
        </>
      }
      faqs={[
        { q: 'Why start with the price?', a: 'A counterfeit has to undercut the market to find a buyer. Comparing the asking price with what that exact model actually sells for flags most fakes before you have looked at a single stitch.' },
        { q: 'Is a receipt proof?', a: 'No. Receipts, cards and boxes are counterfeited along with the bags. Treat paperwork as supporting evidence only.' },
      ]}
    >
      <h2 className="text-lg font-medium mb-2">1. Price check</h2>
      <PriceCheck models={getCalcModels()} />
      <h2 className="text-lg font-medium mt-6 mb-2">2. Checklist</h2>
      <Checklist items={UNIVERSAL} />
    </ToolPage>
  )
}
