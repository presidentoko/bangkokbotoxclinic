const CLASSES = [
  {
    language: "Thai Language",
    emoji: "🇹🇭",
    schools: "AUA Language Center, Kru Moaw, NECTEC/Chula Courses",
    price: "฿3,000–8,000/month (group), ฿800–2,000/hr (private)",
    time: "Group: Mon/Wed/Fri 2hr sessions. Private: flexible. Online also available.",
    why: "Learning even basic Thai (hello=สวัสดี, thank you=ขอบคุณ, delicious=อร่อย) dramatically improves your Bangkok experience. Locals light up when visitors try.",
    tip: "AUA Language Center (Chulalongkorn University area) is Bangkok's most established Thai school for foreigners. Immersion method. Monthly enrollment.",
    level: "Beginner friendly. Tones are the hardest part (5 tones in Thai).",
  },
  {
    language: "Muay Thai + Thai (combo)",
    emoji: "🥊",
    schools: "Evolve MMA, Fairtex Gym — both offer Thai language alongside training",
    price: "฿1,500–2,500/week (training + dorm)",
    time: "Morning session 6am–8am + language hour 9am–10am",
    why: "Popular for longer-stay visitors. Learn the sport and the language simultaneously at Bangkok's famous Muay Thai gyms.",
    tip: "Evolve MMA Thong Lo offers Thai language classes bundled with martial arts training packages.",
    level: "All fitness levels, no prior Muay Thai or Thai required.",
  },
  {
    language: "Japanese (for Bangkok residents)",
    emoji: "🇯🇵",
    schools: "The Japanese Foundation Bangkok, Japan Cultural Centre",
    price: "฿8,000–15,000/semester",
    time: "Evenings and weekends. 3-month courses.",
    why: "Bangkok has excellent Japanese language learning infrastructure due to the large Japanese expat community. Good value vs. home countries.",
    tip: "JLPT preparation classes available. Large Bangkok Japanese community means plenty of language exchange partners via Meetup.com.",
    level: "Beginner to JLPT N1. All levels available.",
  },
  {
    language: "Mandarin Chinese",
    emoji: "🇨🇳",
    schools: "Confucius Institute at Chulalongkorn, Taiwan Education Center",
    price: "฿4,000–10,000/semester",
    time: "University schedule. Evening programs available.",
    why: "Thailand's large Chinese heritage population means authentic Mandarin learning environment. Plus HSK preparation available.",
    tip: "Yaowarat (Chinatown) area has many informal community Mandarin conversation groups.",
    level: "Beginner to HSK 6. All levels.",
  },
];

export function BangkokLanguageClasses() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        📚 Language classes in Bangkok — learn Thai and more
      </div>
      <div className="space-y-2">
        {CLASSES.map((c) => (
          <details key={c.language} className="border border-blue-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-blue-50 transition">
              <span className="text-2xl shrink-0">{c.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{c.language}</div>
                <div className="text-[10px] text-[var(--muted)]">{c.level}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{c.price}</span>
            </summary>
            <div className="px-3 pb-3 border-t border-blue-100 pt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{c.why}</div>
              <div className="text-[10px] text-blue-700">🏫 Schools: {c.schools}</div>
              <div className="text-[10px] text-blue-600">⏰ Schedule: {c.time}</div>
              <div className="text-[10px] text-orange-600">💡 {c.tip}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
