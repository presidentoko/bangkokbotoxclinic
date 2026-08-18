import { notFound } from "next/navigation";
import { loadMasterDb, getRestaurantById } from "@/lib/data";
import { buildComparePairs } from "@/lib/comparePairs";
import { CATEGORY_LABELS } from "@/lib/types";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
import { TravelStackAffiliate } from "@/components/TravelStackAffiliate";
import { AdSlot } from "@/components/AffiliateSlot";
import type { Metadata } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.thailandgolfguide.com";

export async function generateStaticParams() {
  const db = await loadMasterDb();
  return buildComparePairs(db.restaurants).map((p) => ({ slug: p.slug }));
}

// buildComparePairs 가 고정 집합을 만든다 — sitemap 도 같은 함수를 쓴다.
// 그 외 슬러그는 봇/스캐너 probe. false = 즉시 404, ISR write 없음.
export const dynamicParams = false;

async function getPair(slug: string) {
  const db = await loadMasterDb();
  const pair = buildComparePairs(db.restaurants).find((p) => p.slug === slug);
  if (!pair) return null;
  const a = getRestaurantById(db.restaurants, pair.aId);
  const b = getRestaurantById(db.restaurants, pair.bId);
  if (!a || !b) return null;
  return { pair, a, b };
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPair(slug);
  if (!data) return { title: "Comparison not found" };
  const { a, b, pair } = data;
  return {
    title: `${a.name} vs ${b.name} — Side-by-side Comparison`,
    description: `${a.name} vs ${b.name}: Trust Score, ratings, reviews, holes, par, location. Both ${pair.cityLabel} golf courses compared with real Google review data.`,
    alternates: { canonical: `/compare/${slug}` },
    openGraph: {
      type: "article",
      title: `${a.name} vs ${b.name}`,
      description: `Side-by-side comparison of two ${pair.cityLabel} golf courses — Trust Score, ★, reviews, holes, par.`,
    },
  };
}

export default async function ComparePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const data = await getPair(slug);
  if (!data) notFound();
  const { a, b, pair } = data;

  // Computed "winner" markers per metric
  const trustWinner = a.trust_score === b.trust_score ? "tie" : (a.trust_score > b.trust_score ? "a" : "b");
  const ratingWinner = a.rating === b.rating ? "tie" : (a.rating > b.rating ? "a" : "b");
  const reviewsWinner = a.total_reviews === b.total_reviews ? "tie" : (a.total_reviews > b.total_reviews ? "a" : "b");
  const koWinner =
    (a.korean_score ?? 0) === (b.korean_score ?? 0) ? "tie" :
    (a.korean_score ?? 0) > (b.korean_score ?? 0) ? "a" : "b";

  const faqs = [
    {
      q: `Which is better, ${a.name} or ${b.name}?`,
      a: `Both are top ${pair.cityLabel} courses. ${trustWinner === "a" ? a.name : trustWinner === "b" ? b.name : "Neither"} has the higher overall Trust Score (${a.trust_score.toFixed(0)} vs ${b.trust_score.toFixed(0)}). Korean-friendly signal score is ${(a.korean_score ?? 0).toFixed(0)} for ${a.name} and ${(b.korean_score ?? 0).toFixed(0)} for ${b.name}. Pick by what matters to you — both are solid choices.`,
    },
    {
      q: `Which course is more popular with Korean golfers?`,
      a: `${a.is_korean_friendly ? a.name + " is flagged Korean-friendly" : a.name + " is not (yet) Korean-friendly verified"}; ${b.is_korean_friendly ? b.name + " is flagged Korean-friendly" : b.name + " is not (yet) Korean-friendly verified"}. ${koWinner === "a" ? a.name : koWinner === "b" ? b.name : "Both"} score higher on combined Korean signals (reviewer volume + caddy mentions + Naver blog matches).`,
    },
    {
      q: `Can I book a single trip and play both ${a.name} and ${b.name}?`,
      a: `Yes — both are in ${pair.cityLabel}, typically a 30-60 minute drive apart. Standard 3-night Thailand golf packages from agencies like Golfsavers and Sawasdee bundle 2-3 courses in this region. Tee time spacing of at least 1 day between rounds is recommended.`,
    },
    {
      q: `Trust Scores and ratings — what's the actual difference?`,
      a: `Trust Score (0-100) combines Google rating + review volume (log-scaled) + reviewer authority. It's our composite metric — see /methodology for the exact formula. A 92 Trust Score with 1,500 reviews is more dependable than a 95 with 30 reviews, even though the second course has the higher star rating.`,
    },
    {
      q: `What is the green fee at ${a.name} vs ${b.name}?`,
      a: `Green fees vary by day of week, season, and booking channel. As a rough guide, ${pair.cityLabel} courses typically range ฿1,500–4,500 (weekday morning, all-in with caddy and cart). Peak season (Nov–Feb) and weekends add 20–40%. Book direct through the course website for the lowest rate, or use Golfsavers / Klook for convenience. Check the individual course pages for current Golfdigg pricing where available.`,
    },
    {
      q: `Which is a better choice during Thailand's rainy season (June–October)?`,
      a: `Both ${a.name} and ${b.name} operate year-round. During the rainy season, morning tee times (07:00–11:00) are typically clear — rain concentrates in the afternoon. Courses with higher drainage scores handle heavy rain better. Check our real-time drainage conditions page at /conditions for current status before booking.`,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <a href={`/city/${pair.city}`} className="hover:text-[var(--fg)]">{pair.cityLabel}</a>
        <span className="mx-2">›</span>
        <span>Compare</span>
      </nav>

      <header className="mb-8">
        <div className="text-xs uppercase tracking-widest text-emerald-700 font-bold mb-2">
          {pair.cityLabel} · Head-to-head
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3 text-balance leading-[1.05]">
          {a.name} <span className="text-[var(--muted)] font-light">vs</span> {b.name}
        </h1>
        <p className="text-base text-[var(--muted)] leading-relaxed">
          Side-by-side comparison from real Google review data — Trust Score, rating, reviews, holes, par, language support, Korean tourist popularity. No editorial bias, no paid placement.
        </p>
      </header>

      {/* Top scorecard — 2-col side by side */}
      <section className="grid grid-cols-2 gap-3 md:gap-5 mb-8">
        <CourseScorecard course={a} winner={trustWinner === "a"} />
        <CourseScorecard course={b} winner={trustWinner === "b"} />
      </section>

      {/* Metric-by-metric comparison table */}
      <section className="mb-8 bg-white border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[480px]">
          <thead className="bg-gray-50">
            <tr className="border-b border-[var(--border)]">
              <th className="text-left text-xs uppercase tracking-wide text-[var(--muted)] px-4 py-3 w-1/4">Metric</th>
              <th className="text-left px-4 py-3 font-bold">{a.name}</th>
              <th className="text-left px-4 py-3 font-bold">{b.name}</th>
            </tr>
          </thead>
          <tbody>
            <Row label="Trust Score" winner={trustWinner} a={a.trust_score.toFixed(0)} b={b.trust_score.toFixed(0)} suffix="/100" />
            <Row label="Google rating" winner={ratingWinner} a={`★ ${a.rating.toFixed(1)}`} b={`★ ${b.rating.toFixed(1)}`} />
            <Row label="Review count" winner={reviewsWinner} a={a.total_reviews.toLocaleString()} b={b.total_reviews.toLocaleString()} />
            <Row label="Holes" a={a.holes ? `${a.holes}` : "—"} b={b.holes ? `${b.holes}` : "—"} />
            <Row label="Par" a={a.par ? `${a.par}` : "—"} b={b.par ? `${b.par}` : "—"} />
            <Row
              label="Korean-friendly"
              winner={koWinner}
              a={a.is_korean_friendly ? `🇰🇷 ${(a.korean_score ?? 0).toFixed(0)}` : "—"}
              b={b.is_korean_friendly ? `🇰🇷 ${(b.korean_score ?? 0).toFixed(0)}` : "—"}
            />
            <Row label="Korean reviews" a={String(a.language_breakdown?.ko ?? 0)} b={String(b.language_breakdown?.ko ?? 0)} />
            <Row label="District" a={a.district || a.city_label || "—"} b={b.district || b.city_label || "—"} />
            <Row label="Category" a={a.categories.map(c => CATEGORY_LABELS[c] ?? c).join(", ") || "—"} b={b.categories.map(c => CATEGORY_LABELS[c] ?? c).join(", ") || "—"} />
            <Row label="Website" a={a.website ? new URL(a.website).hostname.replace(/^www\./, "") : "—"} b={b.website ? new URL(b.website).hostname.replace(/^www\./, "") : "—"} />
          </tbody>
        </table>
        </div>
      </section>

      <TravelStackAffiliate city={pair.city} cityLabel={pair.cityLabel} context="city" />

      {/* Topics & strengths */}
      <section className="mb-8 grid md:grid-cols-2 gap-5">
        <TopicsBox course={a} />
        <TopicsBox course={b} />
      </section>

      <AdSlot slot="compare-mid" />

      {/* CTA row */}
      <section className="grid sm:grid-cols-2 gap-3 mb-10">
        <a
          href={`/course/${a.id}`}
          className="block p-5 bg-emerald-50 border-2 border-emerald-200 rounded-xl hover:border-emerald-400 transition"
        >
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">View full detail →</div>
          <div className="font-bold text-base leading-tight">{a.name}</div>
          <div className="text-xs text-[var(--muted)] mt-1">Photos, reviews, videos, map, contact info</div>
        </a>
        <a
          href={`/course/${b.id}`}
          className="block p-5 bg-emerald-50 border-2 border-emerald-200 rounded-xl hover:border-emerald-400 transition"
        >
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">View full detail →</div>
          <div className="font-bold text-base leading-tight">{b.name}</div>
          <div className="text-xs text-[var(--muted)] mt-1">Photos, reviews, videos, map, contact info</div>
        </a>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Frequently asked</h2>
        <div className="space-y-3">
          {faqs.map((f, i) => (
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

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: pair.cityLabel, url: `/city/${pair.city}` },
        { name: `${a.name} vs ${b.name}`, url: `/compare/${slug}` },
      ]} />
      <FaqJsonLd faqs={faqs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `${a.name} vs ${b.name}`,
            itemListElement: [a, b].map((c, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: c.name,
              url: `${SITE}/course/${c.id}`,
            })),
          }),
        }}
      />
    </div>
  );
}

function CourseScorecard({ course, winner }: { course: import("@/lib/types").Course; winner: boolean }) {
  const trustColor =
    course.trust_score >= 75 ? "#16a34a" :
    course.trust_score >= 60 ? "#059669" : "#ca8a04";
  return (
    <a
      href={`/course/${course.id}`}
      className={`block p-4 md:p-6 rounded-2xl border-2 ${winner ? "border-emerald-400 bg-emerald-50/40" : "border-[var(--border)] bg-white"} hover:shadow-md transition`}
    >
      {winner && (
        <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 mb-2">
          ✓ Higher Trust Score
        </div>
      )}
      <div className="font-bold text-base md:text-lg leading-tight mb-2 truncate">{course.name}</div>
      <div className="text-xs text-[var(--muted)] mb-3 truncate">
        📍 {course.district || course.city_label}
      </div>
      <div className="flex items-baseline gap-3">
        <div
          className="text-3xl md:text-4xl font-black tabular-nums"
          style={{ color: trustColor }}
        >
          {course.trust_score.toFixed(0)}
        </div>
        <div className="text-xs text-[var(--muted)]">Trust</div>
      </div>
      <div className="flex items-baseline gap-2 mt-2 text-sm">
        <span className="text-yellow-700 font-bold">★ {course.rating.toFixed(1)}</span>
        <span className="text-[var(--muted)] text-xs">({course.total_reviews.toLocaleString()} reviews)</span>
      </div>
      {course.is_korean_friendly && (
        <div className="mt-2 text-xs text-rose-700 font-medium">🇰🇷 Korean-friendly verified</div>
      )}
    </a>
  );
}

function Row({ label, winner, a, b, suffix }: {
  label: string;
  winner?: "a" | "b" | "tie";
  a: string;
  b: string;
  suffix?: string;
}) {
  const cellBase = "px-4 py-2.5";
  const win = (side: "a" | "b") =>
    winner === side ? "font-bold text-emerald-800" : "";
  return (
    <tr className="border-b border-[var(--border)] last:border-0">
      <td className={`${cellBase} text-xs text-[var(--muted)] uppercase tracking-wide`}>{label}</td>
      <td className={`${cellBase} ${win("a")}`}>{a}{suffix && winner === "a" ? suffix : ""}</td>
      <td className={`${cellBase} ${win("b")}`}>{b}{suffix && winner === "b" ? suffix : ""}</td>
    </tr>
  );
}

function TopicsBox({ course }: { course: import("@/lib/types").Course }) {
  const topics = (course.mentioned_topics || []).slice(0, 6);
  if (topics.length === 0) {
    return (
      <div className="bg-white border border-[var(--border)] rounded-xl p-5">
        <div className="font-bold mb-2 truncate">{course.name}</div>
        <p className="text-sm text-[var(--muted)]">No extracted topics yet — small reviewer base.</p>
      </div>
    );
  }
  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-5">
      <div className="font-bold mb-3 truncate">{course.name} — what reviewers say</div>
      <div className="flex flex-wrap gap-2">
        {topics.map((t) => (
          <span
            key={t.topic}
            className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-medium"
            title={`${t.count} reviewer mentions`}
          >
            {t.topic.replace(/_/g, " ")} · {t.count}
          </span>
        ))}
      </div>
    </div>
  );
}
