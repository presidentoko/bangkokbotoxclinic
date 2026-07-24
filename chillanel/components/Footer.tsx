import Link from "next/link";
import { tFor } from "@/lib/i18n";
import { SUPPORTED_LANGS, type Lang } from "@/lib/site";

const LANG_LABELS: Record<Lang, string> = { en: "English", th: "ไทย", ko: "한국어" };

export function Footer({ lang }: { lang: Lang }) {
  const t = tFor(lang);
  return (
    <footer className="border-t border-border mt-16">
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
          </div>
        </div>
        <div>
          <div className="font-semibold mb-2 text-xs uppercase tracking-wide text-muted">
            {t.footer.languageTitle}
          </div>
          <div className="flex flex-col gap-1.5">
            {SUPPORTED_LANGS.map((l) => (
              <Link key={l} href={`/${l}`} className="hover:text-accent transition-colors">
                {LANG_LABELS[l]}
              </Link>
            ))}
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
