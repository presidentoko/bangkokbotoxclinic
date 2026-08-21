const SPOTS = [
  {
    name: "Whisky Bars & Single Malt Culture in Bangkok",
    emoji: "🥃",
    area: "Thonglor whisky bars, Ekkamai (HQ Bar, The Spirits Lab), Silom (Abar, Vesper), luxury hotel bars",
    price: "Single malt dram ฿400–3,000+; Whisky tasting event ฿1,500–5,000; Club membership ฿10,000–80,000/year",
    why: "Bangkok has one of Southeast Asia's most sophisticated whisky cultures — paradoxically, because Thailand's domestic spirits market is dominated by blended whisky (Johnnie Walker, Ruang Khao, Blend 285) and rum-based Thai whisky (Ruangkhao, SangSom), the imported single malt scene has developed as a premium counter-culture. Bangkok has specialist whisky bars stocking hundreds of expressions — the Malt Bar at HQ, Abar in Silom, and hotel bar programs at the Oriental, Capella, and Four Seasons. Scotch whisky dominates the Bangkok premium market, but Japanese whisky (Yamazaki, Nikka, Chichibu) has explosive growth given Bangkok's large Japanese expat community.",
    tip: "Bangkok whisky market specifics: import duties and excise tax make whisky significantly more expensive in Bangkok than at Singapore Changi or Korean duty-free — prices at Bangkok bars reflect this. For collectors: Bangkok's whisky specialist shops (primarily in Sukhumvit and Thonglor) stock limited releases and allocated bottles at prices that have risen with Asia's whisky boom — some bottles now command significant premiums above MSRP. Japanese whisky specifically: Bangkok's Japanese restaurant and bar circuit has access to allocations that don't reach other markets — smaller Japanese distilleries' products appear in Bangkok's Japanese-centric establishments before wider regional distribution. Whisky events: Bangkok hosts whisky expos and brand-hosted tastings regularly — Johnnie Walker Blue experiences, Scotch Malt Whisky Society events, and independent bottler tastings appear throughout the year.",
  },
  {
    name: "Thai Craft Spirits & Local Distilling",
    emoji: "🍶",
    area: "Craft spirit bars (Thonglor, Ekkamai), Mekhong Rum heritage venues, craft gin producers",
    price: "Craft Thai gin cocktail ฿350–700; Craft spirits retail ฿800–3,000; Distillery tour varies",
    why: "Thailand's craft spirits scene has grown dramatically — craft gin distilleries using Thai botanicals (kaffir lime, lemongrass, galangal, blue pea flower, holy basil) have proliferated since regulatory changes opened space for smaller producers. Bangkok craft gin brands (Chalong Bay from Phuket, Iron Balls Gin from Bangkok, And The Coconut from Thai coconuts) have achieved international recognition and are available in Bangkok bars at prices reflecting their premium positioning. Thai rum is the oldest domestic spirit tradition — Mekhong (technically a sugarcane-and-rice spirit marketed as rum, quite sweet and light) is the heritage expression, while newer craft rums from sugarcane provinces are emerging. Craft vodka, whisky, and baijiu-influenced spirits from Thai producers represent the experimental edge of the scene.",
    tip: "Bangkok craft spirits to know: Iron Balls Gin (made in Bangkok, uses Thai botanicals, notable citrus-forward profile) is the most internationally recognized Bangkok craft gin — available at most Bangkok specialty bars. Craft gin food pairing: Bangkok's Thai-botanical gins pair distinctively with Thai food in gin and tonics — the citrus and aromatic notes complement Thai cuisine's brightness. For bar programs: Bangkok bartenders are among Southeast Asia's most creative with Thai ingredient usage — some bars run in-house fermentation and distillation experiments accessible through tastings and menu innovation programs. Mekhong cocktails: several Bangkok bars have developed cocktail programs built around Mekhong as a base spirit rather than treating it as a budget mixer — the rum-whisky hybrid character creates distinctive cocktail possibilities.",
  },
  {
    name: "Sake & Asian Wine in Bangkok",
    emoji: "🍱",
    area: "Japanese restaurant-bars (Thonglor, Ekkamai, Sathorn Japanese district), sake specialist import shops",
    price: "Sake glass ฿250–900; Premium sake bottle ฿1,500–15,000; Sake pairing menu ฿2,500–8,000",
    why: "Bangkok's Japanese community sustains a genuine sake culture — Japanese restaurants (particularly omakase and kaiseki level) offer sake pairings of genuine depth and import direct from regional Japanese breweries. The sake specialist import scene has grown: several Bangkok importers bring exclusively artisanal sake from small Japanese breweries (rather than just major commercial brands), accessible through specialist bars and restaurants. Chinese baijiu culture appears in Bangkok through the Chinese business community — Maotai (the prestigious sorghum-based Chinese spirit) is served at formal Chinese business dinners in Bangkok, reflecting Bangkok's position as a significant Chinese business diaspora hub. Korean makgeolli and soju have gained ground with Bangkok's K-culture wave.",
    tip: "Bangkok sake quality indicators: temperature service is the clearest quality marker — serious sake bars serve specific styles at specific temperatures (junmai daiginjo at 8–10°C, some aged sake warmed to 45°C) rather than serving all sake cold. Sake vocabulary for Bangkok bars: nihonshu-do (sake meter value, indicating dryness), SMV, and the rice polishing ratio (seimaibuai) are useful terms when ordering — knowledgeable Bangkok sake bars will engage with these details. Rice wine alternatives: Thai sake equivalent? The closest is lao khao (Thai rice whisky, distilled rather than fermented, very different from sake) and rice-fermented drinks in rural traditions — these are domestic cultural artifacts rather than restaurant beverages. Chinese sake equivalent: huangjiu (Chinese rice wine, amber-colored, savory-sweet, used in cooking and as ritual wine) appears at some Bangkok Chinese restaurants.",
  },
];

export function BangkokWhiskey() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-amber-800 mb-3">
        🥃 Whisky, craft spirits & sake in Bangkok — single malt bars, Thai gin & Japanese sake
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-amber-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-amber-800">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
