const OPTIONS = [
  {
    type: "Thailand LTR Visa (Long-Term Resident)",
    emoji: "🏠",
    who: "High-income earners, retirees, remote workers, wealthy global citizens",
    duration: "10 years; renewable",
    why: "Thailand's premium long-stay visa introduced 2022. Eligibility tiers: Wealthy Global Citizen (US$80,000 annual income or US$500,000 assets), Wealthy Pensioner (US$40,000 pension income), Work-from-Thailand Professional (US$40,000 income in a qualifying company), Highly Skilled Professional (specific fields). Benefits: fast-track airports, 90-day report every year (not quarterly), special tax status, no work permit required for approved activities.",
    tip: "The LTR Visa is administered through Thailand's BOI (Board of Investment) — apply through the BOI One Stop Service Centre in Bangkok. Processing is 20–30 working days. Requires a medical certificate, background check, and financial evidence. Worth it if staying 1+ years — the airport fast-track alone has significant time value.",
  },
  {
    type: "Thailand Elite Visa (Privilege Card)",
    emoji: "💎",
    who: "Tourists and part-time residents who want convenience",
    duration: "5–20 years; multiple entry",
    why: "Thailand Privilege (formerly Thailand Elite) is a membership-based long-stay visa. Plans from 5 to 20 years at US$10,000–30,000. Includes airport VIP service, limousine pickup, visa processing handled for you, golf benefits, and health discounts. Primary appeal: no need to manage visa runs, 90-day reports, or bureaucracy. The membership fee is essentially paying for administrative convenience over multiple years.",
    tip: "Thailand Privilege card holders get a dedicated immigration queue — this alone saves significant time if visiting Bangkok frequently. Calculate the per-year cost: 20-year plan at ฿2.5M = ฿125,000/year — comparable to hiring a visa agent annually without the stress.",
  },
  {
    type: "Non-Immigrant B (Business/Work)",
    emoji: "💼",
    who: "Employees working for Thai companies, BOI-promoted companies",
    duration: "1 year; renewable annually with valid work permit",
    why: "For foreigners employed by Thai companies. Requires a work permit from the Ministry of Labour. The Non-B visa + work permit combination is Thailand's standard path for employed expats. Annual renewal requires continued employment, tax compliance documentation, and updated company paperwork. Most Bangkok expats on employer-sponsored work are on this visa.",
    tip: "The Non-B + work permit process requires the employer's coordination — an HR department or expat support service handles most of the paperwork. The 90-day report (reporting physical address to immigration) is the main ongoing administrative task — can now be done online.",
  },
  {
    type: "Education Visa (Non-Immigrant ED)",
    emoji: "📚",
    who: "Students studying Thai language, university courses, martial arts",
    duration: "1 year; renewable through continued enrollment",
    why: "Studying Thai language at a recognized school grants a Non-ED visa for 1 year (renewable). Very common path for digital nomads and longer-term Bangkok residents — 8+ hours/week Thai language class satisfies the visa requirement. Also available for Muay Thai training at registered camps, university enrollment, and some vocational courses.",
    tip: "Thai language school enrollment is the most flexible ED visa path — many Bangkok language schools specialize in ED visa students. Class schedules can be arranged around work schedules. This visa does NOT include a work permit — working (even remotely for foreign clients) creates a legal gray area that many Bangkok residents accept but should be aware of.",
  },
];

export function BangkokLongTermVisa() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        🏠 Long-term visa options for Bangkok — LTR, Elite, Non-B & ED explained
      </h2>
      <div className="space-y-2">
        {OPTIONS.map((o) => (
          <details key={o.type} className="border border-blue-100 rounded-xl p-3">
            <summary className="cursor-pointer select-none">
              <div className="flex items-center gap-2">
                <span className="text-xl shrink-0">{o.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs">{o.type}</div>
                  <div className="text-[10px] text-[var(--muted)]">{o.who}</div>
                </div>
                <span className="min-w-0 break-words text-right text-[10px] font-mono text-blue-700">{o.duration}</span>
              </div>
            </summary>
            <div className="mt-2 text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{o.why}</div>
            <div className="text-[10px] text-blue-700">💡 {o.tip}</div>
          </details>
        ))}
      </div>
    </div>
  );
}
