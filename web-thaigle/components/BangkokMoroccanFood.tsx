const ITEMS = [
  {
    name: "Moroccan & North African Restaurants",
    emoji: "🏺",
    area: "Sukhumvit, Sathorn",
    price: "Tagine ฿350–600; Set meal ฿500–900",
    why: "A small number of Moroccan and North African restaurants operate in Bangkok catering to Middle Eastern tourists and expats. Dishes: lamb or chicken tagine (slow-cooked in conical clay pot with preserved lemon, olives), couscous (semolina with stewed vegetables/meat), bastilla (flaky pastry with pigeon/chicken and almonds), harira soup, Moroccan mint tea.",
    tip: "Tagine requires ordering in advance at some restaurants (45–60 minutes cooking). The preserved lemon-olive combination in Moroccan lamb tagine is markedly different from any other cuisine in Bangkok — worth experiencing even for non-North African food enthusiasts. Mint tea service is ceremonial — poured from height.",
  },
  {
    name: "Moroccan & North African Dishes Guide",
    emoji: "🫕",
    area: "Any Moroccan restaurant",
    price: "฿300–700 per dish",
    why: "Key dishes: Harira (tomato-lentil-chickpea soup with herbs, served especially during Ramadan), Mechoui (whole roasted lamb, usually for events), Chermoula (herb marinade with cilantro, lemon, cumin), Rfissa (chicken with fenugreek and lentils over msemen flatbread), Makouda (Moroccan potato fritters). The spice profile — ras el hanout, cumin, coriander, saffron, paprika — is North African and distinct from Middle Eastern.",
    tip: "Most Bangkok Moroccan restaurants also serve Middle Eastern mezze alongside Moroccan dishes. The mint tea here is genuinely ceremonial — green tea brewed strongly, with sugar and fresh mint, poured from height to aerate. Never rushed.",
  },
  {
    name: "Moroccan-Themed Pop-Up Events",
    emoji: "✨",
    area: "Hotel rooftops and special dining experiences",
    price: "฿1,200–3,500 per person event",
    why: "Bangkok's event dining scene sometimes features Moroccan-themed pop-up dinners with full Moroccan set menus, tea service, belly dance entertainment, and Moroccan décor. These are typically held at rooftop venues or event spaces with Moroccan food consultants. One-night experiences rather than permanent restaurants.",
    tip: "Search Facebook Events for 'Moroccan dinner Bangkok' — these events are announced 1–2 weeks ahead. Some feature visiting Moroccan chefs for added authenticity. The theatrical service (multiple courses, tea ceremony, desserts) makes this one of Bangkok's most distinctive special-occasion dining experiences.",
  },
];

export function BangkokMoroccanFood() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        🏺 Moroccan food in Bangkok — tagine, couscous & mint tea ceremony
      </div>
      <div className="space-y-2">
        {ITEMS.map((i) => (
          <div key={i.name} className="border border-amber-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{i.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{i.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{i.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{i.why}</div>
            <div className="text-[10px] text-amber-700">💡 {i.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
