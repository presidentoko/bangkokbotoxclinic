// 도시별 "우리 리뷰 집계" 순위 페이지 (2026-10-23).
// /[lang]/city/[city]/best/[topic] — 완전 정적(dynamicParams=false, revalidate 없음):
// 배포 때만 바뀌는 데이터라 ISR write/read 를 쓰지 않는다.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tFor } from "@/lib/i18n";
import { isLang, SITE, hreflangAlternates, cityLabel, localeFor, ogLocale } from "@/lib/site";
import { listCities, loadCity } from "@/lib/data";
import { districtLabel } from "@/lib/district-labels";
import { RANKING_TOPICS, rankPlaces, analysedReviewCount, topicsWithEnoughEntries, MIN_ENTRIES, type RankingTopic } from "@/lib/rankings";
import { RANKING_COPY as COPY, TOPIC_EMOJI, fill } from "@/lib/ranking-copy";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faq } from "@/components/Faq";
import { ItemListJsonLd } from "@/components/JsonLd";


export function generateStaticParams() {
  return listCities().flatMap((city) => topicsWithEnoughEntries(city).map((topic) => ({ city, topic })));
}
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; city: string; topic: string }>;
}): Promise<Metadata> {
  const { lang, city, topic } = await params;
  if (!isLang(lang) || !(RANKING_TOPICS as readonly string[]).includes(topic)) return {};
  const c = COPY[lang].topics[topic as RankingTopic];
  const label = cityLabel(city);
  const path = `/city/${city}/best/${topic}`;
  return {
    title: `${fill(c.title, { city: label })} — ${SITE.name}`,
    description: c.intro,
    alternates: { canonical: `/${lang}${path}`, languages: hreflangAlternates((l) => `/${l}${path}`) },
    openGraph: { url: `${SITE.origin}/${lang}${path}`, siteName: SITE.name, locale: ogLocale(lang), type: "website", images: [`${SITE.origin}/opengraph-image`] },
  };
}

export default async function RankingPage({
  params,
}: {
  params: Promise<{ lang: string; city: string; topic: string }>;
}) {
  const { lang, city, topic: rawTopic } = await params;
  if (!isLang(lang) || !(RANKING_TOPICS as readonly string[]).includes(rawTopic)) notFound();
  const topic = rawTopic as RankingTopic;
  const t = tFor(lang);
  const copy = COPY[lang];
  const c = copy.topics[topic];
  const loc = localeFor(lang);
  const label = cityLabel(city);
  const places = loadCity(city).places;
  const entries = rankPlaces(places, topic);
  if (entries.length < MIN_ENTRIES) notFound();
  const others = topicsWithEnoughEntries(city).filter((x) => x !== topic);
  const top = entries[0];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Breadcrumbs
        items={[
          { name: t.nav.home, href: `/${lang}` },
          { name: label, href: `/${lang}/city/${city}` },
          { name: fill(c.h1, { city: label }), href: `/${lang}/city/${city}/best/${topic}` },
        ]}
      />
      <ItemListJsonLd
        name={fill(c.title, { city: label })}
        items={entries.map((e) => ({ name: e.place.name, url: `${SITE.origin}/${lang}/place/${e.place.id}` }))}
      />
      <h1 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight">
        {TOPIC_EMOJI[topic]} {fill(c.h1, { city: label })}
      </h1>
      <p className="text-muted mb-2 max-w-xl leading-relaxed">{c.intro}</p>
      <p className="text-xs text-muted mb-8 max-w-xl leading-relaxed">
        {fill(copy.method, { n: analysedReviewCount(places).toLocaleString(loc), city: label })}
      </p>

      <ol className="divide-y divide-border rounded-2xl border border-border mb-12">
        {entries.map((e, i) => (
          <li key={e.place.id} className="px-4 py-3 flex items-start gap-3">
            <span className="font-display text-xl font-semibold text-accent tabular-nums w-7 shrink-0">{i + 1}</span>
            <div className="min-w-0 flex-1">
              <Link href={`/${lang}/place/${e.place.id}`} className="font-semibold hover:text-accent">
                {e.place.name}
              </Link>
              <div className="text-xs text-muted mt-0.5">
                {e.place.district ? `${districtLabel(e.place.district, lang)} · ` : ""}
                {c.metric(e, loc)}
              </div>
            </div>
            {e.place.rating != null && (
              <div className="text-sm tabular-nums text-right shrink-0">
                ★ {e.place.rating.toFixed(1)}
                <div className="text-xs text-muted">{e.place.reviewCount.toLocaleString(loc)}</div>
              </div>
            )}
          </li>
        ))}
      </ol>

      <Faq
        title={copy.faqTitle}
        items={[{
          q: fill(c.faqQ, { city: label }),
          a: fill(c.faqA, { city: label, name: top.place.name, metric: c.metric(top, loc) }),
        }]}
      />

      <section className="mb-4">
        <h2 className="text-lg font-bold mb-3">{fill(copy.more, { city: label })}</h2>
        <ul className="flex flex-wrap gap-2">
          {others.map((o) => (
            <li key={o}>
              <Link
                href={`/${lang}/city/${city}/best/${o}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-border text-sm hover:border-accent hover:text-accent"
              >
                {TOPIC_EMOJI[o]} {fill(copy.topics[o].h1, { city: label })}
              </Link>
            </li>
          ))}
          <li>
            <Link href={`/${lang}/city/${city}`} className="inline-flex px-3 py-2 rounded-full border border-border text-sm hover:border-accent hover:text-accent">
              {fill(copy.allIn, { city: label })}
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}

