const VISAS = [
  {
    type: "Visa Exemption",
    emoji: "🆓",
    duration: "30–60 days",
    who: "65+ nationalities (US, EU, UK, AUS, JPY, KR, etc.)",
    cost: "Free",
    notes: "Most Western travelers. 30 days by air (extended to 60 days as of 2024). Single entry. Can extend once at immigration for ฿1,900.",
    best: "Short visits",
  },
  {
    type: "Tourist Visa (TR)",
    emoji: "✈️",
    duration: "60 days (extendable +30)",
    who: "Any nationality via Thai embassy",
    cost: "฿2,500–฿5,000",
    notes: "Single or multiple entry. Apply at Thai embassy before arrival. Best for 2–3 month stays.",
    best: "2–3 month stays",
  },
  {
    type: "DTV (Destination Thailand)",
    emoji: "🌐",
    duration: "5 years, 180-day stays",
    who: "Remote workers, freelancers, digital nomads",
    cost: "฿10,000 (~$280)",
    notes: "Multiple entry. Stay 180 days per entry. Must show proof of remote work / income.",
    best: "Digital nomads",
  },
  {
    type: "LTR Visa (Long-Term Resident)",
    emoji: "🏆",
    duration: "10 years",
    who: "High earners (USD $80k+), retirees, skilled workers",
    cost: "฿50,000 (~$1,400)",
    notes: "Work permit included. 90-day reporting every year (not 90 days). Tax incentives.",
    best: "Long-term expats",
  },
  {
    type: "Retirement Visa (O-A)",
    emoji: "🧓",
    duration: "1 year (renewable)",
    who: "Age 50+",
    cost: "฿2,000/year",
    notes: "Requires ฿800,000 in Thai bank account OR ฿65,000/month pension. Annual renewal.",
    best: "Retirees 50+",
  },
];

export function BangkokVisaGuide() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🛂 Thailand visa options at a glance
      </h2>
      <div className="space-y-2">
        {VISAS.map((v) => (
          <div key={v.type} className="border border-[var(--border)] rounded-xl p-3">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">{v.emoji}</span>
                <div>
                  <div className="font-bold text-xs">{v.type}</div>
                  <div className="text-[10px] text-[var(--muted)]">{v.duration} · {v.who}</div>
                </div>
              </div>
              <span className="text-[11px] font-mono font-black text-green-700 bg-green-50 px-2 py-0.5 rounded shrink-0">{v.cost}</span>
            </div>
            <div className="text-[10px] text-[var(--muted)] leading-snug mt-1">{v.notes}</div>
            <div className="text-[10px] text-blue-600 font-medium mt-0.5">Best for: {v.best}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[10px] text-amber-700 bg-amber-50 rounded-xl p-2.5 border border-amber-200">
        <strong>Note:</strong> Visa rules change frequently. Verify at official Thai embassy site or thaievisa.go.th before travel.
      </div>
    </div>
  );
}
