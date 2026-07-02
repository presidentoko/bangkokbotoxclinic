const TIPS = [
  {
    q: "Can I drink tap water in Bangkok?",
    a: "No. Bangkok tap water is treated and technically safe to standards, but the old pipe system in buildings causes contamination. Always drink bottled or filtered water.",
    safe: false,
  },
  {
    q: "Is ice in restaurants and cafés safe?",
    a: "Yes, in almost all established restaurants. Commercial ice in Bangkok is made from purified water and delivered in sealed bags. Tube-shaped ice (hollow center) is commercial-grade — safe. Chipped ice from a block is sometimes tap-derived — avoid at street stalls if concerned.",
    safe: true,
  },
  {
    q: "Where to buy water cheaply?",
    a: "7-Eleven and Family Mart: 1.5L bottles ฿10–15. Refill stations (blue/green machines on streets): ฿1–2/liter. 20L water jugs delivered to condos: ฿35–60. Never buy at tourist spots — ฿50–80 for the same ฿10 bottle.",
    safe: true,
  },
  {
    q: "Is filtered water from hotel rooms safe?",
    a: "Most 4–5 star hotels provide filtered water bottles in rooms or have in-room water purifiers. 3-star and below: use the complimentary bottled water. Don't fill from bathroom tap.",
    safe: true,
  },
  {
    q: "What about smoothies and fresh juice?",
    a: "Generally safe in established venues. The risk is the ice (see above) and washing of fruit. In very budget street stalls, ice can be tap-sourced. Order 'mai sai nam khaeng' (no ice) if concerned.",
    safe: null,
  },
];

export function BangkokDrinkingWater() {
  return (
    <div className="rounded-2xl border border-cyan-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-cyan-700 mb-3">
        💧 Bangkok drinking water — what's safe, what's not
      </div>
      <div className="space-y-2">
        {TIPS.map((t) => (
          <div key={t.q} className="border border-cyan-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1">
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded shrink-0 ${
                t.safe === true ? "bg-green-100 text-green-700" :
                t.safe === false ? "bg-red-100 text-red-700" :
                "bg-yellow-100 text-yellow-700"
              }`}>
                {t.safe === true ? "SAFE" : t.safe === false ? "AVOID" : "CAUTION"}
              </span>
              <div className="font-bold text-[11px]">{t.q}</div>
            </div>
            <div className="text-[10px] text-[var(--fg)] leading-snug">{t.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
