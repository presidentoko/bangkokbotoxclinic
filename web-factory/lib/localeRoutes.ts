// 언어 스위처가 "실제로 빌드된 페이지"로만 가도록 판정하는 단일 소스.
//
// 예전 HeaderNav.switchLangHref 는 접두사만 갈아끼우고 몇 개 경로 패턴을
// 눈대중으로 허용했다. 그래서 다음이 전부 404 였다:
//   /compare       → /ko/compare, /th/compare (양쪽 다 없음)
//   /guide/{slug}  → EN 13개 slug vs ko 3개·th 3개, 겹치는 slug 0개 → 26링크 전부
//   /c/{cat}       → th 는 7개만 빌드 (EN 19개) → 12개 404
//   /city/{slug}   → th 는 일부만 빌드 (EN 58개) → 23개 404
// hreflang 쪽은 thBuildSets 로 이미 올바르게 걸러내고 있었는데, 정작 사용자가
// 누르는 UI 컨트롤만 그 검증을 안 거치고 있었다.
import { TH_CATEGORY_VALID, TH_CITY_VALID } from "./thBuildSets";
import { CATEGORY_LABELS } from "./types";
import { GUIDES_KO } from "./guides_ko";
import { GUIDES_TH } from "./guides_th";
import { POSTS_KO } from "./posts_ko";
import { POSTS_TH } from "./posts_th";

export type Lang = "en" | "ko" | "th";

// /ko/c/[cuisine] 과 /ko/city/[name] 은 EN 과 같은 목록을 전부 빌드한다
// (app/ko/c/[cuisine]/page.tsx 의 VALID = CATEGORY_LABELS 전체).
const KO_CATEGORY_VALID = new Set(Object.keys(CATEGORY_LABELS));

const SETS = {
  ko: {
    category: KO_CATEGORY_VALID,
    city: null as Set<string> | null, // null = 전체 허용
    guide: new Set(GUIDES_KO.map((g) => g.slug)),
    blog: new Set(POSTS_KO.map((p) => p.slug)),
  },
  th: {
    category: TH_CATEGORY_VALID,
    city: TH_CITY_VALID,
    guide: new Set(GUIDES_TH.map((g) => g.slug)),
    blog: new Set(POSTS_TH.map((p) => p.slug)),
  },
} as const;

// ko/th 양쪽에 단일 페이지가 존재하는 경로들.
const STATIC_ROUTES = new Set([
  "/", "/about", "/contact", "/for-suppliers", "/for-buyers", "/guide", "/blog",
]);

/** 해당 언어판이 실제로 빌드되는 경로인지. path 는 접두사가 벗겨진 EN 경로. */
export function localeHasRoute(path: string, target: "ko" | "th"): boolean {
  if (STATIC_ROUTES.has(path)) return true;
  const s = SETS[target];
  const seg = path.split("/").filter(Boolean);

  // 2단계 경로만 지원한다. /c/{cat}/{district} 같은 3단계는 어느 언어에도 없다.
  if (seg.length !== 2) return false;
  const [head, slug] = seg;

  if (head === "c") return s.category.has(slug);
  if (head === "city") return s.city === null || s.city.has(slug);
  if (head === "guide") return s.guide.has(slug);
  if (head === "blog") return s.blog.has(slug);
  return false;
}

/** 같은 페이지의 다른 언어 URL. 없으면 그 언어 홈으로 폴백. */
export function switchLangHref(currentPath: string, target: Lang): string {
  let p = currentPath;
  if (p.startsWith("/ko/") || p === "/ko") p = p.slice(3) || "/";
  else if (p.startsWith("/th/") || p === "/th") p = p.slice(3) || "/";
  if (!p.startsWith("/")) p = "/" + p;
  // 정적 export 라 trailingSlash 가 꺼져 있지만, 손으로 붙여넣은 URL 대비.
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);

  if (target === "en") return p;
  if (!localeHasRoute(p, target)) return `/${target}`;
  return `/${target}${p === "/" ? "" : p}`;
}

export function detectLang(path: string): Lang {
  if (path === "/ko" || path.startsWith("/ko/")) return "ko";
  if (path === "/th" || path.startsWith("/th/")) return "th";
  return "en";
}
