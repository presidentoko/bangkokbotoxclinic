import { loadMasterDb } from "@/lib/data";
import { PartnerSignupForm } from "@/components/PartnerSignupForm";
import { getSiteConfig, applySiteFilter } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner with us — sign up your clinic",
  description: "Self-serve registration for Bangkok specialist clinics. Get real-time review alerts, AI reply drafts, lead routing to LINE.",
  robots: { index: false, follow: false },
};

export default async function PartnerOnboardingPage() {
  const cfg = getSiteConfig();
  const db = await loadMasterDb();
  const focused = applySiteFilter(db.clinics, cfg);

  // Stats for social proof
  const totalReviews = focused.reduce((s, c) => s + c.total_reviews, 0);
  const clinicCount = focused.length;
  const cities = new Set(focused.map((c) => c.city_label)).size;

  // 자동완성용 — top trust clinic 만 제공
  const clinics = focused
    .filter((c) => c.trust_score >= 60)
    .map((c) => ({
      id: c.id,
      name: c.name,
      district: c.district,
      city: c.city_label,
      trust: c.trust_score,
    }))
    .sort((a, b) => b.trust - a.trust);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Hero */}
      <header className="mb-10 text-center">
        <div className="inline-block text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-4">
          {cfg.brand} · Partner program
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
          Turn your reviews into <span className="text-emerald-600">a lead pipeline</span>.
        </h1>
        <p className="text-base md:text-lg text-[var(--muted)] max-w-2xl mx-auto leading-relaxed">
          Real-time review monitoring + AI-drafted replies + qualified leads routed to your LINE.
          <br className="hidden md:inline" />
          <strong className="text-[var(--fg)]"> No credit card.</strong> 30-day pilot. We bill ฿200 only when a lead closes.
        </p>
      </header>

      {/* Social proof bar */}
      <section className="grid grid-cols-3 gap-3 mb-10 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-5 border border-emerald-100">
        <ProofStat value={clinicCount.toLocaleString()} label="Clinics indexed" />
        <ProofStat value={`${(totalReviews / 1000).toFixed(0)}K`} label="Reviews analyzed" />
        <ProofStat value={cities.toString()} label="Thai cities" />
      </section>

      {/* Value pillars */}
      <section className="grid sm:grid-cols-3 gap-3 mb-10">
        <Pillar
          emoji="🚨"
          title="Crisis-rated alerts"
          body="New 1-2★ review? Your LINE pings in <15 min — with a tone-matched reply draft ready to send."
        />
        <Pillar
          emoji="📥"
          title="Qualified leads, your inbox"
          body="Form submissions on your /clinic page route directly to your email + LINE. Lead status CRM included."
        />
        <Pillar
          emoji="📊"
          title="Competitor intelligence"
          body="Side-by-side trust scores, mention counts per service, pricing benchmarks across your district."
        />
      </section>

      {/* Pricing */}
      <section className="mb-10 bg-white border border-[var(--border)] rounded-2xl p-6">
        <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-4">Pricing</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="text-xs text-[var(--muted)] mb-1">Pay per lead</div>
            <div className="text-3xl font-black mb-2">฿200<span className="text-sm font-normal text-[var(--muted)]"> / lead</span></div>
            <ul className="text-xs space-y-1 text-[var(--muted)]">
              <li>✓ No monthly fee</li>
              <li>✓ 24h exclusivity hold</li>
              <li>✓ No-show refund</li>
              <li>✓ Best for clinics just starting</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs text-emerald-700 font-bold">Unlimited monthly</div>
              <span className="text-[10px] uppercase tracking-widest bg-emerald-600 text-white px-2 py-0.5 rounded-full font-black">Popular</span>
            </div>
            <div className="text-3xl font-black mb-2">฿8,000<span className="text-sm font-normal text-[var(--muted)]"> / month</span></div>
            <ul className="text-xs space-y-1 text-emerald-900">
              <li>✓ Unlimited leads in your category</li>
              <li>✓ Full dashboard + CRM + AI replies</li>
              <li>✓ Profile view analytics</li>
              <li>✓ Average ROI: 5-10× monthly fee</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="signup" className="mb-10">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Start your 30-day pilot</h2>
        <PartnerSignupForm clinics={clinics} />
      </section>

      {/* FAQ */}
      <section className="mb-10">
        <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-4">FAQ</h2>
        <div className="space-y-3">
          <Faq q="How is the lead price determined?" a="฿200/lead is below the ฿2,800 average Bangkok aesthetic Facebook CAC. We can charge less because the lead is pre-qualified — they're already on your clinic page comparing options." />
          <Faq q="What if a lead doesn't show up?" a="No-show refund within 7 days, no questions asked. We hold each lead exclusively for 24h so two clinics can't both bill for the same person." />
          <Faq q="Can I switch plans?" a="Anytime. Pay-per-lead → monthly when volume grows past ~40 leads/month. Monthly → pay-per-lead during slow seasons." />
          <Faq q="Do I have to be exclusive?" a="No. You can list with us and other directories. We just need accurate clinic info and a responsive LINE to route leads to." />
          <Faq q="How is data privacy handled?" a="We never sell your patient data. Lead contact info is shared only with you. Reviews we display are public Google reviews — we don't store anything proprietary to your clinic." />
        </div>
      </section>

      <footer className="text-center text-xs text-[var(--muted)] border-t border-[var(--border)] pt-6">
        <p>Questions? <a href={`mailto:partners@${cfg.domain}`} className="underline">partners@{cfg.domain}</a> · LINE <strong>@{cfg.brand.toLowerCase().replace(/\s/g, "")}</strong></p>
        <p className="mt-2 text-[var(--muted)]">
          We never charge upfront. We never lock you in. We never sell your data.
        </p>
      </footer>
    </div>
  );
}

function ProofStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl md:text-3xl font-black tabular-nums">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mt-1">{label}</div>
    </div>
  );
}

function Pillar({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-5 hover:shadow-md transition">
      <div className="text-3xl mb-2">{emoji}</div>
      <div className="font-bold text-base mb-1">{title}</div>
      <p className="text-sm text-[var(--muted)] leading-relaxed">{body}</p>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="bg-white border border-[var(--border)] rounded-xl group">
      <summary className="cursor-pointer p-4 font-semibold text-sm flex items-center justify-between gap-3 select-none">
        <span>{q}</span>
        <span className="text-[var(--muted)] group-open:rotate-180 transition-transform">⌄</span>
      </summary>
      <div className="px-4 pb-4 text-sm text-[var(--muted)] leading-relaxed">{a}</div>
    </details>
  );
}
