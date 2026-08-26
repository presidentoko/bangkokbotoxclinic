const TOPICS = [
  {
    title: "Mental Health Resources for Expats in Bangkok",
    emoji: "🧠",
    summary: "Bangkok has English-language mental health services accessible to expats and visitors — the concentration of international population has created demand for culturally competent, English-medium therapy services. Individual psychotherapy: several Bangkok-based clinical psychologists and licensed counselors offer English-language sessions, either in-person or via telehealth. Rates range from ฿2,500–6,000 per 50-minute session. International hospitals (Bumrungrad, Bangkok Hospital, Samitivej) have psychiatry and psychology departments with English-speaking practitioners. Online therapy platforms (BetterHelp, Talkspace) work from Thailand and may provide access to home-country licensed therapists for those who prefer familiarity. Expat-specific adjustment challenges (cultural disorientation, relationship changes due to relocation, expatriate identity stress) are something Bangkok's English-language therapists have extensive experience with.",
    action: "Starting points: Counselling Bangkok, Sukhumvit Psychiatry Center, and the expat-oriented therapist directories maintained by expat community websites. For crisis situations: Samaritans of Thailand (02-713-6793) operates a 24/7 English-language helpline. International hospitals' psychiatric emergency departments serve crisis situations at any hour.",
  },
  {
    title: "Mental Health & Thai Culture",
    emoji: "🙏",
    summary: "Understanding mental health through a Thai cultural lens helps both Thai and expat residents navigate the healthcare system effectively. Thai culture's emphasis on kreng jai (consideration for others' feelings) can create barriers to help-seeking — expressing emotional distress openly risks creating discomfort for others, so mental health concerns are often underreported or expressed through physical complaints. Thai Buddhist concepts of equanimity and non-attachment provide frameworks that Thai individuals may draw on alongside medical treatment. The stigma around mental health conditions varies significantly: mood disorders have gained some public discussion (Thailand's mental health awareness campaigns have improved), while personality disorders and psychotic conditions remain more stigmatized. Thai private hospitals have psychiatry services; public hospitals' mental health departments serve the wider population at low cost.",
    action: "For Thai speakers: the Department of Mental Health (กรมสุขภาพจิต) maintains a helpline (1323) and a network of public mental health services. Private Thai-language therapy: many Thai therapists are trained in Western psychotherapy traditions (CBT, DBT, psychodynamic) while integrating Thai cultural understanding — these practitioners bridge the gap most effectively for Thai clients. For workplace mental health: Thai workplaces increasingly include EAP (Employee Assistance Program) services, particularly at large Thai corporations and multinationals with Thai operations.",
  },
  {
    title: "Wellness & Preventive Mental Health in Bangkok",
    emoji: "✨",
    summary: "Bangkok's wellness ecosystem provides preventive mental health support through structured activities and community. Meditation: Bangkok's Buddhist temples (particularly Wat Mahadhatu, Wat Suan Dok for those willing to travel) offer authentic vipassana instruction. Commercial meditation centers (Dipabhavan, Nalanda, various secular mindfulness programs) provide structured practice in accessible formats. Yoga and movement: Bangkok's yoga studios offer yoga nidra, restorative yoga, and mindfulness-integrated movement classes specifically designed for stress reduction. Online wellness: Bangkok's digital nomad community has developed strong online mental wellness resources — apps like Insight Timer used in Bangkok's coworking community, group meditation sessions via Zoom connecting Bangkok residents with global teachers. Social support: Bangkok's expat community organizations (Internations, sport clubs, volunteer organizations) provide the social connection infrastructure that protects against isolation, which is a common mental health risk for newly relocated individuals.",
    action: "Building mental wellness structure in Bangkok: identify a regular physical movement practice within the first 2 weeks of arrival (yoga studio, gym, running group) — social exercise addresses both physical and mental health simultaneously. Bangkok meditation resource starting point: Dharma in Bangkok Facebook group and Buddha Dharma Education Association maintain current schedules for English-language meditation events. The transition challenge: the first 3 months of Bangkok relocation are typically the most mentally challenging — building community connection is the single most effective buffer against adjustment-related distress.",
  },
];

export function BangkokMentalHealth() {
  return (
    <div className="rounded-2xl border border-sky-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-sky-700 mb-3">
        🧠 Mental health in Bangkok — English therapy, Thai culture & wellness resources
      </h2>
      <div className="space-y-2">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-sky-100 rounded-xl p-3 group">
            <summary className="flex items-center gap-2 cursor-pointer list-none">
              <span className="text-xl shrink-0">{t.emoji}</span>
              <span className="font-bold text-xs flex-1">{t.title}</span>
              <span className="text-[10px] text-sky-400 group-open:hidden">▼ expand</span>
              <span className="text-[10px] text-sky-400 hidden group-open:inline">▲ collapse</span>
            </summary>
            <div className="mt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] font-medium leading-snug">{t.summary}</div>
              <div className="text-[10px] text-sky-700 leading-snug">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
