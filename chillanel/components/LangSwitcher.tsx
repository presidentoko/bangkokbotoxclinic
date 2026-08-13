"use client";

import { usePathname } from "next/navigation";
import { SUPPORTED_LANGS, type Lang } from "@/lib/site";

const LABELS: Record<Lang, string> = { en: "EN", th: "ไทย", ko: "한국어" };

export function LangSwitcher({ current }: { current: Lang }) {
  const pathname = usePathname() || `/${current}`;
  const rest = pathname.split("/").slice(2).join("/");
  return (
    <div className="flex gap-2 text-sm">
      {SUPPORTED_LANGS.map((lang) => (
        <a
          key={lang}
          href={`/${lang}${rest ? `/${rest}` : ""}`}
          // dark:text-ink: dark mode's --accent is a bright teal (RGB 45 200 184)
          // that white text only hits ~2.1:1 contrast against, well under
          // WCAG AA's 4.5:1 -- --ink (near-black) clears ~10:1 there while
          // light mode's much darker --accent still reads fine with white.
          className={`px-2 py-1 rounded-md ${lang === current ? "bg-accent text-white dark:text-ink" : "text-muted hover:text-fg"}`}
        >
          {LABELS[lang]}
        </a>
      ))}
    </div>
  );
}
