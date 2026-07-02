const EVENTS = [
  {
    name: "Language Exchange Bangkok — Regular Meetups",
    emoji: "🗣️",
    area: "Rotating cafés, primarily Sukhumvit, Silom, Ari areas",
    price: "Usually free or drink minimum ฿80–150",
    why: "Bangkok's language exchange scene is active and genuinely useful — English-Thai pairings are the most common, but Japanese-Thai, Korean-Thai, Chinese-Thai, and multilingual tables also exist. The format: 30 minutes conversation in Language A, 30 minutes in Language B, switch partner. The Thai participants genuinely want English practice for professional advancement; foreign participants get Thai pronunciation correction and cultural insight available nowhere else. Regular meetups happen weekly at cafés in expat-friendly neighborhoods.",
    tip: "Finding Bangkok language exchanges: search 'language exchange Bangkok' on Meetup.com and Facebook Events — events are frequent but change venue regularly. The 'English Thai Language Exchange Bangkok' Facebook group has thousands of members and regular event announcements. Arrive with realistic expectations: partners will vary widely in level. Bringing a small vocabulary list or topic card helps structure the exchange. Thai partners appreciate when foreigners show interest in Thai culture beyond just language — asking about food, festivals, or local customs creates better conversations than pure grammar drills.",
  },
  {
    name: "Conversational Thai Practice — Cafés & Co-Learning",
    emoji: "☕",
    area: "Local cafés near universities — Chula area, Kasetsart, Thammasat (Tha Phrachan)",
    price: "Café purchase ฿60–150",
    why: "University-adjacent neighborhoods in Bangkok are fertile grounds for conversational Thai practice outside formal classes. Thai university students studying English are often willing to chat in mixed Thai-English. The café culture near Chulalongkorn University (Siam Square side) and Thammasat University (Tha Phrachan, riverside) creates natural environments where language practice happens organically. Apps like HelloTalk and Tandem connect Bangkok learners virtually, then meetups happen in person at these cafés.",
    tip: "Informal Thai practice strategy: the Jae Oh café area near Chula and the riverside cafés near Thammasat (Tha Phrachan campus) have students who often welcome conversation. A phrase card with Thai script of key questions ('Can we practice Thai/English together?' — 'เราฝึกภาษาไทย/อังกฤษด้วยกันได้ไหม') breaks the ice better than English alone. University library areas (especially during exam period) are quieter — timing matters.",
  },
  {
    name: "Expat Thai Learning Community",
    emoji: "📚",
    area: "Multiple Thai language schools, online communities",
    price: "Group Thai class ฿300–600/hour; Self-study app ฿0–600/month",
    why: "Bangkok's expat Thai-learning community has its own identity beyond formal language schools. Facebook groups ('Learning Thai Language', 'Thai Language Learners Bangkok') have thousands of members sharing resources, tutor recommendations, and study techniques. The 'Learn Thai from a White Guy' methodology and Kruu Mod (teacher Mod)'s YouTube channel have established loyal followings. Anki decks for Thai script and vocabulary are shared freely within the community. The informal networks often provide better feedback on practical street Thai than formal classroom environments.",
    tip: "Best Thai learning resources recommended by the Bangkok expat community: Pimsleur Thai for pronunciation foundation (audio-based, excellent for tones); Learn Thai from a White Guy for script and reading; Kruu Mod for conversational Thai video lessons. Physical Bangkok schools with strong community feedback: AUA Language Center (oldest, largest, natural approach method), Walen Thai School, and MindHub for private tutoring. Budgeting advice: 6 months at 1 hour/day of dedicated study produces functional tourist-level Thai; 2 years produces basic functional proficiency.",
  },
];

export function BangkokLanguageExchange() {
  return (
    <div className="rounded-2xl border border-teal-300 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-teal-800 mb-3">
        🗣️ Language exchange in Bangkok — Thai-English meetups, conversational practice & learning community
      </div>
      <div className="space-y-2">
        {EVENTS.map((e) => (
          <div key={e.name} className="border border-teal-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{e.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{e.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{e.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{e.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{e.why}</div>
            <div className="text-[10px] text-teal-800">💡 {e.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
