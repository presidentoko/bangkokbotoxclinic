const TOPICS = [
  {
    title: "Thai Buddhism — Temples, Monks & Practice",
    emoji: "☸️",
    summary: "Theravada Buddhism is not merely cultural decoration in Bangkok — it shapes daily life in ways visible even to casual observers. The morning alms round (tak bat) sees monks in saffron robes receiving food offerings from laypeople at dawn — a 2,500-year-old practice still operating on Bangkok streets, most visibly near Wat Pho, Wat Arun, and residential neighborhoods away from tourist corridors. Temple space in Bangkok functions as community center, meditation hall, school, hospital (historically), and merit-making venue. The concept of merit (bun) — accumulated through generosity, moral conduct, and spiritual practice — motivates regular temple visits, Buddha image decoration, and spirit house maintenance. Meditation retreats at Bangkok's temples are available to sincere practitioners.",
    action: "Practice temple etiquette: dress modestly (shoulders and knees covered), remove shoes before entering temple buildings, avoid pointing feet toward Buddha images, speak quietly. For meditation: Wat Mahadhatu near Sanam Luang offers vipassana instruction to foreigners; Wat Suan Dok in Chiang Mai (day trip) is the most foreigner-accessible meditation program in northern style.",
  },
  {
    title: "Spirit Houses & Animist Practice",
    emoji: "🏚️",
    summary: "Bangkok's animist substrate — the spirit beliefs predating and coexisting with Buddhism — is visible at every hotel entrance, office building, and home. The San Phra Phum (spirit house, a miniature temple on a post) provides a home for the locality spirit (Phra Phum) displaced by construction. These are maintained daily with flower garlands, incense, water, food offerings, and small figurines representing the spirit's household. The Erawan Shrine at Ratchaprasong (Brahma deity shrine) attracts thousands of daily visitors making wishes and thanksgiving offerings — the traditional Brahma dance performances there are ritual, not performance. Bangkok's prominent shrines (Trimurti at Central World, Ganesha shrines, various royal spirits) each serve specific wish-fulfillment purposes according to Thai folk belief.",
    action: "Respectful spirit house observation: you may observe, photograph politely, and smell the incense — do not touch offerings or the spirit house itself. For the Erawan Shrine: small candles, incense, flower garlands, and hiring of the traditional dance troupe are the standard ways to make offerings. Finding: nearly every Bangkok hotel has a spirit house — asking hotel staff about its significance is welcomed and often produces fascinating explanations.",
  },
  {
    title: "Alternative Spirituality & New Age in Bangkok",
    emoji: "🔮",
    summary: "Bangkok hosts a significant alternative spirituality community — driven by the city's large international population and the Thai culture's natural openness to diverse spiritual practices. Crystal shops (particularly concentrated in Thonglor), tarot readers, numerologists (Thai numerology has specific cultural frameworks), aura photography studios, and healing modalities (reiki, sound healing with singing bowls, sacred geometry workshops) all have active Bangkok followings. The digital nomad and expat spiritual community has created a market for English-language spiritual events — yoga retreats, sound baths, shamanic ceremony practitioners, and plant medicine-adjacent (though illegal) practices all have Bangkok footprints. The intersection of Buddhism, Thai animism, and imported spiritual practices creates a distinctive Bangkok spiritual marketplace.",
    action: "Bangkok crystal shops: the Thonglor area (Soi 38 vicinity) has the highest concentration of crystal and healing arts shops — mostly serving the affluent Thai and expat wellness community. Sound healing: Bangkok has multiple practitioners offering private sessions and group sound baths using Tibetan singing bowls and crystal bowls — session quality varies widely; check practitioner credentials and reviews. For structured spiritual exploration: the Association for Bahá'í Studies Bangkok, Brahma Kumaris centers, and various Buddhist meditation centers all welcome sincere spiritual seekers.",
  },
];

export function BangkokSpirituality() {
  return (
    <div className="rounded-2xl border border-violet-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-violet-700 mb-3">
        ☸️ Spirituality in Bangkok — Thai Buddhism, spirit houses & alternative practices
      </h2>
      <div className="space-y-2">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-violet-100 rounded-xl p-3 group">
            <summary className="flex items-center gap-2 cursor-pointer list-none">
              <span className="text-xl shrink-0">{t.emoji}</span>
              <span className="font-bold text-xs flex-1">{t.title}</span>
              <span className="text-[10px] text-violet-400 group-open:hidden">▼ expand</span>
              <span className="text-[10px] text-violet-400 hidden group-open:inline">▲ collapse</span>
            </summary>
            <div className="mt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] font-medium leading-snug">{t.summary}</div>
              <div className="text-[10px] text-violet-700 leading-snug">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
