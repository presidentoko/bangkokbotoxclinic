const ZONES = [
  {
    name: "Platinum Fashion Mall — Shoe Floors",
    emoji: "👟",
    area: "Phetchaburi Rd (Pratunam BTS)",
    price: "฿200–800 per pair",
    bestFor: "Women's fashion shoes, heels, sandals, trendy sneakers",
    floors: "Floors 2–3 have the most shoe vendors",
    tip: "Wholesale quantities get better prices. Even single pairs often come at near-wholesale. Try everything on — sizing runs small.",
  },
  {
    name: "Chatuchak Market — Section 26 (Shoes)",
    emoji: "👠",
    area: "Chatuchak (Mo Chit BTS) — weekends only",
    price: "฿100–600",
    bestFor: "Vintage shoes, unique styles, handmade leather sandals, quirky boots",
    floors: "Section 26 near Section 22 — use map at entrance gate",
    tip: "Weekend mornings only. Handmade leather sandals are the best buy here — custom sizing and color for ฿300–500.",
  },
  {
    name: "MBK Center — Branded Sneakers",
    emoji: "👟",
    area: "National Stadium BTS",
    price: "฿1,500–4,000 (authenticity varies)",
    bestFor: "Nike, Adidas, New Balance — mix of authentic, gray-market, and replicas",
    floors: "Ground floor and Floor 1",
    tip: "Authenticity is not guaranteed at market-stall vendors. Department stores within MBK (Tokyu, etc.) sell genuine branded items.",
  },
  {
    name: "Central Embassy / EmQuartier — Luxury",
    emoji: "👞",
    area: "Phrom Phong BTS",
    price: "฿5,000–50,000+ (authentic luxury brands)",
    bestFor: "Authentic luxury footwear — Gucci, Prada, Jimmy Choo, Thai designer brands",
    floors: "Ground floor and Level 1",
    tip: "Thai luxury shoe brands like Kloset and Flynow offer quality comparable to European brands at 30–50% lower prices.",
  },
];

export function BangkokShoeShops() {
  return (
    <div className="rounded-2xl border border-rose-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-rose-700 mb-3">
        👟 Bangkok shoe shopping — from ฿100 market finds to luxury boutiques
      </h2>
      <div className="space-y-2">
        {ZONES.map((z) => (
          <div key={z.name} className="border border-rose-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{z.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{z.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{z.area} · {z.floors}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{z.price}</span>
            </div>
            <div className="text-[10px] text-rose-700 mb-0.5">🎯 {z.bestFor}</div>
            <div className="text-[10px] text-orange-600">💡 {z.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
