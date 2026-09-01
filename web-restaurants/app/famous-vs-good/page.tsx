import type { Metadata } from "next";
import { loadIgSeed, getCategoryMeta } from "@/lib/famous-vs-good";
import { strings, tr } from "@/lib/strings";
import { FamousVsGoodCollections } from "@/components/FamousVsGoodCollections";

// Static. This was force-dynamic only so it could read the NEXT_LOCALE cookie
// and translate its own chrome — a per-request render on the landing page for
// the feature this site is built around. The page's title and description are
// English-only anyway, so a Thai visitor was already getting an English page
// with translated headings; serving it statically in English is consistent,
// and it is the version search engines and answer engines see.
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Instagram Famous vs Actually Good — Bangkok Restaurant Rankings by Real Data",
  description:
    "We cross-referenced Bangkok's most Instagram-hyped cafés and restaurants with real Google review Trust Scores. Some hold up. Many don't. The data decides.",
  alternates: { canonical: "/famous-vs-good" },
  openGraph: {
    title: "Instagram Famous vs Actually Good — Bangkok Restaurants",
    description: "Bangkok's most-hyped places cross-checked against real Google review Trust Scores. Who actually deserves the hype?",
    url: "/famous-vs-good",
    type: "website",
    siteName: "SNS Stopper",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bangkok: Instagram Famous vs Actually Good",
    description: "We checked Bangkok's most hyped restaurants against real Google review data. Some hold up. Many don't.",
  },
};

export default async function FamousVsGoodIndexPage() {
  const seeds = await loadIgSeed();
  const s = strings.famousVsGood;

  const categories = Array.from(new Set(seeds.map((s) => s.category)));
  const collections = categories.map((slug) => {
    const items = seeds.filter((s) => s.category === slug);
    const city = items[0]?.city ?? "bangkok";
    // Was title-casing the slug, which reads as "Social Famous" and "Hype
    // Check". The detail pages were moved onto CategoryMeta; this one was
    // missed, so the index and the page it linked to disagreed on the name.
    const label = getCategoryMeta(slug).short;
    return { slug, label, city, count: items.length };
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-6">
        <a href="/" className="hover:text-[var(--fg)]">{tr(strings.common.home, "en")}</a>
        <span className="mx-2">›</span>
        <span>{tr(s.h1a, "en")} {tr(s.h1b, "en")}</span>
      </nav>

      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
          {tr(s.h1a, "en")}<br />
          <span style={{ color: "#ea580c" }}>{tr(s.h1b, "en")}</span>
        </h1>
        <p className="text-xl text-[var(--muted)] max-w-2xl leading-relaxed whitespace-pre-line">
          {tr(s.subtitle, "en")}
        </p>
      </header>

      <section>
        <h2 className="text-xl font-bold mb-4">{tr(s.collections, "en")}</h2>
        <FamousVsGoodCollections collections={collections} analyzed={tr(s.analyzed, "en")} />
      </section>

      <section className="mt-16 bg-white border border-[var(--border)] rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-3">{tr(s.whyTitle, "en")}</h2>
        <p className="text-[var(--muted)] leading-relaxed text-sm max-w-2xl">{tr(s.whyBody, "en")}</p>
      </section>
    </div>
  );
}
