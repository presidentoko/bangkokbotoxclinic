const SPOTS = [
  {
    name: "Queen Sirikit Botanic Garden at Bangkok Botanical Garden",
    emoji: "🌸",
    area: "Ramkhamhaeng area, Bangkok (main); Queen Sirikit Botanical Garden (Chiang Mai)",
    price: "Bangkok parks free; Chiang Mai Botanical Garden ฿100–200",
    why: "Thailand is the world's largest orchid exporter — the orchid industry here is enormous and world-class. Thai orchid species include thousands of native varieties plus commercially cultivated hybrids. Bangkok itself has several botanical garden sections and plant nurseries specializing in orchids. The Chatuchak Weekend Market (Sunday) has an orchid vendor section with extraordinary variety. Thailand's tropical climate allows for outdoor orchid cultivation year-round, producing the density of flowering not possible in temperate climate collections.",
    tip: "Bangkok orchid sources: Chatuchak Weekend Market (Sunday morning) has the most accessible orchid variety at market prices. The Pak Klong Talad (flower market, open 24hrs near Memorial Bridge) has fresh-cut orchid stems at wholesale prices — garlands of Dendrobium orchids (used for Buddhist offerings) at ฿20–50. For potted orchids to bring home: Chatuchak vendors pack plants appropriately for travel; check airline rules on plant import (soil-free bare-root orchids are often permitted but regulations vary by destination country).",
  },
  {
    name: "Nong Nooch Tropical Garden — Orchid Collection",
    emoji: "🌴",
    area: "Nong Nooch, Pattaya (2 hrs from Bangkok)",
    price: "Entry ฿600–800 including Thai cultural show",
    why: "Nong Nooch Tropical Garden near Pattaya has one of Southeast Asia's most extensive orchid collections alongside 640 acres of topiary, cactus gardens, French formal gardens, and tropical jungle gardens. The orchid house contains thousands of species organized by genus. The Thai cultural performance (elephant show, classical dance, traditional Thai sport demonstrations) is included in admission. The botanic collection's quality — maintained by dedicated horticultural staff — is genuinely impressive for tropical plant enthusiasts.",
    tip: "Nong Nooch practical: arrange transport from Bangkok or Pattaya (most visitors go as a day trip from Pattaya base). The garden opens at 8am — arrive early to see the orchid house before midday heat. Budget a full day (4–6 hours for thorough exploration). The Japanese garden section and French formal garden are among the highlights beyond the orchid collection. Photography inside the orchid house is permitted and genuinely rewarding — macro lens or phone portrait mode catches the orchid detail beautifully.",
  },
  {
    name: "Bangkok's Floating Flower Market — Taling Chan",
    emoji: "🚣",
    area: "Taling Chan Floating Market, west Bangkok (near Chao Phraya)",
    price: "Entry free; Flowers ฿20–500",
    why: "The Taling Chan Floating Market (weekend only, 8am–4pm) includes flower vendors selling from boats on the canal adjacent to the market. Fresh orchid plants, cut flower bundles, tropical plant starts, and ornamental plants sold from boat stalls by canal-side vendors. The floating market experience (buying from a boat, vendors calling prices over the water, canal smell and breeze) provides context that garden center shopping lacks. Taling Chan is also Bangkok's most authentic floating market for fresh food — seafood and traditional Thai snacks dominate alongside the flowers.",
    tip: "Taling Chan timing: arrive between 8–10am for the fullest flower selection and least crowded boat access. The floating plant vendors (botanicals sold from canal boats) move position throughout the morning — getting close requires small boat rides (available at ฿30–50 for trips along the canal). The fresh flower garlands sold here (marigold, jasmine, lotus) are the same used for Buddhist temple offerings — buying some to offer at a nearby temple combines the flower market and temple experience meaningfully.",
  },
];

export function BangkokOrchidGarden() {
  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-pink-700 mb-3">
        🌸 Orchid gardens in Bangkok — Chatuchak flowers, Nong Nooch & Taling Chan floating market
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-pink-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-pink-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
