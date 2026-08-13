import Link from "next/link";
import type { Lang } from "@/lib/types";

const PROCS: { slug: string; short: string; full: string; what: string; for: string; recovery: string; costThb: string; emoji: string; popular?: boolean }[] = [
  {
    slug: "fue",
    short: "FUE",
    full: "Follicular Unit Extraction",
    what: "Individual hair follicles are extracted from the donor area (usually back/sides of head) using a micro-punch and implanted one by one.",
    for: "Mild to severe hair loss. Most popular for natural-looking results with no linear scar.",
    recovery: "7-10 days. Tiny dot scars only.",
    costThb: "฿80,000-200,000",
    emoji: "🔬",
    popular: true,
  },
  {
    slug: "dhi",
    short: "DHI",
    full: "Direct Hair Implantation",
    what: "Variant of FUE using a Choi pen — follicles extracted and immediately implanted without storing. Higher density, no need to make incisions first.",
    for: "Patients wanting denser results with shorter follicle exposure time.",
    recovery: "5-7 days. Premium technique, often 30-50% more expensive than FUE.",
    costThb: "฿120,000-280,000",
    emoji: "🖊️",
    popular: true,
  },
  {
    slug: "fut",
    short: "FUT",
    full: "Follicular Unit Transplantation",
    what: "A strip of scalp is removed from donor area, dissected into individual follicular units, then transplanted. Older technique but still used for maximum grafts in one session.",
    for: "Severe hair loss requiring 3000+ grafts in one go. Lower cost per graft than FUE.",
    recovery: "10-14 days. Linear scar (concealed by hair).",
    costThb: "฿60,000-150,000",
    emoji: "📏",
  },
  {
    slug: "prp",
    short: "PRP",
    full: "Platelet-Rich Plasma",
    what: "Patient's own blood is centrifuged to concentrate platelets, then injected into scalp. Non-surgical. Stimulates dormant follicles + strengthens existing hair.",
    for: "Early-stage hair loss, post-transplant recovery, thinning hair.",
    recovery: "Same day. Multiple sessions (3-6) needed.",
    costThb: "฿8,000-15,000/session",
    emoji: "💉",
  },
  {
    slug: "smp",
    short: "SMP",
    full: "Scalp Micropigmentation",
    what: "Tiny pigment dots tattooed onto the scalp to simulate hair follicle appearance. Non-surgical alternative.",
    for: "Patients who don't want surgery, want to camouflage scar, or shaved-head look.",
    recovery: "Same day. 2-3 sessions for full effect.",
    costThb: "฿20,000-80,000",
    emoji: "⚫",
  },
  {
    slug: "eyebrow",
    short: "Eyebrow",
    full: "Eyebrow Transplant",
    what: "FUE technique applied to eyebrow restoration. Individual follicles transplanted to thinning or absent brows.",
    for: "Sparse eyebrows from overplucking, aging, or chemotherapy.",
    recovery: "5-7 days. Initial growth in 3 months.",
    costThb: "฿30,000-80,000",
    emoji: "👁️",
  },
];

const FAQS = [
  {
    q: "How do I know if I'm a candidate for a hair transplant?",
    a: "You're typically a good candidate if (1) your hair loss pattern has stabilized — usually after age 25-30, (2) you have enough healthy donor hair on the back/sides of your head, and (3) your expectations are realistic. Diffuse hair loss (thinning all over) is harder to treat; pattern baldness (receding hairline, crown thinning) responds best. Most clinics offer a free consultation to assess this with photos.",
  },
  {
    q: "How much does a hair transplant cost in Thailand?",
    a: "Costs in Thailand range from ฿60,000 (FUT, basic clinics) to ฿280,000 (premium DHI at international clinics) per session. Most patients spend ฿120,000-180,000 for a typical 2,000-3,000 graft FUE procedure. This is roughly 30-60% cheaper than equivalent procedures in Korea, Turkey, or Western Europe — which is why medical tourism is significant.",
  },
  {
    q: "What's the difference between FUE and DHI?",
    a: "Both extract individual follicles. The difference is in implantation: FUE makes small incisions in the recipient area first, then places grafts. DHI uses a Choi implanter pen to both make the incision AND place the graft in one motion. DHI typically yields slightly higher density and shorter follicle storage time, but costs 30-50% more. Results from skilled surgeons are comparable.",
  },
  {
    q: "When will I see final results?",
    a: "Implanted hair sheds within 2-4 weeks (this is normal — the follicle survives). New growth starts at 3-4 months. Density reaches 60-70% at 6 months and final density at 12 months. This is why our Trust Score factors in clinics' before/after photo timing — premature 'success' photos are a red flag.",
  },
  {
    q: "Are the patient reviews on this site real?",
    a: "Yes. We aggregate reviews from six independent platforms (Google Maps, Bookimed, Reddit, Naver, YouTube, Pantip). We do not edit, remove, or accept payment to hide negative reviews. Clinics flagged for suspected viral marketing are filtered separately (visible only via the toggle). Verified Partners pay for placement priority but cannot suppress reviews.",
  },
  {
    q: "Do I need to speak Thai to get a hair transplant here?",
    a: "No. Most clinics in our 'International-friendly' collection have dedicated English-speaking coordinators, and several have Korean-speaking staff. Filter by language on our directory. Larger international-tourism clinics also offer airport pickup, hotel arrangements, and post-op follow-up via WhatsApp/LINE.",
  },
];

export default function ProcedureExplainer({ lang }: { lang: Lang }) {
  void lang; // i18n version of long-form content is future work — English covers AEO baseline for now
  return (
    <section id="procedures" className="space-y-10">
      {/* Procedures grid */}
      <div>
        <div className="text-center mb-8">
          <div className="eyebrow justify-center">Procedures</div>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tighter-display sm:text-4xl">
            What's available in Thailand
          </h2>
          <p className="mt-2 text-sm muted max-w-2xl mx-auto">
            Six main procedures, each with different cost, recovery, and best-fit cases. Hover any card for details.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROCS.map((p) => (
            <Link key={p.slug} href={`/en/c/${p.slug}/`}
              className={`group card card-hover relative overflow-hidden p-6 ${p.popular ? "ring-2 ring-gold-400/40" : ""}`}>
              {p.popular && (
                <span className="absolute right-4 top-4 gold-ribbon rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider shadow">
                  Popular
                </span>
              )}
              <div className="text-4xl">{p.emoji}</div>
              <h3 className="mt-3 font-display text-xl font-bold leading-tight">
                {p.short}
                <span className="ml-1 text-sm font-medium muted">· {p.full}</span>
              </h3>
              <p className="mt-3 text-sm leading-relaxed muted line-clamp-3 group-hover:line-clamp-none">
                {p.what}
              </p>
              <dl className="mt-4 space-y-1.5 text-xs">
                <div className="flex gap-2">
                  <dt className="font-bold uppercase tracking-wider muted w-16 shrink-0">Best for</dt>
                  <dd className="flex-1">{p.for}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-bold uppercase tracking-wider muted w-16 shrink-0">Recovery</dt>
                  <dd className="flex-1">{p.recovery}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-bold uppercase tracking-wider muted w-16 shrink-0">Cost</dt>
                  <dd className="flex-1 font-semibold">{p.costThb}</dd>
                </div>
              </dl>
              <div className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-navy-700 dark:text-gold-400 group-hover:underline">
                View {p.short} clinics →
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="rounded-[2rem] border-2 bg-[rgb(var(--bg-elev))] p-8 sm:p-12" style={{ borderColor: "rgb(var(--border))" }}>
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <div className="eyebrow">FAQ</div>
            <h2 className="mt-2 font-display text-3xl font-bold leading-tight tracking-tighter-display sm:text-4xl">
              Questions before you book
            </h2>
            <p className="mt-3 text-sm muted leading-relaxed">
              Answers to what international patients ask us most often. Still unsure? Email us at <a href="mailto:hello@thaifacialclinic.com" className="font-bold underline">hello@thaifacialclinic.com</a> — real humans, not chatbots.
            </p>
          </div>
          <dl className="grid gap-2">
            {FAQS.map((f) => (
              <details key={f.q} className="group rounded-2xl border bg-[rgb(var(--bg))] p-5 transition open:bg-[rgb(var(--bg-elev))]"
                style={{ borderColor: "rgb(var(--border))" }}>
                <summary className="cursor-pointer list-none flex items-start justify-between gap-3">
                  <span className="font-display text-base font-bold leading-snug">{f.q}</span>
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold-100 text-gold-700 text-xl leading-none transition group-open:rotate-45 dark:bg-gold-900/40">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed muted">{f.a}</p>
              </details>
            ))}
          </dl>
        </div>

        {/* FAQPage JSON-LD 는 여기서 내보내지 않는다 — 이 컴포넌트가 렌더되는
            홈(app/[lang]/page.tsx)이 이미 HOME_FAQS 로 FAQPage 하나를 내보내고
            있어서, /en/ · /th/ · /ko/ 전부 한 문서에 FAQPage 가 2개씩 실려
            있었다 (2026-08-06 감사). 위의 <dl> 가시 Q&A 는 그대로 두므로
            LLM 크롤러가 읽는 원문은 손실 없다. */}
      </div>
    </section>
  );
}
