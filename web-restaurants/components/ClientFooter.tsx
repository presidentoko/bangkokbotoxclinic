"use client";
import { useLocale } from "@/hooks/useLocale";
import { strings, tr } from "@/lib/strings";
import { CUISINE_LABELS } from "@/lib/types";
import { localizedHubHref } from "@/lib/localizedHref";

export function ClientFooter({
  brand,
  year,
  topCuisines = [],
  topDistricts = [],
}: {
  brand: string;
  year: number;
  topCuisines?: string[];
  topDistricts?: string[];
}) {
  const locale = useLocale();
  const s = strings.footer;
  const c = strings.common;

  return (
    <footer className="border-t border-[var(--border)] mt-16 bg-[var(--card)]">
      <div className="max-w-5xl mx-auto px-4 py-8 text-sm text-[var(--muted)]">
        <p className="font-serif-display text-xl text-[var(--fg)] mb-1">{tr(s.tagline, locale)}</p>
        <p className="text-xs text-[var(--muted)] mb-5 max-w-xl">
          {tr(s.desc, locale)}{" "}
          <a href="/famous-vs-good" className="text-[var(--accent)] hover:underline font-medium">
            {tr(s.seeDetector, locale)}
          </a>
        </p>

        {(topCuisines.length > 0 || topDistricts.length > 0) && (
          <div className="flex flex-wrap gap-x-8 gap-y-4 mb-5 pb-5 border-b border-[var(--border)]">
            {topCuisines.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-wide font-bold mb-2">Popular cuisines</div>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                  {topCuisines.map((cat) => (
                    <a key={cat} href={localizedHubHref(`/c/${cat}`, locale)} className="hover:text-[var(--fg)]">
                      {CUISINE_LABELS[cat] ?? cat}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {topDistricts.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-wide font-bold mb-2">Popular areas</div>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                  {topDistricts.map((d) => (
                    <a key={d} href={localizedHubHref(`/d/${d.toLowerCase().replace(/\s+/g, "-")}`, locale)} className="hover:text-[var(--fg)]">
                      {d}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-x-8 gap-y-3 mb-4">
          <a href="/famous-vs-good" className="hover:text-[var(--fg)] font-medium">{tr(c.snsCheck, locale)}</a>
          <a href="/about" className="hover:text-[var(--fg)]">{tr(c.about, locale)}</a>
          <a href="/contact" className="hover:text-[var(--fg)]">{tr(c.contact, locale)}</a>
          <a href="/for-restaurants" className="hover:text-[var(--fg)]">{tr(c.forRestaurants, locale)}</a>
          <a href="/sitemap.xml" className="hover:text-[var(--fg)]">Sitemap</a>
          <a href="/llms.txt" className="hover:text-[var(--fg)]">llms.txt</a>
          <a href="/feed.xml" className="hover:text-[var(--fg)]">RSS</a>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4 text-xs">
          <a href="/" hrefLang="en" className="hover:text-[var(--fg)]">English</a>
          <a href="/th" hrefLang="th" className="hover:text-[var(--fg)]">ไทย</a>
          <a href="/ko" hrefLang="ko" className="hover:text-[var(--fg)]">한국어</a>
        </div>
        <p className="text-xs leading-relaxed max-w-2xl">{tr(s.disclaimer, locale)}</p>
        <p className="text-xs mt-3">© {year} {brand} · {tr(s.tagline, locale)}</p>
      </div>
    </footer>
  );
}
