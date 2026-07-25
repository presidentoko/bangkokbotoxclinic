"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
import { strings, tr } from "@/lib/strings";
import { localizedHubHref } from "@/lib/localizedHref";

const ITEMS = [
  { href: "/",               key: "home"     as const, icon: "🏠" },
  { href: "/famous-vs-good", key: "snsCheck" as const, icon: "📊" },
  { href: "/c/thai",         key: "explore"  as const, icon: "🍜" },
  { href: "/saved",          key: "saved"    as const, icon: "❤️" },
  { href: "/guide",          key: "guide"    as const, icon: "📖" },
];

const LOCALE_PREFIX_RE = /^\/(th|ko)(?=\/|$)/;
const EXPLORE_PREFIXES = ["/c/", "/d/", "/city/", "/restaurant/", "/best/"];

export function BottomNav() {
  const path = usePathname();
  const locale = useLocale();
  const unprefixed = path.replace(LOCALE_PREFIX_RE, "") || "/";

  function isActive(href: string) {
    if (href === "/") return unprefixed === "/";
    if (href === "/c/thai") return EXPLORE_PREFIXES.some((p) => unprefixed.startsWith(p));
    return unprefixed.startsWith(href);
  }

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--card)] border-t border-[var(--border)] pb-safe">
      <div className="flex justify-around items-stretch h-14">
        {ITEMS.map((item) => (
          <Link
            key={item.href}
            href={localizedHubHref(item.href, locale)}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 rounded-xl transition ${
              isActive(item.href) ? "text-[var(--accent)]" : "text-[var(--muted)]"
            }`}
          >
            <span className="text-xl leading-none">{item.icon}</span>
            <span className="text-[10px] font-medium">{tr(strings.bottomNav[item.key], locale)}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
