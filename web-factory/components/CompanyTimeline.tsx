// 회사 연혁 타임라인 — 설립부터 현재까지. 데이터 적어도 visual 임팩트.

type Event = {
  year: number;
  label: string;
  highlight?: boolean;
};

type Props = {
  founded?: number;
  events: Event[];
};

export function CompanyTimeline({ founded, events }: Props) {
  const now = new Date().getFullYear();
  const allEvents: Event[] = [
    ...(founded ? [{ year: founded, label: "Founded", highlight: true }] : []),
    ...events,
    { year: now, label: "Today" },
  ].sort((a, b) => a.year - b.year);

  if (allEvents.length < 2) return null;

  const minY = allEvents[0].year;
  const maxY = allEvents[allEvents.length - 1].year;
  const span = Math.max(1, maxY - minY);

  return (
    <section className="bg-white border border-stone-200 rounded-2xl p-6">
      <h2 className="text-lg font-bold mb-1 font-display text-stone-900">Company timeline</h2>
      <p className="text-xs text-stone-500 mb-6">
        {span} year{span === 1 ? "" : "s"} of registered operation as of {now}.
      </p>
      <div className="relative h-20">
        {/* axis line */}
        <div className="absolute left-0 right-0 top-1/2 h-px bg-stone-300" />
        {/* gold progress bar (founded → now) */}
        <div
          className="absolute top-1/2 h-0.5"
          style={{
            left: "0",
            right: "0",
            background: "linear-gradient(90deg, #b45309 0%, #fbbf24 100%)",
          }}
        />
        {/* markers */}
        {allEvents.map((e, i) => {
          const pct = ((e.year - minY) / span) * 100;
          return (
            <div
              key={i}
              className="absolute -translate-x-1/2 flex flex-col items-center"
              style={{ left: `${pct}%`, top: "50%", transform: "translate(-50%, -50%)" }}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full border-2 ${e.highlight ? "bg-amber-600 border-amber-300" : "bg-white border-stone-400"}`}
                style={e.highlight ? { boxShadow: "0 0 0 3px rgba(180,83,9,0.2)" } : undefined}
              />
              <div className={`mt-2 text-[10px] uppercase tracking-wider font-bold ${e.highlight ? "text-amber-800" : "text-stone-500"}`}>
                {e.label}
              </div>
              <div className={`text-xs font-mono-data ${e.highlight ? "text-amber-900 font-bold" : "text-stone-600"}`}>
                {e.year}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
