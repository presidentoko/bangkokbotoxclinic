import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ToolPage, TOOLS } from '@/components/ToolPage'
import { Checklist, PriceCheck } from '@/components/calc/Checklist'
import { UNIVERSAL, BRAND_CHECKLISTS, CHECKLIST_BRANDS } from '@/lib/checklists'
import { getCalcModels } from '@/lib/value'

interface Props { params: Promise<{ brand: string }> }

export function generateStaticParams() {
  return CHECKLIST_BRANDS.map(brand => ({ brand }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand } = await params
  const c = BRAND_CHECKLISTS[brand]
  if (!c) return {}
  return {
    title: `${c.brand} Authenticity Checklist — How to Check a Pre-Owned ${c.brand} Bag`,
    description: `${c.intro} A step-by-step checklist with a price check against real ${c.brand} sales.`,
    alternates: { canonical: `https://www.secondluxuryitems.com/checklist/authenticity/${brand}` },
  }
}

export default async function Page({ params }: Props) {
  const { brand } = await params
  const c = BRAND_CHECKLISTS[brand]
  if (!c) notFound()
  const models = getCalcModels().filter(m => m.brand.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase() === c.brand.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase())
  const items = [...c.items, ...UNIVERSAL]
  const path = `/checklist/authenticity/${brand}`
  return (
    <ToolPage
      path={path}
      kicker="Checklist"
      title={`${c.brand} authenticity checklist`}
      intro={c.intro}
      related={TOOLS.filter(t => !t.href.startsWith('/checklist'))}
      method={
        <>
          <h2 className="text-2xl" style={{ fontFamily: 'var(--font-playfair)' }}>{c.brand}-specific checks</h2>
          <ol className="list-decimal pl-5 space-y-2">
            {c.items.map(i => <li key={i.id}><strong>{i.title}.</strong> {i.detail}</li>)}
          </ol>
          <h2 className="text-2xl pt-4" style={{ fontFamily: 'var(--font-playfair)' }}>Checks for any designer bag</h2>
          <ol className="list-decimal pl-5 space-y-2">
            {UNIVERSAL.map(i => <li key={i.id}><strong>{i.title}.</strong> {i.detail}</li>)}
          </ol>
          <p className="text-sm text-[#6B6052]">
            Details such as hardware engraving and stitch counts vary by season, so this list does not use them as rules —
            compare against a verified example of the same season, or use a professional authenticator.{' '}
            <Link className="underline" href="/checklist/authenticity">All brands</Link>
          </p>
        </>
      }
      faqs={[]}
    >
      {models.length > 0 && (
        <>
          <h2 className="text-lg font-medium mb-2">1. Price check</h2>
          <PriceCheck models={models} />
        </>
      )}
      <h2 className="text-lg font-medium mt-6 mb-2">{models.length > 0 ? '2. ' : ''}Checklist</h2>
      <Checklist items={items} />
    </ToolPage>
  )
}
