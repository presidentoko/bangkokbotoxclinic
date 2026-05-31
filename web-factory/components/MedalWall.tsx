// Certification medal wall — Alibaba Gold Supplier style trust signals.
// 회사가 보유한 검증을 큰 메달 디자인으로.

type Medal = {
  key: string;
  label: string;        // "DBD Verified"
  sub?: string;         // "Reg. 0107..."
  icon: string;         // emoji or text
  active: boolean;      // 보유 여부
  hint?: string;        // hover/aria tooltip
};

type Props = {
  medals: Medal[];
};

export function MedalWall({ medals }: Props) {
  const active = medals.filter((m) => m.active);
  if (active.length === 0) return null;

  return (
    <section className="bg-stone-900 text-stone-100 rounded-2xl p-6 relative overflow-hidden">
      <div aria-hidden className="absolute -top-12 -right-12 w-44 h-44 rounded-full" style={{ background: "radial-gradient(circle, rgba(251,191,36,0.18), transparent 60%)" }} />
      <div className="relative">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-lg font-bold tracking-wide uppercase font-display" style={{ letterSpacing: "0.08em", color: "#fbbf24" }}>
            Certifications &amp; Verifications
          </h2>
          <span className="text-xs text-stone-400 font-mono-data">{active.length} active</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {medals.map((m) => (
            <MedalIcon key={m.key} m={m} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MedalIcon({ m }: { m: Medal }) {
  const dim = !m.active;
  return (
    <div
      className={`flex flex-col items-center text-center px-3 py-4 rounded-xl border ${dim ? "border-stone-700 opacity-40" : "border-amber-500/40 bg-stone-800/40"}`}
      title={m.hint || m.label}
    >
      <div
        className={`relative w-16 h-16 rounded-full flex items-center justify-center mb-2 ${dim ? "bg-stone-800" : ""}`}
        style={dim ? undefined : {
          background: "radial-gradient(circle at 35% 25%, #fde68a, #b45309 60%, #78350f 100%)",
          boxShadow: "0 0 0 2px #fbbf24, 0 4px 12px rgba(180,83,9,0.4), inset 0 -3px 6px rgba(120,53,15,0.6)",
        }}
      >
        <span aria-hidden className="text-2xl">{m.icon}</span>
        {!dim && (
          <span aria-hidden className="absolute -top-1 -left-1 text-amber-300 text-xs">★</span>
        )}
      </div>
      <div className={`text-xs font-bold uppercase tracking-wider ${dim ? "text-stone-500" : "text-amber-200"}`}>
        {m.label}
      </div>
      {m.sub && (
        <div className="text-[10px] text-stone-400 mt-0.5 font-mono-data line-clamp-1">{m.sub}</div>
      )}
    </div>
  );
}
