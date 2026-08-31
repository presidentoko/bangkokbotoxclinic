// The verdict — our answer to "I saw this on a reel, is it actually good?"
//
// Two surfaces: a chip small enough for a listing card, and a panel that leads
// the detail page. Both render the same claim, and both always show the numbers
// behind it, because an unsourced verdict about a named business is worth
// nothing to the reader and is a liability to us.

import Link from "next/link";
import type { Restaurant } from "@/lib/types";
import { getVerdict, VERDICT_HUBS } from "@/lib/verdict";

export function VerdictChip({ r, size = "sm" }: { r: Restaurant; size?: "sm" | "md" }) {
  const v = getVerdict(r);
  // The residual buckets say nothing a reader can act on; a chip reading
  // "Solid" on half the cards is visual noise that devalues the ones that mean
  // something.
  if (v.kind === "solid" || v.kind === "thin_data") return null;
  const cls = size === "md" ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-xs";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap ${cls}`}
      style={{ background: v.bg, color: v.fg }}
      title={v.reason}
    >
      <span aria-hidden>{v.icon}</span>
      {v.label}
    </span>
  );
}

export function VerdictPanel({ r }: { r: Restaurant }) {
  const v = getVerdict(r);
  const hub = VERDICT_HUBS.find((h) => h.kind === v.kind);

  return (
    <section
      className="rounded-2xl border p-5 mb-6"
      style={{ background: v.bg, borderColor: `${v.fg}33` }}
      aria-labelledby="verdict-heading"
    >
      <div className="flex items-start gap-3">
        <span
          className="shrink-0 w-9 h-9 rounded-full grid place-items-center text-lg font-bold"
          style={{ background: `${v.fg}1a`, color: v.fg }}
          aria-hidden
        >
          {v.icon}
        </span>
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-widest font-bold opacity-70" style={{ color: v.fg }}>
            Our read
          </div>
          <h2 id="verdict-heading" className="text-lg font-bold" style={{ color: v.fg }}>
            {v.label}
          </h2>
          <p className="text-sm mt-1 text-[var(--fg)]">{v.reason}</p>
          {hub && (
            <Link
              href={`/verdict/${hub.slug}`}
              className="inline-block mt-2 text-xs font-semibold underline underline-offset-2"
              style={{ color: v.fg }}
            >
              See every {hub.heading.toLowerCase()} restaurant we track →
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
