import type { Metadata } from 'next'
import { ToolPage, TOOLS } from '@/components/ToolPage'
import { ResaleValueCalc } from '@/components/calc/ResaleValueCalc'
import { getCalcModels, usd, valueUrl } from '@/lib/value'

const PATH = '/calculator/resale-value'

export const metadata: Metadata = {
  title: 'Designer Bag Resale Value Calculator — What Will Mine Sell For?',
  description: 'Pick your bag and its condition to see what it actually sells for pre-owned: the price range from real sales, by exact size and condition. Chanel, Hermès, Louis Vuitton, Dior and more.',
  alternates: { canonical: `https://www.secondluxuryitems.com${PATH}` },
}

export default function Page() {
  const models = getCalcModels()
  const top = [...models].sort((a, b) => b.resale.n - a.resale.n).slice(0, 25)
  return (
    <ToolPage
      path={PATH}
      kicker="Calculator"
      title="Resale value calculator"
      intro={`What a pre-owned designer bag, watch or piece of jewellery actually sells for — from real sales, by exact size and condition. ${models.length} models.`}
      related={TOOLS.filter(t => t.href !== PATH)}
      method={
        <>
          <h2 className="text-2xl" style={{ fontFamily: 'var(--font-playfair)' }}>Most-traded models</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[480px]">
              <thead className="text-left text-[#6B6052]">
                <tr><th className="py-2">Model</th><th>Like new</th><th>Very good</th><th>Good / fair</th><th>Sales</th></tr>
              </thead>
              <tbody>
                {top.map(m => (
                  <tr key={m.slug} className="border-t border-[#E8E2D9]">
                    <td className="py-2"><a className="underline" href={valueUrl(m.slug)}>{m.brand} {m.name}</a></td>
                    <td>{usd(m.grades.A?.median)}</td><td>{usd(m.grades.B?.median)}</td><td>{usd(m.grades.C?.median)}</td>
                    <td>{m.resale.n}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h2 className="text-2xl pt-4" style={{ fontFamily: 'var(--font-playfair)' }}>How the estimate works</h2>
          <p>
            The range is the middle half of real sales — the 25th to 75th percentile — for listings of that exact model, in
            that condition. A listing only counts if it names the size: a Classic Flap that doesn&apos;t say Medium or Jumbo is
            left out rather than guessed. Exotic skins and accessories sold under a bag&apos;s name are excluded.
          </p>
          <p>
            Your bag can land outside the range. Colour, hardware, the full set (box, dust bag, receipt) and a recent season all
            move the price; the range is where most sales land.
          </p>
        </>
      }
      faqs={[
        { q: 'Is this what I will get, or what a buyer pays?', a: 'What buyers paid. A platform or consignment shop keeps a commission; enter it in the fee box to see what reaches you.' },
        { q: 'Why is my model missing?', a: 'It needs at least twelve sales of that exact size. Models below that have asking prices only, which run well above what things sell for, so they are not used here.' },
        { q: 'How often is it updated?', a: 'Monthly, from a fresh pull of sold listings.' },
      ]}
    >
      <ResaleValueCalc models={models} />
    </ToolPage>
  )
}
