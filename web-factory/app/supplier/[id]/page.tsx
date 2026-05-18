import { notFound } from "next/navigation";
import { loadMasterDb, getSupplierById } from "@/lib/data";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";
import { BreadcrumbJsonLd, SupplierJsonLd, ProfilePageJsonLd } from "@/components/JsonLd";
import { TrustDonut } from "@/components/TrustBadge";
import { MapEmbed } from "@/components/MapEmbed";
import { TopicCluster } from "@/components/TopicCluster";
import { AIVerifiedBadge, SponsoredBadge, Freshness, RelativeRanking } from "@/components/Badges";
import { sponsoredTier } from "@/lib/sponsored";
import { verifiedTier, VERIFIED_BADGE } from "@/lib/verified";
import { AffiliateInline, AdSlot } from "@/components/AffiliateSlot";
import type { Metadata } from "next";

export const dynamicParams = false;

export async function generateStaticParams() {
  const db = await (await import("@/lib/data")).loadMasterDb();
  // Cloudflare Pages 20K 파일 한도 — trust_score >= 55 만 prerender.
  return db.suppliers
    .filter((r) => r.trust_score >= 55)
    .map((r) => ({ id: r.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const db = await loadMasterDb();
  const r = getSupplierById(db.suppliers, id);
  if (!r) return { title: "Supplier not found" };
  const cats = r.categories.map((c) => CATEGORY_LABELS[c] ?? c).join(", ");
  const loc = [r.district, r.city_label].filter(Boolean).join(", ") || "Thailand";
  const desc = `${r.name} (${loc}) — Trust Score ${r.trust_score} from ★${r.rating.toFixed(1)} × ${r.total_reviews.toLocaleString()} Google reviews. ${cats || "Thai supplier"}.${r.website ? " Direct contact via supplier website." : ""}`;
  // noindex weak pages: review 0건 + website 없음 + phone 없음 — thin content 방지
  const isWeak =
    r.total_reviews === 0 &&
    !r.website &&
    !r.phone &&
    r.scraped_review_count === 0;
  return {
    title: `${r.name} — Trust Score ${r.trust_score.toFixed(0)} · Verified Reviews`,
    description: desc.slice(0, 200),
    alternates: { canonical: `/supplier/${id}` },
    robots: isWeak ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function SupplierPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = await loadMasterDb();
  const r = getSupplierById(db.suppliers, id);
  if (!r) notFound();

  const tier = sponsoredTier(r.id);
  const verified = verifiedTier(r.id);
  const verifiedConf = verified ? VERIFIED_BADGE[verified] : null;
  const samples = [...r.sample_reviews_en, ...r.sample_reviews_th, ...r.sample_reviews_ko].slice(0, 5);

  // Trust breakdown — 우리 trust_score 함수와 일치 (rating 50 + volume 40 + coverage 5 + text 5)
  const ratingPart = (r.rating / 5) * 50;
  const volumePart = Math.min(40, Math.log10(Math.max(1, r.total_reviews)) * 12);
  const coverageRatio = r.total_reviews > 0 ? r.scraped_review_count / r.total_reviews : 0;
  const coveragePart = Math.min(5, coverageRatio * 50);
  const avgTextLen = r.scraped_review_count > 0
    ? r.sample_reviews_en.concat(r.sample_reviews_th, r.sample_reviews_ko).reduce((s, x) => s + x.text.length, 0) / Math.max(1, r.sample_reviews_en.length + r.sample_reviews_th.length + r.sample_reviews_ko.length)
    : 0;
  const textPart = Math.min(5, Math.log10(Math.max(1, avgTextLen)) * 1.5);
  const breakdown = [
    { label: "Rating", value: ratingPart, max: 50, color: "#16a34a" },
    { label: "Volume", value: volumePart, max: 40, color: "#dc2626" },
    { label: "Coverage", value: coveragePart, max: 5, color: "#7c3aed" },
    { label: "Detail", value: textPart, max: 5, color: "#0891b2" },
  ];

  // 같은 카테고리 + 도시 cohort percentile
  const cohort = r.categories.length > 0
    ? db.suppliers.filter((x) => x.categories.some((c) => r.categories.includes(c)) && x.city === r.city)
    : db.suppliers.filter((x) => x.city === r.city);
  const sortedTrust = cohort.map((x) => x.trust_score).sort((a, b) => b - a);
  const idx = sortedTrust.indexOf(r.trust_score);
  const percentile = sortedTrust.length > 0 ? Math.round((idx / sortedTrust.length) * 100) : 100;
  const rankingLabel = r.categories.length > 0
    ? `${CATEGORY_LABELS[r.categories[0]] ?? r.categories[0]} (${r.city_label})`
    : r.city_label;

  const similar = db.suppliers
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

      {verifiedConf && (
        <div className="mb-4 p-4 rounded-xl border" style={{ background: verifiedConf.bg, borderColor: verifiedConf.fg + "40" }}>
          <div className="flex items-start gap-3">
            <div className="text-2xl shrink-0" style={{ color: verifiedConf.fg }}>{verifiedConf.icon}</div>
            <div>
              <div className="font-bold text-base" style={{ color: verifiedConf.fg }}>{verifiedConf.label}</div>
              <p className="text-sm mt-0.5" style={{ color: verifiedConf.fg, opacity: 0.85 }}>
                {verifiedConf.description}
              </p>
            </div>
          </div>
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
            From supplier&apos;s own website
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
                <span aria-hidden>{CATEGORY_ICONS[c] ?? "🏭"}</span>
                {CATEGORY_LABELS[c] ?? c}
              </a>
            ))}
          </div>
        )}
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TrustDonut score={r.trust_score} breakdown={breakdown} />

          {r.mentioned_topics.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-3">What buyers mention</h2>
              <p className="text-sm text-[var(--muted)] mb-3">
                Auto-extracted from {r.scraped_review_count.toLocaleString()} analyzed Google reviews. Topics that appear most often in reviewer feedback.
              </p>
              <TopicCluster topics={r.mentioned_topics.slice(0, 12)} />
            </section>
          )}

          <MapEmbed lat={r.lat} lng={r.lng} name={r.name} height={320} />

          {samples.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-3">Real review excerpts</h2>
              <p className="text-sm text-[var(--muted)] mb-3">
                Direct excerpts from Google reviews — not edited or commissioned.
              </p>
              <div className="space-y-3">
                {samples.map((rev, i) => (
                  <blockquote key={i} className="border-l-4 border-emerald-600 bg-white px-4 py-3 rounded-r">
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

          <AdSlot slot="supplier-detail-mid" />

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
                    className="text-sm text-emerald-700 hover:underline truncate block"
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
                📞 Call directly
              </a>
            )}
            {r.website && (
              <a
                href={r.website}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="block w-full bg-white border border-[var(--border)] py-2.5 px-4 rounded-lg font-bold text-center hover:border-black text-sm"
              >
                🌐 Supplier website
              </a>
            )}
          </div>

          <AffiliateInline category={r.categories[0]} district={r.district} />
          <AdSlot slot="supplier-sidebar" />

          {similar.length > 0 && (
            <div className="bg-white border border-[var(--border)] rounded-xl p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
                Similar suppliers
              </h3>
              <div className="space-y-2">
                {similar.map((s) => (
                  <a key={s.id} href={`/supplier/${s.id}`} className="block group">
                    <div className="font-medium text-sm group-hover:text-emerald-700 truncate transition">
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

      {/* Contextual internal linking — keyword-rich anchors for SEO */}
      <section className="mt-12 bg-emerald-50/40 border border-emerald-100 rounded-xl p-6">
        <h2 className="text-lg font-bold mb-4">Browse related suppliers</h2>
        <div className="flex flex-wrap gap-2">
          {r.categories.slice(0, 3).map((c) => (
            <a
              key={c}
              href={`/c/${c}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-300 rounded-full text-sm hover:bg-emerald-50 hover:border-emerald-500 transition font-medium"
            >
              {CATEGORY_ICONS[c] ?? "🏭"}
              All {CATEGORY_LABELS[c] ?? c} in Thailand
            </a>
          ))}
          {r.district && r.categories[0] && (
            <a
              href={`/c/${r.categories[0]}/${r.district.toLowerCase().replace(/\s+/g, "-")}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-300 rounded-full text-sm hover:bg-emerald-50 hover:border-emerald-500 transition font-medium"
            >
              📍 {CATEGORY_LABELS[r.categories[0]] ?? r.categories[0]} in {r.district}
            </a>
          )}
          <a
            href={`/city/${r.city}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-300 rounded-full text-sm hover:bg-emerald-50 hover:border-emerald-500 transition font-medium"
          >
            🏙 All suppliers in {r.city_label}
          </a>
          {r.district && (
            <a
              href={`/d/${r.district.toLowerCase().replace(/\s+/g, "-")}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-300 rounded-full text-sm hover:bg-emerald-50 hover:border-emerald-500 transition font-medium"
            >
              📍 Suppliers in {r.district}
            </a>
          )}
          <a
            href="/best/highly-recommended"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-300 rounded-full text-sm hover:bg-emerald-50 hover:border-emerald-500 transition font-medium"
          >
            ⭐ Most highly recommended
          </a>
        </div>
      </section>

      <SupplierJsonLd r={r} />
      <ProfilePageJsonLd r={r} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: r.city_label, url: `/city/${r.city}` },
        ...(r.district ? [{ name: r.district, url: `/d/${r.district.toLowerCase().replace(/\s+/g, "-")}` }] : []),
        { name: r.name, url: `/supplier/${r.id}` },
      ]} />
    </div>
  );
}
