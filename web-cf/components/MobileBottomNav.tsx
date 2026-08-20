"use client";
// Booking.com-style mobile bottom nav. Hidden on desktop (sm+).
// Has 4 tabs: Home / Search / Saved / Compare. Highlights active tab from pathname.
// Saved tab shows count badge from WishlistButton's localStorage.

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const KEY = "wishlist_v1";
const EVENT = "wishlist:changed";

const TABS = [
  { href: "/",          label: "Home",    icon: "🏠" },
  { href: "/c",         label: "Browse",  icon: "🔍", match: (p: string) => p.startsWith("/c") || p.startsWith("/clinic") },
  { href: "/saved",     label: "Saved",   icon: "❤" },
  { href: "/compare",   label: "Compare", icon: "⚖" },
];

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

  // Hide on dashboard / admin / onboarding (less consumer-facing)
  // Hide on /clinic/[id] — FloatingContactBar owns the bottom there.
  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin") || pathname?.startsWith("/onboarding")) return null;
  if (pathname && /^\/(?:[a-z]{2}\/)?clinic\//.test(pathname)) return null;

  return (
    <nav className="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t shadow-[0_-2px_8px_rgba(0,0,0,0.04)] print:hidden"
      style={{ borderColor: "var(--border)", paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="grid grid-cols-4">
        {TABS.map((t) => {
          const isActive = t.match
            ? t.match(pathname || "/")
            : pathname === t.href || pathname === t.href + "/";
          return (
            <a key={t.href} href={t.href}
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
            </a>
          );
        })}
      </div>
    </nav>
  );
}
