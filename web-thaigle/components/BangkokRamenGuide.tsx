const PICKS = [
  {
    name: "Fuunji Bangkok",
    emoji: "🍜",
    type: "Tsukemen (dipping ramen) — from Tokyo's famous Fuunji",
    area: "Thong Lo (J-Avenue)",
    price: "฿280–480",
    why: "The Bangkok outpost of Tokyo's cult tsukemen institution. Thick, springy noodles dipped in a super-concentrated chicken dashi broth. Queue starts forming before opening.",
    tip: "Go at opening (11:30am) or after 1:30pm to avoid peak queue. Tsukemen medium spice recommended for first timers. Counter seats only.",
  },
  {
    name: "Ippudo Bangkok",
    emoji: "🏮",
    type: "Hakata-style tonkotsu — Japanese chain",
    area: "Siam Paragon, EmQuartier",
    price: "฿290–550",
    why: "Reliable Japanese-operated tonkotsu chain. Bangkok locations maintain Tokyo quality standards. Shiromaru Classic (milky tonkotsu) is the signature bowl.",
    tip: "EmQuartier location less crowded than Siam Paragon. Weekend lunches can have 20-30min waits. App ordering available at some locations.",
  },
  {
    name: "Bankara Ramen",
    emoji: "🔴",
    type: "Kantō-style soy and miso ramen",
    area: "Rajdamri, MBK",
    price: "฿250–420",
    why: "Japanese chain known for high-quality ingredients at reasonable prices. Miso ramen with butter corn is the crowd favorite. Free gyoza refills during certain hours.",
    tip: "Early lunch (11am–12pm) for fastest service. MBK branch more casual. Noodle firmness customizable — ask for kata (firm) for best texture.",
  },
  {
    name: "Hajime Robot Restaurant",
    emoji: "🤖",
    type: "Robot-served ramen (Tokyo Shio style)",
    area: "Samyan area",
    price: "฿280–450",
    why: "Tokyo's famous robot restaurant in Bangkok. Robots serve every bowl tableside. Surprisingly, the ramen quality is excellent — light shio (salt) broth is their best. Novel for groups.",
    tip: "Show kids the robots during weekday lunch when less crowded. Shio broth more refined than the tonkotsu. Go for the experience first, the ramen is genuinely good bonus.",
  },
];

const STYLES = [
  "Tonkotsu (豚骨) — creamy white pork bone broth, richest style. Hakata-origin.",
  "Shoyu (醤油) — soy-sauce seasoned, Tokyo-style clear-ish broth",
  "Miso (味噌) — fermented soybean paste, hearty and complex. Sapporo-origin.",
  "Shio (塩) — salt-based, lightest and most refined. Hakodate-origin.",
  "Tsukemen — cold noodles dipped in concentrated warm broth. Modern Tokyo style.",
];

export function BangkokRamenGuide() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🍜 Ramen in Bangkok — where to find authentic bowls
      </h2>
      <div className="space-y-2 mb-3">
        {PICKS.map((p) => (
          <div key={p.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{p.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{p.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{p.type} · {p.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{p.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{p.why}</div>
            <div className="text-[10px] text-red-700">💡 {p.tip}</div>
          </div>
        ))}
      </div>
      <details className="border border-red-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-red-700 hover:bg-red-50">
          Ramen styles explained (shio vs shoyu vs tonkotsu vs miso)
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {STYLES.map((s) => (
            <li key={s} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-red-400 shrink-0">•</span>{s}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
