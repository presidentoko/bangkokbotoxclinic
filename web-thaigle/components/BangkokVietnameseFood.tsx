const SPOTS = [
  {
    name: "Pho24",
    emoji: "🍜",
    area: "Multiple locations (Central, Terminal 21)",
    price: "฿180–280",
    why: "Best pho franchise in Bangkok. Consistent, excellent quality. Northern and Southern Vietnam style both available.",
    must: "Pho Bo (beef noodle soup) with extra tendons. Goi cuon (fresh spring rolls) as starter.",
  },
  {
    name: "Quan An Ngon",
    emoji: "🌿",
    area: "Siam Square / Phayathai BTS area",
    price: "฿250–500",
    why: "Upscale Vietnamese with full menu. Bangkok Vietnamese expats' favorite. Atmosphere matches Hanoi restaurant. Open late.",
    must: "Bun cha (Hanoi-style noodles with grilled pork), banh xeo (sizzling crepe), iced Vietnamese coffee",
  },
  {
    name: "Saigon Recipe",
    emoji: "🏮",
    area: "Sukhumvit Soi 5 (Nana BTS)",
    price: "฿150–350",
    why: "Southern Vietnamese home cooking. Family run for 15 years. Authentic banh mi, broken rice (com tam), sugarcane shrimp.",
    must: "Com tam (broken rice + grilled pork chop + fried egg), banh cuon (steamed rice rolls)",
  },
  {
    name: "Yen Ta Fo (Vietnamese-Thai fusion stalls)",
    emoji: "🍲",
    area: "Any Bangkok market / food court",
    price: "฿50–120",
    why: "Thailand absorbed Vietnamese food perfectly — yen ta fo (pink noodle soup) is a Bangkok specialty. Unique fusion not found anywhere else.",
    must: "Yen ta fo — pink soup with various tofu, squid, fish balls. Ask for 'haeng' (dry noodles) for a different texture.",
  },
];

export function BangkokVietnameseFood() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🇻🇳 Vietnamese food in Bangkok — best pho & more
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
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
