const SPACES = [
  {
    name: "Bangkok Art & Culture Centre (BACC)",
    emoji: "🏛️",
    area: "Siam BTS",
    admission: "Free",
    hours: "Tue–Sun 10:30am–9pm",
    why: "Multiple galleries + artist studios + small theater. Rotating monthly exhibitions. Best free art space in Bangkok.",
    tip: "Check their website for performance schedules. Opening nights (usually Fri evening) often have free wine.",
  },
  {
    name: "Bangkok Citycity Gallery",
    emoji: "🎨",
    area: "Sathon (MRT Lumpini + walk 15 min)",
    admission: "Free",
    hours: "Wed–Sun 12pm–7pm",
    why: "Bangkok's most respected contemporary art gallery. Thai and international artists. Serious curation.",
    tip: "Best gallery in Bangkok for understanding contemporary Thai art. English descriptions available.",
  },
  {
    name: "Warehouse 30",
    emoji: "🏚️",
    area: "Bang Rak / Charoen Krung",
    admission: "Free",
    hours: "Most shops: Tue–Sun 11am–7pm",
    why: "Old warehouse converted into creative complex. Art studios, design shops, restaurants, small theater.",
    tip: "Combine with the Charoen Krung area's creative corridor — many galleries and concept stores in the neighborhood.",
  },
  {
    name: "Soy Sauce Factory / Factory Art Space",
    emoji: "🏭",
    area: "Bang Rak / Khlong San",
    admission: "Depends on event (฿0–300)",
    hours: "Event-based — check Instagram",
    why: "Converted factory space for large-scale installations, DJ events, art markets, pop-up shows.",
    tip: "Follow on Instagram for events. Usually happens on weekends. Very photogenic industrial space.",
  },
  {
    name: "Neilson Hays Library",
    emoji: "📚",
    area: "Silom (BTS Surasak)",
    admission: "Free (donations welcome)",
    hours: "Tue–Sun 9:30am–5pm",
    why: "1869 heritage building. Small gallery, English books, peaceful garden. Regular art exhibitions + poetry nights.",
    tip: "Hidden gem. Beautiful colonial architecture. Best place in Bangkok for quiet reading and culture without crowds.",
  },
];

export function BangkokArtScene() {
  return (
    <div className="rounded-2xl border border-purple-100 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-purple-700 mb-3">
        🎨 Bangkok art scene — galleries & creative spaces
      </h2>
      <div className="space-y-2">
        {SPACES.map((s) => (
          <div key={s.name} className="border border-purple-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">📍 {s.area} · {s.hours}</div>
              </div>
              <span className="shrink-0 text-[10px] font-bold text-green-700">{s.admission}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-1 leading-snug">{s.why}</div>
            <div className="text-[10px] text-orange-600">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
