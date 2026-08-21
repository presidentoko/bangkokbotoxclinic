import type { NextConfig } from "next";
import fs from "fs";
import path from "path";
import { loadMasterDb } from "./lib/data";
import {
  applySiteFilter,
  configForFocus,
  getSiteConfig,
  resolveOwnerFocus,
  resolveOwnerFocusCandidates,
  resolveOwnerUrl,
  urlForFocus,
  FOCUS_VALID,
  type SiteFocus,
} from "./lib/site";

// WordPress migration: redirect old WP URL patterns → home (301)
// 2026-08-08: 예전엔 아래 13개 패턴을 전부 홈("/")으로 301 시켰다. 그게 GSC
// "Soft 404" 가 여러 곳에서 뜬 원인이다 — 구글은 **대응 내용이 없는 페이지를
// 홈으로 리다이렉트하는 것을 soft 404 로 취급한다**(리다이렉트가 200 을 주지만
// 요청한 내용이 없으므로). :path* 와일드카드라 옛 워드프레스 URL 이 전부
// 여기 걸려서, 한두 개가 아니라 대량으로 발생했다.
//
// 원칙: 동등한 페이지가 있으면 그 페이지로 301, 없으면 홈으로 보내지 말고
// 그냥 404 를 주는 게 맞다(구글 권장). 404 는 색인에서 깔끔히 빠지지만
// 홈 리다이렉트는 soft 404 로 남아 계속 리포트에 쌓인다.
const wpRedirects = [
  // 동등물이 실제로 있는 것만 유지 — 옛 WP 피드 → 현재 피드
  { source: "/feed/:path*", destination: "/feed.xml", permanent: true },
  { source: "/comments/feed", destination: "/feed.xml", permanent: true },
];

// 홈 리다이렉트를 걷어낸 패턴들(참고용 기록):
//   /wp-content/*, /wp-includes/*, /wp-json/*, /wp-admin/*, /wp-login.php,
//   /wp-cron.php, /xmlrpc.php  → 애초에 콘텐츠가 아니다(자산·관리자·probe).
//                                 404 가 정확한 응답이다.
//   /category/*, /tag/*, /author/*, /page/:num
//                              → 옛 블로그 분류 체계. 현재 사이트에 1:1 대응이
//                                 없다. 굳이 매핑하려면 슬러그가 실제 서비스명과
//                                 일치하는 경우에만 /c/{service} 로 보낼 수 있는데,
//                                 그건 어떤 옛 URL 이 존재했는지 실제 데이터를
//                                 확인한 뒤에 할 일이다. 추측 매핑은 또 다른
//                                 잘못된 301(=404 착지)을 만든다.

// Old WordPress sitemaps → new sitemap index
const sitemapRedirects = [
  { source: "/sitemap_index.xml", destination: "/sitemap-index.xml", permanent: true },
  { source: "/post-sitemap.xml", destination: "/sitemap-priority.xml", permanent: true },
  { source: "/page-sitemap.xml", destination: "/sitemap.xml", permanent: true },
  { source: "/category-sitemap.xml", destination: "/sitemap.xml", permanent: true },
];

// 2026-07-31 감사: /c/[service] (dynamicParams:false, VALID 8개 전부 정적 생성)는
// 사이트 소관 밖 서비스에서 notFound()로 끝났고, /clinic/[id]는 애초에 소관
// 클리닉만 generateStaticParams에 들어가 dynamicParams:false 때문에 라우팅
// 단계에서 그냥 404 — 페이지 컴포넌트까지 요청이 닿지도 않았다. 두 경우 다
// "존재하지 않는 URL"이 아니라 "다른 도메인 소관"이라 redirects()에서 실제
// 소유 도메인으로 301 — dynamicParams는 그대로 false로 둬서 bangkokfillers
// 2026-07-10 사고(봇이 무작위 id 두드릴 때마다 ISR write 소진) 재발 방지는
// 유지한다. redirects()는 next build 시점에 한 번 계산되는 정적 라우팅
// 테이블이라 요청당 비용이 전혀 없다.
const ALL_SERVICES = ["botox", "filler", "hifu", "facial", "laser", "dental", "hair_transplant", "eye"];

async function offFocusServiceRedirects() {
  const cfg = getSiteConfig();
  const focusValid = FOCUS_VALID[cfg.focus];
  if (!focusValid) return []; // "all" 허브는 전부 유효, 리다이렉트 불필요
  const offFocus = ALL_SERVICES.filter((s) => !focusValid.has(s));
  return offFocus.flatMap((service) => {
    const ownerUrl = resolveOwnerUrl([service]);
    if (!ownerUrl) return [];

    // thaifacialclinic 은 이 레포의 web/ 이 아니라 별도 프로젝트라서 URL 구조가
    // 다르다: 서비스 페이지가 /c/{service} 가 아니라 /{lang}/c/{procedure}
    // 형식이고, 시술 슬러그도 여기 카테고리명(hair_transplant)이 아니라 시술명
    // (fue, dhi …)이다. 실측: /c/hair_transplant 와 /en/c/hair_transplant/ 둘 다
    // 404, /en/c/fue/ 만 200. 그래서 카테고리 허브는 내용이 동등한 그쪽 홈
    // (헤어 클리닉 디렉토리)으로 보내고, 지역별 조합은 대응 페이지가 아예 없어
    // 발급하지 않는다 (2026-08-06 감사).
    if (resolveOwnerFocus([service]) === "hair") {
      return [{ source: `/c/${service}`, destination: `${ownerUrl}/en/`, permanent: true }];
    }

    return [
      { source: `/c/${service}`, destination: `${ownerUrl}/c/${service}`, permanent: true },
      // [district] 라우트는 generateStaticParams에서 focusValid로 이미 걸러져
      // dynamicParams:false와 맞물려 있음 — 와일드카드 하나로 모든 지역 커버.
      { source: `/c/${service}/:district`, destination: `${ownerUrl}/c/${service}/:district`, permanent: true },
    ];
  });
}

async function offScopeClinicRedirects() {
  const cfg = getSiteConfig();
  if (cfg.focus === "all") return [];
  const db = await loadMasterDb();
  const scopedIds = new Set(applySiteFilter(db.clinics, cfg).map((c) => c.id));

  // 상대 도메인이 그 클리닉을 실제로 prerender 하는지 확인하기 위한 id 집합.
  // 판정 기준이 두 개로 갈려 있었던 게 문제였다: 리다이렉트 대상은 넓은
  // resolveOwnerUrl(카테고리 하나만 걸리면 소유권 인정)로 정하는데, 정작 그
  // 도메인이 빌드하는 페이지는 좁은 applySiteFilter(덴탈은 primary_type까지
  // 봄)로 정해진다. 그 틈에서 "301 → 상대 도메인에 없는 페이지 → 404" 가
  // 1,374건 발생했다 (2026-08-06 감사).
  const targetScoped = new Map<SiteFocus, Set<string>>();
  const scopedIdsFor = (focus: SiteFocus) => {
    let s = targetScoped.get(focus);
    if (!s) {
      s = new Set(applySiteFilter(db.clinics, configForFocus(focus)).map((c) => c.id));
      targetScoped.set(focus, s);
    }
    return s;
  };

  const out: { source: string; destination: string; permanent: boolean }[] = [];
  for (const c of db.clinics) {
    if (scopedIds.has(c.id)) continue;

    // 소유 후보를 **전부** 받아서 걸러낸다. 예전엔 resolveOwnerFocus 로 하나만
    // 받았는데, 그게 구멍을 만들었다 (2026-08-08 실측):
    // Ratchada Medical General Clinic 은 categories 에 hair_transplant 와
    // botox/facial/laser 가 같이 있어 우선순위상 "hair" 로 판정됐고, hair 는
    // 아래 이유로 건너뛰므로 리다이렉트가 아예 발급되지 않아 덴탈에서 404 가
    // 났다 — 정작 botox 는 그 페이지를 200 으로 서빙하고 있었다.
    const candidates = resolveOwnerFocusCandidates(c.categories).filter((focus) => {
      // 소유 도메인이 자기 자신인 경우. 넓은 소유권 판정은 통과했는데 좁은
      // 빌드 필터에서 탈락한 클리닉들로, 예전엔 /clinic/X → (같은 호스트)/clinic/X
      // 라는 자기 자신 리다이렉트를 발급했다. 페이지가 실행되기도 전에 라우팅
      // 테이블에서 끝나는 무한 301 루프였고 덴탈 374건 / 보톡스 1,016건이었다.
      // (덤으로 데이터 품질 문제도 드러났다 — 한식당·쇼핑몰에 dental 카테고리가
      // 붙어 있어서 이 경로로 샜다.)
      if (focus === cfg.focus) return false;

      // 헤어(thaifacialclinic)는 라우트 구조 자체가 다르다: /[lang]/clinic/[slug]
      // 뿐이고 lang 없는 /clinic/* 라우트가 없으며, 슬러그도 master_db id가 아니라
      // slugify(이름)-{id 뒤 6자리} 형식이다. 즉 /clinic/{id} 로 보내면 100% 404다.
      // 두 파이프라인의 이름 표기가 달라 슬러그를 여기서 재구성하는 건 또 다른
      // 404를 만들 위험이 커서, 잘못된 301을 발급하느니 다음 후보로 넘어간다.
      if (focus === "hair") return false;

      // 상대 도메인이 이 클리닉을 실제로 빌드하지 않으면 보내봐야 404다.
      return scopedIdsFor(focus).has(c.id);
    });

    // 카테고리 미분류거나, 후보가 전부 위 조건에 걸리면 404로 둔다 —
    // 잘못된 도메인으로 보내는 것보다 안전.
    const ownerFocus = candidates[0];
    if (!ownerFocus) continue;

    // URL 은 resolveOwnerUrl(categories) 이 아니라 고른 focus 로 만든다.
    // 전자는 카테고리 우선순위로 다시 판정해서 엉뚱한 도메인(위 예시라면
    // thaifacialclinic)을 돌려줄 수 있다.
    out.push({
      source: `/clinic/${c.id}`,
      destination: `${urlForFocus(ownerFocus)}/clinic/${c.id}`,
      permanent: true,
    });
  }
  return out;
}

// 2026-08-01 커밋 45560b5 가 doctor URL 체계를 바꿨다:
//   이전  /doctor/{의사명}-at-{slugify(클리닉명).slice(0,50)}
//   이후  /doctor/{의사명}-at-{place_id 뒤 12자리 hex}
// 클리닉 상호명이 구글맵에서 바뀔 때마다 URL 이 통째로 고아가 되던 문제를
// 고치려던 변경인데(lib/data.ts:146 주석), 정작 구 URL 리다이렉트를 안 만들어서
// 그날 색인돼 있던 doctor URL 이 전부 하드 404 가 됐다 — dynamicParams=false 라
// 라우팅 단계에서 즉시 404 다. GSC 404 3,047건 중 약 1,505건이 이 코호트다.
//
// 구 슬러그는 클리닉 이름에서 결정론적으로 재구성되므로 매핑을 여기서 그대로
// 만들어낼 수 있다. 단, 2,302명 전원에게 발급하면 이미 2,000~3,200줄인 리다이렉트
// 테이블이 두 배가 된다 — 라우팅 테이블은 모든 요청보다 앞서 평가되므로 대가가
// 있다. 그래서 실제로 색인 대상이었던 의사(mentions >= 10, thin-content 가 아니라
// noindex 가 안 붙던 쪽)로만 한정한다. 나머지는 어차피 noindex 라 구글이
// 색인하지 않았으니 복구할 순위도 없다.
const DOCTOR_INDEXABLE_MENTIONS = 10;

async function legacyDoctorSlugRedirects() {
  const cfg = getSiteConfig();
  const db = await loadMasterDb();
  const { getAllDoctors, slugify } = await import("./lib/data");
  const scoped = applySiteFilter(db.clinics, cfg);
  const out: { source: string; destination: string; permanent: boolean }[] = [];
  const seen = new Set<string>();
  for (const d of getAllDoctors(scoped)) {
    if (d.mentions < DOCTOR_INDEXABLE_MENTIONS) continue;
    const legacy = `${d.slug}-at-${slugify(d.clinic.name).slice(0, 50)}`;
    if (legacy === d.composite_slug || seen.has(legacy)) continue;
    seen.add(legacy);
    out.push({
      source: `/doctor/${encodeURI(legacy)}`,
      destination: `/doctor/${encodeURI(d.composite_slug)}`,
      permanent: true,
    });
  }
  return out;
}

// 2026-08-20: 이 함수가 web-cf 에만 있고 web 에는 없었다. web 은 봇/덴탈
// 두 Vercel 프로젝트가 공유하는 코드베이스이므로, bangkokbotoxclinic.com 은
// data/slug_history.json(669KB, 매일 갱신됨)을 배포에 싣고도 죽은 doctor
// 슬러그를 전부 404 로 흘리고 있었다 — 데이터는 있는데 배선만 없던 상태.
// 2026-08-17 GSC 감사(web/next.config.ts 이식, 2026-08-18): doctor URL 404 —
// legacyDoctorSlugRedirects()는 "이름 기반 → place_id 기반" 한 번의 포맷
// 전환만 커버한다. composite_slug의 의사명 부분은 재스크랩마다 바뀔 수 있고,
// 그때마다 옛 색인 URL이 404가 된다. build_master_db.py의
// update_slug_history()가 클리닉별 모든 composite_slug 이력을
// data/slug_history.json에 append-only로 남기고, 여기서 죽은 슬러그를 그
// 클리닉 페이지로 301 — 어떤 의사였는지 재식별하지 않고 "가장 가까운 살아있는
// 페이지"로 보낸다.
async function staleDoctorSlugRedirects() {
  const cfg = getSiteConfig();
  const db = await loadMasterDb();
  const scopedIds = new Set(applySiteFilter(db.clinics, cfg).map((c) => c.id));
  const clinicById = new Map(db.clinics.map((c) => [c.id, c]));

  const historyPath = path.join(process.cwd(), "data", "slug_history.json");
  if (!fs.existsSync(historyPath)) return [];
  let history: Record<string, { all_slugs?: string[]; active_slugs?: string[] }>;
  try {
    history = JSON.parse(fs.readFileSync(historyPath, "utf-8"));
  } catch {
    return [];
  }

  const targetScoped = new Map<SiteFocus, Set<string>>();
  const scopedIdsFor = (focus: SiteFocus) => {
    let s = targetScoped.get(focus);
    if (!s) {
      s = new Set(applySiteFilter(db.clinics, configForFocus(focus)).map((c) => c.id));
      targetScoped.set(focus, s);
    }
    return s;
  };

  const out: { source: string; destination: string; permanent: boolean }[] = [];
  for (const [cid, entry] of Object.entries(history)) {
    const activeSet = new Set(entry.active_slugs || []);
    const staleSlugs = (entry.all_slugs || []).filter((s) => !activeSet.has(s));
    if (staleSlugs.length === 0) continue;

    let destination: string | null = null;
    if (scopedIds.has(cid)) {
      destination = `/clinic/${cid}`;
    } else {
      const clinic = clinicById.get(cid);
      if (clinic) {
        const candidates = resolveOwnerFocusCandidates(clinic.categories).filter((focus) => {
          if (focus === cfg.focus) return false;
          if (focus === "hair") return false;
          return scopedIdsFor(focus).has(cid);
        });
        const ownerFocus = candidates[0];
        if (ownerFocus) destination = `${urlForFocus(ownerFocus)}/clinic/${cid}`;
      }
    }
    if (!destination) continue;

    for (const slug of staleSlugs) {
      out.push({ source: `/doctor/${encodeURI(slug)}`, destination, permanent: true });
    }
  }
  return out;
}

const config: NextConfig = {
  // 2026-08-21: /api/* 는 어떤 계층에서도 캐시되면 안 된다. 실측 결과 admin
  // 라우트(401)와 lead/partner-signup(405) 응답에 Cache-Control 이 아예 없어서,
  // 캐시 계층이 붙으면 기본 휴리스틱에 맡겨진다. 덴탈은 Worker 앞 캐시를 켜는
  // 중이고(wrangler.jsonc 의 cache.enabled), Vercel 쪽도 엣지 캐시가 있으므로
  // 응답 자체가 캐시 불가임을 명시한다 — 인증 응답이 캐시돼 남에게 나가는 건
  // 되돌릴 수 없는 사고다.
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0, must-revalidate" },
        ],
      },
    ];
  },
  // master_db.json 큰 사이즈 대비 Edge 런타임 안 씀
  experimental: {
    largePageDataBytes: 4 * 1024 * 1024,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 604800, // 7일 — clinic photos rarely change, reduces re-optimization count
    deviceSizes: [640, 750, 1080, 1920], // trim default 8 sizes → 4 (mobile-first site)
    imageSizes: [64, 128, 256],
    remotePatterns: [
      // Google Maps place photos (Street View / Places API)
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "maps.googleapis.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  compress: true,
  poweredByHeader: false,
  async redirects() {
    const [serviceRedirects, clinicRedirects, doctorRedirects, staleDoctorRedirects] = await Promise.all([
      offFocusServiceRedirects(),
      offScopeClinicRedirects(),
      legacyDoctorSlugRedirects(),
      staleDoctorSlugRedirects(),
    ]);
    return [
      ...wpRedirects,
      ...sitemapRedirects,
      // Legacy /clinic-images/* URLs (Google-indexed, cached HTML, hotlinkers)
      // → Cloudflare R2. public/clinic-images/ no longer ships in the deploy
      // (see .vercelignore), so this is the only thing standing between old
      // links and a 404 (2026-07-28 audit).
      {
        source: "/clinic-images/:path*",
        destination: "https://img.bangkokbestclinic.com/clinic-images/:path*",
        permanent: true,
      },
      ...serviceRedirects,
      ...clinicRedirects,
      ...doctorRedirects,
      ...staleDoctorRedirects,
    ];
  },
};

export default config;
