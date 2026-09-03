import { notFound } from "next/navigation";
import { loadMasterDb, getRestaurantById } from "@/lib/data";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";
import { BreadcrumbJsonLd, RestaurantJsonLd, CourseVideosJsonLd, FaqJsonLd, CoursePriceJsonLd } from "@/components/JsonLd";
import { buildComparePairs } from "@/lib/comparePairs";
import { TrustDonut } from "@/components/TrustBadge";
import { MapEmbed } from "@/components/MapEmbed";
import { TeeTimePlanner } from "@/components/TeeTimePlanner";
import { buildCourseSummary } from "@/lib/courseSummary";
import { isIndexableCourse } from "@/lib/indexable";
import { indexableDistricts, allDistricts } from "@/lib/crawlGate";
import { RatingChart } from "@/components/RatingChart";
import { TopicCluster } from "@/components/TopicCluster";
import { AIVerifiedBadge, SponsoredBadge, Freshness, RelativeRanking } from "@/components/Badges";
import { sponsoredTier } from "@/lib/sponsored";
import { drainageStatus, STATUS_EMOJI, STATUS_LABEL } from "@/lib/weather";
import { AffiliateInline, AdSlot } from "@/components/AffiliateSlot";
import { TravelStackAffiliate } from "@/components/TravelStackAffiliate";
import { loadPriceMatrix, toPriceRows } from "@/lib/priceMatrix";
import { BookingCompare } from "@/components/BookingCompare";
import { offersForCourse, courseFacts, providerNames } from "@/lib/providers";
import type { Metadata } from "next";

export const revalidate = 604800;

// 전량 pre-build + dynamicParams=false.
// 이전엔 리뷰수 top 80만 pre-build 하고 나머지 559개는 on-demand 였는데, 그 결과:
//   1) 봇/스캐너가 임의 id 로 찔러도 notFound() 결과까지 ISR 캐시에 write 되면서
//      ISR Writes 가 월 367K(할당량 200K)까지 치솟았다.
//   2) sitemap 에는 578개 코스가 실려 있는데 pre-build 는 80개뿐이라, 구글이 나머지를
//      크롤할 때마다 콜드 렌더를 맞았다. 같은 라우트의 opengraph-image.tsx 는 이미
//      전량을 pre-build 하고 있어서 페이지 쪽만 불일치한 상태이기도 했다.
// 전량 정적화하면 봇 probe 는 정적 404 로 끝나고 ISR write 자체가 사라진다.
export const dynamicParams = false;

export async function generateStaticParams() {
  const db = await (await import("@/lib/data")).loadMasterDb();
  return db.restaurants.map((r) => ({ id: r.id }));
}

// Detect if a string is "mostly Latin" — used to decide whether top_review_text
// (often Thai/Korean for top reviews) is safe to use as English meta description.
function isMostlyLatin(s: string): boolean {
  if (!s) return false;
  const letters = s.match(/[A-Za-z฀-๿가-힣]/g);
  if (!letters || letters.length < 30) return false;
  const latin = (s.match(/[A-Za-z]/g) || []).length;
  return latin / letters.length >= 0.7;
}

// Pick an English-first review excerpt: prefer sample_reviews_en, then scan
// scraped_reviews for one that's mostly Latin script, else fall back to generic.
function englishExcerpt(r: import("@/lib/types").Course): string | null {
  if (r.sample_reviews_en && r.sample_reviews_en.length > 0) {
    const t = r.sample_reviews_en[0].text;
    if (t && t.length >= 40) return t;
  }
  if (r.scraped_reviews) {
    for (const sr of r.scraped_reviews) {
      if (sr.text && isMostlyLatin(sr.text)) return sr.text;
    }
  }
  if (r.top_review_text && isMostlyLatin(r.top_review_text)) return r.top_review_text;
  return null;
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const db = await loadMasterDb();
  const r = getRestaurantById(db.restaurants, id);
  if (!r) return { title: "Course not found" };
  const cats = r.categories.map((c) => CATEGORY_LABELS[c] ?? c).join(", ");
  const where = r.district || r.city_label || "Thailand";
  const englishReview = englishExcerpt(r);
  const generic = `${r.name} in ${where}: ★${r.rating} (${r.total_reviews} reviews). Trust Score ${r.trust_score}. ${cats || "Golf course"}.`;
  const description = englishReview
    ? `${englishReview.slice(0, 140).trim()}${englishReview.length > 140 ? "…" : ""} · ★${r.rating} · ${where}`
    : generic;

  // 색인 자격 판단은 lib/indexable 한 곳에서만 — sitemap 도 같은 함수를 쓴다.
  // 구글 리뷰가 0건이면 쓸 말이 없어 영원히 색인되지 않으므로 noindex 로 내보낸다.
  const indexable = isIndexableCourse(r);

  // og:image is auto-supplied by app/course/[id]/opengraph-image.tsx — we only
  // set title/description here so og:image stays the dynamic per-course PNG.
  return {
    title: `${r.name} — Reviews & Trust Score`,
    description,
    alternates: { canonical: `/course/${id}` },
    robots: indexable ? undefined : { index: false, follow: true },
    openGraph: {
      title: `${r.name} - Thailand Golf Guide`,
      description,
    },
    twitter: { card: "summary_large_image" },
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
  const curatedSamples = [...r.sample_reviews_en, ...r.sample_reviews_th].slice(0, 4);
  const samples = curatedSamples.length > 0
    ? curatedSamples
    : (r.scraped_reviews ?? [])
        .filter((s) => s.text)
        .slice(0, 4)
        .map((s) => ({
          text: s.text || "",
          rating: s.rating ?? 0,
          author: s.reviewer || "Google reviewer",
        }));

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

  // 이 코스의 지역 페이지가 실제로 발행되는지. 지역 게이트(코스 3개 미만 제외) 때문에
  // 482개 중 135개(28%)의 breadcrumb 가 404 를 가리키고 있었다.
  const districtSlug = r.district ? r.district.toLowerCase().replace(/\s+/g, "-") : "";
  const districtPublished =
    !!r.district &&
    indexableDistricts(db.restaurants, allDistricts(db.district_counts))
      .some((d) => d.district === r.district);

  // /embed/[id] 는 trust >= 50 && rating > 0 인 코스만 발행된다. 조건을 안 보고
  // 링크하면 99개 코스에서 404 로 이어진다.
  const embedPublished = r.trust_score >= 50 && r.rating > 0;

  // 코스 페이지 고유 텍스트 보강 — 색인 거부(Crawled, not indexed)의 직접 원인이었다.
  const summary = buildCourseSummary(r, cohort);

  const similar = db.restaurants
    .filter((other) => other.id !== r.id &&
      (other.district === r.district || r.categories.some((c) => other.categories.includes(c))))
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, 4);

  // Compare-page entries involving this course (if any pre-generated)
  const allPairs = buildComparePairs(db.restaurants);
  const compareLinks = allPairs.filter((p) => p.aId === r.id || p.bId === r.id);

  // Price data from Golfdigg scraper
  const priceMatrix = await loadPriceMatrix();
  const priceRows = toPriceRows(priceMatrix);
  const priceRow = priceRows.find((p) => p.course_id === r.id) ?? null;
  // Booking sources for this course, cheapest known weekday first.
  const offers = offersForCourse(r.id);
  // holes / par / length / designer are 0% populated in master_db; the
  // booking providers publish them, so the header pills finally have data.
  const facts = courseFacts(r.id);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <a href={`/city/${r.city}`} className="hover:text-[var(--fg)]">{r.city_label}</a>
        {r.district && (
          <>
            <span className="mx-2">›</span>
            {districtPublished ? (
              <a href={`/d/${districtSlug}`} className="hover:text-[var(--fg)]">{r.district}</a>
            ) : (
              <span>{r.district}</span>
            )}
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

      {(r.hero_image || r.top_photo_url) && (
        <div className="relative w-full mb-6 rounded-2xl overflow-hidden bg-gray-100" style={{ aspectRatio: "16 / 7" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={r.hero_image || r.top_photo_url}
            alt={r.name}
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute bottom-2 right-2 text-[10px] text-white bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
            {r.hero_image ? "From course's own website" : "From Google Maps"}
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
          {r.is_korean_friendly && (
            <span
              className="bg-rose-50 text-rose-800 px-3 py-1 rounded-full text-sm font-medium"
              title={`Korean signal score: ${r.korean_score?.toFixed(0) ?? "—"} (review topic + 한국 mentions + ko reviewers + Naver blogs)`}
            >
              🇰🇷 Korean-friendly{(r.language_breakdown?.ko ?? 0) > 0 ? ` · ${r.language_breakdown.ko} KO reviews` : ""}
            </span>
          )}
          {(r.holes ?? facts?.holes) && (
            <span className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-sm">
              {r.holes ?? facts?.holes} holes
              {(r.par ?? facts?.par) ? ` · Par ${r.par ?? facts?.par}` : ""}
              {facts?.length_yd ? ` · ${facts.length_yd.toLocaleString()} yd` : ""}
            </span>
          )}
          {facts?.designer && (
            <span className="bg-slate-50 text-slate-800 px-3 py-1 rounded-full text-sm">
              Designed by {facts.designer}
            </span>
          )}
          {r.green_fee_mentions && (
            <span className="bg-amber-50 text-amber-900 px-3 py-1 rounded-full text-sm">
              💰 {r.green_fee_mentions.length > 40 ? r.green_fee_mentions.slice(0, 40) + "…" : r.green_fee_mentions}
            </span>
          )}
          <Freshness generatedAt={db.generated_at} mode="detail" />
          {r.golf_score && (
            <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm" title="Golf difficulty score — lower is more forgiving">
              ⛳ Golf Score {r.golf_score.toFixed(1)}
            </span>
          )}
          {(r.language_breakdown?.ja ?? 0) >= 5 && (
            <span className="bg-red-50 text-red-800 px-3 py-1 rounded-full text-sm" title={`Japanese reviewers: ${r.language_breakdown?.ja}`}>
              🇯🇵 Japanese-popular
            </span>
          )}
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
          {/* Drainage card */}
          {r.drainage_score !== undefined && (() => {
            const status = drainageStatus(r.drainage_score, 0);
            const palette: Record<typeof status, string> = {
              safe:    "bg-emerald-50 border-emerald-200",
              caution: "bg-yellow-50 border-yellow-200",
              danger:  "bg-red-50 border-red-200",
            };
            return (
              <div className={`p-4 rounded-xl border ${palette[status]}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl leading-none">{STATUS_EMOJI[status]}</span>
                    <div>
                      <div className="font-bold text-sm">{STATUS_LABEL[status]}</div>
                      <div className="text-xs text-[var(--muted)] mt-0.5">
                        배수 점수 <span className="font-semibold text-[var(--fg)]">{r.drainage_score}</span>/100
                        {r.drainage_mentions ? ` · 리뷰 ${r.drainage_mentions}건 분석` : " · 리뷰 분석 기반"}
                      </div>
                    </div>
                  </div>
                  <a href="/conditions" className="text-xs text-emerald-700 hover:underline shrink-0 mt-0.5">
                    방콕 전체 현황 →
                  </a>
                </div>
                {r.drainage_keywords && r.drainage_keywords.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="text-[10px] text-[var(--muted)] mr-1 self-center">리뷰 키워드:</span>
                    {r.drainage_keywords.slice(0, 6).map((kw) => (
                      <span key={kw} className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-gray-200 text-[var(--muted)]">
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          <TrustDonut score={r.trust_score} breakdown={breakdown} />

          <RatingChart trend={r.rating_trend} />

          {r.mentioned_topics.length > 0 && (
            <TopicCluster topics={r.mentioned_topics.slice(0, 12)} />
          )}

          <MapEmbed lat={r.lat} lng={r.lng} name={r.name} height={320} />

          {r.photos && r.photos.length > 1 && (
            <section>
              <h2 className="text-lg font-bold mb-3">Photos ({r.photos.length})</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {r.photos.slice(0, 9).map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={src}
                    alt={`${r.name} photo ${i + 1}`}
                    loading="lazy"
                    className="w-full aspect-[4/3] object-cover rounded-lg bg-gray-100"
                  />
                ))}
              </div>
            </section>
          )}

          {r.videos && r.videos.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-3">YouTube reviews</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {r.videos.slice(0, 4).map((v) => (
                  <a
                    key={v.video_id}
                    href={v.url || `https://www.youtube.com/watch?v=${v.video_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white border border-[var(--border)] rounded-lg overflow-hidden hover:border-black transition"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://i.ytimg.com/vi/${v.video_id}/hqdefault.jpg`}
                      alt={v.title || "YouTube video"}
                      loading="lazy"
                      className="w-full aspect-video object-cover bg-gray-100"
                    />
                    <div className="p-3">
                      <div className="text-sm font-medium line-clamp-2">{v.title || v.video_id}</div>
                      <div className="text-xs text-[var(--muted)] mt-1 flex gap-2">
                        {v.channel && <span>{v.channel}</span>}
                        {v.duration && <span>· {v.duration}</span>}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {r.korean_blogs && r.korean_blogs.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-3">한국 블로그 후기</h2>
              <div className="space-y-3">
                {r.korean_blogs.slice(0, 5).map((b, i) => (
                  <a
                    key={i}
                    href={b.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white border border-[var(--border)] rounded-lg p-4 hover:border-black transition"
                  >
                    <div className="font-medium text-sm">{b.title || b.url}</div>
                    {b.body_excerpt && (
                      <p className="text-xs text-[var(--muted)] mt-2 leading-relaxed line-clamp-3">
                        {b.body_excerpt}
                      </p>
                    )}
                    <div className="text-[11px] text-[var(--muted)] mt-2 flex gap-2">
                      {b.blogger && <span>blog.naver.com/{b.blogger}</span>}
                      {b.date && <span>· {b.date}</span>}
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {summary.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-3">What the reviews actually say</h2>
              <div className="space-y-3 text-[15px] leading-relaxed text-[var(--fg)]">
                {summary.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          )}

          <TeeTimePlanner course={r} />

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

          {r.sample_reviews_ko && r.sample_reviews_ko.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-3">한국어 리뷰</h2>
              <div className="space-y-3">
                {r.sample_reviews_ko.slice(0, 4).map((rev, i) => (
                  <blockquote key={i} className="border-l-4 border-rose-400 bg-rose-50/40 px-4 py-3 rounded-r">
                    <p className="text-sm leading-relaxed">{rev.text}</p>
                    <footer className="mt-2 text-xs text-[var(--muted)] flex items-center gap-2">
                      <span className="font-medium">{rev.author || "Google 리뷰어"}</span>
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
              <div className="text-sm">{r.phone || r.website_phone_secondary || "—"}</div>
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
              {(r.website_email || r.website_facebook || r.website_instagram || r.website_line_id) && (
                <div className="mt-3 pt-3 border-t border-[var(--border)] space-y-1.5 text-sm">
                  {r.website_email && (
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--muted)] text-xs">Email</span>
                      <a href={`mailto:${r.website_email}`} className="text-[var(--accent)] hover:underline truncate">
                        {r.website_email}
                      </a>
                    </div>
                  )}
                  {r.website_facebook && (
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--muted)] text-xs">FB</span>
                      <a href={r.website_facebook} target="_blank" rel="noopener noreferrer nofollow" className="text-[var(--accent)] hover:underline truncate">
                        Facebook
                      </a>
                    </div>
                  )}
                  {r.website_instagram && (
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--muted)] text-xs">IG</span>
                      <a href={r.website_instagram} target="_blank" rel="noopener noreferrer nofollow" className="text-[var(--accent)] hover:underline truncate">
                        Instagram
                      </a>
                    </div>
                  )}
                  {r.website_line_id && (
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--muted)] text-xs">LINE</span>
                      <a href={`https://line.me/ti/p/~${r.website_line_id}`} target="_blank" rel="noopener noreferrer nofollow" className="text-[var(--accent)] hover:underline text-sm">
                        @{r.website_line_id}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-4 lg:self-start space-y-4">
          <BookingCompare
            offers={offers}
            courseName={r.name}
            website={r.website}
            phone={r.phone}
          />
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
          <TravelStackAffiliate city={(r.city || "bangkok").toLowerCase().replace(/\s+/g, "_")} cityLabel={r.city_label || r.city} context="course" />
          <AdSlot slot="restaurant-sidebar" />

          {/* Claim listing — backlink magnet + lead funnel into /for-courses */}
          <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-emerald-800 mb-1.5">
              Course operators
            </div>
            <div className="text-sm leading-snug mb-2">
              Manage <span className="font-medium">{r.name}</span>? Claim this listing — free correction + featured options.
            </div>
            <a
              href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "umma@xx.gg"}?subject=${encodeURIComponent(`Claim listing: ${r.name} (${r.id})`)}&body=${encodeURIComponent(`Hi — I represent ${r.name} and would like to claim our listing on Thailand Golf Guide.\n\nCourse URL: https://thailandgolfguide.com/course/${r.id}\nMy role:\nPhone:\n\nPlease let me know next steps.`)}`}
              className="block text-center w-full bg-emerald-700 text-white text-xs font-bold py-2 px-3 rounded-md hover:bg-emerald-800 transition"
            >
              Claim this listing →
            </a>
            {/* rel="nofollow" 필수: /embed/[id] 는 noindex 인데 541개 코스 전부가 여기서
                링크를 쏘고 있었다. 도메인 권위가 0인 상태에서 구글은 "색인하지 말라"고
                시킨 541페이지를 크롤하느라 예산을 태웠고(GSC 'Excluded by noindex' 136건,
                계속 증가 중), 정작 코스 페이지는 색인되지 못했다. robots.txt 의
                Disallow: /embed/ 와 한 쌍으로 동작한다. */}
            {embedPublished && (
              <div className="text-[11px] text-emerald-800 mt-2 leading-tight">
                Or grab the <a href={`/embed/${r.id}`} target="_blank" rel="nofollow noopener" className="underline font-medium">Trust Score badge</a> for your site.
              </div>
            )}
          </div>

          {compareLinks.length > 0 && (
            <div className="bg-white border border-[var(--border)] rounded-xl p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
                Compare with
              </h3>
              <div className="space-y-2">
                {compareLinks.slice(0, 4).map((p) => {
                  const otherId = p.aId === r.id ? p.bId : p.aId;
                  const other = getRestaurantById(db.restaurants, otherId);
                  if (!other) return null;
                  return (
                    <a
                      key={p.slug}
                      href={`/compare/${p.slug}`}
                      className="block text-sm hover:text-[var(--accent)] transition group"
                    >
                      <span className="text-[var(--muted)]">vs</span>{" "}
                      <span className="font-medium group-hover:underline">{other.name}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

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

      {/* Sticky mobile action bar — visible only on mobile, fixed bottom */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-sm border-t border-[var(--border)] px-3 py-2 flex gap-2 shadow-[0_-4px_12px_-4px_rgba(0,0,0,0.08)]">
        <a
          href={r.maps_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-black text-white text-sm font-bold text-center py-3 rounded-lg active:scale-[0.98] transition"
        >
          📍 Maps
        </a>
        {r.phone && (
          <a
            href={`tel:${r.phone.replace(/[^+\d]/g, "")}`}
            className="flex-1 bg-emerald-600 text-white text-sm font-bold text-center py-3 rounded-lg active:scale-[0.98] transition"
            aria-label={`Call ${r.phone}`}
          >
            📞 Call
          </a>
        )}
        {r.website && (
          <a
            href={r.website}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="flex-1 bg-white border-2 border-black text-sm font-bold text-center py-3 rounded-lg active:scale-[0.98] transition"
            aria-label="Course website"
          >
            🌐 Book
          </a>
        )}
        {r.website_line_id && (
          <a
            href={`https://line.me/ti/p/~${r.website_line_id}`}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="flex-1 bg-[#06C755] text-white text-sm font-bold text-center py-3 rounded-lg active:scale-[0.98] transition"
            aria-label="LINE"
          >
            LINE
          </a>
        )}
      </div>
      {/* Mobile bottom spacer so sticky CTA doesn't cover footer/content */}
      <div className="md:hidden h-16" aria-hidden />

      <RestaurantJsonLd r={r} />
      {priceRow && <CoursePriceJsonLd r={r} priceRow={priceRow} />}
      <CourseVideosJsonLd r={r} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: r.city_label, url: `/city/${r.city}` },
        ...(districtPublished ? [{ name: r.district!, url: `/d/${districtSlug}` }] : []),
        { name: r.name, url: `/course/${r.id}` },
      ]} />
      <FaqJsonLd faqs={[
        {
          q: `How much is the green fee at ${r.name}?`,
          a: r.green_fee_mentions
            ? `Based on recent reviews: ${r.green_fee_mentions}. Green fees vary by season, day of week, and booking channel — contact the course directly or check a golf agency (Golfsavers, Sawasdee Golf) for current rates.`
            : `Green fees at ${r.name} vary by season and day of week. Contact the course directly or use a golf booking agency (Golfsavers, GolfAsian) to get current prices and bundle with caddy and cart.`,
        },
        {
          q: `Does ${r.name} require a caddy?`,
          a: `Yes — like most Thai golf courses, ${r.name} requires golfers to use a caddy. Caddy fee is typically ฿400 (paid at the clubhouse on arrival), with a tip of ฿400–600 given directly to the caddy after the round.${r.is_korean_friendly ? " Korean-speaking caddies are available — request one when booking." : r.is_english_friendly ? " English-speaking caddies are available at this course." : ""}`,
        },
        {
          q: `How do I book a tee time at ${r.name}?`,
          a: `Book directly via the course website or phone, or use a golf agency (Golfsavers, Sawasdee Golf, GolfAsian) for a bundled booking with airport transfer and caddy coordination. Weekend tee times fill up 1–2 weeks ahead in peak season (November–February) — book early.`,
        },
        {
          q: `What is the dress code at ${r.name}?`,
          a: `Most Thai golf courses, including ${r.name}, require a collared shirt (polo), slacks or golf shorts. Jeans, sleeveless tops, and sandals are generally not permitted. Soft spikes or spikeless golf shoes are required on the course.`,
        },
      ]} />
    </div>
  );
}
