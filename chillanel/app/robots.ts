import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // 개인화·비공개 경로만 막는다. 나머지 크롤은 검색 노출에 필요하다.
        disallow: ["/api/"],
      },
      // 2026-08-27: AI 크롤러 차단. 나머지 세 사이트는 08-24 에 넣었는데
      // 여기만 robots 구조가 달라 빠져 있었다 — 이 사이트의 rules 는
      // `[{ userAgent: "*", allow: "/" }]` 한 줄이 전부였다.
      //
      // 근거: 페이지 5,799개에 ISR Reads 1.5M(한도 1M) = 페이지당 258회.
      // 사람 트래픽은 GSC 기준 3개월 클릭 0 · 노출 17 이다. 읽는 주체가
      // 사람이 아니다. Fast Origin Transfer 12.4GB(한도 10GB)도 같은 원인.
      //
      // 포기하는 것: ChatGPT·Perplexity 답변에 인용될 가능성.
      // 지키는 것: Hobby 한도. 애초에 색인이 0에 가까워 인용될 일도 없었다.
      // 구글 검색에는 영향 없다 — Googlebot 은 위 `*` 그룹을 따르고,
      // Google-Extended 는 Gemini 학습용이라 검색 색인과 무관하다.
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
      },
    ],
    sitemap: `${SITE.origin}/sitemap.xml`,
    host: SITE.origin,
  };
}
