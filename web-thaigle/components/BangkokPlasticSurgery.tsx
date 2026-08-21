const TOPICS = [
  {
    title: "Cosmetic Surgery in Bangkok — Overview",
    emoji: "✂️",
    summary: "Bangkok is one of Asia's leading medical tourism destinations for cosmetic and plastic surgery — combining internationally trained surgeons, modern facilities, competitive pricing (30–60% below equivalent procedures in Australia, UK, or US), and Thailand's well-developed medical tourism infrastructure. The most common procedures sought by international patients: rhinoplasty (nose), double eyelid surgery (blepharoplasty, particularly popular among East Asian patients), breast augmentation/reduction, body contouring (liposuction, abdominoplasty), and facial rejuvenation procedures. Hospital-affiliated plastic surgery departments (Bumrungrad, Bangkok Hospital, Samitivej, Praram 9 Hospital) provide internationally accredited settings with board-certified plastic surgeons — the key distinction from unaccredited private clinics.",
    action: "Research framework: verify surgeon credentials through the Society of Plastic and Reconstructive Surgeons of Thailand (PSRST) membership. Major hospitals' international patient offices assist with surgical consultation scheduling in English. Budget adequate recovery time: most cosmetic procedures require 2–3 weeks minimum before flying (post-surgical swelling, risk of flight-induced complications). Medical tourist infrastructure: medical tourism facilitators can coordinate multiple procedures, accommodation near the hospital, and post-operative care — research reputable facilitators through patient community forums.",
  },
  {
    title: "Gender-Affirming Surgery in Bangkok",
    emoji: "🏳️‍⚧️",
    summary: "Bangkok is one of the world's leading destinations for gender-affirming surgical procedures — Thailand has developed specialist expertise in gender-affirming surgeries over several decades. Several Bangkok surgeons are internationally recognized for specific procedures: Dr. Suporn, Dr. Preecha, and others have extensive specialist portfolios. Procedures available include vaginoplasty (including cutting-edge surgical techniques developed specifically in Thailand), phalloplasty and metoidioplasty, facial feminization/masculinization surgery, voice surgery, and other gender-affirming procedures. Bangkok's gender-affirming surgery reputation was built on expertise accumulated over decades of cases, including Thai patients and international medical tourists. The Thai cultural attitude toward gender diversity (the kathoey/ladyboy tradition represents a third-gender cultural recognition predating Western trans frameworks) creates a generally accepting social context for patients.",
    action: "Research process: multiple international patient communities maintain forums and recommendation threads specifically for Bangkok gender-affirming surgery (TransPulse, r/asktransgender, specific procedure subreddits). Consultation: most Bangkok GAS surgeons offer remote video consultations for initial assessment before patients travel. Waiting lists: top Bangkok GAS surgeons often have waiting lists of 6–18 months — plan the timeline accordingly. Post-operative support: Bangkok has housing facilities specifically serving recovering surgical patients, operated by medical tourism-focused guesthouses near hospital districts.",
  },
  {
    title: "Recovery & Medical Tourism Logistics",
    emoji: "🏥",
    summary: "Successful medical tourism in Bangkok requires infrastructure planning beyond just the surgical consultation. Recovery accommodation: several Bangkok guesthouses and apartments near major hospital corridors (Sukhumvit near Bumrungrad, Silom near Bangkok Christian Hospital) specifically cater to medical tourists with nurse call services, dietary catering, and wheelchair accessibility. Post-operative care: Bangkok has nursing care agencies providing private nurses for home recovery visits — standard for complex procedures with drainage management or wound care. Transportation: Grab's accessibility options and medical transport services serve post-surgical patients who cannot use regular transport. Follow-up care: Bangkok surgeons understand the international patient timeline and adjust follow-up appointment scheduling accordingly — most provide clear instructions for what to monitor remotely and when to seek emergency care.",
    action: "Planning checklist: secure surgeon consultation with full procedure discussion 6+ months before travel; arrange insurance or self-pay financial planning (medical travel insurance that covers complications is essential, not optional); book recovery accommodation with confirmed post-operative support services; arrange a travel companion for the first post-operative week for complex procedures; confirm follow-up care in home country before traveling (some Thai procedures may require your home country's physicians to understand Thai surgical approaches for continuity of care).",
  },
];

export function BangkokPlasticSurgery() {
  return (
    <div className="rounded-2xl border border-rose-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-rose-700 mb-3">
        ✂️ Cosmetic & plastic surgery in Bangkok — medical tourism, gender-affirming surgery & recovery
      </h2>
      <div className="space-y-2">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-rose-100 rounded-xl p-3 group">
            <summary className="flex items-center gap-2 cursor-pointer list-none">
              <span className="text-xl shrink-0">{t.emoji}</span>
              <span className="font-bold text-xs flex-1">{t.title}</span>
              <span className="text-[10px] text-rose-400 group-open:hidden">▼ expand</span>
              <span className="text-[10px] text-rose-400 hidden group-open:inline">▲ collapse</span>
            </summary>
            <div className="mt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] font-medium leading-snug">{t.summary}</div>
              <div className="text-[10px] text-rose-700 leading-snug">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
