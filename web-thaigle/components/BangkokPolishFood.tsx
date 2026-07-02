const SPOTS = [
  {
    name: "Polish Cuisine in Bangkok — Where to Find It",
    emoji: "🥟",
    area: "Scattered locations throughout Bangkok, with some concentration near international schools and European expat areas",
    price: "Pierogi plate ฿280–450; Polish deli items ฿80–400; Import grocery items 2–4x Poland prices",
    why: "Polish cuisine in Bangkok represents the Eastern European expat community — a smaller but present population that includes professionals working in international companies, diplomats, and families connected to the city's international schools. Polish food is rarely its own standalone restaurant category in Bangkok; it more often appears in 'European deli' or 'Continental' restaurant contexts. However, the Eastern European community has established grocery resources that stock Polish specialty items: imported kiełbasa sausages, żurek soup base, bigos (hunter's stew) in jars, Polish bread varieties, and imported Polish beer (Żywiec, Tyskie). The Polish Catholic community in Bangkok (centered around the Catholic churches in the expat residential areas) holds periodic community events where homemade Polish food is prepared.",
    tip: "Finding Polish food in Bangkok: Villa Market and Tops Supermarket occasionally stock Polish and Eastern European imported items — availability varies by location and season. European expat delis (primarily in Sukhumvit and Silom areas) carry the most consistent selection. The Polish Consulate in Bangkok maintains contact with the Polish community — community events are sometimes the best source of genuine home-cooked Polish food. Online Polish expat communities in Bangkok (Facebook: Polacy w Bangkoku / Poles in Bangkok) are the primary social infrastructure and the most reliable source for current restaurant recommendations.",
  },
  {
    name: "Eastern European Food Landscape in Bangkok",
    emoji: "🫕",
    area: "European import delis and expat community gathering points across Bangkok",
    price: "Czech/Slovak beer ฿150–300; Eastern European sausages ฿200–500/pack; Imported pickles ฿100–250",
    why: "The broader Eastern European food landscape in Bangkok reflects the heterogeneous expat community — Czech, Slovak, Hungarian, Romanian, Bulgarian, and Ukrainian expats each represent community niches with food traditions somewhat distinct from but related to Polish cuisine. The shared traditions (fermented cabbage/bigos/kapusta preparations, sausage culture, hearty stews, dumpling traditions parallel to pierogi) make Eastern European cuisine more accessible as a collective category than as individual national cuisines. Ukrainian food specifically has gained community presence in Bangkok following the post-2022 Ukrainian refugee and diaspora expansion in Southeast Asia — Bangkok received a notable number of Ukrainian families, and community dining and food sharing networks have developed. Czech beer culture is perhaps the most commercially visible Eastern European food element in Bangkok — Czech pubs (Pilsner Urquell-serving establishments) have a Bangkok presence in the Sukhumvit area.",
    tip: "Eastern European expat dining discovery: expat Facebook groups (Expats in Bangkok, Europeans in Bangkok) are the most effective way to find current recommendations for Eastern European food — both from resident expats who host community meals and from the occasional pop-up or community dining event. Czech pubs in Bangkok: search 'Czech pub Bangkok' or 'Pilsner Bangkok' for Sukhumvit-area establishments with Czech beer on tap and sometimes Czech bar food (fried cheese, svíčková hints). Ukrainian community events in Bangkok: the Ukrainian community has organized in Bangkok for mutual support — community events sometimes include traditional food preparation and sharing.",
  },
  {
    name: "European Comfort Food & Pub Grub",
    emoji: "🍺",
    area: "Sukhumvit international bar strip, Silom expat pubs, various international neighborhood options",
    price: "European-style pub meal ฿350–700; Imported European beer ฿200–400; Cheese plate ฿400–900",
    why: "European comfort food more broadly — the Continental European pub food tradition (schnitzel, sausage plates, beer garden food) is available in Bangkok at European-owned or European-themed establishments. The demand comes from the substantial European expat community (German, Austrian, Swiss, Scandinavian, British, Dutch, and Eastern European residents) who seek familiar food options alongside Thai cuisine in their daily Bangkok life. The International Beer Garden events (Oktoberfest celebrations at major hotels, German community events, European chamber of commerce events) provide periodic concentration of European food culture. Bangkok has several genuine German-owned restaurants and delis — Schnitzel House and similar establishments with European-trained chefs serve authentic versions of Central European comfort food.",
    tip: "European food shopping in Bangkok: for Polish and Eastern European specific items, the best strategy is: (1) Villa Market (multiple locations) for imported European specialty items; (2) Gourmet Market (Emporium, Siam Paragon food halls) for premium European imports; (3) Import specialty stores in the Nana/Sukhumvit area that cater specifically to European expat needs. German Market Days: the German-Thai Chamber of Commerce and community organizations periodically organize German market events in Bangkok — these feature authentic food imports and prepared food vendors. For high-frequency Polish food access, making connections within the Polish expat community is genuinely more effective than restaurant searching.",
  },
];

export function BangkokPolishFood() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🥟 Polish & Eastern European food in Bangkok — community dining, import delis & European pubs
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-red-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
