"use client";

import { usePathname } from "next/navigation";

export function StickyBottomNav() {
  const pathname = usePathname();

  const isActivitiesSection = pathname.startsWith("/activities");
  const isRestaurantSection =
    pathname.startsWith("/restaurant") ||
    pathname.startsWith("/c/") ||
    pathname.startsWith("/d/") ||
    pathname.startsWith("/best/");

  const navItems = [
    { href: "/", icon: "🏠", label: "Home", active: pathname === "/" },
    { href: "/activities", icon: "🎯", label: "Activities", active: isActivitiesSection },
    { href: "/restaurants", icon: "🍜", label: "Restaurants", active: isRestaurantSection },
    { href: "/plan", icon: "📋", label: "My Trip", active: pathname === "/plan" },
    { href: "/guide", icon: "📖", label: "Guides", active: pathname.startsWith("/guide") },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white border-t border-[var(--border)] px-2 pb-safe">
      <div className="grid grid-cols-5">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center py-2 text-center transition ${
              item.active ? "text-orange-600" : "text-[var(--muted)] hover:text-[var(--fg)]"
            }`}
          >
            <span className="text-xl leading-none">{item.icon}</span>
            <span className="text-[10px] font-medium mt-0.5 leading-tight">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
