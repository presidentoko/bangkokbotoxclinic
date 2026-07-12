import { notFound } from "next/navigation";
import { loadMasterDb, getRestaurantById, topByTrust } from "@/lib/data";
import { CUISINE_LABELS, CUISINE_ICONS } from "@/lib/types";
import type { Restaurant } from "@/lib/types";
import { BreadcrumbJsonLd, RestaurantJsonLd } from "@/components/JsonLd";
import { TrustDonut } from "@/components/TrustBadge";
import { MapEmbed } from "@/components/MapEmbed";
import { RatingChart } from "@/components/RatingChart";
import { TopicCluster } from "@/components/TopicCluster";
import { AIVerifiedBadge, SponsoredBadge, Freshness, RelativeRanking } from "@/components/Badges";
import { sponsoredTier } from "@/lib/sponsored";
import { AffiliateInline, AdSlot } from "@/components/AffiliateSlot";
import type { Metadata } from "next";
import { loadIgSeed } from "@/lib/famous-vs-good";
import { ShareButton, WhatsAppShare } from "@/components/ShareButton";
import { EmailSignup } from "@/components/EmailSignup";
import { SaveButton } from "@/components/SaveButton";
import { CommunityButtons } from "@/components/CommunityButtons";

export const dynamic = "force-static";

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
  if (!r) return { title: "Restaurant not found" };
  const cuisines = r.cuisines.map((c) => CUISINE_LABELS[c] ?? c).join(", ");
  const primaryCuisine = r.cuisines[0] ? (CUISINE_LABELS[r.cuisines[0]] ?? r.cuisines[0]) : null;
  const city = r.city_label || "Bangkok";
  const place = r.district ? `${r.district}, ${city}` : city;
  const kind = primaryCuisine ? `${primaryCuisine} Restaurant` : "Restaurant";
  // Lead with the keywords people actually search — name, cuisine, area, "menu"/"reviews" —
  // instead of burying them behind our own "Trust Score" jargon.
  const title = `${r.name} — ${kind} in ${place} | Menu, Reviews & Trust Score`;
  const description = `${r.name}, a ${cuisines || "restaurant"} spot in ${place}. Trust Score ${r.trust_score.toFixed(0)}/100 from ${r.total_reviews.toLocaleString()} real Google reviews — no influencer bias, just the data.`;
  return {
    title,
    description,
    alternates: { canonical: `/restaurant/${id}` },
    openGraph: {
      title: `${r.name} — ${kind} in ${place}`,
      description,
      url: `/restaurant/${id}`,
      type: "article",
      siteName: "SNS Stopper",
    },
    twitter: {
      card: "summary_large_image",
      title: `${r.name} — ${kind} in ${place}`,
      description,
    },
  };
}

export default async function RestaurantPage(
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
  const cohort = r.cuisines.length > 0
    ? db.restaurants.filter((x) => x.cuisines.some((c) => r.cuisines.includes(c)) && x.city === r.city)
    : db.restaurants.filter((x) => x.city === r.city);
  const sortedTrust = cohort.map((x) => x.trust_score).sort((a, b) => b - a);
  const idx = sortedTrust.indexOf(r.trust_score);
  const percentile = sortedTrust.length > 0 ? Math.round((idx / sortedTrust.length) * 100) : 100;
  const rankingLabel = r.cuisines.length > 0
    ? `${CUISINE_LABELS[r.cuisines[0]] ?? r.cuisines[0]} (${r.city_label})`
    : r.city_label;

  // Mix in restaurants outside the sitewide top-100 (they get almost no other
  // inbound links — hub pages only list their own top 100) instead of always
  // surfacing the same handful of already-well-linked matches everywhere.
  const cohortAll = db.restaurants.filter((other) => other.id !== r.id &&
    (other.district === r.district || r.cuisines.some((c) => other.cuisines.includes(c))));
  const globalTop100Ids = new Set(topByTrust(db.restaurants, 100).map((x) => x.id));
  const sameDistrict = cohortAll.filter((o) => o.district === r.district);
  const similar: Restaurant[] = [];
  const seenIds = new Set<string>();
  function addFrom(pool: Restaurant[]) {
    for (const o of [...pool].sort((a, b) => b.trust_score - a.trust_score)) {
      if (similar.length >= 4) break;
      if (seenIds.has(o.id)) continue;
      similar.push(o);
      seenIds.add(o.id);
    }
  }
  addFrom(sameDistrict.filter((o) => !globalTop100Ids.has(o.id)));
  addFrom(sameDistrict);
  addFrom(cohortAll);

  // Check if restaurant appears in famous-vs-good seed
  const igSeeds = await loadIgSeed();
  const seedMatch = igSeeds.find((s) => s.place_id === r.place_id);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-28 sm:pb-8">
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
          <ShareButton name={r.name} rating={r.rating} trustScore={r.trust_score} url={`/restaurant/${r.id}`} />
          <WhatsAppShare name={r.name} url={`/restaurant/${r.id}`} />
          <SaveButton id={r.id} />
        </div>

        <div className="mt-4 max-w-md">
          <CommunityButtons restaurantId={r.id} />
        </div>

        {r.cuisines.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {r.cuisines.map((c) => (
              <a
                key={c}
                href={`/c/${c}`}
                className="bg-orange-50 text-orange-800 px-3 py-1 rounded-full text-sm hover:bg-orange-100 inline-flex items-center gap-1.5"
              >
                <span aria-hidden>{CUISINE_ICONS[c] ?? "🍴"}</span>
                {CUISINE_LABELS[c] ?? c}
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

          {/* MOVE 3 — Feed says vs Data says */}
          {seedMatch && seedMatch.ig_signal ? (
            <div className="border border-[var(--border)] rounded-2xl overflow-hidden">
              <div className="grid sm:grid-cols-[1fr_auto_1fr]">
                <div className="p-4 space-y-2">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
                    What the feed says
                  </div>
                  <div className="flex items-center gap-2 bg-pink-50 text-pink-800 px-2.5 py-2 rounded-xl text-sm font-medium">
                    <span aria-hidden>📸</span>
                    {seedMatch.ig_signal}
                  </div>
                  {seedMatch.tag_count !== null && (
                    <p className="text-xs text-[var(--muted)] pl-1">
                      {seedMatch.tag_count.toLocaleString()} tagged posts
                    </p>
                  )}
                </div>
                <div className="hidden sm:flex flex-col items-center justify-center px-2 py-4">
                  <div className="w-px flex-1 bg-[var(--border)]" />
                  <span className="my-2 text-xs font-bold px-2 py-1 rounded-full border border-orange-400 text-orange-600">vs</span>
                  <div className="w-px flex-1 bg-[var(--border)]" />
                </div>
                <div className="p-4 space-y-2 border-t sm:border-t-0 border-[var(--border)]">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
                    What the data says
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-3xl font-black tabular-nums leading-none"
                      style={{ color: r.trust_score >= 85 ? "#16a34a" : r.trust_score >= 75 ? "#ca8a04" : r.trust_score >= 60 ? "#ea580c" : "#dc2626" }}
                    >
                      {Math.round(r.trust_score)}
                    </span>
                    <span className="text-xs text-[var(--muted)] font-medium">Trust Score</span>
                  </div>
                  <div className="space-y-0.5 text-xs text-[var(--muted)]">
                    <p><span className="font-semibold text-[var(--fg)]">{r.total_reviews.toLocaleString()}</span> Google reviews</p>
                    <p>★ <span className="font-semibold text-[var(--fg)]">{r.rating.toFixed(1)}</span> avg rating</p>
                    {r.scraped_review_count > 0 && (
                      <p><span className="font-semibold text-[var(--fg)]">{Math.round((r.local_guide_count / r.scraped_review_count) * 100)}%</span> Local Guide reviewers</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 border-t border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--muted)]">
                No filter. Just numbers. —{" "}
                <a href={`/famous-vs-good/${seedMatch.category}`} className="text-orange-600 font-semibold hover:underline">
                  See this venue in the full ranking →
                </a>
              </div>
            </div>
          ) : (
            <div className="border border-[var(--border)] rounded-2xl p-4 space-y-3">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
                What the reviews actually say
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-2xl font-black tabular-nums" style={{ color: r.trust_score >= 75 ? "#16a34a" : "#ca8a04" }}>
                    {Math.round(r.trust_score)}
                  </div>
                  <div className="text-xs text-[var(--muted)] mt-0.5">Trust Score</div>
                </div>
                <div>
                  <div className="text-2xl font-black tabular-nums">{r.rating.toFixed(1)}</div>
                  <div className="text-xs text-[var(--muted)] mt-0.5">Avg rating</div>
                </div>
                <div>
                  <div className="text-2xl font-black tabular-nums">{r.total_reviews >= 1000 ? `${(r.total_reviews / 1000).toFixed(1)}k` : r.total_reviews}</div>
                  <div className="text-xs text-[var(--muted)] mt-0.5">Reviews</div>
                </div>
              </div>
              <p className="text-xs text-[var(--muted)]">Derived from public Google Maps data. No editorial intervention.</p>
            </div>
          )}

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

          <EmailSignup variant="inline" />
          <AffiliateInline category={r.cuisines[0]} district={r.district} />
          <AdSlot slot="restaurant-sidebar" />

          {similar.length > 0 && (
            <div className="bg-white border border-[var(--border)] rounded-xl p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
                Similar restaurants
              </h3>
              <div className="space-y-2">
                {similar.map((s) => (
                  <a key={s.id} href={`/restaurant/${s.id}`} className="block group">
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
          {seedMatch && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
              <p className="text-xs font-semibold text-orange-800 mb-1">In the SNS ranking</p>
              <a
                href={`/famous-vs-good/${seedMatch.category}`}
                className="block text-center text-xs font-bold bg-[#ea580c] text-white px-3 py-2 rounded-lg hover:opacity-90 transition"
              >
                See feed vs data →
              </a>
            </div>
          )}
        </aside>
      </div>

      <div className="sm:hidden fixed left-0 right-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-30 bg-[var(--card)] border-t border-[var(--border)] px-4 py-2 flex gap-2">
        <a
          href={r.maps_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-h-[44px] bg-black text-white rounded-lg font-bold text-center text-sm flex items-center justify-center"
        >
          📍 Directions
        </a>
        {r.phone && (
          <a
            href={`tel:${r.phone.replace(/[^+\d]/g, "")}`}
            className="min-h-[44px] px-4 bg-white border border-[var(--border)] rounded-lg font-bold text-sm flex items-center justify-center"
          >
            📞 Call
          </a>
        )}
      </div>

      <RestaurantJsonLd r={r} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: r.city_label, url: `/city/${r.city}` },
        ...(r.district ? [{ name: r.district, url: `/d/${r.district.toLowerCase().replace(/\s+/g, "-")}` }] : []),
        { name: r.name, url: `/restaurant/${r.id}` },
      ]} />
    </div>
  );
}
