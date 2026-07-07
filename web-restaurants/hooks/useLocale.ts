"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/locale";

function localeFromPath(pathname: string): Locale | null {
  if (pathname === "/th" || pathname.startsWith("/th/")) return "th";
  if (pathname === "/ko" || pathname.startsWith("/ko/")) return "ko";
  return null;
}

function readCookieLocale(): Locale {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]+)/);
  const v = match?.[1];
  if (v === "ko" || v === "th") return v;
  return "en";
}

export function useLocale(): Locale {
  const pathname = usePathname();
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    setLocale(localeFromPath(pathname) ?? readCookieLocale());
  }, [pathname]);

  return locale;
}
