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
      // 2026-08-29: 상업용 SEO/백링크 크롤러 차단.
      //
      // 08-24 에 AI 크롤러 21종을 막았는데 SEO 크롤러는 그대로 열려 있었다.
      // 얘들은 "사이트 전체를 반복해서 훑는 것"이 상품이라 AI 크롤러보다
      // 공격적이다. 실측: 사이트맵 2,368 페이지에 ISR Reads 1.4M/30일 =
      // 페이지당 하루 20회. 같은 기간 사람 클릭은 하루 20회 수준이다.
      // Fast Origin Transfer 18.13GB 도 같은 요청을 바이트로 센 것이다
      // (18.13GB / 1.4M = 12.95KB, 이 사이트 평균 페이지 무게와 일치).
      //
      // 이들을 막아서 잃는 것: 없다. 검색 트래픽을 보내주지 않는다 —
      // 남의 사이트 백링크를 파는 상업 도구다.
      //
      // 일부러 안 막은 것 (진짜 검색엔진이라 트래픽 원천이다):
      //   Googlebot, Bingbot, DuckDuckBot, YandexBot, Sogou, Baiduspider,
      //   그리고 **Yeti (네이버)** — 2026-08-28 에 네 사이트 전부 네이버
      //   소유확인을 붙였다. Yeti 를 막으면 그 작업이 통째로 무의미해진다.
      {
        userAgent: [
          "AhrefsBot", "SemrushBot", "MJ12bot", "DotBot", "rogerbot",
          "DataForSeoBot", "BLEXBot", "Barkrowler", "serpstatbot",
          "SeekportBot", "ZoominfoBot", "MegaIndex.ru", "AwarioBot",
          "AwarioSmartBot", "SEOkicks", "Screaming Frog SEO Spider",
          "LinkpadBot", "SiteAuditBot", "PetalBot",
        ],
        disallow: "/",
        allow: [],
      },
    ],
    sitemap: `${SITE.origin}/sitemap.xml`,
    host: SITE.origin,
  };
}
