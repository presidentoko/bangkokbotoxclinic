// Focus-aware 5-step procedure walkthrough. Educational depth = longer time on site.
// Distinct from AppointmentTimeline (which is days/travel). This is "what actually happens in the chair".

import type { SiteFocus } from "@/lib/site";

type Step = { n: string; title: string; body: string; icon: string };

const FOCUS_PROCEDURE: Partial<Record<SiteFocus, { title: string; steps: Step[] }>> = {
  botox: {
    title: "How a botox injection works",
    steps: [
      { n: "1", icon: "🪞", title: "Assess movement", body: "Doctor watches you frown/smile/raise brows to find muscles to relax." },
      { n: "2", icon: "📐", title: "Mark injection points", body: "Marker dots placed at standard locations (typically 4–7 per area)." },
      { n: "3", icon: "❄️", title: "Numbing (optional)", body: "Ice or topical cream — most patients skip; the needle is very thin." },
      { n: "4", icon: "💉", title: "Inject", body: "Tiny doses at each marked point. Total time: 5–10 minutes." },
      { n: "5", icon: "✅", title: "Aftercare", body: "Don't lie down 4h, avoid pressure on area 24h. Effect onset 3–5 days." },
    ],
  },
  filler: {
    title: "How an HA filler injection works",
    steps: [
      { n: "1", icon: "🪞", title: "Plan", body: "Doctor maps volume goals — lips, cheeks, jawline, under-eye." },
      { n: "2", icon: "❄️", title: "Numbing", body: "Strong topical cream 15–20 min before injection." },
      { n: "3", icon: "💉", title: "Inject (cannula or needle)", body: "Some doctors use a blunt cannula for less bruising." },
      { n: "4", icon: "🤲", title: "Massage + shape", body: "Gentle massage to distribute filler evenly." },
      { n: "5", icon: "🧊", title: "Ice + recovery", body: "Mild swelling 24–48h. Avoid hot showers, alcohol, exercise." },
    ],
  },
  hifu: {
    title: "How an HIFU session works",
    steps: [
      { n: "1", icon: "🧼", title: "Cleanse", body: "Remove makeup + apply ultrasound gel." },
      { n: "2", icon: "📐", title: "Map zones", body: "Doctor outlines treatment areas — jowls, cheeks, neck, brows." },
      { n: "3", icon: "⚡", title: "Emit ultrasound", body: "Handpiece delivers focused ultrasound at 1.5mm / 3mm / 4.5mm depths." },
      { n: "4", icon: "🌡️", title: "Mild heat sensation", body: "Brief warm/prick feeling. No anesthesia needed." },
      { n: "5", icon: "✨", title: "Results over weeks", body: "Collagen rebuilds over 60–90 days. Effect lasts ~12 months." },
    ],
  },
  facial: {
    title: "How a HydraFacial session works",
    steps: [
      { n: "1", icon: "💧", title: "Cleanse + peel", body: "Mild acid resurfaces dead skin cells." },
      { n: "2", icon: "💨", title: "Extract", body: "Vacuum-spiral tip removes impurities painlessly." },
      { n: "3", icon: "💉", title: "Hydrate + infuse", body: "Antioxidants + hyaluronic acid pushed into pores." },
      { n: "4", icon: "💡", title: "LED + mask (optional)", body: "Some clinics add LED therapy for inflammation/brightening." },
      { n: "5", icon: "✨", title: "Glow immediately", body: "Visible glow same day. No downtime." },
    ],
  },
  laser: {
    title: "How a Pico laser session works",
    steps: [
      { n: "1", icon: "🧼", title: "Cleanse + numb", body: "Topical anesthetic 20 min before." },
      { n: "2", icon: "👁️", title: "Eye shields on", body: "Protective shields for both patient and operator." },
      { n: "3", icon: "🔬", title: "Picosecond pulses", body: "Trillionth-second pulses shatter pigment without heat damage." },
      { n: "4", icon: "🌬️", title: "Cooling airflow", body: "Chiller blows cold air on skin throughout to manage heat." },
      { n: "5", icon: "🧴", title: "SPF + recovery", body: "Mild redness 24h. Strict SPF50 for 2 weeks." },
    ],
  },
  dental: {
    title: "How a dental implant procedure works",
    steps: [
      { n: "1", icon: "🦷", title: "X-ray + plan", body: "3D CBCT scan maps jawbone density + nerve location." },
      { n: "2", icon: "💉", title: "Anesthesia", body: "Local anesthesia. Conscious throughout." },
      { n: "3", icon: "🔩", title: "Place titanium post", body: "Small incision, drill, screw in implant post. 30–60 min." },
      { n: "4", icon: "🩹", title: "Heal 2–4 months", body: "Osseointegration: bone fuses to implant. You wear a temp crown." },
      { n: "5", icon: "👑", title: "Permanent crown", body: "Custom crown attached on day 2 visit. Looks/feels like a tooth." },
    ],
  },
  hair: {
    title: "How an FUE hair transplant works",
    steps: [
      { n: "1", icon: "💉", title: "Local anesthesia", body: "Donor + recipient zones numbed. Sedation optional." },
      { n: "2", icon: "🔬", title: "Extract grafts", body: "Tiny 0.8mm punch removes individual follicular units from donor." },
      { n: "3", icon: "🧬", title: "Sort + check", body: "Technicians sort 1/2/3-hair grafts under microscopes. Discarded if damaged." },
      { n: "4", icon: "📐", title: "Design hairline", body: "Doctor draws new hairline considering face shape + age." },
      { n: "5", icon: "🌱", title: "Implant", body: "Grafts placed in recipient incisions at correct angle/density. 6–10 hours total." },
    ],
  },
};

export default function ProcedureExplainer({ focus }: { focus: SiteFocus }) {
  const cfg = FOCUS_PROCEDURE[focus];
  if (!cfg) return null;

  return (
    <section className="rounded-2xl border bg-white p-6 sm:p-8" style={{ borderColor: "var(--border)" }}>
      <div className="mb-5">
        <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">Step by step</div>
        <h2 className="mt-1 text-xl sm:text-2xl font-black tracking-tight">{cfg.title}</h2>
      </div>
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {cfg.steps.map((s) => (
          <li key={s.n} className="relative rounded-xl border bg-slate-50 p-4" style={{ borderColor: "var(--border)" }}>
            <span className="absolute -top-3 -left-3 grid place-items-center h-8 w-8 rounded-full bg-slate-900 text-white text-xs font-black">{s.n}</span>
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="font-black text-sm leading-tight">{s.title}</div>
            <p className="text-xs text-[var(--muted)] mt-1.5 leading-relaxed">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
