/**
 * lib/districts.ts 가 정규화한 district 슬러그의 legacy 별칭 표를 재생성한다.
 * 출력은 functions/_lib/aliases.ts 의 DISTRICT_ALIASES 블록.
 *
 * 왜 _redirects 가 아니라 여기인가
 * --------------------------------
 * 이 스크립트는 원래 public/_redirects 에 `/d/<변형> /d/<정규> 301` 줄을 직접
 * 써넣었다. 그런데 Cloudflare Pages 는 그 파일의 **앞 100개 규칙만** 적용한다.
 * 별칭이 그 선을 넘어가면서 아무 경고 없이 죽는 사고가 이미 한 번 났고(그때
 * /city/* 별칭 91개가 통째로 404 였다), 그래서 별칭 표를 Functions 쪽으로 옮기고
 * functions/{d,c,city,ko/city}/_middleware.ts 가 읽도록 바꿨다 — Functions 에는
 * 규칙 수 제한이 없다.
 *
 * 그런데 이 스크립트만 그 변경을 못 따라가서 계속 _redirects 에 써넣고 있었다.
 * 2026-08-09 auto_rebuild 실행 후 _redirects 는 다시 115 규칙이 됐다. 미들웨어가
 * 같은 별칭을 다 받아주고 있어서 겉으로 드러나진 않았지만, 앞으로 _redirects
 * 아래쪽에 추가되는 규칙은 무엇이든 조용히 죽는 상태였다.
 *
 * 병합 규칙: 기존 표의 항목은 지우지 않는다. 데이터가 줄어 특정 district 가
 * districtRedirects() 결과에서 빠져도, 반년 전에 색인된 URL 은 여전히 301 이
 * 필요하다. 새 항목만 더한다.
 *
 * Run:  npx tsx scripts/gen_redirects.mts   (scripts/rebuild_master_db.py 에서 호출)
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { districtRedirects } from "../lib/districts.ts";
import type { MasterDb } from "../lib/types.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ALIASES = path.join(ROOT, "functions", "_lib", "aliases.ts");
const REDIRECTS = path.join(ROOT, "public", "_redirects");
const START = "export const DISTRICT_ALIASES: Record<string, string> = {";
const END = "};";
// gen_redirects 예전 버전이 _redirects 에 남긴 블록
const OLD_START = "# >>> district-canonical (auto-generated — edit lib/districts.ts) >>>";
const OLD_END = "# <<< district-canonical <<<";

async function main() {
  const db: MasterDb = JSON.parse(
    await fs.readFile(path.join(ROOT, "data", "master_db.json"), "utf-8"),
  );
  const fresh = districtRedirects(db);

  const current = await fs.readFile(ALIASES, "utf-8");
  const startIdx = current.indexOf(START);
  if (startIdx === -1) throw new Error(`DISTRICT_ALIASES block not found in ${ALIASES}`);
  const bodyStart = startIdx + START.length;
  const endIdx = current.indexOf(`\n${END}`, bodyStart);
  if (endIdx === -1) throw new Error(`DISTRICT_ALIASES block not terminated in ${ALIASES}`);

  const merged = new Map<string, string>();
  for (const m of current.slice(bodyStart, endIdx).matchAll(/"([^"]+)":\s*"([^"]+)"/g)) {
    merged.set(m[1], m[2]);
  }
  const before = merged.size;
  for (const [from, to] of fresh) merged.set(from, to);

  const body = [...merged.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([from, to]) => `  ${JSON.stringify(from)}: ${JSON.stringify(to)},`)
    .join("\n");

  await fs.writeFile(ALIASES, current.slice(0, bodyStart) + "\n" + body + current.slice(endIdx));
  console.log(
    `gen_redirects: DISTRICT_ALIASES ${before} → ${merged.size} ` +
    `(districtRedirects produced ${fresh.size})`,
  );

  // 예전 블록이 _redirects 에 남아 있으면 걷어낸다 — 미들웨어와 중복이고
  // 100 규칙 예산만 먹는다.
  let red = await fs.readFile(REDIRECTS, "utf-8");
  const oldStart = red.indexOf(OLD_START);
  if (oldStart !== -1) {
    const oldEnd = red.indexOf(OLD_END);
    red = red.slice(0, oldStart) + (oldEnd !== -1 ? red.slice(oldEnd + OLD_END.length) : "");
    await fs.writeFile(REDIRECTS, red.replace(/\n{3,}/g, "\n\n").replace(/\s*$/, "") + "\n");
    const rules = red.split("\n").filter((l) => l.trim() && !l.startsWith("#")).length;
    console.log(`gen_redirects: removed legacy block from _redirects (${rules} rules left)`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
