import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

const SITE = getSiteUrl();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // 여기서 막는 건 "콘텐츠가 아닌 것"만이다 (2026-08-08 GSC 경고 대응).
        //
        // 뺀 것과 이유:
        //  - `/_next/`: 이 사이트가 실제로 로드하는 스크립트가 `/_next/static/chunks/*.js`
        //    다(실측). 이걸 막으면 구글이 페이지를 렌더링하지 못해 캐노니컬·색인 판정이
        //    틀어진다. GSC 의 "Duplicate, Google chose different canonical" 과 직결된다.
        //  - `/compare/`, `/report/`: 크롤은 허용하고 페이지 메타의 noindex 로 막는다.
        //    robots.txt 로 막으면 구글이 noindex 를 **읽을 수 없어서** 링크만 보고
        //    URL 을 색인한다 — 그게 "Indexed, though blocked by robots.txt" 다.
        //    실제로 홈에서 `/compare/{a}/{b}` 로 링크가 나가고 있었다(실측).
        //
        // 남긴 것: /api/ 는 콘텐츠가 아니고, /dashboard/·/onboarding/ 은 인증 뒤라
        // 공개 링크가 없다.
        disallow: ["/api/", "/dashboard/", "/onboarding/"],
      },
      // 2026-08-24: AI 크롤러를 차단으로 전환한다.
      //
      // 원래는 "정중하게 허용 + crawl-delay 5" 였는데, 실측이 그 전제를 뒤집었다.
      // ISR Reads 1.5M/월(한도 1M) 인데 사람 클릭은 3개월에 1,690건이다.
      // 사이트맵 1,705 페이지 기준 페이지당 월 880회, 실제 색인된 199 페이지
      // 기준이면 7,538회 읽힌 셈 — 사람 트래픽으로는 설명이 안 되는 규모다.
      // 게다가 crawl-delay 는 대부분의 AI 크롤러가 무시하는 비표준 지시어라
      // "정중한 허용"이 실제로는 무제한 허용이었다.
      //
      // 포기하는 것: ChatGPT·Perplexity 답변에 이 사이트가 인용될 가능성.
      // 지키는 것: Hobby 한도(ISR Reads·Transfer·Fluid CPU 네 지표 전부 초과 중).
      // 구글 검색 순위에는 영향이 없다 — Googlebot 은 위 `*` 그룹을 따르고,
      // Google-Extended 는 Gemini 학습용이라 검색 색인과 무관하다.
      //
      // 되돌릴 조건: 유료 플랜으로 올라가거나 ISR Reads 가 한도 아래로 안정되면.
      {
        userAgent: [
          "GPTBot", "ChatGPT-User", "OAI-SearchBot",
          "PerplexityBot", "ClaudeBot", "Claude-Web",
          "Google-Extended", "Applebot-Extended", "cohere-ai",
          "anthropic-ai", "Gemini-Google", "CCBot", "Bytespider",
          "Amazonbot", "meta-externalagent", "Diffbot", "Omgilibot",
          "FacebookBot", "Timpibot", "YouBot", "ImagesiftBot",
        ],
        disallow: "/",
        allow: [],
      },
    ],
    sitemap: `${SITE}/sitemap-index.xml`,
    host: SITE,
  };
}
