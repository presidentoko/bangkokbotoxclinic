"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function StickyBottomNav() {
  const pathname = usePathname();
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    try {
      const items = JSON.parse(localStorage.getItem("thaigle_saved") ?? "[]");
      setSavedCount(items.length);
    } catch {}
  }, [pathname]);

  const isActivitiesSection = pathname.startsWith("/activities");
  const isRestaurantSection =
    pathname.startsWith("/restaurant") ||
    pathname.startsWith("/c/") ||
    pathname.startsWith("/d/") ||
    pathname.startsWith("/best/");

  const navItems = [
    { href: "/", icon: "🏠", label: "Home", active: pathname === "/" },
    { href: "/activities", icon: "🎯", label: "Activities", active: isActivitiesSection },
    { href: "/verify", icon: "🔎", label: "Verify", active: pathname.startsWith("/verify") },
    { href: "/restaurants", icon: "🍜", label: "Eat", active: isRestaurantSection },
    { href: "/my-trip", icon: "🗺", label: "My Trip", active: pathname === "/my-trip" || pathname === "/plan" || pathname === "/bingo" || pathname === "/quiz", badge: savedCount > 0 ? savedCount : undefined },
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
            <div className="relative inline-flex">
              <span className="text-xl leading-none">{item.icon}</span>
              {"badge" in item && item.badge !== undefined && (
                <span className="absolute -top-1 -right-1.5 bg-red-500 text-white text-[8px] font-black rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none">
                  {item.badge > 9 ? "9+" : item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium mt-0.5 leading-tight">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
