const SPOTS = [
  {
    name: "Nordic & Scandinavian Restaurants in Bangkok",
    emoji: "🐟",
    area: "Sukhumvit premium restaurant zone, Ari neighborhood, hotel-adjacent fine dining",
    price: "Nordic tasting menu ฿2,500–8,000; À la carte mains ฿600–2,200",
    why: "Nordic cuisine's international prestige (Noma's influence, New Nordic movement) has reached Bangkok — a small number of restaurants interpret Nordic cooking philosophy (seasonal simplicity, foraged ingredients, fermentation, precise technique) through Thai ingredients. The fusion creates interesting work: Nordic preservation techniques (pickling, fermenting, smoking) applied to Thai fish sauce culture, local herbs replacing Scandinavian foraged plants, and Thai tropical fruits meeting Nordic minimal presentation style. Bangkok's fine dining scene, hungry for novel concepts, has embraced Nordic-influenced cooking.",
    tip: "Bangkok's Nordic food scene is tiny but interesting: rather than looking for dedicated Scandinavian restaurants (very few exist as standalone operations), look for Bangkok fine dining chefs who cite Nordic influences in their cooking. Several Thai chefs have staged at Nordic restaurants and returned to Bangkok incorporating those techniques. Chef's table and omakase formats in Bangkok often display Nordic-influenced seasonality and fermentation interest. For classic Scandinavian food: the Swedish expat community occasionally organizes smörgåsbord events (pickled herring, gravlax, meatballs, lingonberry) — check Scandinavian community Facebook groups.",
  },
  {
    name: "Swedish & Danish Community Food",
    emoji: "🍣",
    area: "Scandinavian expat events, IKEA Bangkok (Bangna), specialty Scandinavian products",
    price: "IKEA Swedish Food Corner: ฿89–195 plates; Community event dinner: ฿800–2,000",
    why: "Bangkok's Scandinavian expat community (Swedish, Danish, Norwegian, Finnish — collectively several thousand residents) maintains food traditions through regular community events, holiday celebrations, and imported product sourcing. IKEA Bangkok (Bangna location) serves as both a furniture destination and a Scandinavian food proxy — the IKEA Swedish restaurant offers Swedish meatballs, salmon, and lingonberry. More authentic community eating happens at Scandinavian Association events (Swedish Club Bangkok, Danish Club Bangkok) which organize traditional dinners around Midsommar, Christmas Julbord, and other celebrations.",
    tip: "Accessing Scandinavian food community events: the Swedish Women's Club Bangkok and Scandinavian Society Bangkok advertise dinners and events through Facebook — membership is usually not required for food events. For Scandinavian products in Bangkok: Villa Market (expat supermarket chain) carries imported Scandinavian items (crispbread, licorice, aquavit sometimes). Central Food Hall at Centralworld occasionally stocks Nordic specialty foods. IKEA's Swedish Food Corner is the most accessible everyday Scandinavian food experience — genuinely authentic meatballs.",
  },
  {
    name: "Gravlax, Smoked Salmon & Nordic Delicatessen",
    emoji: "🐠",
    area: "Premium supermarkets (Gourmet Market, Villa Market), hotel delicatessen counters",
    price: "Imported smoked salmon ฿350–800/200g; Nordic deli items ฿150–600",
    why: "Nordic salmon preparations — gravlax (dry-cured with salt, sugar, and dill), cold-smoked salmon, and hot-smoked salmon — are available through Bangkok premium supermarkets and hotel deli counters as imported products from Norway and Sweden. Norwegian salmon's global distribution network makes it widely available even in Bangkok. The quality of Norwegian farmed salmon sold in Bangkok premium supermarkets is genuinely high. Some Bangkok chefs produce their own gravlax using imported Norwegian salmon with Thai herbs replacing the traditional Nordic spices — interesting hybrids available at specialty food events.",
    tip: "Sourcing Nordic-style salmon in Bangkok: Gourmet Market at Siam Paragon and EmQuartier carry Norwegian smoked salmon at premium pricing. Central Food Hall and some Villa Market locations also carry imported smoked salmon. For making gravlax at home: fresh Norwegian salmon is available at Makro (bulk purchase) and wet markets in Bangkok — the curing process takes 48–72 hours and requires only salt, sugar, and dill. DIY gravlax in Bangkok is rewarding and significantly cheaper than buying imported pre-cured product.",
  },
];

export function BangkokScandinavianFood() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        🐟 Scandinavian food in Bangkok — Nordic dining, Swedish community events & smoked salmon
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-blue-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
