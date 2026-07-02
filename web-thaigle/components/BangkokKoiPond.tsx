const SPOTS = [
  {
    name: "Koi Keeping & Thai Ornamental Fish Culture",
    emoji: "🐟",
    area: "Chatuchak Weekend Market (largest ornamental fish section in Asia), JJ Green flea market (adjacent to Chatuchak), specialized koi shops in Bang Na, Lat Phrao, and Ramkhamhaeng areas",
    price: "Entry-level koi: ฿200–2,000; Quality koi: ฿5,000–50,000+; Premium import koi: ฿50,000–500,000+; Koi food: ฿150–1,500/bag; Pond equipment: ฿3,000–100,000+",
    why: "Bangkok has an enormous ornamental fish culture — particularly koi keeping — that most tourists are entirely unaware of. Thailand is one of Southeast Asia's leading ornamental fish producers and exporters, with significant koi breeding operations and a well-established hobbyist community. The Chatuchak Weekend Market's ornamental fish section is legendary in Asia — dozens of vendors selling everything from entry-level goldfish to ultra-premium Japanese-import koi, with an enormous variety of tropical fish, cichlids, fighting fish (plakat — a uniquely Thai fighter fish culture dating centuries), and ornamental shrimp. Bangkok's koi hobbyist community is active and passionate — koi shows, club meetings, and high-end pond installations in Bangkok homes and businesses represent a significant leisure economy. Thai culture has long incorporated fish as auspicious creatures — the relationship between Buddhist merit-making (releasing fish into rivers is a common merit-making activity) and ornamental fish culture creates a unique cultural dimension to Bangkok's fish hobby scene.",
    tip: "Bangkok koi and ornamental fish exploration: (1) Chatuchak Weekend Market Section 11 is the primary ornamental fish area — arrive early (gates open 6am) to see the full stock before it sells; (2) Fighting fish (plakat/betta): Thailand's unique contribution to ornamental fish culture — genuine plakat fighters (traditional long-fin fighting variants) differ significantly from the Siamese fighting fish sold in pet stores worldwide; seeking out genuine plakat breeders at Chatuchak reveals Thai aquaculture heritage; (3) Koi shows: Bangkok hosts periodic koi shows where enthusiasts display prized specimens — often held at major convention centers; checking the Thai Koi Hobbyist Association Facebook group for schedule; (4) Bringing fish internationally: ornamental fish can be exported from Thailand with proper documentation — specialist aquarium shippers in Bangkok can arrange this; (5) Aquascape culture: alongside koi, Bangkok has a strong aquascape (planted aquarium) community; ADA-inspired setups, hardscape rockwork, and competition aquascaping are active hobby areas with dedicated specialty shops.",
  },
  {
    name: "Bangkok's Weekend Market Exotic Pet Culture",
    emoji: "🦎",
    area: "Chatuchak Weekend Market (ornamental fish, birds, reptiles — though exotic wildlife trade is illegal and violations do occur), Pahonyothin area specialty pet shops, dedicated exotic pet stores in Lat Phrao",
    price: "Ornamental birds: ฿300–50,000+; Reptiles (legal species): ฿500–20,000+; Exotic mammal pets (legal species): varies; Specialty pet food: ฿200–5,000",
    why: "Bangkok's Chatuchak Weekend Market has long been associated with exotic animal trade — a reality that requires significant ethical nuance for visitors. The legitimate side: Thailand has a well-developed culture of ornamental bird keeping (sugar gliders, parakeets, cockatiels, Asian songbirds), legal reptile breeding (ball pythons, leopard geckos, bearded dragons), and ornamental fish that represents a genuine and legal hobby culture. The problematic side: illegal wildlife trade has historically occurred at and around Chatuchak, with protected species (primates, slow lorises, certain reptiles and birds) occasionally offered illegally. Thai law has strengthened enforcement significantly, but vigilance by visitors means: (1) never purchasing any species you cannot verify is legally captive-bred, (2) never purchasing any primate, slow loris, or obviously wild-caught animal, (3) reporting suspicious wildlife trade to TRAFFIC or Thai wildlife authorities. Engaging with the legitimate ornamental pet culture while being aware of the ethical landscape creates a more responsible visitor experience.",
    tip: "Bangkok pet market navigation: (1) Stick to obviously captive-bred ornamental fish, common parrot/parakeet species, and well-known legal reptile species if you want to buy anything; (2) The 'slow loris selfie' or any offered interaction with nocturnal primates is almost certainly illegal and harmful — these animals suffer extreme stress from public interaction; (3) Thai bird keeping culture: the decorative bird cage culture (elaborately painted bamboo cages) is a legitimate craft tradition — bird cages as decorative objects are sold throughout Bangkok markets and are appropriate souvenirs; (4) Sugar gliders: sold legally in Bangkok but with welfare concerns — the lifespan in poor conditions is severely reduced; (5) Documentation matters: any reptile, bird, or mammal purchased in Bangkok for export requires CITES documentation; without it, confiscation at customs is likely.",
  },
  {
    name: "Bangkok Pet Cafés & Animal Interaction Culture",
    emoji: "🐈",
    area: "Cat cafés throughout Bangkok (Silom, Thonglor, Ari areas), dog cafés, rabbit cafés, bird cafés, reptile-theme cafés, and interactive animal encounter businesses throughout the city",
    price: "Cat café entry: ฿100–200 (includes drink); Dog café: ฿150–300; Rabbit café: ฿150–250; Exotic pet café: ฿200–400; Standard café pricing for food and drinks",
    why: "Bangkok has an enthusiastic pet café culture — particularly cat cafés, which have proliferated significantly throughout the city's café landscape. The cat café concept imported from Japan (and popular in Taiwan and Korea) has been thoroughly adopted and adapted by Bangkok's café culture — Bangkok now has dozens of cat cafés ranging from small neighborhood spots with 5–10 cats to elaborate themed multi-story spaces with 30+ cats, specialty food menus, and Instagram-optimized aesthetics. Beyond cats, Bangkok has dog cafés (typically adopt-able dogs from rescue organizations — with a noble welfare angle), rabbit cafés, and more exotic variants. The ethical dimension of pet cafés is genuinely complex: well-run establishments maintain proper veterinary care, stress-minimizing environments, appropriate rest spaces where animals can escape visitors, and nutritional standards; poorly run establishments prioritize profit over animal welfare. Identifying the former requires some evaluation of the actual conditions rather than online reputation alone.",
    tip: "Bangkok pet café evaluation: (1) Cat café welfare indicators: cats that voluntarily approach visitors (rather than being handled against their will), visible rest spaces where cats can retreat, limited visitor numbers that prevent overcrowding, cats that appear healthy (good coat, appropriate weight, no visible stress behaviors like over-grooming); (2) Dog café welfare bonus: several Bangkok dog cafés specifically feature rescue dogs available for adoption — these establishments directly serve animal welfare alongside the café experience; (3) Rabbit café note: rabbits are prey animals that can develop heart issues from sustained stress — a rabbit café where rabbits are constantly handled or appear hunched is not well-run; (4) The 'Caturday Cat Café' in Thonglor and similar established venues have generally positive welfare reputations; newer, untested establishments should be evaluated on arrival conditions rather than trust; (5) Best timing: weekday mid-morning visits at cat cafés mean fewer visitors and a calmer environment than weekend peak hours.",
  },
];

export function BangkokKoiPond() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        🐟 Bangkok koi, ornamental fish & pet culture — Chatuchak markets & pet cafés
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-blue-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
