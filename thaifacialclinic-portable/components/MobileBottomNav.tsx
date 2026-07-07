"use client";
// Booking.com-style mobile bottom nav. Hidden on desktop (sm+).
// Has 4 tabs: Home / Browse / Guides / Contact. Highlights active tab from pathname.
// (No wishlist/compare feature exists on this site — those routes don't exist, so the
// nav points to real destinations instead of 404ing.)

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin") || pathname?.startsWith("/onboarding")) return null;
  if (pathname && /\/clinic\//.test(pathname)) return null;

  // Extract lang prefix from path — fallback to "en"
  const langMatch = (pathname || "").match(/^\/([a-z]{2})\//);
  const lang = langMatch ? langMatch[1] : "en";

  const TABS = [
    {
      href: `/${lang}/`,
      label: "Home",
      icon: "🏠",
      match: (p: string) => p === `/${lang}/`,
    },
    {
      href: `/${lang}/c/`,
      label: "Browse",
      icon: "🔍",
      match: (p: string) => p.startsWith(`/${lang}/c/`),
    },
    {
      href: `/${lang}/guide/`,
      label: "Guides",
      icon: "📖",
      match: (p: string) => p.startsWith(`/${lang}/guide`),
    },
    {
      href: `/${lang}/contact/`,
      label: "Contact",
      icon: "💬",
      match: (p: string) => p.startsWith(`/${lang}/contact`),
    },
  ];

  return (
    <nav
      className="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-[rgb(var(--bg-elev))] border-t border-[rgb(var(--border))] shadow-[0_-2px_8px_rgba(0,0,0,0.04)] print:hidden"
      style={{ borderColor: "rgb(var(--border))", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-4">
        {TABS.map((t) => {
          const isActive = t.match(pathname || "/");
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`relative flex flex-col items-center justify-center py-2.5 text-[10px] font-bold transition ${
                isActive ? "text-emerald-700 dark:text-emerald-400" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <span className="text-xl leading-none mb-0.5">{t.icon}</span>
              <span>{t.label}</span>
              {isActive && <span className="absolute top-0 inset-x-6 h-0.5 bg-emerald-600 rounded-full" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
