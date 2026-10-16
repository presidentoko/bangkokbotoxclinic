import { NextResponse } from "next/server";
import { loadMasterDb } from "@/lib/data";
import { getSiteConfig, applySiteFilter, getSiteUrl } from "@/lib/site";

// /th/clinic/[id] 와 /ko/clinic/[id] 는 EN 라우트의 generateStaticParams 를
// 그대로 재export 해서 EN 과 완전히 같은 클리닉 집합을 prerender 한다 — 즉
// 이미 빌드돼서 라이브로 200 을 반환하고 있다. 그런데 사이트맵에는 /th 홈 1개,
// /ko 홈 1개만 올라가 있어서 나머지 수천 페이지는 헤더의 언어 전환기 링크
// 하나만으로 발견돼야 했다. 이 사이트의 상위 검색어가 전부 태국어인 걸 감안하면
// (คลินิกทำฟันใกล้ฉัน 302노출 등) 가장 큰 낭비였다 (2026-08-06 감사).
//
// hreflang 은 각 페이지가 이미 <link rel=alternate> 로 선언하고 있지만,
// 사이트맵에도 xhtml:link 로 같은 내용을 실어주면 구글이 언어 클러스터를
// 훨씬 빨리 인식한다.
export const dynamic = "force-static";
export const revalidate = 86400;

const SITE = getSiteUrl();

// XML 텍스트 노드에 그대로 들어가면 파서가 깨지는 문자들. 클리닉 id 는 hex
// 조합이라 현재는 해당 없지만, 데이터 형식이 바뀌었을 때 사이트맵 전체가
// 조용히 무효가 되는 걸 막는다.
function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const db = await loadMasterDb();
  const cfg = getSiteConfig();
  const updated = db.generated_at.slice(0, 10);
  const clinics = applySiteFilter(db.clinics, cfg);

  // /ko 는 넣지 않는다. app/ko/clinic/[id] 는 2026-08-06부터 상위 200곳만
  // prerender 하고 나머지는 404 이므로(ISR Writes 절감), 전량을 사이트맵에 올리면
  // 죽은 URL 을 제출하게 된다. 한국어는 원래도 색인 실적이 거의 없었고,
  // 이 사이트의 실제 기회는 태국어다.
  // 2026-09-15 에 비웠다 — 그때 /th·/ko 클리닉은 영어판 복제(본문 99% 동일)라
  // noindex + canonical→EN 이었고, 색인 안 할 URL 을 제출하면 크롤 예산만 샌다.
  //
  // 2026-10-15: /th 를 되돌린다. 현지화(커밋 3280f7d) 이후 복제가 아니다 —
  // 라이브 14쌍 실측으로 TH 전용 텍스트가 중앙값 57%, 태국어 글자 55%이고
  // 30% 미만인 쌍은 없었다. 그래서 /th/clinic 은 자기 자신을 canonical 로
  // 삼고 색인에 들어간다. 색인 대상이 된 URL 은 제출해야 한다. /ko 는 여전히
  // noindex 이고 상위 200곳만 prerender 되므로 넣지 않는다 — 같은 내보내기에서
  // 한국어 쿼리 1건·노출 2회였다.
  const LOCALES: { code: string; prefix: string; priority: string }[] = [
    { code: "th", prefix: "/th", priority: "0.8" },
  ];

  const urls: string[] = [];
  for (const loc of LOCALES) {
    for (const c of clinics) {
      const id = xmlEscape(c.url_slug ?? c.id);
      urls.push(
        `  <url>\n` +
          `    <loc>${SITE}${loc.prefix}/clinic/${id}</loc>\n` +
          `    <lastmod>${updated}</lastmod>\n` +
          `    <changefreq>weekly</changefreq>\n` +
          `    <priority>${loc.priority}</priority>\n` +
          // 코드는 페이지 <link rel=alternate> 와 같아야 한다(en/th). 2026-10-16 까지
          // 여기만 en-US/th-TH 여서 같은 URL 쌍에 두 벌의 클러스터를 선언하고 있었다.
          `    <xhtml:link rel="alternate" hreflang="en" href="${SITE}/clinic/${id}"/>\n` +
          `    <xhtml:link rel="alternate" hreflang="th" href="${SITE}/th/clinic/${id}"/>\n` +
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/clinic/${id}"/>\n` +
          `  </url>`,
      );
    }
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    `${urls.join("\n")}\n</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
