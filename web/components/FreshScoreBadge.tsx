// "Last refreshed N days ago" pill — data freshness signal.
// Trust depends on knowing data isn't stale; show the timestamp prominently.

function daysAgo(iso?: string): number {
  if (!iso) return 0;
  return Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000));
}

export default function FreshScoreBadge({ generatedAt }: { generatedAt?: string }) {
  const d = daysAgo(generatedAt);
  const tone = d <= 2 ? "emerald" : d <= 7 ? "blue" : d <= 30 ? "amber" : "rose";
  const styles = {
    emerald: { bg: "bg-emerald-50", border: "border-emerald-300", text: "text-emerald-800", dot: "bg-emerald-500" },
    blue:    { bg: "bg-blue-50",    border: "border-blue-300",    text: "text-blue-800",    dot: "bg-blue-500" },
    amber:   { bg: "bg-amber-50",   border: "border-amber-300",   text: "text-amber-800",   dot: "bg-amber-500" },
    rose:    { bg: "bg-rose-50",    border: "border-rose-300",    text: "text-rose-800",    dot: "bg-rose-500" },
  }[tone];

  const label =
    d === 0 ? "Refreshed today" :
    d === 1 ? "Refreshed yesterday" :
    d <= 7  ? `Refreshed ${d} days ago` :
    d <= 30 ? `Refreshed ${Math.round(d / 7)} week${Math.round(d / 7) === 1 ? "" : "s"} ago` :
              "Last refresh > 1 month ago";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${styles.bg} ${styles.border} ${styles.text} px-2.5 py-1 text-[11px] font-bold`}>
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${styles.dot} ${d <= 2 ? "animate-pulse" : ""}`} />
      🔄 {label}
    </span>
  );
}
