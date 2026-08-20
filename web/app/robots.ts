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
      // AEO crawlers — explicitly allow + slow rate to be polite
      {
        userAgent: [
          "GPTBot", "ChatGPT-User", "OAI-SearchBot",
          "PerplexityBot", "ClaudeBot", "Claude-Web",
          "Google-Extended", "Applebot", "cohere-ai",
          "anthropic-ai", "Gemini-Google",
        ],
        allow: ["/", "/llms.txt", "/llms-full.txt", "/sitemap-index.xml"],
        // 2026-08-20: 이 그룹엔 disallow 가 없었다. robots.txt 는 "가장 구체적인
        // User-agent 그룹 하나만" 적용하므로, GPTBot 등은 위 `*` 그룹을 통째로
        // 무시하고 /api/·/dashboard/·/onboarding/ 까지 전부 크롤 허용 상태였다.
        // 같은 목록을 여기에도 복제해야 실제로 막힌다.
        disallow: ["/api/", "/dashboard/", "/onboarding/"],
        crawlDelay: 5,
      },
    ],
    sitemap: `${SITE}/sitemap-index.xml`,
    host: SITE,
  };
}
