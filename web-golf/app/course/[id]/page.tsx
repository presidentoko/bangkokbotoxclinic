import { notFound } from "next/navigation";
import { loadMasterDb, getRestaurantById } from "@/lib/data";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";
import { BreadcrumbJsonLd, RestaurantJsonLd } from "@/components/JsonLd";
import { TrustDonut } from "@/components/TrustBadge";
import { MapEmbed } from "@/components/MapEmbed";
import { RatingChart } from "@/components/RatingChart";
import { TopicCluster } from "@/components/TopicCluster";
import { AIVerifiedBadge, SponsoredBadge, Freshness, RelativeRanking } from "@/components/Badges";
import { sponsoredTier } from "@/lib/sponsored";
import { AffiliateInline, AdSlot } from "@/components/AffiliateSlot";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const db = await (await import("@/lib/data")).loadMasterDb();
  return db.restaurants.map((r) => ({ id: r.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const db = await loadMasterDb();
  const r = getRestaurantById(db.restaurants, id);
  if (!r) return { title: "Course not found" };
  const cats = r.categories.map((c) => CATEGORY_LABELS[c] ?? c).join(", ");
  return {
    title: `${r.name} — Reviews & Trust Score`,
    description: `${r.name} in ${r.district || r.city_label || "Thailand"}: ★${r.rating} (${r.total_reviews} reviews). Trust Score ${r.trust_score}. ${cats || "Golf course"}.`,
    alternates: { canonical: `/course/${id}` },
  };
}

export default async function CoursePage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = await loadMasterDb();
  const r = getRestaurantById(db.restaurants, id);
  if (!r) notFound();

  const tier = sponsoredTier(r.id);
  const trend = r.rating_trend.trend;
  const samples = [...r.sample_reviews_en, ...r.sample_reviews_th].slice(0, 4);

  // Trust breakdown
  const ratingPart = (r.rating / 5) * 50;
  const volumePart = Math.min(40, Math.log10(Math.max(1, r.total_reviews)) * 12);
  const lgRatio = r.scraped_review_count > 0 ? r.local_guide_count / r.scraped_review_count : 0;
  const lgPart = Math.min(10, lgRatio * 20);
  const authPart = Math.min(5, Math.log10(Math.max(1, r.avg_author_review_count)) * 2);
  const breakdown = [
    { label: "Rating", value: ratingPart, max: 50, color: "#16a34a" },
    { label: "Volume", value: volumePart, max: 40, color: "#dc2626" },
    { label: "Local Gd", value: lgPart, max: 10, color: "#7c3aed" },
    { label: "Authority", value: authPart, max: 5, color: "#0891b2" },
  ];

  // 같은 cuisine + 도시 percentile
  const cohort = r.categories.length > 0
    ? db.restaurants.filter((x) => x.categories.some((c) => r.categories.includes(c)) && x.city === r.city)
    : db.restaurants.filter((x) => x.city === r.city);
  const sortedTrust = cohort.map((x) => x.trust_score).sort((a, b) => b - a);
  const idx = sortedTrust.indexOf(r.trust_score);
  const percentile = sortedTrust.length > 0 ? Math.round((idx / sortedTrust.length) * 100) : 100;
  const rankingLabel = r.categories.length > 0
    ? `${CATEGORY_LABELS[r.categories[0]] ?? r.categories[0]} (${r.city_label})`
    : r.city_label;

  const similar = db.restaurants
    .filter((other) => other.id !== r.id &&
      (other.district === r.district || r.categories.some((c) => other.categories.includes(c))))
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <a href={`/city/${r.city}`} className="hover:text-[var(--fg)]">{r.city_label}</a>
        {r.district && (
          <>
            <span className="mx-2">›</span>
            <a
              href={`/d/${r.district.toLowerCase().replace(/\s+/g, "-")}`}
              className="hover:text-[var(--fg)]"
            >
              {r.district}
            </a>
          </>
        )}
        <span className="mx-2">›</span>
        <span className="text-[var(--fg)]">{r.name}</span>
      </nav>

      {tier && (
        <div className="mb-3">
          <SponsoredBadge id={r.id} />
        </div>
      )}

      {r.hero_image && (
        <div className="relative w-full mb-6 rounded-2xl overflow-hidden bg-gray-100" style={{ aspectRatio: "16 / 7" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={r.hero_image}
            alt={r.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute bottom-2 right-2 text-[10px] text-white bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
            From course&apos;s own website
          </div>
        </div>
      )}

      <header className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">{r.name}</h1>
            <p className="text-[var(--muted)] flex items-center gap-2 flex-wrap">
              <span>{r.primary_type}</span>
              {r.district && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1">📍 {r.district}, {r.city_label}</span>
                </>
              )}
              {r.business_status === "Open" && (
                <span className="flex items-center gap-1 text-green-700 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Open
                </span>
              )}
              {r.price_symbol && <span className="text-[var(--muted)]">· {r.price_symbol}</span>}
            </p>
          </div>
          <div className="text-right">
            <div className="bg-yellow-50 text-yellow-900 px-4 py-2 rounded-lg text-2xl font-bold">
              ★ {r.rating.toFixed(1)}
            </div>
            <div className="text-xs text-[var(--muted)] mt-1 tabular-nums">
              {r.total_reviews.toLocaleString()} Google reviews
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 items-center">
          <AIVerifiedBadge r={r} size="md" />
          {percentile <= 25 && (
            <RelativeRanking percentile={percentile} label={rankingLabel} />
          )}
          <Freshness generatedAt={db.generated_at} mode="detail" />
        </div>

        {r.categories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {r.categories.map((c) => (
              <a
                key={c}
                href={`/c/${c}`}
                className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-sm hover:bg-emerald-100 inline-flex items-center gap-1.5"
              >
                <span aria-hidden>{CATEGORY_ICONS[c] ?? "⛳"}</span>
                {CATEGORY_LABELS[c] ?? c}
                {r.cuisine_mentions[c] ? (
                  <span className="opacity-70 text-xs">· {r.cuisine_mentions[c]} mentions</span>
                ) : null}
              </a>
            ))}
            {trend === "improving" && (
              <span className="bg-green-50 text-green-800 px-3 py-1 rounded-full text-sm">
                ↗ Trending up
              </span>
            )}
            {trend === "declining" && (
              <span className="bg-orange-50 text-orange-800 px-3 py-1 rounded-full text-sm">
                ↘ Quality declining
              </span>
            )}
          </div>
        )}
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TrustDonut score={r.trust_score} breakdown={breakdown} />

          <RatingChart trend={r.rating_trend} />

          {r.mentioned_topics.length > 0 && (
            <TopicCluster topics={r.mentioned_topics.slice(0, 12)} />
          )}

          <MapEmbed lat={r.lat} lng={r.lng} name={r.name} height={320} />

          {samples.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-3">Real review excerpts</h2>
              <div className="space-y-3">
                {samples.map((rev, i) => (
                  <blockquote key={i} className="border-l-4 border-[var(--accent)] bg-white px-4 py-3 rounded-r">
                    <p className="text-sm leading-relaxed">{rev.text}</p>
                    <footer className="mt-2 text-xs text-[var(--muted)] flex items-center gap-2">
                      <span className="font-medium">{rev.author || "Google reviewer"}</span>
                      <span>·</span>
                      <span className="text-yellow-700">★ {rev.rating}</span>
                    </footer>
                  </blockquote>
                ))}
              </div>
            </section>
          )}

          <AdSlot slot="restaurant-detail-mid" />

          <section className="grid sm:grid-cols-2 gap-3">
            <div className="bg-white border border-[var(--border)] rounded-lg p-4">
              <div className="text-xs uppercase tracking-wide text-[var(--muted)] mb-1">Address</div>
              <div className="text-sm leading-relaxed">{r.address || "—"}</div>
            </div>
            <div className="bg-white border border-[var(--border)] rounded-lg p-4">
              <div className="text-xs uppercase tracking-wide text-[var(--muted)] mb-1">Phone</div>
              <div className="text-sm">{r.phone || "—"}</div>
              {r.website && (
                <>
                  <div className="text-xs uppercase tracking-wide text-[var(--muted)] mb-1 mt-3">Website</div>
                  <a
                    href={r.website}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-sm text-[var(--accent)] hover:underline truncate block"
                  >
                    {r.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </a>
                </>
              )}
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-4 lg:self-start space-y-4">
          <div className="bg-white border border-[var(--border)] rounded-xl p-4 space-y-2">
            <a
              href={r.maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-black text-white py-3 px-4 rounded-lg font-bold text-center hover:bg-gray-800 text-sm"
            >
              📍 View on Google Maps
            </a>
            {r.phone && (
              <a
                href={`tel:${r.phone.replace(/[^+\d]/g, "")}`}
                className="block w-full bg-white border border-[var(--border)] py-2.5 px-4 rounded-lg font-bold text-center hover:border-black text-sm"
              >
                📞 Call
              </a>
            )}
            {r.menu_url && (
              <a
                href={r.menu_url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="block w-full bg-white border border-[var(--border)] py-2.5 px-4 rounded-lg font-bold text-center hover:border-black text-sm"
              >
                📋 Menu
              </a>
            )}
            {r.website && (
              <a
                href={r.website}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="block w-full bg-white border border-[var(--border)] py-2.5 px-4 rounded-lg font-bold text-center hover:border-black text-sm"
              >
                Website
              </a>
            )}
          </div>

          <AffiliateInline category={r.categories[0]} district={r.district} />
          <AdSlot slot="restaurant-sidebar" />

          {similar.length > 0 && (
            <div className="bg-white border border-[var(--border)] rounded-xl p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
                Similar courses
              </h3>
              <div className="space-y-2">
                {similar.map((s) => (
                  <a key={s.id} href={`/course/${s.id}`} className="block group">
                    <div className="font-medium text-sm group-hover:text-[var(--accent)] truncate transition">
                      {s.name}
                    </div>
                    <div className="text-xs text-[var(--muted)] flex items-center gap-2">
                      <span>{s.district || s.city_label}</span>
                      <span>·</span>
                      <span>★ {s.rating.toFixed(1)}</span>
                      <span>·</span>
                      <span className="font-medium" style={{
                        color: s.trust_score >= 75 ? "#16a34a" : s.trust_score >= 60 ? "#059669" : "#ca8a04"
                      }}>
                        Trust {s.trust_score.toFixed(0)}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      <RestaurantJsonLd r={r} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: r.city_label, url: `/city/${r.city}` },
        ...(r.district ? [{ name: r.district, url: `/d/${r.district.toLowerCase().replace(/\s+/g, "-")}` }] : []),
        { name: r.name, url: `/course/${r.id}` },
      ]} />
    </div>
  );
}
