'use client'
import { useState } from 'react'

export function ConditionGuide() {
  const [open, setOpen] = useState(false)
  return (
    <div className="my-6 border border-[#E8E2D9]">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-sm text-[#6B6052] hover:text-[#1A1A1A] transition-colors"
      >
        <span className="tracking-wide uppercase text-xs font-medium">Condition Guide</span>
        <span className="text-[#B8954A]">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-[#E8E2D9] grid sm:grid-cols-3 gap-4 pt-4">
          {[
            { grade: 'Excellent', desc: 'Virtually no signs of wear. May have been worn once or twice. Hardware pristine, interior clean.' },
            { grade: 'Very Good', desc: 'Light signs of use. Minor scuffs possible, overall well-maintained. Most popular grade for value.' },
            { grade: 'Good', desc: 'Visible signs of regular use. May have scratches, wear on corners or handles. Still fully functional.' },
          ].map(c => (
            <div key={c.grade}>
              <p className="font-serif text-sm font-medium text-[#1A1A1A] mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>{c.grade}</p>
              <p className="text-xs text-[#6B6052] leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
