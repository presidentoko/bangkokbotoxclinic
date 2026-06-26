// Server component — computes real N/M from ig-seed + master_db at build time.
// LAW 2: every number on screen traces to real data (ig-seed + Trust Scores).
// Usage: <ExposeStat collection="bangkok-cafes" />

import { loadIgSeed, loadFamousVsGoodCollection } from "@/lib/famous-vs-good";

export async function ExposeStat({ collection }: { collection: string }) {
  const seeds = await loadIgSeed();
  const filtered = seeds.filter((s) => s.category === collection);
  const N = filtered.length;
  if (N === 0) return null;

  const { entries, thresholds } = await loadFamousVsGoodCollection(collection);
  const matched = entries.filter((e) => e.restaurant !== null);
  const M = matched.filter(
    (e) => e.restaurant!.trust_score < thresholds.bigGapThreshold
  ).length;
  const threshold = Math.round(thresholds.bigGapThreshold);

  const city = filtered[0]?.city ?? "Bangkok";
  const cityLabel = city.charAt(0).toUpperCase() + city.slice(1);

  return (
    <div className="mt-6 inline-flex flex-col sm:flex-row items-center gap-3 bg-white/80 border border-orange-200 rounded-2xl px-5 py-4 text-sm">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" aria-hidden />
        <span className="font-black text-2xl tabular-nums text-orange-600">{M}</span>
        <span className="text-[var(--muted)]">of</span>
        <span className="font-black text-2xl tabular-nums">{N}</span>
      </div>
      <span className="text-[var(--muted)] leading-snug text-center sm:text-left">
        {cityLabel} venues hyped on social score{" "}
        <strong className="text-[var(--fg)]">below {threshold}</strong> on verified Google data.
        <a
          href={`/famous-vs-good/${collection}`}
          className="ml-2 text-orange-600 font-semibold hover:underline whitespace-nowrap"
        >
          See the receipts →
        </a>
      </span>
    </div>
  );
}
