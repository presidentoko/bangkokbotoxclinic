const STUDIOS = [
  {
    name: "Fashion Sewing Classes at Bangkok Studios",
    emoji: "🪡",
    area: "Siam, Chatuchak, Ari — sewing studio clusters",
    price: "Beginner course ฿3,000–8,000 (10–15 hours); Single session ฿500–1,500",
    why: "Bangkok's fashion industry and the city's position as a regional textile hub creates a strong foundation for sewing education. Fabric and notions are extremely affordable (Pahurat fabric market, Chatuchak fabric section) — making sewing a practical hobby in Bangkok. Studios teach pattern cutting, machine operation, garment construction, and alterations. For expats, the ability to have custom-fit clothes made for a fraction of Western prices is a major Bangkok advantage.",
    tip: "Pahurat Market (Little India, near Chinatown) is Bangkok's wholesale fabric district — the same quality fabrics used by Bangkok's fashion designers available by the meter. Visit Pahurat before your sewing class to select fabrics. Cotton batik and silk are regional specialties available at prices unavailable elsewhere. Bring a Thai friend or translation app — most vendors speak limited English.",
  },
  {
    name: "Thai Silk Weaving & Traditional Textile",
    emoji: "🎀",
    area: "Jim Thompson House (Siam), Khon Kaen province for deep study",
    price: "Jim Thompson demonstrations: free with museum entry (฿200); Weaving course ฿2,000–10,000",
    why: "Thai silk weaving (mudmee silk, ikat patterns, khit supplementary weft) is a traditional craft that Bangkok treats as a luxury product. Jim Thompson House preserves and demonstrates traditional silk weaving alongside the fashion legacy of Jim Thompson. For serious study of Thai textile techniques, weaving villages in Khon Kaen (Northeastern Thailand) offer immersive courses — typically 3–5 days with village families.",
    tip: "Thai silk identification: genuine Thai silk has a dry, slightly textured feel and reflects light differently from each angle (iridescent quality). Many 'Thai silk' products in tourist markets are synthetic or Chinese silk printed with Thai patterns. Jim Thompson brand silk is certified authentic but luxury-priced. The Queen Sirikit Museum of Textiles (inside Grand Palace complex) has the most comprehensive Thai textile collection.",
  },
  {
    name: "Tailoring & Alterations — Bangkok's Bespoke Scene",
    emoji: "✂️",
    area: "Silom/Surawong (suit tailoring), Sukhumvit (English-speaking tailors)",
    price: "Suit ฿5,000–25,000; Dress ฿2,000–8,000; Shirt ฿800–2,500",
    why: "Bangkok's custom tailoring is world-class at accessible prices — a bespoke wool suit in Bangkok costs ฿8,000–15,000 versus ฿150,000–500,000 in London or Milan. The Silom and Surawong area has the highest concentration of quality tailors. The 24-hour turnaround '24-hour tailor' shops near Khao San Road exist but use lower quality fabrics and rushing. Quality tailors require 3–7 days and 2–3 fittings.",
    tip: "The difference between a tourist tailor and a professional: professional tailors ask about how you carry your shoulders, whether you have one arm longer than the other, and measure 20+ points. Tourist tailors measure chest, waist, inseam. For suits: allow 5+ days, specify fabric weight appropriate for your home climate (Bangkok tailors are expert at this). Bring a well-fitting reference garment for the tailor to analyze the pattern.",
  },
];

export function BangkokSewingClass() {
  return (
    <div className="rounded-2xl border border-purple-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-purple-700 mb-3">
        🪡 Sewing in Bangkok — fashion classes, Thai silk weaving & bespoke tailoring
      </h2>
      <div className="space-y-2">
        {STUDIOS.map((s) => (
          <div key={s.name} className="border border-purple-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-purple-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
