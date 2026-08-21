const TOPICS = [
  {
    title: "Fertility Treatments in Bangkok — IVF & ART",
    emoji: "🤱",
    summary: "Bangkok is one of Asia's leading medical tourism destinations for fertility treatment — IVF costs in Bangkok are 40–60% lower than comparable quality treatment in Western countries while using the same equipment, protocols, and internationally trained embryologists. Bangkok's internationally accredited fertility clinics — Bumrungrad International's IVF Center, Vejthani Hospital's Fertility Institute, Samitivej Sukhumvit's Reproductive Medicine Center — operate to ESHRE (European Society of Human Reproduction and Embryology) quality standards. IVF cycle cost in Bangkok: ฿150,000–280,000 (USD 4,200–8,000) per cycle versus USD 15,000–25,000 in the US or £5,000–8,000 in the UK for comparable procedures. This includes fresh embryo transfer; frozen transfer is additional at lower cost.",
    action: "Bangkok fertility practical guidance: the standard IVF process requires 3–5 weeks in Bangkok for a fresh cycle (stimulation, egg retrieval, fertilization, transfer). Many international patients do pre-cycle consultations remotely with clinic staff, then travel for the actual treatment. Frozen embryo transfer cycles can be done in a shorter visit (1 week). Medical records translation: clinics are accustomed to international patients — English-language communication with medical teams is consistent at JCI-accredited hospitals. Success rates: request clinic-specific success rates by age group — Thai fertility clinics publish data on their websites; compare against SART (US) or HFEA (UK) databases for context.",
  },
  {
    title: "Egg Freezing & Fertility Preservation",
    emoji: "❄️",
    summary: "Bangkok's fertility clinics offer egg freezing (oocyte cryopreservation) for fertility preservation — a growing category as younger women choose to delay family formation. Bangkok egg freezing cost: ฿120,000–200,000 for the stimulation cycle and retrieval; annual storage approximately ฿10,000–20,000/year. This compares to USD 10,000–15,000 plus storage in the United States. The vitrification (flash-freezing) technology used is identical globally — frozen egg survival rates and post-thaw outcomes depend on clinic technique and patient age at freezing. Bangkok fertility clinics are accustomed to international egg freezing patients who freeze in Bangkok and return to their home country for later use — the legal and medical logistics of international embryo/egg transport are well-understood by the clinic coordination teams.",
    action: "Egg freezing in Bangkok logistics: plan for 2–3 weeks in Bangkok for a complete stimulation and retrieval cycle. Age timing: egg freezing outcomes are significantly better under age 35 — the decision timeline matters medically. Consultation first: most major Bangkok fertility clinics offer initial consultation (remote video or in-person) before committing to a cycle — use this to evaluate the clinic's communication style, laboratory quality (ask about vitrification survival rates), and pricing transparency. International transport: if you plan to transport frozen eggs to another country, research that country's import regulations before beginning — some countries have restrictions on importing genetic material.",
  },
  {
    title: "Surrogacy Alternatives — Adoption & IVF",
    emoji: "🏥",
    summary: "Thailand banned commercial surrogacy in 2015 following high-profile cases that created regulatory and ethical concerns — commercial gestational surrogacy is no longer available in Thailand for international clients. This is important context for international patients seeking surrogacy arrangements who may have heard about Bangkok's past as a surrogacy destination. Current alternatives available in Bangkok: IVF with donor eggs (anonymous donation is legal and available at Bangkok fertility clinics, with lower costs than Western counterparts), IVF with partner or self-managed cycles, and comprehensive fertility workup to maximize natural conception outcomes. Thailand adoption is available through official channels (complex process, typically for Thai residents) but is not a realistic option for most international medical tourists.",
    action: "For international patients seeking egg donation: Bangkok's fertility clinics maintain anonymous egg donor databases with diverse genetic backgrounds. The egg donation IVF process uses the donor's eggs and the recipient's partner's sperm (or donor sperm), transferred to the recipient's uterus. Costs for egg donation IVF in Bangkok: ฿200,000–350,000 for a fresh donor cycle. The legal framework for egg donation IVF in Thailand is established and transparent. Countries where surrogacy is legally available for international clients include Georgia, Ukraine (post-war restrictions apply), USA (specific states), Canada (altruistic only), and Cambodia (with restrictions) — if surrogacy is the goal, these are the operative options, not Thailand.",
  },
];

export function BangkokFertility() {
  return (
    <div className="rounded-2xl border border-rose-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-rose-700 mb-3">
        🤱 Bangkok fertility treatment — IVF, egg freezing & reproductive medicine guide
      </h2>
      <div className="space-y-2">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-rose-100 rounded-xl p-3 group">
            <summary className="flex items-center gap-2 cursor-pointer list-none">
              <span className="text-lg">{t.emoji}</span>
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
