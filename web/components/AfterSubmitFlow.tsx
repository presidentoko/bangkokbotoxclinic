// Post-submit timeline — reduces booking-form-abandon anxiety.
// Visualizes the 24h response promise. Drops into home page right after booking form.

const STEPS = [
  { t: "We receive your request",          d: "Form posts instantly to our team inbox. Real humans, no chatbots.",                                                                  mins: "Instant" },
  { t: "We verify + match",                d: "We forward your contact info and specific question to the clinic.",                                                                   mins: "< 1 hour" },
  { t: "Clinic contacts you directly",     d: "Their coordinator (English, Korean or Arabic on request) reaches out via your preferred channel.",                                    mins: "Within 24h" },
  { t: "You decide on your own time",      d: "No pressure, no follow-up spam. We don't sell your contact info.",                                                                    mins: "No deadline" },
];

export default function AfterSubmitFlow({ contactEmail = "hello@bkkclinics.com" }: { contactEmail?: string }) {
  return (
    <section className="rounded-[2rem] border-2 border-emerald-200 bg-emerald-50/50 p-6 sm:p-10">
      <div className="text-center mb-8">
        <div className="text-xs font-bold uppercase tracking-widest text-emerald-700">After you submit</div>
        <h2 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight">What happens after you book a consult</h2>
      </div>
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <li key={i} className="relative rounded-2xl bg-white p-5 ring-1 ring-emerald-200">
            <div className="flex items-start justify-between">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-emerald-800 text-base font-bold">
                {i + 1}
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                {s.mins}
              </span>
            </div>
            <div className="mt-4 text-base font-bold leading-tight">{s.t}</div>
            <p className="mt-1.5 text-xs leading-relaxed text-[var(--muted)]">{s.d}</p>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-center text-xs text-[var(--muted)]">
        If 24 hours pass with no contact, email <a href={`mailto:${contactEmail}`} className="underline font-semibold">{contactEmail}</a> — we&apos;ll personally chase the clinic.
      </p>
    </section>
  );
}
