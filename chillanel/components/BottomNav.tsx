"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Lang } from "@/lib/site";
import { tFor } from "@/lib/i18n";

// Fixed mobile tab bar — the single biggest lever for the site to *feel*
// like an app rather than a website (a persistent bottom bar reads as
// "app shell" in a way a hamburger drawer, which MobileNav already
// provides for secondary links, doesn't). Desktop keeps the header nav
// only; this is sm:hidden. [lang]/layout.tsx adds matching bottom padding
// to <main> on mobile so this bar never covers page content, and the
// place detail page's floating "View on Maps" CTA sits above it
// (bottom-20 instead of bottom-4) to avoid overlapping.
export function BottomNav({ lang }: { lang: Lang }) {
  const t = tFor(lang);
  const pathname = usePathname() || `/${lang}`;
  const segment = pathname.split("/")[2] ?? "";

  const items: { href: string; label: string; icon: string; active: boolean }[] = [
    { href: `/${lang}`, label: t.nav.home, icon: "⌂", active: segment === "" },
    { href: `/${lang}/city/bangkok`, label: t.nav.browse, icon: "☰", active: segment === "city" },
    { href: `/${lang}/favorites`, label: t.nav.favorites, icon: "♡", active: segment === "favorites" },
    { href: `/${lang}/compare`, label: t.nav.compare, icon: "⇄", active: segment === "compare" },
    { href: `/${lang}/guide`, label: t.nav.guides, icon: "▤", active: segment === "guide" },
  ];

  return (
    <nav
      className="sm:hidden fixed bottom-0 left-0 right-0 z-30 h-16 border-t border-border bg-bg-elev/95 backdrop-blur flex items-stretch"
      aria-label={t.nav.home}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors ${
            item.active ? "text-accent" : "text-muted"
          }`}
        >
          <span className="text-lg leading-none" aria-hidden="true">
            {item.icon}
          </span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
