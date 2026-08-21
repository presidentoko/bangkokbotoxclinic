const SPOTS = [
  {
    name: "French Patisserie & European Pastry in Bangkok",
    emoji: "🥐",
    area: "Sukhumvit (Thonglor, Ekkamai), Silom, Sathorn",
    price: "Croissants ฿80–180; Tasting box ฿300–700; Café with pastry ฿200–450",
    why: "Bangkok has developed a genuinely sophisticated French pastry scene driven by Thai pastry chefs who trained in France and returned to Bangkok, plus French expat bakers establishing proper Parisian-style boulangeries. The croissant culture in Bangkok rivals major European cities — with laminated dough croissants, pain au chocolat, kouign-amann, and specialty viennoiseries available at small independent bakeries in Thonglor and Ekkamai. Unlike tourist-area cafés serving mass-produced pastries, these specialists produce competition-quality European baked goods.",
    tip: "Bangkok croissant spots: the Thonglor-Ekkamai corridor (BTS Thonglor to Ekkamai stations) has the highest concentration of French patisserie culture. Arrive before 10am for best selection — croissants sell out at quality spots by late morning. Laminated dough quality indicators: even honeycomb interior cross-section, visible caramelization on exterior layers, audible shattering when broken. Bangkok pastry scene discovery: the Instagram hashtag #BangkokPatisserie and #bangkokcroissant surface the independent pastry chefs — new spots appear monthly. Pricing at quality patisseries reflects real ingredient and labour costs — expect ฿120–180 for a proper croissant.",
  },
  {
    name: "Japanese-Influenced Desserts & Soft Serve Culture",
    emoji: "🍦",
    area: "Emquartier, Central Embassy, Siam mall area; independent shops throughout",
    price: "Soft serve ฿80–250; Kakigori (shaved ice) ฿150–400; Japanese dessert set ฿250–600",
    why: "Japanese dessert culture has deeply influenced Bangkok's café scene — matcha, hojicha, ube, and mochi have become standard Bangkok café offerings. Soft serve ice cream (Japanese-style, with a distinctive texture from higher milk fat content and slow churning) has particular cultural traction in Bangkok. Kakigori (Japanese finely-shaved ice with condensed milk and flavored syrups — different from Thai-style shaved ice) has a growing specialist café niche. Japanese-style convenience store-format desserts (Mochi House, 31 Flavors Thailand interpretations) also proliferate. The cross-cultural influence of Thai enthusiasm for Japanese food creates constant dessert innovation.",
    tip: "Japanese dessert in Bangkok: the Japanese retail presence in Bangkok (Donki, Japanese department store food floors at Siam Paragon and EmQuartier's Gourmet Market) carries Japanese specialty confectionery unavailable outside Japan. Matcha quality in Bangkok: look for shops specifying Uji or Nishio matcha origin — these produce the characteristic deep, bitter-sweet matcha flavor. Generic 'green tea powder' produces flat sweetness without complexity. Seasonal Japanese dessert collections: Bangkok's Japanese-influenced patisseries (particularly those with Japanese chef backgrounds) often do limited-run seasonal items aligned with Japanese confectionery calendar (sakura in spring, autumn leaf season, etc.).",
  },
  {
    name: "Thai Sweets & Khanom Thai Traditions",
    emoji: "🍮",
    area: "Yaowarat (Chinatown), temple fair markets, Or Tor Kor fresh market, Canal-side vendors",
    price: "Individual khanom ฿5–25; Khanom set ฿80–200",
    why: "Traditional Thai sweets (khanom Thai) are a distinct confectionery tradition — coconut milk based, using pandan leaf coloring, sometimes steamed in banana leaf cups, featuring flavors entirely different from Western or East Asian dessert traditions. Thong yip (egg yolk flower drops with gold-dusted sugar syrup), Foi thong (golden thread egg yolk sweets), kanom krok (coconut milk pancake cups), khanom buang (crispy Thai crepes with meringue and colored filling), and taro-coconut preparations form the core khanom Thai repertoire. Many traditional khanom Thai are considered palace cuisine with royal origins.",
    tip: "Finding traditional khanom Thai in Bangkok: the Or Tor Kor market (opposite Chatuchak Weekend Market) has the highest concentration and quality of traditional Thai sweets — multiple specialist vendors producing handmade versions of difficult traditional recipes. Temple fairs (งานวัด, throughout Bangkok's temple calendar) are another source — vendors at temple fairs often make traditional khanom not available in everyday shops. Khanom buang: the street version with meringue and shredded coconut/egg filling is found near major tourist areas (Grand Palace, Wat Pho), but the quality version involves more complex fillings. Mae Varee's banana-related products on Thonglor Soi 5 are legendary — the mango sticky rice institution.",
  },
];

export function BangkokPastry() {
  return (
    <div className="rounded-2xl border border-rose-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-rose-700 mb-3">
        🥐 Pastry & desserts in Bangkok — French patisserie, Japanese sweets & khanom Thai
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-rose-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-rose-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
