import { loadMasterDb, topByTrust } from "@/lib/data";
import { districtsForBuild } from "@/lib/districts";
import { SupplierCard } from "@/components/SupplierCard";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";
import { FaqJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { HOME_FAQS } from "@/lib/faq";
import { AffiliateInline, AdSlot } from "@/components/AffiliateSlot";
import { HeroSearch } from "@/components/HeroSearch";
import { sortWithSponsored, sponsoredTier } from "@/lib/sponsored";
import { SponsoredHero } from "@/components/SponsoredHero";
import { BEST_FOR } from "@/lib/bestFor";
import { POSTS } from "@/lib/posts";
import { photoUrl } from "@/lib/photoUrl";
import { computeTrustScore } from "@/lib/trustScore";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "ko-KR": "/ko",
      "th-TH": "/th",
      "x-default": "/",
    },
  },
};

function citySlug(label: string): string {
  return label.toLowerCase().replace(/\s+/g, "_");
}

export default async function HomePage() {
  const db = await loadMasterDb();
  const top = sortWithSponsored(topByTrust(db.suppliers, 50));

  const totalReviews = db.suppliers.reduce((s, r) => s + r.total_reviews, 0);
  const withWebsite = db.suppliers.filter((r) => r.website).length;
  const withPhone = db.suppliers.filter((r) => r.phone).length;
  const provinces = Object.keys(db.city_counts).length;
  const verifiedCount = db.verified_count ?? db.suppliers.filter((r) => r.verified).length;
  const withDbd = db.with_dbd ?? db.suppliers.filter((r) => r.dbd).length;
  const withPhotos = db.with_photos ?? db.suppliers.filter((r) => r.photos && r.photos.length > 0).length;

  const cities = Object.entries(db.city_counts).sort((a, b) => b[1] - a[1]);

  // Canonical districts (Mueang/Muang 등 병합, supplier 5+ 만), busiest 12.
  const districts = districtsForBuild(db).slice(0, 12);

  const categories = Object.entries(db.category_counts).sort((a, b) => b[1] - a[1]);

  const popularSearches = [
    { label: "Chon Buri", href: "/city/chon_buri" },
    { label: "Auto parts", href: "/c/auto_parts" },
    { label: "Industrial estates", href: "/c/industrial_estate" },
    { label: "Warehouses", href: "/c/warehouse" },
  ];

  const searchIndex = db.suppliers.map((r) => ({
    id: r.id,
    name: r.name,
    district: r.district,
    city_label: r.city_label,
    rating: r.rating,
    trust_score: computeTrustScore(r).overall,
  }));

  // Featured 6 — DBD-verified + 사진 보유 우선. fallback 으로 top trust.
  const featuredVerified = [...db.suppliers]
    .filter((r) => r.verified && r.hero_image)
    .sort((a, b) => computeTrustScore(b).overall - computeTrustScore(a).overall)
    .slice(0, 6);
  const featuredFinal = featuredVerified.length >= 6 ? featuredVerified
    : top.slice(0, 30).filter((r) => r.hero_image).slice(0, 6).concat(top).slice(0, 6);

  // Industrial estates spotlight (단가 최고 segment)
  const estatesTop = [...db.suppliers]
    .filter((r) => r.categories.includes("industrial_estate"))
    .sort((a, b) => computeTrustScore(b).overall - computeTrustScore(a).overall)
    .slice(0, 6);

  return (
    <>
      {/* MEGA HERO */}
      <section className="relative bg-gradient-to-b from-emerald-50 via-green-50/30 to-white overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute top-32 right-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 pt-16 md:pt-20 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Verified by real buyers · No agent middleman
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95] mb-6 text-balance">
            Thai sourcing,<br />
            <span className="text-emerald-700">ranked by buyers</span>{" "}
            <span className="opacity-50 line-through decoration-emerald-500 decoration-4">— not agents.</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--muted)] mb-8 max-w-2xl mx-auto text-balance">
            <span className="font-bold text-emerald-800">{verifiedCount.toLocaleString()}</span> manufacturers cross-checked with Thailand&apos;s official business registry (DBD). Plus{" "}
            <span className="font-bold text-[var(--fg)]">{db.total_suppliers.toLocaleString()}</span> B2B suppliers across{" "}
            <span className="font-bold text-[var(--fg)]">{provinces}</span> provinces — capital, registered date, TSIC code, photos, real Google reviews.
          </p>

          <HeroSearch
            entities={searchIndex}
            hrefBase="/supplier"
            popularSearches={popularSearches}
          />
        </div>
      </section>

      {/* MEGA STATS BAR */}
      <section className="border-y border-[var(--border)] bg-gradient-to-r from-emerald-700 via-green-700 to-emerald-800 text-white">
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <Stat big={verifiedCount.toLocaleString()} label="DBD-verified" />
          <Stat big={db.total_suppliers.toLocaleString()} label="B2B suppliers" />
          <Stat big={withPhotos.toLocaleString()} label="With factory photos" />
          <Stat big={withPhone.toLocaleString()} label="With direct phone" />
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {(() => {
          const hero = top.find((r) => sponsoredTier(r.id));
          return hero ? <SponsoredHero r={hero} /> : null;
        })()}

        {/* MANIFESTO */}
        <section className="mb-12 grid md:grid-cols-3 gap-4">
          <Manifesto
            icon="🚫"
            title="No agent middleman"
            body="Sourcing agents add 15-30% markup and gatekeep direct contact. We surface the supplier's own phone and website — pick the path that fits."
          />
          <Manifesto
            icon="🏛"
            title="DBD-verified"
            body={`${verifiedCount.toLocaleString()} suppliers cross-checked with the Department of Business Development. We surface the legal name, registration number, registered capital, founding date, and TSIC industry code on every verified page.`}
          />
          <Manifesto
            icon="🏭"
            title="Eastern Seaboard"
            body="Pinthong, Amata, WHA, Hemaraj, Rojana, SAHA — every major industrial estate mapped, plus the auto-parts giants inside them."
          />
        </section>

        {/* FEATURED 6 */}
        {featuredFinal.length >= 6 && (
          <section className="mb-12">
            <div className="flex items-baseline justify-between gap-4 mb-5">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                Top 6 this week
              </h2>
              <a href="/best/highly-recommended" className="text-sm text-emerald-700 font-medium hover:underline">
                See full ranking →
              </a>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {featuredFinal.map((r, i) => (
                <a
                  key={r.id}
                  href={`/supplier/${r.id}`}
                  className="group block border border-[var(--border)] rounded-2xl bg-white hover:shadow-xl hover:border-emerald-300 hover:-translate-y-0.5 transition relative overflow-hidden"
                >
                  {r.hero_image ? (
                    <div className="relative h-40 overflow-hidden bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photoUrl(r.hero_image)}
                        alt={r.name}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 text-xs font-bold text-white bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full tabular-nums">
                        #{i + 1}
                      </div>
                      <div className="absolute top-2 right-2 text-base font-black text-white bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full tabular-nums">
                        {computeTrustScore(r).overall}
                      </div>
                    </div>
                  ) : (
                    <div className="px-5 pt-5 flex items-start justify-between gap-2">
                      <div className="text-2xl font-black tabular-nums text-[var(--muted)]">#{i + 1}</div>
                      <div className="text-3xl font-black tabular-nums" style={{
                        color: computeTrustScore(r).overall >= 75 ? "#16a34a" : computeTrustScore(r).overall >= 60 ? "#059669" : "#ca8a04"
                      }}>
                        {computeTrustScore(r).overall}
                      </div>
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-bold text-base group-hover:text-emerald-700 transition leading-tight mb-1">{r.name}</h3>
                    <p className="text-sm text-[var(--muted)]">{r.district || r.city_label}</p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-[var(--muted)]">
                      <span className="text-yellow-700 font-bold">★ {r.rating.toFixed(1)}</span>
                      <span>·</span>
                      <span>{r.total_reviews.toLocaleString()} reviews</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {r.categories.slice(0, 2).map((c) => (
                        <span key={c} className="bg-emerald-50 text-emerald-800 text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1 font-medium">
                          <span aria-hidden>{CATEGORY_ICONS[c] ?? "🏭"}</span>
                          {CATEGORY_LABELS[c] ?? c}
                        </span>
                      ))}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Industrial estates spotlight */}
        {estatesTop.length >= 3 && (
          <section className="mb-12 border border-[var(--border)] rounded-2xl bg-gradient-to-br from-emerald-50/40 via-white to-green-50/40 p-6 md:p-8">
            <div className="flex items-baseline justify-between gap-4 flex-wrap mb-5">
              <div>
                <h2 className="text-xl md:text-2xl font-black tracking-tight">🏘️ Industrial Estates</h2>
                <p className="text-sm text-[var(--muted)] mt-1">
                  Premium-tier B2B real estate. Pinthong, Amata, WHA, Rojana — Eastern Seaboard major estates mapped.
                </p>
              </div>
              <a href="/c/industrial_estate" className="text-sm font-bold hover:text-emerald-700 hover:underline">All estates →</a>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {estatesTop.map((r, i) => (
                <a key={r.id} href={`/supplier/${r.id}`} className="block bg-white rounded-xl border border-[var(--border)] p-3 hover:border-emerald-300 transition">
                  <div className="text-xs text-[var(--muted)] mb-1">#{i + 1} · Trust {computeTrustScore(r).overall}</div>
                  <div className="font-medium text-sm leading-tight">{r.name}</div>
                  <div className="text-xs text-[var(--muted)] mt-1">{r.district || r.city_label}</div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Browse by region */}
        {cities.length > 1 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">By Region</h2>
            <div className="flex flex-wrap gap-2">
              {cities.map(([city, count]) => (
                <a
                  key={city}
                  href={`/city/${citySlug(city)}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] text-sm bg-white hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 transition font-medium"
                >
                  {city}
                  <span className="text-[var(--muted)] tabular-nums">{count}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Browse by type */}
        {categories.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">By Type</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map(([cat, count]) => (
                <a
                  key={cat}
                  href={`/c/${cat}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 transition"
                >
                  <span aria-hidden>{CATEGORY_ICONS[cat] ?? "🏭"}</span>
                  {CATEGORY_LABELS[cat] ?? cat}
                  <span className="text-[var(--muted)] tabular-nums">{count}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Latest blog */}
        {POSTS.length > 0 && (
          <section className="mb-12">
            <div className="flex items-baseline justify-between gap-4 mb-5">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">Latest from the blog</h2>
              <a href="/blog" className="text-sm text-emerald-700 font-medium hover:underline">All posts →</a>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {[...POSTS].sort((a, b) => b.published.localeCompare(a.published)).slice(0, 3).map((p) => (
                <a
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="block p-5 bg-white border border-[var(--border)] rounded-xl hover:border-emerald-400 hover:shadow-md transition group"
                >
                  <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 mb-2">{p.category}</div>
                  <h3 className="font-bold text-base leading-snug mb-2 group-hover:text-emerald-700 transition line-clamp-2">{p.title}</h3>
                  <p className="text-xs text-[var(--muted)] leading-relaxed line-clamp-3">{p.metaDescription}</p>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Best of */}
        {BEST_FOR.length > 0 && (
          <section className="mb-10">
            <div className="flex items-baseline justify-between gap-4 mb-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">Best of</h2>
              <a href="/best" className="text-xs text-emerald-700 font-medium hover:underline">All {BEST_FOR.length} lists →</a>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
              {BEST_FOR.map((c) => (
                <a
                  key={c.slug}
                  href={`/best/${c.slug}`}
                  className="block px-4 py-3 rounded-xl border border-[var(--border)] text-sm bg-white hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 transition"
                >
                  {c.title.replace(/^Best |^Top |^Most /, "").replace(/ in Thailand$/, "")}
                </a>
              ))}
            </div>
          </section>
        )}

        {districts.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">By District</h2>
            <div className="flex flex-wrap gap-2">
              {districts.map((g) => (
                <a
                  key={g.slug}
                  href={`/d/${g.slug}`}
                  className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 transition"
                >
                  📍 {g.display} <span className="text-[var(--muted)] tabular-nums">{g.count}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        <AdSlot slot="home-mid" />

        <section>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">Top {Math.min(top.length, 50)} by Trust Score</h2>
          <div className="grid gap-3">
            {top.slice(0, 10).map((r, i) => (
              <SupplierCard key={r.id} r={r} rank={i + 1} />
            ))}
          </div>

          <AffiliateInline />

          <div className="grid gap-3 mt-3">
            {top.slice(10).map((r, i) => (
              <SupplierCard key={r.id} r={r} rank={i + 11} />
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">Frequently asked</h2>
          <div className="space-y-3">
            {HOME_FAQS.map((f, i) => (
              <details key={i} className="bg-white border border-[var(--border)] rounded-lg p-4 group">
                <summary className="font-medium cursor-pointer flex items-center justify-between gap-3">
                  <span>{f.q}</span>
                  <span className="text-[var(--muted)] group-open:rotate-180 transition">⌄</span>
                </summary>
                <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <FaqJsonLd faqs={HOME_FAQS} />
        <ItemListJsonLd
          name="Top Thailand Suppliers by Trust Score"
          items={top.slice(0, 20).map((r) => ({ name: r.name, url: `/supplier/${r.id}` }))}
        />
      </div>
    </>
  );
}

function Stat({ big, label }: { big: string; label: string }) {
  return (
    <div>
      <div className="text-2xl md:text-4xl font-black tabular-nums leading-none">{big}</div>
      <div className="text-[10px] md:text-xs uppercase tracking-widest opacity-90 mt-1.5 font-bold">{label}</div>
    </div>
  );
}

function Manifesto({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="p-5 rounded-2xl border border-[var(--border)] bg-white hover:shadow-md hover:border-emerald-300 transition">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-bold text-base mb-1">{title}</h3>
      <p className="text-sm text-[var(--muted)] leading-relaxed">{body}</p>
    </div>
  );
}
