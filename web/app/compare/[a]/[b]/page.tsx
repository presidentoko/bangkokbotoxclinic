import { notFound } from "next/navigation";
import { loadMasterDb, getClinicById } from "@/lib/data";
import { CATEGORY_LABELS, TOPIC_LABELS, type Clinic } from "@/lib/types";
import { CategoryIcon } from "@/components/CategoryIcon";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { getSiteUrl, safeEncodeURIComponent , getSiteConfig} from "@/lib/site";
import type { Metadata } from "next";

// 모든 클리닉 × 모든 클리닉 = N² 조합이라 프리렌더 불가.
// force-static(온디맨드 캐시)이었을 땐 봇이 두드리는 조합마다 ISR write가
// 쌓여 Hobby 200K/월 한도를 갉아먹음 (2026-07-11 감사) → force-dynamic으로
// 전환: 캐시를 아예 안 쓰므로 write 0, 트래픽 낮은 페이지라 CPU 부담 미미.
export const dynamic = "force-dynamic";

// master_db place_id 컨벤션(`0xA_0xB`, lib/data.ts). 이 형태가 아니면
// 실존 클리닉일 수 없으니 loadMasterDb 호출 전에 즉시 404 — 스캐너가
// /compare/wp-login.php/foo 류를 두드릴 때 CPU/origin transfer 낭비 방지.
const CLINIC_ID_RE = /^0x[0-9a-f]+_0x[0-9a-f]+$/i;

export async function generateMetadata(
  { params }: { params: Promise<{ a: string; b: string }> }
): Promise<Metadata> {
  const { a, b } = await params;
  if (!CLINIC_ID_RE.test(a) || !CLINIC_ID_RE.test(b)) return { title: "Compare clinics" };
  const db = await loadMasterDb();
  const ca = getClinicById(db.clinics, a);
  const cb = getClinicById(db.clinics, b);
  if (!ca || !cb) return { title: "Compare clinics" };
  const winner = ca.trust_score > cb.trust_score ? ca.name : ca.trust_score < cb.trust_score ? cb.name : null;
  const title = `${ca.name} vs ${cb.name} — Which Bangkok Clinic Wins?`;
  const description = winner
    ? `${ca.name} (Trust ${ca.trust_score.toFixed(0)}) vs ${cb.name} (Trust ${cb.trust_score.toFixed(0)}). ${winner} leads in Trust Score. Independent review analysis.`
    : `${ca.name} vs ${cb.name} — Trust ${ca.trust_score.toFixed(0)} vs ${cb.trust_score.toFixed(0)}. Tied! Side-by-side review analysis to help you decide.`;
  const SITE = getSiteUrl();
  const ogImage = `${SITE}/api/og?type=compare&a=${safeEncodeURIComponent(ca.name.slice(0, 40))}&b=${safeEncodeURIComponent(cb.name.slice(0, 40))}&ta=${Math.round(ca.trust_score)}&tb=${Math.round(cb.trust_score)}`;
  return {
    title,
    description,
    alternates: { canonical: `/compare/${a}/${b}` },
    // 색인 대상이 아니다 — 클리닉 조합마다 페이지가 생겨 얇은 중복이 대량 발생한다.
    // 2026-08-08 GSC "Indexed, though blocked by robots.txt" 대응: robots.txt 로
    // 막는 대신 크롤은 허용하고 여기서 noindex 를 준다. 그래야 구글이 실제로
    // noindex 를 읽고 색인에서 빼준다. follow 는 유지 — 링크된 클리닉 페이지로
    // 링크 가치가 흐르게 둔다.
    robots: { index: false, follow: true },
    openGraph: {
      // 2026-09-02: 페이지가 openGraph 를 정의하면 루트의 siteName 이 사라진다.
      siteName: getSiteConfig().brand,
      title,
      description,
      url: `/compare/${a}/${b}`,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${ca.name} vs ${cb.name}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function ComparePage(
  { params }: { params: Promise<{ a: string; b: string }> }
) {
  const { a, b } = await params;
  if (!CLINIC_ID_RE.test(a) || !CLINIC_ID_RE.test(b)) notFound();
  const db = await loadMasterDb();
  const ca = getClinicById(db.clinics, a);
  const cb = getClinicById(db.clinics, b);
  if (!ca || !cb) notFound();

  // "More comparisons" — 같은 카테고리 상위 클리닉 중 현재 두 클리닉 제외한 페어링
  const sharedCats = ca.categories.filter((c) => cb.categories.includes(c));
  const pool = db.clinics
    .filter((c) => c.id !== ca.id && c.id !== cb.id && sharedCats.some((cat) => c.categories.includes(cat)))
    .sort((x, y) => y.trust_score - x.trust_score)
    .slice(0, 6);
  // 페어링: (ca vs pool[0]), (cb vs pool[1]), (pool[0] vs pool[2]), (pool[1] vs pool[3])
  const morePairs: { x: typeof ca; y: typeof ca }[] = [];
  if (pool[0]) morePairs.push({ x: ca, y: pool[0] });
  if (pool[1]) morePairs.push({ x: cb, y: pool[1] });
  if (pool[0] && pool[2]) morePairs.push({ x: pool[0], y: pool[2] });
  if (pool[1] && pool[3]) morePairs.push({ x: pool[1], y: pool[3] });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Compare</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
        {ca.name} <span className="text-[var(--muted)] font-normal text-2xl">vs</span> {cb.name}
      </h1>
      <p className="text-[var(--muted)] mb-8">
        Independent side-by-side analysis from public Google review data.
      </p>

      {/* Trust Score visual bars — grid-cols-1 sm:grid-cols-2: TrustVisual의
          text-5xl 점수 + uppercase 라벨 flex row가 360px 폭의 반쪽(약 104px)
          안에서 최소 콘텐츠 폭(142px)보다 좁아 카드 밖으로 넘쳤음 (2026-07-28
          감사). 이 페이지의 다른 그리드는 전부 이 패턴을 이미 쓰고 있었음. */}
      <Section title="Trust Score">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <TrustVisual clinic={ca} winner={ca.trust_score > cb.trust_score} />
          <TrustVisual clinic={cb} winner={cb.trust_score > ca.trust_score} />
        </div>
      </Section>

      {/* Quick stats grid — StatRow 자체가 label/a/vs/b 4-분할을 한 줄에
          이미 보여주므로, 바깥을 grid-cols-2로 또 쪼개면 모바일에서 그
          4분할이 반쪽 폭에 눌려 라벨/이름이 다 잘림 (2026-07-17 감사). */}
      <Section title="Quick stats">
        <div className="grid grid-cols-1 gap-y-2">
          <StatRow label="Google rating" a={`★ ${ca.rating.toFixed(1)}`} b={`★ ${cb.rating.toFixed(1)}`} winner={cmp(ca.rating, cb.rating)} />
          <StatRow label="Total reviews" a={ca.total_reviews.toLocaleString()} b={cb.total_reviews.toLocaleString()} winner={cmp(ca.total_reviews, cb.total_reviews)} />
          <StatRow label="District" a={ca.district || "—"} b={cb.district || "—"} />
          <StatRow label="Quality trend" a={trendLabel(ca.rating_trend.trend)} b={trendLabel(cb.rating_trend.trend)} />
          <StatRow label="Local Guide reviews" a={ca.local_guide_count.toString()} b={cb.local_guide_count.toString()} winner={cmp(ca.local_guide_count, cb.local_guide_count)} />
          <StatRow label="Avg reviewer credibility" a={ca.avg_author_review_count.toFixed(0)} b={cb.avg_author_review_count.toFixed(0)} winner={cmp(ca.avg_author_review_count, cb.avg_author_review_count)} />
          <StatRow label="Status" a={ca.business_status || "—"} b={cb.business_status || "—"} />
          <StatRow label="Phone" a={ca.phone ? "✓ listed" : "—"} b={cb.phone ? "✓ listed" : "—"} />
        </div>
      </Section>

      {/* Service strength comparison */}
      <Section title="Service strength (mention count)">
        <ServiceComparison ca={ca} cb={cb} />
      </Section>

      {/* Language breakdown */}
      <Section title="Reviewer languages">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <LangBreakdown clinic={ca} />
          <LangBreakdown clinic={cb} />
        </div>
      </Section>

      {/* Top doctor comparison */}
      {(ca.doctor_stats?.length || cb.doctor_stats?.length) && (
        <Section title="Top mentioned doctor">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <DoctorCard clinic={ca} />
            <DoctorCard clinic={cb} />
          </div>
        </Section>
      )}

      {/* Highlight topics */}
      <Section title="What reviewers say">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <TopicList clinic={ca} />
          <TopicList clinic={cb} />
        </div>
      </Section>

      {/* Sample reviews */}
      <Section title="Sample reviews">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <SampleReview clinic={ca} />
          <SampleReview clinic={cb} />
        </div>
      </Section>

      {/* CTAs */}
      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        <div>
          <h3 className="text-sm font-semibold mb-2">{ca.name}</h3>
          <a
            href={`/clinic/${ca.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-lg font-bold py-2.5 px-4 text-sm text-white hover:opacity-90 transition"
            style={{ background: "var(--accent)" }}
          >
            Book Consultation →
          </a>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-2">{cb.name}</h3>
          <a
            href={`/clinic/${cb.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-lg font-bold py-2.5 px-4 text-sm text-white hover:opacity-90 transition"
            style={{ background: "var(--accent)" }}
          >
            Book Consultation →
          </a>
        </div>
      </div>

      <div className="text-xs text-[var(--muted)] border-t border-[var(--border)] pt-4 space-y-1">
        <p>↗ This is an independent comparison — neither clinic has paid for placement here.</p>
        <p>📊 Data sources: Google reviews (Google Maps), Trust Score = our internal algorithm weighing review credibility, recency, language diversity, and Local Guide signals.</p>
      </div>

      {morePairs.length > 0 && (
        <section className="mt-10 pt-8 border-t border-[var(--border)]">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--muted)] mb-4">More comparisons to explore</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {morePairs.map(({ x, y }) => (
              <a
                key={`${x.id}-${y.id}`}
                href={`/compare/${x.id}/${y.id}`}
                rel="nofollow"
                className="group flex items-start gap-3 p-4 rounded-xl border border-[var(--border)] bg-white hover:border-[var(--accent)] transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">Trust {x.trust_score.toFixed(0)}</span>
                    <span className="text-xs text-[var(--muted)] font-medium truncate">{x.name}</span>
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-1 text-center">vs</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">Trust {y.trust_score.toFixed(0)}</span>
                    <span className="text-xs text-[var(--muted)] font-medium truncate">{y.name}</span>
                  </div>
                </div>
                <span className="text-[var(--muted)] group-hover:text-[var(--accent)] transition shrink-0 text-lg">→</span>
              </a>
            ))}
          </div>
        </section>
      )}

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Compare", url: "/" },
        { name: `${ca.name} vs ${cb.name}`, url: `/compare/${a}/${b}` },
      ]} />
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────

function cmp(a: number, b: number): "a" | "b" | "tie" {
  if (a > b) return "a";
  if (a < b) return "b";
  return "tie";
}

function trendLabel(t: string): string {
  if (t === "improving") return "↗ Improving";
  if (t === "declining") return "↘ Declining";
  if (t === "stable") return "→ Stable";
  return "—";
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xs uppercase tracking-widest text-[var(--muted)] font-bold mb-3">{title}</h2>
      {children}
    </section>
  );
}

function StatRow({ label, a, b, winner }: { label: string; a: string; b: string; winner?: "a" | "b" | "tie" }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-[var(--border)] pb-2">
      <span className="text-xs text-[var(--muted)] flex-1 min-w-0 truncate">{label}</span>
      <span className={`text-sm font-medium tabular-nums ${winner === "a" ? "text-green-700" : ""}`}>{a}{winner === "a" && <span className="ml-1 text-xs">✓</span>}</span>
      <span className="text-[var(--muted)] text-xs">vs</span>
      <span className={`text-sm font-medium tabular-nums ${winner === "b" ? "text-green-700" : ""}`}>{b}{winner === "b" && <span className="ml-1 text-xs">✓</span>}</span>
    </div>
  );
}

function TrustVisual({ clinic, winner }: { clinic: Clinic; winner: boolean }) {
  const color = clinic.trust_score >= 80 ? "#059669" : clinic.trust_score >= 65 ? "#2563eb" : "#d97706";
  return (
    <a href={`/clinic/${clinic.id}`} className={`block bg-white rounded-2xl p-6 border-2 transition hover:shadow-lg ${winner ? "border-green-400" : "border-[var(--border)]"}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-lg truncate">{clinic.name}</h3>
          <p className="text-xs text-[var(--muted)] truncate mt-0.5">{clinic.district || "—"} · {clinic.primary_type}</p>
        </div>
        {winner && <span className="text-[10px] uppercase tracking-widest font-black text-green-700 ml-2">Winner</span>}
      </div>
      <div className="flex items-baseline gap-3 mb-3">
        <span className="text-5xl font-black tabular-nums" style={{ color }}>{clinic.trust_score}</span>
        <span className="text-sm font-semibold uppercase tracking-wider" style={{ color }}>
          {clinic.trust_score >= 80 ? "Excellent" : clinic.trust_score >= 65 ? "Strong" : "Good"}
        </span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(clinic.trust_score, 100)}%`, background: color }} />
      </div>
      <div className="mt-3 text-xs text-[var(--muted)]">
        Based on {clinic.scraped_review_count.toLocaleString()} analyzed reviews
      </div>
    </a>
  );
}

function ServiceComparison({ ca, cb }: { ca: Clinic; cb: Clinic }) {
  // Get union of services with mentions > 0 across both
  const allServices = new Set<string>([
    ...Object.keys(ca.service_mentions).filter((k) => ca.service_mentions[k] > 0),
    ...Object.keys(cb.service_mentions).filter((k) => cb.service_mentions[k] > 0),
  ]);
  const sorted = [...allServices]
    .map((s) => ({ service: s, a: ca.service_mentions[s] ?? 0, b: cb.service_mentions[s] ?? 0 }))
    .sort((x, y) => (y.a + y.b) - (x.a + x.b))
    .slice(0, 8);

  if (sorted.length === 0) return <p className="text-sm text-[var(--muted)]">No service mentions detected in reviews.</p>;
  const maxVal = Math.max(...sorted.map((s) => Math.max(s.a, s.b)), 1);

  return (
    <div className="space-y-3">
      {sorted.map(({ service, a, b }) => (
        <div key={service} className="flex items-center gap-3 text-sm">
          <div className="w-24 shrink-0 flex items-center gap-1.5">
            <CategoryIcon category={service} size={14} />
            <span className="font-medium truncate">{CATEGORY_LABELS[service] ?? service}</span>
          </div>
          <div className="flex-1 flex items-center gap-2">
            <span className={`tabular-nums text-xs w-10 text-right ${a >= b ? "font-bold text-green-700" : "text-[var(--muted)]"}`}>{a}</span>
            <div className="flex-1 flex items-center gap-1">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden flex justify-end">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(a / maxVal) * 100}%` }} />
              </div>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(b / maxVal) * 100}%` }} />
              </div>
            </div>
            <span className={`tabular-nums text-xs w-10 ${b >= a ? "font-bold text-blue-700" : "text-[var(--muted)]"}`}>{b}</span>
          </div>
        </div>
      ))}
      <div className="flex items-center justify-center gap-4 text-[10px] uppercase tracking-widest text-[var(--muted)] mt-2">
        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500" /> {ca.name.slice(0, 20)}</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500" /> {cb.name.slice(0, 20)}</span>
      </div>
    </div>
  );
}

function LangBreakdown({ clinic }: { clinic: Clinic }) {
  const l = clinic.language_breakdown;
  const total = l.en + l.th + l.ko + l.ja + l.other;
  if (total === 0) return <p className="text-sm text-[var(--muted)]">No language data.</p>;
  const segments = [
    { label: "EN", value: l.en, color: "#3b82f6" },
    { label: "TH", value: l.th, color: "#ef4444" },
    { label: "KO", value: l.ko, color: "#8b5cf6" },
    { label: "JA", value: l.ja, color: "#10b981" },
    { label: "Other", value: l.other, color: "#9ca3af" },
  ].filter((s) => s.value > 0);

  return (
    <div>
      <h4 className="text-sm font-semibold mb-2 truncate">{clinic.name}</h4>
      <div className="h-3 rounded-full overflow-hidden flex bg-gray-100">
        {segments.map((s) => (
          <div key={s.label} style={{ width: `${(s.value / total) * 100}%`, background: s.color }} title={`${s.label} ${s.value}`} />
        ))}
      </div>
      <div className="flex flex-wrap gap-3 mt-2 text-xs">
        {segments.map((s) => (
          <span key={s.label} className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
            <span className="text-[var(--muted)]">{s.label}</span>
            <span className="font-bold tabular-nums">{Math.round((s.value / total) * 100)}%</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function DoctorCard({ clinic }: { clinic: Clinic }) {
  const top = clinic.doctor_stats && clinic.doctor_stats.length > 0
    ? [...clinic.doctor_stats].sort((a, b) => b.mentions - a.mentions)[0]
    : null;
  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-4">
      <p className="text-xs text-[var(--muted)] mb-1 truncate">{clinic.name}</p>
      {top ? (
        <>
          <p className="font-bold text-base mb-1">{top.name}</p>
          <div className="flex items-center gap-2 text-xs text-[var(--muted)] flex-wrap">
            <span className="tabular-nums">{top.mentions} mentions</span>
            <span>·</span>
            <span>★ {top.rating_avg.toFixed(1)}</span>
            {top.primary_lang && top.primary_lang !== "en" && (
              <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">{top.primary_lang}</span>
            )}
          </div>
        </>
      ) : (
        <p className="text-sm text-[var(--muted)]">No doctor-specific data.</p>
      )}
    </div>
  );
}

function TopicList({ clinic }: { clinic: Clinic }) {
  const POSITIVE = ["english_speaking", "korean_doctor", "genuine_brand", "clean_facility", "professional", "friendly_staff", "no_pain", "results_satisfied", "premium", "affordable", "recommend"];
  const topics = clinic.mentioned_topics.filter((t) => POSITIVE.includes(t.topic)).sort((a, b) => b.count - a.count).slice(0, 6);
  return (
    <div>
      <h4 className="text-sm font-semibold mb-2 truncate">{clinic.name}</h4>
      {topics.length === 0 && <p className="text-sm text-[var(--muted)]">No specific topics detected.</p>}
      <div className="flex flex-wrap gap-1.5">
        {topics.map((t) => (
          <span key={t.topic} className="bg-emerald-50 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1">
            {TOPIC_LABELS[t.topic] ?? t.topic}
            <span className="text-emerald-600 text-[10px] tabular-nums">×{t.count}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function SampleReview({ clinic }: { clinic: Clinic }) {
  // Pick best positive review (rating 5, longest text, English preferred)
  const all = [
    ...(clinic.sample_reviews_en ?? []),
    ...(clinic.sample_reviews_ko ?? []),
    ...(clinic.sample_reviews_th ?? []),
  ];
  const positive = all.filter((r) => r.rating >= 4 && r.text.length > 30).sort((a, b) => b.text.length - a.text.length)[0];
  if (!positive) return <p className="text-sm text-[var(--muted)]">No reviews available.</p>;
  return (
    <div>
      <h4 className="text-sm font-semibold mb-2 truncate">{clinic.name}</h4>
      <blockquote className="bg-amber-50 border-l-4 border-amber-300 rounded-r-lg p-3 text-sm italic text-gray-700 leading-relaxed">
        &ldquo;{positive.text.slice(0, 200)}{positive.text.length > 200 ? "..." : ""}&rdquo;
        <footer className="not-italic text-xs text-[var(--muted)] mt-2">— {positive.author || "Anonymous"}, {"★".repeat(positive.rating)}</footer>
      </blockquote>
    </div>
  );
}
