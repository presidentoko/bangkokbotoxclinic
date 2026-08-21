const SPOTS = [
  {
    name: "Kendo — Thai Kendo Association Clubs",
    emoji: "⚔️",
    area: "Multiple dojos; Thammasat, Chulalongkorn University, Huamark complex",
    price: "Monthly ฿500–1,500; Equipment rental varies",
    why: "Thailand's Kendo Association maintains multiple registered clubs in Bangkok with trained instructors holding international dan grades from the All Japan Kendo Federation (AJKF). The Thai kendo community is active — competing in Asian Kendo Championships and maintaining traditional Japanese etiquette protocols. Bangkok's Japanese expat community has significantly contributed to local kendo development. Thai practitioners who began as students often reach 3rd–4th dan grade, creating a capable local teaching base.",
    tip: "Starting kendo in Bangkok: most dojos welcome beginners but expect commitment — kendo practice typically runs 2–3 times per week in 90-minute sessions. Equipment (men/kote/do/tare — the four armors plus shinai bamboo sword and bokken wooden sword) represents a significant upfront investment (฿8,000–25,000 for a full set). Most Bangkok kendo clubs will loan beginners equipment for initial trial sessions. Practice in Thai heat requires hydration planning — the heavy padded armor is extremely warm.",
  },
  {
    name: "Iaido & Iaijutsu — Japanese Sword Drawing Art",
    emoji: "🗡️",
    area: "Japanese cultural community, Silom Japanese associations",
    price: "Class ฿500–1,200/session; Private ฿1,500–3,000",
    why: "Iaido (modern sword-drawing meditation art) and iaijutsu (classical sword-drawing combat art) have small but dedicated Bangkok communities primarily centered around the Japanese business expat community. Unlike kendo's contact sparring, iaido is solo kata practice — drawing, cutting, flicking blood, and resheathing the sword in precise sequences. This meditative aspect appeals to practitioners seeking a moving-meditation practice with historical Japanese martial culture. Some Bangkok instructors have authorization from established Japanese ryu (schools).",
    tip: "Iaido accessibility for foreigners in Bangkok: the Japanese cultural associations (JCC Thailand) are the best connection points. A Japanese-speaking intermediary is helpful for initial contact with traditional iaido sensei. Iaido practice requires a sword (beginners use aluminum iaito — unsharpened practice sword — about ฿5,000–15,000). The philosophy-heavy nature of iaido makes it appealing for practitioners interested in Japanese culture beyond just the physical technique.",
  },
  {
    name: "Naginata & Other Japanese Arts",
    emoji: "🏮",
    area: "Japanese school gymnasium, Japanese community associations",
    price: "Monthly ฿800–2,000 (community programs)",
    why: "Bangkok's Japanese community supports several traditional arts beyond kendo — naginata (halberd technique, predominantly practiced by women in Japan), kyudo (archery), and jodo (short staff). These arts are less accessible to non-Japanese speakers but exist within the Japanese school and business community infrastructure. The Japan Foundation Bangkok and Japanese Chamber of Commerce occasionally feature these arts in cultural events open to the public.",
    tip: "Accessing traditional Japanese budo in Bangkok: attend Japan Foundation Bangkok cultural events (annual Japan Matsuri festival, Japanese culture presentations) where these arts are demonstrated. The naginata and kyudo communities are typically organized around the Japanese school (JSAT — Japanese School of Bangkok) or the Japanese Chamber of Commerce. Expressing genuine interest in the cultural tradition (not just the physical technique) opens doors with traditional sensei who are selective about accepting non-Japanese students.",
  },
];

export function BangkokKendo() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-red-800 mb-3">
        ⚔️ Japanese martial arts in Bangkok — kendo clubs, iaido & traditional budo
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-red-800">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
