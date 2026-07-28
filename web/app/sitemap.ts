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

  const districts = Object.keys(db.district_counts);
  const cities = Object.keys(db.city_counts ?? {});
  // scoped(현재 사이트 소관 클리닉)에서만 의사 추출 — 이전엔 db.clinics 전체를 써서
  // botox/덴탈 사이트맵에 동일한 2,000+ 의사 URL이 중복 제출됨 (2026-07-10 감사).
  const allDoctors = getAllDoctors(scoped);

  const items: MetadataRoute.Sitemap = [
    { url: SITE, lastModified: updated, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE}/th`, lastModified: updated, changeFrequency: "daily", priority: 0.9 },
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
  for (const [d, count] of Object.entries(db.district_counts)) {
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
  for (const d of allDoctors) {
    items.push({
      // encodeURI — 태국어 doctor slug가 그대로 <loc>에 실리면 사이트맵 XML/URL 스펙 위반
      url: encodeURI(`${SITE}/doctor/${d.composite_slug}`),
      lastModified: updated,
      changeFrequency: "weekly",
      priority: d.mentions >= 5 ? 0.75 : 0.55,
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

  void districts; // reserved for future district-only sitemap

  // Compare pages — top clinics per service, paired (1vs2, 2vs3, 3vs4) → 3 pairs × N services = ~24 compare URLs
  // (scoped 사용 — isClinicLike 필터 + 현재 사이트 소관 클리닉만, 레스토랑 등 노이즈 및 타 도메인 URL 방지)
  for (const s of HUB_SERVICES) {
    const pool = scoped
      .filter((c) => (c.categories ?? []).includes(s))
      .sort((a, b) => b.trust_score - a.trust_score)
      .slice(0, 5);
    for (let i = 0; i < pool.length - 1; i++) {
      items.push({
        url: `${SITE}/compare/${pool[i].id}/${pool[i + 1].id}`,
        lastModified: updated,
        changeFrequency: "weekly" as const,
        priority: 0.72,
      });
    }
  }

  return items;
}
