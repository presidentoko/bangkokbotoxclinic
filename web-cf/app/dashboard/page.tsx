import type { Metadata } from "next";
import { loadMasterDb } from "@/lib/data";
import { SearchBar } from "@/components/SearchBar";
import { getSiteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Find your free clinic intelligence report",
  description:
    "Free reputation analytics for any Bangkok clinic — Trust Score, AI-drafted review replies, competitor rankings. No signup.",
  robots: { index: false, follow: false },
};

export default async function DashboardIndexPage() {
  const db = await loadMasterDb();
  const cfg = getSiteConfig();
  const partnerEmail = `partners@${cfg.domain}`;
  const entities = db.clinics.map((c) => ({
    id: c.id,
    name: c.name,
    district: c.district,
    city_label: c.city_label,
    rating: c.rating,
    trust_score: c.trust_score,
  }));

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "#059669" }}>
        🎁 Free · No signup
      </div>
      <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
        Find your clinic's free intelligence report
      </h1>
      <p className="text-base text-[var(--muted)] leading-relaxed mb-8">
        Built from your public Google data. Every Bangkok clinic in our database has a report with{" "}
        <strong className="text-[var(--fg)]">Trust Score breakdown</strong>,{" "}
        <strong className="text-[var(--fg)]">AI-drafted replies</strong> for unanswered negative reviews,{" "}
        and a <strong className="text-[var(--fg)]">competitor ranking</strong> in your district.
      </p>

      <div className="mb-6">
        <label className="text-sm font-bold mb-2 block">Search by clinic name or district</label>
        <SearchBar
          entities={entities}
          hrefBase="/dashboard"
          placeholder="e.g. Aquila Clinic, Sukhumvit, dental..."
        />
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-8 text-sm">
        <div className="font-bold mb-1">What's inside the report</div>
        <ul className="space-y-1 text-[var(--fg)] opacity-90">
          <li>✓ Trust Score (rating × volume × Local Guide ratio × authority)</li>
          <li>✓ AI-drafted replies for each unanswered negative review — 3 tone variants</li>
          <li>✓ Competitor rankings + each competitor's weakness category</li>
          <li>✓ Topics from your reviews (long_wait, expensive, friendly_staff, ...)</li>
          <li>✓ Rating trajectory + 30-day profile view chart</li>
          <li>✓ Pricing intelligence vs nearby clinics</li>
        </ul>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <a
          href="/dashboard/demo"
          className="block bg-white border-2 border-[var(--accent)] rounded-xl p-5 hover:shadow-md transition"
        >
          <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--accent)" }}>
            See it first
          </div>
          <div className="font-bold mb-1">Live demo dashboard →</div>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            Real data, anonymized as a sample clinic. Same dashboard you'll see for yours.
          </p>
        </a>

        <a
          href="/for-clinics"
          className="block bg-white border border-[var(--border)] rounded-xl p-5 hover:shadow-md transition"
        >
          <div className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-1">
            Want the work done for you?
          </div>
          <div className="font-bold mb-1">Paid services →</div>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            Auto-reply posting, review request campaigns, lead routing, Featured slot, monthly consult.
          </p>
        </a>
      </div>

      <p className="text-xs text-[var(--muted)] mt-8 text-center">
        Can't find your clinic? Email{" "}
        <strong>{partnerEmail}</strong> — we'll generate a report within 24h.
      </p>
    </div>
  );
}
