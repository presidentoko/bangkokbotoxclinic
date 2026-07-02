const STUDIOS = [
  {
    name: "Reformer Pilates Studios in Bangkok",
    emoji: "🧘",
    area: "Thonglor, Ekkamai, Sukhumvit, Ari (wellness neighborhood)",
    price: "Drop-in reformer class ฿800–1,800; Monthly membership ฿8,000–25,000",
    why: "Reformer pilates has exploded in Bangkok — driven by the Bangkok wellness consumer market (affluent Thai women, expat health communities, fitness-conscious residents) and the influence of international pilates chains. Bangkok's reformer pilates scene is notably sophisticated — studios with modern Balanced Body or Gratz apparatus, qualified instructors (STOTT, Basi, POLESTAR certifications), and small class sizes delivering genuine pilates instruction rather than group exercise approximations. The Thonglor wellness corridor has the highest density of premium reformer studios. Bangkok's climate (air-conditioned studios are climate refuges year-round) makes indoor reformer pilates consistently popular.",
    tip: "Finding the right Bangkok reformer studio: first class at multiple studios is typical — Bangkok studios universally offer intro packages (3 sessions ฿1,500–3,500) that allow comparison shopping. Instructor certification matters more than studio aesthetics — ask about your instructor's training background. Mat pilates vs. reformer: Bangkok studios offering both usually charge ฿400–800 for mat classes vs. ฿800–1,800 for reformer. Mat classes are legitimate pilates training, not a downgrade. For expats: some studios offer corporate rates when 3+ colleagues enroll together.",
  },
  {
    name: "Clinical Pilates & Rehabilitation Studios",
    emoji: "⚕️",
    area: "Medical district (Sukhumvit, near Bumrungrad Hospital area), Sathorn",
    price: "Private session ฿2,500–5,000; Clinical assessment ฿1,500–3,000",
    why: "Bangkok's clinical pilates offering fills the gap between physiotherapy and fitness — studios staffed by physiotherapists or certified clinical pilates instructors using the reformer and other apparatus for injury rehabilitation and movement correction. The concentration near Bangkok's international hospital district (Bumrungrad International Hospital, Samitivej, Bangkok Hospital) reflects the medical tourism ecosystem. Patients recovering from surgery, managing chronic pain, or doing post-physiotherapy exercise progressions use clinical pilates studios as a continuation of rehabilitation. Thai insurance covers some clinical pilates when physiotherapist-supervised.",
    tip: "Clinical pilates access in Bangkok: studios near Bumrungrad Hospital coordinate directly with hospital physiotherapy departments — ask your hospital physio for a referral to their associated pilates partners. Assessment sessions (typically 60–90 minutes including posture analysis and movement assessment) identify specific needs before class-based work begins. For international patients: some Bangkok clinical pilates studios have online consultation options to assess readiness and plan programs before Thailand arrival. Expat health insurance: check your policy for 'exercise rehabilitation' coverage — some plans cover clinical pilates when prescribed.",
  },
  {
    name: "Online Pilates Communities & Studio Comparison",
    emoji: "📲",
    area: "Bangkok-wide; scheduling via ClassPass or direct studio apps",
    price: "ClassPass Bangkok credits: 27 credits/class typical; Subscription varies",
    why: "Bangkok's pilates studios have largely adopted digital booking systems — ClassPass operates in Bangkok giving multi-studio access through a single subscription, with reformer pilates classes available across the network. Individual studio apps (Line Official Account booking, proprietary booking systems) also work. The Bangkok Pilates Facebook groups and community threads provide crowd-sourced studio reviews, instructor recommendations, and equipment comparisons that are more accurate than Google reviews for pilates-specific needs.",
    tip: "ClassPass in Bangkok: reformer pilates classes typically cost 25–35 ClassPass credits (the platform's unit of account). High-demand morning and evening slots fill quickly — book 2–3 days ahead for prime time. For pilates-focused Bangkok living: the combination of ClassPass (for variety and studio-hopping) with a single home studio membership (for routine and instructor relationship) balances flexibility with consistency. Bangkok pilates instructor quality varies significantly — a great instructor at a moderate studio beats a mediocre instructor at a premium one. Read instructor-specific reviews, not just studio reviews.",
  },
];

export function BangkokPilates() {
  return (
    <div className="rounded-2xl border border-violet-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-violet-700 mb-3">
        🧘 Pilates in Bangkok — reformer studios, clinical pilates & wellness communities
      </div>
      <div className="space-y-2">
        {STUDIOS.map((s) => (
          <div key={s.name} className="border border-violet-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-violet-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
