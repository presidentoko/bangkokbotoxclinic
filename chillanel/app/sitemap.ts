import type { MetadataRoute } from "next";
import { SITE, SUPPORTED_LANGS, hreflangAlternates } from "@/lib/site";
import { listCities, loadCity, getAllPlaces } from "@/lib/data";
import { allThemeAndMoodLabels, isMoodLabel } from "@/lib/theme-stats";
import { listGuides } from "@/lib/guides";
import { slugifyTheme } from "@/lib/theme-labels";
import { allDistricts, slugifyDistrict } from "@/lib/district-labels";
import { isRelevantCategory } from "@/lib/categories";

// One entry per (route, lang) pair, each declaring its own hreflang
// alternates -- previously each URL entry stood alone with no
// cross-language link, even though every page itself renders full
// hreflang tags (see hreflangAlternates() callers across app/[lang]).
// Google explicitly recommends declaring alternates in the sitemap too,
// not just per-page <link> tags, and with 18k+ URLs three-way duplicated
// across en/th/ko, reinforcing the cluster here helps consolidate signals
// onto the canonical set instead of leaving Google to infer the grouping.
function entriesFor(
  pathForLang: (lang: (typeof SUPPORTED_LANGS)[number]) => string,
  opts: { changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number; lastModified?: Date }
): MetadataRoute.Sitemap {
  const languages = hreflangAlternates(pathForLang);
  return SUPPORTED_LANGS.map((lang) => ({
    url: `${SITE.origin}${pathForLang(lang)}`,
    alternates: { languages },
    ...opts,
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  // Home/city pages already filter to isRelevantCategory (pediatric clinics,
  // cosmetics stores, etc. that show up in the raw Google Places scrape
  // alongside real massage/spa listings get excluded there) -- the place
  // loop below must apply the same filter, or the sitemap advertises
  // (and place/[id]/page.tsx serves) thousands of off-topic URLs that dilute
  // this directory's topical relevance for the niche it's actually about.
  const relevantPlaces = getAllPlaces().filter(({ place }) => isRelevantCategory(place.primaryType));

  // Google mostly ignores changeFrequency/priority but does use lastModified
  // for crawl scheduling — CityData.generatedAt (set at build-data.mjs time)
  // was already available and simply wasn't being passed through.
  const cityDates = new Map(listCities().map((city) => [city, new Date(loadCity(city).generatedAt)]));

  entries.push(...entriesFor((l) => `/${l}`, { changeFrequency: "weekly", priority: 1 }));
  entries.push(...entriesFor((l) => `/${l}/about`, { changeFrequency: "monthly", priority: 0.3 }));
  entries.push(...entriesFor((l) => `/${l}/guide`, { changeFrequency: "monthly", priority: 0.5 }));
  entries.push(...entriesFor((l) => `/${l}/city`, { changeFrequency: "weekly", priority: 0.6 }));
  entries.push(...entriesFor((l) => `/${l}/prices`, { changeFrequency: "weekly", priority: 0.6 }));
  // Low priority but they do belong here: ad networks (and anyone auditing
  // the site) expect the privacy policy and terms to be publicly crawlable.
  entries.push(...entriesFor((l) => `/${l}/privacy`, { changeFrequency: "yearly", priority: 0.2 }));
  entries.push(...entriesFor((l) => `/${l}/terms`, { changeFrequency: "yearly", priority: 0.2 }));
  // /advertise 는 2026-08-20 에 noindex 를 뗐다 — 이 사이트에서 돈이 들어오는
  // 유일한 페이지이고, 광고 네트워크 심사도 광고주 안내를 크롤해서 본다.
  // 중복 보일러플레이트 우려는 우선순위를 낮게 유지하는 것으로 갈음한다.
  entries.push(...entriesFor((l) => `/${l}/advertise`, { changeFrequency: "monthly", priority: 0.4 }));
  entries.push(...entriesFor((l) => `/${l}/watchlist`, { changeFrequency: "weekly", priority: 0.7 }));

  for (const city of listCities()) {
    entries.push(
      ...entriesFor((l) => `/${l}/city/${city}`, {
        lastModified: cityDates.get(city),
        changeFrequency: "weekly",
        priority: 0.8,
      })
    );
  }
  for (const guide of listGuides()) {
    entries.push(...entriesFor((l) => `/${l}/guide/${guide.slug}`, { changeFrequency: "monthly", priority: 0.4 }));
  }
  // No `lastModified` on the per-place/service/district entries below:
  // cityDates/latestCityDate are the data pipeline's *rebuild* timestamp,
  // which advances on every deploy regardless of whether that specific
  // place actually changed -- Google explicitly warns against a lastmod
  // that doesn't reflect a real per-URL change, since it teaches crawlers
  // to stop trusting the field. The city entries above keep it: a city
  // page's own content (its place listing) does legitimately change
  // whenever any place in it is added/updated, so a city-level rebuild
  // date is an honest signal there in a way it isn't for 7,800 individual
  // place URLs.
  for (const { place } of relevantPlaces) {
    // 2026-08-23: 장소 상세는 **en 한 벌만** 제출한다 (3언어 → 1언어).
    // 사이트맵 17,115 개 중 17,681 이 "크롤 후 미색인" 이었다 — 구글이 전부 보고
    // 전부 거부했다는 뜻이다. 원인은 th/ko 장소 페이지가 사실상 en 의 복제라는
    // 것(태국어 13% / 한글 6%, 본문 유사도 85~86%, title 3개 언어 동일).
    // 장소 본문은 리뷰 인용·주소·수치가 대부분이라 언어를 바꿔도 안 바뀐다.
    // 페이지 자체는 남기되(사용자 링크 유지) 색인 대상에서 빼고 canonical 을
    // en 으로 모은다 — place/[id]/page.tsx 의 robots/canonical 과 반드시 함께 간다.
    // 허브(도시·지역·서비스·가이드)는 실제로 번역돼 있으므로 3언어를 유지한다.
    entries.push({
      url: `${SITE.origin}/en/place/${place.id}`,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  // Mood-keyword pages ("Clean", "Good value", ...) are noindex'd in
  // service/[theme]/page.tsx as thin/duplicate content -- excluded here
  // too so the sitemap doesn't advertise URLs the page itself tells
  // Google not to index.
  const serviceLabels = allThemeAndMoodLabels(relevantPlaces.map(({ place }) => place)).filter(
    (label) => !isMoodLabel(label)
  );
  for (const label of serviceLabels) {
    entries.push(
      ...entriesFor((l) => `/${l}/service/${slugifyTheme(label)}`, { changeFrequency: "weekly", priority: 0.7 })
    );
  }

  const districts = allDistricts(relevantPlaces.map(({ place }) => place));
  for (const d of districts) {
    entries.push(
      ...entriesFor((l) => `/${l}/district/${slugifyDistrict(d)}`, { changeFrequency: "weekly", priority: 0.7 })
    );
  }

  return entries;
}
