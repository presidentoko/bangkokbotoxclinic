const OPTIONS = [
  {
    name: "Jim Thompson Flagship Store",
    emoji: "🏺",
    area: "National Stadium BTS (adjacent to National Museum)",
    price: "Silk ties ฿1,500–3,000, Scarves ฿2,000–8,000, Fabric/meter ฿1,200–4,000",
    quality: "Premium quality — internationally recognized",
    why: "The brand that reintroduced Thai silk to the world. High quality, beautiful patterns, premium finishing. Silk ties and scarves here are internationally accepted luxury gifts.",
    tip: "Factory outlet at Jim Thompson factory (Sukhumvit area) has same quality at 30–40% lower price. Check online for outlet location — sometimes moves.",
  },
  {
    name: "Chatuchak Section 24 (Silk & Fabric Zone)",
    emoji: "🧵",
    area: "Chatuchak Weekend Market, Section 24",
    price: "Silk fabric ฿200–800/meter (varies by quality), Scarves ฿200–600",
    quality: "Mixed — verify 'pure silk' with burn test if needed",
    why: "Buy raw Thai silk fabric at market prices. Much cheaper than branded stores. Wide range of designs: traditional patterns, contemporary, solid colors.",
    tip: "Real silk burns with smell of burning hair and leaves ash. Synthetic burns like plastic. Ask vendors to let you burn a thread. Section 24 opens 9am–6pm Sat–Sun only.",
  },
  {
    name: "Pak Klong Talat (Flower Market Silk)",
    emoji: "🌸",
    area: "Near Saphan Phut, Charoenkrung area",
    price: "Traditional Thai silk ฿150–600/meter",
    quality: "Authentic, less curated than department stores",
    why: "Bangkok's riverside wholesale market area has silk vendors mixed among flower stalls. Handwoven Thai silk at near-wholesale prices for people who know what they're buying.",
    tip: "Best time 6–9am when market is most active. Bargain expected — initial prices often 30% high. Bring fabric swatches of colors you need for matching.",
  },
  {
    name: "Surawong Road Fabric District",
    emoji: "📐",
    area: "Surawong Road, between Silom and Riverside",
    price: "Fabric ฿100–500/meter, Tailoring available",
    quality: "Good — this is where Bangkok's tailors source their fabric",
    why: "Bangkok's fabric and tailoring district. Full roll fabric at wholesale prices. Many shops offer same-day tailoring. Perfect for custom suits, shirts, or traditional Thai outfits.",
    tip: "Negotiate hard — prices here are for tailors buying in bulk. If buying 5+ meters, expect 20–30% discount. Bring measurements if wanting custom items.",
  },
];

export function BangkokSilkShopping() {
  return (
    <div className="rounded-2xl border border-fuchsia-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-fuchsia-700 mb-3">
        🧵 Thai silk shopping in Bangkok — from Jim Thompson to market prices
      </h2>
      <div className="space-y-2">
        {OPTIONS.map((o) => (
          <div key={o.name} className="border border-fuchsia-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{o.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{o.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{o.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{o.price}</span>
            </div>
            <div className="text-[10px] text-fuchsia-700 mb-0.5">Quality: {o.quality}</div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{o.why}</div>
            <div className="text-[10px] text-orange-600">💡 {o.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
