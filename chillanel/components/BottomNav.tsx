"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Lang } from "@/lib/site";
import type { Dict } from "@/lib/i18n";

// Fixed mobile tab bar — the single biggest lever for the site to *feel*
// like an app rather than a website (a persistent bottom bar reads as
// "app shell" in a way a hamburger drawer, which MobileNav already
// provides for secondary links, doesn't). Desktop keeps the header nav
// only; this is sm:hidden. [lang]/layout.tsx adds matching bottom padding
// to <main> on mobile so this bar never covers page content, and the
// place detail page's floating "View on Maps" CTA sits above it
// (bottom-20 instead of bottom-4) to avoid overlapping.
// Takes the nav dict slice as a prop instead of calling tFor(lang) itself --
// this bar is mounted on every single page ([lang]/layout.tsx renders it
// unconditionally), so pulling in lib/i18n's full ~56KB (all 3 languages)
// here means every page's client bundle carries it regardless of which one
// language it actually needs. The layout is a Server Component that already
// resolves the dict server-side for MobileNav; reusing that here too costs
// nothing extra server-side and removes lib/i18n from this client chunk.
export function BottomNav({ lang, browseHref, t }: { lang: Lang; browseHref: string; t: Dict["nav"] }) {
  const pathname = usePathname() || `/${lang}`;
  const segment = pathname.split("/")[2] ?? "";

  const items: { href: string; label: string; icon: string; active: boolean }[] = [
    { href: `/${lang}`, label: t.home, icon: "⌂", active: segment === "" },
    { href: browseHref, label: t.browse, icon: "☰", active: segment === "city" },
    { href: `/${lang}/favorites`, label: t.favorites, icon: "♡", active: segment === "favorites" },
    { href: `/${lang}/compare`, label: t.compare, icon: "⇄", active: segment === "compare" },
    { href: `/${lang}/guide`, label: t.guides, icon: "▤", active: segment === "guide" },
  ];

  return (
    // The height and bottom-padding classes below add the safe-area-inset
    // env variable on top of the normal 4rem bar height: on notched
    // iPhones, a plain `fixed bottom-0` bar sits directly under the
    // home-indicator gesture zone, and the inset adds real height so the
    // icons/labels clear it instead of being crowded against it.
    // Footer.tsx and the place detail page's own bottom padding add the
    // same inset so nothing ends up permanently hidden behind the now-
    // taller bar.
    <nav
      className="sm:hidden fixed bottom-0 left-0 right-0 z-30 h-[calc(4rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] border-t border-border bg-bg-elev/95 backdrop-blur flex items-stretch"
      aria-label={t.home}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors active:bg-bg ${
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
