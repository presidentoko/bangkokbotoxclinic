"use client";
import { useState } from "react";
import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";
import { strings, tr } from "@/lib/strings";
import { localizedHubHref } from "@/lib/localizedHref";

const LINKS = [
  { href: "/famous-vs-good", label: strings.common.snsCheck },
  { href: "/best/halal", label: strings.common.bestOf },
  { href: "/guide", label: strings.common.guides },
  { href: "/c/thai", label: strings.common.thai },
  { href: "/saved", label: strings.bottomNav.saved },
  { href: "/about", label: strings.common.about },
  { href: "/contact", label: strings.common.contact },
  { href: "/for-restaurants", label: strings.common.forRestaurants },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const locale = useLocale();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="sm:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-[var(--fg)]"
      >
        <span className="text-xl leading-none">☰</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute top-0 right-0 h-full w-72 max-w-[85%] bg-[var(--card)] shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between px-5 h-14 border-b border-[var(--border)]">
              <span className="font-serif-display text-lg text-[var(--fg)]">Menu</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-xl text-[var(--muted)] hover:text-[var(--fg)]"
              >
                ✕
              </button>
            </div>
            <nav className="flex flex-col px-2 py-2">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={localizedHubHref(l.href, locale)}
                  onClick={() => setOpen(false)}
                  className="min-h-[48px] flex items-center px-3 rounded-xl text-[var(--fg)] font-medium hover:bg-[var(--accent-light)] hover:text-[var(--accent)] transition"
                >
                  {tr(l.label, locale)}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
