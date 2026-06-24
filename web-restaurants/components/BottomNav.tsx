"use client";
import { usePathname } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
import { strings, tr } from "@/lib/strings";

const ITEMS = [
  { href: "/",               key: "home"     as const, icon: "🏠" },
  { href: "/famous-vs-good", key: "snsCheck" as const, icon: "📊" },
  { href: "/c/thai",         key: "explore"  as const, icon: "🍜" },
  { href: "/guide",          key: "guide"    as const, icon: "📖" },
];

export function BottomNav() {
  const path = usePathname();
  const locale = useLocale();

  function isActive(href: string) {
    if (href === "/") return path === "/" || path === "/ko" || path === "/th";
    return path.startsWith(href);
  }

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--card)] border-t border-[var(--border)] pb-safe">
      <div className="flex justify-around items-center h-14">
        {ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition ${
              isActive(item.href) ? "text-[var(--accent)]" : "text-[var(--muted)]"
            }`}
          >
            <span className="text-xl leading-none">{item.icon}</span>
            <span className="text-[10px] font-medium">{tr(strings.bottomNav[item.key], locale)}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
