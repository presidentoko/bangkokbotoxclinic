import type { Metadata } from 'next'
import { ToolPage, TOOLS } from '@/components/ToolPage'
import { DepreciationCalc } from '@/components/calc/DepreciationCalc'
import { getCalcModels, DATA_DATE } from '@/lib/value'

const PATH = '/calculator/depreciation'

export const metadata: Metadata = {
  title: 'Designer Bag Depreciation Calculator — What Is Mine Worth Now?',
  description: 'Enter what you paid and when: see what your designer bag is worth today from real sales, how much it has lost or gained, and what owning it has cost per year.',
  alternates: { canonical: `https://www.secondluxuryitems.com${PATH}` },
}

export default function Page() {
  const models = getCalcModels()
  const year = Number(DATA_DATE.slice(0, 4))
  return (
    <ToolPage
      path={PATH}
      kicker="Calculator"
      title="What is my bag worth now?"
      intro="Enter what you paid and the year you bought it. You get today's value from real sales in your bag's condition, what it has gained or lost, and what owning it has cost you per year."
      related={TOOLS.filter(t => t.href !== PATH)}
      method={
        <>
          <h2 className="text-2xl" style={{ fontFamily: 'var(--font-playfair)' }}>What this does and doesn&apos;t do</h2>
          <p>
            &quot;Worth today&quot; is the median recent sale price for your model, size and condition. It does not project
            forward: nobody can tell you what a bag will be worth in five years, and a calculator that draws a smooth
            depreciation curve is inventing one.
          </p>
          <p>
            Comparing against what you paid, rather than against today&apos;s retail, matters for maisons that raise prices
            often — a bag can be worth less than today&apos;s retail and still more than you paid.
          </p>
        </>
      }
      faqs={[
        { q: 'My bag has the full set and receipt. Is it worth more?', a: 'Usually, yes — a full set tends to sell toward the top of the range shown, and a receipt helps a buyer trust it. The calculator shows the middle of the market, not your bag specifically.' },
        { q: 'Why does condition matter so much?', a: 'Because buyers price by it. The gap between like-new and visibly worn is often larger than the gap between two sizes of the same bag.' },
      ]}
    >
      <DepreciationCalc models={models} year={year} />
    </ToolPage>
  )
}
