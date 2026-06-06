"use client";
// Mobile bottom spacer — matches MobileBottomNav height (h-20 = 80px).
// Skips clinic detail pages since MobileBottomNav hides itself there.
import { usePathname } from "next/navigation";

export function NavSpacer() {
  const pathname = usePathname() || "/";
  const isClinic = /^\/(?:[a-z]{2}\/)?clinic\//.test(pathname);
  const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname.startsWith("/onboarding");
  if (isClinic || isDashboard) return null;
  return <div className="sm:hidden h-20" aria-hidden />;
}
