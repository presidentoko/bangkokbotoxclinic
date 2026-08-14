import Link from "next/link";
import { tFor } from "@/lib/i18n";
import type { Lang } from "@/lib/site";
import { LangSwitcher } from "./LangSwitcher";
import { MobileNav } from "./MobileNav";
import { SearchBox } from "./SearchBox";
import { HeaderNavLink } from "./HeaderNavLink";

export function Header({ lang }: { lang: Lang }) {
  const t = tFor(lang);
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg-elev/90 backdrop-blur">
      <div className="relative max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link
          href={`/${lang}`}
          className="font-display font-semibold italic text-xl tracking-tight text-accent shrink-0"
        >
          chillanel
        </Link>
        <div className="hidden sm:block flex-1 max-w-[240px]">
          <SearchBox lang={lang} t={t.nav} />
        </div>
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium shrink-0">
          <HeaderNavLink href={`/${lang}`}>{t.nav.home}</HeaderNavLink>
          <HeaderNavLink href={`/${lang}/guide`}>{t.nav.guides}</HeaderNavLink>
          <HeaderNavLink href={`/${lang}/favorites`}>{t.nav.favorites}</HeaderNavLink>
          <HeaderNavLink href={`/${lang}/compare`}>{t.nav.compare}</HeaderNavLink>
          <HeaderNavLink href={`/${lang}/about`}>{t.nav.about}</HeaderNavLink>
          <LangSwitcher current={lang} />
        </nav>
        <MobileNav lang={lang} t={t.nav} />
      </div>
    </header>
  );
}
