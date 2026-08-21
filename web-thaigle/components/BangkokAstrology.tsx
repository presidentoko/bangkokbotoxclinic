const OPTIONS = [
  {
    name: "Thai Astrology (Horasat Thai)",
    emoji: "⭐",
    area: "Temple fortune tellers (mor doo) — Wat Mangkon, Wat Phra Kaew area",
    price: "Temple consultation: free–฿200 donation; Professional: ฿500–2,000",
    why: "Thai astrology (horasat Thai) is a sophisticated system combining Hindu-influenced planetary calculation with Buddhist cosmology. Thai people consult astrologers for major life decisions: marriage timing, business launches, naming babies, buying property. Bangkok temples have resident astrologers who use birth date, time, and year calculation to determine auspicious dates and personal fortune.",
    tip: "Bring your exact birth time (not just date) for the most accurate Thai astrology reading — the hour of birth is critical for the planetary chart. Temple fortune tellers vary greatly in skill and method — the mor doo (fortune-teller) at major temples like Wat Mangkon in Chinatown has seen thousands of clients. Don't expect Western-style psychological insight — Thai readings are predictive and prescriptive.",
  },
  {
    name: "Chinese Astrology in Bangkok",
    emoji: "🐉",
    area: "Yaowarat Chinatown — fortune tellers near Wat Mangkon",
    price: "Reading ฿300–1,500",
    why: "Bangkok's Chinese community maintains strong Chinese astrology practice — Chinese New Year astrology predictions, BaZi (Four Pillars of Destiny), and Zi Wei Dou Shu (Purple Star Astrology) are all practiced by specialists in Yaowarat. Face reading (mien xiang) is a related art. Chinese zodiac animal year compatibility readings are popular for relationships.",
    tip: "Yaowarat during Chinese New Year (late Jan–mid Feb) has dozens of fortune tellers active on the street — timing a visit to this period gives access to more practitioners in one place. For serious Chinese astrology, look for practitioners who ask about exact birth time and year — the BaZi system requires this for a full reading.",
  },
  {
    name: "Tarot & Western Practices in Bangkok",
    emoji: "🔮",
    area: "Silom, Thonglor, and online Thai tarot community",
    price: "Tarot reading ฿500–1,500/hour",
    why: "Bangkok has an active tarot and Western astrology practice community — primarily serving younger Thais and expats. Many practitioners now operate via LINE and Instagram. Tarot cafés in the Thonglor and Silom areas occasionally host drop-in readings. The Thai new-age community blends tarot, crystal healing, and Western astrology with Buddhist practice.",
    tip: "Thai tarot readers have adapted the Western tarot tradition to Thai cultural context — readings often incorporate Buddhist karmic concepts alongside traditional tarot symbolism. Search Instagram for 'Bangkok tarot' — most serious practitioners post their availability and review through social media rather than physical locations.",
  },
];

export function BangkokAstrology() {
  return (
    <div className="rounded-2xl border border-violet-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-violet-700 mb-3">
        ⭐ Astrology & fortune telling in Bangkok — Thai, Chinese & tarot readings
      </h2>
      <div className="space-y-2">
        {OPTIONS.map((o) => (
          <div key={o.name} className="border border-violet-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{o.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{o.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{o.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{o.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{o.why}</div>
            <div className="text-[10px] text-violet-700">💡 {o.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
