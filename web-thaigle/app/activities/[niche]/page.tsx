import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  NICHES,
  loadNicheDb,
  loadCommunityDb,
  topNichePlaces,
  buildKlookIndex,
} from "@/lib/niches";
import type { NicheSlug } from "@/lib/niches";
import { AdSlot } from "@/components/AffiliateSlot";
import { NicheGrid } from "@/components/NicheGrid";
import { ShareButton } from "@/components/ShareButton";
import { NicheItemListJsonLd, FaqJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { NICHE_FAQS, NICHE_INTRO } from "@/lib/niche-content";

export const dynamic = "force-static";
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

export function generateStaticParams() {
  return NICHES.map((n) => ({ niche: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ niche: string }>;
}): Promise<Metadata> {
  const { niche } = await params;
  const info = NICHES.find((n) => n.slug === niche);
  if (!info) return {};
  const db = await loadNicheDb(niche as NicheSlug);
  return {
    title: `Best ${info.label} in Bangkok (${db.total} Ranked)`,
    description: `Top ${info.label.toLowerCase()} in Bangkok ranked by real Google reviews. ${db.total} venues — data-driven, no paid picks.`,
    alternates: { canonical: `/activities/${niche}` },
    openGraph: {
      title: `Best ${info.label} in Bangkok — Data-Driven Rankings`,
      description: `${db.total} ${info.label.toLowerCase()} venues ranked by trust score from real Google reviews.`,
    },
  };
}

const PRICE_BAND_LABELS: Record<string, string> = {
  budget: "฿",
  mid: "฿฿",
  premium: "฿฿฿",
  luxury: "฿฿฿฿",
};

export default async function NichePage({
  params,
}: {
  params: Promise<{ niche: string }>;
}) {
  const { niche } = await params;
  const info = NICHES.find((n) => n.slug === niche);
  if (!info) notFound();

  const [db, community] = await Promise.all([
    loadNicheDb(niche as NicheSlug),
    loadCommunityDb(niche as NicheSlug),
  ]);

  const top = topNichePlaces(db.places, 60);
  const klookMap = await buildKlookIndex(top.map((p) => p.id));
  const topReddit = community?.top_reddit?.slice(0, 4) ?? [];
  const topNaver = community?.top_naver?.slice(0, 3) ?? [];
  const planType = info.planType;
  const pageUrl = `${SITE}/activities/${niche}`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10">
      {/* Breadcrumb */}
      <a href="/activities" className="text-sm text-[var(--muted)] hover:text-black mb-4 inline-flex items-center gap-1">
        ← All Activities
      </a>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{info.icon}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                {NICHE_INTRO[niche as NicheSlug]?.headline ?? `Best ${info.label} in Bangkok`}
              </h1>
              <p className="text-sm text-[var(--muted)] mt-1">
                {NICHE_INTRO[niche as NicheSlug]?.sub ?? `${db.total} venues · ranked by real reviews`}
              </p>
            </div>
          </div>
          <ShareButton
            title={`Best ${info.label} in Bangkok`}
            text={`${db.total} venues ranked by real Google reviews — no paid picks`}
            url={pageUrl}
            kakao
            line
            whatsapp
          />
        </div>

        {/* Filter badges */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold">✓ No paid rankings</span>
          <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">📊 Trust Score method</span>
          {top.filter((p) => p.is_beginner_friendly).length > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
              🌱 {top.filter((p) => p.is_beginner_friendly).length} beginner-friendly
            </span>
          )}
          {top.filter((p) => p.languages?.ko).length > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
              🇰🇷 {top.filter((p) => p.languages?.ko).length} Korean-speaking
            </span>
          )}
        </div>
      </div>

      {/* Top-10 article link */}
      <div className="mb-4 text-sm">
        <span className="text-[var(--muted)]">Looking for a ranked article? </span>
        <a href={`/activities/${niche}/top-10`} className="text-orange-600 font-bold hover:underline">
          See our Top 10 {info.label} in Bangkok →
        </a>
      </div>

      <NicheGrid
        places={top}
        klookData={[...klookMap.entries()]}
        nicheSlug={niche}
        nicheIcon={info.icon}
        planType={planType}
        PRICE_BAND_LABELS={PRICE_BAND_LABELS}
      />

      <AdSlot slot={`activities-${niche}-mid`} />

      {/* Community discussions */}
      {(topReddit.length > 0 || topNaver.length > 0) && (
        <section className="mb-10 border border-[var(--border)] rounded-2xl p-5 bg-white">
          <h2 className="text-lg font-black mb-1">What travelers say online</h2>
          <p className="text-sm text-[var(--muted)] mb-4">
            Real discussions about {info.label.toLowerCase()} in Thailand
          </p>

          {topReddit.length > 0 && (
            <div className="mb-4">
              <div className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">
                Reddit · {community?.counts.reddit.toLocaleString()} posts
              </div>
              <div className="space-y-2">
                {topReddit.map((post, i) => (
                  <a
                    key={i}
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 rounded-xl border border-[var(--border)] hover:border-orange-300 hover:bg-orange-50/40 transition group"
                  >
                    <div className="text-[var(--muted)] text-xs tabular-nums shrink-0 pt-0.5 font-bold min-w-[36px] text-right">
                      ▲{post.score >= 1000 ? `${(post.score / 1000).toFixed(1)}k` : post.score}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium group-hover:text-orange-700 transition line-clamp-2 leading-snug">
                        {post.title}
                      </div>
                      <div className="text-xs text-[var(--muted)] mt-0.5">
                        r/{post.subreddit} · {post.comments.toLocaleString()} comments
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {topNaver.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">
                🇰🇷 Naver · {community?.counts.naver.toLocaleString()} posts
              </div>
              <div className="space-y-2">
                {topNaver.map((post, i) => (
                  <a
                    key={i}
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 rounded-xl border border-[var(--border)] hover:border-purple-200 hover:bg-purple-50/40 transition group"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium group-hover:text-purple-700 transition line-clamp-2 leading-snug">
                        {post.title}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* FAQ section */}
      {(NICHE_FAQS[niche as NicheSlug] ?? []).length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-black mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {(NICHE_FAQS[niche as NicheSlug] ?? []).map((f, i) => (
              <details key={i} className="bg-white border border-[var(--border)] rounded-xl p-4 group">
                <summary className="font-medium cursor-pointer flex items-center justify-between gap-3 text-sm">
                  <span>{f.q}</span>
                  <span className="text-[var(--muted)] group-open:rotate-180 transition shrink-0">⌄</span>
                </summary>
                <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Cross-link */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          More activities in Bangkok
        </h2>
        <div className="flex flex-wrap gap-2">
          {NICHES.filter((n) => n.slug !== niche).map((n) => (
            <a
              key={n.slug}
              href={`/activities/${n.slug}`}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-[var(--border)] text-sm bg-white hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700 transition font-medium"
            >
              {n.icon} {n.label}
            </a>
          ))}
        </div>
      </section>

      {/* Structured data */}
      <NicheItemListJsonLd
        name={`Best ${info.label} in Bangkok`}
        items={top.slice(0, 20).map((p) => ({
          name: p.name,
          slug: p.slug,
          niche: niche,
          rating: p.rating,
          review_count: p.review_count,
          address: p.address,
        }))}
        url={`/activities/${niche}`}
      />
      <FaqJsonLd faqs={NICHE_FAQS[niche as NicheSlug] ?? []} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Activities", url: "/activities" },
        { name: info.label, url: `/activities/${niche}` },
      ]} />
    </div>
  );
}
