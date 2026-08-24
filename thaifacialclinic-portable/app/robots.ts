import type { MetadataRoute } from "next";
import { SITE as SITE_CFG } from "@/lib/i18n";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || SITE_CFG.origin;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        // 2026-08-20: `/_next/` 를 빼야 한다. 라이브 /en/ 이 실제로 로드하는 스크립트가
        // /_next/static/chunks/*.js 다(실측). 이걸 막으면 구글이 페이지를 렌더링하지
        // 못해 캐노니컬·색인 판정이 틀어진다 — GSC 의 "Duplicate, Google chose
        // different canonical" 과 직결된다. web/app/robots.ts 는 같은 이유로 이미
        // 2026-08-08 에 뺐는데 이 사이트만 남아 있었다.
        disallow: ["/api/", "/dashboard/", "/admin/"],
      },
      // 2026-08-24: AI 크롤러 차단 (web/web-cf 와 동일 판단).
      // 계정 전체가 Hobby 한도 네 지표를 모두 초과 중이고, 읽기량 대부분이
      // 사람이 아닌 크롤러다. crawl-delay 는 대부분 무시되는 비표준 지시어라
      // "정중한 허용"이 실제로는 무제한 허용이었다.
      // Googlebot 은 위 `*` 그룹을 따르므로 검색 순위엔 영향이 없다.
      {
        userAgent: ["GPTBot", "ChatGPT-User", "OAI-SearchBot",
                    "PerplexityBot", "Claude-Web", "ClaudeBot",
                    "Google-Extended", "Applebot-Extended", "cohere-ai",
                    "anthropic-ai", "Gemini-Google", "CCBot", "Bytespider",
                    "Amazonbot", "meta-externalagent", "Diffbot",
                    "FacebookBot", "YouBot", "ImagesiftBot"],
        disallow: "/",
        allow: [],
      },
    ],
    sitemap: [`${SITE}/sitemap.xml`],
    host: SITE,
  };
}
