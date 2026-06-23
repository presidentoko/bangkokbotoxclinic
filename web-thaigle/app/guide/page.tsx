import { GUIDES } from "@/lib/guides";
import { NICHES } from "@/lib/niches";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bangkok Guides — Food, Activities & Local Tips (2026)",
  description:
    "Practical Bangkok guides — Thai food, Muay Thai, Thai massage, yoga, cooking classes, diving, coworking. No tourist traps, no influencer placements.",
  alternates: { canonical: "/guide" },
};

export const dynamic = "force-static";

const ACTIVITY_SLUGS = new Set([
  "best-muay-thai-gyms-bangkok",
  "best-thai-massage-spa-bangkok",
  "best-yoga-studios-bangkok",
  "best-thai-cooking-classes-bangkok",
  "diving-near-bangkok-guide",
  "coworking-bangkok-digital-nomad-guide",
]);

export default function GuideIndexPage() {
  const foodGuides = GUIDES.filter((g) => !ACTIVITY_SLUGS.has(g.slug));
  const activityGuides = GUIDES.filter((g) => ACTIVITY_SLUGS.has(g.slug));

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Guides</span>
      </nav>

      <h1 className="text-4xl font-bold tracking-tight mb-3">Bangkok Guides</h1>
      <p className="text-base text-[var(--muted)] leading-relaxed mb-10 max-w-2xl">
        No-fluff guides backed by real data — what locals know, prices in Thai Baht, and how to avoid tourist traps.
      </p>

      {/* Activity guides */}
      {activityGuides.length > 0 && (
        <section className="mb-12">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-4">Activities & Experiences</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {activityGuides.map((g) => {
              const niche = g.nicheSlug ? NICHES.find((n) => n.slug === g.nicheSlug) : null;
              return (
                <a
                  key={g.slug}
                  href={`/guide/${g.slug}`}
                  className="group flex gap-4 p-5 border border-[var(--border)] rounded-2xl bg-white hover:border-orange-300 hover:shadow-md transition"
                >
                  {niche && (
                    <div className="text-3xl shrink-0 mt-0.5">{niche.icon}</div>
                  )}
                  <div className="min-w-0">
                    <h2 className="text-base font-bold leading-tight group-hover:text-orange-600 transition mb-1">
                      {g.title.replace(/ \(\d{4}\)$/, "")}
                    </h2>
                    <p className="text-sm text-[var(--muted)] leading-relaxed line-clamp-2">{g.metaDescription}</p>
                    <div className="mt-2 text-xs text-[var(--muted)]">Updated {g.updated}</div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* Food guides */}
      {foodGuides.length > 0 && (
        <section className="mb-12">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-4">Food & Restaurants</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {foodGuides.map((g) => (
              <a
                key={g.slug}
                href={`/guide/${g.slug}`}
                className="group flex gap-4 p-5 border border-[var(--border)] rounded-2xl bg-white hover:border-orange-300 hover:shadow-md transition"
              >
                <div className="text-3xl shrink-0 mt-0.5">🍜</div>
                <div className="min-w-0">
                  <h2 className="text-base font-bold leading-tight group-hover:text-orange-600 transition mb-1">
                    {g.title.replace(/ \(\d{4}\)$/, "")}
                  </h2>
                  <p className="text-sm text-[var(--muted)] leading-relaxed line-clamp-2">{g.metaDescription}</p>
                  <div className="mt-2 text-xs text-[var(--muted)]">Updated {g.updated}</div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="border border-orange-200 rounded-2xl p-6 bg-gradient-to-br from-orange-50 to-amber-50">
        <h2 className="font-black text-lg mb-2">Want to book an activity?</h2>
        <p className="text-sm text-[var(--muted)] mb-4">Browse our ranked directories — sorted by Trust Score from real Google reviews.</p>
        <a href="/activities" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition">
          All Activities in Bangkok →
        </a>
      </section>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Guides", url: "/guide" },
      ]} />
    </div>
  );
}
