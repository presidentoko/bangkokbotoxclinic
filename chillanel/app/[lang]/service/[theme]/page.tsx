import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tFor } from "@/lib/i18n";
import { isLang, SITE, hreflangAlternates, cityLabel } from "@/lib/site";
import { getAllPlaces } from "@/lib/data";
import { isRelevantCategory } from "@/lib/categories";
import type { Place } from "@/lib/types";
import { themeLabel, slugifyTheme } from "@/lib/theme-labels";
import { placeMatchesLabel, averageRating, allThemeAndMoodLabels, isMoodLabel } from "@/lib/theme-stats";
import { eulReul, eunNeun, euroRo } from "@/lib/korean-particles";
import { PlaceCard } from "@/components/PlaceCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faq } from "@/components/Faq";
import { ItemListJsonLd } from "@/components/JsonLd";
import { LoadMorePlaces } from "@/components/LoadMorePlaces";

const MAX_SHOWN = 90; // same payload-size discipline as the city page

function findLabelForSlug(slug: string): string | null {
  const labels = allThemeAndMoodLabels(getAllPlaces().map(({ place }) => place));
  return labels.find((label) => slugifyTheme(label) === slug) ?? null;
}

// A theme/mood label can have matching places in more than one city (e.g.
// "Thai massage" has hits in both Bangkok and Pattaya) -- this used to
// filter against loadCity(listCities()[0]) only, silently hiding every
// non-first city's matches. Matches across all cities now; the headline
// still names one city (the "{city}" placeholder in copy templates is
// singular), chosen as whichever city actually has the most matches here,
// not just whichever sorts first alphabetically.
function matchingPlacesForLabel(rawLabel: string): Place[] {
  return getAllPlaces()
    .map(({ place }) => place)
    .filter((p) => placeMatchesLabel(p, rawLabel) && isRelevantCategory(p.primaryType))
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || b.reviewCount - a.reviewCount);
}

function dominantCity(matching: Place[]): string | null {
  const counts = new Map<string, number>();
  for (const p of matching) counts.set(p.city, (counts.get(p.city) ?? 0) + 1);
  let bestCity: string | null = null;
  let bestCount = -1;
  for (const [city, count] of counts) {
    if (count > bestCount) {
      bestCity = city;
      bestCount = count;
    }
  }
  return bestCity;
}

export function generateStaticParams() {
  const labels = allThemeAndMoodLabels(getAllPlaces().map(({ place }) => place));
  return labels.map((label) => ({ theme: slugifyTheme(label) }));
}
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; theme: string }>;
}): Promise<Metadata> {
  const { lang, theme } = await params;
  if (!isLang(lang)) return {};
  const rawLabel = findLabelForSlug(theme);
  if (!rawLabel) return {};
  const t = tFor(lang);
  const label = themeLabel(rawLabel, lang);
  const dominant = dominantCity(matchingPlacesForLabel(rawLabel));
  const cityDisplayLabel = dominant ? cityLabel(dominant) : "";
  const listTitleTemplate = isMoodLabel(rawLabel) ? t.service.moodListTitle : t.service.listTitle;
  const pageTitle = listTitleTemplate.replace("{theme}", label).replace("{city}", cityDisplayLabel);
  // KO's intro template carries no hardcoded particle -- {theme} must
  // already include the grammatically correct one (see lib/korean-particles.ts).
  const themeForIntro = lang === "ko" ? `${label}${eulReul(label)}` : label;
  const isMood = isMoodLabel(rawLabel);
  return {
    title: `${pageTitle} — ${SITE.name}`,
    description: t.service.intro.replace("{theme}", themeForIntro).replace("{city}", cityDisplayLabel),
    alternates: {
      canonical: `/${lang}/service/${theme}`,
      languages: hreflangAlternates((l) => `/${l}/service/${theme}`),
    },
    openGraph: { url: `${SITE.origin}/${lang}/service/${theme}`, siteName: SITE.name, type: "website", images: [`${SITE.origin}/opengraph-image`] },
    // Mood pages ("Clean", "Good value", ...) are the same PlaceCard grid +
    // FAQ template as service-theme pages ("Thai massage", ...) with a
    // different filter column -- nobody searches Google for "good value
    // massage places" the way they search "thai massage bangkok", and 15
    // near-identical mood-filtered listing pages read as thin/duplicate
    // content to a crawler. Real service-theme pages stay indexed.
    ...(isMood ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function ServiceThemePage({
  params,
}: {
  params: Promise<{ lang: string; theme: string }>;
}) {
  const { lang, theme } = await params;
  if (!isLang(lang)) notFound();
  const rawLabel = findLabelForSlug(theme);
  if (!rawLabel) notFound();
  const t = tFor(lang);
  const label = themeLabel(rawLabel, lang);
  const allMatching = matchingPlacesForLabel(rawLabel);
  if (allMatching.length === 0) notFound();
  const dominant = dominantCity(allMatching);
  const cityCode = dominant ?? "";
  const cityDisplayLabel = dominant ? cityLabel(dominant) : "";
  const isMood = isMoodLabel(rawLabel);
  const pageTitle = (isMood ? t.service.moodListTitle : t.service.listTitle)
    .replace("{theme}", label)
    .replace("{city}", cityDisplayLabel);
  // KO's intro/faqQuestion/faqAnswer templates carry no hardcoded particle --
  // {theme} must already include the grammatically correct one, since which
  // allomorph is right depends on whether the label ends in a batchim (e.g.
  // "페이셜이" vs "오일 마사지가"). See lib/korean-particles.ts.
  const themeForIntro = lang === "ko" ? `${label}${eulReul(label)}` : label;
  const themeForFaqQuestion = lang === "ko" ? `${label}${eunNeun(label)}` : label;
  const themeForFaqAnswer = lang === "ko" ? `${label}${euroRo(label)}` : label;

  const places = allMatching.slice(0, MAX_SHOWN);

  const avgRating = averageRating(allMatching);
  const topPick = allMatching[0];
  const topPickHasRating = topPick.rating != null;
  const faqAnswer = [
    t.service.faqAnswer.replace("{count}", String(allMatching.length)).replace("{theme}", themeForFaqAnswer).replace("{city}", cityDisplayLabel),
    avgRating != null ? t.service.faqAnswerRatingClause.replace("{rating}", avgRating.toFixed(1)) : null,
    topPickHasRating
      ? t.service.faqAnswerTopPick
          .replace("{name}", topPick.name)
          .replace("{rating}", topPick.rating!.toFixed(1))
          .replace("{reviewCount}", String(topPick.reviewCount))
      : null,
  ]
    .filter(Boolean)
    .join(" ");
  const faqItems = [
    {
      q: (isMood ? t.service.moodFaqQuestion : t.service.faqQuestion)
        .replace("{theme}", isMood ? label : themeForFaqQuestion)
        .replace("{city}", cityDisplayLabel),
      a: faqAnswer,
    },
  ];

  return (
    <div>
      <section className="relative overflow-hidden bg-ink text-on-ink sm:mx-[calc(50%-50vw)] px-6 sm:px-0 pb-20 sm:pb-28">
        <div className="spa-glow bg-accent-warm w-[300px] h-[300px] -top-28 -left-20" aria-hidden="true" />
        <div className="relative max-w-5xl mx-auto px-0 sm:px-6 pt-14 sm:pt-20">
          <Breadcrumbs
            variant="ink"
            items={[
              { name: t.nav.home, href: `/${lang}` },
              { name: cityDisplayLabel, href: `/${lang}/city/${cityCode}` },
              { name: label, href: `/${lang}/service/${theme}` },
            ]}
          />
          <ItemListJsonLd
            name={pageTitle}
            numberOfItems={allMatching.length}
            items={places.map((p) => ({ name: p.name, url: `${SITE.origin}/${lang}/place/${p.id}` }))}
          />
          <h1 className="font-display italic font-semibold text-3xl sm:text-5xl tracking-tight mb-3">{pageTitle}</h1>
          <p className="text-on-ink-muted max-w-2xl leading-relaxed">
            {t.service.intro.replace("{theme}", themeForIntro).replace("{city}", cityDisplayLabel)}
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 sm:py-14">
        <Link
          href={`/${lang}/city/${cityCode}`}
          className="inline-block text-sm text-accent font-semibold mb-6 hover:underline"
        >
          {t.service.backToCity.replace("{city}", cityDisplayLabel)}
        </Link>
        {/* Same sentence that used to only exist inside the collapsed FAQ
            below -- surfaced here as visible prose so an answer engine (or
            a human skimming) gets the direct "what's the best place for
            this" answer without a click. The FAQPage schema + collapsed
            detail stays for the structured-data half of that. */}
        {faqAnswer && <p className="text-muted leading-relaxed mb-8 max-w-2xl">{faqAnswer}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {places.map((place, i) => (
            <PlaceCard
              key={place.id}
              place={place}
              lang={lang}
              editorsPick={i === 0}
              badgeLabel={t.service.topPickLabel}
              size={i === 0 ? "large" : "default"}
            />
          ))}
        </div>
        <LoadMorePlaces
          filter={{ type: "theme", label: rawLabel }}
          alreadyShownIds={places.map((p) => p.id)}
          totalCount={allMatching.length}
          lang={lang}
        />
        <Faq title={t.service.faqTitle} items={faqItems} />
      </div>
    </div>
  );
}
