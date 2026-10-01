// 섹션별 사이트맵. 파일명이 그대로 경로 파라미터다 — /sitemap/core.xml 처럼.
// 폴더 이름에 리터럴과 동적 세그먼트를 섞을 수 없어서(sitemap-[file].xml 은 불가)
// ".xml" 을 파라미터 값에 포함시킨다.
import { notFound } from "next/navigation";
import { loadMasterDb } from "@/lib/data";
import {
  sitemapFiles,
  sitemapCities,
  coreItems,
  hubItems,
  restaurantItems,
  urlsetXml,
  SITEMAP_HEADERS,
  type Item,
} from "@/lib/sitemap";

export const dynamic = "force-static";
// 목록에 없는 파일명은 라우팅 단계에서 404 — 봇이 /sitemap/아무거나.xml 을 긁어
// 함수를 깨우지 못하게 한다 (app/restaurant/[id] 와 같은 이유).
export const dynamicParams = false;

export async function generateStaticParams() {
  const db = await loadMasterDb();
  return sitemapFiles(db).map((file) => ({ file }));
}

function xml(items: Item[]) {
  return new Response(urlsetXml(items), { headers: SITEMAP_HEADERS });
}

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const db = await loadMasterDb();

  if (file === "core.xml") return xml(await coreItems(db));
  if (file === "hubs.xml") return xml(hubItems(db));

  const city = file.match(/^restaurants-(.+)\.xml$/)?.[1];
  if (city && sitemapCities(db).includes(city)) return xml(restaurantItems(db, city));

  notFound();
}
