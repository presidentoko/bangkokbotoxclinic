const SPOTS = [
  {
    name: "Bubble Tea Chains — Tiger Sugar, Gong Cha, The Alley",
    emoji: "🧋",
    area: "Every major mall and busy street corner across Bangkok",
    price: "฿85–180",
    why: "Bangkok is one of the most competitive global bubble tea markets — Taiwanese and Hong Kong chains (Tiger Sugar, Gong Cha, Koi Café, The Alley, Yi Fang), Japanese chains (HEYTEA), Korean chains (Mintel), and Thai-originated brands compete for market share at every mall in the city. Bubble tea density in Bangkok malls exceeds most Asian cities. Bangkok consumers are knowledgeable and demanding — chain quality is consistently good because mediocre shops fail quickly.",
    tip: "Bangkok bubble tea ordering guide: sweetness level ('yen waan' — cold sweet) usually 0%, 25%, 50%, 75%, 100% options. Full sugar is very sweet — most regulars order 50% or less. Ice level matters more in Bangkok's heat — 'normal ice' is appropriate unless you plan to take a long time drinking. Tiger Sugar's signature brown sugar tiger stripes (original tapioca + brown sugar milk) remains the category-defining drink — worth trying at least once.",
  },
  {
    name: "Thai-Original Bubble Tea & Boba",
    emoji: "🇹🇭",
    area: "Street stalls, Chatuchak, local neighborhoods",
    price: "฿35–80",
    why: "Thailand has its own boba tea tradition predating the Taiwanese wave — nam cha tai (Thai iced tea) with tapioca pearls has existed at Thai street stalls for decades. The classic: strong orange-red Thai tea (from Cha Tra Mue brand tea powder), sweetened condensed milk, ice, and optional black tapioca pearls in a clear plastic bag tied with rubber band. Bangkok street-version Thai boba tea is different (cheaper, stronger, sweeter) than the polished chain versions.",
    tip: "The original Thai boba drink costs ฿25–45 at street stalls vs ฿120–180 at chains. The difference: chain versions use fresher tea, better quality pearls (QQ texture), and controlled sugar. Street stalls use stronger, more artificial-tasting tea powder and simpler pearls. Both have their place — chain for quality, street stall for authenticity and price. The plastic bag with straw format is Bangkok's original portable drink packaging.",
  },
  {
    name: "Specialty Drinks Café Scene",
    emoji: "🍵",
    area: "Ari, Ekkamai, Thonglor café districts",
    price: "฿120–250",
    why: "Beyond mass-market bubble tea, Bangkok has a specialty drink café scene that blends Japanese, Korean, and Taiwanese influences: cheese tea (salted cream cheese foam over tea), matcha layered drinks, fresh coconut boba, taro milk tea with real taro puree. Cafés in Ari and Ekkamai regularly release seasonal menu items tied to Thai holidays (Songkran mango flavors, Loy Krathong lotus themes, King's birthday golden drinks) creating limited-edition beverages.",
    tip: "Bangkok café drink trends move fast — what's on Instagram today may be gone in 2 months. Check @bangkokfoodie and @eatbangkok Instagram accounts for current trending drinks. The most sustainable Bangkok drink trends: cheese tea (still popular after 5 years), fresh coconut combinations, and brown sugar variants have all remained viable. Gimmick drinks (electric-colored, unusual container shapes) typically disappear within one season.",
  },
];

export function BangkokBubbleTea() {
  return (
    <div className="rounded-2xl border border-purple-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-purple-700 mb-3">
        🧋 Bubble tea in Bangkok — Tiger Sugar vs Thai street tea, chains & specialty cafés
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-purple-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-purple-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
