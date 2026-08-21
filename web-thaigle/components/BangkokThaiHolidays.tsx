const TOPICS = [
  {
    title: "Thai National & Royal Holidays",
    emoji: "👑",
    summary: "Thailand's calendar of national holidays reflects its royal and Buddhist identity — royal birthdays, constitution day, and Buddhist observance days define Thailand's public holiday structure.",
    action: "Thailand's key national holidays: (1) King's Birthday / National Day — December 5th (Birthday of King Rama IX, posthumously celebrated) and July 28th (Birthday of King Rama X, current king); these days see royal portraits illuminated on public buildings, yellow-waving public, and major road closures near royal palaces; (2) Constitution Day — December 10th, commemorating the 1932 constitution; (3) National Day — historically observed August 12th for Queen Mother's Birthday / Mother's Day and December 5th for Father's Day; (4) Chakri Day — April 6th, commemorating the founding of the Chakri dynasty; (5) Coronation Day — May 4th–6th, commemorating the coronation of King Rama X; (6) Chulalongkorn Day — October 23rd, death anniversary of King Rama V (Chulalongkorn), widely mourned and celebrated with flowers at the Royal Plaza equestrian statue — one of Bangkok's most moving public observances. These holidays affect bank hours, shopping mall hours, and alcohol sales laws — checking ahead prevents surprises.",
  },
  {
    title: "Buddhist Observance Days in Bangkok",
    emoji: "☸️",
    summary: "Buddhist holy days (wan phra — วันพระ, occurring on full moon, new moon, and quarter moon days) and major Buddhist holidays shape Bangkok's weekly rhythm and annual celebrations.",
    action: "Key Buddhist holidays in Bangkok: (1) Makha Bucha (February full moon) — commemorates the spontaneous assembly of 1,250 disciples before Buddha; candlelit temple circumambulation (wien tien) at thousands of wats; (2) Visakha Bucha (May full moon) — the holiest Buddhist day commemorating Buddha's birth, enlightenment, and death; all temple activities, national observance; alcohol sales banned; (3) Asanha Bucha / Khao Phansa (July full moon/day after) — Buddhist Lent begins; Khao Phansa is when monks retreat to temple for 3 months; ordination season begins; (4) Ok Phansa (October full moon) — end of Buddhist Lent; Thod Kathin season (royal kathin ceremonies, public merit-making); (5) Wan Phra (weekly merit days): occurring 4 times/month on lunar quarter days, these are not official holidays but increase temple activity and merit-making — markets near temples are busier, more worshippers present; (6) Alcohol sales restrictions: all major Buddhist holidays see legal prohibition of alcohol sales in Thailand — bars and restaurants that violate this face license revocation; visiting on these days means planning accordingly.",
  },
  {
    title: "Thai Chinese New Year in Bangkok",
    emoji: "🧧",
    summary: "Thai Chinese New Year (Tèt in Vietnamese, Chūnjié in Chinese) is one of Bangkok's most spectacular celebrations — Chinatown's Yaowarat transforms into a massive street festival for 15 days.",
    action: "Bangkok Chinese New Year experience: (1) Timing: follows lunar calendar, typically January–February; consult annual Thai calendar for exact dates; (2) Yaowarat transformation: Bangkok's Chinatown becomes car-free and festival-filled for Chinese New Year — lion and dragon dance performances, red lanterns, street food stalls, temple activities at all Chinatown temples (San Jao Poh Suea is particularly active); (3) Massive crowds: Chinese New Year evening celebrations in Yaowarat attract tens of thousands of people — arriving early and accepting the crowd as part of the celebration is necessary; (4) Chinese temple merit-making: Bangkok's Chinese community temples (Wat Mangkon Kamalawat, San Jao Poh Suea, and numerous smaller shrines) see enormous worshipper activity on the first days of the new year — particularly stunning during predawn hours; (5) Restaurant implications: many Chinatown restaurants close for the actual New Year day and sometimes multiple days around the holiday — planning food logistics accordingly; (6) The 15-day celebration extends to Yuan Xiao (Lantern Festival) at the end — smaller but still celebrated at Bangkok temples.",
  },
  {
    title: "Royal Ploughing Ceremony & Agricultural Traditions",
    emoji: "🌾",
    summary: "Thailand's annual Royal Ploughing Ceremony (Raek Na Khwan) at Sanam Luang marks the beginning of the rice-growing season — an ancient Brahmin-influenced ritual that Thai society takes seriously.",
    action: "Royal Ploughing Ceremony Bangkok experience: (1) Date: typically May (exact date determined by royal astrologers based on auspicious day calculation); (2) Location: Sanam Luang (the Grand Field in front of the Grand Palace) — the public ceremony area allows spectators; (3) The ritual: the Lord of the Festival (traditionally the Director-General of the Agriculture Department or a designated royal representative) ploughs a ceremonial furrow; sacred oxen eat from trays of rice, beans, corn, sesame, and water — the specific trays they choose predict the year's agricultural fortune; (4) Significance: Thai rice farmers and agricultural communities genuinely follow the ceremony's predictions for rain and harvest; agricultural policy announcements sometimes follow; (5) What visitors experience: elaborate traditional dress (Brahmin priests in white, traditional ceremony dress), ceremonial ploughing, and the unusual sight of Sanam Luang transformed for this ancient ritual in the middle of modern Bangkok; (6) Public attendance: the ceremony is a public event but the specific seating/standing areas for spectators vary — checking with TAT (Tourism Authority of Thailand) for current year details.",
  },
];

export function BangkokThaiHolidays() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        👑 Thai holidays & celebrations — royal holidays, Buddhist days & Chinese New Year
      </h2>
      <div className="space-y-1">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-red-100 rounded-xl">
            <summary className="cursor-pointer p-3 flex items-center gap-2">
              <span className="text-xl">{t.emoji}</span>
              <span className="font-bold text-xs flex-1">{t.title}</span>
              <span className="text-[10px] text-[var(--muted)] shrink-0">{t.summary.slice(0, 60)}…</span>
            </summary>
            <div className="px-3 pb-3 text-[10px] text-[var(--fg)] leading-snug border-t border-red-50 pt-2">
              {t.summary}
              <div className="mt-1 text-red-700">▶ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
