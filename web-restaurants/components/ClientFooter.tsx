"use client";
import { useLocale } from "@/hooks/useLocale";
import { strings, tr } from "@/lib/strings";

export function ClientFooter({ brand, year }: { brand: string; year: number }) {
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
        <div className="flex flex-wrap gap-x-8 gap-y-3 mb-4">
          <a href="/famous-vs-good" className="hover:text-[var(--fg)] font-medium">{tr(c.snsCheck, locale)}</a>
          <a href="/about" className="hover:text-[var(--fg)]">{tr(c.about, locale)}</a>
          <a href="/contact" className="hover:text-[var(--fg)]">{tr(c.contact, locale)}</a>
          <a href="/for-restaurants" className="hover:text-[var(--fg)]">{tr(c.forRestaurants, locale)}</a>
          <a href="/sitemap.xml" className="hover:text-[var(--fg)]">Sitemap</a>
          <a href="/llms.txt" className="hover:text-[var(--fg)]">llms.txt</a>
        </div>
        <p className="text-xs leading-relaxed max-w-2xl">{tr(s.disclaimer, locale)}</p>
        <p className="text-xs mt-3">© {year} {brand} · {tr(s.tagline, locale)}</p>
      </div>
    </footer>
  );
}
