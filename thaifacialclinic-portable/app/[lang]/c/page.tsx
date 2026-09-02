import type { Metadata } from "next";
import Link from "next/link";
import { loadClinics } from "@/lib/data";
import { SITE, SUPPORTED_LANGS } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import Header from "@/components/Header";

export const dynamic = "force-static";
export const dynamicParams = false;

const PROC_MAP: Record<string, { name: string; match: RegExp; priceHint: string }> = {
  "fue": { name: "FUE Hair Transplant", match: /FUE/i, priceHint: "from ฿65,000" },
  "dhi": { name: "DHI Hair Transplant", match: /DHI/i, priceHint: "from ฿85,000" },
  "fut": { name: "FUT Hair Transplant", match: /FUT/i, priceHint: "from ฿55,000" },
  "prp": { name: "PRP Hair Treatment", match: /PRP/i, priceHint: "฿5,000–15,000" },
  "smp": { name: "SMP / Scalp Micropigmentation", match: /SMP|Scalp Micropigmentation/i, priceHint: "฿15,000–50,000" },
  "stem-cell": { name: "Stem Cell Therapy", match: /Stem Cell/i, priceHint: "from ฿40,000" },
  "eyebrow": { name: "Eyebrow Transplant", match: /Eyebrow/i, priceHint: "฿35,000–80,000" },
  "beard": { name: "Beard Transplant", match: /Beard/i, priceHint: "฿50,000–120,000" },
  "scalp-care": { name: "Scalp Care / Scaling", match: /Scalp|head spa/i, priceHint: "฿3,000–12,000" },
};

export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  const url = `${SITE.origin}/${lang}/c/`;
  const canonicalUrl = lang === "en" ? url : `${SITE.origin}/en/c/`;
  return {
    title: "Browse Hair Transplant Clinics by Procedure — Thailand",
    description: "Browse Thailand hair transplant clinics by procedure: FUE, DHI, FUT, PRP, SMP and more. Verified reviews, Trust Score ranked.",
    alternates: { canonical: canonicalUrl },
    // 2026-09-02: siteName 은 페이지마다 다시 넣어야 한다 — Next 는 openGraph 를
    // 객체 단위로 교체해서, 루트 layout 에 있어도 페이지가 정의하면 사라진다.
    openGraph: { siteName: SITE.name, title: "Browse by Procedure — Thai Facial Clinic", url },
  };
}

export default async function ProcedureHubPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const { clinics } = loadClinics();

  const entries = Object.entries(PROC_MAP).map(([slug, proc]) => ({
    slug,
    ...proc,
    count: clinics.filter((c) =>
      c.procedures.some((p) => proc.match.test(p)) || proc.match.test(c.category) || proc.match.test(c.name)
    ).length,
  })).filter((p) => p.count > 0);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20">
      <Header lang={lang} />
      <main className="space-y-10">
        <header className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy-900 to-navy-950 px-6 py-10 text-white sm:px-10 sm:py-14">
          <div className="absolute inset-0 opacity-30 bg-grid" aria-hidden />
          <div className="relative">
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tighter-display sm:text-5xl">
              Browse by <span className="text-gold-300">procedure</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-navy-100 sm:text-lg">
              {entries.reduce((s, e) => s + e.count, 0)} clinics across {entries.length} procedures, Trust Score ranked.
            </p>
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((e) => (
            <Link key={e.slug} href={`/${lang}/c/${e.slug}/`} className="card card-hover p-5">
              <div className="font-display text-lg font-bold tracking-tighter-display">{e.name}</div>
              <div className="mt-1 text-xs muted">{e.count} clinics · {e.priceHint}</div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
