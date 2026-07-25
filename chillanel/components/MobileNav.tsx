"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SUPPORTED_LANGS, type Lang } from "@/lib/site";
import type { Dict } from "@/lib/i18n";

const LANG_LABELS: Record<Lang, string> = { en: "EN", th: "ไทย", ko: "한국어" };

export function MobileNav({ lang, t }: { lang: Lang; t: Dict["nav"] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || `/${lang}`;
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <div className="sm:hidden">
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
          className="absolute left-0 right-0 top-14 border-b border-border bg-bg-elev shadow-lg"
        >
          <nav className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-1 text-base font-medium">
            <Link href={`/${lang}`} onClick={() => setOpen(false)} className="py-2.5">
              {t.home}
            </Link>
            <Link href={`/${lang}/guide`} onClick={() => setOpen(false)} className="py-2.5">
              {t.guides}
            </Link>
            <Link href={`/${lang}/favorites`} onClick={() => setOpen(false)} className="py-2.5">
              {t.favorites}
            </Link>
            <Link href={`/${lang}/compare`} onClick={() => setOpen(false)} className="py-2.5">
              {t.compare}
            </Link>
            <Link href={`/${lang}/about`} onClick={() => setOpen(false)} className="py-2.5">
              {t.about}
            </Link>
            <div className="flex gap-2 pt-3 mt-2 border-t border-border">
              {SUPPORTED_LANGS.map((l) => (
                <Link
                  key={l}
                  href={`/${l}${rest ? `/${rest}` : ""}`}
                  onClick={() => setOpen(false)}
                  className={`px-3 py-1.5 rounded-md text-sm ${l === lang ? "bg-accent text-white" : "text-muted"}`}
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
