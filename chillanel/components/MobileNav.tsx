"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SUPPORTED_LANGS, type Lang } from "@/lib/site";
import type { Dict } from "@/lib/i18n";
import { SearchBox } from "./SearchBox";

const LANG_LABELS: Record<Lang, string> = { en: "EN", th: "ไทย", ko: "한국어" };

export function MobileNav({ lang, t }: { lang: Lang; t: Dict["nav"] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || `/${lang}`;
  const rest = pathname.split("/").slice(2).join("/");
  const containerRef = useRef<HTMLDivElement>(null);

  // Drawer lifecycle: previously had no way to close except tapping a
  // link inside it -- no click-outside, no Escape, and the page behind it
  // stayed scrollable (so a drag on the drawer's background scrolled the
  // page under a nav that looked modal but wasn't behaving like one).
  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <div className="sm:hidden" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? t.menuClose : t.menuOpen}
        className="flex flex-col items-center justify-center gap-1.5 w-10 h-10 -mr-2"
      >
        <span
          className={`block h-0.5 w-5 bg-fg transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
        />
        <span className={`block h-0.5 w-5 bg-fg transition-opacity ${open ? "opacity-0" : ""}`} />
        <span
          className={`block h-0.5 w-5 bg-fg transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
        />
      </button>

      {open && (
        <div
          id="mobile-nav-panel"
          // Landscape phones (~360-400px viewport height) clip the drawer's
          // content -- search + 5 links + language row runs ~420px tall --
          // while body scroll is locked (see the effect above), leaving the
          // language row unreachable. max-h + overflow-y-auto lets the
          // panel itself scroll instead of assuming it always fits.
          className="absolute left-0 right-0 top-14 max-h-[calc(100dvh-3.5rem)] overflow-y-auto overscroll-contain border-b border-border bg-bg-elev shadow-lg"
        >
          <nav className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-1 text-base font-medium">
            <div className="pb-3 mb-1 border-b border-border">
              <SearchBox lang={lang} t={t} />
            </div>
            <Link href={`/${lang}`} onClick={() => setOpen(false)} className="min-h-11 flex items-center py-2.5 active:bg-bg rounded-lg">
              {t.home}
            </Link>
            <Link href={`/${lang}/guide`} onClick={() => setOpen(false)} className="min-h-11 flex items-center py-2.5 active:bg-bg rounded-lg">
              {t.guides}
            </Link>
            <Link href={`/${lang}/favorites`} onClick={() => setOpen(false)} className="min-h-11 flex items-center py-2.5 active:bg-bg rounded-lg">
              {t.favorites}
            </Link>
            <Link href={`/${lang}/compare`} onClick={() => setOpen(false)} className="min-h-11 flex items-center py-2.5 active:bg-bg rounded-lg">
              {t.compare}
            </Link>
            <Link href={`/${lang}/about`} onClick={() => setOpen(false)} className="min-h-11 flex items-center py-2.5 active:bg-bg rounded-lg">
              {t.about}
            </Link>
            <div className="flex gap-2 pt-3 mt-2 border-t border-border">
              {SUPPORTED_LANGS.map((l) => (
                <Link
                  key={l}
                  href={`/${l}${rest ? `/${rest}` : ""}`}
                  onClick={() => setOpen(false)}
                  // dark:text-ink -- see LangSwitcher.tsx: dark mode's --accent
                  // is bright enough that white text fails WCAG AA (~2.1:1)
                  // against it, while --ink clears it easily.
                  className={`px-3 py-1.5 rounded-md text-sm ${l === lang ? "bg-accent text-white dark:text-ink" : "text-muted"}`}
                >
                  {LANG_LABELS[l]}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
