const MARKETS = [
  {
    name: "Jatujak (JJ) Weekend Market",
    emoji: "🛍️",
    area: "Chatuchak, MRT Chatuchak Park / BTS Mo Chit",
    hours: "Saturday–Sunday 9am–6pm",
    price: "Entry free, items ฿50–5,000",
    why: "World's largest flea market — 8,000+ stalls across 27 sections. Vintage clothes, antiques, plants, handmade jewelry, street food, live music, pet section. Can't cover in one day — each section is a specialty neighborhood.",
    tip: "Section map available at entrances. Vintage clothing: Sections 5–6. Antiques: Section 1 (arrive 8am for best pieces). Plants: Section 2–3. Food: Sections 4 and the perimeter. Download the Chatuchak app for maps.",
  },
  {
    name: "Train Night Market Ratchada (Rod Fai)",
    emoji: "🚂",
    area: "Ratchadaphisek, opposite Esplanade Mall",
    hours: "Thursday–Sunday 5pm–1am",
    price: "Entry free, items ฿100+",
    why: "Bangkok's most Instagram-famous night market. 1950s–70s Thai vintage aesthetic. Vintage cars parked as decor. Antiques, retro electronics, vintage fashion, Thai street food. Unique atmosphere that Chatuchak doesn't have.",
    tip: "Best 7–10pm for full atmosphere. Street food area excellent — particularly good for Thai-Chinese BBQ and fresh coconut ice cream. The vintage toy section is surprisingly comprehensive.",
  },
  {
    name: "Talat Neon (After Dark Market)",
    emoji: "🌙",
    area: "Pratunam area",
    hours: "Thursday–Sunday 6pm–midnight",
    price: "Entry free, items ฿80–2,000",
    why: "Mid-size night flea market between Chatuchak and Rod Fai in vibe. Neon-lit maze of stalls selling clothing, accessories, handmade goods, and street food. Younger crowd. Less tourist-heavy than nearby night markets.",
    tip: "Good for bargaining practice — most sellers expect negotiation. Handmade accessories from local designers excellent value. Street food prices here are Bangkok-local (not tourist) — eat generously.",
  },
  {
    name: "Bangkrachao Green Sunday Market",
    emoji: "🌿",
    area: "Bang Krachao 'Green Lung' (ferry from Klong Toei)",
    hours: "Sunday 8am–1pm",
    price: "Entry free, items ฿20–500",
    why: "Tiny local market in Bangkok's green lung island. Cycling to the Sunday market through jungle-like paths is an experience. Vendors are local residents selling garden produce, homemade food, plants, crafts. No tourists — genuinely local.",
    tip: "Rent bike at the pier (฿60/day) and cycle to the market through Phra Pradaeng forest paths. 2–3km ride each way through green paths. Must visit before 11am as market winds down early and heat picks up.",
  },
];

export function BangkokFleaMarkets() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🛍️ Bangkok flea markets — vintage, antiques & local finds
      </div>
      <div className="space-y-2">
        {MARKETS.map((m) => (
          <div key={m.name} className="border border-green-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{m.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{m.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{m.hours} · {m.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{m.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{m.why}</div>
            <div className="text-[10px] text-green-700">💡 {m.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
