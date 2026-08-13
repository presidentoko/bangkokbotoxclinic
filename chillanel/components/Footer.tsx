import Link from "next/link";
import { tFor } from "@/lib/i18n";
import type { Lang } from "@/lib/site";
import { FooterLangLinks } from "./FooterLangLinks";

export function Footer({ lang }: { lang: Lang }) {
  const t = tFor(lang);
  return (
    // pb matches BottomNav.tsx's real height (4rem + safe-area-inset-bottom)
    // on mobile, so the footer's last line always scrolls clear of it.
    <footer className="border-t border-border mt-16 pb-[calc(4rem+env(safe-area-inset-bottom))] sm:pb-0">
      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
        <div className="col-span-2 sm:col-span-1">
          <div className="font-black text-accent mb-2">chillanel</div>
          <p className="text-muted leading-relaxed">{t.footer.tagline}</p>
        </div>
        <div>
          <div className="font-semibold mb-2 text-xs uppercase tracking-wide text-muted">
            {t.footer.exploreTitle}
          </div>
          <div className="flex flex-col gap-1.5">
            <Link href={`/${lang}`} className="hover:text-accent transition-colors">
              {t.nav.home}
            </Link>
            <Link href={`/${lang}/guide`} className="hover:text-accent transition-colors">
              {t.nav.guides}
            </Link>
            <Link href={`/${lang}/about`} className="hover:text-accent transition-colors">
              {t.nav.about}
            </Link>
            <Link href={`/${lang}/advertise`} className="hover:text-accent transition-colors">
              {t.advertise.title}
            </Link>
          </div>
        </div>
        <div>
          <div className="font-semibold mb-2 text-xs uppercase tracking-wide text-muted">
            {t.footer.languageTitle}
          </div>
          <div className="flex flex-col gap-1.5">
            <FooterLangLinks lang={lang} />
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="max-w-5xl mx-auto px-4 py-4 text-xs text-muted">
          © {new Date().getFullYear()} chillanel. {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}
