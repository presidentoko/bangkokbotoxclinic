"use client";

export function PrintPlan({ label = "🖨️ Print" }: { label?: string }) {
  return (
    <button
      onClick={() => window.print()}
      className="text-sm text-[var(--muted)] hover:text-black border border-[var(--border)] px-3 py-1.5 rounded-full hover:border-gray-400 transition"
    >
      {label}
    </button>
  );
}
