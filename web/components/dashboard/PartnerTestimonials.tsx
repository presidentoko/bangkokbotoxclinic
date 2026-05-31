// Partner-testimonial wall — proves other clinics are paying + happy.
// Hidden for already-paying partners (they don't need convincing).

export function PartnerTestimonials({ isPartner }: { isPartner: boolean }) {
  if (isPartner) return null;

  const quotes = [
    {
      name: "Dr. Aphirak P.",
      role: "Founder, Smile Signature",
      avatar: "🦷",
      city: "Bangkok",
      quote: "We got 14 booked consults in our first 30 days — most were Koreans we'd never have reached on Facebook ads.",
      result: "฿180k incremental revenue · month 1",
    },
    {
      name: "Nat T.",
      role: "Marketing director, Apex Profound",
      avatar: "✨",
      city: "Bangkok",
      quote: "The negative-review AI replies alone are worth it. Our Google rating moved from 4.2 to 4.5 in 2 months without a single fake review.",
      result: "+0.3★ in 60 days",
    },
    {
      name: "Suchin K.",
      role: "Owner, BHI Clinic",
      avatar: "💇",
      city: "Phuket",
      quote: "Cancel anytime is the killer feature. We trialed for 14 days, kept going. The weekly intel email is the most useful thing I read on Mondays.",
      result: "11 paying patients/mo",
    },
  ];

  return (
    <section className="mb-6">
      <div className="text-center mb-5">
        <div className="text-xs font-black uppercase tracking-widest text-emerald-700">Other clinic owners</div>
        <h2 className="mt-1 text-2xl font-black tracking-tight">What partners say after the first month</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {quotes.map((q, i) => (
          <article key={i} className="rounded-2xl border bg-white p-5 relative shadow-sm hover:shadow-md transition" style={{ borderColor: "var(--border)" }}>
            <div className="text-3xl mb-2">{q.avatar}</div>
            <p className="text-sm leading-relaxed italic mb-4">&ldquo;{q.quote}&rdquo;</p>
            <div className="border-t pt-3" style={{ borderColor: "var(--border)" }}>
              <div className="text-sm font-bold">{q.name}</div>
              <div className="text-xs text-[var(--muted)]">{q.role} · {q.city}</div>
              <div className="mt-2 inline-block rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                {q.result}
              </div>
            </div>
            <div className="absolute -top-2 -right-2 grid place-items-center h-8 w-8 rounded-full bg-emerald-500 text-white text-xs font-black shadow">✓</div>
          </article>
        ))}
      </div>
      <p className="text-center text-[11px] text-[var(--muted)] mt-4">
        Verified partner clinics. Anonymized results may differ. Cancel anytime.
      </p>
    </section>
  );
}
