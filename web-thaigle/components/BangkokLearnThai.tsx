const TOPICS = [
  {
    title: "Learning Thai Language in Bangkok",
    emoji: "🇹🇭",
    summary: "Bangkok offers exceptional Thai language learning resources — formal schools, apps, tutors, and immersion learning available at all levels from zero to advanced.",
    action: "The most direct path: Union Language School (near BTS Sala Daeng) and AUA Language Center (near BTS Ratchadamri) are Bangkok's most established Thai language schools with decades of history and proven methodology. For conversational Thai prioritized over reading/writing: private tutors (available through iTalki or local expat community connections) at ฿300–600/hour provide highly personalized progress. App learning: Ling App (Thai company, excellent for Thai), Pimsleur Thai (audio-first, good for pronunciation), and Glossika Thai (sentence repetition for fluency) are the most recommended supplementary tools. The single most impactful thing for Bangkok Thai learners: tones. Thai has 5 tones (mid, low, falling, high, rising) that completely change word meaning — getting tonal accuracy from the beginning is critical; a week of deliberate tonal practice saves months of comprehension problems later.",
  },
  {
    title: "Thai Script & Reading",
    emoji: "📝",
    summary: "The Thai script is phonetic and learnable in 2–4 weeks of dedicated study — reading Bangkok's street signs, menus, and transport signs unlocks huge practical value.",
    action: "Thai script learning resources: the Learn Thai Podcast (YouTube) has excellent free video courses on script and pronunciation; Manee books (the historic Thai literacy textbooks, still used in Thai schools) provide authentic script practice. The Thai alphabet has 44 consonants, 15 vowel symbols (that combine into 28 forms), and 4 tone marks — the learning order matters: consonant classes (high, mid, low) determine tone rules and should be learned early. Practical Bangkok script use: once you can read basic Thai, street food menus become partially legible, shop names become distinguishable, and navigation apps in Thai become partially usable. Taxi meter amounts in Thai numerals (a separate number system from Arabic numerals) are worth learning specifically — recognizing เม and บาท makes metered taxi disputes significantly easier.",
  },
  {
    title: "Conversational Thai Fast Track",
    emoji: "🗣️",
    summary: "Essential Thai phrases that meaningfully improve daily Bangkok life — particularly for interacting with markets, tuk-tuks, street food, taxis, and Thai people.",
    action: "Highest-impact Bangkok Thai phrases: (1) 'Thao rai kha/khrap?' (เท่าไหร่ครับ/ค่ะ) — 'How much?' — the single most useful shopping/transport phrase; (2) 'Aroy mak' (อร่อยมาก) — 'Very delicious' — guaranteed smile from any food vendor; (3) 'Pet nit noi' (เผ็ดนิดหน่อย) — 'A little spicy' / 'Mai pet' (ไม่เผ็ด) — 'Not spicy' — critical food ordering words; (4) 'Pai' + destination (ไป) — 'Go to' + place name — for taxis and tuk-tuks; (5) Politeness particles: 'kha' (ค่ะ, female speaker) and 'khrap' (ครับ, male speaker) added to sentence endings immediately signals politeness and respect — Thai people respond warmly to foreigners who use these; (6) Numbers 1–10 and ordinal sense for prices, floors, quantities.",
  },
  {
    title: "Language Exchange in Bangkok",
    emoji: "🤝",
    summary: "Bangkok's large population of Thai people learning English creates abundant language exchange opportunities — Thai-English language exchange partners provide free conversational Thai practice.",
    action: "Language exchange Bangkok access: (1) HelloTalk, Tandem, and Speaky apps connect with Thai-speaking partners; search by Bangkok location for in-person exchange partners; (2) Conversation Exchange Bangkok Facebook group coordinates in-person meetups; (3) Specific venue: some Bangkok language schools host weekly conversation exchange events — check AUA Language Center and language school Facebook pages for event schedules; (4) The organic language exchange: sitting in a Bangkok coffee shop with a Thai language textbook visible often attracts curious Thai people studying English — genuine organic exchanges happen frequently when you show you're actively learning Thai. Language exchange reciprocity: a structured format (30 minutes Thai conversation, 30 minutes English conversation) works best — both people benefit equally and sessions have natural direction.",
  },
];

export function BangkokLearnThai() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        🇹🇭 Learning Thai in Bangkok — language schools, Thai script & conversation fast track
      </h2>
      <div className="space-y-1">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-blue-100 rounded-xl">
            <summary className="cursor-pointer p-3 flex items-center gap-2">
              <span className="text-xl">{t.emoji}</span>
              <span className="font-bold text-xs flex-1">{t.title}</span>
              <span className="text-[10px] text-[var(--muted)] shrink-0">{t.summary.slice(0, 60)}…</span>
            </summary>
            <div className="px-3 pb-3 text-[10px] text-[var(--fg)] leading-snug border-t border-blue-50 pt-2">
              {t.summary}
              <div className="mt-1 text-blue-700">▶ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
