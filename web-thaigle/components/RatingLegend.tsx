export function RatingLegend() {
  return (
    <details className="rounded-xl border border-[var(--border)] bg-white my-3 group">
      <summary className="px-4 py-3 cursor-pointer text-xs font-bold text-[var(--muted)] flex items-center gap-2 hover:text-[var(--fg)] transition list-none select-none">
        <span>ℹ️</span>
        <span>How we rank places</span>
        <span className="ml-auto group-open:rotate-180 transition-transform duration-200">▾</span>
      </summary>
      <div className="px-4 pb-4 border-t border-[var(--border)]">
        <div className="text-xs text-[var(--muted)] mt-3 mb-3">
          Every place is scored on a <strong className="text-[var(--fg)]">Trust Score (0–100)</strong> based on review volume, rating consistency, recency, and reviewer credibility — not just star average.
        </div>
        <div className="space-y-2">
          {[
            { range: "90–100", label: "Elite", desc: "Consistently outstanding across hundreds of reviews", color: "bg-green-500" },
            { range: "75–89", label: "Trusted", desc: "Strong track record, minor inconsistencies", color: "bg-lime-500" },
            { range: "60–74", label: "Solid", desc: "Good overall, worth trying", color: "bg-yellow-400" },
            { range: "Below 60", label: "Caution", desc: "Limited data or mixed signals", color: "bg-gray-300" },
          ].map((t) => (
            <div key={t.range} className="flex items-start gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${t.color} shrink-0 mt-1`} />
              <div>
                <span className="font-bold text-xs">{t.range} — {t.label}:</span>
                <span className="text-xs text-[var(--muted)]"> {t.desc}</span>
              </div>
            </div>
          ))}
        </div>
        <a href="/methodology" className="text-xs text-orange-600 font-bold hover:underline mt-3 block">
          Full methodology →
        </a>
      </div>
    </details>
  );
}
