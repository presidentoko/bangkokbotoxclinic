const SPOTS = [
  {
    name: "Reptile & Amphibian Watching in Thailand",
    emoji: "🦎",
    area: "Kaeng Krachan National Park, Khao Yai, Bang Kachao (Bangkok's green lung), mangroves along the coast, flooded rice paddies in season",
    price: "Guided herping tour ฿1,500–4,000; Transport to sites ฿500–1,500; National Park entry ฿100–300 (foreigners ฿200–600)",
    why: "Thailand is a herpetological treasure — the country hosts over 350 snake species (including 60+ venomous species), 150+ lizard species, numerous crocodilian populations (wild and managed), and exceptional diversity of frogs and salamanders. Bangkok itself, despite being a megacity, harbors significant reptile diversity in its parks and canals: water monitors (Varanus salvator) are visible throughout the city in canals and parks reaching 2+ meters in length, house geckos of multiple species inhabit virtually every building, and the green parks in and around Bangkok host Asian vine snakes, rat snakes, and other species. For serious herpers, the night road-cruising method (driving slowly along rural roads after dark in search of basking/crossing reptiles) is the most productive method for finding diverse species. Thailand's snake diversity is regionally unparalleled — finding 20+ species in a 3-day guided herping trip in the right forest areas is achievable.",
    tip: "Bangkok urban herping: the Bang Kachao green area (accessible by boat from Klong Toei pier) offers genuine nature access within Bangkok — water monitors, various lizards, and occasionally snakes are visible along the canal paths. Safety: Thailand has medically significant venomous snakes including the Monocled Cobra (Naja kaouthia), Malayan Pit Viper, and Russell's Viper — always wear closed footwear at night, never reach into vegetation without visual inspection, and familiarize yourself with basic dangerous species identification before venturing into rural areas. Photographic herping: Thailand's reptile diversity makes it one of the world's premier destinations for wildlife photography — many species are strikingly beautiful and photogenic. Herping guides: connecting with Thailand-based professional herping guides through Facebook groups (Thailand Herps, specific national park pages) provides access to expert local knowledge about current locations and activity periods.",
  },
  {
    name: "Urban Wildlife in Bangkok",
    emoji: "🦅",
    area: "Lumpini Park, Chatuchak Park, Bang Kachao, canal systems throughout Bangkok, Bang Pu (migratory shorebird site)",
    price: "Free (public parks); Binoculars rental ฿100–300; Guided urban wildlife walk ฿500–1,500",
    why: "Bangkok supports surprisingly diverse urban wildlife that rewards curious observers — the city's canal system, parks, and green corridors provide habitat corridors for wildlife that persists despite urbanization. Key Bangkok urban wildlife: (1) Water monitors (Varanus salvator) — the world's second-largest lizard species, visible throughout Bangkok's canals and parks in sizes from hatchlings to 2-meter adults; (2) Long-tailed Macaques — troops inhabit temple grounds and park edges, with the largest urban population around some Bangkok temples; (3) Black-crowned Night Herons, Purple Herons, and Kingfishers fish the canals throughout Bangkok year-round; (4) Brahminy Kites, Black Kites, and Spotted Owlets are the common urban raptors; (5) Irregular cetacean visitors — irrawaddy dolphins have been recorded in the Chao Phraya river within Bangkok in unusual years. Bang Pu (eastern coast, 1 hour) is the premier site for migratory shorebirds November–March with 30,000+ birds.",
    tip: "Bangkok wildlife watching practical guide: (1) Lumpini Park at dawn (5:30–7:30am) is the single best urban wildlife hour in Bangkok — water monitor activity peaks, bird life is most active, and park visitor density is lowest; (2) Canal boat tours (Khlong Saen Saep express boats) incidentally pass water monitor habitat; (3) Bang Kachao by bicycle on a weekday morning combines cycling tourism with genuine wildlife encounter — the mangrove and orchard landscape supports species not found in central Bangkok; (4) Thailand's temple grounds — particularly older, tree-rich wats in Bangkok — often support distinct wildlife communities including small snake species, geckos, and nesting waterbirds. Photography: Bangkok's urban wildlife is often surprisingly tolerant of approach, particularly water monitors that are accustomed to human presence in parks.",
  },
  {
    name: "Thailand Insect Fauna — Butterflies & More",
    emoji: "🦋",
    area: "Kaeng Krachan (Thailand's largest butterfly diversity), Doi Inthanon (highland species), Khao Yai, and urban parks with flowering plants",
    price: "Butterfly observation is free; Guided entomology tour ฿1,000–3,000; Photography workshop ฿2,000–5,000",
    why: "Thailand's insect diversity is staggering — the country hosts over 1,200 butterfly species (for comparison, the entire European continent has ~500 species), with Kaeng Krachan National Park alone recording 300+ species. Thai butterfly diversity reflects the country's position at the intersection of multiple biogeographic zones (Indian subcontinent, mainland Southeast Asia, Sundaland) creating exceptional species richness. The large and spectacular species make Thai butterflies particularly rewarding to observe: Birdwing butterflies (Troides species) with 15–20cm wingspans, dozens of swallowtail species, endemic species found nowhere else. Bangkok's parks support urban butterfly communities — even Lumpini Park records 50+ species. Beyond butterflies: Thailand's beetle, moth, stick insect, and cicada diversity is equally exceptional — night light-trapping (setting up a white sheet with UV light after dark) in any forested area in Thailand produces extraordinary diversity.",
    tip: "Bangkok butterfly timing: the dry season transition periods (October–November, March–April) often concentrate butterflies around water sources and blooming plants. The best accessible Bangkok butterfly site is the area around Benchakitti Park's lakeside vegetation, which supports a mix of common urban species. Insect eating context: Thailand's relationship with insects as food (grasshoppers, silkworm pupae, bamboo caterpillars sold at markets throughout Bangkok) means the cultural relationship with insect diversity is complex — food insects vs. observed wildlife species involve different Thai attitudes. Kaeng Krachan Butterfly Festival (typically March): this annual event brings butterfly researchers and enthusiasts to Thailand's premier butterfly site — coinciding with this is optimal for concentrated butterfly diversity.",
  },
];

export function BangkokHerping() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🦎 Bangkok wildlife & herping — reptiles, urban wildlife & Thailand's insect diversity
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-green-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-green-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
