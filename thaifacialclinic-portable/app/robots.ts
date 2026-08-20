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
      {
        userAgent: ["GPTBot", "ChatGPT-User", "OAI-SearchBot",
                    "PerplexityBot", "Claude-Web", "ClaudeBot",
                    "Google-Extended", "Applebot", "cohere-ai",
                    "anthropic-ai", "Gemini-Google"],
        allow: ["/", "/llms.txt", "/en/", "/sitemap.xml"],
        // 2026-08-20: 이 그룹엔 disallow 가 없었다. robots.txt 는 가장 구체적인
        // User-agent 그룹 하나만 적용하므로, AI 크롤러는 위 `*` 그룹을 통째로
        // 무시하고 /api/·/dashboard/·/admin/ 까지 크롤 허용 상태였다.
        disallow: ["/api/", "/dashboard/", "/admin/"],
        crawlDelay: 5,
      },
    ],
    sitemap: [`${SITE}/sitemap.xml`],
    host: SITE,
  };
}
