const SPOTS = [
  {
    name: "Whisky & Spirits Culture in Bangkok",
    emoji: "🥃",
    area: "Whisky bars throughout Bangkok — Vesper (Silom), Rabbit Hole (Thong Lor), The Speakeasy (various), specialist whisky bars near Ekkamai and Thong Lor",
    price: "Single malt dram ฿500–3,000+; Japanese whisky ฿800–5,000+; Thai craft whisky ฿300–800; Whisky flight tasting ฿1,500–4,000",
    why: "Bangkok has a sophisticated whisky drinking culture — the city's duty-free market access, large business traveler population, and Japanese influence on bar culture (Japanese whisky culture has been deeply influential in Bangkok's premium bar scene) have created a whisky market with exceptional depth and breadth. Bangkok's access to Japanese whisky: the close cultural and business ties between Thailand and Japan have made Bangkok one of the best markets outside Japan to access Japanese whisky at relatively fair prices — compared to other markets where Japanese whisky scarcity has inflated prices dramatically. Thai domestic whisky: Thai domestic spirits (Mekhong, SangSom rum, Ruang Khao rice whisky) are officially classified as 'Thai whisky' but are technically blended spirits; actual Thai malt whisky is now emerging from craft distillers. The Bangkok whisky bar scene is sophisticated — multiple bars specialize in rare and allocated Japanese and Scotch whiskies.",
    tip: "Bangkok whisky bar navigation: (1) Duty-free spirits purchasing at BKK/DMK airport significantly reduces import duty on bottles — Thai import duty on spirits is among the highest globally (approximately 400%+), making duty-free prices dramatically lower than in-country retail; (2) Japanese whisky in Bangkok: Nikka, Suntory, and independent Japanese distillery releases are often more available in Bangkok than in Japan due to export allocation — this makes Bangkok a legitimate destination for Japanese whisky acquisition; (3) Whisky festivals: Bangkok hosts periodic whisky festivals and events (Diageo, Pernod Ricard, independent organizers) — following whisky-focused bars on social media provides advance notice; (4) Whisky brand dinner events: premium spirits brands regularly host tasting dinners at Bangkok hotels and restaurants — these often offer excellent value access to rare spirits in curated pairing formats.",
  },
  {
    name: "Thai Craft Spirits",
    emoji: "🌿",
    area: "Thai craft distillers — mostly outside Bangkok (Chiang Mai, the north), available at Bangkok specialty bottle shops and select bars",
    price: "Thai craft gin bottle ฿1,200–3,000; Thai craft rum ฿800–2,500; Aged Thai rice whisky ฿500–2,000; Tasting at source (distillery visits in the north): varies",
    why: "Thailand's legal craft distilling sector emerged from regulatory reforms that lowered barriers for small distillery licenses around 2018–2020 — the result has been a rapidly developing Thai craft spirits scene concentrated in the north (Chiang Mai, Chiang Rai, Lampang) where highland ingredients, cleaner water sources, and the tourism ecosystem support craft producers. Thai craft gin has emerged as a particularly successful category: using galangal, lemongrass, kaffir lime, Thai spices, and botanicals unavailable in European gin production, Thai craft gin producers create genuinely distinctive products that have achieved export success. Notable Thai craft spirit categories: Thai gin (multiple producers), Thai craft rum (made from fresh sugarcane rather than molasses, producing a distinctively clean agricole-style spirit), aged rice whisky (traditional Thai rice spirit distillation refined to premium quality), and experimental fermented products. Bangkok's specialty bottle shops and craft cocktail bars increasingly stock and showcase Thai domestic craft spirits.",
    tip: "Finding Thai craft spirits in Bangkok: (1) Bottle shops in Thong Lor and Ekkamai areas carry curated selections of Thai craft spirits — specifically asking for Thai-made spirits identifies knowledgeable shops; (2) The Bangkok craft cocktail bar scene uses Thai spirits extensively — asking bartenders about Thai ingredients in your cocktail reveals local products; (3) Distillery visit planning: several Chiang Mai-area craft distilleries offer tours and tastings — timing a distillery visit during a northern Thailand trip is the best access to the Thai craft spirit source; (4) Thai craft gin brand names: Iron Balls Gin (Bangkok-made with tropical ingredients), Seekers Gin, and several Chiang Mai producers are the most established Thai craft gin brands available internationally and in Bangkok specialty venues.",
  },
  {
    name: "Bangkok Sake & Asian Spirits",
    emoji: "🍶",
    area: "Japanese restaurants with sake lists throughout Bangkok, sake bars in Sukhumvit/Thong Lor Japanese dining districts, Korean soju at Korean restaurant concentrations",
    price: "Sake glass ฿150–500; Premium sake bottle ฿800–5,000; Korean soju bottle ฿300–700; Baijiu experience ฿200–1,500",
    why: "Bangkok's position as a hub for Asian business communities — Japanese expats (one of Bangkok's largest expat populations), Korean community, Chinese business travelers, and broader Asian tourism — has created exceptional diversity in Asian spirits availability. Bangkok's sake market is sophisticated: Japanese restaurants in the Thong Lor/Sukhumvit area carry comprehensive sake lists including premium junmai daiginjo, sparkling sake, and aged koshu sake. The Korean community around Sukhumvit 11 and the broader Sukhumvit area has made soju (Korean distilled spirit, served cold straight) genuinely ubiquitous — soju culture (drinking games, soju cocktails, pairing with Korean food) is embedded in Bangkok's Korean restaurant scene. Chinese baijiu (the world's most consumed spirit by volume) is available at Chinese restaurants throughout Bangkok's Chinatown — experiencing baijiu in a Chinatown context is a genuine introduction to one of the world's least-known major spirits categories.",
    tip: "Bangkok Asian spirits exploration guide: (1) Sake restaurant pairing: Japanese restaurants in Bangkok (especially Sukhumvit area) have sake-by-the-glass programs that allow tasting multiple sake types — asking the sommelier for a sake flight exploring different types (junmai, honjozo, ginjo, daiginjo) across one dinner is manageable and educational; (2) Korean soju etiquette: in Korean restaurant contexts, soju is served cold, in small cups, with specific pouring rituals (senior person pours first, you don't pour your own); (3) Baijiu in Chinatown: the most authentic way to experience Chinese baijiu is at a traditional Chinatown restaurant with older Chinese-Thai patrons where baijiu culture is genuine — the volume consumed and ritual drinking practices in Chinese dining contexts are the cultural context that makes baijiu comprehensible as a social lubricant rather than a curiosity.",
  },
];

export function BangkokWhisky() {
  return (
    <div className="rounded-2xl border border-yellow-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-3">
        🥃 Bangkok whisky & spirits — whisky bars, Thai craft spirits & Asian spirits culture
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-yellow-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-yellow-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
