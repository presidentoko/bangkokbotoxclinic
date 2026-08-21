const SPOTS = [
  {
    name: "Colombian & Latin American Food in Bangkok",
    emoji: "🌮",
    area: "Scattered across Bangkok — primarily in areas with Latin American expat presence (Sukhumvit, Silom)",
    price: "Bandeja paisa ฿450–750; Empanadas ฿60–120 each; Arepas ฿100–200; Colombian coffee ฿120–220",
    why: "Colombian and broader Latin American food in Bangkok exists primarily through the Latin expat community (Colombian, Venezuelan, Chilean, Ecuadorian, and other Latin American nationals working in Bangkok's multinational corporations, diplomatic missions, and English teaching community). While dedicated Colombian restaurants are rare, the Latin American community has created informal food access through home cooking, pop-up events, community gatherings, and social media-organized dining. The key Colombian food items sought by the community: arepas (corn flatbreads), bandeja paisa (the national mixed-plate dish with beans, rice, chicharrón, eggs, chorizo, and green plantain), empanadas (corn or wheat pastry with various fillings), and Colombian coffee (considered by many coffee professionals to be among the world's finest). Colombian coffee specifically has achieved Bangkok café presence — specialty coffee culture has embraced Colombian single-origin beans widely.",
    tip: "Finding Latin American food in Bangkok: (1) Facebook groups (Colombianos en Bangkok, Latinos en Bangkok, Latin Americans in Bangkok) are the primary community resources — home cooking orders, pop-up food events, and restaurant recommendations are shared here; (2) Latin American cultural events organized by the Colombian Embassy, Venezuelan community, and other embassies periodically feature food; (3) Some Thai restaurants in tourist areas have added empanadas or Latin-inspired items to menus serving their international customer base. Colombian coffee: Villa Market, Tops, and specialty coffee import shops carry Colombian single-origin beans. Bangkok's specialty coffee café scene uses Colombian beans widely — ask baristas about Colombian options at any quality specialty café.",
  },
  {
    name: "Venezuelan Food & Community",
    emoji: "🫔",
    area: "Latin American community spaces, home delivery through community social media networks",
    price: "Hallacas (traditional) ฿200–400; Tequeños ฿100–200; Pabellón criollo ฿400–600",
    why: "The Venezuelan community in Bangkok has grown as an expat population over the past decade — primarily professionals and their families who relocated to Bangkok for work or who followed the global Venezuelan diaspora pattern. Venezuelan food is distinctively different from Mexican or other Latin American cuisines that Bangkok has more commercial exposure to: hallacas (corn dough tamales with complex filling, traditionally prepared at Christmas), pabellón criollo (the national dish — black beans, white rice, shredded beef, sweet plantains), tequeños (cheese-filled fried bread sticks), cachapas (sweet corn pancakes with cheese), and arepas with fillings very different from Colombian versions. The Venezuelan food tradition is heavily influenced by indigenous, Spanish colonial, and African culinary heritage.",
    tip: "Venezuelan food access in Bangkok: the community primarily shares food through social networks rather than commercial restaurants — connecting with the community through the Venezuelan Embassy's events calendar or expat Facebook groups is the most reliable path. Christmas season: the hallaca preparation tradition is a major cultural event in Venezuelan families — around the Venezuelan Christmas season, community members often prepare batches for sale or share. Tequeños: a few Latin-friendly venues and home entrepreneurs have marketed tequeños in Bangkok — again, community social media is the discovery mechanism. Spanish language connection: speaking basic Spanish with Latin American community members significantly accelerates food access through informal community channels.",
  },
  {
    name: "Salsa Dance Scene & Latin Community Culture",
    emoji: "💃",
    area: "Sukhumvit Soi 11 area, Silom, and dedicated dance venues across Bangkok",
    price: "Salsa class ฿300–500; Social dance event ฿200–400; Latin American restaurant meal ฿500–1,200",
    why: "Bangkok's Latin dance scene (salsa, bachata, merengue, cumbia, kizomba) serves as a social hub for the Latin American expatriate community and the larger international community attracted to Latin culture. The dance community is multilingual and internationally diverse — the Bangkok salsa scene specifically attracts European, Asian, and American participants alongside Latin Americans, creating a multicultural social space distinct from any single national community. Community events around dancing often include Latin American food — catered by community members or organized through Latin-friendly restaurants. The Latin American community in Bangkok, while smaller than the South Asian or East Asian expat communities, has significant social visibility through its dance, music, and food culture.",
    tip: "Latin community discovery through dance: joining a salsa class or attending a social dance event (bachata or salsa nights at Sukhumvit bars) is one of the most organic ways to meet Latin American Bangkok residents — and through these connections, discover food access. Latin cultural calendar: look for 'Noche Latina' events, Colombian Independence Day celebrations (July 20), Venezuelan cultural events, and the broader Latin American community's social programming which includes food components. The Latin American expat community in Bangkok is welcoming to non-Latin visitors who approach with genuine interest in the culture — the shared food and dance traditions serve as accessible cultural entry points.",
  },
];

export function BangkokColombianFood() {
  return (
    <div className="rounded-2xl border border-yellow-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-3">
        🌮 Colombian & Latin American food in Bangkok — community dining, arepas & salsa culture
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-yellow-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-yellow-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
