const INFO = [
  {
    name: "Bangkok Bonsai Markets & Gardens",
    emoji: "🌳",
    area: "Chatuchak Weekend Market (Section 3–4), Ratchaphruek garden market",
    price: "Entry bonsai ฿200–1,000; Mature specimens ฿5,000–50,000+",
    why: "Thailand has a substantial bonsai and tropical plant cultivation culture — Bangkok's Chatuchak Weekend Market has an entire bonsai and ornamental plant section (sections 3 and 4) with hundreds of vendors selling trees in various stages of development. Thai bonsai culture incorporates regional tropical species not seen in Japanese bonsai — tamarind, Indian almond, ficus species, and Thai juniper varieties. Bangkok's climate (warm, humid, 12-month growing season) actually allows faster bonsai development than temperate climates.",
    tip: "Buying bonsai at Chatuchak: arrive Saturday morning when selection is fullest. Ask the vendor about the tree's age (species + style determine value independently of size — a 20-year tamarind may be smaller than a 5-year ficus). Thai bonsai vendors often speak limited English but will demonstrate the wiring and pruning techniques used on specific trees. Bring a box or bag rated for the pot weight — some Chatuchak bonsai pots are ceramic and heavy.",
  },
  {
    name: "Tropical Terrariums & Plant Culture",
    emoji: "🪴",
    area: "Ekkamai, Ari, Chatuchak — plant shop cafés",
    price: "Terrarium workshop ฿500–1,500; Plants ฿100–5,000",
    why: "Bangkok's plant culture extends beyond bonsai to a full terrarium and rare tropical plant scene. Aroid collecting (Monstera varieties, Philodendron, Anthurium) is a Bangkok hobby with dedicated Instagram communities and wholesale markets. Terrarium building workshops (Wardian case construction, bioactive setups) run at plant-focused cafés in Ari and Ekkamai. The Bangkok rare plant community is internationally connected — Thai plant collectors source and export to the US and European markets.",
    tip: "Chatuchak plant market on Sunday has Thailand's largest rare tropical plant section — including variegated Monstera, Alocasia species, and Thai-endemic aroids not available outside the region. Plant prices in Bangkok are significantly lower than US/European equivalents for the same cultivars. Bring proper plant packing materials if shipping plants internationally — Thailand's CITES restrictions apply to protected species.",
  },
  {
    name: "Flower Market — Pak Klong Talad",
    emoji: "🌸",
    area: "Pak Klong Talad, near Saphan Phut (Memorial Bridge)",
    price: "Entry free; Flowers ฿20–500/bunch",
    why: "Pak Klong Talad (flower market) is one of Bangkok's most atmospheric experiences — a 24-hour wholesale flower market under Memorial Bridge selling fresh cut flowers in quantities from individual bunches to truck loads. The early morning hours (2–5am) are the most dramatic — trucks arriving from flower farms, monks buying temple flowers, vendor families arranging displays. Lotus flowers, jasmine garlands (for offerings), orchids, roses, and seasonal blooms all present. Bangkok's flower market is functionally important (temple offerings, event decoration, restaurant supply) and visually spectacular.",
    tip: "Best Pak Klong Talad visit time: 2–5am for the wholesale activity, or early morning for individual purchase. Weekday mornings are less crowded than weekends. Bring cash — card payment rare. The lotus flowers and jasmine phuang malai (garlands) sold here supply Bangkok's temple offerings — buying and offering a lotus at a nearby shrine is the most authentically Bangkok experience possible.",
  },
];

export function BangkokBonsai() {
  return (
    <div className="rounded-2xl border border-green-300 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-green-800 mb-3">
        🌳 Bonsai & plants in Bangkok — Chatuchak market, terrariums & Pak Klong flower market
      </div>
      <div className="space-y-2">
        {INFO.map((i) => (
          <div key={i.name} className="border border-green-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{i.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{i.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{i.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{i.why}</div>
            <div className="text-[10px] text-green-800">💡 {i.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
