import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AREA_DEFS, THEME_DEFS } from "@/lib/day-plans";
import type { AreaSlug, ThemeSlug } from "@/lib/day-plans";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { ShareButton } from "@/components/ShareButton";
import { BangkokTip } from "@/components/BangkokTip";
import { SavingsCounter } from "@/components/SavingsCounter";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return (Object.keys(THEME_DEFS) as ThemeSlug[]).map((theme) => ({ theme }));
}

type Props = { params: Promise<{ theme: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { theme } = await params;
  if (!(theme in THEME_DEFS)) return {};
  const t = THEME_DEFS[theme as ThemeSlug];
  return {
    title: `${t.label} in Bangkok — Day Plans by Area`,
    description: `Curated ${t.label.toLowerCase()} day plans across Bangkok's top neighbourhoods — Thonglor, Ari, Sukhumvit, Old Town, Riverside. All bookable, ranked by real reviews.`,
    alternates: { canonical: `/day-plan/hub/theme/${theme}` },
  };
}

export default async function ThemeHubPage({ params }: Props) {
  const { theme } = await params;
  if (!(theme in THEME_DEFS)) notFound();
  const themeDef = THEME_DEFS[theme as ThemeSlug];
  const areas = Object.keys(AREA_DEFS) as AreaSlug[];
  const otherThemes = (Object.keys(THEME_DEFS) as ThemeSlug[]).filter((t) => t !== theme);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Day Plan", url: "/day-plan" },
        { name: themeDef.label, url: `/day-plan/hub/theme/${theme}` },
      ]} />

      <div className="mb-2 text-sm text-[var(--muted)]">
        <a href="/day-plan" className="hover:text-black transition">Day Plan</a> › {themeDef.label}
      </div>

      <div className="text-3xl mb-2">{themeDef.icon}</div>
      <div className="flex items-start justify-between gap-3 mb-3">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight">
          {themeDef.label} in Bangkok
        </h1>
        <ShareButton title={`${themeDef.label} in Bangkok 2026 — Full Day Plans`} text={`${areas.length} area-specific ${themeDef.label.toLowerCase()} itineraries`} url={`${SITE}/day-plan/hub/theme/${theme}`} line whatsapp />
      </div>

      <p className="text-[var(--muted)] leading-relaxed mb-8">
        {areas.length} area-specific {themeDef.label.toLowerCase()} itineraries — each assembled from venues ranked by Trust Score (public Google Maps data, never paid). Pick the neighbourhood that suits your hotel or budget.
      </p>

      {/* Area cards for this theme */}
      <div className="grid grid-cols-1 gap-4 mb-10">
        {areas.map((area) => {
          const ad = AREA_DEFS[area];
          return (
            <a
              key={area}
              href={`/day-plan/${area}/${theme}`}
              className="flex items-center gap-4 bg-white border border-[var(--border)] rounded-2xl p-4 hover:border-orange-400 transition group"
            >
              <div className="min-w-0 flex-1">
                <div className="font-black group-hover:text-orange-600 transition">{ad.label}</div>
                <div className="text-sm text-[var(--muted)]">{themeDef.headline(ad.label)}</div>
              </div>
              <span className="text-[var(--muted)] group-hover:translate-x-1 transition shrink-0">→</span>
            </a>
          );
        })}
      </div>

      {/* Other themes */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--muted)] mb-4">Other day plan themes</h2>
        <div className="grid grid-cols-2 gap-3">
          {otherThemes.map((t) => {
            const td = THEME_DEFS[t];
            return (
              <a
                key={t}
                href={`/day-plan/hub/theme/${t}`}
                className="block border border-[var(--border)] rounded-xl p-3 hover:border-orange-400 transition group"
              >
                <div className="text-xl mb-0.5">{td.icon}</div>
                <div className="font-bold text-sm group-hover:text-orange-600 transition">{td.label}</div>
              </a>
            );
          })}
        </div>
      </section>

      <SavingsCounter />
      <BangkokTip />
    </div>
  );
}
