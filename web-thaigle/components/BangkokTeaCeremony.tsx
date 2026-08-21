const SPOTS = [
  {
    name: "Chinese Tea Culture in Bangkok's Yaowarat",
    emoji: "🍵",
    area: "Yaowarat (Chinatown): dedicated Chinese tea shops along Yaowarat Road and adjacent sois; Old Town coffee/tea shops near Saphan Han; specialty Chinese tea imports from across Bangkok",
    price: "Chinese tea per cup (in shop): ฿80–300; Premium oolong/pu-erh (pot): ฿150–500; Tea ceremony experience: ฿500–2,000; Quality tea purchase (50g): ฿200–5,000+; Gongfu cha workshop: ฿1,500–4,000",
    why: "Bangkok's Chinatown holds one of Southeast Asia's most authentic Chinese tea cultures — a legacy of the Teochew and Hakka communities whose tea merchants established Thailand's tea trade generations ago. Chinese tea shops in Yaowarat range from wholesale suppliers to refined tea houses specializing in premium pu-erh from Yunnan, high-mountain oolongs from Taiwan and Fujian, green teas from various Chinese provinces, and Thai highland teas from northern Thailand's growing specialty tea sector. The gongfu cha ceremony (功夫茶, literally 'kung fu tea' — tea made with skill and intentionality through a specific brewing protocol using small clay teapots and multiple short infusions) is practiced at Bangkok's more serious tea shops, creating a contemplative tasting experience unlike café tea service. Bangkok's Chinese community tea culture is integrated with TCM — medicinal teas and herbal formulations (chrysanthemum, goji berry, dried jujube) are also widely consumed in the same shops.",
    tip: "Bangkok Chinese tea exploration: (1) Yaowarat navigation: the best specialized Chinese tea shops are often set back from the main road or on the connecting sois; walking slowly and looking into the narrow shophouses reveals more than hurrying along the main road; (2) Old puerh investment culture: vintage puerh tea (aged tea cakes from 1990s or earlier) has become an investment commodity; quality Bangkok tea merchants have aged stock with documentation; (3) Gongfu cha invitation: serious tea merchants in Yaowarat often offer a tea-tasting session when you express genuine interest — accepting and sitting for the brewing ritual reveals the depth of Chinese tea culture more than purchasing alone; (4) Thai highland tea: northern Thailand (Chiang Rai, Chiang Mai, Doi Inthanon area) produces oolong and green teas of increasing quality; Bangkok tea shops often stock these alongside Chinese imports at prices that reflect their origin advantage; (5) Tea ware: the clay teapots, gaiwan (lidded bowl), tea trays, and cups used in gongfu cha are beautiful objects and available at Bangkok's Chinese tea supply shops at reasonable prices — excellent gifts or personal acquisitions.",
  },
  {
    name: "Japanese Tea Culture in Bangkok",
    emoji: "🎋",
    area: "Japanese restaurants and cultural centers in Sukhumvit (Japan Town area, Soi 49–63), Japan Centre Bangkok (Asok), specialty matcha cafés throughout Bangkok, occasional chado (tea ceremony) events at cultural centers",
    price: "Matcha preparation workshop: ฿1,200–2,500; Traditional chado ceremony experience: ฿1,500–4,000; Quality matcha powder (30g): ฿500–2,500; Matcha café (prepared drinks): ฿120–350; Chawan (tea bowl): ฿1,500–50,000+",
    why: "Bangkok's Japanese community is one of the largest Japanese expatriate communities in Southeast Asia — supporting a wide range of Japanese cultural institutions, restaurants, and specialty shops that include Japanese tea culture. The Japan Foundation Bangkok and Japan Centre Bangkok periodically host chado (Japanese tea ceremony) demonstrations and workshops taught by certified tea teachers — providing authentic introductions to the wabi aesthetic and the meditative precision of Japanese tea. Bangkok's specialty coffee and café culture has also enthusiastically adopted matcha as a ingredient and beverage — high-quality Japanese matcha (ceremonial grade from Uji, Kyoto, or Nishio, Aichi) is available at specialty cafés and at the Japanese import stores (Aeon, Don Don Donki at Thonglor/Central World) that have established themselves as Bangkok's Japanese cultural supply chains.",
    tip: "Bangkok Japanese tea culture access: (1) Japan Centre Bangkok (near Asok): periodically hosts Japanese cultural workshops including chado — their event calendar is the most reliable source for scheduled tea ceremony experiences; (2) Matcha quality assessment: ceremonial grade matcha (bright green, smooth, not bitter when properly prepared) differs significantly from culinary grade matcha (darker, more bitter, appropriate for lattes/baking); Bangkok specialty cafés using genuine ceremonial grade matcha are identifiable by the smooth umami character of their matcha drinks; (3) Don Don Donki and Japanese import stores: Bangkok's Don Don Donki stores (Japanese discount variety chain) carry remarkable breadth of Japanese food items including quality teas, matcha, and Japanese tea accessories at reasonable prices; (4) Chawan (tea bowls): quality handmade Japanese tea bowls are available at Bangkok's Japanese specialty goods stores and occasionally at antique markets like River City — genuine Japanese craft pottery at Thai market prices; (5) Wagashi (Japanese tea sweets): the perfect pairing for Japanese tea — Bangkok's Japanese bakeries and specialty shops stock seasonal wagashi; some Japanese restaurants prepare traditional wagashi alongside tea ceremony packages.",
  },
  {
    name: "Thai Herbal Tea & Traditional Drinks",
    emoji: "🌺",
    area: "Thai herbal drinks: available at street stalls, traditional markets, health food stores, and specialist Thai herbal drink vendors throughout Bangkok; fresh herb markets at Pak Khlong Talat",
    price: "Street herbal drinks: ฿20–80; Specialist herbal tea shop: ฿60–200; Traditional Thai herbal compress (nam ob): ฿100–400; Medicinal herb bundle: ฿50–300; Thai health food store herbal products: ฿200–2,000",
    why: "Thai traditional herbal drinks represent an indigenous tea culture distinct from Chinese or Japanese traditions — rooted in the same traditional Thai medicine (TTM) system that informs Thai massage and herbal compress therapy. Common Thai herbal drinks: (1) Nam manao (lime juice): the most ubiquitous, consumed throughout the day for vitamin C, digestion, and heat tolerance; (2) Nam bai bua bok (pennywort juice): green-colored, slightly bitter, traditionally consumed for brain health and stress; (3) Nam tamarind: sweet-sour tamarind drink; (4) Nam ma faung (roselle hibiscus): ruby red, sour, rich in anthocyanins; widely consumed for blood pressure and antioxidant properties; (5) Chrysanthemum tea: adopted from Chinese medical tea tradition, consumed by Bangkok's population (particularly Thai Chinese) for eye health and 'cooling' the body from heat; (6) Lemongrass tea: lemongrass (ta khai) tea consumed for digestion and inflammation; (7) Butterfly pea tea (nam dok anchan): vivid blue herbal tea from butterfly pea flower, color-shifts to purple when lime is added; antioxidant and traditional 'brain' tonic.",
    tip: "Bangkok herbal drinks exploration: (1) Morning market discovery: Bangkok's fresh morning markets (around 6–10am near temple neighborhoods) have herbal drink vendors selling fresh-squeezed and brewed traditional drinks that don't appear in tourist areas; (2) 7-Eleven herbal drinks: even Thailand's 7-Eleven carries a remarkable range of bottled traditional herbal drinks (roselle, chrysanthemum, pennywort) that represent entry-level exposure to Thai herbal culture; (3) Cooling vs heating (Thai medical concept): Thai medical theory categorizes foods and herbs as 'cooling' (for reducing internal heat, which causes inflammation, skin problems, irritability) or 'heating' (for stimulating circulation and metabolism); your Bangkok hotel or spa staff can advise on which herbal drinks suit your current health state within this framework; (4) Pak Khlong Talat herb vendors: the massive flower market also has herb sections where medicinal herbs are sold by the kilogram — bringing a list of what you're looking for (in Thai or with photos) enables finding specific herbs for home preparations; (5) Butterfly pea tea: the most photogenic Thai herbal drink — the vivid blue shifting to purple with lime is excellent for social media documentation and genuinely delicious hot or iced.",
  },
];

export function BangkokTeaCeremony() {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-emerald-700 mb-3">
        🍵 Bangkok tea culture — Chinese gongfu cha, Japanese chado & Thai herbal drinks
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-emerald-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-emerald-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
