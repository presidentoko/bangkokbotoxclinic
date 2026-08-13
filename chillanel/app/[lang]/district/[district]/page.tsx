import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tFor } from "@/lib/i18n";
import { isLang, SITE, hreflangAlternates, cityLabel } from "@/lib/site";
import { getAllPlaces } from "@/lib/data";
import { isRelevantCategory } from "@/lib/categories";
import { districtLabel, slugifyDistrict, allDistricts } from "@/lib/district-labels";
import { averageRating } from "@/lib/theme-stats";
import { PlaceCard } from "@/components/PlaceCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faq } from "@/components/Faq";
import { ItemListJsonLd } from "@/components/JsonLd";

const MAX_SHOWN = 90; // same payload-size discipline as the city page

function findRawDistrictForSlug(slug: string): string | null {
  const districts = allDistricts(getAllPlaces().map(({ place }) => place));
  return districts.find((d) => slugifyDistrict(d) === slug) ?? null;
}

export function generateStaticParams() {
  const districts = allDistricts(getAllPlaces().map(({ place }) => place));
  return districts.map((d) => ({ district: slugifyDistrict(d) }));
}
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; district: string }>;
}): Promise<Metadata> {
  const { lang, district } = await params;
  if (!isLang(lang)) return {};
  const rawDistrict = findRawDistrictForSlug(district);
  if (!rawDistrict) return {};
  const t = tFor(lang);
  const label = districtLabel(rawDistrict, lang);
  // A district belongs to exactly one city (district clustering runs
  // per-city -- see extract-district.mjs), so the real answer is whichever
  // city its actual matching places report, not cities()[0] -- which
  // silently picked the wrong city's places whenever cities()[0] wasn't
  // the district's real city (or 404'd all district pages outright if
  // that city happened to have no districts of its own).
  const districtCity = getAllPlaces().find(({ place }) => place.district === rawDistrict)?.city;
  const cityDisplayLabel = districtCity ? cityLabel(districtCity) : "";
  const pageTitle = t.district.listTitle.replace("{district}", label).replace("{city}", cityDisplayLabel);
  return {
    title: `${pageTitle} — ${SITE.name}`,
    description: t.district.intro.replace("{district}", label).replace("{city}", cityDisplayLabel),
    alternates: {
      canonical: `/${lang}/district/${district}`,
      languages: hreflangAlternates((l) => `/${l}/district/${district}`),
    },
    openGraph: { url: `${SITE.origin}/${lang}/district/${district}`, siteName: SITE.name, type: "website", images: [`${SITE.origin}/opengraph-image`] },
  };
}

export default async function DistrictPage({
  params,
}: {
  params: Promise<{ lang: string; district: string }>;
}) {
  const { lang, district } = await params;
  if (!isLang(lang)) notFound();
  const rawDistrict = findRawDistrictForSlug(district);
  if (!rawDistrict) notFound();
  const t = tFor(lang);
  const label = districtLabel(rawDistrict, lang);

  const allMatching = getAllPlaces()
    .map(({ place }) => place)
    .filter((p) => p.district === rawDistrict && isRelevantCategory(p.primaryType))
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || b.reviewCount - a.reviewCount);
  if (allMatching.length === 0) notFound();
  const cityCode = allMatching[0].city;
  const cityDisplayLabel = cityLabel(cityCode);
  const pageTitle = t.district.listTitle.replace("{district}", label).replace("{city}", cityDisplayLabel);
  const places = allMatching.slice(0, MAX_SHOWN);

  const avgRating = averageRating(allMatching);
  const topPick = allMatching[0];
  const topPickHasRating = topPick.rating != null;
  const faqAnswer = [
    t.district.faqAnswer.replace("{count}", String(allMatching.length)).replace("{district}", label),
    avgRating != null ? t.service.faqAnswerRatingClause.replace("{rating}", avgRating.toFixed(1)) : null,
    topPickHasRating
      ? t.district.faqAnswerTopPick
          .replace("{name}", topPick.name)
          .replace("{rating}", topPick.rating!.toFixed(1))
          .replace("{reviewCount}", String(topPick.reviewCount))
      : null,
  ]
    .filter(Boolean)
    .join(" ");
  const faqItems = [
    {
      q: t.district.faqQuestion.replace("{district}", label),
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
              { name: label, href: `/${lang}/district/${district}` },
            ]}
          />
          <ItemListJsonLd
            name={pageTitle}
            numberOfItems={allMatching.length}
            items={places.map((p) => ({ name: p.name, url: `${SITE.origin}/${lang}/place/${p.id}` }))}
          />
          <h1 className="font-display italic font-semibold text-3xl sm:text-5xl tracking-tight mb-3">{pageTitle}</h1>
          <p className="text-on-ink-muted max-w-2xl leading-relaxed">
            {t.district.intro.replace("{district}", label).replace("{city}", cityDisplayLabel)}
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 sm:py-14">
        <Link
          href={`/${lang}/city/${cityCode}`}
          className="inline-block text-sm text-accent font-semibold mb-6 hover:underline"
        >
          {t.district.backToCity.replace("{city}", cityDisplayLabel)}
        </Link>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {places.map((place, i) => (
            <PlaceCard
              key={place.id}
              place={place}
              lang={lang}
              editorsPick={i === 0}
              badgeLabel={t.district.topPickLabel}
              size={i === 0 ? "large" : "default"}
            />
          ))}
        </div>
        <Faq title={t.district.faqTitle} items={faqItems} />
      </div>
    </div>
  );
}
