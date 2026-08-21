const SPOTS = [
  {
    name: "Italian Restaurants & Pasta Culture",
    emoji: "🍝",
    area: "Sukhumvit (multiple soi), Ekkamai, Silom, hotel restaurants",
    price: "Pasta mains ฿350–1,200; Pizza ฿350–950; Tasting menu ฿2,000–5,000",
    why: "Italian cuisine has Bangkok's strongest European food presence — driven by Thai enthusiasm for pizza and pasta, the Italian expat community (business, food industry), and the high number of Italian-trained Thai chefs. Bangkok's Italian range is genuinely wide: from Neapolitan pizza with proper wood-fired ovens (certified by Associazione Verace Pizza Napoletana, VPN) to handmade pasta using 00 flour and regional specialties from northern Italy (risotto, polenta) and southern Italy (orecchiette, burrata with San Marzano tomatoes). The quality ceiling is impressive — some Bangkok Italian restaurants rival Roman trattorie.",
    tip: "Evaluating Bangkok Italian: pizza is the clearest quality indicator — VPN-certified Bangkok pizzerias (there are several) use 00 flour, San Marzano tomatoes, fior di latte, and proper oven temperatures. Non-certified pizza is often decent but different. For pasta: house-made pasta (fresh, not dried) restaurants are the premium tier. Burrata: Bangkok imports fresh burrata (and stracciatella) regularly from Italian dairies — the Thai market for authentic Italian dairy has matured significantly. Italian grocery: the imported Italian products available at Gourmet Market at Siam Paragon (San Marzano canned tomatoes, Arborio rice, DOP parmigiano, real Italian prosciutto) allow home replication.",
  },
  {
    name: "Greek Food & Mediterranean Taverna Culture",
    emoji: "🫒",
    area: "Sukhumvit corridor, occasional Greek pop-up events, imported produce shops",
    price: "Mezze platter ฿600–1,200; Grilled fish mains ฿800–2,500",
    why: "Greek food in Bangkok is found at a handful of authentic Greek-owned or Greek-influenced restaurants and through the broader Mediterranean food culture that encompasses it. Moussaka, spanakopita (spinach pie in filo), souvlaki, and proper Greek salad (chunky tomatoes, Kalamata olives, feta cubes, oregano — not shredded lettuce) have dedicated followers in Bangkok's expat community. Greek yogurt culture has been assimilated into Bangkok's health food ecosystem — the thick strained yogurt (sold as 'Greek style' at most Bangkok supermarkets) is standard. Greek olive oil is available at Villa Market and premium supermarkets.",
    tip: "Greek food access in Bangkok: dedicated Greek restaurants are rare — more commonly Greek food appears as part of Mediterranean restaurant menus. The Greek Orthodox community in Bangkok (small) occasionally organizes Greek food events around Easter and Greek National Day (March 25). Greek imported products: Kalamata olives, good Greek olive oil, and genuine feta (DOP certified — must come from Greece) are available at Villa Market and specialty importers. Greek yogurt locally produced to Greek standards: several Bangkok brands produce thick strained yogurt — look for high-fat content (9–10% fat) versions for authentic texture.",
  },
  {
    name: "Seafood & Coastal Mediterranean Cooking",
    emoji: "🦞",
    area: "Riverside fine dining, seafood markets (Samut Prakan), hotel fine dining",
    price: "Fresh seafood market-price ฿200–800/kg; Restaurant seafood ฿400–3,000/dish",
    why: "Mediterranean coastal cooking — whole fish grilled with olive oil and lemon, raw seafood, shellfish preparations — translates well to Bangkok given Thailand's abundant fresh seafood supply. Bangkok restaurants interpreting Mediterranean seafood cooking use Gulf of Thailand fish alongside imported Mediterranean species (branzino/sea bass, dorade/sea bream) for dishes requiring specific flavor profiles. The Thai seafood market tradition (fresh from the boat at Samut Prakan and Mahachai fish markets, 30–60 minutes from Bangkok) provides the raw ingredient access. Several Bangkok restaurants bridge Thai and Mediterranean seafood cooking philosophies.",
    tip: "Best Bangkok seafood: Or Tor Kor Market (fresh produce market opposite Chatuchak) has premium Thai seafood at retail. Samut Prakan's Pak Nam fishing port (30 minutes from Bangkok by BTS) has fresh catch including Gulf shrimp, mud crab, and ocean fish. For Mediterranean-style preparation at home: the key is fresh high-quality fish + quality olive oil + lemon + minimal intervention. Bangkok's olive oil access has improved — Goya, Carbonell, and some smaller Italian and Spanish imports are available. For restaurant Mediterranean seafood: Bangkok's hotel restaurants (particularly along the river) often do the most technically accurate European seafood preparations.",
  },
];

export function BangkokMediterraneanFood() {
  return (
    <div className="rounded-2xl border border-cyan-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-cyan-700 mb-3">
        🫒 Mediterranean food in Bangkok — Italian pasta, Greek mezze & fresh seafood
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-cyan-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-cyan-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
