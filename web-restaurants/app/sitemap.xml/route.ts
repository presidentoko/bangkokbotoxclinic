// /sitemap.xml 은 이제 **인덱스**다 — URL 목록이 아니라 사이트맵 파일 목록이다.
// 구글은 인덱스를 지원하고 이미 GSC 에 제출된 주소도 그대로다(robots.txt 도 이걸
// 가리킨다). 쪼갠 이유와 기준은 lib/sitemap.ts 주석에 있다.
import { loadMasterDb } from "@/lib/data";
import { sitemapFiles, sitemapIndexXml, SITEMAP_HEADERS } from "@/lib/sitemap";

export const dynamic = "force-static";

export async function GET() {
  const db = await loadMasterDb();
  const body = sitemapIndexXml(sitemapFiles(db), new Date(db.generated_at).toISOString());
  return new Response(body, { headers: SITEMAP_HEADERS });
}
