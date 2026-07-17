"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Root layout renders a single <html lang="en">, but /th /ko /ja /ru /ar are
// real static routes with real translated content — search engines read
// <html lang> (not a nested <div lang>) to validate the hreflang cluster
// declared in metadata.alternates.languages. This corrects the attribute
// post-hydration without touching static generation (no headers()/dynamic
// APIs in the layout itself).
const LANG_DIR: Record<string, { lang: string; dir: "rtl" | "ltr" }> = {
  th: { lang: "th", dir: "ltr" },
  ko: { lang: "ko", dir: "ltr" },
  ja: { lang: "ja", dir: "ltr" },
  ru: { lang: "ru", dir: "ltr" },
  ar: { lang: "ar", dir: "rtl" },
};

export function HtmlLangSync() {
  const pathname = usePathname();

  useEffect(() => {
    const seg = pathname.split("/")[1];
    const entry = LANG_DIR[seg] ?? { lang: "en", dir: "ltr" };
    document.documentElement.lang = entry.lang;
    document.documentElement.dir = entry.dir;
  }, [pathname]);

  return null;
}
