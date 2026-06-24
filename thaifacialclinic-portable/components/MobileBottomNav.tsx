"use client";
// Booking.com-style mobile bottom nav. Hidden on desktop (sm+).
// Has 4 tabs: Home / Search / Saved / Compare. Highlights active tab from pathname.
// Saved tab shows count badge from WishlistButton's localStorage.

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const KEY = "wishlist_v1";
const EVENT = "wishlist:changed";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [savedCount, setSavedCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    function readCount() {
      try {
        const raw = localStorage.getItem(KEY);
        const arr = raw ? JSON.parse(raw) : [];
        setSavedCount(Array.isArray(arr) ? arr.length : 0);
      } catch { setSavedCount(0); }
    }
    readCount();
    function onChange(e: Event) {
      setSavedCount(((e as CustomEvent<string[]>).detail || []).length);
    }
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
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
      href: `/${lang}/saved/`,
      label: "Saved",
      icon: "❤",
      match: (p: string) => p.startsWith(`/${lang}/saved`),
    },
    {
      href: `/${lang}/compare/`,
      label: "Compare",
      icon: "⚖",
      match: (p: string) => p.startsWith(`/${lang}/compare`),
    },
  ];

  return (
    <nav
      className="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t shadow-[0_-2px_8px_rgba(0,0,0,0.04)] print:hidden"
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
                isActive ? "text-emerald-700" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <span className="text-xl leading-none mb-0.5">{t.icon}</span>
              <span>{t.label}</span>
              {t.label === "Saved" && savedCount > 0 && (
                <span className="absolute top-1 right-1/2 translate-x-3 grid place-items-center h-4 min-w-[16px] px-1 rounded-full bg-red-500 text-white text-[9px] font-black">
                  {savedCount}
                </span>
              )}
              {isActive && <span className="absolute top-0 inset-x-6 h-0.5 bg-emerald-600 rounded-full" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
