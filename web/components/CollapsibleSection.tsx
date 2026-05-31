// Native <details>/<summary> collapsible group — mobile-friendly accordion.
// SEO + a11y safe. Print styles auto-expand.

import type { ReactNode } from "react";

export default function CollapsibleSection({
  title, emoji, count, defaultOpen = false, children,
}: {
  title: string;
  emoji?: string;
  count?: number;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details open={defaultOpen}
      className="group rounded-2xl border bg-white overflow-hidden"
      style={{ borderColor: "var(--border)" }}>
      <summary className="flex items-center gap-3 cursor-pointer p-4 sm:p-5 hover:bg-slate-50 transition list-none [&::-webkit-details-marker]:hidden">
        {emoji && <span className="text-2xl shrink-0">{emoji}</span>}
        <div className="flex-1 min-w-0">
          <div className="text-lg font-black leading-tight">{title}</div>
        </div>
        {typeof count === "number" && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] tabular-nums">{count} items</span>
        )}
        <svg className="shrink-0 transition group-open:rotate-180 text-[var(--muted)]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </summary>
      <div className="border-t p-4 sm:p-6 space-y-6" style={{ borderColor: "var(--border)" }}>
        {children}
      </div>
    </details>
  );
}
