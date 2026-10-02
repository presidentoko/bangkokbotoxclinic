import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ToolPage, TOOLS } from '@/components/ToolPage'
import { SIZE_GUIDES, SIZE_BRANDS } from '@/lib/sizes'
import { getCalcModel, usd, valueUrl } from '@/lib/value'

interface Props { params: Promise<{ brand: string }> }

export function generateStaticParams() {
  return SIZE_BRANDS.map(brand => ({ brand }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand } = await params
  const g = SIZE_GUIDES[brand]
  if (!g) return {}
  const fams = g.families.map(f => f.family.replace(/ \(.*\)/, '')).join(', ')
  return {
    title: `${g.brand} Bag Sizes & Dimensions — ${fams} (with Resale Value by Size)`,
    description: `${g.intro} Dimensions for every size, and what each one resells for.`,
    alternates: { canonical: `https://www.secondluxuryitems.com/sizes/${brand}` },
  }
}

export default async function Page({ params }: Props) {
  const { brand } = await params
  const g = SIZE_GUIDES[brand]
  if (!g) notFound()
  return (
    <ToolPage
      path={`/sizes/${brand}`}
      kicker="Size guide"
      title={`${g.brand} bag sizes and dimensions`}
      intro={g.intro}
      related={TOOLS.filter(t => !t.href.startsWith('/sizes'))}
      method={
        <>
          <p className="text-sm text-[#6B6052]">
            Dimensions are approximate external measurements in centimetres, width × height × depth, as published for the
            standard version; they shift by a few millimetres between seasons and leathers. Resale figures are median sale
            prices from real sold listings matched to that size.
          </p>
          <p className="text-sm">
            Other brands: {SIZE_BRANDS.filter(b => b !== brand).map((b, i) => (
              <span key={b}>{i ? ' · ' : ''}<Link className="underline" href={`/sizes/${b}`}>{SIZE_GUIDES[b].brand}</Link></span>
            ))}
          </p>
        </>
      }
      faqs={[]}
    >
      {g.families.map(f => (
        <div key={f.family} className="mb-6">
          <h2 className="text-xl mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>{f.family}</h2>
          {f.note ? <p className="text-sm text-[#6B6052] mb-2">{f.note}</p> : null}
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[420px]">
              <thead className="text-left text-[#6B6052]"><tr><th className="py-2">Size</th><th>cm (W × H × D)</th><th>Resells for</th><th>Of retail</th></tr></thead>
              <tbody>
                {f.rows.map(r => {
                  const m = r.value ? getCalcModel(r.value) : undefined
                  return (
                    <tr key={r.size} className="border-t border-[#E8E2D9]">
                      <td className="py-2">{r.size}</td>
                      <td>{r.dims}</td>
                      <td>{m ? <a className="underline" href={valueUrl(m.slug)}>{usd(m.resale.median)}</a> : '—'}{m?.basis === 'asking' ? ' (asking)' : ''}</td>
                      <td>{m?.retention != null ? `${Math.round(m.retention)}%` : '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </ToolPage>
  )
}
