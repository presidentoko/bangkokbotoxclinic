"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type LinkItem = { href: string; label: string };

const PRIMARY: LinkItem[] = [
  { href: "/verify", label: "Verify" },
  { href: "/restaurants/cuisine/thai", label: "Thai" },
  { href: "/activities", label: "Activities" },
  { href: "/trending", label: "Trending" },
  { href: "/for", label: "Perfect For" },
];

const MORE: LinkItem[] = [
  { href: "/restaurants/cuisine/japanese", label: "Japanese" },
  { href: "/restaurants/cuisine/italian", label: "Italian" },
  { href: "/best/halal", label: "Best of" },
  { href: "/day-plan", label: "Day Plan" },
  { href: "/quiz", label: "🎯 Quiz" },
  { href: "/bingo", label: "🏆 Bingo" },
  { href: "/my-trip", label: "🗺 My Trip" },
  { href: "/clinics", label: "Clinics" },
  { href: "/dental", label: "Dental" },
  { href: "/guide", label: "Guides" },
  { href: "/about", label: "About" },
];

const LANGS: LinkItem[] = [
  { href: "/", label: "EN" },
  { href: "/th", label: "TH" },
  { href: "/ko", label: "KO" },
  { href: "/ja", label: "JA" },
  { href: "/ru", label: "RU" },
  { href: "/ar", label: "AR" },
];

function useCloseOnOutside(ref: React.RefObject<HTMLElement | null>, close: () => void) {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [ref, close]);
}

function Dropdown({ label, items }: { label: string; items: LinkItem[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useCloseOnOutside(ref, () => setOpen(false));

  return (
    <div className="relative hidden md:block" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="hover:text-black flex items-center gap-1 text-[var(--muted)]"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {label} <span className="text-[10px]">▾</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-[var(--border)] rounded-xl shadow-lg py-1.5 z-50">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center min-h-[44px] px-3 text-sm hover:bg-gray-50 hover:text-black text-[var(--muted)]"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export function HeaderNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <nav className="text-sm hidden md:flex gap-5 text-[var(--muted)] items-center">
        {PRIMARY.map((item) => (
          <a key={item.href} href={item.href} className="hover:text-black">
            {item.label}
          </a>
        ))}
        <Dropdown label="More" items={MORE} />
        <a
          href="/for-venues"
          className="px-3 py-1.5 rounded-full bg-black text-white hover:bg-gray-800 text-xs font-bold"
        >
          For owners →
        </a>
        <Dropdown label="EN" items={LANGS} />
      </nav>

      {/* Mobile hamburger */}
      <button
        className="md:hidden flex items-center justify-center w-11 h-11 -mr-1 text-[var(--fg)]"
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((o) => !o)}
      >
        {mobileOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="4" x2="20" y2="20" />
            <line x1="20" y1="4" x2="4" y2="20" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-14 z-40 bg-white overflow-y-auto pb-24">
          <div className="px-4 py-4 space-y-6">
            <div>
              <div className="grid grid-cols-2 gap-2">
                {[...PRIMARY, ...MORE].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="px-3 py-2.5 rounded-lg border border-[var(--border)] text-sm font-medium hover:border-orange-400 hover:text-orange-700"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
            <a
              href="/for-venues"
              className="block text-center px-3 py-2.5 rounded-full bg-black text-white text-sm font-bold"
            >
              For owners →
            </a>
            <div>
              <div className="text-xs uppercase tracking-wide text-[var(--muted)] mb-2">Language</div>
              <div className="flex flex-wrap gap-2">
                {LANGS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="px-3 py-1.5 rounded-full border border-[var(--border)] text-xs font-medium hover:border-orange-400"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
