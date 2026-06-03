import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadClinics, getClinicBySlug } from "@/lib/data";
import { SITE, SUPPORTED_LANGS, t } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import AeoSchema from "@/components/AeoSchema";
import TrustScoreRing from "@/components/TrustScoreRing";
import SourceBadges from "@/components/SourceBadges";
import Header from "@/components/Header";
import Sparkline from "@/components/Sparkline";
import MiniDonut from "@/components/MiniDonut";
import ClinicBookingForm from "@/components/ClinicBookingForm";
import AfterSubmitFlow from "@/components/AfterSubmitFlow";
import PhotoLightbox from "@/components/PhotoLightbox";
import { showAffiliateLink, isPaidPartner } from "@/lib/partnerCheck";
import UrgencyBar from "@/components/UrgencyBar";
import WishlistButton from "@/components/WishlistButton";
import PaymentPlansBadge from "@/components/PaymentPlansBadge";
import VirtualConsultBadge from "@/components/VirtualConsultBadge";
import FreshScoreBadge from "@/components/FreshScoreBadge";
import TrustScoreExplainer from "@/components/TrustScoreExplainer";
import LiveAvailabilityCalendar from "@/components/LiveAvailabilityCalendar";
import AppointmentTimeline from "@/components/AppointmentTimeline";
import PriceTrendChart from "@/components/PriceTrendChart";
import CountrySavings from "@/components/CountrySavings";
import TravelPackageWidget from "@/components/TravelPackageWidget";
import FullCostBreakdown from "@/components/FullCostBreakdown";
import IntlPatientServices from "@/components/IntlPatientServices";
import InfluencerVisits from "@/components/InfluencerVisits";
import PatientStoriesCarousel from "@/components/PatientStoriesCarousel";
import TestimonialSubmitForm from "@/components/TestimonialSubmitForm";
import PriceMatchPromise from "@/components/PriceMatchPromise";
import QnaCommunity from "@/components/QnaCommunity";
import PreOpChecklist from "@/components/PreOpChecklist";
import PostOpRecovery from "@/components/PostOpRecovery";
import VisaInfoBar from "@/components/VisaInfoBar";
import ShareToFriend from "@/components/ShareToFriend";
import GroupDiscount from "@/components/GroupDiscount";
import PriceLockGuarantee from "@/components/PriceLockGuarantee";
import MultiCityCompare from "@/components/MultiCityCompare";
import WaitingRoomTour from "@/components/WaitingRoomTour";
import InsuranceCoverageCheck from "@/components/InsuranceCoverageCheck";
import AlternativeProcedures from "@/components/AlternativeProcedures";
import AwardsShowcase from "@/components/AwardsShowcase";
import AgeGroupResults from "@/components/AgeGroupResults";
import SeasonalBestTime from "@/components/SeasonalBestTime";
import AvailabilityHeatmap from "@/components/AvailabilityHeatmap";
import InstantQuoteButton from "@/components/InstantQuoteButton";
import EmergencyContactsBar from "@/components/EmergencyContactsBar";
import CertificationsBar from "@/components/CertificationsBar";
import GuaranteeBadge from "@/components/GuaranteeBadge";
import ClinicPhoneWidget from "@/components/ClinicPhoneWidget";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import CollapsibleSection from "@/components/CollapsibleSection";
import WikiSummaryCard from "@/components/WikiSummaryCard";
import { loadWikiSummary } from "@/lib/wiki";

export const dynamic = "force-static";

export function generateStaticParams() {
  const { clinics } = loadClinics();
  return SUPPORTED_LANGS.flatMap((lang) => clinics.map((c) => ({ lang, slug: c.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const c = getClinicBySlug(slug);
  if (!c) return {};
  const url = `${SITE.origin}/${lang}/clinic/${c.slug}/`;
  const title = `${c.name} — Trust Score ${c.trust_score}/100`;
  const description = c.top_review_text?.slice(0, 156) ||
    `${c.name} in ${c.city}. ${c.reviews_scraped_count} reviews · ${c.photos_count} photos · ${c.videos_count} YouTube clips.`;
  const og = c.top_photo_url || `${SITE.origin}/og-default.png`;
  return {
    title, description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(SUPPORTED_LANGS.map((l) => [l, `${SITE.origin}/${l}/clinic/${c.slug}/`])),
    },
    openGraph: { title, description, url, type: "article", siteName: SITE.name, images: [{ url: og, width: 1200, height: 630, alt: c.name }] },
    twitter: { card: "summary_large_image", title, description, images: [og] },
    other: { "thaifacial:trust_score": String(c.trust_score), "thaifacial:city": c.city },
    robots: { index: true, follow: true },
  };
}

// Mock 12-month review trend (random walk seeded by trust_score)
function trendFor(c: { trust_score: number; reviews_scraped_count: number }) {
  const base = Math.max(2, Math.round(c.reviews_scraped_count / 6));
  const seed = c.trust_score;
  const out: number[] = [];
  for (let i = 0; i < 12; i++) {
    const v = base + Math.round(Math.sin(i + seed / 17) * 4) + Math.round((i * seed) % 5);
    out.push(Math.max(0, v));
  }
  return out;
}

export default async function ClinicPage({ params }: { params: Promise<{ lang: Lang; slug: string }> }) {
  const { lang, slug } = await params;
  const c = getClinicBySlug(slug);
  if (!c) notFound();
  const bundle = loadClinics();
  const wiki = loadWikiSummary(c.id);

  const trend = trendFor(c);
  const sourcePie = [
    { value: c.source_badges.google_reviews, color: "#3b82f6", label: "Google" },
    { value: c.source_badges.photos, color: "#8b5cf6", label: "Photos" },
    { value: c.source_badges.videos, color: "#ef4444", label: "YouTube" },
    { value: c.source_badges.bookimed * 30, color: "#0ea5e9", label: "Bookimed" },
    { value: c.source_badges.website * 5, color: "#94a3b8", label: "Website" },
  ].filter((s) => s.value > 0);

  const noFouc = `(function(){try{var s=localStorage.getItem('theme');var d=s==='dark'||(!s&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

  const partner = isPaidPartner(c);

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: noFouc }} />
      <div className="mx-auto max-w-5xl px-4 pb-20">
        <Header lang={lang} />

        {/* Sticky booking CTA — appears on scroll for fast conversion */}
        <a href="#booking" className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 sm:bottom-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-5 py-3 text-sm font-bold text-white shadow-premium-lg ring-2 ring-gold-400/30 transition hover:bg-navy-800">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>
            Book consultation
          </span>
        </a>

        <main className="pt-2">
          {/* Premium hero card */}
          <div className="overflow-hidden rounded-[2rem] shadow-premium-lg ring-1" style={{ background: "rgb(var(--bg-elev))", borderColor: "rgb(var(--border))" }}>
            {/* Big photo with overlay */}
            <div className="relative aspect-[21/9] w-full bg-navy-900">
              {c.top_photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.top_photo_url}
                  alt={c.name}
                  className="h-full w-full object-cover"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-navy-800 to-navy-950" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Badges */}
              <div className="absolute left-4 top-4 flex flex-wrap gap-2 sm:left-6 sm:top-6">
                {partner && (
                  <span className="gold-ribbon inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider shadow-lg">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1l3.09 6.26L22 8.27l-5 4.87 1.18 6.88L12 16.77l-6.18 3.25L7 13.14 2 8.27l6.91-1.01L12 1z"/></svg>
                    Verified Partner
                  </span>
                )}
                {c.is_suspected_viral && (
                  <span className="rounded-full bg-red-500/95 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                    ⚠ Viral-flagged
                  </span>
                )}
              </div>

              {/* Trust score ring floating */}
              <div className="absolute right-4 top-4 grid place-items-center rounded-2xl bg-white/95 p-3 shadow-premium backdrop-blur sm:right-6 sm:top-6">
                <TrustScoreRing score={c.trust_score} size={64} stroke={5} />
              </div>

              {/* Name + location overlaid */}
              <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300">
                  {c.category || "Hair Transplant Clinic"}
                </p>
                <h1 className="mt-2 font-display text-3xl font-bold leading-tight tracking-tighter-display sm:text-4xl lg:text-5xl">
                  {c.name}
                </h1>
                <p className="mt-2 text-sm text-white/85 sm:text-base">{c.address || c.city}</p>
              </div>
            </div>

            {/* Below-photo info bar with PRICE highlighted */}
            <div className="border-t" style={{ borderColor: "rgb(var(--border))" }}>
              <div className="grid grid-cols-2 sm:grid-cols-5">
                <div className="bg-gold-50 dark:bg-gold-950/30 p-4 text-center sm:p-5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gold-700 dark:text-gold-300">Starting price</div>
                  <div className="mt-1 font-display text-2xl font-bold tabular-nums sm:text-3xl text-gold-800 dark:text-gold-200">
                    {c.bookimed_price_from && !["", "nan"].includes(String(c.bookimed_price_from)) ? (
                      <>from {c.bookimed_price_from}</>
                    ) : (
                      <span className="text-base font-semibold">Get quote</span>
                    )}
                  </div>
                </div>
                {[
                  { label: "Trust Score", value: `${c.trust_score}/100` },
                  { label: "Google Rating", value: c.rating ? `${c.rating.toFixed(1)}★` : "—" },
                  { label: "Reviews", value: String(c.review_count ?? 0) },
                  { label: "Photos", value: String(c.photos_count) },
                ].map((s) => (
                  <div key={s.label} className="border-l p-4 text-center sm:p-5" style={{ borderColor: "rgb(var(--border))" }}>
                    <div className="text-[10px] font-bold uppercase tracking-wider muted">{s.label}</div>
                    <div className="mt-1 font-display text-2xl font-bold tabular-nums sm:text-3xl">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA row */}
            <div className="flex flex-wrap items-center gap-2 border-t p-5 sm:p-6" style={{ borderColor: "rgb(var(--border))" }}>
              <a href="#booking" className="btn-primary flex-1 min-w-0 sm:flex-none">
                Request consultation
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </a>
              {c.website_line_id && (
                <a href={`https://line.me/R/ti/p/@${c.website_line_id}`} target="_blank" rel="nofollow noopener"
                  className="inline-flex items-center gap-2 rounded-xl bg-mint-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-mint-700">
                  Contact via LINE
                </a>
              )}
              {c.bookimed_url && showAffiliateLink(c) && (
                <a href={c.bookimed_url} target="_blank" rel="nofollow sponsored noopener" className="btn-ghost">
                  Bookimed Quote ↗
                </a>
              )}
              {c.website && (
                <a href={c.website} target="_blank" rel="nofollow noopener" className="btn-ghost">
                  Official Site ↗
                </a>
              )}
              <div className="ml-auto"><SourceBadges c={c} compact /></div>
            </div>
          </div>

          {/* Analytics row */}
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="card p-5">
              <div className="eyebrow">Review trend</div>
              <div className="mt-3 flex items-end justify-between">
                <Sparkline data={trend} width={180} height={56} stroke="#199955" />
                <div className="text-right">
                  <div className="font-display text-3xl font-bold tabular-nums text-mint-700">
                    {trend[trend.length - 1] - trend[0] > 0 ? "+" : ""}{trend[trend.length - 1] - trend[0]}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider muted">12-month</div>
                </div>
              </div>
            </div>
            <div className="card p-5">
              <div className="eyebrow">Source mix</div>
              <div className="mt-3 flex items-center justify-center">
                <MiniDonut segments={sourcePie} size={100} stroke={14} centerLabel={String(c.reviews_scraped_count || c.review_count || 0)} centerSub="signals" />
              </div>
            </div>
            <div className="card p-5">
              <div className="eyebrow">Languages</div>
              <div className="mt-3 grid grid-cols-4 gap-1.5">
                {(["en","ko","zh","ar"] as const).map((l) => (
                  <div key={l} className={`rounded-lg py-2.5 text-center text-[10px] font-bold uppercase tracking-wider ${c.languages[l] ? "bg-mint-100 text-mint-800 ring-1 ring-mint-200 dark:bg-mint-900/40 dark:text-mint-200" : "bg-[rgb(var(--bg))] muted"}`}>
                    <div className="text-sm">{l.toUpperCase()}</div>
                    <div className="text-[8px] mt-0.5 opacity-70">{c.languages[l] ? "Yes" : "—"}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Photo gallery — larger, masonry-style */}
          {c.photos_sample.length > 0 && (
            <section className="mt-12">
              <div className="mb-4 flex items-baseline justify-between">
                <div>
                  <div className="eyebrow">Photos</div>
                  <h2 className="mt-1 font-display text-2xl font-bold tracking-tighter-display">Inside the clinic</h2>
                </div>
                <span className="text-xs muted tabular-nums">{c.photos_count} total</span>
              </div>
              <PhotoLightbox photos={c.photos_sample} clinicName={c.name} />
            </section>
          )}

          {/* Procedures */}
          {c.procedures.length > 0 && (
            <section className="mt-12">
              <div className="eyebrow">Treatments</div>
              <h2 className="mt-1 font-display text-2xl font-bold tracking-tighter-display">Procedures offered</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {c.procedures.map((p) => (
                  <li key={p} className="rounded-xl border bg-[rgb(var(--bg-elev))] px-4 py-2.5 text-sm font-bold transition hover:border-navy-700 hover:bg-navy-700 hover:text-white dark:hover:bg-gold-400 dark:hover:text-navy-950"
                    style={{ borderColor: "rgb(var(--border))" }}>
                    {p}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Reviews */}
          {c.reviews_sample.length > 0 && (
            <section className="mt-12">
              <div className="mb-4 flex items-baseline justify-between">
                <div>
                  <div className="eyebrow">Patient voices</div>
                  <h2 className="mt-1 font-display text-2xl font-bold tracking-tighter-display">What real patients say</h2>
                </div>
                <span className="text-xs muted">From {c.reviews_scraped_count} aggregated</span>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2">
                {c.reviews_sample.slice(0, 6).map((r, i) => (
                  <li key={i} className="card p-5">
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-[rgb(var(--bg))] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">{r.source}</span>
                      {r.rating !== null && (
                        <span className="text-xs font-bold tabular-nums text-gold-600">{"★".repeat(Math.round(r.rating))}</span>
                      )}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed">"{r.text}"</p>
                    <div className="mt-3 flex items-center justify-between border-t pt-3 text-[11px] muted" style={{ borderColor: "rgb(var(--border))" }}>
                      <span className="font-semibold">{r.reviewer || "Anonymous"}</span>
                      {r.date && <span>{r.date}</span>}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Video */}
          {c.top_video_id && (
            <section className="mt-12">
              <div className="eyebrow">Video</div>
              <h2 className="mt-1 font-display text-2xl font-bold tracking-tighter-display">{c.top_video_title || "On YouTube"}</h2>
              <div className="mt-4 aspect-video overflow-hidden rounded-2xl bg-black shadow-premium">
                <iframe
                  src={`https://www.youtube.com/embed/${c.top_video_id}`}
                  title={c.top_video_title || c.name}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </section>
          )}

          {/* Wiki summary — bilingual LLM-generated. Hidden if not yet generated */}
          {wiki && (
            <div className="mt-6">
              <WikiSummaryCard summary={wiki} lang={lang} />
            </div>
          )}

          {/* Urgency + WishlistButton */}
          <div className="mt-8">
            <UrgencyBar clinicId={c.id} trustScore={c.trust_score} totalReviews={c.review_count ?? 0} />
          </div>

          {/* Trust badges row */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <VirtualConsultBadge clinicName={c.name} />
            <FreshScoreBadge generatedAt={bundle.generated_at} />
            <PaymentPlansBadge totalTHB={Number((c.bookimed_price_from || "").replace(/[^\d]/g, "")) || undefined} />
            <TrustScoreExplainer clinic={c} />
            <WishlistButton clinicId={c.id} variant="full" />
          </div>

          {/* Clinic phone + 24/7 contact */}
          <div className="mt-10">
            <ClinicPhoneWidget clinic={c} />
          </div>

          {/* Live availability */}
          <div className="mt-10">
            <LiveAvailabilityCalendar clinicId={c.id} />
          </div>

          {/* Collapsible sections — mobile-friendly. Default-open: pricing + timeline */}
          <div className="mt-10 space-y-3">
            <CollapsibleSection title="Your procedure, day by day" emoji="⏰" defaultOpen>
              <AppointmentTimeline focus="hair" />
              <PreOpChecklist focus="hair" />
              <PostOpRecovery focus="hair" />
            </CollapsibleSection>

            <CollapsibleSection title="Pricing & cost transparency" emoji="💰" defaultOpen>
              <PriceTrendChart focus="hair" />
              <CountrySavings focus="hair" />
              <MultiCityCompare focus="hair" />
              <TravelPackageWidget />
              <FullCostBreakdown procedureTHB={Number((c.bookimed_price_from || "").replace(/[^\d]/g, "")) || 150_000} />
              <PriceMatchPromise />
              <PriceLockGuarantee />
            </CollapsibleSection>

            <CollapsibleSection title="Trust, safety & certifications" emoji="🛡️">
              <GuaranteeBadge focus="hair" />
              <AwardsShowcase />
              <CertificationsBar />
              <IntlPatientServices />
              <EmergencyContactsBar />
              <VisaInfoBar />
            </CollapsibleSection>

            <CollapsibleSection title="Personalized planning" emoji="🎯">
              <AgeGroupResults focus="hair" />
              <SeasonalBestTime focus="hair" />
              <AvailabilityHeatmap clinicId={c.id} />
              <InsuranceCoverageCheck />
            </CollapsibleSection>

            <CollapsibleSection title="Community & social proof" emoji="💬">
              <PatientStoriesCarousel focus="hair" />
              <TestimonialSubmitForm clinicName={c.name} />
              <InfluencerVisits focus="hair" />
              <WaitingRoomTour />
              <QnaCommunity focus="hair" />
              <AlternativeProcedures focus="hair" />
            </CollapsibleSection>

            <CollapsibleSection title="Quick actions & sharing" emoji="⚡" defaultOpen>
              <div className="flex justify-center">
                <InstantQuoteButton clinicId={c.id} clinicName={c.name} />
              </div>
              <GroupDiscount />
              <ShareToFriend clinicName={c.name} url={`${SITE.origin}/${lang}/clinic/${c.slug}/`} />
            </CollapsibleSection>
          </div>

          {/* Booking form — primary conversion point */}
          <section id="booking" className="mt-16 scroll-mt-20">
            <div className="mb-5 text-center">
              {partner ? (
                <span className="gold-ribbon inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider shadow">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1l3.09 6.26L22 8.27l-5 4.87 1.18 6.88L12 16.77l-6.18 3.25L7 13.14 2 8.27l6.91-1.01L12 1z"/></svg>
                  Direct booking with Verified Partner
                </span>
              ) : (
                <div className="eyebrow justify-center">Get started</div>
              )}
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tighter-display sm:text-4xl">
                Book a consultation with {c.name.split(" ").slice(0, 3).join(" ")}
              </h2>
              <p className="mt-2 text-sm muted">Free. No commitment. 24-hour response from the clinic.</p>
            </div>
            <ClinicBookingForm
              lang={lang}
              clinicId={c.id}
              clinicName={c.name}
              procedures={c.procedures}
            />
            <div className="mt-8">
              <AfterSubmitFlow lang={lang} />
            </div>
          </section>

          {/* AEO Schema + FAQ HTML block */}
          <AeoSchema c={c} lang={lang} />
        </main>
      </div>

      {/* Mobile-only sticky CTA */}
      <StickyMobileCTA
        clinicName={c.name}
        priceFrom={Number((c.bookimed_price_from || "").replace(/[^\d]/g, "")) || undefined}
        rating={c.rating ?? undefined}
      />
    </>
  );
}
