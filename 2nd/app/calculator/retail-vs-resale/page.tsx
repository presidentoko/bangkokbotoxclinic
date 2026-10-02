import type { Metadata } from 'next'
import { ToolPage, TOOLS } from '@/components/ToolPage'
import { RetailVsResaleCalc } from '@/components/calc/RetailVsResaleCalc'
import { getCalcModels, usd, valueUrl } from '@/lib/value'

const PATH = '/calculator/retail-vs-resale'

export const metadata: Metadata = {
  title: 'Buy New or Pre-Owned? Designer Bag Cost-of-Ownership Calculator',
  description: 'Compare the real cost of owning a designer bag bought new vs pre-owned: what you pay minus what you get back when you sell, from real resale prices.',
  alternates: { canonical: `https://www.secondluxuryitems.com${PATH}` },
}

export default function Page() {
  const models = getCalcModels()
  // The static table answers the question for the visitor who never touches
  // the calculator: buy new, sell in Very Good, vs buy Very Good, sell Very Good.
  const rows = models
    .filter(m => m.retail_usd && !m.retail_discontinued && m.grades.B)
    .map(m => ({ m, newCost: m.retail_usd! - m.grades.B!.median }))
    .sort((a, b) => b.newCost - a.newCost)
    .slice(0, 25)
  return (
    <ToolPage
      path={PATH}
      kicker="Calculator"
      title="New vs pre-owned: which costs less to own?"
      intro="The price tag is not the cost. What a bag costs you is what you pay minus what you get back when you sell it — and that gap is very different new and pre-owned."
      related={TOOLS.filter(t => t.href !== PATH)}
      method={
        <>
          <h2 className="text-2xl" style={{ fontFamily: 'var(--font-playfair)' }}>What buying new costs, by model</h2>
          <p className="text-sm text-[#6B6052]">Pay US retail, sell later in Very Good condition. Bought pre-owned in Very Good and sold in Very Good, the cost is close to nothing but the selling fee.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[480px]">
              <thead className="text-left text-[#6B6052]"><tr><th className="py-2">Model</th><th>Retail</th><th>Resells (very good)</th><th>Cost of buying new</th></tr></thead>
              <tbody>
                {rows.map(({ m, newCost }) => (
                  <tr key={m.slug} className="border-t border-[#E8E2D9]">
                    <td className="py-2"><a className="underline" href={valueUrl(m.slug)}>{m.brand} {m.name}</a></td>
                    <td>{usd(m.retail_usd)}</td><td>{usd(m.grades.B!.median)}</td>
                    <td>{newCost >= 0 ? usd(newCost) : `+${usd(-newCost)}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h2 className="text-2xl pt-4" style={{ fontFamily: 'var(--font-playfair)' }}>How it&apos;s calculated</h2>
          <p>Buy new: US retail − the median sale price in the condition you expect to sell it in. Buy pre-owned: the median sale price in the condition you buy − the same resale figure. A selling fee, if you enter one, comes off what you get back.</p>
          <p>Only models with a sourced current retail price are offered; discontinued models have no &quot;new&quot; to compare.</p>
        </>
      }
      faqs={[
        { q: 'Does this assume prices rise or fall?', a: 'No. It uses today’s retail and today’s resale prices for both sides. Retail prices for some maisons rise most years, which would make buying new later more expensive, but the calculator does not forecast.' },
        { q: 'Why would anyone buy new then?', a: 'For a few models, like-new examples sell above retail — usually because the boutique rations them. The calculator shows those cases as a gain.' },
      ]}
    >
      <RetailVsResaleCalc models={models} />
    </ToolPage>
  )
}
