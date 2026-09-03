import type { Verdict } from "@/lib/verdict";

const TONE: Record<Verdict["tone"], { box: string; chip: string }> = {
  green: { box: "border-green-300 bg-green-50", chip: "bg-green-600 text-white" },
  teal: { box: "border-teal-300 bg-teal-50", chip: "bg-teal-600 text-white" },
  amber: { box: "border-amber-300 bg-amber-50", chip: "bg-amber-500 text-white" },
  red: { box: "border-red-300 bg-red-50", chip: "bg-red-600 text-white" },
  gray: { box: "border-gray-300 bg-gray-50", chip: "bg-gray-600 text-white" },
};

/**
 * The answer block. Sits directly under the title on every venue page so a
 * traveller who arrived from a video gets the call before the scroll —
 * verdict, one sentence, then the facts it rests on, each marked as for /
 * against / neutral.
 */
export function VerdictCard({
  verdict,
  name,
  generatedAt,
}: {
  verdict: Verdict;
  name: string;
  generatedAt?: string;
}) {
  const t = TONE[verdict.tone];
  const stamp = generatedAt ? new Date(generatedAt) : null;
  const stampText = stamp && !Number.isNaN(stamp.getTime())
    ? stamp.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : null;
  return (
    <section
      aria-labelledby="verdict-heading"
      className={`rounded-2xl border-2 p-4 md:p-5 mb-6 ${t.box}`}
    >
      <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
        <h2 id="verdict-heading" className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
          Thaigle verdict
        </h2>
        {stampText && (
          <span className="text-[11px] text-[var(--muted)]">Data checked {stampText}</span>
        )}
      </div>
      <div className="flex items-center gap-3 mb-2 flex-wrap">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-black ${t.chip}`}>
          <span aria-hidden>{verdict.emoji}</span> {verdict.label}
        </span>
        <span className="text-sm text-[var(--muted)]">for {name}</span>
      </div>
      <p className="text-base md:text-lg font-semibold leading-snug mb-3 text-balance">{verdict.summary}</p>
      <ul className="space-y-1.5 text-sm">
        {verdict.evidence.map((e, i) => (
          <li key={i} className="flex gap-2 items-start">
            <span
              aria-hidden
              className={`mt-0.5 shrink-0 w-4 text-center font-bold ${
                e.ok === true ? "text-green-700" : e.ok === false ? "text-red-700" : "text-[var(--muted)]"
              }`}
            >
              {e.ok === true ? "✓" : e.ok === false ? "✗" : "•"}
            </span>
            <span>{e.text}</span>
          </li>
        ))}
      </ul>
      <p className="text-[11px] text-[var(--muted)] mt-3">
        Built only from Google review data on file — no influencer input, no paid placement.{" "}
        <a href="/methodology" className="underline">How verdicts work</a>
      </p>
    </section>
  );
}
