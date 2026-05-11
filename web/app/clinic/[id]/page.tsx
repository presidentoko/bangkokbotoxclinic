import { notFound } from "next/navigation";
import { loadMasterDb, getClinicById } from "@/lib/data";
import { CATEGORY_LABELS } from "@/lib/types";
import { BreadcrumbJsonLd, ClinicJsonLd } from "@/components/JsonLd";
import { BookingForm } from "@/components/BookingForm";
import { TrustDonut } from "@/components/TrustBadge";
import { CategoryIcon } from "@/components/CategoryIcon";
import { MapEmbed } from "@/components/MapEmbed";
import { RatingChart } from "@/components/RatingChart";
import { TopicCluster } from "@/components/TopicCluster";
import { LineButton } from "@/components/LineButton";
import { AIVerifiedBadge, SponsoredBadge, Freshness, RelativeRanking } from "@/components/Badges";
import { sponsoredTier } from "@/lib/sponsored";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const db = await (await import("@/lib/data")).loadMasterDb();
  return db.clinics.map((c) => ({ id: c.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const db = await loadMasterDb();
  const c = getClinicById(db.clinics, id);
  if (!c) return { title: "Clinic not found" };
  const cats = c.categories.map((x) => CATEGORY_LABELS[x] ?? x).join(", ");
  const title = `${c.name} — Reviews & Trust Score`;
  const description = `${c.name} in ${c.district || "Bangkok"}: ★${c.rating} (${c.total_reviews} reviews). Trust Score ${c.trust_score}. ${cats || "Aesthetic clinic"}.`;
  return {
    title,
    description,
    alternates: { canonical: `/clinic/${c.id}` },
    openGraph: {
      title,
      description,
      url: `/clinic/${c.id}`,
      type: "article",
    },
  };
}

export default async function ClinicPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = await loadMasterDb();
  const c = getClinicById(db.clinics, id);
  if (!c) notFound();

  const tier = sponsoredTier(c.id);
  const trend = c.rating_trend.trend;
  const samples = [...c.sample_reviews_en, ...c.sample_reviews_th].slice(0, 4);

  // 동일 카테고리 내 trust score percentile (낮을수록 상위)
  const sameCategory = c.categories.length > 0
    ? db.clinics.filter((x) => x.categories.some((cat) => c.categories.includes(cat)))
    : db.clinics;
  const sortedTrust = sameCategory
    .map((x) => x.trust_score)
    .sort((a, b) => b - a);
  const idx = sortedTrust.indexOf(c.trust_score);
  const percentile = sortedTrust.length > 0 ? Math.round((idx / sortedTrust.length) * 100) : 100;
  const rankingLabel = c.categories.length > 0
    ? CATEGORY_LABELS[c.categories[0]] ?? "Bangkok"
    : "Bangkok";

  // Trust Score breakdown for donut
  const ratingPart = (c.rating / 5) * 50;
  const volumePart = Math.min(40, Math.log10(Math.max(1, c.total_reviews)) * 12);
  const lgRatio = c.scraped_review_count > 0 ? c.local_guide_count / c.scraped_review_count : 0;
  const lgPart = Math.min(10, lgRatio * 20);
  const authPart = Math.min(5, Math.log10(Math.max(1, c.avg_author_review_count)) * 2);
  const breakdown = [
    { label: "Rating", value: ratingPart, max: 50, color: "#16a34a" },
    { label: "Volume", value: volumePart, max: 40, color: "#2563eb" },
    { label: "Local Gd", value: lgPart, max: 10, color: "#7c3aed" },
    { label: "Authority", value: authPart, max: 5, color: "#0891b2" },
  ];

  // Similar clinics
  const similar = db.clinics
    .filter((other) =>
      other.id !== c.id &&
      (other.district === c.district || c.categories.some((cat) => other.categories.includes(cat)))
    )
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        {c.district && (
          <>
            <span className="mx-2">›</span>
            <a
              href={`/d/${c.district.toLowerCase().replace(/\s+/g, "-")}`}
              className="hover:text-[var(--fg)]"
            >
              {c.district}
            </a>
          </>
        )}
        <span className="mx-2">›</span>
        <span className="text-[var(--fg)]">{c.name}</span>
      </nav>

      {tier && (
        <div className="mb-3">
          <SponsoredBadge clinicId={c.id} />
        </div>
      )}

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">{c.name}</h1>
            <p className="text-[var(--muted)] flex items-center gap-2 flex-wrap">
              <span>{c.primary_type}</span>
              {c.district && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1">📍 {c.district}</span>
                </>
              )}
              {c.business_status === "Open" && (
                <span className="flex items-center gap-1 text-green-700 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Open
                </span>
              )}
            </p>
          </div>
          <div className="text-right">
            <div className="bg-yellow-50 text-yellow-900 px-4 py-2 rounded-lg text-2xl font-bold">
              ★ {c.rating.toFixed(1)}
            </div>
            <div className="text-xs text-[var(--muted)] mt-1 tabular-nums">
              {c.total_reviews.toLocaleString()} Google reviews
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 items-center">
          <AIVerifiedBadge clinic={c} size="md" />
          {percentile <= 25 && (
            <RelativeRanking percentile={percentile} label={rankingLabel} />
          )}
          <Freshness generatedAt={db.generated_at} mode="detail" />
        </div>

        {c.categories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {c.categories.map((cat) => (
              <a
                key={cat}
                href={`/c/${cat}`}
                className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-blue-100 inline-flex items-center gap-1.5"
              >
                <CategoryIcon category={cat} size={14} />
                {CATEGORY_LABELS[cat] ?? cat}
                {c.service_mentions[cat] ? (
                  <span className="opacity-70 text-xs">· {c.service_mentions[cat]} mentions</span>
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
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          <TrustDonut score={c.trust_score} breakdown={breakdown} />

          <RatingChart trend={c.rating_trend} />

          {c.mentioned_topics.length > 0 && (
            <TopicCluster topics={c.mentioned_topics.slice(0, 12)} />
          )}

          <MapEmbed lat={c.lat} lng={c.lng} name={c.name} height={320} />

          {samples.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-3">Real review excerpts</h2>
              <div className="space-y-3">
                {samples.map((r, i) => (
                  <blockquote key={i} className="border-l-4 border-[var(--accent)] bg-white px-4 py-3 rounded-r">
                    <p className="text-sm leading-relaxed">{r.text}</p>
                    <footer className="mt-2 text-xs text-[var(--muted)] flex items-center gap-2">
                      <span className="font-medium">{r.author || "Google reviewer"}</span>
                      <span>·</span>
                      <span className="text-yellow-700">★ {r.rating}</span>
                    </footer>
                  </blockquote>
                ))}
              </div>
            </section>
          )}

          <section className="grid sm:grid-cols-2 gap-3">
            <div className="bg-white border border-[var(--border)] rounded-lg p-4">
              <div className="text-xs uppercase tracking-wide text-[var(--muted)] mb-1">Address</div>
              <div className="text-sm leading-relaxed">{c.address || "—"}</div>
            </div>
            <div className="bg-white border border-[var(--border)] rounded-lg p-4">
              <div className="text-xs uppercase tracking-wide text-[var(--muted)] mb-1">Phone</div>
              <div className="text-sm">{c.phone || "—"}</div>
              {c.website && (
                <>
                  <div className="text-xs uppercase tracking-wide text-[var(--muted)] mb-1 mt-3">Website</div>
                  <a
                    href={c.website}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-sm text-[var(--accent)] hover:underline truncate block"
                  >
                    {c.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </a>
                </>
              )}
            </div>
          </section>
        </div>

        {/* Sticky sidebar */}
        <aside className="lg:sticky lg:top-4 lg:self-start space-y-4">
          <div className="bg-white border border-[var(--border)] rounded-xl p-4">
            <LineButton clinicName={c.name} phone={c.phone} size="lg" />
            <p className="text-[11px] text-[var(--muted)] mt-2 text-center">
              Free, no obligation. We confirm your slot within 24h.
            </p>
          </div>

          <BookingForm clinicId={c.id} clinicName={c.name} />

          <div className="bg-white border border-[var(--border)] rounded-xl p-4 space-y-2">
            <a
              href={c.maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-black text-white py-2.5 px-4 rounded-lg font-bold text-center hover:bg-gray-800 text-sm"
            >
              View on Google Maps
            </a>
            {c.phone && (
              <a
                href={`tel:${c.phone.replace(/[^+\d]/g, "")}`}
                className="block w-full bg-white border border-[var(--border)] py-2.5 px-4 rounded-lg font-bold text-center hover:border-black text-sm"
              >
                📞 Call clinic
              </a>
            )}
            {c.website && (
              <a
                href={c.website}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="block w-full bg-white border border-[var(--border)] py-2.5 px-4 rounded-lg font-bold text-center hover:border-black text-sm"
              >
                Visit website
              </a>
            )}
          </div>

          {similar.length > 0 && (
            <div className="bg-white border border-[var(--border)] rounded-xl p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
                Similar clinics
              </h3>
              <div className="space-y-2">
                {similar.map((s) => (
                  <a
                    key={s.id}
                    href={`/clinic/${s.id}`}
                    className="block group"
                  >
                    <div className="font-medium text-sm group-hover:text-[var(--accent)] truncate transition">
                      {s.name}
                    </div>
                    <div className="text-xs text-[var(--muted)] flex items-center gap-2">
                      <span>{s.district}</span>
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

      <ClinicJsonLd c={c} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        ...(c.district ? [{ name: c.district, url: `/d/${c.district.toLowerCase().replace(/\s+/g, "-")}` }] : []),
        { name: c.name, url: `/clinic/${c.id}` },
      ]} />
    </div>
  );
}
