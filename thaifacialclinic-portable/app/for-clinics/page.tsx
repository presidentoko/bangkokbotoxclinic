import type { Metadata } from "next";
import Link from "next/link";
import { loadClinics } from "@/lib/data";
import { SITE } from "@/lib/i18n";
import PartnerInquiryForm from "@/components/PartnerInquiryForm";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Partner with us — Lead generation, Featured listings, Market intelligence",
  description:
    "Pre-qualified consultation requests for your Thai hair-transplant clinic. CPL from ฿100/lead, Featured slots from ฿5,000/mo, monthly competitor intelligence. No contract.",
  alternates: { canonical: `${SITE.origin}/for-clinics/` },
};

const PLANS = [
  {
    name: "CPL",
    sub: "Pay per qualified lead",
    price: "฿100",
    unit: "per lead",
    headline: "Only pay when a patient submits a booking form",
    bullets: [
      "Multi-step form: procedure + preferred date + name + email + phone",
      "We route the lead straight to your LINE / email within seconds",
      "Honeypot + rate-limit protection (bot leads filtered)",
      "Pause anytime — no monthly minimum",
    ],
    cta: "Start with CPL →",
    accent: "from-clinic to-clinic-deep",
  },
  {
    name: "Featured",
    sub: "Sticky directory placement",
    price: "฿5,000–฿15,000",
    unit: "per month",
    headline: "Top of every directory + category page in your city",
    bullets: [
      "Editor's Pick (purple badge, top-of-page sticky) — ฿15,000/mo",
      "Recommended (blue badge, above organic) — ฿10,000/mo",
      "Featured (gray badge) — ฿5,000/mo",
      "Includes CPL leads + monthly intelligence report",
    ],
    cta: "Reserve a slot →",
    accent: "from-clinic-violet to-clinic",
    highlight: true,
  },
  {
    name: "Intelligence",
    sub: "Monthly competitive report",
    price: "฿8,000",
    unit: "per month",
    headline: "Owner dashboard + AI-drafted review reply tools",
    bullets: [
      "Live lead inbox with status tracking (new / contacted / booked)",
      "AI-drafted reply for every unanswered negative review (Claude)",
      "Trust Score breakdown + city rank trend",
      "Competitor leaderboard with names unlocked",
    ],
    cta: "See dashboard demo →",
    accent: "from-trust-mint to-trust-high",
  },
];

const FAQS = [
  {
    q: "What counts as a qualified lead?",
    a: "A visitor lands on your clinic page, reads the Trust Score and reviews, then fills the booking form completely — procedure, date, contact info. Honeypot + rate-limit filter spam. Abandoned forms cost you nothing.",
  },
  {
    q: "Will sponsoring a slot hurt my organic Trust Score?",
    a: "No. Sponsored slots are clearly labelled with a colored badge and shown ABOVE organic results. Your organic Trust Score is computed and displayed independently — we never hide or downrank organic listings.",
  },
  {
    q: "How fast can I start?",
    a: "CPL setup: same day. We add your LINE / webhook and leads start flowing. Featured slot: we add your clinic ID to the sponsored list, Vercel auto-redeploys (~2 min), badge appears on the directory.",
  },
  {
    q: "Can I see my data before signing?",
    a: "Yes — every hair-transplant clinic in our database already has a free intelligence report. Email partners@thaifacialclinic.com with your clinic name and we'll send the private dashboard link within 24h.",
  },
  {
    q: "What if I want to cancel?",
    a: "Cancel anytime via LINE or email. CPL: paused immediately. Featured slot: prorated refund for the unused days in the current month. No contracts, no minimums, no lock-in.",
  },
  {
    q: "Do you accept Korean / Arabic / Chinese language clinics?",
    a: "Yes. Our site already serves /ko, /th, /zh, /ar locales. Clinics with multi-language staff get a separate filter (high search volume from Korea + GCC medical tourists). Tag yourself in onboarding to fast-track that placement.",
  },
];

const partnerEmail = `partners@${new URL(SITE.origin).hostname}`;

export default function ForClinicsPage() {
  const { clinics, total, avg_trust } = loadClinics();
  const reviewSum = clinics.reduce((s, c) => s + (c.reviews_scraped_count || 0) + (c.review_count || 0), 0);
  const photoSum = clinics.reduce((s, c) => s + (c.photos_count || 0), 0);
  const videoSum = clinics.reduce((s, c) => s + (c.videos_count || 0), 0);

  const noFouc = `(function(){try{var s=localStorage.getItem('theme');var d=s==='dark'||(!s&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: noFouc }} />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <nav className="mb-4 text-sm muted">
          <Link href="/" className="hover:text-[rgb(var(--fg))]">Home</Link>
          <span className="mx-2">›</span>
          <span>For Clinics</span>
        </nav>

        {/* Scarcity banner */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-gold-400/40 bg-gold-50 px-5 py-3 dark:bg-gold-950/30">
          <div className="text-sm">
            <span className="font-bold text-gold-800 dark:text-gold-300">Launch pricing · Q2</span>
            <span className="muted"> · First 5 Editor's Pick slots at 50% off (฿7,500/mo for 3 months)</span>
          </div>
          <a href="#pilot" className="rounded-full bg-gold-600 px-4 py-1.5 text-xs font-bold text-white whitespace-nowrap hover:bg-gold-700">
            Claim a slot →
          </a>
        </div>

        {/* Hero */}
        <header className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy-900 to-navy-950 px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <div className="absolute inset-0 opacity-30 bg-grid" aria-hidden />
          <div className="blob -top-32 -right-32 h-96 w-96 bg-gold-500/30" aria-hidden />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-gold-300">
              For clinic owners
            </span>
            <h1 className="mx-auto mt-5 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tighter-display sm:text-5xl lg:text-6xl">
              Thailand's most credible<br className="hidden sm:block" /> hair-transplant directory.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-navy-100 sm:text-lg">
              Six independent sources verify every clinic. Patients trust the data because we don't accept money to bury bad reviews. You get inbound consults from people who already chose you on merit.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a href="#plans" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-navy-900 shadow-xl shadow-black/20">
                See pricing →
              </a>
              <a href="#pilot" className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10">
                Request free report
              </a>
            </div>
          </div>
        </header>

        {/* Stats */}
        <section className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Clinics indexed", value: total.toLocaleString() },
            { label: "Avg Trust Score", value: `${avg_trust}/100` },
            { label: "Review signals", value: reviewSum.toLocaleString() },
            { label: "Photos + videos", value: (photoSum + videoSum).toLocaleString() },
          ].map((s) => (
            <div key={s.label} className="card p-5 text-center">
              <div className="font-display text-3xl font-bold tabular-nums sm:text-4xl">{s.value}</div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] muted">{s.label}</div>
            </div>
          ))}
        </section>

        {/* Plans */}
        <section id="plans" className="mt-16">
          <div className="text-center mb-8">
            <div className="eyebrow justify-center">Plans</div>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tighter-display sm:text-4xl">Pick how you want to grow</h2>
            <p className="mt-2 text-sm muted">Pay-per-lead, monthly Featured, or full intelligence — combine as you scale.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {PLANS.map((p) => (
              <div key={p.name}
                className={`relative card card-hover overflow-hidden p-7 ${p.highlight ? "ring-2 ring-gold-400 shadow-gold-glow" : ""}`}>
                {p.highlight && (
                  <span className="gold-ribbon absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow">
                    Most popular
                  </span>
                )}
                <div className="text-[11px] font-bold uppercase tracking-[0.15em] muted">{p.name}</div>
                <div className="mt-1 text-sm muted">{p.sub}</div>
                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="font-display text-4xl font-bold tabular-nums">{p.price}</span>
                  <span className="text-xs muted">{p.unit}</span>
                </div>
                <p className="mt-4 text-sm font-bold">{p.headline}</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {p.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-mint-100 text-mint-700">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                      </span>
                      <span className="muted">{b}</span>
                    </li>
                  ))}
                </ul>
                <a href="#pilot" className={`mt-7 block text-center ${p.highlight ? "btn-gold" : "btn-primary"}`}>
                  {p.cta}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mt-20">
          <div className="text-center mb-8">
            <div className="eyebrow justify-center">Process</div>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tighter-display sm:text-4xl">How partnership works</h2>
          </div>
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: 1, t: "Get your free report", d: "Email us with your clinic name. Within 24h you receive a private dashboard link with Trust Score breakdown, city rank, competitor leaderboard." },
              { n: 2, t: "Pick a plan", d: "CPL only, Featured slot, or Intelligence subscription. Or combine — many partners start CPL then add Featured." },
              { n: 3, t: "We add you", d: "CPL: we configure lead routing to your LINE/email. Featured: your ID goes into sponsored slot, badge appears in ~2 min." },
              { n: 4, t: "Track + iterate", d: "Live owner dashboard shows leads, status, profile views. AI drafts reply templates for any negative reviews you want to respond to." },
            ].map((s) => (
              <li key={s.n} className="card card-hover p-6">
                <span className="font-display text-5xl font-bold leading-none text-gold-400/40">0{s.n}</span>
                <div className="mt-3 font-display text-lg font-bold">{s.t}</div>
                <p className="mt-2 text-sm muted leading-relaxed">{s.d}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* FAQ */}
        <section id="faq" className="mt-20">
          <div className="text-center mb-8">
            <div className="eyebrow justify-center">Questions</div>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tighter-display sm:text-4xl">FAQ</h2>
          </div>
          <dl className="mx-auto grid max-w-3xl gap-3">
            {FAQS.map((f) => (
              <details key={f.q} className="card p-5 group [&[open]]:bg-[rgb(var(--bg-elev))]">
                <summary className="cursor-pointer font-semibold list-none flex items-start justify-between gap-3">
                  <span className="font-display text-base">{f.q}</span>
                  <span className="text-gold-600 group-open:rotate-45 transition-transform text-2xl leading-none">+</span>
                </summary>
                <p className="mt-4 text-sm muted leading-relaxed">{f.a}</p>
              </details>
            ))}
          </dl>
        </section>

        {/* Final CTA — inquiry form */}
        <section id="pilot" className="mt-20 scroll-mt-20">
          <div className="mb-6 text-center">
            <div className="eyebrow justify-center">Ready?</div>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tighter-display sm:text-4xl">Get your free report + start partnership</h2>
            <p className="mt-3 text-sm muted">
              Fill the form. We'll send your private intelligence report + onboarding details within 24 hours.
            </p>
            <p className="mt-1 text-[11px] muted">
              Prefer email? Write to <a href={`mailto:${partnerEmail}`} className="font-bold text-gold-700 underline">{partnerEmail}</a>
            </p>
          </div>
          <PartnerInquiryForm />
        </section>

        <footer className="mt-12 text-center text-xs muted">
          {SITE.name} · Free public directory · Optional paid partnership for clinics
        </footer>
      </div>
    </>
  );
}
