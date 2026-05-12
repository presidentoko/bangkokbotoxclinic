import { loadMasterDb } from "@/lib/data";
import { PartnerSignupForm } from "@/components/PartnerSignupForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner with bangkokbotoxclinic.com — sign up your clinic",
  description: "Self-serve registration for Bangkok specialist clinics. Get real-time review alerts, AI reply drafts, lead routing to LINE.",
  robots: { index: false, follow: false },
};

export default async function PartnerOnboardingPage() {
  const db = await loadMasterDb();
  // 자동완성용 — top trust clinic 만 제공 (전체 2,928개는 무거움)
  const clinics = db.clinics
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
    <div className="max-w-3xl mx-auto px-4 py-10">
      <header className="mb-8 text-center">
        <div className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">
          Specialist clinic onboarding
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Start your 30-day pilot
        </h1>
        <p className="text-[var(--muted)] max-w-xl mx-auto leading-relaxed">
          Risk-free. No credit card. Real-time review monitoring + AI-drafted replies
          + lead routing to your LINE. We bill only when leads close at ฿200/lead.
        </p>
      </header>

      <section className="grid sm:grid-cols-3 gap-3 mb-8">
        <Bullet emoji="🚨" title="Crisis alerts" sub="New ≤2★ review → LINE in 15min with AI reply ready" />
        <Bullet emoji="📥" title="Lead routing" sub="Form submissions on your /clinic page → your LINE + email" />
        <Bullet emoji="📊" title="Live dashboard" sub="Competitor analysis, ROI math, pricing intelligence" />
      </section>

      <PartnerSignupForm clinics={clinics} />

      <footer className="mt-10 text-center text-xs text-[var(--muted)]">
        Questions? <a href="mailto:partners@bangkokbotoxclinic.com" className="underline">partners@bangkokbotoxclinic.com</a> · LINE <strong>@bangkokbotoxclinic</strong>
      </footer>
    </div>
  );
}

function Bullet({ emoji, title, sub }: { emoji: string; title: string; sub: string }) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-4">
      <div className="text-2xl mb-1">{emoji}</div>
      <div className="font-bold text-sm">{title}</div>
      <div className="text-xs text-[var(--muted)] leading-relaxed mt-1">{sub}</div>
    </div>
  );
}
