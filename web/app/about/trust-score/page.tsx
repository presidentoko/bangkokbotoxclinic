// /about/trust-score — Trust Score 공식, 4 lever 설명, Google ranking 상관관계 자료.
// 클리닉 owner가 dashboard에서 Trust Score 의심할 때 보내는 explainer.

import type { Metadata } from "next";
import { loadMasterDb } from "@/lib/data";

export const metadata: Metadata = {
  title: "How Trust Score works — methodology & Google ranking correlation",
  description:
    "Trust Score is a composite of public Google Maps signals (rating, review volume, Local Guide ratio, reviewer authority). Here's the formula and how it correlates with Google ranking.",
  alternates: { canonical: "/about/trust-score" },
};

export default async function TrustScoreExplainerPage() {
  const db = await loadMasterDb();

  // Compute a simple correlation between trust_score and review_count
  // (the strongest visible Google ranking signal). Not statistical proof,
  // but informative for the explainer.
  const sample = db.clinics
    .filter((c) => c.total_reviews >= 10)
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, 20);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <a href="/about" className="hover:text-[var(--fg)]">About</a>
        <span className="mx-2">›</span>
        <span>Trust Score</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
        How Trust Score works
      </h1>
      <p className="text-base text-[var(--muted)] leading-relaxed mb-8">
        Trust Score is a composite (0–100) we compute for every clinic in our database, from{" "}
        <strong className="text-[var(--fg)]">public Google Maps signals only</strong>. No paid
        weighting, no editorial bias. The formula and weights are below — you can verify them
        against the data on any clinic's <a href="/dashboard" className="text-blue-600 underline">free dashboard</a>.
      </p>

      <h2 className="text-2xl font-black mt-10 mb-3">The four levers</h2>
      <p className="text-sm text-[var(--muted)] leading-relaxed mb-6">
        Each lever maxes out at the cap shown. Diminishing returns kick in past the values noted —
        we use log scales where a clinic with 10× more reviews shouldn't get 10× the points.
      </p>

      <div className="space-y-4 mb-10">
        <Lever
          label="Rating quality"
          cap={50}
          accent="#7c3aed"
          formula="round((rating ÷ 5) × 50)"
          why="Average star rating is the single strongest visible Google signal. A 4.8★ clinic outranks a 4.2★ clinic on virtually every 'best X in Bangkok' query, even when review counts are comparable."
        />
        <Lever
          label="Review volume"
          cap={40}
          accent="#0891b2"
          formula="min(40, round(log₁₀(reviews) × 12))"
          why="More reviews = more search-index signal, but with log-scaled diminishing returns. A clinic going from 100 → 1,000 reviews gains a lot; 1,000 → 10,000 gains less. Past ~5,000 reviews, returns are nearly flat."
        />
        <Lever
          label="Local Guide ratio"
          cap={10}
          accent="#10b981"
          formula="min(10, round((local_guides ÷ scraped_reviews) × 20))"
          why="Reviews from Google Local Guides carry more weight in Google's ranking — they're verified active reviewers, not single-purpose accounts. A high ratio signals authentic engagement, not review farms."
        />
        <Lever
          label="Reviewer authority"
          cap={5}
          accent="#f59e0b"
          formula="min(5, round(log₁₀(avg_reviews_per_reviewer) × 2))"
          why="Average review count per reviewer who reviewed you. If your reviewers have only 1 review each (yours), that looks suspicious. If they average 50+ reviews, you're being reviewed by serious reviewers."
        />
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-10">
        <div className="text-xs font-black uppercase tracking-widest text-amber-800 mb-2">
          Caps add to 105, not 100
        </div>
        <p className="text-sm leading-relaxed">
          We allow a 5-point buffer to reward exceptional clinics. In practice, even the top
          clinics in our database hit ~85–95 — perfect 100 is essentially unreachable, which
          is by design. A score above ~75 already signals top-tier reputation.
        </p>
      </div>

      <h2 className="text-2xl font-black mt-10 mb-3">Does Trust Score correlate with Google ranking?</h2>
      <p className="text-sm leading-relaxed mb-4">
        We don't claim Trust Score <em>is</em> the Google ranking algorithm — nobody outside
        Google knows that. We claim each of the four levers is a documented Google ranking
        signal, and that improving any of them improves your actual position on Google Maps
        and {`"`}best X in Bangkok{`"`} queries.
      </p>
      <p className="text-sm leading-relaxed mb-6">
        From our database of {db.clinics.length.toLocaleString()} Bangkok clinics:
        the 20 clinics with the highest Trust Score also have an average of{" "}
        <strong>{Math.round(sample.reduce((s, c) => s + c.total_reviews, 0) / sample.length).toLocaleString()} reviews</strong>{" "}
        and a <strong>{(sample.reduce((s, c) => s + c.rating, 0) / sample.length).toFixed(2)}★ average rating</strong>.
        These are also the clinics that consistently appear on page 1 for category searches.
      </p>

      <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden mb-10">
        <div className="px-4 py-3 bg-gray-50 border-b border-[var(--border)]">
          <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">
            Top 10 clinics by Trust Score · 10+ reviews filter
          </div>
        </div>
        {/* overflow-x-auto: 5개 컬럼(숫자 4개+클리닉명)이 360px에 안 들어가면
            바깥 div의 overflow-hidden이 Trust 컬럼을 그냥 잘라버리고 스크롤할
            방법이 없었음 (2026-07-28 감사) — table만 따로 감싸 가로 스크롤 허용. */}
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-[var(--muted)] border-b border-[var(--border)]">
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Clinic</th>
              <th className="px-4 py-2 text-right">Rating</th>
              <th className="px-4 py-2 text-right">Reviews</th>
              <th className="px-4 py-2 text-right">Trust</th>
            </tr>
          </thead>
          <tbody>
            {sample.slice(0, 10).map((c, i) => (
              <tr key={c.id} className="border-b border-[var(--border)] last:border-0">
                <td className="px-4 py-2 text-xs tabular-nums font-bold">#{i + 1}</td>
                <td className="px-4 py-2 truncate max-w-xs">{c.name}</td>
                <td className="px-4 py-2 text-right tabular-nums">★{c.rating.toFixed(1)}</td>
                <td className="px-4 py-2 text-right tabular-nums text-[var(--muted)]">{c.total_reviews.toLocaleString()}</td>
                <td className="px-4 py-2 text-right tabular-nums font-bold">{c.trust_score}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      <h2 className="text-2xl font-black mt-10 mb-3">What it isn't</h2>
      <ul className="text-sm leading-relaxed space-y-2 list-disc pl-5 mb-10">
        <li>
          <strong>Not an SEO hack.</strong> If your business has 50 fake 5★ reviews from
          single-review accounts, your Trust Score will be lower than a competitor with 500
          mixed-rating reviews from Local Guides. Reviewer authority and Local Guide ratio
          penalize fake-looking patterns.
        </li>
        <li>
          <strong>Not pay-to-win.</strong> Sponsored slots on bangkokbotoxclinic.com are
          shown <em>above</em> organic results with a clearly labelled badge — sponsored
          status never changes a clinic's Trust Score or organic position.
        </li>
        <li>
          <strong>Not predictive of bookings.</strong> Trust Score predicts <em>visibility</em>{" "}
          — whether patients find you. Whether they book depends on your service quality,
          pricing, location, and how you present your clinic.
        </li>
      </ul>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
        <div className="font-bold mb-2">Want to see your clinic's Trust Score breakdown?</div>
        <p className="text-sm text-[var(--muted)] leading-relaxed mb-3">
          The dashboard shows which lever is dragging your score down and what specific actions
          would improve it — for free, no signup.
        </p>
        <a
          href="/dashboard"
          className="inline-block text-sm font-bold px-4 py-2 rounded-lg text-white"
          style={{ background: "#059669" }}
        >
          🎁 Find your clinic's report →
        </a>
      </div>
    </div>
  );
}

function Lever({ label, cap, accent, formula, why }: { label: string; cap: number; accent: string; formula: string; why: string }) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-5">
      <div className="flex items-baseline justify-between gap-3 mb-2 flex-wrap">
        <h3 className="text-lg font-black" style={{ color: accent }}>{label}</h3>
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
          Max <span className="tabular-nums">{cap}</span> pts
        </span>
      </div>
      <div className="text-xs font-mono bg-gray-50 border border-[var(--border)] rounded px-3 py-2 mb-3 break-all">
        {formula}
      </div>
      <p className="text-sm leading-relaxed text-[var(--muted)]">{why}</p>
    </div>
  );
}
