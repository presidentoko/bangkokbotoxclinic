const SHOPS = [
  {
    name: "Warpaint Tattoo (Khao San Road area)",
    emoji: "⚓",
    area: "Khao San Road / Banglamphu",
    style: "Traditional American, Neo-Traditional, Japanese",
    price: "From ฿2,500 for small piece, ฿6,000–20,000 for medium",
    why: "Khao San Road's most respected shop in a sea of tourist tattoo parlors. Experienced artists, clean needles, professional setup. Best for travelers wanting quality without luxury price.",
    tip: "Book ahead — walk-in possible but artists fill up early. Check Instagram portfolios of each artist, not just the shop account.",
  },
  {
    name: "Daruma Tattoo (Ekkamai)",
    emoji: "🎎",
    area: "Ekkamai BTS area",
    style: "Japanese traditional, Neo-Japanese, Irezumi",
    price: "From ฿4,000, large pieces ฿15,000–50,000+",
    why: "Bangkok's top Japanese-style tattoo studio. Artists trained in Japan. If you want Irezumi done properly in Bangkok, this is the destination.",
    tip: "Japanese-style tattoo requires multiple sessions for large pieces. Consultation first — they'll assess your design and suggest traditional elements.",
  },
  {
    name: "Panumart Tattoo (Silom)",
    emoji: "🎨",
    area: "Silom area",
    style: "Watercolor, Geometric, Contemporary",
    price: "Small ฿2,000–5,000, Medium ฿5,000–15,000",
    why: "Bangkok's best watercolor tattoo specialist. Award-winning artists. Clean, modern studio. Has appeared in international tattoo publications.",
    tip: "Watercolor tattoos fade faster than traditional — ask about technique that combines black outline for longevity. Sun protection essential post-tattoo.",
  },
  {
    name: "Sak Yant vs Regular Tattoo",
    emoji: "🙏",
    area: "Ajarns (monks/priests) at temples; avoid tattooing 'Sak Yant style' at commercial shops",
    style: "Sacred Thai bamboo tattoo — spiritual ceremony",
    price: "Temple donation-based (฿500–2,000 suggested), no fixed price",
    why: "Sak Yant (sacred geometrical Thai tattoo) done by a monk or Ajarn is a religious ceremony, not a fashion statement. It involves blessing, chanting, and dietary restrictions.",
    tip: "Most foreigners visit Wat Bang Phra in Nakhon Pathom (2hrs from Bangkok) or find Bangkok-based Ajarns. Research the specific rules — Sak Yant has restrictions (no alcohol, certain foods) for the blessing to hold.",
  },
];

export function BangkokTattooParlors() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-gray-700 mb-3">
        💉 Bangkok tattoo studios — styles, prices & what to know
      </h2>
      <div className="space-y-2">
        {SHOPS.map((s) => (
          <div key={s.name} className="border border-gray-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.style} · {s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-gray-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
