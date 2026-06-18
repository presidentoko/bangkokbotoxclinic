import type { Metadata } from "next";
import Link from "next/link";
import { loadClinics } from "@/lib/data";
import { SITE, SUPPORTED_LANGS } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import FeaturedClinics from "@/components/FeaturedClinics";
import SocialProof from "@/components/SocialProof";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import DirectoryClient from "@/components/DirectoryClient";
import TestimonialMarquee from "@/components/TestimonialMarquee";
import PressStrip from "@/components/PressStrip";
import CuratedCollections from "@/components/CuratedCollections";
import PhotoShowcase from "@/components/PhotoShowcase";
import ProcedureExplainer from "@/components/ProcedureExplainer";
import WhyUs from "@/components/WhyUs";
import AfterSubmitFlow from "@/components/AfterSubmitFlow";
import CostCalculator from "@/components/CostCalculator";
import CompareBar from "@/components/CompareBar";
import NewsletterSignup from "@/components/NewsletterSignup";

export const dynamic = "force-static";
export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  const url = `${SITE.origin}/${lang}/`;
  return {
    title: lang === "en"
      ? "Bangkok Hair Transplant Clinics — FUE, DHI & Verified Reviews 2026"
      : `${SITE.name} — Verified Thai Hair Clinics`,
    description: lang === "en"
      ? "Compare Bangkok hair transplant clinics by Trust Score from 134 verified clinics. FUE, DHI, SMP specialists ranked by real Google review analysis. Free consultation."
      : SITE.tagline[lang],
    alternates: {
      canonical: url,
      languages: Object.fromEntries(SUPPORTED_LANGS.map((l) => [l, `${SITE.origin}/${l}/`])),
    },
    openGraph: {
      title: lang === "en"
        ? "Bangkok Hair Transplant Clinics — FUE, DHI & Verified Reviews 2026"
        : `${SITE.name} — Verified Thai Hair Clinics`,
      description: lang === "en"
        ? "Compare Bangkok hair transplant clinics by Trust Score from 134 verified clinics. FUE, DHI, SMP specialists ranked by real Google review analysis."
        : SITE.tagline[lang],
      url,
      images: [{ url: `${SITE.origin}/og-default.png`, width: 1200, height: 630 }],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const { clinics, total, avg_trust, generated_at } = loadClinics();
  // Top hero photos — top-trust clinics with photos
  const heroPhotos = [...clinics]
    .filter((c) => c.top_photo_url && c.is_hair_relevant)
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, 6);

  const noFouc = `(function(){try{var s=localStorage.getItem('theme');var d=s==='dark'||(!s&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: noFouc }} />
      <div className="mx-auto max-w-6xl px-4 pb-20">
        <Header lang={lang} />
        <main className="space-y-20 pt-4">
          <Hero lang={lang} total={total} avgTrust={avg_trust} photoClinics={heroPhotos} />
          <PressStrip />
          <WhyUs lang={lang} />
          <HowItWorks lang={lang} />
          <FeaturedClinics clinics={clinics} lang={lang} />
          <CostCalculator lang={lang} />
          <PhotoShowcase clinics={clinics} lang={lang} />
          <ProcedureExplainer lang={lang} />
          <CuratedCollections clinics={clinics} lang={lang} />

          <TestimonialMarquee clinics={clinics} lang={lang} />
          <LeadCaptureForm lang={lang} />
          <AfterSubmitFlow lang={lang} />
          <SocialProof clinics={clinics} lang={lang} />
          <section id="directory" className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="eyebrow">Explore all</div>
                <h2 className="mt-1 font-display text-3xl font-bold tracking-tighter-display sm:text-4xl">
                  Browse every clinic by city
                </h2>
                <p className="mt-2 text-sm muted">Filter by city or procedure. Partners surface first. Suspected viral clinics auto-hidden.</p>
              </div>
              <span className="text-xs muted tabular-nums whitespace-nowrap">
                Updated {new Date(generated_at).toISOString().slice(0, 10)}
              </span>
            </div>
            <DirectoryClient clinics={clinics} lang={lang} />
          </section>
          <NewsletterSignup lang={lang} />
        </main>
        <CompareBar clinics={clinics} lang={lang} />
        <footer className="mt-20 border-t pt-8 text-xs muted" style={{ borderColor: "rgb(var(--border))" }}>
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-navy-900 text-gold-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1l3.09 6.26L22 8.27l-5 4.87 1.18 6.88L12 16.77l-6.18 3.25L7 13.14 2 8.27l6.91-1.01L12 1z"/></svg>
              </span>
              <div>
                <div className="font-display text-sm font-bold text-[rgb(var(--fg))]">Hair <span className="text-gold-600 dark:text-gold-400">by</span> Thai Facial Clinic</div>
                <div className="text-[10px] mt-0.5">Part of the <strong>Thai Facial Clinic group</strong> · Also operates botox · filler · HIFU directories</div>
              </div>
            </div>
            <div className="font-semibold sm:text-right">
              © {new Date().getFullYear()} · Independent · No clinic-paid placements without disclosure
              <div className="mt-1 flex justify-end gap-3 text-[10px]">
                <Link href="/privacy/" className="hover:text-[rgb(var(--fg))]">Privacy</Link>
                <Link href="/terms/" className="hover:text-[rgb(var(--fg))]">Terms</Link>
                <Link href="/for-clinics/" className="hover:text-[rgb(var(--fg))]">For Clinics</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
