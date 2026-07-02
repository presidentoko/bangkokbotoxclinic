const SPOTS = [
  {
    name: "Sukhumvit Soi 3 — Bangkok's Arab Quarter",
    emoji: "🧆",
    area: "Sukhumvit Soi 3 (Nana Soi 3), Sukhumvit Road — BTS Nana Station, 5-minute walk",
    price: "Shawarma wrap ฿100–180; Full Arabic meal ฿300–600; Shisha session ฿400–800; Meze plate ฿250–450",
    why: "Sukhumvit Soi 3 (also written as Soi Nana 3 or Soi Arab) is one of Southeast Asia's most established Arab food and culture streets — the area has served the Gulf Arab, Middle Eastern, and North African community in Bangkok for decades. The street has halal restaurants serving Lebanese, Syrian, Egyptian, Iraqi, Yemeni, and Jordanian cuisine including mezze platters, grilled meats (shawarma, kofta, lamb chops), pita bread baked in visible wood-fire ovens, Lebanese fresh juices (jealab, sahlab, lemon mint), and traditional shisha cafés operating into the early morning hours. The combination of authentic Arabic-language signage, the call to prayer from the nearby mosque, and the concentration of Middle Eastern grocery stores creates a genuine cultural district atmosphere distinct from the surrounding Bangkok streetscape.",
    tip: "Soi 3 practical navigation: the street begins immediately from Sukhumvit main road and extends south 300m; most restaurants concentrate in the first 200m. Shisha culture: most restaurants in this area have shisha (hookah) available in outdoor seating areas — widely practiced here as it reflects the cultural norms of the restaurant owners' home countries; check local regulations on indoor smoking before ordering shisha inside. Halal certification: all Soi 3 restaurants are halal-certified; the area is one of Bangkok's most reliable areas for certified halal food beyond Thai Muslim cuisine. Ramadan: during Ramadan, Soi 3 restaurants operate on different schedules (closing during daylight fasting hours, opening at Iftar) — the Iftar atmosphere in this area during Ramadan is a remarkable cultural experience.",
  },
  {
    name: "Middle Eastern Groceries & Import Shops",
    emoji: "🏪",
    area: "Sukhumvit Soi 3 area, with additional stores in Phahonyothin area (near immigration/international schools)",
    price: "Imported spice packets ฿80–300; Tahini ฿150–400; Specialty items 2–4x home country prices",
    why: "Bangkok's Arab and Middle Eastern community has created a supply chain of specialty grocery stores along and near Sukhumvit Soi 3 that stock ingredients unavailable or difficult to find in mainstream Thai supermarkets: premium tahini (sesame paste), sumac, za'atar, bulgur wheat, pomegranate molasses, Arabic coffee (qahwa), dried rose water, ghee, and a range of Gulf market branded products. These stores also carry halal-certified international products (imported meats, dairy from halal-certified sources) that serve both the Middle Eastern community and the broader Bangkok Muslim community. The import grocery landscape includes stores run by families from specific countries (Egyptian-run stores carry different items than Lebanese-run stores) — browsing is the most effective discovery approach.",
    tip: "Middle Eastern grocery navigation: ask the store owner what they specialize in — most have specific regional focus in their product selection that matches their background. Spice pricing: imported spices at these stores cost more than purchasing locally in the region of origin but significantly less than premium import prices at Villa Market or Tops. Online alternatives: Lazada and Shopee Thailand have expanded Middle Eastern and halal specialty product availability in recent years — comparison-shopping both physical Soi 3 stores and online marketplaces is worthwhile for regularly consumed items. Wholesale options: several Soi 3 establishments sell at both retail and wholesale quantities — buying larger quantities of non-perishables reduces per-unit cost.",
  },
  {
    name: "Iranian, Turkish & Central Asian Cuisine",
    emoji: "🫕",
    area: "Sukhumvit Soi 3 area, scattered locations throughout Bangkok's Sukhumvit corridor",
    price: "Kebab plate ฿250–500; Rice dish with stew ฿200–400; Tea and dessert ฿100–200",
    why: "While the Soi 3 area is primarily Lebanese-Syrian-Gulf cuisine, Bangkok also has Iranian, Turkish, and Uzbek/Central Asian restaurants scattered through the Sukhumvit area and beyond — representing the diversity of the Muslim world's culinary traditions. Iranian cuisine (Persian) is distinctively different from Arab food: the rice dishes (tahdig-crusted rice), khoresh stews (fesenjan with pomegranate and walnut, ghormeh sabzi with herbs and legumes), and kebab varieties (koobideh, barg) have a flavor profile with significant saffron, dried fruit, and herb complexity. Turkish cuisine in Bangkok ranges from döner kebab shops to sit-down meyhane format with meze and grilled meats. Uzbek/Central Asian restaurants (a smaller but present community) offer plov (rice pilaf with lamb and carrots) and mantu dumplings.",
    tip: "Finding Persian/Turkish restaurants: Google Maps searches for 'Persian restaurant Bangkok' or 'Turkish restaurant Bangkok' surface the current active options — the restaurant landscape changes periodically as the community moves. Persian restaurants in Bangkok typically have Persian-language signage alongside English and Thai — look for scripts that are not Arabic (Persian and Arabic use the same alphabet but with different letter forms). Turkish restaurants cluster around areas with Turkish business communities (the Bangsue/Chatuchak corridor has some; the Sukhumvit area has others). Uzbek/Central Asian: search specifically online as these are smaller and less visible — the community is centered around families relocated to Bangkok through various immigration paths.",
  },
];

export function BangkokArabicFood() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        🧆 Bangkok Arabic & Middle Eastern food — Sukhumvit Soi 3, halal restaurants & Persian cuisine
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
