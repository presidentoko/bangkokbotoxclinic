import type { Metadata } from "next";
import { loadIgSeed } from "@/lib/famous-vs-good";
import { getLocale } from "@/lib/locale";
import { strings, tr } from "@/lib/strings";
import { FamousVsGoodCollections } from "@/components/FamousVsGoodCollections";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Instagram Famous vs Actually Good — Bangkok Restaurant Rankings by Real Data",
  description:
    "We cross-referenced Bangkok's most Instagram-hyped cafés and restaurants with real Google review Trust Scores. Some hold up. Many don't. The data decides.",
  alternates: { canonical: "/famous-vs-good" },
};

export default async function FamousVsGoodIndexPage() {
  const [seeds, locale] = await Promise.all([loadIgSeed(), getLocale()]);
  const s = strings.famousVsGood;

  const categories = Array.from(new Set(seeds.map((s) => s.category)));
  const collections = categories.map((slug) => {
    const items = seeds.filter((s) => s.category === slug);
    const city = items[0]?.city ?? "bangkok";
    const label = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return { slug, label, city, count: items.length };
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-6">
        <a href="/" className="hover:text-[var(--fg)]">{tr(strings.common.home, locale)}</a>
        <span className="mx-2">›</span>
        <span>{tr(s.h1a, locale)} {tr(s.h1b, locale)}</span>
      </nav>

      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
          {tr(s.h1a, locale)}<br />
          <span style={{ color: "#ea580c" }}>{tr(s.h1b, locale)}</span>
        </h1>
        <p className="text-xl text-[var(--muted)] max-w-2xl leading-relaxed whitespace-pre-line">
          {tr(s.subtitle, locale)}
        </p>
      </header>

      <section>
        <h2 className="text-xl font-bold mb-4">{tr(s.collections, locale)}</h2>
        <FamousVsGoodCollections collections={collections} analyzed={tr(s.analyzed, locale)} />
      </section>

      <section className="mt-16 bg-white border border-[var(--border)] rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-3">{tr(s.whyTitle, locale)}</h2>
        <p className="text-[var(--muted)] leading-relaxed text-sm max-w-2xl">{tr(s.whyBody, locale)}</p>
      </section>
    </div>
  );
}
