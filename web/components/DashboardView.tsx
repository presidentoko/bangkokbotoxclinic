// B2B clinic dashboard view component — shared by /dashboard/[id] + /dashboard/demo.
// 표시 메트릭: Trust Score 분해, district 내 같은 카테고리 competitors top 5,
// rating trend, review 토픽, 샘플 리뷰, lead inflow placeholder.

import type { Clinic } from "@/lib/types";
import { CATEGORY_LABELS, TOPIC_LABELS } from "@/lib/types";

type Props = {
  clinic: Clinic;
  competitors: Clinic[];
  cityAvgRating: number | null;
  cityClinicCount: number;
  isDemo?: boolean;
};

export function DashboardView({ clinic: c, competitors, cityAvgRating, cityClinicCount, isDemo }: Props) {
  const trustColor = c.trust_score >= 75 ? "#10b981" : c.trust_score >= 50 ? "#f59e0b" : "#737373";
  const trend = c.rating_trend.trend;
  const trendBadge = {
    improving: { label: "Improving ↗", color: "#10b981", bg: "#10b98115" },
    declining: { label: "Declining ↘", color: "#ef4444", bg: "#ef444415" },
    stable: { label: "Stable →", color: "#737373", bg: "#73737315" },
    insufficient_data: { label: "Insufficient data", color: "#737373", bg: "#73737315" },
  }[trend];

  const myRank = competitors.findIndex((x) => x.id === c.id) + 1;
  const samples = [...c.sample_reviews_en, ...c.sample_reviews_th].slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {isDemo && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between gap-4 flex-wrap">
          <div className="text-sm text-blue-900">
            <strong>Demo view</strong> · Sample data for {c.name}. Your own dashboard updates every 30 minutes from real Google reviews.
          </div>
          <a
            href="/for-clinics#pilot"
            className="text-xs font-bold px-3 py-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 whitespace-nowrap"
          >
            Get your dashboard →
          </a>
        </div>
      )}

      {/* Header */}
      <header className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-1">
            Clinic dashboard · weekly digest
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">{c.name}</h1>
          <p className="text-[var(--muted)] mt-1">
            {[c.district, c.city_label || "Bangkok"].filter(Boolean).join(", ")}
            {c.categories.length > 0 && (
              <span> · {c.categories.map((x) => CATEGORY_LABELS[x] ?? x).join(", ")}</span>
            )}
          </p>
        </div>
        <a
          href={`/clinic/${c.id}`}
          className="text-sm font-bold hover:underline whitespace-nowrap"
          style={{ color: "var(--accent)" }}
          target="_blank"
        >
          View public page ↗
        </a>
      </header>

      {/* Top stats grid */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardLabel>Trust Score</CardLabel>
          <div className="flex items-baseline gap-2">
            <div className="text-5xl font-black tabular-nums" style={{ color: trustColor }}>
              {c.trust_score}
            </div>
            <div className="text-sm text-[var(--muted)]">/100</div>
          </div>
          <div className="text-xs text-[var(--muted)] mt-2">
            Top {myRank > 0 ? Math.round((myRank / Math.max(1, competitors.length)) * 100) : "—"}% in your category + district
          </div>
        </Card>

        <Card>
          <CardLabel>Google Rating</CardLabel>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-yellow-600">★ {c.rating.toFixed(1)}</span>
            <span className="text-sm text-[var(--muted)]">({c.total_reviews.toLocaleString()})</span>
          </div>
          <div className="text-xs text-[var(--muted)] mt-2">
            {cityAvgRating !== null && `City avg: ★${cityAvgRating.toFixed(1)}`}
          </div>
        </Card>

        <Card>
          <CardLabel>Rating trend</CardLabel>
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold mt-1"
            style={{ color: trendBadge.color, background: trendBadge.bg }}
          >
            {trendBadge.label}
          </div>
          <div className="text-xs text-[var(--muted)] mt-2">
            Recent (3mo): {c.rating_trend.recent.count} reviews, avg {c.rating_trend.recent.avg?.toFixed(1) ?? "—"}
          </div>
        </Card>

        <Card>
          <CardLabel>Local Guide reviews</CardLabel>
          <div className="text-3xl font-black tabular-nums">{c.local_guide_count}</div>
          <div className="text-xs text-[var(--muted)] mt-2">
            Verified reviewers · {c.scraped_review_count > 0 ? Math.round((c.local_guide_count / c.scraped_review_count) * 100) : 0}% of scraped
          </div>
        </Card>
      </section>

      {/* Trust Score breakdown */}
      <section className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <h2 className="text-lg font-bold mb-3">Trust Score breakdown</h2>
          <p className="text-xs text-[var(--muted)] mb-4">How your score is built. Pull individual levers to improve.</p>
          <div className="space-y-3">
            <ScoreLever
              label="Rating quality"
              value={Math.round((c.rating / 5) * 50)}
              max={50}
              hint={`★${c.rating.toFixed(1)} of 5`}
              accent="#7c3aed"
            />
            <ScoreLever
              label="Review volume"
              value={Math.min(40, Math.round(Math.log10(Math.max(1, c.total_reviews)) * 12))}
              max={40}
              hint={`${c.total_reviews.toLocaleString()} reviews — log-scaled`}
              accent="#0891b2"
            />
            <ScoreLever
              label="Local Guide ratio"
              value={c.scraped_review_count > 0 ? Math.min(10, Math.round((c.local_guide_count / c.scraped_review_count) * 20)) : 0}
              max={10}
              hint={`${c.local_guide_count} verified reviewers`}
              accent="#10b981"
            />
            <ScoreLever
              label="Reviewer authority"
              value={Math.min(5, Math.round(Math.log10(Math.max(1, c.avg_author_review_count)) * 2))}
              max={5}
              hint={`avg ${c.avg_author_review_count.toFixed(1)} reviews per reviewer`}
              accent="#f59e0b"
            />
          </div>
        </Card>

        {/* Competitors */}
        <Card>
          <h2 className="text-lg font-bold mb-1">Top 5 competitors</h2>
          <p className="text-xs text-[var(--muted)] mb-4">
            Same category, same district. Your position highlighted.
          </p>
          <ol className="space-y-2 text-sm">
            {competitors.slice(0, 6).map((x, i) => {
              const me = x.id === c.id;
              return (
                <li
                  key={x.id}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg ${me ? "bg-blue-50 border border-blue-200" : "border border-[var(--border)]"}`}
                >
                  <span className="text-xs font-bold tabular-nums w-6 text-center" style={{ color: me ? "#1d4ed8" : "var(--muted)" }}>
                    #{i + 1}
                  </span>
                  <span className="flex-1 truncate font-medium">
                    {x.name}
                    {me && <span className="ml-2 text-xs text-blue-700 font-bold">(you)</span>}
                  </span>
                  <span className="text-xs tabular-nums whitespace-nowrap">
                    ★{x.rating.toFixed(1)} · {x.trust_score}
                  </span>
                </li>
              );
            })}
          </ol>
          <p className="text-xs text-[var(--muted)] mt-3">
            {cityClinicCount.toLocaleString()} total clinics in this city.
          </p>
        </Card>
      </section>

      {/* What reviewers mention */}
      {c.mentioned_topics.length > 0 && (
        <section className="mb-8">
          <Card>
            <h2 className="text-lg font-bold mb-1">What reviewers mention</h2>
            <p className="text-xs text-[var(--muted)] mb-4">
              Top topics from your reviews. Mention strength = pattern your customers actually care about.
            </p>
            <div className="flex flex-wrap gap-2">
              {c.mentioned_topics.slice(0, 12).map((t) => (
                <div
                  key={t.topic}
                  className="px-3 py-1.5 rounded-full border border-[var(--border)] bg-white text-sm flex items-center gap-2"
                >
                  <span>{TOPIC_LABELS[t.topic] ?? t.topic}</span>
                  <span className="text-xs text-[var(--muted)] tabular-nums">×{t.count}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>
      )}

      {/* Sample reviews */}
      {samples.length > 0 && (
        <section className="mb-8">
          <Card>
            <h2 className="text-lg font-bold mb-1">Recent positive reviews</h2>
            <p className="text-xs text-[var(--muted)] mb-4">Sample of your high-rated reviews. Use as social proof.</p>
            <div className="grid md:grid-cols-3 gap-3">
              {samples.map((s, i) => (
                <div key={i} className="p-4 bg-white border border-[var(--border)] rounded-xl">
                  <div className="text-yellow-600 mb-1">{"★".repeat(s.rating)}</div>
                  <p className="text-sm text-[var(--fg)] line-clamp-5 leading-relaxed">{s.text}</p>
                  <p className="text-xs text-[var(--muted)] mt-2">— {s.author || "Google reviewer"}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>
      )}

      {/* Lead inflow (placeholder until traffic + form integration) */}
      <section className="mb-8">
        <Card>
          <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
            <div>
              <h2 className="text-lg font-bold">Lead inflow</h2>
              <p className="text-xs text-[var(--muted)] mt-1">
                Booking form submissions from /clinic/{c.id}.
              </p>
            </div>
            <a
              href="/for-clinics#pilot"
              className="text-xs font-bold px-3 py-1.5 rounded-full text-white whitespace-nowrap"
              style={{ background: "var(--accent)" }}
            >
              Wire LINE webhook →
            </a>
          </div>
          <div className="bg-[#0a0a0a] text-gray-200 rounded-xl p-5 font-mono text-xs leading-relaxed">
            <div className="text-emerald-400 mb-2">// Last 7 days · sample lead</div>
            <pre className="whitespace-pre-wrap">{`{
  "received_at": "2026-05-08T14:32:00+07:00",
  "service": "botox",
  "preferred_window": "Sat afternoon",
  "patient_origin": "Singapore",
  "budget_range": "8000-15000 THB",
  "contact": "LINE @sarahk_sg"
}`}</pre>
            <div className="mt-3 pt-3 border-t border-gray-700 text-gray-500">
              {isDemo
                ? "Wire your LINE OA webhook on /for-clinics → Pilot form to start receiving."
                : "Once webhook configured, your last 50 leads appear here, exclusive to you for 24h."}
            </div>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="text-xs text-[var(--muted)] text-center py-4">
        Dashboard refreshes ~30 min after each Google review scrape. Data: bangkokbotoxclinic.com.{" "}
        Questions: <strong>partners@bangkokbotoxclinic.com</strong> · LINE <strong>@bangkokbotoxclinic</strong>
      </footer>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-5 shadow-sm">
      {children}
    </div>
  );
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-2">
      {children}
    </div>
  );
}

function ScoreLever({ label, value, max, hint, accent }: {
  label: string; value: number; max: number; hint: string; accent: string;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm tabular-nums">
          <span className="font-bold">{value}</span>
          <span className="text-[var(--muted)]">/{max}</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: accent }} />
      </div>
      <div className="text-xs text-[var(--muted)] mt-1">{hint}</div>
    </div>
  );
}
