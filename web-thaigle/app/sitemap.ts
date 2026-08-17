import type { MetadataRoute } from "next";
import { loadMasterDb } from "@/lib/data";
import { getSlugMap, restaurantUrl, slugifySegment } from "@/lib/restaurants";
import { BEST_FOR } from "@/lib/bestFor";
import { CUISINE_LABELS } from "@/lib/types";
import { GUIDES } from "@/lib/guides";
import { NICHES, loadNicheDb, qualifyingNichePlaces, nicheCityCounts } from "@/lib/niches";
import { nicheAreaCounts } from "@/lib/areas";
import type { NicheSlug } from "@/lib/niches";
import { allDayPlanParams, buildDayPlan, AREA_DEFS, THEME_DEFS } from "@/lib/day-plans";
import type { AreaSlug, ThemeSlug } from "@/lib/day-plans";
import { OCCASIONS } from "@/lib/occasions";
import { NEIGHBORHOODS } from "@/lib/neighborhoods";
import { GUIDE_TOPICS } from "@/lib/guideTopics";
import { getAllPlaceSlugsServer } from "@/lib/places-server";
import { INDEXABLE_PLACE_LANGS } from "@/lib/placeIndexing";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";
const CUISINES = Object.keys(CUISINE_LABELS);

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [db, slugMap] = await Promise.all([loadMasterDb(), getSlugMap()]);
  const cities = Object.keys(db.city_counts);
  // <lastmod> has to move when the content moves and stay put when it doesn't.
  //
  // This used to be `new Date()` — the build time — because db.generated_at
  // was frozen at 2026-06-19 and every URL was claiming nothing had changed
  // since June. But build time has the opposite failure: this repo redeploys
  // whenever any dataset updates, so all 7,523 URLs got a fresh lastmod
  // several times a week, and Google's documented response to a sitemap that
  // restamps everything on every generation is to stop trusting lastmod at
  // all. That costs exactly the recrawl the field exists to buy.
  //
  // The real bug was upstream: the enrichment scripts rewrote the niche files
  // without restamping generated_at. Fixed there and backfilled from git, so
  // these dates are now what they always claimed to be — the date that data
  // last changed. Restaurant and activity data move independently, so they
  // get separate values rather than one shared maximum.
  const restaurantsUpdated = new Date(db.generated_at);
  const nicheDates = await Promise.all(
    NICHES.map(async (n) => new Date((await loadNicheDb(n.slug as NicheSlug)).generated_at)),
  );
  const activitiesUpdated = new Date(Math.max(...nicheDates.map((d) => d.getTime())));
  // Editorial and template-driven pages have no dataset behind them; the most
  // recent of the two is the closest honest answer for those.
  const updated = new Date(
    Math.max(restaurantsUpdated.getTime(), activitiesUpdated.getTime()),
  );

  const items: MetadataRoute.Sitemap = [
    { url: SITE, lastModified: updated, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE}/th`, lastModified: updated, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/ko`, lastModified: updated, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/ja`, lastModified: updated, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/ru`, lastModified: updated, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/ar`, lastModified: updated, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/about`, lastModified: updated, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/contact`, lastModified: updated, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE}/terms`, lastModified: updated, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE}/takedown`, lastModified: updated, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE}/for-venues`, lastModified: updated, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/methodology`, lastModified: updated, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/privacy`, lastModified: updated, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE}/guide`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/restaurants`, lastModified: updated, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/clinics`, lastModified: updated, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE}/dental`, lastModified: updated, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE}/activities`, lastModified: updated, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/plan`, lastModified: updated, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/quiz`, lastModified: updated, changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE}/bingo`, lastModified: updated, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/local-tips`, lastModified: updated, changeFrequency: "monthly", priority: 0.82 },
    { url: `${SITE}/for`, lastModified: updated, changeFrequency: "weekly", priority: 0.85 },
    { url: `${SITE}/trending`, lastModified: updated, changeFrequency: "daily", priority: 0.88 },
    ...OCCASIONS.map((o) => ({
      url: `${SITE}/for/${o.slug}`,
      lastModified: updated,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  // /{lang}/place/* is 1,647 places × 3 langs. Dropping all 4,941 from the
  // sitemap (2026-07-17) and then blocking them in robots.txt (2026-07-26)
  // together removed every discovery path this cluster had — the only page
  // that links into it is /en, which is itself noindex. Re-listing the
  // English third (the hreflang x-default) gives the robots.txt reopening
  // something to act on; th/ko stay out of both the sitemap and robots.
  //
  // Priority 0.5 deliberately sits below every other content page here: the
  // original complaint was that this tree crowded out the money pages, and
  // priority is the lever for that, not omission.
  items.push({ url: `${SITE}/en/place`, lastModified: updated, changeFrequency: "weekly", priority: 0.7 });
  const placeSlugs = await getAllPlaceSlugsServer();
  for (const { lang, slug } of placeSlugs) {
    if (!INDEXABLE_PLACE_LANGS.includes(lang)) continue;
    items.push({
      url: `${SITE}/en/place/${encodeURIComponent(slug)}`,
      lastModified: updated,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  // Matches the uncapped generateStaticParams() in activities/[niche]/[slug]
  // — every place that clears qualifyingNichePlaces()'s quality gate (incl.
  // the extra spa-specific content-depth filter) gets a page, so the
  // sitemap should list exactly those, not a superset that 404s.
  const nicheDbs = await Promise.all(
    NICHES.map(async (n) => ({ slug: n.slug, places: qualifyingNichePlaces(n.slug, (await loadNicheDb(n.slug as NicheSlug)).places) }))
  );
  // Niche×city landing pages (app/activities/[niche]/city/[city]) — same
  // MIN_VENUES gate as generateStaticParams there.
  const nicheCityLinks = await Promise.all(
    NICHES.map(async (n) => nicheCityCounts(n.slug, (await loadNicheDb(n.slug as NicheSlug)).places))
  );
  for (let i = 0; i < NICHES.length; i++) {
    for (const c of nicheCityLinks[i]) {
      items.push({
        url: `${SITE}/activities/${NICHES[i].slug}/city/${c.slug}`,
        lastModified: updated,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }
  // Niche×Bangkok-area pages (app/activities/[niche]/area/[area]) — same
  // AREA_MIN_VENUES gate as generateStaticParams there. Ranked above the city
  // pages because these carry the area-qualified queries that already earn
  // impressions, and because they are the short crawl path to the venue tail.
  const nicheAreaLinks = await Promise.all(
    NICHES.map(async (n) => nicheAreaCounts(n.slug, (await loadNicheDb(n.slug as NicheSlug)).places))
  );
  for (let i = 0; i < NICHES.length; i++) {
    for (const { area } of nicheAreaLinks[i]) {
      items.push({
        url: `${SITE}/activities/${NICHES[i].slug}/area/${area.slug}`,
        lastModified: updated,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }
  items.push({
    url: `${SITE}/activities/first-time-bangkok`,
    lastModified: updated,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  });
  items.push({
    url: `${SITE}/activities/halal`,
    lastModified: updated,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  });
  items.push({
    url: `${SITE}/activities/digital-nomad`,
    lastModified: updated,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  });
  items.push({
    url: `${SITE}/activities/couples`,
    lastModified: updated,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  });
  items.push({
    url: `${SITE}/activities/budget`,
    lastModified: updated,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  });
  items.push({
    url: `${SITE}/activities/wellness-week`,
    lastModified: updated,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  });
  items.push({
    url: `${SITE}/activities/weekend-in-bangkok`,
    lastModified: updated,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  });
  items.push({
    url: `${SITE}/activities/prices-bangkok-2026`,
    lastModified: updated,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  });
  items.push({
    url: `${SITE}/activities/sukhumvit`,
    lastModified: updated,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  });
  items.push({
    url: `${SITE}/activities/silom`,
    lastModified: updated,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  });
  for (const n of NICHES) {
    items.push({ url: `${SITE}/activities/${n.slug}`, lastModified: updated, changeFrequency: "weekly", priority: 0.88 });
  }
  // Top-10 article pages per niche
  for (const n of NICHES) {
    items.push({
      url: `${SITE}/activities/${n.slug}/top-10`,
      lastModified: updated,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    });
  }
  // Full A–Z venue index per niche — the crawl path to every detail page
  // beyond the hub's top-60 cut.
  for (const n of NICHES) {
    items.push({
      url: `${SITE}/activities/${n.slug}/all`,
      lastModified: updated,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    });
  }
  for (const nd of nicheDbs) {
    for (const p of nd.places) {
      items.push({ url: `${SITE}/activities/${nd.slug}/${encodeURIComponent(p.slug)}`, lastModified: activitiesUpdated, changeFrequency: "weekly", priority: 0.75 });
    }
  }

  for (const g of GUIDES) {
    items.push({ url: `${SITE}/guide/${g.slug}`, lastModified: new Date(g.updated), changeFrequency: "monthly", priority: 0.85 });
  }

  // Bangkok A–Z topic pages — content that previously only existed inlined
  // into /guide, so it had no URL of its own to rank with.
  items.push({ url: `${SITE}/guide/bangkok`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 });
  for (const t of GUIDE_TOPICS) {
    items.push({ url: `${SITE}/guide/bangkok/${t.slug}`, lastModified: updated, changeFrequency: "monthly", priority: 0.6 });
  }

  const compareUrls = [
    "thai-massage-vs-oil-massage",
    "muay-thai-vs-boxing",
    "yoga-vs-pilates-bangkok",
  ].map((slug) => ({
    url: `${SITE}/activities/compare/${slug}`,
    lastModified: updated,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  for (const cu of compareUrls) {
    items.push(cu);
  }

  for (const c of cities) {
    items.push({ url: `${SITE}/restaurants/${c}`, lastModified: updated, changeFrequency: "daily", priority: 0.85 });
    items.push({ url: `${SITE}/restaurants/${c}/hidden-gems`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 });
    items.push({ url: `${SITE}/restaurants/${c}/tourist-traps`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 });
    items.push({ url: `${SITE}/restaurants/${c}/instagram-famous-vs-actually-good`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 });
  }

  for (const c of CUISINES) {
    items.push({ url: `${SITE}/restaurants/cuisine/${c}`, lastModified: updated, changeFrequency: "daily", priority: 0.9 });
  }

  for (const bf of BEST_FOR) {
    items.push({ url: `${SITE}/best/${bf.slug}`, lastModified: updated, changeFrequency: "daily", priority: 0.85 });
  }

  const districtSet = new Set<string>();
  for (const r of db.restaurants) {
    {
      // "other" collects the district-less restaurants — it's a real listing
      // page and the only parent for 676 detail pages, so it belongs here
      // alongside the named districts.
      const districtSlug = r.district ? slugifySegment(r.district) : "other";
      const key = `${r.city}/${districtSlug}`;
      if (!districtSet.has(key)) {
        districtSet.add(key);
        items.push({
          url: `${SITE}/restaurants/${r.city}/${districtSlug}`,
          lastModified: updated,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }
  }

  // Colloquial neighbourhood pages (sukhumvit, thonglor, silom, …) — these
  // carry the search demand the khet slugs don't ("restaurants thonglor"),
  // and are generated by the same [city]/[district] route.
  for (const n of NEIGHBORHOODS) {
    items.push({
      url: `${SITE}/restaurants/${n.city}/${n.slug}`,
      lastModified: updated,
      changeFrequency: "weekly",
      priority: 0.75,
    });
  }

  // Day-plan programmatic pages (C1/C2)
  items.push({ url: `${SITE}/day-plan`, lastModified: updated, changeFrequency: "weekly", priority: 0.9 });
  for (const area of Object.keys(AREA_DEFS) as AreaSlug[]) {
    items.push({ url: `${SITE}/day-plan/hub/${area}`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 });
  }
  for (const theme of Object.keys(THEME_DEFS) as ThemeSlug[]) {
    items.push({ url: `${SITE}/day-plan/hub/theme/${theme}`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 });
  }
  // /day-plan/[area]/[theme] notFound()s when fewer than 3 stops resolve —
  // only submit combos that actually build a valid plan.
  for (const { area, theme } of allDayPlanParams()) {
    const plan = await buildDayPlan(area, theme);
    if (!plan.valid) continue;
    items.push({ url: `${SITE}/day-plan/${area}/${theme}`, lastModified: updated, changeFrequency: "weekly", priority: 0.75 });
  }

  for (const [id, entry] of Object.entries(slugMap)) {
    const r = db.restaurants.find((x) => x.id === id);
    if (!r) continue;
    items.push({
      url: `${SITE}${restaurantUrl(entry)}`,
      lastModified: restaurantsUpdated,
      changeFrequency: "weekly",
      priority: r.trust_score >= 70 ? 0.8 : r.trust_score >= 50 ? 0.6 : 0.4,
    });
  }

  return items;
}
