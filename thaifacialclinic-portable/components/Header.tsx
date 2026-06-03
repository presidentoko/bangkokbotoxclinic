"use client";
import { useState } from "react";
import Link from "next/link";
import type { Lang } from "@/lib/types";
import { SUPPORTED_LANGS } from "@/lib/i18n";
import DarkModeToggle from "./DarkModeToggle";

export default function Header({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 -mx-4 mb-8 px-4 backdrop-blur-md"
      style={{ background: "rgb(var(--bg) / 0.85)", borderBottom: "1px solid rgb(var(--border) / 0.6)" }}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3">
        <Link href={`/${lang}/`} className="group flex items-center gap-2.5 min-w-0">
          <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-navy-800 to-navy-950 text-gold-400 shadow-lg shadow-navy-900/20 ring-1 ring-gold-400/20">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1l3.09 6.26L22 8.27l-5 4.87 1.18 6.88L12 16.77l-6.18 3.25L7 13.14 2 8.27l6.91-1.01L12 1z"/></svg>
            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-mint-500 ring-2 ring-[rgb(var(--bg))]" />
          </span>
          <span className="flex flex-col leading-none min-w-0">
            <span className="font-display text-sm sm:text-base font-bold tracking-tighter-display text-[rgb(var(--fg))] truncate">
              Hair <span className="text-gold-600 dark:text-gold-400">by</span> Thai Facial Clinic
            </span>
            <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.15em] muted hidden sm:block">Hair-transplant specialist · TFC group</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-medium md:flex">
          <Link href={`/${lang}/c/fue/`} className="muted hover:text-[rgb(var(--fg))] transition">FUE</Link>
          <Link href={`/${lang}/c/dhi/`} className="muted hover:text-[rgb(var(--fg))] transition">DHI</Link>
          <Link href={`/${lang}/c/smp/`} className="muted hover:text-[rgb(var(--fg))] transition">SMP</Link>
          <Link href={`/${lang}/guide/bangkok-hair-clinic-guide/`} className="muted hover:text-[rgb(var(--fg))] transition">Guides</Link>
          <Link href={`/${lang}/about/`} className="muted hover:text-[rgb(var(--fg))] transition">About</Link>
          <Link href={`/${lang}/contact/`} className="muted hover:text-[rgb(var(--fg))] transition">Contact</Link>
          <span className="h-4 w-px bg-[rgb(var(--border))]" />
          <Link href="/for-clinics/" className="btn-gold !px-4 !py-2 !text-xs">
            For Clinics →
          </Link>
        </nav>

        <div className="flex items-center gap-1.5">
          <select
            defaultValue={lang}
            onChange={(e) => { window.location.href = `/${e.target.value}/`; }}
            className="rounded-lg border bg-transparent px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider transition hover:border-[rgb(var(--accent))]"
            style={{ borderColor: "rgb(var(--border))" }}
            aria-label="Language"
          >
            {SUPPORTED_LANGS.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
          </select>
          <DarkModeToggle />
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            className="md:hidden grid h-9 w-9 place-items-center rounded-lg border transition hover:border-[rgb(var(--accent))]"
            style={{ borderColor: "rgb(var(--border))" }}
          >
            {open ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t" style={{ borderColor: "rgb(var(--border))" }}>
          <nav className="mx-auto max-w-6xl flex flex-col gap-1 py-3 text-sm font-medium">
            {[
              { href: `/${lang}/c/fue/`, label: "FUE" },
              { href: `/${lang}/c/dhi/`, label: "DHI" },
              { href: `/${lang}/c/smp/`, label: "SMP" },
              { href: `/${lang}/c/fut/`, label: "FUT" },
              { href: `/${lang}/c/prp/`, label: "PRP" },
              { href: `/${lang}/guide/bangkok-hair-clinic-guide/`, label: "Guides" },
              { href: `/${lang}/#directory`, label: "All clinics" },
              { href: `/${lang}/about/`, label: "About" },
              { href: `/${lang}/contact/`, label: "Contact" },
            ].map((it) => (
              <Link key={it.href} href={it.href} onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-lg hover:bg-[rgb(var(--bg-elev))]">
                {it.label}
              </Link>
            ))}
            <Link href="/for-clinics/" onClick={() => setOpen(false)}
              className="btn-gold mx-3 mt-2 !text-sm">
              For Clinics →
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
