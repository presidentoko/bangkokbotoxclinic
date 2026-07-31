import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildDayPlan, allDayPlanParams, AREA_DEFS, THEME_DEFS } from "@/lib/day-plans";
import type { AreaSlug, ThemeSlug, DayPlanStop } from "@/lib/day-plans";
import { AffiliateLink } from "@/components/AffiliateLink";
import { TrustScoreBadge } from "@/components/TrustScoreBadge";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
import { encodePlan } from "@/lib/planner";
import { ShareButton } from "@/components/ShareButton";
import { BangkokTip } from "@/components/BangkokTip";
import { SavingsCounter } from "@/components/SavingsCounter";

export const dynamic = "force-static";
export const dynamicParams = false;

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

export async function generateStaticParams() {
  return allDayPlanParams();
}

type Props = { params: Promise<{ area: string; theme: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { area, theme } = await params;
  if (!(area in AREA_DEFS) || !(theme in THEME_DEFS)) return {};
  const plan = await buildDayPlan(area as AreaSlug, theme as ThemeSlug);
  if (!plan.valid) return { robots: "noindex" };
  return {
    title: plan.headline,
    description: plan.desc,
    alternates: { canonical: `/day-plan/${area}/${theme}` },
    openGraph: { title: plan.headline, description: plan.desc },
  };
}

const NICHE_TO_PLAN_TYPE: Record<string, "wellness" | "gym"> = {
  "muay-thai": "gym",
  "diving": "gym",
  "spa": "wellness",
  "wellness": "wellness",
  "yoga-pilates": "wellness",
  "cooking": "wellness",
  "coworking": "wellness",
};

function activityTypeFor(venueUrl: string): "wellness" | "gym" {
  const niche = venueUrl.split("/")[2];
  return NICHE_TO_PLAN_TYPE[niche] ?? "wellness";
}

function buildEditUrl(stops: DayPlanStop[]): string {
  const items = stops.map((s) => ({
    type: (s.venueUrl.startsWith("/activities") ? activityTypeFor(s.venueUrl) : "restaurant") as "wellness" | "gym" | "restaurant",
    id: s.venueId,
    name: s.venueName,
    rating: s.rating ?? undefined,
    url: s.venueUrl,
  }));
  const encoded = encodePlan({ title: "My Bangkok Day", items });
  return `/plan?d=${encodeURIComponent(encoded)}`;
}

export default async function DayPlanDetailPage({ params }: Props) {
  const { area, theme } = await params;
  if (!(area in AREA_DEFS) || !(theme in THEME_DEFS)) notFound();

  const plan = await buildDayPlan(area as AreaSlug, theme as ThemeSlug);
  if (!plan.valid) notFound();

  const areaDef = AREA_DEFS[area as AreaSlug];
  const themeDef = THEME_DEFS[theme as ThemeSlug];
  const editUrl = buildEditUrl(plan.stops);

  // ItemList schema
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: plan.headline,
    description: plan.desc,
    url: `${SITE}/day-plan/${area}/${theme}`,
    numberOfItems: plan.stops.length,
    itemListElement: plan.stops.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.venueName,
      url: `${SITE}${s.venueUrl}`,
      description: s.rationale,
    })),
  };

  const totalMin = plan.stops.reduce((acc, s) => acc + (s.priceMin ?? 0), 0);
  const priceRange = totalMin > 0 ? `฿${totalMin.toLocaleString()}+` : null;

  const faqs = [
    {
      q: `How much does a ${themeDef.label.toLowerCase()} day in ${areaDef.label} cost?`,
      a: totalMin > 0
        ? `Budget from ${priceRange} for all ${plan.stops.length} stops combined (${plan.stops.map((s) => s.venueName).join(", ")}), based on current listed prices. Actual spend varies by what you order/book at each stop.`
        : `Cost varies by stop — see the price shown on each of the ${plan.stops.length} stops below, or check current prices on the booking link for each venue.`,
    },
    {
      q: `How many stops are in this ${areaDef.label} ${themeDef.label.toLowerCase()} day plan?`,
      a: `${plan.stops.length} stops: ${plan.stops.map((s) => s.venueName).join(", ")}. Each is independently bookable — you can drop or swap any stop using the Day Builder.`,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Day Plan", url: "/day-plan" },
        { name: areaDef.label, url: `/day-plan/hub/${area}` },
        { name: themeDef.label, url: `/day-plan/${area}/${theme}` },
      ]} />
      <FaqJsonLd faqs={faqs} />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-2">
          <a href="/day-plan" className="hover:text-black transition">Day Plan</a>
          <span>›</span>
          <a href={`/day-plan/hub/${area}`} className="hover:text-black transition">{areaDef.label}</a>
          <span>›</span>
          <span>{themeDef.label}</span>
        </div>
        <div className="text-3xl mb-2">{themeDef.icon}</div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
            {plan.headline}
          </h1>
          <ShareButton title={plan.headline} text={plan.desc} url={`${SITE}/day-plan/${area}/${theme}`} line whatsapp />
        </div>

        {/* Answer-first summary (AEO) */}
        <p className="text-[var(--muted)] leading-relaxed mb-4">{plan.desc}</p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
          <span className="bg-[var(--bg)] border border-[var(--border)] rounded-full px-3 py-1 font-bold">
            {plan.stops.length} stops
          </span>
          {priceRange && (
            <span className="bg-[var(--bg)] border border-[var(--border)] rounded-full px-3 py-1 font-bold">
              From {priceRange}
            </span>
          )}
          <span className="bg-[var(--bg)] border border-[var(--border)] rounded-full px-3 py-1">
            {areaDef.desc}
          </span>
        </div>
      </div>

      {/* Why trust this */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-8 text-xs text-amber-800">
        <strong>Real Reviews. No Ads.</strong> Every venue ranked by Trust Score — computed from public Google Maps data, never edited. Paid placement cannot change a ranking.
      </div>

      {/* Timeline */}
      <div className="relative mb-10">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-[var(--border)]" />
        <div className="space-y-0">
          {plan.stops.map((stop, i) => (
            <StopCard key={stop.venueId + i} stop={stop} isLast={i === plan.stops.length - 1} />
          ))}
        </div>
      </div>

      {/* Book + Edit CTAs */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-5 mb-8">
        <div className="font-black text-lg mb-1">Book this day</div>
        <p className="text-sm text-[var(--muted)] mb-4">
          All {plan.stops.length} stops are independently bookable. Links open each provider in a new tab.
        </p>
        <div className="flex flex-wrap gap-3">
          {plan.stops.filter((s) => s.bookUrl).slice(0, 2).map((s, i) => (
            <AffiliateLink
              key={s.venueId + i}
              href={s.bookUrl}
              tracking={{ type: "affiliate", provider: s.bookProvider, activityType: theme, surface: "dayplan", venueId: s.venueId }}
              className="inline-flex items-center gap-2 bg-orange-500 text-white font-bold px-4 py-2.5 rounded-xl hover:bg-orange-600 transition active:scale-95 text-sm"
            >
              🎟 {s.venueName.split(" ").slice(0, 3).join(" ")} →
            </AffiliateLink>
          ))}
        </div>
        <p className="text-xs text-[var(--muted)] mt-3">We may earn a commission. Rankings are never paid.</p>
      </div>

      {/* Edit this plan */}
      <div className="flex items-center justify-between border border-[var(--border)] rounded-2xl p-4 mb-10">
        <div>
          <div className="font-bold text-sm">Want to customise this?</div>
          <div className="text-xs text-[var(--muted)]">Load into the Day Builder and swap any stop</div>
        </div>
        <a
          href={editUrl}
          className="shrink-0 bg-black text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-gray-800 transition"
        >
          Edit this plan →
        </a>
      </div>

      {/* Related plans */}
      <section className="mb-10">
        <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--muted)] mb-4">Related plans</h2>
        <div className="grid grid-cols-2 gap-3">
          {Object.keys(THEME_DEFS)
            .filter((t) => t !== theme)
            .slice(0, 4)
            .map((t) => {
              const td = THEME_DEFS[t as ThemeSlug];
              return (
                <a
                  key={t}
                  href={`/day-plan/${area}/${t}`}
                  className="block border border-[var(--border)] rounded-xl p-3 hover:border-orange-400 transition group"
                >
                  <div className="text-xl mb-1">{td.icon}</div>
                  <div className="text-xs font-bold group-hover:text-orange-600 transition">{td.label}</div>
                  <div className="text-[10px] text-[var(--muted)]">{areaDef.label}</div>
                </a>
              );
            })}
        </div>
      </section>

      {/* Area hub link */}
      <a
        href={`/day-plan/hub/${area}`}
        className="flex items-center justify-between border border-[var(--border)] rounded-xl p-4 hover:border-orange-400 transition group mb-6"
      >
        <div>
          <div className="font-bold text-sm group-hover:text-orange-600 transition">All {areaDef.label} day plans →</div>
          <div className="text-xs text-[var(--muted)]">{areaDef.desc}</div>
        </div>
        <span className="text-[var(--muted)] group-hover:translate-x-1 transition">→</span>
      </a>

      <SavingsCounter />
      <BangkokTip />

      {/* Engagement CTAs */}
      <div className="grid grid-cols-2 gap-3">
        <a href="/quiz" className="flex items-center gap-2 p-3 rounded-xl bg-orange-50 border border-orange-200 hover:border-orange-300 transition group">
          <span className="text-xl shrink-0">🎯</span>
          <div>
            <div className="font-bold text-xs group-hover:text-orange-700 transition">Quiz: Your Bangkok type</div>
            <div className="text-[10px] text-[var(--muted)]">5 questions</div>
          </div>
        </a>
        <a href="/bingo" className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200 hover:border-green-300 transition group">
          <span className="text-xl shrink-0">🏆</span>
          <div>
            <div className="font-bold text-xs group-hover:text-green-700 transition">Bucket List Bingo</div>
            <div className="text-[10px] text-[var(--muted)]">Track your journey</div>
          </div>
        </a>
      </div>
    </div>
  );
}

function StopCard({ stop, isLast }: { stop: DayPlanStop; isLast: boolean }) {
  return (
    <div className={`relative flex gap-4 pb-8 ${isLast ? "pb-0" : ""}`}>
      {/* Timeline dot */}
      <div className="relative z-10 flex-shrink-0 w-12 h-12 bg-white border-2 border-orange-400 rounded-full flex items-center justify-center text-lg shadow-sm">
        {stop.icon}
      </div>

      {/* Card */}
      <div className="flex-1 bg-white border border-[var(--border)] rounded-2xl p-4 hover:border-orange-300 transition">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-widest text-orange-500 mb-0.5">
              {stop.time} · {stop.label}
            </div>
            <a href={stop.venueUrl} className="font-black text-sm hover:text-orange-600 transition line-clamp-2">
              {stop.venueName}
            </a>
          </div>
          <div className="shrink-0">
            <TrustScoreBadge score={stop.trust_score} rating={stop.rating} size="sm" />
          </div>
        </div>

        {/* Rationale */}
        <p className="text-xs text-[var(--muted)] mb-3 italic">{stop.rationale}</p>

        {/* Price + book */}
        <div className="flex items-center justify-between gap-2">
          {stop.priceLabel && (
            <span className="text-xs text-[var(--muted)]">{stop.priceLabel}</span>
          )}
          <AffiliateLink
            href={stop.bookUrl}
            tracking={{ type: "affiliate", provider: stop.bookProvider, activityType: "day-plan", surface: "dayplan", venueId: stop.venueId }}
            className="ml-auto inline-flex items-center gap-1 text-xs font-bold bg-orange-50 text-orange-600 border border-orange-200 px-3 py-1.5 rounded-lg hover:bg-orange-500 hover:text-white transition active:scale-95"
          >
            🎟 {stop.bookLabel}
          </AffiliateLink>
        </div>
      </div>
    </div>
  );
}
