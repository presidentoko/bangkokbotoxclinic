import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AREA_DEFS, THEME_DEFS, buildDayPlan } from "@/lib/day-plans";
import type { AreaSlug, ThemeSlug } from "@/lib/day-plans";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { ShareButton } from "@/components/ShareButton";
import { BangkokTip } from "@/components/BangkokTip";
import { OpenNow } from "@/components/OpenNow";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return (Object.keys(AREA_DEFS) as AreaSlug[]).map((area) => ({ area }));
}

type Props = { params: Promise<{ area: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { area } = await params;
  if (!(area in AREA_DEFS)) return {};
  const a = AREA_DEFS[area as AreaSlug];
  return {
    title: `Things to do in ${a.label}, Bangkok — Day Plans by Theme`,
    description: `${a.desc}. Browse curated day plans for ${a.label}: foodie, wellness, active, couples, and first-day itineraries. All bookable, all ranked by real reviews.`,
    alternates: { canonical: `/day-plan/hub/${area}` },
  };
}

export default async function AreaHubPage({ params }: Props) {
  const { area } = await params;
  if (!(area in AREA_DEFS)) notFound();
  const areaDef = AREA_DEFS[area as AreaSlug];
  const themes = Object.keys(THEME_DEFS) as ThemeSlug[];
  const otherAreas = (Object.keys(AREA_DEFS) as AreaSlug[]).filter((a) => a !== area);
  // allDayPlanParams() lists every area×theme combo unconditionally — the
  // sitemap already filters to buildDayPlan().valid (fewer than 3 stops
  // resolve = a 404), so the hub linked here needs the same check or it
  // links a page that immediately notFound()s the moment an area's venue
  // pool thins out.
  const validThemes = new Set(
    (
      await Promise.all(
        themes.map(async (theme) => ({ theme, valid: (await buildDayPlan(area as AreaSlug, theme)).valid }))
      )
    )
      .filter((t) => t.valid)
      .map((t) => t.theme)
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Day Plan", url: "/day-plan" },
        { name: areaDef.label, url: `/day-plan/hub/${area}` },
      ]} />

      <div className="mb-2 text-sm text-[var(--muted)]">
        <a href="/day-plan" className="hover:text-black transition">Day Plan</a> › {areaDef.label}
      </div>

      <div className="flex items-start justify-between gap-3 mb-2">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight">
          Things to do in {areaDef.label}, Bangkok
        </h1>
        <ShareButton title={`Things to Do in ${areaDef.label} Bangkok 2026`} text={areaDef.desc} url={`${SITE}/day-plan/hub/${area}`} line whatsapp />
      </div>

      {/* Answer-first summary for AEO */}
      <p className="text-[var(--muted)] leading-relaxed mb-6">
        {areaDef.desc}. Below are {themes.length} curated day plans for {areaDef.label} — each a real, bookable itinerary assembled from venues ranked by Trust Score (computed from public Google Maps data, never paid).
      </p>

      {/* FAQ structured data for AEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: `What is the best area to spend a day in ${areaDef.label}?`,
              acceptedAnswer: { "@type": "Answer", text: `${areaDef.label} is known for ${areaDef.desc.toLowerCase()}. It works well for both first-time visitors and repeat travellers looking to go deeper into Bangkok.` },
            },
            {
              "@type": "Question",
              name: `How many hours do you need for a day in ${areaDef.label}?`,
              acceptedAnswer: { "@type": "Answer", text: `A full day plan in ${areaDef.label} covers 4 stops from roughly 8am–8pm. A half-day (3–4 hours) can cover lunch + one activity + spa.` },
            },
            {
              "@type": "Question",
              name: `What is the best food in ${areaDef.label}?`,
              acceptedAnswer: { "@type": "Answer", text: `The restaurants in ${areaDef.label} on Thaigle are ranked by Trust Score — a metric built from review volume, local guide ratio, and rating quality. Check the Foodie Day plan for the two highest-ranked options.` },
            },
          ],
        })}}
      />

      {/* Theme cards */}
      <div className="grid grid-cols-1 gap-4 mb-10">
        {themes.map((theme) => {
          const td = THEME_DEFS[theme];
          if (!validThemes.has(theme)) return null;
          return (
            <a
              key={theme}
              href={`/day-plan/${area}/${theme}`}
              className="flex items-center gap-4 bg-white border border-[var(--border)] rounded-2xl p-4 hover:border-orange-400 transition group"
            >
              <div className="text-3xl shrink-0">{td.icon}</div>
              <div className="min-w-0 flex-1">
                <div className="font-black group-hover:text-orange-600 transition">{td.label}</div>
                <div className="text-sm text-[var(--muted)] line-clamp-1">{td.headline(areaDef.label)}</div>
              </div>
              <span className="text-[var(--muted)] group-hover:translate-x-1 transition shrink-0">→</span>
            </a>
          );
        })}
      </div>

      {/* Other area hubs */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--muted)] mb-4">Other Bangkok areas</h2>
        <div className="grid grid-cols-2 gap-3">
          {otherAreas.map((a) => {
            const ad = AREA_DEFS[a];
            return (
              <a
                key={a}
                href={`/day-plan/hub/${a}`}
                className="block border border-[var(--border)] rounded-xl p-3 hover:border-orange-400 transition group"
              >
                <div className="font-bold text-sm group-hover:text-orange-600 transition">{ad.label}</div>
                <div className="text-[10px] text-[var(--muted)] line-clamp-2">{ad.desc}</div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Engagement CTAs */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <a href="/quiz" className="flex items-center gap-2 p-3 rounded-xl bg-orange-50 border border-orange-200 hover:border-orange-300 transition group">
          <span className="text-xl shrink-0">🎯</span>
          <div>
            <div className="font-bold text-xs group-hover:text-orange-700 transition">What Bangkok traveler are you?</div>
            <div className="text-[10px] text-[var(--muted)]">5-question quiz</div>
          </div>
        </a>
        <a href="/bingo" className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200 hover:border-green-300 transition group">
          <span className="text-xl shrink-0">🏆</span>
          <div>
            <div className="font-bold text-xs group-hover:text-green-700 transition">Bangkok Bucket List Bingo</div>
            <div className="text-[10px] text-[var(--muted)]">Track your journey</div>
          </div>
        </a>
      </div>

      <OpenNow />
      <BangkokTip />
    </div>
  );
}
