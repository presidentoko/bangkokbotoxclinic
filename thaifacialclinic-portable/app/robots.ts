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
    sitemap: [`${SITE}/sitemap.xml`],
    host: SITE,
  };
}
