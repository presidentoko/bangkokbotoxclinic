const FESTIVALS = [
  {
    name: "Songkran (Thai New Year)",
    thai: "สงกรานต์",
    emoji: "💦",
    when: "April 13–15 (national holiday; unofficial 5–7 days)",
    what: "World's biggest water fight. All of Bangkok (especially Silom, Khao San, Sukhumvit) becomes a massive water gun battle.",
    why: "Buddhist New Year tradition involves ritual pouring of water. Modern version: water guns, trucks with bins of water, everyone soaked.",
    tip: "Pack water-resistant gear for your phone. Dress to get completely soaked. Silom road is best battle ground. Avoid if you hate crowds.",
    avoid: "Traffic is catastrophic. Don't try to drive anywhere April 13–15.",
  },
  {
    name: "Loy Krathong",
    thai: "ลอยกระทง",
    emoji: "🏮",
    when: "November (full moon night — date varies each year)",
    what: "Floating lotus-shaped krathong (small float) on rivers and canals. Sky lanterns (Yi Peng) released in north.",
    why: "Beautiful Buddhist tradition thanking the water goddess. Chao Phraya and all canals glow with floating flowers and candlelight.",
    tip: "Asiatique riverfront is the best Bangkok venue. Arrive early (6pm) for best spot. Buy krathong ฿50–100 at event.",
    avoid: "Yi Peng lanterns mainly in Chiang Mai (same night) — Bangkok has some but not the full effect.",
  },
  {
    name: "Chinese New Year (Yaowarat)",
    thai: "ตรุษจีน",
    emoji: "🐉",
    when: "January–February (varies by lunar calendar)",
    what: "Yaowarat (Chinatown) explodes with red lanterns, lion dances, firecrackers, food stalls. Bangkok's most spectacular street festival.",
    why: "Bangkok has one of Southeast Asia's largest Chinese communities. Yaowarat transforms completely — can be hard to move through the crowds.",
    tip: "Arrive before 6pm to get space. Lion dance parade down Yaowarat Road is unmissable. Eat everything — the food is spectacular.",
    avoid: "Very crowded from 7pm. Claustrophobic if you dislike dense crowds.",
  },
  {
    name: "King's Birthday / National Day",
    thai: "วันพ่อแห่งชาติ",
    emoji: "🇹🇭",
    when: "December 5 (Father's Day / King Rama IX Birthday — national celebration)",
    what: "Grand Palace area illuminated. National events. Bangkok decorated with yellow and white lights throughout the city.",
    why: "Reverence for monarchy is deeply felt in Thailand. Respectful participation is welcomed. Ratchadamnoen Avenue has ceremonies.",
    tip: "Royal Palace area has free events. Wear yellow or white in respect. Very peaceful, family-oriented.",
    avoid: "Openly political commentary near events is not appropriate.",
  },
];

export function BangkokFestivalsCalendar() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🎉 Bangkok festivals — major events throughout the year
      </div>
      <div className="space-y-2">
        {FESTIVALS.map((f) => (
          <details key={f.name} className="border border-orange-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-orange-50 transition">
              <span className="text-2xl shrink-0">{f.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{f.name} <span className="text-[var(--muted)] font-normal text-[10px]">{f.thai}</span></div>
                <div className="text-[10px] text-[var(--muted)]">📅 {f.when}</div>
              </div>
            </summary>
            <div className="px-3 pb-3 border-t border-orange-100 pt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{f.what}</div>
              <div className="text-[10px] text-[var(--muted)] leading-snug">{f.why}</div>
              <div className="text-[10px] text-orange-600">💡 {f.tip}</div>
              <div className="text-[10px] text-red-600">⚠️ Avoid: {f.avoid}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
