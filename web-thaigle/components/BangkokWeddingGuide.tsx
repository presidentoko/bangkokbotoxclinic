const VENUES = [
  {
    name: "Mandarin Oriental Bangkok",
    emoji: "💐",
    style: "Riverside colonial elegance",
    capacity: "20–300 guests",
    price: "฿350,000–1,500,000+ (event space hire + catering)",
    why: "Bangkok's most iconic wedding venue. Chao Phraya views, 1876 heritage building, legendary service.",
    tip: "Mandarin Oriental weddings are once-in-a-lifetime. Many couples fly in from overseas. Book 1+ year ahead.",
  },
  {
    name: "Sala Rattanakosin",
    emoji: "🏯",
    style: "Riverside boutique with Wat Arun view",
    capacity: "20–60 guests",
    price: "฿150,000–400,000",
    why: "Most romantic small-wedding venue in Bangkok. Rooftop terrace with direct Wat Arun temple view at sunset.",
    tip: "Perfect for small intimate ceremonies. Sunset ceremony at 5pm with Wat Arun lit up in background = iconic.",
  },
  {
    name: "Anantara Riverside Bangkok",
    emoji: "✨",
    style: "Garden + ballroom resort wedding",
    capacity: "50–600 guests",
    price: "฿250,000–800,000",
    why: "River-facing garden for ceremony, multiple ballrooms for reception. Packages for international couples available.",
    tip: "Strong wedding planner team who handles expat + interfaith ceremonies. Ask for the riverside lawn package.",
  },
];

const LEGAL_INFO = [
  "Register at a local district office (Amphur). Process takes 1 day with correct documents.",
  "Foreign nationals need passport, proof of single status (apostilled from home country), and sometimes a translator.",
  "Buddhist or Christian blessings can be added as a ceremony — neither is legally required.",
  "Marriage equality: currently Thailand's Civil Partnership Bill passed (2024) — same-sex couples can now register partnerships. Check current status closer to travel date.",
  "Cost to legalize: ฿500–2,000 for documents + ฿5,000–15,000 for a bilingual translator/wedding coordinator.",
];

export function BangkokWeddingGuide() {
  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-pink-700 mb-3">
        💍 Getting married in Bangkok — venue guide
      </h2>
      <div className="space-y-2 mb-3">
        {VENUES.map((v) => (
          <div key={v.name} className="border border-pink-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-xl shrink-0">{v.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{v.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{v.style} · Capacity: {v.capacity}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{v.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-1 leading-snug">{v.why}</div>
            <div className="text-[10px] text-orange-600">💡 {v.tip}</div>
          </div>
        ))}
      </div>
      <div className="text-xs font-black mb-2">Legal process</div>
      <div className="space-y-1">
        {LEGAL_INFO.map((l) => (
          <div key={l} className="text-[10px] flex gap-1.5 items-start">
            <span className="shrink-0 text-pink-500 mt-0.5">•</span>
            <span className="leading-snug">{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
