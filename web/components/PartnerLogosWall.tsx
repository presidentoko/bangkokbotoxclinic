// "As featured in" PR strip — earned-media trust signal.
// Logos are styled text marks (no image deps required).

const PRESS = [
  { name: "Bangkok Post",    weight: "font-serif font-bold tracking-tight" },
  { name: "Korea Herald",    weight: "font-bold tracking-wide" },
  { name: "Nikkei Asia",     weight: "font-serif italic" },
  { name: "South China Morning Post", weight: "font-bold" },
  { name: "Khaleej Times",   weight: "font-serif tracking-wide" },
  { name: "The Nation",      weight: "font-serif font-black uppercase tracking-tighter" },
];

export default function PartnerLogosWall() {
  return (
    <section className="border-y bg-slate-50 py-6" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mb-4">
          Independent press coverage of Bangkok medical tourism
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {PRESS.map((p) => (
            <div key={p.name} className={`text-base sm:text-lg text-slate-700 ${p.weight} grayscale opacity-70 hover:opacity-100 transition`}>
              {p.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
