"use client";
// Mobile bottom spacer — matches MobileBottomNav height (h-20 = 80px).
// On clinic detail pages MobileBottomNav hides itself but FloatingContactBar
// takes over the same fixed-bottom slot (~64px) — without a spacer sized to
// match it, page content (incl. the footer) renders permanently underneath
// the bar (2026-07-28 감사에서 발견).
import { usePathname } from "next/navigation";

export function NavSpacer() {
  const pathname = usePathname() || "/";
  const isClinic = /^\/(?:[a-z]{2}\/)?clinic\//.test(pathname);
  const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname.startsWith("/onboarding");
  if (isDashboard) return null;
  // h-20(80px): FloatingContactBar 실측 높이가 67px라 h-16(64px)은 3px 부족했음
  // — 기본 MobileBottomNav 케이스와 동일하게 여유를 둔다 (2026-07-28 측정).
  if (isClinic) return <div className="md:hidden h-20" aria-hidden />;
  return <div className="sm:hidden h-20" aria-hidden />;
}
