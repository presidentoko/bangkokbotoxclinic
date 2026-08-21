const SPOTS = [
  {
    name: "Habesha Restaurant",
    emoji: "🇪🇹",
    area: "Sukhumvit area (check Google Maps for current address)",
    price: "Sharing platter ฿550–1,200, individual dishes ฿200–450",
    why: "Bangkok's most established Ethiopian restaurant. Authentic injera (sour spongy flatbread) served communally. Doro wat (spiced chicken stew), misir (red lentils), tibs (sautéed meat). Low tables and woven baskets for plates.",
    tip: "Ethiopian food is eaten with hands — injera replaces utensils. Tear injera pieces to scoop stews (never use left hand in traditional setting). The sharing platter for 2 is the best introduction. Vegetarian combo available (fasting combo).",
  },
  {
    name: "African Restaurant Communities (Nana Area)",
    emoji: "🌍",
    area: "Nana/Sukhumvit Soi 3 African expat community",
    price: "Varies: ฿150–500 per dish",
    why: "Bangkok's African expat community around Sukhumvit has small community restaurants serving East and West African food. Ethiopian, Eritrean, Nigerian, Ghanaian restaurants come and go. Less formal, more authentic, community-focused.",
    tip: "Google 'Ethiopian restaurant Bangkok' and check opening months — small community restaurants change. Facebook groups for African expats in Bangkok list current open spots. Weekend only for some locations.",
  },
  {
    name: "Ethiopian Food via Grab (Community Chefs)",
    emoji: "📱",
    area: "Delivery via Grab Food or LINE MAN",
    price: "Meal for 2: ฿400–800 with delivery",
    why: "Bangkok has Ethiopian home chefs selling via food delivery apps and social media. Often more authentic than restaurants (grandmother recipes, freshly made injera). Search 'Ethiopian' in Grab Food's Bangkok search.",
    tip: "Instagram and Facebook: search 'Ethiopian food Bangkok delivery' — community chefs accept pre-orders. WhatsApp ordering for injera bread specifically (some chefs sell just injera to other African expats who cook at home).",
  },
];

const ESSENTIALS = [
  "Injera: sour teff flatbread — the plate, utensil, and bread all in one. Essential to Ethiopian food.",
  "Doro Wat: chicken drumstick in spiced berbere sauce — national dish of Ethiopia",
  "Misir Wot: red lentil stew with berbere spice — vegetarian/vegan staple",
  "Tibs: sautéed beef or lamb with garlic and rosemary — dry, not saucy",
  "Shiro: chickpea flour stew — mild, often ordered for fasting (vegan) meals",
  "Coffee Ceremony: Ethiopian coffee culture — dark, spiced, drunk from small cups with incense",
];

export function BangkokEthiopianFood() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🇪🇹 Ethiopian food in Bangkok — injera, doro wat & where to find it
      </h2>
      <div className="space-y-2 mb-3">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-green-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-green-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
      <details className="border border-green-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-green-700 hover:bg-green-50">
          Ethiopian food essentials
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {ESSENTIALS.map((e) => (
            <li key={e} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-green-400 shrink-0">•</span>{e}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
