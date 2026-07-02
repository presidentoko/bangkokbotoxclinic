const SPOTS = [
  {
    name: "La Monita Taqueria",
    emoji: "🌮",
    area: "Mahatun Plaza, Ploenchit BTS",
    price: "฿250–500/person",
    why: "Bangkok's most authentic Mexican. Actual Mexican owner. Freshly-made tortillas daily. Import jalapeños, serrano, ancho chiles.",
    must: "Carnitas taco (3 for ฿240), queso fundido, house margarita. Thursday taco night special.",
    hours: "Mon–Sat 11am–9:30pm",
  },
  {
    name: "Sunrise Tacos",
    emoji: "🌯",
    area: "Sukhumvit Soi 12 / Asok BTS",
    price: "฿200–450/person",
    why: "Oldest Mexican restaurant in Bangkok (1996). Tex-Mex style. Most well-known. Popular with expats for takeout Friday nights.",
    must: "Nachos grande, enchiladas verde, frozen margarita pitcher for groups",
    hours: "Daily 11am–10pm",
  },
  {
    name: "El Toro Steakhouse & Mexican",
    emoji: "🐂",
    area: "Soi Thonglor 5",
    price: "฿300–600/person",
    why: "Mexican-Texan hybrid. Best BBQ brisket tacos in Bangkok. Craft margarita selection. Lively atmosphere on Thonglor.",
    must: "Beef brisket tacos, guacamole tableside, jalapeño margarita",
    hours: "Daily 5pm–midnight (kitchen to 10:30pm)",
  },
];

export function BangkokMexicanFood() {
  return (
    <div className="rounded-2xl border border-orange-300 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🌮 Mexican restaurants in Bangkok — best tacos & margaritas
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-orange-200 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area} · {s.hours}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-orange-600">⭐ Order: {s.must}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
