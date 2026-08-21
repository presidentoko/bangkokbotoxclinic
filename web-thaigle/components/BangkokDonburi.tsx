const STYLES = [
  {
    name: "Gyudon (Beef Bowl)",
    emoji: "🥩",
    where: "Yoshinoya chain (15+ Bangkok branches), Japanese donburi restaurants",
    price: "Yoshinoya ฿80–150; Premium gyudon ฿250–450",
    why: "Japanese beef rice bowl — thin-sliced beef and onion simmered in dashi-mirin-soy sauce over steamed rice. Bangkok has multiple authentic Japanese gyudon chains (Yoshinoya is the most accessible). Yoshinoya is fast food-grade, while premium donburi shops in Thonglor and Ekkamai areas serve wagyu or A5-grade beef don.",
    tip: "For premium gyudon: look for Ekkamai and Thonglor area Japanese restaurants. For budget-reliable: Yoshinoya Bangkok hits exactly the expected flavor. Add onsen egg (ajitsuke tamago) if available — egg yolk mixes into the sauce and adds richness.",
  },
  {
    name: "Katsudon (Pork Cutlet Bowl)",
    emoji: "🐖",
    where: "Japanese restaurants citywide, especially Yakiniku or tonkatsu specialists",
    price: "฿150–350",
    why: "Breaded and deep-fried pork cutlet (tonkatsu) simmered briefly in dashi-egg sauce, served over rice. The egg set in the sauce distinguishes katsudon from just putting tonkatsu on rice. Bangkok's Japanese community ensures authentically prepared katsudon is widely available — from convenience stores to proper restaurants.",
    tip: "The best katsudon in Bangkok comes from tonkatsu specialists (restaurants focused on pork cutlets) rather than general Japanese restaurants. The texture of the egg-and-sauce binding is the key indicator of quality — too wet means rushed, too dry means overcooked.",
  },
  {
    name: "Unadon / Unaju (Eel Bowl)",
    emoji: "🐟",
    where: "Premium Japanese restaurants, especially Thonglor/Ekkamai",
    price: "฿380–900 for a proper unaju",
    why: "Grilled freshwater eel (unagi) glazed with kabayaki sauce (sweet soy-mirin) over steamed rice in a lacquered box (jūbako). Japan's premium comfort food. Bangkok sources Japanese-grade eel directly imported — the best unaju in Bangkok rivals many Tokyo restaurants. Typically available at Japanese specialty restaurants, not casual chains.",
    tip: "Unadon is served in a bowl; unaju is served in a lacquered box (more premium). The difference is presentation and sometimes portion size, not the eel itself. Bangkok's Japanese population means authentic unaju is genuinely available — expect a price point similar to Tokyo for the good stuff.",
  },
];

export function BangkokDonburi() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        🍚 Japanese donburi in Bangkok — gyudon, katsudon & unaju rice bowls
      </h2>
      <div className="space-y-2">
        {STYLES.map((s) => (
          <div key={s.name} className="border border-amber-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.where}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-amber-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
