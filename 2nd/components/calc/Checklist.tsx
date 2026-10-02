'use client'

import { useState } from 'react'
import type { CalcModel } from '@/lib/value'
import { usd, valueUrl } from '@/lib/value'
import { ModelPicker, NumberInput, useInitialModel } from './shared'

export interface CheckItem { id: string; title: string; detail: string; critical?: boolean }

/** Tick-through checklist. The items are rendered on the server too (see the
 *  page), so this is progress-tracking on top of crawlable text, not the
 *  only copy of it. */
export function Checklist({ items }: { items: CheckItem[] }) {
  const [done, setDone] = useState<Record<string, boolean>>({})
  const ticked = items.filter(i => done[i.id]).length
  const criticalOpen = items.filter(i => i.critical && !done[i.id])
  return (
    <div>
      <div className="flex justify-between text-sm mb-3">
        <span>{ticked} of {items.length} checked</span>
        {criticalOpen.length > 0 && ticked > 0 && <span className="text-[#9B2C2C]">{criticalOpen.length} essential check{criticalOpen.length > 1 ? 's' : ''} open</span>}
        {criticalOpen.length === 0 && ticked === items.length && <span className="text-[#2F6B3A]">All checks done</span>}
      </div>
      <ul className="space-y-2">
        {items.map(i => (
          <li key={i.id}>
            <label className="flex gap-3 items-start border border-[#E8E2D9] bg-white rounded px-3 py-2 cursor-pointer">
              <input type="checkbox" className="mt-1" checked={!!done[i.id]}
                onChange={e => setDone(d => ({ ...d, [i.id]: e.target.checked }))} />
              <span>
                <span className="font-medium">{i.title}</span>
                {i.critical && <span className="ml-2 text-xs uppercase tracking-wider text-[#9B2C2C]">essential</span>}
                <span className="block text-sm text-[#6B6052]">{i.detail}</span>
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * The one check this site can do better than any guide: is the asking price
 * one real sales support? A counterfeit or a scam almost always has to be
 * priced under the market to sell — it is the lure.
 */
export function PriceCheck({ models }: { models: CalcModel[] }) {
  const [slug, setSlug] = useInitialModel(models)
  const [ask, setAsk] = useState('')
  const m = models.find(x => x.slug === slug)
  const price = Number(ask) || 0
  const floor = m ? Math.min(...Object.values(m.grades).map(g => g?.p25 ?? g?.median ?? Infinity), m.resale.p25 ?? m.resale.median) : 0
  let verdict: { tone: string; text: string } | null = null
  if (m && price > 0) {
    if (price < floor * 0.5) verdict = { tone: 'text-[#9B2C2C]', text: `Far below any normal sale. Most ${m.name} sales in even the worst condition are above ${usd(floor)}. A price this low is the most common sign of a counterfeit or a scam — do not pay by bank transfer.` }
    else if (price < floor) verdict = { tone: 'text-[#8A6A3A]', text: `Below most recent sales (most sell above ${usd(floor)}). Possible for heavy wear or a missing strap — ask the seller why, and get it authenticated.` }
    else if (m.resale.p75 && price > m.resale.p75 * 1.3) verdict = { tone: 'text-[#6B6052]', text: `Above what most sell for (median ${usd(m.resale.median)}). Not a red flag for authenticity — but room to negotiate.` }
    else verdict = { tone: 'text-[#2F6B3A]', text: `In the normal range (median sale ${usd(m.resale.median)}). Price alone raises no flag — the other checks still apply.` }
  }
  return (
    <div>
      <ModelPicker models={models} value={slug} onChange={setSlug} />
      <div className="mt-3 max-w-xs"><NumberInput label="Asking price" value={ask} onChange={setAsk} prefix="$" /></div>
      {verdict && (
        <p className={`mt-4 text-sm ${verdict.tone}`}>
          {verdict.text} <a className="underline text-[#1A1A1A]" href={valueUrl(m!.slug)}>Sale prices →</a>
        </p>
      )}
    </div>
  )
}
