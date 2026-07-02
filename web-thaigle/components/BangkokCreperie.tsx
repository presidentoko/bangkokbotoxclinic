const SPOTS = [
  {
    name: "Sweet Crepes — Japanese-Style Rolled Crepes",
    emoji: "🫓",
    area: "Harajuku-style crepe shops — MBK, Siam Square, shopping malls",
    price: "Crepe ฿80–180",
    why: "The Japanese-style Harajuku rolled crepe conquered Bangkok's mall café scene — thin crepe rolled into a cone shape with combinations of fresh cream, fruit, chocolate, matcha, strawberry, and ice cream. Crepas, Mango Crepe, and various independent Japanese-influenced crepe shops are in every major Bangkok mall. Bangkok's version has adapted toward Thai flavors — mango, pandan cream, taro, and coconut cream appear alongside the Japanese-imported fillings.",
    tip: "The difference between a Japanese-style crepe (Harajuku) and a French galette: Japanese crepe is a paper-thin sweet crepe eaten as a street-style snack; French galette is a savory buckwheat crepe eaten at a table. Bangkok primarily has the Japanese version. The crepe folded into a cone shape is the Harajuku style — unroll a bit before eating to prevent filling falling out. Best combinations: strawberry + fresh cream + custard, or mango + coconut cream.",
  },
  {
    name: "French Crêperies — Savory Galettes",
    emoji: "🇫🇷",
    area: "Sukhumvit 31–49, Silom French expat corridor",
    price: "Galette ฿250–450; Sweet crepe ฿180–300",
    why: "Bangkok's French expat community supports a small but authentic French crêperie scene — proper buckwheat galettes (savory, with ham/egg/cheese combinations in the classic Bretagne tradition), and sweet wheat crepes with butter and sugar, citrus, or Grand Marnier flambe. La Crêperie de Paris and Brasserie de la Rivière serve the Silom/Sathorn French crowd. These are full-meal experiences unlike the Japanese mall version.",
    tip: "Authentic French galette order: Complète (ham + egg + gruyère cheese folded) is the traditional standard. The buckwheat galette must have visible texture and slight earthiness to be authentic — if it tastes like a regular sweet crepe it may be wheat not buckwheat. Normand cider (cidre) is the traditional accompaniment to Bretagne galettes — some Bangkok French restaurants import it.",
  },
  {
    name: "Thai-Kanom Crepe Variations",
    emoji: "🌸",
    area: "Street carts, Thai dessert shops, Chatuchak weekend market",
    price: "฿25–80",
    why: "Thai crepe-like desserts (kanom buang — crispy Thai crepes with meringue and coconut cream, khanom krok — coconut pudding cups) are distinct from French/Japanese versions but fill a similar culinary role. Kanom buang is Bangkok's most important local crepe analog — crunchy shells with sweet and savory filling options. Street stalls selling kanom buang are found throughout the city and represent uniquely Thai dessert culture.",
    tip: "Kanom buang: the golden shell is crispy; the white filling is sweet meringue-based; the orange filling is often shredded sweet egg yolk (foi thong). Eat immediately — kanom buang loses crunch within 10 minutes. Khanom krok (coconut custard in a cast iron dimple pan) is the related softer version — look for the semi-circular iron pan cooking over charcoal at street markets.",
  },
];

export function BangkokCreperie() {
  return (
    <div className="rounded-2xl border border-amber-100 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-amber-600 mb-3">
        🫓 Crepes in Bangkok — Japanese Harajuku, French galettes & Thai kanom buang
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-amber-50 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-amber-600">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
