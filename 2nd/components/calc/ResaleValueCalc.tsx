'use client'

import { useState } from 'react'
import type { CalcModel, Grade } from '@/lib/value'
import { usd, valueUrl } from '@/lib/value'
import { ModelPicker, GradePicker, NumberInput, Result, useInitialModel } from './shared'

export function ResaleValueCalc({ models }: { models: CalcModel[] }) {
  const [slug, setSlug] = useInitialModel(models)
  const [grade, setGrade] = useState<Grade>('B')
  const [fee, setFee] = useState('')
  const m = models.find(x => x.slug === slug)
  const g = m?.grades[grade]
  const feePct = Math.min(Number(fee) || 0, 60)
  const net = (v?: number) => (v == null ? null : v * (1 - feePct / 100))

  return (
    <div>
      <ModelPicker models={models} value={slug} onChange={setSlug} />
      <GradePicker value={grade} onChange={setGrade} model={m} />
      <div className="mt-4 max-w-xs">
        <NumberInput label="Selling fee (optional)" value={fee} onChange={setFee} prefix="%"
          hint="Your platform's commission. Leave blank to see the sale price." />
      </div>
      {m && g && (
        <Result>
          <p className="text-xs uppercase tracking-wider text-[#6B6052]">Expected sale price</p>
          <p className="text-3xl mt-1" style={{ fontFamily: 'var(--font-playfair)' }}>
            {usd(net(g.p25 ?? g.median))} – {usd(net(g.p75 ?? g.median))}
          </p>
          <p className="mt-2 text-sm">
            Median {usd(net(g.median))}{feePct ? ` after a ${feePct}% fee (${usd(g.median)} before)` : ''}, from {g.n} sales
            of a {m.brand} {m.name} in this condition.
            {m.retail_usd ? ` That is ${Math.round((g.median / m.retail_usd) * 100)}% of today's ${usd(m.retail_usd)} US retail.` : ''}
          </p>
          <p className="mt-3 text-sm">
            <a className="underline" href={valueUrl(m.slug)}>Full resale data for the {m.name} →</a>
          </p>
        </Result>
      )}
      {m && !g && (
        <Result><p className="text-sm">Too few {m.name} sales in this condition to price it. Try another condition.</p></Result>
      )}
    </div>
  )
}
