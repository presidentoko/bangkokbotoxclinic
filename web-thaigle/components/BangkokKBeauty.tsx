const SPOTS = [
  {
    name: "Korean Beauty (K-Beauty) in Bangkok",
    emoji: "🌸",
    area: "Siam Square One (major K-Beauty concentration), Sukhumvit Korean district, K-Beauty shops at every major Bangkok mall, online delivery",
    price: "K-Beauty sheet mask: ฿30–150; Skincare serum ฿500–3,000; Full skincare routine products: ฿2,000–8,000; Beauty consultation (free at premium shops)",
    why: "Bangkok is one of the world's best cities to explore Korean beauty — the cultural proximity between Thailand and Korea (K-pop influence, Korean tourism to Thailand, large Korean expat community in Bangkok), the genuine interest of Thai consumers in skincare as a cultural value, and Bangkok's role as a regional distribution hub for K-Beauty brands means virtually every Korean beauty brand is available in Bangkok. K-Beauty in Bangkok ranges from genuine Korean-made products at dedicated K-Beauty stores (Innisfree, Etude House, Missha, The Face Shop, COSRX, Laneige, ROMAND — all have Bangkok stores) to Korean beauty concept products at Thai pharmacy chains (Watsons, Boots, and Villa Market all carry extensive K-Beauty selections). Bangkok prices for K-Beauty products are competitive with Korean prices and significantly below Western market prices — this makes Bangkok a genuine shopping destination for international K-Beauty enthusiasts.",
    tip: "Bangkok K-Beauty shopping guide: (1) Siam Square One has the highest density of K-Beauty brand stores in Bangkok — a single morning visits multiple brand flagship stores without leaving the building; (2) Compare prices between brand stores and pharmacy chains (Watsons, Boots) — multi-buy promotions at pharmacy chains sometimes undercut brand store pricing; (3) Duty-free note: purchasing K-Beauty products in Bangkok for international travel does not save Thai import duties already incorporated into retail prices, but Bangkok prices are still often lower than home-market equivalents; (4) The Korean multi-step skincare system: Bangkok K-Beauty shops staff are knowledgeable about the Korean skincare routine (oil cleanser → water cleanser → toner → essence → serum → moisturizer → SPF) and can guide appropriate products for Bangkok's climate (humid, high UV, potentially high PM2.5).",
  },
  {
    name: "Japanese Beauty (J-Beauty) in Bangkok",
    emoji: "🌿",
    area: "Isetan (Central Embassy), Tokyu (Paragon), Japanese drug stores concept shops, Japanese skincare dedicated counters at Siam Paragon and Central department stores",
    price: "Hada Labo, Shiseido, SK-II products: ฿300–8,000; Japanese sunscreen: ฿400–800; DHC supplement and skincare: ฿300–2,000; Japanese collagen products: ฿500–3,000",
    why: "Japanese beauty products are deeply integrated into Bangkok's beauty culture — the Thai concept of beautiful skin and the Japanese concept of 'hadabo' (skin care) share significant alignment, and Thai consumers have adopted Japanese skincare philosophy with enthusiasm. Bangkok's J-Beauty availability is exceptional: department stores in Siam Paragon, Emporium, and Central Embassy carry comprehensive Japanese brand selections including Shiseido, SK-II, Hada Labo, Cle de Peau, Albion, and numerous others. Japanese pharmacy brands (Hada Labo, Curel, Biore, Nivea Japan, DHC) available at Isetan and dedicated pharmacy concepts reach Bangkok consumers at pricing comparable to Japan. The Japanese SPF product category is particularly revered in Bangkok — Japanese high-SPF, light-texture sunscreens are among the most coveted products by Thai beauty consumers for the climate-appropriate skin protection they provide.",
    tip: "Bangkok J-Beauty access: (1) Isetan at Central Embassy basement floor has the most comprehensive Japanese skincare department in Bangkok — department-store staff are knowledgeable about product differences; (2) Authentic Japanese import status: check whether products labeled 'Japanese' are genuinely imported from Japan vs. manufactured in Thailand under Japanese license — the formula and quality often differs; (3) Japanese sunscreen in Bangkok: SPF 50+++ Japanese sunscreens (Anessa, Biore UV, Allie, Canmake) are a practical investment for Bangkok — the intense UV index (often 10–11 in Bangkok's dry season) demands consistent, effective SPF; (4) The 'beauty supplement' category: Japanese collagen drinks, beauty supplements (Meiji, Shiseido Collagen EX), and fermented food products are popular at Japanese department stores in Bangkok — these represent the wellness-beauty intersection that J-Beauty has developed further than any other beauty market.",
  },
  {
    name: "Thai Herbal Beauty & Natural Skincare",
    emoji: "🌱",
    area: "Thai herbal product brands at pharmacies, Harnn & Thann stores, PANPURI stores, traditional herbal market vendors, spa product shops",
    price: "Thai herbal soap: ฿50–300; Natural beauty brand (Harnn, Thann, PANPURI): ฿300–3,000; Traditional herbal products at market: ฿30–200",
    why: "Thailand has a flourishing domestic natural beauty industry building on traditional Thai herbal medicine knowledge — the same botanical tradition that produced Thai herbal medicine (using turmeric, lemongrass, kaffir lime, jasmine, tamarind, rice, coconut, and hundreds of other plants) has inspired a Thai natural beauty product sector that ranges from market vendors selling traditional herbal soaps to luxury spa brands (Harnn, Thann, PANPURI) that have achieved international distribution. The Thai spa treatment tradition (involving herbal steam, herbal compress, and botanical body treatments) has directly informed product development — Bangkok's premium Thai spa brands sell the product forms of the treatments available in Thai spas globally. PANPURI (Thai botanical luxury brand) and Harnn (traditional Thai botanical heritage brand) represent the premium tier of Thai natural beauty and are sold at premium airports and luxury hotel spas internationally.",
    tip: "Thai herbal beauty products to prioritize: (1) Thai jasmine and rice-based facial products: the combination of Thai jasmine extract (renowned for brightening properties) and rice bran extract (common in Thai traditional skin care) appears in high-quality forms at both luxury brands and traditional market products; (2) Turmeric soap: traditional Thai turmeric herbal soaps (sold at market stalls for ฿30–80) are genuinely effective with anti-inflammatory and brightening properties — these are among Bangkok's best-value authentic beauty products; (3) Coconut oil: Thai cold-pressed virgin coconut oil from traditional producers (available at health food stores and Or Tor Kor market) is an authentic and functional multi-use product; (4) Luk Pra Kob herbal compress: the traditional Thai herbal compress (a ball of therapeutic herbs used heated in massage) is available in dry/take-home form at spa product shops — an authentic souvenir that provides genuine at-home spa treatment when reheated.",
  },
];

export function BangkokKBeauty() {
  return (
    <div className="rounded-2xl border border-rose-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-rose-700 mb-3">
        🌸 Bangkok beauty culture — K-Beauty, J-Beauty & Thai herbal skincare
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
