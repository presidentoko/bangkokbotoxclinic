// Day-by-day procedure flow visualization. Focus-aware.
// Shows the patient exactly what happens from inquiry to recovery.

import type { SiteFocus } from "@/lib/site";

type Step = { day: string; icon: string; title: string; body: string };

const FOCUS_STEPS: Partial<Record<SiteFocus, Step[]>> = {
  botox: [
    { day: "Day 0",   icon: "📨", title: "You inquire",          body: "Send a quick form or LINE message — clinic responds in &lt; 4h." },
    { day: "Day 1–3", icon: "🛬", title: "Travel to Bangkok",    body: "Most patients combine with city break. We recommend nearby hotels." },
    { day: "Day 1",   icon: "💉", title: "Consult + procedure",  body: "Same-day botox: 15-min consult, 5-min injection. No downtime." },
    { day: "Day 3",   icon: "✨", title: "Results visible",       body: "Onset 3–5 days. Full effect at 2 weeks. No bruising bandage needed." },
    { day: "Day 90+", icon: "🔁", title: "Maintenance",           body: "Most patients return every 3–4 months. We&apos;ll remind you." },
  ],
  filler: [
    { day: "Day 0",   icon: "📨", title: "You inquire",          body: "Send photo + concern. We match you to specialists." },
    { day: "Day 1–2", icon: "🛬", title: "Travel + check-in",     body: "Arrive day before. Hydrate, avoid blood-thinners." },
    { day: "Day 1",   icon: "💋", title: "Filler appointment",    body: "30–60 min in-chair. Numbing cream first." },
    { day: "Day 7",   icon: "✨", title: "Settled look",           body: "Initial swell drops at 48h, fully settles by week 1." },
    { day: "12–18mo", icon: "🔁", title: "Top-up",                 body: "HA fillers gradually metabolize. Top up around month 12." },
  ],
  dental: [
    { day: "Day 0",   icon: "📨", title: "Send X-ray (or arrive)", body: "Email panoramic X-ray or schedule first-visit free X-ray." },
    { day: "Day 1",   icon: "🦷", title: "Consult + plan",         body: "Treatment plan + written quote on Day 1." },
    { day: "Day 2–7", icon: "🔧", title: "Procedure(s)",            body: "Implant: post-placed in 1 visit. Veneer: 2 visits (prep + fit)." },
    { day: "Day 60",  icon: "🦷", title: "Crown fit (if implant)",  body: "Return after osseointegration — fly back or do remotely." },
    { day: "10yr+",   icon: "🛡️", title: "Lifetime warranty",       body: "Most Bangkok implant clinics offer 5–10yr written warranty." },
  ],
  hair: [
    { day: "Day 0",    icon: "📨", title: "Send photo + Norwood",    body: "We assess pattern + recommend grafts needed." },
    { day: "Day 1–2",  icon: "🛬", title: "Arrive Bangkok",          body: "Most stay 4–5 days. Avoid alcohol 48h pre-op." },
    { day: "Day 2",    icon: "🌱", title: "Surgery (FUE/DHI)",       body: "8–10 hour day. Local anesthesia. Sedation optional." },
    { day: "Day 5–7",  icon: "✈️", title: "Fly home",                body: "Scabs heal week 1. Hat OK from day 4–5." },
    { day: "Month 8",  icon: "✨", title: "Visible growth",          body: "First strong growth at 6–8 months. Full result at 12–18 months." },
  ],
  hifu: [
    { day: "Day 0",   icon: "📨", title: "Inquire",                body: "Email recent face photo. We confirm machine + areas." },
    { day: "Day 1",   icon: "⚡", title: "HIFU session",             body: "60–90 min. Mild discomfort, no downtime." },
    { day: "Day 60",  icon: "✨", title: "Lifting visible",         body: "Collagen builds over 8–12 weeks. Full effect month 3." },
    { day: "12mo",    icon: "🔁", title: "Top-up session",          body: "Most patients repeat annually." },
  ],
  facial: [
    { day: "Day 0",  icon: "📨", title: "Book session",           body: "Select package (e.g. 3-session HydraFacial bundle)." },
    { day: "Day 1",  icon: "💧", title: "First session",           body: "60-min facial. Immediate glow, no downtime." },
    { day: "Day 14", icon: "🔁", title: "Session 2",                body: "Bi-weekly cadence for best results." },
    { day: "Day 28", icon: "✨", title: "Session 3 + maintenance",  body: "Skin texture improves cumulatively." },
  ],
  laser: [
    { day: "Day 0",   icon: "📨", title: "Inquire",                body: "Skin type assessment via photo." },
    { day: "Day 1",   icon: "🔬", title: "Laser session",           body: "Pico/CO2: 30–60 min, mild redness." },
    { day: "Day 7",   icon: "🌿", title: "Recovery",                body: "Use SPF50, gentle cleansers. Avoid sun." },
    { day: "Day 28",  icon: "🔁", title: "Session 2 (if pkg)",      body: "3–6 sessions for full effect on most concerns." },
  ],
};

export default function AppointmentTimeline({ focus }: { focus: SiteFocus }) {
  const steps = FOCUS_STEPS[focus];
  if (!steps) return null;

  return (
    <section className="rounded-2xl border-2 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 sm:p-8" style={{ borderColor: "#bfdbfe" }}>
      <div className="text-center mb-6">
        <div className="text-xs font-black uppercase tracking-widest text-blue-700">What to expect</div>
        <h2 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight">Your procedure, day by day</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Most international patients combine the procedure with a Bangkok stay. Here&apos;s the typical flow.
        </p>
      </div>

      <ol className="relative">
        <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-400 to-indigo-500 hidden sm:block" />
        <div className="space-y-4">
          {steps.map((s, i) => (
            <li key={i} className="relative pl-0 sm:pl-14">
              <span className="hidden sm:grid absolute left-0 top-0 place-items-center h-10 w-10 rounded-full bg-white border-2 border-blue-400 text-base shadow-sm">
                {s.icon}
              </span>
              <div className="rounded-xl bg-white border p-4" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-baseline justify-between gap-2 mb-1 flex-wrap">
                  <div className="flex items-center gap-2 sm:hidden">
                    <span className="text-xl">{s.icon}</span>
                    <span className="font-black">{s.title}</span>
                  </div>
                  <span className="hidden sm:inline font-black">{s.title}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">{s.day}</span>
                </div>
                <p className="text-sm text-[var(--muted)] leading-relaxed" dangerouslySetInnerHTML={{ __html: s.body }} />
              </div>
            </li>
          ))}
        </div>
      </ol>
    </section>
  );
}
