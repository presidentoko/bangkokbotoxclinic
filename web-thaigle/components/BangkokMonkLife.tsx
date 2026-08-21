const TOPICS = [
  {
    title: "Thai Buddhist Ordination — Becoming a Monk",
    emoji: "🙏",
    summary: "Temporary ordination as a Buddhist monk is a traditional rite of passage for Thai men — most Thai males ordain at least once in their lifetime, typically before marriage. Foreigners can also ordain at qualified monasteries with proper preparation.",
    action: "Thai ordination culture for visitors and expats: (1) Cultural significance: temporary ordination (thuat — a monk period of typically 1 week to 3 months, though any duration is meritorious) is how Thai men 'make merit' for their parents, particularly for their mothers — 'repaying mother's milk.' The entire family participates in the ordination ceremony; (2) Process for foreign men: foreigners wishing to ordain temporarily must: find a Bangkok temple with an abbot willing to ordain foreigners, have some Thai language capability or interpreter, obtain the specific white robes (pre-ordination novice period), and commit to the vows and schedule; (3) Wai Kru Temple (Wat Mahadhatu): regularly hosts foreigners interested in ordination and meditation-focused short ordinations; (4) Ordination ceremony: spectacular ritual involving shaved head, white robes becoming saffron, chanting, and the formal ceremony within the bot (ordination hall) that is one of Thai Buddhism's most beautiful ceremonial moments; (5) Watching Thai ordinations: these are community events — asking respectfully to observe a temple-community ordination provides access to an authentic Thai Buddhist ceremony; (6) Nuns (mae chi): Thai Buddhist nuns are white-robed, not saffron — women can also ordain as mae chi at appropriate monasteries, though the female monastic path has different cultural standing than male ordination.",
  },
  {
    title: "Almsgiving — Tak Bat Dawn Ritual",
    emoji: "🌅",
    summary: "Tak bat (ตักบาตร) — the pre-dawn ritual of laypeople giving food to monks as they walk through neighborhoods — is one of Thailand's most beautiful daily living religious traditions, conducted across Bangkok every morning.",
    action: "Bangkok almsgiving experience: (1) Timing: monks walk to collect alms (bintabaht) between approximately 6–8am; arriving near temple neighborhoods by 5:45am allows witnessing preparation as well as the procession itself; (2) Location: any neighborhood with a wat has morning almsgiving; the most photogenic Bangkok locations include Samut Prakan's Wat Asokaram near the river and local neighborhood temples throughout Bangkok; for tourists, the area near Wat Pho and Wat Mahadhatu in the historic district has almsgiving but also more crowd; (3) Participation etiquette: visitors who wish to participate should purchase appropriate food from the women who set up near temples before dawn (sticky rice in banana leaf, rice, sweets); dress modestly (covered shoulders and knees); remove shoes if on temple grounds; kneel or bow when giving; maintain silence during the monk procession; (4) Tourist almsgiving vs authentic: organized 'tourist almsgiving' (at hotels, tourist sites) is a commercialized version; genuine neighborhood almsgiving near residential temples is more meaningful; (5) Photography: the pre-dawn orange robes in the pale light are extraordinary photographic subjects — but photography should be unobtrusive and secondary to respectful participation; (6) The monks don't say thank you: the merit-making flow goes from laypeople (who make merit by giving) to monks (who provide the opportunity for merit-making); this reverses the usual giver-receiver dynamic.",
  },
  {
    title: "Temple Etiquette & Wat Culture",
    emoji: "⛩️",
    summary: "Bangkok's 400+ temples (wats) are simultaneously active religious sites, community centers, and cultural heritage sites — understanding the etiquette and culture transforms temple visits from tourist tick-box experiences into genuine cultural immersion.",
    action: "Bangkok temple practical etiquette: (1) Dress requirements: shoulders and knees covered at all temples; sarongs available to borrow at major tourist temples (฿50–100 deposit typically required); the sarong-wearing photo requirement at Wat Pho and Wat Arun is genuine religious expectation, not arbitrary tourist management; (2) Shoe removal: remove shoes before entering the bot (ordination hall), any elevated platform with Buddha images, and any space where monks sit; (3) Sitting near Buddha: never sit with feet pointed toward a Buddha image or a monk — feet pointing toward sacred objects or people is deeply disrespectful in Thai culture; (4) Monk interaction: monks (particularly those in monk hood) are traditionally not supposed to touch or be touched by women — women approaching monks should maintain respectful distance; if a monk speaks to you, engage politely but let him end the conversation; (5) Photography: most temple areas allow photography of architecture and grounds; photographing within the bot during active worship is less acceptable; never photograph people during private devotional moments; (6) Candles and incense: buying a set (typically ฿20–30) from the temple shop and lighting incense, placing lotus flowers, or lighting candles at designated points is a respectful participation rather than a tourist performance — the activity mirrors what Thai devotees do.",
  },
  {
    title: "Offering Merit & Buddhist Gift Culture",
    emoji: "🕯️",
    summary: "Tham boon (ทำบุญ) — making merit — is a daily practice for many Thai Buddhists, accomplished through temple donations, feeding monks, releasing captive animals, and charitable giving. Understanding this system illuminates much of Bangkok's religious street culture.",
    action: "Bangkok merit-making culture explained: (1) The merit system: Buddhist cosmology holds that meritorious actions generate positive karma that improves circumstances in this life and future lives — giving, avoiding harm, and wisdom cultivation are the three primary merit-making activities; (2) Temple donations: donation boxes at Bangkok temples receive offerings from devotees throughout the day; larger temples receive substantial donations for construction, maintenance, and community welfare programs; (3) Animal release: the practice of buying captive birds, fish, or turtles and releasing them as a merit-making act has been criticized for creating demand for animal capture — well-informed Thais are increasingly aware of this ethical tension; (4) Merit at milestone events: Thais make merit at significant life events (birthdays, anniversaries, before important decisions, after near-miss accidents) by donating food to temples, sponsoring monks' food for a day, or making other temple contributions; (5) Making merit with monks: giving food during almsgiving, donating temple supplies (robes, food, candles, cleaning supplies) and presenting these directly to monks is considered particularly meritorious; (6) Kathin ceremony: the annual royal kathin ceremony (October–November, after Buddhist Lent) when robes and supplies are presented to temples is one of Thailand's major merit-making occasions — spectacular royal ceremony at designated royal temples.",
  },
];

export function BangkokMonkLife() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🙏 Bangkok Buddhist life — ordination, almsgiving, temple culture & merit-making
      </h2>
      <div className="space-y-1">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-orange-100 rounded-xl">
            <summary className="cursor-pointer p-3 flex items-center gap-2">
              <span className="text-xl">{t.emoji}</span>
              <span className="font-bold text-xs flex-1">{t.title}</span>
              <span className="text-[10px] text-[var(--muted)] shrink-0">{t.summary.slice(0, 60)}…</span>
            </summary>
            <div className="px-3 pb-3 text-[10px] text-[var(--fg)] leading-snug border-t border-orange-50 pt-2">
              {t.summary}
              <div className="mt-1 text-orange-700">▶ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
