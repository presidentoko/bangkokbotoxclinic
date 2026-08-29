import { loadMasterDb } from "@/lib/data";
import { getSiteConfig, applySiteFilter } from "@/lib/site";

// /ko/clinic/[id] 는 소관 클리닉 전부가 아니라 Trust Score 상위 N 개만
// prerender 한다 (2026-08-06, ISR Writes 억제). 자세한 배경은
// app/ko/clinic/[id]/page.tsx 주석 참고.
export const KO_PRERENDER = 200;

// 2026-08-29: 이 판정이 세 군데(EN·TH·KO 라우트)에 필요해서 여기로 뺐다.
//
// 왜 필요해졌나: 캡 밖 클리닉의 EN/TH 페이지가 `hrefLang="ko-KR"` 로
// /ko/clinic/{id} 를 광고하는데 그 URL 은 dynamicParams=false 라 404 다.
// 구글은 ko/clinic URL 을 사이트맵이 아니라 **오직 이 hreflang 으로만** 안다
// (실측: sitemap-clinics·sitemap-locale 에 ko/clinic 0건). 그래서 GSC
// "Not found (404)" 의 최대 패턴이 ko/clinic 이 됐다 — 보톡스 표본 637건 중
// 189건, 덴탈도 동일 패턴.
//
// 존재하지 않는 대체 URL 을 광고하지 않는 것이 맞다. 캡 안이면 3개 언어를
// 모두 알리고, 캡 밖이면 en+th 만 알린다(둘은 서로를 가리키므로 hreflang
// 상호참조가 성립한다 — 한쪽만 가리키는 클러스터는 구글이 통째로 버린다).
let cached: Promise<Set<string>> | null = null;

export function koPrerenderedIds(): Promise<Set<string>> {
  if (!cached) {
    cached = (async () => {
      const db = await loadMasterDb();
      const scoped = applySiteFilter(db.clinics, getSiteConfig())
        .slice()
        .sort((a, b) => b.trust_score - a.trust_score)
        .slice(0, KO_PRERENDER);
      return new Set(scoped.map((c) => c.id));
    })();
  }
  return cached;
}

/** 이 클리닉의 /ko/clinic/{id} 가 실제로 존재하는가. */
export async function hasKoPage(id: string): Promise<boolean> {
  return (await koPrerenderedIds()).has(id);
}
