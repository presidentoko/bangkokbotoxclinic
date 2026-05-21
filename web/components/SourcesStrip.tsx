// SourcesStrip — 종합 데이터 소스 시각화. Hero 아래 띠로 배치.
// 사이트가 다중 플랫폼 aggregation 임을 1초 안에 인식시킴.
// Server component. 플랫폼별 색상 + 짧은 라벨.

type Source = {
  name: string;
  blurb: string;
  emoji: string;
  bg: string;
  fg: string;
};

const ALL_SOURCES: Source[] = [
  { name: "Google Maps", blurb: "Anchor reviews", emoji: "🗺️", bg: "#4285F4", fg: "white" },
  { name: "HDmall",      blurb: "Package pricing", emoji: "💊", bg: "#FF6B35", fg: "white" },
  { name: "Wongnai",     blurb: "Thai reviews",    emoji: "🍜", bg: "#FF1744", fg: "white" },
];

const HAIR_EXTRA: Source[] = [
  { name: "Bookimed", blurb: "Medical tourism", emoji: "🌍", bg: "#10b981", fg: "white" },
  { name: "Pantip",   blurb: "Thai forums",     emoji: "💬", bg: "#8b5cf6", fg: "white" },
  { name: "Reddit",   blurb: "Patient threads", emoji: "🔥", bg: "#ff4500", fg: "white" },
  { name: "Naver",    blurb: "Korean blogs",    emoji: "📝", bg: "#03c75a", fg: "white" },
];

export function SourcesStrip({ focus, accent }: { focus: string; accent: string }) {
  const sources = focus === "hair" ? [...ALL_SOURCES, ...HAIR_EXTRA] : ALL_SOURCES;
  return (
    <section className="bg-slate-50 border-y border-[var(--border)]">
      <div className="max-w-5xl mx-auto px-4 py-5">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded" style={{ background: `${accent}15`, color: accent }}>
            Cross-platform aggregator
          </span>
          <p className="text-sm text-[var(--muted)]">
            Not just Google — we cross-reference <strong className="text-[var(--fg)]">{sources.length} review platforms</strong> for every clinic.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {sources.map((s) => (
            <div
              key={s.name}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm"
              style={{ background: s.bg, color: s.fg }}
              title={s.blurb}
            >
              <span aria-hidden>{s.emoji}</span>
              <span>{s.name}</span>
              <span className="opacity-75 font-normal hidden sm:inline">· {s.blurb}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
