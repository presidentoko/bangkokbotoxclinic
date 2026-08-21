const SPOTS = [
  {
    name: "Argentine Steakhouses & Parrilla in Bangkok",
    emoji: "🥩",
    area: "Sukhumvit (multiple soi), Silom, riverside dining areas",
    price: "Argentinian beef cuts ฿1,200–4,500; Full parrilla spread ฿3,000–8,000/person",
    why: "Argentina's beef culture has a small but authentic presence in Bangkok — Argentinian restaurants import or source Argentine beef breeds and cook using parrilla (wood or charcoal grill) technique where meat is cooked low-and-slow before final searing, producing a different result from Asian-style grilling. The parrilla experience typically includes chimichurri (herb sauce made with parsley, garlic, olive oil, and vinegar), provoleta (grilled provolone cheese), and empanadas as starters. Bangkok's Argentine community (small but connected) and South American tourists create demand for authentic Argentine preparations.",
    tip: "Argentine beef in Bangkok: the best Argentine restaurants import Hereford or Angus cuts from Argentina specifically (not Thai or Australian beef). Ask about beef origin when ordering — authentic Argentine restaurants are proud to specify provenance. Chimichurri quality is a restaurant quality indicator — made fresh with genuine olive oil and proper herb ratio, it should taste bright and herbaceous, not oily or garlic-forward. For the parrilla experience: order off-cut items (entraña/skirt steak, chorizo, morcilla/blood sausage) rather than only ribeye — these showcase the full asado tradition.",
  },
  {
    name: "South American Community & Home-Style Cooking",
    emoji: "🌮",
    area: "Community-run pop-ups, Airbnb Experience-style hosting, expat community events",
    price: "Community event dinner ฿800–2,000 per person",
    why: "Beyond formal restaurants, Bangkok's South American community (Argentinians, Chileans, Colombians, Peruvians, Brazilians — often connected through work and entrepreneurship) organizes informal cooking events, home-cooked meals offered through expat networks, and pop-up dinners. These informal community dinners capture authentic home-style South American food unavailable in restaurants — asado as a social event (multi-hour grilling with music and conversation) rather than a restaurant transaction. The Internations and expat Facebook group networks surface these events regularly.",
    tip: "Finding South American community food in Bangkok: search Facebook for 'South American Bangkok', 'Argentine Bangkok', and 'Latinos Bangkok' groups. Community asado events are announced informally through these groups — usually organized by community members who miss home cooking and host for their network. Bring something to share (wine if you drink it; Argentine Malbec is the culturally appropriate choice). These gatherings are also language-practice opportunities for Spanish learners.",
  },
  {
    name: "Empanadas, Alfajores & Argentine Bakery",
    emoji: "🥟",
    area: "Small bakeries and market vendors around expat areas",
    price: "Empanadas ฿80–180 each; Alfajores ฿60–150 each",
    why: "Argentine baked goods — empanadas (savory pastry turnovers with beef, chicken, or cheese fillings) and alfajores (sandwich cookies made with dulce de leche and chocolate coating) — have passionate advocates in Bangkok's South American community and among Thais who've encountered them. A few small operators produce these for Bangkok sale — through Instagram pages, community group orders, and occasional market appearances. The Argentine empanada culture (specific regional styles — Tucumán-style with boiled egg and olive inside, Buenos Aires-style with juicier meat filling) is well represented when you find an authentic maker.",
    tip: "Finding Argentine baked goods in Bangkok: Instagram searches for 'empanada Bangkok' and 'alfajores Bangkok' surface the active homemade producers. These are typically home-baker entrepreneurs (Argentinian expats) selling through pre-order systems rather than storefront operations. Orders usually require 2–3 days notice. Alfajores are particularly loved as gifts — properly made, they travel well in a box for same-day gifting. For empanadas: the baked version (al horno) vs. fried version (fritas) represents a regional preference debate — both legitimate, different textures and fat content.",
  },
];

export function BangkokArgentinianFood() {
  return (
    <div className="rounded-2xl border border-sky-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-sky-700 mb-3">
        🥩 Argentine food in Bangkok — parrilla steaks, empanadas, alfajores & community asado
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-sky-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-sky-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
