"use client";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/locale";

function readLocale(): Locale {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]+)/);
  const v = match?.[1];
  if (v === "ko" || v === "th") return v;
  return "en";
}

export function useLocale(): Locale {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    setLocale(readLocale());
  }, []);

  return locale;
}
