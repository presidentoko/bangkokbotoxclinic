const SPOTS = [
  {
    name: "Ethiopian & East African Restaurants",
    emoji: "🇪🇹",
    area: "Sukhumvit soi 20–40 (African expat community)",
    price: "Set meal ฿300–600",
    why: "Bangkok has a small but established African restaurant scene serving expats from Ethiopia, Kenya, Nigeria, Ghana, and other nations — primarily in the Sukhumvit corridor. Ethiopian injera (sour sourdough flatbread used as both plate and utensil) with stews (tibs, doro wat, shiro) represents the most distinct East African cuisine in Bangkok. The eating-by-hand communal style is different from most Asian restaurant cultures — worth experiencing.",
    tip: "Ethiopian restaurants in Bangkok are small and may have limited English-language menus. Point at what other tables are eating, or ask for 'vegetarian combination' (a mix of lentil, chickpea, and vegetable stews on injera — usually reliable). Tej (Ethiopian honey wine) and Ethiopian coffee ceremony (fresh-roasted tabletop) are available at better establishments.",
  },
  {
    name: "West African (Nigerian/Ghanaian) Food",
    emoji: "🇳🇬",
    area: "Sukhumvit, Khlong Toei — small African community restaurants",
    price: "Mains ฿200–500",
    why: "Nigerian and Ghanaian restaurants in Bangkok serve the African student and professional communities studying at Thai universities. Jollof rice, egusi soup, pounded yam, fufu, and suya (spiced beef skewers) represent the West African menu. These restaurants are often undiscovered by tourists and represent an authentic slice of Bangkok's unexpectedly diverse international community. West African cuisine is significantly underrepresented in global dining guides to Bangkok — which is precisely why finding it is interesting.",
    tip: "West African restaurants in Bangkok often operate through community word-of-mouth and may not have online listings. Facebook groups for Nigerian/Ghanaian expats in Bangkok share current restaurant information. Suya (suya spice-marinated beef) is the most accessible West African street food introduction — spiced with ground peanuts, ginger, and paprika.",
  },
  {
    name: "South African Influences at Steak & BBQ",
    emoji: "🥩",
    area: "Various — steak restaurants across Bangkok",
    price: "Braai-style mains ฿400–1,200",
    why: "South African cuisine is less restaurant-specific in Bangkok but visible in the braai (South African BBQ) culture imported by the South African expat community. Some Bangkok steak restaurants offer South African biltong (dried cured meat) as an import snack. The South African community in Bangkok is active in rugby clubs and expat social circles. Boerewors (South African spiced sausage) occasionally appears at Bangkok's specialty butcher counters.",
    tip: "South African biltong is available at specialty import shops in Bangkok (Villa Market, Tops Supermarket Premium) — particularly around Sukhumvit. The South African Association of Thailand organizes braai and social events which are generally open to all nationalities interested in South African culture. Bangkok's rugby community (predominantly South African, Australian, New Zealand, UK) overlaps heavily with this social scene.",
  },
];

export function BangkokAfricanFood() {
  return (
    <div className="rounded-2xl border border-yellow-300 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-yellow-800 mb-3">
        🌍 African food in Bangkok — Ethiopian injera, Nigerian jollof rice & South African braai
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
            <div className="text-[10px] text-yellow-800">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
