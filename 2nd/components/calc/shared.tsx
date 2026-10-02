'use client'

import { useEffect, useMemo, useState } from 'react'
import type { CalcModel, Grade } from '@/lib/value'
import { GRADES } from '@/lib/value'

/** `?model=chanel-classic-flap-medium` preselects — the value pages on
 *  chicpreowned.com link here with it. Read once on mount: useSearchParams
 *  would force a client-side render boundary on an otherwise static page. */
export function useInitialModel(models: CalcModel[]): [string, (s: string) => void] {
  const [slug, setSlug] = useState('')
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('model')
    if (q && models.some(m => m.slug === q)) setSlug(q)
  }, [models])
  return [slug, setSlug]
}

export function ModelPicker({ models, value, onChange }: {
  models: CalcModel[]
  value: string
  onChange: (slug: string) => void
}) {
  const brands = useMemo(() => [...new Set(models.map(m => m.brand))].sort(), [models])
  const current = models.find(m => m.slug === value)
  const [brand, setBrand] = useState(current?.brand ?? '')
  useEffect(() => { if (current) setBrand(current.brand) }, [current])
  const list = models.filter(m => m.brand === brand)
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      <label className="block">
        <span className="text-xs uppercase tracking-wider text-[#6B6052]">Brand</span>
        <select className="mt-1 w-full border border-[#E8E2D9] rounded px-3 py-2 bg-white" value={brand}
          onChange={e => { setBrand(e.target.value); onChange('') }}>
          <option value="">Choose a brand</option>
          {brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </label>
      <label className="block">
        <span className="text-xs uppercase tracking-wider text-[#6B6052]">Model</span>
        <select className="mt-1 w-full border border-[#E8E2D9] rounded px-3 py-2 bg-white" value={value}
          disabled={!brand} onChange={e => onChange(e.target.value)}>
          <option value="">Choose a model</option>
          {list.map(m => <option key={m.slug} value={m.slug}>{m.name}</option>)}
        </select>
      </label>
    </div>
  )
}

export function GradePicker({ value, onChange, model }: {
  value: Grade
  onChange: (g: Grade) => void
  model?: CalcModel
}) {
  return (
    <fieldset className="mt-4">
      <legend className="text-xs uppercase tracking-wider text-[#6B6052] mb-1">Condition</legend>
      <div className="grid sm:grid-cols-3 gap-2">
        {GRADES.map(g => {
          const has = !model || !!model.grades[g.key]
          return (
            <button key={g.key} type="button" disabled={!has} onClick={() => onChange(g.key)}
              className={`text-left border rounded px-3 py-2 ${value === g.key ? 'border-[#1A1A1A] bg-white' : 'border-[#E8E2D9]'} ${has ? '' : 'opacity-40'}`}>
              <span className="block text-sm font-medium">{g.label}</span>
              <span className="block text-xs text-[#6B6052]">{has ? g.detail : 'Too few sales to price'}</span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

export function NumberInput({ label, value, onChange, prefix, hint }: {
  label: string
  value: string
  onChange: (v: string) => void
  prefix?: string
  hint?: string
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-[#6B6052]">{label}</span>
      <div className="mt-1 flex items-center border border-[#E8E2D9] rounded bg-white">
        {prefix ? <span className="pl-3 text-[#6B6052]">{prefix}</span> : null}
        <input inputMode="decimal" className="w-full px-3 py-2 bg-transparent outline-none" value={value}
          onChange={e => onChange(e.target.value.replace(/[^0-9.]/g, ''))} />
      </div>
      {hint ? <span className="block text-xs text-[#9C8B7A] mt-1">{hint}</span> : null}
    </label>
  )
}

export function Result({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 border border-[#1A1A1A] rounded-lg p-5 bg-white">{children}</div>
}
