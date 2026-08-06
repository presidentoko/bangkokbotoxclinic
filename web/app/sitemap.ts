import type { MetadataRoute } from "next";
import { loadMasterDb, getAllDoctors } from "@/lib/data";
import { BEST_FOR } from "@/lib/bestFor";
import { guidesForFocus } from "@/lib/guides";
import { applySiteFilter, getSiteConfig, getSiteUrl, FOCUS_VALID } from "@/lib/site";

const SITE = getSiteUrl();
const SERVICES = ["botox", "filler", "hifu", "facial", "laser", "dental", "hair_transplant", "eye"];
// /c/[service] 404s for services this domain's SITE_FOCUS doesn't serve
// (see app/c/[service]/page.tsx's FOCUS_VALID check) — only the /c/{service}
// hub loop below needs this; the other SERVICES loops (district combos,
// doctors, compare) aren't focus-gated on their page side.
const focusValid = FOCUS_VALID[getSiteConfig().focus];
const HUB_SERVICES = focusValid ? SERVICES.filter((s) => focusValid.has(s)) : SERVICES;

// /sitemap.xml — hubs + top 200 priority clinics.
// /sitemap-clinics.xml (route handler) — remaining clinic pages.
// /sitemap-index.xml (route handler) — index pointing to both.
// robots.ts → /sitemap-index.xml

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = await loadMasterDb();
  const cfg = getSiteConfig();
  const scoped = applySiteFilter(db.clinics, cfg);
  const updated = new Date(db.generated_at);

  // city_counts/district_counts는 전 도메인 합산 — 이걸 그대로 쓰면 이 사이트
  // 소관 클리닉이 하나도 없는 도시/지역까지 사이트맵에 올라가 죽은 URL을
  // 제출하게 됨 (예: 덴탈 사이트가 보톡스 전용 도시의 /city/*를 제출 →
  // 페이지 자체는 notFound()라 항상 404). scoped에 실제로 존재하는 것만
  // 통과 (2026-07-31 감사).
  const scopedCitySlugs = new Set(scoped.map((c) => c.city_slug).filter(Boolean));
  const scopedDistricts = new Set(scoped.map((c) => c.district).filter(Boolean));
  const districts = Object.keys(db.district_counts).filter((d) => scopedDistricts.has(d));
  const cities = Object.keys(db.city_counts ?? {}).filter((label) => {
    const clinic = db.clinics.find((c) => c.city_label === label);
    const slug = clinic?.city_slug ?? label.toLowerCase().replace(/\s+/g, "-");
    return scopedCitySlugs.has(slug);
  });
  // scoped(현재 사이트 소관 클리닉)에서만 의사 추출 — 이전엔 db.clinics 전체를 써서
  // botox/덴탈 사이트맵에 동일한 2,000+ 의사 URL이 중복 제출됨 (2026-07-10 감사).
  const allDoctors = getAllDoctors(scoped);

  const items: MetadataRoute.Sitemap = [
    { url: SITE, lastModified: updated, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE}/th`, lastModified: updated, changeFrequency: "daily", priority: 0.95 },
    { url: `${SITE}/ko`, lastModified: updated, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/about`, lastModified: updated, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/contact`, lastModified: updated, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE}/for-clinics`, lastModified: updated, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/guide`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/doctors`, lastModified: updated, changeFrequency: "daily", priority: 0.85 },
  ];

  // focus 태그 있는 가이드는 그 사이트에서만 제출 — 안 그러면 타 도메인
  // 가이드가 크로스도메인 중복 콘텐츠로 색인됨 (2026-07-17 감사).
  for (const g of guidesForFocus(cfg.focus)) {
    items.push({ url: `${SITE}/guide/${g.slug}`, lastModified: new Date(g.updated), changeFrequency: "monthly", priority: 0.85 });
  }
  for (const s of HUB_SERVICES) {
    items.push({ url: `${SITE}/c/${s}`, lastModified: updated, changeFrequency: "daily", priority: 0.9 });
    // 한국 의료관광 검색 타겟 (2026-07-13 신설). thin-content 방지 위해 EN과
    // 동일 기준(scoped 카테고리에 5개 이상 클리닉)일 때만 제출.
    if (scoped.filter((c) => c.categories.includes(s)).length >= 5) {
      items.push({ url: `${SITE}/ko/c/${s}`, lastModified: updated, changeFrequency: "daily", priority: 0.85 });
    }
  }
  for (const c of BEST_FOR) {
    items.push({ url: `${SITE}/best/${c.slug}`, lastModified: updated, changeFrequency: "daily", priority: 0.85 });
  }
  for (const cityLabel of cities) {
    const clinic = db.clinics.find((c) => c.city_label === cityLabel);
    const slug = clinic?.city_slug ?? cityLabel.toLowerCase().replace(/\s+/g, "-");
    items.push({ url: `${SITE}/city/${slug}`, lastModified: updated, changeFrequency: "daily", priority: 0.9 });
  }
  for (const d of districts) {
    const count = db.district_counts[d];
    if ((count as number) < 5) continue;
    const slug = d.toLowerCase().replace(/\s+/g, "-");
    items.push({ url: `${SITE}/d/${slug}`, lastModified: updated, changeFrequency: "weekly", priority: 0.7 });
    for (const s of HUB_SERVICES) {
      const comboCount = scoped.filter(
        (c) =>
          (c.district || "").toLowerCase().replace(/\s+/g, "-") === slug &&
          (c.categories || []).includes(s),
      ).length;
      if (comboCount < 3) continue;
      items.push({ url: `${SITE}/c/${s}/${slug}`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 });
    }
  }

  // Doctor pages — 실제 의사 데이터가 있는 도시만. app/doctors/c/[city]/page.tsx의
  // generateStaticParams는 allDoctors에 등장하는 도시만 빌드하고
  // dynamicParams=false라 그 외는 무조건 404 — 이전엔 여기서 전체 도시 목록
  // (db.city_counts, 의사 유무 무관)을 그대로 써서 사이트맵이 죽은 URL을
  // 제출하고 있었음 (예: /doctors/c/phuket, /doctors/c/krabi — 2026-07-28 감사).
  const citiesWithDoctors = new Set(allDoctors.map((d) => d.clinic.city_label).filter(Boolean));
  for (const cityLabel of cities) {
    if (!citiesWithDoctors.has(cityLabel)) continue;
    const slug = cityLabel.toLowerCase().replace(/\s+/g, "-");
    items.push({ url: `${SITE}/doctors/c/${slug}`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 });
  }
  for (const s of HUB_SERVICES) {
    items.push({ url: `${SITE}/doctors/s/${s}`, lastModified: updated, changeFrequency: "weekly", priority: 0.8 });
  }
  // app/doctor/[slug]/page.tsx의 thinContent(= mentions < 10)는 robots noindex를
  // 내보내는데, 여기선 조건 없이 전원을 제출하고 있었다 — 구글에 "이 페이지 봐줘"
  // 하고 보낸 뒤 페이지에서 "색인하지 마"라고 답하는 셈이라, 덴탈 사이트맵
  // 797개 doctor URL 중 670개(84%)가 noindex였다. 사이트맵 전체의 63~75%가
  // 이런 URL이었고 GSC "발견됨 – 색인되지 않음" 1,614건의 기계적 원인이다
  // (2026-08-06 감사, 샘플 12개 중 11개 noindex 실측). 임계값은 페이지 쪽
  // thinContent와 반드시 같이 움직여야 한다.
  const DOCTOR_INDEXABLE_MENTIONS = 10;
  for (const d of allDoctors) {
    if (d.mentions < DOCTOR_INDEXABLE_MENTIONS) continue;
    items.push({
      // encodeURI — 태국어 doctor slug가 그대로 <loc>에 실리면 사이트맵 XML/URL 스펙 위반
      url: encodeURI(`${SITE}/doctor/${d.composite_slug}`),
      lastModified: updated,
      changeFrequency: "weekly",
      priority: d.mentions >= 25 ? 0.75 : 0.6,
    });
  }
  const doctorDistricts = new Set<string>();
  for (const d of allDoctors) if (d.clinic.district) doctorDistricts.add(d.clinic.district);
  for (const dist of doctorDistricts) {
    const slug = dist.toLowerCase().replace(/\s+/g, "-");
    items.push({ url: `${SITE}/doctors/d/${slug}`, lastModified: updated, changeFrequency: "weekly", priority: 0.75 });
  }
  const combos = new Map<string, number>();
  for (const d of allDoctors) {
    if (!d.clinic.district) continue;
    for (const cat of d.clinic.categories) {
      if (!SERVICES.includes(cat)) continue;
      const key = `${d.clinic.district}|${cat}`;
      combos.set(key, (combos.get(key) || 0) + 1);
    }
  }
  for (const [key, n] of combos) {
    if (n < 3) continue;
    const [dist, cat] = key.split("|");
    const slug = dist.toLowerCase().replace(/\s+/g, "-");
    items.push({
      url: `${SITE}/doctors/d/${slug}/${cat}`,
      lastModified: updated,
      changeFrequency: "weekly",
      priority: n >= 10 ? 0.85 : 0.7,
    });
  }

  // /compare/* 는 app/robots.ts:12에서 Disallow 중이다. robots.txt로 막은 URL을
  // 사이트맵으로 제출하면 구글이 "사이트맵에 제출됐지만 robots.txt에 의해 차단됨"
  // 오류로 잡는다 — 서로 반대되는 지시를 동시에 보내는 것이라 둘 중 하나를 골라야
  // 하고, /compare/ 는 파라미터 조합 폭발 때문에 색인 대상이 아니라고 이미
  // 판단한 상태다. 따라서 제출 쪽을 없앤다 (2026-08-06 감사).

  return items;
}
