'use client'
import { useState } from 'react'
import Link from 'next/link'
import { LocaleSwitcher } from './LocaleSwitcher'

interface NavLink {
  href: string
  label: string
}

export function MobileMenu({ locale, links }: { locale: string; links: NavLink[] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        className="p-2 -mr-2 text-[#1A1A1A]"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full bg-[#FAFAF9] border-b border-[#E8E2D9] shadow-lg z-50">
          <nav className="max-w-5xl mx-auto px-6 py-2 flex flex-col text-sm text-[#6B6052] uppercase tracking-wide">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-3 border-b border-[#E8E2D9] last:border-0 hover:text-[#1A1A1A]"
              >
                {link.label}
              </Link>
            ))}
            <div className="py-3">
              <LocaleSwitcher locale={locale} />
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
