const STEPS = [
  { n: "1", title: "Google Maps data", desc: "We pull rating + review count from Google Maps — the most verified, abuse-resistant review system." },
  { n: "2", title: "Bayesian weighting", desc: "A place with 5,000 reviews at 4.2★ scores higher than one with 3 reviews at 5★. Volume matters." },
  { n: "3", title: "Recency bonus", desc: "Recent reviews count more. A place trending up gets boosted; one coasting on old glory gets penalized." },
  { n: "4", title: "Trust Score = 0–100", desc: "Scores above 70 indicate genuinely excellent, frequently visited venues with consistent quality." },
];

export function TrustScoreExplainer() {
  return (
    <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 my-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📊</span>
        <div>
          <div className="font-black text-sm text-indigo-900">How Trust Score works</div>
          <div className="text-xs text-indigo-700">Objective ranking — not paid or sponsored</div>
        </div>
      </div>
      <div className="space-y-3">
        {STEPS.map((s) => (
          <div key={s.n} className="flex gap-3 items-start">
            <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center">
              {s.n}
            </span>
            <div>
              <div className="text-xs font-bold text-indigo-900">{s.title}</div>
              <div className="text-xs text-indigo-800 opacity-90 leading-snug">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <a
        href="/methodology"
        className="mt-4 block text-center text-xs font-bold text-indigo-700 border border-indigo-300 bg-white rounded-full py-1.5 hover:bg-indigo-100 transition"
      >
        Full methodology →
      </a>
    </div>
  );
}
