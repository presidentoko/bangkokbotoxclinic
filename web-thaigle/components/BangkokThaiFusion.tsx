const SPOTS = [
  {
    name: "Thai-Japanese Fusion — Nikkei Style",
    emoji: "🇯🇵",
    area: "Thonglor, Ekkamai, EmQuartier",
    price: "Mains ฿350–900",
    why: "Bangkok's Thai-Japanese fusion scene goes far beyond sushi adaptation. Restaurants combining Thai chili heat and Japanese umami depth — tom yum-flavored wagyu ramen, nam prik ong pasta with yuzu, yam mamuang (mango salad) integrated into omakase courses. The Thai-Japanese food culture overlap runs deep: both cuisines prize fresh, high-quality ingredients; both use fermentation extensively; and Bangkok's large Japanese expat community drives demand for authentic fusion that respects both traditions.",
    tip: "The best Thai-Japanese fusion distinguishes itself from 'Thai restaurant adding sushi rolls' — look for chefs with formal training in both traditions or restaurants specifically designed around the fusion concept. Restaurants like Mezzaluna (fine dining Thai fusion) and various Thonglor concepts explore this space seriously.",
  },
  {
    name: "Thai-Italian Fusion (Pasta with Thai Herbs)",
    emoji: "🍝",
    area: "Widespread — most multi-concept cafés and modern Thai restaurants",
    price: "Pasta ฿250–600",
    why: "Thai-Italian fusion is Bangkok's most commercially successful fusion category — tom yum linguine, nam prik ong spaghetti (minced pork + tomato chili sauce over pasta), pad see ew with Italian sausage. These dishes appeal to Thai diners who love both cuisines without heavy cultural baggage. International mall food courts and modern Thai restaurants universally include at least one Thai-Italian hybrid. The technique cross-pollination is genuine — Italian emulsification applied to Thai sauce-making, wok technique applied to pasta finishing.",
    tip: "Bangkok's tom yum pasta is generally excellent — the bright acid and lemongrass flavor profile works well with pasta. Order from places that cook the pasta fresh rather than pre-boiling (ask 'pasta fresh?' — if they have to check, it's likely not). The best Thai-Italian fusion in Bangkok integrates Thai aromatics into classical Italian technique rather than just adding chili to existing Italian recipes.",
  },
  {
    name: "Contemporary Thai — Reinventing Classics",
    emoji: "🌿",
    area: "Gaggan, Nahm, Sorn, Paste — serious fine dining",
    price: "Tasting menu ฿2,500–8,000/person",
    why: "Bangkok is home to some of Asia's most celebrated contemporary Thai restaurants — Nahm, Sorn (awarded Michelin stars), Gaggan (molecular cuisine using Thai flavors), Le Du (progressive Thai), and Paste (Thai history-based cuisine). These restaurants treat Thai cuisine with the same intellectual seriousness as French haute cuisine — researching historical recipes, sourcing rare regional ingredients, and applying modern technique while maintaining Thai flavor profiles. Bangkok's fine dining Thai scene is globally significant.",
    tip: "Booking Bangkok fine dining: Gaggan, Sorn, and Le Du book out weeks in advance — plan ahead. Prix-fixe tasting menus are standard at top-end restaurants. Wine pairing programs at Bangkok fine dining are sophisticated — some sommeliers focus exclusively on natural wine from producers who complement Thai spice profiles. Counter dining (chef's table) is available at several Bangkok fine dining restaurants for an interactive experience.",
  },
];

export function BangkokThaiFusion() {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-emerald-700 mb-3">
        🌿 Thai fusion in Bangkok — Thai-Japanese nikkei, Thai-Italian pasta & fine dining
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
