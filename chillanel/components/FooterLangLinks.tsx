"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SUPPORTED_LANGS, type Lang } from "@/lib/site";

const LANG_LABELS: Record<Lang, string> = { en: "English", th: "ไทย", ko: "한국어" };

// Footer.tsx is a server component (these pages are 100% statically
// generated, dynamicParams: false everywhere -- pulling next/headers'
// pathname into it would force dynamic rendering), so it can't preserve
// the current path itself the way LangSwitcher.tsx already does for the
// header. Split out into its own small client island instead of dumping
// every footer language click to the homepage.
export function FooterLangLinks({ lang }: { lang: Lang }) {
  const pathname = usePathname() || `/${lang}`;
  const rest = pathname.split("/").slice(2).join("/");
  return (
    <>
      {SUPPORTED_LANGS.map((l) => (
        <Link key={l} href={`/${l}${rest ? `/${rest}` : ""}`} className="hover:text-accent transition-colors">
          {LANG_LABELS[l]}
        </Link>
      ))}
    </>
  );
}
