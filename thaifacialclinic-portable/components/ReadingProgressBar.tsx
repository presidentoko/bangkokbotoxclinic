"use client";
// Thin progress bar at top of page showing scroll-through %. Hidden on dashboard/admin.

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function ReadingProgressBar() {
  const pathname = usePathname();
  const [pct, setPct] = useState(0);

  useEffect(() => {
    function onScroll() {
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setPct(max > 0 ? Math.min(100, (scrolled / max) * 100) : 0);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin")) return null;

  return (
    <div className="fixed top-0 inset-x-0 h-0.5 z-50 pointer-events-none print:hidden">
      <div
        className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-150"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
