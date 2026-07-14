import { loadMasterDb, topByTrust } from "@/lib/data";
import { districtsForBuild } from "@/lib/districts";
import { CATEGORY_ICONS } from "@/lib/types";
import { FaqJsonLd, ItemListJsonLd, DatasetJsonLd } from "@/components/JsonLd";
import { HOME_FAQS } from "@/lib/faq";
import { AdSlot } from "@/components/AffiliateSlot";
import { LazyHeroSearch } from "@/components/LazyHeroSearch";
import { sortWithSponsored, sponsoredTier } from "@/lib/sponsored";
import { SponsoredHero } from "@/components/SponsoredHero";
import { BEST_FOR } from "@/lib/bestFor";
import { POSTS } from "@/lib/posts";
import { GUIDES } from "@/lib/guides";
import { computeTrustScore } from "@/lib/trustScore";
import { SectorCard } from "@/components/SectorCard";
import { SupplierListWithFilter, type FilterableSupplier } from "@/components/SupplierListWithFilter";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { SupplierAlertSignup } from "@/components/SupplierAlertSignup";
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

const FEATURED_CATEGORIES: { key: string; icon: string; label: string }[] = [
  { key: "manufacturer",       icon: "🏭", label: "Manufacturers" },
  { key: "auto_parts",         icon: "🚗", label: "Auto Parts" },
  { key: "warehouse",          icon: "📦", label: "Warehouses" },
  { key: "industrial_estate",  icon: "🏘️", label: "Industrial Estates" },
  { key: "logistics",          icon: "🚚", label: "Logistics" },
  { key: "food_mfg",           icon: "🥫", label: "Food Manufacturers" },
];

function topCityForCategory(suppliers: Awaited<ReturnType<typeof loadMasterDb>>["suppliers"], cat: string): string {
  const counts: Record<string, number> = {};
  for (const s of suppliers) {
    if (s.categories.includes(cat) && s.city_label) {
      counts[s.city_label] = (counts[s.city_label] ?? 0) + 1;
    }
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Thailand";
}

export default async function HomePage() {
  const db = await loadMasterDb();
  const top = sortWithSponsored(topByTrust(db.suppliers, 50));

  const withPhone = db.suppliers.filter((r) => r.phone).length;
  const provinces = Object.keys(db.city_counts).length;
  const verifiedCount = db.verified_count ?? db.suppliers.filter((r) => r.verified).length;
  const withPhotos = db.with_photos ?? db.suppliers.filter((r) => r.photos && r.photos.length > 0).length;

  const cities = Object.entries(db.city_counts).sort((a, b) => b[1] - a[1]);

  // Canonical districts (Mueang/Muang 등 병합, supplier 5+ 만), busiest 12.
  const districts = districtsForBuild(db).slice(0, 12);

  const popularSearches = [
    { label: "Chon Buri", href: "/city/chon_buri" },
    { label: "Auto parts", href: "/c/auto_parts" },
    { label: "Industrial estates", href: "/c/industrial_estate" },
    { label: "Warehouses", href: "/c/warehouse" },
  ];

  // 섹터 카드 데이터 (빌드 타임)
  const sectorData = FEATURED_CATEGORIES
    .filter(({ key }) => (db.category_counts[key] ?? 0) > 0)
    .map(({ key, icon, label }) => ({
      key,
      icon,
      label,
      supplierCount: db.category_counts[key] ?? 0,
      dbdCount: db.suppliers.filter((s) => s.categories.includes(key) && s.dbd).length,
      topCity: topCityForCategory(db.suppliers, key),
      href: `/c/${key}`,
    }));

  // 필터 컴포넌트용 데이터 (trust score 내림차순)
  const filterableSuppliers: FilterableSupplier[] = db.suppliers
    .map((s) => ({
      id: s.id,
      name: s.name,
      city_label: s.city_label,
      district: s.district ?? null,
      categories: s.categories,
      dbd: !!s.dbd,
      trust_score: computeTrustScore(s).overall,
    }))
    .sort((a, b) => b.trust_score - a.trust_score);

  const categoryOptions = Object.keys(db.category_counts).sort();
  const cityOptions = Object.keys(db.city_counts).sort();

  return (
    <>
      {/* MEGA HERO */}
      <section className="relative bg-gradient-to-b from-[var(--gold-bg)] via-[var(--gold-bg)]/30 to-white overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[var(--gold-light)] rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute top-32 right-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 pt-16 md:pt-20 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--gold-bg)] text-[var(--gold-deep)] text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-[var(--gold)] animate-pulse" />
            Verified by real buyers · No agent middleman
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95] mb-6 text-balance">
            Thai sourcing,<br />
            <span className="text-[var(--gold-deep)]">ranked by buyers</span>{" "}
            <span className="opacity-50 line-through decoration-[var(--gold)] decoration-4">— not agents.</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--muted)] mb-8 max-w-2xl mx-auto text-balance">
            <span className="font-bold text-[var(--gold-deep)]">{verifiedCount.toLocaleString()}</span> manufacturers cross-checked with Thailand&apos;s official business registry (DBD). Plus{" "}
            <span className="font-bold text-[var(--fg)]">{db.total_suppliers.toLocaleString()}</span> B2B suppliers across{" "}
            <span className="font-bold text-[var(--fg)]">{provinces}</span> provinces — capital, registered date, TSIC code, photos, real Google reviews.
          </p>

          <LazyHeroSearch
            hrefBase="/supplier"
            popularSearches={popularSearches}
          />
        </div>
      </section>

      {/* MEGA STATS BAR */}
      <section className="border-y border-[var(--border)] bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white">
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

        {/* SECTOR CARDS — industry first, ahead of location: this is how buyers actually think ("I need an auto parts factory", not "I need Chon Buri"). */}
        <section className="mb-6">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">What are you sourcing?</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {sectorData.map((s) => (
              <SectorCard
                key={s.key}
                icon={s.icon}
                label={s.label}
                href={s.href}
                supplierCount={s.supplierCount}
                dbdCount={s.dbdCount}
                topCity={s.topCity}
              />
            ))}
          </div>
        </section>

        {/* COMPARE CTA — surfaces the shortlist/compare flow, which is otherwise buried past several scrolls */}
        <section className="mb-12">
          <a
            href="/compare"
            className="group flex flex-col sm:flex-row items-center gap-5 p-6 rounded-2xl border border-[var(--gold-light)] bg-[var(--gold-bg)]/50 hover:bg-[var(--gold-bg)] hover:border-[var(--gold)] transition"
          >
            <div className="text-4xl shrink-0">⚖️</div>
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <h3 className="font-bold text-lg mb-1">Shortlist suppliers and compare them side-by-side</h3>
              <p className="text-sm text-[var(--muted)]">
                Trust Score, registered capital, founding date, reviews, categories — lined up so you can pick without opening 10 tabs.
              </p>
            </div>
            <span className="shrink-0 px-5 py-2.5 rounded-lg bg-black text-white text-sm font-bold group-hover:bg-gray-800 transition whitespace-nowrap">
              Compare suppliers →
            </span>
          </a>
        </section>

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

        {/* RECENTLY VIEWED — client-side, shows only if user has history */}
        <RecentlyViewed />

        {/* HOW IT WORKS — for first-time buyers */}
        <section className="mb-12 bg-white border border-[var(--border)] rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-black tracking-tight mb-6 text-center">How buyers use this</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <HowStep
              step="1"
              icon="🔍"
              title="Search or browse"
              body="Search by name, filter by industry, city, or district. Every supplier is ranked by Trust Score — no sponsored rankings at the top."
            />
            <HowStep
              step="2"
              icon="✓"
              title="Verify before you contact"
              body="Each page shows DBD registration, founding date, registered capital, TSIC code, and real Google reviews — all in one place."
            />
            <HowStep
              step="3"
              icon="📞"
              title="Contact direct"
              body="Call, WhatsApp, visit the website, or request a bulk quote from your shortlist. No agent in the middle, no commission fee."
            />
          </div>
          <div className="mt-6 text-center">
            <a
              href="/for-buyers"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--gold)] text-[var(--gold-deep)] text-sm font-bold hover:bg-[var(--gold-bg)] transition"
            >
              Full sourcing guide for buyers →
            </a>
          </div>
        </section>

        {/* Browse by region */}
        {cities.length > 1 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">By Region</h2>
            <div className="flex flex-wrap gap-2">
              {cities.map(([city, count]) => (
                <a
                  key={city}
                  href={`/city/${citySlug(city)}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--gold-light)] hover:bg-[var(--gold-bg)] hover:text-[var(--gold-deep)] transition font-medium"
                >
                  {city}
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
              <a href="/blog" className="text-sm text-[var(--gold-deep)] font-medium hover:underline">All posts →</a>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {[...POSTS].sort((a, b) => b.published.localeCompare(a.published)).slice(0, 3).map((p) => (
                <a
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="block p-5 bg-white border border-[var(--border)] rounded-xl hover:border-[var(--gold-light)] hover:shadow-md transition group"
                >
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--gold-deep)] mb-2">{p.category}</div>
                  <h3 className="font-bold text-base leading-snug mb-2 group-hover:text-[var(--gold-deep)] transition line-clamp-2">{p.title}</h3>
                  <p className="text-xs text-[var(--muted)] leading-relaxed line-clamp-3">{p.metaDescription}</p>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Buyer Guides */}
        <section className="mb-10">
          <div className="flex items-baseline justify-between gap-4 mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">Buyer Guides</h2>
            <a href="/guide" className="text-xs text-[var(--gold-deep)] font-medium hover:underline">All {GUIDES.length} guides →</a>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
            {GUIDES.slice(0, 6).map((g) => (
              <a
                key={g.slug}
                href={`/guide/${g.slug}`}
                className="block px-4 py-3 rounded-xl border border-[var(--border)] text-sm bg-white hover:border-[var(--gold-light)] hover:bg-[var(--gold-bg)] hover:text-[var(--gold-deep)] transition"
              >
                {g.title.replace(/ — .*$/, "").replace(/ \(\d{4}\)$/, "")}
              </a>
            ))}
          </div>
        </section>

        {/* Best of */}
        {BEST_FOR.length > 0 && (
          <section className="mb-10">
            <div className="flex items-baseline justify-between gap-4 mb-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">Best of</h2>
              <a href="/best" className="text-xs text-[var(--gold-deep)] font-medium hover:underline">All {BEST_FOR.length} lists →</a>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
              {BEST_FOR.map((c) => (
                <a
                  key={c.slug}
                  href={`/best/${c.slug}`}
                  className="block px-4 py-3 rounded-xl border border-[var(--border)] text-sm bg-white hover:border-[var(--gold-light)] hover:bg-[var(--gold-bg)] hover:text-[var(--gold-deep)] transition"
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
                  className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--gold-light)] hover:bg-[var(--gold-bg)] hover:text-[var(--gold-deep)] transition"
                >
                  📍 {g.display} <span className="text-[var(--muted)] tabular-nums">{g.count}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        <AdSlot slot="home-mid" />

        {/* SUPPLIER ALERT SIGNUP */}
        <div className="mb-10">
          <SupplierAlertSignup />
        </div>

        {/* FILTERED LIST */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">Top suppliers by trust score</h2>
          <SupplierListWithFilter
            suppliers={filterableSuppliers}
            categoryOptions={categoryOptions}
            cityOptions={cityOptions}
            totalSuppliers={db.total_suppliers}
          />
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
        <DatasetJsonLd
          totalSuppliers={db.total_suppliers}
          verifiedCount={verifiedCount}
          updatedAt={db.generated_at}
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
    <div className="p-5 rounded-2xl border border-[var(--border)] bg-white hover:shadow-md hover:border-[var(--gold-light)] transition">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-bold text-base mb-1">{title}</h3>
      <p className="text-sm text-[var(--muted)] leading-relaxed">{body}</p>
    </div>
  );
}

function HowStep({ step, icon, title, body }: { step: string; icon: string; title: string; body: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-4">
        <div className="w-14 h-14 rounded-2xl bg-[var(--gold-bg)] border border-[var(--gold-light)] flex items-center justify-center text-2xl">
          {icon}
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--gold)] text-white text-xs font-black flex items-center justify-center">
          {step}
        </div>
      </div>
      <h3 className="font-bold text-base mb-2">{title}</h3>
      <p className="text-sm text-[var(--muted)] leading-relaxed">{body}</p>
    </div>
  );
}
