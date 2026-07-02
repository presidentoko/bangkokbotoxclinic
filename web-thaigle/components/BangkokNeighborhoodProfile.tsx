const HOODS = [
  {
    name: "Silom / Sathorn",
    emoji: "🏢",
    vibe: "Business district meets nightlife strip",
    bts: "Sala Daeng / Chong Nonsi",
    best: ["Lumpinee Park morning run", "Silom Soi 4 bar scene", "Sri Mariamman Temple", "Chatuchak Boran antiques"],
    food: "Pat pong night market, Bon Vivant, serious rooftops",
    avoid: "Pat Pong night market (tourist rip-off zone)",
    budget: "฿฿–฿฿฿",
    url: "/restaurants/bangkok/silom",
  },
  {
    name: "Sukhumvit",
    emoji: "🌍",
    vibe: "Expat hub — everything international",
    bts: "Nana / Asok / Phrom Phong / Thong Lo / Ekkamai",
    best: ["Benjakiti Park", "Terminal 21 shopping", "Thong Lo café scene", "Japanese restaurants"],
    food: "Every cuisine imaginable — best Japanese outside Japan at On-Nut/Phrom Phong",
    avoid: "Nana / Soi Cowboy area at night (red light district)",
    budget: "฿฿–฿฿฿฿",
    url: "/restaurants/bangkok/sukhumvit",
  },
  {
    name: "Rattanakosin (Old City)",
    emoji: "🏛️",
    vibe: "Historic temples, floating markets, river views",
    bts: "Tha Chang / Saphan Taksin (Chao Phraya boat)",
    best: ["Grand Palace", "Wat Pho massage", "Tha Tien pier", "Pak Khlong Talat flower market"],
    food: "Tha Tien local restaurants, Jay Fai (฿฿฿฿, book months ahead)",
    avoid: "Overstaying inside temples in heat — leave by 11am",
    budget: "฿–฿฿",
    url: "/restaurants/bangkok/rattanakosin",
  },
  {
    name: "Ari / Phahon Yothin",
    emoji: "🌿",
    vibe: "Local, quiet, best coffee scene in Bangkok",
    bts: "Ari / Saphan Khwai",
    best: ["Small batch coffee shops", "Aree Market", "Vintage vinyl records", "Local Isaan food"],
    food: "Incredibly dense café scene, best for brunch and specialty coffee",
    avoid: "Getting there — it's quieter, a bit out of the way for tourists",
    budget: "฿–฿฿",
    url: "/restaurants/bangkok/ari",
  },
  {
    name: "Chinatown (Yaowarat)",
    emoji: "🏮",
    vibe: "Gold shops, dim sum, best street food at night",
    bts: "Hua Lamphong / Sam Yot (Blue Line)",
    best: ["Yaowarat night market", "Talad Noi (old neighbourhood)", "Wat Mangkon Kamalawat", "Gold shops"],
    food: "The best street food in Bangkok. Dim sum mornings, seafood nights. Avoid weekdays 2–5pm (dead)",
    avoid: "Going during Chinese New Year unless you want to be in the crowd",
    budget: "฿–฿฿",
    url: "/restaurants/bangkok/chinatown",
  },
];

export function BangkokNeighborhoodProfile() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🗺️ Bangkok neighborhood profiles
      </div>
      <div className="space-y-3">
        {HOODS.map((h) => (
          <a key={h.name} href={h.url} className="block border border-[var(--border)] rounded-xl p-3 hover:border-orange-300 hover:bg-orange-50 transition">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xl">{h.emoji}</span>
                <div>
                  <div className="font-bold text-xs">{h.name}</div>
                  <div className="text-[10px] text-[var(--muted)]">{h.vibe}</div>
                </div>
              </div>
              <span className="text-xs font-mono text-[var(--muted)]">{h.budget}</span>
            </div>
            <div className="text-[10px] text-[var(--muted)] mb-1">🚆 BTS: {h.bts}</div>
            <div className="text-[10px] text-green-700">✓ Best for: {h.best.slice(0, 2).join(", ")}</div>
            <div className="text-[10px] text-red-600 mt-0.5">⚠ {h.avoid}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
