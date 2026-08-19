import { POSTS_KO } from "@/lib/posts_ko";
import { GUIDES_KO } from "@/lib/guides_ko";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.thailandgolfguide.com";
const BRAND = process.env.NEXT_PUBLIC_BRAND || "Thailand Golf Guide";

export const dynamic = "force-static";

// 한국어 RSS 피드.
//
// 기존 /feed.xml 은 영어 코스 페이지 50개만 담고 language 도 en-US 였다. 그런데 이 사이트의
// 한국어 자산은 블로그 58편 + 가이드 8편으로 66편이나 되는데 어떤 피드에도 실리지 않았다.
//
// 네이버 서치어드바이저는 sitemap 보다 RSS 를 먼저·빠르게 수집한다. 한국 골퍼가 네이버에서
// "태국 골프장" 을 찾는 경로는 구글 순위와 완전히 무관한 유입 채널인데, 그쪽에 우리 한국어
// 콘텐츠가 통째로 안 보이고 있었다. robots.txt 는 이미 Yeti/NaverBot 을 명시 허용하고
// public/naver*.html 소유확인 파일도 있으니, 남은 건 이 피드를 서치어드바이저에 등록하는 것.
//
// RSS 2.0 은 &apos; 를 모르므로 숫자 참조를 쓴다 (네이버 검증기가 거부한다).
function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// 한글은 UTF-8 로 그대로 두고, 검증기가 걸고 넘어지는 기호만 정규화한다.
function safe(s: string): string {
  return s
    .replace(/—/g, "-")
    .replace(/·/g, "-")
    .replace(/★/g, "*")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"');
}

function rfc822(d: string): string {
  const t = new Date(d);
  return isNaN(t.getTime()) ? new Date().toUTCString() : t.toUTCString();
}

export async function GET() {
  type Entry = { url: string; title: string; desc: string; date: string; cat: string };

  const entries: Entry[] = [
    ...POSTS_KO.map((p) => ({
      url: `${SITE}/ko/blog/${p.slug}`,
      title: p.title,
      desc: p.metaDescription,
      date: p.updated ?? p.published,
      cat: p.category,
    })),
    ...GUIDES_KO.map((g) => ({
      url: `${SITE}/ko/guide/${g.slug}`,
      title: g.title,
      desc: g.metaDescription,
      date: g.updated,
      cat: "가이드",
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const items = entries
    .map(
      (e) => `
    <item>
      <title>${escape(safe(e.title))}</title>
      <link>${e.url}</link>
      <guid isPermaLink="true">${e.url}</guid>
      <category>${escape(safe(e.cat))}</category>
      <description>${escape(safe(e.desc))}</description>
      <pubDate>${rfc822(e.date)}</pubDate>
    </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(BRAND)} - 태국 골프 가이드</title>
    <link>${SITE}/ko</link>
    <atom:link href="${SITE}/ko/feed.xml" rel="self" type="application/rss+xml" />
    <description>태국 골프장 정보, 그린피, 캐디 팁, 자유여행 가이드. 실제 구글 리뷰 분석 기반.</description>
    <language>ko-KR</language>
    <lastBuildDate>${entries[0] ? rfc822(entries[0].date) : new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
