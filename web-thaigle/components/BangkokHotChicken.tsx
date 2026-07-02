const SPOTS = [
  {
    name: "Korean Fried Chicken (KFC) Scene",
    emoji: "🍗",
    area: "K-Village, Thonglor, Ekkamai Korean district",
    price: "Half chicken ฿350–600; Bucket ฿650–1,200",
    why: "Bangkok's Korean fried chicken (yangnyeom chicken — crispy twice-fried with sweet-spicy sauce) has a dedicated following among both Korean expats and Thai food lovers. The K-pop cultural wave brought Korean fried chicken to Bangkok well before Nashville-style appeared. Brands like Kkanbu Chicken, Pelicana, and Nene Chicken operate in Bangkok's Korean district and malls. The crunch-to-sauce ratio is different from Thai fried chicken — the batter is crispier and thinner.",
    tip: "Korean fried chicken in Bangkok is typically ordered by pieces or half/whole bird (not by weight). The 'combo' includes beer (Korean chimaek culture — chicken + maekju). Half and half (plain + sauce) is the right order for first-timers — lets you compare the styles. Delivery via Grab or Foodpanda is excellent for Korean chicken in the Thonglor/Ekkamai area.",
  },
  {
    name: "Nashville Hot Chicken in Bangkok",
    emoji: "🌶️",
    area: "Thonglor, Ekkamai, Ari — American comfort food wave",
    price: "Sandwich ฿250–450; Plate ฿350–600",
    why: "Nashville hot chicken (cayenne-spiced crispy fried chicken with pickle and white bread) arrived in Bangkok around 2019 and has become an established category. Hot Chicken Factory (Thonglor), Bird Chicken Sandwich, and various casual American-style restaurants serve Bangkok's growing appetite for heat-level-customizable fried chicken. Bangkok diners already familiar with very spicy Thai food often handle the highest heat levels better than American tourists.",
    tip: "Bangkok Nashville hot chicken heat levels: 'Bangkok hot' variants at local restaurants use a mix of cayenne + bird's eye chili (prik kee noo) and are genuinely hotter than most American Nashville hot chicken. If you handle Thai food at normal spice levels, start at the restaurant's mid-range heat and adjust up. The pickle-acid cut is essential — don't eat hot chicken without it.",
  },
  {
    name: "Thai-Style Fried Chicken (Kai Tod)",
    emoji: "🇹🇭",
    area: "Everywhere — street carts, shophouses, restaurant chains",
    price: "Street cart ฿30–60/piece; Restaurant ฿80–200",
    why: "Thailand's own gai tod (fried chicken) is fundamentally different from both Korean and Nashville styles — marinated in lemongrass, galangal, fish sauce, and turmeric, then fried without heavy batter. The result is deeply fragrant, golden, and crunchier-skinned than American fried chicken. Gai Yang (grilled version) alongside gai tod are Thai comfort food. The best gai tod in Bangkok is at street carts and small shophouses, not restaurants.",
    tip: "Street cart gai tod signs to look for: กล้วยแขก (banana fritters alongside chicken) indicates a proper traditional cart. Hat Yai style fried chicken (from Southern Thailand) is the most famous regional variant in Bangkok — more heavily breaded and often served with sticky rice and fried shallots. Several dedicated Hat Yai chicken shophouses exist in On Nut and Bang Na areas.",
  },
];

export function BangkokHotChicken() {
  return (
    <div className="rounded-2xl border border-orange-300 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-orange-800 mb-3">
        🍗 Hot chicken in Bangkok — Korean fried chicken, Nashville hot & Thai gai tod
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
