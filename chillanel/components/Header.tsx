import Link from "next/link";
import { tFor } from "@/lib/i18n";
import type { Lang } from "@/lib/site";
import { LangSwitcher } from "./LangSwitcher";

export function Header({ lang }: { lang: Lang }) {
  const t = tFor(lang);
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg-elev/90 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href={`/${lang}`} className="font-black text-lg tracking-tight text-accent">
          chillanel
        </Link>
        <nav className="hidden sm:flex gap-6 text-sm font-medium">
          <Link href={`/${lang}`} className="hover:text-accent">{t.nav.home}</Link>
          <Link href={`/${lang}/guide`} className="hover:text-accent">{t.nav.guides}</Link>
          <Link href={`/${lang}/about`} className="hover:text-accent">{t.nav.about}</Link>
        </nav>
        <LangSwitcher current={lang} />
      </div>
    </header>
  );
}
