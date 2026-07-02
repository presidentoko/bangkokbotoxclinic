const CAFE_BELTS = [
  {
    area: "Ari–Phahon Yothin Café Belt",
    emoji: "☕",
    bts: "BTS Ari (N5)",
    highlight: "Bangkok's OG specialty coffee scene. Locals only — no tourist crowds.",
    must: ["Roots (pioneer of Thai specialty coffee)", "Factory Coffee (roastery + cafe)", "Kaizen Coffee (minimalist, filter-focused)", "Ceresia Coffee (best beans in Bangkok)"],
    price: "Latte ฿95–130. Black coffee ฿70–110.",
    mood: "Quiet, creative, laptop-friendly",
  },
  {
    area: "Ekkamai–Thonglor Café Circuit",
    emoji: "🎨",
    bts: "BTS Thong Lo (E5) or BTS Ekkamai (E6)",
    highlight: "Instagrammable + serious quality. Best design cafés in SE Asia here.",
    must: ["Beam (all-white gallery + espresso)", "Rocket Coffeebar (Aussie-style brunch café)", "9th Street Coffee (Ekkamai soi off-grid)", "The Bookshop Café (cozy, hidden)"],
    price: "Specialty drinks ฿120–180. Great breakfast sets ฿200–350.",
    mood: "Stylish, social, great for photos",
  },
  {
    area: "Silom–Bang Rak Café Crawl",
    emoji: "🌆",
    bts: "BTS Chong Nonsi (S3) or BTS Sala Daeng (S2)",
    highlight: "Older shophouses converted to cool cafés. Mixed locals + digital nomads.",
    must: ["Hands and Heart (shophouse aesthetic)", "Common Ground (community-run)", "Roast (Emporium — premium, reliable)", "Pluk Café (heritage building)"],
    price: "Coffee ฿90–140. Also strong lunch menus.",
    mood: "Chill, mixed crowd, good wifi",
  },
  {
    area: "Old City–Rattanakosin Hidden Gems",
    emoji: "🏯",
    bts: "Sanam Chai MRT or Tha Chang pier",
    highlight: "Pre-tourist-trap. Hole-in-wall cafés near Wat Pho + khlong",
    must: ["The Coffee Gang (Tha Tien pier, river view)", "Cafe de Norasingh (100-yr-old shophouse)", "Phloen Chit Café (rooftop, Saranrom Park)"],
    price: "Budget cafés ฿50–90. Authentic old-Bangkok atmosphere.",
    mood: "Unique, quiet mornings, authentic",
  },
];

export function BangkokCafeHopping() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        ☕ Bangkok café hopping guide — 4 café belts
      </div>
      <div className="space-y-3">
        {CAFE_BELTS.map((belt) => (
          <div key={belt.area} className="border border-amber-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{belt.emoji}</span>
              <div>
                <div className="font-bold text-xs">{belt.area}</div>
                <div className="text-[10px] text-[var(--muted)]">🚉 {belt.bts}</div>
              </div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-1.5 leading-snug">{belt.highlight}</div>
            <div className="space-y-0.5 mb-1.5">
              {belt.must.map((c) => (
                <div key={c} className="text-[10px] flex gap-1.5">
                  <span className="shrink-0 text-amber-600">▸</span>{c}
                </div>
              ))}
            </div>
            <div className="text-[10px] text-green-700 mb-0.5">{belt.price}</div>
            <div className="text-[10px] text-[var(--muted)]">Vibe: {belt.mood}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
