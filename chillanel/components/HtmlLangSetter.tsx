"use client";

import { useEffect } from "react";
import type { Lang } from "@/lib/site";

/**
 * The root `<html>` tag lives in app/layout.tsx (Next.js only allows one per
 * app) and can't know the active `[lang]` route segment. This client-only
 * component sets `document.documentElement.lang` after mount so every th/ko
 * page ends up with the correct `lang` attribute instead of the root's "en"
 * default. Runs post-hydration, so it can't cause a hydration mismatch.
 */
export function HtmlLangSetter({ lang }: { lang: Lang }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
