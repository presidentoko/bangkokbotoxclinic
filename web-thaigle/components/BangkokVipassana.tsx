const TOPICS = [
  {
    title: "Vipassana Meditation in Thailand — Wat Mahadhatu & Suan Mokkh",
    emoji: "🧘",
    summary: "Thailand is one of the world's premier destinations for authentic Vipassana (insight meditation) practice — the Theravada Buddhist tradition here is living and integrated, not museum-piece spirituality. Bangkok itself has multiple Vipassana instruction options: Wat Mahadhatu (Ratchadamnoen area, offers English-language meditation instruction to foreigners through the Meditation Studies and Retreat Center), and Wat Chonprathan Rangsarit (Nonthaburi, suburban Bangkok) regularly hosts English-instruction courses for international practitioners. The most accessible entry point for Bangkok-based Vipassana practice: daily group sits at expat-connected meditation centers often run by English-speaking Thai teachers who have trained formally in the Mahasi Sayadaw or Pa Auk traditions. The further commitment: the Suan Mokkh retreat center in Surat Thani (southern Thailand) runs rigorous 10-day silent retreats (November 1–10, December 1–10, etc.) that have influenced thousands of international practitioners.",
    action: "Bangkok Vipassana starting points: (1) The World Fellowship of Buddhists (WFB) headquartered in Bangkok holds monthly meetings and can direct practitioners to English-instruction meditation opportunities; (2) Wat Mahadhatu's Section 5 (the meditation research section) has historically offered morning and evening instruction to visiting practitioners — contact in advance to confirm current program; (3) Online search for 'Vipassana Bangkok English' surfaces active communities and upcoming courses. For the Suan Mokkh retreat: apply 2–3 months ahead as courses fill early; no prior meditation experience required; schedule is fixed (wake 4am, lights out 9:30pm, daily work periods, no reading/writing/devices). Cost: Suan Mokkh retreats charge a donation-based or nominal fee — genuine dana (merit-making donation) model.",
  },
  {
    title: "Bangkok Dhamma Study & Buddhism for Beginners",
    emoji: "📿",
    summary: "Beyond formal meditation practice, Bangkok offers extensive Buddhist study opportunities for interested foreigners — English-language Dhamma talks, book study groups, and teaching programs at both mainstream tourist-facing centers and genuine academic Buddhist institutions. The difference matters: tourist-oriented Buddhist experiences (temple visits, monk chat programs) provide cultural exposure but limited depth; formal Dhamma study provides the philosophical and practice context that transforms meditation from technique to path. Key Bangkok Buddhist study resources: Wat Suan Dok in Chiang Mai (also runs Bangkok programs periodically) has a monk chat program with genuine philosophical dialogue; the International Buddhist Studies Center at Mahachulalongkornrajavidyalaya University (MCU) offers academic Buddhist study; and various Bangkok temples have English-speaking resident teachers.",
    action: "Beginning Buddhist study in Bangkok: (1) Monk chat programs — Wat Mahadhatu and some other Bangkok temples have formal monk chat programs where English-speaking monks hold question-and-answer sessions with visitors; (2) English Dhamma books — the Dhamma materials written by Phra Brahm (Ajahn Brahm) and Bhikkhu Bodhi are widely available at Bangkok's Buddhist bookstores and at temples; (3) The Buddhist Sunday School project has English materials for adult learners; (4) App-based practice: Insight Timer app has Bangkok-based teacher recordings and connects to local meditation groups. The Suan Mokkh International Dharma Hermitage also produces accessible English-language Dhamma books by Buddhadasa Bhikkhu — available at Bangkok's intellectual bookstores.",
  },
  {
    title: "Forest Monastery Retreats — Ajahn Chah Tradition",
    emoji: "🌲",
    summary: "The Thai Forest Tradition (associated with Ajahn Mun, Ajahn Chah, and their Western disciples including Ajahn Sumedho, Ajahn Brahm, and many others) has produced some of the most influential and internationally respected Buddhist teachers of the 20th–21st century. The forest monasteries (wat pa) associated with this tradition emphasize strict Vinaya (monastic code) observance, deep meditation practice, and austere forest living conditions. Several Thai Forest Tradition monasteries are accessible from Bangkok as day visits or short retreats for lay practitioners: Wat Pah Nanachat (the International Forest Monastery in Ubon Ratchathani province, 8 hours from Bangkok) specifically serves international practitioners and has English-speaking resident monks. Bangkok itself doesn't host a strict forest monastery, but the tradition's teachings are accessible through books, recordings, and the international network's Bangkok connections.",
    action: "Accessing the Thai Forest Tradition in Bangkok: the teachings of Ajahn Chah (many books freely downloadable at forestsangha.org) are the foundational literature. English-speaking practitioners in Bangkok who practice in this tradition gather through informal networks — searching 'Ajahn Chah Bangkok' or 'Thai Forest Tradition Bangkok' on Facebook surfaces active groups. For a Wat Pah Nanachat visit: contact the monastery in advance; the monastery has specific protocols for male and female lay visitors, including time commitment (minimum 3 days is generally expected for meaningful engagement) and simple accommodation. The monastery holds open days periodically and can be contacted through the Forest Sangha network website.",
  },
];

export function BangkokVipassana() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        🧘 Bangkok Vipassana & Buddhist practice — meditation retreats, Dhamma study & forest monasteries
      </div>
      <div className="space-y-2">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-amber-100 rounded-xl p-3 group">
            <summary className="flex items-center gap-2 cursor-pointer list-none">
              <span className="text-lg">{t.emoji}</span>
              <span className="font-bold text-xs flex-1">{t.title}</span>
              <span className="text-[10px] text-amber-400 group-open:hidden">▼ expand</span>
              <span className="text-[10px] text-amber-400 hidden group-open:inline">▲ collapse</span>
            </summary>
            <div className="mt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] font-medium leading-snug">{t.summary}</div>
              <div className="text-[10px] text-amber-700 leading-snug">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
