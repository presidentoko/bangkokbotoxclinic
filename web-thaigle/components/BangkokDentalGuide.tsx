const CLINICS = [
  {
    name: "Dental World Bangkok",
    emoji: "🦷",
    area: "Sukhumvit, multiple BTS-adjacent locations",
    price: "General checkup ฿500–800, Cleaning ฿800–1,500, Filling ฿800–2,000, Implant ฿35,000–55,000",
    why: "Bangkok's most popular dental chain for expats and tourists. English-speaking dentists, modern equipment, transparent pricing. Standard of care comparable to Western countries.",
    tip: "Book via their website or phone. X-rays included in consultation price. CODA-certified — insurance reimbursement possible for many international policies.",
  },
  {
    name: "Bumrungrad International Hospital Dental",
    emoji: "🏥",
    area: "Bumrungrad Hospital, Sukhumvit 3 (Nana BTS)",
    price: "Checkup ฿1,200–1,800, Implant ฿60,000–90,000, Whitening ฿6,000–12,000",
    why: "World-class hospital with internationally accredited dental department. All specialist services: orthodontics, oral surgery, implants, cosmetic. Most insurance policies accepted.",
    tip: "Best choice if you have international health insurance. Very high standard of care. More expensive than private dental clinics but comprehensive. Good for complex cases.",
  },
  {
    name: "Q&M Dental (Budget-Quality Balance)",
    emoji: "💰",
    area: "Multiple mall locations: Siam Square, Central Lad Phrao",
    price: "Cleaning ฿600–900, Whitening ฿3,000–5,000, Filling ฿600–1,200",
    why: "Singapore-based chain with Bangkok locations. Very good quality-to-price ratio. Popular with budget-conscious expats doing maintenance dentistry.",
    tip: "Good for routine work. For complex procedures (implants, surgery) recommend Bumrungrad or specialist clinics instead.",
  },
  {
    name: "Bangkok vs Home: Cost Comparison",
    emoji: "📊",
    area: "All of Bangkok",
    price: "Savings vs USA: 60–80% less. vs UK/Australia: 50–70% less.",
    why: "Bangkok dental prices are dramatically lower than Western markets while maintaining excellent quality. Many tourists specifically come to Bangkok for dental work.",
    tip: "Common Bangkok dental tourism: teeth whitening (1–2 sessions = weekend trip), implants (3–4 visits over 6 months), Invisalign braces. All significantly cheaper than home.",
  },
];

export function BangkokDentalGuide() {
  return (
    <div className="rounded-2xl border border-sky-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-sky-700 mb-3">
        🦷 Bangkok dental guide — English-speaking clinics & honest prices
      </div>
      <div className="space-y-2">
        {CLINICS.map((c) => (
          <div key={c.name} className="border border-sky-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{c.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{c.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{c.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700 max-w-[100px] text-right leading-tight">{c.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{c.why}</div>
            <div className="text-[10px] text-sky-700">💡 {c.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
