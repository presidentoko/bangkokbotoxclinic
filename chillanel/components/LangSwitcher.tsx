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
          className={`px-2 py-1 rounded-md ${lang === current ? "bg-accent text-white" : "text-muted hover:text-fg"}`}
        >
          {LABELS[lang]}
        </a>
      ))}
    </div>
  );
}
