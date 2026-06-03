// "Data aggregated from" — high-trust source strip. Replaces "as seen on" press logos for now.

const SOURCES: { name: string; tone: string }[] = [
  { name: "Google Maps", tone: "text-blue-700 dark:text-blue-300" },
  { name: "Bookimed", tone: "text-sky-700 dark:text-sky-300" },
  { name: "Reddit", tone: "text-orange-700 dark:text-orange-300" },
  { name: "Naver", tone: "text-emerald-700 dark:text-emerald-300" },
  { name: "YouTube", tone: "text-red-700 dark:text-red-300" },
  { name: "Pantip", tone: "text-violet-700 dark:text-violet-300" },
];

export default function PressStrip() {
  return (
    <div className="relative -mx-4 overflow-hidden py-2">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[rgb(var(--bg))] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[rgb(var(--bg))] to-transparent" />
      <div className="marquee-track items-center px-4">
        {[...SOURCES, ...SOURCES, ...SOURCES].map((s, i) => (
          <div key={i} className="flex shrink-0 items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] muted">●</span>
            <span className={`font-display text-2xl font-bold tracking-tighter-display ${s.tone}`}>
              {s.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
