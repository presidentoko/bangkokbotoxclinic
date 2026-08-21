const SERVICES = [
  {
    service: "Tailor-Made Suits (Day 1 fitting, Day 3 pickup)",
    emoji: "👔",
    area: "Silom Road / Sukhumvit Soi 11 (tailors concentrated here)",
    price: "Suit: ฿8,000–25,000 (2-piece). Shirt: ฿1,500–3,500.",
    quality: "Wide range — interview before committing",
    why: "Bangkok tailors can produce quality suits in 2–3 days with 2 fittings. Used by expats, business travelers, and fashion-savvy tourists.",
    avoid: "Tuk-tuk drivers recommending 'their friend's tailor' — 100% commission-based. Walk to known tailors on Silom directly.",
    trusted: "Nickaly Tailor, Raja's Fashions, Marco Tailor (Sukhumvit 19). Read current TripAdvisor reviews before visiting.",
  },
  {
    service: "Fast Alterations (hemming, resizing)",
    emoji: "✂️",
    area: "Any neighborhood — local dressmakers everywhere",
    price: "Hem a dress/pants: ฿50–150. Resize a shirt: ฿100–250.",
    quality: "Thai dressmakers are excellent for standard alterations",
    why: "Need that new market purchase fitted? Thai dressmakers provide fast, affordable alterations. Usually 24–48hr turnaround.",
    avoid: "Nothing to avoid — standard alteration is low-risk.",
    trusted: "Look for shops with sewing machines visible at street level. Or Tor Kor Market area has several.",
  },
  {
    service: "Silk and Traditional Thai Fabric",
    emoji: "🧵",
    area: "Jim Thompson (multiple), Silom Village, Chatuchak",
    price: "Jim Thompson silk fabric: ฿300–2,000/meter. Chatuchak handmade: ฿80–500/meter.",
    quality: "Jim Thompson: premium, certified authentic Thai silk",
    why: "Thai silk is world-renowned. Have custom clothing made using authentic Thai silk from Jim Thompson or handmade village weaves.",
    avoid: "Fake silk sold as real. Test: burn test (silk ash is powdery, synthetic forms a hard bead). Or buy from Jim Thompson (guaranteed).",
    trusted: "Jim Thompson stores: Emporium, Siam Paragon, standalone Surawong store. Chatuchak Section 26 for artisan weavers.",
  },
];

export function BangkokClothingAlteration() {
  return (
    <div className="rounded-2xl border border-purple-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-purple-700 mb-3">
        🧵 Bangkok tailors & alterations — custom suits to quick hemming
      </h2>
      <div className="space-y-2">
        {SERVICES.map((s) => (
          <details key={s.service} className="border border-purple-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-purple-50 transition">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.service}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </summary>
            <div className="px-3 pb-3 border-t border-purple-100 pt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{s.why}</div>
              <div className="text-[10px] text-green-700">✅ Trusted: {s.trusted}</div>
              <div className="text-[10px] text-red-600">⚠️ Avoid: {s.avoid}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
