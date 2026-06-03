import type { Metadata } from "next";
import Link from "next/link";
import { loadClinics } from "@/lib/data";
import { SITE } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Find your free clinic intelligence report",
  description: "Free reputation analytics for any Thai hair-transplant clinic.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-static";

export default function DashboardIndexPage() {
  const { clinics } = loadClinics();
  const sample = clinics
    .filter((c) => c.is_hair_relevant && c.city && c.city !== "nan")
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, 12);
  const partnerEmail = `partners@${new URL(SITE.origin).hostname}`;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="text-xs font-black uppercase tracking-widest text-clinic mb-2">
        🎁 Free · No signup
      </div>
      <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
        Find your clinic's free intelligence report
      </h1>
      <p className="text-base muted leading-relaxed mb-6">
        Built from your public Google + Bookimed + Reddit + Naver + YouTube data.
        Every hair-transplant clinic in our database has a free report with{" "}
        <strong>Trust Score breakdown</strong>, <strong>competitor ranking</strong>, and{" "}
        <strong>strengths / opportunities</strong>.
      </p>

      <div className="mb-8">
        <div className="text-sm font-bold mb-2">Top 12 by Trust Score</div>
        <ul className="grid gap-2">
          {sample.map((c) => (
            <li key={c.id}>
              <Link
                href={`/dashboard/${c.id}/`}
                className="flex items-center justify-between rounded-lg border border-ink-100 dark:border-ink-800 px-3 py-2.5 hover:border-clinic/50"
              >
                <div className="min-w-0">
                  <div className="font-semibold truncate">{c.name}</div>
                  <div className="text-xs muted">{c.city}</div>
                </div>
                <span className="text-sm font-bold tabular-nums text-clinic">{c.trust_score}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-4 mb-8 text-sm">
        <div className="font-bold mb-1">Don't see your clinic?</div>
        <p>
          Email <a href={`mailto:${partnerEmail}`} className="font-bold underline">{partnerEmail}</a> with your clinic name and we'll send your private dashboard link.
        </p>
      </div>

      <Link href="/" className="text-xs muted hover:text-clinic">← Back to public directory</Link>
    </div>
  );
}
