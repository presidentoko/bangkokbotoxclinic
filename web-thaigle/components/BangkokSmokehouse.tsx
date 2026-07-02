const SPOTS = [
  {
    name: "Smoke the Butcher — American Barbecue",
    emoji: "🍖",
    area: "Ekkamai, Sukhumvit Soi 63",
    price: "Brisket ฿350–600/300g; Full rack ribs ฿900–1,400",
    why: "Smoke the Butcher is Bangkok's most serious American-style BBQ operation — slow-smoked brisket over 14–18 hours using a custom offset smoker imported from Texas, pork ribs, pulled pork, and house-made sausages. The brisket has the proper bark crust, smoke ring, and fat-rendered tenderness that puts it alongside quality Texas BBQ. Located in Ekkamai, it's become the standard-bearer for Bangkok's growing smoked meat scene. Sell-out by early afternoon is common — arrive at opening (11:30am).",
    tip: "Smoke the Butcher operates on a first-come basis — no reservations. Saturday lunch is the most popular time slot; arrive at 11:30am opening for full selection of cuts. The burnt ends (when available) are not on the standing menu — ask the staff. Take-home packs of brisket for the next day reheat well (low oven, wrapped in foil with a splash of apple juice). Beer selection is American-style — craft IPAs and lagers that pair with the smoke profile.",
  },
  {
    name: "Texas Jack's — Craft Smokehouse & Bar",
    emoji: "🤠",
    area: "Phrom Phong area, Sukhumvit 39",
    price: "Brisket sandwich ฿280; Meat plates ฿350–800",
    why: "Texas Jack's brings American smokehouse culture with a full bar program — a combination that works well in Bangkok's dining-and-drinking culture. Wood-smoked brisket, pulled pork, smoked chicken, and seasonal specials. The bar side has an extensive bourbon and American whiskey selection (over 50 labels) that matches the BBQ theme authentically. The setting is intentionally rustic — rough wood, country music, mounted antlers — creating a cohesive Americana theme that Bangkok expats use as a regular gathering spot.",
    tip: "Texas Jack's happy hour (4–7pm weekdays) offers drink discounts that make the bourbon-and-BBQ combination significantly more economical. The meat-and-three plate (choose a protein and three sides) is the best value order — sides include mac and cheese, coleslaw, baked beans, and cornbread. They do Thanksgiving dinners (pre-order required) that have become a Bangkok expat tradition.",
  },
  {
    name: "Korean BBQ — All-You-Can-Eat Tabletop Smoke",
    emoji: "🥩",
    area: "Sukhumvit, Thonglor, RCA Plaza — multiple venues",
    price: "AYCE ฿399–799/person; Single orders ฿150–800",
    why: "Bangkok has an extensive Korean BBQ scene driven by both Korean expat communities and Thai enthusiasm for Korean food culture. Tabletop charcoal or gas grills allow self-cooking at the table — the experience is social, slow, and smoke-infused in a different way from American BBQ (charcoal-kissed thin slices vs. wood-smoked large cuts). The Bangkok Korean BBQ belt runs along Thonglor and Sukhumvit, with authentic Korean-operated restaurants alongside Thai-adapted versions.",
    tip: "Korean BBQ etiquette in Bangkok: the server typically initiates grilling and flips meat initially — watch their technique. Beef galbi (short rib, bone-in) and pork belly (samgyeopsal) are the signature proteins. All-you-can-eat venues: Sura K-BBQ and KEUN Korean BBQ are reliable Bangkok options with authentic banchan (side dishes) included. Korean soft drinks (Chilsung Cider, Milkis) are at these restaurants for the full Korean dining experience.",
  },
];

export function BangkokSmokehouse() {
  return (
    <div className="rounded-2xl border border-orange-300 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-orange-800 mb-3">
        🍖 BBQ & smokehouse in Bangkok — Texas-style brisket, Korean grill & smoked meat scene
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-orange-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-orange-800">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
