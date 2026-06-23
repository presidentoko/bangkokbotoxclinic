import { notFound } from "next/navigation";
import { loadMasterDb, getClinicById } from "@/lib/data";
import { loadPricing, summarisePackages, priceRangeTHB } from "@/lib/pricing";
import { loadPhotos } from "@/lib/photos";
import { PhotoGallery } from "@/components/PhotoGallery";
import { CATEGORY_LABELS } from "@/lib/types";
import { BreadcrumbJsonLd, ClinicJsonLd, FaqJsonLd, SpeakableJsonLd } from "@/components/JsonLd";
import { buildClinicFaqs } from "@/lib/clinic-faq";
import { BookingForm } from "@/components/BookingForm";
import { CategoryIcon } from "@/components/CategoryIcon";
import { TopicCluster } from "@/components/TopicCluster";
import { LineButton } from "@/components/LineButton";
import { AIVerifiedBadge, SponsoredBadge, Freshness, RelativeRanking, VerifiedPartnerBadge } from "@/components/Badges";
import { sponsoredTier } from "@/lib/sponsored";
import { AdPlaceholder } from "@/components/AffiliateSlot";
import { ClaimBanner } from "@/components/ClaimBanner";
import { ViewBeacon } from "@/components/ViewBeacon";
import { FloatingContactBar } from "@/components/FloatingContactBar";
import { FaqSection } from "@/components/FaqSection";
import { RelatedExplore } from "@/components/RelatedExplore";
import { loadWikiSummary } from "@/lib/wiki";
import { StickyClinicBar } from "@/components/StickyClinicBar";
import { ClinicPriceBlock } from "@/components/ClinicPriceBlock";
import { ClinicCtaCard } from "@/components/ClinicCtaCard";
import { extractPriceEstimates } from "@/lib/priceEstimates";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

// Below-fold components — lazy loaded into separate chunks for faster initial bundle
const TrustDonut = dynamic(
  () => import("@/components/TrustBadge").then((m) => m.TrustDonut),
  { ssr: true }
);
const MapEmbed = dynamic(
  () => import("@/components/MapEmbed").then((m) => m.MapEmbed),
  { ssr: true }
);
const RatingChart = dynamic(
  () => import("@/components/RatingChart").then((m) => m.RatingChart),
  { ssr: true }
);
const WikiSummaryCard = dynamic(
  () => import("@/components/WikiSummaryCard").then((m) => m.WikiSummaryCard),
  { ssr: true }
);
const PantipMentions = dynamic(
  () => import("@/components/PantipMentions").then((m) => m.PantipMentions),
  { ssr: true }
);

// top 500 클리닉 pre-build — Google 크롤 시 cold start 없애서 인덱싱 개선.
// 나머지는 첫 방문 시 on-demand 생성 → 7일 캐시.
export const revalidate = 604800;
export const dynamicParams = true;

export async function generateStaticParams() {
  const db = await (await import("@/lib/data")).loadMasterDb();
  const ranked = [...db.clinics].sort((a, b) => {
    const sa = (a.trust_score || 0) * Math.log(1 + (a.total_reviews || 0));
    const sb = (b.trust_score || 0) * Math.log(1 + (b.total_reviews || 0));
    return sb - sa;
  });
  return ranked.slice(0, 500).map((c) => ({ id: c.id }));
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
    alternates: {
      canonical: `/clinic/${c.id}`,
      // hreflang — Google에게 같은 클리닉의 TH/EN 양국어 변형 알림
      languages: {
        "en-US": `/clinic/${c.id}`,
        "th-TH": `/th/clinic/${c.id}`,
        "x-default": `/clinic/${c.id}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `/clinic/${c.id}`,
      type: "article",
      locale: "en_US",
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

  const tier = await sponsoredTier(c.id);
  const trend = c.rating_trend?.trend ?? "insufficient_data";
  const samples = [...(c.sample_reviews_en ?? []), ...(c.sample_reviews_th ?? [])].slice(0, 4);

  // Pricing — hdmall package 데이터(있는 경우)
  const pricing = await loadPricing(c.id);
  const pricingTop = pricing ? summarisePackages(pricing, 6) : [];
  const priceRange = pricing ? priceRangeTHB(pricing) : null;

  const allReviews = [...(c.sample_reviews_en ?? []), ...(c.sample_reviews_th ?? [])];
  const priceEstimates = extractPriceEstimates(allReviews);

  // Photos — hair-project 스크랩 (헤어 사이트) / Places API (추후)
  const photos = await loadPhotos(c.id);

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

  // Similar clinics (sidebar — loose match: district OR category)
  const similar = db.clinics
    .filter((other) =>
      other.id !== c.id &&
      (other.district === c.district || c.categories.some((cat) => other.categories.includes(cat)))
    )
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, 4);

  // Nearby clinics (main column — strict: same district AND same primary category, fallback to loose)
  const primaryCat = c.categories[0];
  const strictNearby = primaryCat && c.district
    ? db.clinics
        .filter((other) =>
          other.id !== c.id &&
          other.district === c.district &&
          other.categories.includes(primaryCat)
        )
        .sort((a, b) => b.trust_score - a.trust_score)
        .slice(0, 6)
    : [];
  const nearbyClinics = strictNearby.length >= 3
    ? strictNearby
    : db.clinics
        .filter((other) =>
          other.id !== c.id &&
          (other.district === c.district || c.categories.some((cat) => other.categories.includes(cat)))
        )
        .sort((a, b) => b.trust_score - a.trust_score)
        .slice(0, 6);

  // Wiki summary (LLM 생성, 미존재 시 null — graceful degrade)
  const wikiSummary = await loadWikiSummary(c.id);
  // AEO: 자동 FAQ — Google PAA 대응 + LLM 인용
  const faqs = buildClinicFaqs(c as Parameters<typeof buildClinicFaqs>[0]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <ViewBeacon clinicId={c.id} />
      <StickyClinicBar
        clinicName={c.name}
        phone={c.phone || undefined}
        lineId={null}
      />
      <FloatingContactBar clinicName={c.name} phone={c.phone} />
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

      {/* Owner lead funnel — all clinic pages */}
      <ClaimBanner clinicId={c.id} clinicName={c.name} accent="var(--accent)" />

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
          {tier && <VerifiedPartnerBadge clinicId={c.id} />}
          <AIVerifiedBadge clinic={c} size="md" />
          {percentile <= 25 && (
            <RelativeRanking percentile={percentile} label={rankingLabel} />
          )}
          <Freshness generatedAt={db.generated_at} mode="detail" />
          {priceRange && (
            <span className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
              ฿{priceRange.min.toLocaleString()}–{priceRange.max.toLocaleString()}
              <span className="opacity-70 text-xs ml-1">· {pricing?.packages.length} packages</span>
            </span>
          )}
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

      {/* Wiki AI summary — 양국어, AEO/LLM 인용 친화. header 직하 prominent. */}
      {wikiSummary && (
        <div className="mb-6">
          <WikiSummaryCard summary={wikiSummary} />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {photos && photos.photos.length > 0 && (
            <PhotoGallery photos={photos.photos} clinicName={c.name} />
          )}

          {/* Pantip — 태국 최대 커뮤니티 토픽 인용 + 외부 backlink */}
          <PantipMentions clinic={c} />

          <TrustDonut score={c.trust_score} breakdown={breakdown} />

          <RatingChart trend={c.rating_trend} />

          {c.mentioned_topics.length > 0 && (
            <TopicCluster topics={c.mentioned_topics.slice(0, 12)} />
          )}

          <MapEmbed lat={c.lat} lng={c.lng} name={c.name} height={320} />

          {pricing && pricingTop.length > 0 && (
            <section className="bg-white border border-[var(--border)] rounded-xl p-5">
              <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
                <h2 className="text-lg font-bold">Sample pricing</h2>
                <span className="text-[11px] text-[var(--muted)]">
                  via HDmall · {pricing.packages.length} packages total
                </span>
              </div>
              <ul className="divide-y divide-[var(--border)]">
                {pricingTop.map((pk) => {
                  const url = pk.url_slug ? `https://hdmall.co.th/${pk.url_slug}` : pricing.hdmall_url;
                  const discounted = pk.original_price && pk.original_price > pk.current_price;
                  return (
                    <li key={pk.sku} className="py-2.5 flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        {url ? (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer nofollow sponsored"
                            className="text-sm leading-snug hover:underline line-clamp-2"
                          >
                            {pk.name}
                          </a>
                        ) : (
                          <span className="text-sm leading-snug line-clamp-2">{pk.name}</span>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold tabular-nums">฿{pk.current_price.toLocaleString()}</div>
                        {discounted && (
                          <div className="text-[10px] text-[var(--muted)] line-through tabular-nums">
                            ฿{pk.original_price!.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
              {pricing.hdmall_url && (
                <a
                  href={pricing.hdmall_url}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[var(--accent)] hover:underline"
                >
                  See all packages on HDmall →
                </a>
              )}
              <p className="mt-3 text-[11px] text-[var(--muted)] leading-relaxed">
                Prices are package list prices from HDmall. Actual cost may vary based on consultation
                — confirm with the clinic before booking. Prices in THB.
              </p>
            </section>
          )}

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

          {/* AEO: FAQ 가시 섹션 + JSON-LD 짝꿍 (페이지 끝 JsonLd) */}
          <FaqSection faqs={faqs} />

          {/* SEO: 카테고리/지역 long-tail 자동 내부 백링크 */}
          <RelatedExplore clinic={c} />

          {/* STEP 4: 인접 클리닉 cross-link — 같은 구 + 같은 카테고리, 6개 카드 */}
          {nearbyClinics.length > 0 && (
            <section className="bg-white border border-[var(--border)] rounded-xl p-5">
              <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
                <h2 className="text-lg font-bold">
                  {primaryCat && c.district
                    ? `More ${CATEGORY_LABELS[primaryCat] ?? primaryCat} clinics in ${c.district}`
                    : c.district
                    ? `More clinics in ${c.district}`
                    : "Similar clinics"}
                </h2>
                {primaryCat && c.district && (
                  <a
                    href={`/c/${primaryCat}/${c.district.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-xs text-[var(--accent)] hover:underline font-medium"
                  >
                    See all →
                  </a>
                )}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {nearbyClinics.map((s) => (
                  <a
                    key={s.id}
                    href={`/clinic/${s.id}`}
                    className="group flex flex-col gap-1 p-3 rounded-lg border border-[var(--border)] hover:border-[var(--accent)] transition"
                  >
                    <div className="font-medium text-sm group-hover:text-[var(--accent)] transition line-clamp-2 leading-snug">
                      {s.name}
                    </div>
                    <div className="text-xs text-[var(--muted)] flex items-center gap-2 flex-wrap">
                      {s.district && <span>{s.district}</span>}
                      <span>★ {s.rating.toFixed(1)}</span>
                      <span
                        className="font-medium"
                        style={{
                          color:
                            s.trust_score >= 75
                              ? "#16a34a"
                              : s.trust_score >= 60
                              ? "#059669"
                              : "#ca8a04",
                        }}
                      >
                        Trust {s.trust_score.toFixed(0)}
                      </span>
                    </div>
                  </a>
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
          <ClinicPriceBlock
            estimates={priceEstimates}
            hdmallMin={priceRange?.min ?? null}
            hdmallMax={priceRange?.max ?? null}
          />
          <ClinicCtaCard
            clinicName={c.name}
            phone={c.phone || undefined}
            lineId={null}
          />
          {/* Hero CTA — 가장 prominent. accent gradient + 강한 contrast */}
          <div
            className="rounded-xl p-4 text-white shadow-lg"
            style={{ background: `linear-gradient(135deg, var(--accent), var(--accent))` }}
          >
            <div className="text-[10px] uppercase tracking-widest font-bold opacity-90 mb-2">
              Book consultation
            </div>
            <LineButton clinicName={c.name} phone={c.phone} size="lg" />
            <p className="text-[11px] mt-2 text-center opacity-90">
              Free · We confirm your slot within 24h
            </p>
          </div>

          {/* Sidebar ad slot — sticky 안에서 같이 스크롤되며 노출 길게 */}
          <AdPlaceholder variant="square" label="Sponsored" hint="Sidebar ad" />

          <BookingForm clinicId={c.id} clinicName={c.name} />

          <div className="bg-white border border-[var(--border)] rounded-xl p-4 space-y-2">
            <a
              href={c.maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-black text-white py-2.5 px-4 rounded-lg font-bold text-center hover:bg-gray-800 text-sm"
            >
              View photos & info on Google Maps
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

          {/* Below-similar ad slot — 2nd ad position in sidebar */}
          <AdPlaceholder variant="square" label="Sponsored" hint="Below-fold sidebar" />

          {similar.length > 0 && (
            <div className="bg-white border border-[var(--border)] rounded-xl p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
                Similar clinics
              </h3>
              <div className="space-y-2">
                {similar.map((s) => (
                  <div key={s.id} className="group flex items-start justify-between gap-2">
                    <a href={`/clinic/${s.id}`} className="flex-1 min-w-0">
                      <div className="font-medium text-sm group-hover:text-[var(--accent)] truncate transition">
                        {s.name}
                      </div>
                      <div className="text-xs text-[var(--muted)] flex items-center gap-2 flex-wrap">
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
                    <a
                      href={`/compare/${c.id}/${s.id}`}
                      className="shrink-0 text-[10px] uppercase tracking-widest text-[var(--muted)] hover:text-[var(--accent)] border border-[var(--border)] rounded px-2 py-0.5 hover:border-[var(--accent)] transition"
                      title={`Compare ${c.name} vs ${s.name}`}
                    >
                      Compare
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      <ClinicJsonLd c={c} photos={photos?.photos} priceRange={priceRange ?? undefined} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        ...(c.district ? [{ name: c.district, url: `/d/${c.district.toLowerCase().replace(/\s+/g, "-")}` }] : []),
        { name: c.name, url: `/clinic/${c.id}` },
      ]} />
      {/* AEO: FAQ schema — Google PAA / LLM 인용 친화 */}
      <FaqJsonLd faqs={faqs} />
      {/* AEO: Speakable — 음성검색 (Google Assistant 등) 응답 elig */}
      <SpeakableJsonLd url={`/clinic/${c.id}`} />
    </div>
  );
}
