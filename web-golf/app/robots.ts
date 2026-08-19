import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.thailandgolfguide.com";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /embed/ 는 코스당 1개씩 541개가 발행되는 noindex 배지 페이지, /search 도 noindex.
        // 링크에 rel="nofollow" 를 달아도 구글은 이미 알고 있는 URL 을 주기적으로 재크롤한다.
        // 도메인 권위가 0인 지금 크롤 예산을 여기 태우면 정작 코스 페이지가 색인되지 못한다.
        // (이미 'Excluded by noindex' 로 분류돼 있어 재크롤을 막아도 색인으로 돌아오지 않는다.)
        disallow: ["/api/", "/_next/", "/embed/", "/search"],
      },
      // Naver / Daum — Korean SEO. Explicit allow + no crawl delay so they
      // pick up new pages quickly. Yeti is Naver's primary crawler.
      {
        userAgent: ["Yeti", "NaverBot", "Daum", "Daumoa"],
        allow: "/",
      },
      // AEO crawlers — explicitly allow + slow rate to be polite
      {
        userAgent: ["GPTBot", "ChatGPT-User", "OAI-SearchBot",
                    "PerplexityBot", "ClaudeBot", "Claude-Web", "Google-Extended"],
        allow: "/",
        crawlDelay: 5,
      },
    ],
    // 네이버는 RSS 를 sitemap 보다 빠르게 수집한다. 한국어 피드를 여기서도 노출한다.
    sitemap: [
      `${SITE}/sitemap.xml`,
      `${SITE}/image-sitemap.xml`,
      `${SITE}/video-sitemap.xml`,
    ],
    host: SITE,
  };
}
