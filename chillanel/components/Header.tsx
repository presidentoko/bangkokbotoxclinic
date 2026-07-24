import Link from "next/link";
import { tFor } from "@/lib/i18n";
import type { Lang } from "@/lib/site";
import { LangSwitcher } from "./LangSwitcher";
import { MobileNav } from "./MobileNav";

export function Header({ lang }: { lang: Lang }) {
  const t = tFor(lang);
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg-elev/90 backdrop-blur">
      <div className="relative max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href={`/${lang}`} className="font-black text-lg tracking-tight text-accent">
          chillanel
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
          <Link href={`/${lang}`} className="hover:text-accent transition-colors">
            {t.nav.home}
          </Link>
          <Link href={`/${lang}/guide`} className="hover:text-accent transition-colors">
            {t.nav.guides}
          </Link>
          <Link href={`/${lang}/about`} className="hover:text-accent transition-colors">
            {t.nav.about}
          </Link>
          <LangSwitcher current={lang} />
        </nav>
        <MobileNav lang={lang} t={t.nav} />
      </div>
    </header>
  );
}
