'use client'

import { useState } from 'react'
import type { CalcModel, Grade } from '@/lib/value'
import { usd, valueUrl, GRADES } from '@/lib/value'
import { ModelPicker, NumberInput, Result, useInitialModel } from './shared'

/**
 * The cost of owning a bag is what you pay minus what you get back. Buying
 * new costs retail; buying pre-owned costs what that condition sells for;
 * either way you sell later in whatever condition you leave it. Every input
 * is a median of real sales, and the visitor picks the conditions — nothing
 * here assumes a depreciation curve.
 */
export function RetailVsResaleCalc({ models }: { models: CalcModel[] }) {
  const withRetail = models.filter(m => m.retail_usd && !m.retail_discontinued)
  const [slug, setSlug] = useInitialModel(withRetail)
  const [buyGrade, setBuyGrade] = useState<Grade>('B')
  const [sellGrade, setSellGrade] = useState<Grade>('B')
  const [fee, setFee] = useState('')
  const m = withRetail.find(x => x.slug === slug)
  const feePct = Math.min(Number(fee) || 0, 60)

  const buyUsed = m?.grades[buyGrade]?.median
  const sellLater = m?.grades[sellGrade]?.median
  const back = sellLater != null ? sellLater * (1 - feePct / 100) : null
  const newCost = m?.retail_usd != null && back != null ? m.retail_usd - back : null
  const usedCost = buyUsed != null && back != null ? buyUsed - back : null

  const select = (label: string, v: Grade, set: (g: Grade) => void) => (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-[#6B6052]">{label}</span>
      <select className="mt-1 w-full border border-[#E8E2D9] rounded px-3 py-2 bg-white" value={v}
        onChange={e => set(e.target.value as Grade)}>
        {GRADES.map(g => <option key={g.key} value={g.key} disabled={!!m && !m.grades[g.key]}>{g.label}</option>)}
      </select>
    </label>
  )

  return (
    <div>
      <ModelPicker models={withRetail} value={slug} onChange={setSlug} />
      <div className="grid sm:grid-cols-3 gap-3 mt-4">
        {select('Buy pre-owned in', buyGrade, setBuyGrade)}
        {select('Sell later in', sellGrade, setSellGrade)}
        <NumberInput label="Selling fee" value={fee} onChange={setFee} prefix="%" hint="Optional" />
      </div>
      {m && (
        <Result>
          {newCost == null || usedCost == null ? (
            <p className="text-sm">Too few sales in one of those conditions to compare. Try another.</p>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#6B6052]">Buy new</p>
                  <p className="text-sm">Pay {usd(m.retail_usd)} · get back {usd(back)}</p>
                  <p className="text-2xl mt-1" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {newCost >= 0 ? `Costs ${usd(newCost)}` : `Gains ${usd(-newCost)}`}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#6B6052]">Buy pre-owned</p>
                  <p className="text-sm">Pay {usd(buyUsed)} · get back {usd(back)}</p>
                  <p className="text-2xl mt-1" style={{ fontFamily: 'var(--font-playfair)' }}>
                    {usedCost >= 0 ? `Costs ${usd(usedCost)}` : `Gains ${usd(-usedCost)}`}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm">
                {newCost > usedCost
                  ? `Pre-owned is ${usd(newCost - usedCost)} cheaper to own.`
                  : newCost < usedCost
                    ? `New is ${usd(usedCost - newCost)} cheaper to own — this model resells above what a pre-owned one costs.`
                    : 'They cost the same to own.'}
                {' '}Prices are medians of real sales; US retail as of {m.retail_as_of ?? 'the latest check'}.
              </p>
              <p className="mt-3 text-sm"><a className="underline" href={valueUrl(m.slug)}>See the {m.name} resale data →</a></p>
            </>
          )}
        </Result>
      )}
    </div>
  )
}
