// Inline trust strip — "Your quote is locked for 14 days from clinic reply"

export default function PriceLockGuarantee() {
  return (
    <div className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-200 bg-slate-50 px-3 py-2 text-xs">
      <span className="text-base">🔒</span>
      <span>
        <strong>Quote locked 14 days</strong> from clinic reply.{" "}
        <span className="text-[var(--muted)]">Take time to decide — no pressure.</span>
      </span>
    </div>
  );
}
