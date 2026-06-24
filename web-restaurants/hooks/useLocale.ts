"use client";
import { useMemo } from "react";
import type { Locale } from "@/lib/locale";

export function useLocale(): Locale {
  return useMemo(() => {
    if (typeof document === "undefined") return "en";
    const match = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]+)/);
    const v = match?.[1];
    if (v === "ko" || v === "th") return v;
    return "en";
  }, []);
}
