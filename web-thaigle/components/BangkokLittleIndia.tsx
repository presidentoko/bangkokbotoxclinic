const SPOTS = [
  {
    name: "Little India — Pahurat & Sukhumvit Soi 11",
    emoji: "🇮🇳",
    area: "Pahurat Market (Chinatown-adjacent, near Old Town Bangkok), Sukhumvit Soi 11 area (modern Indian expat community), Silom Indian restaurants",
    price: "Street thali ฿80–200; Fabric at Pahurat ฿100–1,000/metre; Chai and samosa ฿30–80; South Indian restaurant meal ฿100–350",
    why: "Bangkok has two distinct Indian communities that represent different chapters of the Indian presence in Thailand. Pahurat (also called the Indian Quarter) is Bangkok's historic Indian textile and wholesale market district — adjacent to Chinatown (Yaowarat), Pahurat has been the center of Bangkok's Sikh and South Asian merchant community for over a century. The Sri Gurusingh Sabha Sikh temple anchors the community, and the market lanes are filled with Indian textile shops (silk, cotton, synthetic fabrics sold by the metre for Thai tailor clients), Indian sweets shops, and wholesale goods merchants. The modern Indian expat community around Sukhumvit Soi 11 represents a newer arrival — IT professionals, business travelers, restaurant entrepreneurs, and professional expats concentrated in the mid-Sukhumvit area, with Indian restaurants, grocery stores, and professional services.",
    tip: "Bangkok Indian district navigation: (1) Pahurat fabric market timing: Saturday and Sunday see highest vendor activity, but weekday visits are less crowded — the market operates daily; (2) For textiles: Pahurat's fabric shops are where Bangkok's tailors source Indian silk and cotton — prices are wholesale-adjacent and require some negotiation; (3) Indian food finding strategy: the Soi 11 area has the most authentic North Indian (specifically Gujarati/Punjabi) cooking in Bangkok — look for restaurants with Indian family ownership rather than Thai-staffed 'Indian food' operations; (4) Sri Gurusingh Sabha temple: the Sikh gurdwara in Pahurat serves langar (free communal vegetarian meal) to all visitors regardless of faith — this is a genuine cultural encounter and a remarkable expression of Sikh hospitality; visiting during meal service is appropriate with respectful attitude and covered head; (5) Indian grocery stores near Soi 11: MGM International and similar Indian grocery shops carry spices, lentils, pickles, and specialty products direct from India — significantly cheaper than import-priced versions at international supermarkets.",
  },
  {
    name: "Bangkok's Japanese Community — Little Tokyo",
    emoji: "🇯🇵",
    area: "Sukhumvit Soi 16–26 area (highest Japanese restaurant/business concentration), Siam Center basement Japanese shops, Isetan department store",
    price: "Authentic ramen ฿180–400; Japanese izakaya meal ฿500–2,000; Japanese grocery (Isetan food hall): market pricing; Japanese bookstore (Kinokuniya): ฿350–2,500",
    why: "Bangkok has one of Southeast Asia's largest Japanese expat populations — approximately 70,000–80,000 Japanese nationals reside in Bangkok, concentrated largely in the Sukhumvit Soi 16–26 area and Thong Lor. The result is a 'Little Tokyo' of remarkable authenticity and density: ramen shops, izakayas, Japanese sento-style baths, Japanese supermarkets (Fuji supermarket in Paragon), Japanese-language bookstores (Kinokuniya at Paragon), Japanese dry cleaning services, Japanese dentists and doctors, and hundreds of Japanese-run restaurants and businesses. The quality of Japanese food in Bangkok is genuinely exceptional — the large Japanese residential population and business community creates market pressure for authentic quality that produces ramen, sushi, yakitori, tempura, and omakase dining at world-class standards. Japanese cultural events: the annual Japan Festa in Bangkok, held at the Thai-Japan Association, showcases Japanese cultural performances, food, and community activities.",
    tip: "Bangkok Japanese community access: (1) Fuji Supermarket (in Paragon and other locations) stocks authentic Japanese products at reasonable import pricing — Japanese snacks, drinks, instant noodles, and fresh Japanese produce are available; (2) Kinokuniya (Siam Paragon) has the largest Japanese language book selection outside Japan in Southeast Asia alongside English and Thai sections; (3) Japanese restaurants on Soi 24–26: the highest density of authentic Japanese-run izakayas and ramen shops in Bangkok — Menya Musashi, Ramen Santouka (international chain, Bangkok branch quality is genuine), and numerous smaller operations; (4) Onsen/sento experience: several Bangkok establishments offer Japanese-style bath culture (hot mineral water communal bathing) — Yunomori Onsen & Spa (Sukhumvit area) is the most recognized; (5) Japan-Thai business events: the Thailand-Japan Trade and Economic Committee and Japanese Chamber of Commerce Bangkok host regular business events — accessible for professional networking.",
  },
  {
    name: "Bangkok's Korean Quarter",
    emoji: "🇰🇷",
    area: "Sukhumvit Soi 11–12 Korean restaurant/beauty concentration, Asok area Korean businesses, Central Embassy Korean beauty floor",
    price: "Korean BBQ per person ฿400–900; Korean skincare brands: ฿300–5,000; Korean grocery (K-Market): standard Korean pricing; Korean boba/café: ฿150–300",
    why: "Bangkok's Korean community has expanded significantly since 2015, driven by Korean business investment in Thailand (particularly in manufacturing, automotive supply chain, and the creative industries), Korean tourism (Thailand is one of Korea's most popular tourist destinations), and cultural influence of Hallyu (Korean Wave — K-pop, K-dramas, Korean beauty). The Sukhumvit area has developed a genuine Korean quarter with Korean BBQ restaurants (galbi, samgyeopsal), Korean beauty shops (Innisfree, Etude House, COSRX), Korean convenience concept stores, and Korean-managed nail salons and aesthetics clinics. Bangkok's Korean food scene is sophisticated — both authentic Korean home-cooking style restaurants catering to Korean residents and modern Korean fusion concepts attracting Thai and international food-interested customers. Hongdae-style Korean bar culture (soju cocktails, Korean beer, fried chicken) has been adopted broadly by young Bangkok consumers.",
    tip: "Bangkok Korean community guide: (1) Korean BBQ in Bangkok vs. Seoul prices: Bangkok Korean BBQ is 30–50% more expensive than equivalent Seoul pricing for meat cuts, as premium Korean cuts are imported — but the quality and experience are comparable; (2) Korean beauty negotiation: Bangkok's K-beauty market is highly competitive — comparing prices between Siam Square One brand stores and Watsons/Boots for the same products often reveals better deals at pharmacy chains; (3) Korean language exchange: the Bangkok Korean population's interest in improving English makes Korean-English language exchange particularly accessible — Korean residents at Korean cafés and restaurants are often receptive to exchange conversation if approached respectfully; (4) K-pop events: SM Entertainment, YG Entertainment, and other K-pop agency concert tours include Bangkok as a regular venue — Impact Arena and Bangkok Arena host these events; Thai K-pop fans are among the most enthusiastic in Southeast Asia.",
  },
];

export function BangkokLittleIndia() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🌏 Bangkok's ethnic districts — Little India, Japanese quarter & Korean community
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-orange-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-orange-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
