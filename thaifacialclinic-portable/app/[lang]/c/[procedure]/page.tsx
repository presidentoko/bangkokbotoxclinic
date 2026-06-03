import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadClinics } from "@/lib/data";
import { SITE, SUPPORTED_LANGS } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import Header from "@/components/Header";
import ClinicCard from "@/components/ClinicCard";

export const dynamic = "force-static";

const PROC_MAP: Record<string, { name: string; match: RegExp }> = {
  "fue": { name: "FUE Hair Transplant", match: /FUE/i },
  "dhi": { name: "DHI Hair Transplant", match: /DHI/i },
  "fut": { name: "FUT Hair Transplant", match: /FUT/i },
  "prp": { name: "PRP Hair Treatment", match: /PRP/i },
  "smp": { name: "SMP / Scalp Micropigmentation", match: /SMP|Scalp Micropigmentation/i },
  "stem-cell": { name: "Stem Cell Therapy", match: /Stem Cell/i },
  "eyebrow": { name: "Eyebrow Transplant", match: /Eyebrow/i },
  "beard": { name: "Beard Transplant", match: /Beard/i },
  "scalp-care": { name: "Scalp Care / Scaling", match: /Scalp|head spa/i },
};

export function generateStaticParams() {
  return SUPPORTED_LANGS.flatMap((lang) =>
    Object.keys(PROC_MAP).map((procedure) => ({ lang, procedure }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang; procedure: string }> }): Promise<Metadata> {
  const { lang, procedure } = await params;
  const proc = PROC_MAP[procedure];
  if (!proc) return {};
  const url = `${SITE.origin}/${lang}/c/${procedure}/`;
  return {
    title: `${proc.name} in Thailand — Verified Clinics`,
    description: `Compare verified ${proc.name} clinics in Thailand. Trust scored from real Google + Bookimed + Reddit + Naver reviews.`,
    alternates: { canonical: url },
  };
}

export default async function ProcedurePage({
  params,
}: {
  params: Promise<{ lang: Lang; procedure: string }>;
}) {
  const { lang, procedure } = await params;
  const proc = PROC_MAP[procedure];
  if (!proc) notFound();
  const { clinics } = loadClinics();
  const list = clinics.filter((c) =>
    c.procedures.some((p) => proc.match.test(p)) || proc.match.test(c.category) || proc.match.test(c.name)
  );

  // Sort by trust desc
  const sorted = [...list].sort((a, b) => b.trust_score - a.trust_score);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20">
      <Header lang={lang} />
      <main className="space-y-10">
        <header className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy-900 to-navy-950 px-6 py-10 text-white sm:px-10 sm:py-14">
          <div className="absolute inset-0 opacity-30 bg-grid" aria-hidden />
          <div className="blob -top-20 -right-20 h-72 w-72 bg-gold-500/30" aria-hidden />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-gold-300">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
              {sorted.length} verified clinics
            </div>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tighter-display sm:text-5xl lg:text-6xl">
              {proc.name}<br />
              <span className="text-gold-300">in Thailand</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-navy-100 sm:text-lg">
              Filtered by procedure. Sorted by Trust Score. Data aggregated from Google, Bookimed, Reddit, Naver, YouTube and Pantip.
            </p>
          </div>
        </header>

        {sorted.length === 0 ? (
          <div className="rounded-2xl border border-dashed py-20 text-center" style={{ borderColor: "rgb(var(--border))" }}>
            <p className="text-base font-semibold">No clinics matched</p>
            <p className="mt-1 text-sm muted">Try a different procedure.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {sorted.map((c) => <ClinicCard key={c.id} c={c} lang={lang} />)}
          </div>
        )}
      </main>
    </div>
  );
}
