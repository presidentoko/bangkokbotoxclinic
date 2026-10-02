'use client'

import { useState } from 'react'
import type { CalcModel, Grade } from '@/lib/value'
import { usd, valueUrl } from '@/lib/value'
import { ModelPicker, GradePicker, NumberInput, Result, useInitialModel } from './shared'

/**
 * What a bag you already own is worth today, against what you paid.
 *
 * Deliberately backward-looking. Projecting "worth in five years" would need
 * a depreciation curve, and the data has no such thing — only what bags of
 * each condition sell for now. So the answer is today's value and what
 * owning it has cost per year so far, which the data can actually support.
 */
export function DepreciationCalc({ models, year }: { models: CalcModel[]; year: number }) {
  const [slug, setSlug] = useInitialModel(models)
  const [grade, setGrade] = useState<Grade>('B')
  const [paid, setPaid] = useState('')
  const [bought, setBought] = useState('')
  const m = models.find(x => x.slug === slug)
  const g = m?.grades[grade]
  const paidN = Number(paid) || 0
  const yr = Number(bought)
  const years = yr >= 1950 && yr <= year ? Math.max(year - yr, 1) : null

  return (
    <div>
      <ModelPicker models={models} value={slug} onChange={setSlug} />
      <GradePicker value={grade} onChange={setGrade} model={m} />
      <div className="grid sm:grid-cols-2 gap-3 mt-4">
        <NumberInput label="What you paid" value={paid} onChange={setPaid} prefix="$" />
        <NumberInput label="Year bought" value={bought} onChange={setBought} hint={`e.g. ${year - 4}`} />
      </div>
      {m && g && (
        <Result>
          <p className="text-xs uppercase tracking-wider text-[#6B6052]">Worth today</p>
          <p className="text-3xl mt-1" style={{ fontFamily: 'var(--font-playfair)' }}>{usd(g.median)}</p>
          <p className="text-sm">Middle half of {g.n} recent sales: {usd(g.p25 ?? g.median)} – {usd(g.p75 ?? g.median)}</p>
          {paidN > 0 && (
            <div className="mt-4 text-sm space-y-1">
              <p>
                {g.median >= paidN
                  ? <>Up <strong>{usd(g.median - paidN)}</strong> ({Math.round((g.median / paidN - 1) * 100)}%) on what you paid.</>
                  : <>Down <strong>{usd(paidN - g.median)}</strong> — it keeps {Math.round((g.median / paidN) * 100)}% of what you paid.</>}
              </p>
              {years && g.median < paidN && <p>That is about {usd((paidN - g.median) / years)} a year over {years} year{years > 1 ? 's' : ''} of ownership.</p>}
              {m.retail_usd && !m.retail_discontinued && (
                <p>The same model costs {usd(m.retail_usd)} new today{paidN < m.retail_usd ? `, ${Math.round((m.retail_usd / paidN - 1) * 100)}% more than you paid` : ''}.</p>
              )}
            </div>
          )}
          <p className="mt-3 text-sm"><a className="underline" href={valueUrl(m.slug)}>Price trend for the {m.name} →</a></p>
        </Result>
      )}
      {m && !g && <Result><p className="text-sm">Too few sales in this condition to price it.</p></Result>}
    </div>
  )
}
