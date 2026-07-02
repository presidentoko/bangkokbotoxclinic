const SPOTS = [
  {
    name: "Bangkok's World-Class Cocktail Bar Scene",
    emoji: "🍸",
    area: "Silom (Smalls, Tropic City), Thong Lor (VOGUE, Rabbit Hole), Charoen Krung (innovative cocktail corridor), BTS station areas",
    price: "Craft cocktails ฿300–600; Cocktail tasting menu ฿1,200–3,000; Bar premium spirits ฿500–2,000+; Non-alcoholic cocktails ฿200–400",
    why: "Bangkok has achieved international recognition as one of Asia's best cocktail cities — multiple Bangkok bars have appeared on the Asia's 50 Best Bars list and World's 50 Best Bars. The signature quality of Bangkok's cocktail scene is tropical ingredient innovation: bartenders working with fresh galangal, kaffir lime leaf, butterfly pea flower, tamarind, lemongrass, fresh coconut, Thai herbs, and tropical fruits unavailable or expensive in Western markets. Bangkok cocktail bars benchmark against global standards while leveraging uniquely local ingredients — this combination produces cocktails genuinely only possible in Bangkok. The Charoen Krung area (along the Chao Phraya river) has become a cocktail destination district with several internationally-ranked bars in converted shophouses and riverside settings. Bangkok's mixology culture is also innovative in non-alcoholic direction — zero-proof cocktail programs at several Bangkok bars match alcoholic menus in creativity.",
    tip: "Bangkok cocktail bar navigation: reservations are essential at the most acclaimed bars (Smalls, the best Charoen Krung bars) especially for weekend seats — typically book online or by phone 2–3 days ahead. Price calibration: Bangkok's top cocktail bars charge comparable prices to equivalent quality bars in London or New York for their premium cocktails — this is appropriate given the quality and experience, but budget accordingly. Exploring beyond the top 50 list: Bangkok's cocktail depth is remarkable — dozens of bars outside the international list rankings serve excellent cocktails at slightly lower prices in neighborhood environments less dominated by tourists. The banana cocktail myth: some Bangkok bars (particularly tourist-facing ones) serve very sweet, fruit-heavy cocktails under creative names — these are not representative of Bangkok's genuine cocktail scene quality; seek bars where the menu shows ingredient specificity.",
  },
  {
    name: "Bartending Classes & Cocktail Workshops",
    emoji: "🧪",
    area: "Bangkok cocktail schools and bar-hosted classes — bartending schools in Sukhumvit area, private bar workshop programs",
    price: "Cocktail workshop (2 hours, group): ฿1,500–3,000/person; Professional bartending course: ฿5,000–30,000; Home bartending setup class: ฿2,000–4,000",
    why: "Bangkok's cocktail culture has spawned a workshop and education sector — multiple Bangkok bars and independent cocktail schools offer hands-on cocktail making classes. The workshops typically cover: basic cocktail technique (shaking, stirring, muddling), spirits education (Thai craft spirits, rum, whisky), tropical ingredient usage (fresh herb muddling, citrus work, syrups), and tasting calibration. Bangkok's bartending schools have produced internationally competitive professional bartenders — the Thai bartending competition circuit has consistent representation at regional and world bartending championships. For visitors, the cocktail workshop experience is both educational and social — typically ending with sampling the cocktails made during the session. Private workshop bookings for groups (bachelor parties, team events, birthday celebrations) are a popular Bangkok activity.",
    tip: "Bangkok cocktail workshop selection: distinguish between tourist-format workshops (very simplified, more about the Instagram moment than education) and genuinely substantive cocktail education classes. The difference is usually in: time invested per technique, quality of spirits used, and whether a working bartender leads the class vs. a hospitality packager. Thai craft spirits awareness: the class experience improves if you try to understand the local ingredient context — asking the instructor about specific Thai ingredients in the cocktails you make reveals the most distinctive learning. Post-class bar visiting: using a cocktail workshop as an introduction to Bangkok's bar scene (followed by visiting bars the instructor recommends) is the most complete cocktail journey for a Bangkok visit.",
  },
  {
    name: "Thai Fermentation & Craft Drinks",
    emoji: "🍺",
    area: "Craft brewery taprooms throughout Bangkok (Choppers, Sandport, Chalawan), Thai rice wine and fermented drink vendors at traditional markets",
    price: "Thai craft beer (pint) ฿180–350; Sato (rice wine) by the pitcher ฿200–500; Craft kombucha ฿80–150; Traditional lao khao ฿30–100",
    why: "Thai fermentation culture extends from the internationally illegal-but-culturally-significant traditional spirits (lao khao — raw distilled rice spirit, often associated with northeastern Thailand) to the emerging legal Thai craft beverage sector that has developed since Thailand reformed its craft brewery licensing laws. Thai rice-based fermentation: sato (Thai rice beer/wine) and several regional fermented beverages have cultural roots in Buddhist ceremonies and agricultural communities — traditional versions are served at festivals and from home producers in rural areas. Bangkok's legal craft beer scene has grown significantly since 2020 — taprooms featuring Thai-made craft beers using both imported malts and locally sourced ingredients (jasmine rice, tropical fruits, Thai herbs). Thai kombucha and fermented tea drink producers have also emerged as part of the health-conscious Bangkok consumer market.",
    tip: "Thai craft beverage exploration in Bangkok: (1) The Bangkok craft beer scene is concentrated around the Charoennakorn and On Nut areas — checking BrewDog BKK, Sandport Brewing Company, and similar craft taprooms reveals the current tap selection; (2) Traditional Thai drinks at markets: look for vendors selling fresh-fermented coconut water (slightly fizzy, naturally sweet), pandan drink, and various market beverages that use traditional Thai flavor profiles; (3) Lao khao cultural context: the traditional distilled rice spirits sold at rural markets throughout Thailand (at very low prices, often in recycled water bottles or repurposed containers) are consumed locally as a celebratory/social drink and are part of northeastern Thai (Isan) culture specifically — approach with curiosity rather than judgment; (4) Thai whisky: domestic Thai whisky brands (Mekhong, Hong Thong, Ruang Khao) are the everyday spirits of local bars and cost ฿80–150 per large glass — trying them with soda and ice is the local format.",
  },
];

export function BangkokMixology() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        🍸 Bangkok mixology & craft drinks — cocktail bars, bartending workshops & Thai fermentation
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-amber-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-amber-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
