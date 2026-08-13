import type { MetadataRoute } from "next";
import { loadClinics } from "@/lib/data";
import { SUPPORTED_LANGS, SITE as SITE_CFG } from "@/lib/i18n";
import { GUIDES } from "@/lib/guides";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || SITE_CFG.origin;
const PROCEDURES = ["fue", "dhi", "fut", "prp", "smp", "stem-cell", "eyebrow", "beard", "scalp-care"];

// trailingSlash:true (next.config) 이므로 사이트맵 URL도 슬래시 포함 —
// 안 그러면 전 항목이 크롤러 입장에서 308 리다이렉트 목적지가 됨.
function u(path: string): string {
  const p = path.endsWith("/") ? path : `${path}/`;
  return `${SITE}${p}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const { clinics, generated_at } = loadClinics();
  const updated = new Date(generated_at || Date.now());

  // 2026-08-06 감사: /about/ 과 /contact/ 는 lang 접두사 없는 라우트가 존재하지
  // 않아 라이브에서 404였다 (실제 페이지는 /en/about/, /en/contact/ — 둘 다 200).
  // 사이트맵이 자기 사이트의 404 두 개를 구글에 제출하고 있던 셈. 루트 `/` 는
  // 307로 /en/ 에 넘기는 리다이렉트라 이것도 목적지를 직접 제출한다.
  const items: MetadataRoute.Sitemap = [
    { url: u("/en"), lastModified: updated, changeFrequency: "daily", priority: 1.0 },
    { url: u("/for-clinics"), lastModified: updated, changeFrequency: "monthly", priority: 0.7 },
    { url: u("/en/about"), lastModified: updated, changeFrequency: "monthly", priority: 0.5 },
    { url: u("/en/contact"), lastModified: updated, changeFrequency: "monthly", priority: 0.5 },
    { url: u("/privacy"), lastModified: updated, changeFrequency: "yearly", priority: 0.2 },
    { url: u("/terms"), lastModified: updated, changeFrequency: "yearly", priority: 0.2 },
  ];

  // en 홈은 위에서 이미 priority 1.0 으로 넣었다. 나머지 로케일 홈은 콘텐츠가
  // 아직 영어 복제본이라 우선순위를 낮춰서만 제출한다 (제목/설명은 2026-08-06에
  // 로케일별로 분리했지만 본문은 그대로다).
  for (const lang of SUPPORTED_LANGS) {
    if (lang === "en") continue;
    items.push({ url: u(`/${lang}`), lastModified: updated, changeFrequency: "daily", priority: 0.5 });
  }

  // 시술/가이드/클리닉 세부 페이지는 en만 사이트맵에 제출 — 다른 4개 언어 트리는
  // 현재 번역 없이 영어 콘텐츠를 그대로 복제해서 보여주는 상태라 (실번역 전까지)
  // 사이트맵에 넣으면 인덱스 희석만 됨. 페이지 자체는 hreflang으로 계속 발견 가능.
  items.push({ url: u("/en/c"), lastModified: updated, changeFrequency: "weekly", priority: 0.85 });
  items.push({ url: u("/en/guide"), lastModified: updated, changeFrequency: "weekly", priority: 0.8 });
  const citySlugs = [...new Set(clinics.map((c) => c.city).filter(Boolean))]
    .map((c) => c.toLowerCase().replace(/\s+/g, "-"));
  for (const slug of citySlugs) {
    items.push({ url: u(`/en/city/${slug}`), lastModified: updated, changeFrequency: "weekly", priority: 0.88 });
  }
  for (const p of PROCEDURES) {
    items.push({ url: u(`/en/c/${p}`), lastModified: updated, changeFrequency: "weekly", priority: 0.8 });
  }
  for (const g of GUIDES) {
    items.push({ url: u(`/en/guide/${g.slug}`), lastModified: updated, changeFrequency: "weekly", priority: 0.7 });
  }
  for (const c of clinics) {
    if (!c.is_hair_relevant) continue;
    items.push({ url: u(`/en/clinic/${c.slug}`), lastModified: updated, changeFrequency: "weekly", priority: 0.9 });
  }

  return items;
}
