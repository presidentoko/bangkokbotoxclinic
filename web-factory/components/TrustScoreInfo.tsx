import type { TrustSub } from "@/lib/trustScore";

// Accessible, JS-free Trust Score explainer. Renders an ⓘ that expands a small
// panel with the 5 sub-scores and a link to the methodology page.
export function TrustScoreInfo({ subs }: { subs: TrustSub[] }) {
  return (
    <details className="relative inline-block group/ts">
      <summary
        className="list-none cursor-pointer inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold hover:bg-gray-200 select-none"
        aria-label="How is the Trust Score calculated?"
        title="How is the Trust Score calculated?"
      >
        i
      </summary>
      <div
        className="absolute z-20 left-0 top-6 w-60 p-3 rounded-lg border border-[var(--border)] bg-white shadow-lg text-xs text-[var(--fg)]"
        role="group"
      >
        <div className="font-bold mb-1.5">Trust Score = average of available signals</div>
        <ul className="space-y-1">
          {subs.filter((s) => s.applicable).map((s) => (
            <li key={s.key} className="flex items-center justify-between gap-2">
              <span className="text-[var(--muted)]">{s.label}</span>
              <span className="tabular-nums font-medium">{Math.round(s.score)}</span>
            </li>
          ))}
        </ul>
        <a href="/trust-score" className="block mt-2 text-emerald-700 font-semibold hover:underline">
          How is this calculated? →
        </a>
      </div>
    </details>
  );
}
