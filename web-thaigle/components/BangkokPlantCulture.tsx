const SPOTS = [
  {
    name: "Bangkok's Plant Market Culture",
    emoji: "🌿",
    area: "Chatuchak Plant Market (JJ Market Section 2–3), Or Tor Kor Market plant vendors, Pak Khlong Talat",
    price: "Common tropical plant ฿50–500; Rare aroid ฿500–50,000+; Orchid ฿100–5,000",
    why: "Bangkok has an extraordinary plant culture — the Chatuchak Weekend Market's plant section is one of Asia's largest plant markets, concentrating dozens of vendors selling everything from common tropical plants to rare collector aroids, carnivorous plants, aquatic plants, and sought-after orchids. Thailand's tropical climate produces a stunning range of plants — Monstera, Philodendron, Anthurium, Hoya, Alocasia, and other aroids that have become globally sought-after as houseplants grow prolifically here. Bangkok experienced a plant collecting boom during 2020–2022 (coinciding with global houseplant trends) that created a speculative market in rare aroids — prices have since normalized but the collector community remains active. Orchid culture is deeply Thai: Thailand is one of the world's largest orchid exporters, and Bangkok's orchid markets show the full depth of Thailand's expertise.",
    tip: "Chatuchak plant market timing: the plant sections are most active Saturday and Sunday mornings (7–11am) — arrive early for the widest selection and best prices before heat sets in. Buying aroids in Bangkok: the variance in plant quality is significant — check for root rot, pest damage, and variegation stability on variegated plants before purchasing. Export considerations: Thailand's plant export regulations require phytosanitary certificates for plants leaving the country — buying cleaned/bare-root plants facilitates export, but check your destination country's import regulations (especially EU, US, and Australia which have strict biosecurity). Bangkok orchid markets: the flower markets (Pak Khlong Talat) carry cut orchids at extremely low prices for decoration; the Chatuchak plant section carries potted orchid species and hybrids for growing.",
  },
  {
    name: "Aquatic Plants & Fish Keeping",
    emoji: "🐠",
    area: "Chatuchak aquatic section, Lat Phrao aquarium district, Jatujak aquatic plant shops",
    price: "Common aquarium plant ฿50–300; Rare tissue culture plant ฿200–2,000; Aquarium fish ฿20–5,000+",
    why: "Bangkok has a world-class aquatic plant and fish keeping community — the Chatuchak Market's aquatic section contains dozens of shops selling aquarium plants, freshwater fish, marine species, shrimp, and aquascaping materials. Thailand is a major exporter of ornamental fish (Bangkok is sometimes called the world capital of tropical fish export) and aquarium plants. The aquascaping hobby (creating naturalistic planted aquarium landscapes, inspired by Takashi Amano's Nature Aquarium style) has a strong Bangkok community. Bangkok's freshwater fish diversity is remarkable — rare wild-caught species from Thailand's rivers, Southeast Asian imports, and selectively bred Thai-specific varieties (including multiple Betta splendens varieties developed by Thai breeders).",
    tip: "Bangkok aquarium plant sourcing: the quality of plants at Bangkok's Chatuchak fish section is generally high — plants grow well in Thailand's climate and the vendors maintain healthier stock than many import stores globally. Betta fish in Bangkok: Thailand is the origin country for Betta splendens (Siamese fighting fish) — the variety and quality available in Bangkok (from Show-grade halfmoon and crowntail to unique color morphs) far exceeds what's available in pet shops internationally. Aquascape inspiration: Bangkok's aquascaping community organizes competitions and events — the Bangkok Aquascape competition (annual) displays sophisticated planted aquarium art. For export of aquarium fish: commercial export is the domain of licensed fish exporters, but personal transport of small quantities in airline-approved containers is possible — confirm regulations for destination country.",
  },
  {
    name: "Bonsai & Garden Arts in Bangkok",
    emoji: "🌳",
    area: "Chatuchak bonsai section, specialist bonsai nurseries (outskirts of Bangkok), garden supply shops",
    price: "Starter bonsai ฿500–3,000; Mature trained bonsai ฿5,000–200,000+; Tools set ฿1,500–8,000",
    why: "Bonsai culture in Bangkok draws from both Chinese (penjing tradition) and Japanese (bonsai) influences — Bangkok has practitioners trained in both lineages. The Thai climate both advantages and challenges bonsai cultivation: tropical species thrive (Ficus, Bougainvillea, Casuarina, Adenium/Desert Rose), while temperate Japanese-style bonsai varieties (pine, maple, juniper) require special management in Bangkok's heat. Bangkok bonsai nurseries outside the city center (Nakhon Pathom province nearby is notable) maintain mature specimen trees. Garden design in Bangkok intersects traditional Thai garden aesthetics (formal, geometric, with specific auspicious tree species) with contemporary tropical design. Landscape architects operate in Bangkok at international standard for private villa and hotel garden projects.",
    tip: "Bangkok bonsai community: the Bonsai Society of Thailand holds regular exhibitions and workshops — the annual Bangkok Bonsai Exhibition at Queen Sirikit National Convention Center brings collectors and practitioners together. For tropical bonsai specifically: Ficus species (particularly Ficus microcarpa and F. benjamina) and Bougainvillea are the most forgiving tropical Bangkok bonsai subjects — they tolerate Bangkok's heat, recover well from pruning, and develop interesting bark and nebari (root spread). Bonsai tools: Japanese bonsai tools are available at Bangkok specialty shops at lower prices than importing — Chatuchak market's garden section stocks basic concave cutters, Jin pliers, and root rakes. Desert Rose (Adenium): highly popular in Bangkok with spectacular flower colors and caudex trunk development — shows strong collector community activity in Bangkok.",
  },
];

export function BangkokPlantCulture() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🌿 Plant culture in Bangkok — markets, aquascaping, bonsai & tropical plant collecting
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-green-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-green-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
