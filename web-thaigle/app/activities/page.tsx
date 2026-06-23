import type { Metadata } from "next";
import { NICHES, loadNicheDb, topNichePlaces } from "@/lib/niches";
import type { NicheSlug } from "@/lib/niches";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Bangkok Activities 2026 — Muay Thai, Thai Massage, Yoga, Cooking Classes",
  description:
    "Bangkok activity venues ranked by real Google reviews. Muay Thai, Thai massage, yoga, cooking classes, diving — no paid placements, Trust Score method.",
  alternates: { canonical: "/activities" },
  openGraph: {
    title: "Bangkok Activities 2026 — Muay Thai, Thai Massage, Yoga, Cooking Classes",
    description:
      "Bangkok activity venues ranked by real Google reviews. Muay Thai, Thai massage, yoga, cooking classes — no paid placements.",
  },
};

const NICHE_COLORS: Record<NicheSlug, string> = {
  "muay-thai":    "from-red-50 to-orange-50 border-red-200 hover:border-red-400",
  "spa":          "from-pink-50 to-rose-50 border-pink-200 hover:border-pink-400",
  "wellness":     "from-green-50 to-emerald-50 border-green-200 hover:border-green-400",
  "yoga-pilates": "from-purple-50 to-violet-50 border-purple-200 hover:border-purple-400",
  "cooking":      "from-amber-50 to-yellow-50 border-amber-200 hover:border-amber-400",
  "coworking":    "from-blue-50 to-sky-50 border-blue-200 hover:border-blue-400",
  "diving":       "from-cyan-50 to-teal-50 border-cyan-200 hover:border-cyan-400",
};

const FEATURED_NICHES: NicheSlug[] = ["muay-thai", "spa", "cooking"];

const FEATURED_NICHE_LABELS: Record<string, string> = {
  "muay-thai": "Muay Thai",
  "spa": "Spa & Massage",
  "cooking": "Cooking Classes",
};

export default async function ActivitiesPage() {
  const nicheData = await Promise.all(
    NICHES.map(async (n) => {
      const db = await loadNicheDb(n.slug as NicheSlug);
      const topPlaces = FEATURED_NICHES.includes(n.slug as NicheSlug)
        ? topNichePlaces(db.places, 3)
        : [];
      return { slug: n.slug, total: db.total, topPlaces };
    })
  );
  const counts = nicheData;
  const countMap = Object.fromEntries(counts.map((c) => [c.slug, c.total]));
  const totalPlaces = counts.reduce((s, c) => s + c.total, 0);
  const featuredByNiche = Object.fromEntries(
    nicheData
      .filter((n) => n.topPlaces.length > 0)
      .map((n) => [n.slug, n.topPlaces])
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* First-timer CTA */}
      <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-orange-700 mb-1">New to Bangkok?</div>
          <div className="font-black text-lg">Your first-timer activity guide →</div>
          <div className="text-sm text-[var(--muted)] mt-0.5">3-day plan · prices · what to know before you go</div>
        </div>
        <a
          href="/activities/first-time-bangkok"
          className="shrink-0 px-5 py-2.5 rounded-full bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition active:scale-95"
        >
          Start here →
        </a>
      </div>

      {/* Wellness week teaser */}
      <div className="mb-6 flex items-center justify-between gap-3 p-4 rounded-xl border border-teal-200 bg-teal-50 flex-wrap">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-teal-700">Planning a longer stay?</span>
          <div className="font-black">7-Day Bangkok Wellness Itinerary</div>
        </div>
        <a href="/activities/wellness-week" className="shrink-0 px-4 py-2 rounded-full bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 transition">
          View plan →
        </a>
      </div>

      {/* Prices quick link */}
      <div className="mb-6 flex items-center justify-between gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50 flex-wrap">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700">Not sure what things cost?</span>
          <div className="font-black">Bangkok Activity Price Guide 2026</div>
        </div>
        <a href="/activities/prices-bangkok-2026" className="shrink-0 px-4 py-2 rounded-full bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 transition">
          See all prices →
        </a>
      </div>

      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-widest mb-4">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          No influencer · No paid review
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
          Best Activities in Bangkok
        </h1>
        <p className="text-[var(--muted)] max-w-2xl text-lg">
          <span className="font-bold text-[var(--fg)]">{totalPlaces.toLocaleString()}</span> venues ranked by real Google reviews.
          From Muay Thai training to Thai massage, cooking classes to yoga — data-driven, no fluff.
        </p>
      </div>

      {/* Best for ... quick links */}
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="text-xs font-bold text-[var(--muted)] self-center mr-1 uppercase tracking-wide">Best for:</span>
        {[
          { label: "First visit", href: "/activities/spa", icon: "💆" },
          { label: "Beginners", href: "/activities/muay-thai", icon: "🌱" },
          { label: "Couples", href: "/activities/cooking", icon: "💑" },
          { label: "Digital nomads", href: "/activities/coworking", icon: "💻" },
          { label: "Adventure", href: "/activities/diving", icon: "🤿" },
          { label: "Wellness week", href: "/activities/yoga-pilates", icon: "🧘" },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border)] bg-white text-sm hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700 transition font-medium"
          >
            <span aria-hidden>{item.icon}</span>
            {item.label}
          </a>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        {NICHES.map((n) => (
          <a
            key={n.slug}
            href={`/activities/${n.slug}`}
            className={`group block bg-gradient-to-br ${NICHE_COLORS[n.slug as NicheSlug]} border rounded-2xl p-6 transition hover:-translate-y-0.5 hover:shadow-lg`}
          >
            <div className="text-4xl mb-3">{n.icon}</div>
            <h2 className="font-black text-xl mb-1 group-hover:underline">{n.label}</h2>
            <p className="text-sm text-[var(--muted)] mb-3 leading-relaxed">{n.desc}</p>
            <div className="text-xs font-bold text-[var(--muted)] tabular-nums">
              {(countMap[n.slug] ?? 0).toLocaleString()} venues ranked →
            </div>
          </a>
        ))}
      </div>

      {/* Featured top picks with photos */}
      <section className="mb-10">
        <div className="flex items-baseline justify-between gap-4 mb-4">
          <h2 className="text-xl font-black tracking-tight">Top picks this week</h2>
          <span className="text-xs text-[var(--muted)]">By Trust Score</span>
        </div>
        <div className="space-y-6">
          {FEATURED_NICHES.map((nSlug) => {
            const places = featuredByNiche[nSlug] ?? [];
            const nicheInfo = NICHES.find(n => n.slug === nSlug);
            if (!places.length || !nicheInfo) return null;
            return (
              <div key={nSlug}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span>{nicheInfo.icon}</span>
                    <span className="font-bold text-sm">{FEATURED_NICHE_LABELS[nSlug]}</span>
                  </div>
                  <a href={`/activities/${nSlug}`} className="text-xs text-orange-600 font-bold hover:underline">
                    See all →
                  </a>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {places.map((p, i) => (
                    <a
                      key={p.id}
                      href={`/activities/${nSlug}/${p.slug}`}
                      className="group relative rounded-xl overflow-hidden bg-gray-100 aspect-square"
                    >
                      {p.top_photo_url ? (
                        <img
                          src={p.top_photo_url}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
                          <span className="text-3xl opacity-40">{nicheInfo.icon}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <div className="text-white text-[10px] font-bold line-clamp-2 leading-tight">{p.name}</div>
                        <div className="text-white/80 text-[9px] mt-0.5">★{p.rating?.toFixed(1) ?? "—"} · #{i+1}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border border-[var(--border)] rounded-2xl p-6 bg-gradient-to-br from-orange-50/40 to-white mb-10">
        <h2 className="text-xl font-black mb-2">How rankings work</h2>
        <p className="text-sm text-[var(--muted)] leading-relaxed max-w-2xl">
          Every venue is ranked by a trust score: Google rating × log(review count). Minimum 5 reviews required.
          No paid placements, no editorial picks — just data from public Google Maps, refreshed continuously.
          Where available, Klook booking links let you reserve directly.
        </p>
      </section>

      <section className="border border-orange-200 rounded-2xl p-6 bg-gradient-to-br from-orange-50 to-amber-50 mb-8">
        <h2 className="text-lg font-black mb-3">Not sure where to start?</h2>
        <p className="text-sm text-[var(--muted)] mb-4 leading-relaxed">
          Read our no-fluff guides — prices, what to expect, and how to avoid tourist traps.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { href: "/guide/best-muay-thai-gyms-bangkok", icon: "🥊", title: "Muay Thai Guide", sub: "Gyms, prices & what to wear" },
            { href: "/guide/best-thai-massage-spa-bangkok", icon: "💆", title: "Thai Massage Guide", sub: "Types, prices & best areas" },
          ].map((g) => (
            <a
              key={g.href}
              href={g.href}
              className="group flex items-center gap-3 bg-white rounded-xl p-4 hover:shadow-md hover:border-orange-300 border border-orange-100 transition"
            >
              <span className="text-2xl">{g.icon}</span>
              <div>
                <div className="font-bold text-sm group-hover:text-orange-600 transition">{g.title}</div>
                <div className="text-xs text-[var(--muted)]">{g.sub}</div>
              </div>
              <span className="ml-auto text-[var(--muted)] text-sm">→</span>
            </a>
          ))}
        </div>
      </section>

      {/* Segment guides */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">Traveler guides</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <a
            href="/activities/halal"
            className="flex items-center gap-4 p-5 border border-[var(--border)] rounded-2xl bg-white hover:border-green-300 hover:shadow-sm transition group"
          >
            <span className="text-3xl shrink-0">🕌</span>
            <div>
              <div className="font-black group-hover:text-green-700 transition">Halal-Friendly Guide</div>
              <div className="text-sm text-[var(--muted)]">Activities for Muslim travelers · prayer rooms · halal food</div>
            </div>
          </a>
          <a
            href="/activities/digital-nomad"
            className="flex items-center gap-4 p-5 border border-[var(--border)] rounded-2xl bg-white hover:border-blue-300 hover:shadow-sm transition group"
          >
            <span className="text-3xl shrink-0">💻</span>
            <div>
              <div className="font-black group-hover:text-blue-700 transition">Digital Nomad Guide</div>
              <div className="text-sm text-[var(--muted)]">Coworking · visa options · cost of living · neighborhoods</div>
            </div>
          </a>
          <a
            href="/activities/couples"
            className="flex items-center gap-4 p-5 border border-[var(--border)] rounded-2xl bg-white hover:border-pink-300 hover:shadow-sm transition group"
          >
            <span className="text-3xl shrink-0">💑</span>
            <div>
              <div className="font-black group-hover:text-pink-700 transition">Couples Guide</div>
              <div className="text-sm text-[var(--muted)]">Romantic activities · couples spa · cooking classes for 2</div>
            </div>
          </a>
          <a
            href="/activities/budget"
            className="flex items-center gap-4 p-5 border border-[var(--border)] rounded-2xl bg-white hover:border-green-300 hover:shadow-sm transition group"
          >
            <span className="text-3xl shrink-0">💰</span>
            <div>
              <div className="font-black group-hover:text-green-700 transition">Budget Guide</div>
              <div className="text-sm text-[var(--muted)]">Cheap activities · price comparisons · free things to do</div>
            </div>
          </a>
        </div>
      </section>

      {/* Compare section */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">Compare options</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { slug: "thai-massage-vs-oil-massage", title: "Thai Massage vs Oil Massage", icon: "🆚" },
            { slug: "muay-thai-vs-boxing", title: "Muay Thai vs Boxing", icon: "🆚" },
            { slug: "yoga-vs-pilates-bangkok", title: "Yoga vs Pilates", icon: "🆚" },
          ].map((c) => (
            <a
              key={c.slug}
              href={`/activities/compare/${c.slug}`}
              className="flex items-center gap-3 p-4 border border-[var(--border)] rounded-xl bg-white hover:border-orange-300 hover:shadow-sm transition group"
            >
              <span className="text-xl shrink-0">{c.icon}</span>
              <span className="text-sm font-medium group-hover:text-orange-700 transition">{c.title}</span>
            </a>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-4">Quick links</h2>
        <div className="flex flex-wrap gap-2">
          {NICHES.map((n) => (
            <a
              key={n.slug}
              href={`/activities/${n.slug}`}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700 transition font-medium"
            >
              <span aria-hidden>{n.icon}</span>
              {n.label}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
