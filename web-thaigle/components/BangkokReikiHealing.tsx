const INFO = [
  {
    name: "Reiki Practitioners in Bangkok",
    emoji: "🙌",
    area: "Wellness studios, yoga centers, private practitioners",
    price: "Session ฿800–2,500/hour",
    why: "Reiki (Japanese energy healing technique) has a significant presence in Bangkok's wellness community — fitting naturally alongside the city's existing Thai traditional medicine, Buddhist healing, and yoga culture. Usui and Karuna Reiki lineages are most common in Bangkok. Practitioners typically work in integrative wellness centers or home studios. Sessions involve light or no-touch hand placement on the body's energy centers.",
    tip: "For first-time Reiki: wear comfortable loose clothing, avoid a heavy meal beforehand, and arrive with an open mindset rather than specific expectations. Many Bangkok Reiki practitioners also incorporate Thai Buddhist blessing, sound healing elements, or aromatherapy. The session is typically 60–90 minutes including intake discussion.",
  },
  {
    name: "Reiki Training & Certification in Bangkok",
    emoji: "📜",
    area: "Wellness schools and Reiki master teachers",
    price: "Level 1 ฿3,000–8,000; Level 2 ฿5,000–15,000; Master ฿20,000+",
    why: "Bangkok has multiple Reiki masters offering attunement programs for those who want to learn the practice. Usui Reiki Level 1 (self-healing, basic hand positions), Level 2 (working with others, distance healing symbols), and Master level (attunement of others). Programs run over 1–3 days depending on level. Bangkok's spiritual community is active — several certification programs run monthly.",
    tip: "Reiki attunement weekend workshops are popular among Bangkok's wellness community as both personal development and professional qualification for wellness practitioners. Ask about the teacher's lineage (Reiki is transmitted teacher-to-student in lineages back to founder Mikao Usui) — it matters to serious practitioners.",
  },
  {
    name: "Thai Traditional Healing & Reiki Integration",
    emoji: "🌺",
    area: "Holistic wellness centers in Bangkok",
    price: "Integrated session ฿1,200–3,500",
    why: "Several Bangkok wellness practitioners combine Reiki with Thai traditional medicine concepts (sen energy lines, similar to chakras/meridians) creating a culturally integrated healing approach. Thai traditional medicine's energy theory (prana-like 'lom' wind element) has conceptual overlap with Reiki's 'ki' energy. Some practitioners seamlessly integrate both approaches.",
    tip: "If interested in the combination approach, look for practitioners who are certified in both Thai traditional medicine and Reiki — this is more common in Bangkok than in most Western cities due to the established Thai healing tradition.",
  },
];

export function BangkokReikiHealing() {
  return (
    <div className="rounded-2xl border border-rose-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-rose-700 mb-3">
        🙌 Reiki healing in Bangkok — practitioners, attunement training & wellness integration
      </div>
      <div className="space-y-2">
        {INFO.map((i) => (
          <div key={i.name} className="border border-rose-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{i.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{i.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{i.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{i.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{i.why}</div>
            <div className="text-[10px] text-rose-700">💡 {i.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
